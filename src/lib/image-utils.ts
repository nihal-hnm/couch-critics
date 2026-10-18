/**
 * Image Utilities for TMDB & Cover Media
 *
 * Provides safe URL generation through our caching proxy,
 * bypassing regional ISP DNS blocks and referrer restrictions.
 */

export function getOptimizedImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";
  let trimmed = url.trim();
  if (!trimmed) return "";

  // If it's a relative TMDB path (e.g., "/vUHlpA5c1NXkds59reY3HMb4Abs.jpg" or "/t/p/w500/...")
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("/api/") &&
    !trimmed.startsWith("/_next/") &&
    !trimmed.startsWith("/images/") &&
    !trimmed.startsWith("/icons/") &&
    !trimmed.startsWith("/favicon")
  ) {
    if (trimmed.startsWith("/t/p/")) {
      trimmed = `https://image.tmdb.org${trimmed}`;
    } else {
      trimmed = `https://image.tmdb.org/t/p/w500${trimmed}`;
    }
  }

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
