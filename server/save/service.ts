/**
 * 同步服务核心：发现存档 → 解密 → 解析护石 → 缓存。
 * 只读存档；同一份存档（路径+mtime+size）只解析一次。
 */
import { readFileSync, statSync } from "node:fs";
import type { GameSyncResult, GameSyncStatus, SyncedTalisman } from "../../src/lib/gameSyncTypes.ts";
import { decryptMhwildsSave } from "./mandarin.ts";
import { discoverSave, invalidateDiscovery, type SaveCandidate } from "./discovery.ts";
import { extractTalismans, type ExtractedTalismans } from "./talismans.ts";

interface ParsedSave {
  key: string;
  talismans: SyncedTalisman[];
  stats: ExtractedTalismans["stats"];
  decryptMs: number;
  extractMs: number;
}

interface LoadState {
  status: GameSyncStatus;
  talismans: SyncedTalisman[];
  error?: string;
}

let cache: (ParsedSave & { save: SaveCandidate; parsedAt: number }) | null = null;
let cacheError: { key: string; message: string; save: SaveCandidate; at: number } | null = null;
let inflight: Promise<LoadState> | null = null;

function saveKey(save: SaveCandidate): string {
  return `${save.filePath}|${save.mtimeMs}|${save.size}`;
}

function readStable(filePath: string): Buffer {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const before = statSync(filePath);
      const data = readFileSync(filePath);
      const after = statSync(filePath);
      // 游戏/Steam 可能正在写存档；大小或 mtime 变化时重读一次
      if (after.size === before.size && after.mtimeMs === before.mtimeMs) return data;
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  throw new Error("存档正在被写入，请稍后重试");
}

function baseStatus(save: SaveCandidate | null, gameRunning: boolean): GameSyncStatus {
  return {
    ok: true,
    gameRunning,
    saveFound: Boolean(save),
    characterFound: false,
    savePath: save?.filePath,
    saveMtimeMs: save?.mtimeMs,
    steamId: save ? save.steamId64.toString() : undefined,
    checkedAt: Date.now(),
  };
}

function parseCandidate(save: SaveCandidate): ParsedSave {
  const key = saveKey(save);
  const file = readStable(save.filePath);
  const decryptStarted = Date.now();
  const decrypted = decryptMhwildsSave(file, save.steamId64);
  const decryptMs = Date.now() - decryptStarted;
  const extractStarted = Date.now();
  const extracted = extractTalismans(decrypted.data);
  return {
    key,
    talismans: extracted.talismans,
    stats: extracted.stats,
    decryptMs,
    extractMs: Date.now() - extractStarted,
  };
}

async function loadState(force: boolean): Promise<LoadState> {
  if (inflight) return inflight;
  inflight = (async (): Promise<LoadState> => {
    if (force) invalidateDiscovery();
    const discovery = discoverSave();
    const save = discovery.save;
    if (!save) {
      const status = baseStatus(null, discovery.gameRunning);
      status.warnings = discovery.warnings;
      return { status, talismans: [] };
    }

    const key = saveKey(save);
    const otherSaves = discovery.otherSaves.map((candidate) => ({
      path: candidate.filePath,
      mtimeMs: candidate.mtimeMs,
    }));

    if (!force && cache && cache.key === key) {
      return {
        status: {
          ...baseStatus(save, discovery.gameRunning),
          ok: true,
          characterFound: cache.stats.nonEmptyTalismanCount > 0,
          talismanCount: cache.stats.talismanCount,
          nonEmptyTalismanCount: cache.stats.nonEmptyTalismanCount,
          parseMs: cache.decryptMs + cache.extractMs,
          otherSaves,
          warnings: cache.stats.warnings.slice(0, 8),
        },
        talismans: cache.talismans,
      };
    }

    // 同一份存档解析失败后不重复解密；用户点“立即同步”时才会强制重试
    if (!force && cacheError && cacheError.key === key) {
      const status: GameSyncStatus = {
        ...baseStatus(save, discovery.gameRunning),
        ok: false,
        error: cacheError.message,
        otherSaves,
        warnings: discovery.warnings,
      };
      return { status, talismans: [], error: cacheError.message };
    }

    try {
      const parsed = parseCandidate(save);
      const status: GameSyncStatus = {
        ...baseStatus(save, discovery.gameRunning),
        ok: true,
        characterFound: parsed.stats.nonEmptyTalismanCount > 0,
        talismanCount: parsed.stats.talismanCount,
        nonEmptyTalismanCount: parsed.stats.nonEmptyTalismanCount,
        parseMs: parsed.decryptMs + parsed.extractMs,
        otherSaves,
        warnings: parsed.stats.warnings.slice(0, 8),
      };
      cache = { ...parsed, save, parsedAt: Date.now() };
      cacheError = null;
      return { status, talismans: parsed.talismans };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      cacheError = { key, message, save, at: Date.now() };
      cache = null;
      const status: GameSyncStatus = {
        ...baseStatus(save, discovery.gameRunning),
        ok: false,
        error: message,
        otherSaves,
        warnings: discovery.warnings,
      };
      return { status, talismans: [], error: message };
    }
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}

/** UI 状态轮询入口（带缓存） */
export async function getGameSyncStatus(force = false): Promise<GameSyncStatus> {
  const state = await loadState(force);
  return state.status;
}

/** 同步按钮入口：返回完整护石列表 */
export async function getSyncedTalismans(force = false): Promise<GameSyncResult> {
  const state = await loadState(force);
  return {
    ok: state.status.ok,
    talismans: state.talismans,
    status: state.status,
    error: state.error,
  };
}

/** 当前缓存中的护石（不触发解析；测试/诊断用） */
export function peekCachedTalismans(): SyncedTalisman[] | null {
  return cache?.talismans ?? null;
}

/** 最近一次解析失败信息（诊断用） */
export function peekCacheError(): string | null {
  return cacheError?.message ?? null;
}
