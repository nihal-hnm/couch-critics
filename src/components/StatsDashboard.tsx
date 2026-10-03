/**
 * =============================================================================
 * Stats Dashboard — Cinematic Analytics with Warm Visualizations
 * =============================================================================
 *
 * Redesigned with the warm cinematic aesthetic:
 *  - Glassmorphism stat cards with warm purple accents
 *  - SVG donut chart for top genre visualization
 *  - Warm gradient bar charts for genre distribution
 *  - Purple-tinted monthly activity bars
 *  - Staggered entrance animations
 *
 * ALL DATA IS DERIVED — nothing stored, nothing stale.
 * See lib/stats.ts for the computation logic.
 */

"use client";

import { useMemo } from "react";
import {
  Clock,
  Film,
  Tv,
  Star,
  TrendingUp,
  Calendar,
  Award,
  Flame,
  Eye,
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
        <div className="relative inline-block">
          <Flame className="w-16 h-16 mx-auto text-purple-500/20 mb-4 animate-float" />
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-purple-500/5 blur-xl" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-300">
          No stats yet
        </h3>
        <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
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
        <div
          className="glass-card p-5 stagger-item relative overflow-hidden group"
          style={{ animationDelay: "0ms" }}
        >
          {/* Warm ambient glow */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/15 transition-colors duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 text-purple-400/80 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-medium">
                Watch Time
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatWatchTime(stats.totalWatchTimeMins)}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {stats.totalWatchTimeMins.toLocaleString()} total minutes
            </p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-purple-500/10 text-[11px] text-purple-300/80 font-mono">
              <span>🎬 {stats.movieMinutes.toLocaleString()}m movie</span>
              <span>•</span>
              <span>📺 {stats.seriesMinutes.toLocaleString()}m series</span>
            </div>
          </div>
        </div>

        {/* Movies Watched */}
        <div
          className="glass-card p-5 stagger-item relative overflow-hidden group"
          style={{ animationDelay: "60ms" }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-500/8 rounded-full blur-2xl group-hover:bg-purple-500/12 transition-colors duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 text-purple-400/80 mb-2">
              <Film className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-medium">
                Completed
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalWatched}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              <span className="text-purple-400/60">{watchingCount}</span> watching · <span className="text-purple-400/60">{toWatchCount}</span> queued
            </p>
          </div>
        </div>

        {/* Average Rating */}
        <div
          className="glass-card p-5 stagger-item relative overflow-hidden group"
          style={{ animationDelay: "120ms" }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-500/8 rounded-full blur-2xl group-hover:bg-purple-500/12 transition-colors duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 text-purple-400/80 mb-2">
              <Star className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-medium">
                Avg Rating
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"}
              <span className="text-sm font-normal text-zinc-500">/10</span>
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              across {stats.totalWatched} reviews
            </p>
          </div>
        </div>

        {/* Top Genre — with mini donut */}
        <div
          className="glass-card p-5 stagger-item relative overflow-hidden group"
          style={{ animationDelay: "180ms" }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-500/8 rounded-full blur-2xl group-hover:bg-purple-500/12 transition-colors duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 text-purple-400/80 mb-2">
              <Award className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-medium">
                Top Genre
              </span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-white">
                {stats.favoriteGenres[0]?.genre ?? "—"}
              </p>
              {/* Mini donut chart showing genre proportion */}
              {stats.favoriteGenres[0] && (
                <svg width="28" height="28" viewBox="0 0 36 36" className="shrink-0 -rotate-90">
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke="rgba(217, 170, 119, 0.1)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke="rgb(245, 158, 11)"
                    strokeWidth="4"
                    strokeDasharray={`${(stats.favoriteGenres[0].count / entries.length) * 94.2} 94.2`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                    style={{ animation: "donut-fill 1s ease-out" }}
                  />
                </svg>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {stats.favoriteGenres[0]?.count ?? 0} titles in this genre
            </p>
          </div>
        </div>
      </div>

      {/* ── Genre Distribution ──────────────────────────────── */}
      {stats.favoriteGenres.length > 0 && (
        <div
          className="glass-card p-5 stagger-item"
          style={{ animationDelay: "240ms" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-purple-400/60" />
            <h3 className="text-sm font-semibold text-white">
              Genre Distribution
            </h3>
          </div>

          <div className="space-y-2.5">
            {stats.favoriteGenres.slice(0, 8).map(({ genre, count }, idx) => (
              <div
                key={genre}
                className="flex items-center gap-3 group/bar"
              >
                <span className="text-xs text-zinc-400 w-28 truncate text-right group-hover/bar:text-purple-300/80 transition-colors">
                  {genre}
                </span>
                <div className="flex-1 h-5 bg-zinc-800/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(count / maxGenreCount) * 100}%`,
                      background: `linear-gradient(90deg, rgba(245, 158, 11, ${0.6 - idx * 0.05}), rgba(217, 170, 119, ${0.4 - idx * 0.03}))`,
                      animationDelay: `${idx * 100}ms`,
                    }}
                  />
                </div>
                <span className="text-xs text-zinc-600 w-8 group-hover/bar:text-zinc-400 transition-colors">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Monthly Activity ────────────────────────────────── */}
      {stats.watchedPerMonth.length > 0 && (
        <div
          className="glass-card p-5 stagger-item"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-purple-400/60" />
            <h3 className="text-sm font-semibold text-white">
              Monthly Activity
            </h3>
          </div>

          <div className="flex items-end gap-1.5 h-32">
            {stats.watchedPerMonth.slice(-12).map(({ month, count }, idx) => {
              const maxMonthly = Math.max(
                ...stats.watchedPerMonth.map((m) => m.count)
              );
              const heightPercent =
                maxMonthly > 0 ? (count / maxMonthly) * 100 : 0;

              return (
                <div
                  key={month}
                  className="flex-1 flex flex-col items-center gap-1 group/bar"
                >
                  <span className="text-[10px] text-zinc-600 group-hover/bar:text-purple-400/80 transition-colors">
                    {count}
                  </span>
                  <div className="w-full bg-zinc-800/30 rounded-t-md overflow-hidden flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-md transition-all duration-700 ease-out group-hover/bar:opacity-90"
                      style={{
                        height: `${Math.max(4, heightPercent)}%`,
                        background: `linear-gradient(to top, rgba(245, 158, 11, 0.5), rgba(217, 170, 119, 0.25))`,
                        animationDelay: `${idx * 80}ms`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-600 group-hover/bar:text-zinc-400 transition-colors">
                    {month.slice(5)} {/* Show MM only */}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-500/8">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Eye className="w-3 h-3 text-purple-500/40" />
              {stats.watchedPerMonth.length} months tracked
            </div>
            <div className="text-xs text-zinc-500">
              Most active:{" "}
              <span className="text-purple-400/70">
                {stats.watchedPerMonth.reduce((max, m) => m.count > max.count ? m : max, stats.watchedPerMonth[0])?.month ?? "—"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
