/**
 * =============================================================================
 * "To Watch" Shelf — Backlog Grid with Smart Picker
 * =============================================================================
 *
 * Features:
 *  - Searchable grid of backlog items
 *  - Genre filter dropdown
 *  - "Pick for Tonight" button with max-runtime filter & random selection
 *  - Quick actions: move to Watching, move to Watched, delete
 *
 * THE "PICK FOR TONIGHT" ALGORITHM
 * ────────────────────────────────
 * 1. Filter entries by the user's available time (max runtime).
 * 2. Optionally filter by genre.
 * 3. From the filtered set, pick one at random.
 * This gamifies the decision and solves the "paradox of choice" problem.
 */

"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Shuffle,
  Clock,
  Play,
  CheckCircle2,
  Trash2,
  Film,
  Sparkles,
  X,
  SlidersHorizontal,
} from "lucide-react";
import type { MovieEntry } from "@/lib/types";
import { useJournal } from "@/lib/journal-context";

interface ToWatchShelfProps {
  entries: MovieEntry[];
}

export default function ToWatchShelf({ entries }: ToWatchShelfProps) {
  const { moveToShelf, removeEntry } = useJournal();
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("");
  const [maxRuntime, setMaxRuntime] = useState<number>(0); // 0 = no limit
  const [pickedMovie, setPickedMovie] = useState<MovieEntry | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  /**
   * DERIVED STATE with useMemo
   * ──────────────────────────
   * `filteredEntries` is derived from `entries` + filters. useMemo ensures
   * we only recompute when the inputs change, not on every render.
   * This is a performance optimization that matters for large lists.
   */

  // Collect all unique genres across all entries
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    entries.forEach((e) => e.tmdb.genres.forEach((g) => genres.add(g)));
    return Array.from(genres).sort();
  }, [entries]);

  // Apply search + genre + runtime filters
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Text search: match title or genre names
      const matchesSearch =
        !searchQuery ||
        entry.tmdb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tmdb.genres.some((g) =>
          g.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Genre filter
      const matchesGenre =
        !genreFilter || entry.tmdb.genres.includes(genreFilter);

      // Runtime filter (0 = no limit)
      const matchesRuntime =
        maxRuntime === 0 ||
        (entry.tmdb.runtime > 0 && entry.tmdb.runtime <= maxRuntime);

      return matchesSearch && matchesGenre && matchesRuntime;
    });
  }, [entries, searchQuery, genreFilter, maxRuntime]);

  /**
   * "PICK FOR TONIGHT" — Random selection from filtered results.
   *
   * WHY Math.random() IS FINE HERE
   * ─────────────────────────────
   * We don't need cryptographic randomness for picking a movie.
   * Math.random() is fast and "random enough" for user-facing shuffles.
   * crypto.getRandomValues() would be overkill here.
   */
  function pickRandom() {
    if (filteredEntries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredEntries.length);
    setPickedMovie(filteredEntries[randomIndex]);
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <Sparkles className="w-14 h-14 mx-auto text-zinc-600 mb-4" />
        <h3 className="text-xl font-semibold text-zinc-400">
          Your backlog is empty
        </h3>
        <p className="text-zinc-500 mt-2 text-sm max-w-sm mx-auto">
          Search for movies and shows to build your watchlist. We&apos;ll help
          you pick what to watch next!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Controls Bar ────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by title or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700/30 rounded-xl text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/50 transition-colors"
              id="towatch-search"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${
              showFilters
                ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                : "bg-zinc-800/50 border-zinc-700/30 text-zinc-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Pick for Tonight */}
          <button
            onClick={pickRandom}
            disabled={filteredEntries.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle className="w-4 h-4" />
            Pick for Tonight
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/20 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">
                Genre
              </label>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="">All Genres</option>
                {allGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">
                Max Runtime
              </label>
              <select
                value={maxRuntime}
                onChange={(e) => setMaxRuntime(Number(e.target.value))}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value={0}>Any length</option>
                <option value={90}>≤ 90 min (quick watch)</option>
                <option value={120}>≤ 2 hours</option>
                <option value={150}>≤ 2.5 hours</option>
                <option value={180}>≤ 3 hours</option>
              </select>
            </div>

            <div className="flex items-end">
              <p className="text-xs text-zinc-500 py-2">
                {filteredEntries.length} of {entries.length} match filters
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Picked Movie Spotlight ──────────────────────────── */}
      {pickedMovie && (
        <div className="relative p-5 rounded-2xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 animate-in zoom-in-95 duration-300">
          <button
            onClick={() => setPickedMovie(null)}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-3 text-purple-300">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Tonight&apos;s Pick</span>
          </div>

          <div className="flex gap-4">
            {pickedMovie.tmdb.posterUrl ? (
              <img
                src={pickedMovie.tmdb.posterUrl}
                alt={pickedMovie.tmdb.title}
                className="w-20 h-28 rounded-xl object-cover"
              />
            ) : (
              <div className="w-20 h-28 rounded-xl bg-zinc-700 flex items-center justify-center">
                <Film className="w-8 h-8 text-zinc-500" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                {pickedMovie.tmdb.title}
              </h3>
              <p className="text-sm text-zinc-300 mt-0.5">
                {pickedMovie.tmdb.releaseYear} ·{" "}
                {pickedMovie.tmdb.genres.join(", ")}
              </p>
              {pickedMovie.tmdb.runtime > 0 && (
                <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {pickedMovie.tmdb.runtime} min
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    moveToShelf(pickedMovie.id, "watching");
                    setPickedMovie(null);
                  }}
                  className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Play className="w-3 h-3" />
                  Start Watching
                </button>
                <button
                  onClick={pickRandom}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  <Shuffle className="w-3 h-3" />
                  Reshuffle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Grid of Movies ──────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="group relative rounded-xl overflow-hidden border border-zinc-700/30 bg-zinc-800/30 hover:border-zinc-600/50 transition-all duration-200"
          >
            {/* Poster */}
            {entry.tmdb.posterUrl ? (
              <img
                src={entry.tmdb.posterUrl}
                alt={entry.tmdb.title}
                className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                <Film className="w-10 h-10 text-zinc-600" />
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
              <h4 className="text-sm font-semibold text-white leading-tight">
                {entry.tmdb.title}
              </h4>
              <p className="text-xs text-zinc-300 mt-1">
                {entry.tmdb.releaseYear}
                {entry.tmdb.runtime > 0 && ` · ${entry.tmdb.runtime}m`}
              </p>

              <div className="flex gap-1.5 mt-2">
                <button
                  onClick={() => moveToShelf(entry.id, "watching")}
                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-indigo-600/80 hover:bg-indigo-500 text-white py-1.5 rounded-lg transition-colors"
                  title="Start watching"
                >
                  <Play className="w-3 h-3" />
                </button>
                <button
                  onClick={() =>
                    moveToShelf(entry.id, "watched", {
                      rating: 0,
                      notes: "",
                      tags: [],
                      dateCompleted: new Date().toISOString(),
                    })
                  }
                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-emerald-600/80 hover:bg-emerald-500 text-white py-1.5 rounded-lg transition-colors"
                  title="Mark as watched"
                >
                  <CheckCircle2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="flex items-center justify-center text-xs bg-red-600/80 hover:bg-red-500 text-white py-1.5 px-2 rounded-lg transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Runtime badge */}
            {entry.tmdb.runtime > 0 && (
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-xs text-white px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {entry.tmdb.runtime}m
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && entries.length > 0 && (
        <div className="text-center py-12 text-zinc-500">
          <p>No movies match your current filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setGenreFilter("");
              setMaxRuntime(0);
            }}
            className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
