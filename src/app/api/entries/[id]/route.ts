/**
 * =============================================================================
 * GET    /api/entries/[id]  — Get a single entry with review & attachments
 * PATCH  /api/entries/[id]  — Update an existing entry (partial update)
 * DELETE /api/entries/[id]  — Delete an entry and its associated files
 * =============================================================================
 */

import { type NextRequest } from "next/server";
import { authenticate, isAuthError } from "@/lib/api/auth";
import { handleError } from "@/lib/api/errors";
import { EntriesService } from "@/lib/api/services/entries.service";
import { StorageService } from "@/lib/api/services/storage.service";
import { updateEntrySchema } from "@/lib/api/schemas";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/entries/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const service = new EntriesService(auth.supabase);
    const entry = await service.getById(id);

    return Response.json({ data: entry });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PATCH /api/entries/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const body = await request.json();
    const parsed = updateEntrySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: { message: "Validation failed", issues: parsed.error.issues, statusCode: 400 } },
        { status: 400 }
      );
    }

    const service = new EntriesService(auth.supabase);
    const entry = await service.update(id, parsed.data);

    return Response.json({ data: entry });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * DELETE /api/entries/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;

    // Delete associated files from storage first
    const storageService = new StorageService(auth.supabase);
    await storageService.deleteEntryFiles(auth.user.id, id);

    // Then delete the database record (cascades to reviews & attachments)
    const entriesService = new EntriesService(auth.supabase);
    await entriesService.delete(id);

    return new Response(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
