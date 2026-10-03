/**
 * =============================================================================
 * Supabase Browser Client — Client-side Auth & Session Management
 * =============================================================================
 * This creates a single Supabase client instance for the browser that handles:
 *   1. Email/password sign-up and sign-in
 *   2. Session persistence (Supabase handles this via localStorage)
 *   3. Auth state change listeners (for reactive UI updates)
 *   4. Providing the current access token for API calls
 *
 * WHY A SEPARATE CLIENT FROM THE SERVER ONE?
 * ──────────────────────────────────────────
 * The server-side client (`src/lib/api/supabase.ts`) uses service_role keys
 * and is meant for API route handlers. This client uses the anon key and
 * runs in the browser — it can only access data allowed by RLS policies.
 *
 * GRACEFUL DEGRADATION:
 * ────────────────────
 * If Supabase env vars are not configured, the client still creates but
 * auth operations will fail gracefully. The app works in guest mode
 * (localStorage only) without Supabase credentials.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
  "https://nicthqhmdlgbwfhppgou.supabase.co";
const supabaseAnonKey =
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
  "sb_publishable_zhVcta_xJB8nQim7zZJblw_iH_Yjz7N";

/**
 * Whether Supabase is configured. Used by AuthProvider to skip auth
 * initialization when credentials aren't available (dev/guest mode).
 */
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * Singleton browser Supabase client.
 * Uses NEXT_PUBLIC_* env vars which are inlined at build time.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
