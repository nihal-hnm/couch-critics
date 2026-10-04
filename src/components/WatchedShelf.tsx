/**
 * =============================================================================
 * "Watched" Shelf — Cinematic Archive with Separate Movies & Series
 * =============================================================================
 *
 * Features:
 *  - Strict separation of Movies and TV Series to prevent mixing
 *  - Filter tabs: All (with exact breakdown), Movies Only, TV Series Only
 *  - Grouped section mode (Watched Movies vs Completed TV Series)
 *  - Careful sorting: Recently Completed, Highest Rated (unrated last), Title (A-Z), Release Year
 *  - 100% accurate count displays with singular/plural grammar
 *  - Inline review editor, unwatch/re-watch shortcuts, and detail modal
 */

"use client";

import { useState, useMemo } from "react";
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
  Tv,
  Search,
  SlidersHorizontal,
  Clock,
  Layers,
  LayoutGrid,
} from "lucide-react";
import type { MovieEntry, UserReview } from "@/lib/types";
import { useJournal } from "@/lib/journal-context";
import { formatHours } from "@/lib/stats";
import { getCachedTVSeasons } from "@/lib/tv-seasons-cache";
import MediaDetailModal from "./MediaDetailModal";

interface WatchedShelfProps {
  entries: MovieEntry[];
  defaultMediaType?: "all" | "movie" | "tv";
  hideMediaTypeFilter?: boolean;
}

type SortOption = "recent" | "rating" | "title" | "year";
type ViewLayout = "grouped" | "combined";

