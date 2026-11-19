/**
 * =============================================================================
 * Movie Search Modal — Cinematic TMDB Search
 * =============================================================================
 *
 * Redesigned with the warm cinematic aesthetic:
 *  - Crisp solid modal with dark backdrop
 *  - Purple-tinted search bar with cinematic glow
 *  - Warm hover effects on search results
 *  - Gold accent buttons for adding movies
 *  - Poster-forward result cards
 *
 * ARCHITECTURAL NOTE: "Controlled" vs "Uncontrolled" Components
 * ─────────────────────────────────────────────────────────────
 * This is a "controlled" component — the parent controls whether it's
 * open via the `isOpen` prop. The search state (query, results) lives
 * locally because no other component cares about it.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Plus,
  Film,
  Tv,
  Loader2,
  CircleAlert,
  Sparkles,
  BookmarkPlus,
  Play,
  CheckCircle2,
} from "lucide-react";
import type { TMDBMovieData, Shelf } from "@/lib/types";
import { searchMovies, getMovieDetails, TMDBError } from "@/lib/tmdb";
import { useJournal } from "@/lib/journal-context";
import { MovieImage } from "./common/MovieImage";
import { WhereToWatch } from "./common/WhereToWatch";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultShelf?: Shelf;
}

export default function SearchModal({
  isOpen,
  onClose,
  defaultShelf = "toWatch",
}: SearchModalProps) {
  const { addEntry, entries } = useJournal();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBMovieData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * DEBOUNCED SEARCH
   * ────────────────
   * We don't search on every keystroke — that would flood the API.
   * Instead, we wait 400ms after the user stops typing. This is called
   * "debouncing." The cleanup function cancels the pending search if
   * the user types again before 400ms.
   */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await searchMovies(query);
        setResults(data);

        if (data.length === 0) {
          setError("No movies or shows found. Try a different search term.");
        }
      } catch (err) {
        if (err instanceof TMDBError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer); // Cleanup = cancel pending search
  }, [query]);

  // Auto-focus the search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Reset state when closing so it's fresh next time
      setQuery("");
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  /**
   * Add a movie to the journal.
   * Fetches full details first (runtime, director) before saving.
   */
  async function handleAddMovie(movie: TMDBMovieData, shelf: Shelf) {
    // Prevent duplicate additions
    const alreadyExists = entries.some(
      (e) => e.tmdb.tmdbId === movie.tmdbId
    );
    if (alreadyExists) {
      setError(`"${movie.title}" is already in your journal.`);
      return;
    }

    setAddingId(movie.tmdbId);

    try {
      // Fetch full details (includes runtime & director)
      const fullDetails = await getMovieDetails(
        movie.tmdbId,
        movie.mediaType
      );

      addEntry({
        id: crypto.randomUUID(),
        shelf,
        tmdb: fullDetails,
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Initialize progress for "watching" entries
        ...(shelf === "watching"
          ? {
              progress:
                fullDetails.mediaType === "tv"
                  ? {
                      currentSeason: 1,
                      totalSeasons: fullDetails.totalSeasons || 1,
                      currentEpisode: 1,
                      totalEpisodes: fullDetails.totalEpisodes || 10,
                      watchedEpisodes: ["S1E1"],
                      minutesWatched: fullDetails.runtime || 45,
                      totalMinutes:
                        (fullDetails.totalEpisodes || 10) * (fullDetails.runtime || 45),
                    }
                  : {
                      minutesWatched: 0,
                      totalMinutes: fullDetails.runtime,
                    },
            }
          : {}),
      });

      // Brief success feedback, then keep modal open for more additions
      setError(null);
    } catch (err) {
      if (err instanceof TMDBError) {
        setError(err.message);
      } else {
        setError("Failed to fetch movie details. Try again.");
      }
    } finally {
      setAddingId(null);
    }
  }

  if (!isOpen) return null;

  return (
    /**
     * BACKDROP + MODAL PATTERN
     * ────────────────────────
     * The outer div is the backdrop (darkened overlay). Clicking it closes
     * the modal. The inner div (with onClick stopPropagation) is the modal
     * itself — clicks inside it don't bubble up to close the backdrop.
     */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] rounded-t-2xl sm:rounded-2xl bg-[#15151C] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300 border border-[#292932]"
        style={{
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header (search bar) ──────────────────────── */}
        <div className="flex items-center gap-3 p-4 border-b border-[#292932]">
          <Search className="w-5 h-5 text-[#A1A1AA]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search movies & TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-[#A1A1AA]/50 outline-none text-lg"
            id="search-input"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <kbd className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#A1A1AA]">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Results ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-12 text-[#A1A1AA]">
              <Loader2 className="w-6 h-6 animate-spin mr-2 text-[#E50914]" />
              <span className="text-[#A1A1AA]">Searching TMDB...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 py-4 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <CircleAlert className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {!isLoading &&
            results.map((movie, idx) => {
              const isAlreadyAdded = entries.some(
                (e) => e.tmdb.tmdbId === movie.tmdbId
              );

              return (
                <div
                  key={movie.tmdbId}
                  className="flex gap-3 p-3 rounded-xl bg-[#15151C] hover:bg-[#1E1E26] border border-[#292932] hover:border-[#3D3D4C] transition-all duration-200 group stagger-item"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* Poster thumbnail */}
                  <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 bg-[#0B0B0F] border border-[#292932] group-hover:shadow-lg transition-shadow">
                    <MovieImage
                      src={movie.posterUrl}
                      alt={`${movie.title} poster`}
                      title={movie.title}
                      mediaType={movie.mediaType}
                      className="w-full h-full object-cover"
                      fallbackIconClassName="w-6 h-6 text-zinc-600"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white truncate">
                        {movie.title}
                      </h3>
                      {movie.mediaType === "tv" ? (
                        <Tv className="w-3.5 h-3.5 text-[#A1A1AA] shrink-0" />
                      ) : (
                        <Film className="w-3.5 h-3.5 text-[#A1A1AA] shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-[#A1A1AA]">
                      {movie.releaseYear}
                      {movie.genres.length > 0 &&
                        ` · ${movie.genres.slice(0, 3).join(", ")}`}
                    </p>
                    <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                      <WhereToWatch
                        tmdbId={movie.tmdbId}
                        title={movie.title}
                        mediaType={movie.mediaType}
                        variant="compact"
                      />
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                      {movie.overview}
                    </p>
                  </div>

                  {/* Add buttons */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0 self-center">
                    {isAlreadyAdded ? (
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                        In Journal ✓
                      </span>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-1">
                        <button
                          onClick={() => handleAddMovie(movie, "watching")}
                          disabled={addingId === movie.tmdbId}
                          className="flex items-center gap-1 text-[11px] font-semibold bg-[#E50914] hover:bg-[#FF3B3B] text-white px-2.5 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50"
                          title="Add to Currently Watching"
                        >
                          {addingId === movie.tmdbId ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Play className="w-3 h-3 fill-current" />
                          )}
                          <span>Watching</span>
                        </button>

                        <button
                          onClick={() => handleAddMovie(movie, "toWatch")}
                          disabled={addingId === movie.tmdbId}
                          className="flex items-center gap-1 text-[11px] font-semibold bg-[#0B0B0F] hover:bg-white/10 text-amber-400 border border-amber-500/30 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                          title="Add to To Watch Backlog"
                        >
                          <BookmarkPlus className="w-3 h-3" />
                          <span>To Watch</span>
                        </button>

                        <button
                          onClick={() => handleAddMovie(movie, "watched")}
                          disabled={addingId === movie.tmdbId}
                          className="flex items-center gap-1 text-[11px] font-semibold bg-[#0B0B0F] hover:bg-white/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                          title="Mark as Watched"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Watched</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {!isLoading && !error && results.length === 0 && query === "" && (
            <div className="text-center py-16 text-zinc-500">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 text-[#A1A1AA]/70">
                <Sparkles className="w-7 h-7 text-[#E50914]" />
              </div>
              <p className="text-lg font-medium text-[#F5F5F5]">Search for a movie or TV show</p>
              <p className="text-sm mt-1 text-[#A1A1AA]">
                Results from The Movie Database (TMDB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
