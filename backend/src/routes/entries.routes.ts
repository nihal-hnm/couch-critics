/**
 * =============================================================================
 * Entries Router
 * =============================================================================
 * Defines all routes for the /api/entries resource.
 * Each route applies validation middleware before reaching the controller.
 */

import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import {
  createEntrySchema,
  updateEntrySchema,
  moveToShelfSchema,
  uploadUrlSchema,
  downloadUrlSchema,
  listEntriesQuerySchema,
} from "./entries.schemas.js";
import {
  listEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
  moveEntryToShelf,
  getUploadUrl,
  getDownloadUrl,
} from "../controllers/entriesController.js";

const router = Router();

// ── CRUD ─────────────────────────────────────────────────────────────────────

router.get("/", validate(listEntriesQuerySchema, "query"), listEntries);
router.get("/:id", getEntry);
router.post("/", validate(createEntrySchema), createEntry);
router.patch("/:id", validate(updateEntrySchema), updateEntry);
router.delete("/:id", deleteEntry);

// ── Shelf Transitions ───────────────────────────────────────────────────────

router.patch("/:id/shelf", validate(moveToShelfSchema), moveEntryToShelf);

// ── File Storage ────────────────────────────────────────────────────────────

router.post("/:id/upload-url", validate(uploadUrlSchema), getUploadUrl);
router.post("/:id/download-url", validate(downloadUrlSchema), getDownloadUrl);

export default router;
