/**
 * =============================================================================
 * Couch Critics — Sharing & Export Utilities
 * =============================================================================
 * Supports:
 *   1. Compact Gzip URL encoding for zero-dependency public journal links
 *   2. Rich Markdown formatting for Discord, Reddit, and messaging apps
 *   3. Plain-text bulleted summaries for quick texting
 *   4. CSV export for Letterboxd / IMDb / spreadsheet imports
 *   5. JSON export for complete data backup & portability
 *   6. Cross-platform clipboard copying with fallback
 */

import type { MovieEntry, Shelf } from "./types";

export type ShareScope = "all" | "watched" | "watching" | "toWatch";

export interface CompactEntry {
  i: number; // tmdbId
  t: string; // title
  y: string; // releaseYear
  p?: string; // poster path
  m: "m" | "t"; // mediaType
  s: "a" | "c" | "w"; // shelf: archive(watched), current(watching), wishlist(toWatch)
  r?: number; // rating (1-10)
  n?: string; // notes/review
  g?: string[]; // genres
  d?: string; // director
  cs?: number; // current season
  ce?: number; // current episode
  te?: number; // total episodes
  dc?: string; // date completed
}

export interface SharedJournalPayload {
  userName: string;
  createdAt: number;
  scope: ShareScope;
  entries: MovieEntry[];
  stats: {
    total: number;
    watchedCount: number;
    watchingCount: number;
    toWatchCount: number;
    avgRating?: number;
    topGenres: string[];
  };
}

/** Helper to clean poster URL for compact storage */
function extractPosterPath(url?: string | null): string | undefined {
  if (!url) return undefined;
  const match = url.match(/\/([a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp))$/i);
  return match ? `/${match[1]}` : url;
}

