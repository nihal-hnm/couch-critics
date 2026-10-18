"use client";

import React, { useState, useEffect } from "react";
import { Film, Tv } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { searchMovies } from "@/lib/tmdb";

interface MovieImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  alt: string;
  mediaType?: "movie" | "tv";
  fallbackIconClassName?: string;
  fallbackContainerClassName?: string;
  title?: string;
}

/**
 * Resilient Movie / TV Cover Image Component
 *
 * Features:
 *  - Primary loading via `/api/image-proxy` to bypass ISP / DNS censorship
 *  - Strips referrers to satisfy TMDB CDN policies
 *  - No crossOrigin attribute to prevent strict CORS rejection on CDN images
 *  - Auto-heals missing or broken covers by searching TMDB by title
 *  - Fallback to direct TMDB URL if proxy has issues
 *  - Graceful cinematic placeholder if image is missing or cannot be fetched
 */
export function MovieImage({
  src,
  alt,
  mediaType = "movie",
  className = "",
  fallbackIconClassName = "w-10 h-10 text-stone-600",
  fallbackContainerClassName = "w-full h-full bg-gradient-to-br from-stone-900 to-stone-950 flex flex-col items-center justify-center p-3 text-center",
  title,
  ...props
}: MovieImageProps) {
  const [hasError, setHasError] = useState(false);
  const [useDirectFallback, setUseDirectFallback] = useState(false);
  const [autoHealedSrc, setAutoHealedSrc] = useState<string | null>(null);

  useEffect(() => {
    setHasError(false);
    setUseDirectFallback(false);
    setAutoHealedSrc(null);
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
          setUseDirectFallback(false);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [src, title, mediaType, hasError, autoHealedSrc]);

  const rawActiveSrc = src || autoHealedSrc;
  const initialUrl = getOptimizedImageUrl(rawActiveSrc);
  const directUrl =
    rawActiveSrc && rawActiveSrc.startsWith("/") && !rawActiveSrc.startsWith("data:")
      ? rawActiveSrc.startsWith("/t/p/")
        ? `https://image.tmdb.org${rawActiveSrc}`
        : `https://image.tmdb.org/t/p/w500${rawActiveSrc}`
      : rawActiveSrc;

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

  const currentSrc = useDirectFallback ? directUrl : initialUrl;

  return (
    <img
      {...props}
      src={currentSrc || undefined}
      alt={alt}
      loading={props.loading || "lazy"}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => {
        if (!useDirectFallback && currentSrc !== directUrl) {
          // If proxy failed, try direct TMDB CDN with no-referrer
          setUseDirectFallback(true);
        } else {
          // Both failed, show stylish placeholder
          setHasError(true);
        }
      }}
    />
  );
}

export default MovieImage;