export default function WatchedShelf({
  entries,
  defaultMediaType = "all",
  hideMediaTypeFilter = false,
}: WatchedShelfProps) {
  const { updateReview, removeEntry, moveToShelf } = useJournal();
  const [selectedEntry, setSelectedEntry] = useState<MovieEntry | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState<"all" | "movie" | "tv">(defaultMediaType);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewLayout, setViewLayout] = useState<ViewLayout>("grouped");

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
      dateCompleted: existingReview?.dateCompleted ?? new Date().toISOString(),
    };
    updateReview(id, review);
    setEditingId(null);
  }

  // ─── Exact Counts Calculation ──────────────────────────────────────────────
  const allMovies = useMemo(
    () => entries.filter((e) => e.tmdb.mediaType === "movie"),
    [entries]
  );
  const allSeries = useMemo(
    () => entries.filter((e) => e.tmdb.mediaType === "tv"),
    [entries]
  );

  const totalCount = entries.length;
  const movieCount = allMovies.length;
  const seriesCount = allSeries.length;

  // ─── Search Filtering ──────────────────────────────────────────────────────
  const matchesSearch = (entry: MovieEntry) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = entry.tmdb.title.toLowerCase().includes(q);
    const directorMatch = entry.tmdb.director?.toLowerCase().includes(q);
    const genreMatch = entry.tmdb.genres.some((g) => g.toLowerCase().includes(q));
    const tagMatch = entry.review?.tags?.some((t) => t.toLowerCase().includes(q));
    return titleMatch || directorMatch || genreMatch || tagMatch;
  };

  // ─── Careful Sorting Function ──────────────────────────────────────────────
  const sortList = (list: MovieEntry[]) => {
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case "recent": {
          const timeA = new Date(a.review?.dateCompleted || a.updatedAt || a.addedAt).getTime();
          const timeB = new Date(b.review?.dateCompleted || b.updatedAt || b.addedAt).getTime();
          return timeB - timeA;
        }
        case "rating": {
          const ratingA = a.review?.rating ?? -1;
          const ratingB = b.review?.rating ?? -1;
          if (ratingB !== ratingA) return ratingB - ratingA;
          // Tiebreaker: most recently completed
          const timeA = new Date(a.review?.dateCompleted || a.updatedAt || a.addedAt).getTime();
          const timeB = new Date(b.review?.dateCompleted || b.updatedAt || b.addedAt).getTime();
          return timeB - timeA;
        }
        case "title": {
          return a.tmdb.title.localeCompare(b.tmdb.title, undefined, { sensitivity: "base" });
        }
        case "year": {
          const yearA = parseInt(a.tmdb.releaseYear, 10) || 0;
          const yearB = parseInt(b.tmdb.releaseYear, 10) || 0;
          if (yearB !== yearA) return yearB - yearA;
          return a.tmdb.title.localeCompare(b.tmdb.title);
        }
        default:
          return 0;
      }
    });
  };

  // Filtered & sorted lists
  const searchedMovies = useMemo(() => allMovies.filter(matchesSearch), [allMovies, searchQuery]);
  const searchedSeries = useMemo(() => allSeries.filter(matchesSearch), [allSeries, searchQuery]);

  const sortedMovies = useMemo(() => sortList(searchedMovies), [searchedMovies, sortBy]);
  const sortedSeries = useMemo(() => sortList(searchedSeries), [searchedSeries, sortBy]);

  // Combined sorted list for single-stream view
  const combinedEntries = useMemo(() => {
    let list: MovieEntry[] = [];
    if (mediaFilter === "all") {
      list = [...searchedMovies, ...searchedSeries];
    } else if (mediaFilter === "movie") {
      list = searchedMovies;
    } else {
      list = searchedSeries;
    }
    return sortList(list);
  }, [searchedMovies, searchedSeries, mediaFilter, sortBy]);

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 transition-colors ${
              i < rating ? "text-purple-400 fill-purple-400" : "text-zinc-700"
            }`}
          />
        ))}
        <span className="ml-1.5 text-xs text-purple-400/90 font-mono font-semibold">
          {rating}/10
        </span>
      </div>
    );
  }

  // ─── Individual Card Renderer ──────────────────────────────────────────────
  function renderCard(entry: MovieEntry, idx: number) {
    const isTV = entry.tmdb.mediaType === "tv";
    return (
      <div
        key={entry.id}
        onClick={() => setSelectedEntry(entry)}
        className="glass-card glass-card-hover overflow-hidden poster-lift stagger-item cursor-pointer group flex flex-col justify-between"
        style={{ animationDelay: `${idx * 40}ms` }}
      >
        <div className="flex gap-3.5 p-4">
          {/* Poster with hover lift */}
          {entry.tmdb.posterUrl ? (
            <div className="relative shrink-0 group/poster">
              <img
                src={entry.tmdb.posterUrl}
                alt={entry.tmdb.title}
                loading="lazy"
                className="w-20 h-28 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300 shadow-md bg-stone-900"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-purple-500/15 to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="w-20 h-28 rounded-lg bg-stone-800 flex flex-col items-center justify-center shrink-0 border border-stone-700/30 text-stone-500">
              {isTV ? <Tv className="w-7 h-7 mb-1" /> : <Film className="w-7 h-7 mb-1" />}
              <span className="text-[10px] uppercase font-mono">No Poster</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Media Type & Year Badges */}
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isTV
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                }`}
              >
                {isTV ? <Tv className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                {isTV ? "TV Series" : "Movie"}
              </span>

              {entry.tmdb.releaseYear && (
                <span className="text-[10px] font-mono text-stone-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                  {entry.tmdb.releaseYear}
                </span>
              )}

              {/* Runtime / Episodes */}
              {isTV ? (() => {
                const totalSeasons =
                  entry.tmdb.totalSeasons ||
                  getCachedTVSeasons(entry.tmdb.tmdbId)?.totalSeasons ||
                  entry.tmdb.seasons?.length;
                return totalSeasons ? (
                  <span className="text-[10px] text-stone-400 font-mono">
                    {totalSeasons} {totalSeasons === 1 ? "Season" : "Seasons"}
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-400 font-mono">
                    {entry.progress?.totalEpisodes ?? entry.tmdb.totalEpisodes ?? 10} eps
                  </span>
                );
              })() : entry.tmdb.runtime > 0 ? (
                <span className="text-[10px] text-stone-400 font-mono flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {formatHours(entry.tmdb.runtime)}
                </span>
              ) : null}
            </div>

            <h4 className="font-bold text-white text-sm sm:text-base truncate group-hover:text-purple-300 transition-colors">
              {entry.tmdb.title}
            </h4>

            {entry.tmdb.director && (
              <p className="text-xs text-stone-400 mt-0.5 truncate">
                {isTV ? "Creator:" : "Dir:"} {entry.tmdb.director}
              </p>
            )}

            {/* Rating */}
            <div className="mt-2">
              {entry.review?.rating ? (
                renderStars(entry.review.rating)
              ) : (
                <span className="text-xs text-stone-500 italic bg-white/5 px-2 py-0.5 rounded-md">
                  Not rated yet
                </span>
              )}
            </div>

            {/* Date completed and Unwatch quick action */}
            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
              {entry.review?.dateCompleted && (
                <p className="flex items-center gap-1 text-[11px] text-stone-400">
                  <Calendar className="w-3 h-3 text-purple-400/60" />
                  {new Date(entry.review.dateCompleted).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveToShelf(entry.id, "toWatch");
                }}
                className="flex items-center gap-1 text-[11px] font-medium text-purple-300/90 hover:text-white bg-purple-500/10 hover:bg-purple-500/25 px-2 py-0.5 rounded-md border border-purple-500/25 transition-all cursor-pointer"
                title="Move back to backlog"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Unwatch
              </button>
            </div>

            {/* Tags */}
            {entry.review?.tags && entry.review.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {entry.review.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-0.5 text-[10px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded-md border border-purple-500/15"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => startEditing(entry)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-purple-300 hover:bg-purple-500/15 transition-all cursor-pointer"
              title="Edit review & rating"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => moveToShelf(entry.id, "watching")}
              className="p-1.5 rounded-lg text-stone-400 hover:text-purple-300 hover:bg-purple-500/15 transition-all cursor-pointer"
              title="Watch again"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => removeEntry(entry.id)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer"
              title="Remove from journal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Review Notes Preview */}
        {entry.review?.notes && (
          <div className="px-4 pb-3">
            <p className="text-xs text-stone-300/90 italic leading-relaxed border-t border-purple-500/10 pt-2.5 line-clamp-2">
              &ldquo;{entry.review.notes}&rdquo;
            </p>
          </div>
        )}

        {/* ── Inline Edit Mode ── */}
        {editingId === entry.id && (
          <div
            className="border-t border-purple-500/20 p-4 space-y-3 bg-purple-950/20 animate-in slide-in-from-top-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <label className="text-[11px] text-purple-300 font-semibold uppercase tracking-wider">
                Rating (1 - 10)
              </label>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setEditRating(i + 1)}
                    className={`text-lg transition-all duration-150 hover:scale-110 cursor-pointer ${
                      i < editRating ? "text-purple-400" : "text-stone-700 hover:text-stone-500"
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-purple-300 self-center font-mono font-bold">
                  {editRating}/10
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-purple-300 font-semibold uppercase tracking-wider">
                Notes &amp; Takeaways
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="What stuck with you? What would you tell a friend?"
                className="w-full mt-1 bg-black/50 border border-purple-500/20 rounded-lg p-2.5 text-xs text-white placeholder-stone-500 resize-none h-20 outline-none focus:border-purple-500/40"
              />
            </div>

            <div>
              <label className="text-[11px] text-purple-300 font-semibold uppercase tracking-wider">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="mind-bending, comfort-watch, masterpiece"
                className="w-full mt-1 bg-black/50 border border-purple-500/20 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 outline-none focus:border-purple-500/40"
              />
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => setEditingId(null)}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                onClick={() => saveEdit(entry.id, entry.review)}
                className="flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-all shadow-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Review
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Empty State ───────────────────────────────────────────────────────────
  if (totalCount === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-2xl border border-purple-500/15">
        <div className="relative inline-block">
          <Award className="w-16 h-16 mx-auto text-purple-500/30 mb-4 animate-float" />
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-purple-500/10 blur-xl" />
        </div>
        <h3 className="text-xl font-bold text-white">No Watched Titles Yet</h3>
        <p className="text-stone-400 mt-2 text-sm max-w-md mx-auto leading-relaxed">
          Complete a movie or TV series from your &ldquo;Currently Watching&rdquo; shelf or mark one as watched to build your personal archive.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Control Bar: Media Filter, Search & Sorter ──────────────────────── */}
      <div className="glass-card p-4 rounded-2xl border border-purple-500/20 space-y-4">
        {/* Top Row: Type Pills & Sorter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Media Type Tabs (All | Movies | TV Series) */}
          {!hideMediaTypeFilter && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              <button
                onClick={() => setMediaFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  mediaFilter === "all"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/25"
                    : "text-stone-400 hover:text-white bg-white/5 hover:bg-white/10"
                }`}
              >
                <span>All Titles</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
                  {totalCount}
                </span>
              </button>

              <button
                onClick={() => setMediaFilter("movie")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  mediaFilter === "movie"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-stone-400 hover:text-white bg-white/5 hover:bg-white/10"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Movies</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
                  {movieCount}
                </span>
              </button>

              <button
                onClick={() => setMediaFilter("tv")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  mediaFilter === "tv"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/25"
                    : "text-stone-400 hover:text-white bg-white/5 hover:bg-white/10"
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>TV Series</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
                  {seriesCount}
                </span>
              </button>
            </div>
          )}

          {/* Right: Layout Toggle & Sort Buttons */}
          <div className="flex items-center gap-2.5 ml-auto flex-wrap">
            {/* View Layout Toggle (only when viewing "all" and both types exist) */}
            {mediaFilter === "all" && movieCount > 0 && seriesCount > 0 && (
              <div className="flex items-center bg-black/30 p-0.5 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewLayout("grouped")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    viewLayout === "grouped"
                      ? "bg-purple-500/25 text-purple-200 border border-purple-500/30 shadow-sm"
                      : "text-stone-400 hover:text-white"
                  }`}
                  title="Grouped: Separate Movies & TV Series sections"
                >
                  <Layers className="w-3 h-3" />
                  <span>Separated</span>
                </button>
                <button
                  onClick={() => setViewLayout("combined")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    viewLayout === "combined"
                      ? "bg-purple-500/25 text-purple-200 border border-purple-500/30 shadow-sm"
                      : "text-stone-400 hover:text-white"
                  }`}
                  title="Unified: Single timeline grid"
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>Combined</span>
                </button>
              </div>
            )}

            {/* Sort Dropdown / Pills */}
            <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold text-stone-500 uppercase px-2">Sort:</span>
              {(
                [
                  { key: "recent", label: "Recent" },
                  { key: "rating", label: "Rating" },
                  { key: "year", label: "Year" },
                  { key: "title", label: "A-Z" },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    sortBy === key
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Search Input & Summary Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-white/5">
          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, director, or tag..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-purple-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Accurate Dynamic Counter Text */}
          <div className="text-xs text-stone-400 font-medium">
            {mediaFilter === "all" ? (
              <span>
                Archive: <strong className="text-purple-300 font-mono">{totalCount}</strong> titles (
                <strong className="text-indigo-300 font-mono">{movieCount}</strong> {movieCount === 1 ? "Movie" : "Movies"},{" "}
                <strong className="text-purple-300 font-mono">{seriesCount}</strong> {seriesCount === 1 ? "TV Series" : "TV Series"})
              </span>
            ) : mediaFilter === "movie" ? (
              <span>
                Showing <strong className="text-indigo-300 font-mono">{sortedMovies.length}</strong> of{" "}
                <strong className="text-white font-mono">{movieCount}</strong> {movieCount === 1 ? "watched movie" : "watched movies"}
              </span>
            ) : (
              <span>
                Showing <strong className="text-purple-300 font-mono">{sortedSeries.length}</strong> of{" "}
                <strong className="text-white font-mono">{seriesCount}</strong> completed TV {seriesCount === 1 ? "series" : "series"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content Grids (Carefully Separated) ─────────────────────────────── */}

      {/* Mode A: Grouped Mode (Movies & TV Series separated into their own distinct sections) */}
      {mediaFilter === "all" && viewLayout === "grouped" ? (
        <div className="space-y-8">
          {/* Section 1: Watched Movies */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/15 pb-2.5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Film className="w-4 h-4" />
                </div>
                <span>Watched Movies</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {sortedMovies.length} {sortedMovies.length === 1 ? "film" : "films"}
                </span>
              </h3>
            </div>

            {sortedMovies.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sortedMovies.map((entry, idx) => renderCard(entry, idx))}
              </div>
            ) : (
              <div className="p-6 text-center glass-card rounded-xl border border-white/5 text-stone-500 text-xs">
                {searchQuery ? "No movies matched your search." : "No watched movies yet."}
              </div>
            )}
          </section>

          {/* Section 2: Completed TV Series */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/15 pb-2.5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Tv className="w-4 h-4" />
                </div>
                <span>Completed TV Series</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {sortedSeries.length} {sortedSeries.length === 1 ? "series" : "series"}
                </span>
              </h3>
            </div>

            {sortedSeries.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sortedSeries.map((entry, idx) => renderCard(entry, idx))}
              </div>
            ) : (
              <div className="p-6 text-center glass-card rounded-xl border border-white/5 text-stone-500 text-xs">
                {searchQuery ? "No TV series matched your search." : "No completed TV series yet."}
              </div>
            )}
          </section>
        </div>
      ) : (
        /* Mode B: Filtered or Combined Single Grid */
        <div>
          {combinedEntries.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {combinedEntries.map((entry, idx) => renderCard(entry, idx))}
            </div>
          ) : (
            <div className="p-12 text-center glass-card rounded-2xl border border-purple-500/15">
              <p className="text-stone-400 text-sm">
                No titles found matching your filter or search query.
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-xs text-purple-400 hover:text-purple-300 font-semibold underline cursor-pointer"
                >
                  Clear search query
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Media Detail Modal */}
      <MediaDetailModal
        entry={selectedEntry ? entries.find((e) => e.id === selectedEntry.id) ?? selectedEntry : null}
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}
