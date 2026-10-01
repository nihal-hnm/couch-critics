/**
 * =============================================================================
 * Supabase Storage Service
 * =============================================================================
 * Handles all file operations: signed upload URLs, signed download URLs,
 * public URL resolution, and file deletion.
 *
 * ARCHITECTURE: SIGNED UPLOAD URLs
 * ─────────────────────────────────
 * Instead of proxying file uploads through the Express server (which would
 * consume server memory and bandwidth), we generate a signed URL that lets
 * the client upload DIRECTLY to Supabase Storage. The flow:
 *
 *   1. Client requests a signed upload URL from our API
 *   2. API returns the URL + the storage path
 *   3. Client uploads the file directly to Supabase Storage using that URL
 *   4. Client confirms the upload by saving the attachment metadata to our API
 *
 * This keeps the backend stateless and bandwidth-free for file I/O.
 *
 * FOLDER CONVENTION:
 *   {bucket}/{user_id}/{entry_id}/{filename}
 *   This matches the RLS storage policies in schema.sql.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.js";
import { env } from "../config/env.js";
import { AppError } from "../types/errors.js";

const BUCKET = env.STORAGE_BUCKET;

export class StorageService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Generate a signed URL that allows the client to upload a file directly.
   * Returns both the signed URL and the resolved storage path.
   */
  async createSignedUploadUrl(
    userId: string,
    entryId: string,
    fileName: string
  ): Promise<{ signedUrl: string; token: string; path: string }> {
    const path = `${userId}/${entryId}/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      throw AppError.internal(
        `Failed to create signed upload URL: ${error?.message || "Unknown error"}`
      );
    }

    return {
      signedUrl: data.signedUrl,
      token: data.token,
      path,
    };
  }

  /**
   * Generate a temporary signed URL for downloading a private file.
   * Expires after SIGNED_URL_EXPIRY seconds (default: 1 hour).
   */
  async createSignedDownloadUrl(
    storagePath: string
  ): Promise<{ signedUrl: string }> {
    const { data, error } = await this.supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, env.SIGNED_URL_EXPIRY);

    if (error || !data) {
      throw AppError.internal(
        `Failed to create signed download URL: ${error?.message || "Unknown error"}`
      );
    }

    return { signedUrl: data.signedUrl };
  }

  /**
   * Get the public URL for a file. Only works if the bucket is set to public.
   * For private buckets, use createSignedDownloadUrl instead.
   */
  getPublicUrl(storagePath: string): { publicUrl: string } {
    const { data } = this.supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    return { publicUrl: data.publicUrl };
  }

  /**
   * Delete a file from storage.
   * The RLS policy ensures users can only delete files in their own folder.
   */
  async deleteFile(storagePath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(BUCKET)
      .remove([storagePath]);

    if (error) {
      throw AppError.internal(
        `Failed to delete file: ${error.message}`
      );
    }
  }

  /**
   * Delete all files for a given entry (when the entry is deleted).
   * Lists all files in the entry's folder, then batch-deletes.
   */
  async deleteEntryFiles(userId: string, entryId: string): Promise<void> {
    const folderPath = `${userId}/${entryId}`;

    const { data: files, error: listError } = await this.supabase.storage
      .from(BUCKET)
      .list(folderPath);

    if (listError) {
      console.error(`Failed to list files for deletion: ${listError.message}`);
      return;
    }

    if (files && files.length > 0) {
      const paths = files.map((file) => `${folderPath}/${file.name}`);
      const { error: removeError } = await this.supabase.storage
        .from(BUCKET)
        .remove(paths);

      if (removeError) {
        console.error(`Failed to batch delete files: ${removeError.message}`);
      }
    }
  }
}
