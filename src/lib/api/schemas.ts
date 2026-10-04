/**
 * =============================================================================
 * Zod Validation Schemas (Ported from Express backend)
 * =============================================================================
 * All request body/query validation schemas consolidated in one module.
 * Each schema matches the database constraints and is used by the
 * corresponding Route Handler to validate incoming data.
 */

import { z } from "zod";

// ─── Shared Enums ─────────────────────────────────────────────────────────────

/** Valid shelf values, matching the database CHECK constraint */
export const shelfEnum = z.enum(["watching", "toWatch", "watched"]);

/** Valid media types */
export const mediaTypeEnum = z.enum(["movie", "tv"]);

// ─── Entry Schemas ────────────────────────────────────────────────────────────

/**
 * POST /api/entries — Create a new entry
 */
export const createEntrySchema = z.object({
  shelf: shelfEnum,
  tmdb_id: z.number().int().positive(),
  title: z.string().min(1, "Title is required").max(500),
  poster_url: z.string().url().or(z.literal("")).nullable().optional().transform((v) => v || null),
  release_year: z.string().max(10).nullable().optional(),
  runtime: z.number().int().min(0).default(0),
  genres: z.array(z.string()).default([]),
  director: z.string().default(""),
  overview: z.string().default(""),
  media_type: mediaTypeEnum.default("movie"),

  // Progress fields (optional, for "watching" shelf)
  current_episode: z.number().int().min(0).nullable().optional(),
  total_episodes: z.number().int().min(0).nullable().optional(),
  minutes_watched: z.number().int().min(0).nullable().optional(),
  total_minutes: z.number().int().min(0).nullable().optional(),
});

/**
 * PATCH /api/entries/:id — Update an entry (all fields optional)
 */
export const updateEntrySchema = z
  .object({
    shelf: shelfEnum.optional(),
    title: z.string().min(1).max(500).optional(),
    poster_url: z.string().url().or(z.literal("")).nullable().optional().transform((v) => v || null),
    release_year: z.string().max(10).nullable().optional(),
    runtime: z.number().int().min(0).optional(),
    genres: z.array(z.string()).optional(),
    director: z.string().optional(),
    overview: z.string().optional(),
    media_type: mediaTypeEnum.optional(),
    current_episode: z.number().int().min(0).nullable().optional(),
    total_episodes: z.number().int().min(0).nullable().optional(),
    minutes_watched: z.number().int().min(0).nullable().optional(),
    total_minutes: z.number().int().min(0).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

/**
 * Review sub-schema (used within moveToShelfSchema)
 */
const reviewSubSchema = z.object({
  rating: z.number().int().min(1).max(10),
  notes: z.string().default(""),
  tags: z.array(z.string()).default([]),
  date_completed: z.string().nullable().optional(),
});

/**
 * PATCH /api/entries/:id/shelf — Move to a different shelf
 */
export const moveToShelfSchema = z.object({
  shelf: shelfEnum,
  review: reviewSubSchema.optional(),
});

/**
 * POST /api/entries/:id/upload-url — Request a signed upload URL
 */
export const uploadUrlSchema = z.object({
  fileName: z
    .string()
    .min(1, "File name is required")
    .max(255)
    .refine(
      (name) => !name.includes("..") && !name.includes("/"),
      "File name must not contain path traversal characters"
    ),
});

/**
 * POST /api/entries/:id/download-url — Request a signed download URL
 */
export const downloadUrlSchema = z.object({
  storagePath: z.string().min(1, "Storage path is required"),
});

/**
 * Query params for listing entries
 */
export const listEntriesQuerySchema = z.object({
  shelf: shelfEnum.optional(),
});

// ─── Review Schemas ───────────────────────────────────────────────────────────

/**
 * POST /api/entries/:entryId/review — Create or update a review (upsert)
 */
export const upsertReviewSchema = z.object({
  rating: z.number().int().min(1).max(10),
  notes: z.string().default(""),
  tags: z.array(z.string()).default([]),
  date_completed: z.string().nullable().optional(),
});

/**
 * PATCH /api/entries/:entryId/review — Partial update to an existing review
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

// ─── Profile Schemas ──────────────────────────────────────────────────────────

/**
 * PATCH /api/profiles/me — Update profile
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

// ─── Attachment Schemas ───────────────────────────────────────────────────────

/**
 * POST /api/entries/:entryId/attachments — Confirm an upload
 */
export const confirmAttachmentSchema = z.object({
  storage_path: z.string().min(1, "Storage path is required"),
  file_name: z.string().min(1, "File name is required").max(255),
  content_type: z.string().max(100).nullable().optional(),
  size_bytes: z.number().int().min(0).nullable().optional(),
});
