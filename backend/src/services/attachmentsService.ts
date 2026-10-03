/**
 * =============================================================================
 * Attachments Service — Data Access Layer
 * =============================================================================
 * Manages attachment metadata records in the database. These records serve as
 * the link between a journal entry and its files in Supabase Storage.
 *
 * UPLOAD FLOW RECAP:
 * ──────────────────
 * 1. Client requests a signed upload URL  (StorageService.createSignedUploadUrl)
 * 2. Client uploads the file directly to Supabase Storage
 * 3. Client confirms the upload by POSTing metadata here  ← THIS SERVICE
 * 4. Client can later request signed download URLs for the file
 *
 * Without step 3, we'd have orphaned files in Storage with no database record.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.js";
import { AppError } from "../types/errors.js";

type AttachmentRow = Database["public"]["Tables"]["attachments"]["Row"];
type AttachmentInsert = Database["public"]["Tables"]["attachments"]["Insert"];

export class AttachmentsService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * List all attachments for an entry.
   */
  async listByEntryId(entryId: string): Promise<AttachmentRow[]> {
    const { data, error } = await this.supabase
      .from("attachments")
      .select("*")
      .eq("entry_id", entryId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Confirm an upload by creating the attachment metadata record.
   * Called after the client has successfully uploaded via the signed URL.
   */
  async create(attachment: AttachmentInsert): Promise<AttachmentRow> {
    const { data, error } = await this.supabase
      .from("attachments")
      .insert(attachment)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Delete an attachment metadata record.
   * NOTE: The actual file in Storage must be deleted separately
   * via StorageService.deleteFile().
   */
  async delete(attachmentId: string): Promise<AttachmentRow> {
    // First fetch the record so we can return storage_path for file cleanup
    const { data: existing, error: fetchError } = await this.supabase
      .from("attachments")
      .select("*")
      .eq("id", attachmentId)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        throw AppError.notFound(`Attachment ${attachmentId} not found`);
      }
      throw fetchError;
    }

    const { error: deleteError } = await this.supabase
      .from("attachments")
      .delete()
      .eq("id", attachmentId);

    if (deleteError) {
      throw deleteError;
    }

    return existing;
  }
}
