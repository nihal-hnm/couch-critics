/**
 * =============================================================================
 * Profile View — User Profile, Personal Cinema Ledger & Taste Identity
 * =============================================================================
 *
 * Implements full profile management and cinephile portfolio:
 *   - Displays identity (display name, @handle, avatar, bio, member since)
 *   - Supports profile editing with API sync (/api/profiles/me) + local storage fallback
 *   - Comprehensive personal cinema metrics (titles, watch time, shelf distribution)
 *   - Critic rating distribution (1-10 histogram)
 *   - Hall of Fame (top-rated favorite films)
 *   - Recent journal entries activity stream
 *   - One-click share taste ledger (URL-encoded gzip payload)
 *   - Cloud sync / guest mode status indicator
 *
 * Designed according to heydamir/unslop guidelines:
 *   - Deep graphite surfaces (#0B0B0F, #121217, #15151C)
 *   - Warm cinema amber accent (#D97706)
 *   - Tabular mono numbers, zero AI glows, sentence-case typography
 */

"use client";

import { useState, useEffect, useMemo, useId } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Calendar,
  Film,
  Tv,
  Star,
  Award,
  Clock,
  BookOpen,
  Heart,
  Share2,
  Edit3,
  Check,
  X,
  ExternalLink,
  Copy,
  TrendingUp,
  LogIn,
  LogOut,
  Layers,
  Sparkles,
} from "lucide-react";
import type { MovieEntry } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api-client";
import { computeStats, formatDaysAndHours, formatHours } from "@/lib/stats";
import { encodeSharePayload } from "@/lib/share-utils";
import { MovieImage } from "./common/MovieImage";

export interface ProfileViewProps {
  entries: MovieEntry[];
  onSelectEntry: (entry: MovieEntry) => void;
  onOpenSearch?: () => void;
}

interface ProfileState {
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  created_at: string;
}

const LOCAL_STORAGE_PROFILE_KEY = "couch_critics_user_profile";

