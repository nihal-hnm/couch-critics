/**
 * =============================================================================
 * Analytics Computation Engine
 * =============================================================================
 *
 * Advanced analytics computations for the Watch Analytics dashboard.
 * Builds on top of the basic stats in stats.ts, adding:
 *   - Time-period filtering (All-Time, This Year, This Month)
 *   - Separate movie vs. TV show tracking
 *   - Episode count aggregation
 *   - Genre-based metric recalculation
 *   - Filtered watch history
 *
 * DESIGN: Pure functions — same input → same output, no side effects.
 * All data is derived from the MovieEntry[] array, never stored.
 */

import type { MovieEntry } from "./types";

// ─── Time Period Types ──────────────────────────────────────────────────────

export type TimePeriod = "all-time" | "this-year" | "this-month";

export interface TimePeriodOption {
  key: TimePeriod;
  label: string;
}

export const TIME_PERIODS: TimePeriodOption[] = [
  { key: "all-time", label: "All-Time" },
  { key: "this-year", label: "This Year" },
  { key: "this-month", label: "This Month" },
];

// ─── Analytics Output Shape ─────────────────────────────────────────────────

export interface GenreBreakdown {
  genre: string;
  count: number;
  /** Percentage of total entries with this genre */
  percentage: number;
  /** Total watch time in minutes for entries with this genre */
  watchTimeMins: number;
  /** Number of episodes tracked for TV entries with this genre */
  episodeCount: number;
}

export interface TVShowEpisodeStats {
  id: string;
  title: string;
  posterUrl: string | null;
  episodesWatched: number;
  totalEpisodes: number;
  currentSeason?: number;
  currentEpisode?: number;
  percentComplete: number;
  totalHours: number;
  genres: string[];
  watchedEpisodeCodes: string[];
  lastUpdated: string;
  shelf: string;
}

export interface EpisodeActivityLog {
  id: string;
  showTitle: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeTitle?: string;
  runtimeMinutes?: number;
  watchedAt: string;
  posterUrl: string | null;
}

export interface AnalyticsData {
  /** Total hours (as decimal) of watched content */
  totalHoursWatched: number;
  /** Total watch time in raw minutes */
  totalWatchTimeMins: number;
  /** Total episodes watched (sum of currentEpisode / watchedEpisodes for TV shows) */
  totalEpisodesWatched: number;
  /** Count of completed movies */
  totalMoviesLogged: number;
  /** Count of completed TV shows */
  totalShowsLogged: number;
  /** Total entries in the filtered set */
  totalEntries: number;
  /** Average rating across reviewed entries */
  averageRating: number;
  /** Genre breakdown sorted by count descending */
  genreBreakdown: GenreBreakdown[];
  /** Detailed episode-wise statistics for every TV series */
  tvShowsProgress: TVShowEpisodeStats[];
  /** Granular chronological log of episodes watched */
  recentEpisodeLogs: EpisodeActivityLog[];
  /** The filtered entries themselves */
  filteredEntries: MovieEntry[];
}

// ─── Time Filtering ─────────────────────────────────────────────────────────

/**
 * Filter entries to a specific time period based on when they were completed
 * (review.dateCompleted) or added (addedAt) as a fallback.
 *
 * WHY dateCompleted FIRST?
 * ────────────────────────
 * For "watched" items, dateCompleted represents when the user actually
 * finished the content. addedAt is when they added it to the journal,
 * which could be months earlier (e.g., adding to the toWatch list).
 * For non-watched items, addedAt is the only relevant date.
 */
function getEntryDate(entry: MovieEntry): Date {
  if (entry.review?.dateCompleted) {
    return new Date(entry.review.dateCompleted);
  }
  return new Date(entry.updatedAt || entry.addedAt);
}

export function filterByTimePeriod(
  entries: MovieEntry[],
  period: TimePeriod
): MovieEntry[] {
  if (period === "all-time") return entries;

  const now = new Date();

  if (period === "this-year") {
    const yearStart = new Date(now.getFullYear(), 0, 1);
    return entries.filter((e) => getEntryDate(e) >= yearStart);
  }

  if (period === "this-month") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return entries.filter((e) => getEntryDate(e) >= monthStart);
  }

  return entries;
}

