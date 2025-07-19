import compression from "compression";
import express from "express";

let app = express();

// Common middleware
app.use(compression());
app.disable("x-powered-by");

// Handle .well-known requests with 204 No Content temporarily for now.
app.get("/.well-known{*splat}", (_, res) => {
  res.status(204).end();
});

export { app };
