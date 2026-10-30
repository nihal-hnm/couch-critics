/**
 * =============================================================================
 * "Watching" Shelf — Cinematic Hero Cards with Episode-Wise Tracker
 * =============================================================================
 *
 * Immersive cards with poster backgrounds, gradient overlays,
 * progress steppers, and expandable episode-by-episode checklist tracker.
 */

"use client";

import { useState } from "react";
import {
  Play,
  CheckCircle2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Film,
  Tv,
  Clock,
  Minus,
  Plus,
  ListVideo,
  BookmarkPlus,
} from "lucide-react";
import type { MovieEntry, UserReview, TMDBSeasonData } from "@/lib/types";
import { useJournal } from "@/lib/journal-context";
import { getCachedTVSeasons } from "@/lib/tv-seasons-cache";
import MediaDetailModal from "./MediaDetailModal";
import { MovieImage } from "./common/MovieImage";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { WhereToWatch } from "./common/WhereToWatch";

interface WatchingShelfProps {
  entries: MovieEntry[];
}

export function getTVSeasonProgress(entry: MovieEntry) {
  const isMovie = entry.tmdb.mediaType === "movie";
  if (isMovie) {
    const totalMinutes = entry.progress?.totalMinutes ?? entry.tmdb.runtime ?? 120;
    const minutesWatched = entry.progress?.minutesWatched ?? 0;
    const percent = totalMinutes > 0 ? Math.round((minutesWatched / totalMinutes) * 100) : 0;
    return {
      isMovie: true,
      minutesWatched,
      totalMinutes,
      percent: Math.min(100, Math.max(0, percent)),
      currentSeason: 1,
      currentEpisode: 1,
      seasonEpisodeCount: 1,
      totalSeasons: 1,
      seasonsList: [] as TMDBSeasonData[],
    };
  }

  // Retrieve season data from TMDB metadata or cached tv catalog
  const cached = getCachedTVSeasons(entry.tmdb.tmdbId);
  const rawSeasons =
    (entry.tmdb.seasons && entry.tmdb.seasons.length > 0 ? entry.tmdb.seasons : null) ||
    (cached?.seasons && cached.seasons.length > 0 ? cached.seasons : null) ||
    [];

  // Filter valid regular seasons (seasonNumber >= 1 and episodeCount > 0)
  const regularSeasons = rawSeasons.filter((s) => s.seasonNumber > 0 && s.episodeCount > 0);
  const seasonsList: TMDBSeasonData[] =
    regularSeasons.length > 0
      ? regularSeasons
      : [
          {
            seasonNumber: 1,
            name: "Season 1",
            episodeCount: entry.tmdb.totalEpisodes || 10,
          },
        ];

  const totalSeasons = Math.max(
    seasonsList.length,
    entry.progress?.totalSeasons || entry.tmdb.totalSeasons || 1
  );

  let currentSeason = entry.progress?.currentSeason ?? 1;
  let currentEpisode = entry.progress?.currentEpisode ?? 1;

  // Verify season exists in seasonsList
  let currentSeasonData = seasonsList.find((s) => s.seasonNumber === currentSeason);
  if (!currentSeasonData) {
    currentSeason = seasonsList[0]?.seasonNumber || 1;
    currentSeasonData = seasonsList[0];
  }
  const seasonEpisodeCount = currentSeasonData?.episodeCount || 10;

  // Handle legacy cumulative episode bug (e.g., S1:E81 when season 1 only has 12 episodes)
  if (currentEpisode > seasonEpisodeCount && seasonsList.length > 1) {
    let rem = currentEpisode;
    for (const s of seasonsList) {
      if (rem <= s.episodeCount) {
        currentSeason = s.seasonNumber;
        currentEpisode = rem;
        break;
      }
      rem -= s.episodeCount;
      currentSeason = s.seasonNumber;
      currentEpisode = s.episodeCount;
    }
    currentSeasonData = seasonsList.find((s) => s.seasonNumber === currentSeason);
  }

  const validEpCount = currentSeasonData?.episodeCount || 10;
  const validEpisode = Math.max(1, Math.min(validEpCount, currentEpisode));

  const percent = validEpCount > 0 ? Math.round((validEpisode / validEpCount) * 100) : 0;

  return {
    isMovie: false,
    minutesWatched: 0,
    totalMinutes: 0,
    percent: Math.min(100, Math.max(0, percent)),
    currentSeason,
    currentEpisode: validEpisode,
    seasonEpisodeCount: validEpCount,
    totalSeasons,
    seasonsList,
  };
}

