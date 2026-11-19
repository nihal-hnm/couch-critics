/**
 * =============================================================================
 * TV Series Release Radar & Air Date Tracker
 * =============================================================================
 *
 * Tracks live episode air dates, season returns, and production renewal status
 * for TV series queued in your To-Watch backlog (deduplicated, without watched/watching clutter).
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Tv,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ChevronRight,
  BookmarkPlus,
  Radio,
  Search,
} from "lucide-react";
import type { MovieEntry } from "@/lib/types";
import { getTVReleaseRadar, type TVReleaseRadarInfo } from "@/lib/tmdb";
import { MovieImage } from "./common/MovieImage";
import MediaDetailModal from "./MediaDetailModal";

interface ReleaseRadarViewProps {
  entries: MovieEntry[];
  onOpenSearch?: () => void;
}

interface SeriesRadarEntry {
  entry: MovieEntry;
  radar: TVReleaseRadarInfo | null;
  loading: boolean;
}

export function ReleaseRadarView({ entries, onOpenSearch }: ReleaseRadarViewProps) {
  const [radarData, setRadarData] = useState<Record<string, TVReleaseRadarInfo | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<MovieEntry | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "airingSoon" | "returning" | "ended">("all");

  // Gather TV series — strictly To Watch (Backlog), deduplicated by tmdbId and title
  // ("watched" and "watching" entries are completely removed from TV Radar)
  const tvEntries = useMemo(() => {
    const seenIds = new Set<number>();
    const seenTitles = new Set<string>();
    const list: MovieEntry[] = [];

    for (const e of entries) {
      if (e.tmdb?.mediaType !== "tv") continue;
      // Exclude Watched and Watching shelves as requested
      if (e.shelf === "watched" || e.shelf === "watching") continue;
      if (e.shelf !== "toWatch") continue;

      const id = e.tmdb.tmdbId;
      const title = e.tmdb.title?.toLowerCase().trim();

      // Deduplicate strictly
      if (id && seenIds.has(id)) continue;
      if (title && seenTitles.has(title)) continue;

      if (id) seenIds.add(id);
      if (title) seenTitles.add(title);
      list.push(e);
    }

    return list;
  }, [entries]);

  // Fetch radar info for all TV series
  const fetchRadar = async () => {
    setIsLoading(true);
    const results: Record<string, TVReleaseRadarInfo | null> = {};

    const promises = tvEntries.map(async (entry) => {
      const tmdbId = entry.tmdb?.tmdbId;
      if (!tmdbId) return;
      try {
        const info = await getTVReleaseRadar(tmdbId);
        results[entry.id] = info;
      } catch {
        results[entry.id] = null;
      }
    });

    await Promise.all(promises);
    setRadarData(results);
    setIsLoading(false);
  };

  useEffect(() => {
    if (tvEntries.length > 0) {
      fetchRadar();
    } else {
      setIsLoading(false);
    }
  }, [tvEntries.length]);

  // Combine entries with their radar info
  const combinedEntries: SeriesRadarEntry[] = useMemo(() => {
    return tvEntries.map((entry) => ({
      entry,
      radar: radarData[entry.id] ?? null,
      loading: isLoading && radarData[entry.id] === undefined,
    }));
  }, [tvEntries, radarData, isLoading]);

  // Calculate relative air date badge
  function getAirDateBadge(airDateStr?: string | null) {
    if (!airDateStr) return null;
    const airDate = new Date(airDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((airDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { text: "Airing Today", urgent: true, days: 0 };
    }
    if (diffDays === 1) {
      return { text: "Airing Tomorrow", urgent: true, days: 1 };
    }
    if (diffDays > 1 && diffDays <= 7) {
      return { text: `In ${diffDays} days`, urgent: true, days: diffDays };
    }
    if (diffDays > 7 && diffDays <= 30) {
      return { text: `In ${Math.ceil(diffDays / 7)} weeks`, urgent: false, days: diffDays };
    }
    if (diffDays > 30) {
      return {
        text: airDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
        urgent: false,
        days: diffDays,
      };
    }
    return {
      text: airDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      urgent: false,
      days: diffDays,
    };
  }

  // Filtered & sorted entries
  const filtered = useMemo(() => {
    return combinedEntries
      .filter(({ radar }) => {
        if (statusFilter === "airingSoon") {
          return Boolean(radar?.nextEpisode?.airDate);
        }
        if (statusFilter === "returning") {
          return (
            radar?.status === "Returning Series" ||
            radar?.inProduction ||
            (radar?.status !== "Ended" && radar?.status !== "Canceled" && !radar?.nextEpisode)
          );
        }
        if (statusFilter === "ended") {
          return radar?.status === "Ended" || radar?.status === "Canceled";
        }
        return true;
      })
      .sort((a, b) => {
        // Sort priority: Airing soonest first, then returning series, then alphabetical
        const aDate = a.radar?.nextEpisode?.airDate;
        const bDate = b.radar?.nextEpisode?.airDate;
        if (aDate && bDate) return aDate.localeCompare(bDate);
        if (aDate && !bDate) return -1;
        if (!aDate && bDate) return 1;

        return a.entry.tmdb.title.localeCompare(b.entry.tmdb.title);
      });
  }, [combinedEntries, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    let airingCount = 0;
    let returningCount = 0;
    let endedCount = 0;

    combinedEntries.forEach(({ radar }) => {
      if (radar?.nextEpisode?.airDate) {
        airingCount++;
      } else if (radar?.status === "Returning Series" || radar?.inProduction) {
        returningCount++;
      } else if (radar?.status === "Ended" || radar?.status === "Canceled") {
        endedCount++;
      }
    });

    return { airingCount, returningCount, endedCount };
  }, [combinedEntries]);

  if (tvEntries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#15151C] border border-[#292932] flex items-center justify-center text-[#E50914]">
          <Radio className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No TV Series on Release Radar</h2>
        <p className="text-sm text-[#A1A1AA] max-w-md mx-auto mb-6 leading-relaxed">
          Add upcoming or backlogged TV series (like <span className="text-white font-medium">Severance</span>,{" "}
          <span className="text-white font-medium">The Last of Us</span>, or{" "}
          <span className="text-white font-medium">The Bear</span>) to your <strong className="text-amber-400">To Watch (Backlog)</strong> to
          track live air dates, episode countdowns, and renewal schedules here.
        </p>
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF3B3B] text-white font-medium text-sm transition-colors shadow-lg shadow-red-950/30 inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Search &amp; Add TV Series
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Top Hero / Release Radar Banner ── */}
      <div className="p-6 rounded-2xl bg-[#15151C] border border-[#292932] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Release Radar
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            TV Air Date &amp; Season Tracker
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-1 max-w-xl">
            Real-time schedule for next episodes, upcoming season renewals, and finale statuses across your queued series.
          </p>
        </div>

        {/* Quick Stat Pill Chips */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-3 rounded-xl bg-[#0B0B0F] border border-emerald-500/20 text-center min-w-[100px]">
            <p className="text-lg font-bold font-mono text-emerald-400">{metrics.airingCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold">Airing Soon</p>
          </div>
          <div className="px-4 py-3 rounded-xl bg-[#0B0B0F] border border-cyan-500/20 text-center min-w-[100px]">
            <p className="text-lg font-bold font-mono text-cyan-400">{metrics.returningCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold">Returning (TBA)</p>
          </div>
          <div className="px-4 py-3 rounded-xl bg-[#0B0B0F] border border-zinc-700/50 text-center min-w-[100px]">
            <p className="text-lg font-bold font-mono text-zinc-300">{metrics.endedCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold">Complete / Ended</p>
          </div>

          <button
            onClick={fetchRadar}
            disabled={isLoading}
            className="p-3 rounded-xl bg-[#0B0B0F] border border-[#292932] hover:border-zinc-500 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh Air Dates from TMDB"
            aria-label="Refresh TV air date tracker"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Status Filter Controls Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#15151C] border border-[#292932]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-white/10 text-white border border-white/20 shadow-sm"
                : "text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            All Queued ({tvEntries.length})
          </button>
          <button
            onClick={() => setStatusFilter("airingSoon")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "airingSoon"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Airing Soon ({metrics.airingCount})
          </button>
          <button
            onClick={() => setStatusFilter("returning")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === "returning"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            Returning / Renewed ({metrics.returningCount})
          </button>
          <button
            onClick={() => setStatusFilter("ended")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === "ended"
                ? "bg-white/10 text-zinc-300 border border-white/20 shadow-sm"
                : "text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            Ended ({metrics.endedCount})
          </button>
        </div>

        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0B0B0F] border border-[#292932] hover:border-zinc-500 text-stone-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add More Shows</span>
          </button>
        )}
      </div>

      {/* ── Main Radar Cards Grid (Deduplicated) ── */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#15151C] border border-[#292932] rounded-2xl">
          <p className="text-sm text-[#A1A1AA]">No series match this filter.</p>
          <button
            onClick={() => setStatusFilter("all")}
            className="mt-3 text-xs text-emerald-400 hover:underline cursor-pointer font-medium"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ entry, radar, loading }) => {
            const nextEp = radar?.nextEpisode;
            const airBadge = getAirDateBadge(nextEp?.airDate);
            const isEnded = radar?.status === "Ended" || radar?.status === "Canceled";
            const isReturning = radar?.status === "Returning Series" || radar?.inProduction;

            return (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="bg-[#15151C] hover:bg-[#181820] border border-[#292932] hover:border-zinc-700/80 rounded-2xl p-4 transition-all shadow-md hover:shadow-xl cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Top Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border bg-amber-500/10 border-amber-500/25 text-amber-300 flex items-center gap-1">
                      <BookmarkPlus className="w-2.5 h-2.5 text-amber-400" />
                      To Watch
                    </span>

                    {/* Live TMDB Status */}
                    {loading ? (
                      <span className="text-[10px] text-zinc-500 animate-pulse font-mono">Checking radar...</span>
                    ) : nextEp ? (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                          airBadge?.urgent
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {airBadge?.text || "Next Episode"}
                      </span>
                    ) : isReturning ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        Returning Series
                      </span>
                    ) : isEnded ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
                        Series Ended
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500">In Production</span>
                    )}
                  </div>

                  {/* Artwork & Show Details */}
                  <div className="flex gap-3.5 items-start">
                    <div className="w-16 h-24 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black/40 shadow-sm group-hover:scale-105 transition-transform">
                      <MovieImage
                        src={entry.tmdb.posterUrl}
                        alt={entry.tmdb.title}
                        title={entry.tmdb.title}
                        mediaType="tv"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white group-hover:text-[#F5F5F5] transition-colors truncate">
                        {entry.tmdb.title}
                      </h3>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">
                        {entry.tmdb.releaseYear} • {entry.tmdb.genres?.slice(0, 2).join(", ")}
                      </p>
                      {entry.tmdb.overview && (
                        <p className="text-[11px] text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {entry.tmdb.overview}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Bottom Section: Next Air Date or Series Status Banner ── */}
                <div className="mt-4 pt-3 border-t border-[#292932]/70">
                  {nextEp ? (
                    <div className="p-2.5 rounded-xl bg-[#0B0B0F] border border-emerald-500/20 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            S{nextEp.seasonNumber} · E{nextEp.episodeNumber}
                            {nextEp.name ? `: ${nextEp.name}` : ""}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                          Air Date: {nextEp.airDate}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ) : isReturning ? (
                    <div className="p-2.5 rounded-xl bg-[#0B0B0F] border border-cyan-500/20 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          Next Season Confirmed
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                          {radar?.lastEpisode
                            ? `Last aired: S${radar.lastEpisode.seasonNumber}·E${radar.lastEpisode.episodeNumber} (${radar.lastEpisode.airDate})`
                            : "Awaiting air date announcement"}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 opacity-60 group-hover:opacity-100 transition-all" />
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-[#0B0B0F] border border-zinc-800 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          Complete Series
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 truncate">
                          All seasons released • Ready to binge
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0 opacity-60 group-hover:opacity-100 transition-all" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Media Detail Modal on Click ── */}
      <MediaDetailModal
        entry={selectedEntry}
        isOpen={Boolean(selectedEntry)}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}
export default ReleaseRadarView;
