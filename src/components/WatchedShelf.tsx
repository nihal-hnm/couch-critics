/**
 * =============================================================================
 * "Watched" Shelf — Archive with Ratings & Reviews
 * =============================================================================
 *
 * Displays the user's completed movies/shows in a grid with:
 *  - Star ratings (1-10)
 *  - Personal notes
 *  - Tags
 *  - Date completed
 *  - Inline editing of reviews
 *
 * DESIGN CHOICE: Grid vs Table
 * ────────────────────────────
 * We use a card grid instead of a data table because:
 *  1. Posters are central to the cinema journal experience
 *  2. Cards look better on mobile (tables are notoriously bad on small screens)
 *  3. Users scan visually by poster, not by reading text rows
 */

"use client";

import { useState } from "react";
import {
  Star,
  Film,
  Calendar,
  Edit3,
  Trash2,
  Save,
  X,
  Tag,
  Play,
} from "lucide-react";
import type { MovieEntry, UserReview } from "@/lib/types";
import { useJournal } from "@/lib/journal-context";

interface WatchedShelfProps {
  entries: MovieEntry[];
}

export default function WatchedShelf({ entries }: WatchedShelfProps) {
  const { updateReview, removeEntry, moveToShelf } = useJournal();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "title">(
    "recent"
  );

  function startEditing(entry: MovieEntry) {
    setEditingId(entry.id);
    setEditRating(entry.review?.rating ?? 5);
    setEditNotes(entry.review?.notes ?? "");
    setEditTags(entry.review?.tags?.join(", ") ?? "");
  }

  function saveEdit(id: string, existingReview?: UserReview) {
    const review: UserReview = {
      rating: editRating,
      notes: editNotes,
      tags: editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      dateCompleted:
        existingReview?.dateCompleted ?? new Date().toISOString(),
    };
    updateReview(id, review);
    setEditingId(null);
  }

  /**
   * SORTING with Array.sort()
   * ─────────────────────────
   * We create a copy with [...entries] before sorting because
   * Array.sort() mutates the original array. In React, mutating
   * props is a cardinal sin — it breaks React's change detection.
   */
  const sortedEntries = [...entries].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return (
          new Date(b.review?.dateCompleted ?? b.updatedAt).getTime() -
          new Date(a.review?.dateCompleted ?? a.updatedAt).getTime()
        );
      case "rating":
        return (b.review?.rating ?? 0) - (a.review?.rating ?? 0);
      case "title":
        return a.tmdb.title.localeCompare(b.tmdb.title);
      default:
        return 0;
    }
  });

  function renderStars(rating: number) {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rating
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-600"
            }`}
          />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <Star className="w-14 h-14 mx-auto text-zinc-600 mb-4" />
        <h3 className="text-xl font-semibold text-zinc-400">
          No movies watched yet
        </h3>
        <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto">
          Complete a movie from your &ldquo;Watching&rdquo; shelf or mark one
          as watched to start building your archive.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Sort Controls ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          {entries.length} {entries.length === 1 ? "movie" : "movies"} watched
        </p>
        <div className="flex gap-1 bg-zinc-800/50 rounded-lg p-0.5 border border-zinc-700/30">
          {(
            [
              { key: "recent", label: "Recent" },
              { key: "rating", label: "Rating" },
              { key: "title", label: "A-Z" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                sortBy === key
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Watched Grid ────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedEntries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border border-zinc-700/30 bg-zinc-800/30 overflow-hidden hover:border-zinc-600/50 transition-all duration-200"
          >
            <div className="flex gap-3 p-4">
              {/* Poster */}
              {entry.tmdb.posterUrl ? (
                <img
                  src={entry.tmdb.posterUrl}
                  alt={entry.tmdb.title}
                  className="w-20 h-28 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-20 h-28 rounded-lg bg-zinc-700 flex items-center justify-center shrink-0">
                  <Film className="w-8 h-8 text-zinc-500" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate">
                  {entry.tmdb.title}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {entry.tmdb.releaseYear} · {entry.tmdb.director}
                </p>

                {/* Rating */}
                <div className="mt-2">
                  {entry.review?.rating ? (
                    renderStars(entry.review.rating)
                  ) : (
                    <span className="text-xs text-zinc-500 italic">
                      Not rated
                    </span>
                  )}
                </div>

                {/* Date completed */}
                {entry.review?.dateCompleted && (
                  <p className="flex items-center gap-1 text-xs text-zinc-500 mt-1.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(entry.review.dateCompleted).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </p>
                )}

                {/* Tags */}
                {entry.review?.tags && entry.review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-0.5 text-[10px] bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded-md"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => startEditing(entry)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                  title="Edit review"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveToShelf(entry.id, "watching")}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-zinc-700 transition-colors"
                  title="Re-watch"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notes */}
            {entry.review?.notes && (
              <div className="px-4 pb-3">
                <p className="text-xs text-zinc-400 italic leading-relaxed border-t border-zinc-700/30 pt-3">
                  &ldquo;{entry.review.notes}&rdquo;
                </p>
              </div>
            )}

            {/* ── Inline Edit Mode ──────────────────────────── */}
            {editingId === entry.id && (
              <div className="border-t border-zinc-700/30 p-4 space-y-3 bg-zinc-800/50 animate-in slide-in-from-top-2 duration-200">
                {/* Rating editor */}
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Rating
                  </label>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setEditRating(i + 1)}
                        className={`text-lg transition-colors ${
                          i < editRating
                            ? "text-amber-400"
                            : "text-zinc-600 hover:text-zinc-400"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-zinc-400 self-center">
                      {editRating}/10
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Personal takeaways
                  </label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="What stuck with you? What would you tell a friend?"
                    className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white placeholder-zinc-500 resize-none h-20 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="mind-bending, comfort-watch, masterpiece"
                    className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Save/Cancel */}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(entry.id, entry.review)}
                    className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    Save Review
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
