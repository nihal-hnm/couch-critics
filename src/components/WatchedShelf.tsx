/**
 * =============================================================================
 * "Watched" Shelf — Cinematic Archive with Warm Ratings & Reviews
 * =============================================================================
 *
 * Redesigned with the warm cinematic aesthetic:
 *  - Glassmorphism cards with warm border accents
 *  - Amber/gold star ratings and warm tag colors
 *  - Poster-lift hover effect on cards
 *  - Warm gradient sort controls
 *  - Staggered entrance animations
 *  - Cinematic inline edit mode with warm focus states
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
  Award,
  RotateCcw,
} from "lucide-react";
import type { MovieEntry, UserReview } from "@/lib/types";
import { useJournal } from "@/lib/journal-context";
import MediaDetailModal from "./MediaDetailModal";

interface WatchedShelfProps {
  entries: MovieEntry[];
}

export default function WatchedShelf({ entries }: WatchedShelfProps) {
  const { updateReview, removeEntry, moveToShelf } = useJournal();
  const [selectedEntry, setSelectedEntry] = useState<MovieEntry | null>(null);
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
            className={`w-3.5 h-3.5 transition-colors ${
              i < rating
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-700"
            }`}
          />
        ))}
        <span className="ml-1.5 text-xs text-amber-400/80 font-medium">
          {rating}/10
        </span>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="relative inline-block">
          <Award className="w-16 h-16 mx-auto text-amber-500/20 mb-4 animate-float" />
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-amber-500/5 blur-xl" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-300">
          No movies watched yet
        </h3>
        <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
          Complete a movie from your &ldquo;Watching&rdquo; shelf or mark one
          as watched to start building your cinematic archive.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Sort Controls (glassmorphism) ─────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          <span className="text-amber-400 font-semibold">{entries.length}</span>{" "}
          {entries.length === 1 ? "movie" : "movies"} in your archive
        </p>
        <div className="flex gap-1 glass-card p-0.5">
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
              className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 ${
                sortBy === key
                  ? "bg-amber-500/15 text-amber-300 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Watched Grid ────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedEntries.map((entry, idx) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="glass-card glass-card-hover overflow-hidden poster-lift stagger-item cursor-pointer group"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex gap-3 p-4">
              {/* Poster */}
              {entry.tmdb.posterUrl ? (
                <div className="relative shrink-0 group/poster">
                  <img
                    src={entry.tmdb.posterUrl}
                    alt={entry.tmdb.title}
                    className="w-20 h-28 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Warm glow overlay on poster hover */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="w-20 h-28 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/30">
                  <Film className="w-8 h-8 text-zinc-600" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate group-hover:text-amber-200 transition-colors">
                  {entry.tmdb.title}
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {entry.tmdb.releaseYear} · {entry.tmdb.director}
                </p>

                {/* Rating */}
                <div className="mt-2">
                  {entry.review?.rating ? (
                    renderStars(entry.review.rating)
                  ) : (
                    <span className="text-xs text-zinc-600 italic">
                      Not rated
                    </span>
                  )}
                </div>

                {/* Date completed and Unwatch quick action */}
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {entry.review?.dateCompleted && (
                    <p className="flex items-center gap-1 text-xs text-zinc-500">
                      <Calendar className="w-3 h-3 text-amber-500/40" />
                      {new Date(entry.review.dateCompleted).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveToShelf(entry.id, "toWatch");
                    }}
                    className="flex items-center gap-1 text-[11px] font-medium text-amber-400/90 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/25 transition-all"
                    title="Unwatch (move back to backlog)"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Unwatch
                  </button>
                </div>

                {/* Tags — warm amber tint */}
                {entry.review?.tags && entry.review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-0.5 text-[10px] bg-amber-500/10 text-amber-300/80 px-1.5 py-0.5 rounded-md border border-amber-500/10"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => startEditing(entry)}
                  className="p-1.5 rounded-lg text-zinc-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-200"
                  title="Edit review"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveToShelf(entry.id, "toWatch")}
                  className="p-1.5 rounded-lg text-zinc-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-200"
                  title="Unwatch (Move to Backlog / To-Watch)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveToShelf(entry.id, "watching")}
                  className="p-1.5 rounded-lg text-zinc-600 hover:text-amber-300 hover:bg-amber-500/10 transition-all duration-200"
                  title="Re-watch"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notes */}
            {entry.review?.notes && (
              <div className="px-4 pb-3">
                <p className="text-xs text-zinc-400 italic leading-relaxed border-t border-amber-500/8 pt-3">
                  &ldquo;{entry.review.notes}&rdquo;
                </p>
              </div>
            )}

            {/* ── Inline Edit Mode (warm cinema style) ───────── */}
            {editingId === entry.id && (
              <div className="border-t border-amber-500/10 p-4 space-y-3 bg-amber-500/[0.03] animate-in slide-in-from-top-2 duration-200">
                {/* Rating editor */}
                <div>
                  <label className="text-xs text-amber-400/60 uppercase tracking-wider font-medium">
                    Rating
                  </label>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setEditRating(i + 1)}
                        className={`text-lg transition-all duration-150 hover:scale-110 ${
                          i < editRating
                            ? "text-amber-400"
                            : "text-zinc-700 hover:text-zinc-500"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-amber-400/70 self-center font-medium">
                      {editRating}/10
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs text-amber-400/60 uppercase tracking-wider font-medium">
                    Personal takeaways
                  </label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="What stuck with you? What would you tell a friend?"
                    className="w-full mt-1 bg-zinc-900/50 border border-amber-500/10 rounded-lg p-2.5 text-sm text-white placeholder-zinc-600 resize-none h-20 outline-none focus:border-amber-500/30 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs text-amber-400/60 uppercase tracking-wider font-medium">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="mind-bending, comfort-watch, masterpiece"
                    className="w-full mt-1 bg-zinc-900/50 border border-amber-500/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-amber-500/30 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                {/* Save/Cancel */}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(entry.id, entry.review)}
                    className="flex items-center gap-1.5 text-xs bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 px-3 py-2 rounded-lg transition-all border border-amber-500/20"
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

      {/* Media Detail Modal */}
      <MediaDetailModal
        entry={selectedEntry ? entries.find((e) => e.id === selectedEntry.id) ?? selectedEntry : null}
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}
