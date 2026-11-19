/**
 * =============================================================================
 * Filmography Modal — Director & Actor Career Completion Tracker
 * =============================================================================
 *
 * Displays a director or actor's full creative filmography, calculates the user's
 * exact completion percentage (e.g., "Christopher Nolan: 9/12 watched — 75% complete"),
 * displays ratings given by the user, and lets users 1-click add missing titles
 * to their To-Watch backlog.
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import {
  X,
  Award,
  CheckCircle2,
  Clock,
  Play,
  Plus,
  Star,
  Film,
  Tv,
  Clapperboard,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { MovieEntry } from "@/lib/types";
import {
  getPersonFilmography,
  type PersonFilmographyData,
  type PersonCreditItem,
} from "@/lib/tmdb";
import { MovieImage } from "./common/MovieImage";
import { useJournal } from "@/lib/journal-context";

interface FilmographyModalProps {
  personName: string;
  personId?: number | null;
  role?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectEntry?: (entry: MovieEntry) => void;
}

export function FilmographyModal({
  personName,
  personId,
  role = "Artist",
  isOpen,
  onClose,
  onSelectEntry,
}: FilmographyModalProps) {
  const { entries, addEntry } = useJournal();
  const [data, setData] = useState<PersonFilmographyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isOpen || (!personName && !personId)) return;

    let mounted = true;
    setLoading(true);

    getPersonFilmography(personId, personName)
      .then((res) => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, personId, personName]);

  // Index journal entries by TMDB ID and normalized title for instant lookups
  const journalLookup = useMemo(() => {
    const byId = new Map<number, MovieEntry>();
    const byTitle = new Map<string, MovieEntry>();

    entries.forEach((e) => {
      if (e.tmdb.tmdbId) byId.set(e.tmdb.tmdbId, e);
      byTitle.set(e.tmdb.title.toLowerCase().trim(), e);
    });

    return { byId, byTitle };
  }, [entries]);

  // Filter credits
  const filteredCredits = useMemo(() => {
    if (!data?.credits) return [];
    if (filterType === "all") return data.credits;
    return data.credits.filter((c) => c.mediaType === filterType);
  }, [data?.credits, filterType]);

  // Compute career completion stats
  const stats = useMemo(() => {
    if (!data?.credits || data.credits.length === 0) {
      return { total: 0, watched: 0, backlog: 0, percent: 0, avgRating: 0 };
    }

    const total = data.credits.length;
    let watched = 0;
    let backlog = 0;
    let ratingSum = 0;
    let ratedCount = 0;

    data.credits.forEach((c) => {
      const match = journalLookup.byId.get(c.id) || journalLookup.byTitle.get(c.title.toLowerCase().trim());
      if (match) {
        if (match.shelf === "watched") {
          watched++;
          if (match.review?.rating) {
            ratingSum += match.review.rating;
            ratedCount++;
          }
        } else if (match.shelf === "toWatch") {
          backlog++;
        }
      }
    });

    const percent = Math.round((watched / total) * 100);
    const avgRating = ratedCount > 0 ? (ratingSum / ratedCount).toFixed(1) : null;

    return { total, watched, backlog, percent, avgRating };
  }, [data?.credits, journalLookup]);

  // Add missing title to user's To-Watch backlog
  function handleQuickAddToBacklog(credit: PersonCreditItem) {
    const newEntry: MovieEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      shelf: "toWatch",
      tmdb: {
        tmdbId: credit.id,
        title: credit.title,
        posterUrl: credit.posterUrl,
        backdropUrl: null,
        releaseYear: credit.releaseYear,
        runtime: 110,
        genres: [],
        director: role.toLowerCase().includes("direct") ? personName : "",
        overview: "",
        mediaType: credit.mediaType,
      },
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addEntry(newEntry);
    setAddedIds((prev) => new Set(prev).add(credit.id));
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/85 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#15151C] border border-[#292932] rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header / Profile ── */}
        <div className="p-5 sm:p-6 border-b border-[#292932] bg-gradient-to-r from-black/60 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {data?.profileUrl ? (
              <img
                src={data.profileUrl}
                alt={personName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-[#292932] shadow-md shrink-0"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 shrink-0">
                <Clapperboard className="w-7 h-7 text-[#D97706]" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs text-stone-300 bg-white/[0.06] border border-white/10">
                  {data?.knownForDepartment || role}
                </span>
                <span className="text-xs text-[#A1A1AA] font-mono">Filmography Tracker</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mt-1">
                {data?.name || personName}
              </h3>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Progress & Completion Banner ── */}
        {!loading && data && (
          <div className="p-4 sm:px-6 bg-[#0B0B0F] border-b border-[#292932] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Completion Bar */}
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="text-[#A1A1AA]">
                  Career Completion: <strong className="text-white font-mono">{stats.watched}</strong> of{" "}
                  <strong className="text-white font-mono">{stats.total}</strong> watched
                </span>
                <span className="font-mono text-stone-200 font-semibold tabular-nums">{stats.percent}% Complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
            </div>

            {/* Micro Stats */}
            <div className="flex items-center gap-3 shrink-0">
              {stats.avgRating && (
                <div className="px-3 py-1.5 rounded-xl bg-[#15151C] border border-[#292932] flex items-center gap-1.5 text-xs font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-amber-300 font-bold">{stats.avgRating}</span>
                  <span className="text-stone-500 text-[10px]">Your Avg</span>
                </div>
              )}
              {stats.backlog > 0 && (
                <div className="px-3 py-1.5 rounded-xl bg-[#15151C] border border-[#292932] flex items-center gap-1.5 text-xs font-mono text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{stats.backlog} Backlogged</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Filter Controls ── */}
        <div className="px-5 py-3 border-b border-[#292932] bg-[#15151C] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-xl border border-[#292932]">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filterType === "all" ? "bg-[#D97706] text-white shadow-sm" : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              All Works ({data?.credits.length || 0})
            </button>
            <button
              onClick={() => setFilterType("movie")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filterType === "movie" ? "bg-[#D97706] text-white shadow-sm" : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Films
            </button>
            <button
              onClick={() => setFilterType("tv")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filterType === "tv" ? "bg-[#D97706] text-white shadow-sm" : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              TV Shows
            </button>
          </div>

          <span className="text-xs text-[#A1A1AA] font-mono hidden sm:inline">
            Showing {filteredCredits.length} titles
          </span>
        </div>

        {/* ── Scrollable Filmography Grid ── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 hide-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-10 h-10 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-[#A1A1AA] font-mono">Loading filmography &amp; catalog...</p>
            </div>
          ) : filteredCredits.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.02] border border-[#292932] rounded-2xl">
              <Film className="w-10 h-10 text-stone-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-300">No credits found in this category.</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredCredits.map((credit) => {
                const journalEntry =
                  journalLookup.byId.get(credit.id) ||
                  journalLookup.byTitle.get(credit.title.toLowerCase().trim());

                const isWatched = journalEntry?.shelf === "watched";
                const isWatching = journalEntry?.shelf === "watching";
                const isToWatch = journalEntry?.shelf === "toWatch" || addedIds.has(credit.id);

                return (
                  <div
                    key={`${credit.id}-${credit.role}`}
                    onClick={() => journalEntry && onSelectEntry?.(journalEntry)}
                    className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200 bg-[#0B0B0F] ${
                      journalEntry ? "cursor-pointer hover:border-amber-400/50" : "hover:border-[#292932]"
                    } ${
                      isWatched
                        ? "border-emerald-500/40"
                        : isWatching
                          ? "border-red-500/40"
                          : isToWatch
                            ? "border-amber-500/40"
                            : "border-[#292932]"
                    }`}
                  >
                    {/* Poster Image */}
                    <div className="relative aspect-[2/3] w-full bg-stone-900 overflow-hidden">
                      <MovieImage
                        src={credit.posterUrl}
                        alt={credit.title}
                        title={credit.title}
                        mediaType={credit.mediaType}
                        className="w-full h-full object-cover "
                      />

                      {/* Status Badges */}
                      <div className="absolute top-2 left-2 z-10">
                        {isWatched ? (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-600/90 text-[9px] font-mono font-bold text-white shadow-md">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Watched
                          </span>
                        ) : isWatching ? (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-600/90 text-[9px] font-mono font-bold text-white shadow-md">
                            <Play className="w-2.5 h-2.5 fill-current" />
                            Watching
                          </span>
                        ) : isToWatch ? (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-600/90 text-[9px] font-mono font-bold text-white shadow-md">
                            <Clock className="w-2.5 h-2.5" />
                            Backlog
                          </span>
                        ) : null}
                      </div>

                      {/* User rating tag if watched */}
                      {isWatched && journalEntry?.review?.rating && (
                        <div className="absolute bottom-2 right-2 z-10">
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/85 border border-amber-400/40 text-[10px] font-mono font-bold text-amber-300 shadow">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            {journalEntry.review.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info and Action */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between bg-[#15151C]">
                      <div>
                        <h4 className="text-xs font-bold text-[#F5F5F5] group-hover:text-white line-clamp-1 leading-tight">
                          {credit.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-[#A1A1AA] mt-1 font-mono">
                          <span>{credit.releaseYear}</span>
                          <span className="truncate max-w-[80px]" title={credit.role}>
                            {credit.role}
                          </span>
                        </div>
                      </div>

                      {/* If not in journal, show 1-click Add to Backlog */}
                      {!journalEntry && !addedIds.has(credit.id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAddToBacklog(credit);
                          }}
                          className="mt-2 w-full py-1 px-2 rounded-lg bg-white/5 hover:bg-[#D97706] text-[#A1A1AA] hover:text-white border border-[#292932] hover:border-[#D97706] text-[10px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                          title="Add to To-Watch Shelf"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add to Backlog</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilmographyModal;
