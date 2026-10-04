/**
 * =============================================================================
 * Journal Context — Global State Management (Hybrid: Local + Cloud)
 * =============================================================================
 *
 * This context supports two isolated modes:
 *   1. GUEST MODE (no auth): Uses `couch-critics-guest-entries`.
 *   2. AUTHENTICATED MODE: Fetches from and dispatches mutations to /api/*.
 *      Each user's cache is strictly scoped to `couch-critics-entries-${user.id}`.
 *      The API is the source of truth; reviews and ratings are synced seamlessly.
 *
 * DATA PRIVACY & MULTI-DEVICE SYNC:
 * ─────────────────────────────────
 * Private cloud data is never leaked to guest mode. When signing out or opening
 * unauthenticated on any mobile device (Android/iOS), user data is never shown.
 */

"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { MovieEntry, Shelf, UserReview, WatchProgress } from "./types";
import { getEntries, saveEntries, resetToStarterData } from "./storage";
import { useAuth } from "./auth-context";
import { apiClient } from "./api-client";

// ─── API Response Types ─────────────────────────────────────────────────────

interface ApiReview {
  id: string;
  rating: number;
  notes: string | null;
  tags: string[] | null;
  date_completed: string | null;
  created_at: string;
  updated_at: string;
}

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
  review?: ApiReview | ApiReview[] | null;
}

/** Map an API entry (flat, snake_case with joined review) to our frontend MovieEntry */
function apiEntryToMovieEntry(e: ApiEntry): MovieEntry {
  const rawReview = Array.isArray(e.review) ? e.review[0] : e.review;
  const userReview: UserReview | undefined = rawReview
    ? {
        rating: rawReview.rating,
        notes: rawReview.notes || "",
        tags: Array.isArray(rawReview.tags) ? rawReview.tags : [],
        dateCompleted: rawReview.date_completed || e.updated_at || e.created_at,
      }
    : undefined;

  return {
    id: e.id,
    shelf: e.shelf as Shelf,
    tmdb: {
      tmdbId: e.tmdb_id,
      title: e.title,
      posterUrl: e.poster_url,
      releaseYear: e.release_year ?? "",
      runtime: e.runtime,
      genres: Array.isArray(e.genres) ? e.genres : [],
      director: e.director || "",
      overview: e.overview || "",
      mediaType: (e.media_type as "movie" | "tv") || "movie",
    },
    progress:
      e.current_episode != null || e.minutes_watched != null || e.total_episodes != null
        ? {
            currentEpisode: e.current_episode ?? undefined,
            totalEpisodes: e.total_episodes ?? undefined,
            minutesWatched: e.minutes_watched ?? undefined,
            totalMinutes: e.total_minutes ?? undefined,
          }
        : undefined,
    review: userReview,
    addedAt: e.created_at,
    updatedAt: e.updated_at,
  };
}

