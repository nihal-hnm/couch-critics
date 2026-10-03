/**
 * =============================================================================
 * GET  /api/entries/[id]/review  — Get the review for an entry
 * POST /api/entries/[id]/review  — Create or update (upsert) a review
 * PATCH /api/entries/[id]/review — Partial update to an existing review
 * =============================================================================
 */

import { type NextRequest } from "next/server";
import { authenticate, isAuthError } from "@/lib/api/auth";
import { handleError, AppError } from "@/lib/api/errors";
import { ReviewsService } from "@/lib/api/services/reviews.service";
import { upsertReviewSchema, updateReviewSchema } from "@/lib/api/schemas";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/entries/[id]/review
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const { id: entryId } = await params;
    const service = new ReviewsService(auth.supabase);
    const review = await service.getByEntryId(entryId);

    if (!review) {
      throw AppError.notFound("No review found for this entry");
    }

    return Response.json({ data: review });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/entries/[id]/review — Upsert
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
    const parsed = upsertReviewSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: { message: "Validation failed", issues: parsed.error.issues, statusCode: 400 } },
        { status: 400 }
      );
    }

    const service = new ReviewsService(auth.supabase);
    const review = await service.upsert({
      entry_id: entryId,
      user_id: auth.user.id,
      ...parsed.data,
    });

    return Response.json({ data: review });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PATCH /api/entries/[id]/review — Partial update
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const { id: entryId } = await params;
    const body = await request.json();
    const parsed = updateReviewSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: { message: "Validation failed", issues: parsed.error.issues, statusCode: 400 } },
        { status: 400 }
      );
    }

    // Find the existing review for this entry, then update by its ID
    const service = new ReviewsService(auth.supabase);
    const existing = await service.getByEntryId(entryId);

    if (!existing) {
      throw AppError.notFound("No review found for this entry to update");
    }

    const review = await service.update(existing.id, parsed.data);

    return Response.json({ data: review });
  } catch (err) {
    return handleError(err);
  }
}
