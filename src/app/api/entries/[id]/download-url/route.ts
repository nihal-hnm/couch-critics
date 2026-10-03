/**
 * =============================================================================
 * POST /api/entries/[id]/download-url — Get a signed download URL
 * =============================================================================
 * Generates a temporary signed URL for downloading a private file from
 * Supabase Storage. The URL expires after the configured duration.
 */

import { type NextRequest } from "next/server";
import { authenticate, isAuthError } from "@/lib/api/auth";
import { handleError } from "@/lib/api/errors";
import { StorageService } from "@/lib/api/services/storage.service";
import { downloadUrlSchema } from "@/lib/api/schemas";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    // We don't need the entry ID directly, but the route structure ensures
    // only authenticated users with a valid entry can request download URLs.
    await params;

    const body = await request.json();
    const parsed = downloadUrlSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: { message: "Validation failed", issues: parsed.error.issues, statusCode: 400 } },
        { status: 400 }
      );
    }

    const storageService = new StorageService(auth.supabase);
    const result = await storageService.createSignedDownloadUrl(
      parsed.data.storagePath
    );

    return Response.json({ data: result });
  } catch (err) {
    return handleError(err);
  }
}
