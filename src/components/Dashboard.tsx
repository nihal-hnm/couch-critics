/**
 * =============================================================================
 * Main Dashboard — Currently Watching Focus with Burger Bar Menu Drawer
 * =============================================================================
 *
 * Features:
 *  - Main View: Exclusively focused on Currently Watching shows & movies
 *    with interactive episode-wise checklists, progress steppers, and filter pills.
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

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
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
  Map,
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
import ThemeToggle from "@/components/ThemeToggle";
import { computeStats, formatWatchTime } from "@/lib/stats";

export type NavKey =
  | "watching"
  | "toWatch"
  | "watched"
  | "movies"
  | "series"
  | "stats"
  | "journey"
  | "favorites";

export default function Dashboard() {
  const { entries, isLoaded } = useJournal();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [activeNav, setActiveNav] = useState<NavKey>("watching");
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [watchingTypeFilter, setWatchingTypeFilter] = useState<"all" | "tv" | "movie">("all");
  const [selectedDetailEntry, setSelectedDetailEntry] = useState<MovieEntry | null>(null);

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

  const filteredWatching = useMemo(() => {
    if (watchingTypeFilter === "tv") return watchingSeries;
    if (watchingTypeFilter === "movie") return watchingMovies;
    return watching;
  }, [watching, watchingTypeFilter, watchingSeries, watchingMovies]);

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

  // Hero backdrop posters — collect up to 8 posters for the poster wall
  const heroPosterUrls = useMemo(() => {
    const withPosters = entries.filter((e) => e.tmdb.posterUrl);
    const shuffled = [...withPosters].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8).map((e) => e.tmdb.posterUrl!);
  }, [entries]);

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
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#12100e] border-r border-amber-500/20 z-50 flex flex-col shadow-2xl shadow-black/90 transform transition-transform duration-300 ease-out ${
          isBurgerMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Side Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <FilmIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                COUCH CRITICS
              </h2>
              <p className="text-[10px] text-amber-400/80 tracking-widest uppercase">
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
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeNav === "watching"
                  ? "bg-gradient-to-r from-amber-500/25 to-orange-500/15 text-amber-200 border border-amber-500/30 shadow-lg shadow-amber-500/10"
                  : "text-stone-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <span className="text-left">Currently Watching</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "toWatch"
                    ? "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookmarkPlus className="w-4 h-4 text-blue-400" />
                  <span>To Watch (Backlog)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-stone-800 text-stone-400">
                  {toWatch.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("watched");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "watched"
                    ? "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Watched Archive</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-stone-800 text-stone-400">
                  {watched.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("movies");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "movies"
                    ? "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FilmIcon className="w-4 h-4 text-amber-400" />
                  <span>All Movies</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-stone-800 text-stone-400">
                  {movies.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("series");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "series"
                    ? "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Tv className="w-4 h-4 text-orange-400" />
                  <span>All TV Series</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-stone-800 text-stone-400">
                  {series.length}
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "stats"
                    ? "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span>Watch Analytics</span>
                </div>
                <span className="text-[10px] text-amber-400/80 font-mono">
                  {stats.totalWatchTimeMins > 0 ? `${Math.round(stats.totalWatchTimeMins / 60)}h` : "0h"}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("favorites");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "favorites"
                    ? "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>My Favorites</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-stone-800 text-stone-400">
                  {favorites.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("journey");
                  setIsBurgerMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeNav === "journey"
                    ? "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Map className="w-4 h-4 text-emerald-400" />
                  <span>My Journey</span>
                </div>
                <span className="text-[10px] text-stone-500">
                  {journeyYears.length} {journeyYears.length === 1 ? "year" : "years"}
                </span>
              </button>
            </div>
          </div>

          {/* Theme / Appearance Toggle */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
              <span>Appearance</span>
              <span className="text-[10px] font-medium text-amber-500 uppercase">Theme</span>
            </div>
            <div className="px-1">
              <ThemeToggle variant="segmented" />
            </div>
          </div>
        </div>

        {/* Drawer Footer with Quick Watch Stats & Auth */}
        <div className="p-4 border-t border-white/10 bg-black/60 space-y-3">
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-stone-400">Total Watch Time</span>
              <span className="font-bold text-amber-300">{formatWatchTime(stats.totalWatchTimeMins)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span>🎬 Movies: {stats.movieMinutes.toLocaleString()}m</span>
              <span>📺 Series: {stats.seriesMinutes.toLocaleString()}m</span>
            </div>
          </div>

          {!authLoading && (
            user ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs text-stone-300 truncate max-w-[170px]">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[11px] shrink-0">
                    {userInitial}
                  </div>
                  <span className="truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-stone-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsBurgerMenuOpen(false);
                  setIsAuthOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In / Register
              </button>
            )
          )}
        </div>
      </aside>

      {/* ══ HERO & HEADER SECTION ══════════════════════════════════ */}
      <div ref={heroRef} className="relative overflow-hidden min-h-[320px] pb-6">
        {/* Poster wall backdrop */}
        {heroPosterUrls.length > 0 ? (
          <div className="absolute inset-0">
            <div className="poster-wall-grid">
              {heroPosterUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ))}
            </div>
            <div className="absolute inset-0 hero-overlay-bottom" />
            <div className="absolute inset-0 hero-overlay-side" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1510] via-[#0a0a0a] to-[#0a0a0a] light:from-[#eeeae0] light:via-[#f7f5f0] light:to-[#f7f5f0]" />
        )}

        {/* Ambient warm glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Burger Menu Button */}
              <button
                onClick={() => setIsBurgerMenuOpen(true)}
                className="p-2 sm:px-3 sm:py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-white transition-all flex items-center gap-2 group shadow-lg shadow-amber-500/10 cursor-pointer"
                aria-label="Open navigation menu"
                id="burger-menu-button"
                title="Open Menu: Backlog, Watched, Catalogs & Stats"
              >
                <Menu className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline text-amber-300 group-hover:text-amber-200">
                  Menu
                </span>
              </button>

              {/* Logo / Brand */}
              <div
                onClick={() => setActiveNav("watching")}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/20 shadow-lg shadow-amber-500/5 group-hover:border-amber-500/40 transition-colors">
                  <FilmIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-wider uppercase font-mono group-hover:text-amber-300 transition-colors">
                    COUCH CRITICS
                  </h1>
                  <p className="text-[10px] text-amber-400/80 font-medium tracking-widest uppercase">
                    {activeNav === "watching"
                      ? "Currently Watching"
                      : activeNav === "toWatch"
                      ? "To Watch Backlog"
                      : activeNav === "watched"
                      ? "Watched Archive"
                      : activeNav === "movies"
                      ? "Movies Catalog"
                      : activeNav === "series"
                      ? "Series Catalog"
                      : activeNav === "stats"
                      ? "Watch Analytics"
                      : activeNav === "journey"
                      ? "My Journey"
                      : "Favorites"}
                  </p>
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Light / Dark Mode Toggle */}
              <ThemeToggle variant="button" />

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-xl glass-card text-stone-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Search movies and series"
                title="Search TMDB"
              >
                <SearchIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 font-semibold cursor-pointer"
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
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="login-btn cursor-pointer"
                    id="login-button"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )
              )}
            </div>
          </div>
        </header>

        {/* ── Main Hero Content (Focused on Currently Watching) ── */}
        {activeNav === "watching" && (
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    In Progress
                  </span>
                  <span className="text-xs text-stone-500">
                    &bull; {watching.length} {watching.length === 1 ? "title" : "titles"}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-glow tracking-tight">
                  Currently Watching
                </h2>
                <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-lg">
                  Track series episode by episode, log movie minutes, and keep your screen in sync.
                </p>
              </div>

              {/* Quick Runtime Metrics Banner */}
              {watching.length > 0 && (
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="glass-card px-3.5 py-2 border border-amber-500/20 flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                      <Tv className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono">
                        {stats.seriesMinutes.toLocaleString()}m
                      </div>
                      <div className="text-[10px] text-stone-500">Series Time</div>
                    </div>
                  </div>

                  <div className="glass-card px-3.5 py-2 border border-amber-500/20 flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                      <FilmIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-mono">
                        {stats.movieMinutes.toLocaleString()}m
                      </div>
                      <div className="text-[10px] text-stone-500">Movie Time</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBurgerMenuOpen(true)}
                    className="glass-card px-3 py-2 border border-amber-500/20 hover:border-amber-500/40 text-xs text-amber-300/80 hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Open Burger Menu for more shelves"
                  >
                    <span>More Shelves</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Filter Pills for Currently Watching: All | Series | Movies */}
            {watching.length > 0 && (
              <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 hide-scrollbar">
                <button
                  onClick={() => setWatchingTypeFilter("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    watchingTypeFilter === "all"
                      ? "bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm shadow-amber-500/10"
                      : "text-stone-400 hover:text-stone-200 bg-white/5 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>All In Progress ({watching.length})</span>
                </button>

                <button
                  onClick={() => setWatchingTypeFilter("tv")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    watchingTypeFilter === "tv"
                      ? "bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm shadow-amber-500/10"
                      : "text-stone-400 hover:text-stone-200 bg-white/5 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  <Tv className="w-3 h-3" />
                  <span>TV Series ({watchingSeries.length})</span>
                </button>

                <button
                  onClick={() => setWatchingTypeFilter("movie")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    watchingTypeFilter === "movie"
                      ? "bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm shadow-amber-500/10"
                      : "text-stone-400 hover:text-stone-200 bg-white/5 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  <FilmIcon className="w-3 h-3" />
                  <span>Movies ({watchingMovies.length})</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ MAIN CONTENT VIEWS ══════════════════════════════════════ */}

      {/* ── View 1: CURRENTLY WATCHING (Primary Home Screen) ─────── */}
      {activeNav === "watching" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
          {watching.length > 0 ? (
            filteredWatching.length > 0 ? (
              <WatchingShelf entries={filteredWatching} />
            ) : (
              <div className="glass-card p-12 text-center rounded-2xl border border-amber-500/20">
                <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 mb-4 text-amber-400">
                  {watchingTypeFilter === "tv" ? <Tv className="w-8 h-8" /> : <FilmIcon className="w-8 h-8" />}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  No {watchingTypeFilter === "tv" ? "TV Series" : "Movies"} in progress
                </h3>
                <p className="text-stone-400 text-sm max-w-sm mx-auto mb-6">
                  You have other titles currently watching, but none matching this filter.
                </p>
                <button
                  onClick={() => setWatchingTypeFilter("all")}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold border border-amber-500/30 transition-all cursor-pointer"
                >
                  Show All ({watching.length})
                </button>
              </div>
            )
          ) : (
            /* Clean Empty State when zero titles are in Currently Watching */
            <div className="glass-card p-8 sm:p-12 text-center rounded-2xl border border-amber-500/20 relative overflow-hidden my-4">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[200px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10 max-w-md mx-auto">
                <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 mb-4 animate-float text-amber-400">
                  <Play className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 text-glow">
                  No Shows or Movies In Progress
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                  Start watching something new or open your &ldquo;To Watch&rdquo; backlog from the burger menu.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add What You&apos;re Watching
                  </button>

                  {toWatch.length > 0 && (
                    <button
                      onClick={() => setActiveNav("toWatch")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 text-stone-200 border border-stone-700 text-sm font-semibold transition-all cursor-pointer"
                    >
                      <BookmarkPlus className="w-4 h-4 text-blue-400" />
                      Browse Backlog ({toWatch.length})
                    </button>
                  )}

                  <button
                    onClick={() => setIsBurgerMenuOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-sm font-medium transition-all cursor-pointer"
                  >
                    <Menu className="w-4 h-4 text-amber-400" />
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
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <TopReturnBanner
            title="To Watch Backlog"
            subtitle="Your wishlist of movies and TV series waiting to be watched"
            icon={<BookmarkPlus className="w-4 h-4 text-blue-400" />}
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />
          <ToWatchShelf entries={toWatch} />
        </main>
      )}

      {/* ── View 3: WATCHED ARCHIVE & REVIEWS (From Burger Bar) ──── */}
      {activeNav === "watched" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <TopReturnBanner
            title="Watched Archive &amp; Reviews"
            subtitle="Your complete history of finished movies, seasons, ratings, and notes"
            icon={<Award className="w-4 h-4 text-emerald-400" />}
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />
          <WatchedShelf entries={watched} />
        </main>
      )}

      {/* ── View 4: ALL MOVIES (From Burger Bar) ─────────────────── */}
      {activeNav === "movies" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
          <TopReturnBanner
            title="All Movies"
            subtitle={`Catalog of ${movies.length} films across in-progress, backlog, and watched`}
            icon={<FilmIcon className="w-4 h-4 text-amber-400" />}
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />

          {movies.length > 0 ? (
            <div className="space-y-8">
              {watchingMovies.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-amber-400/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Play className="w-3.5 h-3.5" /> Movies In Progress ({watchingMovies.length})
                  </h3>
                  <WatchingShelf entries={watchingMovies} />
                </section>
              )}

              {toWatch.filter((e) => e.tmdb.mediaType === "movie").length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-amber-400/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookmarkPlus className="w-3.5 h-3.5" /> Movies To Watch ({toWatch.filter((e) => e.tmdb.mediaType === "movie").length})
                  </h3>
                  <ToWatchShelf entries={toWatch.filter((e) => e.tmdb.mediaType === "movie")} />
                </section>
              )}

              {watched.filter((e) => e.tmdb.mediaType === "movie").length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-amber-400/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" /> Watched Movies ({watched.filter((e) => e.tmdb.mediaType === "movie").length})
                  </h3>
                  <WatchedShelf entries={watched.filter((e) => e.tmdb.mediaType === "movie")} />
                </section>
              )}
            </div>
          ) : (
            <EmptySection
              icon={<FilmIcon className="w-10 h-10 text-amber-500/40" />}
              title="No movies yet"
              subtitle="Add a movie to your journal to get started."
              onAdd={() => setIsSearchOpen(true)}
            />
          )}
        </main>
      )}

      {/* ── View 5: ALL TV SERIES (From Burger Bar) ──────────────── */}
      {activeNav === "series" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
          <TopReturnBanner
            title="All TV Series"
            subtitle={`Catalog of ${series.length} shows with episode checklists`}
            icon={<Tv className="w-4 h-4 text-orange-400" />}
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />

          {series.length > 0 ? (
            <div className="space-y-8">
              {watchingSeries.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-amber-400/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Play className="w-3.5 h-3.5" /> Series In Progress ({watchingSeries.length})
                  </h3>
                  <WatchingShelf entries={watchingSeries} />
                </section>
              )}

              {toWatch.filter((e) => e.tmdb.mediaType === "tv").length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-amber-400/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookmarkPlus className="w-3.5 h-3.5" /> Series To Watch ({toWatch.filter((e) => e.tmdb.mediaType === "tv").length})
                  </h3>
                  <ToWatchShelf entries={toWatch.filter((e) => e.tmdb.mediaType === "tv")} />
                </section>
              )}

              {watched.filter((e) => e.tmdb.mediaType === "tv").length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-amber-400/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" /> Completed Series ({watched.filter((e) => e.tmdb.mediaType === "tv").length})
                  </h3>
                  <WatchedShelf entries={watched.filter((e) => e.tmdb.mediaType === "tv")} />
                </section>
              )}
            </div>
          ) : (
            <EmptySection
              icon={<Tv className="w-10 h-10 text-amber-500/40" />}
              title="No TV series yet"
              subtitle="Add a TV show to track episodes and progress."
              onAdd={() => setIsSearchOpen(true)}
            />
          )}
        </main>
      )}

      {/* ── View 6: WATCH ANALYTICS (From Burger Bar) ────────────── */}
      {activeNav === "stats" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <TopReturnBanner
            title="Watch Analytics"
            subtitle="Consumption metrics, individual movie vs series minutes, and genre distribution"
            icon={<BarChart3 className="w-4 h-4 text-purple-400" />}
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />
          <AnalyticsDashboard entries={entries} />
        </main>
      )}

      {/* ── View 7: MY JOURNEY (From Burger Bar) ─────────────────── */}
      {activeNav === "journey" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <TopReturnBanner
            title="My Journey"
            subtitle="A timeline of the stories experienced across the years"
            icon={<Map className="w-4 h-4 text-emerald-400" />}
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />

          {journeyYears.length > 0 ? (
            <div className="space-y-8">
              {journeyYears.map(([year, yearEntries]) => (
                <div key={year} className="glass-card p-6 rounded-2xl border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="text-3xl font-bold text-white font-mono">{year}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-amber-500/30 to-transparent" />
                    <span className="text-xs text-stone-400 font-mono">
                      {yearEntries.length} {yearEntries.length === 1 ? "title" : "titles"}
                    </span>
                  </div>
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
              icon={<Map className="w-10 h-10 text-amber-500/40" />}
              title="No journey entries yet"
              subtitle="Mark movies and series as watched to populate your journey timeline."
              onAdd={() => setIsSearchOpen(true)}
            />
          )}
        </main>
      )}

      {/* ── View 8: FAVORITES (From Burger Bar) ──────────────────── */}
      {activeNav === "favorites" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <TopReturnBanner
            title="My Favorites"
            subtitle="Films and shows you rated 8/10 or higher"
            icon={<Heart className="w-4 h-4 text-rose-400" />}
            watchingCount={watching.length}
            onBackToWatching={() => setActiveNav("watching")}
            onOpenMenu={() => setIsBurgerMenuOpen(true)}
          />

          {favorites.length > 0 ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
              icon={<Heart className="w-10 h-10 text-amber-500/40" />}
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
        className="fixed bottom-6 right-6 sm:hidden p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all z-30 animate-glow cursor-pointer"
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
    </div>
  );
}

/* ─── Top Return Banner (Shown when viewing non-watching shelves) ─────────── */
function TopReturnBanner({
  title,
  subtitle,
  icon,
  watchingCount,
  onBackToWatching,
  onOpenMenu,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  watchingCount: number;
  onBackToWatching: () => void;
  onOpenMenu: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-stone-900/60 border border-amber-500/25 shadow-lg shadow-amber-500/5">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
          title="Open Burger Menu"
        >
          <Menu className="w-4 h-4" />
          <span className="hidden sm:inline">Menu</span>
        </button>
        <div>
          <div className="flex items-center gap-2">
            <div className="text-amber-400">{icon}</div>
            <h2 className="text-base sm:text-lg font-bold text-white">{title}</h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <button
        onClick={onBackToWatching}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>Back to Currently Watching ({watchingCount})</span>
      </button>
    </div>
  );
}

/* ─── Poster Card Component (Interactive & Clickable) ─────────────────────── */
function PosterCard({
  entry,
  index,
  showRating = false,
  onClick,
}: {
  entry: MovieEntry;
  index: number;
  showRating?: boolean;
  onClick?: () => void;
}) {
  const isTV = entry.tmdb.mediaType === "tv";

  return (
    <div
      onClick={onClick}
      className="poster-card group stagger-item cursor-pointer hover:scale-[1.03] transition-all"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="poster-card-image relative overflow-hidden">
        {entry.tmdb.posterUrl ? (
          <img
            src={entry.tmdb.posterUrl}
            alt={entry.tmdb.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
            {isTV ? <Tv className="w-8 h-8 text-stone-700" /> : <FilmIcon className="w-8 h-8 text-stone-700" />}
          </div>
        )}

        {/* Media type badge */}
        <div className="absolute top-1.5 left-1.5 z-10">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] text-stone-300 border border-white/10 uppercase tracking-wider font-semibold">
            {isTV ? "TV" : "Film"}
          </span>
        </div>

        {/* Hover overlay with click prompt */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
          <span className="text-[10px] text-amber-300 font-medium">Click for details</span>
        </div>
      </div>
      <div className="poster-card-info p-2">
        <p className="text-xs font-medium text-white truncate group-hover:text-amber-200 transition-colors">
          {entry.tmdb.title}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[10px] text-stone-500">
            {entry.tmdb.releaseYear}
          </span>
          {showRating && entry.review?.rating ? (
            <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-semibold">
              <Star className="w-2.5 h-2.5 fill-amber-400" />
              {entry.review.rating}
            </span>
          ) : isTV && entry.progress?.currentEpisode ? (
            <span className="text-[10px] text-amber-500/80 font-mono">
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
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onAdd: () => void;
}) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex p-4 rounded-2xl bg-amber-500/8 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-stone-300">{title}</h3>
      <p className="text-stone-500 mt-2 text-sm max-w-sm mx-auto">{subtitle}</p>
      <button
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm rounded-xl transition-all shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 font-medium cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Title
      </button>
    </div>
  );
}
