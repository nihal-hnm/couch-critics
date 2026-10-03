/**
 * =============================================================================
 * API Error Handling
 * =============================================================================
 * Contains both the AppError class (for throwing typed errors in services) and
 * the handleError function (for converting any error into a JSON Response in
 * route handlers).
 */

// ─── AppError Class ───────────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string): AppError {
    return new AppError(message, 400);
  }

  static unauthorized(message: string = "Authentication required"): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message: string = "Access denied"): AppError {
    return new AppError(message, 403);
  }

  static notFound(message: string = "Resource not found"): AppError {
    return new AppError(message, 404);
  }

  static conflict(message: string): AppError {
    return new AppError(message, 409);
  }

  static internal(message: string = "Internal server error"): AppError {
    return new AppError(message, 500, false);
  }
}

// ─── Error Response Handler ───────────────────────────────────────────────────

const POSTGREST_ERROR_MAP: Record<string, number> = {
  PGRST116: 404,
  PGRST204: 404,
  PGRST301: 401,
  PGRST302: 401,
  "23503": 409,
  "23505": 409,
  "23514": 400,
  "42501": 403,
  "42P01": 404,
  "22P02": 400,
  "23502": 400,
  "42703": 400,
};

interface SupabaseError {
  code?: string;
  message?: string;
  details?: string;
}

function isSupabaseError(err: unknown): err is SupabaseError {
  return typeof err === "object" && err !== null && "code" in err;
}

/** Convert any error into a JSON Response */
export function handleError(err: unknown): Response {
  // Handle our own AppError instances first
  if (err instanceof AppError) {
    return Response.json(
      { error: { message: err.message, statusCode: err.statusCode } },
      { status: err.statusCode }
    );
  }

  // Handle Supabase/PostgREST errors
  if (isSupabaseError(err) && err.code) {
    const statusCode = POSTGREST_ERROR_MAP[err.code] || 500;
    return Response.json(
      { error: { message: err.message || "Database error", code: err.code, statusCode } },
      { status: statusCode }
    );
  }

  // Generic Error
  if (err instanceof Error) {
    console.error("Unhandled error:", err);
    return Response.json(
      { error: { message: err.message, statusCode: 500 } },
      { status: 500 }
    );
  }

  // Unknown
  console.error("Unknown error:", err);
  return Response.json(
    { error: { message: "Internal server error", statusCode: 500 } },
    { status: 500 }
  );
}
