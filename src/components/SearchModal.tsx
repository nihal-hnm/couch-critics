/**
 * =============================================================================
 * Movie Search Modal — Cinematic TMDB Search
 * =============================================================================
 *
 * Redesigned with the warm cinematic aesthetic:
 *  - Glassmorphism modal with warm backdrop
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
} from "lucide-react";
import type { TMDBMovieData, Shelf } from "@/lib/types";
import { searchMovies, getMovieDetails, TMDBError } from "@/lib/tmdb";
import { useJournal } from "@/lib/journal-context";

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] rounded-t-2xl sm:rounded-2xl glass-card shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        style={{
          boxShadow: "0 0 80px rgba(245, 158, 11, 0.06), 0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header (warm search bar) ──────────────────────── */}
        <div className="flex items-center gap-3 p-4 border-b border-purple-500/10">
          <Search className="w-5 h-5 text-purple-400/60" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search movies & TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-lg"
            id="search-input"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Results ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-12 text-purple-400/60">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-zinc-400">Searching TMDB...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 py-4 px-3 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400 text-sm">
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
                  className="flex gap-3 p-3 rounded-xl glass-card glass-card-hover transition-all duration-200 group stagger-item"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* Poster thumbnail */}
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={`${movie.title} poster`}
                      className="w-16 h-24 rounded-lg object-cover shrink-0 group-hover:shadow-lg group-hover:shadow-purple-500/10 transition-shadow"
                    />
                  ) : (
                    <div className="w-16 h-24 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/30">
                      <Film className="w-6 h-6 text-zinc-600" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white truncate">
                        {movie.title}
                      </h3>
                      {movie.mediaType === "tv" ? (
                        <Tv className="w-3.5 h-3.5 text-purple-300/60 shrink-0" />
                      ) : (
                        <Film className="w-3.5 h-3.5 text-purple-400/60 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-400">
                      {movie.releaseYear}
                      {movie.genres.length > 0 &&
                        ` · ${movie.genres.slice(0, 3).join(", ")}`}
                    </p>
                    <p className="text-xs text-zinc-600 line-clamp-2 mt-1">
                      {movie.overview}
                    </p>
                  </div>

                  {/* Add buttons */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {isAlreadyAdded ? (
                      <span className="text-xs text-purple-400 bg-purple-400/10 px-2.5 py-1.5 rounded-lg border border-purple-400/15">
                        Added ✓
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAddMovie(movie, defaultShelf)}
                          disabled={addingId === movie.tmdbId}
                          className="flex items-center gap-1 text-xs bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 px-2.5 py-1.5 rounded-lg transition-all border border-purple-500/20 disabled:opacity-50"
                        >
                          {addingId === movie.tmdbId ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                          {defaultShelf === "watching"
                            ? "Watching"
                            : defaultShelf === "watched"
                              ? "Watched"
                              : "To Watch"}
                        </button>
                        {defaultShelf !== "toWatch" && (
                          <button
                            onClick={() => handleAddMovie(movie, "toWatch")}
                            disabled={addingId === movie.tmdbId}
                            className="text-xs text-zinc-500 hover:text-purple-300 px-2.5 py-1 rounded-lg hover:bg-purple-500/10 transition-all flex items-center gap-1"
                          >
                            <BookmarkPlus className="w-3 h-3 text-purple-400" />
                            + To Watch
                          </button>
                        )}
                        {defaultShelf !== "watching" && (
                          <button
                            onClick={() => handleAddMovie(movie, "watching")}
                            disabled={addingId === movie.tmdbId}
                            className="text-xs text-zinc-500 hover:text-purple-300 px-2.5 py-1 rounded-lg hover:bg-purple-500/10 transition-all flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            + Watching
                          </button>
                        )}
                        {defaultShelf !== "watched" && (
                          <button
                            onClick={() => handleAddMovie(movie, "watched")}
                            disabled={addingId === movie.tmdbId}
                            className="text-xs text-zinc-500 hover:text-purple-300 px-2.5 py-1 rounded-lg hover:bg-purple-500/10 transition-all flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            + Watched
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

          {!isLoading && !error && results.length === 0 && query === "" && (
            <div className="text-center py-16 text-zinc-500">
              <div className="relative inline-block mb-4">
                <Sparkles className="w-12 h-12 mx-auto text-purple-500/20 animate-float" />
                <div className="absolute inset-0 w-12 h-12 mx-auto rounded-full bg-purple-500/5 blur-xl" />
              </div>
              <p className="text-lg text-zinc-400">Search for a movie or TV show</p>
              <p className="text-sm mt-1 text-zinc-600">
                Results from The Movie Database (TMDB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
