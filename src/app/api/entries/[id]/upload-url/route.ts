/**
 * =============================================================================
 * POST /api/entries/[id]/upload-url — Get a signed upload URL
 * =============================================================================
 * Generates a signed URL that lets the client upload a file directly to
 * Supabase Storage, bypassing the server for bandwidth.
 */

import { type NextRequest } from "next/server";
import { authenticate, isAuthError } from "@/lib/api/auth";
import { handleError } from "@/lib/api/errors";
import { StorageService } from "@/lib/api/services/storage.service";
import { uploadUrlSchema } from "@/lib/api/schemas";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const body = await request.json();
    const parsed = uploadUrlSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: { message: "Validation failed", issues: parsed.error.issues, statusCode: 400 } },
        { status: 400 }
      );
    }

    const storageService = new StorageService(auth.supabase);
    const result = await storageService.createSignedUploadUrl(
      auth.user.id,
      id,
      parsed.data.fileName
    );

    return Response.json({ data: result });
  } catch (err) {
    return handleError(err);
  }
}
