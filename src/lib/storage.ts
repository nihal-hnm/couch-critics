/**
 * =============================================================================
 * localStorage Persistence Layer (User-Scoped & Isolated)
 * =============================================================================
 *
 * Provides safe, scoped local caching:
 *   - Authenticated users: stored under `couch-critics-entries-${userId}`
 *   - Unauthenticated guests: stored under `couch-critics-guest-entries`
 *   - Legacy un-scoped storage (`couch-critics-entries`) is pruned to prevent
 *     private account data from leaking into guest/mobile sessions.
 */

import type { MovieEntry } from "./types";

const GUEST_STORAGE_KEY = "couch-critics-guest-entries";
const LEGACY_STORAGE_KEY = "couch-critics-entries";

export function getStorageKey(userId?: string | null): string {
  if (userId) {
    return `couch-critics-entries-${userId}`;
  }
  return GUEST_STORAGE_KEY;
}

/**
 * Load movie entries from localStorage for a specific user (or guest).
 * Defaults to an empty journal without sample data.
 */
export function getEntries(userId?: string | null): MovieEntry[] {
  if (typeof window === "undefined") return [];

  try {
    // If an un-scoped legacy key exists from earlier versions, clean it up
    // so it doesn't leak private user data to unauthenticated visitors
    if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
      try {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch {
        // ignore
      }
    }

    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed as MovieEntry[];
  } catch (error) {
    console.error("Couch Critics: Failed to load data from localStorage:", error);
    return [];
  }
}

/** Clear all entries from storage for a specific user (or guest) */
export function clearAllEntries(userId?: string | null): MovieEntry[] {
  if (typeof window === "undefined") return [];
  const key = getStorageKey(userId);
  localStorage.removeItem(key);
  return [];
}

/** Backward compatibility helper for clearing data */
export function resetToStarterData(userId?: string | null): MovieEntry[] {
  return clearAllEntries(userId);
}

/**
 * Save all entries to localStorage for a specific user (or guest).
 */
export function saveEntries(entries: MovieEntry[], userId?: string | null): void {
  if (typeof window === "undefined") return;

  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(entries));
  } catch (error) {
    console.error("Cinema Journal: Failed to save data:", error);
  }
}

// ─── Convenience Helpers ────────────────────────────────────────────────────

/** Add a new entry to the journal */
export function addEntry(entry: MovieEntry, userId?: string | null): MovieEntry[] {
  const entries = getEntries(userId);
  entries.push(entry);
  saveEntries(entries, userId);
  return entries;
}

/** Update an existing entry by ID */
export function updateEntry(
  id: string,
  updates: Partial<MovieEntry>,
  userId?: string | null
): MovieEntry[] {
  const entries = getEntries(userId);
  const index = entries.findIndex((e) => e.id === id);

  if (index !== -1) {
    entries[index] = {
      ...entries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveEntries(entries, userId);
  }

  return entries;
}

/** Remove an entry by ID */
export function removeEntry(id: string, userId?: string | null): MovieEntry[] {
  const entries = getEntries(userId).filter((e) => e.id !== id);
  saveEntries(entries, userId);
  return entries;
}

/** Move an entry to a different shelf */
export function moveToShelf(
  id: string,
  newShelf: MovieEntry["shelf"],
  additionalData?: Partial<MovieEntry>,
  userId?: string | null
): MovieEntry[] {
  return updateEntry(id, { shelf: newShelf, ...additionalData }, userId);
}
