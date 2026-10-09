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
import type { MovieEntry, Shelf, UserReview, WatchProgress, TMDBSeasonData } from "./types";
import { getEntries, saveEntries, resetToStarterData } from "./storage";
import { useAuth } from "./auth-context";
import { apiClient } from "./api-client";
import { getCachedTVSeasons } from "./tv-seasons-cache";
import { getMovieDetails } from "./tmdb";

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

/** Distribute watched episodes count across real seasons */
function buildInitialWatchedEpisodes(currentEp: number, seasons?: TMDBSeasonData[]): string[] {
  const codes: string[] = [];
  if (!currentEp || currentEp <= 0) return codes;

  if (seasons && seasons.length > 0) {
    let remaining = currentEp;
    for (const season of seasons) {
      if (season.seasonNumber <= 0) continue;
      const count = season.episodeCount || 10;
      const watchedInThisSeason = Math.min(remaining, count);
      for (let i = 1; i <= watchedInThisSeason; i++) {
        codes.push(`S${season.seasonNumber}E${i}`);
      }
      remaining -= watchedInThisSeason;
      if (remaining <= 0) break;
    }
  } else {
    for (let i = 1; i <= currentEp; i++) {
      codes.push(`S1E${i}`);
    }
  }
  return codes;
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

  const isTv = e.media_type === "tv";
  const cachedTv = isTv ? getCachedTVSeasons(e.tmdb_id) : undefined;
  const totalEps = e.total_episodes ?? cachedTv?.totalEpisodes ?? (isTv ? 10 : undefined);
  const currentEp =
    e.current_episode ?? (e.shelf === "watched" && isTv ? totalEps : undefined);
  const totalMins =
    e.total_minutes ?? (isTv ? (totalEps ? totalEps * (e.runtime || cachedTv?.runtime || 45) : undefined) : e.runtime || 0);
  const minsWatched =
    e.minutes_watched ?? (e.shelf === "watched" ? totalMins : undefined);

  // Synthesize watched episode codes accurately distributed across real seasons
  let syntheticWatchedEpisodes: string[] | undefined = undefined;
  if (isTv && currentEp && currentEp > 0) {
    syntheticWatchedEpisodes = buildInitialWatchedEpisodes(currentEp, cachedTv?.seasons);
  }

  return {
    id: e.id,
    shelf: e.shelf as Shelf,
    tmdb: {
      tmdbId: e.tmdb_id,
      title: e.title,
      posterUrl: e.poster_url || cachedTv?.seasons?.find((s) => s.posterUrl)?.posterUrl || null,
      backdropUrl: cachedTv?.backdropUrl ?? null,
      releaseYear: e.release_year ?? "",
      runtime: e.runtime || cachedTv?.runtime || 0,
      genres: Array.isArray(e.genres) ? e.genres : [],
      director: e.director || "",
      overview: e.overview || "",
      mediaType: (e.media_type as "movie" | "tv") || "movie",
      totalEpisodes: totalEps,
      totalSeasons: cachedTv?.totalSeasons,
      seasons: cachedTv?.seasons,
    },
    progress:
      currentEp != null || minsWatched != null || totalEps != null
        ? {
            currentEpisode: currentEp ?? undefined,
            totalEpisodes: totalEps ?? undefined,
            minutesWatched: minsWatched ?? undefined,
            totalMinutes: totalMins ?? undefined,
            watchedEpisodes: syntheticWatchedEpisodes,
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

  const isTv = entry.tmdb.mediaType === "tv";
  const totalEps =
    entry.progress?.totalEpisodes ??
    entry.tmdb.totalEpisodes ??
    (isTv ? 10 : null);

  const totalMins =
    entry.progress?.totalMinutes ??
    (isTv && totalEps ? totalEps * (entry.tmdb.runtime || 45) : entry.tmdb.runtime || null);

  const currentEp =
    entry.shelf === "watched" && isTv
      ? totalEps
      : entry.progress?.currentEpisode ?? null;

  const minsWatched =
    entry.shelf === "watched"
      ? totalMins
      : entry.progress?.minutesWatched ?? null;

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
    current_episode: currentEp,
    total_episodes: totalEps,
    minutes_watched: minsWatched,
    total_minutes: totalMins,
  };
}

// ─── Action Types ───────────────────────────────────────────────────────────

type JournalAction =
  | { type: "ENTRIES_LOADED"; payload: MovieEntry[] }
  | { type: "ENTRY_ADDED"; payload: MovieEntry }
  | { type: "ENTRY_REMOVED"; payload: string }
  | { type: "ENTRY_MOVED"; payload: { id: string; shelf: Shelf; review?: UserReview } }
  | { type: "PROGRESS_UPDATED"; payload: { id: string; progress: WatchProgress } }
  | { type: "REVIEW_UPDATED"; payload: { id: string; review: UserReview } }
  | {
      type: "ENTRY_ENRICHED";
      payload: {
        id: string;
        seasons?: TMDBSeasonData[];
        totalSeasons?: number;
        backdropUrl?: string | null;
        posterUrl?: string | null;
        totalEpisodes?: number;
      };
    };

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

    case "ENTRY_ENRICHED":
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.id
            ? {
                ...e,
                tmdb: {
                  ...e.tmdb,
                  seasons: action.payload.seasons ?? e.tmdb.seasons,
                  totalSeasons: action.payload.totalSeasons ?? e.tmdb.totalSeasons,
                  backdropUrl: action.payload.backdropUrl ?? e.tmdb.backdropUrl,
                  posterUrl: action.payload.posterUrl ?? e.tmdb.posterUrl,
                  totalEpisodes: action.payload.totalEpisodes ?? e.tmdb.totalEpisodes,
                },
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
  enrichEntrySeasons: (
    id: string,
    seasons?: TMDBSeasonData[],
    totalSeasons?: number,
    backdropUrl?: string | null,
    totalEpisodes?: number,
    posterUrl?: string | null
  ) => void;
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
            const cachedTv = serverEntry.tmdb.mediaType === "tv" ? getCachedTVSeasons(serverEntry.tmdb.tmdbId) : undefined;
            if (!local) return serverEntry;
            return {
              ...serverEntry,
              tmdb: {
                ...serverEntry.tmdb,
                seasons: local.tmdb?.seasons ?? cachedTv?.seasons ?? serverEntry.tmdb?.seasons,
                totalSeasons: local.tmdb?.totalSeasons ?? cachedTv?.totalSeasons ?? serverEntry.tmdb?.totalSeasons,
                backdropUrl: local.tmdb?.backdropUrl ?? cachedTv?.backdropUrl ?? serverEntry.tmdb?.backdropUrl,
                director: local.tmdb?.director || serverEntry.tmdb?.director,
                overview: serverEntry.tmdb?.overview || local.tmdb?.overview,
                totalEpisodes: local.tmdb?.totalEpisodes ?? cachedTv?.totalEpisodes ?? serverEntry.tmdb?.totalEpisodes,
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

  /**
   * Background media & poster enrichment:
   * Restores posters for any entries missing posterUrl and enriches TV shows with full seasons.
   */
  useEffect(() => {
    if (!state.isLoaded || state.entries.length === 0) return;

    const unEnriched = state.entries.filter(
      (e) =>
        Boolean(e.tmdb.tmdbId) &&
        (!e.tmdb.posterUrl ||
          (e.tmdb.mediaType === "tv" && (!e.tmdb.seasons || e.tmdb.seasons.length <= 1)))
    );

    if (unEnriched.length === 0) return;

    let cancelled = false;
    unEnriched.forEach((entry) => {
      getMovieDetails(entry.tmdb.tmdbId, entry.tmdb.mediaType)
        .then((details) => {
          if (cancelled) return;
          dispatch({
            type: "ENTRY_ENRICHED",
            payload: {
              id: entry.id,
              seasons: details.seasons,
              totalSeasons: details.totalSeasons || details.seasons?.length,
              backdropUrl: details.backdropUrl || entry.tmdb.backdropUrl,
              posterUrl: details.posterUrl || entry.tmdb.posterUrl,
              totalEpisodes: details.totalEpisodes || entry.tmdb.totalEpisodes,
            },
          });
        })
        .catch(() => {});
    });

    return () => {
      cancelled = true;
    };
  }, [state.isLoaded, state.entries.length]);

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
                seasons: entry.tmdb.seasons ?? converted.tmdb.seasons,
                totalSeasons: entry.tmdb.totalSeasons ?? converted.tmdb.totalSeasons,
                backdropUrl: entry.tmdb.backdropUrl ?? converted.tmdb.backdropUrl,
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

  const enrichEntrySeasons = useCallback(
    (
      id: string,
      seasons?: TMDBSeasonData[],
      totalSeasons?: number,
      backdropUrl?: string | null,
      totalEpisodes?: number,
      posterUrl?: string | null
    ) => {
      dispatch({
        type: "ENTRY_ENRICHED",
        payload: { id, seasons, totalSeasons, backdropUrl, totalEpisodes, posterUrl },
      });
    },
    []
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
        enrichEntrySeasons,
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
