/**
 * =============================================================================
 * DELETE /api/attachments/[id] — Delete an attachment
 * =============================================================================
 * Removes the database record AND the actual file in Supabase Storage.
 * Storage cleanup is best-effort — if it fails, we log but don't error.
 */

import { type NextRequest } from "next/server";
import { authenticate, isAuthError } from "@/lib/api/auth";
import { handleError } from "@/lib/api/errors";
import { AttachmentsService } from "@/lib/api/services/attachments.service";
import { StorageService } from "@/lib/api/services/storage.service";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;

    const attachmentsService = new AttachmentsService(auth.supabase);
    const storageService = new StorageService(auth.supabase);

    // Delete the DB record (returns the record so we can clean up Storage)
    const deleted = await attachmentsService.delete(id);

    // Best-effort cleanup of the actual file in Storage
    try {
      await storageService.deleteFile(deleted.storage_path);
    } catch (storageErr) {
      console.error(
        `Warning: DB record deleted but Storage cleanup failed for ${deleted.storage_path}:`,
        storageErr
      );
    }

    return new Response(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
