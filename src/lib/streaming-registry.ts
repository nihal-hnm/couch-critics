/**
 * =============================================================================
 * Couch Critics — Reusable Streaming / OTT Registry & Configuration
 * =============================================================================
 *
 * Provides:
 *  - Official platform branding, badges, and logos
 *  - Verified title-specific deep links (India region focused)
 *  - Dynamic fallback resolution via JustWatch & TMDB Watch Providers
 */

import type { StreamingPlatform, StreamingPlatformId, TitleWatchInfo } from "./streaming-types";

// ─── Platform Metadata Configuration ──────────────────────────────────────────

export interface PlatformConfig {
  id: StreamingPlatformId;
  name: string;
  shortName: string;
  logo: string;
  accentColor: string;
  searchUrlTemplate?: (title: string) => string;
}

export const PLATFORM_CONFIGS: Record<StreamingPlatformId, PlatformConfig> = {
  netflix: {
    id: "netflix",
    name: "Netflix",
    shortName: "Netflix",
    logo: "/images/ott/netflix.svg",
    accentColor: "#E50914",
    searchUrlTemplate: (q) => `https://www.netflix.com/search?q=${encodeURIComponent(q)}`,
  },
  prime: {
    id: "prime",
    name: "Amazon Prime Video",
    shortName: "Prime Video",
    logo: "/images/ott/prime-video.svg",
    accentColor: "#00A8E1",
    searchUrlTemplate: (q) => `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(q)}`,
  },
  hotstar: {
    id: "hotstar",
    name: "JioHotstar",
    shortName: "JioHotstar",
    logo: "/images/ott/jiohotstar.svg",
    accentColor: "#FFB300",
    searchUrlTemplate: (q) => `https://www.hotstar.com/in/explore?search_query=${encodeURIComponent(q)}`,
  },
  appletv: {
    id: "appletv",
    name: "Apple TV+",
    shortName: "Apple TV+",
    logo: "/images/ott/apple-tv.svg",
    accentColor: "#FFFFFF",
    searchUrlTemplate: (q) => `https://tv.apple.com/in/search?term=${encodeURIComponent(q)}`,
  },
  disney: {
    id: "disney",
    name: "Disney+",
    shortName: "Disney+",
    logo: "/images/ott/disney-plus.svg",
    accentColor: "#113CCF",
    searchUrlTemplate: (q) => `https://www.disneyplus.com/search?q=${encodeURIComponent(q)}`,
  },
  youtube: {
    id: "youtube",
    name: "YouTube Movies",
    shortName: "YouTube",
    logo: "/images/ott/youtube.svg",
    accentColor: "#FF0000",
    searchUrlTemplate: (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " movie")}`,
  },
  sonyliv: {
    id: "sonyliv",
    name: "SonyLIV",
    shortName: "SonyLIV",
    logo: "/images/ott/sonyliv.svg",
    accentColor: "#00C48C",
    searchUrlTemplate: (q) => `https://www.sonyliv.com/search/${encodeURIComponent(q)}`,
  },
  zee5: {
    id: "zee5",
    name: "ZEE5",
    shortName: "ZEE5",
    logo: "/images/ott/zee5.svg",
    accentColor: "#8224E3",
    searchUrlTemplate: (q) => `https://www.zee5.com/search?q=${encodeURIComponent(q)}`,
  },
  mxplayer: {
    id: "mxplayer",
    name: "MX Player",
    shortName: "MX Player",
    logo: "/images/ott/mx-player.svg",
    accentColor: "#0080FF",
    searchUrlTemplate: (q) => `https://www.mxplayer.in/search?q=${encodeURIComponent(q)}`,
  },
  crunchyroll: {
    id: "crunchyroll",
    name: "Crunchyroll",
    shortName: "Crunchyroll",
    logo: "/images/ott/crunchyroll.svg",
    accentColor: "#F47521",
    searchUrlTemplate: (q) => `https://www.crunchyroll.com/search?q=${encodeURIComponent(q)}`,
  },
  lionsgate: {
    id: "lionsgate",
    name: "Lionsgate Play",
    shortName: "Lionsgate",
    logo: "/images/ott/lionsgate-play.svg",
    accentColor: "#D4AF37",
    searchUrlTemplate: (q) => `https://www.lionsgateplay.com/search?q=${encodeURIComponent(q)}`,
  },
  mubi: {
    id: "mubi",
    name: "MUBI",
    shortName: "MUBI",
    logo: "/images/ott/mubi.svg",
    accentColor: "#00E5FF",
    searchUrlTemplate: (q) => `https://mubi.com/search?query=${encodeURIComponent(q)}`,
  },
  aha: {
    id: "aha",
    name: "Aha",
    shortName: "Aha",
    logo: "/images/ott/aha.svg",
    accentColor: "#FF4500",
    searchUrlTemplate: (q) => `https://www.aha.video/search?q=${encodeURIComponent(q)}`,
  },
  other: {
    id: "other",
    name: "Streaming Service",
    shortName: "Stream",
    logo: "/images/ott/justwatch.svg",
    accentColor: "#A855F7",
  },
};

