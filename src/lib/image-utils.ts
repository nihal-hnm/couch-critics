/**
 * Image Utilities for TMDB & Cover Media
 *
 * Provides safe URL generation through our caching proxy,
 * bypassing regional ISP DNS blocks and referrer restrictions.
 */

export function getOptimizedImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // Already local or data URL
  if (trimmed.startsWith("/") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  // Route TMDB CDN images through the application image proxy
  if (trimmed.includes("image.tmdb.org")) {
    return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}
