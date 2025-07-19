import type { Server } from "node:http";

export function setupGracefulShutdown(server: Server) {
  let shuttingDown = false;

  async function gracefulShutdown(signal: string) {
    if (shuttingDown) return;

    shuttingDown = true;

    console.log(`Received ${signal}. Shutting down gracefully...`);
    console.log("💤 Shutting down server...");

    try {
      // stop accepting new HTTP requests
      if (server && typeof server.close === "function") {
        await new Promise((res) => server.close(res));
      }
    } catch (err) {
      console.error("❌ Error during shutdown:", err);
    } finally {
      console.log("✅ Server shutdown completed.");
      process.exit(0);
    }
  }

  // Gracefull shutdown
  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGUSR1", gracefulShutdown);
  process.on("SIGUSR2", gracefulShutdown);

  // Error handling
  process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Rejection:", reason);
    process.exit(1);
  });
}
