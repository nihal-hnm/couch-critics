/**
 * =============================================================================
 * Custom Application Error
 * =============================================================================
 * Extends Error with an HTTP status code so the error handler middleware
 * can respond with the correct status without parsing error messages.
 */

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
