/**
 * =============================================================================
 * GET   /api/profiles/me — Get the current user's profile
 * PATCH /api/profiles/me — Update the current user's profile
 * =============================================================================
 * The profile is auto-created by a database trigger when a user signs up,
 * so we only need read and update operations here.
 */

import { type NextRequest } from "next/server";
import { authenticate, isAuthError } from "@/lib/api/auth";
import { handleError } from "@/lib/api/errors";
import { ProfilesService } from "@/lib/api/services/profiles.service";
import { updateProfileSchema } from "@/lib/api/schemas";

/**
 * GET /api/profiles/me
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const service = new ProfilesService(auth.supabase);
    const profile = await service.getOwn(auth.user.id);

    return Response.json({ data: profile });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PATCH /api/profiles/me
 */
export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: { message: "Validation failed", issues: parsed.error.issues, statusCode: 400 } },
        { status: 400 }
      );
    }

    const service = new ProfilesService(auth.supabase);
    const profile = await service.update(auth.user.id, parsed.data);

    return Response.json({ data: profile });
  } catch (err) {
    return handleError(err);
  }
}
