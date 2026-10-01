/**
 * =============================================================================
 * CINEMA JOURNAL — Core Type Definitions
 * =============================================================================
 *
 * WHY SEPARATE TYPES FILE?
 * ────────────────────────
 * Keeping all types in one place creates a "single source of truth."
 * When you later migrate to Supabase, these interfaces will map 1:1 to your
 * database table schemas. Any component or service that imports these types
 * will automatically benefit from TypeScript's compile-time checks.
 *
 * DESIGN DECISION: Discriminated Union via `shelf`
 * ────────────────────────────────────────────────
 * Instead of 3 separate arrays (watching[], toWatch[], watched[]), we use
 * ONE array of MovieEntry objects, each tagged with a `shelf` field.
 * This makes filtering trivial (`entries.filter(e => e.shelf === "watching")`)
 * and mirrors how a database would store this — one table with a `status` column.
 */

// ─── TMDB Data (comes from the API, never edited by the user) ────────────────

/**
 * Represents the raw movie/show data fetched from TMDB.
 * We store a snapshot of this so the app works offline after the first fetch.
 */
export interface TMDBMovieData {
  /** TMDB's unique identifier — useful as a deduplication key */
  tmdbId: number;
  title: string;
  /** Full URL to the poster image, or null if TMDB has no poster */
  posterUrl: string | null;
  /** e.g. "2024" — extracted from release_date for cleaner display */
  releaseYear: string;
  /** Runtime in minutes (0 if unknown). Used by the "Pick for Tonight" filter */
  runtime: number;
  /** Array of genre names like ["Action", "Sci-Fi"] */
  genres: string[];
  /** Director name(s). TMDB stores this in credits, not in the main response */
  director: string;
  /** Brief plot summary */
  overview: string;
  /** "movie" or "tv" — we might want to handle these differently later */
  mediaType: "movie" | "tv";
}

// ─── User-Generated Data (personal review/progress) ─────────────────────────

/**
 * Which "shelf" (category) a movie lives on.
 * Using a string union instead of an enum because:
 *  1. Enums generate extra JS code; unions are zero-cost at runtime.
 *  2. They serialize to/from JSON naturally (important for localStorage).
 */
export type Shelf = "watching" | "toWatch" | "watched";

/**
 * Progress tracking for items on the "Watching" shelf.
 * Supports both movies (timestamp) and TV shows (episode count).
 */
export interface WatchProgress {
  /** Which episode the user is on (for TV shows) */
  currentEpisode?: number;
  /** Total episodes (for TV shows) */
  totalEpisodes?: number;
  /** How many minutes in the user has watched (for movies) */
  minutesWatched?: number;
  /** Total runtime in minutes (for movies) */
  totalMinutes?: number;
}

/**
 * The user's personal review, attached only to "Watched" items.
 */
export interface UserReview {
  /** 1–10 star rating */
  rating: number;
  /** Free-form personal notes/takeaways */
  notes: string;
  /** User-created tags like "mind-bending", "comfort-watch" */
  tags: string[];
  /** ISO date string of when the user finished watching */
  dateCompleted: string;
}

// ─── The Main Entry (combines TMDB data + user data) ────────────────────────

/**
 * A single movie/show entry in the user's journal.
 *
 * WHY ONE INTERFACE INSTEAD OF THREE?
 * ───────────────────────────────────
 * A "Watching" entry might later move to "Watched" — if we used separate
 * types, we'd need to delete from one array and reconstruct in another.
 * With a single type + `shelf` discriminator, we just update the shelf field
 * and optionally attach a review. This is the "state machine" pattern.
 */
export interface MovieEntry {
  /**
   * Client-generated unique ID (crypto.randomUUID()).
   * When you move to Supabase, this becomes the primary key (UUID type).
   */
  id: string;

  /** Which shelf this entry is on — the core discriminator */
  shelf: Shelf;

  /** Snapshot of TMDB data at the time of adding */
  tmdb: TMDBMovieData;

  /** Only meaningful when shelf === "watching" */
  progress?: WatchProgress;

  /** Only meaningful when shelf === "watched" */
  review?: UserReview;

  /** ISO timestamp of when the user added this to their journal */
  addedAt: string;

  /** ISO timestamp of the last update (shelf move, progress change, etc.) */
  updatedAt: string;
}

// ─── Stats (derived data, not stored — computed on the fly) ─────────────────

/**
 * Computed statistics for the Stats Dashboard.
 * These are derived from the entries array and never persisted.
 *
 * WHY NOT STORE STATS?
 * ────────────────────
 * Derived data should be computed, not stored. If you store it, it can
 * get out of sync with the source data (a classic bug source). Instead,
 * we compute stats fresh every time the dashboard renders.
 */
export interface JournalStats {
  totalWatched: number;
  totalWatchTimeMins: number;
  averageRating: number;
  /** Genre → count, sorted by most frequent */
  favoriteGenres: { genre: string; count: number }[];
  /** Entries per month for a potential chart */
  watchedPerMonth: { month: string; count: number }[];
}
