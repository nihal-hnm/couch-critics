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
  Check,
  ListVideo,
  Sparkles,
  RotateCcw,
  BookmarkPlus,
} from "lucide-react";
import type { MovieEntry, UserReview, WatchProgress } from "@/lib/types";
import { useJournal } from "@/lib/journal-context";
import MediaDetailModal from "./MediaDetailModal";

interface WatchingShelfProps {
  entries: MovieEntry[];
}

export default function WatchingShelf({ entries }: WatchingShelfProps) {
  const { updateProgress, moveToShelf, removeEntry } = useJournal();
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [rating, setRating] = useState(7);
  const [notes, setNotes] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<MovieEntry | null>(null);
  const [expandedEpisodeShowId, setExpandedEpisodeShowId] = useState<string | null>(null);
  const [activeSeasonMap, setActiveSeasonMap] = useState<Record<string, number | "all">>({});

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
    const current = entry.progress?.currentEpisode ?? 1;
    const total = entry.progress?.totalEpisodes ?? 10;
    const newValue = Math.max(1, Math.min(total, current + delta));
    const season = entry.progress?.currentSeason ?? 1;

    // Also update watchedEpisodes list
    const currentWatched = new Set(entry.progress?.watchedEpisodes ?? []);
    if (delta > 0) {
      currentWatched.add(`S${season}E${newValue}`);
    } else {
      currentWatched.delete(`S${season}E${current}`);
    }

    const watchedArray = Array.from(currentWatched);
    updateProgress(entry.id, {
      ...entry.progress,
      currentEpisode: newValue,
      totalEpisodes: total,
      watchedEpisodes: watchedArray,
      minutesWatched: watchedArray.length * (entry.tmdb.runtime || 45),
    });
  }

  function handleToggleEpisode(entry: MovieEntry, seasonNum: number, epNum: number) {
    const epCode = `S${seasonNum}E${epNum}`;
    const watched = new Set(entry.progress?.watchedEpisodes ?? []);

    if (watched.has(epCode)) {
      watched.delete(epCode);
    } else {
      watched.add(epCode);
    }

    const watchedArray = Array.from(watched);
    updateProgress(entry.id, {
      ...(entry.progress ?? {}),
      currentSeason: seasonNum,
      currentEpisode: watchedArray.length,
      watchedEpisodes: watchedArray,
      minutesWatched: watchedArray.length * (entry.tmdb.runtime || 45),
    });
  }

  function handleSelectAllSeason(entry: MovieEntry, seasonNum: number, epCount: number) {
    const watched = new Set(entry.progress?.watchedEpisodes ?? []);
    for (let i = 1; i <= epCount; i++) {
      watched.add(`S${seasonNum}E${i}`);
    }
    const watchedArray = Array.from(watched);
    updateProgress(entry.id, {
      ...(entry.progress ?? {}),
      currentSeason: seasonNum,
      currentEpisode: watchedArray.length,
      watchedEpisodes: watchedArray,
      minutesWatched: watchedArray.length * (entry.tmdb.runtime || 45),
    });
  }

  function handleUnselectAllSeason(entry: MovieEntry, seasonNum: number, epCount: number) {
    const watched = new Set(entry.progress?.watchedEpisodes ?? []);
    for (let i = 1; i <= epCount; i++) {
      watched.delete(`S${seasonNum}E${i}`);
    }
    const watchedArray = Array.from(watched);
    updateProgress(entry.id, {
      ...(entry.progress ?? {}),
      currentSeason: seasonNum,
      currentEpisode: watchedArray.length,
      watchedEpisodes: watchedArray,
      minutesWatched: watchedArray.length * (entry.tmdb.runtime || 45),
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
        <div className="inline-flex p-4 rounded-2xl bg-purple-500/8 mb-4">
          <Play className="w-10 h-10 text-purple-500/40" />
        </div>
        <h3 className="text-xl font-semibold text-stone-300">
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
      <div className="grid gap-6 md:grid-cols-2">
        {entries.map((entry, index) => {
          const progress = entry.progress;
          const isMovie = entry.tmdb.mediaType === "movie";
          const watchedEpisodesList = progress?.watchedEpisodes ?? [];
          const watchedEpisodesCount = progress?.watchedEpisodes !== undefined
            ? watchedEpisodesList.length
            : (progress?.currentEpisode ?? 0);
          const totalEpisodesCount = progress?.totalEpisodes ?? entry.tmdb.totalEpisodes ?? 10;

          const progressPercent = isMovie
            ? progress?.totalMinutes
              ? Math.round(
                  ((progress.minutesWatched ?? 0) / progress.totalMinutes) * 100
                )
              : 0
            : totalEpisodesCount
            ? Math.round((watchedEpisodesCount / totalEpisodesCount) * 100)
            : 0;

          const isExpanded = expandedEpisodeShowId === entry.id;

          return (
            <div
              key={entry.id}
              className="relative rounded-2xl overflow-hidden border border-stone-800/50 group poster-lift bg-[#12100e]"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* ── Background Poster ──────────────────────────── */}
              <div
                className="relative h-60 overflow-hidden cursor-pointer"
                onClick={() => setSelectedEntry(entry)}
              >
                {entry.tmdb.posterUrl ? (
                  <img
                    src={entry.tmdb.posterUrl}
                    alt={entry.tmdb.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                    <Film className="w-16 h-16 text-stone-700" />
                  </div>
                )}
                {/* Warm cinematic gradient overlay */}
                <div className="absolute inset-0 cinema-gradient-strong" />

                {/* Currently watching badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-[10px] font-medium text-purple-200 uppercase tracking-wider flex items-center gap-1">
                    {isMovie ? <Film className="w-2.5 h-2.5" /> : <Tv className="w-2.5 h-2.5" />}
                    Now Watching
                  </span>
                </div>

                {/* Floating action buttons */}
                <div
                  className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleMoveToBacklog(entry)}
                    className="p-2 bg-stone-800/90 hover:bg-purple-600/90 rounded-lg text-stone-200 hover:text-white transition-colors backdrop-blur-sm"
                    title="Unwatch (Move to Backlog / To-Watch)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCompletingId(entry.id)}
                    className="p-2 bg-emerald-600/90 rounded-lg text-white hover:bg-emerald-500 transition-colors backdrop-blur-sm"
                    title="Mark as completed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="p-2 bg-red-600/90 rounded-lg text-white hover:bg-red-500 transition-colors backdrop-blur-sm"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Title + metadata overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {entry.tmdb.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-sm text-stone-300">
                    <span>{entry.tmdb.releaseYear}</span>
                    <ChevronRight className="w-3 h-3 text-stone-600" />
                    <span>{entry.tmdb.genres.slice(0, 2).join(", ")}</span>
                    {entry.tmdb.runtime > 0 && (
                      <>
                        <ChevronRight className="w-3 h-3 text-stone-600" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {isMovie ? `${entry.tmdb.runtime}m` : `~${entry.tmdb.runtime}m/ep`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Progress Section ───────────────────────────── */}
              <div className="p-4 space-y-3 bg-[#141210]">
                {/* Warm purple progress bar */}
                <div className="w-full bg-stone-800/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-[#5c0f92] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, progressPercent)}%` }}
                  />
                </div>

                {/* Progress controls */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {isMovie ? (
                      <span className="text-stone-300">
                        {progress?.minutesWatched ?? 0} / {progress?.totalMinutes ?? entry.tmdb.runtime ?? 120} min
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          S{progress?.currentSeason || 1}:E{progress?.currentEpisode || 1}
                        </span>
                        <span className="text-xs text-stone-400">
                          ({watchedEpisodesCount} of {totalEpisodesCount} eps)
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
                      className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                      title={isMovie ? "Rewind 15m" : "Previous episode"}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-semibold text-purple-400 min-w-[3rem] text-center">
                      {progressPercent}%
                    </span>
                    <button
                      onClick={() =>
                        isMovie
                          ? handleProgressChange(entry, 15)
                          : handleEpisodeChange(entry, 1)
                      }
                      className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                      title={isMovie ? "Forward 15m" : "Next episode"}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* TV Series: Episode Checklist Toggle Bar */}
                {!isMovie && (
                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                    <button
                      onClick={() =>
                        setExpandedEpisodeShowId(isExpanded ? null : entry.id)
                      }
                      className="text-xs text-purple-400/90 hover:text-purple-300 flex items-center gap-1.5 transition-colors font-medium"
                    >
                      <ListVideo className="w-3.5 h-3.5" />
                      {isExpanded ? "Hide Episode Guide" : "Episode Checklist Tracker"}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="text-xs text-stone-400 hover:text-white transition-colors"
                    >
                      All Details &rarr;
                    </button>
                  </div>
                )}

                {/* TV Series: Inline Episode Checklist Drawer */}
                {!isMovie && isExpanded && (() => {
                  const availableSeasons = entry.tmdb.seasons && entry.tmdb.seasons.length > 0
                    ? entry.tmdb.seasons
                    : Array.from({ length: entry.tmdb.totalSeasons || 1 }, (_, i) => ({
                        seasonNumber: i + 1,
                        name: `Season ${i + 1}`,
                        episodeCount: entry.tmdb.totalEpisodes ? Math.ceil(entry.tmdb.totalEpisodes / (entry.tmdb.totalSeasons || 1)) : 10,
                      }));

                  const currentSelection = activeSeasonMap[entry.id] ?? "all";
                  const seasonsToDisplay = currentSelection === "all"
                    ? availableSeasons
                    : availableSeasons.filter(s => s.seasonNumber === currentSelection);

                  return (
                    <div className="pt-3 space-y-3 border-t border-stone-800/80 animate-in fade-in duration-200">
                      {/* Season selector tabs */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
                        <button
                          type="button"
                          onClick={() => setActiveSeasonMap(prev => ({ ...prev, [entry.id]: "all" }))}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                            currentSelection === "all"
                              ? "bg-purple-500 text-stone-950 font-bold"
                              : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
                          }`}
                        >
                          All Seasons ({availableSeasons.length})
                        </button>
                        {availableSeasons.map((s) => {
                          const isSel = currentSelection === s.seasonNumber;
                          return (
                            <button
                              key={s.seasonNumber}
                              type="button"
                              onClick={() => setActiveSeasonMap(prev => ({ ...prev, [entry.id]: s.seasonNumber }))}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                                isSel
                                  ? "bg-purple-500 text-stone-950 font-bold"
                                  : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
                              }`}
                            >
                              S{s.seasonNumber}
                            </button>
                          );
                        })}
                      </div>

                      {/* Display each season and its episodes */}
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {seasonsToDisplay.map((season) => {
                          const sNum = season.seasonNumber;
                          const epCount = season.episodeCount || 10;
                          let watchedInSeason = 0;
                          for (let i = 1; i <= epCount; i++) {
                            if (watchedEpisodesList.includes(`S${sNum}E${i}`)) {
                              watchedInSeason++;
                            }
                          }

                          return (
                            <div key={sNum} className="space-y-1.5 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
                              {/* Header with Season Title and Select / Unselect All */}
                              <div className="flex items-center justify-between">
                                <p className="text-[11px] text-stone-300 uppercase tracking-wider font-bold">
                                  {season.name || `Season ${sNum}`} ({watchedInSeason}/{epCount} eps)
                                </p>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleSelectAllSeason(entry, sNum, epCount)}
                                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/25 transition-colors"
                                  >
                                    Select All
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUnselectAllSeason(entry, sNum, epCount)}
                                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
                                  >
                                    Unselect All
                                  </button>
                                </div>
                              </div>

                              {/* Episode Checklist Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                {Array.from({ length: epCount }, (_, i) => {
                                  const eNum = i + 1;
                                  const code = `S${sNum}E${eNum}`;
                                  const isWatched = watchedEpisodesList.includes(code);

                                  return (
                                    <button
                                      key={code}
                                      type="button"
                                      onClick={() => handleToggleEpisode(entry, sNum, eNum)}
                                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                                        isWatched
                                          ? "bg-purple-500/20 text-purple-200 border-purple-500/30"
                                          : "bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700"
                                      }`}
                                    >
                                      <div
                                        className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${
                                          isWatched ? "bg-purple-400 text-black" : "border border-stone-600"
                                        }`}
                                      >
                                        {isWatched && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                      </div>
                                      <span className="truncate">Ep {eNum}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Link to Open Full Modal */}
                      <button
                        type="button"
                        onClick={() => setSelectedEntry(entry)}
                        className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-purple-300 hover:text-purple-100 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        <ListVideo className="w-3.5 h-3.5" />
                        Open Full Episode Guide &amp; Overviews &rarr;
                      </button>
                    </div>
                  );
                })()}
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
                            ? "text-purple-400"
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
                    className="w-full max-w-xs bg-stone-900 border border-stone-700 rounded-xl p-3 text-sm text-white placeholder-stone-500 resize-none h-20 outline-none focus:border-purple-500/50 transition-colors"
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
