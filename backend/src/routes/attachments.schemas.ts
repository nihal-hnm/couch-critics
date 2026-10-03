/**
 * =============================================================================
 * Zod Schemas for Attachment Validation
 * =============================================================================
 */

import { z } from "zod";

/**
 * POST /api/entries/:entryId/attachments — Confirm an upload
 * These fields describe the file that was uploaded to Supabase Storage.
 */
export const confirmAttachmentSchema = z.object({
  storage_path: z.string().min(1, "Storage path is required"),
  file_name: z.string().min(1, "File name is required").max(255),
  content_type: z.string().max(100).nullable().optional(),
  size_bytes: z.number().int().min(0).nullable().optional(),
});
