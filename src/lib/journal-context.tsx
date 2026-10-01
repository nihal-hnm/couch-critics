/**
 * =============================================================================
 * Journal Context — Global State Management
 * =============================================================================
 *
 * WHY REACT CONTEXT INSTEAD OF REDUX / ZUSTAND?
 * ──────────────────────────────────────────────
 * For an app of this size (~3 shelves, ~1 data type), Context + useReducer
 * is the right tool. Redux/Zustand add boilerplate without benefit here.
 *
 * RULE OF THUMB:
 *   - <5 actions, <3 data types → Context + useReducer
 *   - 5-15 actions, complex async → Zustand
 *   - Large team, huge app → Redux Toolkit
 *
 * The reducer pattern gives us:
 *   1. Predictable state transitions (action → new state, always)
 *   2. Easy debugging (log every action to see what happened)
 *   3. A clean migration path to server-side state management
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
import { getEntries, saveEntries } from "./storage";

// ─── Action Types ───────────────────────────────────────────────────────────
// Each action represents something the user CAN DO. Naming them as past-tense
// events ("ENTRY_ADDED") is a common convention — it reads like a log.

type JournalAction =
  | { type: "ENTRIES_LOADED"; payload: MovieEntry[] }
  | { type: "ENTRY_ADDED"; payload: MovieEntry }
  | { type: "ENTRY_REMOVED"; payload: string } // id
  | { type: "ENTRY_MOVED"; payload: { id: string; shelf: Shelf; review?: UserReview } }
  | { type: "PROGRESS_UPDATED"; payload: { id: string; progress: WatchProgress } }
  | { type: "REVIEW_UPDATED"; payload: { id: string; review: UserReview } };

// ─── State Shape ────────────────────────────────────────────────────────────

interface JournalState {
  entries: MovieEntry[];
  isLoaded: boolean; // Have we read from localStorage yet?
}

const initialState: JournalState = {
  entries: [],
  isLoaded: false,
};

// ─── Reducer ────────────────────────────────────────────────────────────────
// A reducer is a pure function: (currentState, action) → newState
// NEVER mutate `state` directly — always return a new object.

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
}

const JournalContext = createContext<JournalContextValue | null>(null);

// ─── Provider Component ─────────────────────────────────────────────────────

export function JournalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(journalReducer, initialState);

  /**
   * Load entries from localStorage on first mount.
   *
   * WHY useEffect AND NOT INITIAL STATE?
   * ────────────────────────────────────
   * localStorage is a browser-only API. During server-side rendering (SSR),
   * `window` doesn't exist. If we tried to read localStorage in `initialState`,
   * Next.js would crash during SSR. useEffect only runs in the browser.
   */
  useEffect(() => {
    const stored = getEntries();
    dispatch({ type: "ENTRIES_LOADED", payload: stored });
  }, []);

  /**
   * Auto-save to localStorage whenever entries change.
   *
   * WHY NOT SAVE INSIDE EACH ACTION?
   * ────────────────────────────────
   * Saving here (in an effect) is cleaner because:
   *  1. The reducer stays pure (no side effects).
   *  2. We save once even if multiple dispatches happen in the same render.
   *  3. When you migrate to Supabase, this effect becomes an API call.
   */
  useEffect(() => {
    if (state.isLoaded) {
      saveEntries(state.entries);
    }
  }, [state.entries, state.isLoaded]);

  // Wrap dispatch calls in useCallback to prevent unnecessary re-renders
  const addEntry = useCallback(
    (entry: MovieEntry) => dispatch({ type: "ENTRY_ADDED", payload: entry }),
    []
  );

  const removeEntry = useCallback(
    (id: string) => dispatch({ type: "ENTRY_REMOVED", payload: id }),
    []
  );

  const moveToShelf = useCallback(
    (id: string, shelf: Shelf, review?: UserReview) =>
      dispatch({ type: "ENTRY_MOVED", payload: { id, shelf, review } }),
    []
  );

  const updateProgress = useCallback(
    (id: string, progress: WatchProgress) =>
      dispatch({ type: "PROGRESS_UPDATED", payload: { id, progress } }),
    []
  );

  const updateReview = useCallback(
    (id: string, review: UserReview) =>
      dispatch({ type: "REVIEW_UPDATED", payload: { id, review } }),
    []
  );

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
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

// ─── Custom Hook ────────────────────────────────────────────────────────────

/**
 * WHY A CUSTOM HOOK?
 * ──────────────────
 * Without this, every component would need:
 *   const ctx = useContext(JournalContext);
 *   if (!ctx) throw new Error("...");
 *
 * This hook encapsulates that boilerplate AND provides a helpful error
 * message if someone forgets to wrap their component tree in <JournalProvider>.
 */
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
