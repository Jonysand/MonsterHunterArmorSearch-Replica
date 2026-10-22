/**
 * 独立同步服务：`npm run sync`
 *
 * 开发时 Vite 已通过插件挂载同一套 /api，无需单独启动；
 * 该入口用于 `npm run preview` / 静态构建产物 / 独立调试。
 */
import { createServer } from "node:http";
import { handleApiRequest, notFound } from "./syncApi";

const port = Number(process.env.MHW_SYNC_PORT ?? 1421);
const host = "127.0.0.1";

const server = createServer((req, res) => {
  handleApiRequest(req, res)
    .then((handled) => {
      if (!handled) notFound(res);
    })
    .catch((error) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }));
    });
});

server.listen(port, host, () => {
  console.log(`[MH Wilds 护石同步] http://${host}:${port}`);
  console.log(`  GET /api/game/status`);
  console.log(`  GET /api/game/talismans`);
  console.log("只读存档，仅监听 127.0.0.1。按 Ctrl+C 退出。");
});

server.on("error", (error) => {
  console.error(`启动失败：${error.message}`);
  process.exitCode = 1;
});
