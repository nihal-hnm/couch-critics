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
import { computeStats, formatWatchTime, formatDaysAndHours, formatHours } from "@/lib/stats";

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
          <Flame className="w-16 h-16 mx-auto text-[#A1A1AA]/30 mb-4 animate-float" />
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-[#E50914]/5 blur-xl" />
        </div>
        <h3 className="text-xl font-semibold text-[#F5F5F5]">
          No stats yet
        </h3>
        <p className="text-[#A1A1AA] mt-2 text-sm max-w-sm mx-auto leading-relaxed">
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
          className="glass-card p-5 stagger-item relative overflow-hidden group border border-[#292932]"
          style={{ animationDelay: "0ms" }}
        >
          {/* Subtle ambient glow */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#E50914]/5 rounded-full blur-2xl group-hover:bg-[#E50914]/10 transition-colors duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[#A1A1AA] mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-medium">
                Watch Time
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatDaysAndHours(stats.totalWatchTimeMins)}
            </p>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Overall time ({Math.round(stats.totalWatchTimeMins / 60)}h total)
            </p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#292932] text-[11px] text-[#A1A1AA] font-mono">
              <span>🎬 {formatHours(stats.movieMinutes)} movie</span>
              <span>•</span>
              <span>📺 {formatHours(stats.seriesMinutes)} series</span>
            </div>
          </div>
        </div>

        {/* Movies Watched */}
        <div
          className="glass-card p-5 stagger-item relative overflow-hidden group border border-[#292932]"
          style={{ animationDelay: "60ms" }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[#A1A1AA] mb-2">
              <Film className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-medium">
                Completed
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalWatched}
            </p>
            <p className="text-xs text-[#A1A1AA] mt-1">
              <span className="text-[#F5F5F5] font-semibold">{watchingCount}</span> watching · <span className="text-[#F5F5F5] font-semibold">{toWatchCount}</span> queued
            </p>
          </div>
        </div>

        {/* Average Rating */}
        <div
          className="glass-card p-5 stagger-item relative overflow-hidden group border border-[#292932]"
          style={{ animationDelay: "120ms" }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#F5C542]/5 rounded-full blur-2xl group-hover:bg-[#F5C542]/10 transition-colors duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[#F5C542] mb-2">
              <Star className="w-4 h-4 fill-[#F5C542]" />
              <span className="text-xs uppercase tracking-wider font-medium">
                Avg Rating
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"}
              <span className="text-sm font-normal text-[#A1A1AA]">/10</span>
            </p>
            <p className="text-xs text-[#A1A1AA] mt-1">
              across {stats.totalWatched} reviews
            </p>
          </div>
        </div>

        {/* Top Genre — with mini donut */}
        <div
          className="glass-card p-5 stagger-item relative overflow-hidden group border border-[#292932]"
          style={{ animationDelay: "180ms" }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[#A1A1AA] mb-2">
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
                    stroke="#292932"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke="#F5C542"
                    strokeWidth="4"
                    strokeDasharray={`${(stats.favoriteGenres[0].count / entries.length) * 94.2} 94.2`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                    style={{ animation: "donut-fill 1s ease-out" }}
                  />
                </svg>
              )}
            </div>
            <p className="text-xs text-[#A1A1AA] mt-1">
              {stats.favoriteGenres[0]?.count ?? 0} titles in this genre
            </p>
          </div>
        </div>
      </div>

      {/* ── Genre Distribution ──────────────────────────────── */}
      {stats.favoriteGenres.length > 0 && (
        <div
          className="glass-card p-5 stagger-item border border-[#292932]"
          style={{ animationDelay: "240ms" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#A1A1AA]" />
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
                <span className="text-xs text-[#A1A1AA] w-28 truncate text-right group-hover/bar:text-white transition-colors">
                  {genre}
                </span>
                <div className="flex-1 h-4 bg-[#0B0B0F] rounded-md overflow-hidden border border-[#292932]">
                  <div
                    className="h-full rounded-sm transition-all duration-700 ease-out"
                    style={{
                      width: `${(count / maxGenreCount) * 100}%`,
                      backgroundColor: idx === 0 ? "#E50914" : idx < 3 ? "#F5C542" : "#292932",
                      animationDelay: `${idx * 100}ms`,
                    }}
                  />
                </div>
                <span className="text-xs text-[#A1A1AA] w-8 group-hover/bar:text-white transition-colors font-mono">
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
          className="glass-card p-5 stagger-item border border-[#292932]"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[#A1A1AA]" />
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
                  <span className="text-[10px] text-[#A1A1AA] group-hover/bar:text-white transition-colors">
                    {count}
                  </span>
                  <div className="w-full bg-[#0B0B0F] rounded-t-md overflow-hidden flex-1 flex items-end border-t border-x border-[#292932]">
                    <div
                      className="w-full rounded-t-md transition-all duration-700 ease-out group-hover/bar:opacity-90"
                      style={{
                        height: `${Math.max(4, heightPercent)}%`,
                        backgroundColor: "#E50914",
                        animationDelay: `${idx * 80}ms`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-[#A1A1AA] group-hover/bar:text-white transition-colors">
                    {month.slice(5)} {/* Show MM only */}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#292932]">
            <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
              <Eye className="w-3 h-3 text-[#A1A1AA]" />
              {stats.watchedPerMonth.length} months tracked
            </div>
            <div className="text-xs text-[#A1A1AA]">
              Most active:{" "}
              <span className="text-[#F5F5F5] font-semibold">
                {stats.watchedPerMonth.reduce((max, m) => m.count > max.count ? m : max, stats.watchedPerMonth[0])?.month ?? "—"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
