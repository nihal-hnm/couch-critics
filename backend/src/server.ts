/**
 * =============================================================================
 * Cinema Journal API — Server Entry Point
 * =============================================================================
 *
 * STARTUP ORDER:
 * ──────────────
 * 1. Load environment (env.ts validates all vars immediately)
 * 2. Create Express app with security/parsing middleware
 * 3. Mount auth middleware on /api (except health check)
 * 4. Mount API routes
 * 5. Mount error handler (MUST be last)
 * 6. Start listening
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import apiRouter from "./routes/index.js";

const app = express();

// ─── Security & Parsing Middleware ──────────────────────────────────────────

// Helmet: sets various security HTTP headers
app.use(helmet());

// CORS: allow requests from the Next.js frontend
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies (limit to 1MB to prevent abuse)
app.use(express.json({ limit: "1mb" }));

// Request logging (compact in production, verbose in development)
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── API Routes ─────────────────────────────────────────────────────────────

// Health check is OUTSIDE auth middleware (for load balancers, k8s probes)
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// All other /api routes require authentication
app.use("/api", authMiddleware, apiRouter);

// ─── Error Handling (MUST be registered last) ───────────────────────────────

app.use(errorHandler);

// ─── Start Server (local dev only — Vercel uses the default export) ─────────

if (!process.env["VERCEL"]) {
  app.listen(env.PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║   🎬  Cinema Journal API                            ║
  ║   Port:  ${String(env.PORT).padEnd(42)}║
  ║   Env:   ${env.NODE_ENV.padEnd(42)}║
  ║   CORS:  ${env.CORS_ORIGINS.join(", ").padEnd(42)}║
  ╚══════════════════════════════════════════════════════╝
    `);
  });
}

export default app;

