"use client";

import React, { useState, useEffect } from "react";
import { Film, Tv } from "lucide-react";
import { getOptimizedImageUrl, getProxyImageUrl } from "@/lib/image-utils";
import { searchMovies } from "@/lib/tmdb";

interface MovieImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  alt: string;
  mediaType?: "movie" | "tv";
  size?: "w185" | "w342" | "w500" | "original";
  fallbackIconClassName?: string;
  fallbackContainerClassName?: string;
  title?: string;
}

/**
 * High-Performance Resilient Movie / TV Cover Image Component
 *
 * Performance Features:
 *  - Primary: Ultra-fast direct TMDB CDN loading with size optimization ('w342' for cards, ~3x lighter)
 *  - Edge & Browser Caching: Loads directly from TMDB's edge without exhausting Next.js server connection limits
 *  - Asynchronous Decoding & Native Lazy Loading: Minimizes main thread layout shifts and pauses
 *  - Referrer-safe: Strips referrers to prevent CDN blocking
 *  - Fallback: On-demand fallback to `/api/image-proxy` only if direct TMDB CDN fails (e.g., DNS-blocked ISPs)
 *  - Auto-heals missing covers gracefully
 */
export function MovieImage({
  src,
  alt,
  mediaType = "movie",
  size = "w342",
  className = "",
  fallbackIconClassName = "w-10 h-10 text-stone-600",
  fallbackContainerClassName = "w-full h-full bg-gradient-to-br from-stone-900 to-stone-950 flex flex-col items-center justify-center p-3 text-center",
  title,
  ...props
}: MovieImageProps) {
  const [hasError, setHasError] = useState(false);
  const [useProxyFallback, setUseProxyFallback] = useState(false);
  const [autoHealedSrc, setAutoHealedSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setUseProxyFallback(false);
    setAutoHealedSrc(null);
    setIsLoaded(false);
  }, [src]);

  // Auto-heal missing or broken poster URLs via TMDB title search
  useEffect(() => {
    if (src && !hasError) return;
    if (!title || autoHealedSrc) return;

    let mounted = true;
    searchMovies(title)
      .then((results) => {
        if (!mounted || !results || results.length === 0) return;
        const matched =
          results.find((r) => r.posterUrl && (mediaType ? r.mediaType === mediaType : true)) ||
          results.find((r) => r.posterUrl);

        if (matched?.posterUrl) {
          setAutoHealedSrc(matched.posterUrl);
          setHasError(false);
          setUseProxyFallback(false);
        }
      })
      .catch(() => { });

    return () => {
      mounted = false;
    };
  }, [src, title, mediaType, hasError, autoHealedSrc]);

  const rawActiveSrc = src || autoHealedSrc;
  const directCdnUrl = getOptimizedImageUrl(rawActiveSrc, size);
  const proxyUrl = getProxyImageUrl(rawActiveSrc);

  if (!rawActiveSrc || hasError) {
    return (
      <div className={fallbackContainerClassName}>
        {mediaType === "tv" ? (
          <Tv className={fallbackIconClassName} />
        ) : (
          <Film className={fallbackIconClassName} />
        )}
        {title && (
          <span className="mt-2 text-[11px] font-semibold text-stone-400 line-clamp-2 leading-tight">
            {title}
          </span>
        )}
      </div>
    );
  }

  const currentSrc = useProxyFallback ? proxyUrl : directCdnUrl;

  return (
    <div className="relative w-full h-full overflow-hidden bg-stone-900">
      {/* Subtle Shimmer Skeleton while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 animate-pulse" />
      )}
      <img
        {...props}
        src={currentSrc || undefined}
        alt={alt}
        loading={props.loading || "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onError={() => {
          if (!useProxyFallback && proxyUrl && currentSrc !== proxyUrl) {
            // If direct CDN fails (e.g. ISP censorship), fall back to proxy
            setUseProxyFallback(true);
          } else {
            // Both failed, render cinematic fallback placeholder
            setHasError(true);
          }
        }}
      />
    </div>
  );
}

export default MovieImage;
