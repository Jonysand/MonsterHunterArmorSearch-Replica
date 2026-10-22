/**
 * 自动发现 MH Wilds 的 Steam 角色存档。
 *
 * 存档位置：`<Steam>/userdata/<accountId>/2246340/remote/win64_save/data00XSlot.bin`
 * 其中 `<accountId>` 是 SteamID32；SteamID64 = 76561197960265728 + accountId。
 * 不修改任何文件，只读取 `data00XSlot.bin` 中最新的一份。
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const MHWILDS_APP_ID = "2246340";
const STEAM_ID64_BASE = 76561197960265728n;
const SLOT_FILE_RE = /^data\d+Slot\.bin$/i;

export interface SaveCandidate {
  filePath: string;
  accountId: string;
  steamId64: bigint;
  mtimeMs: number;
  size: number;
}

export interface SaveDiscovery {
  gameRunning: boolean;
  save: SaveCandidate | null;
  otherSaves: SaveCandidate[];
  /** 所有已发现的 Steam 根目录（诊断用） */
  steamRoots: string[];
  warnings: string[];
}

let rootsCache: { at: number; roots: string[] } | null = null;
let gameRunningCache: { at: number; running: boolean } | null = null;

function uniquePaths(paths: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of paths) {
    if (!raw) continue;
    const normalized = path.normalize(raw.trim().replace(/^"|"$/g, ""));
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
}

