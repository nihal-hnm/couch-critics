/**
 * =============================================================================
 * Zod Schemas for Review Validation
 * =============================================================================
 */

import { z } from "zod";

/**
 * PUT /api/entries/:entryId/review — Create or update a review (upsert)
 */
export const upsertReviewSchema = z.object({
  rating: z.number().int().min(1).max(10),
  notes: z.string().default(""),
  tags: z.array(z.string()).default([]),
  date_completed: z.string().nullable().optional(),
});

/**
 * PATCH /api/reviews/:id — Partial update to an existing review
 */
export const updateReviewSchema = z
  .object({
    rating: z.number().int().min(1).max(10).optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
    date_completed: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
