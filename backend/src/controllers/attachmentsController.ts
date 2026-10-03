/**
 * =============================================================================
 * Attachments Controller
 * =============================================================================
 * Handles HTTP request/response for attachment metadata endpoints.
 *
 * UPLOAD FLOW (recap from storageService.ts):
 * ───────────────────────────────────────────
 * 1. POST /api/entries/:id/upload-url   → get signed URL  (entriesController)
 * 2. Client uploads file to Supabase Storage via signed URL
 * 3. POST /api/entries/:entryId/attachments  → confirm + save metadata  ← HERE
 * 4. POST /api/entries/:id/download-url → get signed download URL  (entriesController)
 *
 * This controller handles step 3 (confirm) plus listing and deleting.
 */

import type { Request, Response, NextFunction } from "express";
import { AttachmentsService } from "../services/attachmentsService.js";
import { StorageService } from "../services/storageService.js";
import { env } from "../config/env.js";

/** Safely extract a route param as a string (Express 5 types params as string | string[]) */
function paramStr(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

/**
 * GET /api/entries/:entryId/attachments
 * List all attachments for an entry.
 */
export async function listAttachments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new AttachmentsService(req.supabase!);
    const attachments = await service.listByEntryId(
      paramStr(req.params["entryId"])
    );

    res.json({ data: attachments });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/entries/:entryId/attachments
 * Confirm a file upload by saving its metadata to the database.
 */
export async function confirmAttachment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new AttachmentsService(req.supabase!);
    const attachment = await service.create({
      entry_id: paramStr(req.params["entryId"]),
      user_id: req.user!.id,
      bucket: env.STORAGE_BUCKET,
      ...req.body,
    });

    res.status(201).json({ data: attachment });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/attachments/:id
 * Delete an attachment: removes the DB record AND the Storage file.
 */
export async function deleteAttachment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const attachmentsService = new AttachmentsService(req.supabase!);
    const storageService = new StorageService(req.supabase!);

    // Delete the DB record (returns the record so we can clean up Storage)
    const deleted = await attachmentsService.delete(
      paramStr(req.params["id"])
    );

    // Best-effort cleanup of the actual file in Storage
    try {
      await storageService.deleteFile(deleted.storage_path);
    } catch (storageErr) {
      console.error(
        `Warning: DB record deleted but Storage cleanup failed for ${deleted.storage_path}:`,
        storageErr
      );
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
