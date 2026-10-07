/**
 * =============================================================================
 * Showcase Media Items — Cinematic Poster Catalog
 * =============================================================================
 * Curated high-res posters from TMDB for the dynamic ambient backgrounds,
 * hero marquees, and Netflix-style authentication pages.
 */

import type { Shelf, MovieEntry } from "./types";

export interface MarqueeMediaItem {
  id: string;
  title: string;
  mediaType: "movie" | "tv";
  posterUrl: string;
  releaseYear: string;
  shelf?: Shelf;
  entry?: MovieEntry;
}

export const SHOWCASE_MEDIA_ITEMS: MarqueeMediaItem[] = [
  // ── TV Shows ──────────────────────────────────────────
  {
    id: "showcase-1396",
    title: "Breaking Bad",
    mediaType: "tv",
    posterUrl: "https://image.tmdb.org/t/p/w500/anFx9aTOOYqgS3v7x3R84Kz67ly.jpg",
    releaseYear: "2008",
  },
  {
    id: "showcase-95396",
    title: "Severance",
    mediaType: "tv",
    posterUrl: "https://image.tmdb.org/t/p/w500/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg",
    releaseYear: "2022",
  },
  {
    id: "showcase-136315",
    title: "The Bear",
    mediaType: "tv",
    posterUrl: "https://image.tmdb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg",
    releaseYear: "2022",
  },
  {
    id: "showcase-76331",
    title: "Succession",
    mediaType: "tv",
    posterUrl: "https://image.tmdb.org/t/p/w500/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg",
    releaseYear: "2018",
  },
  {
    id: "showcase-94605",
    title: "Arcane",
    mediaType: "tv",
    posterUrl: "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    releaseYear: "2021",
  },
  {
    id: "showcase-1399",
    title: "Game of Thrones",
    mediaType: "tv",
    posterUrl: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    releaseYear: "2011",
  },
  {
    id: "showcase-66732",
    title: "Stranger Things",
    mediaType: "tv",
    posterUrl: "https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    releaseYear: "2016",
  },
  {
    id: "showcase-100088",
    title: "The Last of Us",
    mediaType: "tv",
    posterUrl: "https://image.tmdb.org/t/p/w500/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg",
    releaseYear: "2023",
  },
  {
    id: "showcase-87108",
    title: "Chernobyl",
    mediaType: "tv",
    posterUrl: "https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg",
    releaseYear: "2019",
  },
  {
    id: "showcase-60059",
    title: "Better Call Saul",
    mediaType: "tv",
    posterUrl: "https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mTm7jxMR31b7by.jpg",
    releaseYear: "2015",
  },
  // ── Movies ────────────────────────────────────────────
  {
    id: "showcase-693134",
    title: "Dune: Part Two",
    mediaType: "movie",
    posterUrl: "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    releaseYear: "2024",
  },
  {
    id: "showcase-157336",
    title: "Interstellar",
    mediaType: "movie",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    releaseYear: "2014",
  },
  {
    id: "showcase-27205",
    title: "Inception",
    mediaType: "movie",
    posterUrl: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    releaseYear: "2010",
  },
  {
    id: "showcase-155",
    title: "The Dark Knight",
    mediaType: "movie",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    releaseYear: "2008",
  },
  {
    id: "showcase-569094",
    title: "Spider-Man: Across the Spider-Verse",
    mediaType: "movie",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    releaseYear: "2023",
  },
  {
    id: "showcase-872585",
    title: "Oppenheimer",
    mediaType: "movie",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    releaseYear: "2023",
  },
  {
    id: "showcase-550",
    title: "Fight Club",
    mediaType: "movie",
    posterUrl: "https://image.tmdb.org/t/p/w500/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg",
    releaseYear: "1999",
  },
  {
    id: "showcase-680",
    title: "Pulp Fiction",
    mediaType: "movie",
    posterUrl: "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    releaseYear: "1994",
  },
  {
    id: "showcase-129",
    title: "Spirited Away",
    mediaType: "movie",
    posterUrl: "https://image.tmdb.org/t/p/w500/jUo8cNmU400WtZiJss45HNXlQ2e.jpg",
    releaseYear: "2001",
  },
  {
    id: "showcase-335984",
    title: "Blade Runner 2049",
    mediaType: "movie",
    posterUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    releaseYear: "2017",
  },
];
