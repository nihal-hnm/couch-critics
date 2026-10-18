/**
 * =============================================================================
 * Media Detail Modal — Cinematic Interactive View & Episode Tracker
 * =============================================================================
 *
 * Provides a deep interactive experience for any movie or TV show:
 *  - High-res backdrop & poster presentation
 *  - Instant shelf switching (Watching, To Watch, Watched)
 *  - Granular Episode-Wise Watching Tracker with season tabs & episode checkboxes
 *  - Star rating & personal journal review editing
 *  - Progress steppers for currently watching movies/shows
 */

"use client";

import { useState, useEffect } from "react";
import {
  X,
  Star,
  Clock,
  Calendar,
  Film,
  Tv,
  CheckCircle2,
  Play,
  BookmarkPlus,
  Trash2,
  Check,
  CheckCheck,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ListVideo,
  RotateCcw,
  Layers,
  Filter,
} from "lucide-react";
import type { MovieEntry, Shelf, UserReview, WatchProgress, EpisodeItem, TMDBSeasonData } from "@/lib/types";
import { useJournal } from "@/lib/journal-context";
import { fetchSeasonEpisodes, getMovieDetails, buildWatchedEpisodes } from "@/lib/tmdb";
import { getCachedTVSeasons } from "@/lib/tv-seasons-cache";
import { MovieImage } from "./common/MovieImage";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { WhereToWatch } from "./common/WhereToWatch";

