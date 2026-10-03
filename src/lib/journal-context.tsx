/**
 * =============================================================================
 * Journal Context — Global State Management (Hybrid: Local + Cloud)
 * =============================================================================
 *
 * This context supports two modes:
 *   1. GUEST MODE (no auth): Works exactly as before — localStorage only.
 *   2. AUTHENTICATED MODE: Fetches from and dispatches mutations to /api/*.
 *      localStorage is used as a fast cache, and the API is the source of truth.
 *
 * MIGRATION STRATEGY:
 * ──────────────────
 * When a guest user logs in, their localStorage entries are NOT automatically
 * synced to the cloud. They start fresh with an empty cloud journal. If you
 * want to add a "merge" feature later, you can POST each local entry to the API.
 */

"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { MovieEntry, Shelf, UserReview, WatchProgress } from "./types";
import { getEntries, saveEntries, resetToStarterData } from "./storage";
import { useAuth } from "./auth-context";
import { apiClient, ApiClientError } from "./api-client";

// ─── API Response Types ─────────────────────────────────────────────────────
// The API stores data in a flat, snake_case format. We need to map it to
// our camelCase MovieEntry type for the frontend.

interface ApiEntry {
  id: string;
  shelf: string;
  tmdb_id: number;
  title: string;
  poster_url: string | null;
  release_year: string | null;
  runtime: number;
  genres: string[];
  director: string;
  overview: string;
  media_type: string;
  current_episode: number | null;
  total_episodes: number | null;
  minutes_watched: number | null;
  total_minutes: number | null;
  created_at: string;
  updated_at: string;
}

/** Map an API entry (flat, snake_case) to our frontend MovieEntry (nested, camelCase) */
function apiEntryToMovieEntry(e: ApiEntry): MovieEntry {
  return {
    id: e.id,
    shelf: e.shelf as Shelf,
    tmdb: {
      tmdbId: e.tmdb_id,
      title: e.title,
      posterUrl: e.poster_url,
      releaseYear: e.release_year ?? "",
      runtime: e.runtime,
      genres: e.genres,
      director: e.director,
      overview: e.overview,
      mediaType: e.media_type as "movie" | "tv",
    },
    progress:
      e.current_episode != null || e.minutes_watched != null
        ? {
            currentEpisode: e.current_episode ?? undefined,
            totalEpisodes: e.total_episodes ?? undefined,
            minutesWatched: e.minutes_watched ?? undefined,
            totalMinutes: e.total_minutes ?? undefined,
          }
        : undefined,
    addedAt: e.created_at,
    updatedAt: e.updated_at,
  };
}

/** Map a frontend MovieEntry to the API create payload */
function movieEntryToApiPayload(entry: MovieEntry) {
  return {
    shelf: entry.shelf,
    tmdb_id: entry.tmdb.tmdbId,
    title: entry.tmdb.title,
    poster_url: entry.tmdb.posterUrl,
    release_year: entry.tmdb.releaseYear || null,
    runtime: entry.tmdb.runtime,
    genres: entry.tmdb.genres,
    director: entry.tmdb.director,
    overview: entry.tmdb.overview,
    media_type: entry.tmdb.mediaType,
    current_episode: entry.progress?.currentEpisode ?? null,
    total_episodes: entry.progress?.totalEpisodes ?? null,
    minutes_watched: entry.progress?.minutesWatched ?? null,
    total_minutes: entry.progress?.totalMinutes ?? null,
  };
}

// ─── Action Types ───────────────────────────────────────────────────────────

type JournalAction =
  | { type: "ENTRIES_LOADED"; payload: MovieEntry[] }
  | { type: "ENTRY_ADDED"; payload: MovieEntry }
  | { type: "ENTRY_REMOVED"; payload: string }
  | { type: "ENTRY_MOVED"; payload: { id: string; shelf: Shelf; review?: UserReview } }
  | { type: "PROGRESS_UPDATED"; payload: { id: string; progress: WatchProgress } }
  | { type: "REVIEW_UPDATED"; payload: { id: string; review: UserReview } };

// ─── State Shape ────────────────────────────────────────────────────────────

interface JournalState {
  entries: MovieEntry[];
  isLoaded: boolean;
}

function getInitialJournalState(): JournalState {
  if (typeof window !== "undefined") {
    try {
      const stored = getEntries();
      if (stored && stored.length > 0) {
        return { entries: stored, isLoaded: true };
      }
    } catch {
      // ignore SSR or storage errors
    }
  }
  return { entries: [], isLoaded: false };
}

// ─── Reducer ────────────────────────────────────────────────────────────────

