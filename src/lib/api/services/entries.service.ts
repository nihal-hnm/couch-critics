/**
 * =============================================================================
 * Entries Service — Data Access Layer (Ported from Express backend)
 * =============================================================================
 * Encapsulates all Supabase queries for journal entries. Each method receives
 * the request-scoped Supabase client (which already has the user's JWT baked in
 * and respects RLS).
 *
 * WHY A SERVICE LAYER?
 * ────────────────────
 * Route Handlers handle HTTP concerns (parsing request, returning Response).
 * Services handle business logic and data access.
 * This separation means you can call services from background jobs, tests,
 * or other services without needing a fake HTTP request.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";
import { AppError } from "../errors";

type EntryRow = Database["public"]["Tables"]["entries"]["Row"];
type EntryInsert = Database["public"]["Tables"]["entries"]["Insert"];
type EntryUpdate = Database["public"]["Tables"]["entries"]["Update"];
type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

export class EntriesService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * List all entries for the authenticated user, optionally filtered by shelf.
   * RLS ensures only the user's own entries are returned.
   */
  async list(shelf?: string): Promise<(EntryRow & { review?: Database["public"]["Tables"]["reviews"]["Row"] | null })[]> {
    let query = this.supabase
      .from("entries")
      .select(`
        *,
        review:reviews(*)
      `)
      .order("updated_at", { ascending: false });

    if (shelf) {
      query = query.eq("shelf", shelf);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data || []) as unknown as (EntryRow & { review?: Database["public"]["Tables"]["reviews"]["Row"] | null })[];
  }

  /**
   * Get a single entry by ID.
   * Returns the entry with its review (if exists) and attachments.
   */
  async getById(entryId: string): Promise<EntryRow & { review?: unknown; attachments?: unknown[] }> {
    const { data, error } = await this.supabase
      .from("entries")
      .select(`
        *,
        review:reviews(*),
        attachments(*)
      `)
      .eq("id", entryId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw AppError.notFound(`Entry ${entryId} not found`);
      }
      throw error;
    }

    return data as EntryRow & { review?: unknown; attachments?: unknown[] };
  }

  /**
   * Create a new journal entry.
   * The user_id is set from the authenticated user, not from the request body.
   */
  async create(userId: string, entry: Omit<EntryInsert, "user_id">): Promise<EntryRow> {
    const { data, error } = await this.supabase
      .from("entries")
      .insert({ ...entry, user_id: userId })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw AppError.conflict("This movie is already in your journal");
      }
      throw error;
    }

    return data;
  }

  /**
   * Update an existing entry (shelf changes, progress updates, etc.).
   */
  async update(entryId: string, updates: EntryUpdate): Promise<EntryRow> {
    const { data, error } = await this.supabase
      .from("entries")
      .update(updates)
      .eq("id", entryId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw AppError.notFound(`Entry ${entryId} not found`);
      }
      throw error;
    }

    return data;
  }

  /**
   * Delete an entry and all related data (cascaded by FK constraints).
   */
  async delete(entryId: string): Promise<void> {
    const { error } = await this.supabase
      .from("entries")
      .delete()
      .eq("id", entryId);

    if (error) {
      throw error;
    }
  }

  /**
   * Move an entry to a different shelf.
   * When moving to "watched", optionally creates a review.
   */
  async moveToShelf(
    entryId: string,
    userId: string,
    shelf: string,
    review?: Omit<ReviewInsert, "entry_id" | "user_id">
  ): Promise<EntryRow & { review?: unknown; attachments?: unknown[] }> {
    const existing = await this.getById(entryId);
    const updates: EntryUpdate = { shelf };

    if (shelf === "watched") {
      if (existing.media_type === "tv") {
        const total = existing.total_episodes || 10;
        const totalMins = existing.total_minutes || total * (existing.runtime || 45);
        updates.current_episode = total;
        updates.total_episodes = total;
        updates.minutes_watched = totalMins;
        updates.total_minutes = totalMins;
      } else {
        updates.minutes_watched = existing.runtime;
        updates.total_minutes = existing.runtime;
      }
    }

    await this.update(entryId, updates);

    // If moving to "watched" and a review is provided, upsert the review
    if (shelf === "watched" && review) {
      const { error: reviewError } = await this.supabase
        .from("reviews")
        .upsert(
          {
            entry_id: entryId,
            user_id: userId,
            ...review,
          },
          { onConflict: "entry_id" }
        );

      if (reviewError) {
        console.error("Failed to save review:", reviewError);
      }
    }

    return await this.getById(entryId);
  }
}
