/**
 * =============================================================================
 * "To Watch" Shelf — Cinematic Poster Grid with Smart Picker
 * =============================================================================
 *
 * Redesigned with the warm cinematic aesthetic:
 *  - Poster-forward grid with warm hover effects
 *  - Glassmorphism filter bar
 *  - Amber/gold "Pick for Tonight" roulette button
 *  - Warm gradient overlays on hover
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
  Star,
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
  const [maxRuntime, setMaxRuntime] = useState<number>(0);
  const [pickedMovie, setPickedMovie] = useState<MovieEntry | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    entries.forEach((e) => e.tmdb.genres.forEach((g) => genres.add(g)));
    return Array.from(genres).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        !searchQuery ||
        entry.tmdb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tmdb.genres.some((g) =>
          g.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesGenre =
        !genreFilter || entry.tmdb.genres.includes(genreFilter);

      const matchesRuntime =
        maxRuntime === 0 ||
        (entry.tmdb.runtime > 0 && entry.tmdb.runtime <= maxRuntime);

      return matchesSearch && matchesGenre && matchesRuntime;
    });
  }, [entries, searchQuery, genreFilter, maxRuntime]);

  function pickRandom() {
    if (filteredEntries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredEntries.length);
    setPickedMovie(filteredEntries[randomIndex]);
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex p-4 rounded-2xl bg-amber-500/8 mb-4">
          <Sparkles className="w-10 h-10 text-amber-500/40" />
        </div>
        <h3 className="text-xl font-semibold text-stone-300">
          Your backlog is empty
        </h3>
        <p className="text-stone-500 mt-2 text-sm max-w-sm mx-auto">
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
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by title or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-card text-sm text-white placeholder-stone-500 outline-none focus:border-amber-500/30 transition-colors"
              id="towatch-search"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${
              showFilters
                ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                : "glass-card text-stone-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Pick for Tonight */}
          <button
            onClick={pickRandom}
            disabled={filteredEntries.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle className="w-4 h-4" />
            Pick for Tonight
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 glass-card animate-in slide-in-from-bottom-4 duration-200">
            <div className="space-y-1.5">
              <label className="text-xs text-stone-500 uppercase tracking-wider">
                Genre
              </label>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50"
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
              <label className="text-xs text-stone-500 uppercase tracking-wider">
                Max Runtime
              </label>
              <select
                value={maxRuntime}
                onChange={(e) => setMaxRuntime(Number(e.target.value))}
                className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50"
              >
                <option value={0}>Any length</option>
                <option value={90}>≤ 90 min (quick watch)</option>
                <option value={120}>≤ 2 hours</option>
                <option value={150}>≤ 2.5 hours</option>
                <option value={180}>≤ 3 hours</option>
              </select>
            </div>

            <div className="flex items-end">
              <p className="text-xs text-stone-500 py-2">
                {filteredEntries.length} of {entries.length} match filters
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Picked Movie Spotlight ──────────────────────────── */}
      {pickedMovie && (
        <div className="relative p-5 rounded-2xl overflow-hidden border border-amber-500/20 animate-in zoom-in-95 duration-300">
          {/* Ambient backdrop from the picked poster */}
          {pickedMovie.tmdb.posterUrl && (
            <div className="absolute inset-0">
              <img
                src={pickedMovie.tmdb.posterUrl}
                alt=""
                className="w-full h-full object-cover opacity-10 blur-2xl"
              />
              <div className="absolute inset-0 bg-[#0a0a0a]/80" />
            </div>
          )}

          <div className="relative z-10">
            <button
              onClick={() => setPickedMovie(null)}
              className="absolute top-0 right-0 p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3 text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Tonight&apos;s Pick</span>
            </div>

            <div className="flex gap-4">
              {pickedMovie.tmdb.posterUrl ? (
                <img
                  src={pickedMovie.tmdb.posterUrl}
                  alt={pickedMovie.tmdb.title}
                  className="w-24 h-36 rounded-xl object-cover shadow-lg shadow-black/50"
                />
              ) : (
                <div className="w-24 h-36 rounded-xl bg-stone-800 flex items-center justify-center">
                  <Film className="w-8 h-8 text-stone-600" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">
                  {pickedMovie.tmdb.title}
                </h3>
                <p className="text-sm text-stone-300 mt-0.5">
                  {pickedMovie.tmdb.releaseYear} ·{" "}
                  {pickedMovie.tmdb.genres.join(", ")}
                </p>
                {pickedMovie.tmdb.runtime > 0 && (
                  <p className="text-sm text-stone-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {pickedMovie.tmdb.runtime} min
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      moveToShelf(pickedMovie.id, "watching");
                      setPickedMovie(null);
                    }}
                    className="flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded-lg transition-colors font-medium"
                  >
                    <Play className="w-3 h-3" />
                    Start Watching
                  </button>
                  <button
                    onClick={pickRandom}
                    className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white px-3.5 py-2 rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    <Shuffle className="w-3 h-3" />
                    Reshuffle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Poster Grid ──────────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredEntries.map((entry, index) => (
          <div
            key={entry.id}
            className="group relative rounded-xl overflow-hidden border border-stone-800/40 poster-lift stagger-item"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Poster */}
            {entry.tmdb.posterUrl ? (
              <img
                src={entry.tmdb.posterUrl}
                alt={entry.tmdb.title}
                className="w-full aspect-[2/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                <Film className="w-10 h-10 text-stone-700" />
              </div>
            )}

            {/* Hover overlay — warm gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <h4 className="text-sm font-semibold text-white leading-tight">
                {entry.tmdb.title}
              </h4>
              <p className="text-xs text-stone-300 mt-1">
                {entry.tmdb.releaseYear}
                {entry.tmdb.runtime > 0 && ` · ${entry.tmdb.runtime}m`}
              </p>

              <div className="flex gap-1.5 mt-2.5">
                <button
                  onClick={() => moveToShelf(entry.id, "watching")}
                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-amber-600/80 hover:bg-amber-500 text-white py-1.5 rounded-lg transition-colors"
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
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-[10px] text-white px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {entry.tmdb.runtime}m
              </div>
            )}

            {/* Title below poster (always visible) */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 to-transparent group-hover:opacity-0 transition-opacity">
              <p className="text-xs font-medium text-white truncate">
                {entry.tmdb.title}
              </p>
              {entry.tmdb.releaseYear && (
                <p className="text-[10px] text-stone-400">
                  {entry.tmdb.releaseYear}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && entries.length > 0 && (
        <div className="text-center py-12 text-stone-500">
          <p>No movies match your current filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setGenreFilter("");
              setMaxRuntime(0);
            }}
            className="mt-2 text-amber-400 hover:text-amber-300 text-sm underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
