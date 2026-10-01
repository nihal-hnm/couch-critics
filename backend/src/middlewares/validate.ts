/**
 * =============================================================================
 * Request Validation Middleware (Zod)
 * =============================================================================
 * Factory function that returns middleware for validating req.body, req.query,
 * or req.params against a Zod schema. Produces consistent 400 error responses.
 */

import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema } from "zod";
import { AppError } from "../types/errors.js";

type RequestField = "body" | "query" | "params";

/**
 * Returns an Express middleware that validates the specified part of the request
 * against the provided Zod schema.
 *
 * Usage:
 *   router.post("/entries", validate(createEntrySchema, "body"), controller.create);
 */
export function validate(schema: ZodSchema, field: RequestField = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[field]);
      // Replace the raw data with the parsed (and coerced/defaulted) version
      (req as unknown as Record<string, unknown>)[field] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formatted = err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }));
        next(
          AppError.badRequest(
            `Validation failed: ${formatted.map((f) => `${f.path}: ${f.message}`).join("; ")}`
          )
        );
      } else {
        next(err);
      }
    }
  };
}
