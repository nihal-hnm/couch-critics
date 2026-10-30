/**
 * =============================================================================
 * Main Dashboard — Currently Watching Focus with Burger Bar Menu Drawer
 * =============================================================================
 *
 * Features:
 *  - Main View: Exclusively focused on Currently Watching shows & movies
 *    with interactive episode-wise checklists, progress steppers, and filter chips.
 *  - Burger Bar (Slide-out Drawer): Houses the rest of the app:
 *    • To Watch (Backlog)
 *    • Watched Archive & Reviews
 *    • All Movies catalog
 *    • All TV Series catalog
 *    • Watch Analytics & Stats
 *    • Favorites (8+ Rated)
 *    • My Journey (Yearly Timeline)
 *    • User profile / Authentication & Total runtime statistics
 *  - Seamless navigation with quick "Back to Currently Watching" return banner
 */

"use client";

import { useState, useMemo, useRef, useEffect, useCallback, type ReactNode } from "react";
import {
  Plus,
  Film as FilmIcon,
  Sparkles,
  Clock,
  Star,
  Tv,
  Home,
  BarChart3,
  Heart,
  Map as MapIcon,
  Search as SearchIcon,
  ChevronRight,
  Play,
  BookmarkPlus,
  Award,
  LogIn,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  RotateCcw,
  SlidersHorizontal,
  Tags,
  ArrowLeft,
} from "lucide-react";
import { useJournal } from "@/lib/journal-context";
import { useAuth } from "@/lib/auth-context";
import type { Shelf, MovieEntry } from "@/lib/types";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import WatchingShelf from "@/components/WatchingShelf";
import ToWatchShelf from "@/components/ToWatchShelf";
import WatchedShelf from "@/components/WatchedShelf";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import MediaDetailModal from "@/components/MediaDetailModal";
import ChoosingPanelModal from "@/components/ChoosingPanelModal";
import ThemeToggle from "@/components/ThemeToggle";
import { computeStats, formatWatchTime, formatDaysAndHours, formatHours } from "@/lib/stats";

export type NavKey =
  | "watching"
  | "toWatch"
  | "watched"
  | "movies"
  | "series"
  | "genres"
  | "stats"
  | "journey"
  | "favorites";

import Link from "next/link";
import { SHOWCASE_MEDIA_ITEMS, type MarqueeMediaItem } from "@/lib/showcase-media";
import { MovieImage } from "./common/MovieImage";
import { getOptimizedImageUrl } from "@/lib/image-utils";

