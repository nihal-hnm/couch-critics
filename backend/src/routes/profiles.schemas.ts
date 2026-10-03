/**
 * =============================================================================
 * Zod Schemas for Profile Validation
 * =============================================================================
 */

import { z } from "zod";

/**
 * PATCH /api/profile — Update profile
 */
export const updateProfileSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, hyphens, and underscores"
      )
      .optional(),
    display_name: z.string().max(100).nullable().optional(),
    avatar_url: z.string().url().nullable().optional(),
    bio: z.string().max(500).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
