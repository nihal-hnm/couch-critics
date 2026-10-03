/**
 * =============================================================================
 * Profiles Service — Data Access Layer (Ported from Express backend)
 * =============================================================================
 * Handles all Supabase queries for user profiles. Profiles are auto-created
 * by a database trigger on signup (see schema.sql), so this service only
 * needs to support read and update operations.
 *
 * The profile row's PK is the same UUID as auth.users.id, enforced by the
 * `profiles_id_fkey` foreign key. This means `getOwn()` can simply filter
 * by the authenticated user's ID.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";
import { AppError } from "../errors";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export class ProfilesService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Get the current user's profile.
   * RLS ensures only the owner can SELECT their row.
   */
  async getOwn(userId: string): Promise<ProfileRow> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw AppError.notFound("Profile not found — this should not happen");
      }
      throw error;
    }

    return data;
  }

  /**
   * Update the current user's profile (display_name, username, avatar_url, bio).
   * RLS ensures only the owner can UPDATE their row.
   */
  async update(userId: string, updates: ProfileUpdate): Promise<ProfileRow> {
    const { data, error } = await this.supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw AppError.conflict("This username is already taken");
      }
      if (error.code === "PGRST116") {
        throw AppError.notFound("Profile not found");
      }
      throw error;
    }

    return data;
  }
}
