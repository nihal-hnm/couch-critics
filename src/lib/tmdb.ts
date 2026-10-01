/**
 * =============================================================================
 * TMDB API Service
 * =============================================================================
 *
 * WHY A DEDICATED SERVICE FILE?
 * ─────────────────────────────
 * Separating API logic from components follows the "Service Layer" pattern.
 * Benefits:
 *   1. Components stay focused on rendering (Single Responsibility Principle).
 *   2. When you add caching or switch to a different API, only this file changes.
 *   3. Error handling is centralized — no duplicated try/catch in 10 components.
 *
 * TMDB API KEY
 * ────────────
 * The key lives in `.env.local` as NEXT_PUBLIC_TMDB_API_KEY.
 * The "NEXT_PUBLIC_" prefix makes it available in the browser bundle.
 * For a server-only key (more secure), you'd use TMDB_API_KEY and call
 * this from a Route Handler instead. We use the public approach here for
 * simplicity since TMDB keys are free and rate-limited, not secret.
 */

import type { TMDBMovieData } from "./types";

// ─── Configuration ───────────────────────────────────────────────────────────

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

/**
 * Read the API key from environment variables.
 * Falls back to empty string — we check for it at call time.
 */
function getApiKey(): string {
  return process.env.NEXT_PUBLIC_TMDB_API_KEY ?? "";
}

// ─── Raw TMDB Response Types ────────────────────────────────────────────────
// These are what the API actually returns. We transform them into our own
// TMDBMovieData shape to decouple our app from TMDB's schema.

interface TMDBSearchResult {
  id: number;
  title?: string; // movies use `title`
  name?: string; // TV shows use `name`
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  overview: string;
  media_type?: string;
}

interface TMDBSearchResponse {
  results: TMDBSearchResult[];
  total_results: number;
}

interface TMDBMovieDetails {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  episode_run_time?: number[];
  genres: { id: number; name: string }[];
  overview: string;
  credits?: {
    crew: { job: string; name: string }[];
  };
}

// ─── Genre ID → Name Mapping ────────────────────────────────────────────────
// TMDB search results return genre_ids (numbers), not genre names.
// This map lets us convert without an extra API call.

const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  // TV genres
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

// ─── Error Handling ─────────────────────────────────────────────────────────

/**
 * Custom error class for TMDB-specific failures.
 *
 * WHY A CUSTOM ERROR?
 * ───────────────────
 * The generic `Error` class doesn't carry status codes or error types.
 * By extending it, we can pattern-match on `error.code` in the UI to
 * show different messages for "no results" vs. "API key missing" vs.
 * "network failure."
 */
export class TMDBError extends Error {
  constructor(
    message: string,
    public code: "NO_API_KEY" | "NETWORK_ERROR" | "NO_RESULTS" | "API_ERROR"
  ) {
    super(message);
    this.name = "TMDBError";
  }
}

// ─── Internal Helpers ───────────────────────────────────────────────────────

/**
 * Generic fetch wrapper with error handling.
 * Handles the repetitive pattern: fetch → check status → parse JSON.
 */
async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new TMDBError(
      "TMDB API key is missing. Add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.",
      "NO_API_KEY"
    );
  }

  // Build the URL with query parameters
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", apiKey);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new TMDBError(
        `TMDB API returned status ${response.status}: ${response.statusText}`,
        "API_ERROR"
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (error instanceof TMDBError) throw error;

    // Otherwise it's a network-level failure (no internet, DNS, etc.)
    throw new TMDBError(
      "Failed to connect to TMDB. Check your internet connection.",
      "NETWORK_ERROR"
    );
  }
}

/**
 * Transform a TMDB search result into our app's TMDBMovieData shape.
 *
 * WHY TRANSFORM?
 * ──────────────
 * TMDB's schema uses snake_case and has different field names for movies
 * vs TV shows. By normalizing here, every downstream consumer gets a
 * consistent, camelCase interface. This is the "Adapter Pattern."
 */
