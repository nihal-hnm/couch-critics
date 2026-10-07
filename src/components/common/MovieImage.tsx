"use client";

import React, { useState } from "react";
import { Film, Tv } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/image-utils";

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

  const initialUrl = getOptimizedImageUrl(src);

  if (!src || hasError) {
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

  const currentSrc = useDirectFallback ? src : initialUrl;

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      loading={props.loading || "lazy"}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      className={className}
      onError={() => {
        if (!useDirectFallback && currentSrc !== src) {
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
