/**
 * =============================================================================
 * Stats Computation Utilities
 * =============================================================================
 *
 * Pure functions that derive statistics from the entries array.
 * "Pure" means: same input → same output, no side effects.
 * This makes them trivially testable and predictable.
 */

import type { MovieEntry, JournalStats } from "./types";

/**
 * Compute all dashboard statistics from the entries array.
 *
 * WHY COMPUTE INSTEAD OF STORE?
 * ─────────────────────────────
 * If we stored stats separately, they could drift out of sync with
 * the actual entries (e.g., user deletes a movie but stats still count it).
 * Computing on the fly guarantees consistency. With ~1000 entries, this
 * runs in <1ms — no memoization needed yet.
 */
export function computeStats(entries: MovieEntry[]): JournalStats {
  const watched = entries.filter((e) => e.shelf === "watched");

  let movieMinutes = 0;
  let seriesMinutes = 0;

  for (const entry of entries) {
    if (entry.tmdb.mediaType === "movie") {
      if (entry.shelf === "watched") {
        movieMinutes += entry.tmdb.runtime || 0;
      } else if (entry.shelf === "watching") {
        movieMinutes += entry.progress?.minutesWatched || 0;
      }
    } else {
      // TV Series
      const avgEpRuntime = entry.tmdb.runtime || 45;
      if (entry.shelf === "watching") {
        const watchedCount =
          entry.progress?.watchedEpisodes?.length ||
          entry.progress?.currentEpisode ||
          0;
        seriesMinutes += entry.progress?.minutesWatched || watchedCount * avgEpRuntime;
      } else if (entry.shelf === "watched") {
        const watchedCount =
          entry.progress?.watchedEpisodes?.length ||
          entry.progress?.totalEpisodes ||
          entry.tmdb.totalEpisodes ||
          10;
        seriesMinutes += entry.progress?.minutesWatched || watchedCount * avgEpRuntime;
      }
    }
  }

  const totalWatchTimeMins = movieMinutes + seriesMinutes;

  // Average rating: only count entries that have a review with a rating
  const ratings = watched
    .filter((e) => e.review?.rating)
    .map((e) => e.review!.rating);

  const averageRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
      : 0;

  // Genre frequency: count how often each genre appears across ALL entries
  const genreCounts: Record<string, number> = {};
  entries.forEach((entry) => {
    entry.tmdb.genres.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const favoriteGenres = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count); // Most frequent first

  // Watched per month: group by YYYY-MM for the chart
  const monthCounts: Record<string, number> = {};
  watched.forEach((entry) => {
    if (entry.review?.dateCompleted) {
      const month = entry.review.dateCompleted.slice(0, 7); // "2024-03"
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    }
  });

  const watchedPerMonth = Object.entries(monthCounts)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month)); // Chronological

  return {
    totalWatched: watched.length,
    totalWatchTimeMins,
    movieMinutes,
    seriesMinutes,
    averageRating,
    favoriteGenres,
    watchedPerMonth,
  };
}

/**
 * Format minutes into a human-readable string.
 * Examples: "2d 5h 30m", "0h 45m", "12h 0m"
 */
export function formatWatchTime(totalMins: number): string {
  if (totalMins === 0) return "0h 0m";

  const days = Math.floor(totalMins / (24 * 60));
  const hours = Math.floor((totalMins % (24 * 60)) / 60);
  const minutes = totalMins % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  parts.push(`${hours}h`);
  parts.push(`${minutes}m`);

  return parts.join(" ");
}
