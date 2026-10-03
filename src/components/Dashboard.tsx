/**
 * =============================================================================
 * Main Dashboard — Cinematic Layout with Hero + Multi-Section Scroll
 * =============================================================================
 *
 * Redesigned to match the warm, cinematic reference UI:
 *  - Large hero section with movie poster wall backdrop
 *  - Bold stat cards in hero footer (Movies, Series, Minutes, Rating)
 *  - Horizontal nav: Home, Movies, Series, Stats, Journey, Favorites
 *  - Scroll-based single-page layout with distinct sections
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
} from "lucide-react";
import { useJournal } from "@/lib/journal-context";
import { useAuth } from "@/lib/auth-context";
import type { Shelf, MovieEntry } from "@/lib/types";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import WatchingShelf from "@/components/WatchingShelf";
import ToWatchShelf from "@/components/ToWatchShelf";
import WatchedShelf from "@/components/WatchedShelf";
import StatsDashboard from "@/components/StatsDashboard";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import MediaDetailModal from "@/components/MediaDetailModal";
import { computeStats, formatWatchTime } from "@/lib/stats";

type NavKey = "home" | "movies" | "series" | "stats" | "journey" | "favorites";

interface NavDef {
  key: NavKey;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavDef[] = [
  { key: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
  { key: "movies", label: "Movies", icon: <FilmIcon className="w-4 h-4" /> },
  { key: "series", label: "Series", icon: <Tv className="w-4 h-4" /> },
  { key: "stats", label: "Stats", icon: <BarChart3 className="w-4 h-4" /> },
  { key: "journey", label: "Journey", icon: <Map className="w-4 h-4" /> },
  { key: "favorites", label: "Favorites", icon: <Heart className="w-4 h-4" /> },
];

export default function Dashboard() {
  const { entries, isLoaded } = useJournal();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [activeNav, setActiveNav] = useState<NavKey>("home");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedDetailEntry, setSelectedDetailEntry] = useState<MovieEntry | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsUserMenuOpen(false);
    await signOut();
  }, [signOut]);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "?";

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
      .slice(0, 10);
  }, [watched]);

  // Featured movie: highest rated for the detail panel
  const featuredMovie = useMemo(() => {
    if (favorites.length > 0) return favorites[0];
    if (watched.length > 0) return watched[0];
    return null;
  }, [favorites, watched]);

  // Hero backdrop posters — collect up to 6 posters for the poster wall
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
      .slice(0, 4);
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
    <div className="min-h-screen">
      {/* ══ HERO SECTION ═══════════════════════════════════════════ */}
      <div ref={heroRef} className="relative overflow-hidden min-h-[420px]">
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
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-[#0a0a0a]/60 to-[#0a0a0a]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/60" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1510] via-[#0a0a0a] to-[#0a0a0a]" />
        )}

        {/* Ambient warm glow */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <FilmIcon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-wider uppercase font-mono">
                  COUCH CRITICS
                </h1>
                <p className="text-[10px] text-amber-400/80 font-medium tracking-widest uppercase">
                  Personal Watch Journal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-xl glass-card text-stone-400 hover:text-white transition-colors"
                aria-label="Search"
              >
                <SearchIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm rounded-xl transition-all shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 font-medium"
                id="add-movie-button"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Movie</span>
              </button>

              {/* Auth: Login button or User avatar menu */}
              {!authLoading && (
                user ? (
                  <div className="user-menu-wrapper" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="user-avatar-btn"
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
                          className="user-menu-item danger"
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
                    className="login-btn"
                    id="login-button"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )
              )}
            </div>
          </div>

          {/* ── Nav bar ──────────────────────────────────────── */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav
              className="flex gap-1 overflow-x-auto pb-1 hide-scrollbar"
              role="tablist"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  role="tab"
                  aria-selected={activeNav === item.key}
                  onClick={() => setActiveNav(item.key)}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap
                    transition-all duration-200
                    ${
                      activeNav === item.key
                        ? "bg-amber-500/15 text-amber-100 border border-amber-500/20"
                        : "text-stone-500 hover:text-stone-300 hover:bg-white/5"
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* ── Hero Content ───────────────────────────────────── */}
        {activeNav === "home" && (
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10">
            <p className="text-xs text-amber-400/80 uppercase tracking-widest mb-2 font-medium">
              Welcome to
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-glow mb-3 tracking-tight">
              COUCH CRITICS
            </h2>
            <p className="text-stone-300 max-w-md text-sm leading-relaxed mb-6">
              Your personal cinema &amp; TV journal. Track episodes, rate films,
              and uncover your viewing analytics.
              <br />
              <span className="text-stone-500 italic">
                &ldquo;Every movie and show you log becomes part of your story.&rdquo;
              </span>
            </p>

            {entries.length > 0 && (
              <button
                onClick={() => setActiveNav("journey")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-500/30 text-amber-200 text-sm hover:bg-amber-500/10 transition-all group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Explore My Journey
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* ── Stat Cards (Interactive & Clickable) ─────────── */}
            {entries.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-8">
                <div
                  onClick={() => setActiveNav("movies")}
                  className="hero-stat-card cursor-pointer hover:border-amber-500/40 hover:scale-[1.03] transition-all group"
                  title="View all movies"
                >
                  <div className="hero-stat-icon">
                    <FilmIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">{movies.length}</p>
                    <p className="text-xs text-stone-500">Movies &rarr;</p>
                  </div>
                </div>
                <div
                  onClick={() => setActiveNav("series")}
                  className="hero-stat-card cursor-pointer hover:border-amber-500/40 hover:scale-[1.03] transition-all group"
                  title="View all TV series"
                >
                  <div className="hero-stat-icon">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">{series.length}</p>
                    <p className="text-xs text-stone-500">Series &rarr;</p>
                  </div>
                </div>
                <div
                  onClick={() => setActiveNav("stats")}
                  className="hero-stat-card cursor-pointer hover:border-amber-500/40 hover:scale-[1.03] transition-all group"
                  title="View watch analytics"
                >
                  <div className="hero-stat-icon">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {stats.totalWatchTimeMins.toLocaleString()}
                    </p>
                    <p className="text-xs text-stone-500">Minutes Watched &rarr;</p>
                    <p className="text-[10px] text-amber-400/80 font-mono mt-0.5 whitespace-nowrap">
                      🎬 {stats.movieMinutes.toLocaleString()}m &bull; 📺 {stats.seriesMinutes.toLocaleString()}m
                    </p>
                  </div>
                </div>
                {stats.averageRating > 0 && (
                  <div
                    onClick={() => setActiveNav("stats")}
                    className="hero-stat-card cursor-pointer hover:border-amber-500/40 hover:scale-[1.03] transition-all group"
                    title="View rating statistics"
                  >
                    <div className="hero-stat-icon star">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        {stats.averageRating.toFixed(1)}
                      </p>
                      <p className="text-xs text-stone-500">Average Rating &rarr;</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ MAIN CONTENT ══════════════════════════════════════════ */}

      {/* ── Home View: Multi-section scroll ─────────────────────── */}
      {activeNav === "home" && entries.length > 0 && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">
          {/* My Collection — horizontal poster scroll */}
          {(watching.length > 0 || toWatch.length > 0) && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="section-icon">
                    <FilmIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">My Collection</h3>
                    <p className="text-xs text-stone-500">
                      Movies and series in your watchlist
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveNav("movies")}
                  className="text-xs text-amber-400/70 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="poster-scroll-row">
                {[...watching, ...toWatch].slice(0, 8).map((entry, idx) => (
                  <PosterCard
                    key={entry.id}
                    entry={entry}
                    index={idx}
                    onClick={() => setSelectedDetailEntry(entry)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* My Favorites — top rated */}
          {favorites.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="section-icon favorite">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">My Favorites</h3>
                    <p className="text-xs text-stone-500">
                      Movies and series you loved the most
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveNav("favorites")}
                  className="text-xs text-amber-400/70 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="poster-scroll-row">
                {favorites.slice(0, 8).map((entry, idx) => (
                  <PosterCard
                    key={entry.id}
                    entry={entry}
                    index={idx}
                    showRating
                    onClick={() => setSelectedDetailEntry(entry)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* My Journey — timeline by year */}
          {journeyYears.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="section-icon journey">
                    <Map className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">My Journey</h3>
                    <p className="text-xs text-stone-500">
                      A timeline of the stories I&apos;ve experienced over the years
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveNav("journey")}
                  className="text-xs text-amber-400/70 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {journeyYears.map(([year, yearEntries]) => (
                  <div
                    key={year}
                    onClick={() => setActiveNav("journey")}
                    className="journey-year-card glass-card p-4 cursor-pointer hover:border-amber-500/30 hover:scale-[1.02] transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        {year}
                      </h4>
                      <span className="text-xs text-stone-500">
                        {yearEntries.length} titles &rarr;
                      </span>
                    </div>
                    <div className="flex -space-x-2 overflow-hidden">
                      {yearEntries.slice(0, 5).map((entry) => (
                        <div
                          key={entry.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDetailEntry(entry);
                          }}
                          className="journey-poster-thumb hover:scale-110 hover:z-20 transition-transform cursor-pointer"
                          title={`Click to view ${entry.tmdb.title}`}
                        >
                          {entry.tmdb.posterUrl ? (
                            <img
                              src={entry.tmdb.posterUrl}
                              alt={entry.tmdb.title}
                              className="w-full h-full object-cover rounded-lg border-2 border-[#0a0a0a]"
                            />
                          ) : (
                            <div className="w-full h-full rounded-lg bg-stone-800 flex items-center justify-center border-2 border-[#0a0a0a]">
                              <FilmIcon className="w-3 h-3 text-stone-600" />
                            </div>
                          )}
                        </div>
                      ))}
                      {yearEntries.length > 5 && (
                        <div className="journey-poster-thumb bg-stone-800/80 rounded-lg border-2 border-[#0a0a0a] flex items-center justify-center">
                          <span className="text-[10px] text-stone-400 font-medium">
                            +{yearEntries.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Viewing Statistics — quick overview */}
          {entries.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="section-icon stats">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Viewing Analytics</h3>
                    <p className="text-xs text-stone-500">
                      A glance into your personal media journal
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveNav("stats")}
                  className="text-xs text-amber-400/70 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  Full Analytics &rarr;
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Quick stat cards */}
                <div
                  onClick={() => setActiveNav("movies")}
                  className="glass-card p-5 relative overflow-hidden group cursor-pointer hover:border-amber-500/40 hover:scale-[1.02] transition-all"
                  title="View all movies"
                >
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-colors duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="stat-circle-icon">
                      <FilmIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        {watched.length + watching.length}
                      </p>
                      <p className="text-xs text-stone-500">Movies Watched &rarr;</p>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setActiveNav("series")}
                  className="glass-card p-5 relative overflow-hidden group cursor-pointer hover:border-amber-500/40 hover:scale-[1.02] transition-all"
                  title="View all TV series"
                >
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/8 rounded-full blur-2xl group-hover:bg-amber-500/12 transition-colors duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="stat-circle-icon">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">{series.length}</p>
                      <p className="text-xs text-stone-500">Series Tracked &rarr;</p>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setActiveNav("stats")}
                  className="glass-card p-5 relative overflow-hidden group cursor-pointer hover:border-amber-500/40 hover:scale-[1.02] transition-all"
                  title="View watch time analytics"
                >
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/8 rounded-full blur-2xl group-hover:bg-amber-500/12 transition-colors duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="stat-circle-icon">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        {formatWatchTime(stats.totalWatchTimeMins)}
                      </p>
                      <p className="text-xs text-stone-500">Watch Time &rarr;</p>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setActiveNav("stats")}
                  className="glass-card p-5 relative overflow-hidden group cursor-pointer hover:border-amber-500/40 hover:scale-[1.02] transition-all"
                  title="View rating distribution"
                >
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/8 rounded-full blur-2xl group-hover:bg-amber-500/12 transition-colors duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="stat-circle-icon star">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"}
                      </p>
                      <p className="text-xs text-stone-500">Average Rating &rarr;</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Genres row (Interactive & Clickable) */}
              {stats.favoriteGenres.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs text-stone-500 uppercase tracking-wider mb-3">
                    Top Genres (Click to filter in Analytics)
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {stats.favoriteGenres.slice(0, 6).map(({ genre, count }) => (
                      <button
                        key={genre}
                        onClick={() => setActiveNav("stats")}
                        className="genre-pill glass-card px-4 py-2.5 flex items-center gap-2.5 cursor-pointer hover:border-amber-500/40 hover:scale-105 transition-all text-left"
                      >
                        <div className="genre-icon-circle">
                          <span className="text-xs font-bold text-amber-400">
                            {genre.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{genre}</p>
                          <p className="text-[10px] text-stone-500">{count} titles</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Featured Movie — detail panel */}
          {featuredMovie && (
            <section>
              <FeaturedMoviePanel
                entry={featuredMovie}
                onOpenDetail={() => setSelectedDetailEntry(featuredMovie)}
              />
            </section>
          )}
        </main>
      )}

      {/* ── Movies View ─────────────────────────────────────────── */}
      {activeNav === "movies" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="section-icon">
              <FilmIcon className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white">My Movies</h2>
          </div>
          {watching.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-400/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Play className="w-3.5 h-3.5" /> Currently Watching
              </h3>
              <WatchingShelf entries={watching.filter(e => e.tmdb.mediaType === "movie")} />
            </div>
          )}
          {toWatch.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-400/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookmarkPlus className="w-3.5 h-3.5" /> To Watch
              </h3>
              <ToWatchShelf entries={toWatch.filter(e => e.tmdb.mediaType === "movie")} />
            </div>
          )}
          {watched.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-400/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Award className="w-3.5 h-3.5" /> Watched
              </h3>
              <WatchedShelf entries={watched.filter(e => e.tmdb.mediaType === "movie")} />
            </div>
          )}
          {movies.length === 0 && (
            <EmptySection
              icon={<FilmIcon className="w-10 h-10 text-amber-500/40" />}
              title="No movies yet"
              subtitle="Add a movie to get started."
              onAdd={() => setIsSearchOpen(true)}
            />
          )}
        </main>
      )}

      {/* ── Series View ─────────────────────────────────────────── */}
      {activeNav === "series" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="section-icon">
              <Tv className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white">My Series</h2>
          </div>
          {watching.filter(e => e.tmdb.mediaType === "tv").length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-400/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Play className="w-3.5 h-3.5" /> Currently Watching
              </h3>
              <WatchingShelf entries={watching.filter(e => e.tmdb.mediaType === "tv")} />
            </div>
          )}
          {toWatch.filter(e => e.tmdb.mediaType === "tv").length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-400/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookmarkPlus className="w-3.5 h-3.5" /> To Watch
              </h3>
              <ToWatchShelf entries={toWatch.filter(e => e.tmdb.mediaType === "tv")} />
            </div>
          )}
          {watched.filter(e => e.tmdb.mediaType === "tv").length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-400/70 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Award className="w-3.5 h-3.5" /> Watched
              </h3>
              <WatchedShelf entries={watched.filter(e => e.tmdb.mediaType === "tv")} />
            </div>
          )}
          {series.length === 0 && (
            <EmptySection
              icon={<Tv className="w-10 h-10 text-amber-500/40" />}
              title="No series yet"
              subtitle="Add a TV show to get started."
              onAdd={() => setIsSearchOpen(true)}
            />
          )}
        </main>
      )}

      {/* ── Stats View ──────────────────────────────────────────── */}
      {activeNav === "stats" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="section-icon stats">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Watch Analytics</h2>
              <p className="text-xs text-stone-500">Consumption metrics &amp; genre insights</p>
            </div>
          </div>
          <AnalyticsDashboard entries={entries} />
        </main>
      )}

      {/* ── Journey View ────────────────────────────────────────── */}
      {activeNav === "journey" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="section-icon journey">
              <Map className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">My Journey</h2>
              <p className="text-xs text-stone-500">
                A timeline of the stories I&apos;ve experienced over the years
              </p>
            </div>
          </div>

          {journeyYears.length > 0 ? (
            <div className="space-y-8">
              {journeyYears.map(([year, yearEntries]) => (
                <div key={year}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-3xl font-bold text-white">{year}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent" />
                    <span className="text-sm text-stone-500">
                      {yearEntries.length} titles
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
              title="No journey yet"
              subtitle="Mark movies as watched to start building your timeline."
              onAdd={() => setIsSearchOpen(true)}
            />
          )}
        </main>
      )}

      {/* ── Favorites View ──────────────────────────────────────── */}
      {activeNav === "favorites" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="section-icon favorite">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">My Favorites</h2>
              <p className="text-xs text-stone-500">
                Movies and series you rated 8 or higher
              </p>
            </div>
          </div>
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
              subtitle="Rate movies 8/10 or higher to add them to your favorites."
              onAdd={() => setIsSearchOpen(true)}
            />
          )}
        </main>
      )}

      {/* ── Empty State CTA ─────────────────────────────────── */}
      {entries.length === 0 && activeNav === "home" && (
        <div className="flex items-center justify-center py-20">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/8 rounded-full blur-[100px]" />
          <div className="text-center relative">
            <div className="inline-flex p-5 rounded-2xl bg-amber-500/10 mb-6 animate-float">
              <Sparkles className="w-12 h-12 text-amber-400/60" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 text-glow">
              Welcome to COUCH CRITICS
            </h2>
            <p className="text-stone-400 max-w-md mx-auto mb-8 leading-relaxed">
              Track what you&apos;re watching, build your backlog, and keep a
              personal archive of every movie and show you experience.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-5 h-5" />
                Add Your First Movie
              </button>
            </div>
          </div>
        </div>
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
        defaultShelf={activeNav === "movies" ? "toWatch" : activeNav === "series" ? "toWatch" : "toWatch"}
      />

      {/* ── Auth Modal ──────────────────────────────────────── */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* ── Media Detail Modal (makes all cards interactive) ── */}
      <MediaDetailModal
        entry={selectedDetailEntry}
        isOpen={!!selectedDetailEntry}
        onClose={() => setSelectedDetailEntry(null)}
      />
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
      style={{ animationDelay: `${index * 40}ms` }}
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

/* ─── Featured Movie Panel ───────────────────────────────────────────────── */
function FeaturedMoviePanel({
  entry,
  onOpenDetail,
}: {
  entry: MovieEntry;
  onOpenDetail: () => void;
}) {
  return (
    <div
      onClick={onOpenDetail}
      className="featured-panel glass-card overflow-hidden relative cursor-pointer group hover:border-amber-500/30 transition-all"
    >
      {/* Background */}
      {entry.tmdb.posterUrl && (
        <div className="absolute inset-0">
          <img
            src={entry.tmdb.posterUrl}
            alt=""
            className="w-full h-full object-cover opacity-15 blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />
        </div>
      )}

      <div className="relative z-10 flex flex-col sm:flex-row gap-6 p-6">
        {/* Poster */}
        {entry.tmdb.posterUrl && (
          <img
            src={entry.tmdb.posterUrl}
            alt={entry.tmdb.title}
            className="w-32 sm:w-40 h-48 sm:h-60 rounded-xl object-cover shadow-2xl shadow-black/50 shrink-0 mx-auto sm:mx-0 group-hover:scale-105 transition-transform"
          />
        )}

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">
              ★ Featured in Your Journal
            </p>
            <span className="text-xs text-amber-400/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              View Details &amp; Episodes &rarr;
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
            {entry.tmdb.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-stone-400 mb-3">
            <span>{entry.tmdb.releaseYear}</span>
            {entry.tmdb.genres.slice(0, 3).map((g) => (
              <span key={g} className="px-2 py-0.5 text-xs rounded-md bg-white/5 border border-white/10">
                {g}
              </span>
            ))}
            {entry.tmdb.runtime > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {Math.floor(entry.tmdb.runtime / 60)}h {entry.tmdb.runtime % 60}m
              </span>
            )}
          </div>

          {/* Rating */}
          {entry.review?.rating && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-amber-400">
                {entry.review.rating.toFixed(1)}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < entry.review!.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-stone-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Notes quote */}
          {entry.review?.notes && (
            <p className="text-sm text-stone-400 italic leading-relaxed max-w-lg">
              &ldquo;{entry.review.notes}&rdquo;
            </p>
          )}

          {/* Overview fallback */}
          {!entry.review?.notes && entry.tmdb.overview && (
            <p className="text-sm text-stone-500 leading-relaxed max-w-lg line-clamp-3">
              {entry.tmdb.overview}
            </p>
          )}
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
    <div className="text-center py-20">
      <div className="inline-flex p-4 rounded-2xl bg-amber-500/8 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-stone-300">{title}</h3>
      <p className="text-stone-500 mt-2 text-sm max-w-sm mx-auto">{subtitle}</p>
      <button
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm rounded-xl transition-all shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Movie
      </button>
    </div>
  );
}