function journalReducer(state: JournalState, action: JournalAction): JournalState {
  switch (action.type) {
    case "ENTRIES_LOADED":
      return { entries: action.payload, isLoaded: true };

    case "ENTRY_ADDED":
      return { ...state, entries: [...state.entries, action.payload] };

    case "ENTRY_REMOVED":
      return {
        ...state,
        entries: state.entries.filter((e) => e.id !== action.payload),
      };

    case "ENTRY_MOVED":
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.id
            ? {
                ...e,
                shelf: action.payload.shelf,
                review: action.payload.review ?? e.review,
                updatedAt: new Date().toISOString(),
              }
            : e
        ),
      };

    case "PROGRESS_UPDATED":
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.id
            ? {
                ...e,
                progress: action.payload.progress,
                updatedAt: new Date().toISOString(),
              }
            : e
        ),
      };

    case "REVIEW_UPDATED":
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.id
            ? {
                ...e,
                review: action.payload.review,
                updatedAt: new Date().toISOString(),
              }
            : e
        ),
      };

    default:
      return state;
  }
}

// ─── Context Definition ─────────────────────────────────────────────────────

interface JournalContextValue {
  entries: MovieEntry[];
  isLoaded: boolean;
  addEntry: (entry: MovieEntry) => void;
  removeEntry: (id: string) => void;
  moveToShelf: (id: string, shelf: Shelf, review?: UserReview) => void;
  updateProgress: (id: string, progress: WatchProgress) => void;
  updateReview: (id: string, review: UserReview) => void;
  resetToDemoData: () => void;
}

const JournalContext = createContext<JournalContextValue | null>(null);

// ─── Provider Component ─────────────────────────────────────────────────────

