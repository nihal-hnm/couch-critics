/**
 * =============================================================================
 * Environment Configuration
 * =============================================================================
 * Validates and exports all environment variables at startup.
 * If any required variable is missing, the process exits immediately
 * rather than failing at runtime with a cryptic error.
 */

import "dotenv/config";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env["PORT"] || "4000", 10),
  NODE_ENV: process.env["NODE_ENV"] || "development",
  SUPABASE_URL: requireEnv("SUPABASE_URL"),
  SUPABASE_ANON_KEY: requireEnv("SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  CORS_ORIGINS: (process.env["CORS_ORIGINS"] || "http://localhost:3000").split(","),
  STORAGE_BUCKET: process.env["STORAGE_BUCKET"] || "attachments",
  SIGNED_URL_EXPIRY: parseInt(process.env["SIGNED_URL_EXPIRY"] || "3600", 10),
} as const;
