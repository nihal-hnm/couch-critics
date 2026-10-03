/**
 * =============================================================================
 * Database Type Definitions
 * =============================================================================
 * Mirrors the backend/src/types/database.ts — the contract between code and DB.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      entries: {
        Row: {
          id: string;
          user_id: string;
          shelf: string;
          tmdb_id: number;
          title: string;
          poster_url: string | null;
          release_year: string | null;
          runtime: number;
          genres: string[];
          director: string;
          overview: string;
          media_type: string;
          current_episode: number | null;
          total_episodes: number | null;
          minutes_watched: number | null;
          total_minutes: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shelf: string;
          tmdb_id: number;
          title: string;
          poster_url?: string | null;
          release_year?: string | null;
          runtime?: number;
          genres?: string[];
          director?: string;
          overview?: string;
          media_type?: string;
          current_episode?: number | null;
          total_episodes?: number | null;
          minutes_watched?: number | null;
          total_minutes?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          shelf?: string;
          tmdb_id?: number;
          title?: string;
          poster_url?: string | null;
          release_year?: string | null;
          runtime?: number;
          genres?: string[];
          director?: string;
          overview?: string;
          media_type?: string;
          current_episode?: number | null;
          total_episodes?: number | null;
          minutes_watched?: number | null;
          total_minutes?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "entries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          entry_id: string;
          user_id: string;
          rating: number;
          notes: string;
          tags: string[];
          date_completed: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          entry_id: string;
          user_id: string;
          rating: number;
          notes?: string;
          tags?: string[];
          date_completed?: string | null;
        };
        Update: {
          id?: string;
          entry_id?: string;
          user_id?: string;
          rating?: number;
          notes?: string;
          tags?: string[];
          date_completed?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_entry_id_fkey";
            columns: ["entry_id"];
            isOneToOne: true;
            referencedRelation: "entries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      attachments: {
        Row: {
          id: string;
          entry_id: string;
          user_id: string;
          bucket: string;
          storage_path: string;
          file_name: string;
          content_type: string | null;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entry_id: string;
          user_id: string;
          bucket?: string;
          storage_path: string;
          file_name: string;
          content_type?: string | null;
          size_bytes?: number | null;
        };
        Update: {
          id?: string;
          entry_id?: string;
          user_id?: string;
          bucket?: string;
          storage_path?: string;
          file_name?: string;
          content_type?: string | null;
          size_bytes?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "attachments_entry_id_fkey";
            columns: ["entry_id"];
            isOneToOne: false;
            referencedRelation: "entries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attachments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
