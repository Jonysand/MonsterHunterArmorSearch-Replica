/**
 * RE Engine 存档中的自描述 RSZ 类流解析器（只读）。
 *
 * 存档里每个对象写成 `Class { u32 numFields, u32 typeHash, Field[] }`，
 * 每个字段写成 `u32 fieldNameMurmur3, i32 type, value`。
 * 字段名哈希与 murmur3_32(name, 0xffffffff) 一致，因此无需游戏 RSZ 类型库，
 * 直接按字段名（如 `_EquipBox`、`FreeVal0`、`BowgunCustomizeId`）定位。
 */

export const RSZ_TYPE = {
  ARRAY: -1,
  UNKNOWN: 0,
  ENUM: 1,
  BOOL: 2,
  S8: 3,
  U8: 4,
  S16: 5,
  U16: 6,
  S32: 7,
  U32: 8,
  S64: 9,
  U64: 10,
  F32: 11,
  F64: 12,
  C8: 13,
  C16: 14,
  STRING: 15,
  STRUCT: 16,
  CLASS: 17,
} as const;

export const ARRAY_TYPE = {
  VALUE: 0,
  CLASS: 1,
} as const;

export interface RszClass {
  numFields: number;
  typeHash: number;
  fields: RszField[];
}

export interface RszField {
  hash: number;
  type: number;
  value: RszValue;
}

export type RszValue =
  | { kind: "number"; type: number; value: number | bigint | boolean }
  | { kind: "string"; value: string }
  | { kind: "class"; value: RszClass }
  | { kind: "array"; value: RszArray }
  | { kind: "struct"; size: number };

export interface RszArray {
  memberType: number;
  memberSize: number;
  length: number;
  arrayType: number;
  hashes?: number[];
  values: RszValue[];
}

export class RszParseError extends Error {}

