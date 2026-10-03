/**
 * =============================================================================
 * GET  /api/entries        — List all entries (optionally filtered by shelf)
 * POST /api/entries        — Create a new journal entry
 * =============================================================================
 */

import { type NextRequest } from "next/server";
import { authenticate, isAuthError } from "@/lib/api/auth";
import { handleError } from "@/lib/api/errors";
import { EntriesService } from "@/lib/api/services/entries.service";
import { createEntrySchema, listEntriesQuerySchema } from "@/lib/api/schemas";

/**
 * GET /api/entries?shelf=watching
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    // Parse optional query params
    const searchParams = request.nextUrl.searchParams;
    const queryResult = listEntriesQuerySchema.safeParse({
      shelf: searchParams.get("shelf") || undefined,
    });

    const shelf = queryResult.success ? queryResult.data.shelf : undefined;

    const service = new EntriesService(auth.supabase);
    const entries = await service.list(shelf);

    return Response.json({ data: entries });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/entries
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticate(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const parsed = createEntrySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: { message: "Validation failed", issues: parsed.error.issues, statusCode: 400 } },
        { status: 400 }
      );
    }

    const service = new EntriesService(auth.supabase);
    const entry = await service.create(auth.user.id, parsed.data);

    return Response.json({ data: entry }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
