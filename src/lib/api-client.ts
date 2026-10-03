/**
 * =============================================================================
 * API Client — Centralized Fetch Wrapper
 * =============================================================================
 * All frontend → backend API calls go through this module. It automatically:
 *   1. Attaches the `Authorization: Bearer <token>` header
 *   2. Sets `Content-Type: application/json`
 *   3. Parses responses and throws on errors
 *
 * USAGE:
 *   const { data } = await apiClient.get<Entry[]>("/api/entries");
 *   const { data } = await apiClient.post<Entry>("/api/entries", body);
 */

import { supabase, isSupabaseConfigured } from "./supabase-browser";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  error: {
    message: string;
    statusCode: number;
    issues?: unknown[];
  };
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly issues?: unknown[]
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

// ─── Core Fetch ─────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // 204 No Content (e.g., DELETE responses)
  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json();

  if (!res.ok) {
    const errBody = json as ApiError;
    throw new ApiClientError(
      errBody.error?.message || "Unknown API error",
      errBody.error?.statusCode || res.status,
      errBody.error?.issues
    );
  }

  return (json as ApiResponse<T>).data;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export const apiClient = {
  get<T>(url: string): Promise<T> {
    return apiFetch<T>(url, { method: "GET" });
  },

  post<T>(url: string, body?: unknown): Promise<T> {
    return apiFetch<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(url: string, body: unknown): Promise<T> {
    return apiFetch<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete(url: string): Promise<void> {
    return apiFetch<void>(url, { method: "DELETE" });
  },
};
