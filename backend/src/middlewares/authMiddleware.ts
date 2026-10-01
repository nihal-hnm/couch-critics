/**
 * =============================================================================
 * Authentication Middleware
 * =============================================================================
 * Extracts the JWT from the Authorization header, verifies it against Supabase
 * Auth, and attaches the user + a request-scoped Supabase client to `req`.
 *
 * WHY getUser() INSTEAD OF JUST DECODING THE JWT?
 * ────────────────────────────────────────────────
 * `supabase.auth.getUser()` makes a round-trip to Supabase Auth to verify the
 * token hasn't been revoked. Local JWT decoding (e.g., with jose) is faster
 * but cannot detect revoked sessions. For a production app where users can
 * sign out / get banned, this server-side check is essential.
 */

import type { Request, Response, NextFunction } from "express";
import { createScopedClient } from "../config/supabaseClient.js";
import { AppError } from "../types/errors.js";

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw AppError.unauthorized("Missing or malformed Authorization header");
    }

    const token = authHeader.substring(7); // Strip "Bearer "

    if (!token) {
      throw AppError.unauthorized("Empty access token");
    }

    // Create a scoped client for this request and verify the token
    const supabase = createScopedClient(token);
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw AppError.unauthorized(error?.message || "Invalid or expired token");
    }

    // Attach to request for downstream handlers
    req.user = data.user;
    req.supabase = supabase;

    next();
  } catch (err) {
    next(err);
  }
}
