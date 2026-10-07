/**
 * =============================================================================
 * Couch Critics — Starter / Seed Data
 * =============================================================================
 *
 * Rich pre-populated cinematic entries with granular episode-wise watching data,
 * realistic ratings, personal notes, and multi-year journey dates.
 */

import type { MovieEntry } from "./types";

export const STARTER_ENTRIES: MovieEntry[] = [
  // ── TV Show: Breaking Bad (Watching — Active Episode Progress) ───────────
  {
    id: "entry-bb-1",
    shelf: "watching",
    addedAt: "2024-01-10T14:20:00.000Z",
    updatedAt: "2024-03-28T21:15:00.000Z",
    tmdb: {
      tmdbId: 1396,
      title: "Breaking Bad",
      mediaType: "tv",
      releaseYear: "2008",
      runtime: 47,
      director: "Vince Gilligan",
      overview: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
      posterUrl: "https://image.tmdb.org/t/p/w500/anFx9aTOOYqgS3v7x3R84Kz67ly.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
      genres: ["Drama", "Crime", "Thriller"],
      totalEpisodes: 62,
      totalSeasons: 5,
      seasons: [
        {
          seasonNumber: 1,
          name: "Season 1",
          episodeCount: 7,
          episodes: [
            { seasonNumber: 1, episodeNumber: 1, title: "Pilot", runtime: 58 },
            { seasonNumber: 1, episodeNumber: 2, title: "Cat's in the Bag...", runtime: 48 },
            { seasonNumber: 1, episodeNumber: 3, title: "...And the Bag's in the River", runtime: 48 },
            { seasonNumber: 1, episodeNumber: 4, title: "Cancer Man", runtime: 48 },
            { seasonNumber: 1, episodeNumber: 5, title: "Gray Matter", runtime: 48 },
            { seasonNumber: 1, episodeNumber: 6, title: "Crazy Handful of Nothin'", runtime: 48 },
            { seasonNumber: 1, episodeNumber: 7, title: "A No-Rough-Stuff-Type Deal", runtime: 48 },
          ],
        },
        {
          seasonNumber: 2,
          name: "Season 2",
          episodeCount: 13,
          episodes: [
            { seasonNumber: 2, episodeNumber: 1, title: "Seven Thirty-Seven", runtime: 47 },
            { seasonNumber: 2, episodeNumber: 2, title: "Grilled", runtime: 48 },
            { seasonNumber: 2, episodeNumber: 3, title: "Bit by a Dead Bee", runtime: 47 },
            { seasonNumber: 2, episodeNumber: 4, title: "Down", runtime: 47 },
            { seasonNumber: 2, episodeNumber: 5, title: "Breakage", runtime: 47 },
            { seasonNumber: 2, episodeNumber: 6, title: "Peekaboo", runtime: 47 },
            { seasonNumber: 2, episodeNumber: 7, title: "Negro y Azul", runtime: 47 },
            { seasonNumber: 2, episodeNumber: 8, title: "Better Call Saul", runtime: 47 },
            { seasonNumber: 2, episodeNumber: 9, title: "4 Days Out", runtime: 47 },
            { seasonNumber: 2, episodeNumber: 10, title: "Over", runtime: 47 },
            { seasonNumber: 2, episodeNumber: 11, title: "Mandala", runtime: 47 },
            { seasonNumber: 2, episodeNumber: 12, title: "Phoenix", runtime: 47 },
            { seasonNumber: 2, episodeNumber: 13, title: "ABQ", runtime: 47 },
          ],
        },
      ],
    },
    progress: {
      currentSeason: 2,
      totalSeasons: 5,
      currentEpisode: 6,
      totalEpisodes: 62,
      watchedEpisodes: [
        "S1E1", "S1E2", "S1E3", "S1E4", "S1E5", "S1E6", "S1E7",
        "S2E1", "S2E2", "S2E3", "S2E4", "S2E5", "S2E6",
      ],
      episodeHistory: [
        { id: "log-1", seasonNumber: 1, episodeNumber: 1, episodeTitle: "Pilot", runtimeMinutes: 58, watchedAt: "2024-01-12T20:00:00.000Z" },
        { id: "log-2", seasonNumber: 1, episodeNumber: 2, episodeTitle: "Cat's in the Bag...", runtimeMinutes: 48, watchedAt: "2024-01-15T21:00:00.000Z" },
        { id: "log-3", seasonNumber: 1, episodeNumber: 3, episodeTitle: "...And the Bag's in the River", runtimeMinutes: 48, watchedAt: "2024-01-18T20:30:00.000Z" },
        { id: "log-4", seasonNumber: 1, episodeNumber: 7, episodeTitle: "A No-Rough-Stuff-Type Deal", runtimeMinutes: 48, watchedAt: "2024-02-05T22:00:00.000Z" },
        { id: "log-5", seasonNumber: 2, episodeNumber: 1, episodeTitle: "Seven Thirty-Seven", runtimeMinutes: 47, watchedAt: "2024-02-20T21:00:00.000Z" },
        { id: "log-6", seasonNumber: 2, episodeNumber: 6, episodeTitle: "Peekaboo", runtimeMinutes: 47, watchedAt: "2024-03-28T21:15:00.000Z" },
      ],
      minutesWatched: 13 * 47,
    },
  },

  // ── TV Show: Severance (Watched — Complete Season 1) ───────────────────────
  {
    id: "entry-sev-1",
    shelf: "watched",
    addedAt: "2023-11-01T10:00:00.000Z",
    updatedAt: "2023-12-15T19:30:00.000Z",
    tmdb: {
      tmdbId: 95396,
      title: "Severance",
      mediaType: "tv",
      releaseYear: "2022",
      runtime: 53,
      director: "Dan Erickson & Ben Stiller",
      overview: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.",
      posterUrl: "https://image.tmdb.org/t/p/w500/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/ixgFmf1X59PUZam2qbAfskx2gQr.jpg",
      genres: ["Sci-Fi", "Drama", "Mystery"],
      totalEpisodes: 9,
      totalSeasons: 1,
      seasons: [
        {
          seasonNumber: 1,
          name: "Season 1",
          episodeCount: 9,
          episodes: [
            { seasonNumber: 1, episodeNumber: 1, title: "Good News About Hell", runtime: 57 },
            { seasonNumber: 1, episodeNumber: 2, title: "Half Loop", runtime: 53 },
            { seasonNumber: 1, episodeNumber: 3, title: "In Perpetuity", runtime: 54 },
            { seasonNumber: 1, episodeNumber: 4, title: "The You You Are", runtime: 53 },
            { seasonNumber: 1, episodeNumber: 5, title: "The Grim Barbarity of Optics and Design", runtime: 54 },
            { seasonNumber: 1, episodeNumber: 6, title: "Hide and Seek", runtime: 50 },
            { seasonNumber: 1, episodeNumber: 7, title: "Defiant Jazz", runtime: 51 },
            { seasonNumber: 1, episodeNumber: 8, title: "What's for Dinner?", runtime: 40 },
            { seasonNumber: 1, episodeNumber: 9, title: "The We We Are", runtime: 43 },
          ],
        },
      ],
    },
    progress: {
      currentSeason: 1,
      totalSeasons: 1,
      currentEpisode: 9,
      totalEpisodes: 9,
      watchedEpisodes: ["S1E1", "S1E2", "S1E3", "S1E4", "S1E5", "S1E6", "S1E7", "S1E8", "S1E9"],
      minutesWatched: 9 * 53,
    },
    review: {
      rating: 10,
      notes: "The season finale was one of the most intense hours of television I have ever witnessed. Impeccable set design and razor-sharp pacing.",
      tags: ["masterpiece", "mind-bending", "cliffhanger"],
      dateCompleted: "2023-12-15T19:30:00.000Z",
    },
  },

  // ── TV Show: The Bear (Watching — Season 2) ───────────────────────────────
  {
    id: "entry-bear-1",
    shelf: "watching",
    addedAt: "2024-02-14T11:00:00.000Z",
    updatedAt: "2024-03-10T22:45:00.000Z",
    tmdb: {
      tmdbId: 136315,
      title: "The Bear",
      mediaType: "tv",
      releaseYear: "2022",
      runtime: 34,
      director: "Christopher Storer",
      overview: "A young fine-dining chef comes home to Chicago to run his family Italian beef sandwich shop after a heartbreaking death.",
      posterUrl: "https://image.tmdb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/aJtG4txtmiRHwAAqENQHZvBs6kY.jpg",
      genres: ["Drama", "Comedy"],
      totalEpisodes: 28,
      totalSeasons: 3,
      seasons: [
        {
          seasonNumber: 1,
          name: "Season 1",
          episodeCount: 8,
          episodes: Array.from({ length: 8 }, (_, i) => ({
            seasonNumber: 1,
            episodeNumber: i + 1,
            title: `Episode ${i + 1}`,
            runtime: 32,
          })),
        },
        {
          seasonNumber: 2,
          name: "Season 2",
          episodeCount: 10,
          episodes: Array.from({ length: 10 }, (_, i) => ({
            seasonNumber: 2,
            episodeNumber: i + 1,
            title: `Episode ${i + 1}`,
            runtime: 36,
          })),
        },
      ],
    },
    progress: {
      currentSeason: 2,
      totalSeasons: 3,
      currentEpisode: 6,
      totalEpisodes: 28,
      watchedEpisodes: [
        "S1E1", "S1E2", "S1E3", "S1E4", "S1E5", "S1E6", "S1E7", "S1E8",
        "S2E1", "S2E2", "S2E3", "S2E4", "S2E5", "S2E6",
      ],
      minutesWatched: 14 * 34,
    },
  },

  // ── Movie: Dune: Part Two (Watched — Rated 10) ────────────────────────────
  {
    id: "entry-dune-2",
    shelf: "watched",
    addedAt: "2024-03-01T18:00:00.000Z",
    updatedAt: "2024-03-02T22:00:00.000Z",
    tmdb: {
      tmdbId: 693134,
      title: "Dune: Part Two",
      mediaType: "movie",
      releaseYear: "2024",
      runtime: 166,
      director: "Denis Villeneuve",
      overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
      posterUrl: "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
      genres: ["Sci-Fi", "Adventure"],
    },
    review: {
      rating: 10,
      notes: "Cinema at its absolute grandest. Greig Fraser's cinematography and Zimmer's score demand the biggest screen possible.",
      tags: ["masterpiece", "sci-fi-epic", "theatrical-perfection"],
      dateCompleted: "2024-03-02T22:00:00.000Z",
    },
  },

  // ── Movie: Oppenheimer (Watched — Rated 9) ────────────────────────────────
  {
    id: "entry-opp-1",
    shelf: "watched",
    addedAt: "2023-07-21T15:00:00.000Z",
    updatedAt: "2023-07-22T21:00:00.000Z",
    tmdb: {
      tmdbId: 872585,
      title: "Oppenheimer",
      mediaType: "movie",
      releaseYear: "2023",
      runtime: 180,
      director: "Christopher Nolan",
      overview: "The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.",
      posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
      genres: ["Drama", "History"],
    },
    review: {
      rating: 9,
      notes: "A relentless biographical thriller that never loses its momentum across 3 hours. Cillian Murphy gives a career-defining performance.",
      tags: ["intense", "historical", "nolan"],
      dateCompleted: "2023-07-22T21:00:00.000Z",
    },
  },

  // ── Movie: Spider-Man: Across the Spider-Verse (Watched — Rated 10) ───────
  {
    id: "entry-spidey-1",
    shelf: "watched",
    addedAt: "2023-06-05T17:00:00.000Z",
    updatedAt: "2023-06-06T20:30:00.000Z",
    tmdb: {
      tmdbId: 569094,
      title: "Spider-Man: Across the Spider-Verse",
      mediaType: "movie",
      releaseYear: "2023",
      runtime: 140,
      director: "Joaquim Dos Santos, Kemp Powers",
      overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse.",
      posterUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg",
      genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    },
    review: {
      rating: 10,
      notes: "Every single frame could hang in an art museum. The emotional weight between Miles and his parents grounds the multiverse chaos.",
      tags: ["visual-miracle", "animation-peak", "rewatchable"],
      dateCompleted: "2023-06-06T20:30:00.000Z",
    },
  },

  // ── Movie: Interstellar (Watched — 2022 Journey) ──────────────────────────
  {
    id: "entry-interstellar-1",
    shelf: "watched",
    addedAt: "2022-09-10T12:00:00.000Z",
    updatedAt: "2022-09-10T23:00:00.000Z",
    tmdb: {
      tmdbId: 157336,
      title: "Interstellar",
      mediaType: "movie",
      releaseYear: "2014",
      runtime: 169,
      director: "Christopher Nolan",
      overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
      posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/8sNiAPPYU14PUepFNeSNGUTiHW.jpg",
      genres: ["Adventure", "Drama", "Sci-Fi"],
    },
    review: {
      rating: 9,
      notes: "Revisited in 4K — the docking sequence and Miller's planet still give me goosebumps every single time.",
      tags: ["emotional", "soundtrack-gold", "space"],
      dateCompleted: "2022-09-10T23:00:00.000Z",
    },
  },

  // ── Movie: Challengers (To Watch) ─────────────────────────────────────────
  {
    id: "entry-challengers-1",
    shelf: "toWatch",
    addedAt: "2024-04-01T15:00:00.000Z",
    updatedAt: "2024-04-01T15:00:00.000Z",
    tmdb: {
      tmdbId: 937287,
      title: "Challengers",
      mediaType: "movie",
      releaseYear: "2024",
      runtime: 131,
      director: "Luca Guadagnino",
      overview: "Tennis player turned coach Tashi has taken her husband, Art, and transformed him into a world-famous grand slam champion.",
      posterUrl: "https://image.tmdb.org/t/p/w500/H6vke7zGiuLsz4v4RPeReb9rsv.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/tq8COKsI99Bivjd4CZIYVGoKcIx.jpg",
      genres: ["Drama", "Romance"],
    },
  },

  // ── TV Show: Succession (Watched) ─────────────────────────────────────────
  {
    id: "entry-succ-1",
    shelf: "watched",
    addedAt: "2023-04-01T12:00:00.000Z",
    updatedAt: "2023-05-30T22:00:00.000Z",
    tmdb: {
      tmdbId: 76331,
      title: "Succession",
      mediaType: "tv",
      releaseYear: "2018",
      runtime: 60,
      director: "Jesse Armstrong",
      overview: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their aging father steps down from the company.",
      posterUrl: "https://image.tmdb.org/t/p/w500/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/d87JXX3DLkRJMfm5StCmmnmhHuX.jpg",
      genres: ["Drama"],
      totalEpisodes: 39,
      totalSeasons: 4,
    },
    progress: {
      currentSeason: 4,
      totalSeasons: 4,
      currentEpisode: 39,
      totalEpisodes: 39,
      watchedEpisodes: Array.from({ length: 39 }, (_, i) => `S${Math.floor(i / 10) + 1}E${(i % 10) + 1}`),
      minutesWatched: 39 * 60,
    },
    review: {
      rating: 10,
      notes: "Shakespearean tragedy meets modern corporate satire. Episode 3 of Season 4 changed television history.",
      tags: ["writing-perfection", "drama", "unmatched-dialogue"],
      dateCompleted: "2023-05-30T22:00:00.000Z",
    },
  },
];
