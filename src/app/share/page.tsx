/**
 * =============================================================================
 * /share — Public Shared Journal Viewer for Couch Critics
 * =============================================================================
 * Displays shared watched archive, currently watching series, and backlog
 * directly from compressed URL hash (#d=...) or query param (?d=...).
 * Requires no authentication, no external database lookup, zero dependencies.
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Film,
  Tv,
  Star,
  Play,
  Clock,
  CheckCircle2,
  Search,
  Share2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  X,
  BookmarkPlus,
  Compass,
} from "lucide-react";
import type { MovieEntry, Shelf } from "@/lib/types";
import { decodeSharePayload, type SharedJournalPayload } from "@/lib/share-utils";
import { STARTER_ENTRIES } from "@/lib/starter-data";
import ThemeToggle from "@/components/ThemeToggle";

export default function SharePage() {
  const [payload, setPayload] = useState<SharedJournalPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "watched" | "watching" | "toWatch">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "movie" | "tv">("all");
  const [sortBy, setSortBy] = useState<"recent" | "rating" | "year" | "title">("recent");
  const [selectedEntry, setSelectedEntry] = useState<MovieEntry | null>(null);

  // Decode data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        let encoded = "";
        if (typeof window !== "undefined") {
          // Check hash first (#d=...)
          const hash = window.location.hash;
          if (hash.startsWith("#d=")) {
            encoded = hash.slice(3);
          } else if (hash.startsWith("#data=")) {
            encoded = hash.slice(6);
          } else {
            // Check query param (?d=...)
            const params = new URLSearchParams(window.location.search);
            encoded = params.get("d") || params.get("data") || "";
          }
        }

        if (encoded) {
          const decoded = await decodeSharePayload(encoded);
          if (decoded && decoded.entries.length > 0) {
            setPayload(decoded);
            setActiveTab(decoded.scope === "all" ? "all" : decoded.scope);
            setIsLoading(false);
            return;
          }
        }

        // Fallback to starter entries as showcase if no hash provided
        const watchedCount = STARTER_ENTRIES.filter((e: MovieEntry) => e.shelf === "watched").length;
        const watchingCount = STARTER_ENTRIES.filter((e: MovieEntry) => e.shelf === "watching").length;
        const toWatchCount = STARTER_ENTRIES.filter((e: MovieEntry) => e.shelf === "toWatch").length;

        setPayload({
          userName: "Showcase",
          createdAt: Date.now(),
          scope: "all",
          entries: STARTER_ENTRIES,
          stats: {
            total: STARTER_ENTRIES.length,
            watchedCount,
            watchingCount,
            toWatchCount,
            avgRating: 8.6,
            topGenres: ["Sci-Fi", "Drama", "Action", "Thriller"],
          },
        });
      } catch (err) {
        console.error("Failed to load shared journal:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const entries = useMemo(() => payload?.entries || [], [payload]);

  // Filter & Search
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Tab filter
      if (activeTab !== "all" && entry.shelf !== activeTab) return false;

      // Type filter
      if (typeFilter !== "all" && entry.tmdb.mediaType !== typeFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = entry.tmdb.title.toLowerCase().includes(q);
        const dirMatch = entry.tmdb.director?.toLowerCase().includes(q);
        const genreMatch = entry.tmdb.genres?.some((g) => g.toLowerCase().includes(q));
        if (!titleMatch && !dirMatch && !genreMatch) return false;
      }

      return true;
    });
  }, [entries, activeTab, typeFilter, searchQuery]);

  // Sort
  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      if (sortBy === "rating") {
        return (b.review?.rating || 0) - (a.review?.rating || 0);
      }
      if (sortBy === "year") {
        return (parseInt(b.tmdb.releaseYear, 10) || 0) - (parseInt(a.tmdb.releaseYear, 10) || 0);
      }
      if (sortBy === "title") {
        return a.tmdb.title.localeCompare(b.tmdb.title);
      }
      return 0; // default order
    });
  }, [filteredEntries, sortBy]);

  // Separate shelves counts
  const watchedEntries = useMemo(() => entries.filter((e) => e.shelf === "watched"), [entries]);
  const watchingEntries = useMemo(() => entries.filter((e) => e.shelf === "watching"), [entries]);
  const toWatchEntries = useMemo(() => entries.filter((e) => e.shelf === "toWatch"), [entries]);

  return (
    <div className="share-page min-h-screen bg-[#F8FAFC] dark:bg-[#07070A] text-[#0F172A] dark:text-white flex flex-col font-sans">
      {/* ══ STICKY HEADER ══ */}
      <header className="share-header sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0B0B0F]/90 backdrop-blur-xl border-b border-[#E2E8F0] dark:border-[#292932]/80 transition-colors">
        <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center shadow-sm ring-1 ring-slate-200 dark:ring-white/10 group-hover:ring-[#E50914]/50 transition-all">
              <img src="/icon.png" alt="Couch Critics" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F5F5F5] tracking-wider uppercase font-mono group-hover:text-[#E50914] transition-colors leading-tight">
                COUCH CRITICS
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono tracking-widest hidden sm:block">
                SHARED JOURNAL VIEWER
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle variant="button" />
            <Link
              href="/"
              className="px-3.5 py-1.5 bg-[#E50914] hover:bg-[#FF3B3B] text-white rounded-xl text-xs font-semibold transition-all shadow-md flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Launch Your Journal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ══ HERO BANNER ══ */}
      <section className="share-hero relative w-full border-b border-[#E2E8F0] dark:border-[#292932]/70 bg-gradient-to-b from-[#EDF2F7] via-[#F8FAFC] to-[#FFFFFF] dark:from-[#12131D] dark:via-[#0D0E15] dark:to-[#07070A] py-8 sm:py-12 transition-colors">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Profile Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 dark:bg-gradient-to-br dark:from-amber-500/20 dark:via-red-500/20 dark:to-purple-500/20 border border-amber-300 dark:border-amber-500/30 flex items-center justify-center text-2xl sm:text-3xl font-bold font-mono text-amber-800 dark:text-amber-300 shadow-md shrink-0">
                {payload?.userName ? payload.userName.charAt(0).toUpperCase() : "C"}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 font-semibold">
                    Public Cinema Journal
                  </span>
                  <span className="text-xs text-slate-500 dark:text-zinc-500 font-mono">
                    {new Date(payload?.createdAt || Date.now()).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="share-hero-title text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
                  {payload?.userName ? `${payload.userName}'s Collection` : "Cinema Journal"}
                </h2>
                <p className="share-hero-sub text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-xl">
                  Browsing movies, TV shows, ratings, and episode progress shared via Couch Critics.
                </p>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
              <div className="share-metric-card p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#15151C] border border-[#E2E8F0] dark:border-[#292932] text-center shadow-sm">
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold block uppercase tracking-wider">
                  Watched
                </span>
                <span className="stat-val text-lg sm:text-2xl font-bold font-mono text-[#0F172A] dark:text-white">
                  {watchedEntries.length}
                </span>
              </div>

              <div className="share-metric-card p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#15151C] border border-[#E2E8F0] dark:border-[#292932] text-center shadow-sm">
                <span className="text-[10px] font-mono text-red-700 dark:text-red-400 font-bold block uppercase tracking-wider">
                  Watching
                </span>
                <span className="stat-val text-lg sm:text-2xl font-bold font-mono text-[#0F172A] dark:text-white">
                  {watchingEntries.length}
                </span>
              </div>

              <div className="share-metric-card p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#15151C] border border-[#E2E8F0] dark:border-[#292932] text-center shadow-sm">
                <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold block uppercase tracking-wider">
                  To Watch
                </span>
                <span className="stat-val text-lg sm:text-2xl font-bold font-mono text-[#0F172A] dark:text-white">
                  {toWatchEntries.length}
                </span>
              </div>

              <div className="share-metric-card p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#15151C] border border-[#E2E8F0] dark:border-[#292932] text-center shadow-sm">
                <span className="text-[10px] font-mono text-yellow-700 dark:text-yellow-400 font-bold block uppercase tracking-wider">
                  Avg Rating
                </span>
                <span className="stat-val text-lg sm:text-2xl font-bold font-mono text-[#0F172A] dark:text-white">
                  {payload?.stats?.avgRating ? `${payload.stats.avgRating} ★` : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTROLS & SHELF TABS ══ */}
      <section className="share-controls-bar sticky top-[57px] z-30 w-full bg-white/95 dark:bg-[#0B0B0F]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#292932] transition-colors">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Shelves Selector */}
          <div className="share-filter-track flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#15151C] border border-[#CBD5E1] dark:border-[#292932] rounded-xl overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#0F172A] text-white shadow-sm dark:bg-white/10 dark:text-white dark:border dark:border-white/15"
                  : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              All Titles ({entries.length})
            </button>

            <button
              onClick={() => setActiveTab("watching")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "watching"
                  ? "bg-red-100 text-red-800 border border-red-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/40 shadow-sm"
                  : "text-slate-600 hover:text-red-700 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Play className="w-3 h-3 fill-current text-red-600 dark:text-red-400" />
              <span>Watching ({watchingEntries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("toWatch")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "toWatch"
                  ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 shadow-sm"
                  : "text-slate-600 hover:text-amber-800 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>To Watch ({toWatchEntries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("watched")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "watched"
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 shadow-sm"
                  : "text-slate-600 hover:text-emerald-800 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Watched ({watchedEntries.length})</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Filter titles or directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="share-search-input w-full bg-white dark:bg-[#15151C] border border-[#CBD5E1] dark:border-[#292932] rounded-xl pl-9 pr-8 py-1.5 text-xs text-[#0F172A] dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-red-500 dark:focus:border-amber-500/50 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Media Type Filter */}
            <div className="share-filter-track flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#15151C] border border-[#CBD5E1] dark:border-[#292932] rounded-xl shrink-0">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  typeFilter === "all"
                    ? "bg-[#0F172A] text-white shadow-sm dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter("movie")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  typeFilter === "movie"
                    ? "bg-[#0F172A] text-white shadow-sm dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setTypeFilter("tv")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  typeFilter === "tv"
                    ? "bg-[#0F172A] text-white shadow-sm dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Series
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="share-sort-select bg-white dark:bg-[#15151C] border border-[#CBD5E1] dark:border-[#292932] text-[#0F172A] dark:text-zinc-300 rounded-xl px-2.5 py-1.5 text-xs font-mono focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="recent" className="bg-white text-[#0F172A] dark:bg-[#15151C] dark:text-zinc-200">Sort: Default</option>
              <option value="rating" className="bg-white text-[#0F172A] dark:bg-[#15151C] dark:text-zinc-200">Sort: Rating</option>
              <option value="year" className="bg-white text-[#0F172A] dark:bg-[#15151C] dark:text-zinc-200">Sort: Year</option>
              <option value="title" className="bg-white text-[#0F172A] dark:bg-[#15151C] dark:text-zinc-200">Sort: Title</option>
            </select>
          </div>
        </div>
      </section>

      {/* ══ MAIN MEDIA GRID ══ */}
      <main className="max-w-[1720px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-mono">Loading shared journal...</p>
          </div>
        ) : sortedEntries.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-white dark:bg-[#15151C] border border-[#E2E8F0] dark:border-[#292932] max-w-lg mx-auto shadow-sm">
            <Film className="w-10 h-10 text-slate-400 dark:text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-1">No matching titles found</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
              Try adjusting your search query or switching tabs.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
                setActiveTab("all");
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] dark:bg-white/10 dark:hover:bg-white/15 dark:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {sortedEntries.map((entry) => {
              const isTv = entry.tmdb.mediaType === "tv";
              const isWatched = entry.shelf === "watched";
              const isWatching = entry.shelf === "watching";

              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className="share-media-card group relative flex flex-col rounded-2xl bg-white dark:bg-[#15151C] border border-[#E2E8F0] dark:border-[#292932] overflow-hidden hover:border-slate-300 dark:hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                >
                  {/* Poster Image */}
                  <div className="relative aspect-[2/3] w-full bg-slate-100 dark:bg-[#0B0B0F] overflow-hidden">
                    {entry.tmdb.posterUrl ? (
                      <img
                        src={entry.tmdb.posterUrl}
                        alt={entry.tmdb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-100 dark:bg-[#0B0B0F] text-slate-400 dark:text-zinc-600">
                        {isTv ? <Tv className="w-8 h-8 mb-2" /> : <Film className="w-8 h-8 mb-2" />}
                        <span className="text-[11px] font-mono">{entry.tmdb.title}</span>
                      </div>
                    )}

                    {/* Gradient Overlay for bottom badge contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Shelf Pill (Top Left) */}
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-md ${
                          isWatched
                            ? "bg-emerald-600 text-white"
                            : isWatching
                              ? "bg-red-600 text-white"
                              : "bg-amber-600 text-white"
                        }`}
                      >
                        {isWatched ? "Watched" : isWatching ? "Watching" : "To Watch"}
                      </span>
                    </div>

                    {/* Media Type (Top Right) */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-black/70 border border-white/10 text-white backdrop-blur-md">
                        {isTv ? "TV" : "Movie"}
                      </span>
                    </div>

                    {/* Rating or Progress (Bottom) */}
                    {isWatched && entry.review?.rating ? (
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/30 border border-amber-400/50 backdrop-blur-md">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold font-mono text-amber-300">
                            {entry.review.rating}/10
                          </span>
                        </div>
                        {entry.tmdb.releaseYear && (
                          <span className="text-[11px] font-mono text-zinc-300 drop-shadow">
                            {entry.tmdb.releaseYear}
                          </span>
                        )}
                      </div>
                    ) : isWatching && entry.progress ? (
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-red-300 font-semibold drop-shadow">
                          <span>
                            {isTv
                              ? `S${entry.progress.currentSeason || 1}:E${entry.progress.currentEpisode || 1}`
                              : "In Progress"}
                          </span>
                          {entry.progress.totalEpisodes && isTv && (
                            <span className="text-[10px] text-zinc-400">
                              of {entry.progress.totalEpisodes}
                            </span>
                          )}
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full bg-red-600 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(
                                  ((entry.progress.currentEpisode || 1) /
                                    (entry.progress.totalEpisodes || 10)) *
                                    100
                                )
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      entry.tmdb.releaseYear && (
                        <div className="absolute bottom-2.5 right-2.5">
                          <span className="text-[11px] font-mono text-zinc-300 drop-shadow">
                            {entry.tmdb.releaseYear}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5 bg-white dark:bg-[#15151C]">
                    <div>
                      <h4 className="card-title text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white line-clamp-1 group-hover:text-[#E50914] transition-colors">
                        {entry.tmdb.title}
                      </h4>
                      {entry.tmdb.director && (
                        <p className="card-dir text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">
                          Dir: {entry.tmdb.director}
                        </p>
                      )}
                    </div>

                    {/* Genres or Review Notes */}
                    {isWatched && entry.review?.notes ? (
                      <p className="text-[11px] text-slate-700 dark:text-zinc-300 italic line-clamp-2 bg-slate-50 dark:bg-black/20 p-1.5 rounded-lg border border-slate-200 dark:border-white/5">
                        &ldquo;{entry.review.notes}&rdquo;
                      </p>
                    ) : entry.tmdb.genres && entry.tmdb.genres.length > 0 ? (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {entry.tmdb.genres.slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ══ DETAIL POPUP MODAL ══ */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="share-modal-dialog relative w-full max-w-xl bg-white dark:bg-[#15151C] border border-[#E2E8F0] dark:border-[#292932] rounded-2xl overflow-hidden shadow-2xl text-[#0F172A] dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Backdrop Image */}
            <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-[#0B0B0F] overflow-hidden">
              {selectedEntry.tmdb.posterUrl && (
                <img
                  src={selectedEntry.tmdb.posterUrl}
                  alt={selectedEntry.tmdb.title}
                  className="w-full h-full object-cover filter blur-sm scale-110 opacity-40"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#15151C] dark:via-[#15151C]/60 dark:to-transparent" />

              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 dark:bg-black/60 dark:hover:bg-black/80 dark:text-zinc-300 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors cursor-pointer shadow-md"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3.5">
                {selectedEntry.tmdb.posterUrl && (
                  <img
                    src={selectedEntry.tmdb.posterUrl}
                    alt={selectedEntry.tmdb.title}
                    className="w-20 h-28 object-cover rounded-xl border border-white/20 shadow-2xl shrink-0"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow ${
                        selectedEntry.shelf === "watched"
                          ? "bg-emerald-600 text-white"
                          : selectedEntry.shelf === "watching"
                            ? "bg-red-600 text-white"
                            : "bg-amber-600 text-white"
                      }`}
                    >
                      {selectedEntry.shelf === "watched"
                        ? "Watched"
                        : selectedEntry.shelf === "watching"
                          ? "Currently Watching"
                          : "To Watch"}
                    </span>
                    <span className="text-xs font-mono text-slate-600 dark:text-zinc-400">
                      {selectedEntry.tmdb.releaseYear} •{" "}
                      {selectedEntry.tmdb.mediaType === "tv" ? "TV Series" : "Movie"}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white">{selectedEntry.tmdb.title}</h3>
                  {selectedEntry.tmdb.director && (
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Dir: {selectedEntry.tmdb.director}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-4">
              {/* Rating Section */}
              {selectedEntry.shelf === "watched" && selectedEntry.review && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      User Rating & Review
                    </span>
                    {selectedEntry.review.rating > 0 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-mono font-bold text-sm">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
                        <span>{selectedEntry.review.rating}/10</span>
                      </div>
                    )}
                  </div>
                  {selectedEntry.review.notes && (
                    <p className="text-xs text-slate-700 dark:text-zinc-200 italic leading-relaxed">
                      &ldquo;{selectedEntry.review.notes}&rdquo;
                    </p>
                  )}
                  {selectedEntry.review.dateCompleted && (
                    <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                      Completed on: {selectedEntry.review.dateCompleted}
                    </p>
                  )}
                </div>
              )}

              {/* Progress Section */}
              {selectedEntry.shelf === "watching" && selectedEntry.progress && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 space-y-2">
                  <span className="text-xs font-mono font-bold text-red-800 dark:text-red-300 uppercase tracking-wider block">
                    Episode Progress
                  </span>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#0F172A] dark:text-white font-semibold">
                      Season {selectedEntry.progress.currentSeason || 1}, Episode{" "}
                      {selectedEntry.progress.currentEpisode || 1}
                    </span>
                    {selectedEntry.progress.totalEpisodes && (
                      <span className="text-slate-500 dark:text-zinc-400">
                        {selectedEntry.progress.totalEpisodes} total episodes
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Genres */}
              {selectedEntry.tmdb.genres && selectedEntry.tmdb.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedEntry.tmdb.genres.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 rounded-lg text-xs font-mono bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Action */}
              <div className="pt-2 flex items-center justify-between">
                <a
                  href={`https://www.themoviedb.org/${selectedEntry.tmdb.mediaType}/${selectedEntry.tmdb.tmdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View on TMDB</span>
                </a>

                <Link
                  href="/"
                  className="px-4 py-2 bg-[#E50914] hover:bg-[#FF3B3B] text-white rounded-xl text-xs font-semibold transition-all shadow-md"
                >
                  Track in My Journal
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ FOOTER ══ */}
      <footer className="share-footer w-full border-t border-[#E2E8F0] dark:border-[#292932] bg-[#F8FAFC] dark:bg-[#0A0B10] py-8 mt-12 text-center text-xs text-slate-500 dark:text-zinc-500 transition-colors">
        <div className="max-w-[1720px] mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
              <img src="/icon.png" alt="Couch Critics" className="w-full h-full object-cover" />
            </div>
            <span className="font-mono font-bold tracking-wider text-[#0F172A] dark:text-zinc-300 uppercase">
              COUCH CRITICS
            </span>
          </div>
          <p className="max-w-md mx-auto text-[11px] leading-relaxed">
            Your personal, private movie & TV journal. Track episodes with pinpoint precision, curate backlogs, and share cinema passion with friends.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 dark:text-amber-400 dark:hover:text-amber-300 font-semibold"
            >
              <span>Get Started Free on Couch Critics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
