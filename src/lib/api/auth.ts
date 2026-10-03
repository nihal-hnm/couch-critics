/**
 * =============================================================================
 * API Auth Helper
 * =============================================================================
 * Extracts the JWT from the Authorization header, verifies it via Supabase,
 * and returns the user + request-scoped client. Used by all protected routes.
 */

import { createScopedClient } from "./supabase";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export interface AuthContext {
  user: User;
  supabase: SupabaseClient<Database>;
}

/**
 * Authenticate a request by verifying the Bearer token.
 * Returns the user and a scoped Supabase client, or a Response error.
 */
export async function authenticate(
  request: Request
): Promise<AuthContext | Response> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      { error: { message: "Missing or malformed Authorization header", statusCode: 401 } },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  if (!token) {
    return Response.json(
      { error: { message: "Empty access token", statusCode: 401 } },
      { status: 401 }
    );
  }

  const supabase = createScopedClient(token);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return Response.json(
      { error: { message: error?.message || "Invalid or expired token", statusCode: 401 } },
      { status: 401 }
    );
  }

  return { user: data.user, supabase };
}

/** Type guard: check if authenticate() returned an error Response */
export function isAuthError(result: AuthContext | Response): result is Response {
  return result instanceof Response;
}
