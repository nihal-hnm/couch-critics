/**
 * =============================================================================
 * Diary View — Chronological Film & Series Watch Log
 * =============================================================================
 *
 * Modeled after Letterboxd's Diary:
 *   - Groups watched titles chronologically by Year & Month
 *   - Displays date watched, film poster, ratings, review excerpts & tags
 *   - Monthly consumption summaries (titles watched, total runtime, avg rating)
 *   - Interactive: clicking any diary entry opens the full MediaDetailModal
 */

"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Star,
  Clock,
  Film,
  Tv,
  BookOpen,
  Filter,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { MovieEntry } from "@/lib/types";
import { MovieImage } from "./common/MovieImage";

interface DiaryViewProps {
  entries: MovieEntry[];
  onSelectEntry: (entry: MovieEntry) => void;
}

interface MonthGroup {
  monthKey: string; // e.g. "2026-11"
  monthName: string; // e.g. "November 2026"
  totalRuntimeHours: number;
  averageRating: number;
  entries: MovieEntry[];
}

export function DiaryView({ entries, onSelectEntry }: DiaryViewProps) {
  const [mediaFilter, setMediaFilter] = useState<"all" | "movie" | "tv">("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // Only consider watched entries with a date
  const watchedEntries = useMemo(() => {
    return entries.filter((e) => e.shelf === "watched");
  }, [entries]);

  // Extract all available years
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    watchedEntries.forEach((e) => {
      const dateStr = e.review?.dateCompleted || e.updatedAt || e.addedAt;
      if (dateStr) {
        const yr = new Date(dateStr).getFullYear();
        if (!isNaN(yr)) years.add(String(yr));
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [watchedEntries]);

  // Group by Month
  const monthGroups: MonthGroup[] = useMemo(() => {
    const groupsMap = new Map<string, MovieEntry[]>();

    const filtered = watchedEntries.filter((e) => {
      const matchesMedia = mediaFilter === "all" || e.tmdb.mediaType === mediaFilter;
      if (!matchesMedia) return false;

      if (selectedYear !== "all") {
        const dateStr = e.review?.dateCompleted || e.updatedAt || e.addedAt;
        const yr = String(new Date(dateStr).getFullYear());
        if (yr !== selectedYear) return false;
      }
      return true;
    });

    // Sort chronologically descending (newest watched first)
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.review?.dateCompleted || a.updatedAt || a.addedAt).getTime();
      const dateB = new Date(b.review?.dateCompleted || b.updatedAt || b.addedAt).getTime();
      return dateB - dateA;
    });

    sorted.forEach((e) => {
      const date = new Date(e.review?.dateCompleted || e.updatedAt || e.addedAt);
      const yr = isNaN(date.getFullYear()) ? 2026 : date.getFullYear();
      const mo = isNaN(date.getMonth()) ? 0 : date.getMonth() + 1;
      const key = `${yr}-${String(mo).padStart(2, "0")}`;

      if (!groupsMap.has(key)) {
        groupsMap.set(key, []);
      }
      groupsMap.get(key)!.push(e);
    });

    const result: MonthGroup[] = [];
    groupsMap.forEach((groupEntries, key) => {
      const [y, m] = key.split("-");
      const dateObj = new Date(Number(y), Number(m) - 1, 1);
      const monthName = dateObj.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const totalMins = groupEntries.reduce((sum, e) => sum + (e.tmdb.runtime || 100), 0);
      const hours = Math.round((totalMins / 60) * 10) / 10;

      const rated = groupEntries.filter((e) => e.review?.rating && e.review.rating > 0);
      const avg =
        rated.length > 0
          ? Math.round((rated.reduce((sum, e) => sum + (e.review?.rating || 0), 0) / rated.length) * 10) / 10
          : 0;

      result.push({
        monthKey: key,
        monthName,
        totalRuntimeHours: hours,
        averageRating: avg,
        entries: groupEntries,
      });
    });

    return result;
  }, [watchedEntries, mediaFilter, selectedYear]);

  if (watchedEntries.length === 0) {
    return (
      <div className="text-center py-20 bg-[#15151C] rounded-2xl border border-[#292932]">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#D97706]">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Diary Entries Yet</h3>
        <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
          Whenever you mark a film or series as &ldquo;Watched&rdquo;, it gets chronologically logged
          here with your rating and review notes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Filter Bar ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#15151C] border border-[#292932]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#D97706]" />
          <span className="text-sm font-bold text-white">Film &amp; Series Watch Diary</span>
          <span className="text-xs text-[#A1A1AA] font-mono">
            ({watchedEntries.length} total entries)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Media Type Filter */}
          <div className="flex items-center gap-1 bg-[#0B0B0F] p-1 rounded-xl border border-[#292932]">
            <button
              onClick={() => setMediaFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mediaFilter === "all"
                  ? "bg-[#D97706] text-white shadow-sm"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setMediaFilter("movie")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mediaFilter === "movie"
                  ? "bg-[#D97706] text-white shadow-sm"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setMediaFilter("tv")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mediaFilter === "tv"
                  ? "bg-[#D97706] text-white shadow-sm"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Series
            </button>
          </div>

          {/* Year Filter */}
          {availableYears.length > 1 && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#0B0B0F] border border-[#292932] text-xs text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── Diary Month Timeline ──────────────────────────────────── */}
      <div className="space-y-8">
        {monthGroups.map((group) => (
          <div key={group.monthKey} className="space-y-4">
            {/* Month Header Banner */}
            <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#292932] gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F5C542]" />
                <h3 className="text-lg font-bold text-white font-mono">{group.monthName}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#A1A1AA]">
                <span className="font-semibold text-white">
                  {group.entries.length} {group.entries.length === 1 ? "title" : "titles"}
                </span>
                <span>•</span>
                <span>{group.totalRuntimeHours} hrs watched</span>
                {group.averageRating > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-[#F5C542] flex items-center gap-1 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-[#F5C542]" />
                      {group.averageRating}/10 avg
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Entries Log List */}
            <div className="space-y-2">
              {group.entries.map((entry) => {
                const isTV = entry.tmdb.mediaType === "tv";
                const date = new Date(entry.review?.dateCompleted || entry.updatedAt || entry.addedAt);
                const dayNum = isNaN(date.getDate()) ? 1 : date.getDate();
                const dayName = isNaN(date.getDay())
                  ? ""
                  : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];

                return (
                  <div
                    key={entry.id}
                    onClick={() => onSelectEntry(entry)}
                    className="p-3 sm:p-4 rounded-xl bg-[#15151C] hover:bg-[#1A1A24] border border-[#292932] hover:border-[#3D3D4C] transition-all flex items-center gap-3 sm:gap-4 cursor-pointer group"
                  >
                    {/* Date Block */}
                    <div className="w-12 text-center shrink-0">
                      <span className="block text-xl font-bold font-mono text-white leading-none">
                        {String(dayNum).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#A1A1AA] tracking-wider">
                        {dayName}
                      </span>
                    </div>

                    {/* Poster Thumbnail */}
                    <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-[#0B0B0F] border border-[#292932] shadow-sm">
                      <MovieImage
                        src={entry.tmdb.posterUrl}
                        alt={entry.tmdb.title}
                        title={entry.tmdb.title}
                        mediaType={entry.tmdb.mediaType}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        fallbackIconClassName="w-5 h-5 text-stone-600"
                      />
                    </div>

                    {/* Title & Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white truncate text-sm sm:text-base group-hover:text-[#D97706] transition-colors">
                          {entry.tmdb.title}
                        </h4>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-white/5 border border-white/10 text-[#A1A1AA] shrink-0">
                          {isTV ? "TV" : "Movie"}
                        </span>
                        {entry.tmdb.releaseYear && (
                          <span className="text-xs text-[#A1A1AA] hidden sm:inline">
                            ({entry.tmdb.releaseYear})
                          </span>
                        )}
                      </div>

                      {/* Review excerpt or notes */}
                      {entry.review?.notes ? (
                        <p className="text-xs text-stone-300 italic line-clamp-1 mt-0.5">
                          &ldquo;{entry.review.notes}&rdquo;
                        </p>
                      ) : (
                        <p className="text-xs text-[#A1A1AA] truncate mt-0.5">
                          {entry.tmdb.genres.slice(0, 3).join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Rating & Arrow */}
                    <div className="flex items-center gap-3 shrink-0">
                      {entry.review?.rating ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 border border-[#F5C542]/30 text-[#F5C542] text-xs font-bold font-mono">
                          <Star className="w-3.5 h-3.5 fill-[#F5C542]" />
                          <span>{entry.review.rating}/10</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#A1A1AA] italic hidden sm:inline">Watched</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
