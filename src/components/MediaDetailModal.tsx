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
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  ListVideo,
} from "lucide-react";
import type { MovieEntry, Shelf, UserReview, WatchProgress, EpisodeItem } from "@/lib/types";
import { useJournal } from "@/lib/journal-context";
import { fetchSeasonEpisodes } from "@/lib/tmdb";

interface MediaDetailModalProps {
  entry: MovieEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaDetailModal({
  entry,
  isOpen,
  onClose,
}: MediaDetailModalProps) {
  const { moveToShelf, updateProgress, updateReview, removeEntry } = useJournal();

  // Local state for edits
  const [activeTab, setActiveTab] = useState<"overview" | "episodes" | "review">("overview");
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<EpisodeItem[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

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
      const currentS = entry.progress?.currentSeason || 1;
      setSelectedSeason(currentS);
      setActiveTab(entry.tmdb.mediaType === "tv" ? "episodes" : "overview");
    }
  }, [entry]);

  // Load episodes when season changes for TV shows
  useEffect(() => {
    if (!entry || entry.tmdb.mediaType !== "tv") return;

    // Check if season is already in entry.tmdb.seasons with episodes
    const seasonData = entry.tmdb.seasons?.find((s) => s.seasonNumber === selectedSeason);
    if (seasonData?.episodes && seasonData.episodes.length > 0) {
      setSeasonEpisodes(seasonData.episodes);
      return;
    }

    // Otherwise fetch or generate
    setIsLoadingEpisodes(true);
    fetchSeasonEpisodes(entry.tmdb.tmdbId, selectedSeason)
      .then((eps) => setSeasonEpisodes(eps))
      .catch(() => {
        // Fallback
        const fallbackCount = seasonData?.episodeCount || 10;
        setSeasonEpisodes(
          Array.from({ length: fallbackCount }, (_, i) => ({
            seasonNumber: selectedSeason,
            episodeNumber: i + 1,
            title: `Episode ${i + 1}`,
            runtime: entry.tmdb.runtime || 45,
          }))
        );
      })
      .finally(() => setIsLoadingEpisodes(false));
  }, [entry, selectedSeason]);

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
  const watchedEpisodeCodes = new Set(entry.progress?.watchedEpisodes ?? []);

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

    const currentEpCount = watchedArray.length;
    const updatedProgress: WatchProgress = {
      ...(entry.progress ?? {}),
      currentSeason: seasonNum,
      currentEpisode: currentEpCount,
      totalEpisodes: entry.progress?.totalEpisodes || entry.tmdb.totalEpisodes || 10,
      watchedEpisodes: watchedArray,
      episodeHistory: newHistory.slice(0, 50),
      minutesWatched: currentEpCount * (entry.tmdb.runtime || 45),
    };

    updateProgress(entry.id, updatedProgress);
  }

  // ── Mark Whole Season ─────────────────────────────────────────────────────
  function handleMarkAllSeason(seasonNum: number) {
    if (!entry || seasonEpisodes.length === 0) return;
    const newWatched = new Set(entry.progress?.watchedEpisodes ?? []);

    seasonEpisodes.forEach((ep) => {
      newWatched.add(`S${seasonNum}E${ep.episodeNumber}`);
    });

    const watchedArray = Array.from(newWatched);
    updateProgress(entry.id, {
      ...(entry.progress ?? {}),
      currentSeason: seasonNum,
      currentEpisode: watchedArray.length,
      watchedEpisodes: watchedArray,
      minutesWatched: watchedArray.length * (entry.tmdb.runtime || 45),
    });
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

  const seasonsList = entry.tmdb.seasons && entry.tmdb.seasons.length > 0
    ? entry.tmdb.seasons
    : Array.from({ length: entry.tmdb.totalSeasons || 1 }, (_, i) => ({
        seasonNumber: i + 1,
        name: `Season ${i + 1}`,
        episodeCount: 10,
      }));

  const episodesInCurrentSeason: EpisodeItem[] = seasonEpisodes.length > 0
    ? seasonEpisodes
    : Array.from({ length: 10 }, (_, i) => ({
        seasonNumber: selectedSeason,
        episodeNumber: i + 1,
        title: `Episode ${i + 1}`,
        runtime: entry.tmdb.runtime || 45,
        overview: "",
      }));

  const watchedInThisSeason = episodesInCurrentSeason.filter((ep) =>
    watchedEpisodeCodes.has(`S${selectedSeason}E${ep.episodeNumber}`)
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#12100e] border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Banner Header ─────────────────────────────────────── */}
        <div className="relative h-48 sm:h-64 shrink-0 overflow-hidden">
          {entry.tmdb.backdropUrl || entry.tmdb.posterUrl ? (
            <img
              src={entry.tmdb.backdropUrl || entry.tmdb.posterUrl || ""}
              alt={entry.tmdb.title}
              className="w-full h-full object-cover object-center filter brightness-50"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-stone-900 to-amber-950/40" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-[#12100e]/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-stone-300 hover:text-white hover:bg-black/80 transition-colors backdrop-blur-sm border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Media Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4 sm:gap-6">
            {entry.tmdb.posterUrl && (
              <img
                src={entry.tmdb.posterUrl}
                alt={entry.tmdb.title}
                className="w-24 sm:w-32 aspect-[2/3] object-cover rounded-xl shadow-2xl border border-white/10 shrink-0 hidden xs:block"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  {isTV ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                  {isTV ? "TV Series" : "Movie"}
                </span>
                <span className="text-xs text-stone-300">{entry.tmdb.releaseYear}</span>
                {entry.tmdb.runtime > 0 && (
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {isTV ? `~${entry.tmdb.runtime}m / ep` : `${entry.tmdb.runtime}m`}
                  </span>
                )}
                {entry.review?.rating && (
                  <span className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {entry.review.rating}/10
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-white truncate leading-tight">
                {entry.tmdb.title}
              </h2>
              {entry.tmdb.director && (
                <p className="text-xs text-stone-400 mt-0.5">
                  {isTV ? "Created by" : "Directed by"}{" "}
                  <span className="text-stone-300 font-medium">{entry.tmdb.director}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Shelf Controls & Navigation Bar ───────────────────── */}
        <div className="px-4 sm:px-6 py-3 border-b border-stone-800 bg-[#161311] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Shelf Switcher */}
          <div className="flex items-center gap-1.5 bg-stone-900/80 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => handleShelfChange("watching")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                entry.shelf === "watching"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Play className="w-3 h-3" />
              Watching
            </button>
            <button
              onClick={() => handleShelfChange("toWatch")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                entry.shelf === "toWatch"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <BookmarkPlus className="w-3 h-3" />
              To Watch
            </button>
            <button
              onClick={() => handleShelfChange("watched")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                entry.shelf === "watched"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Watched
            </button>
          </div>

          {/* Modal View Tabs */}
          <div className="flex items-center gap-2">
            {isTV && (
              <button
                onClick={() => setActiveTab("episodes")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "episodes"
                    ? "bg-amber-500/15 text-amber-200 border border-amber-500/30"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <ListVideo className="w-3.5 h-3.5" />
                Episodes ({watchedEpisodeCodes.size}/{entry.tmdb.totalEpisodes || "?"})
              </button>
            )}
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-amber-500/15 text-amber-200 border border-amber-500/30"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "review"
                  ? "bg-amber-500/15 text-amber-200 border border-amber-500/30"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              Rating &amp; Review
            </button>
          </div>
        </div>

        {/* ── Scrollable Tab Content ────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: EPISODES TRACKER (TV SHOWS) */}
          {activeTab === "episodes" && isTV && (
            <div className="space-y-5">
              {/* Overall series progress banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">
                      Episode Tracking Progress
                    </h4>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Check off individual episodes to track your exact watch history and consumption time.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-amber-400">
                      {watchedEpisodeCodes.size} / {entry.tmdb.totalEpisodes || episodesInCurrentSeason.length}
                    </p>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider">
                      Episodes Logged
                    </p>
                  </div>
                  <div className="text-right pl-4 border-l border-stone-800">
                    <p className="text-lg font-bold text-white">
                      {Math.round(((watchedEpisodeCodes.size * (entry.tmdb.runtime || 45)) / 60) * 10) / 10}h
                    </p>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider">
                      Time Watched
                    </p>
                  </div>
                </div>
              </div>

              {/* Season Selection Pills */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full hide-scrollbar">
                  {seasonsList.map((season) => (
                    <button
                      key={season.seasonNumber}
                      onClick={() => setSelectedSeason(season.seasonNumber)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                        selectedSeason === season.seasonNumber
                          ? "bg-amber-600 text-white font-semibold shadow-md shadow-amber-600/20"
                          : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
                      }`}
                    >
                      {season.name} ({season.episodeCount} eps)
                    </button>
                  ))}
                </div>

                {/* Mark all season button */}
                <button
                  onClick={() => handleMarkAllSeason(selectedSeason)}
                  className="text-xs text-amber-400/90 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark All S{selectedSeason} Watched
                </button>
              </div>

              {/* Season Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Season {selectedSeason} Progress</span>
                  <span className="font-semibold text-amber-400">
                    {watchedInThisSeason} / {episodesInCurrentSeason.length} ({Math.round((watchedInThisSeason / (episodesInCurrentSeason.length || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (watchedInThisSeason / (episodesInCurrentSeason.length || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Episode Checklist Grid */}
              <div className="space-y-2">
                {isLoadingEpisodes ? (
                  <div className="py-12 text-center text-stone-500 text-sm">
                    Loading season episodes...
                  </div>
                ) : (
                  episodesInCurrentSeason.map((ep) => {
                    const isWatched = watchedEpisodeCodes.has(
                      `S${selectedSeason}E${ep.episodeNumber}`
                    );
                    return (
                      <div
                        key={ep.episodeNumber}
                        onClick={() =>
                          handleToggleEpisode(selectedSeason, ep.episodeNumber, ep.title)
                        }
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isWatched
                            ? "bg-amber-500/10 border-amber-500/30 text-white"
                            : "bg-stone-900/60 border-stone-800/80 text-stone-400 hover:border-stone-700 hover:bg-stone-900"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                              isWatched
                                ? "bg-amber-500 text-stone-950 font-bold"
                                : "border border-stone-700 hover:border-amber-400"
                            }`}
                          >
                            {isWatched ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                          </button>
                          <div className="min-w-0">
                            <p className={`text-sm font-medium truncate ${isWatched ? "text-white" : "text-stone-300"}`}>
                              <span className="text-amber-400 font-mono text-xs mr-2">
                                E{ep.episodeNumber}
                              </span>
                              {ep.title}
                            </p>
                            {ep.overview && (
                              <p className="text-xs text-stone-500 truncate max-w-lg mt-0.5">
                                {ep.overview}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ep.runtime || entry.tmdb.runtime || 45}m
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                              isWatched
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-stone-800 text-stone-500"
                            }`}
                          >
                            {isWatched ? "Watched" : "Unwatched"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
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
                    className="px-3 py-1 text-xs rounded-full bg-stone-900 text-amber-200 border border-stone-800"
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

              {/* If movie on watching shelf: progress slider */}
              {entry.shelf === "watching" && !isTV && (
                <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-white">Movie Watch Progress</span>
                    <span className="text-amber-400 font-semibold">
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
                    className="w-full accent-amber-500 cursor-pointer"
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
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
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
                          className="p-1 focus:outline-none transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                              active
                                ? "text-amber-400 fill-amber-400"
                                : "text-stone-700 hover:text-stone-500"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xl font-bold text-amber-400 ml-2">
                    {hoverRating || rating} / 10
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Personal Journal Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What resonated with you? Notable scenes, performances, takeaways..."
                  rows={4}
                  className="w-full bg-stone-900/90 border border-stone-800 rounded-xl p-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500/50 resize-y transition-colors"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Tags &amp; Keywords
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1.5"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-white"
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
                    className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-xl font-medium transition-colors"
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
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-600/20 transition-all"
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
        <div className="px-4 sm:px-6 py-3 border-t border-stone-800/80 bg-[#161311] flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              if (confirm(`Remove "${entry.tmdb.title}" from your Couch Critics journal?`)) {
                removeEntry(entry.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove from Journal
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
