import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { handleApiRequest } from "./server/syncApi.ts";

/**
 * 在 dev / preview 服务器上挂载护石同步 API（同一端口，无需额外进程）。
 * 生产静态部署时可改为 `npm run sync` 启动独立 1421 端口服务。
 */
function gameSyncApiPlugin(): Plugin {
  const install = (middlewares: {
    use: (
      path: string,
      handler: (
        req: import("node:http").IncomingMessage,
        res: import("node:http").ServerResponse,
        next: (error?: unknown) => void,
      ) => void,
    ) => void;
  }) => {
    middlewares.use("/api", (req, res, next) => {
      handleApiRequest(req, res)
        .then((handled) => {
          if (!handled) next();
        })
        .catch(next);
    });
  };

  return {
    name: "mhwilds-game-sync",
    configureServer(server) {
      install(server.middlewares);
    },
    configurePreviewServer(server) {
      install(server.middlewares);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), gameSyncApiPlugin()],
  server: {
    port: 1420,
    strictPort: true,
  },
});
