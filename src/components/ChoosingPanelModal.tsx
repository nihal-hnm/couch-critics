"use client";

import { useEffect, useState, useMemo } from "react";
import {
  X,
  Play,
  BookmarkPlus,
  CheckCircle2,
  Film,
  Tv,
  Clock,
  Sparkles,
  Star,
  Check,
  ChevronRight,
  Trash2,
  Loader2,
} from "lucide-react";
import type { MarqueeMediaItem } from "@/lib/showcase-media";
import type { MovieEntry, Shelf, TMDBMovieData } from "@/lib/types";
import { useJournal } from "@/lib/journal-context";
import { getMovieDetails } from "@/lib/tmdb";
import { MovieImage } from "./common/MovieImage";
import { WhereToWatch } from "./common/WhereToWatch";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { formatHours } from "@/lib/stats";

interface ChoosingPanelModalProps {
  item: (MarqueeMediaItem & { shelf?: Shelf; entry?: MovieEntry }) | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullDetail?: (entry: MovieEntry) => void;
}

export default function ChoosingPanelModal({
  item,
  isOpen,
  onClose,
  onOpenFullDetail,
}: ChoosingPanelModalProps) {
  const { entries, addEntry, moveToShelf, removeEntry } = useJournal();

  const [details, setDetails] = useState<TMDBMovieData | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Extract clean numerical TMDB ID
  const tmdbId = useMemo(() => {
    if (!item) return 0;
    if (item.entry?.tmdb?.tmdbId) return item.entry.tmdb.tmdbId;
    const raw = item.id.replace("showcase-", "");
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? 0 : parsed;
  }, [item]);

  // Check if item is already in the user's journal
  const existingEntry = useMemo(() => {
    if (!item) return undefined;
    if (item.entry) return item.entry;
    return entries.find(
      (e) =>
        e.id === item.id ||
        (tmdbId > 0 && e.tmdb?.tmdbId === tmdbId) ||
        e.tmdb?.title?.toLowerCase().trim() === item.title.toLowerCase().trim()
    );
  }, [item, entries, tmdbId]);

  const currentShelf: Shelf | null = existingEntry?.shelf ?? null;

  // Fetch full TMDB details (overview, director, backdrop, runtime) when modal opens
  useEffect(() => {
    if (!item || !isOpen) {
      setDetails(null);
      setActionFeedback(null);
      return;
    }

    if (existingEntry?.tmdb?.overview && existingEntry.tmdb.overview.length > 20) {
      setDetails(existingEntry.tmdb);
      return;
    }

    if (tmdbId > 0) {
      let isMounted = true;
      setLoadingDetails(true);
      getMovieDetails(tmdbId, item.mediaType)
        .then((data) => {
          if (isMounted) {
            setDetails(data);
          }
        })
        .catch((err) => {
          console.warn("Could not load TMDB details for choosing panel:", err);
        })
        .finally(() => {
          if (isMounted) setLoadingDetails(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [item, isOpen, tmdbId, existingEntry]);

  // Handle escape key
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

  if (!isOpen || !item) return null;

  const isTV = item.mediaType === "tv";
  const displayTitle = details?.title || item.title;
  const displayYear = details?.releaseYear || item.releaseYear;
  const displayOverview = details?.overview || "Select a shelf below to track this title in your Couch Critics journal.";
  const displayDirector = details?.director;
  const displayRuntime = details?.runtime || 0;
  const displayBackdrop = details?.backdropUrl || item.posterUrl;

  // Handle Shelf Selection
  function handleSelectShelf(targetShelf: Shelf) {
    if (existingEntry) {
      if (existingEntry.shelf === targetShelf) {
        // Already on this shelf
        setActionFeedback(`Already in ${getShelfLabel(targetShelf)}`);
        setTimeout(() => setActionFeedback(null), 2500);
        return;
      }

      // Move shelf
      moveToShelf(
        existingEntry.id,
        targetShelf,
        targetShelf === "watched"
          ? {
              rating: existingEntry.review?.rating || 8,
              notes: existingEntry.review?.notes || "",
              tags: existingEntry.review?.tags || [],
              dateCompleted: new Date().toISOString(),
            }
          : undefined
      );
      setActionFeedback(`Moved to ${getShelfLabel(targetShelf)}!`);
      setTimeout(() => setActionFeedback(null), 3000);
    } else {
      // Add new entry
      const newEntry: MovieEntry = {
        id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        shelf: targetShelf,
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tmdb: details || {
          tmdbId: tmdbId || 0,
          title: item!.title,
          mediaType: item!.mediaType,
          releaseYear: item!.releaseYear,
          posterUrl: item!.posterUrl,
          backdropUrl: item!.posterUrl,
          overview: "",
          genres: [],
          runtime: 0,
          director: "",
        },
        progress:
          targetShelf === "watching"
            ? {
                currentSeason: 1,
                currentEpisode: 1,
                totalEpisodes: details?.totalEpisodes || (isTV ? 10 : 1),
                watchedEpisodes: isTV ? ["S1E1"] : [],
                minutesWatched: 0,
                totalMinutes: details?.runtime || (isTV ? 45 : 120),
              }
            : undefined,
        review:
          targetShelf === "watched"
            ? {
                rating: 8,
                notes: "",
                tags: [],
                dateCompleted: new Date().toISOString(),
              }
            : undefined,
      };

      addEntry(newEntry);
      setActionFeedback(`Added to ${getShelfLabel(targetShelf)}!`);
      setTimeout(() => setActionFeedback(null), 3000);
    }
  }

  function handleRemoveFromJournal() {
    if (!existingEntry) return;
    removeEntry(existingEntry.id);
    setActionFeedback("Removed from your journal");
    setTimeout(() => {
      setActionFeedback(null);
      onClose();
    }, 1500);
  }

  function getShelfLabel(shelf: Shelf): string {
    switch (shelf) {
      case "watching":
        return "Currently Watching";
      case "toWatch":
        return "To Watch Backlog";
      case "watched":
        return "Watched Archive";
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-[#15151C] border border-[#292932] rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10 text-[#F5F5F5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Cinematic Backdrop Header ─────────────────────────── */}
        <div className="relative h-44 sm:h-52 shrink-0 overflow-hidden bg-[#0B0B0F]">
          {displayBackdrop && (
            <img
              src={getOptimizedImageUrl(displayBackdrop)}
              alt={displayTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#15151C] via-[#15151C]/60 to-black/40" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-black/60 text-[#A1A1AA] hover:text-white hover:bg-black/90 transition-colors backdrop-blur-sm border border-[#292932] cursor-pointer z-20"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Meta on Backdrop */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3.5">
            <div className="w-16 sm:w-20 aspect-[2/3] shrink-0 rounded-lg overflow-hidden shadow-2xl border border-[#292932] bg-[#0B0B0F]">
              <MovieImage
                src={item.posterUrl}
                alt={displayTitle}
                title={displayTitle}
                mediaType={item.mediaType}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 pb-0.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-white/5 text-[#A1A1AA] border border-[#292932]">
                  {isTV ? <Tv className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                  {isTV ? "TV Series" : "Movie"}
                </span>
                {displayYear && (
                  <span className="text-xs text-[#A1A1AA] font-mono">
                    {displayYear}
                  </span>
                )}
                {displayRuntime > 0 && (
                  <span className="text-xs text-[#A1A1AA] font-mono">
                    &bull; {formatHours(displayRuntime)}
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate drop-shadow-md">
                {displayTitle}
              </h2>

              {displayDirector && (
                <p className="text-xs text-stone-300 truncate mt-0.5">
                  {isTV ? "Created by" : "Directed by"}{" "}
                  <span className="text-[#F5F5F5] font-medium">{displayDirector}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Scrollable Body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 hide-scrollbar">
          {/* Action Feedback Banner */}
          {actionFeedback && (
            <div className="p-3 rounded-xl bg-white/5 border border-[#292932] text-[#F5F5F5] text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#E50914]" />
                <span>{actionFeedback}</span>
              </div>
            </div>
          )}

          {/* ══ CHOOSING PANEL (SHELF SELECTION) ═══════════════════ */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0B0F] border border-[#292932] shadow-lg shadow-black/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E50914]" />
                  Choose a Shelf to Add or Move
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  {currentShelf
                    ? `Currently on your "${getShelfLabel(currentShelf)}" shelf. Click any shelf to switch.`
                    : "Not in your journal yet. Choose where you want to keep this title:"}
                </p>
              </div>

              {currentShelf && (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-[#A1A1AA] border border-[#292932] shrink-0">
                  On Shelf: {getShelfLabel(currentShelf)}
                </span>
              )}
            </div>

            {/* Shelf Choice Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Option 1: Currently Watching */}
              <button
                type="button"
                onClick={() => handleSelectShelf("watching")}
                className={`flex items-center sm:flex-col justify-start sm:justify-center gap-2.5 p-3 rounded-xl border text-left sm:text-center transition-all cursor-pointer ${
                  currentShelf === "watching"
                    ? "bg-[#E50914] border-[#E50914] text-white shadow-md shadow-black/40"
                    : "bg-[#15151C] border-[#292932] text-[#A1A1AA] hover:text-white hover:border-[#E50914]/40"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    currentShelf === "watching"
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-[#E50914]"
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-bold">Currently Watching</div>
                  <div className="text-[10px] text-[#A1A1AA] mt-0.5">
                    {currentShelf === "watching" ? "✓ Active Shelf" : "Track episodes/time"}
                  </div>
                </div>
              </button>

              {/* Option 2: To Watch Backlog */}
              <button
                type="button"
                onClick={() => handleSelectShelf("toWatch")}
                className={`flex items-center sm:flex-col justify-start sm:justify-center gap-2.5 p-3 rounded-xl border text-left sm:text-center transition-all cursor-pointer ${
                  currentShelf === "toWatch"
                    ? "bg-[#E50914] border-[#E50914] text-white shadow-md shadow-black/40"
                    : "bg-[#15151C] border-[#292932] text-[#A1A1AA] hover:text-white hover:border-[#E50914]/40"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    currentShelf === "toWatch"
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-[#A1A1AA]"
                  }`}
                >
                  <BookmarkPlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">To Watch</div>
                  <div className="text-[10px] text-[#A1A1AA] mt-0.5">
                    {currentShelf === "toWatch" ? "✓ Active Shelf" : "Save to backlog"}
                  </div>
                </div>
              </button>

              {/* Option 3: Watched Archive */}
              <button
                type="button"
                onClick={() => handleSelectShelf("watched")}
                className={`flex items-center sm:flex-col justify-start sm:justify-center gap-2.5 p-3 rounded-xl border text-left sm:text-center transition-all cursor-pointer ${
                  currentShelf === "watched"
                    ? "bg-[#E50914] border-[#E50914] text-white shadow-md shadow-black/40"
                    : "bg-[#15151C] border-[#292932] text-[#A1A1AA] hover:text-white hover:border-[#E50914]/40"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    currentShelf === "watched"
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-[#F5C542]"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Watched</div>
                  <div className="text-[10px] text-[#A1A1AA] mt-0.5">
                    {currentShelf === "watched" ? "✓ Active Shelf" : "Log completed review"}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* ══ WHERE TO WATCH (OTT STREAMING PLATFORMS) ═══════════ */}
          <WhereToWatch
            tmdbId={tmdbId}
            title={displayTitle}
            mediaType={item.mediaType}
            variant="full"
          />

          {/* ══ SYNOPSIS / OVERVIEW ════════════════════════════════ */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
              Synopsis
            </h4>
            {loadingDetails ? (
              <div className="flex items-center gap-2 text-stone-500 text-xs py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Loading synopsis from TMDB...</span>
              </div>
            ) : (
              <p className="text-sm text-stone-300 leading-relaxed">
                {displayOverview}
              </p>
            )}

            {details?.genres && details.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {details.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-[#0B0B0F] text-[#A1A1AA] border border-[#292932]"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions & Deep Dive */}
          <div className="pt-2 border-t border-[#292932] flex flex-wrap items-center justify-between gap-3">
            {existingEntry && onOpenFullDetail ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullDetail(existingEntry);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E50914] hover:text-[#FF3B3B] hover:underline cursor-pointer"
              >
                <span>Open Full Journal Review &amp; Episode Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div />
            )}

            {existingEntry && (
              <button
                type="button"
                onClick={handleRemoveFromJournal}
                className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-[#FF3B3B] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove from journal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