function transformSearchResult(
  result: TMDBSearchResult,
  mediaType: "movie" | "tv"
): TMDBMovieData {
  return {
    tmdbId: result.id,
    title: result.title ?? result.name ?? "Unknown Title",
    // Guard against null poster_path — show a fallback in the UI instead
    posterUrl: result.poster_path
      ? `${TMDB_IMAGE_BASE}${result.poster_path}`
      : null,
    releaseYear: (result.release_date ?? result.first_air_date ?? "").slice(0, 4) || "N/A",
    runtime: 0, // Search results don't include runtime; fetched separately if needed
    genres: result.genre_ids
      .map((id) => GENRE_MAP[id])
      .filter(Boolean), // Remove undefined genres
    director: "", // Not available in search results; fetched on detail view
    overview: result.overview || "No overview available.",
    mediaType,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Search for movies and TV shows by title.
 *
 * Uses TMDB's "multi" search to get both movies and TV shows in one call.
 * Results are sorted by popularity (TMDB's default).
 *
 * @param query - The search string (movie/show title)
 * @returns Array of TMDBMovieData objects
 * @throws TMDBError on failure
 */
export async function searchMovies(query: string): Promise<TMDBMovieData[]> {
  if (!query.trim()) {
    return [];
  }

  const data = await tmdbFetch<TMDBSearchResponse>("/search/multi", {
    query: query.trim(),
    include_adult: "false",
    language: "en-US",
    page: "1",
  });

  if (data.total_results === 0) {
    return []; // Return empty array, not an error — "no results" is a valid state
  }

  // Filter to only movies and TV shows (multi search can return people too)
  return data.results
    .filter(
      (result) =>
        result.media_type === "movie" || result.media_type === "tv"
    )
    .map((result) =>
      transformSearchResult(result, result.media_type as "movie" | "tv")
    );
}

/**
 * Fetch full details for a specific movie or TV show.
 *
 * WHY A SEPARATE DETAIL FETCH?
 * ────────────────────────────
 * The search endpoint doesn't return runtime or director credits.
 * We call this when the user adds a movie to their journal, so we
 * have complete data stored locally. This avoids needing to call
 * the API again when displaying the entry.
 *
 * The `append_to_response=credits` trick lets us fetch credits
 * in the same request — TMDB's way of avoiding N+1 queries.
 *
 * @param tmdbId - The TMDB ID of the movie/show
 * @param mediaType - "movie" or "tv"
 * @returns Complete TMDBMovieData with runtime and director
 */
export async function getMovieDetails(
  tmdbId: number,
  mediaType: "movie" | "tv"
): Promise<TMDBMovieData> {
  const endpoint = mediaType === "movie"
    ? `/movie/${tmdbId}`
    : `/tv/${tmdbId}`;

  const data = await tmdbFetch<TMDBMovieDetails>(endpoint, {
    append_to_response: "credits",
    language: "en-US",
  });

  // Extract director — for TV shows, look for "Creator" or fall back to first crew member
  const director =
    data.credits?.crew.find(
      (person) =>
        person.job === "Director" ||
        person.job === "Creator" ||
        person.job === "Executive Producer"
    )?.name ?? "Unknown";

  // For TV shows, runtime is an array of episode runtimes — take the average
  let runtime = 0;
  if (mediaType === "movie") {
    runtime = data.runtime ?? 0;
  } else if (data.episode_run_time && data.episode_run_time.length > 0) {
    runtime = Math.round(
      data.episode_run_time.reduce((sum, r) => sum + r, 0) /
        data.episode_run_time.length
    );
  }

  return {
    tmdbId: data.id,
    title: data.title ?? data.name ?? "Unknown Title",
    posterUrl: data.poster_path
      ? `${TMDB_IMAGE_BASE}${data.poster_path}`
      : null,
    releaseYear: (data.release_date ?? data.first_air_date ?? "").slice(0, 4) || "N/A",
    runtime,
    genres: data.genres.map((g) => g.name),
    director,
    overview: data.overview || "No overview available.",
    mediaType,
  };
}
