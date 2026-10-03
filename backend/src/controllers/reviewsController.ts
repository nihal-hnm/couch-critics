/**
 * =============================================================================
 * Reviews Controller
 * =============================================================================
 * Handles HTTP request/response for standalone review endpoints.
 *
 * NOTE: The "create review on shelf transition" flow is handled by the
 * entries controller's `moveEntryToShelf`. This controller handles:
 * - Fetching a review by entry ID
 * - Updating an existing review
 * - Deleting a review
 * - Upserting a review directly (for entries already on the "watched" shelf)
 */

import type { Request, Response, NextFunction } from "express";
import { ReviewsService } from "../services/reviewsService.js";
import { AppError } from "../types/errors.js";

/** Safely extract a route param as a string (Express 5 types params as string | string[]) */
function paramStr(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

/**
 * GET /api/entries/:entryId/review
 * Get the review for a specific entry.
 */
export async function getReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new ReviewsService(req.supabase!);
    const entryId = paramStr(req.params["entryId"]);
    const review = await service.getByEntryId(entryId);

    if (!review) {
      throw AppError.notFound("No review found for this entry");
    }

    res.json({ data: review });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/entries/:entryId/review
 * Create or update a review for an entry (upsert).
 */
export async function upsertReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new ReviewsService(req.supabase!);
    const entryId = paramStr(req.params["entryId"]);

    const review = await service.upsert({
      entry_id: entryId,
      user_id: req.user!.id,
      ...req.body,
    });

    res.json({ data: review });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/reviews/:id
 * Update an existing review by review ID.
 */
export async function updateReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new ReviewsService(req.supabase!);
    const review = await service.update(paramStr(req.params["id"]), req.body);

    res.json({ data: review });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/reviews/:id
 * Delete a review by review ID.
 */
export async function deleteReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new ReviewsService(req.supabase!);
    await service.delete(paramStr(req.params["id"]));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
