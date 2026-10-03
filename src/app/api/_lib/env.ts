/**
 * =============================================================================
 * Environment Configuration (Server-side only)
 * =============================================================================
 * Validates and exports all server-side environment variables.
 * These are accessed at runtime in Route Handlers (never bundled to client).
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env["NODE_ENV"] || "development",
  SUPABASE_URL: requireEnv("SUPABASE_URL"),
  SUPABASE_ANON_KEY: requireEnv("SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  STORAGE_BUCKET: process.env["STORAGE_BUCKET"] || "attachments",
  SIGNED_URL_EXPIRY: parseInt(process.env["SIGNED_URL_EXPIRY"] || "3600", 10),
} as const;
