/**
 * 游戏存档同步 HTTP API。
 *
 * GET /api/game/status        → 服务/存档/游戏进程状态（带缓存）
 * GET /api/game/talismans     → 解密存档并返回护石列表（带缓存）
 * GET /api/health             → 健康检查
 *
 * 仅监听/服务本机请求；不提供任何写存档接口。
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { getGameSyncStatus, getSyncedTalismans } from "./save/service.ts";

const LOCAL_ORIGIN_RE = /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i;

function applyCors(req: IncomingMessage, res: ServerResponse): void {
  const origin = req.headers.origin;
  if (origin && LOCAL_ORIGIN_RE.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
  const text = JSON.stringify(body);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Length", Buffer.byteLength(text));
  res.end(text);
}

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }

  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  let pathname = url.pathname;
  if (pathname === "/api" || pathname.startsWith("/api/")) {
    pathname = pathname.slice(4) || "/";
  }
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;

  if (req.method !== "GET") {
    sendJson(res, 405, { ok: false, error: "仅支持 GET" });
    return true;
  }

  const force = url.searchParams.get("refresh") === "1";

  try {
    if (pathname === "/health") {
      sendJson(res, 200, { ok: true, service: "mhwilds-game-sync", now: Date.now() });
      return true;
    }
    if (pathname === "/status" || pathname === "/game/status") {
      sendJson(res, 200, await getGameSyncStatus(force));
      return true;
    }
    if (pathname === "/talismans" || pathname === "/game/talismans") {
      sendJson(res, 200, await getSyncedTalismans(force));
      return true;
    }
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
    return true;
  }

  return false;
}

/** 用于非 Vite 场景（standalone / 其他静态服务器） */
export function notFound(res: ServerResponse): void {
  sendJson(res, 404, {
    ok: false,
    error: "未知接口。可用：GET /api/health、/api/game/status、/api/game/talismans",
  });
}