/** Helper to rebuild full poster URL */
function restorePosterPath(path?: string): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/w500${path.startsWith("/") ? path : `/${path}`}`;
}

/** Convert MovieEntry list to compact representation */
function toCompact(entries: MovieEntry[]): CompactEntry[] {
  return entries.map((e) => {
    const isTv = e.tmdb.mediaType === "tv";
    const shelfCode: "a" | "c" | "w" =
      e.shelf === "watched" ? "a" : e.shelf === "watching" ? "c" : "w";

    const item: CompactEntry = {
      i: e.tmdb.tmdbId,
      t: e.tmdb.title,
      y: e.tmdb.releaseYear || "",
      p: extractPosterPath(e.tmdb.posterUrl),
      m: isTv ? "t" : "m",
      s: shelfCode,
    };

    if (e.shelf === "watched" && e.review?.rating) {
      item.r = e.review.rating;
    }
    if (e.shelf === "watched" && e.review?.notes) {
      item.n = e.review.notes.slice(0, 300); // cap to keep payload compact
    }
    if (e.shelf === "watched" && e.review?.dateCompleted) {
      item.dc = e.review.dateCompleted;
    }

    if (e.shelf === "watching") {
      if (e.progress?.currentSeason) item.cs = e.progress.currentSeason;
      if (e.progress?.currentEpisode) item.ce = e.progress.currentEpisode;
      if (e.progress?.totalEpisodes || e.tmdb.totalEpisodes) {
        item.te = e.progress?.totalEpisodes || e.tmdb.totalEpisodes;
      }
    }

    if (e.tmdb.director) item.d = e.tmdb.director;
    if (e.tmdb.genres && e.tmdb.genres.length > 0) {
      item.g = e.tmdb.genres.slice(0, 3);
    }

    return item;
  });
}

/** Convert compact representation back to full MovieEntry array */
function fromCompact(compactList: CompactEntry[]): MovieEntry[] {
  return compactList.map((c) => {
    const shelf: Shelf = c.s === "a" ? "watched" : c.s === "c" ? "watching" : "toWatch";
    const mediaType: "movie" | "tv" = c.m === "t" ? "tv" : "movie";

    const entry: MovieEntry = {
      id: `shared-${c.i}-${Math.random().toString(36).slice(2, 7)}`,
      shelf,
      tmdb: {
        tmdbId: c.i,
        title: c.t,
        releaseYear: c.y,
        posterUrl: restorePosterPath(c.p),
        runtime: mediaType === "tv" ? 45 : 120,
        genres: c.g || [],
        director: c.d || "",
        overview: "",
        mediaType,
        totalEpisodes: c.te,
      },
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (shelf === "watched" && (c.r || c.n || c.dc)) {
      entry.review = {
        rating: c.r || 0,
        notes: c.n || "",
        tags: [],
        dateCompleted: c.dc || "",
      };
    }

    if (shelf === "watching") {
      entry.progress = {
        currentSeason: c.cs || 1,
        currentEpisode: c.ce || 1,
        totalEpisodes: c.te || 10,
      };
    }

    return entry;
  });
}

/** Convert bytes to URL-safe base64 */
function uint8ToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Convert URL-safe base64 back to Uint8Array */
function base64UrlToUint8(str: string): Uint8Array {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encodes a journal payload into a compressed GZIP base64url string.
 */
export async function encodeSharePayload(
  entries: MovieEntry[],
  scope: ShareScope,
  userName = "Critic"
): Promise<string> {
  const filtered = filterEntriesByScope(entries, scope);
  const compact = toCompact(filtered);

  const raw = {
    u: userName,
    s: scope,
    t: Date.now(),
    e: compact,
  };

  const jsonStr = JSON.stringify(raw);

  // Modern browser CompressionStream
  if (typeof CompressionStream !== "undefined") {
    try {
      const stream = new Blob([jsonStr])
        .stream()
        .pipeThrough(new CompressionStream("gzip"));
      const buffer = await new Response(stream).arrayBuffer();
      return uint8ToBase64Url(new Uint8Array(buffer));
    } catch {
      // Fallback to uncompressed base64url
    }
  }

  // Fallback
  return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
}

/**
 * Decodes a compressed GZIP base64url string into a SharedJournalPayload.
 */
export async function decodeSharePayload(
  encoded: string
): Promise<SharedJournalPayload | null> {
  if (!encoded || encoded.trim() === "") return null;

  try {
    let jsonStr = "";

    if (typeof DecompressionStream !== "undefined") {
      try {
        const bytes = base64UrlToUint8(encoded);
        const stream = new Blob([bytes.buffer as ArrayBuffer])
          .stream()
          .pipeThrough(new DecompressionStream("gzip"));
        jsonStr = await new Response(stream).text();
      } catch {
        // Fallback to simple unescape base64
        jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
      }
    } else {
      jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
    }

    const parsed = JSON.parse(jsonStr);
    const compactList: CompactEntry[] = Array.isArray(parsed.e) ? parsed.e : [];
    const entries = fromCompact(compactList);

    const watchedCount = entries.filter((e) => e.shelf === "watched").length;
    const watchingCount = entries.filter((e) => e.shelf === "watching").length;
    const toWatchCount = entries.filter((e) => e.shelf === "toWatch").length;

    const ratedEntries = entries.filter((e) => e.shelf === "watched" && e.review?.rating);
    const avgRating =
      ratedEntries.length > 0
        ? Math.round(
            (ratedEntries.reduce((sum, e) => sum + (e.review?.rating || 0), 0) /
              ratedEntries.length) *
              10
          ) / 10
        : undefined;

    // Top genres
    const genreMap = new Map<string, number>();
    for (const e of entries) {
      for (const g of e.tmdb.genres || []) {
        genreMap.set(g, (genreMap.get(g) || 0) + 1);
      }
    }
    const topGenres = Array.from(genreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name]) => name);

    return {
      userName: parsed.u || "Couch Critic",
      createdAt: parsed.t || Date.now(),
      scope: parsed.s || "all",
      entries,
      stats: {
        total: entries.length,
        watchedCount,
        watchingCount,
        toWatchCount,
        avgRating,
        topGenres,
      },
    };
  } catch (err) {
    console.error("Failed to decode shared journal payload:", err);
    return null;
  }
}

/** Filter entries based on the chosen scope */
export function filterEntriesByScope(entries: MovieEntry[], scope: ShareScope): MovieEntry[] {
  switch (scope) {
    case "watched":
      return entries.filter((e) => e.shelf === "watched");
    case "watching":
      return entries.filter((e) => e.shelf === "watching");
    case "toWatch":
      return entries.filter((e) => e.shelf === "toWatch");
    case "all":
    default:
      return entries;
  }
}

/** Generate a clean Markdown summary for Discord, Reddit, or notes */
export function generateMarkdownShare(
  entries: MovieEntry[],
  scope: ShareScope,
  userName = "Critic"
): string {
  const watching = entries.filter((e) => e.shelf === "watching");
  const toWatch = entries.filter((e) => e.shelf === "toWatch");
  const watched = entries.filter((e) => e.shelf === "watched");

  const lines: string[] = [];
  lines.push(`## 🍿 ${userName}'s Cinema Journal`);
  lines.push(`*Curated via [Couch Critics](https://couch-critics-phi.vercel.app)*\n`);

  if (scope === "all" || scope === "watching") {
    if (watching.length > 0) {
      lines.push(`### ▶️ Currently Watching (${watching.length})`);
      for (const e of watching) {
        const isTv = e.tmdb.mediaType === "tv";
        const progress = isTv && e.progress?.currentSeason && e.progress?.currentEpisode
          ? ` *(S${e.progress.currentSeason}:E${e.progress.currentEpisode})*`
          : "";
        lines.push(`- **${e.tmdb.title}** (${e.tmdb.releaseYear || "N/A"})${progress}`);
      }
      lines.push("");
    }
  }

  if (scope === "all" || scope === "toWatch") {
    if (toWatch.length > 0) {
      lines.push(`### ⏳ To Watch Backlog (${toWatch.length})`);
      for (const e of toWatch.slice(0, 50)) {
        const director = e.tmdb.director ? ` — dir. ${e.tmdb.director}` : "";
        lines.push(`- **${e.tmdb.title}** (${e.tmdb.releaseYear || "N/A"})${director}`);
      }
      if (toWatch.length > 50) {
        lines.push(`*...and ${toWatch.length - 50} more titles in backlog*`);
      }
      lines.push("");
    }
  }

  if (scope === "all" || scope === "watched") {
    if (watched.length > 0) {
      lines.push(`### 🏆 Watched Archive (${watched.length})`);
      for (const e of watched.slice(0, 50)) {
        const rating = e.review?.rating ? ` — ★ **${e.review.rating}/10**` : "";
        const note = e.review?.notes ? ` — *"${e.review.notes.slice(0, 80)}"*` : "";
        lines.push(`- **${e.tmdb.title}** (${e.tmdb.releaseYear || "N/A"})${rating}${note}`);
      }
      if (watched.length > 50) {
        lines.push(`*...and ${watched.length - 50} more in watched archive*`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

/** Generate a concise plain text summary */
export function generatePlainTextShare(
  entries: MovieEntry[],
  scope: ShareScope,
  userName = "Critic"
): string {
  const watching = entries.filter((e) => e.shelf === "watching");
  const toWatch = entries.filter((e) => e.shelf === "toWatch");
  const watched = entries.filter((e) => e.shelf === "watched");

  const lines: string[] = [];
  lines.push(`${userName}'s Couch Critics Journal:`);

  if ((scope === "all" || scope === "watching") && watching.length > 0) {
    lines.push(`\n[Currently Watching - ${watching.length}]`);
    watching.slice(0, 15).forEach((e) => {
      const isTv = e.tmdb.mediaType === "tv";
      const ep = isTv && e.progress ? ` (S${e.progress.currentSeason || 1}:E${e.progress.currentEpisode || 1})` : "";
      lines.push(`• ${e.tmdb.title} (${e.tmdb.releaseYear})${ep}`);
    });
  }

  if ((scope === "all" || scope === "toWatch") && toWatch.length > 0) {
    lines.push(`\n[To Watch Backlog - ${toWatch.length}]`);
    toWatch.slice(0, 15).forEach((e) => {
      lines.push(`• ${e.tmdb.title} (${e.tmdb.releaseYear})`);
    });
  }

  if ((scope === "all" || scope === "watched") && watched.length > 0) {
    lines.push(`\n[Watched Archive - ${watched.length}]`);
    watched.slice(0, 20).forEach((e) => {
      const r = e.review?.rating ? ` [${e.review.rating}/10]` : "";
      lines.push(`• ${e.tmdb.title} (${e.tmdb.releaseYear})${r}`);
    });
  }

  lines.push("\nView full journal: https://couch-critics-phi.vercel.app");
  return lines.join("\n");
}

/** Generate a CSV file export (compatible with Letterboxd & Excel) */
export function generateCsvShare(entries: MovieEntry[]): string {
  const headers = [
    "Title",
    "Year",
    "Media Type",
    "Shelf",
    "Rating",
    "Review Notes",
    "Date Completed",
    "Runtime (mins)",
    "Director",
    "Genres",
    "TMDB ID",
  ];

  const rows = entries.map((e) => {
    const isTv = e.tmdb.mediaType === "tv";
    const escapeCsv = (str: string | number | undefined | null) => {
      if (str === undefined || str === null) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    return [
      escapeCsv(e.tmdb.title),
      escapeCsv(e.tmdb.releaseYear),
      escapeCsv(isTv ? "tv" : "movie"),
      escapeCsv(e.shelf),
      escapeCsv(e.review?.rating ?? ""),
      escapeCsv(e.review?.notes ?? ""),
      escapeCsv(e.review?.dateCompleted ?? ""),
      escapeCsv(e.tmdb.runtime ?? 0),
      escapeCsv(e.tmdb.director ?? ""),
      escapeCsv((e.tmdb.genres || []).join(", ")),
      escapeCsv(e.tmdb.tmdbId),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

/** Generate a JSON file export */
export function generateJsonShare(entries: MovieEntry[], userName = "Critic"): string {
  const exportData = {
    exportedAt: new Date().toISOString(),
    exporter: userName,
    app: "Couch Critics",
    version: "1.0",
    totalEntries: entries.length,
    counts: {
      watching: entries.filter((e) => e.shelf === "watching").length,
      toWatch: entries.filter((e) => e.shelf === "toWatch").length,
      watched: entries.filter((e) => e.shelf === "watched").length,
    },
    entries,
  };

  return JSON.stringify(exportData, null, 2);
}

/** Trigger client-side file download */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Copy text to clipboard with modern fallback */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
    }
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    return false;
  }
}
