"use client";

import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Play, Search, Tv } from "lucide-react";
import type { TitleWatchInfo } from "@/lib/streaming-types";
import { getVerifiedWatchInfo, getJustWatchSearchUrl } from "@/lib/streaming-registry";

interface WhereToWatchProps {
  tmdbId?: number | null;
  title: string;
  mediaType?: "movie" | "tv";
  variant?: "full" | "compact";
  className?: string;
  showHeading?: boolean;
}

// Global In-Memory and In-Flight Request Cache to prevent duplicate calls across cards
const providersMemoryCache = new Map<string, TitleWatchInfo>();
const pendingRequests = new Map<string, Promise<TitleWatchInfo>>();

function getCacheKey(tmdbId?: number | null, title?: string, mediaType?: "movie" | "tv"): string {
  if (tmdbId) return `wtw-${mediaType || "movie"}-${tmdbId}`;
  return `wtw-${mediaType || "movie"}-${(title || "").toLowerCase().trim()}`;
}

export function WhereToWatch({
  tmdbId,
  title,
  mediaType = "movie",
  variant = "full",
  className = "",
  showHeading = true,
}: WhereToWatchProps) {
  const cacheKey = useMemo(() => getCacheKey(tmdbId, title, mediaType), [tmdbId, title, mediaType]);

  // Check verified curated registry first (0ms, zero network)
  const verifiedData = useMemo(() => {
    return getVerifiedWatchInfo(tmdbId, title, mediaType);
  }, [tmdbId, title, mediaType]);

  // Check memory / session cache
  const cachedData = useMemo(() => {
    if (verifiedData) return verifiedData;
    if (providersMemoryCache.has(cacheKey)) {
      return providersMemoryCache.get(cacheKey)!;
    }
    if (typeof window !== "undefined") {
      try {
        const item = sessionStorage.getItem(`couch-${cacheKey}`);
        if (item) {
          const parsed = JSON.parse(item) as TitleWatchInfo;
          providersMemoryCache.set(cacheKey, parsed);
          return parsed;
        }
      } catch {}
    }
    return null;
  }, [verifiedData, cacheKey]);

  const [watchInfo, setWatchInfo] = useState<TitleWatchInfo | null>(cachedData);
  const [loading, setLoading] = useState<boolean>(!cachedData && variant === "full");

  useEffect(() => {
    if (cachedData) {
      setWatchInfo(cachedData);
      setLoading(false);
      return;
    }

    // Performance optimization: on compact shelf cards (200+ items), do NOT blast 200 API calls!
    // Compact cards use the direct JustWatch search link unless cached.
    // Full variant (inside MediaDetailModal) performs the live provider lookup on-demand.
    if (variant === "compact") {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const queryParams = new URLSearchParams({
      mediaType,
      title: title || "",
    });
    if (tmdbId) queryParams.set("tmdbId", String(tmdbId));

    // Deduplicate in-flight requests
    let fetchPromise = pendingRequests.get(cacheKey);
    if (!fetchPromise) {
      fetchPromise = fetch(`/api/watch-providers?${queryParams.toString()}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load providers");
          return res.json();
        })
        .then((data: TitleWatchInfo) => {
          providersMemoryCache.set(cacheKey, data);
          try {
            sessionStorage.setItem(`couch-${cacheKey}`, JSON.stringify(data));
          } catch {}
          return data;
        })
        .catch((err) => {
          const fallback: TitleWatchInfo = {
            tmdbId: tmdbId ?? undefined,
            title,
            type: mediaType === "tv" ? "series" : "movie",
            platforms: [],
            justWatchUrl: getJustWatchSearchUrl(title),
            region: "IN",
            isVerified: false,
          };
          providersMemoryCache.set(cacheKey, fallback);
          return fallback;
        })
        .finally(() => {
          pendingRequests.delete(cacheKey);
        });
      pendingRequests.set(cacheKey, fetchPromise);
    }

    fetchPromise.then((data) => {
      if (isMounted) {
        setWatchInfo(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [cachedData, cacheKey, mediaType, title, tmdbId, variant]);

  const platforms = watchInfo?.platforms || [];
  const hasPlatforms = platforms.length > 0;
  const justWatchUrl = watchInfo?.justWatchUrl || getJustWatchSearchUrl(title);

  // ── Compact variant for movie & TV cards ─────────────────────────────────
  if (variant === "compact") {
    if (!hasPlatforms) {
      return (
        <div className={`flex items-center gap-1.5 text-[11px] text-stone-500 ${className}`}>
          <a
            href={justWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-[#F59E0B] transition-colors flex items-center gap-1 group/jw"
            title="Search streaming availability on JustWatch"
            aria-label={`Search where to watch ${title} on JustWatch`}
          >
            <span className="text-[#A1A1AA] font-medium">Stream:</span>
            <span className="text-[#D97706] group-hover/jw:underline">Check JustWatch ↗</span>
          </a>
        </div>
      );
    }

    return (
      <div className={`flex items-center flex-wrap gap-1.5 ${className}`}>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] shrink-0">
          Watch on:
        </span>
        <div className="flex items-center flex-wrap gap-1.5">
          {platforms.slice(0, 3).map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#15151C] hover:bg-stone-800 border border-[#292932] hover:border-[#D97706]/40 text-[11px] font-semibold text-[#F5F5F5] hover:text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm cursor-pointer group/btn"
              title={`Watch ${title} on ${platform.name}`}
              aria-label={`Watch ${title} on ${platform.name}`}
            >
              <img
                src={platform.logo}
                alt={platform.name}
                loading="lazy"
                decoding="async"
                className="w-3.5 h-3.5 object-contain rounded shrink-0"
              />
              <span className="font-semibold text-[#F5F5F5] group-hover/btn:text-white transition-colors">
                {platform.name}
              </span>
              {platform.category && platform.category !== "subscription" && (
                <span className="text-[8px] uppercase tracking-wider px-1 py-0.2 rounded bg-stone-800 text-stone-400 font-mono">
                  {platform.category}
                </span>
              )}
            </a>
          ))}
          {platforms.length > 3 && (
            <a
              href={justWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] text-[#D97706] hover:text-[#F59E0B] font-medium hover:underline ml-0.5"
              title="More streaming options"
            >
              +{platforms.length - 3} more
            </a>
          )}
        </div>
      </div>
    );
  }

  // ── Full variant for MediaDetailModal & dedicated sections ───────────────
  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 bg-[#15151C] border border-[#292932] shadow-lg ${className}`}
    >
      {/* Header Row */}
      {showHeading && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-3.5 rounded-full bg-[#D97706]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Where to Watch
            </h4>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
            <span>Available in India</span>
          </div>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="flex items-center gap-2 py-3 text-xs text-stone-400 animate-pulse">
          <Tv className="w-4 h-4 text-[#D97706]" />
          <span>Checking streaming availability across OTT platforms...</span>
        </div>
      ) : hasPlatforms ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {platforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-[#292932] hover:border-[#D97706]/50 transition-all duration-200 group/item shadow-sm"
              >
                <img
                  src={platform.logo}
                  alt={platform.name}
                  loading="lazy"
                  decoding="async"
                  className="w-7 h-7 object-contain rounded-lg shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-[#F5F5F5] group-hover/item:text-white truncate">
                    {platform.name}
                  </span>
                  <span className="block text-[10px] text-stone-400 font-mono capitalize">
                    {platform.category || "Stream"}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-500 group-hover/item:text-[#D97706] shrink-0 transition-colors" />
              </a>
            ))}
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500">
            <span>Data powered by JustWatch / TMDB</span>
            <a
              href={justWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-300 underline"
            >
              Verify on JustWatch ↗
            </a>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-[#292932] text-center space-y-2">
          <p className="text-xs text-stone-400">
            No direct OTT subscription stream found in this region.
          </p>
          <a
            href={justWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D97706]/15 hover:bg-[#D97706]/25 border border-[#D97706]/40 text-xs font-semibold text-white transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Search on JustWatch</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default WhereToWatch;
