/**
 * =============================================================================
 * localStorage Persistence Layer
 * =============================================================================
 *
 * WHY A SEPARATE STORAGE MODULE?
 * ──────────────────────────────
 * By abstracting localStorage behind these functions, we create a "Repository"
 * pattern. When you migrate to Supabase later, you only change THIS file —
 * every component that calls `getEntries()` or `saveEntries()` stays the same.
 *
 * Think of this as a "plug" that connects to localStorage now but can be
 * rewired to PostgreSQL without touching any UI code. This is the
 * Dependency Inversion Principle (the "D" in SOLID).
 *
 * IMPORTANT: localStorage is synchronous and has a ~5MB limit.
 * For ~500 movie entries with poster URLs (not images), that's plenty.
 * The real limit you'd hit is around ~2,500 entries.
 */

import type { MovieEntry } from "./types";

const STORAGE_KEY = "cinema-journal-entries";

/**
 * Load all movie entries from localStorage.
 * Returns an empty array if nothing is stored yet (first launch).
 *
 * NOTE: We wrap this in try/catch because:
 *  1. localStorage might be disabled (private browsing in some browsers)
 *  2. The stored data might be corrupted or from an old schema version
 */
export function getEntries(): MovieEntry[] {
  if (typeof window === "undefined") return []; // Server-side safety guard

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    // Basic validation: make sure it's an array
    if (!Array.isArray(parsed)) {
      console.warn("Cinema Journal: Stored data is not an array. Resetting.");
      return [];
    }

    return parsed as MovieEntry[];
  } catch (error) {
    console.error("Cinema Journal: Failed to load data from localStorage:", error);
    return [];
  }
}

/**
 * Save all entries to localStorage.
 * We save the entire array each time — simple and correct.
 *
 * WHY NOT PATCH INDIVIDUAL ITEMS?
 * ───────────────────────────────
 * localStorage doesn't support partial updates (it's a key-value store).
 * For our scale (~100s of entries), serializing the whole array is fast
 * enough (<1ms). Premature optimization here would add complexity for
 * zero user-perceived benefit.
 */
export function saveEntries(entries: MovieEntry[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Cinema Journal: Failed to save data:", error);
    // This usually means localStorage is full (quota exceeded)
    // In a production app, you'd show a toast notification to the user
  }
}

// ─── Convenience Helpers ────────────────────────────────────────────────────
// These wrap common operations so components don't need to manually
// load → modify → save every time.

/** Add a new entry to the journal */
export function addEntry(entry: MovieEntry): MovieEntry[] {
  const entries = getEntries();
  entries.push(entry);
  saveEntries(entries);
  return entries;
}

/** Update an existing entry by ID */
export function updateEntry(id: string, updates: Partial<MovieEntry>): MovieEntry[] {
  const entries = getEntries();
  const index = entries.findIndex((e) => e.id === id);

  if (index !== -1) {
    entries[index] = {
      ...entries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveEntries(entries);
  }

  return entries;
}

/** Remove an entry by ID */
export function removeEntry(id: string): MovieEntry[] {
  const entries = getEntries().filter((e) => e.id !== id);
  saveEntries(entries);
  return entries;
}

/**
 * Move an entry to a different shelf.
 * This is the most common operation — e.g., moving from "watching" to "watched."
 */
export function moveToShelf(
  id: string,
  newShelf: MovieEntry["shelf"],
  additionalData?: Partial<MovieEntry>
): MovieEntry[] {
  return updateEntry(id, { shelf: newShelf, ...additionalData });
}
