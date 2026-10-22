/**
 * MH Wilds 角色存档读取（只读）。
 *
 * 存档为 Capcom RE Engine 的 DSSS 容器（flags = 0x18 = Deflate | Mandarin）。
 * 这里实现的是社区逆向得到的 Mandarin 解密流程，与 MandarinJuice / ree-save-editor
 * 针对 MH Wilds 的结果逐字节一致：
 *   - block 布局由 SplitMix64(seed=0x7A36955255266CED) 生成
 *   - Steam 平台 ParseVariant = 2，即参与解密的 user id 为 ~SteamID64
 *   - 每个 0x210 字节 slice 头经 SplitMix64 异或后，用其中的大整数导出 AES-128-OFB key/iv
 *
 * 注意：本模块只读取文件，不写入、不修改存档；不依赖游戏进程或任何 mod。
 */
import { createDecipheriv } from "node:crypto";
import { inflateRawSync } from "node:zlib";

const U64_MASK = (1n << 64n) - 1n;

/** MH Wilds 的 Mandarin 种子（与游戏 profile 中的 MandarinSeed 一致） */
export const MHWILDS_MANDARIN_SEED = 0x7A36955255266CEDn;
/** Steam 平台 MH Wilds 使用 ParseVariant 2：user id = ~SteamID64 */
export const MHWILDS_PARSE_VARIANT = 2;
/** Mandarin + Deflate */
export const MHWILDS_SAVE_FLAVOR = 0x18;
/** DSSS 数据区起始偏移（16 字节文件头之后） */
const DSSS_HEADER_SIZE = 0x10;
/** 每个 slice 的元数据尺寸 */
const SLICE_HEADER_SIZE = 0x210;
/** Mandarin 一块的最大数据长度（1..8 × 0x4000） */
const SLICE_SHIFT = 14;
/** 每个 slice 的 0x200 字节头里存 4 组 (8+8) 个 u64 */
const HEADER_DATA_BYTES = 0x200;
const KEY_COUNT = 4;

function u64(value: bigint): bigint {
  return value & U64_MASK;
}

/** base64 → 小端 u64 容器；与 C# `Convert.FromBase64String(...).FromBase64<ulong>()` 一致 */
function bigIntFromBase64(b64: string): bigint {
  const bytes = Buffer.from(b64, "base64");
  let value = 0n;
  for (let offset = 0; offset < bytes.length; offset += 8) {
    const limb = bytes.readBigUInt64LE(offset);
    value |= limb << BigInt(offset * 8);
  }
  return value;
}

const MODULUS = bigIntFromBase64("8ztvuXKgtyUV5Fw5GCnhgq2Km9wKZNNETXnIEKuGNxc=");

function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  let result = 1n;
  let b = base % modulus;
  let e = exponent;
  while (e > 0n) {
    if ((e & 1n) === 1n) result = (result * b) % modulus;
    b = (b * b) % modulus;
    e >>= 1n;
  }
  return result;
}

/** 读取 8 个 u64 小端容器（128 位以上） */
function readContainer(buf: Buffer, offset: number): bigint {
  let value = 0n;
  for (let i = 7; i >= 0; i--) {
    value = (value << 64n) | buf.readBigUInt64LE(offset + i * 8);
  }
  return value;
}

function splitmix64(state: bigint): bigint {
  let s = u64(state + 0x9E3779B97F4A7C15n);
  s = u64((s ^ (s >> 30n)) * 0xBF58476D1CE4E5B9n);
  s = u64((s ^ (s >> 27n)) * 0x94D049BB133111EBn);
  return u64(s ^ (s >> 31n));
}

/** 与 C# `CalculateSlicesQueue` 相同：返回每个 slice 的容量（1..8，单位 0x4000） */
function calculateSlicesQueue(
  initialState: bigint,
  dataLength: number,
): { capacities: number[]; state: bigint } {
  const laps = (dataLength >>> SLICE_SHIFT) + 1;
  let state = initialState;
  let remaining = dataLength;
  const capacities: number[] = [];
  for (let i = 0; i < laps; i++) {
    if (remaining > 0) {
      const capacity = Number(state & 7n) + 1;
      capacities.push(capacity);
      const sliceLength = capacity << SLICE_SHIFT;
      remaining = remaining >= sliceLength ? remaining - sliceLength : 0;
    }
    state = splitmix64(state);
  }
  return { capacities, state };
}

/** 从已解密的 slice 头导出 32 字节 AES-128-OFB key+iv（16 + 16） */
function deriveSliceKey(header: Buffer, userId: bigint): Buffer {
  if (header.length < HEADER_DATA_BYTES) throw new Error("slice 头长度不足");
  const key = Buffer.alloc(KEY_COUNT * 8);
  for (let i = 0; i < KEY_COUNT; i++) {
    const offset = i * 128;
    const base = readContainer(header, offset);
    const value = readContainer(header, offset + 64);
    const divisor = modPow(base, userId, MODULUS);
    if (divisor === 0n) throw new Error("Mandarin key 派生失败（除数为 0）");
    key.writeBigUInt64LE((value / divisor) & U64_MASK, i * 8);
  }
  return key;
}

