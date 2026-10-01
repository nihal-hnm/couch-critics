/**
 * =============================================================================
 * "Watching" Shelf — Cinematic Hero Cards
 * =============================================================================
 *
 * Large, immersive cards with poster backgrounds, warm gradient overlays,
 * and progress tracking. The poster-as-background hero card pattern creates
 * a cinematic feel matching the reference UI's premium aesthetic.
 */

"use client";

import { useState } from "react";
import {
  Play,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Film,
  Clock,
  Minus,
  Plus,
} from "lucide-react";
import type { MovieEntry, UserReview } from "@/lib/types";
import { useJournal } from "@/lib/journal-context";

interface WatchingShelfProps {
  entries: MovieEntry[];
}

export default function WatchingShelf({ entries }: WatchingShelfProps) {
  const { updateProgress, moveToShelf, removeEntry } = useJournal();
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [rating, setRating] = useState(7);
  const [notes, setNotes] = useState("");

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

    updateProgress(entry.id, {
      ...entry.progress,
      currentEpisode: newValue,
      totalEpisodes: total,
    });
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
        <div className="inline-flex p-4 rounded-2xl bg-amber-500/8 mb-4">
          <Play className="w-10 h-10 text-amber-500/40" />
        </div>
        <h3 className="text-xl font-semibold text-stone-300">
          Nothing playing right now
        </h3>
        <p className="text-stone-500 mt-2 text-sm max-w-sm mx-auto">
          Search for a movie or show and add it to your &ldquo;Watching&rdquo;
          shelf to track your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {entries.map((entry, index) => {
        const progress = entry.progress;
        const isMovie = entry.tmdb.mediaType === "movie";
        const progressPercent = isMovie
          ? progress?.totalMinutes
            ? Math.round(
                ((progress.minutesWatched ?? 0) / progress.totalMinutes) * 100
              )
            : 0
          : progress?.totalEpisodes
            ? Math.round(
                ((progress.currentEpisode ?? 1) / progress.totalEpisodes) * 100
              )
            : 0;

        return (
          <div
            key={entry.id}
            className="relative rounded-2xl overflow-hidden border border-stone-800/50 group poster-lift"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* ── Background Poster ──────────────────────────── */}
            <div className="relative h-60 overflow-hidden">
              {entry.tmdb.posterUrl ? (
                <img
                  src={entry.tmdb.posterUrl}
                  alt={entry.tmdb.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                  <Film className="w-16 h-16 text-stone-700" />
                </div>
              )}
              {/* Warm cinematic gradient overlay */}
              <div className="absolute inset-0 cinema-gradient-strong" />

              {/* Currently watching badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] font-medium text-amber-200 uppercase tracking-wider">
                  Now Playing
                </span>
              </div>

              {/* Floating action buttons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => setCompletingId(entry.id)}
                  className="p-2 bg-emerald-600/80 rounded-lg text-white hover:bg-emerald-500 transition-colors backdrop-blur-sm"
                  title="Mark as watched"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-2 bg-red-600/80 rounded-lg text-white hover:bg-red-500 transition-colors backdrop-blur-sm"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title + metadata overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {entry.tmdb.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-sm text-stone-300">
                  <span>{entry.tmdb.releaseYear}</span>
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>{entry.tmdb.genres.slice(0, 2).join(", ")}</span>
                  {entry.tmdb.runtime > 0 && (
                    <>
                      <ChevronRight className="w-3 h-3 text-stone-600" />
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {entry.tmdb.runtime}m
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Progress Section ───────────────────────────── */}
            <div className="p-4 space-y-3 bg-[#141210]">
              {/* Warm amber progress bar */}
              <div className="w-full bg-stone-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Progress controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-400">
                  {isMovie
                    ? `${progress?.minutesWatched ?? 0} / ${progress?.totalMinutes ?? entry.tmdb.runtime ?? "?"} min`
                    : `Episode ${progress?.currentEpisode ?? 1} / ${progress?.totalEpisodes ?? "?"}`}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      isMovie
                        ? handleProgressChange(entry, -15)
                        : handleEpisodeChange(entry, -1)
                    }
                    className="p-1.5 rounded-lg bg-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold text-amber-400 min-w-[3rem] text-center">
                    {progressPercent}%
                  </span>
                  <button
                    onClick={() =>
                      isMovie
                        ? handleProgressChange(entry, 15)
                        : handleEpisodeChange(entry, 1)
                    }
                    className="p-1.5 rounded-lg bg-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
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
                          ? "text-amber-400"
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
                  className="w-full max-w-xs bg-stone-900 border border-stone-700 rounded-xl p-3 text-sm text-white placeholder-stone-500 resize-none h-20 outline-none focus:border-amber-500/50 transition-colors"
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
  );
}
