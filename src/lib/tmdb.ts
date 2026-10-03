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

import type { TMDBMovieData, TMDBSeasonData, EpisodeItem } from "./types";

// ─── Configuration ───────────────────────────────────────────────────────────

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const FALLBACK_KEY = "87134b2fccb320822ab5b1ab6f194987";

/**
 * Read the API key from environment variables.
 * Falls back to embedded public key so user searches never break.
 */
function getApiKey(): string {
  return (
    process.env.NEXT_PUBLIC_TMDB_API_KEY ||
    process.env.TMDB_API_KEY ||
    FALLBACK_KEY
  );
}

// ─── Raw TMDB Response Types ────────────────────────────────────────────────

interface TMDBSearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
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

interface TMDBSeasonRaw {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
  overview?: string;
}

interface TMDBEpisodeRaw {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview?: string;
  runtime?: number;
  still_path?: string | null;
  air_date?: string;
}

interface TMDBSeasonDetailsRaw {
  _id: string;
  id: number;
  season_number: number;
  name: string;
  overview?: string;
  episodes: TMDBEpisodeRaw[];
}

interface TMDBMovieDetails {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  episode_run_time?: number[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  seasons?: TMDBSeasonRaw[];
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
    posterUrl: result.poster_path
      ? `${TMDB_IMAGE_BASE}${result.poster_path}`
      : null,
    backdropUrl: result.backdrop_path
      ? `${TMDB_BACKDROP_BASE}${result.backdrop_path}`
      : null,
    releaseYear: (result.release_date ?? result.first_air_date ?? "").slice(0, 4) || "N/A",
    runtime: 0,
    genres: result.genre_ids
      .map((id) => GENRE_MAP[id])
      .filter(Boolean),
    director: "",
    overview: result.overview || "No overview available.",
    mediaType,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Search for movies and TV shows by title.
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
    return [];
  }

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

  const director =
    data.credits?.crew.find(
      (person) =>
        person.job === "Director" ||
        person.job === "Creator" ||
        person.job === "Executive Producer"
    )?.name ?? "Unknown";

  let runtime = 0;
  if (mediaType === "movie") {
    runtime = data.runtime ?? 0;
  } else if (data.episode_run_time && data.episode_run_time.length > 0) {
    runtime = Math.round(
      data.episode_run_time.reduce((sum, r) => sum + r, 0) /
        data.episode_run_time.length
    );
  } else if (data.runtime) {
    runtime = data.runtime;
  } else {
    runtime = 45; // sensible TV average default
  }

  // Format TV seasons with episode counts
  let seasons: TMDBSeasonData[] | undefined = undefined;
  let totalEpisodes: number | undefined = undefined;
  let totalSeasons: number | undefined = undefined;

  if (mediaType === "tv") {
    totalEpisodes = data.number_of_episodes || 0;
    totalSeasons = data.number_of_seasons || (data.seasons ? data.seasons.filter(s => s.season_number > 0).length : 1);

    if (data.seasons && data.seasons.length > 0) {
      seasons = data.seasons
        .filter((s) => s.season_number > 0) // Filter out specials/season 0 for main list
        .map((s) => ({
          seasonNumber: s.season_number,
          name: s.name || `Season ${s.season_number}`,
          episodeCount: s.episode_count || 10,
          posterUrl: s.poster_path ? `${TMDB_IMAGE_BASE}${s.poster_path}` : null,
          overview: s.overview || "",
          episodes: Array.from({ length: s.episode_count || 10 }, (_, i) => ({
            seasonNumber: s.season_number,
            episodeNumber: i + 1,
            title: `Episode ${i + 1}`,
            runtime: runtime || 45,
          })),
        }));
    }
  }

  return {
    tmdbId: data.id,
    title: data.title ?? data.name ?? "Unknown Title",
    posterUrl: data.poster_path
      ? `${TMDB_IMAGE_BASE}${data.poster_path}`
      : null,
    backdropUrl: data.backdrop_path
      ? `${TMDB_BACKDROP_BASE}${data.backdrop_path}`
      : null,
    releaseYear: (data.release_date ?? data.first_air_date ?? "").slice(0, 4) || "N/A",
    runtime,
    genres: data.genres.map((g) => g.name),
    director,
    overview: data.overview || "No overview available.",
    mediaType,
    totalEpisodes,
    totalSeasons,
    seasons,
  };
}

/**
 * Fetch detailed episode data for a TV show season.
 */
export async function fetchSeasonEpisodes(
  tvTmdbId: number,
  seasonNumber: number
): Promise<EpisodeItem[]> {
  try {
    const data = await tmdbFetch<TMDBSeasonDetailsRaw>(
      `/tv/${tvTmdbId}/season/${seasonNumber}`,
      { language: "en-US" }
    );

    if (data.episodes && data.episodes.length > 0) {
      return data.episodes.map((ep) => ({
        seasonNumber: ep.season_number,
        episodeNumber: ep.episode_number,
        title: ep.name || `Episode ${ep.episode_number}`,
        runtime: ep.runtime || 45,
        overview: ep.overview || "",
        airDate: ep.air_date,
      }));
    }
  } catch (err) {
    console.warn(`Could not fetch episodes for TV ${tvTmdbId} S${seasonNumber}:`, err);
  }

  // Fallback generation if offline / API failure
  return Array.from({ length: 10 }, (_, i) => ({
    seasonNumber,
    episodeNumber: i + 1,
    title: `Episode ${i + 1}`,
    runtime: 45,
  }));
}
