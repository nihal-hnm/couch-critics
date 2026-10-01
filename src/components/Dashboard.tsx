/**
 * =============================================================================
 * Main Dashboard — Cinematic Layout with Hero Section
 * =============================================================================
 *
 * Redesigned to match the warm, cinematic reference UI:
 *  - Hero section with dynamic poster backgrounds
 *  - Glassmorphism navigation
 *  - Warm amber/gold accent color palette
 *  - Stats summary in the hero footer
 *
 * WHY "use client"?
 * ─────────────────
 * Needs useState for tab switching, useContext for journal data,
 * and event handlers — all browser-only features.
 */

"use client";

import { useState, useMemo } from "react";
import {
  Play,
  BookmarkPlus,
  CheckCircle2,
  BarChart3,
  Plus,
  Film as FilmIcon,
  Sparkles,
  Clock,
  Star,
  Tv,
} from "lucide-react";
import { useJournal } from "@/lib/journal-context";
import type { Shelf } from "@/lib/types";
import SearchModal from "@/components/SearchModal";
import WatchingShelf from "@/components/WatchingShelf";
import ToWatchShelf from "@/components/ToWatchShelf";
import WatchedShelf from "@/components/WatchedShelf";
import StatsDashboard from "@/components/StatsDashboard";
import { computeStats, formatWatchTime } from "@/lib/stats";

type TabKey = "watching" | "toWatch" | "watched" | "stats";

interface TabDef {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
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

  const stats = useMemo(() => computeStats(entries), [entries]);

  const counts: Record<TabKey, number> = {
    watching: watching.length,
    toWatch: toWatch.length,
    watched: watched.length,
    stats: entries.length,
  };

  // Pick a random backdrop from existing posters for the hero
  const heroBackdrop = useMemo(() => {
    const withPosters = entries.filter((e) => e.tmdb.posterUrl);
    if (withPosters.length === 0) return null;
    return withPosters[Math.floor(Math.random() * withPosters.length)].tmdb
      .posterUrl;
  }, [entries]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-2xl bg-amber-500/10 animate-glow">
            <FilmIcon className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <p className="text-sm text-stone-500">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ══ HERO SECTION ═══════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* Dynamic backdrop from user's posters */}
        {heroBackdrop && (
          <div className="absolute inset-0">
            <img
              src={heroBackdrop}
              alt=""
              className="w-full h-full object-cover object-center opacity-20 blur-2xl scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-[#0a0a0a]/70 to-[#0a0a0a]" />
          </div>
        )}

        {/* Ambient warm glow behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <FilmIcon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  My Cinema
                </h1>
                <p className="text-[11px] text-stone-500 -mt-0.5">
                  A collection of stories I&apos;ve lived through
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm rounded-xl transition-all shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 font-medium"
              id="add-movie-button"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Movie</span>
            </button>
          </div>

          {/* ── Quick Stats Row (when user has entries) ────────── */}
          {entries.length > 0 && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-5">
              <div className="flex flex-wrap gap-5 text-sm">
                <div className="flex items-center gap-2 text-stone-400">
                  <FilmIcon className="w-3.5 h-3.5 text-amber-500/70" />
                  <span className="text-white font-semibold">{watched.length + watching.length}</span>
                  <span>Movies</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <Tv className="w-3.5 h-3.5 text-amber-500/70" />
                  <span className="text-white font-semibold">{toWatch.length}</span>
                  <span>Queued</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <Clock className="w-3.5 h-3.5 text-amber-500/70" />
                  <span className="text-white font-semibold">
                    {formatWatchTime(stats.totalWatchTimeMins)}
                  </span>
                  <span>Watched</span>
                </div>
                {stats.averageRating > 0 && (
                  <div className="flex items-center gap-2 text-stone-400">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-white font-semibold">
                      {stats.averageRating.toFixed(1)}
                    </span>
                    <span>Avg</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Tab Navigation ───────────────────────────────── */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav
              className="flex gap-1 border-b border-stone-800/50"
              role="tablist"
            >
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
                        ? "border-amber-500 text-amber-100"
                        : "border-transparent text-stone-500 hover:text-stone-300 hover:border-stone-700"
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
                            ? "bg-amber-500/15 text-amber-300"
                            : "bg-stone-800 text-stone-500"
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
      </div>

      {/* ── Main Content (hidden when empty — the global CTA takes over) */}
      {entries.length > 0 && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {activeTab === "watching" && <WatchingShelf entries={watching} />}
          {activeTab === "toWatch" && <ToWatchShelf entries={toWatch} />}
          {activeTab === "watched" && <WatchedShelf entries={watched} />}
          {activeTab === "stats" && <StatsDashboard entries={entries} />}
        </main>
      )}

      {/* ── Floating Action — mobile ────────────────────────── */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="fixed bottom-6 right-6 sm:hidden p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all z-30 animate-glow"
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

      {/* ── Empty State CTA ─────────────────────────────────── */}
      {entries.length === 0 && (
        <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
          {/* Ambient glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/8 rounded-full blur-[100px]" />

          <div className="text-center pointer-events-auto relative">
            <div className="inline-flex p-5 rounded-2xl bg-amber-500/10 mb-6 animate-float">
              <Sparkles className="w-12 h-12 text-amber-400/60" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 text-glow">
              Welcome to My Cinema
            </h2>
            <p className="text-stone-400 max-w-md mx-auto mb-8 leading-relaxed">
              Track what you&apos;re watching, build your backlog, and keep a
              personal archive of every movie and show you experience.
            </p>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