function queryRegistryValue(key: string, value: string): string | null {
  if (process.platform !== "win32") return null;
  try {
    const output = execFileSync("reg.exe", ["query", key, "/v", value], {
      encoding: "utf8",
      windowsHide: true,
      timeout: 4000,
    });
    const match = output.match(new RegExp(`${value}\\s+REG_(?:SZ|EXPAND_SZ)\\s+(.+)`, "i"));
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

function libraryPathsFromVdf(steamRoot: string): string[] {
  const vdf = path.join(steamRoot, "steamapps", "libraryfolders.vdf");
  if (!existsSync(vdf)) return [];
  try {
    const text = readFileSync(vdf, "utf8");
    const paths: string[] = [];
    for (const match of text.matchAll(/"path"\s+"([^"]+)"/g)) {
      paths.push(match[1].replace(/\\\\/g, "\\"));
    }
    return paths;
  } catch {
    return [];
  }
}

/** 返回所有可能的 Steam 根目录（含库目录，用于 userdata 查找） */
export function findSteamRoots(): string[] {
  if (rootsCache && Date.now() - rootsCache.at < 30_000) return rootsCache.roots;

  const candidates: string[] = [];
  if (process.env.MHW_STEAM_ROOT) candidates.push(process.env.MHW_STEAM_ROOT);

  const fromRegistry = [
    queryRegistryValue("HKCU\\Software\\Valve\\Steam", "SteamPath"),
    queryRegistryValue("HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam", "InstallPath"),
    queryRegistryValue("HKLM\\SOFTWARE\\Valve\\Steam", "InstallPath"),
  ];
  for (const value of fromRegistry) if (value) candidates.push(value);

  const programFilesX86 = process.env["ProgramFiles(x86)"];
  const programFiles = process.env.ProgramFiles;
  if (programFilesX86) candidates.push(path.join(programFilesX86, "Steam"));
  if (programFiles) candidates.push(path.join(programFiles, "Steam"));
  for (const drive of ["C", "D", "E", "F", "G"]) {
    candidates.push(`${drive}:\\Steam`);
    candidates.push(`${drive}:\\Program Files (x86)\\Steam`);
  }

  const existing = uniquePaths(candidates).filter((root) => existsSync(root));
  const withLibraries: string[] = [];
  for (const root of existing) {
    withLibraries.push(root);
    withLibraries.push(...libraryPathsFromVdf(root));
  }
  const roots = uniquePaths(withLibraries).filter((root) => existsSync(root));
  rootsCache = { at: Date.now(), roots };
  return roots;
}

function candidatesInRoot(root: string): SaveCandidate[] {
  const userdata = path.join(root, "userdata");
  if (!existsSync(userdata)) return [];
  const result: SaveCandidate[] = [];
  let accountDirs: string[] = [];
  try {
    accountDirs = readdirSync(userdata);
  } catch {
    return [];
  }
  for (const accountId of accountDirs) {
    if (!/^\d+$/.test(accountId)) continue;
    const saveDir = path.join(userdata, accountId, MHWILDS_APP_ID, "remote", "win64_save");
    if (!existsSync(saveDir)) continue;
    let files: string[] = [];
    try {
      files = readdirSync(saveDir);
    } catch {
      continue;
    }
    for (const fileName of files) {
      if (!SLOT_FILE_RE.test(fileName)) continue;
      const filePath = path.join(saveDir, fileName);
      try {
        const stat = statSync(filePath);
        if (!stat.isFile() || stat.size < 1024) continue;
        result.push({
          filePath,
          accountId,
          steamId64: STEAM_ID64_BASE + BigInt(accountId),
          mtimeMs: stat.mtimeMs,
          size: stat.size,
        });
      } catch {
        // 文件可能正被 Steam 占用，下一次轮询再试
      }
    }
  }
  return result;
}

/** 解析用户提供的 SteamID（支持 SteamID64 或 accountId） */
export function parseSteamId64(input: string): bigint {
  const trimmed = input.trim();
  if (!/^\d+$/.test(trimmed)) throw new Error(`SteamID 无效：${input}`);
  const value = BigInt(trimmed);
  if (value <= 0n) throw new Error(`SteamID 无效：${input}`);
  return value < 0x100000000n ? STEAM_ID64_BASE + value : value;
}

function candidateFromEnv(): SaveCandidate[] {
  const configured = process.env.MHW_SAVE_PATH;
  if (!configured) return [];
  const resolved = path.resolve(configured);
  if (!existsSync(resolved)) return [];
  const stat = statSync(resolved);
  const paths: string[] = [];
  if (stat.isFile()) {
    paths.push(resolved);
  } else if (stat.isDirectory()) {
    const nested = path.join(resolved, "win64_save");
    const dirs = [resolved, nested].filter((dir) => existsSync(dir));
    for (const dir of dirs) {
      for (const fileName of readdirSync(dir)) {
        if (SLOT_FILE_RE.test(fileName)) paths.push(path.join(dir, fileName));
      }
      if (paths.length > 0) break;
    }
  }

  const result: SaveCandidate[] = [];
  for (const filePath of paths) {
    const fileStat = statSync(filePath);
    const accountMatch = filePath.match(/[\\/]userdata[\\/](\d+)[\\/]/i);
    const accountId = accountMatch?.[1] ?? "";
    let steamId64: bigint;
    try {
      steamId64 = process.env.MHW_STEAM_ID
        ? parseSteamId64(process.env.MHW_STEAM_ID)
        : accountId
          ? STEAM_ID64_BASE + BigInt(accountId)
          : 0n;
    } catch {
      steamId64 = 0n;
    }
    if (steamId64 === 0n) continue;
    result.push({
      filePath,
      accountId,
      steamId64,
      mtimeMs: fileStat.mtimeMs,
      size: fileStat.size,
    });
  }
  return result;
}

/** 检测游戏进程是否在运行（Windows） */
export function isGameRunning(): boolean {
  if (process.platform !== "win32") return false;
  if (gameRunningCache && Date.now() - gameRunningCache.at < 2000) {
    return gameRunningCache.running;
  }
  let running = false;
  try {
    const output = execFileSync(
      "tasklist.exe",
      ["/FI", "IMAGENAME eq MonsterHunterWilds.exe", "/NH"],
      { encoding: "utf8", windowsHide: true, timeout: 4000 },
    );
    running = /MonsterHunterWilds\.exe/i.test(output);
  } catch {
    running = false;
  }
  gameRunningCache = { at: Date.now(), running };
  return running;
}

/** 发现存档；若同一账号有多个角色槽，取修改时间最新的一份 */
export function discoverSave(): SaveDiscovery {
  const warnings: string[] = [];
  const roots = findSteamRoots();
  const candidates: SaveCandidate[] = [];
  for (const root of roots) candidates.push(...candidatesInRoot(root));
  try {
    candidates.push(...candidateFromEnv());
  } catch (error) {
    warnings.push(
      `读取 MHW_SAVE_PATH 失败：${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const seen = new Set<string>();
  const unique = candidates.filter((candidate) => {
    const key = candidate.filePath.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // MHW_STEAM_ID 可覆盖自动推导的账号（例如转移过的存档）
  if (process.env.MHW_STEAM_ID) {
    try {
      const override = parseSteamId64(process.env.MHW_STEAM_ID);
      for (const candidate of unique) candidate.steamId64 = override;
    } catch (error) {
      warnings.push(error instanceof Error ? error.message : String(error));
    }
  }

  unique.sort((a, b) => b.mtimeMs - a.mtimeMs);

  if (unique.length === 0) {
    warnings.push(
      "未找到 MH Wilds 存档。请确认游戏至少保存过一次，或设置环境变量 MHW_SAVE_PATH 指向 data001Slot.bin。",
    );
  }
  return {
    gameRunning: isGameRunning(),
    save: unique[0] ?? null,
    otherSaves: unique.slice(1, 6),
    steamRoots: roots,
    warnings,
  };
}

/** 清除发现缓存（UI “重新检测”用） */
export function invalidateDiscovery(): void {
  rootsCache = null;
  gameRunningCache = null;
}