export function ProfileView({ entries, onSelectEntry, onOpenSearch }: ProfileViewProps) {
  const { user, signOut } = useAuth();
  const usernameHelpId = useId();
  const bioCountId = useId();

  // Profile data
  const [profile, setProfile] = useState<ProfileState>({
    username: "critic",
    display_name: "Couch Critic",
    avatar_url: null,
    bio: "",
    created_at: new Date().toISOString(),
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: "",
    username: "",
    avatar_url: "",
    bio: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Share state
  const [isSharing, setIsSharing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Avatar image load error fallback
  const [avatarError, setAvatarError] = useState(false);

  // ── Load Profile Data ───────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoadingProfile(true);

      // Check localStorage first for instant display
      let cached: ProfileState | null = null;
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
        if (raw) {
          cached = JSON.parse(raw);
          if (cached && isMounted) {
            setProfile(cached);
          }
        }
      } catch {
        // Ignore JSON parse errors
      }

      if (user) {
        // Authenticated user: fetch from API
        try {
          const res = await apiClient.get<{
            id: string;
            username: string | null;
            display_name: string | null;
            avatar_url: string | null;
            bio: string | null;
            created_at: string;
          }>("/api/profiles/me");

          if (res && isMounted) {
            const defaultHandle = user.email ? user.email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "_") : "critic";
            const syncedProfile: ProfileState = {
              username: res.username || defaultHandle || "critic",
              display_name: res.display_name || user.user_metadata?.full_name || defaultHandle || "Couch Critic",
              avatar_url: res.avatar_url || user.user_metadata?.avatar_url || null,
              bio: res.bio || "",
              created_at: res.created_at || user.created_at || new Date().toISOString(),
            };
            setProfile(syncedProfile);
            try {
              localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(syncedProfile));
            } catch {
              // Ignore localStorage quota errors
            }
          }
        } catch {
          // If fetch fails (e.g. offline), use fallback based on user or cache
          if (isMounted && !cached) {
            const defaultHandle = user.email ? user.email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "_") : "critic";
            setProfile({
              username: defaultHandle,
              display_name: user.user_metadata?.full_name || defaultHandle || "Couch Critic",
              avatar_url: user.user_metadata?.avatar_url || null,
              bio: "",
              created_at: user.created_at || new Date().toISOString(),
            });
          }
        }
      } else {
        // Guest mode: fallback to cached or default guest profile
        if (isMounted && !cached) {
          const earliestDate = entries.length > 0 ? entries[0].addedAt : new Date().toISOString();
          setProfile({
            username: "guest_critic",
            display_name: "Couch Critic",
            avatar_url: null,
            bio: "Curating a personal cinema journal on Couch Critics.",
            created_at: earliestDate || new Date().toISOString(),
          });
        }
      }

      if (isMounted) {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user, entries]);

  // When opening edit mode, populate edit form
  const handleOpenEdit = () => {
    setEditForm({
      display_name: profile.display_name,
      username: profile.username,
      avatar_url: profile.avatar_url || "",
      bio: profile.bio || "",
    });
    setErrorMessage(null);
    setIsEditing(true);
  };

  // ── Save Profile Changes ────────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanUsername = editForm.username.trim();
    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      setErrorMessage("Username must be between 3 and 30 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      setErrorMessage("Username can only contain letters, numbers, hyphens, and underscores.");
      return;
    }

    const cleanDisplayName = editForm.display_name.trim();
    if (cleanDisplayName.length > 100) {
      setErrorMessage("Display name cannot exceed 100 characters.");
      return;
    }

    const cleanBio = editForm.bio.trim();
    if (cleanBio.length > 500) {
      setErrorMessage("Bio cannot exceed 500 characters.");
      return;
    }

    const cleanAvatar = editForm.avatar_url.trim();
    if (cleanAvatar && !cleanAvatar.startsWith("http://") && !cleanAvatar.startsWith("https://")) {
      setErrorMessage("Avatar URL must be a valid http or https web address.");
      return;
    }

    setIsSaving(true);

    try {
      if (user) {
        // PATCH /api/profiles/me
        await apiClient.patch("/api/profiles/me", {
          username: cleanUsername,
          display_name: cleanDisplayName || null,
          avatar_url: cleanAvatar || null,
          bio: cleanBio || null,
        });
      }

      // Update state & localStorage
      const updated: ProfileState = {
        ...profile,
        username: cleanUsername,
        display_name: cleanDisplayName || "Couch Critic",
        avatar_url: cleanAvatar || null,
        bio: cleanBio,
      };

      setProfile(updated);
      setAvatarError(false);
      try {
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
      } catch {
        // LocalStorage quota ignore
      }

      setIsEditing(false);
      setSaveSuccessToast(true);
      setTimeout(() => setSaveSuccessToast(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Copy Shareable Taste Ledger Link ─────────────────────────────────────────
  const handleShareLedger = async () => {
    setIsSharing(true);
    try {
      const encoded = await encodeSharePayload(entries, "all", profile.display_name || profile.username);
      const url = `${window.location.origin}/#share=${encoded}`;
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      // Fallback: try sharing origin URL
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } finally {
      setIsSharing(false);
    }
  };

  // ── Derived Cinema Ledger Stats ─────────────────────────────────────────────
  const stats = useMemo(() => computeStats(entries), [entries]);

  const watched = useMemo(() => entries.filter((e) => e.shelf === "watched"), [entries]);
  const watching = useMemo(() => entries.filter((e) => e.shelf === "watching"), [entries]);
  const toWatch = useMemo(() => entries.filter((e) => e.shelf === "toWatch"), [entries]);

  const moviesCount = useMemo(() => entries.filter((e) => e.tmdb.mediaType === "movie").length, [entries]);
  const seriesCount = useMemo(() => entries.filter((e) => e.tmdb.mediaType === "tv").length, [entries]);

  const reviewsCount = useMemo(
    () => entries.filter((e) => e.review?.notes && e.review.notes.trim().length > 0).length,
    [entries]
  );

  // Ratings histogram (10 down to 1)
  const ratingDistribution = useMemo(() => {
    const counts: Record<number, number> = { 10: 0, 9: 0, 8: 0, 7: 0, 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRated = 0;
    entries.forEach((e) => {
      const r = e.review?.rating;
      if (r && r >= 1 && r <= 10) {
        counts[r] = (counts[r] || 0) + 1;
        totalRated++;
      }
    });
    return { counts, totalRated };
  }, [entries]);

  // Hall of Fame: top-rated entries (ratings 8–10 or highest available)
  const topRatedEntries = useMemo(() => {
    return [...entries]
      .filter((e) => (e.review?.rating || 0) >= 8)
      .sort((a, b) => (b.review?.rating || 0) - (a.review?.rating || 0))
      .slice(0, 8);
  }, [entries]);

  // Recent journal activity stream
  const recentEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.addedAt).getTime();
        const dateB = new Date(b.updatedAt || b.addedAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [entries]);

  // Member since formatted string
  const memberSince = useMemo(() => {
    try {
      const date = new Date(profile.created_at);
      if (isNaN(date.getTime())) return "Recently joined";
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return "Recently joined";
    }
  }, [profile.created_at]);

  // Initial monogram letter
  const userInitial = (profile.display_name?.charAt(0) || profile.username?.charAt(0) || "C").toUpperCase();

  return (
    <div className="relative z-10 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Toast Banner for Success */}
      {saveSuccessToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#15151C] border border-emerald-500/30 text-emerald-400 shadow-xl shadow-black/50 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile updated successfully.</span>
        </div>
      )}

      {/* ── 1. Profile Header Card ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-[#121217] border border-[#24242E] shadow-xl">
        {/* Subtle Warm Amber Top Accent Line */}
        <div className="h-1.5 w-full bg-[#D97706]/80" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Left: Avatar + Identity + Bio */}
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                {profile.avatar_url && !avatarError ? (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-[#292932] bg-[#15151C]">
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name}
                      onError={() => setAvatarError(true)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#1C1A14] border border-[#D97706]/30 text-[#D97706] font-mono font-bold text-3xl sm:text-4xl flex items-center justify-center shadow-inner">
                    {userInitial}
                  </div>
                )}
                {user ? (
                  <div
                    className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                    title="Account verified"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                ) : null}
              </div>

              {/* Identity & Bio */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#EDEDED] tracking-tight">
                    {profile.display_name}
                  </h1>
                  <span className="font-mono text-xs sm:text-sm text-[#A1A1AA]">
                    @{profile.username}
                  </span>

                  {user ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Critic
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.05] border border-white/10 text-stone-300">
                      Guest Archivist
                    </span>
                  )}
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    Member since {memberSince}
                  </span>
                  {user?.email && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-stone-400">{user.email}</span>
                    </>
                  )}
                </div>

                {/* Bio */}
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl pt-1">
                  {profile.bio || (
                    <span className="text-stone-500 italic">
                      No cinema bio written yet. Click &ldquo;Edit profile&rdquo; to add your favorite directors, cinema philosophy, or viewing goals.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center flex-wrap gap-2.5 pt-2 md:pt-0 shrink-0">
              <button
                type="button"
                onClick={handleOpenEdit}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#15151C] hover:bg-[#1E1E26] border border-[#292932] hover:border-[#D97706]/40 text-[#EDEDED] text-xs font-semibold transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Edit profile</span>
              </button>

              <button
                type="button"
                onClick={handleShareLedger}
                disabled={isSharing}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#15151C] hover:bg-[#1E1E26] border border-[#292932] hover:border-amber-500/40 text-stone-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                title="Copy public link to share your cinema taste"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Share ledger</span>
                  </>
                )}
              </button>

              {user ? (
                <button
                  type="button"
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D97706] hover:bg-[#F59E0B] text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign in to sync</span>
                </Link>
              )}
            </div>
          </div>

          {/* Guest Sync Notice (if not signed in) */}
          {!user && (
            <div className="mt-6 pt-5 border-t border-[#24242E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#0F0F14]/70 -mx-6 -mb-6 p-4 sm:px-6 rounded-b-2xl">
              <div className="text-stone-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>
                  Guest session active. Your watchlist, reviews, and profile are saved locally on this device.
                </span>
              </div>
              <Link
                href="/login"
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors self-start sm:self-auto"
              >
                Sign in to sync across devices
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── 2. Cinema Ledger Key Metrics ─────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#EDEDED] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#D97706]" />
            Personal Cinema Ledger
          </h2>
          <span className="text-xs text-stone-500 font-mono">
            {entries.length} {entries.length === 1 ? "title" : "titles"} logged
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* 1: Total Titles */}
          <div className="p-4 rounded-xl bg-[#121217] border border-[#24242E] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-medium">Logged titles</span>
              <Film className="w-4 h-4 text-stone-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                {entries.length}
              </div>
              <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1.5">
                <span>{moviesCount} movies</span>
                <span>•</span>
                <span>{seriesCount} series</span>
              </div>
            </div>
          </div>

          {/* 2: Watch Time */}
          <div className="p-4 rounded-xl bg-[#121217] border border-[#24242E] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-medium">Total watch time</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums">
                {formatDaysAndHours(stats.totalWatchTimeMins)}
              </div>
              <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1.5">
                <span>{formatHours(stats.movieMinutes)} movies</span>
                <span>•</span>
                <span>{formatHours(stats.seriesMinutes)} series</span>
              </div>
            </div>
          </div>

          {/* 3: Shelves Completed vs Backlog */}
          <div className="p-4 rounded-xl bg-[#121217] border border-[#24242E] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-medium">Archive completed</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                {watched.length}
              </div>
              <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1.5">
                <span className="text-amber-400">{watching.length} watching</span>
                <span>•</span>
                <span>{toWatch.length} to watch</span>
              </div>
            </div>
          </div>

          {/* 4: Critic Rating */}
          <div className="p-4 rounded-xl bg-[#121217] border border-[#24242E] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-medium">Average rating</span>
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums flex items-baseline gap-1">
                {stats.averageRating > 0 ? (
                  <>
                    <span>{stats.averageRating.toFixed(1)}</span>
                    <span className="text-xs text-stone-500 font-normal">/ 10</span>
                  </>
                ) : (
                  <span className="text-stone-500 text-xl font-normal">Unrated</span>
                )}
              </div>
              <div className="text-[11px] text-stone-400 mt-1">
                {reviewsCount} written {reviewsCount === 1 ? "review" : "reviews"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Ratings Distribution & Favorite Genres ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Histogram */}
        <section className="p-5 rounded-2xl bg-[#121217] border border-[#24242E] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#EDEDED] flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Rating Distribution
            </h3>
            <span className="text-xs font-mono text-stone-500">
              {ratingDistribution.totalRated} rated
            </span>
          </div>

          {ratingDistribution.totalRated === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500">
              No ratings logged yet. Review and rate titles to see your curve.
            </div>
          ) : (
            <div className="space-y-1.5">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((r) => {
                const count = ratingDistribution.counts[r] || 0;
                const percentage =
                  ratingDistribution.totalRated > 0
                    ? Math.round((count / ratingDistribution.totalRated) * 100)
                    : 0;

                return (
                  <div key={r} className="flex items-center gap-2.5 text-xs">
                    <span className="w-5 text-right font-mono text-stone-400 font-medium">
                      {r}★
                    </span>
                    <div className="flex-1 h-3 rounded bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full bg-[#D97706] rounded transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-stone-400 tabular-nums text-[11px]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Favorite Genres breakdown */}
        <section className="p-5 rounded-2xl bg-[#121217] border border-[#24242E] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#EDEDED] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D97706]" />
              Top Genres in Library
            </h3>
            <span className="text-xs font-mono text-stone-500">
              {stats.favoriteGenres.length} genres
            </span>
          </div>

          {stats.favoriteGenres.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500">
              Add movies and series to reveal your genre taste profile.
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.favoriteGenres.slice(0, 6).map(({ genre, count }) => {
                const pct = entries.length > 0 ? Math.round((count / entries.length) * 100) : 0;
                return (
                  <div key={genre} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-300 font-medium">{genre}</span>
                      <span className="font-mono text-stone-400 text-[11px]">
                        {count} titles ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full bg-amber-500/80 rounded transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── 4. Hall of Fame / Favorite Top-Rated Films ───────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#EDEDED] flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-500" />
              Hall of Fame &amp; Top Rated
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Titles in your archive with a rating of 8 or higher
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {topRatedEntries.length} {topRatedEntries.length === 1 ? "masterpiece" : "masterpieces"}
          </span>
        </div>

        {topRatedEntries.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#121217] border border-[#24242E] text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">No 8+ rated titles yet</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              As you watch and review films with an 8, 9, or 10 rating, your personal cinema Hall of Fame will assemble here.
            </p>
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#F59E0B] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Search &amp; Add Titles
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
            {topRatedEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="group cursor-pointer rounded-xl bg-[#121217] border border-[#24242E] hover:border-amber-500/40 overflow-hidden transition-all duration-150 flex flex-col"
              >
                <div className="aspect-[2/3] relative bg-[#181820] overflow-hidden">
                  <MovieImage
                    src={entry.tmdb.posterUrl}
                    alt={entry.tmdb.title}
                    title={entry.tmdb.title}
                    mediaType={entry.tmdb.mediaType}
                    className="w-full h-full object-cover"
                  />
                  {entry.review?.rating && (
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      {entry.review.rating}
                    </div>
                  )}
                </div>
                <div className="p-2 flex-1 flex flex-col justify-between">
                  <div className="text-xs font-medium text-white truncate group-hover:text-amber-400 transition-colors">
                    {entry.tmdb.title}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5 flex items-center justify-between">
                    <span>{entry.tmdb.releaseYear}</span>
                    <span className="uppercase text-[9px] text-stone-500">{entry.tmdb.mediaType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 5. Recent Journal Activity Stream ─────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#EDEDED] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-stone-400" />
            Recent Journal Activity
          </h2>
          <span className="text-xs text-stone-500">Latest updates</span>
        </div>

        {recentEntries.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#121217] border border-[#24242E] text-center text-xs text-stone-500">
            No entries in your journal yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentEntries.map((entry) => {
              const shelfLabel =
                entry.shelf === "watched"
                  ? "Watched"
                  : entry.shelf === "watching"
                    ? "In Progress"
                    : "To Watch";
              const shelfBadgeClass =
                entry.shelf === "watched"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : entry.shelf === "watching"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-white/5 text-stone-300 border-white/10";

              return (
                <div
                  key={entry.id}
                  onClick={() => onSelectEntry(entry)}
                  className="p-3 rounded-xl bg-[#121217] border border-[#24242E] hover:border-[#3D3D4C] transition-colors cursor-pointer flex items-center gap-3 group"
                >
                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#181820] shrink-0 border border-white/5">
                    <MovieImage
                      src={entry.tmdb.posterUrl}
                      alt={entry.tmdb.title}
                      title={entry.tmdb.title}
                      mediaType={entry.tmdb.mediaType}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${shelfBadgeClass}`}>
                        {shelfLabel}
                      </span>
                      {entry.review?.rating ? (
                        <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          {entry.review.rating}/10
                        </span>
                      ) : null}
                    </div>
                    <h4 className="text-xs font-semibold text-white truncate mt-1 group-hover:text-amber-400 transition-colors">
                      {entry.tmdb.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {entry.tmdb.releaseYear} • {entry.tmdb.genres?.slice(0, 2).join(", ") || entry.tmdb.mediaType}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 6. Profile Edit Modal ────────────────────────────────────────────── */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="w-full max-w-lg rounded-2xl bg-[#15151C] border border-[#292932] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#292932]">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#D97706]" />
                <h3 id="edit-profile-title" className="text-base font-bold text-white">Edit Critic Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close profile editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Display Name */}
              <div className="space-y-1.5">
                <label htmlFor="profile-display-name" className="block text-xs font-medium text-stone-300">
                  Display name
                </label>
                <input
                  id="profile-display-name"
                  type="text"
                  value={editForm.display_name}
                  onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                  placeholder="e.g. Stanley Kubrick"
                  maxLength={100}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-[#292932] text-white text-xs placeholder-stone-600 focus:outline-none focus:border-[#D97706] transition-colors"
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="profile-username" className="block text-xs font-medium text-stone-300">
                  Username (@handle)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-stone-500 text-xs font-mono">@</span>
                  <input
                    id="profile-username"
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    placeholder="critic_handle"
                    maxLength={30}
                    aria-describedby={usernameHelpId}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-[#292932] text-white font-mono text-xs placeholder-stone-600 focus:outline-none focus:border-[#D97706] transition-colors"
                  />
                </div>
                <p id={usernameHelpId} className="text-[11px] text-stone-500">
                  3–30 characters. Letters, numbers, hyphens, and underscores only.
                </p>
              </div>

              {/* Avatar URL */}
              <div className="space-y-1.5">
                <label htmlFor="profile-avatar-url" className="block text-xs font-medium text-stone-300">
                  Avatar image URL (optional)
                </label>
                <input
                  id="profile-avatar-url"
                  type="url"
                  value={editForm.avatar_url}
                  onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-[#292932] text-white text-xs placeholder-stone-600 focus:outline-none focus:border-[#D97706] transition-colors"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="profile-bio" className="block text-xs font-medium text-stone-300">
                    Cinema Bio
                  </label>
                  <span id={bioCountId} className="text-[10px] font-mono text-stone-500">
                    {editForm.bio.length}/500
                  </span>
                </div>
                <textarea
                  id="profile-bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Share your cinema philosophy, favorite eras, or current viewing challenges..."
                  maxLength={500}
                  rows={3}
                  aria-describedby={bioCountId}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F14] border border-[#292932] text-white text-xs placeholder-stone-600 focus:outline-none focus:border-[#D97706] transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#292932]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#D97706] hover:bg-[#F59E0B] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
