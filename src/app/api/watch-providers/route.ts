import { NextRequest, NextResponse } from "next/server";
import {
  getVerifiedWatchInfo,
  matchProviderNameToPlatform,
  getJustWatchSearchUrl,
  PLATFORM_CONFIGS,
} from "@/lib/streaming-registry";
import type { StreamingPlatform, TitleWatchInfo } from "@/lib/streaming-types";

const FALLBACK_KEY = "87134b2fccb320822ab5b1ab6f194987";

function getApiKey(): string {
  return (
    process.env.TMDB_API_KEY ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY ||
    FALLBACK_KEY
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tmdbIdParam = searchParams.get("tmdbId");
  const mediaType = (searchParams.get("mediaType") || "movie") as "movie" | "tv";
  const title = searchParams.get("title") || "";

  const tmdbId = tmdbIdParam ? parseInt(tmdbIdParam, 10) : undefined;

  // 1. Check local verified curated repository first
  const verifiedInfo = getVerifiedWatchInfo(tmdbId, title, mediaType);
  if (verifiedInfo && verifiedInfo.platforms.length > 0) {
    return NextResponse.json(verifiedInfo, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  }

  // 2. If not verified or if we need dynamic TMDB watch providers
  if (!tmdbId || isNaN(tmdbId)) {
    const fallback: TitleWatchInfo = {
      title,
      type: mediaType === "tv" ? "series" : "movie",
      platforms: [],
      justWatchUrl: getJustWatchSearchUrl(title),
      region: "IN",
      isVerified: false,
    };
    return NextResponse.json(fallback);
  }

  try {
    const apiKey = getApiKey();
    const endpoint = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}/watch/providers?api_key=${apiKey}`;

    const res = await fetch(endpoint, {
      next: { revalidate: 86400 }, // Cache 24 hours
    });

    if (!res.ok) {
      throw new Error(`TMDB error: ${res.status}`);
    }

    const data = await res.json();
    const regionData = data.results?.IN; // India primary

    if (!regionData) {
      const fallback: TitleWatchInfo = {
        tmdbId,
        title,
        type: mediaType === "tv" ? "series" : "movie",
        platforms: [],
        justWatchUrl: getJustWatchSearchUrl(title),
        region: "IN",
        isVerified: false,
      };
      return NextResponse.json(fallback);
    }

    const justWatchUrl = regionData.link || getJustWatchSearchUrl(title);
    const platforms: StreamingPlatform[] = [];
    const seenPlatformIds = new Set<string>();

    // Process subscription (flatrate) first, then free, then rent/buy
    const rawProviders = [
      ...(regionData.flatrate || []).map((p: any) => ({ ...p, category: "subscription" })),
      ...(regionData.free || []).map((p: any) => ({ ...p, category: "free" })),
      ...(regionData.rent || []).map((p: any) => ({ ...p, category: "rent" })),
      ...(regionData.buy || []).map((p: any) => ({ ...p, category: "buy" })),
    ];

    for (const raw of rawProviders) {
      const config = matchProviderNameToPlatform(raw.provider_name);
      if (seenPlatformIds.has(config.id)) continue;
      seenPlatformIds.add(config.id);

      // Title-specific deep URL
      let targetUrl = config.searchUrlTemplate ? config.searchUrlTemplate(title) : justWatchUrl;

      // Prefer local SVG logo, fallback to TMDB provider logo path
      const logoUrl =
        config.logo ||
        (raw.logo_path ? `https://image.tmdb.org/t/p/original${raw.logo_path}` : "/images/ott/justwatch.svg");

      platforms.push({
        name: config.shortName,
        platformId: config.id,
        logo: logoUrl,
        url: targetUrl,
        category: raw.category,
        isPrimary: platforms.length === 0 && raw.category === "subscription",
      });
    }

    const result: TitleWatchInfo = {
      tmdbId,
      title,
      type: mediaType === "tv" ? "series" : "movie",
      primaryPlatform: platforms.find((p) => p.isPrimary)?.name || (platforms.length === 1 ? platforms[0].name : undefined),
      watchNowUrl: platforms.find((p) => p.isPrimary)?.url || (platforms.length === 1 ? platforms[0].url : undefined),
      justWatchUrl,
      platforms,
      region: "IN",
      isVerified: false,
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error("Failed to fetch TMDB watch providers:", error);
    const fallback: TitleWatchInfo = {
      tmdbId,
      title,
      type: mediaType === "tv" ? "series" : "movie",
      platforms: [],
      justWatchUrl: getJustWatchSearchUrl(title),
      region: "IN",
      isVerified: false,
    };
    return NextResponse.json(fallback);
  }
}
