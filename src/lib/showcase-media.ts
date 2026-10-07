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
  {
    "id": "showcase-1396",
    "title": "Breaking Bad",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/anFx9aTOOYqgS3v7x3R84Kz67ly.jpg",
    "releaseYear": "2008"
  },
  {
    "id": "showcase-60059",
    "title": "Better Call Saul",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mTm7jxMR31b7by.jpg",
    "releaseYear": "2015"
  },
  {
    "id": "showcase-1399",
    "title": "Game of Thrones",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    "releaseYear": "2011"
  },
  {
    "id": "showcase-94997",
    "title": "House of the Dragon",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/7V0Ebks0GgpKvQ7QbLAIdX5dos4.jpg",
    "releaseYear": "2022"
  },
  {
    "id": "showcase-66732",
    "title": "Stranger Things",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    "releaseYear": "2016"
  },
  {
    "id": "showcase-100088",
    "title": "The Last of Us",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg",
    "releaseYear": "2023"
  },
  {
    "id": "showcase-76331",
    "title": "Succession",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg",
    "releaseYear": "2018"
  },
  {
    "id": "showcase-87108",
    "title": "Chernobyl",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg",
    "releaseYear": "2019"
  },
  {
    "id": "showcase-94605",
    "title": "Arcane",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    "releaseYear": "2021"
  },
  {
    "id": "showcase-95396",
    "title": "Severance",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg",
    "releaseYear": "2022"
  },
  {
    "id": "showcase-136315",
    "title": "The Bear",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg",
    "releaseYear": "2022"
  },
  {
    "id": "showcase-126308",
    "title": "Shōgun",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg",
    "releaseYear": "2024"
  },
  {
    "id": "showcase-70523",
    "title": "Dark",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/apbrTkGenL999PrRahqUhvPT3C2.jpg",
    "releaseYear": "2017"
  },
  {
    "id": "showcase-60574",
    "title": "Peaky Blinders",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    "releaseYear": "2013"
  },
  {
    "id": "showcase-46648",
    "title": "True Detective",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/zYqVTiHK5ZajYcNzAW7qWte5NWS.jpg",
    "releaseYear": "2014"
  },
  {
    "id": "showcase-76479",
    "title": "The Boys",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg",
    "releaseYear": "2019"
  },
  {
    "id": "showcase-60622",
    "title": "Fargo",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/a3VW6khsyUVKrG0GBCWFG3NzWPX.jpg",
    "releaseYear": "2014"
  },
  {
    "id": "showcase-67744",
    "title": "MINDHUNTER",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/fbKE87mojpIETWepSbD5Qt741fp.jpg",
    "releaseYear": "2017"
  },
  {
    "id": "showcase-19885",
    "title": "Sherlock",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg",
    "releaseYear": "2010"
  },
  {
    "id": "showcase-67070",
    "title": "Fleabag",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/vFn0nLPcIggPH5LTWWaJ2hcsGlc.jpg",
    "releaseYear": "2016"
  },
  {
    "id": "showcase-97546",
    "title": "Ted Lasso",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/uRHsiw1wLxPHFXkkv4Ix1s0O6f4.jpg",
    "releaseYear": "2020"
  },
  {
    "id": "showcase-1438",
    "title": "The Wire",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/4lbclFySvugI51fwsyxBTOm4DqK.jpg",
    "releaseYear": "2002"
  },
  {
    "id": "showcase-1398",
    "title": "The Sopranos",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/rTc7ZXdroqjkKivFPvCPX0Ru7uw.jpg",
    "releaseYear": "1999"
  },
  {
    "id": "showcase-1405",
    "title": "Dexter",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/i8ORB1biusVy703lGxUi5Rle6zA.jpg",
    "releaseYear": "2006"
  },
  {
    "id": "showcase-93405",
    "title": "Squid Game",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg",
    "releaseYear": "2021"
  },
  {
    "id": "showcase-82452",
    "title": "Avatar: The Last Airbender",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/lzZpWEaqzP0qVA5nkCc5ASbNcSy.jpg",
    "releaseYear": "2024"
  },
  {
    "id": "showcase-63351",
    "title": "Narcos",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0waol2hq35U4ah.jpg",
    "releaseYear": "2015"
  },
  {
    "id": "showcase-95557",
    "title": "INVINCIBLE",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/4tblBrslcKSifMVZ3TmtT2ukMor.jpg",
    "releaseYear": "2021"
  },
  {
    "id": "showcase-87739",
    "title": "The Queen's Gambit",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
    "releaseYear": "2020"
  },
  {
    "id": "showcase-42009",
    "title": "Black Mirror",
    "mediaType": "tv",
    "posterUrl": "https://image.tmdb.org/t/p/w500/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg",
    "releaseYear": "2011"
  },

  {
    "id": "showcase-278",
    "title": "The Shawshank Redemption",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    "releaseYear": "1994"
  },
  {
    "id": "showcase-238",
    "title": "The Godfather",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    "releaseYear": "1972"
  },
  {
    "id": "showcase-155",
    "title": "The Dark Knight",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    "releaseYear": "2008"
  },
  {
    "id": "showcase-680",
    "title": "Pulp Fiction",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    "releaseYear": "1994"
  },
  {
    "id": "showcase-550",
    "title": "Fight Club",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg",
    "releaseYear": "1999"
  },
  {
    "id": "showcase-27205",
    "title": "Inception",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
    "releaseYear": "2010"
  },
  {
    "id": "showcase-157336",
    "title": "Interstellar",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
    "releaseYear": "2014"
  },
  {
    "id": "showcase-438631",
    "title": "Dune",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/v1tRXZ4JtD2Iv6fjkPvT4GiwslV.jpg",
    "releaseYear": "2021"
  },
  {
    "id": "showcase-603",
    "title": "The Matrix",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg",
    "releaseYear": "1999"
  },
  {
    "id": "showcase-98",
    "title": "Gladiator",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/aDb548BOkFfI4nFm0kx8A3Ezh7H.jpg",
    "releaseYear": "2000"
  },
  {
    "id": "showcase-496243",
    "title": "Parasite",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    "releaseYear": "2019"
  },
  {
    "id": "showcase-244786",
    "title": "Whiplash",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    "releaseYear": "2014"
  },
  {
    "id": "showcase-324857",
    "title": "Spider-Man: Into the Spider-Verse",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    "releaseYear": "2018"
  },
  {
    "id": "showcase-1124",
    "title": "The Prestige",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/Ag2B2KHKQPukjH7WutmgnnSNurZ.jpg",
    "releaseYear": "2006"
  },
  {
    "id": "showcase-335984",
    "title": "Blade Runner 2049",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    "releaseYear": "2017"
  },
  {
    "id": "showcase-313369",
    "title": "La La Land",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    "releaseYear": "2016"
  },
  {
    "id": "showcase-348",
    "title": "Alien",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg",
    "releaseYear": "1979"
  },
  {
    "id": "showcase-414906",
    "title": "The Batman",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    "releaseYear": "2022"
  },
  {
    "id": "showcase-872585",
    "title": "Oppenheimer",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    "releaseYear": "2023"
  },
  {
    "id": "showcase-545611",
    "title": "Everything Everywhere All at Once",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/u68AjlvlutfEIcpmbYpKcdi09ut.jpg",
    "releaseYear": "2022"
  },
  {
    "id": "showcase-769",
    "title": "GoodFellas",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg",
    "releaseYear": "1990"
  },
  {
    "id": "showcase-807",
    "title": "Se7en",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg",
    "releaseYear": "1995"
  },
  {
    "id": "showcase-274",
    "title": "The Silence of the Lambs",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    "releaseYear": "1991"
  },
  {
    "id": "showcase-857",
    "title": "Saving Private Ryan",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg",
    "releaseYear": "1998"
  },
  {
    "id": "showcase-129",
    "title": "Spirited Away",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/jUo8cNmU400WtZiJss45HNXlQ2e.jpg",
    "releaseYear": "2001"
  },
  {
    "id": "showcase-354912",
    "title": "Coco",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/6Ryitt95xrO8KXuqRGm1fUuNwqF.jpg",
    "releaseYear": "2017"
  },
  {
    "id": "showcase-299536",
    "title": "Avengers: Infinity War",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    "releaseYear": "2018"
  },
  {
    "id": "showcase-361743",
    "title": "Top Gun: Maverick",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/n0YuM4f5lvGAP6MAW2kBIzugXnc.jpg",
    "releaseYear": "2022"
  },
  {
    "id": "showcase-792307",
    "title": "Poor Things",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    "releaseYear": "2023"
  },
  {
    "id": "showcase-666277",
    "title": "Past Lives",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
    "releaseYear": "2023"
  },
  {
    "id": "showcase-329",
    "title": "Jurassic Park",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/d9mtMGQDLANKieb9PbD3yK7xxzo.jpg",
    "releaseYear": "1993"
  },
  {
    "id": "showcase-280",
    "title": "Terminator 2: Judgment Day",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/jFTVD4XoWQTcg7wdyJKa8PEds5q.jpg",
    "releaseYear": "1991"
  },
  {
    "id": "showcase-693134",
    "title": "Dune: Part Two",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    "releaseYear": "2024"
  },
  {
    "id": "showcase-569094",
    "title": "Spider-Man: Across the Spider-Verse",
    "mediaType": "movie",
    "posterUrl": "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    "releaseYear": "2023"
  }
];
