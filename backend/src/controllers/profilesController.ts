/**
 * =============================================================================
 * Profiles Controller
 * =============================================================================
 * Handles HTTP request/response for the user profile endpoints.
 *
 * Profiles are auto-created by a database trigger on signup, so there's no
 * `createProfile` endpoint. Users can only read and update their own profile.
 */

import type { Request, Response, NextFunction } from "express";
import { ProfilesService } from "../services/profilesService.js";

/**
 * GET /api/profile
 * Get the authenticated user's profile.
 */
export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new ProfilesService(req.supabase!);
    const profile = await service.getOwn(req.user!.id);

    res.json({ data: profile });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/profile
 * Update the authenticated user's profile.
 */
export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const service = new ProfilesService(req.supabase!);
    const profile = await service.update(req.user!.id, req.body);

    res.json({ data: profile });
  } catch (err) {
    next(err);
  }
}
