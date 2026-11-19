/**
 * Image Utilities for TMDB & Cover Media
 *
 * Provides optimized direct TMDB CDN URLs for ultra-fast, zero-overhead
 * parallel loading, with an on-demand fallback proxy for restricted networks.
 */

const TMDB_CDN_BASE = "https://image.tmdb.org/t/p";

/**
 * Convert relative TMDB paths or full TMDB image URLs into an optimal CDN URL.
 * Defaults to 'w342' for poster cards (approx 20-30KB instead of 100KB+ for w500).
 */
export function getDirectTmdbUrl(url?: string | null, size: "w185" | "w342" | "w500" | "original" = "w342"): string {
  if (!url || typeof url !== "string") return "";
  let trimmed = url.trim();
  if (!trimmed) return "";

  // If already a data URL or local asset
  if (trimmed.startsWith("data:") || trimmed.startsWith("/icons/") || trimmed.startsWith("/favicon")) {
    return trimmed;
  }

  // Relative TMDB path (e.g., "/vUHlpA5c1NXkds59reY3HMb4Abs.jpg")
  if (trimmed.startsWith("/") && !trimmed.startsWith("/api/") && !trimmed.startsWith("/_next/")) {
    if (trimmed.startsWith("/t/p/")) {
      return `https://image.tmdb.org${trimmed}`;
    }
    return `${TMDB_CDN_BASE}/${size}${trimmed}`;
  }

  // If it's already an image.tmdb.org URL with /w500/, optimize to requested size if card thumbnail
  if (trimmed.includes("image.tmdb.org/t/p/")) {
    if (size === "w342" && trimmed.includes("/w500/")) {
      return trimmed.replace("/w500/", "/w342/");
    }
    return trimmed;
  }

  return trimmed;
}

/**
 * Fallback proxy URL for environments where direct TMDB CDN is blocked at the ISP/DNS level.
 */
export function getProxyImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";
  const direct = getDirectTmdbUrl(url, "w500");
  if (!direct) return "";
  return `/api/image-proxy?url=${encodeURIComponent(direct)}`;
}

/**
 * Returns direct CDN URL by default for maximum performance and zero server latency.
 */
export function getOptimizedImageUrl(url?: string | null, size: "w185" | "w342" | "w500" | "original" = "w342"): string {
  return getDirectTmdbUrl(url, size);
}