export function JournalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(journalReducer, undefined, getInitialJournalState);
  const { user, session, isLoading: authLoading } = useAuth();

  const isAuthenticated = !!user && !!session;

  /**
   * Load entries: from API if authenticated, from localStorage if guest.
   */
  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize

    if (isAuthenticated) {
      // Fetch from API
      apiClient
        .get<ApiEntry[]>("/api/entries")
        .then((data) => {
          const serverEntries = data.map(apiEntryToMovieEntry);
          const localEntries = getEntries();

          if (serverEntries.length === 0) {
            dispatch({ type: "ENTRIES_LOADED", payload: localEntries });
            return;
          }

          // Deep merge server entries with local entries so we never lose
          // granular watchedEpisodes, seasons, episodeHistory, or rich TMDB data
          const localById = new Map(localEntries.map((e) => [e.id, e]));
          const localByTmdb = new Map(localEntries.map((e) => [e.tmdb?.tmdbId, e]));

          const resolved = serverEntries.map((serverEntry) => {
            const local = localById.get(serverEntry.id) || localByTmdb.get(serverEntry.tmdb?.tmdbId);
            if (!local) return serverEntry;
            return {
              ...serverEntry,
              tmdb: {
                ...serverEntry.tmdb,
                seasons: local.tmdb?.seasons ?? serverEntry.tmdb?.seasons,
                backdropUrl: local.tmdb?.backdropUrl ?? serverEntry.tmdb?.backdropUrl,
                director: local.tmdb?.director || serverEntry.tmdb?.director,
                overview: serverEntry.tmdb?.overview || local.tmdb?.overview,
                totalEpisodes: local.tmdb?.totalEpisodes ?? serverEntry.tmdb?.totalEpisodes,
              },
              progress: {
                ...local.progress,
                ...serverEntry.progress,
                watchedEpisodes: local.progress?.watchedEpisodes ?? serverEntry.progress?.watchedEpisodes ?? [],
                currentSeason: local.progress?.currentSeason ?? serverEntry.progress?.currentSeason,
                episodeHistory: local.progress?.episodeHistory ?? serverEntry.progress?.episodeHistory,
              },
              review: serverEntry.review || local.review,
            };
          });

          // Also include any local-only entries that haven't synced yet
          const serverTmdbIds = new Set(serverEntries.map((e) => e.tmdb.tmdbId));
          const localOnly = localEntries.filter((l) => !serverTmdbIds.has(l.tmdb.tmdbId) && !localById.has(l.id));
          const combined = [...resolved, ...localOnly];

          dispatch({ type: "ENTRIES_LOADED", payload: combined });
        })
        .catch((err) => {
          console.warn("Entries API unavailable, falling back to local storage:", err);
          // Fallback to local storage so user data is never lost
          const stored = getEntries();
          dispatch({ type: "ENTRIES_LOADED", payload: stored });
        });
    } else {
      // Guest mode — load from localStorage
      const stored = getEntries();
      dispatch({ type: "ENTRIES_LOADED", payload: stored });
    }
  }, [isAuthenticated, authLoading]);

  /**
   * Always sync to localStorage as a reliable offline cache and safety net.
   */
  useEffect(() => {
    if (state.isLoaded) {
      saveEntries(state.entries);
    }
  }, [state.entries, state.isLoaded]);

  // ─── Actions ────────────────────────────────────────────────────────────

  const addEntry = useCallback(
    (entry: MovieEntry) => {
      // Optimistic update — immediate UI response
      dispatch({ type: "ENTRY_ADDED", payload: entry });

      if (isAuthenticated) {
        apiClient
          .post<ApiEntry>("/api/entries", movieEntryToApiPayload(entry))
          .then((created) => {
            // Replace the optimistic entry with the server-generated one,
            // but preserve rich TMDB metadata (seasons, backdrop) and watched episodes!
            const converted = apiEntryToMovieEntry(created);
            const preserved: MovieEntry = {
              ...entry,
              id: created.id,
              tmdb: {
                ...entry.tmdb,
                ...converted.tmdb,
                seasons: entry.tmdb.seasons,
                backdropUrl: entry.tmdb.backdropUrl,
              },
              progress: {
                ...entry.progress,
                ...converted.progress,
                watchedEpisodes: entry.progress?.watchedEpisodes ?? [],
                currentSeason: entry.progress?.currentSeason ?? 1,
              },
            };
            dispatch({ type: "ENTRY_REMOVED", payload: entry.id });
            dispatch({
              type: "ENTRY_ADDED",
              payload: preserved,
            });
          })
          .catch((err) => {
            console.warn("Failed to sync entry to cloud database:", err);
            // Retain the optimistic entry in local state so the movie is never lost
          });
      }
    },
    [isAuthenticated]
  );

  const removeEntry = useCallback(
    (id: string) => {
      dispatch({ type: "ENTRY_REMOVED", payload: id });

      if (isAuthenticated) {
        apiClient.delete(`/api/entries/${id}`).catch((err) => {
          console.error("Failed to delete entry:", err);
        });
      }
    },
    [isAuthenticated]
  );

  const moveToShelf = useCallback(
    (id: string, shelf: Shelf, review?: UserReview) => {
      dispatch({ type: "ENTRY_MOVED", payload: { id, shelf, review } });

      if (isAuthenticated) {
        apiClient
          .patch(`/api/entries/${id}/shelf`, {
            shelf,
            review: review
              ? {
                  rating: review.rating,
                  notes: review.notes,
                  tags: review.tags,
                  date_completed: review.dateCompleted || null,
                }
              : undefined,
          })
          .catch((err) => {
            console.error("Failed to move entry:", err);
          });
      }
    },
    [isAuthenticated]
  );

  const updateProgress = useCallback(
    (id: string, progress: WatchProgress) => {
      dispatch({ type: "PROGRESS_UPDATED", payload: { id, progress } });

      if (isAuthenticated) {
        apiClient
          .patch(`/api/entries/${id}`, {
            current_episode: progress.currentEpisode ?? null,
            total_episodes: progress.totalEpisodes ?? null,
            minutes_watched: progress.minutesWatched ?? null,
            total_minutes: progress.totalMinutes ?? null,
          })
          .catch((err) => {
            console.error("Failed to update progress:", err);
          });
      }
    },
    [isAuthenticated]
  );

  const updateReview = useCallback(
    (id: string, review: UserReview) => {
      dispatch({ type: "REVIEW_UPDATED", payload: { id, review } });

      if (isAuthenticated) {
        apiClient
          .post(`/api/entries/${id}/review`, {
            rating: review.rating,
            notes: review.notes,
            tags: review.tags,
            date_completed: review.dateCompleted || null,
          })
          .catch((err) => {
            console.error("Failed to update review:", err);
          });
      }
    },
    [isAuthenticated]
  );

  const resetToDemoData = useCallback(() => {
    const starter = resetToStarterData();
    dispatch({ type: "ENTRIES_LOADED", payload: starter });
  }, []);

  return (
    <JournalContext.Provider
      value={{
        entries: state.entries,
        isLoaded: state.isLoaded,
        addEntry,
        removeEntry,
        moveToShelf,
        updateProgress,
        updateReview,
        resetToDemoData,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

// ─── Custom Hook ────────────────────────────────────────────────────────────

export function useJournal(): JournalContextValue {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error(
      "useJournal() must be used within a <JournalProvider>. " +
        "Wrap your component tree in <JournalProvider> in layout.tsx."
    );
  }
  return context;
}