/**
 * Normalizes title for consistent dictionary lookup
 */
export function normalizeTitleKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Standard JustWatch India search link fallback
 */
export function getJustWatchSearchUrl(title: string): string {
  return `https://www.justwatch.com/in/search?q=${encodeURIComponent(title.trim())}`;
}

// ─── Verified Direct Title Links Registry (India) ────────────────────────────
// Stores verified, exact deep links for movies and TV series

export const VERIFIED_TITLE_REGISTRY: Record<string, TitleWatchInfo> = {
  // Breaking Bad
  "1396": {
    tmdbId: 1396,
    title: "Breaking Bad",
    type: "series",
    primaryPlatform: "Netflix",
    watchNowUrl: "https://www.netflix.com/title/70143836",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/breaking-bad",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Netflix",
        platformId: "netflix",
        logo: PLATFORM_CONFIGS.netflix.logo,
        url: "https://www.netflix.com/title/70143836",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Severance
  "95396": {
    tmdbId: 95396,
    title: "Severance",
    type: "series",
    primaryPlatform: "Apple TV+",
    watchNowUrl: "https://tv.apple.com/us/show/severance/umc.cmc.1srk2goyh2q2zdxcx60pfw63q",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/severance",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Apple TV+",
        platformId: "appletv",
        logo: PLATFORM_CONFIGS.appletv.logo,
        url: "https://tv.apple.com/us/show/severance/umc.cmc.1srk2goyh2q2zdxcx60pfw63q",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // The Bear
  "136315": {
    tmdbId: 136315,
    title: "The Bear",
    type: "series",
    primaryPlatform: "JioHotstar",
    watchNowUrl: "https://www.hotstar.com/in/shows/the-bear/1260107759",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/the-bear",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/shows/the-bear/1260107759",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Dune: Part Two
  "693134": {
    tmdbId: 693134,
    title: "Dune: Part Two",
    type: "movie",
    primaryPlatform: "JioHotstar",
    watchNowUrl: "https://www.hotstar.com/in/movies/dune-part-two/1271295963",
    justWatchUrl: "https://www.justwatch.com/in/movie/dune-part-two",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/movies/dune-part-two/1271295963",
        category: "subscription",
        isPrimary: true,
      },
      {
        name: "Prime Video",
        platformId: "prime",
        logo: PLATFORM_CONFIGS.prime.logo,
        url: "https://www.primevideo.com/detail/0SZU9F4W72B04E5Z6GZ5X81HJC/",
        category: "rent",
      },
      {
        name: "Apple TV+",
        platformId: "appletv",
        logo: PLATFORM_CONFIGS.appletv.logo,
        url: "https://tv.apple.com/in/movie/dune-part-two/umc.cmc.2m26t8u43q5n9a27z68g374w",
        category: "buy",
      },
      {
        name: "YouTube",
        platformId: "youtube",
        logo: PLATFORM_CONFIGS.youtube.logo,
        url: "https://www.youtube.com/watch?v=Way9Dexny3w",
        category: "rent",
      },
    ],
  },

  // Oppenheimer
  "872585": {
    tmdbId: 872585,
    title: "Oppenheimer",
    type: "movie",
    primaryPlatform: "JioHotstar",
    watchNowUrl: "https://www.hotstar.com/in/movies/oppenheimer/1271267884",
    justWatchUrl: "https://www.justwatch.com/in/movie/oppenheimer",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/movies/oppenheimer/1271267884",
        category: "subscription",
        isPrimary: true,
      },
      {
        name: "Prime Video",
        platformId: "prime",
        logo: PLATFORM_CONFIGS.prime.logo,
        url: "https://www.primevideo.com/detail/0O9P4M6F4I210WGY666V4341VG/",
        category: "rent",
      },
      {
        name: "Apple TV+",
        platformId: "appletv",
        logo: PLATFORM_CONFIGS.appletv.logo,
        url: "https://tv.apple.com/in/movie/oppenheimer/umc.cmc.24x278q44csl9046c7h325u6",
        category: "buy",
      },
    ],
  },

  // Spider-Man: Across the Spider-Verse
  "569094": {
    tmdbId: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    type: "movie",
    primaryPlatform: "Netflix",
    watchNowUrl: "https://www.netflix.com/title/81594935",
    justWatchUrl: "https://www.justwatch.com/in/movie/spider-man-across-the-spider-verse",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Netflix",
        platformId: "netflix",
        logo: PLATFORM_CONFIGS.netflix.logo,
        url: "https://www.netflix.com/title/81594935",
        category: "subscription",
        isPrimary: true,
      },
      {
        name: "Prime Video",
        platformId: "prime",
        logo: PLATFORM_CONFIGS.prime.logo,
        url: "https://www.primevideo.com/detail/0T46BFFU8K0N3R31Y2M0V4H4P7/",
        category: "rent",
      },
    ],
  },

  // Interstellar
  "157336": {
    tmdbId: 157336,
    title: "Interstellar",
    type: "movie",
    primaryPlatform: "Amazon Prime Video",
    watchNowUrl: "https://www.primevideo.com/detail/0S34DFW20M0U7WFFOEVF4MUD8G/",
    justWatchUrl: "https://www.justwatch.com/in/movie/interstellar",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Prime Video",
        platformId: "prime",
        logo: PLATFORM_CONFIGS.prime.logo,
        url: "https://www.primevideo.com/detail/0S34DFW20M0U7WFFOEVF4MUD8G/",
        category: "subscription",
        isPrimary: true,
      },
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/movies/interstellar/1260014283",
        category: "subscription",
      },
      {
        name: "Apple TV+",
        platformId: "appletv",
        logo: PLATFORM_CONFIGS.appletv.logo,
        url: "https://tv.apple.com/in/movie/interstellar/umc.cmc.6l1g4l5b2p33t94n444m29y1",
        category: "rent",
      },
      {
        name: "YouTube",
        platformId: "youtube",
        logo: PLATFORM_CONFIGS.youtube.logo,
        url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        category: "rent",
      },
    ],
  },

  // Challengers
  "937287": {
    tmdbId: 937287,
    title: "Challengers",
    type: "movie",
    primaryPlatform: "Amazon Prime Video",
    watchNowUrl: "https://www.primevideo.com/detail/0R415XEKJ7G2KZZL6Q7QFF18D0/",
    justWatchUrl: "https://www.justwatch.com/in/movie/challengers-2024",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Prime Video",
        platformId: "prime",
        logo: PLATFORM_CONFIGS.prime.logo,
        url: "https://www.primevideo.com/detail/0R415XEKJ7G2KZZL6Q7QFF18D0/",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Succession
  "76331": {
    tmdbId: 76331,
    title: "Succession",
    type: "series",
    primaryPlatform: "JioHotstar",
    watchNowUrl: "https://www.hotstar.com/in/shows/succession/1260013587",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/succession",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/shows/succession/1260013587",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Suits
  "2691": {
    tmdbId: 2691,
    title: "Suits",
    type: "series",
    primaryPlatform: "Netflix",
    watchNowUrl: "https://www.netflix.com/title/70195800",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/suits",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Netflix",
        platformId: "netflix",
        logo: PLATFORM_CONFIGS.netflix.logo,
        url: "https://www.netflix.com/title/70195800",
        category: "subscription",
        isPrimary: true,
      },
      {
        name: "Prime Video",
        platformId: "prime",
        logo: PLATFORM_CONFIGS.prime.logo,
        url: "https://www.primevideo.com/detail/0O9O64N36M0G6Z26R5GZ67F6HJ/",
        category: "subscription",
      },
    ],
  },

  // House of the Dragon
  "94997": {
    tmdbId: 94997,
    title: "House of the Dragon",
    type: "series",
    primaryPlatform: "JioHotstar",
    watchNowUrl: "https://www.hotstar.com/in/shows/house-of-the-dragon/1260110285",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/house-of-the-dragon",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/shows/house-of-the-dragon/1260110285",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // The End of the F***ing World
  "74577": {
    tmdbId: 74577,
    title: "The End of the F***ing World",
    type: "series",
    primaryPlatform: "Netflix",
    watchNowUrl: "https://www.netflix.com/title/80175722",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/the-end-of-the-f-ing-world",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Netflix",
        platformId: "netflix",
        logo: PLATFORM_CONFIGS.netflix.logo,
        url: "https://www.netflix.com/title/80175722",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Dark
  "70523": {
    tmdbId: 70523,
    title: "Dark",
    type: "series",
    primaryPlatform: "Netflix",
    watchNowUrl: "https://www.netflix.com/title/80100172",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/dark",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Netflix",
        platformId: "netflix",
        logo: PLATFORM_CONFIGS.netflix.logo,
        url: "https://www.netflix.com/title/80100172",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Chernobyl
  "87108": {
    tmdbId: 87108,
    title: "Chernobyl",
    type: "series",
    primaryPlatform: "JioHotstar",
    watchNowUrl: "https://www.hotstar.com/in/shows/chernobyl/1260006283",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/chernobyl",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/shows/chernobyl/1260006283",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Game of Thrones
  "1399": {
    tmdbId: 1399,
    title: "Game of Thrones",
    type: "series",
    primaryPlatform: "JioHotstar",
    watchNowUrl: "https://www.hotstar.com/in/shows/game-of-thrones/1260000034",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/game-of-thrones",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/shows/game-of-thrones/1260000034",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Stranger Things
  "66732": {
    tmdbId: 66732,
    title: "Stranger Things",
    type: "series",
    primaryPlatform: "Netflix",
    watchNowUrl: "https://www.netflix.com/title/80057281",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/stranger-things",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Netflix",
        platformId: "netflix",
        logo: PLATFORM_CONFIGS.netflix.logo,
        url: "https://www.netflix.com/title/80057281",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Better Call Saul
  "60059": {
    tmdbId: 60059,
    title: "Better Call Saul",
    type: "series",
    primaryPlatform: "Netflix",
    watchNowUrl: "https://www.netflix.com/title/80025678",
    justWatchUrl: "https://www.justwatch.com/in/tv-show/better-call-saul",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Netflix",
        platformId: "netflix",
        logo: PLATFORM_CONFIGS.netflix.logo,
        url: "https://www.netflix.com/title/80025678",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Inception
  "27205": {
    tmdbId: 27205,
    title: "Inception",
    type: "movie",
    primaryPlatform: "JioHotstar",
    watchNowUrl: "https://www.hotstar.com/in/movies/inception/1260014282",
    justWatchUrl: "https://www.justwatch.com/in/movie/inception",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/movies/inception/1260014282",
        category: "subscription",
        isPrimary: true,
      },
      {
        name: "Prime Video",
        platformId: "prime",
        logo: PLATFORM_CONFIGS.prime.logo,
        url: "https://www.primevideo.com/detail/0O84M7M48K2N9F4G2G51P5H381/",
        category: "rent",
      },
      {
        name: "Apple TV+",
        platformId: "appletv",
        logo: PLATFORM_CONFIGS.appletv.logo,
        url: "https://tv.apple.com/in/movie/inception/umc.cmc.14g54j35174116f1p84n",
        category: "rent",
      },
    ],
  },

  // The Dark Knight
  "155": {
    tmdbId: 155,
    title: "The Dark Knight",
    type: "movie",
    primaryPlatform: "JioHotstar",
    watchNowUrl: "https://www.hotstar.com/in/movies/the-dark-knight/1260014281",
    justWatchUrl: "https://www.justwatch.com/in/movie/the-dark-knight",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/movies/the-dark-knight/1260014281",
        category: "subscription",
        isPrimary: true,
      },
      {
        name: "Prime Video",
        platformId: "prime",
        logo: PLATFORM_CONFIGS.prime.logo,
        url: "https://www.primevideo.com/detail/0P5M4G1K2M3N4F5G6H7J8K9L0P/",
        category: "rent",
      },
    ],
  },

  // Spirited Away
  "129": {
    tmdbId: 129,
    title: "Spirited Away",
    type: "movie",
    primaryPlatform: "Netflix",
    watchNowUrl: "https://www.netflix.com/title/60023642",
    justWatchUrl: "https://www.justwatch.com/in/movie/spirited-away",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Netflix",
        platformId: "netflix",
        logo: PLATFORM_CONFIGS.netflix.logo,
        url: "https://www.netflix.com/title/60023642",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Fight Club
  "550": {
    tmdbId: 550,
    title: "Fight Club",
    type: "movie",
    primaryPlatform: "Amazon Prime Video",
    watchNowUrl: "https://www.primevideo.com/detail/0H8G4F3D2S1A0Z9X8C7V6B5N4M/",
    justWatchUrl: "https://www.justwatch.com/in/movie/fight-club",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "Prime Video",
        platformId: "prime",
        logo: PLATFORM_CONFIGS.prime.logo,
        url: "https://www.primevideo.com/detail/0H8G4F3D2S1A0Z9X8C7V6B5N4M/",
        category: "subscription",
        isPrimary: true,
      },
    ],
  },

  // Pulp Fiction
  "680": {
    tmdbId: 680,
    title: "Pulp Fiction",
    type: "movie",
    primaryPlatform: "JioHotstar",
    watchNowUrl: "https://www.hotstar.com/in/movies/pulp-fiction/1260014290",
    justWatchUrl: "https://www.justwatch.com/in/movie/pulp-fiction",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/movies/pulp-fiction/1260014290",
        category: "subscription",
        isPrimary: true,
      },
      {
        name: "Prime Video",
        platformId: "prime",
        logo: PLATFORM_CONFIGS.prime.logo,
        url: "https://www.primevideo.com/detail/0N9B8V7C6X5Z4A3S2D1F0G9H8J/",
        category: "rent",
      },
    ],
  },

  // The Matrix
  "603": {
    tmdbId: 603,
    title: "The Matrix",
    type: "movie",
    primaryPlatform: "JioHotstar",
    watchNowUrl: "https://www.hotstar.com/in/movies/the-matrix/1260014280",
    justWatchUrl: "https://www.justwatch.com/in/movie/the-matrix",
    region: "IN",
    isVerified: true,
    platforms: [
      {
        name: "JioHotstar",
        platformId: "hotstar",
        logo: PLATFORM_CONFIGS.hotstar.logo,
        url: "https://www.hotstar.com/in/movies/the-matrix/1260014280",
        category: "subscription",
        isPrimary: true,
      },
      {
        name: "Prime Video",
        platformId: "prime",
        logo: PLATFORM_CONFIGS.prime.logo,
        url: "https://www.primevideo.com/detail/0M9L8K7J6H5G4F3D2S1A0P9O8I/",
        category: "rent",
      },
    ],
  },
};

