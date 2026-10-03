/**
 * =============================================================================
 * Profiles Router
 * =============================================================================
 * Routes for the /api/profile resource (singular — each user has one profile).
 */

import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { updateProfileSchema } from "./profiles.schemas.js";
import { getProfile, updateProfile } from "../controllers/profilesController.js";

const router = Router();

router.get("/", getProfile);
router.patch("/", validate(updateProfileSchema), updateProfile);

export default router;