interface MediaDetailModalProps {
  entry: MovieEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaDetailModal({
  entry: initialEntry,
  isOpen,
  onClose,
}: MediaDetailModalProps) {
  const { entries, moveToShelf, updateProgress, updateReview, removeEntry, enrichEntrySeasons } = useJournal();

  // Always resolve the live, real-time entry from context so every interaction updates immediately
  const entry =
    (initialEntry
      ? entries.find(
          (e) =>
            e.id === initialEntry.id ||
            (Boolean(e.tmdb?.tmdbId) && e.tmdb.tmdbId === initialEntry.tmdb?.tmdbId)
        )
      : null) ?? initialEntry;

  // Local state for edits
  const [activeTab, setActiveTab] = useState<"overview" | "episodes" | "review">("overview");
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState<number | "all">("all");
  const [modalSeasons, setModalSeasons] = useState<TMDBSeasonData[]>([]);
  const [seasonsEpisodesMap, setSeasonsEpisodesMap] = useState<Record<number, EpisodeItem[]>>({});
  const [loadingSeasons, setLoadingSeasons] = useState<Record<number, boolean>>({});
  const [collapsedSeasons, setCollapsedSeasons] = useState<Record<number, boolean>>({});
  const [episodeFilter, setEpisodeFilter] = useState<"all" | "watched" | "unwatched">("all");
  const [expandedOverviewCodes, setExpandedOverviewCodes] = useState<Record<string, boolean>>({});

  function toggleOverview(epCode: string) {
    setExpandedOverviewCodes((prev) => ({
      ...prev,
      [epCode]: !prev[epCode],
    }));
  }

  // Review editing state
  const [rating, setRating] = useState<number>(entry?.review?.rating ?? 8);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>(entry?.review?.notes ?? "");
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>(entry?.review?.tags ?? []);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize state when entry changes
  useEffect(() => {
    if (entry) {
      setRating(entry.review?.rating ?? 8);
      setNotes(entry.review?.notes ?? "");
      setTags(entry.review?.tags ?? []);
      setActiveTab(entry.tmdb.mediaType === "tv" ? "episodes" : "overview");
      setSelectedSeasonFilter("all");
      setCollapsedSeasons({});
    }
  }, [entry?.id]);

  // Load and cache episodes for ALL seasons of TV shows
  useEffect(() => {
    if (!entry || entry.tmdb.mediaType !== "tv") return;

    const catalog = getCachedTVSeasons(entry.tmdb.tmdbId);

    // Check if entry.tmdb.seasons already has detailed episodes with real names
    const entryHasRichEpisodes =
      entry.tmdb.seasons &&
      entry.tmdb.seasons.some(
        (s) =>
          s.episodes &&
          s.episodes.length > 0 &&
          s.episodes.some((e) => e.title && !e.title.toLowerCase().startsWith("episode "))
      );

    const catalogHasRichEpisodes =
      catalog?.seasons &&
      catalog.seasons.some(
        (s) =>
          s.episodes &&
          s.episodes.length > 0 &&
          s.episodes.some((e) => e.title && !e.title.toLowerCase().startsWith("episode "))
      );

    let resolvedSeasons: TMDBSeasonData[] =
      entryHasRichEpisodes && entry.tmdb.seasons
        ? entry.tmdb.seasons
        : catalogHasRichEpisodes && catalog?.seasons
        ? catalog.seasons
        : entry.tmdb.seasons && entry.tmdb.seasons.length > 0
        ? entry.tmdb.seasons
        : catalog?.seasons && catalog.seasons.length > 0
        ? catalog.seasons
        : [];

    function populateSeasons(seasons: TMDBSeasonData[]) {
      setModalSeasons(seasons);

      // Initialize immediate fallback or existing data for each season
      const initialMap: Record<number, EpisodeItem[]> = {};
      seasons.forEach((s) => {
        const catalogSeason = catalog?.seasons.find((cs) => cs.seasonNumber === s.seasonNumber);
        const hasRichEpisodes =
          s.episodes &&
          s.episodes.length > 0 &&
          s.episodes.some((e) => e.title && !e.title.toLowerCase().startsWith("episode "));

        if (hasRichEpisodes && s.episodes) {
          initialMap[s.seasonNumber] = s.episodes;
        } else if (catalogSeason?.episodes && catalogSeason.episodes.length > 0) {
          initialMap[s.seasonNumber] = catalogSeason.episodes;
        } else if (s.episodes && s.episodes.length > 0) {
          initialMap[s.seasonNumber] = s.episodes;
        } else {
          const count = s.episodeCount || 10;
          initialMap[s.seasonNumber] = Array.from({ length: count }, (_, i) => ({
            seasonNumber: s.seasonNumber,
            episodeNumber: i + 1,
            title: `Episode ${i + 1}`,
            runtime: entry?.tmdb.runtime || 45,
          }));
        }
      });
      setSeasonsEpisodesMap(initialMap);

      // Fetch detailed episode data for all seasons in background via TMDB/TVmaze
      seasons.forEach((s) => {
        setLoadingSeasons((prev) => ({ ...prev, [s.seasonNumber]: true }));
        fetchSeasonEpisodes(entry!.tmdb.tmdbId, s.seasonNumber, entry!.tmdb.title)
          .then((eps) => {
            if (eps && eps.length > 0) {
              setSeasonsEpisodesMap((prev) => ({
                ...prev,
                [s.seasonNumber]: eps,
              }));
            }
          })
          .catch((err) => {
            console.warn(`Could not load episodes for S${s.seasonNumber}:`, err);
          })
          .finally(() => {
            setLoadingSeasons((prev) => ({ ...prev, [s.seasonNumber]: false }));
          });
      });
    }

    if (resolvedSeasons.length > 0) {
      populateSeasons(resolvedSeasons);
      if (catalog && (!entryHasRichEpisodes || !entry.tmdb.seasons || entry.tmdb.seasons.length <= 1)) {
        enrichEntrySeasons(
          entry.id,
          catalog.seasons,
          catalog.totalSeasons,
          catalog.backdropUrl,
          catalog.totalEpisodes
        );
      }
    }

    // If show didn't have rich seasons, fetch directly from TMDB
    if (resolvedSeasons.length <= 1) {
      let cancelled = false;
      getMovieDetails(entry.tmdb.tmdbId, "tv")
        .then((details) => {
          if (cancelled) return;
          if (details.seasons && details.seasons.length > 0) {
            populateSeasons(details.seasons);
            enrichEntrySeasons(
              entry.id,
              details.seasons,
              details.totalSeasons || details.seasons.length,
              details.backdropUrl,
              details.totalEpisodes
            );
          }
        })
        .catch(() => {
          if (resolvedSeasons.length === 0) {
            const fallback = Array.from(
              {
                length:
                  entry.tmdb.totalSeasons ||
                  catalog?.totalSeasons ||
                  1,
              },
              (_, i) => ({
                seasonNumber: i + 1,
                name: `Season ${i + 1}`,
                episodeCount: entry.tmdb.totalEpisodes || 10,
              })
            );
            populateSeasons(fallback);
          }
        });

      return () => {
        cancelled = true;
      };
    }
  }, [entry?.id, entry?.tmdb?.tmdbId, enrichEntrySeasons]);

  // Handle escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !entry) return null;

  const isTV = entry.tmdb.mediaType === "tv";
  const catalogSeasons = getCachedTVSeasons(entry.tmdb.tmdbId)?.seasons;
  const currentShowSeasons =
    (modalSeasons.length > 0 ? modalSeasons : null) ||
    (entry.tmdb.seasons && entry.tmdb.seasons.length > 0 ? entry.tmdb.seasons : null) ||
    (catalogSeasons && catalogSeasons.length > 0 ? catalogSeasons : null);

  const hasInvalidSeason1Overflow =
    Boolean(currentShowSeasons &&
    currentShowSeasons.length > 1 &&
    entry.progress?.watchedEpisodes?.some((code) => {
      const match = code.match(/^S1E(\d+)$/);
      if (!match) return false;
      const ep = parseInt(match[1], 10);
      const s1Count = currentShowSeasons?.find((s) => s.seasonNumber === 1)?.episodeCount || 10;
      return ep > s1Count;
    }));

  const rawWatchedEpisodes =
    entry.progress?.watchedEpisodes &&
    entry.progress.watchedEpisodes.length > 0 &&
    !hasInvalidSeason1Overflow
      ? entry.progress.watchedEpisodes
      : buildWatchedEpisodes(
          entry.shelf === "watched"
            ? (entry.progress?.totalEpisodes ?? entry.tmdb.totalEpisodes ?? 10)
            : (entry.progress?.currentEpisode ?? 0),
          currentShowSeasons || undefined
        );

  const watchedEpisodeCodes = new Set(rawWatchedEpisodes);

  // ── Shelf Switcher ────────────────────────────────────────────────────────
  function handleShelfChange(newShelf: Shelf) {
    if (newShelf === entry?.shelf) return;
    if (newShelf === "watched") {
      const reviewPayload: UserReview = entry?.review ?? {
        rating,
        notes,
        tags,
        dateCompleted: new Date().toISOString(),
      };
      moveToShelf(entry!.id, "watched", reviewPayload);
    } else if (newShelf === "watching") {
      moveToShelf(entry!.id, "watching");
      if (!entry!.progress) {
        updateProgress(entry!.id, {
          currentSeason: 1,
          currentEpisode: 1,
          totalEpisodes: entry!.tmdb.totalEpisodes || 10,
          watchedEpisodes: isTV ? ["S1E1"] : [],
          minutesWatched: 0,
          totalMinutes: entry!.tmdb.runtime || 120,
        });
      }
    } else {
      moveToShelf(entry!.id, "toWatch");
    }
  }

  // ── Granular Episode Toggle ───────────────────────────────────────────────
  function handleToggleEpisode(seasonNum: number, episodeNum: number, episodeTitle?: string) {
    if (!entry) return;
    const epCode = `S${seasonNum}E${episodeNum}`;
    const newWatched = new Set(entry.progress?.watchedEpisodes ?? []);

    const isCurrentlyWatched = newWatched.has(epCode);
    if (isCurrentlyWatched) {
      newWatched.delete(epCode);
    } else {
      newWatched.add(epCode);
    }

    const watchedArray = Array.from(newWatched);
    const newHistory = [...(entry.progress?.episodeHistory ?? [])];

    if (!isCurrentlyWatched) {
      newHistory.unshift({
        id: crypto.randomUUID(),
        seasonNumber: seasonNum,
        episodeNumber: episodeNum,
        episodeTitle: episodeTitle || `Episode ${episodeNum}`,
        runtimeMinutes: entry.tmdb.runtime || 45,
        watchedAt: new Date().toISOString(),
      });
    }

    const seasonData = seasonsList.find((s) => s.seasonNumber === seasonNum);
    const seasonEpCount = seasonData?.episodeCount || 10;

    let activeSeasonEp = episodeNum;
    if (isCurrentlyWatched) {
      let highest = 0;
      for (let ep = 1; ep <= seasonEpCount; ep++) {
        if (newWatched.has(`S${seasonNum}E${ep}`)) {
          highest = ep;
        }
      }
      activeSeasonEp = Math.max(1, highest);
    }

    const updatedProgress: WatchProgress = {
      ...(entry.progress ?? {}),
      currentSeason: seasonNum,
      currentEpisode: activeSeasonEp,
      totalEpisodes: seasonEpCount,
      watchedEpisodes: watchedArray,
      episodeHistory: newHistory.slice(0, 50),
      minutesWatched: watchedArray.length * (entry.tmdb.runtime || 45),
    };

    updateProgress(entry.id, updatedProgress);
  }

  // ── Helper: Get episodes for any season (cached, fetched, or fallback) ────
  function getEpisodesForSeason(seasonNum: number, fallbackCount: number = 10): EpisodeItem[] {
    if (seasonsEpisodesMap[seasonNum] && seasonsEpisodesMap[seasonNum].length > 0) {
      return seasonsEpisodesMap[seasonNum];
    }
    return Array.from({ length: fallbackCount || 10 }, (_, i) => ({
      seasonNumber: seasonNum,
      episodeNumber: i + 1,
      title: `Episode ${i + 1}`,
      runtime: entry?.tmdb.runtime || 45,
      overview: "",
    }));
  }

  // ── Mark Whole Season (Select All) ────────────────────────────────────────
  function handleMarkAllSeason(seasonNum: number) {
    if (!entry) return;
    const seasonData = seasonsList.find((s) => s.seasonNumber === seasonNum);
    const seasonEpCount = seasonData?.episodeCount || 10;
    const eps = getEpisodesForSeason(seasonNum, seasonEpCount);
    const newWatched = new Set(entry.progress?.watchedEpisodes ?? []);

    eps.forEach((ep) => {
      newWatched.add(`S${seasonNum}E${ep.episodeNumber}`);
    });

    const watchedArray = Array.from(newWatched);
    updateProgress(entry.id, {
      ...(entry.progress ?? {}),
      currentSeason: seasonNum,
      currentEpisode: seasonEpCount,
      totalEpisodes: seasonEpCount,
      watchedEpisodes: watchedArray,
      minutesWatched: watchedArray.length * (entry.tmdb.runtime || 45),
    });

    if (entry.shelf === "toWatch") {
      moveToShelf(entry.id, "watching");
    }
  }

  // ── Unmark Whole Season (Unselect All) ────────────────────────────────────
  function handleUnmarkAllSeason(seasonNum: number) {
    if (!entry) return;
    const seasonData = seasonsList.find((s) => s.seasonNumber === seasonNum);
    const seasonEpCount = seasonData?.episodeCount || 10;
    const eps = getEpisodesForSeason(seasonNum, seasonEpCount);
    const newWatched = new Set(entry.progress?.watchedEpisodes ?? []);

    eps.forEach((ep) => {
      newWatched.delete(`S${seasonNum}E${ep.episodeNumber}`);
    });

    const watchedArray = Array.from(newWatched);
    updateProgress(entry.id, {
      ...(entry.progress ?? {}),
      currentSeason: seasonNum,
      currentEpisode: 1,
      totalEpisodes: seasonEpCount,
      watchedEpisodes: watchedArray,
      minutesWatched: watchedArray.length * (entry.tmdb.runtime || 45),
    });
  }

  // ── Mark Entire Series (Select All Series) ────────────────────────────────
  function handleMarkAllSeries() {
    if (!entry) return;
    const newWatched = new Set(entry.progress?.watchedEpisodes ?? []);

    seasonsList.forEach((s) => {
      const eps = getEpisodesForSeason(s.seasonNumber, s.episodeCount || 10);
      eps.forEach((ep) => {
        newWatched.add(`S${s.seasonNumber}E${ep.episodeNumber}`);
      });
    });

    const watchedArray = Array.from(newWatched);
    updateProgress(entry.id, {
      ...(entry.progress ?? {}),
      currentSeason: seasonsList[seasonsList.length - 1]?.seasonNumber || 1,
      currentEpisode: watchedArray.length,
      watchedEpisodes: watchedArray,
      minutesWatched: watchedArray.length * (entry.tmdb.runtime || 45),
    });

    if (entry.shelf === "toWatch") {
      moveToShelf(entry.id, "watching");
    }
  }

  // ── Unmark Entire Series (Unselect All Series) ────────────────────────────
  function handleUnmarkAllSeries() {
    if (!entry) return;
    updateProgress(entry.id, {
      ...(entry.progress ?? {}),
      currentEpisode: 0,
      watchedEpisodes: [],
      minutesWatched: 0,
    });
  }

  // ── Season Accordion Controls ────────────────────────────────────────────
  function toggleSeasonCollapse(seasonNum: number) {
    setCollapsedSeasons((prev) => ({
      ...prev,
      [seasonNum]: !prev[seasonNum],
    }));
  }

  function handleExpandAll() {
    setCollapsedSeasons({});
  }

  function handleCollapseAll() {
    const allCollapsed: Record<number, boolean> = {};
    seasonsList.forEach((s) => {
      allCollapsed[s.seasonNumber] = true;
    });
    setCollapsedSeasons(allCollapsed);
  }

  // ── Unwatch Feature ───────────────────────────────────────────────────────
  function handleUnwatch(targetShelf: Shelf = "toWatch") {
    if (!entry) return;
    moveToShelf(entry.id, targetShelf, {
      rating: 0,
      notes: entry.review?.notes || "",
      tags: entry.review?.tags || [],
      dateCompleted: "",
    });

    if (targetShelf === "toWatch") {
      updateProgress(entry.id, {
        ...(entry.progress ?? {}),
        currentEpisode: 0,
        watchedEpisodes: [],
        minutesWatched: 0,
      });
    }
  }

  // ── Save Review ───────────────────────────────────────────────────────────
  function handleSaveReview() {
    if (!entry) return;
    const reviewData: UserReview = {
      rating,
      notes,
      tags,
      dateCompleted: entry.review?.dateCompleted ?? new Date().toISOString(),
    };
    updateReview(entry.id, reviewData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }

  function handleAddTag() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  const seasonsList: TMDBSeasonData[] =
    currentShowSeasons && currentShowSeasons.length > 0
      ? currentShowSeasons
      : Array.from(
          {
            length:
              entry.tmdb.totalSeasons ||
              getCachedTVSeasons(entry.tmdb.tmdbId)?.totalSeasons ||
              1,
          },
          (_, i) => ({
            seasonNumber: i + 1,
            name: `Season ${i + 1}`,
            episodeCount: entry.tmdb.totalEpisodes
              ? Math.ceil(
                  entry.tmdb.totalEpisodes /
                    (entry.tmdb.totalSeasons ||
                      getCachedTVSeasons(entry.tmdb.tmdbId)?.totalSeasons ||
                      1)
                )
              : 10,
          })
        );

  const totalCalculatedEpisodes = seasonsList.reduce((sum, s) => {
    const count = seasonsEpisodesMap[s.seasonNumber]?.length || s.episodeCount || 10;
    return sum + count;
  }, 0);

  const displayTotalEpisodes = entry.tmdb.totalEpisodes || totalCalculatedEpisodes;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#15151C] border border-[#292932] rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Banner Header ─────────────────────────────────────── */}
        <div className="relative h-48 sm:h-64 shrink-0 overflow-hidden keep-white">
          {entry.tmdb.backdropUrl || entry.tmdb.posterUrl ? (
            <img
              src={getOptimizedImageUrl(entry.tmdb.backdropUrl || entry.tmdb.posterUrl || "")}
              alt={entry.tmdb.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-60"
            />
          ) : (
            <div className="w-full h-full bg-[#15151C]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-stone-200 hover:text-white hover:bg-black/80 transition-colors backdrop-blur-md border border-white/10 cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Media Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4 sm:gap-6 keep-white z-10">
            {entry.tmdb.posterUrl && (
              <div className="w-24 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0 hidden xs:block bg-[#0B0B0F]">
                <MovieImage
                  src={entry.tmdb.posterUrl}
                  alt={entry.tmdb.title}
                  title={entry.tmdb.title}
                  mediaType={entry.tmdb.mediaType}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0 keep-white">
              <div className="flex flex-wrap items-center gap-2 mb-1.5 keep-white">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-white border border-white/15 flex items-center gap-1 backdrop-blur-sm">
                  {isTV ? <Tv className="w-3 h-3 text-[#E50914]" /> : <Film className="w-3 h-3 text-[#E50914]" />}
                  {isTV ? "TV Series" : "Movie"}
                </span>
                <span className="text-xs text-stone-300 font-medium">{entry.tmdb.releaseYear}</span>
                {entry.tmdb.runtime > 0 && (
                  <span className="text-xs text-stone-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {isTV ? `~${entry.tmdb.runtime}m / ep` : `${entry.tmdb.runtime}m`}
                  </span>
                )}
                {entry.review?.rating && (
                  <span className="flex items-center gap-1 text-xs text-[#F5C542] font-semibold bg-black/40 px-2 py-0.5 rounded border border-[#F5C542]/30 backdrop-blur-sm">
                    <Star className="w-3 h-3 fill-[#F5C542]" />
                    {entry.review.rating}/10
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white truncate leading-tight drop-shadow-md">
                {entry.tmdb.title}
              </h2>
              {entry.tmdb.director && (
                <p className="text-xs text-stone-300 mt-1">
                  {isTV ? "Created by" : "Directed by"}{" "}
                  <span className="text-white font-semibold">{entry.tmdb.director}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Shelf Controls & Navigation Bar ───────────────────── */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#292932] bg-[#15151C] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Shelf Switcher & Unwatch button */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium hidden sm:inline">Shelf:</span>
            <div className="flex items-center gap-1 bg-[#0B0B0F] p-1 rounded-xl border border-[#292932]">
              <button
                onClick={() => handleShelfChange("watching")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  entry.shelf === "watching"
                    ? "bg-[#E50914] text-white shadow-sm"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <Play className="w-3 h-3" />
                Watching
              </button>
              <button
                onClick={() => handleShelfChange("toWatch")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  entry.shelf === "toWatch"
                    ? "bg-[#E50914] text-white shadow-sm"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <BookmarkPlus className="w-3 h-3" />
                To Watch
              </button>
              <button
                onClick={() => handleShelfChange("watched")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  entry.shelf === "watched"
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-[#F5C542]" />
                Watched
              </button>
            </div>

            {/* Unwatch Action Button */}
            {entry.shelf === "watched" && (
              <button
                type="button"
                onClick={() => handleUnwatch("toWatch")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:text-white bg-white/5 hover:bg-white/10 border border-[#292932] transition-all shadow-sm cursor-pointer"
                title="Unwatch (Move back to Watchlist/Backlog)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Unwatch
              </button>
            )}
          </div>

          {/* Modal View Tabs */}
          <div className="flex items-center gap-1.5 bg-[#0B0B0F] p-1 rounded-xl border border-[#292932]">
            {isTV && (
              <button
                onClick={() => setActiveTab("episodes")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "episodes"
                    ? "bg-[#E50914] text-white shadow-sm"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                <ListVideo className="w-3.5 h-3.5" />
                Episodes ({watchedEpisodeCodes.size}/{displayTotalEpisodes})
              </button>
            )}
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#E50914] text-white shadow-sm"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "review"
                  ? "bg-[#E50914] text-white shadow-sm"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              Rating &amp; Review
            </button>
          </div>
        </div>

        {/* ── Scrollable Tab Content ────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: ALL SEASONS & EPISODES TRACKER (TV SHOWS) */}
          {activeTab === "episodes" && isTV && (
            <div className="space-y-6">
              {/* Overall series progress banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0B0F] border border-[#292932] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-black/40">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E50914]" />
                    <h4 className="text-base font-bold text-white tracking-tight">
                      All Seasons &amp; Episodes Tracker
                    </h4>
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white/5 text-[#A1A1AA] border border-[#292932]">
                      {seasonsList.length} Seasons
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 max-w-xl">
                    View and check off episodes across all seasons. Interactive checklist updates your watch statistics, time logged, and dashboard in real-time.
                  </p>
                </div>
                <div className="flex items-center gap-5 shrink-0">
                  <div className="text-right">
                    <p className="text-xl font-black text-emerald-400">
                      {watchedEpisodeCodes.size} <span className="text-stone-400 text-sm font-normal">/ {displayTotalEpisodes}</span>
                    </p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                      Episodes Watched
                    </p>
                  </div>
                  <div className="text-right pl-4 border-l border-stone-800">
                    <p className="text-xl font-black text-white">
                      {Math.round(((watchedEpisodeCodes.size * (entry.tmdb.runtime || 45)) / 60) * 10) / 10}h
                    </p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                      Series Watch Time
                    </p>
                  </div>
                </div>
              </div>

              {/* Where to Watch / OTT Streaming Availability */}
              <WhereToWatch
                tmdbId={entry.tmdb.tmdbId}
                title={entry.tmdb.title}
                mediaType="tv"
                variant="full"
              />

              {/* Overall Series Progress Bar */}
              <div className="space-y-1.5 bg-[#0B0B0F] p-3 rounded-xl border border-[#292932]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-medium flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-emerald-400" />
                    Overall Series Completion
                  </span>
                  <span className="font-bold text-emerald-400">
                    {Math.round((watchedEpisodeCodes.size / (displayTotalEpisodes || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#15151C] rounded-full h-3 overflow-hidden border border-[#292932]">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-400 transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.5)] rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((watchedEpisodeCodes.size / (displayTotalEpisodes || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Toolbar: Season Filter / Jump Pills + Global Batch Actions */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#0B0B0F] p-3 rounded-xl border border-[#292932]">
                {/* Season Quick Jump / Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 max-w-full hide-scrollbar">
                  <button
                    type="button"
                    onClick={() => setSelectedSeasonFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedSeasonFilter === "all"
                        ? "bg-[#E50914] text-white shadow-md shadow-black/40"
                        : "bg-[#15151C] text-[#A1A1AA] hover:text-white border border-[#292932]"
                    }`}
                  >
                    All Seasons ({seasonsList.length})
                  </button>
                  {seasonsList.map((s) => {
                    const seasonEps = getEpisodesForSeason(s.seasonNumber, s.episodeCount || 10);
                    const seasonWatched = seasonEps.filter((ep) =>
                      watchedEpisodeCodes.has(`S${s.seasonNumber}E${ep.episodeNumber}`)
                    ).length;
                    const isSelected = selectedSeasonFilter === s.seasonNumber;

                    return (
                      <button
                        key={s.seasonNumber}
                        type="button"
                        onClick={() => setSelectedSeasonFilter(isSelected ? "all" : s.seasonNumber)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-[#E50914] text-white font-bold shadow-md shadow-black/40"
                            : "bg-[#15151C] text-[#A1A1AA] hover:text-white border border-[#292932]"
                        }`}
                        title={`Filter or jump to Season ${s.seasonNumber}`}
                      >
                        <span>S{s.seasonNumber}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-[#0B0B0F] text-[#A1A1AA]"
                          }`}
                        >
                          {seasonWatched}/{seasonEps.length}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right side controls: Batch actions & Accordion Expand/Collapse */}
                <div className="flex items-center flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleMarkAllSeries}
                    className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-[#292932] transition-colors font-medium cursor-pointer"
                    title="Mark all episodes across all seasons as watched"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Select All Series
                  </button>
                  <button
                    type="button"
                    onClick={handleUnmarkAllSeries}
                    className="text-xs text-[#A1A1AA] hover:text-[#F5F5F5] flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-[#292932] transition-colors font-medium cursor-pointer"
                    title="Unmark all episodes in this series"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Unselect All
                  </button>
                  <button
                    type="button"
                    onClick={
                      Object.keys(collapsedSeasons).length > 0 ? handleExpandAll : handleCollapseAll
                    }
                    className="text-xs text-[#A1A1AA] hover:text-[#F5F5F5] flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-[#292932] transition-colors font-medium cursor-pointer"
                    title="Expand or collapse all season accordions"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    {Object.keys(collapsedSeasons).length > 0 ? "Expand All" : "Collapse All"}
                  </button>
                </div>
              </div>

              {/* Episode Filter Bar: All / Watched / Unwatched */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-stone-400">
                <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#E50914]" />
                  Showing: {selectedSeasonFilter === "all" ? "All Seasons" : `Season ${selectedSeasonFilter}`}
                </span>
                <div className="flex items-center gap-1 bg-[#0B0B0F] p-1 rounded-xl border border-[#292932]">
                  <button
                    type="button"
                    onClick={() => setEpisodeFilter("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      episodeFilter === "all"
                        ? "bg-[#E50914] text-white font-semibold"
                        : "text-[#A1A1AA] hover:text-white"
                    }`}
                  >
                    All Episodes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEpisodeFilter("watched")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      episodeFilter === "watched"
                        ? "bg-[#E50914] text-white font-semibold"
                        : "text-[#A1A1AA] hover:text-white"
                    }`}
                  >
                    Watched ({watchedEpisodeCodes.size})
                  </button>
                  <button
                    type="button"
                    onClick={() => setEpisodeFilter("unwatched")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      episodeFilter === "unwatched"
                        ? "bg-[#E50914] text-white font-semibold"
                        : "text-[#A1A1AA] hover:text-white"
                    }`}
                  >
                    Unwatched ({Math.max(0, displayTotalEpisodes - watchedEpisodeCodes.size)})
                  </button>
                </div>
              </div>

              {/* ── ALL SEASONS LIST ─────────────────────────────────── */}
              <div className="space-y-5">
                {seasonsList
                  .filter((s) => selectedSeasonFilter === "all" || selectedSeasonFilter === s.seasonNumber)
                  .map((season) => {
                    const seasonNumber = season.seasonNumber;
                    const seasonEps = getEpisodesForSeason(seasonNumber, season.episodeCount || 10);
                    const watchedInSeason = seasonEps.filter((ep) =>
                      watchedEpisodeCodes.has(`S${seasonNumber}E${ep.episodeNumber}`)
                    ).length;
                    const seasonPercent = Math.round((watchedInSeason / (seasonEps.length || 1)) * 100);
                    const isCollapsed = !!collapsedSeasons[seasonNumber];
                    const isLoading = !!loadingSeasons[seasonNumber];

                    const filteredEps = seasonEps.filter((ep) => {
                      const isWatched = watchedEpisodeCodes.has(`S${seasonNumber}E${ep.episodeNumber}`);
                      if (episodeFilter === "watched") return isWatched;
                      if (episodeFilter === "unwatched") return !isWatched;
                      return true;
                    });

                    return (
                      <div
                        key={seasonNumber}
                        id={`season-block-${seasonNumber}`}
                        className="rounded-2xl border border-[#292932] bg-[#0B0B0F] overflow-hidden shadow-md transition-all hover:border-stone-700/80"
                      >
                        {/* Season Header Bar (Click to toggle accordion) */}
                        <div
                          onClick={() => toggleSeasonCollapse(seasonNumber)}
                          className="p-3.5 sm:p-4 bg-[#15151C] hover:bg-[#15151C]/80 transition-colors flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none border-b border-[#292932]"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="p-1 rounded-lg bg-[#0B0B0F] text-[#A1A1AA] hover:text-white transition-colors"
                              aria-label={isCollapsed ? "Expand season" : "Collapse season"}
                            >
                              {isCollapsed ? (
                                <ChevronRight className="w-4 h-4 text-[#A1A1AA]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#E50914]" />
                              )}
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm sm:text-base font-bold text-white">
                                  {season.name}
                                </h5>
                                <span className="text-xs text-stone-400 font-normal">
                                  ({seasonEps.length} episodes)
                                </span>
                              </div>
                              <p className="text-xs text-emerald-400/90 mt-0.5 font-medium">
                                {watchedInSeason} / {seasonEps.length} watched ({seasonPercent}%)
                              </p>
                            </div>
                          </div>

                          {/* Season Batch Actions */}
                          <div
                            className="flex items-center gap-2 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => handleMarkAllSeason(seasonNumber)}
                              className="text-xs text-emerald-400 hover:text-white flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-colors font-medium cursor-pointer"
                              title={`Mark all episodes in ${season.name} as watched`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              Select All S{seasonNumber}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUnmarkAllSeason(seasonNumber)}
                              className="text-xs text-[#A1A1AA] hover:text-[#F5F5F5] flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-[#292932] transition-colors font-medium cursor-pointer"
                              title={`Unmark all episodes in ${season.name}`}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Unselect
                            </button>
                          </div>
                        </div>

                        {/* Season Mini Progress Bar */}
                        <div className="w-full bg-[#15151C] h-2 overflow-hidden border-y border-[#292932]">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-400 transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                            style={{ width: `${seasonPercent}%` }}
                          />
                        </div>

                        {/* Season Episodes Checklist (When Expanded) */}
                        {!isCollapsed && (
                          <div className="p-3 sm:p-4 space-y-2">
                            {isLoading && seasonEps.length === 0 ? (
                              <div className="py-6 text-center text-xs text-stone-500 animate-pulse">
                                Loading Season {seasonNumber} episodes from TMDB...
                              </div>
                            ) : filteredEps.length === 0 ? (
                              <div className="py-6 text-center text-xs text-stone-500">
                                No episodes match filter &ldquo;{episodeFilter}&rdquo; in {season.name}.
                              </div>
                            ) : (
                              filteredEps.map((ep) => {
                                const isWatched = watchedEpisodeCodes.has(
                                  `S${seasonNumber}E${ep.episodeNumber}`
                                );
                                const epCode = `S${seasonNumber}E${ep.episodeNumber}`;
                                const isOverviewOpen = !!expandedOverviewCodes[epCode];

                                return (
                                  <div
                                    key={ep.episodeNumber}
                                    className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                                      isWatched
                                        ? "bg-emerald-950/20 border-emerald-500/30 text-white"
                                        : "bg-[#15151C]/60 border-[#292932] text-[#A1A1AA] hover:border-stone-700 hover:bg-[#15151C]"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleToggleEpisode(seasonNumber, ep.episodeNumber, ep.title)
                                          }
                                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                            isWatched
                                              ? "bg-emerald-600 text-white font-bold"
                                              : "border border-[#292932] hover:border-emerald-400 bg-[#0B0B0F]"
                                          }`}
                                          aria-label={isWatched ? `Mark episode ${ep.episodeNumber} unwatched` : `Mark episode ${ep.episodeNumber} watched`}
                                        >
                                          {isWatched ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                                        </button>
                                        <div
                                          className="min-w-0 flex-1 cursor-pointer flex items-center gap-2 flex-wrap"
                                          onClick={() => toggleOverview(epCode)}
                                          title={isOverviewOpen ? "Click to hide overview" : "Click to view overview"}
                                        >
                                          <span className="text-emerald-400 font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 shrink-0">
                                            E{ep.episodeNumber}
                                          </span>
                                          <span
                                            className={`text-sm font-semibold truncate ${
                                              isWatched ? "text-white" : "text-stone-200"
                                            }`}
                                          >
                                            {ep.title}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2.5 shrink-0">
                                        <span className="text-xs text-stone-500 hidden sm:flex items-center gap-1 font-mono">
                                          <Clock className="w-3 h-3" />
                                          {ep.runtime || entry.tmdb.runtime || 45}m
                                        </span>
                                        <span
                                          className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider hidden xs:inline-block ${
                                            isWatched
                                              ? "bg-[#E50914]/15 text-[#F5F5F5] border border-[#E50914]/40"
                                              : "bg-stone-800 text-stone-500"
                                          }`}
                                        >
                                          {isWatched ? "Watched" : "Unwatched"}
                                        </span>

                                        {/* Dropdown Toggle Button for Overview */}
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleOverview(epCode);
                                          }}
                                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                                            isOverviewOpen
                                              ? "bg-[#E50914]/15 text-[#F5F5F5] border-[#E50914]/40 shadow-sm"
                                              : "bg-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-700/80 border-stone-700/60"
                                          }`}
                                          title={isOverviewOpen ? "Collapse overview" : "Watch episode overview"}
                                        >
                                          <span>Overview</span>
                                          <ChevronDown
                                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                              isOverviewOpen ? "rotate-180 text-[#E50914]" : "text-stone-400"
                                            }`}
                                          />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Overview Dropdown Content */}
                                    {isOverviewOpen && (
                                      <div className="mt-3 pt-3 border-t border-stone-800/70 pl-8 pr-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <p className="text-xs text-stone-300 leading-relaxed">
                                          {ep.overview ? (
                                            ep.overview
                                          ) : (
                                            <span className="text-stone-500 italic text-[11px]">
                                              No overview available for this episode.
                                            </span>
                                          )}
                                        </p>

                                        <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-500 flex-wrap">
                                          {ep.airDate && <span>Aired: {ep.airDate}</span>}
                                          {ep.runtime && (
                                            <span className="flex items-center gap-1 font-mono">
                                              <Clock className="w-3 h-3" />
                                              Runtime: {ep.runtime} min
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {entry.tmdb.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-xs rounded-full bg-[#15151C] text-[#F5F5F5] border border-[#292932]"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <div>
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Synopsis
                </h4>
                <p className="text-sm text-stone-300 leading-relaxed">
                  {entry.tmdb.overview || "No synopsis available."}
                </p>
              </div>

              {/* Where to Watch / OTT Streaming Availability */}
              <WhereToWatch
                tmdbId={entry.tmdb.tmdbId}
                title={entry.tmdb.title}
                mediaType={entry.tmdb.mediaType}
                variant="full"
              />

              {/* If movie on watching shelf: progress slider */}
              {entry.shelf === "watching" && !isTV && (
                <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-white">Movie Watch Progress</span>
                    <span className="text-[#E50914] font-semibold">
                      {entry.progress?.minutesWatched ?? 0} / {entry.tmdb.runtime || 120} min
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={entry.tmdb.runtime || 120}
                    value={entry.progress?.minutesWatched ?? 0}
                    onChange={(e) =>
                      updateProgress(entry.id, {
                        ...entry.progress,
                        minutesWatched: Number(e.target.value),
                        totalMinutes: entry.tmdb.runtime || 120,
                      })
                    }
                    className="w-full accent-[#E50914] cursor-pointer"
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() =>
                        updateProgress(entry.id, {
                          ...entry.progress,
                          minutesWatched: Math.max(0, (entry.progress?.minutesWatched ?? 0) - 15),
                        })
                      }
                      className="px-2.5 py-1 text-xs rounded bg-stone-800 text-stone-300 hover:text-white"
                    >
                      -15 mins
                    </button>
                    <button
                      onClick={() =>
                        updateProgress(entry.id, {
                          ...entry.progress,
                          minutesWatched: Math.min(
                            entry.tmdb.runtime || 120,
                            (entry.progress?.minutesWatched ?? 0) + 15
                          ),
                        })
                      }
                      className="px-2.5 py-1 text-xs rounded bg-stone-800 text-stone-300 hover:text-white"
                    >
                      +15 mins
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RATING & REVIEW */}
          {activeTab === "review" && (
            <div className="space-y-6">
              {/* Star Rating Selector (1 to 10) */}
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => {
                      const starVal = i + 1;
                      const active = (hoverRating || rating) >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(starVal)}
                          className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                              active
                                ? "text-[#F5C542] fill-[#F5C542]"
                                : "text-[#292932] hover:text-[#F5C542]/50"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xl font-bold text-[#F5C542] ml-2">
                    {hoverRating || rating} / 10
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
                  Personal Journal Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What resonated with you? Notable scenes, performances, takeaways..."
                  rows={4}
                  className="w-full bg-[#0B0B0F] border border-[#292932] rounded-xl p-3 text-sm text-[#F5F5F5] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#E50914]/50 resize-y transition-colors"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
                  Tags &amp; Keywords
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-[#A1A1AA] border border-[#292932] flex items-center gap-1.5"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add a tag (e.g. comfort-watch, peak-writing)..."
                    className="flex-1 bg-[#0B0B0F] border border-[#292932] rounded-xl px-3 py-2 text-xs text-[#F5F5F5] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#E50914]/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#F5F5F5] text-xs rounded-xl font-medium transition-colors cursor-pointer border border-[#292932]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Save Review Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveReview}
                  className="px-6 py-2.5 bg-[#E50914] hover:bg-[#FF3B3B] text-white rounded-xl text-sm font-semibold shadow-md shadow-black/40 transition-all cursor-pointer"
                >
                  Save Review
                </button>
                {saveSuccess && (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                    <Check className="w-4 h-4" />
                    Review saved successfully!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Modal Footer ──────────────────────────────────────── */}
        <div className="px-4 sm:px-6 py-3 border-t border-[#292932] bg-[#15151C] flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              if (confirm(`Remove "${entry.tmdb.title}" from your Couch Critics journal?`)) {
                removeEntry(entry.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-[#FF3B3B] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove from Journal
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors border border-[#292932] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
