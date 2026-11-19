/**
 * =============================================================================
 * Cinema Match Modal — Friends Taste Compatibility & Movie Night Finder
 * =============================================================================
 *
 * Compares two Couch Critics journals (via public share link or compressed hash):
 *  - Computes a mathematical Taste Compatibility Score (0 - 100%)
 *  - Finds "Both Loved" (titles both users rated 8+)
 *  - Finds "Hot Takes" (titles with biggest rating divergence)
 *  - Finds "Movie Night Picks" (common backlog titles you both haven't seen yet)
 */

"use client";

import { useState, useMemo } from "react";
import {
  X,
  Users,
  Sparkles,
  Heart,
  Flame,
  Film,
  Star,
  Clock,
  Plus,
  ArrowRight,
  CheckCircle2,
  Share2,
} from "lucide-react";
import type { MovieEntry } from "@/lib/types";
import { decodeSharePayload, type SharedJournalPayload } from "@/lib/share-utils";
import { MovieImage } from "./common/MovieImage";
import { useJournal } from "@/lib/journal-context";

interface CinemaMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  myEntries: MovieEntry[];
}

// Sample demo friend for instant 1-click preview
const DEMO_FRIEND_ENTRIES: MovieEntry[] = [
  {
    id: "demo-1",
    shelf: "watched",
    tmdb: {
      tmdbId: 157336,
      title: "Interstellar",
      posterUrl: "https://image.tmdb.org/t/p/w342/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdropUrl: null,
      releaseYear: "2014",
      runtime: 169,
      genres: ["Adventure", "Drama", "Sci-Fi"],
      director: "Christopher Nolan",
      overview: "",
      mediaType: "movie",
    },
    review: { rating: 10, notes: "Masterpiece in cinema history", tags: ["favorite", "sci-fi"], dateCompleted: "2026-01-01T00:00:00.000Z" },
    addedAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "demo-2",
    shelf: "watched",
    tmdb: {
      tmdbId: 496243,
      title: "Parasite",
      posterUrl: "https://image.tmdb.org/t/p/w342/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      backdropUrl: null,
      releaseYear: "2019",
      runtime: 132,
      genres: ["Comedy", "Thriller", "Drama"],
      director: "Bong Joon-ho",
      overview: "",
      mediaType: "movie",
    },
    review: { rating: 9, notes: "Flawless script", tags: ["masterpiece"], dateCompleted: "2026-01-02T00:00:00.000Z" },
    addedAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "demo-3",
    shelf: "watched",
    tmdb: {
      tmdbId: 872585,
      title: "Oppenheimer",
      posterUrl: "https://image.tmdb.org/t/p/w342/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdropUrl: null,
      releaseYear: "2023",
      runtime: 180,
      genres: ["Drama", "History"],
      director: "Christopher Nolan",
      overview: "",
      mediaType: "movie",
    },
    review: { rating: 9, notes: "Incredible sound and acting", tags: [], dateCompleted: "2026-01-03T00:00:00.000Z" },
    addedAt: "2026-01-03T00:00:00.000Z",
    updatedAt: "2026-01-03T00:00:00.000Z",
  },
  {
    id: "demo-4",
    shelf: "watched",
    tmdb: {
      tmdbId: 693134,
      title: "Dune: Part Two",
      posterUrl: "https://image.tmdb.org/t/p/w342/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      backdropUrl: null,
      releaseYear: "2024",
      runtime: 166,
      genres: ["Sci-Fi", "Adventure"],
      director: "Denis Villeneuve",
      overview: "",
      mediaType: "movie",
    },
    review: { rating: 9, notes: "Audio-visual triumph", tags: [], dateCompleted: "2026-01-04T00:00:00.000Z" },
    addedAt: "2026-01-04T00:00:00.000Z",
    updatedAt: "2026-01-04T00:00:00.000Z",
  },
  {
    id: "demo-5",
    shelf: "watched",
    tmdb: {
      tmdbId: 550,
      title: "Fight Club",
      posterUrl: "https://image.tmdb.org/t/p/w342/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      backdropUrl: null,
      releaseYear: "1999",
      runtime: 139,
      genres: ["Drama", "Thriller"],
      director: "David Fincher",
      overview: "",
      mediaType: "movie",
    },
    review: { rating: 4, notes: "Overrated cult classic", tags: [], dateCompleted: "2026-01-05T00:00:00.000Z" },
    addedAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "demo-6",
    shelf: "toWatch",
    tmdb: {
      tmdbId: 329,
      title: "Jurassic Park",
      posterUrl: "https://image.tmdb.org/t/p/w342/b1x09r9429p6eOuxz0I8bgqy7N.jpg",
      backdropUrl: null,
      releaseYear: "1993",
      runtime: 127,
      genres: ["Adventure", "Sci-Fi"],
      director: "Steven Spielberg",
      overview: "",
      mediaType: "movie",
    },
    addedAt: "2026-01-06T00:00:00.000Z",
    updatedAt: "2026-01-06T00:00:00.000Z",
  },
  {
    id: "demo-7",
    shelf: "toWatch",
    tmdb: {
      tmdbId: 77338,
      title: "Severance",
      posterUrl: "https://image.tmdb.org/t/p/w342/lHdrG7qS4d2b2s0X5b0Y0F0qY.jpg",
      backdropUrl: null,
      releaseYear: "2022",
      runtime: 55,
      genres: ["Drama", "Mystery", "Sci-Fi"],
      director: "Ben Stiller",
      overview: "",
      mediaType: "tv",
    },
    addedAt: "2026-01-07T00:00:00.000Z",
    updatedAt: "2026-01-07T00:00:00.000Z",
  },
];