export default function WatchingShelf({ entries }: WatchingShelfProps) {
  const { updateProgress, moveToShelf, removeEntry } = useJournal();
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [rating, setRating] = useState(7);
  const [notes, setNotes] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<MovieEntry | null>(null);

  function handleProgressChange(entry: MovieEntry, delta: number) {
    const current = entry.progress?.minutesWatched ?? 0;
    const total = entry.progress?.totalMinutes ?? entry.tmdb.runtime ?? 120;
    const newValue = Math.max(0, Math.min(total, current + delta));

    updateProgress(entry.id, {
      ...entry.progress,
      minutesWatched: newValue,
      totalMinutes: total,
    });
  }

  function handleEpisodeChange(entry: MovieEntry, delta: number) {
    const sp = getTVSeasonProgress(entry);
    if (sp.isMovie) return;

    const { currentSeason, currentEpisode, seasonEpisodeCount, totalSeasons, seasonsList } = sp;
    const currentWatched = new Set(entry.progress?.watchedEpisodes ?? []);

    let newSeason = currentSeason;
    let newEpisode = currentEpisode + delta;

    if (delta > 0) {
      if (newEpisode > seasonEpisodeCount) {
        if (currentSeason < totalSeasons) {
          newSeason = currentSeason + 1;
          newEpisode = 1;
        } else {
          newEpisode = seasonEpisodeCount;
        }
      }
      currentWatched.add(`S${newSeason}E${newEpisode}`);
    } else {
      if (newEpisode < 1) {
        if (currentSeason > 1) {
          newSeason = currentSeason - 1;
          const prevSeasonData = seasonsList.find((s) => s.seasonNumber === newSeason);
          newEpisode = prevSeasonData?.episodeCount || 10;
        } else {
          newEpisode = 1;
        }
      }
      currentWatched.delete(`S${currentSeason}E${currentEpisode}`);
    }

    const watchedArray = Array.from(currentWatched);
    const updatedSeasonData = seasonsList.find((s) => s.seasonNumber === newSeason);
    const newSeasonEpCount = updatedSeasonData?.episodeCount || 10;

    updateProgress(entry.id, {
      ...entry.progress,
      currentSeason: newSeason,
      currentEpisode: Math.min(newSeasonEpCount, Math.max(1, newEpisode)),
      totalEpisodes: newSeasonEpCount,
      watchedEpisodes: watchedArray,
      minutesWatched: watchedArray.length * (entry.tmdb.runtime || 45),
    });
  }

  function handleSeasonChange(entry: MovieEntry, newSeasonNum: number) {
    const sp = getTVSeasonProgress(entry);
    const targetSeason = sp.seasonsList.find((s) => s.seasonNumber === newSeasonNum);
    const seasonEpCount = targetSeason?.episodeCount || 10;

    const watchedSet = new Set(entry.progress?.watchedEpisodes ?? []);
    let highestInSeason = 1;
    for (let ep = 1; ep <= seasonEpCount; ep++) {
      if (watchedSet.has(`S${newSeasonNum}E${ep}`)) {
        highestInSeason = ep;
      }
    }

    updateProgress(entry.id, {
      ...entry.progress,
      currentSeason: newSeasonNum,
      currentEpisode: highestInSeason,
      totalEpisodes: seasonEpCount,
    });
  }

  function handleMoveToBacklog(entry: MovieEntry) {
    moveToShelf(entry.id, "toWatch");
  }

  function handleMarkComplete(id: string) {
    const review: UserReview = {
      rating,
      notes,
      tags: [],
      dateCompleted: new Date().toISOString(),
    };
    moveToShelf(id, "watched", review);
    setCompletingId(null);
    setRating(7);
    setNotes("");
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex p-4 rounded-2xl bg-[#15151C] border border-[#292932] mb-4 text-[#E50914]">
          <Play className="w-10 h-10 fill-current" />
        </div>
        <h3 className="text-xl font-semibold text-white">
          Nothing playing right now
        </h3>
        <p className="text-stone-500 mt-2 text-sm max-w-sm mx-auto">
          Search for a movie or TV show and add it to your &ldquo;Watching&rdquo;
          shelf to track your episode progress.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {entries.map((entry, index) => {
          const sp = getTVSeasonProgress(entry);
          const isMovie = sp.isMovie;

          return (
            <div
              key={entry.id}
              className="liquid-glass-card group poster-lift rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl relative h-full"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="glass-specular" />

              {/* ── Card Header: Ambient Backdrop + Full Poster + Info ── */}
              <div
                className="relative p-4 sm:p-5 overflow-hidden cursor-pointer flex-1 flex flex-col justify-between"
                onClick={() => setSelectedEntry(entry)}
              >
                {/* Ambient Blurred Backdrop behind the card */}
                {(entry.tmdb.backdropUrl || entry.tmdb.posterUrl) && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-15">
                    <img
                      src={getOptimizedImageUrl(entry.tmdb.backdropUrl || entry.tmdb.posterUrl)}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover blur-xl scale-110"
                    />
                    <div className="absolute inset-0 card-ambient-scrim pointer-events-none" />
                  </div>
                )}

                <div className="relative z-10 flex gap-4 sm:gap-5 items-start flex-1">
                  {/* ── FULL UNZOOMED COVER POSTER ── */}
                  <div className="w-28 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0 bg-[#0B0B0F] group-hover:scale-[1.02] transition-transform duration-300">
                    <MovieImage
                      src={entry.tmdb.posterUrl}
                      alt={entry.tmdb.title}
                      title={entry.tmdb.title}
                      mediaType={entry.tmdb.mediaType}
                      className="w-full h-full object-contain bg-black/40"
                      fallbackIconClassName="w-12 h-12 text-stone-700"
                    />
                  </div>

                  {/* ── Info & Badges & Action Buttons ── */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                    <div>
                      {/* Top Row: Badge + Floating Action Buttons */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#E50914]/12 border border-[#E50914]/25 backdrop-blur-sm shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                          <span className="text-[10px] font-semibold text-[#E50914] uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                            {isMovie ? <Film className="w-2.5 h-2.5" /> : <Tv className="w-2.5 h-2.5" />}
                            Now Watching
                          </span>
                        </div>

                        {/* Top quick action: Remove only (uncluttered) */}
                        <div
                          className="flex items-center gap-1.5 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                            title="Remove from journal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title: Consistent min-height for clean alignment across 1-line and 2-line titles */}
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2 tracking-tight group-hover:text-white transition-colors min-h-[2.75rem] flex items-start">
                        {entry.tmdb.title}
                      </h3>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#A1A1AA]">
                        {entry.tmdb.releaseYear && (
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[#F5F5F5]">
                            {entry.tmdb.releaseYear}
                          </span>
                        )}
                        {entry.tmdb.genres?.length > 0 && (
                          <span className="text-white/70 truncate max-w-[120px]">{entry.tmdb.genres.slice(0, 2).join(", ")}</span>
                        )}
                        {entry.tmdb.runtime > 0 && (
                          <span className="flex items-center gap-1 text-white/60">
                            <Clock className="w-3 h-3 text-[#E50914]" />
                            {isMovie ? `${entry.tmdb.runtime}m` : `~${entry.tmdb.runtime}m/ep`}
                          </span>
                        )}
                      </div>

                      {/* Where to Watch - Fixed min-height container for consistent card height */}
                      <div className="mt-2 min-h-[36px] flex items-center" onClick={(e) => e.stopPropagation()}>
                        <WhereToWatch
                          tmdbId={entry.tmdb.tmdbId}
                          title={entry.tmdb.title}
                          mediaType={entry.tmdb.mediaType}
                          variant="compact"
                        />
                      </div>
                    </div>

                    {/* Hint to open details */}
                    <div className="mt-2 text-[11px] text-white/40 flex items-center gap-1 font-medium">
                      <span>Click for full details</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Progress Section (Pinned to Bottom via mt-auto) ───────────────────────────── */}
              <div className="p-4 space-y-3 border-t border-white/[0.06] bg-black/20 backdrop-blur-sm mt-auto">
                {/* Progress bar */}
                <div className="w-full bg-[#0B0B0F] border border-white/10 rounded-md h-2 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-sm transition-all duration-500 ${
                      !isMovie
                        ? "bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        : "bg-gradient-to-r from-[#E50914] to-[#B20710]"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(3, sp.percent))}%` }}
                  />
                </div>

                {/* Progress controls: Individual Season Episode Counting */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {isMovie ? (
                      <span className="text-[#A1A1AA] text-xs font-medium">
                        {sp.minutesWatched} / {sp.totalMinutes} min
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {sp.totalSeasons > 1 ? (
                          <div className="relative inline-flex items-center" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={sp.currentSeason}
                              onChange={(e) => handleSeasonChange(entry, parseInt(e.target.value, 10))}
                              className="bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs py-0.5 pl-2 pr-5 rounded-md border border-white/10 cursor-pointer focus:outline-none appearance-none transition-colors"
                              title="Switch season"
                            >
                              {sp.seasonsList.map((s) => (
                                <option key={s.seasonNumber} value={s.seasonNumber} className="bg-[#15151C] text-white">
                                  S{s.seasonNumber}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3 h-3 text-white/50 absolute right-1.5 pointer-events-none" />
                          </div>
                        ) : (
                          <span className="font-semibold text-white text-xs">
                            S{sp.currentSeason}:
                          </span>
                        )}
                        <span className="font-semibold text-white text-xs">
                          E{sp.currentEpisode}
                        </span>
                        <span className="text-[11px] text-[#A1A1AA]">
                          ({sp.currentEpisode} of {sp.seasonEpisodeCount} eps)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        isMovie
                          ? handleProgressChange(entry, -15)
                          : handleEpisodeChange(entry, -1)
                      }
                      className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer"
                      title={isMovie ? "Rewind 15m" : "Previous episode"}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span
                      className={`text-xs font-bold min-w-[2.75rem] text-center font-mono ${
                        !isMovie ? "text-emerald-400" : "text-[#E50914]"
                      }`}
                    >
                      {sp.percent}%
                    </span>
                    <button
                      onClick={() =>
                        isMovie
                          ? handleProgressChange(entry, 15)
                          : handleEpisodeChange(entry, 1)
                      }
                      className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer"
                      title={isMovie ? "Forward 15m" : "Next episode"}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ── Watching Action Bar: To-Watch, Finished, and Episodes / Details ── */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* To Watch Option */}
                    <button
                      type="button"
                      onClick={() => handleMoveToBacklog(entry)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Move to To-Watch shelf (Backlog)"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                      <span>To Watch</span>
                    </button>

                    {/* Mark Complete Option */}
                    <button
                      type="button"
                      onClick={() => setCompletingId(entry.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Mark as completed / watched"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Finished</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isMovie && (
                      <button
                        type="button"
                        onClick={() => setSelectedEntry(entry)}
                        className="text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition-colors font-medium cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                        title="Open Episode Guide & Checklist"
                      >
                        <ListVideo className="w-3.5 h-3.5 text-[#E50914]" />
                        <span>Episodes</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedEntry(entry)}
                      className="text-xs text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                      title="View full details"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#E50914]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Quick Complete Modal ───────────────────────── */}
              {completingId === entry.id && (
                <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 z-10 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-3" />
                  <p className="text-white font-semibold mb-4">
                    Rate &ldquo;{entry.tmdb.title}&rdquo;
                  </p>

                  {/* Star rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 10 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setRating(i + 1)}
                        className={`text-lg transition-colors ${
                          i < rating
                            ? "text-[#F5C542]"
                            : "text-stone-700 hover:text-stone-500"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    placeholder="Quick thoughts (optional)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full max-w-xs bg-stone-900 border border-stone-700 rounded-xl p-3 text-sm text-white placeholder-stone-500 resize-none h-20 outline-none focus:border-[#E50914]/50 transition-colors"
                  />

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setCompletingId(null)}
                      className="px-4 py-2 text-sm text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleMarkComplete(entry.id)}
                      className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Media Detail Modal */}
      <MediaDetailModal
        entry={selectedEntry ? entries.find((e) => e.id === selectedEntry.id) ?? selectedEntry : null}
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </>
  );
}
