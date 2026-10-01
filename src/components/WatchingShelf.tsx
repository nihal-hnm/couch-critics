/**
 * =============================================================================
 * "Watching" Shelf — Hero Card Layout
 * =============================================================================
 *
 * Shows currently-watching movies/shows as large hero cards with progress bars.
 * These are the user's "active" items, so they get the most visual real estate.
 *
 * KEY UI PATTERN: "Hero Card"
 * ──────────────────────────
 * A hero card uses the poster as a background with a gradient overlay for text.
 * This creates a cinematic feel that matches the movie-tracking theme.
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
        <Play className="w-14 h-14 mx-auto text-zinc-600 mb-4" />
        <h3 className="text-xl font-semibold text-zinc-400">
          Nothing playing right now
        </h3>
        <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto">
          Search for a movie or show and add it to your &ldquo;Watching&rdquo;
          shelf to track your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {entries.map((entry) => {
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
            className="relative rounded-2xl overflow-hidden border border-zinc-700/30 bg-zinc-800/50 group"
          >
            {/* ── Background Poster ──────────────────────────── */}
            <div className="relative h-56 overflow-hidden">
              {entry.tmdb.posterUrl ? (
                <img
                  src={entry.tmdb.posterUrl}
                  alt={entry.tmdb.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                  <Film className="w-16 h-16 text-zinc-600" />
                </div>
              )}
              {/* Gradient overlay so text is readable on any poster */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />

              {/* Floating action buttons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setCompletingId(entry.id)}
                  className="p-2 bg-emerald-600/90 rounded-lg text-white hover:bg-emerald-500 transition-colors backdrop-blur-sm"
                  title="Mark as watched"
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
                <h3 className="text-xl font-bold text-white leading-tight">
                  {entry.tmdb.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-sm text-zinc-300">
                  <span>{entry.tmdb.releaseYear}</span>
                  <ChevronRight className="w-3 h-3 text-zinc-500" />
                  <span>{entry.tmdb.genres.slice(0, 2).join(", ")}</span>
                  {entry.tmdb.runtime > 0 && (
                    <>
                      <ChevronRight className="w-3 h-3 text-zinc-500" />
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
            <div className="p-4 space-y-3">
              {/* Progress bar */}
              <div className="w-full bg-zinc-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Progress controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
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
                    className="p-1.5 rounded-lg bg-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold text-indigo-400 min-w-[3rem] text-center">
                    {progressPercent}%
                  </span>
                  <button
                    onClick={() =>
                      isMovie
                        ? handleProgressChange(entry, 15)
                        : handleEpisodeChange(entry, 1)
                    }
                    className="p-1.5 rounded-lg bg-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Quick Complete Modal ───────────────────────── */}
            {completingId === entry.id && (
              <div className="absolute inset-0 bg-zinc-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10 animate-in fade-in duration-200">
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
                          : "text-zinc-600 hover:text-zinc-400"
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
                  className="w-full max-w-xs bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm text-white placeholder-zinc-500 resize-none h-20 outline-none focus:border-indigo-500"
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setCompletingId(null)}
                    className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
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
