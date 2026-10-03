/**
 * =============================================================================
 * Reviews Service — Data Access Layer
 * =============================================================================
 * Handles standalone review operations. Reviews have a 1:1 relationship with
 * entries (enforced by the UNIQUE constraint on entry_id).
 *
 * WHY A SEPARATE SERVICE?
 * ───────────────────────
 * The EntriesService handles the "move to watched + create review" flow, but
 * users also need to edit existing reviews independently (update rating, add
 * notes, change tags). This service provides those standalone operations.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.js";
import { AppError } from "../types/errors.js";

type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];
type ReviewUpdate = Database["public"]["Tables"]["reviews"]["Update"];

export class ReviewsService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Get the review for a specific entry.
   * Returns null if the entry doesn't have a review yet.
   */
  async getByEntryId(entryId: string): Promise<ReviewRow | null> {
    const { data, error } = await this.supabase
      .from("reviews")
      .select("*")
      .eq("entry_id", entryId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Create or update (upsert) a review for an entry.
   * Uses the UNIQUE constraint on entry_id for conflict resolution.
   */
  async upsert(review: ReviewInsert): Promise<ReviewRow> {
    const { data, error } = await this.supabase
      .from("reviews")
      .upsert(review, { onConflict: "entry_id" })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update an existing review by its ID.
   */
  async update(reviewId: string, updates: ReviewUpdate): Promise<ReviewRow> {
    const { data, error } = await this.supabase
      .from("reviews")
      .update(updates)
      .eq("id", reviewId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw AppError.notFound(`Review ${reviewId} not found`);
      }
      throw error;
    }

    return data;
  }

  /**
   * Delete a review by its ID.
   */
  async delete(reviewId: string): Promise<void> {
    const { error } = await this.supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      throw error;
    }
  }
}
