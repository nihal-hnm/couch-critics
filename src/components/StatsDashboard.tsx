/**
 * =============================================================================
 * Stats Dashboard — Computed Analytics
 * =============================================================================
 *
 * A card-based dashboard showing:
 *  - Total watch time (days/hours/minutes)
 *  - Total movies watched
 *  - Average rating
 *  - Favorite genres (horizontal bar chart)
 *  - Activity timeline (monthly watch counts)
 *
 * ALL DATA IS DERIVED — nothing stored, nothing stale.
 * See lib/stats.ts for the computation logic.
 */

"use client";

import { useMemo } from "react";
import {
  Clock,
  Film,
  Star,
  TrendingUp,
  BarChart3,
  Calendar,
  Award,
} from "lucide-react";
import type { MovieEntry } from "@/lib/types";
import { computeStats, formatWatchTime } from "@/lib/stats";

interface StatsDashboardProps {
  entries: MovieEntry[];
}

export default function StatsDashboard({ entries }: StatsDashboardProps) {
  /**
   * useMemo prevents recomputing stats on every render.
   * It only recalculates when `entries` changes.
   */
  const stats = useMemo(() => computeStats(entries), [entries]);

  const watchingCount = entries.filter((e) => e.shelf === "watching").length;
  const toWatchCount = entries.filter((e) => e.shelf === "toWatch").length;

  // Find the genre with the highest count for scaling the bar chart
  const maxGenreCount =
    stats.favoriteGenres.length > 0
      ? stats.favoriteGenres[0].count
      : 1;

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <BarChart3 className="w-14 h-14 mx-auto text-zinc-600 mb-4" />
        <h3 className="text-xl font-semibold text-zinc-400">
          No stats yet
        </h3>
        <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto">
          Start adding movies to your journal to see your viewing analytics
          come to life.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stat Cards Row ──────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Watch Time */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20">
          <div className="flex items-center gap-2 text-indigo-300 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">
              Watch Time
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatWatchTime(stats.totalWatchTimeMins)}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {stats.totalWatchTimeMins.toLocaleString()} total minutes
          </p>
        </div>

        {/* Movies Watched */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-300 mb-2">
            <Film className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">
              Completed
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.totalWatched}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {watchingCount} watching · {toWatchCount} queued
          </p>
        </div>

        {/* Average Rating */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-600/20 to-orange-600/10 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-300 mb-2">
            <Star className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">
              Avg Rating
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"}
            <span className="text-sm font-normal text-zinc-400">/10</span>
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            across {stats.totalWatched} reviews
          </p>
        </div>

        {/* Top Genre */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-600/20 to-rose-600/10 border border-pink-500/20">
          <div className="flex items-center gap-2 text-pink-300 mb-2">
            <Award className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">
              Top Genre
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.favoriteGenres[0]?.genre ?? "—"}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {stats.favoriteGenres[0]?.count ?? 0} titles in this genre
          </p>
        </div>
      </div>

      {/* ── Genre Distribution ──────────────────────────────── */}
      {stats.favoriteGenres.length > 0 && (
        <div className="p-5 rounded-2xl bg-zinc-800/30 border border-zinc-700/30">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold text-white">
              Genre Distribution
            </h3>
          </div>

          <div className="space-y-2.5">
            {stats.favoriteGenres.slice(0, 8).map(({ genre, count }) => (
              <div key={genre} className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 w-28 truncate text-right">
                  {genre}
                </span>
                <div className="flex-1 h-5 bg-zinc-700/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(count / maxGenreCount) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-zinc-500 w-8">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Monthly Activity ────────────────────────────────── */}
      {stats.watchedPerMonth.length > 0 && (
        <div className="p-5 rounded-2xl bg-zinc-800/30 border border-zinc-700/30">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold text-white">
              Monthly Activity
            </h3>
          </div>

          <div className="flex items-end gap-1.5 h-32">
            {stats.watchedPerMonth.slice(-12).map(({ month, count }) => {
              const maxMonthly = Math.max(
                ...stats.watchedPerMonth.map((m) => m.count)
              );
              const heightPercent =
                maxMonthly > 0 ? (count / maxMonthly) * 100 : 0;

              return (
                <div
                  key={month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-[10px] text-zinc-500">
                    {count}
                  </span>
                  <div className="w-full bg-zinc-700/30 rounded-t-md overflow-hidden flex-1 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-500"
                      style={{ height: `${Math.max(4, heightPercent)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 rotate-0">
                    {month.slice(5)} {/* Show MM only */}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
