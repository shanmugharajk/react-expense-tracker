import express from "express";
import morgan from "morgan";
import { join } from "path";

import { app } from "./server-common";
import { setupGracefulShutdown } from "./shutdown-server";

let ROOT_DIR = process.cwd();
let PORT = Number.parseInt(process.env.PORT || "3000");

console.log("✨ Starting production server");

app.use(
  "/assets",
  express.static(join(ROOT_DIR, "build/client/assets"), {
    immutable: true,
    maxAge: "1y",
  })
);

app.use(morgan("tiny"));

app.use(express.static(join(ROOT_DIR, "build/client"), { maxAge: "1h" }));

let BUILD_PATH = join(ROOT_DIR, "build/server/index.js");

app.use(await import(BUILD_PATH).then((mod) => mod.app));

// Start the server
let server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Set up graceful shutdown handlers
setupGracefulShutdown(server);
