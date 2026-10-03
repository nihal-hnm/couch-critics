/**
 * =============================================================================
 * Attachments Router
 * =============================================================================
 * Routes for attachment metadata operations.
 *
 * Entry-scoped routes (nested under /api/entries/:entryId):
 *   GET  /api/entries/:entryId/attachments      — List attachments for an entry
 *   POST /api/entries/:entryId/attachments      — Confirm an upload
 *
 * Direct attachment routes (mounted at /api/attachments):
 *   DELETE /api/attachments/:id  — Delete an attachment (DB + Storage)
 */

import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { confirmAttachmentSchema } from "./attachments.schemas.js";
import {
  listAttachments,
  confirmAttachment,
  deleteAttachment,
} from "../controllers/attachmentsController.js";

// ── Entry-scoped attachment routes ──────────────────────────────────────────
// Mounted under /api/entries/:entryId/attachments by the root router

export const entryAttachmentsRouter = Router({ mergeParams: true });

entryAttachmentsRouter.get("/", listAttachments);
entryAttachmentsRouter.post(
  "/",
  validate(confirmAttachmentSchema),
  confirmAttachment
);

// ── Direct attachment routes ────────────────────────────────────────────────
// Mounted at /api/attachments by the root router

export const attachmentsRouter = Router();

attachmentsRouter.delete("/:id", deleteAttachment);
