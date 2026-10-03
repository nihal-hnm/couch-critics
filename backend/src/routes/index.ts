/**
 * =============================================================================
 * Root Router
 * =============================================================================
 * Aggregates all route modules under /api. Add new resource routers here.
 *
 * ROUTE STRUCTURE:
 * ────────────────
 * /api/health                              — Health check (no auth)
 * /api/profile                             — User profile (GET, PATCH)
 * /api/entries                             — Journal entries CRUD
 * /api/entries/:entryId/review             — Reviews scoped to an entry
 * /api/entries/:entryId/attachments        — Attachments scoped to an entry
 * /api/reviews                             — Direct review operations by ID
 * /api/attachments                         — Direct attachment operations by ID
 */

import { Router } from "express";
import entriesRouter from "./entries.routes.js";
import profilesRouter from "./profiles.routes.js";
import { entryReviewRouter, reviewsRouter } from "./reviews.routes.js";
import {
  entryAttachmentsRouter,
  attachmentsRouter,
} from "./attachments.routes.js";

const router = Router();

// ── Resource Routers ────────────────────────────────────────────────────────

router.use("/profile", profilesRouter);
router.use("/entries", entriesRouter);
router.use("/reviews", reviewsRouter);
router.use("/attachments", attachmentsRouter);

// ── Nested Routes (entry-scoped) ────────────────────────────────────────────
// These use mergeParams: true to access :entryId from the parent route

router.use("/entries/:entryId/review", entryReviewRouter);
router.use("/entries/:entryId/attachments", entryAttachmentsRouter);

// ── Health Check (unauthenticated) ──────────────────────────────────────────

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