export function CinemaMatchModal({
  isOpen,
  onClose,
  myEntries,
}: CinemaMatchModalProps) {
  const { addEntry } = useJournal();
  const [inputUrl, setInputUrl] = useState("");
  const [friendPayload, setFriendPayload] = useState<SharedJournalPayload | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"movieNight" | "bothLoved" | "hotTakes">("movieNight");
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  // Handle parsing friend's share link or raw code
  async function handleCompare(rawString: string) {
    if (!rawString.trim()) return;
    setIsDecoding(true);
    setDecodeError(null);

    try {
      let code = rawString.trim();

      // Extract hash or query param if user pasted full URL
      if (code.includes("#d=")) {
        code = code.split("#d=")[1].split("&")[0];
      } else if (code.includes("?d=")) {
        code = code.split("?d=")[1].split("&")[0];
      } else if (code.includes("#data=")) {
        code = code.split("#data=")[1].split("&")[0];
      }

      const decoded = await decodeSharePayload(code);
      if (decoded && decoded.entries.length > 0) {
        setFriendPayload(decoded);
      } else {
        setDecodeError("Could not decode valid cinema data from this link. Make sure it's a Couch Critics share link.");
      }
    } catch {
      setDecodeError("Invalid share link format. Please try again.");
    } finally {
      setIsDecoding(false);
    }
  }

  function handleLoadDemo() {
    setFriendPayload({
      userName: "Alex (Film Buff)",
      createdAt: Date.now(),
      scope: "all",
      entries: DEMO_FRIEND_ENTRIES,
      stats: {
        total: DEMO_FRIEND_ENTRIES.length,
        watchedCount: 5,
        watchingCount: 0,
        toWatchCount: 2,
        avgRating: 8.2,
        topGenres: ["Sci-Fi", "Drama", "Thriller"],
      },
    });
    setDecodeError(null);
  }

  // Calculate Cinema Compatibility Metrics
  const matchResult = useMemo(() => {
    if (!friendPayload) return null;

    const friendEntries = friendPayload.entries;
    const friendName = friendPayload.userName || "Friend";

    // Index my entries
    const myWatchedByTmdb = new Map<number, MovieEntry>();
    const myToWatchByTmdb = new Map<number, MovieEntry>();
    const myTitles = new Map<string, MovieEntry>();

    myEntries.forEach((e) => {
      if (e.shelf === "watched") myWatchedByTmdb.set(e.tmdb.tmdbId, e);
      if (e.shelf === "toWatch") myToWatchByTmdb.set(e.tmdb.tmdbId, e);
      myTitles.set(e.tmdb.title.toLowerCase().trim(), e);
    });

    const commonWatched: {
      mine: MovieEntry;
      theirs: MovieEntry;
      ratingDiff: number;
    }[] = [];

    const bothLoved: {
      mine: MovieEntry;
      theirs: MovieEntry;
    }[] = [];

    const hotTakes: {
      mine: MovieEntry;
      theirs: MovieEntry;
      ratingDiff: number;
    }[] = [];

    const movieNightPicks: MovieEntry[] = [];

    // Compare friend entries
    friendEntries.forEach((friendEntry) => {
      const match =
        myWatchedByTmdb.get(friendEntry.tmdb.tmdbId) ||
        myTitles.get(friendEntry.tmdb.title.toLowerCase().trim());

      // If both watched
      if (match && match.shelf === "watched" && friendEntry.shelf === "watched") {
        const myR = match.review?.rating || 7;
        const theirR = friendEntry.review?.rating || 7;
        const diff = Math.abs(myR - theirR);

        commonWatched.push({ mine: match, theirs: friendEntry, ratingDiff: diff });

        if (myR >= 8 && theirR >= 8) {
          bothLoved.push({ mine: match, theirs: friendEntry });
        } else if (diff >= 3) {
          hotTakes.push({ mine: match, theirs: friendEntry, ratingDiff: diff });
        }
      }

      // If Movie Night Pick:
      // (1) Both have it in toWatch backlog
      // (2) Friend rated it 8+ and I have it in toWatch
      // (3) Friend has it in toWatch and I haven't watched it yet
      const amWatchingOrWatched =
        myWatchedByTmdb.has(friendEntry.tmdb.tmdbId) ||
        (match && match.shelf === "watching");

      const inMyBacklog = myToWatchByTmdb.has(friendEntry.tmdb.tmdbId);

      if (!amWatchingOrWatched) {
        const alreadyInPicks = movieNightPicks.some((p) => p.tmdb.tmdbId === friendEntry.tmdb.tmdbId);
        if (!alreadyInPicks) {
          if (inMyBacklog && (friendEntry.shelf === "toWatch" || (friendEntry.review?.rating || 0) >= 8)) {
            movieNightPicks.push(friendEntry);
          } else if (friendEntry.shelf === "toWatch") {
            movieNightPicks.push(friendEntry);
          }
        }
      }
    });

    // Score calculation
    let score = 75; // baseline starting match
    if (commonWatched.length > 0) {
      const avgDiff =
        commonWatched.reduce((acc, curr) => acc + curr.ratingDiff, 0) / commonWatched.length;
      // If average difference is 0 -> 98%. If avg diff is 4 -> 60%.
      score = Math.max(45, Math.min(99, Math.round(98 - avgDiff * 9.5)));
    } else {
      score = 84; // default friendly pairing
    }

    return {
      friendName,
      score,
      bothLoved,
      hotTakes,
      movieNightPicks,
      totalCompared: commonWatched.length,
    };
  }, [friendPayload, myEntries]);

  function handleAddMovieNightPick(entry: MovieEntry) {
    addEntry({
      ...entry,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      shelf: "toWatch",
      review: undefined,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setAddedIds((prev) => new Set(prev).add(entry.tmdb.tmdbId));
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/85 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#15151C] border border-[#292932] rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="p-5 sm:p-6 border-b border-[#292932] bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-stone-200"><Users className="w-5 h-5" /></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                  Taste compatibility
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mt-0.5">
                Cinema Compatibility
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Link Input Section ── */}
        {!matchResult ? (
          <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-center">
            <div className="text-center max-w-md mx-auto space-y-2">
              <Users className="w-8 h-8 text-stone-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Compare taste with a friend</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Compare watch history, ratings, and common titles with a friend's public journal.
              </p>
            </div>

            <div className="max-w-lg mx-auto w-full space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Paste public share link..."
                  className="flex-1 bg-[#0B0B0F] border border-[#292932] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#D97706]"
                />
                <button
                  onClick={() => handleCompare(inputUrl)}
                  disabled={isDecoding || !inputUrl.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#F59E0B] disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {isDecoding ? "Matching..." : "Compare"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {decodeError && (
                <p className="text-xs text-red-400 text-center">{decodeError}</p>
              )}

              <div className="pt-2 text-center">
                <span className="text-[11px] text-[#A1A1AA]">Don&apos;t have a friend&apos;s link right now?</span>
                <button
                  onClick={handleLoadDemo}
                  className="ml-2 text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer"
                >
                  Try with sample friend (Alex)
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ── Match Results Top Banner ── */}
            <div className="p-5 sm:p-6 bg-[#0B0B0F] border-b border-[#292932] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-semibold font-mono text-stone-100 tabular-nums">
                    {matchResult.score}%
                  </span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {matchResult.score >= 85
                      ? "High taste match"
                      : matchResult.score >= 70
                        ? "Strong overlap"
                        : "Varied tastes"}
                  </h4>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Compatibility with <strong className="text-white">{matchResult.friendName}</strong>
                    {matchResult.totalCompared > 0 && ` (${matchResult.totalCompared} shared titles compared)`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setFriendPayload(null)}
                className="text-xs text-stone-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-colors self-start sm:self-auto cursor-pointer"
              >
                Compare another link
              </button>
            </div>

            {/* ── Tabs Selector ── */}
            <div className="px-5 py-3 border-b border-[#292932] bg-[#15151C] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab("movieNight")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === "movieNight"
                    ? "bg-[#D97706] text-white shadow-sm"
                    : "text-[#A1A1AA] hover:text-white bg-white/5"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Movie Night Picks ({matchResult.movieNightPicks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("bothLoved")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === "bothLoved"
                    ? "bg-[#D97706] text-white shadow-sm"
                    : "text-[#A1A1AA] hover:text-white bg-white/5"
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
                <span>Both Loved ({matchResult.bothLoved.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("hotTakes")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === "hotTakes"
                    ? "bg-[#D97706] text-white shadow-sm"
                    : "text-[#A1A1AA] hover:text-white bg-white/5"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Split Opinions ({matchResult.hotTakes.length})</span>
              </button>
            </div>

            {/* ── Tab Content Grid ── */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 hide-scrollbar space-y-4">
              {activeTab === "movieNight" && (
                <div>
                  <p className="text-xs text-[#A1A1AA] mb-4">
                    Titles on both of your backlogs or highly recommended by {matchResult.friendName} that you haven&apos;t watched yet:
                  </p>
                  {matchResult.movieNightPicks.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.02] border border-[#292932] rounded-2xl text-xs text-stone-400">
                      No common backlog titles found. Add titles to your backlog to plan your next watch party!
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {matchResult.movieNightPicks.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex gap-3 p-3 rounded-2xl bg-[#0B0B0F] border border-[#292932] items-center"
                        >
                          <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-white/10">
                            <MovieImage
                              src={entry.tmdb.posterUrl}
                              alt={entry.tmdb.title}
                              title={entry.tmdb.title}
                              mediaType={entry.tmdb.mediaType}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-bold text-white truncate">{entry.tmdb.title}</h5>
                            <p className="text-xs text-[#A1A1AA] font-mono mt-0.5">
                              {entry.tmdb.releaseYear} • {entry.tmdb.mediaType === "tv" ? "TV Series" : "Movie"}
                            </p>
                            <span className="inline-block mt-1 text-[10px] text-amber-400 font-medium">
                              On {matchResult.friendName}&apos;s list
                            </span>
                          </div>
                          {!addedIds.has(entry.tmdb.tmdbId) ? (
                            <button
                              onClick={() => handleAddMovieNightPick(entry)}
                              className="p-2 rounded-xl bg-[#D97706]/20 hover:bg-[#D97706] text-[#D97706] hover:text-white border border-[#D97706]/40 transition-all cursor-pointer shrink-0"
                              title="Add to my backlog"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "bothLoved" && (
                <div>
                  <p className="text-xs text-[#A1A1AA] mb-4">
                    Films and series where you both gave 8/10 or higher ratings:
                  </p>
                  {matchResult.bothLoved.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.02] border border-[#292932] rounded-2xl text-xs text-stone-400">
                      No mutual 8+ rated titles yet. Rate more watched titles to find shared favorites!
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {matchResult.bothLoved.map(({ mine, theirs }) => (
                        <div
                          key={mine.id}
                          className="flex gap-3 p-3 rounded-2xl bg-[#0B0B0F] border border-emerald-500/30 items-center"
                        >
                          <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-white/10">
                            <MovieImage
                              src={mine.tmdb.posterUrl}
                              alt={mine.tmdb.title}
                              title={mine.tmdb.title}
                              mediaType={mine.tmdb.mediaType}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-bold text-white truncate">{mine.tmdb.title}</h5>
                            <p className="text-xs text-[#A1A1AA] font-mono mt-0.5">{mine.tmdb.releaseYear}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs font-mono">
                              <span className="text-amber-300 font-bold">You: {mine.review?.rating}★</span>
                              <span className="text-emerald-400 font-bold">{matchResult.friendName}: {theirs.review?.rating}★</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "hotTakes" && (
                <div>
                  <p className="text-xs text-[#A1A1AA] mb-4">
                    Titles where your ratings diverged the most (differences of 3+ points):
                  </p>
                  {matchResult.hotTakes.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.02] border border-[#292932] rounded-2xl text-xs text-stone-400">
                      Zero major disagreements! Your tastes are remarkably aligned.
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {matchResult.hotTakes.map(({ mine, theirs, ratingDiff }) => (
                        <div
                          key={mine.id}
                          className="flex gap-3 p-3 rounded-2xl bg-[#0B0B0F] border border-amber-500/30 items-center"
                        >
                          <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-white/10">
                            <MovieImage
                              src={mine.tmdb.posterUrl}
                              alt={mine.tmdb.title}
                              title={mine.tmdb.title}
                              mediaType={mine.tmdb.mediaType}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-bold text-white truncate">{mine.tmdb.title}</h5>
                            <span className="text-[10px] text-amber-400 font-mono">
                              {ratingDiff} point rating split
                            </span>
                            <div className="flex items-center gap-3 mt-1.5 text-xs font-mono">
                              <span className="text-white">You: <strong>{mine.review?.rating || "—"}★</strong></span>
                              <span className="text-stone-400">{matchResult.friendName}: <strong>{theirs.review?.rating || "—"}★</strong></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CinemaMatchModal;
