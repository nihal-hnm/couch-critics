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

const DEFAULT_SUPABASE_URL =
  process.env["NEXT_PUBLIC_SUPABASE_URL"] || "https://nicthqhmdlgbwfhppgou.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] || "sb_publishable_zhVcta_xJB8nQim7zZJblw_iH_Yjz7N";
const DEFAULT_SERVICE_ROLE_KEY = "sb_secret_P3QuNAM1Nv-ttfpxI57YBQ_t5BfvtwB";

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
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
    getEnv("SUPABASE_URL", DEFAULT_SUPABASE_URL),
    getEnv("SUPABASE_ANON_KEY", DEFAULT_SUPABASE_ANON_KEY),
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
    getEnv("SUPABASE_URL", DEFAULT_SUPABASE_URL),
    getEnv("SUPABASE_SERVICE_ROLE_KEY", DEFAULT_SERVICE_ROLE_KEY),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
