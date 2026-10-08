/**
 * =============================================================================
 * Watch Analytics Dashboard — Cinematic Consumption Metrics & Episode Tracking
 * =============================================================================
 *
 * A comprehensive analytics dashboard for personal media consumption tracking:
 *  ─ Time-period toggle: All-Time / This Year / This Month
 *  ─ Metric stat cards: Hours Watched, Episodes, Movies, Shows
 *  ─ Granular Episode-Wise Watching Data: TV series progress bars & episode logs
 *  ─ Interactive genre filter pills with active states
 *  ─ Genre distribution bar chart with percentage shares
 *  ─ Filtered watch history grid with clickable cards
 *  ─ Full MediaDetailModal integration for viewing and updating entries
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
  CheckCircle2,
  ChevronRight,
  Sparkles,
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
  type TVShowEpisodeStats,
} from "@/lib/analytics";
import MediaDetailModal from "./MediaDetailModal";
import { MovieImage } from "./common/MovieImage";

// ─── Props ──────────────────────────────────────────────────────────────────

interface AnalyticsDashboardProps {
  entries: MovieEntry[];
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AnalyticsDashboard({ entries }: AnalyticsDashboardProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all-time");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedDetailEntry, setSelectedDetailEntry] = useState<MovieEntry | null>(null);

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

  const analytics = filteredAnalytics;
  const genreList = baseAnalytics.genreBreakdown;

  const handleGenreClick = useCallback(
    (genre: string) => {
      setSelectedGenre((prev) => (prev === genre ? null : genre));
    },
    []
  );

  const clearGenre = useCallback(() => setSelectedGenre(null), []);

  if (entries.length === 0) {
    return <AnalyticsEmptyState />;
  }

  const maxGenreCount = genreList.length > 0 ? genreList[0].count : 1;

  return (
    <>
      <div className="space-y-8" id="analytics-dashboard">
        {/* ── Time Period Toggle ──────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          {TIME_PERIODS.map((period) => (
            <button
              key={period.key}
              id={`period-${period.key}`}
              onClick={() => setTimePeriod(period.key)}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
                ${
                  timePeriod === period.key
                    ? "bg-[#E50914] text-white shadow-sm shadow-black/40"
                    : "text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent"
                }
              `}
            >
              {period.label}
            </button>
          ))}

          {/* Active genre badge with clear button */}
          {selectedGenre && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-[#292932] text-[#F5F5F5] text-sm animate-in fade-in">
              <span className="text-xs text-[#A1A1AA]">Filtered by:</span>
              <span className="font-medium">{selectedGenre}</span>
              <button
                onClick={clearGenre}
                className="p-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
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
            label="Episodes Watched"
            value={analytics.totalEpisodesWatched.toLocaleString()}
            detail={`across ${analytics.tvShowsProgress.length} TV series`}
            delay={60}
            id="stat-episodes"
          />
          <StatCard
            icon={<Clapperboard className="w-4 h-4" />}
            label="Movies Logged"
            value={analytics.totalMoviesLogged.toLocaleString()}
            detail={`${analytics.totalEntries} total titles`}
            delay={120}
            id="stat-movies"
          />
          <StatCard
            icon={<Star className="w-4 h-4 text-[#F5C542]" />}
            label="Avg Rating"
            value={analytics.averageRating > 0 ? analytics.averageRating.toFixed(1) : "—"}
            detail={analytics.averageRating > 0 ? "/10 average score" : "no reviews yet"}
            delay={180}
            id="stat-rating"
            accentStar
          />
        </div>

        {/* ── Watch Time Calculation: Movies vs Series Individual Breakdown ──── */}
        <div className="glass-card p-6 stagger-item space-y-4 border border-[#292932]" style={{ animationDelay: "190ms" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/5 border border-[#292932] text-[#A1A1AA]">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Watch Time Calculation
                  <span className="text-xs font-normal text-[#A1A1AA] bg-white/5 px-2 py-0.5 rounded-full border border-[#292932]">
                    {analytics.totalWatchTimeMins.toLocaleString()} total mins
                  </span>
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Individual calculation of minutes and hours spent on movies vs. TV series
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-[#F5F5F5]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E50914]" />
                Movies: {analytics.totalWatchTimeMins > 0 ? Math.round((analytics.movieWatchTimeMins / analytics.totalWatchTimeMins) * 100) : 0}%
              </span>
              <span className="flex items-center gap-1.5 text-[#A1A1AA]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5C542]" />
                Series: {analytics.totalWatchTimeMins > 0 ? Math.round((analytics.seriesWatchTimeMins / analytics.totalWatchTimeMins) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Dual Proportional Split Bar */}
          <div className="w-full bg-[#0B0B0F] rounded-full h-3 overflow-hidden flex border border-[#292932]">
            <div
              className="h-full bg-[#E50914] transition-all duration-500"
              style={{
                width: `${analytics.totalWatchTimeMins > 0 ? (analytics.movieWatchTimeMins / analytics.totalWatchTimeMins) * 100 : 50}%`,
              }}
              title={`Movies: ${analytics.movieWatchTimeMins.toLocaleString()} min`}
            />
            <div
              className="h-full bg-[#F5C542] transition-all duration-500"
              style={{
                width: `${analytics.totalWatchTimeMins > 0 ? (analytics.seriesWatchTimeMins / analytics.totalWatchTimeMins) * 100 : 50}%`,
              }}
              title={`Series: ${analytics.seriesWatchTimeMins.toLocaleString()} min`}
            />
          </div>

          {/* Individual Detailed Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-2 pt-1">
            {/* Movie Minutes Card */}
            <div className="p-4 rounded-xl bg-[#15151C] border border-[#292932] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/5 text-[#E50914] border border-[#292932]">
                  <Clapperboard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#A1A1AA] font-medium">
                    Movie Minutes
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {analytics.movieWatchTimeMins.toLocaleString()} <span className="text-sm font-normal text-stone-400">min</span>
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {analytics.movieWatchTimeHours} hours &bull; {analytics.totalMoviesLogged} films logged
                  </p>
                </div>
              </div>
            </div>

            {/* Series Minutes Card */}
            <div className="p-4 rounded-xl bg-[#15151C] border border-[#292932] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/5 text-[#F5C542] border border-[#292932]">
                  <Tv className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#A1A1AA] font-medium">
                    Series Minutes
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {analytics.seriesWatchTimeMins.toLocaleString()} <span className="text-sm font-normal text-stone-400">min</span>
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {analytics.seriesWatchTimeHours} hours &bull; {analytics.totalEpisodesWatched} episodes watched
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── EPISODE-WISE WATCHING BREAKDOWN (TV SERIES) ──────────── */}
        {analytics.tvShowsProgress.length > 0 && (
          <div className="glass-card p-6 stagger-item space-y-5" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <ListVideo className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Episode-Wise Watching Breakdown
                    <span className="text-xs font-normal text-purple-400/80 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                      {analytics.totalEpisodesWatched} episodes total
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Granular progress tracking and consumption time per TV series
                  </p>
                </div>
              </div>
            </div>

            {/* TV Series Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {analytics.tvShowsProgress.map((show) => {
                const originalEntry = entries.find((e) => e.id === show.id);
                return (
                  <div
                    key={show.id}
                    onClick={() => originalEntry && setSelectedDetailEntry(originalEntry)}
                    className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 hover:border-purple-500/30 transition-all cursor-pointer group flex gap-4"
                  >
                    {/* Poster thumbnail */}
                    <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 shadow-md bg-stone-900 border border-stone-800/40">
                      <MovieImage
                        src={show.posterUrl}
                        alt={show.title}
                        title={show.title}
                        mediaType="tv"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        fallbackIconClassName="w-6 h-6 text-stone-600"
                      />
                    </div>

                    {/* Progress Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                            {show.title}
                          </h4>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                              show.shelf === "watched"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-purple-500/20 text-purple-300"
                            }`}
                          >
                            {show.shelf === "watched" ? "Completed" : "Watching"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs text-stone-400">
                          <span className="font-medium text-stone-300">
                            {show.episodesWatched} / {show.totalEpisodes} episodes
                          </span>
                          <span>•</span>
                          <span className="text-purple-400 font-medium">
                            {show.totalHours} hrs watched
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between text-[11px] text-stone-500">
                          <span>Progress</span>
                          <span className="font-semibold text-stone-300">
                            {show.percentComplete}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-[#5c0f92] rounded-full"
                            style={{ width: `${show.percentComplete}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Granular Episode Watch History Log */}
            {analytics.recentEpisodeLogs.length > 0 && (
              <div className="pt-4 border-t border-stone-800/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-stone-500" />
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                    Recent Episode Activity Log
                  </h4>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-48 overflow-y-auto pr-1 hide-scrollbar">
                  {analytics.recentEpisodeLogs.slice(0, 12).map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-stone-900/40 border border-stone-800/60 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-medium text-white truncate">
                          {log.showTitle}
                        </p>
                        <p className="text-[11px] text-stone-400 truncate">
                          <span className="text-purple-400 font-mono mr-1">
                            S{log.seasonNumber}:E{log.episodeNumber}
                          </span>
                          {log.episodeTitle || `Episode ${log.episodeNumber}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-stone-500">
                          {new Date(log.watchedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <p className="text-[10px] text-stone-600">{log.runtimeMinutes}m</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Genre Sorter ───────────────────────────────────────── */}
        {genreList.length > 0 && (
          <div className="glass-card p-6 stagger-item" style={{ animationDelay: "240ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-purple-400/60" />
              <h3 className="text-sm font-semibold text-white">
                Genre Distribution
              </h3>
              <span className="text-xs text-stone-500 ml-auto">
                Click a genre to filter analytics
              </span>
            </div>

            {/* ── Genre Pills (clickable) ────────────────────────── */}
            <div className="flex flex-wrap gap-2 mb-5">
              {genreList.slice(0, 14).map(({ genre, count, percentage }) => (
                <button
                  key={genre}
                  id={`genre-pill-${genre.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => handleGenreClick(genre)}
                  className={`
                    analytics-genre-pill group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                    transition-all duration-200 border cursor-pointer
                    ${
                      selectedGenre === genre
                        ? "bg-purple-500/20 border-purple-500/40 text-purple-100 shadow-sm shadow-purple-500/10 scale-105"
                        : "bg-white/[0.03] border-white/[0.06] text-stone-400 hover:border-purple-500/30 hover:text-stone-200 hover:bg-white/[0.06]"
                    }
                  `}
                >
                  <span className="font-medium">{genre}</span>
                  <span
                    className={`text-xs tabular-nums ${
                      selectedGenre === genre ? "text-purple-300/70" : "text-stone-600"
                    }`}
                  >
                    {count}
                  </span>
                  <span
                    className={`text-[10px] tabular-nums ${
                      selectedGenre === genre ? "text-purple-400/50" : "text-stone-700"
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
                    w-full flex items-center gap-3 group/bar rounded-lg py-1 cursor-pointer
                    transition-all duration-150
                    ${selectedGenre === genre ? "opacity-100" : selectedGenre ? "opacity-40 hover:opacity-80" : "opacity-100"}
                  `}
                >
                  <span
                    className={`text-xs w-28 truncate text-right transition-colors ${
                      selectedGenre === genre
                        ? "text-purple-300 font-medium"
                        : "text-zinc-400 group-hover/bar:text-purple-300/80"
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
                            ? `linear-gradient(90deg, rgba(245, 158, 11, 0.8), rgba(251, 191, 36, 0.6))`
                            : `linear-gradient(90deg, rgba(245, 158, 11, ${0.6 - idx * 0.04}), rgba(217, 170, 119, ${0.4 - idx * 0.03}))`,
                      }}
                    />
                  </div>
                  <span
                    className={`text-xs w-12 tabular-nums transition-colors ${
                      selectedGenre === genre
                        ? "text-purple-400 font-bold"
                        : "text-zinc-500 group-hover/bar:text-zinc-300"
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
          <div className="glass-card p-6 stagger-item space-y-4" style={{ animationDelay: "360ms" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400/60" />
                <h3 className="text-sm font-semibold text-white">
                  {selectedGenre ? `${selectedGenre} — ` : ""}Watch History
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                {analytics.filteredEntries.length} entries • click to open details
              </span>
            </div>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {analytics.filteredEntries
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 24)
                .map((entry, idx) => (
                  <HistoryCard
                    key={entry.id}
                    entry={entry}
                    index={idx}
                    onClick={() => setSelectedDetailEntry(entry)}
                  />
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
            <div className="inline-flex p-4 rounded-2xl bg-purple-500/8 mb-4">
              <BarChart3 className="w-8 h-8 text-purple-500/30" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-300 mb-1">
              No matches found
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              {selectedGenre
                ? `No entries found for "${selectedGenre}" in this time period.`
                : "No entries found for this time period."}
            </p>
            {selectedGenre && (
              <button
                onClick={clearGenre}
                className="mt-4 px-4 py-2 text-sm text-purple-400 border border-purple-500/20 rounded-lg hover:bg-purple-500/10 transition-colors"
              >
                Clear genre filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Media Detail Modal */}
      <MediaDetailModal
        entry={selectedDetailEntry ? entries.find((e) => e.id === selectedDetailEntry.id) ?? selectedDetailEntry : null}
        isOpen={!!selectedDetailEntry}
        onClose={() => setSelectedDetailEntry(null)}
      />
    </>
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
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl transition-colors duration-500 ${
          accentStar
            ? "bg-yellow-500/10 group-hover:bg-yellow-500/15"
            : "bg-purple-500/10 group-hover:bg-purple-500/15"
        }`}
      />
      <div className="relative">
        <div
          className={`flex items-center gap-2 mb-2 ${
            accentStar ? "text-yellow-400/80" : "text-purple-400/80"
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

// ─── History Card (Interactive & Clickable) ─────────────────────────────────

function HistoryCard({
  entry,
  index,
  onClick,
}: {
  entry: MovieEntry;
  index: number;
  onClick: () => void;
}) {
  const isTV = entry.tmdb.mediaType === "tv";

  return (
    <div
      onClick={onClick}
      className="group rounded-xl overflow-hidden border border-white/[0.04] bg-zinc-900/50 hover:border-purple-500/30 transition-all duration-300 stagger-item cursor-pointer hover:scale-[1.02]"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Poster */}
      <div className="aspect-[2/3] relative overflow-hidden bg-stone-900">
        <MovieImage
          src={entry.tmdb.posterUrl}
          alt={entry.tmdb.title}
          title={entry.tmdb.title}
          mediaType={entry.tmdb.mediaType}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fallbackIconClassName="w-6 h-6 text-stone-700"
          loading="lazy"
        />

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
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-purple-400 border border-purple-500/20">
              <Star className="w-2.5 h-2.5 fill-purple-400" />
              {entry.review.rating}
            </span>
          </div>
        )}

        {/* Shelf indicator */}
        {entry.shelf === "watching" && (
          <div className="absolute bottom-1.5 left-1.5">
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-purple-500/20 backdrop-blur-sm text-[10px] text-purple-300 border border-purple-500/20">
              <Play className="w-2.5 h-2.5" />
              Watching
            </span>
          </div>
        )}

        {/* Hover overlay with click prompt */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-2">
          <span className="text-[10px] text-purple-300 font-medium">Click to view</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-xs font-medium text-white truncate group-hover:text-purple-200 transition-colors">
          {entry.tmdb.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {entry.tmdb.releaseYear && (
            <span className="text-[10px] text-stone-500">
              {entry.tmdb.releaseYear}
            </span>
          )}
          {isTV && entry.progress?.currentEpisode && (
            <span className="text-[10px] text-purple-500/80 font-mono">
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
        <Flame className="w-16 h-16 mx-auto text-purple-500/20 mb-4 animate-float" />
        <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-purple-500/5 blur-xl" />
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
