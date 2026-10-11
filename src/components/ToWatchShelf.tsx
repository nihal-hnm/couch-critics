/**
 * =============================================================================
 * "To Watch" Shelf — Cinematic Poster Grid with Smart Picker
 * =============================================================================
 *
 * Redesigned with the warm cinematic aesthetic:
 *  - Poster-forward grid with warm hover effects
 *  - Glassmorphism filter bar
 *  - Purple/gold "Pick for Tonight" roulette button
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
import MediaDetailModal from "./MediaDetailModal";
import { MovieImage } from "./common/MovieImage";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { WhereToWatch } from "./common/WhereToWatch";

interface ToWatchShelfProps {
  entries: MovieEntry[];
}

export default function ToWatchShelf({ entries }: ToWatchShelfProps) {
  const { moveToShelf, removeEntry } = useJournal();
  const [selectedEntry, setSelectedEntry] = useState<MovieEntry | null>(null);
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
        <div className="inline-flex p-4 rounded-2xl bg-[#15151C] border border-[#292932] mb-4">
          <Sparkles className="w-10 h-10 text-[#A1A1AA]/50" />
        </div>
        <h3 className="text-xl font-semibold text-[#F5F5F5]">
          Your backlog is empty
        </h3>
        <p className="text-[#A1A1AA] mt-2 text-sm max-w-sm mx-auto">
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
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by title or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 liquid-glass-card text-sm text-[#F5F5F5] placeholder-[#A1A1AA]/50 outline-none focus:border-[#E50914]/50 transition-colors"
              id="towatch-search"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all cursor-pointer ${
              showFilters
                ? "bg-[#E50914]/15 text-[#E50914] border-[#E50914]/40 font-semibold"
                : "liquid-glass-card text-[#A1A1AA] hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Pick for Tonight */}
          <button
            onClick={pickRandom}
            disabled={filteredEntries.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E50914] to-[#B81D24] hover:from-[#FF1E28] hover:to-[#E50914] text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#E50914]/25 hover:shadow-lg hover:shadow-[#E50914]/40 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-white" />
            Pick for Tonight
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 glass-card border border-[#292932] animate-in slide-in-from-bottom-4 duration-200">
            <div className="space-y-1.5">
              <label className="text-xs text-[#A1A1AA] uppercase tracking-wider">
                Genre
              </label>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="bg-[#0B0B0F] border border-[#292932] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] outline-none focus:border-amber-500/50"
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
              <label className="text-xs text-[#A1A1AA] uppercase tracking-wider">
                Max Runtime
              </label>
              <select
                value={maxRuntime}
                onChange={(e) => setMaxRuntime(Number(e.target.value))}
                className="bg-[#0B0B0F] border border-[#292932] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] outline-none focus:border-amber-500/50"
              >
                <option value={0}>Any length</option>
                <option value={90}>≤ 90 min (quick watch)</option>
                <option value={120}>≤ 2 hours</option>
                <option value={150}>≤ 2.5 hours</option>
                <option value={180}>≤ 3 hours</option>
              </select>
            </div>

            <div className="flex items-end">
              <p className="text-xs text-[#A1A1AA] py-2">
                {filteredEntries.length} of {entries.length} match filters
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Picked Movie Spotlight ──────────────────────────── */}
      {pickedMovie && (
        <div className="relative p-5 rounded-2xl border border-amber-500/30 bg-[#15151C] overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Ambient backdrop from the picked poster */}
          {pickedMovie.tmdb.posterUrl && (
            <div className="absolute inset-0">
              <img
                src={getOptimizedImageUrl(pickedMovie.tmdb.posterUrl)}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-10 blur-2xl"
              />
              <div className="absolute inset-0 spotlight-scrim" />
            </div>
          )}

          <div className="relative z-10">
            <button
              onClick={() => setPickedMovie(null)}
              className="absolute top-0 right-0 p-1.5 rounded-lg hover:bg-white/10 text-[#A1A1AA] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3 text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold">Tonight&apos;s Pick</span>
            </div>

            <div className="flex gap-4">
              <div className="w-24 h-36 rounded-xl overflow-hidden shadow-lg shadow-black/50 shrink-0 bg-[#0B0B0F] border border-[#292932]">
                <MovieImage
                  src={pickedMovie.tmdb.posterUrl}
                  alt={pickedMovie.tmdb.title}
                  title={pickedMovie.tmdb.title}
                  mediaType={pickedMovie.tmdb.mediaType}
                  className="w-full h-full object-cover"
                  fallbackIconClassName="w-8 h-8 text-stone-600"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#F5F5F5]">
                  {pickedMovie.tmdb.title}
                </h3>
                <p className="text-sm text-[#A1A1AA] mt-0.5">
                  {pickedMovie.tmdb.releaseYear} ·{" "}
                  {pickedMovie.tmdb.genres.join(", ")}
                </p>
                {pickedMovie.tmdb.runtime > 0 && (
                  <p className="text-sm text-[#A1A1AA] mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {pickedMovie.tmdb.runtime} min
                  </p>
                )}

                <div className="mt-2.5">
                  <WhereToWatch
                    tmdbId={pickedMovie.tmdb.tmdbId}
                    title={pickedMovie.tmdb.title}
                    mediaType={pickedMovie.tmdb.mediaType}
                    variant="compact"
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      moveToShelf(pickedMovie.id, "watching");
                      setPickedMovie(null);
                    }}
                    className="flex items-center gap-1.5 text-xs bg-[#E50914] hover:bg-[#FF3B3B] text-white px-3.5 py-2 rounded-lg transition-colors font-semibold shadow-md cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    Start Watching
                  </button>
                  <button
                    onClick={pickRandom}
                    className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/10 transition-colors border border-[#292932] cursor-pointer"
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
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {filteredEntries.map((entry, index) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="group relative rounded-xl overflow-hidden border border-[#292932] bg-[#15151C] poster-lift stagger-item cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Poster */}
            <div className="w-full aspect-[2/3] bg-[#0B0B0F] overflow-hidden">
              <MovieImage
                src={entry.tmdb.posterUrl}
                alt={entry.tmdb.title}
                title={entry.tmdb.title}
                mediaType={entry.tmdb.mediaType}
                className="w-full h-full object-cover transition-transform duration-300"
                fallbackIconClassName="w-10 h-10 text-stone-700"
              />
            </div>

            {/* Hover overlay — subtle cinema gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <h4 className="text-sm font-semibold text-[#F5F5F5] leading-tight">
                {entry.tmdb.title}
              </h4>
              <p className="text-xs text-[#A1A1AA] mt-1">
                {entry.tmdb.releaseYear}
                {entry.tmdb.runtime > 0 && ` · ${entry.tmdb.runtime}m`}
              </p>

              <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                <WhereToWatch
                  tmdbId={entry.tmdb.tmdbId}
                  title={entry.tmdb.title}
                  mediaType={entry.tmdb.mediaType}
                  variant="compact"
                />
              </div>

              <div className="flex gap-1.5 mt-2.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => moveToShelf(entry.id, "watching")}
                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-[#E50914] hover:bg-[#FF3B3B] text-white py-1.5 rounded-lg transition-colors cursor-pointer"
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
                  className="flex-1 flex items-center justify-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-[#F5F5F5] py-1.5 rounded-lg transition-colors border border-[#292932] cursor-pointer"
                  title="Mark as watched"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#F5C542]" />
                </button>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="flex items-center justify-center text-xs bg-white/10 hover:bg-[#E50914] text-[#A1A1AA] hover:text-white py-1.5 px-2 rounded-lg transition-colors border border-[#292932] cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Runtime badge */}
            {entry.tmdb.runtime > 0 && (
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-[10px] text-[#F5F5F5] border border-[#292932] px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {entry.tmdb.runtime}m
              </div>
            )}

            {/* Title below poster (always visible) */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/95 to-transparent group-hover:opacity-0 transition-opacity">
              <p className="text-xs font-medium text-[#F5F5F5] truncate">
                {entry.tmdb.title}
              </p>
              {entry.tmdb.releaseYear && (
                <p className="text-[10px] text-[#A1A1AA]">
                  {entry.tmdb.releaseYear}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && entries.length > 0 && (
        <div className="text-center py-12 text-[#A1A1AA]">
          <p>No movies match your current filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setGenreFilter("");
              setMaxRuntime(0);
            }}
            className="mt-2 text-[#E50914] hover:text-[#FF3B3B] text-sm underline cursor-pointer"
          >
            Clear all filters
          </button>
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
