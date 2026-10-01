/**
 * =============================================================================
 * Supabase Client Instances
 * =============================================================================
 *
 * TWO CLIENT PATTERN:
 * ───────────────────
 * 1. `createScopedClient(token)` — Creates a client scoped to the authenticated
 *    user's JWT. All queries automatically respect RLS policies. This is what
 *    you use in request handlers for user-facing operations.
 *
 * 2. `supabaseAdmin` — Uses the service_role key which BYPASSES RLS entirely.
 *    Use ONLY for privileged background operations (cron jobs, admin tasks,
 *    webhooks) where no user context exists. NEVER expose to client requests.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env.js";
import type { Database } from "../types/database.js";

/**
 * Creates a Supabase client scoped to a specific user's JWT.
 * The client inherits RLS policies — the user can only access their own data.
 */
export function createScopedClient(accessToken: string): SupabaseClient<Database> {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Admin client with service_role key — bypasses all RLS.
 * Singleton: created once at startup.
 *
 * ⚠️  NEVER use this for user-facing requests.
 */
export const supabaseAdmin = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
