/**
 * =============================================================================
 * Reviews Router
 * =============================================================================
 * Routes for standalone review operations.
 *
 * Entry-scoped routes (nested under /api/entries/:entryId):
 *   GET  /api/entries/:entryId/review    — Get the review for an entry
 *   PUT  /api/entries/:entryId/review    — Create or update a review
 *
 * Direct review routes (mounted at /api/reviews):
 *   PATCH  /api/reviews/:id  — Update a review by ID
 *   DELETE /api/reviews/:id  — Delete a review by ID
 */

import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { upsertReviewSchema, updateReviewSchema } from "./reviews.schemas.js";
import {
  getReview,
  upsertReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewsController.js";

// ── Entry-scoped review routes ──────────────────────────────────────────────
// These are mounted under /api/entries/:entryId/review by the root router

export const entryReviewRouter = Router({ mergeParams: true });

entryReviewRouter.get("/", getReview);
entryReviewRouter.put("/", validate(upsertReviewSchema), upsertReview);

// ── Direct review routes ────────────────────────────────────────────────────
// These are mounted at /api/reviews by the root router

export const reviewsRouter = Router();

reviewsRouter.patch("/:id", validate(updateReviewSchema), updateReview);
reviewsRouter.delete("/:id", deleteReview);