export default function Dashboard() {
  const { entries, isLoaded } = useJournal();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [activeNav, setActiveNav] = useState<NavKey>("watching");
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [watchingTypeFilter, setWatchingTypeFilter] = useState<"all" | "tv" | "movie">("all");
  const [watchingGenreFilter, setWatchingGenreFilter] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [genreShelfFilter, setGenreShelfFilter] = useState<"all" | "watching" | "toWatch" | "watched">("all");
  const [selectedDetailEntry, setSelectedDetailEntry] = useState<MovieEntry | null>(null);
  const [selectedChoosingItem, setSelectedChoosingItem] = useState<(MarqueeMediaItem & { shelf?: Shelf; entry?: MovieEntry }) | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsBurgerMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsUserMenuOpen(false);
    setIsBurgerMenuOpen(false);
    await signOut();
  }, [signOut]);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "?";

  // Shelf-categorized entries
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

  // Sub-categorized currently watching
  const watchingSeries = useMemo(
    () => watching.filter((e) => e.tmdb.mediaType === "tv"),
    [watching]
  );
  const watchingMovies = useMemo(
    () => watching.filter((e) => e.tmdb.mediaType === "movie"),
    [watching]
  );

  // Sub-categorized watched entries (separated strictly by mediaType)
  const watchedMovies = useMemo(
    () => watched.filter((e) => e.tmdb.mediaType === "movie"),
    [watched]
  );
  const watchedSeries = useMemo(
    () => watched.filter((e) => e.tmdb.mediaType === "tv"),
    [watched]
  );

  // Sub-categorized toWatch entries
  const toWatchMovies = useMemo(
    () => toWatch.filter((e) => e.tmdb.mediaType === "movie"),
    [toWatch]
  );
  const toWatchSeries = useMemo(
    () => toWatch.filter((e) => e.tmdb.mediaType === "tv"),
    [toWatch]
  );

  // All unique genres across entire journal with counts
  const allGenres = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((entry) => {
      entry.tmdb.genres.forEach((genre) => {
        counts[genre] = (counts[genre] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);
  }, [entries]);

  // Unique genres in currently watching list
  const watchingGenres = useMemo(() => {
    const counts: Record<string, number> = {};
    watching.forEach((entry) => {
      entry.tmdb.genres.forEach((genre) => {
        counts[genre] = (counts[genre] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);
  }, [watching]);

  // Filtered currently watching by type & genre
  const filteredWatching = useMemo(() => {
    let list = watching;
    if (watchingTypeFilter === "tv") list = watchingSeries;
    if (watchingTypeFilter === "movie") list = watchingMovies;
    if (watchingGenreFilter !== "all") {
      list = list.filter((e) => e.tmdb.genres.includes(watchingGenreFilter));
    }
    return list;
  }, [watching, watchingTypeFilter, watchingSeries, watchingMovies, watchingGenreFilter]);

  // Genre Explorer filtered list
  const genreFilteredEntries = useMemo(() => {
    if (selectedGenre === "all") return entries;
    return entries.filter((e) => e.tmdb.genres.includes(selectedGenre));
  }, [entries, selectedGenre]);

  const displayedGenreEntries = useMemo(() => {
    if (genreShelfFilter === "all") return genreFilteredEntries;
    return genreFilteredEntries.filter((e) => e.shelf === genreShelfFilter);
  }, [genreFilteredEntries, genreShelfFilter]);

  // Genre watch time statistics (total in days/hours, movies & series in hours)
  const selectedGenreStats = useMemo(() => {
    let totalMins = 0;
    let movieMins = 0;
    let seriesMins = 0;

    genreFilteredEntries.forEach((entry) => {
      const runtime = entry.tmdb.runtime || 0;
      if (entry.tmdb.mediaType === "movie") {
        if (entry.shelf === "watched") {
          movieMins += runtime;
          totalMins += runtime;
        } else if (entry.shelf === "watching") {
          const partial = Math.round(runtime * 0.5);
          movieMins += partial;
          totalMins += partial;
        }
      } else {
        const episodeRuntime = runtime || 45;
        const totalEps = entry.progress?.totalEpisodes || entry.tmdb.totalEpisodes || 10;
        const watchedEpisodes =
          entry.shelf === "watched"
            ? totalEps
            : entry.progress?.watchedEpisodes?.length || entry.progress?.currentEpisode || 0;
        const sMins =
          entry.shelf === "watched"
            ? entry.progress?.totalMinutes || totalEps * episodeRuntime
            : entry.progress?.minutesWatched || watchedEpisodes * episodeRuntime;
        seriesMins += sMins;
        totalMins += sMins;
      }
    });

    return { totalMins, movieMins, seriesMins };
  }, [genreFilteredEntries]);

  // Overall statistics
  const stats = useMemo(() => computeStats(entries), [entries]);

  // Movies vs TV shows
  const movies = useMemo(
    () => entries.filter((e) => e.tmdb.mediaType === "movie"),
    [entries]
  );
  const series = useMemo(
    () => entries.filter((e) => e.tmdb.mediaType === "tv"),
    [entries]
  );

  // Favorites: top rated watched entries
  const favorites = useMemo(() => {
    return [...watched]
      .filter((e) => e.review?.rating && e.review.rating >= 8)
      .sort((a, b) => (b.review?.rating ?? 0) - (a.review?.rating ?? 0))
      .slice(0, 20);
  }, [watched]);

  // Moving Background Marquee: ONLY "To Watch" backlog titles (strictly excluding watched & watching)
  const marqueeItems = useMemo(() => {
    // 1. Set of all watched & currently watching titles/tmdbIds from the user's journal to strictly exclude them
    const excludedTitleKeys = new Set(
      entries
        .filter((e) => e.shelf === "watched" || e.shelf === "watching")
        .map((e) => e.tmdb?.title?.toLowerCase().trim())
        .filter(Boolean)
    );
    const excludedTmdbIds = new Set(
      entries
        .filter((e) => (e.shelf === "watched" || e.shelf === "watching") && e.tmdb?.tmdbId)
        .map((e) => e.tmdb.tmdbId)
    );

    // 2. User entries that are strictly on the "To Watch" shelf
    const toWatchUserMedia: (MarqueeMediaItem & { shelf: Shelf; entry?: MovieEntry })[] = entries
      .filter((e) => e.tmdb?.posterUrl && e.shelf === "toWatch")
      .map((e) => ({
        id: e.id,
        title: e.tmdb.title,
        mediaType: e.tmdb.mediaType,
        posterUrl: e.tmdb.posterUrl!,
        releaseYear: e.tmdb.releaseYear,
        shelf: "toWatch",
        entry: e,
      }));

    // 3. Showcase / catalog items that are NOT in watched and NOT in watching
    const toWatchShowcase: (MarqueeMediaItem & { shelf: Shelf; entry?: MovieEntry })[] = [];
    for (const item of SHOWCASE_MEDIA_ITEMS) {
      const itemTitleKey = item.title.toLowerCase().trim();
      const itemTmdbId = parseInt(item.id.replace("showcase-", ""), 10);

      // Strictly exclude if the user is watching or has already watched this title
      if (
        excludedTitleKeys.has(itemTitleKey) ||
        (!isNaN(itemTmdbId) && excludedTmdbIds.has(itemTmdbId))
      ) {
        continue;
      }

      // Check if user already has this in their toWatch media list
      const alreadyInToWatch = toWatchUserMedia.some(
        (m) =>
          m.title.toLowerCase().trim() === itemTitleKey ||
          (!isNaN(itemTmdbId) && m.entry?.tmdb?.tmdbId === itemTmdbId)
      );

      if (!alreadyInToWatch) {
        toWatchShowcase.push({
          ...item,
          shelf: "toWatch",
        });
      }
    }

    const allItems = [...toWatchUserMedia, ...toWatchShowcase];
    const seen = new Set<string>();
    const uniqueItems: (MarqueeMediaItem & { shelf: Shelf; entry?: MovieEntry })[] = [];
    for (const item of allItems) {
      if (!seen.has(item.posterUrl)) {
        seen.add(item.posterUrl);
        uniqueItems.push(item);
      }
    }

    // Interleave TV shows and movies for visual variety
    const shows = uniqueItems.filter((i) => i.mediaType === "tv");
    const movies = uniqueItems.filter((i) => i.mediaType === "movie");
    const interleaved: typeof uniqueItems = [];
    const maxLen = Math.max(shows.length, movies.length);
    for (let i = 0; i < maxLen; i++) {
      if (shows[i]) interleaved.push(shows[i]);
      if (movies[i]) interleaved.push(movies[i]);
    }

    const baseList = interleaved.length > 0 ? interleaved : uniqueItems;
    // Duplicate once for seamless infinite marquee loop
    return [...baseList, ...baseList];
  }, [entries]);

  // Click on a marquee poster opens the Choosing Panel modal directly
  const handleMarqueeItemClick = useCallback(
    (item: MarqueeMediaItem & { shelf?: Shelf; entry?: MovieEntry }) => {
      // Directly open the Choosing Panel for this title without any unwanted navigation
      setSelectedChoosingItem(item);
    },
    []
  );


  // Journey data — group by year
  const journeyYears = useMemo(() => {
    const yearMap: Record<string, MovieEntry[]> = {};
    watched.forEach((entry) => {
      const year = entry.review?.dateCompleted
        ? new Date(entry.review.dateCompleted).getFullYear().toString()
        : new Date(entry.addedAt).getFullYear().toString();
      if (!yearMap[year]) yearMap[year] = [];
      yearMap[year].push(entry);
    });
    return Object.entries(yearMap)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6);
  }, [watched]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F]">
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-2xl bg-[#E50914]/15">
            <FilmIcon className="w-8 h-8 text-[#E50914] animate-pulse" />
          </div>
          <p className="text-sm text-[#A1A1AA]">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* ══ BURGER MENU SLIDE-OUT DRAWER ═══════════════════════════ */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity duration-300 ${
          isBurgerMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsBurgerMenuOpen(false)}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#15151C] border-r border-[#292932] z-50 flex flex-col shadow-2xl shadow-black/90 transform transition-transform duration-300 ease-out ${
          isBurgerMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Side Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#292932] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-[#07070A] flex items-center justify-center">
              <img src="/icon.png" alt="Couch Critics" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                COUCH CRITICS
              </h2>
              <p className="text-[10px] text-[#A1A1AA] tracking-widest uppercase">
                Navigation Menu
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBurgerMenuOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Nav Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar">
          {/* Main Focus: Currently Watching */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Main Dashboard
            </div>
            <button
              onClick={() => {
                setActiveNav("watching");
                setIsBurgerMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer group ${
                activeNav === "watching"
                  ? "bg-gradient-to-r from-[#E50914] to-[#C10711] text-white shadow-lg shadow-[#E50914]/25"
                  : "text-stone-300 hover:text-white hover:bg-red-500/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  activeNav === "watching"
                    ? "bg-white/20 text-white"
                    : "bg-red-500/10 border border-red-500/25 text-[#FF3B3B] group-hover:bg-red-500/20"
                }`}>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-left font-medium">Currently Watching</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded-md text-xs font-mono ${
                activeNav === "watching"
                  ? "bg-white/20 text-white"
                  : "bg-red-950/40 text-red-300 border border-red-500/25"
              }`}>
                {watching.length}
              </span>
            </button>
          </div>

          {/* Shelves & Catalogs */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Your Library &amp; Shelves
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveNav("toWatch");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                  activeNav === "toWatch"
                    ? "bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent text-amber-200 border border-amber-500/40 shadow-md shadow-amber-950/40 font-semibold"
                    : "text-stone-300 hover:text-white hover:bg-amber-500/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeNav === "toWatch"
                      ? "bg-amber-500 text-stone-950 font-bold"
                      : "bg-amber-500/10 border border-amber-500/25 text-amber-400 group-hover:bg-amber-500/20"
                  }`}>
                    <BookmarkPlus className="w-3.5 h-3.5" />
                  </div>
                  <span>To Watch (Backlog)</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-xs font-mono ${
                  activeNav === "toWatch"
                    ? "bg-amber-500/25 text-amber-200 border border-amber-500/30"
                    : "bg-amber-950/40 text-amber-300 border border-amber-500/25"
                }`}>
                  {toWatch.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("watched");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                  activeNav === "watched"
                    ? "bg-gradient-to-r from-emerald-500/20 via-emerald-600/10 to-transparent text-emerald-200 border border-emerald-500/40 shadow-md shadow-emerald-950/40 font-semibold"
                    : "text-stone-300 hover:text-white hover:bg-emerald-500/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeNav === "watched"
                      ? "bg-emerald-500 text-stone-950 font-bold"
                      : "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 group-hover:bg-emerald-500/20"
                  }`}>
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span>Watched Archive</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-300/80 border border-emerald-500/20" title="Movies & Shows breakdown">
                    {watchedMovies.length}M · {watchedSeries.length}S
                  </span>
                  <span className={`px-1.5 py-0.5 rounded-md text-xs font-mono ${
                    activeNav === "watched"
                      ? "bg-emerald-500/25 text-emerald-200 border border-emerald-500/30"
                      : "bg-emerald-950/40 text-emerald-300 border border-emerald-500/25"
                  }`}>
                    {watched.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveNav("movies");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                  activeNav === "movies"
                    ? "bg-gradient-to-r from-indigo-500/20 via-indigo-600/10 to-transparent text-indigo-200 border border-indigo-500/40 shadow-md shadow-indigo-950/40 font-semibold"
                    : "text-stone-300 hover:text-white hover:bg-indigo-500/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeNav === "movies"
                      ? "bg-indigo-500 text-white font-bold"
                      : "bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 group-hover:bg-indigo-500/20"
                  }`}>
                    <FilmIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>All Movies</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-xs font-mono ${
                  activeNav === "movies"
                    ? "bg-indigo-500/25 text-indigo-200 border border-indigo-500/30"
                    : "bg-indigo-950/40 text-indigo-300 border border-indigo-500/25"
                }`}>
                  {watchedMovies.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("series");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                  activeNav === "series"
                    ? "bg-gradient-to-r from-purple-500/20 via-purple-600/10 to-transparent text-purple-200 border border-purple-500/40 shadow-md shadow-purple-950/40 font-semibold"
                    : "text-stone-300 hover:text-white hover:bg-purple-500/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeNav === "series"
                      ? "bg-purple-500 text-white font-bold"
                      : "bg-purple-500/10 border border-purple-500/25 text-purple-400 group-hover:bg-purple-500/20"
                  }`}>
                    <Tv className="w-3.5 h-3.5" />
                  </div>
                  <span>All TV Series</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-xs font-mono ${
                  activeNav === "series"
                    ? "bg-purple-500/25 text-purple-200 border border-purple-500/30"
                    : "bg-purple-950/40 text-purple-300 border border-purple-500/25"
                }`}>
                  {watchedSeries.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("genres");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                  activeNav === "genres"
                    ? "bg-gradient-to-r from-orange-500/20 via-orange-600/10 to-transparent text-orange-200 border border-orange-500/40 shadow-md shadow-orange-950/40 font-semibold"
                    : "text-stone-300 hover:text-white hover:bg-orange-500/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeNav === "genres"
                      ? "bg-orange-500 text-white font-bold"
                      : "bg-orange-500/10 border border-orange-500/25 text-orange-400 group-hover:bg-orange-500/20"
                  }`}>
                    <Tags className="w-3.5 h-3.5" />
                  </div>
                  <span>Browse by Genre</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-xs font-mono ${
                  activeNav === "genres"
                    ? "bg-orange-500/25 text-orange-200 border border-orange-500/30"
                    : "bg-orange-950/40 text-orange-300 border border-orange-500/25"
                }`}>
                  {allGenres.length}
                </span>
              </button>
            </div>
          </div>

          {/* Insights & Discovery */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Insights &amp; Memories
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveNav("stats");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                  activeNav === "stats"
                    ? "bg-gradient-to-r from-cyan-500/20 via-cyan-600/10 to-transparent text-cyan-200 border border-cyan-500/40 shadow-md shadow-cyan-950/40 font-semibold"
                    : "text-stone-300 hover:text-white hover:bg-cyan-500/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeNav === "stats"
                      ? "bg-cyan-500 text-stone-950 font-bold"
                      : "bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 group-hover:bg-cyan-500/20"
                  }`}>
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                  <span>Watch Analytics</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  activeNav === "stats"
                    ? "bg-cyan-500/25 text-cyan-200 border border-cyan-500/30 font-bold"
                    : "bg-cyan-950/40 text-cyan-300 border border-cyan-500/25"
                }`}>
                  {stats.totalWatchTimeMins > 0 ? formatDaysAndHours(stats.totalWatchTimeMins) : "0d 0h"}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("favorites");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                  activeNav === "favorites"
                    ? "bg-gradient-to-r from-rose-500/20 via-rose-600/10 to-transparent text-rose-200 border border-rose-500/40 shadow-md shadow-rose-950/40 font-semibold"
                    : "text-stone-300 hover:text-white hover:bg-rose-500/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeNav === "favorites"
                      ? "bg-rose-500 text-white font-bold"
                      : "bg-rose-500/10 border border-rose-500/25 text-rose-400 group-hover:bg-rose-500/20"
                  }`}>
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span>My Favorites</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-xs font-mono ${
                  activeNav === "favorites"
                    ? "bg-rose-500/25 text-rose-200 border border-rose-500/30"
                    : "bg-rose-950/40 text-rose-300 border border-rose-500/25"
                }`}>
                  {favorites.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("journey");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                  activeNav === "journey"
                    ? "bg-gradient-to-r from-yellow-500/20 via-yellow-600/10 to-transparent text-yellow-200 border border-yellow-500/40 shadow-md shadow-yellow-950/40 font-semibold"
                    : "text-stone-300 hover:text-white hover:bg-yellow-500/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeNav === "journey"
                      ? "bg-yellow-500 text-stone-950 font-bold"
                      : "bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 group-hover:bg-yellow-500/20"
                  }`}>
                    <MapIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>My Journey</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  activeNav === "journey"
                    ? "bg-yellow-500/25 text-yellow-200 border border-yellow-500/30"
                    : "bg-yellow-950/40 text-yellow-300 border border-yellow-500/25"
                }`}>
                  {journeyYears.length} {journeyYears.length === 1 ? "yr" : "yrs"}
                </span>
              </button>
            </div>
          </div>

          {/* Theme / Appearance Toggle */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
              <span>Appearance</span>
              <span className="text-[10px] font-medium text-[#E50914] uppercase">Theme</span>
            </div>
            <div className="px-1">
              <ThemeToggle variant="segmented" />
            </div>
          </div>
        </div>

        {/* Drawer Footer with Quick Watch Stats & Auth */}
        <div className="p-4 border-t border-[#292932] bg-[#0B0B0F] space-y-3">
          <div className="p-3.5 rounded-xl bg-[#15151C] border border-[#292932]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#A1A1AA] flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Overall Watch Time
              </span>
              <span className="font-bold font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md text-[11px]">
                {formatDaysAndHours(stats.totalWatchTimeMins)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#292932]/60">
              <span className="flex items-center gap-1 text-indigo-300">
                <FilmIcon className="w-3 h-3 text-indigo-400" /> Movies: {formatHours(stats.movieMinutes)}
              </span>
              <span className="flex items-center gap-1 text-purple-300">
                <Tv className="w-3 h-3 text-purple-400" /> Series: {formatHours(stats.seriesMinutes)}
              </span>
            </div>
          </div>

          {!authLoading && (
            user ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs text-stone-300 truncate max-w-[170px]">
                  <div className="w-6 h-6 rounded-full bg-[#E50914] text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                    {userInitial}
                  </div>
                  <span className="truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-stone-500 hover:text-[#E50914] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsBurgerMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF3B3B] text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-black/40"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In / Register
              </Link>
            )
          )}
        </div>
      </aside>

      {/* ══ CINEMATIC MOVING POSTERS HERO BANNER ═══════════════════ */}
      <div
        ref={heroRef}
        className="relative overflow-hidden h-[210px] sm:h-[240px]"
      >
        {/* ══ DYNAMIC MOVING BACKGROUND: 1 SINGLE SET OF POSTERS ══ */}
        <div className="hero-marquee-wrapper" role="region" aria-label="Featured movie and TV posters">
          {/* Single Continuous Row — Moving Left */}
          <div className="hero-marquee-track-left">
            {marqueeItems.map((item, idx) => (
              <div
                key={`m-${item.id}-${idx}`}
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarqueeItemClick(item);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleMarqueeItemClick(item);
                  }
                }}
                className="hero-poster-card w-28 sm:w-32 md:w-36 aspect-[2/3] mx-2 sm:mx-2.5 overflow-hidden bg-stone-900 rounded-xl cursor-pointer"
                title={`Click to choose shelf: ${item.title}`}
              >
                <MovieImage
                  src={item.posterUrl}
                  alt={item.title}
                  title={item.title}
                  mediaType={item.mediaType}
                  loading="eager"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cinematic gradient scrims for text legibility and smooth edge fade */}
        <div className="absolute inset-0 hero-overlay-bottom pointer-events-none" />
        <div className="absolute inset-0 hero-overlay-side pointer-events-none" />

        {/* Ambient subtle cinema atmosphere */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#E50914]/[0.03] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-black/40 rounded-full blur-[100px] pointer-events-none" />

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="relative z-20 pointer-events-none w-full">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3 pointer-events-auto">
              {/* Burger Menu Button */}
              <button
                onClick={() => setIsBurgerMenuOpen(true)}
                className="p-2 sm:px-3 sm:py-2.5 rounded-xl bg-[#15151C] hover:bg-[#1E1E26] border border-[#292932] hover:border-[#3D3D4C] text-[#F5F5F5] transition-all flex items-center gap-2 group shadow-sm cursor-pointer"
                aria-label="Open navigation menu"
                id="burger-menu-button"
                title="Open Menu: Backlog, Watched, Catalogs & Stats"
              >
                <Menu className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#F5F5F5] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline text-[#A1A1AA] group-hover:text-[#F5F5F5]">
                  Menu
                </span>
              </button>

              {/* Logo / Brand */}
              <div
                onClick={() => setActiveNav("watching")}
                className="flex items-center gap-2.5 cursor-pointer group px-3 py-1.5 rounded-xl bg-[#15151C] border border-[#292932] shadow-sm backdrop-blur-md transition-all hover:border-[#3D3D4C]"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-[#07070A] flex items-center justify-center">
                  <img src="/icon.png" alt="Couch Critics" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-bold text-[#F5F5F5] tracking-wider uppercase font-mono group-hover:text-[#E50914] transition-colors leading-tight">
                    COUCH CRITICS
                  </h1>
                  <p className="text-[10px] font-medium tracking-widest uppercase leading-tight">
                    {activeNav === "watching" && <span className="text-[#FF3B3B]">Currently Watching</span>}
                    {activeNav === "toWatch" && <span className="text-amber-400">To Watch Backlog</span>}
                    {activeNav === "watched" && <span className="text-emerald-400">Watched Archive</span>}
                    {activeNav === "movies" && <span className="text-indigo-400">Movies Catalog</span>}
                    {activeNav === "series" && <span className="text-purple-400">Series Catalog</span>}
                    {activeNav === "genres" && <span className="text-orange-400">Browse by Genre</span>}
                    {activeNav === "stats" && <span className="text-cyan-400">Watch Analytics</span>}
                    {activeNav === "journey" && <span className="text-yellow-400">My Journey</span>}
                    {activeNav === "favorites" && <span className="text-rose-400">Favorites</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
              {/* Light / Dark Mode Toggle */}
              <ThemeToggle variant="button" />

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-xl glass-card text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors cursor-pointer"
                aria-label="Search movies and series"
                title="Search TMDB"
              >
                <SearchIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-[#E50914] hover:bg-[#FF3B3B] text-white text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-black/40 font-semibold cursor-pointer active:scale-95"
                id="add-movie-button"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Title</span>
              </button>

              {/* Auth: Login button or User avatar menu */}
              {!authLoading && (
                user ? (
                  <div className="user-menu-wrapper" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="user-avatar-btn cursor-pointer"
                      id="user-menu-button"
                      aria-label="User menu"
                    >
                      <div className="user-avatar-icon">{userInitial}</div>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {isUserMenuOpen && (
                      <div className="user-menu-dropdown">
                        <div className="user-menu-email">{user.email}</div>
                        <button
                          onClick={handleSignOut}
                          className="user-menu-item danger cursor-pointer"
                          id="sign-out-button"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="login-btn cursor-pointer"
                    id="login-button"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )
              )}
            </div>
          </div>
        </header>
      </div>

      {/* ── Main Shelves Container Anchor ── */}
      <div id="shelves-main-content" className="scroll-mt-4" />

      {/* ── Main Hero Content (Cleanly Positioned BELOW Moving Background) ── */}
      {/* ── Main Hero Content (Cleanly Positioned BELOW Moving Background) ── */}
      {activeNav === "watching" && (
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-widest uppercase bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30 shadow-sm shadow-[#E50914]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                  In Progress
                </span>
                <span className="text-xs text-[#A1A1AA] font-medium">
                  &bull; {watching.length} {watching.length === 1 ? "title" : "titles"}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-glow tracking-tight">
                Currently Watching
              </h2>
              <p className="text-[#A1A1AA] text-xs sm:text-sm mt-1 max-w-lg">
                Track series episode by episode, log movie minutes, and keep your screen in sync.
              </p>
            </div>

            {/* Quick Runtime Metrics Banner: Overall in days & hours, Series and Movies in hours */}
            {watching.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* Overall Watch Time in Days & Hours */}
                <div className="liquid-glass-card px-3.5 py-2 flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#E50914]/12 text-[#E50914]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-[#F5F5F5]">
                      {formatDaysAndHours(stats.totalWatchTimeMins)}
                    </div>
                    <div className="text-[10px] text-[#A1A1AA]">Overall Time</div>
                  </div>
                </div>

                {/* Series Time in Hours */}
                <div className="liquid-glass-card px-3.5 py-2 flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#E50914]/12 text-[#E50914]">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-[#F5F5F5]">
                      {formatHours(stats.seriesMinutes)}
                    </div>
                    <div className="text-[10px] text-[#A1A1AA]">Series Time</div>
                  </div>
                </div>

                {/* Movie Time in Hours */}
                <div className="liquid-glass-card px-3.5 py-2 flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#E50914]/12 text-[#E50914]">
                    <FilmIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-[#F5F5F5]">
                      {formatHours(stats.movieMinutes)}
                    </div>
                    <div className="text-[10px] text-[#A1A1AA]">Movie Time</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Unified Filter Toolbar for Currently Watching */}
          {watching.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 pt-4 border-t border-white/[0.06]">
              {/* Type Segmented Control */}
              <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                <button
                  onClick={() => setWatchingTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    watchingTypeFilter === "all"
                      ? "bg-[#E50914] text-white shadow-sm"
                      : "text-[#A1A1AA] hover:text-[#F5F5F5]"
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>All ({watching.length})</span>
                </button>
                <button
                  onClick={() => setWatchingTypeFilter("tv")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    watchingTypeFilter === "tv"
                      ? "bg-[#E50914] text-white shadow-sm"
                      : "text-[#A1A1AA] hover:text-[#F5F5F5]"
                  }`}
                >
                  <Tv className="w-3 h-3" />
                  <span>Series ({watchingSeries.length})</span>
                </button>
                <button
                  onClick={() => setWatchingTypeFilter("movie")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    watchingTypeFilter === "movie"
                      ? "bg-[#E50914] text-white shadow-sm"
                      : "text-[#A1A1AA] hover:text-[#F5F5F5]"
                  }`}
                >
                  <FilmIcon className="w-3 h-3" />
                  <span>Movies ({watchingMovies.length})</span>
                </button>
              </div>

              {/* Genre Filter Chips */}
              {watchingGenres.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                    <Tags className="w-3 h-3 text-[#E50914]" />
                    Genre:
                  </span>
                  <button
                    onClick={() => setWatchingGenreFilter("all")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                      watchingGenreFilter === "all"
                        ? "bg-white/15 text-white border border-white/20 font-semibold"
                        : "text-[#A1A1AA] hover:text-[#F5F5F5] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08]"
                    }`}
                  >
                    All
                  </button>
                  {watchingGenres.map(({ genre, count }) => (
                    <button
                      key={genre}
                      onClick={() => setWatchingGenreFilter(watchingGenreFilter === genre ? "all" : genre)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                        watchingGenreFilter === genre
                          ? "bg-white/15 text-white border border-white/20 font-semibold"
                          : "text-[#A1A1AA] hover:text-[#F5F5F5] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08]"
                      }`}
                    >
                      {genre} <span className="opacity-60 text-[10px]">({count})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══ MAIN CONTENT VIEWS ══════════════════════════════════════ */}

      {/* ── View 1: CURRENTLY WATCHING (Primary Home Screen) ─────── */}
      {activeNav === "watching" && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {watching.length > 0 ? (
            filteredWatching.length > 0 ? (
              <WatchingShelf entries={filteredWatching} />
            ) : (
              <div className="glass-card p-12 text-center rounded-2xl border border-[#292932]">
                <div className="inline-flex p-4 rounded-2xl bg-[#15151C] border border-[#292932] mb-4 text-[#E50914]">
                  {watchingTypeFilter === "tv" ? <Tv className="w-8 h-8" /> : <FilmIcon className="w-8 h-8" />}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  No {watchingTypeFilter === "tv" ? "TV Series" : "Movies"} in progress
                </h3>
                <p className="text-[#A1A1AA] text-sm max-w-sm mx-auto mb-6">
                  You have other titles currently watching, but none matching this filter.
                </p>
                <button
                  onClick={() => setWatchingTypeFilter("all")}
                  className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#FF3B3B] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                  Show All ({watching.length})
                </button>
              </div>
            )
          ) : (
            /* Clean Empty State when zero titles are in Currently Watching */
            <div className="glass-card p-8 sm:p-12 text-center rounded-2xl border border-[#292932] relative overflow-hidden my-4">
              <div className="relative z-10 max-w-md mx-auto">
                <div className="inline-flex p-4 rounded-2xl bg-[#15151C] border border-[#292932] mb-4 animate-float text-[#E50914]">
                  <Play className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 text-glow">
                  No Shows or Movies In Progress
                </h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">
                  Start watching something new or open your &ldquo;To Watch&rdquo; backlog from the burger menu.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-[#FF3B3B] text-white rounded-xl text-sm font-semibold shadow-md shadow-black/40 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add What You&apos;re Watching
                  </button>

                  {toWatch.length > 0 && (
                    <button
                      onClick={() => setActiveNav("toWatch")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#15151C] hover:bg-[#1E1E26] text-[#F5F5F5] border border-[#292932] text-sm font-semibold transition-all cursor-pointer"
                    >
                      <BookmarkPlus className="w-4 h-4 text-[#E50914]" />
                      Browse Backlog ({toWatch.length})
                    </button>
                  )}

                  <button
                    onClick={() => setIsBurgerMenuOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white text-sm font-medium transition-all cursor-pointer"
                  >
                    <Menu className="w-4 h-4 text-[#A1A1AA]" />
                    Open Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ── View 2: TO WATCH BACKLOG (From Burger Bar) ───────────── */}
      {activeNav === "toWatch" && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <TopReturnBanner
            title="To Watch Backlog"
            subtitle="Your wishlist of movies and TV series waiting to be watched"
            icon={<BookmarkPlus className="w-4 h-4 text-amber-400" />}
            accentBorderColor="border-t-2 border-t-amber-500/70"
            accentBgGlow="bg-amber-500"
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />
          <ToWatchShelf entries={toWatch} />
        </main>
      )}

      {/* ── View 3: WATCHED ARCHIVE & REVIEWS (From Burger Bar) ──── */}
      {activeNav === "watched" && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <TopReturnBanner
            title="Watched Archive &amp; Reviews"
            subtitle={`${watchedMovies.length} ${watchedMovies.length === 1 ? "movie" : "movies"} and ${watchedSeries.length} completed TV ${watchedSeries.length === 1 ? "series" : "series"} (${watched.length} total)`}
            icon={<Award className="w-4 h-4 text-emerald-400" />}
            accentBorderColor="border-t-2 border-t-emerald-500/70"
            accentBgGlow="bg-emerald-500"
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />
          <WatchedShelf entries={watched} />
        </main>
      )}

      {/* ── View 4: ALL MOVIES (From Burger Bar - Watched Only) ───── */}
      {activeNav === "movies" && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          <TopReturnBanner
            title="All Movies"
            subtitle={`${watchedMovies.length} watched ${watchedMovies.length === 1 ? "movie" : "movies"} in your journal archive`}
            icon={<FilmIcon className="w-4 h-4 text-indigo-400" />}
            accentBorderColor="border-t-2 border-t-indigo-500/70"
            accentBgGlow="bg-indigo-500"
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />

          {watchedMovies.length > 0 ? (
            <WatchedShelf entries={watchedMovies} defaultMediaType="movie" hideMediaTypeFilter />
          ) : (
            <EmptySection
              icon={<FilmIcon className="w-10 h-10 text-indigo-400/40" />}
              title="No watched movies yet"
              subtitle="Mark a movie as watched to add it to your movie archive."
              onAdd={() => setIsSearchOpen(true)}
            />
          )}
        </main>
      )}

      {/* ── View 5: ALL TV SERIES (From Burger Bar - Watched Only) ─── */}
      {activeNav === "series" && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          <TopReturnBanner
            title="All TV Series"
            subtitle={`${watchedSeries.length} completed TV ${watchedSeries.length === 1 ? "series" : "series"} in your journal archive`}
            icon={<Tv className="w-4 h-4 text-purple-400" />}
            accentBorderColor="border-t-2 border-t-purple-500/70"
            accentBgGlow="bg-purple-500"
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />

          {watchedSeries.length > 0 ? (
            <WatchedShelf entries={watchedSeries} defaultMediaType="tv" hideMediaTypeFilter />
          ) : (
            <EmptySection
              icon={<Tv className="w-10 h-10 text-purple-400/40" />}
              title="No completed TV series yet"
              subtitle="Mark a TV series as completed or watched to add it to your series archive."
              onAdd={() => setIsSearchOpen(true)}
            />
          )}
        </main>
      )}

      {/* ── View 6: BROWSE BY GENRE (From Burger Bar) ──────────────── */}
      {activeNav === "genres" && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <TopReturnBanner
            title="Browse by Genre"
            subtitle={`Explore ${entries.length} titles across ${allGenres.length} genres with watch time tracking`}
            icon={<Tags className="w-4 h-4 text-orange-400" />}
            accentBorderColor="border-t-2 border-t-orange-500/70"
            accentBgGlow="bg-orange-500"
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />

          {/* Genre Runtime Stats Banner */}
          <div className="glass-card p-5 rounded-2xl border border-[#292932] bg-[#15151C]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Tags className="w-4 h-4 text-orange-400" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] font-mono">
                    {selectedGenre === "all" ? "All Genres Combined" : `${selectedGenre} Overview`}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {selectedGenre === "all" ? "Total Watch Time" : `${selectedGenre} Watch Time`}
                </h3>
              </div>

              {/* Stats Grid: Overall in Days & Hours, Series in Hours, Movies in Hours */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 rounded-xl bg-[#0B0B0F] border border-orange-500/20 shadow-sm">
                  <p className="text-[10px] text-orange-400/90 font-medium uppercase tracking-wider">Overall Time</p>
                  <p className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">
                    {formatDaysAndHours(selectedGenreStats.totalMins)}
                  </p>
                  <span className="text-[9px] text-[#A1A1AA]">days &amp; hours</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0B0F] border border-purple-500/20 shadow-sm">
                  <p className="text-[10px] text-purple-400/90 font-medium uppercase tracking-wider">Series Time</p>
                  <p className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">
                    {formatHours(selectedGenreStats.seriesMins)}
                  </p>
                  <span className="text-[9px] text-[#A1A1AA]">in hours</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B0B0F] border border-indigo-500/20 shadow-sm">
                  <p className="text-[10px] text-indigo-400/90 font-medium uppercase tracking-wider">Movie Time</p>
                  <p className="text-sm sm:text-base font-bold text-white font-mono mt-0.5">
                    {formatHours(selectedGenreStats.movieMins)}
                  </p>
                  <span className="text-[9px] text-[#A1A1AA]">in hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Genre Selection Filter Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
                Select Genre ({allGenres.length})
              </span>
              {selectedGenre !== "all" && (
                <button
                  onClick={() => setSelectedGenre("all")}
                  className="text-xs text-orange-400/80 hover:text-orange-300 transition-colors flex items-center gap-1 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-orange-400" /> Reset to All
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedGenre === "all"
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/40 border border-orange-400/50 scale-105"
                    : "bg-[#15151C] text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#1E1E26] border border-[#292932]"
                }`}
              >
                <span>All Genres</span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/40 font-mono">
                  {entries.length}
                </span>
              </button>

              {allGenres.map(({ genre, count }) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedGenre === genre
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/40 border border-orange-400/50 scale-105"
                      : "bg-[#15151C] text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#1E1E26] border border-[#292932]"
                  }`}
                >
                  <span>{genre}</span>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/40 font-mono">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Shelf Sub-Filter (All, Watching, To Watch, Watched) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#292932]">
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#15151C] border border-[#292932]">
              <button
                onClick={() => setGenreShelfFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  genreShelfFilter === "all"
                    ? "bg-[#292932] text-white font-semibold shadow-sm border border-white/10"
                    : "text-[#A1A1AA] hover:text-[#F5F5F5]"
                }`}
              >
                All Shelves ({genreFilteredEntries.length})
              </button>
              <button
                onClick={() => setGenreShelfFilter("watching")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  genreShelfFilter === "watching"
                    ? "bg-gradient-to-r from-[#E50914] to-[#C10711] text-white font-semibold shadow-sm border border-red-500/40"
                    : "text-[#A1A1AA] hover:text-[#F5F5F5]"
                }`}
              >
                <Play className="w-3 h-3 fill-current text-red-300" />
                Watching ({genreFilteredEntries.filter((e) => e.shelf === "watching").length})
              </button>
              <button
                onClick={() => setGenreShelfFilter("toWatch")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  genreShelfFilter === "toWatch"
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold shadow-sm border border-amber-400/40"
                    : "text-[#A1A1AA] hover:text-[#F5F5F5]"
                }`}
              >
                <BookmarkPlus className="w-3 h-3 text-amber-300" />
                To Watch ({genreFilteredEntries.filter((e) => e.shelf === "toWatch").length})
              </button>
              <button
                onClick={() => setGenreShelfFilter("watched")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  genreShelfFilter === "watched"
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold shadow-sm border border-emerald-400/40"
                    : "text-[#A1A1AA] hover:text-[#F5F5F5]"
                }`}
              >
                <Award className="w-3 h-3 text-emerald-300" />
                Watched ({genreFilteredEntries.filter((e) => e.shelf === "watched").length})
              </button>
            </div>

            <span className="text-xs text-[#A1A1AA] font-mono">
              Showing {displayedGenreEntries.length} {displayedGenreEntries.length === 1 ? "title" : "titles"}
            </span>
          </div>

          {/* Titles Grid or Empty State */}
          {displayedGenreEntries.length > 0 ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
              {displayedGenreEntries.map((entry, idx) => (
                <PosterCard
                  key={entry.id}
                  entry={entry}
                  index={idx}
                  showShelfBadge
                  showRating={entry.shelf === "watched"}
                  onClick={() => setSelectedDetailEntry(entry)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-card rounded-2xl border border-[#292932]">
              <Tags className="w-12 h-12 text-[#A1A1AA] mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">
                No titles found in {selectedGenre === "all" ? "this filter" : `"${selectedGenre}"`}
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1 max-w-sm mx-auto">
                Try switching the shelf filter or selecting another genre from the tags above.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setSelectedGenre("all");
                    setGenreShelfFilter("all");
                  }}
                  className="px-4 py-2 bg-[#15151C] hover:bg-[#1E1E26] border border-[#292932] text-[#A1A1AA] hover:text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="px-4 py-2 bg-[#E50914] hover:bg-[#FF3B3B] text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-black/40 cursor-pointer"
                >
                  Add Title
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ── View 7: WATCH ANALYTICS (From Burger Bar) ────────────── */}
      {activeNav === "stats" && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <TopReturnBanner
            title="Watch Analytics"
            subtitle="Consumption metrics, individual movie vs series minutes, and genre distribution"
            icon={<BarChart3 className="w-4 h-4 text-cyan-400" />}
            accentBorderColor="border-t-2 border-t-cyan-500/70"
            accentBgGlow="bg-cyan-500"
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />
          <AnalyticsDashboard entries={entries} />
        </main>
      )}

      {/* ── View 7: MY JOURNEY (From Burger Bar) ─────────────────── */}
      {activeNav === "journey" && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <TopReturnBanner
            title="My Journey"
            subtitle="A timeline of the stories experienced across the years"
            icon={<MapIcon className="w-4 h-4 text-yellow-400" />}
            accentBorderColor="border-t-2 border-t-yellow-500/70"
            accentBgGlow="bg-yellow-500"
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />

          {journeyYears.length > 0 ? (
            <div className="space-y-8">
              {journeyYears.map(([year, yearEntries]) => (
                <div key={year} className="glass-card p-6 rounded-2xl border border-[#292932]">
                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="text-3xl font-bold text-white font-mono">{year}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#292932] to-transparent" />
                    <span className="text-xs text-[#A1A1AA] font-mono">
                      {yearEntries.length} {yearEntries.length === 1 ? "title" : "titles"}
                    </span>
                  </div>
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
                    {yearEntries.map((entry, idx) => (
                      <PosterCard
                        key={entry.id}
                        entry={entry}
                        index={idx}
                        showRating
                        onClick={() => setSelectedDetailEntry(entry)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptySection
              icon={<MapIcon className="w-10 h-10 text-yellow-400/40" />}
              title="No journey entries yet"
              subtitle="Mark movies and series as watched to populate your journey timeline."
              onAdd={() => setIsSearchOpen(true)}
            />
          )}
        </main>
      )}

      {/* ── View 8: FAVORITES (From Burger Bar) ──────────────────── */}
      {activeNav === "favorites" && (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <TopReturnBanner
            title="My Favorites"
            subtitle="Films and shows you rated 8/10 or higher"
            icon={<Heart className="w-4 h-4 text-rose-400 fill-rose-500/30" />}
            accentBorderColor="border-t-2 border-t-rose-500/70"
            accentBgGlow="bg-rose-500"
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />

          {favorites.length > 0 ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {favorites.map((entry, idx) => (
                <PosterCard
                  key={entry.id}
                  entry={entry}
                  index={idx}
                  showRating
                  onClick={() => setSelectedDetailEntry(entry)}
                />
              ))}
            </div>
          ) : (
            <EmptySection
              icon={<Heart className="w-10 h-10 text-rose-400/40" />}
              title="No favorites yet"
              subtitle="Rate movies and shows 8/10 or higher to bookmark them in your favorites."
              onAdd={() => setIsSearchOpen(true)}
            />
          )}
        </main>
      )}

      {/* ── Floating Action Button (Mobile) ──────────────────────── */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="fixed bottom-6 right-6 sm:hidden p-4 bg-[#E50914] hover:bg-[#FF3B3B] text-white rounded-2xl shadow-2xl shadow-black/60 transition-all z-30 cursor-pointer active:scale-95"
        aria-label="Add title"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ── Search Modal ────────────────────────────────────────── */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        defaultShelf={activeNav === "toWatch" ? "toWatch" : "watching"}
      />

      {/* ── Auth Modal ──────────────────────────────────────────── */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* ── Media Detail Modal ──────────────────────────────────── */}
      <MediaDetailModal
        entry={
          selectedDetailEntry
            ? entries.find((e) => e.id === selectedDetailEntry.id) ??
              entries.find(
                (e) =>
                  e.tmdb?.tmdbId &&
                  selectedDetailEntry.tmdb?.tmdbId &&
                  e.tmdb.tmdbId === selectedDetailEntry.tmdb.tmdbId &&
                  e.tmdb.mediaType === selectedDetailEntry.tmdb.mediaType
              ) ??
              selectedDetailEntry
            : null
        }
        isOpen={!!selectedDetailEntry}
        onClose={() => setSelectedDetailEntry(null)}
      />

      {/* ── Marquee Choosing Panel Modal ──────────────────────────── */}
      <ChoosingPanelModal
        item={selectedChoosingItem}
        isOpen={!!selectedChoosingItem}
        onClose={() => setSelectedChoosingItem(null)}
        onOpenFullDetail={(entry) => setSelectedDetailEntry(entry)}
      />
    </div>
  );
}

/* ─── Top Return Banner (Shown when viewing non-watching shelves) ─────────── */
function TopReturnBanner({
  title,
  subtitle,
  icon,
  accentBorderColor = "border-t-2 border-t-[#E50914]",
  accentBgGlow = "",
  watchingCount,
  onBackToWatching,
  onOpenMenu,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  accentBorderColor?: string;
  accentBgGlow?: string;
  watchingCount: number;
  onBackToWatching: () => void;
  onOpenMenu?: () => void;
}) {
  return (
    <div className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl liquid-glass-card ${accentBorderColor} overflow-hidden`}>
      {accentBgGlow && (
        <div className={`absolute top-0 left-0 w-96 h-32 pointer-events-none blur-3xl opacity-15 ${accentBgGlow}`} />
      )}
      <div className="relative z-10 flex items-center gap-3.5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 shadow-sm">{icon}</div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h2>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1">{subtitle}</p>
        </div>
      </div>

      <button
        onClick={onBackToWatching}
        className="relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white hover:text-white border border-white/10 text-xs font-semibold rounded-xl backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer shrink-0 shadow-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#E50914]" />
        <span>Back to Currently Watching</span>
        {watchingCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-md bg-[#E50914]/20 text-[#E50914] text-[10px] font-bold">
            {watchingCount}
          </span>
        )}
      </button>
    </div>
  );
}

