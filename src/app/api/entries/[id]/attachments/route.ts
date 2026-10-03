/**
 * =============================================================================
 * GET  /api/entries/[id]/attachments — List all attachments for an entry
 * POST /api/entries/[id]/attachments — Confirm an upload (save metadata)
 * =============================================================================
 */

import { type NextRequest } from "next/server";
import { authenticate, isAuthError } from "@/lib/api/auth";
import { handleError } from "@/lib/api/errors";
import { AttachmentsService } from "@/lib/api/services/attachments.service";
import { confirmAttachmentSchema } from "@/lib/api/schemas";

const STORAGE_BUCKET = process.env["STORAGE_BUCKET"] || "attachments";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/entries/[id]/attachments
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const { id: entryId } = await params;
    const service = new AttachmentsService(auth.supabase);
    const attachments = await service.listByEntryId(entryId);

    return Response.json({ data: attachments });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/entries/[id]/attachments
 * Confirm a file upload by saving its metadata to the database.
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const { id: entryId } = await params;
    const body = await request.json();
    const parsed = confirmAttachmentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: { message: "Validation failed", issues: parsed.error.issues, statusCode: 400 } },
        { status: 400 }
      );
    }

    const service = new AttachmentsService(auth.supabase);
    const attachment = await service.create({
      entry_id: entryId,
      user_id: auth.user.id,
      bucket: STORAGE_BUCKET,
      ...parsed.data,
    });

    return Response.json({ data: attachment }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