/** MurmurHash3 x86 32-bit（RE Engine 的字段名哈希，seed = 0xffffffff） */
export function murmur3_32(input: string, seed = 0xffffffff): number {
  const bytes = Buffer.from(input, "utf8");
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  let h = seed >>> 0;
  const blocks = bytes.length >> 2;
  for (let i = 0; i < blocks; i++) {
    let k = bytes.readUInt32LE(i * 4);
    k = Math.imul(k, c1);
    k = (k << 15) | (k >>> 17);
    k = Math.imul(k, c2);
    h ^= k;
    h = (h << 13) | (h >>> 19);
    h = (Math.imul(h, 5) + 0xe6546b64) >>> 0;
  }
  let k = 0;
  const tail = blocks * 4;
  switch (bytes.length & 3) {
    case 3:
      k ^= bytes[tail + 2] << 16;
    // falls through
    case 2:
      k ^= bytes[tail + 1] << 8;
    // falls through
    case 1:
      k ^= bytes[tail];
      k = Math.imul(k, c1);
      k = (k << 15) | (k >>> 17);
      k = Math.imul(k, c2);
      h ^= k;
  }
  h ^= bytes.length;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

function alignUp(value: number, alignment: number): number {
  return (value + alignment - 1) & ~(alignment - 1);
}

/** 单次解析的最大字段数/数组长度，避免损坏文件导致内存爆炸 */
const MAX_FIELDS = 100_000;
const MAX_ARRAY_LENGTH = 200_000;
const MAX_DEPTH = 32;

export class RszReader {
  private readonly data: Buffer;
  pos: number;

  constructor(data: Buffer, start = 0) {
    this.data = data;
    this.pos = start;
  }

  private ensure(length: number): void {
    if (length < 0 || this.pos + length > this.data.length) {
      throw new RszParseError(`读取越界（pos=0x${this.pos.toString(16)}，需要 ${length} 字节）`);
    }
  }

  private align(alignment: number): void {
    if (alignment <= 1) return;
    this.pos = alignUp(this.pos, alignment);
  }

  private u8(): number {
    this.ensure(1);
    return this.data.readUInt8(this.pos++);
  }

  private i8(): number {
    this.ensure(1);
    const value = this.data.readInt8(this.pos);
    this.pos += 1;
    return value;
  }

  private u16(): number {
    this.ensure(2);
    const value = this.data.readUInt16LE(this.pos);
    this.pos += 2;
    return value;
  }

  private i16(): number {
    this.ensure(2);
    const value = this.data.readInt16LE(this.pos);
    this.pos += 2;
    return value;
  }

  private u32(): number {
    this.ensure(4);
    const value = this.data.readUInt32LE(this.pos);
    this.pos += 4;
    return value;
  }

  private i32(): number {
    this.ensure(4);
    const value = this.data.readInt32LE(this.pos);
    this.pos += 4;
    return value;
  }

  private u64(): bigint {
    this.ensure(8);
    const value = this.data.readBigUInt64LE(this.pos);
    this.pos += 8;
    return value;
  }

  private i64(): bigint {
    this.ensure(8);
    const value = this.data.readBigInt64LE(this.pos);
    this.pos += 8;
    return value;
  }

  private f32(): number {
    this.ensure(4);
    const value = this.data.readFloatLE(this.pos);
    this.pos += 4;
    return value;
  }

  private f64(): number {
    this.ensure(8);
    const value = this.data.readDoubleLE(this.pos);
    this.pos += 8;
    return value;
  }

  private readString(): string {
    this.align(4);
    const length = this.u32();
    if (length > 1_000_000) throw new RszParseError(`字符串长度异常：${length}`);
    this.ensure(length * 2);
    const value = this.data.toString("utf16le", this.pos, this.pos + length * 2);
    this.pos += length * 2;
    return value;
  }

  private readScalar(type: number, size: number): number | bigint | boolean {
    switch (type) {
      case RSZ_TYPE.ENUM:
        if (size === 1) return this.i8();
        if (size === 2) return this.i16();
        if (size === 4) return this.i32();
        if (size === 8) return this.i64();
        throw new RszParseError(`枚举尺寸异常：${size}`);
      case RSZ_TYPE.BOOL:
        return this.u8() !== 0;
      case RSZ_TYPE.S8:
        return this.i8();
      case RSZ_TYPE.U8:
      case RSZ_TYPE.C8:
        return this.u8();
      case RSZ_TYPE.S16:
        return this.i16();
      case RSZ_TYPE.U16:
      case RSZ_TYPE.C16:
        return this.u16();
      case RSZ_TYPE.S32:
        return this.i32();
      case RSZ_TYPE.U32:
        return this.u32();
      case RSZ_TYPE.S64:
        return this.i64();
      case RSZ_TYPE.U64:
        return this.u64();
      case RSZ_TYPE.F32:
        return this.f32();
      case RSZ_TYPE.F64:
        return this.f64();
      default:
        throw new RszParseError(`未知字段类型：${type}`);
    }
  }

  private readField(depth: number): RszField {
    const hash = this.u32();
    const type = this.i32();

    if (type === RSZ_TYPE.STRING) {
      const value = this.readString();
      this.align(4);
      return { hash, type, value: { kind: "string", value } };
    }
    if (type === RSZ_TYPE.CLASS) {
      return { hash, type, value: { kind: "class", value: this.readClass(depth + 1) } };
    }
    if (type === RSZ_TYPE.ARRAY) {
      return { hash, type, value: { kind: "array", value: this.readArray(depth + 1) } };
    }

    this.align(4);
    const size = this.u32();
    if (size === 0) throw new RszParseError("字段尺寸为 0");

    if (type === RSZ_TYPE.STRUCT) {
      // read_sized 会按 size 对齐（存档中的 struct 尺寸均为 2 的幂）
      if (size !== 1 && (size & (size - 1)) === 0 && size <= 4096) this.align(size);
      this.ensure(size);
      const value: RszValue = { kind: "struct", size };
      this.pos += size;
      this.align(4);
      return { hash, type, value };
    }

    if (size !== 1) this.align(size);
    const value = this.readScalar(type, size);
    this.align(4);
    return { hash, type, value: { kind: "number", type, value } };
  }

  readClass(depth = 0): RszClass {
    if (depth > MAX_DEPTH) throw new RszParseError("类嵌套过深");
    const numFields = this.u32();
    if (numFields > MAX_FIELDS) throw new RszParseError(`字段数异常：${numFields}`);
    const typeHash = this.u32();
    const fields: RszField[] = [];
    for (let i = 0; i < numFields; i++) {
      fields.push(this.readField(depth));
    }
    return { numFields, typeHash, fields };
  }

  /** 从当前位置读取 `u32 fieldHash, i32 type, Array`，用于定位已知字段 */
  readArrayField(expectedHash: number): RszArray {
    const hash = this.u32();
    const type = this.i32();
    if (hash !== expectedHash) throw new RszParseError("字段哈希不匹配");
    if (type !== RSZ_TYPE.ARRAY) throw new RszParseError("字段不是数组");
    return this.readArray();
  }

  readArray(depth = 0): RszArray {
    if (depth > MAX_DEPTH) throw new RszParseError("数组嵌套过深");
    this.align(4);
    const memberType = this.i32();
    const memberSize = this.u32();
    const length = this.u32();
    const arrayType = this.i32();
    if (length > MAX_ARRAY_LENGTH) throw new RszParseError(`数组长度异常：${length}`);

    let hashes: number[] | undefined;
    if (arrayType === ARRAY_TYPE.CLASS) {
      const marker = this.u32();
      if (marker === 0xffeeffee) {
        hashes = [];
        for (let i = 0; i < length; i++) hashes.push(this.u32());
      } else {
        this.pos -= 4;
      }
    }

    const values: RszValue[] = [];
    for (let i = 0; i < length; i++) {
      if (arrayType === ARRAY_TYPE.CLASS) {
        values.push({ kind: "class", value: this.readClass(depth + 1) });
      } else if (memberType === RSZ_TYPE.STRING) {
        values.push({ kind: "string", value: this.readString() });
      } else {
        if (memberSize !== 1) this.align(memberSize);
        values.push({
          kind: "number",
          type: memberType,
          value: this.readScalar(memberType, memberSize),
        });
      }
    }
    this.align(4);
    return { memberType, memberSize, length, arrayType, hashes, values };
  }
}

/** 读取存档中位于 `offset` 的 `_EquipBox` 数组字段（offset 指向字段名哈希） */
export function readArrayFieldAt(data: Buffer, offset: number, expectedHash: number): RszArray {
  return new RszReader(data, offset).readArrayField(expectedHash);
}

export function getField(cls: RszClass, hash: number): RszField | undefined {
  return cls.fields.find((field) => field.hash === hash);
}

export function getNumberField(cls: RszClass, hash: number): number | null {
  const field = getField(cls, hash);
  if (!field || field.value.kind !== "number") return null;
  const value = field.value.value;
  return typeof value === "number" ? value : typeof value === "bigint" ? Number(value) : value ? 1 : 0;
}

export function getArrayField(cls: RszClass, hash: number): RszArray | null {
  const field = getField(cls, hash);
  if (!field || field.value.kind !== "array") return null;
  return field.value.value;
}
