/**
 * =============================================================================
 * PATCH /api/entries/[id]/shelf — Move an entry to a different shelf
 * =============================================================================
 * When moving to "watched", the client can optionally include a review object
 * which will be upserted alongside the shelf change.
 */

import { type NextRequest } from "next/server";
import { authenticate, isAuthError } from "@/lib/api/auth";
import { handleError } from "@/lib/api/errors";
import { EntriesService } from "@/lib/api/services/entries.service";
import { moveToShelfSchema } from "@/lib/api/schemas";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const body = await request.json();
    const parsed = moveToShelfSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: { message: "Validation failed", issues: parsed.error.issues, statusCode: 400 } },
        { status: 400 }
      );
    }

    const service = new EntriesService(auth.supabase);
    const entry = await service.moveToShelf(
      id,
      auth.user.id,
      parsed.data.shelf,
      parsed.data.review
    );

    return Response.json({ data: entry });
  } catch (err) {
    return handleError(err);
  }
}
