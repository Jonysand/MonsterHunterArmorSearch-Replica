import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Gamepad2, Loader2, RefreshCw } from "lucide-react";
import { useSimulator } from "../store/simulator";
import type { GameSyncResult, GameSyncStatus } from "../lib/gameSyncTypes";

/** 生产静态部署时可用 VITE_SYNC_API=http://127.0.0.1:1421/api 指向 `npm run sync` */
const API_BASE = ((import.meta.env.VITE_SYNC_API as string | undefined) ?? "/api").replace(/\/$/, "");
const AUTO_KEY = "mhwilds-game-sync-auto-v1";
const LAST_KEY = "mhwilds-game-sync-last-v1";
const STATUS_POLL_MS = 8000;

interface SyncReport {
  at: number;
  /** EquipBox 中的护石总数（含空占位） */
  boxTotal?: number;
  /** 可导入的护石数 */
  total: number;
  added: number;
  duplicate: number;
  mtimeMs: number;
}

function readStoredReport(): SyncReport | null {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    return raw ? (JSON.parse(raw) as SyncReport) : null;
  } catch {
    return null;
  }
}

async function fetchJson<T>(url: string, timeoutMs = 30_000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

function formatTime(ms?: number): string {
  if (!ms) return "--";
  return new Date(ms).toLocaleString("zh-CN", { hour12: false });
}

/** 直接读取 Steam 角色存档并同步护石（只读，不需要游戏 mod） */
export default function GameSyncPanel() {
  const importCharms = useSimulator((s) => s.importCharms);

  const [status, setStatus] = useState<GameSyncStatus | null>(null);
  const [serverDown, setServerDown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [report, setReport] = useState<SyncReport | null>(readStoredReport);
  const [autoSync, setAutoSync] = useState(() => {
    try {
      return localStorage.getItem(AUTO_KEY) !== "0";
    } catch {
      return true;
    }
  });

  const busyRef = useRef(false);
  const lastSyncRef = useRef<SyncReport | null>(report);

  const refreshStatus = useCallback(async () => {
    try {
      const next = await fetchJson<GameSyncStatus>(`${API_BASE}/game/status`, 15_000);
      setStatus(next);
      setServerDown(false);
    } catch {
      setStatus(null);
      setServerDown(true);
    }
  }, []);

  const syncNow = useCallback(
    async (manual: boolean) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      setSyncError(null);
      try {
        const result = await fetchJson<GameSyncResult>(
          `${API_BASE}/game/talismans${manual ? "?refresh=1" : ""}`,
          45_000,
        );
        setStatus(result.status);
        setServerDown(false);
        if (!result.ok) {
          setSyncError(result.error ?? "同步失败");
          return;
        }
        const { added, duplicate } = importCharms(result.talismans, true);
        const nextReport: SyncReport = {
          at: Date.now(),
          boxTotal: result.status.talismanCount ?? result.talismans.length,
          total: result.talismans.length,
          added,
          duplicate,
          mtimeMs: result.status.saveMtimeMs ?? 0,
        };
        setReport(nextReport);
        lastSyncRef.current = nextReport;
        try {
          localStorage.setItem(LAST_KEY, JSON.stringify(nextReport));
        } catch {
          /* ignore */
        }
      } catch (error) {
        setSyncError(
          error instanceof Error && error.name === "AbortError"
            ? "同步超时，请稍后重试"
            : `无法连接同步服务：${error instanceof Error ? error.message : String(error)}`,
        );
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [importCharms],
  );

  // 状态轮询
  useEffect(() => {
    void refreshStatus();
    const timer = setInterval(() => void refreshStatus(), STATUS_POLL_MS);
    return () => clearInterval(timer);
  }, [refreshStatus]);

  // 存档变化时自动同步（同一 mtime 只导入一次）
  useEffect(() => {
    if (!autoSync || serverDown || busyRef.current) return;
    if (!status?.ok || !status.saveFound || !status.characterFound) return;
    const mtime = status.saveMtimeMs ?? 0;
    if (!mtime) return;
    const lastMtime = lastSyncRef.current?.mtimeMs ?? 0;
    if (mtime <= lastMtime) return;
    void syncNow(false);
  }, [autoSync, serverDown, status, syncNow]);

  const toggleAuto = (checked: boolean) => {
    setAutoSync(checked);
    try {
      localStorage.setItem(AUTO_KEY, checked ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const state = serverDown
    ? "offline"
    : !status
      ? "loading"
      : !status.ok
        ? "error"
        : !status.saveFound
          ? "nosave"
          : status.characterFound
            ? "ready"
            : "empty";

  const stateLabel =
    state === "offline"
      ? "同步服务未运行"
      : state === "loading"
        ? "正在检测存档…"
        : state === "error"
          ? "存档读取失败"
          : state === "nosave"
            ? "未找到游戏存档"
            : state === "ready"
              ? "已连接游戏存档"
              : "存档中未发现护石";

  const dotClass =
    state === "ready"
      ? "bg-emerald-400"
      : state === "offline" || state === "error"
        ? "bg-red-400"
        : state === "nosave" || state === "empty"
          ? "bg-amber-400"
          : "bg-neutral-500";

  return (
    <section className="card">
      <header>
        <span className="ttl">游戏数据同步</span>
        <span className="hd-note">直接读取 Steam 存档，无需 REFramework / Talisman Exporter</span>
      </header>
      <div className="pad flex flex-col gap-3">
        <div className="subbox flex flex-wrap items-center gap-x-4 gap-y-2 p-2.5">
          <span className="flex items-center gap-2 text-[12px] font-bold text-[color:var(--w-ink-2)]">
            <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
            {stateLabel}
          </span>
          {status?.gameRunning && (
            <span className="chip green">
              <Gamepad2 className="h-3 w-3" /> 游戏运行中
            </span>
          )}
          {state === "ready" && (
            <span className="text-[11.5px] text-[color:var(--w-ink-3)]">
              护石 {status?.talismanCount ?? 0} · 可导入 {status?.nonEmptyTalismanCount ?? 0}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button className="btn sm" onClick={() => void refreshStatus()} disabled={busy}>
              <RefreshCw className={busy ? "animate-spin" : undefined} /> 刷新状态
            </button>
            <button
              className="btn primary"
              onClick={() => void syncNow(true)}
              disabled={busy || serverDown || !status?.saveFound}
            >
              {busy ? <Loader2 className="animate-spin" /> : <RefreshCw />} 立即同步
            </button>
          </div>
        </div>

        {state === "ready" && status?.savePath && (
          <div className="flex flex-col gap-1 text-[11px] leading-relaxed text-[color:var(--w-ink-3)]">
            <div className="truncate" title={status.savePath}>
              存档：<code className="text-[color:var(--w-accent)]">{status.savePath}</code>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>修改时间：{formatTime(status.saveMtimeMs)}</span>
              <span>SteamID：{status.steamId}</span>
              <span>解析耗时：{status.parseMs ?? 0}ms</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <label className="flex cursor-pointer items-center gap-1.5 text-[11.5px] text-[color:var(--w-ink-3)]">
            <input type="checkbox" checked={autoSync} onChange={(e) => toggleAuto(e.target.checked)} />
            存档变化时自动同步
          </label>
          <span className="text-[10.5px] text-[color:var(--w-ink-4)]">
            只读：不会写入存档；同步服务仅监听 127.0.0.1
          </span>
        </div>

        {report && (
          <div className="subbox p-2.5 text-[11.5px] leading-relaxed">
            <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[color:var(--w-accent)]">
              {report.added > 0 ? `已同步 ${report.added} 个护石` : "护石已是最新"}
            </span>
            <span className="ml-2 text-[color:var(--w-ink-3)]">
              存档 {report.boxTotal ?? report.total} 个 · 可导入 {report.total} 个 · 跳过重复 {report.duplicate} 个 ·{" "}
              {formatTime(report.at)}
            </span>
          </div>
        )}

        {serverDown && (
          <div className="text-[11.5px] leading-relaxed text-[color:#e0b06d]">
            <AlertCircle className="mr-1 inline h-3.5 w-3.5" />
            同步服务未运行：用 <code className="text-[color:var(--w-accent)]">npm run dev</code> 启动（API 已随
            Vite 一起挂载）；若使用静态构建，请另跑{" "}
            <code className="text-[color:var(--w-accent)]">npm run sync</code> 并设置{" "}
            <code className="text-[color:var(--w-accent)]">VITE_SYNC_API=http://127.0.0.1:1421/api</code>。
          </div>
        )}

        {status?.error && !serverDown && (
          <div className="text-[11.5px] leading-relaxed text-[color:#e08a6d]">
            <AlertCircle className="mr-1 inline h-3.5 w-3.5" />
            {status.error}
          </div>
        )}

        {syncError && !status?.error && (
          <div className="text-[11.5px] leading-relaxed text-[color:#e08a6d]">
            <AlertCircle className="mr-1 inline h-3.5 w-3.5" />
            {syncError}
          </div>
        )}

        {status?.warnings && status.warnings.length > 0 && (
          <ul className="list-inside list-disc text-[11px] leading-relaxed text-[color:var(--w-ink-3)]">
            {status.warnings.slice(0, 4).map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
