/**
 * =============================================================================
 * Main Dashboard Page — The "Root" UI Component
 * =============================================================================
 *
 * This is the primary page of Cinema Journal. It orchestrates:
 *   1. Tab-based navigation between the three shelves + stats
 *   2. The search modal trigger
 *   3. Data flow from JournalContext → shelf components
 *
 * WHY "use client"?
 * ─────────────────
 * Next.js App Router defaults to Server Components (rendered on the server).
 * But we need browser-only features:
 *   - useState for tab switching and modal state
 *   - useContext for the journal data (which reads localStorage)
 *   - Event handlers (onClick)
 *
 * So we mark this as a Client Component. The layout.tsx (server component)
 * wraps this in <JournalProvider>, which is also a client component.
 *
 * RULE OF THUMB:
 *   Server Components → data fetching, SEO, static content
 *   Client Components → interactivity, state, browser APIs
 */

"use client";

import { useState, useMemo } from "react";
import {
  Play,
  BookmarkPlus,
  CheckCircle2,
  BarChart3,
  Plus,
  Clapperboard,
  Sparkles,
} from "lucide-react";
import { useJournal } from "@/lib/journal-context";
import type { Shelf } from "@/lib/types";
import SearchModal from "@/components/SearchModal";
import WatchingShelf from "@/components/WatchingShelf";
import ToWatchShelf from "@/components/ToWatchShelf";
import WatchedShelf from "@/components/WatchedShelf";
import StatsDashboard from "@/components/StatsDashboard";

/**
 * Tab definitions.
 *
 * WHY AN ARRAY OF OBJECTS?
 * ────────────────────────
 * Instead of hardcoding tabs in JSX, we define them as data. This means:
 *  1. Adding a new tab is just adding an object (Open/Closed Principle)
 *  2. The tab rendering logic is written once, not duplicated 4 times (DRY)
 *  3. We can easily reorder or conditionally show/hide tabs
 */
type TabKey = "watching" | "toWatch" | "watched" | "stats";

interface TabDef {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  /** Which shelf this tab shows (undefined for "stats" which isn't a shelf) */
  shelf?: Shelf;
}

const TABS: TabDef[] = [
  {
    key: "watching",
    label: "Watching",
    icon: <Play className="w-4 h-4" />,
    shelf: "watching",
  },
  {
    key: "toWatch",
    label: "To Watch",
    icon: <BookmarkPlus className="w-4 h-4" />,
    shelf: "toWatch",
  },
  {
    key: "watched",
    label: "Watched",
    icon: <CheckCircle2 className="w-4 h-4" />,
    shelf: "watched",
  },
  {
    key: "stats",
    label: "Stats",
    icon: <BarChart3 className="w-4 h-4" />,
  },
];

export default function Dashboard() {
  const { entries, isLoaded } = useJournal();
  const [activeTab, setActiveTab] = useState<TabKey>("watching");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  /**
   * FILTER ENTRIES BY SHELF
   * ───────────────────────
   * useMemo prevents filtering on every render. The dependency array
   * `[entries]` means it only re-filters when entries actually change.
   */
  const watching = useMemo(
    () => entries.filter((e) => e.shelf === "watching"),
    [entries]
  );
  const toWatch = useMemo(
    () => entries.filter((e) => e.shelf === "toWatch"),
    [entries]
  );
  const watched = useMemo(
    () => entries.filter((e) => e.shelf === "watched"),
    [entries]
  );

  // Count badges for each tab
  const counts: Record<TabKey, number> = {
    watching: watching.length,
    toWatch: toWatch.length,
    watched: watched.length,
    stats: entries.length,
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <Clapperboard className="w-10 h-10 animate-pulse" />
          <p className="text-sm">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Cinema Journal
              </h1>
              <p className="text-[11px] text-zinc-500 -mt-0.5">
                Your personal movie portfolio
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 font-medium"
            id="add-movie-button"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Movie</span>
          </button>
        </div>

        {/* ── Tab Navigation ───────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 -mb-px" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2
                  transition-all duration-200
                  ${
                    activeTab === tab.key
                      ? "border-indigo-500 text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                  }
                `}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {counts[tab.key] > 0 && (
                  <span
                    className={`
                      text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                      ${
                        activeTab === tab.key
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "bg-zinc-800 text-zinc-500"
                      }
                    `}
                  >
                    {counts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "watching" && <WatchingShelf entries={watching} />}
        {activeTab === "toWatch" && <ToWatchShelf entries={toWatch} />}
        {activeTab === "watched" && <WatchedShelf entries={watched} />}
        {activeTab === "stats" && <StatsDashboard entries={entries} />}
      </main>

      {/* ── Floating Action — visible on mobile ────────────── */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="fixed bottom-6 right-6 sm:hidden p-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all z-30"
        aria-label="Add movie"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ── Search Modal ───────────────────────────────────── */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        defaultShelf={activeTab === "stats" ? "toWatch" : (activeTab as Shelf)}
      />

      {/* ── Empty State CTA (only when no entries at all) ─── */}
      {entries.length === 0 && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm pointer-events-none">
          <div className="text-center pointer-events-auto">
            <Sparkles className="w-16 h-16 mx-auto text-indigo-400/50 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to Cinema Journal
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-6">
              Track what you&apos;re watching, build your backlog, and keep a
              personal archive of every movie and show you experience.
            </p>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Your First Movie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
