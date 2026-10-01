/**
 * =============================================================================
 * Centralized Error Handler
 * =============================================================================
 * Catches all errors (thrown or passed via next()) and returns a consistent
 * JSON error response. Maps Supabase PostgREST error codes to HTTP status codes.
 *
 * POSTGREST ERROR CODE MAPPING:
 * ─────────────────────────────
 * Supabase returns errors with a `code` field from PostgreSQL/PostgREST.
 * We map these to appropriate HTTP status codes rather than always returning 500.
 */

import type { Request, Response, NextFunction } from "express";
import { AppError } from "../types/errors.js";
import { env } from "../config/env.js";

/**
 * Maps Supabase/PostgREST error codes to HTTP status codes.
 * Reference: https://postgrest.org/en/stable/references/errors.html
 */
const POSTGREST_ERROR_MAP: Record<string, number> = {
  // PostgREST-specific
  PGRST116: 404, // "The result contains 0 rows" (single-row expected)
  PGRST204: 404, // No rows found
  PGRST301: 401, // JWT expired
  PGRST302: 401, // JWT invalid

  // PostgreSQL error codes
  "23503": 409,  // foreign_key_violation
  "23505": 409,  // unique_violation
  "23514": 400,  // check_violation
  "42501": 403,  // insufficient_privilege (RLS denied)
  "42P01": 404,  // undefined_table
  "22P02": 400,  // invalid_text_representation (bad UUID, etc.)
  "23502": 400,  // not_null_violation
  "42703": 400,  // undefined_column
};

interface SupabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

function isSupabaseError(err: unknown): err is SupabaseError {
  return typeof err === "object" && err !== null && "code" in err;
}

/**
 * Express error-handling middleware (4-argument signature).
 * Must be registered LAST with app.use().
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // ── 1. Known application errors ────────────────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
    return;
  }

  // ── 2. Supabase/PostgREST errors ──────────────────────────────────────
  if (isSupabaseError(err) && err.code) {
    const statusCode = POSTGREST_ERROR_MAP[err.code] || 500;
    res.status(statusCode).json({
      error: {
        message: err.message || "Database error",
        code: err.code,
        ...(err.details && { details: err.details }),
        ...(err.hint && { hint: err.hint }),
        statusCode,
      },
    });
    return;
  }

  // ── 3. Standard Error objects ─────────────────────────────────────────
  if (err instanceof Error) {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: {
        message:
          env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message,
        statusCode: 500,
      },
    });
    return;
  }

  // ── 4. Catch-all for unknown throw values ─────────────────────────────
  console.error("Unknown error type:", err);
  res.status(500).json({
    error: {
      message: "Internal server error",
      statusCode: 500,
    },
  });
}