/* ─── Poster Card Component (Interactive & Clickable) ─────────────────────── */
function PosterCard({
  entry,
  index,
  showRating = false,
  showShelfBadge = false,
  onClick,
}: {
  key?: string | number;
  entry: MovieEntry;
  index: number;
  showRating?: boolean;
  showShelfBadge?: boolean;
  onClick?: () => void;
}) {
  const isTV = entry.tmdb.mediaType === "tv";

  return (
    <div
      onClick={onClick}
      className="poster-card group stagger-item cursor-pointer hover:scale-[1.03] transition-all"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="poster-card-image relative overflow-hidden bg-stone-900">
        <MovieImage
          src={entry.tmdb.posterUrl}
          alt={entry.tmdb.title}
          title={entry.tmdb.title}
          mediaType={entry.tmdb.mediaType}
          className="w-full h-full object-cover transition-transform duration-300"
          fallbackIconClassName="w-8 h-8 text-stone-700"
        />

        {/* Media type badge */}
        <div className="absolute top-1.5 left-1.5 z-10">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] text-[#A1A1AA] border border-white/10 uppercase tracking-wider font-semibold">
            {isTV ? "TV" : "Film"}
          </span>
        </div>

        {/* Optional Shelf badge */}
        {showShelfBadge && (
          <div className="absolute top-1.5 right-1.5 z-10">
            <span
              className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider backdrop-blur-sm border shadow-sm ${
                entry.shelf === "watching"
                  ? "bg-[#E50914] text-white border-[#E50914]"
                  : entry.shelf === "toWatch"
                  ? "bg-[#292932] text-[#F5F5F5] border-[#3D3D4C]"
                  : "bg-[#15151C] text-[#F5C542] border-[#292932]"
              }`}
            >
              {entry.shelf === "watching" ? "Watching" : entry.shelf === "toWatch" ? "To Watch" : "Watched"}
            </span>
          </div>
        )}

        {/* TV Series Episode Progress Bar */}
        {isTV && entry.shelf === "watching" && entry.progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-stone-950/80 z-10 border-t border-black/40">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    ((entry.progress.watchedEpisodes?.length || entry.progress.currentEpisode || 0) /
                      (entry.progress.totalEpisodes || entry.tmdb.totalEpisodes || 10)) *
                      100
                  )
                )}%`,
              }}
            />
          </div>
        )}

        {/* Hover overlay with click prompt */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
          <span className="text-[10px] text-[#A1A1AA] font-medium">Click for details</span>
        </div>
      </div>
      <div className="poster-card-info p-2">
        <p className="text-xs font-medium text-white truncate group-hover:text-[#F5F5F5] transition-colors">
          {entry.tmdb.title}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1.5 text-[10px] text-[#A1A1AA]">
            <span>{entry.tmdb.releaseYear}</span>
            {entry.tmdb.runtime ? (
              <>
                <span>•</span>
                <span className="text-[#A1A1AA] font-mono text-[9px]">{formatHours(entry.tmdb.runtime)}</span>
              </>
            ) : null}
          </div>
          {showRating && entry.review?.rating ? (
            <span className="flex items-center gap-0.5 text-[10px] text-[#F5C542] font-semibold">
              <Star className="w-2.5 h-2.5 fill-[#F5C542] text-[#F5C542]" />
              {entry.review.rating}
            </span>
          ) : isTV && entry.progress?.currentEpisode ? (
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">
              Ep {entry.progress.currentEpisode}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ─── Empty Section ──────────────────────────────────────────────────────── */
function EmptySection({
  icon,
  title,
  subtitle,
  onAdd,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onAdd: () => void;
}) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex p-4 rounded-2xl bg-[#15151C] border border-[#292932] mb-4 text-[#E50914]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-[#A1A1AA] mt-2 text-sm max-w-sm mx-auto">{subtitle}</p>
      <button
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-[#FF3B3B] text-white text-sm rounded-xl transition-all shadow-md shadow-black/40 font-medium cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Title
      </button>
    </div>
  );
}