// ─── Genre Filtering ────────────────────────────────────────────────────────

export function filterByGenre(
  entries: MovieEntry[],
  genre: string | null
): MovieEntry[] {
  if (!genre) return entries;
  return entries.filter((e) => e.tmdb.genres.includes(genre));
}

// ─── Core Analytics Computation ─────────────────────────────────────────────

/**
 * Compute the full analytics payload from a set of entries.
 *
 * This is the main workhorse function. It receives already-filtered entries
 * (by time period + genre) and computes all metrics from scratch.
 *
 * PERFORMANCE: With ~1000 entries, this runs in <2ms. We iterate the array
 * once using reduce to compute all aggregates in a single pass, then do
 * a second pass for genre distribution. No memoization needed at this scale.
 */
export function computeAnalytics(entries: MovieEntry[]): AnalyticsData {
  // ── Single-pass aggregation ───────────────────────────────────────────

  let totalWatchTimeMins = 0;
  let totalEpisodesWatched = 0;
  let totalMoviesLogged = 0;
  let totalShowsLogged = 0;
  let ratingSum = 0;
  let ratingCount = 0;

  const genreCounts: Record<
    string,
    { count: number; watchTimeMins: number; episodeCount: number }
  > = {};

  for (const entry of entries) {
    // ── Watch time ────────────────────────────────────────────────────
    // For movies: runtime is the full movie duration
    // For TV: runtime is the average episode length, so we multiply by
    //         the number of episodes watched for actual watch time
    if (entry.tmdb.mediaType === "movie") {
      totalWatchTimeMins += entry.tmdb.runtime || 0;
    } else {
      // TV show: estimate total watch time from episodes × avg episode runtime
      const episodesWatched = entry.progress?.currentEpisode ?? 0;
      const episodeRuntime = entry.tmdb.runtime || 0;
      totalWatchTimeMins += episodesWatched * episodeRuntime;
    }

    // ── Episode count ─────────────────────────────────────────────────
    if (entry.tmdb.mediaType === "tv") {
      const eps = entry.progress?.currentEpisode ?? 0;
      // If on the "watched" shelf with no progress data, assume at least
      // totalEpisodes were watched (or 0 if unknown)
      if (entry.shelf === "watched" && eps === 0) {
        totalEpisodesWatched += entry.progress?.totalEpisodes ?? 0;
      } else {
        totalEpisodesWatched += eps;
      }
    }

    // ── Movies / Shows logged ─────────────────────────────────────────
    if (entry.shelf === "watched") {
      if (entry.tmdb.mediaType === "movie") totalMoviesLogged++;
      if (entry.tmdb.mediaType === "tv") totalShowsLogged++;
    }

    // ── Ratings ───────────────────────────────────────────────────────
    if (entry.review?.rating) {
      ratingSum += entry.review.rating;
      ratingCount++;
    }

    // ── Genre accumulation ────────────────────────────────────────────
    for (const genre of entry.tmdb.genres) {
      if (!genreCounts[genre]) {
        genreCounts[genre] = { count: 0, watchTimeMins: 0, episodeCount: 0 };
      }
      genreCounts[genre].count++;

      if (entry.tmdb.mediaType === "movie") {
        genreCounts[genre].watchTimeMins += entry.tmdb.runtime || 0;
      } else {
        const eps = entry.progress?.currentEpisode ?? 0;
        genreCounts[genre].watchTimeMins += eps * (entry.tmdb.runtime || 0);
        genreCounts[genre].episodeCount += eps;
      }
    }
  }

  // ── Build genre breakdown ───────────────────────────────────────────

  const totalForPercentage = entries.length || 1;
  const genreBreakdown: GenreBreakdown[] = Object.entries(genreCounts)
    .map(([genre, data]) => ({
      genre,
      count: data.count,
      percentage: Math.round((data.count / totalForPercentage) * 100),
      watchTimeMins: data.watchTimeMins,
      episodeCount: data.episodeCount,
    }))
    .sort((a, b) => b.count - a.count);

  // ── Build TV Shows episode-wise progress ────────────────────────────
  const tvShowsProgress: TVShowEpisodeStats[] = entries
    .filter((e) => e.tmdb.mediaType === "tv")
    .map((e) => {
      const watchedCount =
        e.progress?.watchedEpisodes && e.progress.watchedEpisodes.length > 0
          ? e.progress.watchedEpisodes.length
          : e.shelf === "watched"
          ? e.progress?.totalEpisodes || e.tmdb.totalEpisodes || 10
          : e.progress?.currentEpisode ?? 0;

      const total =
        e.progress?.totalEpisodes ||
        e.tmdb.totalEpisodes ||
        (e.shelf === "watched" ? Math.max(watchedCount, 10) : 10);

      const percent = total > 0 ? Math.min(100, Math.round((watchedCount / total) * 100)) : 0;
      const episodeRuntime = e.tmdb.runtime || 45;
      const hours = Math.round(((watchedCount * episodeRuntime) / 60) * 10) / 10;

      return {
        id: e.id,
        title: e.tmdb.title,
        posterUrl: e.tmdb.posterUrl,
        episodesWatched: watchedCount,
        totalEpisodes: total,
        currentSeason: e.progress?.currentSeason,
        currentEpisode: e.progress?.currentEpisode,
        percentComplete: percent,
        totalHours: hours,
        genres: e.tmdb.genres,
        watchedEpisodeCodes: e.progress?.watchedEpisodes || [],
        lastUpdated: e.updatedAt || e.addedAt,
        shelf: e.shelf,
      };
    })
    .sort((a, b) => b.episodesWatched - a.episodesWatched);

  // ── Build Recent Episode Activity Log ────────────────────────────────
  const recentEpisodeLogs: EpisodeActivityLog[] = [];
  for (const entry of entries) {
    if (entry.tmdb.mediaType === "tv" && entry.progress?.episodeHistory) {
      for (const log of entry.progress.episodeHistory) {
        recentEpisodeLogs.push({
          id: log.id,
          showTitle: entry.tmdb.title,
          seasonNumber: log.seasonNumber,
          episodeNumber: log.episodeNumber,
          episodeTitle: log.episodeTitle,
          runtimeMinutes: log.runtimeMinutes || entry.tmdb.runtime || 45,
          watchedAt: log.watchedAt,
          posterUrl: entry.tmdb.posterUrl,
        });
      }
    }
  }
  recentEpisodeLogs.sort(
    (a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
  );

  return {
    totalHoursWatched: Math.round((totalWatchTimeMins / 60) * 10) / 10,
    totalWatchTimeMins,
    totalEpisodesWatched,
    totalMoviesLogged,
    totalShowsLogged,
    totalEntries: entries.length,
    averageRating:
      ratingCount > 0
        ? Math.round((ratingSum / ratingCount) * 10) / 10
        : 0,
    genreBreakdown,
    tvShowsProgress,
    recentEpisodeLogs,
    filteredEntries: entries,
  };
}

// ─── Formatting Helpers ─────────────────────────────────────────────────────

/**
 * Format hours into a compact display string.
 * Examples: "142.5h", "1,204.3h", "0h"
 */
export function formatHours(hours: number): string {
  if (hours === 0) return "0h";
  if (hours >= 1000) return `${hours.toLocaleString()}h`;
  return `${hours}h`;
}

/**
 * Format hours into a verbose multi-unit display.
 * Examples: "5d 22h", "142h 30m", "45m"
 */
export function formatHoursVerbose(totalMins: number): string {
  if (totalMins === 0) return "0m";

  const days = Math.floor(totalMins / (24 * 60));
  const hours = Math.floor((totalMins % (24 * 60)) / 60);
  const minutes = totalMins % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 && days === 0) parts.push(`${minutes}m`);

  return parts.join(" ");
}
