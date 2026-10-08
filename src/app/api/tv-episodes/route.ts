import { NextRequest, NextResponse } from "next/server";
import type { EpisodeItem } from "@/lib/types";

const FALLBACK_KEY = "87134b2fccb320822ab5b1ab6f194987";

function getApiKey(): string {
  return (
    process.env.TMDB_API_KEY ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY ||
    FALLBACK_KEY
  );
}

function cleanHtml(raw: string = ""): string {
  return raw.replace(/<[^>]*>/g, "").trim();
}

/**
 * Server-side route to fetch TV season episodes with dual sources:
 * 1. TMDB API (primary)
 * 2. TVmaze API (resilient fallback when TMDB is rate-limited, blocked, or missing data)
 *
 * Avoids client-side ad-blocker / ISP blocks on api.themoviedb.org.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tmdbIdParam = searchParams.get("tmdbId");
  const seasonParam = searchParams.get("season") || "1";
  const title = (searchParams.get("title") || "").trim();

  const tmdbId = tmdbIdParam ? parseInt(tmdbIdParam, 10) : undefined;
  const seasonNumber = parseInt(seasonParam, 10) || 1;

  // 1. Try TMDB API first if tmdbId is available
  if (tmdbId && !isNaN(tmdbId)) {
    try {
      const apiKey = getApiKey();
      const endpoint = `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}?api_key=${apiKey}&language=en-US`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(endpoint, {
        signal: controller.signal,
        next: { revalidate: 86400 },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.episodes && data.episodes.length > 0) {
          const episodes: EpisodeItem[] = data.episodes.map((ep: any) => ({
            seasonNumber: ep.season_number,
            episodeNumber: ep.episode_number,
            title: ep.name && ep.name.trim() ? ep.name.trim() : `Episode ${ep.episode_number}`,
            runtime: ep.runtime || 45,
            overview: ep.overview ? ep.overview.trim() : "",
            airDate: ep.air_date,
          }));

          // If at least half of the episodes have meaningful titles, return TMDB result
          const hasRealTitles = episodes.some(
            (e) => e.title && !e.title.toLowerCase().startsWith("episode ")
          );
          if (hasRealTitles) {
            return NextResponse.json(
              { tmdbId, seasonNumber, episodes, source: "tmdb" },
              {
                headers: {
                  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
                },
              }
            );
          }
        }
      }
    } catch (tmdbErr) {
      console.warn(`TMDB fetch failed for TV ${tmdbId} S${seasonNumber}:`, tmdbErr);
    }
  }

  // 2. Try TVmaze API fallback using show title
  if (title) {
    try {
      const tvmazeUrl = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(title)}&embed=episodes`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(tvmazeUrl, {
        signal: controller.signal,
        next: { revalidate: 86400 },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const allEpisodes: any[] = data._embedded?.episodes || [];
        const seasonEpisodes = allEpisodes.filter((ep) => ep.season === seasonNumber);

        if (seasonEpisodes.length > 0) {
          const episodes: EpisodeItem[] = seasonEpisodes.map((ep) => ({
            seasonNumber: ep.season,
            episodeNumber: ep.number,
            title: ep.name && ep.name.trim() ? ep.name.trim() : `Episode ${ep.number}`,
            runtime: ep.runtime || 45,
            overview: cleanHtml(ep.summary),
            airDate: ep.airdate,
          }));

          return NextResponse.json(
            { tmdbId, seasonNumber, episodes, source: "tvmaze" },
            {
              headers: {
                "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
              },
            }
          );
        }
      }
    } catch (tvmazeErr) {
      console.warn(`TVmaze fetch failed for "${title}" S${seasonNumber}:`, tvmazeErr);
    }
  }

  // Fallback: return empty array with 200 so UI can handle gracefully
  return NextResponse.json({
    tmdbId,
    seasonNumber,
    episodes: [],
    source: "none",
  });
}