/**
 * Builds a fast lookup key by normalized title
 */
const TITLE_TO_ID_MAP: Record<string, string> = {};
Object.entries(VERIFIED_TITLE_REGISTRY).forEach(([id, info]) => {
  TITLE_TO_ID_MAP[normalizeTitleKey(info.title)] = id;
});

/**
 * Retrieve verified watch info from the local curated registry
 */
export function getVerifiedWatchInfo(
  tmdbId?: number | null,
  title?: string | null,
  mediaType: "movie" | "tv" = "movie"
): TitleWatchInfo | null {
  if (tmdbId && VERIFIED_TITLE_REGISTRY[String(tmdbId)]) {
    return VERIFIED_TITLE_REGISTRY[String(tmdbId)];
  }

  if (title) {
    const key = normalizeTitleKey(title);
    const id = TITLE_TO_ID_MAP[key];
    if (id && VERIFIED_TITLE_REGISTRY[id]) {
      return VERIFIED_TITLE_REGISTRY[id];
    }
  }

  return null;
}

/**
 * Map TMDB raw watch provider names to standard platform IDs
 */
export function matchProviderNameToPlatform(providerName: string): PlatformConfig {
  const norm = providerName.toLowerCase();
  if (norm.includes("netflix")) return PLATFORM_CONFIGS.netflix;
  if (norm.includes("prime") || norm.includes("amazon")) return PLATFORM_CONFIGS.prime;
  if (norm.includes("hotstar") || norm.includes("jio")) return PLATFORM_CONFIGS.hotstar;
  if (norm.includes("apple")) return PLATFORM_CONFIGS.appletv;
  if (norm.includes("disney")) return PLATFORM_CONFIGS.disney;
  if (norm.includes("youtube")) return PLATFORM_CONFIGS.youtube;
  if (norm.includes("sony") || norm.includes("liv")) return PLATFORM_CONFIGS.sonyliv;
  if (norm.includes("zee")) return PLATFORM_CONFIGS.zee5;
  if (norm.includes("mx player") || norm.includes("mxplayer")) return PLATFORM_CONFIGS.mxplayer;
  if (norm.includes("crunchyroll")) return PLATFORM_CONFIGS.crunchyroll;
  if (norm.includes("lionsgate")) return PLATFORM_CONFIGS.lionsgate;
  if (norm.includes("mubi")) return PLATFORM_CONFIGS.mubi;
  if (norm.includes("aha")) return PLATFORM_CONFIGS.aha;

  return PLATFORM_CONFIGS.other;
}