/** Map a frontend MovieEntry to the API create payload */
function movieEntryToApiPayload(entry: MovieEntry) {
  const cleanPoster =
    entry.tmdb.posterUrl && entry.tmdb.posterUrl.trim() !== ""
      ? entry.tmdb.posterUrl
      : null;

  return {
    shelf: entry.shelf,
    tmdb_id: entry.tmdb.tmdbId,
    title: entry.tmdb.title,
    poster_url: cleanPoster,
    release_year: entry.tmdb.releaseYear || null,
    runtime: entry.tmdb.runtime || 0,
    genres: entry.tmdb.genres || [],
    director: entry.tmdb.director || "",
    overview: entry.tmdb.overview || "",
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
        entries: state.entries.map((e) => {
          if (e.id !== action.payload.id) return e;
          const isMovingToWatched = action.payload.shelf === "watched";
          let updatedProgress = e.progress;

          if (isMovingToWatched) {
            if (e.tmdb.mediaType === "tv") {
              const totalEps = e.progress?.totalEpisodes ?? e.tmdb.totalEpisodes ?? 10;
              const epRuntime = e.tmdb.runtime || 45;
              updatedProgress = {
                ...e.progress,
                currentEpisode: totalEps,
                totalEpisodes: totalEps,
                minutesWatched: totalEps * epRuntime,
                totalMinutes: totalEps * epRuntime,
              };
            } else {
              updatedProgress = {
                ...e.progress,
                minutesWatched: e.tmdb.runtime,
                totalMinutes: e.tmdb.runtime,
              };
            }
          }

          return {
            ...e,
            shelf: action.payload.shelf,
            review: action.payload.review ?? e.review,
            progress: updatedProgress,
            updatedAt: new Date().toISOString(),
          };
        }),
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
  const [state, dispatch] = useReducer(journalReducer, { entries: [], isLoaded: false });
  const { user, session, isLoading: authLoading } = useAuth();
  const previousUserIdRef = useRef<string | null | undefined>(undefined);

  const isAuthenticated = !!user && !!session;

  /**
   * Safe, user-isolated entry loader:
   *  - If authenticated: uses user-scoped cache & fetches from Supabase.
   *  - If guest: uses guest storage, never showing prior account data.
   */
  useEffect(() => {
    if (authLoading) return; // Wait for auth initialization

    const currentUserId = user?.id ?? null;
    previousUserIdRef.current = currentUserId;

    if (isAuthenticated && user?.id) {
      // 1. Immediately load user-scoped local cache for instant UI rendering
      const userCache = getEntries(user.id);
      dispatch({ type: "ENTRIES_LOADED", payload: userCache });

      // 2. Query cloud database (source of truth)
      apiClient
        .get<ApiEntry[]>("/api/entries")
        .then((data) => {
          const serverEntries = data.map(apiEntryToMovieEntry);

          // Deep merge server entries with local cache to retain rich TMDB client fields
          // like seasons, backdropUrl, and granular watchedEpisodes
          const localById = new Map(userCache.map((e) => [e.id, e]));
          const localByTmdb = new Map(userCache.map((e) => [e.tmdb?.tmdbId, e]));

          const resolved = serverEntries.map((serverEntry) => {
            const local =
              localById.get(serverEntry.id) || localByTmdb.get(serverEntry.tmdb?.tmdbId);
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
                watchedEpisodes:
                  local.progress?.watchedEpisodes ?? serverEntry.progress?.watchedEpisodes ?? [],
                currentSeason: local.progress?.currentSeason ?? serverEntry.progress?.currentSeason,
                episodeHistory:
                  local.progress?.episodeHistory ?? serverEntry.progress?.episodeHistory,
              },
              review: serverEntry.review || local.review,
            };
          });

          dispatch({ type: "ENTRIES_LOADED", payload: resolved });
          saveEntries(resolved, user.id);
        })
        .catch((err) => {
          console.warn("Entries API unavailable, using user local cache:", err);
          dispatch({ type: "ENTRIES_LOADED", payload: userCache });
        });
    } else {
      // Guest mode — load strictly from guest storage key
      const guestStored = getEntries(null);
      dispatch({ type: "ENTRIES_LOADED", payload: guestStored });
    }
  }, [isAuthenticated, authLoading, user?.id]);

  /**
   * Persist changes to the appropriate user-scoped cache.
   */
  useEffect(() => {
    if (state.isLoaded) {
      saveEntries(state.entries, user?.id ?? null);
    }
  }, [state.entries, state.isLoaded, user?.id]);

  // ─── Actions ────────────────────────────────────────────────────────────

  const addEntry = useCallback(
    (entry: MovieEntry) => {
      // Optimistic update — immediate UI response
      dispatch({ type: "ENTRY_ADDED", payload: entry });

      if (isAuthenticated) {
        apiClient
          .post<ApiEntry>("/api/entries", movieEntryToApiPayload(entry))
          .then(async (created) => {
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

            // If it was added directly to "watched" with a review, persist the review too
            if (entry.shelf === "watched" && entry.review) {
              try {
                await apiClient.post(`/api/entries/${created.id}/review`, {
                  rating: Math.max(1, Math.min(10, entry.review.rating || 5)),
                  notes: entry.review.notes || "",
                  tags: entry.review.tags || [],
                  date_completed: entry.review.dateCompleted || null,
                });
                preserved.review = entry.review;
              } catch (rErr) {
                console.warn("Failed to attach initial review to cloud:", rErr);
              }
            }

            dispatch({ type: "ENTRY_REMOVED", payload: entry.id });
            dispatch({
              type: "ENTRY_ADDED",
              payload: preserved,
            });
          })
          .catch((err) => {
            console.warn("Failed to sync entry to cloud database:", err);
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
                  rating: Math.max(1, Math.min(10, review.rating || 5)),
                  notes: review.notes || "",
                  tags: review.tags || [],
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
            rating: Math.max(1, Math.min(10, review.rating || 5)),
            notes: review.notes || "",
            tags: review.tags || [],
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
    const starter = resetToStarterData(user?.id ?? null);
    dispatch({ type: "ENTRIES_LOADED", payload: starter });
  }, [user?.id]);

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
