/**
 * =============================================================================
 * Express Type Augmentations
 * =============================================================================
 * Extends Express's Request type to include `user` and `supabase` properties
 * that our auth middleware attaches after JWT verification.
 */

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./database.js";

declare global {
  namespace Express {
    interface Request {
      /** The authenticated Supabase user, set by authMiddleware */
      user?: User;
      /** The request-scoped Supabase client (respects RLS for this user) */
      supabase?: SupabaseClient<Database>;
    }
  }
}
