/**
 * =============================================================================
 * Entries Controller
 * =============================================================================
 * Handles HTTP request/response for journal entry endpoints.
 *
 * NOTE ON Express 5:
 * Express 5 types req.params values as `string | string[]`. We use a helper
 * function to safely extract the string value.
 * Delegates all data access to EntriesService and StorageService.
 *
 * PATTERN: Each handler instantiates services with the request-scoped
 * Supabase client. This ensures every database call is authorized by RLS
 * for the current user.
 */

import type { Request, Response, NextFunction } from "express";
import { EntriesService } from "../services/entriesService.js";
import { StorageService } from "../services/storageService.js";
import { AppError } from "../types/errors.js";

/** Safely extract a route param as a string (Express 5 types params as string | string[]) */
function paramStr(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

/**
 * GET /api/entries?shelf=watching
 * List all entries, optionally filtered by shelf.
 */
export async function listEntries(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new EntriesService(req.supabase!);
    const shelf = req.query["shelf"] as string | undefined;
    const entries = await service.list(shelf);

    res.json({ data: entries });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/entries/:id
 * Get a single entry with its review and attachments.
 */
export async function getEntry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new EntriesService(req.supabase!);
    const entry = await service.getById(paramStr(req.params["id"]));

    res.json({ data: entry });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/entries
 * Create a new journal entry.
 */
export async function createEntry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new EntriesService(req.supabase!);
    const entry = await service.create(req.user!.id, req.body);

    res.status(201).json({ data: entry });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/entries/:id
 * Update an existing entry (partial update).
 */
export async function updateEntry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new EntriesService(req.supabase!);
    const entry = await service.update(paramStr(req.params["id"]), req.body);

    res.json({ data: entry });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/entries/:id
 * Delete an entry and its associated files.
 */
export async function deleteEntry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const entryId = paramStr(req.params["id"]);
    const userId = req.user!.id;

    // Delete associated files from storage first
    const storageService = new StorageService(req.supabase!);
    await storageService.deleteEntryFiles(userId, entryId);

    // Then delete the database record (cascades to reviews & attachments)
    const entriesService = new EntriesService(req.supabase!);
    await entriesService.delete(entryId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/entries/:id/shelf
 * Move an entry to a different shelf, with optional review for "watched".
 */
export async function moveEntryToShelf(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new EntriesService(req.supabase!);
    const entryId = paramStr(req.params["id"]);
    const { shelf, review } = req.body;

    const entry = await service.moveToShelf(
      entryId,
      req.user!.id,
      shelf,
      review
    );

    res.json({ data: entry });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/entries/:id/upload-url
 * Generate a signed upload URL for attaching a file to an entry.
 */
export async function getUploadUrl(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const entryId = paramStr(req.params["id"]);
    if (!entryId) {
      throw AppError.badRequest("Entry ID is required");
    }

    const storageService = new StorageService(req.supabase!);
    const result = await storageService.createSignedUploadUrl(
      req.user!.id,
      entryId,
      req.body.fileName
    );

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/entries/:id/download-url
 * Generate a signed download URL for a private file.
 */
export async function getDownloadUrl(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const storageService = new StorageService(req.supabase!);
    const result = await storageService.createSignedDownloadUrl(
      req.body.storagePath
    );

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}
