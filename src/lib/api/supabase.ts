/**
 * =============================================================================
 * Supabase Client Instances (Next.js API Routes)
 * =============================================================================
 *
 * TWO CLIENT PATTERN:
 * ───────────────────
 * 1. `createScopedClient(token)` — Creates a client scoped to the authenticated
 *    user's JWT. All queries automatically respect RLS policies.
 *
 * 2. `supabaseAdmin` — Uses the service_role key which BYPASSES RLS entirely.
 *    Use ONLY for privileged background operations. NEVER expose to client requests.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Creates a Supabase client scoped to a specific user's JWT.
 */
export function createScopedClient(accessToken: string): SupabaseClient<Database> {
  return createClient<Database>(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_ANON_KEY"),
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Admin client with service_role key — bypasses all RLS.
 * ⚠️  NEVER use this for user-facing requests.
 */
export function getAdminClient(): SupabaseClient<Database> {
  return createClient<Database>(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
