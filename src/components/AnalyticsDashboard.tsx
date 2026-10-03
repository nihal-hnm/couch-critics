/**
 * =============================================================================
 * Watch Analytics Dashboard — Cinematic Consumption Metrics
 * =============================================================================
 *
 * A comprehensive analytics dashboard for personal media consumption tracking.
 *
 * FEATURES:
 *  ─ Time-period toggle: All-Time / This Year / This Month
 *  ─ Metric stat cards: Hours Watched, Episodes, Movies, Shows
 *  ─ Interactive genre filter pills with active states
 *  ─ Genre distribution bar chart with percentage shares
 *  ─ Filtered watch history grid
 *  ─ Loading skeletons and empty states
 *  ─ Warm cinematic glassmorphism aesthetic
 *
 * All data is derived — nothing stored, nothing stale.
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Clock,
  Film,
  Tv,
  Star,
  TrendingUp,
  Timer,
  Clapperboard,
  ListVideo,
  Hash,
  X,
  Flame,
  BarChart3,
  Calendar,
  Eye,
  Play,
} from "lucide-react";
import type { MovieEntry } from "@/lib/types";
import {
  type TimePeriod,
  TIME_PERIODS,
  filterByTimePeriod,
  filterByGenre,
  computeAnalytics,
  formatHours,
  formatHoursVerbose,
} from "@/lib/analytics";

// ─── Props ──────────────────────────────────────────────────────────────────

interface AnalyticsDashboardProps {
  entries: MovieEntry[];
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AnalyticsDashboard({ entries }: AnalyticsDashboardProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all-time");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  /**
   * COMPUTATION PIPELINE:
   * 1. Filter by time period → base set
   * 2. Compute analytics on base set (for genre breakdown display)
   * 3. Filter by genre → final set
   * 4. Compute analytics on final set (for stat cards)
   *
   * WHY TWO COMPUTATIONS?
   * We need the genre breakdown from the time-filtered (but not genre-filtered)
   * set to show all genres. But the stat cards should reflect the genre filter.
   */
  const timeFilteredEntries = useMemo(
    () => filterByTimePeriod(entries, timePeriod),
    [entries, timePeriod]
  );

  const baseAnalytics = useMemo(
    () => computeAnalytics(timeFilteredEntries),
    [timeFilteredEntries]
  );

  const genreFilteredEntries = useMemo(
    () => filterByGenre(timeFilteredEntries, selectedGenre),
    [timeFilteredEntries, selectedGenre]
  );

  const filteredAnalytics = useMemo(
    () => computeAnalytics(genreFilteredEntries),
    [genreFilteredEntries]
  );

  // Use base analytics for genre display, filtered analytics for stat cards
  const analytics = filteredAnalytics;
  const genreList = baseAnalytics.genreBreakdown;

  const handleGenreClick = useCallback(
    (genre: string) => {
      setSelectedGenre((prev) => (prev === genre ? null : genre));
    },
    []
  );

  const clearGenre = useCallback(() => setSelectedGenre(null), []);

  // ── Empty State ─────────────────────────────────────────────────────────

  if (entries.length === 0) {
    return <AnalyticsEmptyState />;
  }

  const maxGenreCount = genreList.length > 0 ? genreList[0].count : 1;

  return (
    <div className="space-y-6" id="analytics-dashboard">
      {/* ── Time Period Toggle ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {TIME_PERIODS.map((period) => (
          <button
            key={period.key}
            id={`period-${period.key}`}
            onClick={() => setTimePeriod(period.key)}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${
                timePeriod === period.key
                  ? "bg-amber-500/15 text-amber-100 border border-amber-500/25 shadow-sm shadow-amber-500/10"
                  : "text-stone-500 hover:text-stone-300 hover:bg-white/5 border border-transparent"
              }
            `}
          >
            {period.label}
          </button>
        ))}

        {/* Active genre badge with clear button */}
        {selectedGenre && (
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm animate-in fade-in">
            <span className="text-xs text-stone-500">Filtered by:</span>
            <span className="font-medium">{selectedGenre}</span>
            <button
              onClick={clearGenre}
              className="p-0.5 rounded hover:bg-white/10 transition-colors"
              aria-label={`Clear ${selectedGenre} filter`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Timer className="w-4 h-4" />}
          label="Hours Watched"
          value={formatHours(analytics.totalHoursWatched)}
          detail={formatHoursVerbose(analytics.totalWatchTimeMins)}
          delay={0}
          id="stat-hours"
        />
        <StatCard
          icon={<ListVideo className="w-4 h-4" />}
          label="Episodes"
          value={analytics.totalEpisodesWatched.toLocaleString()}
          detail={`across ${analytics.totalShowsLogged + (entries.filter(e => e.tmdb.mediaType === "tv" && e.shelf === "watching").length)} shows`}
          delay={60}
          id="stat-episodes"
        />
        <StatCard
          icon={<Clapperboard className="w-4 h-4" />}
          label="Movies Logged"
          value={analytics.totalMoviesLogged.toLocaleString()}
          detail={`${analytics.totalEntries} total entries`}
          delay={120}
          id="stat-movies"
        />
        <StatCard
          icon={<Star className="w-4 h-4" />}
          label="Avg Rating"
          value={analytics.averageRating > 0 ? analytics.averageRating.toFixed(1) : "—"}
          detail={analytics.averageRating > 0 ? "/10 score" : "no reviews yet"}
          delay={180}
          id="stat-rating"
          accentStar
        />
      </div>

      {/* ── Genre Sorter ───────────────────────────────────────── */}
      {genreList.length > 0 && (
        <div className="glass-card p-5 stagger-item" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-amber-400/60" />
            <h3 className="text-sm font-semibold text-white">
              Genre Distribution
            </h3>
            <span className="text-xs text-stone-600 ml-auto">
              Click a genre to filter
            </span>
          </div>

          {/* ── Genre Pills (clickable) ────────────────────────── */}
          <div className="flex flex-wrap gap-2 mb-5">
            {genreList.slice(0, 12).map(({ genre, count, percentage }) => (
              <button
                key={genre}
                id={`genre-pill-${genre.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => handleGenreClick(genre)}
                className={`
                  analytics-genre-pill group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                  transition-all duration-200 border
                  ${
                    selectedGenre === genre
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-100 shadow-sm shadow-amber-500/10"
                      : "bg-white/[0.03] border-white/[0.06] text-stone-400 hover:border-amber-500/20 hover:text-stone-200 hover:bg-white/[0.05]"
                  }
                `}
              >
                <span className="font-medium">{genre}</span>
                <span
                  className={`text-xs tabular-nums ${
                    selectedGenre === genre ? "text-amber-300/70" : "text-stone-600"
                  }`}
                >
                  {count}
                </span>
                <span
                  className={`text-[10px] tabular-nums ${
                    selectedGenre === genre ? "text-amber-400/50" : "text-stone-700"
                  }`}
                >
                  {percentage}%
                </span>
              </button>
            ))}
          </div>

          {/* ── Genre Bar Chart ─────────────────────────────────── */}
          <div className="space-y-2">
            {genreList.slice(0, 10).map(({ genre, count, percentage }, idx) => (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className={`
                  w-full flex items-center gap-3 group/bar rounded-lg py-0.5
                  transition-all duration-150
                  ${selectedGenre === genre ? "opacity-100" : selectedGenre ? "opacity-50 hover:opacity-80" : "opacity-100"}
                `}
              >
                <span
                  className={`text-xs w-24 truncate text-right transition-colors ${
                    selectedGenre === genre
                      ? "text-amber-300 font-medium"
                      : "text-zinc-400 group-hover/bar:text-amber-300/80"
                  }`}
                >
                  {genre}
                </span>
                <div className="flex-1 h-5 bg-zinc-800/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(count / maxGenreCount) * 100}%`,
                      background:
                        selectedGenre === genre
                          ? `linear-gradient(90deg, rgba(245, 158, 11, 0.7), rgba(251, 191, 36, 0.5))`
                          : `linear-gradient(90deg, rgba(245, 158, 11, ${0.6 - idx * 0.04}), rgba(217, 170, 119, ${0.4 - idx * 0.03}))`,
                      animationDelay: `${idx * 80}ms`,
                    }}
                  />
                </div>
                <span
                  className={`text-xs w-12 tabular-nums transition-colors ${
                    selectedGenre === genre
                      ? "text-amber-400"
                      : "text-zinc-600 group-hover/bar:text-zinc-400"
                  }`}
                >
                  {percentage}%
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Filtered Watch History Grid ─────────────────────────── */}
      {analytics.filteredEntries.length > 0 && (
        <div className="glass-card p-5 stagger-item" style={{ animationDelay: "360ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400/60" />
              <h3 className="text-sm font-semibold text-white">
                {selectedGenre ? `${selectedGenre} — ` : ""}Watch History
              </h3>
            </div>
            <span className="text-xs text-stone-600">
              {analytics.filteredEntries.length} entries
            </span>
          </div>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {analytics.filteredEntries
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 24)
              .map((entry, idx) => (
                <HistoryCard key={entry.id} entry={entry} index={idx} />
              ))}
          </div>

          {analytics.filteredEntries.length > 24 && (
            <p className="text-center text-xs text-stone-600 mt-4">
              Showing 24 of {analytics.filteredEntries.length} entries
            </p>
          )}
        </div>
      )}

      {/* ── Empty filter state ──────────────────────────────────── */}
      {analytics.filteredEntries.length === 0 && entries.length > 0 && (
        <div className="glass-card p-10 text-center stagger-item" style={{ animationDelay: "360ms" }}>
          <div className="inline-flex p-4 rounded-2xl bg-amber-500/8 mb-4">
            <BarChart3 className="w-8 h-8 text-amber-500/30" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-300 mb-1">
            No matches
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            {selectedGenre
              ? `No entries found for "${selectedGenre}" in this time period.`
              : "No entries found for this time period."}
          </p>
          {selectedGenre && (
            <button
              onClick={clearGenre}
              className="mt-4 px-4 py-2 text-sm text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/10 transition-colors"
            >
              Clear genre filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  detail,
  delay,
  id,
  accentStar = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  delay: number;
  id: string;
  accentStar?: boolean;
}) {
  return (
    <div
      id={id}
      className="glass-card p-5 stagger-item relative overflow-hidden group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Ambient glow */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl transition-colors duration-500 ${
          accentStar
            ? "bg-yellow-500/10 group-hover:bg-yellow-500/15"
            : "bg-amber-500/10 group-hover:bg-amber-500/15"
        }`}
      />
      <div className="relative">
        <div
          className={`flex items-center gap-2 mb-2 ${
            accentStar ? "text-yellow-400/80" : "text-amber-400/80"
          }`}
        >
          {icon}
          <span className="text-xs uppercase tracking-wider font-medium">
            {label}
          </span>
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-500 mt-1">{detail}</p>
      </div>
    </div>
  );
}

// ─── History Card ───────────────────────────────────────────────────────────

function HistoryCard({
  entry,
  index,
}: {
  entry: MovieEntry;
  index: number;
}) {
  const isTV = entry.tmdb.mediaType === "tv";

  return (
    <div
      className="group rounded-xl overflow-hidden border border-white/[0.04] bg-zinc-900/50 hover:border-amber-500/15 transition-all duration-300 stagger-item"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Poster */}
      <div className="aspect-[2/3] relative overflow-hidden">
        {entry.tmdb.posterUrl ? (
          <img
            src={entry.tmdb.posterUrl}
            alt={entry.tmdb.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
            <Film className="w-6 h-6 text-stone-700" />
          </div>
        )}

        {/* Media type badge */}
        <div className="absolute top-1.5 left-1.5">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-stone-300 border border-white/10">
            {isTV ? <Tv className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
            {isTV ? "TV" : "Film"}
          </span>
        </div>

        {/* Rating badge */}
        {entry.review?.rating && (
          <div className="absolute top-1.5 right-1.5">
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-amber-400 border border-amber-500/20">
              <Star className="w-2.5 h-2.5 fill-amber-400" />
              {entry.review.rating}
            </span>
          </div>
        )}

        {/* Shelf indicator */}
        {entry.shelf === "watching" && (
          <div className="absolute bottom-1.5 left-1.5">
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/20 backdrop-blur-sm text-[10px] text-emerald-300 border border-emerald-500/20">
              <Play className="w-2.5 h-2.5" />
              Watching
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-xs font-medium text-white truncate">
          {entry.tmdb.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {entry.tmdb.releaseYear && (
            <span className="text-[10px] text-stone-500">
              {entry.tmdb.releaseYear}
            </span>
          )}
          {isTV && entry.progress?.currentEpisode && (
            <span className="text-[10px] text-amber-500/60">
              Ep {entry.progress.currentEpisode}
              {entry.progress.totalEpisodes
                ? `/${entry.progress.totalEpisodes}`
                : ""}
            </span>
          )}
          {!isTV && entry.tmdb.runtime > 0 && (
            <span className="text-[10px] text-stone-600">
              {entry.tmdb.runtime}m
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────

function AnalyticsEmptyState() {
  return (
    <div className="text-center py-20" id="analytics-empty">
      <div className="relative inline-block">
        <Flame className="w-16 h-16 mx-auto text-amber-500/20 mb-4 animate-float" />
        <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-amber-500/5 blur-xl" />
      </div>
      <h3 className="text-xl font-semibold text-zinc-300">
        No analytics yet
      </h3>
      <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
        Start adding movies and TV shows to your journal to see your viewing
        analytics come to life.
      </p>
    </div>
  );
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" id="analytics-skeleton">
      {/* Time period toggle skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-9 w-24 rounded-lg bg-zinc-800/50"
          />
        ))}
      </div>

      {/* Stat cards skeleton */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-5">
            <div className="h-3 w-20 bg-zinc-800/50 rounded mb-3" />
            <div className="h-7 w-16 bg-zinc-800/50 rounded mb-2" />
            <div className="h-2.5 w-24 bg-zinc-800/50 rounded" />
          </div>
        ))}
      </div>

      {/* Genre section skeleton */}
      <div className="glass-card p-5">
        <div className="h-4 w-36 bg-zinc-800/50 rounded mb-4" />
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 rounded-full bg-zinc-800/50"
              style={{ width: `${60 + i * 12}px` }}
            />
          ))}
        </div>
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-24 bg-zinc-800/50 rounded" />
              <div className="flex-1 h-5 bg-zinc-800/30 rounded-full" />
              <div className="h-3 w-8 bg-zinc-800/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
