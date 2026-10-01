/**
 * =============================================================================
 * Movie Search Modal
 * =============================================================================
 *
 * A slide-up modal that lets the user search TMDB for movies/shows
 * and add them to any shelf.
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
              progress: {
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-zinc-900 rounded-t-2xl sm:rounded-2xl border border-zinc-700/50 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search movies & TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-lg"
            id="search-input"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Results ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-12 text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Searching TMDB...
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 py-4 px-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
              <CircleAlert className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {!isLoading &&
            results.map((movie) => {
              const isAlreadyAdded = entries.some(
                (e) => e.tmdb.tmdbId === movie.tmdbId
              );

              return (
                <div
                  key={movie.tmdbId}
                  className="flex gap-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/30 transition-all duration-200 group"
                >
                  {/* Poster thumbnail */}
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={`${movie.title} poster`}
                      className="w-16 h-24 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-24 rounded-lg bg-zinc-700 flex items-center justify-center shrink-0">
                      <Film className="w-6 h-6 text-zinc-500" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white truncate">
                        {movie.title}
                      </h3>
                      {movie.mediaType === "tv" ? (
                        <Tv className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      ) : (
                        <Film className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-400">
                      {movie.releaseYear}
                      {movie.genres.length > 0 &&
                        ` · ${movie.genres.slice(0, 3).join(", ")}`}
                    </p>
                    <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
                      {movie.overview}
                    </p>
                  </div>

                  {/* Add buttons */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {isAlreadyAdded ? (
                      <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1.5 rounded-lg">
                        Added ✓
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAddMovie(movie, defaultShelf)}
                          disabled={addingId === movie.tmdbId}
                          className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
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
                        {defaultShelf !== "watching" && (
                          <button
                            onClick={() => handleAddMovie(movie, "watching")}
                            disabled={addingId === movie.tmdbId}
                            className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-zinc-700 transition-colors"
                          >
                            + Watching
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
              <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-lg">Search for a movie or TV show</p>
              <p className="text-sm mt-1">
                Results from The Movie Database (TMDB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