export interface DecryptedSave {
  /** 解压后的自描述 RSZ 类流（即 `data001Slot.bin` 解密 + 解压后的内容） */
  data: Buffer;
  /** 解密得到的未压缩长度（Deflate 头中的 decompressed size） */
  decompressedSize: number;
  /** 解密耗时（毫秒） */
  decryptMs: number;
}

/**
 * 解密一份 MH Wilds DSSS 存档并解压，返回可解析的类流。
 * @param file 原始 `data001Slot.bin`（加密）
 * @param steamId64 存档所属账号的 SteamID64
 */
export function decryptMhwildsSave(file: Buffer, steamId64: bigint): DecryptedSave {
  const startedAt = Date.now();
  if (file.length < DSSS_HEADER_SIZE + 4) {
    throw new Error("存档文件过短，不是有效的 MH Wilds 存档");
  }
  const magic = file.toString("ascii", 0, 4);
  if (magic !== "DSSS") {
    throw new Error("不是有效的 MH Wilds 存档（缺少 DSSS 文件头）");
  }
  const version = file.readUInt32LE(4);
  if (version !== 2) {
    throw new Error(`不支持的存档版本：${version}`);
  }
  const flags = file.readUInt32LE(8);
  if ((flags & MHWILDS_SAVE_FLAVOR) !== MHWILDS_SAVE_FLAVOR) {
    throw new Error(`不支持的存档加密标志：0x${flags.toString(16)}（当前仅支持 Mandarin+Deflate）`);
  }

  const footerOffset = file.length - 12;
  const decryptedLenBig = file.readBigUInt64LE(footerOffset);
  if (decryptedLenBig > BigInt(512 * 1024 * 1024)) {
    throw new Error("存档解密长度异常，文件可能已损坏");
  }
  const decryptedLen = Number(decryptedLenBig);
  const encrypted = file.subarray(DSSS_HEADER_SIZE, footerOffset);

  const userId = u64(~steamId64);
  const queue = calculateSlicesQueue(MHWILDS_MANDARIN_SEED, decryptedLen);
  let state = u64(queue.state + userId);

  const output = Buffer.allocUnsafe(decryptedLen);
  let encryptedPos = 0;
  let outputPos = 0;
  let remaining = decryptedLen;
  let sliceIndex = 0;

  while (remaining > 0) {
    const capacity = queue.capacities[sliceIndex++];
    if (capacity === undefined) {
      throw new Error("存档解密失败：slice 数量与数据长度不匹配");
    }
    const dataLength = capacity << SLICE_SHIFT;
    const sliceLength = dataLength + SLICE_HEADER_SIZE;
    if (encryptedPos + sliceLength > encrypted.length) {
      throw new Error("存档解密失败：slice 超出文件范围");
    }

    // C# 实现会先为头部校验和推进 16 次 SplitMix64（校验值本身未参与解密）
    for (let i = 0; i < 16; i++) state = splitmix64(state);

    const header = Buffer.from(encrypted.subarray(encryptedPos, encryptedPos + SLICE_HEADER_SIZE));
    for (let i = 0; i < SLICE_HEADER_SIZE; i++) {
      state = splitmix64(state);
      header[i] ^= Number(state & 0xffn);
    }

    const key = deriveSliceKey(header, userId);
    const ciphertext = encrypted.subarray(
      encryptedPos + SLICE_HEADER_SIZE,
      encryptedPos + SLICE_HEADER_SIZE + dataLength,
    );
    const decipher = createDecipheriv("aes-128-ofb", key.subarray(0, 16), key.subarray(16, 32));
    decipher.setAutoPadding(false);
    const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const copyLength = Math.min(dataLength, remaining);
    plain.copy(output, outputPos, 0, copyLength);

    encryptedPos += sliceLength;
    outputPos += copyLength;
    remaining -= copyLength;
  }

  if (outputPos !== decryptedLen) {
    throw new Error("存档解密失败：输出长度不一致");
  }

  // Deflate 包装：u64(compressedSize+0x10), u32(1), u32(compressedSize), u64(decompressedSize), data
  if (output.length < 24) throw new Error("存档解密失败：Deflate 头缺失");
  const marker = output.readUInt32LE(8);
  const compressedSize = output.readUInt32LE(12);
  const decompressedSize = Number(output.readBigUInt64LE(16));
  if (marker !== 1 || compressedSize <= 0 || 24 + compressedSize > output.length) {
    throw new Error("存档解密失败：Deflate 头无效（SteamID 可能不匹配）");
  }

  let data: Buffer;
  try {
    data = inflateRawSync(output.subarray(24, 24 + compressedSize));
  } catch (error) {
    throw new Error(`存档解压失败：${error instanceof Error ? error.message : String(error)}`);
  }
  if (data.length !== decompressedSize) {
    throw new Error(`存档解压长度不一致（期望 ${decompressedSize}，实际 ${data.length}）`);
  }

  return { data, decompressedSize, decryptMs: Date.now() - startedAt };
}
