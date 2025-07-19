import { app } from "./server-common";
import { setupGracefulShutdown } from "./shutdown-server";

let PORT = Number.parseInt(process.env.PORT || "3000");

console.log("✨ Starting development server");

let viteDevServer = await import("vite").then((vite) =>
  vite.createServer({
    server: { middlewareMode: true },
  })
);

app.use(viteDevServer.middlewares);

app.use(async (req, res, next) => {
  try {
    let source = await viteDevServer.ssrLoadModule(
      new URL("./app.ssr.ts", import.meta.url).pathname
    );
    return await source.app(req, res, next);
  } catch (error) {
    if (typeof error === "object" && error instanceof Error) {
      viteDevServer.ssrFixStacktrace(error);
    }
    next(error);
  }
});

// Start the server
let server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Set up graceful shutdown handlers
setupGracefulShutdown(server);
