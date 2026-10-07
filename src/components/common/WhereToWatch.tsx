"use client";

import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Play, Search, Tv } from "lucide-react";
import type { TitleWatchInfo, StreamingPlatform } from "@/lib/streaming-types";
import { getVerifiedWatchInfo, getJustWatchSearchUrl } from "@/lib/streaming-registry";

interface WhereToWatchProps {
  tmdbId?: number | null;
  title: string;
  mediaType?: "movie" | "tv";
  variant?: "full" | "compact";
  className?: string;
  showHeading?: boolean;
}

export function WhereToWatch({
  tmdbId,
  title,
  mediaType = "movie",
  variant = "full",
  className = "",
  showHeading = true,
}: WhereToWatchProps) {
  // Check local verified registry first for instant, zero-latency rendering
  const initialData = useMemo(() => {
    return getVerifiedWatchInfo(tmdbId, title, mediaType);
  }, [tmdbId, title, mediaType]);

  const [watchInfo, setWatchInfo] = useState<TitleWatchInfo | null>(initialData);
  const [loading, setLoading] = useState<boolean>(!initialData);

  useEffect(() => {
    // If we already have verified data, use it immediately
    const verified = getVerifiedWatchInfo(tmdbId, title, mediaType);
    if (verified) {
      setWatchInfo(verified);
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

    fetch(`/api/watch-providers?${queryParams.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load providers");
        return res.json();
      })
      .then((data: TitleWatchInfo) => {
        if (isMounted) {
          setWatchInfo(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch watch providers:", err);
        if (isMounted) {
          setWatchInfo({
            tmdbId: tmdbId ?? undefined,
            title,
            type: mediaType === "tv" ? "series" : "movie",
            platforms: [],
            justWatchUrl: getJustWatchSearchUrl(title),
            region: "IN",
            isVerified: false,
          });
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [tmdbId, title, mediaType]);

  const platforms = watchInfo?.platforms || [];
  const hasPlatforms = platforms.length > 0;
  const justWatchUrl = watchInfo?.justWatchUrl || getJustWatchSearchUrl(title);

  // If title has a single platform or verified primary option
  const primaryPlatform = watchInfo?.primaryPlatform
    ? platforms.find((p) => p.name.toLowerCase() === watchInfo.primaryPlatform?.toLowerCase()) || platforms[0]
    : platforms.length === 1
    ? platforms[0]
    : null;

  // ── Compact variant for movie & TV cards ─────────────────────────────────
  if (variant === "compact") {
    if (loading) {
      return (
        <div className={`flex items-center gap-1.5 text-[11px] text-stone-500 ${className}`}>
          <Tv className="w-3 h-3 text-stone-600 animate-pulse" />
          <span>Checking availability...</span>
        </div>
      );
    }

    if (!hasPlatforms) {
      return (
        <div className={`flex items-center gap-1.5 text-[11px] text-stone-500 ${className}`}>
          <a
            href={justWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-purple-300 transition-colors flex items-center gap-1 group/jw"
            title="Search streaming availability on JustWatch"
            aria-label={`Search where to watch ${title} on JustWatch`}
          >
            <span className="text-stone-400">Stream:</span>
            <span className="text-purple-400/90 group-hover/jw:underline">Check JustWatch ↗</span>
          </a>
        </div>
      );
    }

    return (
      <div className={`flex items-center flex-wrap gap-1.5 ${className}`}>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 shrink-0">
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
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-900/90 hover:bg-stone-800 border border-stone-800/80 hover:border-purple-500/40 text-[11px] font-medium text-stone-300 hover:text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm cursor-pointer group/btn"
              title={`Watch ${title} on ${platform.name}`}
              aria-label={`Watch ${title} on ${platform.name}`}
            >
              <img
                src={platform.logo}
                alt={platform.name}
                loading="lazy"
                className="w-3.5 h-3.5 object-contain rounded shrink-0"
              />
              <span className="group-hover/btn:text-purple-200 transition-colors">
                {platform.name}
              </span>
            </a>
          ))}
          {platforms.length > 3 && (
            <a
              href={justWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] text-purple-400 hover:text-purple-300 font-medium hover:underline ml-0.5"
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
      className={`rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-stone-950/90 via-stone-900/60 to-[#12100e] border border-stone-800/80 shadow-lg ${className}`}
    >
      {/* Header Row */}
      {showHeading && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-3.5 rounded-full bg-purple-500" />
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
          <Tv className="w-4 h-4 text-purple-400" />
          <span>Checking streaming availability across OTT platforms...</span>
        </div>
      ) : hasPlatforms ? (
        <div className="space-y-3">
          {/* OTT Platform Buttons Grid */}
          <div className="flex flex-wrap items-center gap-2">
            {platforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161311] hover:bg-stone-800/90 border border-stone-800/90 hover:border-purple-500/40 text-xs font-medium text-stone-200 hover:text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm hover:shadow-purple-500/10 hover:shadow-md cursor-pointer group"
                aria-label={`Watch ${title} on ${platform.name}`}
                title={`Open ${title} on ${platform.name} (Opens in new tab)`}
              >
                <img
                  src={platform.logo}
                  alt={platform.name}
                  loading="lazy"
                  className="w-4 h-4 object-contain rounded shrink-0 transition-transform group-hover:scale-105"
                />
                <span className="group-hover:text-purple-200 transition-colors font-medium">
                  {platform.name}
                </span>
                <ExternalLink className="w-3 h-3 text-stone-500 group-hover:text-purple-400 transition-colors ml-0.5" />
              </a>
            ))}

            {/* Optional Watch Now Button when primary platform is available */}
            {primaryPlatform && (
              <a
                href={primaryPlatform.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#5c0f92] hover:from-purple-500 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-900/40 hover:shadow-purple-700/60 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                aria-label={`Watch ${title} now on ${primaryPlatform.name}`}
                title={`Watch now on ${primaryPlatform.name}`}
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Watch Now</span>
              </a>
            )}
          </div>

          {/* Subtext info */}
          <p className="text-[11px] text-stone-400 flex items-center gap-1">
            <span>Direct streaming links verified for India.</span>
            <a
              href={justWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-purple-400/90 hover:text-purple-300 hover:underline inline-flex items-center gap-0.5 ml-1"
            >
              <span>View all options on JustWatch</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </p>
        </div>
      ) : (
        /* Fallback: When no verified streaming platforms are available */
        <div className="py-2 space-y-2">
          <p className="text-xs text-stone-400">
            Streaming availability unavailable on major Indian OTT subscriptions currently.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href={justWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-yellow-500/40 text-xs font-medium text-stone-300 hover:text-white transition-all duration-200 hover:scale-[1.02] shadow-sm cursor-pointer group"
              aria-label={`Check streaming availability for ${title} on JustWatch`}
            >
              <img
                src="/images/ott/justwatch.svg"
                alt="JustWatch"
                loading="lazy"
                className="w-4 h-4 object-contain rounded shrink-0"
              />
              <span className="group-hover:text-yellow-200 transition-colors">
                Check JustWatch India
              </span>
              <Search className="w-3 h-3 text-stone-500 group-hover:text-yellow-400 transition-colors ml-0.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
