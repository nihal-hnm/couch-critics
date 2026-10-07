/**
 * =============================================================================
 * Couch Critics — Streaming & OTT Types
 * =============================================================================
 */

export type StreamingPlatformId =
  | "netflix"
  | "prime"
  | "hotstar"
  | "appletv"
  | "disney"
  | "youtube"
  | "sonyliv"
  | "zee5"
  | "mxplayer"
  | "crunchyroll"
  | "lionsgate"
  | "mubi"
  | "aha"
  | "other";

export interface StreamingPlatform {
  name: string;
  platformId: StreamingPlatformId;
  logo: string;
  url: string;
  category?: "subscription" | "rent" | "buy" | "free";
  isPrimary?: boolean;
}

export interface TitleWatchInfo {
  tmdbId?: number;
  title: string;
  type: "movie" | "series";
  poster?: string | null;
  primaryPlatform?: string;
  watchNowUrl?: string;
  justWatchUrl: string;
  platforms: StreamingPlatform[];
  region?: string;
  isVerified?: boolean;
}
