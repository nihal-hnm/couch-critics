/**
 * =============================================================================
 * Root Router
 * =============================================================================
 * Aggregates all route modules under /api. Add new resource routers here.
 */

import { Router } from "express";
import entriesRouter from "./entries.routes.js";

const router = Router();

// Mount resource routers
router.use("/entries", entriesRouter);

// Health check (unauthenticated — useful for load balancers, k8s probes)
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
