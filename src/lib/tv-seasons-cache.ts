import type { TMDBSeasonData } from "./types";

export interface CachedTVSeries {
  totalSeasons: number;
  totalEpisodes: number;
  runtime: number;
  backdropUrl: string | null;
  seasons: TMDBSeasonData[];
}

export const TV_SEASONS_CATALOG: Record<number, CachedTVSeries> = {
  "1100": {
    "totalSeasons": 9,
    "totalEpisodes": 208,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/3f8aW6vcYRP6mTZdgXm83BiuB9t.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 22,
        "posterUrl": "https://image.tmdb.org/t/p/w500/7n8OEMRgIVkyPfswdBaftEBqQnI.jpg",
        "overview": "A love story in reverse: How I Met Your Mother is a fresh new comedy about Ted (Josh Radnor) and how he fell in love. When Ted's best friends Marshall (Jason Segel) and Lily (Alyson Hannigan) decide to tie the knot, it sparks the search for his own Miss Right. Helping him in his quest is his bar-hopping \"wing-man\" Barney (Neil Patrick Harris), a confirmed bachelor with plenty of wild schemes for picking up women. Ted's sights are set on the charming and independent Robin (Cobie Smulders), but destiny may have something different in mind. Told through a series of flashbacks, Ted recalls his single days, the highs and lows of dating and the search for true love."
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 22,
        "posterUrl": "https://image.tmdb.org/t/p/w500/8OEKsU865P88LrAO6dZ157VNvHV.jpg",
        "overview": "The woman of his dreams is out there — the question is, who is she? — Told in a series of flash backs, How I Met Your Mother is the hilariously unpredictable story of how twenty-something Ted meets his soul mate and says goodbye to the singles world of pick-up lines, one night stands, and relationship \"deal-breakers.\" With friends Marshall and Lily's wedding fast approaching, the outrageously inappropriate Barney remains a consummate bachelor, while Ted's romance with Robin heats up, but is she really the one for him? Things have a funny way of working out in this delightfully fresh and fast-paced comedy."
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 20,
        "posterUrl": "https://image.tmdb.org/t/p/w500/4QwuGNHzByZxXftS01EMbks7Cn7.jpg",
        "overview": "It's Season Three and the search for a soul mate has never been so wildly inappropriate! Thirty-year-old Ted is still looking for Miss Right, but his road to domestic bliss is improbably paved with punk rock girls, tattoos, adult video expos and an epic St. Patrick's Day bender. Meanwhile, as Marshall and Lily adjust to the quirks of married life, the outrageously incorrigible Barney commits a major violation of \"The Bro Code.\" Plus, Season Three features a host of hilarious guest stars, including BRITNEY SPEARS, SARAH CHALKE (TV's Scrubs), ENRIQUE IGLESIAS, MANDY MOORE and supermodel HEIDI KLUM."
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/8Ly76CWFpQ6voKvUZmOKsBwF6qH.jpg",
        "overview": "Loaded with irresistible laughter and filled with outrageous fun, there's just one word for the hit comedy How I Met Your Mother: Awesomeness!\n\nFrom dating dilemmas to career conundrums, the recently engaged Ted and his feisty friends find themselves at the crossroads of young adult life. While newlyweds Marshall and Lily contemplate parenthood, single gal Robin explores the advantages of having \"friends with benefits.\" Meanwhile, the irrepressible, opinionated Barney continues his hilariously dogged pursuit of the fairer sex. As for Ted, his Miss Right is out there, but amid bar brawls and blizzards, how will he ever find her?"
      },
      {
        "seasonNumber": 5,
        "name": "Season 5",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/hNwfnZpuiTfSRCEJz77IO3Kvib6.jpg",
        "overview": "Suit up for the hilarious Season Five of How I Met Your Mother, the outrageous, Emmy®-nominated hit starring Neil Patrick Harris, Jason Segel and Alyson Hannigan! The show's funniest season to date is loaded with hook-ups, break-ups and the return of Slapsgiving — not to mention the hottest guest stars imaginable, including Jennifer Lopez, Carrie Underwood, Amanda Peet and Rachel Bilson. On the dating front, Barney and Robin take their relationship to the next level — before calling it off — and Ted meets the roommate of his future wife in this uproarious, modern-day love story told in reverse."
      },
      {
        "seasonNumber": 6,
        "name": "Season 6",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/fKKZ5Zns5ISPoF4lwH0a14TgBxp.jpg",
        "overview": "The more things change, the more things get interesting in this all-new hilarious season of How I Met Your Mother. Ted's (Josh Radnor) search for \"the one\" continues while Marshall and Lily (Jason Segel and Alyson Hannigan) hope to become parents, Barney (Neil Patrick Harris) makes an uproariously awkward attempt to find his real father, and Robin (Cobie Smulders) finally feels like a true New Yorker. Featuring epic guest stars like Katy Perry and Jorge Garcia as \"The Blitz,\" Season Six is filled with just plain awesomeness."
      },
      {
        "seasonNumber": 7,
        "name": "Season 7",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/8tme9C6s75sj0Nn7DQrn6PlNa1B.jpg",
        "overview": "With both a baby and a wedding on the way, change is in the air and awesomeness abounds in the hilariously unpredictable Season Seven of How I Met Your Mother. As Marshall and Lily move away to start their family, Ted continues the search for the woman of his dreams. Meanwhile, Robin reveals a shocking secret and special guest star Katie Holmes joins the fun in the long-awaited return of the Slutty Pumpkin! And, wedding bells are ringing at last for confirmed bachelor Barney, but why is he wearing that ridiculous ducky tie, and just who is the \"lucky\" lady?"
      },
      {
        "seasonNumber": 8,
        "name": "Season 8",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/o6BepKycT39kubElBsnj5bWpDPU.jpg",
        "overview": "In the uproarious Eighth Season of How I Met Your Mother, the arrival of baby Marvin reminds Marshall and Lily of things they need, like sleep, better jobs and sex! Meanwhile Barney uses his playbook to win over Robin, but not her scary dad. Marshall tries to right a wrong in court in hopes of becoming a judge, and Robin's past is judged. Ted designs an amazing building, and also has designs on Barney's half-sister! But does he meet his future wife? Check out all hilarious, legend — wait for it — dary Season 8 episodes, featuring guest stars like Paul Shaffer, Ralph Macchio and Kyle MacLachlan!"
      },
      {
        "seasonNumber": 9,
        "name": "Season 9",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/ynDSoB5ilvp2qnSJp1WFCZSRjbm.jpg",
        "overview": "Suit up and give one last high-five for the legend — wait for it — dary final season of How I Met Your Mother. Surprising answers to hilarious questions will be revealed during one epic wedding weekend. Can Marshall complete a cross-country road trip and make it to the ceremony? Will Robin and Barney really tie the knot? Is Lily hiding a shocking secret? Will Ted finally meet the mother of his children... and is she truly \"the one\"? It all builds to a climactic two-part series finale, leading to one of the most talked about endings in TV history."
      }
    ]
  },
  "1396": {
    "totalSeasons": 5,
    "totalEpisodes": 62,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 7,
        "posterUrl": "https://image.tmdb.org/t/p/w500/1BP4xYv9ZG4ZVHkL7ocOziBbSYH.jpg",
        "overview": "High school chemistry teacher Walter White's life is suddenly transformed by a dire medical diagnosis. Street-savvy former student Jesse Pinkman \"teaches\" Walter a new trade."
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 13,
        "posterUrl": "https://image.tmdb.org/t/p/w500/e3oGYpoTUhOFK0BJfloru5ZmGV.jpg",
        "overview": "Walt must deal with the chain reaction of his choice, as he and Jesse face new and severe consequences. When danger and suspicion around Walt escalate, he is pushed to new levels of desperation. Just how much higher will the stakes rise? How far is Walt willing to go to ensure his family's security? Will his grand plan spiral out of control?"
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 13,
        "posterUrl": "https://image.tmdb.org/t/p/w500/ffP8Q8ew048YofHRnFVM18B2fPG.jpg",
        "overview": "Walt continues to battle dueling identities: a desperate husband and father trying to provide for his family, and a newly appointed key player in the Albuquerque drug trade. As the danger around him escalates, Walt is now entrenched in the complex worlds of an angst-ridden family on the verge of dissolution, and the ruthless and unrelenting drug cartel."
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 13,
        "posterUrl": "https://image.tmdb.org/t/p/w500/5ewrnKp4TboU4hTLT5cWO350mHj.jpg",
        "overview": "Walt and Jesse must cope with the fallout of their previous actions, both personally and professionally. Tension mounts as Walt faces a true standoff with his employer, Gus, with neither side willing or able to back down. Walt must also adjust to a new relationship with Skyler, whom while still reconciling her relationship with Walt, is committed to properly laundering Walt’s money and ensuring her sister Marie and an ailing Hank are financially stable."
      },
      {
        "seasonNumber": 5,
        "name": "Season 5",
        "episodeCount": 16,
        "posterUrl": "https://image.tmdb.org/t/p/w500/r3z70vunihrAkjILQKWHX0G2xzO.jpg",
        "overview": "Walt is faced with the prospect of moving on in a world without his enemy. As the pressure of a criminal life starts to build, Skyler struggles to keep Walt’s terrible secrets. Facing resistance from sometime adversary and former Fring lieutenant Mike, Walt tries to keep his world from falling apart even as his DEA Agent brother in law, Hank, finds numerous leads that could blaze a path straight to Walt. "
      }
    ]
  },
  "1399": {
    "totalSeasons": 8,
    "totalEpisodes": 73,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/zZqpAXxVSBtxV9qPBcscfXBcL2w.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 10,
        "posterUrl": "https://image.tmdb.org/t/p/w500/wgfKiqzuMrFIkU1M68DDDY8kGC1.jpg",
        "overview": "Trouble is brewing in the Seven Kingdoms of Westeros. For the driven inhabitants of this visionary world, control of Westeros' Iron Throne holds the lure of great power. But in a land where the seasons can last a lifetime, winter is coming...and beyond the Great Wall that protects them, an ancient evil has returned. In Season One, the story centers on three primary areas: the Stark and the Lannister families, whose designs on controlling the throne threaten a tenuous peace; the dragon princess Daenerys, heir to the former dynasty, who waits just over the Narrow Sea with her malevolent brother Viserys; and the Great Wall--a massive barrier of ice where a forgotten danger is stirring."
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 10,
        "posterUrl": "https://image.tmdb.org/t/p/w500/9xfNkPwDOqyeUvfNhs1XlWA0esP.jpg",
        "overview": "The cold winds of winter are rising in Westeros...war is coming...and five kings continue their savage quest for control of the all-powerful Iron Throne. With winter fast approaching, the coveted Iron Throne is occupied by the cruel Joffrey, counseled by his conniving mother Cersei and uncle Tyrion. But the Lannister hold on the Throne is under assault on many fronts. Meanwhile, a new leader is rising among the wildings outside the Great Wall, adding new perils for Jon Snow and the order of the Night's Watch."
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 10,
        "posterUrl": "https://image.tmdb.org/t/p/w500/5MkZjRnCKiIGn3bkXrXfndEzqOU.jpg",
        "overview": "Duplicity and treachery...nobility and honor...conquest and triumph...and, of course, dragons. In Season 3, family and loyalty are the overarching themes as many critical storylines from the first two seasons come to a brutal head. Meanwhile, the Lannisters maintain their hold on King's Landing, though stirrings in the North threaten to alter the balance of power; Robb Stark, King of the North, faces a major calamity as he tries to build on his victories; a massive army of wildlings led by Mance Rayder march for the Wall; and Daenerys Targaryen--reunited with her dragons--attempts to raise an army in her quest for the Iron Throne."
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 10,
        "posterUrl": "https://image.tmdb.org/t/p/w500/jXIMScXE4J4EVHUba1JgxZnWbo4.jpg",
        "overview": "The War of the Five Kings is drawing to a close, but new intrigues and plots are in motion, and the surviving factions must contend with enemies not only outside their ranks, but within."
      },
      {
        "seasonNumber": 5,
        "name": "Season 5",
        "episodeCount": 10,
        "posterUrl": "https://image.tmdb.org/t/p/w500/7Q1Hy1AHxAzA2lsmzEMBvuWTX0x.jpg",
        "overview": "The War of the Five Kings, once thought to be drawing to a close, is instead entering a new and more chaotic phase. Westeros is on the brink of collapse, and many are seizing what they can while the realm implodes, like a corpse making a feast for crows."
      },
      {
        "seasonNumber": 6,
        "name": "Season 6",
        "episodeCount": 10,
        "posterUrl": "https://image.tmdb.org/t/p/w500/p1udLh0gfqyZFmXBGa393gk8go5.jpg",
        "overview": "Following the shocking developments at the conclusion of season five, survivors from all parts of Westeros and Essos regroup to press forward, inexorably, towards their uncertain individual fates. Familiar faces will forge new alliances to bolster their strategic chances at survival, while new characters will emerge to challenge the balance of power in the east, west, north and south."
      },
      {
        "seasonNumber": 7,
        "name": "Season 7",
        "episodeCount": 7,
        "posterUrl": "https://image.tmdb.org/t/p/w500/oX51n32QyHeFP5kErksemJsJljL.jpg",
        "overview": "The long winter is here. And with it comes a convergence of armies and attitudes that have been brewing for years."
      },
      {
        "seasonNumber": 8,
        "name": "Season 8",
        "episodeCount": 6,
        "posterUrl": "https://image.tmdb.org/t/p/w500/yToCshWmirenreC6mrHwFAScFNJ.jpg",
        "overview": "The Great War has come, the Wall has fallen and the Night King's army of the dead marches towards Westeros. The end is here, but who will take the Iron Throne?"
      }
    ]
  },
  "1668": {
    "totalSeasons": 10,
    "totalEpisodes": 228,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/l0qVZIpXtIo7km9u5Yqh0nKPOr5.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/odCW88Cq5hAF0ZFVOkeJmeQv1nV.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/kC9VHoMh1KkoAYfsY3QlHpZRxDy.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 25,
        "posterUrl": "https://image.tmdb.org/t/p/w500/n9u4pslqb6tpiLc8soldL5IbAyG.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/3WdH3FNMXgp3Qlx21T7kwKS8Mtc.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 5,
        "name": "Season 5",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/aEwLXWbo6gV1TNIv9veu4rRwsPZ.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 6,
        "name": "Season 6",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/7EU6bV6d8j1Xbc1F8QoNkOZrpsi.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 7,
        "name": "Season 7",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/yvUZVChjOnqCjB9rjdEqEmpDdnQ.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 8,
        "name": "Season 8",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/eh6PPkrzkXsEksRJDcdtx9lZsqX.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 9,
        "name": "Season 9",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/1IvIdN4I5jJ0bwC3BkmDCy4pQ9j.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 10,
        "name": "Season 10",
        "episodeCount": 17,
        "posterUrl": "https://image.tmdb.org/t/p/w500/67ETB6XIqYc5vZkyAjN8XINOX5i.jpg",
        "overview": ""
      }
    ]
  },
  "2316": {
    "totalSeasons": 9,
    "totalEpisodes": 186,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/mLyW3UTgi2lsMdtueYODcfAB9Ku.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 6,
        "posterUrl": "https://image.tmdb.org/t/p/w500/d71JQWhX75ZE2D383DlIsHVH1In.jpg",
        "overview": "This season introduced the main characters, and established the general plot, which revolves around Michael Scott, regional manager of the Scranton branch office, trying to convince the filmmakers of the documentary that he presides over a happy, well-running office. Meanwhile, sales rep Jim Halpert finds methods to undermine his cube-mate, Dwight Schrute; receptionist Pam Beesly tries to deal with Michael's insensitivities and flubs; and temporary employee Ryan Howard is acting mostly as an observer of the insanity around him."
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 22,
        "posterUrl": "https://image.tmdb.org/t/p/w500/sAd3RhOjhTuaIBpyiI1QmB0YUq8.jpg",
        "overview": "Beginning with \"The Dundies\", the second season further developed into the plot of the fear of company downsizing, along with the introduction of new characters and developing some of the minor ones—especially that of Dwight Schrute. Michael Scott soon starts a relationship with his boss Jan Levenson and, Pam Beesley and Jim Halpert’s relationship become one of the focal points of the season. Their compatibility becomes more obvious as Jim’s feelings for Pam continue to grow, while she struggles with her relationship with the warehouse worker Roy Anderson."
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/1SR5ZR0KNHTRvAzFayaKbhKAFSu.jpg",
        "overview": "The season marked the move of main character Jim Halpert from Scranton to Stamford, and also introduced Rashida Jones as Karen Filippelli, and Ed Helms as Andy Bernard—both members of Dunder Mifflin Stamford—as recurring characters. The main plot for the early episodes of the season deals with a recurring problem in seasons one and two—the problem of company downsizing—while in the last half of the season, inter-office relationships also became a major plot point."
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 14,
        "posterUrl": "https://image.tmdb.org/t/p/w500/zunFI6wdYJQRHnfXnziArUTs2e2.jpg",
        "overview": "Season four marked the departure of Karen Filippelli as a regular character, although she appeared for a few seconds in the first episode, \"Fun Run\" and in the sixth episode, \"Branch Wars\", as the regional manager of the Utica branch. Relationships again emerged as the main theme of the season, with Jim Halpert and Pam Beesley's rising, and Michael Scott and Jan Levinson's, as well as Dwight Schrute and Angela Martin's declining. Technology was another prevalent theme as the office staff struggled with initiatives introduced by Ryan Howard to modernize the company."
      },
      {
        "seasonNumber": 5,
        "name": "Season 5",
        "episodeCount": 26,
        "posterUrl": "https://image.tmdb.org/t/p/w500/hwlQxOPGIybqBz5TYYIe6XtOfi4.jpg",
        "overview": "Michael Scott and his fellow Dunder Mifflin-ites steal customers, frame co-workers, and indulge in intra-office love affairs."
      },
      {
        "seasonNumber": 6,
        "name": "Season 6",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/hk3a9U26J726oV8nHTdeMTtH91B.jpg",
        "overview": "In Season 6, the crew faces romances, marriage, parenthood, new corporate ownership, Darryl’s rise to middle management, and a ball-busting new boss."
      },
      {
        "seasonNumber": 7,
        "name": "Season 7",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/uR3y9BwPA8gnk2nmB6ncQejEe8k.jpg",
        "overview": "In Season 7, Dwight is now the owner of the building, Andy is courting Erin, Jim and Pam struggle with being new parents, and past girlfriends haunt Michael."
      },
      {
        "seasonNumber": 8,
        "name": "Season 8",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/sQLtAEBbQNIXGZyTUt3IK9gX4VE.jpg",
        "overview": "The eighth season largely centers around Andy Bernard's ascension to regional manager, as well as the antics of Robert California, the new CEO of Sabre, a fictional printer company that owns Dunder Mifflin. Halfway through the season, Dwight Schrute —along with Jim Halpert, Stanley Hudson, Ryan Howard, Erin Hannon, and Cathy —travel to Florida to help set up a Sabre Store, where Nellie Bertram is introduced."
      },
      {
        "seasonNumber": 9,
        "name": "Season 9",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/ncR9y2RApOTSjfggJHjvoIlAqDG.jpg",
        "overview": "In Season 9, Andy finds his true calling in showbiz, Jim lands the job of his dreams, Erin struggles with love, and Angela's marriage isn’t what it seems."
      }
    ]
  },
  "13916": {
    "totalSeasons": 1,
    "totalEpisodes": 37,
    "runtime": 22,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/z8IPicmEKXUO4I2UDdMEqw7RqOE.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 37,
        "posterUrl": "https://image.tmdb.org/t/p/w500/1BloDOEmKxPFzbCIuNCLmCrcx6L.jpg",
        "overview": ""
      }
    ]
  },
  "31910": {
    "totalSeasons": 20,
    "totalEpisodes": 500,
    "runtime": 25,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/z0YhJvomqedHF85bplUJEotkN5l.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "S1 • Kazekage Rescue",
        "episodeCount": 32,
        "posterUrl": "https://image.tmdb.org/t/p/w500/cZVmDRYOPjGRpcmXBwH7RULiS4v.jpg",
        "overview": "Naruto Uzumaki is back! After two and a half years of training on the road with Jiraiya of the Sannin, Naruto is back in the Village Hidden in the Leaves and he's ready to show off his new skills. He and Sakura team up to take on their old master Kakashi, who's pretty impressed with their progress. They'll have plenty of opportunity to put it into action when news arrives from the Sand Village that Gaara, Naruto's former rival and now Kazekage of the Sand, has been kidnapped! And the culprits are the very same group who are after Naruto - the Akatsuki!"
      },
      {
        "seasonNumber": 2,
        "name": "S2 • Long-Awaited Reunion",
        "episodeCount": 21,
        "posterUrl": "https://image.tmdb.org/t/p/w500/tq4UidtV47OkUbx8fIxMFlK3dAA.jpg",
        "overview": "In the midst of its spying mission, Team Kakashi is suddenly confronted with the Leaf Village's sworn enemy, Orochimaru. Naruto challenges him, and during their battle, his anger brings forth the power of the Nine-Tailed Fox. Naruto will never give up his determination to find Sasuke and bring him home, but in his rage he risks losing all awareness of himself and hurting those he cares for the most."
      },
      {
        "seasonNumber": 3,
        "name": "S3 • Guardian Shinobi Twelve",
        "episodeCount": 18,
        "posterUrl": "https://image.tmdb.org/t/p/w500/nRk4DOpHKEoyhpGKw8GjYNIt56m.jpg",
        "overview": "Defeated by Sasuke, Naruto returns to the hidden Leaf Village to start a new training program with Kakashi and Yamato. Naruto learns that he has Wind-style chakra. Meanwhile, a group of four mysterious people attacks a village in the countryside of the Fire Country. Who are they and what exactly do they want from the Leaf Village ninja?"
      },
      {
        "seasonNumber": 4,
        "name": "S4 • Immortal Devastators: Hidan and Kakuzu",
        "episodeCount": 17,
        "posterUrl": "https://image.tmdb.org/t/p/w500/lduWgBtWKMlIXmEXlVjuzCsewbV.jpg",
        "overview": "Asuma and Shikamaru have to think on their feet as they face the mind-boggling jutsu of the Akatsuki pair, Hidan and Kakuzu. At the last minute, the Akatsuki are called away, but not before dealing a fatal blow to a revered shinobi of the Leaf. The devastated ninja left behind can think only of revenge, but Tsunade is opposed to the scheme until an offer of help arrives from an unexpected source."
      },
      {
        "seasonNumber": 5,
        "name": "S5 • Three Tails' Appearance",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/cMi80FKQ1iTbPdXvbMbP5gaVaeR.jpg",
        "overview": "Naruto's new jutsu Rasen Shuriken is unbelievably powerful - but because of the risks to the user, Tsunade forbids Naruto to use it! When Jiraiya returns to the village, Naruto seeks his guidance, and the two head off to a hot springs resort to work on a solution. Meanwhile, Kakashi leads a team in search of Orochimaru's hideout, and when Naruto hears about it, he begs to join them."
      },
      {
        "seasonNumber": 6,
        "name": "S6 • Master's Prophecy and Vengeance",
        "episodeCount": 31,
        "posterUrl": "https://image.tmdb.org/t/p/w500/o3iBQZgcntiawRcFQeKXaYgIUsS.jpg",
        "overview": "Sasuke's future hangs in the balance as Orochimaru prepares for reanimation. It's been three years since Sasuke left the Leaf Village seeking the power Orochimaru promised him. Now it's time to face his mentor. Who will master whom in the battle for their very existence?\n\nPlus, take a step back in time to a turning point in the young Kakashi's life, as he fights alongside his teammates under the guidance of the Fourth Hokage!"
      },
      {
        "seasonNumber": 7,
        "name": "S7 • Six Tails Unleashed",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/42QaFSno1zuAPoaSydZw0koukvw.jpg",
        "overview": "The team is heading back to the village when an urgent assignment comes in from Tsunade that will lead them on a perilous journey to protect a young woman!"
      },
      {
        "seasonNumber": 8,
        "name": "S8 • Two Saviors",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/msnDBdYwXyNgLUzAC5SX1o1mqvq.jpg",
        "overview": "Naruto and his friends successfully decipher the code Jiraiya left behind, but it's not enough to solve the mystery of Pain. For Naruto, Jiraiya's passing is more than enough to inspire him to follow Fukasaku to Mount Myoboku, where he begins his training in Sage Jutsu. But will the antsy Naruto ever be able to sit still long enough to achieve Sage Mode? Back in the Leaf Village, disaster strikes when the Six Paths of Pain attack the village, and those dearest to Naruto are thrown into the chaos of battle!"
      },
      {
        "seasonNumber": 9,
        "name": "S9 • Past Arc: The Locus of the Leaf",
        "episodeCount": 21,
        "posterUrl": "https://image.tmdb.org/t/p/w500/1F7Z31SsD48go66RMVs9YDpae5V.jpg",
        "overview": "After Pain's attack, the Leaf Ninja set about rebuilding their village. Naruto and Sakura are thrilled to be reunited with Tazuna and his grandson Inari from the Land of Waves, who have come to help. While the restoration proceeds, the Leaf Ninja and their friends reflect on past events that influenced the village and helped gain allies like the Sand.\n\nPlus, we get a glimpse back into Naruto's training journey with Jiraiya, and join the original Team 7 on a mission when Sasuke was still with them!"
      },
      {
        "seasonNumber": 10,
        "name": "S10 • The Five Kage Assemble",
        "episodeCount": 25,
        "posterUrl": "https://image.tmdb.org/t/p/w500/6Xk2LsYYf4X1F5FDdjEFIE3egQb.jpg",
        "overview": "In the aftermath of the attack on the village, Naruto and Sakura are shocked to discover that Danzo has been selected as the new Hokage. And his first order of business involves Team 7's own Rogue Ninja-Sasuke! Then, the Kage from each village gather for a summit in the Land of Iron, and Naruto seeks a pardon for Sasuke from the Raikage. But the cycle of hatred runs deep in the shinobi world, and while the Five Kage discuss how to deal with the Akatsuki, the mysterious one calling himself Madara steps forward to reveal truths that will turn Naruto's world upside down!\n\nPlus, take a step back in time to a turning point in the young Kakashi's life, as he fights alongside his teammates under the guidance of the Fourth Hokage!"
      },
      {
        "seasonNumber": 11,
        "name": "S11 • Paradise Life on a Boat",
        "episodeCount": 21,
        "posterUrl": "https://image.tmdb.org/t/p/w500/3rEBLrk8knUHQD3XoIdqGbHGSYE.jpg",
        "overview": "Naruto declares to his friends his intention to take on Sasuke by himself, while the Elders of the Leaf make a serious decision about who will fill the vacant seat of Hokage: Kakashi! In Mount Myoboku, Gerotora, Fukasaku and the Great Lord Elder debate whether or not to give Naruto the key to the Tetragram Seal that Gerotora holds, an act that could potentially unleash Nine Tails."
      },
      {
        "seasonNumber": 12,
        "name": "S12 • Nine-Tails Taming and Karmic Encounters",
        "episodeCount": 33,
        "posterUrl": "https://image.tmdb.org/t/p/w500/rSFbKodY52tetk4ry5BBg8vPHff.jpg",
        "overview": "As the Leaf Village prepares for war, each shinobi and clan must contemplate the role they will play in the battles to come. While Naruto's peers seek training from surprising sources, Naruto himself must confront both his biggest weakness and greatest strength – the Nine-Tailed Fox.\n\nTo reach optimum power, Naruto must learn to control the beast within him, so he seeks help from the one person who has mastered just that, Killer Bee! But the Jinchuriki of Eight Tails wants nothing to do with training Naruto!"
      },
      {
        "seasonNumber": 13,
        "name": "S13 • The Seven Ninja Swordsman",
        "episodeCount": 20,
        "posterUrl": "https://image.tmdb.org/t/p/w500/zoVDEzuh4wyXZOHpkODNI7PTMsa.jpg",
        "overview": "The Fourth Great Ninja War rages on, and danger comes from every angle. Old comrades and enemies have risen from the grave under the control of Kabuto to fight the Allied Forces. While some retain their calm, others must wrestle with their emotions. Naruto's training has made him more powerful, but some believe his possession of the Nine Tails makes him a liability. Meanwhile, Sakura and the Medical Ninja face unique danger, as an enemy may be in their midst behind the allied lines. Can the Allied Forces survive assassins and their reanimated friends to win the war?"
      },
      {
        "seasonNumber": 14,
        "name": "S14 • The Fourth Great Ninja War: Assailants From Afar",
        "episodeCount": 25,
        "posterUrl": "https://image.tmdb.org/t/p/w500/i5mXIVMCd314HIsdimeh6zEfUv4.jpg",
        "overview": "Gaara leads the Fourth Company into battle against the previous Kage, including his own father. Meanwhile Naruto and Killer Bee face the reanimated Itachi Uchiha, who recognises Naruto’s growth as a shinobi and his potential to rescue his brother, Sasuke, from his path of vengeance. Battles rage, and all must face enemies—as well as friends—they never expected to see again!"
      },
      {
        "seasonNumber": 15,
        "name": "S15 • The Fourth Great Ninja War: Sasuke and Itachi",
        "episodeCount": 28,
        "posterUrl": "https://image.tmdb.org/t/p/w500/mfg6EokRt3F0zLH4HVAzhJ9aBXH.jpg",
        "overview": "As the Fourth Great Ninja War rages on, the endless waves of Reanimated Shinobi take their toll as the Allied Shinobi Forces are forced to keep fighting their own fallen friends and comrades. Meanwhile, Naruto deepens his understanding of warfare, learning to sense the disguised White Zetsu sowing confusion and distrust among the Allied Forces. But all the effort and pain aren't for nothing, as Gaara and Ohnoki draw closer than ever to discovering who is really behind this devastating conflict.\n\nPlus, we get a glimpse back into Naruto's training journey with Jiraiya, and join the original Team 7 on a mission when Sasuke was still with them!"
      },
      {
        "seasonNumber": 16,
        "name": "S16 • Kakashi: Shadow of the ANBU Black Ops",
        "episodeCount": 13,
        "posterUrl": "https://image.tmdb.org/t/p/w500/qk74cPdTULS59BOLhlJJX1dVFUq.jpg",
        "overview": "Years before he became Naruto's teacher, Kakashi served as a member of the ANBU Black Ops team, so ruthless he earned the nickname \"Cold-blooded Kakashi.\" But despite his reputation, he is haunted by the deaths of his closest friends during the Third Great Ninja War.\n\nAs he wrestles with his loss, Kakashi must uncover who is behind illegal genetic experimentation, survive threats from within his own organisation, escape capture at the hands of Orochimaru's followers, and battle a young shinobi who possesses formidable and very rare Wood Style Jutsu. And after these trials, another young ninja joins his unit–Itachi Uchiha!"
      },
      {
        "seasonNumber": 17,
        "name": "S17 • The Fourth Great Ninja War: Team 7 Returns",
        "episodeCount": 11,
        "posterUrl": "https://image.tmdb.org/t/p/w500/A4VoEGcENojYNu6RjG0mN8zqPxr.jpg",
        "overview": "With Kakashi unable to get through to Obito, Naruto leaps to his Sensei's defense. The release of Ten Tails forces the Allied Shinobi Forces into an assault on Obito and Madara, but the powerful Tailed Beast proves to be a formidable enemy. The devastation is severe, but Hinata's words spur Naruto to continue fighting with renewed energy, while help arrives from unexpected quarters - including an old adversary! Will Naruto and the Allied Shinobi's efforts be enough to fend off destruction?"
      },
      {
        "seasonNumber": 18,
        "name": "S18 • The Fourth Great Ninja War: Obito Uchiha",
        "episodeCount": 21,
        "posterUrl": "https://image.tmdb.org/t/p/w500/x0E2Vlh9mZmy9DAKtsOcbAhoiBv.jpg",
        "overview": "On the same side once more, Naruto and Sasuke prepare for battle as Obito absorbs the power of Ten Tails to become the tailed beast's Jinchuriki. As the other shinobi watch helplessly, Obito summons the Divine Tree and begins absorbing their chakra as he prepares to perform the Infinite Tsukuyomi. Naruto and his friends must rally their despairing allies to defeat Obito. But will the final battle truly be physical - or will it be a test of wills?"
      },
      {
        "seasonNumber": 19,
        "name": "S19 • In Naruto's Footsteps: The Friends' Path",
        "episodeCount": 20,
        "posterUrl": "https://image.tmdb.org/t/p/w500/omxfR5MVBUmToG81FbZPeh8vlwE.jpg",
        "overview": "Naruto and the Allied Shinobi manage to extract Obito’s Tailed Beasts, leaving Madara as the final foe to defeat. Obito realizes the error of his ways, but Black Zetsu prevents him from interfering. Nine Tails is extracted from Naruto, and he and Sasuke are left near death. In the midst of all this, the turbulent history of the Hyuga clan and events that took place in the Leaf Village while Naruto trained with Jiraya are revealed!"
      },
      {
        "seasonNumber": 20,
        "name": "S20 • Infinite Tsukuyomi: The Invocation",
        "episodeCount": 87,
        "posterUrl": "https://image.tmdb.org/t/p/w500/eVp8V8v7FUJLTgLNcS0W3IY5H23.jpg",
        "overview": "As Naruto and Sasuke lay near death, Kakashi and a reformed Obito prepare to confront Madara together. But Madara has gained the power of the Six Paths, and Guy may have to make the ultimate sacrifice and open the Gate of Death in order to fight him. But even that may not be enough once Madara activates the Infinite Tsukuyomi, trapping everyone in a dream world. Can this incredible power be broken?"
      }
    ]
  },
  "34391": {
    "totalSeasons": 4,
    "totalEpisodes": 103,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/gXeCzYmCRBlpbbhhKrYM1ZpIDAA.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 26,
        "posterUrl": "https://image.tmdb.org/t/p/w500/p276PkRJ5Wexq91DA5RkbxTYMDn.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 26,
        "posterUrl": "https://image.tmdb.org/t/p/w500/eXtlDP6kgUyYw0G2L9AxSWUp14Q.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 3,
        "name": "Season 3: Web-Warriors",
        "episodeCount": 25,
        "posterUrl": "https://image.tmdb.org/t/p/w500/iicBAyyU56hr2pgNA5YCnTIu9tJ.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 4,
        "name": "Season 4: vs the Sinister 6",
        "episodeCount": 26,
        "posterUrl": "https://image.tmdb.org/t/p/w500/fgmcIYoUjo14yIErawolG6pv8Nf.jpg",
        "overview": "Peter Parker finds himself in prime position – he’s a successful hero after fighting alongside The Avengers, a S.H.I.E.L.D. Academy leader and has a great relationship with his Aunt May. However, when Spidey discovers that his greatest enemies – Doctor Octopus, Hydra and the all-new Sinister 6 – have teamed up to destroy him and S.H.I.E.L.D., he creates a special new team of Spiders."
      }
    ]
  },
  "37680": {
    "totalSeasons": 9,
    "totalEpisodes": 134,
    "runtime": 42,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/or0E36KfzJYZwqXeiCfm1JgepKF.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 12,
        "posterUrl": "https://image.tmdb.org/t/p/w500/6gbwMw7k8Utq2lP6y91BdnYfDXg.jpg",
        "overview": "Manhattan attorney Harvey Specter finds the perfect associate in streetwise prodigy Mike Ross. The trouble is, Mike's a college dropout — not a lawyer."
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 16,
        "posterUrl": "https://image.tmdb.org/t/p/w500/xxZPBZZHkii6o2yFDrBSTZvC2Yr.jpg",
        "overview": "As Harvey focuses on protecting Mike's position, Jessica deals with the fallout after the unexpected reappearance of her co-founding partner."
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 16,
        "posterUrl": "https://image.tmdb.org/t/p/w500/j9nAfPK8csOMMZ9tjPLsiQIV0H2.jpg",
        "overview": "Skilled corporate lawyer Harvey Specter and his associate Mike Ross continue their unusual partnership in this season of the smart courtroom drama."
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 16,
        "posterUrl": "https://image.tmdb.org/t/p/w500/uYatRS9fSyk6tEQ7FVBpAk33F85.jpg",
        "overview": "In Season 4, Harvey and Mike find themselves on opposite sides of a corporate takeover battle that draws attention from the government."
      },
      {
        "seasonNumber": 5,
        "name": "Season 5",
        "episodeCount": 16,
        "posterUrl": "https://image.tmdb.org/t/p/w500/hCjppZ3SYQIRW3HubVmNhUOZ6dE.jpg",
        "overview": "Harvey regroups in the wake of Donna's departure, Mike and Rachel edge closer to marriage, and Jessica continues to come to grips with her new life."
      },
      {
        "seasonNumber": 6,
        "name": "Season 6",
        "episodeCount": 16,
        "posterUrl": "https://image.tmdb.org/t/p/w500/nOsi11j9tQgZqiuwVqUwSDiJ7Rx.jpg",
        "overview": "In the aftermath of the trial, Mike faces the realities of his situation while Jessica, Harvey and Louis grapple to contain the firm's vulnerability."
      },
      {
        "seasonNumber": 7,
        "name": "Season 7",
        "episodeCount": 16,
        "posterUrl": "https://image.tmdb.org/t/p/w500/w126E6YAv1qNgUrDJX6gPbl2xS9.jpg",
        "overview": "Now that Mike is officially recognized as a lawyer and has accepted Harvey’s offer to return to the firm, Season 7 will see the team back together again at Pearson Specter Litt - each dealing with their own struggles as they adjust to a new world order without Jessica ."
      },
      {
        "seasonNumber": 8,
        "name": "Season 8",
        "episodeCount": 16,
        "posterUrl": "https://image.tmdb.org/t/p/w500/rrztnIAOPeqvG3l7bEegwEWhFF4.jpg",
        "overview": "In the wake of two emotional departures, Harvey and the rest of Specter Litt face an infusion of ambitious new blood and chart a daring new course."
      },
      {
        "seasonNumber": 9,
        "name": "Season 9",
        "episodeCount": 10,
        "posterUrl": "https://image.tmdb.org/t/p/w500/uEO93DzpoYYwFcUPZCkT6n4JAZC.jpg",
        "overview": "As the firm chafes under intense new oversight, each partner faces a reckoning -- and Mike Ross returns to square off against his old mentor, Harvey."
      }
    ]
  },
  "46260": {
    "totalSeasons": 4,
    "totalEpisodes": 220,
    "runtime": 24,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/5F0HVEgkgP99fEWDjPyikGt9jQi.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 52,
        "posterUrl": "https://image.tmdb.org/t/p/w500/rZN89Puog5PgKBLnJIyl7vyEReG.jpg",
        "overview": "Deep within the Hidden Leaf Village, young ninja Naruto Uzumaki carries sealed inside him the Nine-Tailed Fox Spirit, which once almost destroyed the village. Always an outcast because of his secret, now Naruto battles alongside his teammates Sasuke and Sakura to prove to himself and everyone else that he's the greatest ninja ever. But he's got a long list of challenges to face before he gets there!"
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 52,
        "posterUrl": "https://image.tmdb.org/t/p/w500/yBHXns4g7gWcWuQfOzL4Jekj74e.jpg",
        "overview": "Before the final round of the Chunin Exam, Naruto receives some special training from the legendary Toad Sage, Jiraiya. When the battles resume, Naruto is ready, but what about Sasuke? He's about to face the one ninja no one, not even Naruto thinks he can beat. But in the midst of everything, a sinister plot is set in motion, and the Village Hidden in the Leaves finds itself under attack!"
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 54,
        "posterUrl": "https://image.tmdb.org/t/p/w500/tZxX4fgjhAeC4by6wRLXXh8KnJR.jpg",
        "overview": "Naruto returns from his training journey eager to see his friend Sasuke. But Sasuke has only one thing on his mind: his quest for revenge against his older brother. His unquenchable thirst for power knows no bounds, and soon he is lured from the Leaf Village by Orochimaru's minions, the Sound Four. Determined to get him back, Shikamaru and Naruto put together a team of the top genin in the village to go after him, and the chase begins!"
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 62,
        "posterUrl": "https://image.tmdb.org/t/p/w500/jN77xxkOJG0dWMQZPu7KHzPFQoZ.jpg",
        "overview": "In the Village Hidden in the Leaves, there are few things Naruto and Choji love more than a steaming bowl of Ichiraku ramen, and when the daughter of the owner is kidnapped, they're on the case. Then, missions for the Leaf ninja lead them to the Land of Bears after a fallen meteorite and the Land of Greens to protect a princess. When an evil ninja who's after the princess gets in their way, it's Naruto's life on the line!"
      }
    ]
  },
  "48891": {
    "totalSeasons": 8,
    "totalEpisodes": 152,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/9AeiA1XtP5sel2tAf9LaGeUjhDb.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 22,
        "posterUrl": "https://image.tmdb.org/t/p/w500/9hL8os3A3pGpdvQtt029zj2pURy.jpg",
        "overview": "Talented but laid-back detective Jake Peralta and his dysfunctional peers struggle to get along under their precinct's strict new captain."
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/lvST5TSkJqN4yyhDy5IgyoBDize.jpg",
        "overview": "In Season 2, Jake smokes out a mole in the precinct, Amy finds a flaw in one of Holt's old cases, and the precinct gets antiterrorism training."
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/nqlpXFbyCGzeBaDVC2E6PO5itCw.jpg",
        "overview": "After Holt's transfer, the precinct isn't happy with his replacement. Amy and Jake adjust to romance, while personnel changes shake up the department."
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 22,
        "posterUrl": "https://image.tmdb.org/t/p/w500/6fsr582nvms8E4ag3jb3oHL76en.jpg",
        "overview": "While the Nine-Nine tries to keep a lid on things in Brooklyn, Jake and Holt are in a witness protection program in Florida, where Holt is thriving."
      },
      {
        "seasonNumber": 5,
        "name": "Season 5",
        "episodeCount": 22,
        "posterUrl": "https://image.tmdb.org/t/p/w500/dWOF2pJBNfunspM7PpVG6O9LWj3.jpg",
        "overview": "After a nightmare stint in prison for a crime he didn't commit, Jake returns to the Nine-Nine, where personal and professional changes are afoot."
      },
      {
        "seasonNumber": 6,
        "name": "Season 6",
        "episodeCount": 18,
        "posterUrl": "https://image.tmdb.org/t/p/w500/xa9xA4Ieju9cyVkfJ47n1hnbHWB.jpg",
        "overview": "As Jake and Amy adjust to married life and Holt squares off with a rival, the hijinks, heists and crime-fighting continue at the Nine-Nine."
      },
      {
        "seasonNumber": 7,
        "name": "Season 7",
        "episodeCount": 13,
        "posterUrl": "https://image.tmdb.org/t/p/w500/kJUpn3xnymCbdxInyZVGFW5vGYR.jpg",
        "overview": "Jake and Amy rethink their family plans, Holt chafes over his demotion, and the squad sees the return of old pals and nemeses amid the usual shenanigans."
      },
      {
        "seasonNumber": 8,
        "name": "Season 8",
        "episodeCount": 9,
        "posterUrl": "https://image.tmdb.org/t/p/w500/8PmhuCEB9W3Cc5ZDJunnV1m68IZ.jpg",
        "overview": "Jake and the squad must try to balance their personal lives and their professional lives over the course of a very difficult year."
      }
    ]
  },
  "59427": {
    "totalSeasons": 5,
    "totalEpisodes": 126,
    "runtime": 22,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/hutyHRPoY0woAZCJtLmosJHuTjQ.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 26,
        "posterUrl": "https://image.tmdb.org/t/p/w500/3hDR6u7vy0UgFp64KwzWCj73TKm.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 26,
        "posterUrl": "https://image.tmdb.org/t/p/w500/5xXLD7bR8RpXYAxlo9eIfC6VHSo.jpg",
        "overview": "The first half of the second season deals with the team facing Thanos, as he competes with them to obtain the Infinity Stones, followed by a five-episode arc detailing the return of Ultron, who plans to exterminate the human race. The rest of the season details the arrival of the Squadron Supreme and their confrontation with the Avengers."
      },
      {
        "seasonNumber": 3,
        "name": "Ultron Revolution",
        "episodeCount": 26,
        "posterUrl": "https://image.tmdb.org/t/p/w500/tfwczYRkDmhHjpd5Pmzog8ZsWJD.jpg",
        "overview": "In season 3, Ultron returns after his apparent demise and seeks revenge on the Avengers. The Avengers must defeat him as well as new threats like Baron Zemo's Masters of Evil and Kang the Conqueror. Vision, Black Panther, Captain Marvel, Ms. Marvel, and the Inhumans are also introduced."
      },
      {
        "seasonNumber": 4,
        "name": "Secret Wars",
        "episodeCount": 25,
        "posterUrl": "https://image.tmdb.org/t/p/w500/k8Nv5b6WQUlyR6U6DLr2E5hpJ4b.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 5,
        "name": "Black Panther's Quest",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/rw9kT0ogOPmVbSlyxUFOp0jxspA.jpg",
        "overview": ""
      }
    ]
  },
  "60735": {
    "totalSeasons": 9,
    "totalEpisodes": 184,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/gFkHcIh7iE5G0oVOgpmY8ONQjhl.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/A3H6pewHfoy2bXmNhvycOe0xzlC.jpg",
        "overview": "When an unexpected accident at the S.T.A.R. Labs Particle Accelerator facility strikes Barry, he finds himself suddenly charged with the incredible power to move at super speeds. While Barry has always been a hero in his soul, his newfound powers have finally given him the ability to act like one. With the help of the research team at S.T.A.R. Labs, Barry begins testing the limits of his evolving powers and using them to stop crime. With a winning personality and a smile on his face, Barry Allen — aka The Flash — is finally moving forward in life … very, very fast!"
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/8xWZPVX1cv9V5YD1RPeLj9QZDE9.jpg",
        "overview": "Following the dramatic events of season 1, Team Flash quickly turns their attention to a threat high above Central City. Armed with the heart of a hero and the ability to move at super speeds, will Barry be able to save his city from impending doom?"
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/rN1hgV8Ag3bZmkv33Udm93hIxQp.jpg",
        "overview": "Forensic scientist Barry Allen, aka The Flash, is living his dream life. His parents are alive. He's dating beautiful, smart Iris West. And he's able to stand back and let the new speedster in town, Kid Flash, step in to protect Central City. But the better Barry's life gets, the more dangerous it becomes. His nemesis, Reverse Flash, warns Barry of serious repercussions if he remains in the alternate Flashpoint universe: In addition to memory loss, his powers will fade. When disaster strikes, Barry must decide whether to continue life as Barry Allen or return to his universe as The Flash. As Barry deals with his identity crisis, he and the S.T.A.R. Labs team fight off lethal threats from the God of Speed, Savitar."
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/e6A65vhYFLqgSsMI294ZQi0rQfH.jpg",
        "overview": "The mission of Barry Allen, aka The Flash, is once more to protect Central City from metahuman threats. But with Barry trapped in the Speed Force, this mission falls to his family – Detective Joe West; fiancée Iris West; and Wally West/Kid Flash – and the team at S.T.A.R. Labs: Caitlin Snow/Killer Frost, Cisco Ramon/Vibe and brilliant scientist Harrison Wells. When a powerful villain threatens to level the city unless The Flash appears, Cisco risks everything to free Barry. But this is only the first move in a deadly game with Clifford DeVoe, aka The Thinker, a mastermind who’s always ten steps ahead of Barry, no matter how fast Barry runs."
      },
      {
        "seasonNumber": 5,
        "name": "Season 5",
        "episodeCount": 22,
        "posterUrl": "https://image.tmdb.org/t/p/w500/z3CqL2vnjgLuefOiR5AYD9Tf91S.jpg",
        "overview": "Barry Allen and his new wife, Iris West, finally settling into married life when they're visited by Nora West-Allen, their speedster daughter from the future. Nora's arrival brings to light the legacy every member of Team Flash will leave years from now, causing many to question who they are today. And while Nora idolizes Barry, she holds a mysterious grudge against Iris. As Team Flash adjusts to the next generation of speedster, they discover Nora's presence has triggered the arrival of the most ruthless, vicious and relentless villain they have ever faced: Cicada!"
      },
      {
        "seasonNumber": 6,
        "name": "Season 6",
        "episodeCount": 19,
        "posterUrl": "https://image.tmdb.org/t/p/w500/qDntRDRs5XohN4ClcV2SH9WlzpI.jpg",
        "overview": "When Barry and Iris deal with loss of their daughter, the team faces their greatest threat yet - one that threatens to destroy all of Central City; Killer Frost has a brush with death that will change her relationship with Caitlin. Faced with the news of his impending death, Barry's resiliency suffers as he struggles to fight fate."
      },
      {
        "seasonNumber": 7,
        "name": "Season 7",
        "episodeCount": 18,
        "posterUrl": "https://image.tmdb.org/t/p/w500/lJA2RCMfsWoskqlQhXPSLFQGXEJ.jpg",
        "overview": "After a thrilling cliffhanger last season which saw Mirror Monarch victorious and still-at-large in Central City, The Flash must regroup in order to stop her and find a way to make contact with his missing wife, Iris West-Allen. With help from the rest of Team Flash, Barry will ultimately defeat Mirror Master. But in doing so, he’ll also unleash an even more powerful and devastating threat on Central City: one that threatens to tear his team—and his marriage—apart."
      },
      {
        "seasonNumber": 8,
        "name": "Season 8",
        "episodeCount": 20,
        "posterUrl": "https://image.tmdb.org/t/p/w500/9Oayqj8PXBZIjl4K5UZeM3t9VVJ.jpg",
        "overview": "Six months after stopping the Godspeed War, Barry and Iris West-Allen are now at the top of their game—both in their careers as superhero and reporter and as a devoted couple. But when the powerful alien Despero unleashes near annihilation on Central City, The Flash and his team must once again defy impossible odds to save the day. But their victory is short-lived as two new threats rise from the ashes of \"Armageddon,\" one of which will unleash unforeseen horrors into the lives of Barry and his teammates... and change Team Flash forever."
      },
      {
        "seasonNumber": 9,
        "name": "Season 9",
        "episodeCount": 13,
        "posterUrl": "https://image.tmdb.org/t/p/w500/lSIraXr6r1v5CvkjE7CjMcJZld0.jpg",
        "overview": "After defeating the Reverse Flash once and for all, Barry Allen and Iris West-Allen are reconnecting and growing closer than ever before. But when a deadly group of Rogues descend on Central City led by a powerful new threat, The Flash and his team must once again defy impossible odds to save the day. But as The Rogues are defeated, a deadly new adversary rises to challenge Barry Allen's heroic legacy. And in their greatest battle yet, Barry and Team Flash will be pushed to their limits, in order to save Central City one last time."
      }
    ]
  },
  "61459": {
    "totalSeasons": 1,
    "totalEpisodes": 24,
    "runtime": 23,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/zfk6siC4KRXurG4jJzSXHy9szGQ.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 24,
        "posterUrl": "https://image.tmdb.org/t/p/w500/zu0tNESIHIfVIaewXx8gnFuBTrd.jpg",
        "overview": ""
      }
    ]
  },
  "63926": {
    "totalSeasons": 3,
    "totalEpisodes": 36,
    "runtime": 24,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/s0w8JbuNNxL1YgaHeDWih12C3jG.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 12,
        "posterUrl": "https://image.tmdb.org/t/p/w500/ocv8PzwfQUsFHSSdUvK7wZI85Dx.jpg",
        "overview": "Saitama is a hero who only became a hero for fun. After three years of “special” training, though, he’s become so strong that he’s practically invincible. In fact, he’s too strong—even his mightiest opponents are taken out with a single punch, and it turns out that being devastatingly powerful is actually kind of a bore. With his passion for being a hero lost along with his hair, yet still faced with new enemies every day, how much longer can he keep it going?"
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 12,
        "posterUrl": "https://image.tmdb.org/t/p/w500/kjTzqlxR3bFtdgMuGtytj8MMtv7.jpg",
        "overview": "Saitama, alongside his cyborg disciple Genos, is ready to begin his official duties as a professional hero. But when a new friendship and interest in martial arts prove distracting, the Hero Association is left to deal with a sinister new wave of monster attacks on their own. To make matters worse, their heroes are being hunted! Is Earth doomed, or will Saitama save the day with one punch?"
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 12,
        "posterUrl": "https://image.tmdb.org/t/p/w500/y9M6bjEc1oI7B8RISowo5L8oq19.jpg",
        "overview": "Alongside Genos, his faithful disciple, Saitama performs his official hero duties as a member of the Hero Association. One day, monsters claiming to be from the Monster Association suddenly appeared, taking a child of the Hero Association executive hostage. The S-class heroes gather and plan a raid on the Monster Association hideout to rescue the hostage. Meanwhile, Garou, a “human monster” who was taken by the Monster Association during a battle with the heroes, awakens in the Monster Association hideout."
      }
    ]
  },
  "70523": {
    "totalSeasons": 3,
    "totalEpisodes": 26,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/75HgaphatW0PDI3XIHQWZUpbhn6.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 10,
        "posterUrl": "https://image.tmdb.org/t/p/w500/spN6icwSwuAuOcuZLC9bKjK6N2i.jpg",
        "overview": "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations."
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/x39GoVVHsmkz4RHZMDejUN3DDBG.jpg",
        "overview": "Six months after the disappearances of Mikkel, Jonas and Ulrich, Winden's web of mysteries deepens -- and the fate of the world hangs in the balance."
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/mShsToB19ZATeOuSzrVCkmuf7sS.jpg",
        "overview": "The time-twisting madness reaches its conclusion in a strange new world, where some things are quite familiar — and others are disturbingly not."
      }
    ]
  },
  "71739": {
    "totalSeasons": 1,
    "totalEpisodes": 16,
    "runtime": 22,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/aRYZLopz1Csh86mKMXjY4W7Ed3K.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 16,
        "posterUrl": "https://image.tmdb.org/t/p/w500/z94a7N36Pw5y6cccwdakXGChskx.jpg",
        "overview": ""
      }
    ]
  },
  "72705": {
    "totalSeasons": 3,
    "totalEpisodes": 57,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/qDum1yhNftUMaIB3pPiZ7PLsIto.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 25,
        "posterUrl": "https://image.tmdb.org/t/p/w500/3GLe7l5rBCn1qB0gKuaQgDvv9hN.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 26,
        "posterUrl": "https://image.tmdb.org/t/p/w500/467Madt1P0ZF1pYOvd55cjn4OCo.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 3,
        "name": "Maximum Venom",
        "episodeCount": 6,
        "posterUrl": "https://image.tmdb.org/t/p/w500/gGgLtVOVL0AObZh2ydndWwV7JDR.jpg",
        "overview": "Now going into his third year at Horizon High, Peter is confident he can handle anything that comes his way, but he's pushed to his breaking point when Venom summons an earth-shattering threat from its home planet."
      }
    ]
  },
  "74577": {
    "totalSeasons": 2,
    "totalEpisodes": 16,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/nfWhNM5VVd9a5bEGobs83TWTuLM.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/3xzfmg9olP5XzrQrJgyku2nd6P0.jpg",
        "overview": "A budding teen psychopath and a rebel hungry for adventure embark on a star-crossed road trip in this darkly comic series based on a graphic novel."
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/e00rak9Xp3DSp42hm7EK3omnhQS.jpg",
        "overview": "Two years later, Alyssa dives headfirst into a new life – just as a woman with a grudge sets out on a murderous quest for revenge."
      }
    ]
  },
  "76479": {
    "totalSeasons": 5,
    "totalEpisodes": 40,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/bq28ajZaoMyzEIm6REelqyqtEDZ.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/iikrapejulhIvbNgUjj468mUE0I.jpg",
        "overview": "Superpowered individuals are recognized as superheroes, but in reality, abuse their powers for personal gain, information the public is kept unaware of."
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/hjO01XnizdVgwygBNzDwUEK9CDB.jpg",
        "overview": "The even more intense, more insane season two finds The Boys on the run from the law, hunted by the Supes, and desperately trying to regroup and fight back against Vought. In hiding, Hughie, Mother’s Milk, Frenchie and Kimiko try to adjust to a new normal, with Butcher nowhere to be found. Meanwhile, Starlight must navigate her place in The Seven as Homelander sets his sights on taking complete control. His power is threatened with the addition of Stormfront, a social media-savvy new Supe, who has an agenda of her own. On top of that, the Supervillain threat takes center stage and makes waves as Vought seeks to capitalize on the nation’s paranoia."
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/7Ns6tO3aYjppI5bFhyYZurOYGBT.jpg",
        "overview": "It’s been a year of calm. Homelander’s subdued. Butcher works for the government, supervised by Hughie of all people. But both men itch to turn this peace and quiet into blood and bone. So when The Boys learn of a mysterious Anti-Supe weapon, it sends them crashing into the Seven, starting a war, and chasing the legend of the first Superhero: Soldier Boy."
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/nWwhdt7iOFJsWM8Lz1UtaUC6EUf.jpg",
        "overview": "The world is on the brink. Victoria Neuman is closer than ever to the Oval Office and under Homelander's muscly thumb as he consolidates his power. Butcher, with only months to live, has lost Becca's son, and his job as The Boys' leader. The rest of the team are fed up with his lies. With the stakes higher than ever, they must find a way to work together and save the world before it's too late."
      },
      {
        "seasonNumber": 5,
        "name": "Season 5",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/kHoBxFVcy7oDCqGHZIBej2AtSI8.jpg",
        "overview": "Homelander controls America through fascist terror, imprisoning dissenters in Freedom Camps. Butcher, Hughie, Annie and The Boys mount a desperate resistance against insurmountable odds to stop his tyrannical rule."
      }
    ]
  },
  "77606": {
    "totalSeasons": 4,
    "totalEpisodes": 49,
    "runtime": 24,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/ry3j5NEF72tMezdEomGrVXb6pFB.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 13,
        "posterUrl": "https://image.tmdb.org/t/p/w500/4CjTiaweco9KqODshZsMJfIcKdT.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 13,
        "posterUrl": "https://image.tmdb.org/t/p/w500/jVYdJcZKo6qluaZRTt5sMonmJFG.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 11,
        "posterUrl": "https://image.tmdb.org/t/p/w500/tZi4GMQ82MPpnDqfTABCrNzAwL3.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 12,
        "posterUrl": "https://image.tmdb.org/t/p/w500/qZQeAc3tbZn9RllBkKLBu4lACxy.jpg",
        "overview": ""
      }
    ]
  },
  "84958": {
    "totalSeasons": 2,
    "totalEpisodes": 12,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 6,
        "posterUrl": "https://image.tmdb.org/t/p/w500/8uVqe9ThcuYVNdh4O0kuijIWMLL.jpg",
        "overview": "Loki, the God of Mischief, steps out of his brother's shadow to embark on an adventure that takes place after the events of \"Avengers: Endgame.\""
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 6,
        "posterUrl": "https://image.tmdb.org/t/p/w500/oJdVHUYrjdS2IqiNztVIP4GPB1p.jpg",
        "overview": "In the aftermath of Season 1, Loki finds himself in a battle for the soul of the Time Variance Authority. Along with Mobius, Hunter B-15 and a team of new and returning characters, Loki navigates an ever-expanding and increasingly dangerous multiverse in search of Sylvie, Judge Renslayer, Miss Minutes and the truth of what it means to possess free will and glorious purpose."
      }
    ]
  },
  "85271": {
    "totalSeasons": 1,
    "totalEpisodes": 9,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/cq62fLH3vwOmiaLKMqkDI86tPtH.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Miniseries",
        "episodeCount": 9,
        "posterUrl": "https://image.tmdb.org/t/p/w500/8BSVNGpZwZDScVv8e5S1c8XIjeJ.jpg",
        "overview": ""
      }
    ]
  },
  "85937": {
    "totalSeasons": 5,
    "totalEpisodes": 63,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Unwavering Resolve Arc",
        "episodeCount": 26,
        "posterUrl": "https://image.tmdb.org/t/p/w500/bV0ZCL0IqrTQKClu6EtXlZaJevD.jpg",
        "overview": "It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself. Though devastated by this grim reality, Tanjiro resolves to become a “demon slayer” so that he can turn his sister back into a human, and kill the demon that massacred his family."
      },
      {
        "seasonNumber": 2,
        "name": "Mugen Train Arc",
        "episodeCount": 7,
        "posterUrl": "https://image.tmdb.org/t/p/w500/pLGjaDyg2LeA2d9KZxBZCiiqC2B.jpg",
        "overview": "Flame Hashira Kyojuro Rengoku receives new orders: Travel to the Mugen Train, where over forty people have gone missing, and conduct an investigation. Leaving the Demon Slayer Corps Headquarters, he sets off on this new mission. Tanjiro's group, fresh from completing their training at the Butterfly Mansion, also head to their next mission, the Mugen Train. There they rendezvous with Rengoku, who arrived ahead of them. On this train running through the darkness, a new battle is about to begin."
      },
      {
        "seasonNumber": 3,
        "name": "Entertainment District Arc",
        "episodeCount": 11,
        "posterUrl": "https://image.tmdb.org/t/p/w500/gbmhcOtre5SeBgwR9gvTpUra5kZ.jpg",
        "overview": "After visiting the Rengoku residence, Tanjirou and his comrades volunteer for a mission within the Entertainment District, a place where desires are sold and demons dwell. They journey alongside the flashy Sound Hashira, Tengen Uzui, in search of a monstrous foe terrorizing the town. Sworn to slay creatures of the night, the hunt continues."
      },
      {
        "seasonNumber": 4,
        "name": "Swordsmith Village Arc",
        "episodeCount": 11,
        "posterUrl": "https://image.tmdb.org/t/p/w500/6gD7G8HQay1X8mHiFVttWJ3czYb.jpg",
        "overview": "Tanjiro’s journey leads him to the Swordsmith Village, where he reunites with two Hashira, members of the Demon Slayer Corps’ highest-ranking swordsmen - Mist Hashira Muichiro Tokito and Love Hashira Mitsuri Kanroji. With the shadows of demons lurking near, a new battle begins for Tanjiro and his comrades."
      },
      {
        "seasonNumber": 5,
        "name": "Hashira Training Arc",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/axI3BUZgTYz36IYtUtRhivtspUo.jpg",
        "overview": "The members of the Demon Slayer Corps and their highest-ranking swordsmen, the Hashira. In preparation for the forthcoming final battle against Muzan Kibutsuji, the Hashira Training commences. While each carry faith and determination within their hearts, Tanjiro and the Hashira enter a new story."
      }
    ]
  },
  "88329": {
    "totalSeasons": 1,
    "totalEpisodes": 6,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/uHESULlKh7VSc0MRcqfyIf9Alk4.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Miniseries",
        "episodeCount": 6,
        "posterUrl": "https://image.tmdb.org/t/p/w500/nGcqeKieycPFvsxOeLJssCTt3mL.jpg",
        "overview": ""
      }
    ]
  },
  "88396": {
    "totalSeasons": 1,
    "totalEpisodes": 6,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/aTjbqMONy77fHJrIYu14g1F0d5h.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Miniseries",
        "episodeCount": 6,
        "posterUrl": "https://image.tmdb.org/t/p/w500/6kbAMLteGO8yyewYau6bJ683sw7.jpg",
        "overview": ""
      }
    ]
  },
  "91363": {
    "totalSeasons": 3,
    "totalEpisodes": 26,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/jnzoh5qoxRLFRIQAxnl6D3RStPC.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 9,
        "posterUrl": "https://image.tmdb.org/t/p/w500/lztz5XBMG1x6Y5ubz7CxfPFsAcW.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 9,
        "posterUrl": "https://image.tmdb.org/t/p/w500/3yhoq5LVMgKy9rEriH6ytq9BoJV.jpg",
        "overview": "Season two continues the journey as The Watcher guides viewers through the vast multiverse, introducing brand new and familiar faces throughout the MCU."
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/bbGeKXKoualYRYqvFYiv8fPZK0d.jpg",
        "overview": "Season 3 follows classic characters as they make unexpected choices that will mutate their worlds into spectacular alternate versions of the MCU."
      }
    ]
  },
  "92749": {
    "totalSeasons": 1,
    "totalEpisodes": 6,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/1uegR4uAxRxiMyX4nQnpzbXhrTw.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Miniseries",
        "episodeCount": 6,
        "posterUrl": "https://image.tmdb.org/t/p/w500/zPFm8ZbvdzoViRHnLi8cH7TBS1B.jpg",
        "overview": ""
      }
    ]
  },
  "92783": {
    "totalSeasons": 1,
    "totalEpisodes": 9,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/eljErfkQUcFUgQkI4I1soZcH8MW.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Miniseries",
        "episodeCount": 9,
        "posterUrl": "https://image.tmdb.org/t/p/w500/41Iekrap0j80u808Z2004t88r6o.jpg",
        "overview": ""
      }
    ]
  },
  "94997": {
    "totalSeasons": 3,
    "totalEpisodes": 26,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/577eXC8wFQT0eUrJcgznSiFPRmk.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 10,
        "posterUrl": "https://image.tmdb.org/t/p/w500/lx6hsqWXq4aVrXPjCqnMHFrGL5u.jpg",
        "overview": "Set nearly 200 years before Game of Thrones, King Viserys I Targaryen names his daughter, Princess Rhaenyra, as heir to the Iron Throne, breaking tradition and igniting tensions within the realm."
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/lZwxqNWnT1dRl76ry6BM0FPqCUg.jpg",
        "overview": "House Targaryen is divided in two. Civil war looms as both sides seek support from the great houses of Westeros, ultimately amassing armies — and dragons."
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/wSvDQN6tZR4VzDDZD3MUPIghVjC.jpg",
        "overview": "The Black and Green factions lock into an all-out, relentless struggle for the Iron Throne. As dragons and armies clash across the realm, Westeros witnesses the devastating consequences of total war."
      }
    ]
  },
  "95479": {
    "totalSeasons": 1,
    "totalEpisodes": 59,
    "runtime": 24,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/j2GvamiUMRpPjmNQSSht0Q7Z7e9.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 59,
        "posterUrl": "https://image.tmdb.org/t/p/w500/fHQ2XHRdRix0rkDCShmGQ8c6d03.jpg",
        "overview": ""
      }
    ]
  },
  "95557": {
    "totalSeasons": 5,
    "totalEpisodes": 32,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/9qrroces8C6R9aKr08hACNPVXdZ.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/yDWJYRAwMNKbIYT8ZB33qy84uzO.jpg",
        "overview": "Nolan Grayson (Omni-Man) is unquestionably the strongest being on our planet; he is also our most spirited protector, having saved the planet from untold calamity. His son Mark, wants nothing more than to follow in his footsteps. But there's something sinister afoot and Omni-man may not be what he appears. Which may prove even too much for the Guardians of the Globe."
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/dMOpdkrDC5dQxqNydgKxXjBKyAc.jpg",
        "overview": "After an earth-shattering betrayal, Mark fights to rebuild his life. In the face of apocalyptic threats, he discovers new allies and wrestles with his greatest fear - that he might become his father."
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/w9XQ7ehwaxqV6WJSAUE0qLTQHgq.jpg",
        "overview": "Everything changes as Mark is forced to face his past and his future, while discovering how much further he'll need to go to protect the people he loves."
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/4tblBrslcKSifMVZ3TmtT2ukMor.jpg",
        "overview": "While the world recovers from the global catastrophe of last season, a changed Mark struggles with guilt as he fights to protect his home and the people he loves, setting him on a collision course with a powerful new threat that could alter the fate of humanity forever."
      },
      {
        "seasonNumber": 5,
        "name": "Season 5",
        "episodeCount": 10,
        "posterUrl": null,
        "overview": ""
      }
    ]
  },
  "105009": {
    "totalSeasons": 1,
    "totalEpisodes": 55,
    "runtime": 24,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/jnThpphOHQRiTedCtz1yyshfkHw.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 55,
        "posterUrl": "https://image.tmdb.org/t/p/w500/arB3L9pZZBSzUPSC8BEv8c3X0bF.jpg",
        "overview": ""
      }
    ]
  },
  "110492": {
    "totalSeasons": 2,
    "totalEpisodes": 16,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/aJcUU3LMlqMKBi8L3eaxGfAbd4G.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/hE3LRZAY84fG19a18pzpkZERjTE.jpg",
        "overview": "After surviving being shot and then buried beneath a collapsing building, Peacemaker returns home only to realize that his freedom comes at a price. He is now part of Amanda Waller's new team fighting a mysterious new threat. Can he eliminate the threat without making things worse?"
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/2Wv0Zinc9nQ6ktL10Z9ckk2wjyZ.jpg",
        "overview": "Following the exposure of Project Butterfly and the disbandment of Task Force X, the 11th Street Kids grapple with new identities, new friendships, and new rivalries. For Peacemaker, this means reconciling his past with his newfound sense of purpose — here and in an alternate dimension. Meanwhile, Rick Flag Sr. reappears as the director of A.R.G.U.S., focused on controlling metahumans and avenging the death of his son at the hands of Peacemaker."
      }
    ]
  },
  "114410": {
    "totalSeasons": 1,
    "totalEpisodes": 12,
    "runtime": 24,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/5DUMPBSnHOZsbBv81GFXZXvDpo6.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 12,
        "posterUrl": "https://image.tmdb.org/t/p/w500/wi059pAZjRN3BbDSB1tMqXgwRDa.jpg",
        "overview": ""
      }
    ]
  },
  "152483": {
    "totalSeasons": 1,
    "totalEpisodes": 8,
    "runtime": 14,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/7bsHAsS1RDtslictkApeb7cedLL.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/vUXuXYB7o98BEhEIUYkycXWGBWC.jpg",
        "overview": ""
      }
    ]
  },
  "205715": {
    "totalSeasons": 2,
    "totalEpisodes": 16,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/tldMHeR7UnihV5ffrxxM8cDhbtT.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/uuot1N5AgZ7xRCKgm4ZCwOhgIJu.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/tEv842Nd5uMSavURG4aQO1pNtst.jpg",
        "overview": "As America adjusts to Homelander's reign, at Godolkin University, the new Dean preaches a course to make students more powerful than ever. Cate and Sam are heroes, while Marie, Jordan, and Emma return to class, after months of trauma. War is brewing between Humans and Supes and our crew learns of a secret program from the 60s that may be significant to today. And, somehow, Marie is a part of it."
      }
    ]
  },
  "225171": {
    "totalSeasons": 1,
    "totalEpisodes": 9,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/ulm1ex4JFYJByyaPyqTr47MFyEQ.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 9,
        "posterUrl": "https://image.tmdb.org/t/p/w500/7RcyNQG2qBD5BqPfcpRYKP2ElYH.jpg",
        "overview": "Albuquerque author Carol Sturka is one of only 13 people in the world immune to the effects of the \"Joining\", an event in which an extraterrestrial virus transformed the rest of humanity into a peaceful and content hive mind known as the \"Others\". The hive mind happily accommodates the wishes of those who remain unaffected, but admits that it will ultimately seek to assimilate them when it learns how to do so. Carol is adamantly against their efforts as she searches for a way to reverse the Joining."
      }
    ]
  },
  "250307": {
    "totalSeasons": 3,
    "totalEpisodes": 30,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/z3BkMbCy5ajZPMyKEUwsPHuz2cV.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 15,
        "posterUrl": "https://image.tmdb.org/t/p/w500/nBpyv3hovY8ObUzfcGhUDAXW7QZ.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 15,
        "posterUrl": "https://image.tmdb.org/t/p/w500/kvFSpESyBZMjaeOJDx7RS3P1jey.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 10,
        "posterUrl": "https://image.tmdb.org/t/p/w500/ccmUxsFmahPsOm1seIF2DERFeur.jpg",
        "overview": ""
      }
    ]
  },
  "260592": {
    "totalSeasons": 1,
    "totalEpisodes": 8,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/to5eI3AWbT4spz1K58mIK5HQRbD.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/nZGf0jnSJNXLf8o7iSzzX8qxHX9.jpg",
        "overview": ""
      }
    ]
  },
  "273240": {
    "totalSeasons": 1,
    "totalEpisodes": 8,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/3ANXZWhhcqPAh0q6nRZ979TIwxC.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/gtoV2udbEnUgkMuCNX8zJrEwm7N.jpg",
        "overview": ""
      }
    ]
  },
  "283297": {
    "totalSeasons": 2,
    "totalEpisodes": 8,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/nOWU1NSYQEOXRXcdfZbtJshwRGK.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/cThLWEGs6BEqY0QZMbU4FAeWwPT.jpg",
        "overview": ""
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 10,
        "posterUrl": null,
        "overview": ""
      }
    ]
  },
  "313101": {
    "totalSeasons": 1,
    "totalEpisodes": 8,
    "runtime": 45,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/2C15EiKyfLrWAWbjqpHvumgOtNk.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 8,
        "posterUrl": "https://image.tmdb.org/t/p/w500/3amZOUtoKygHuyJHwrxddKA4puH.jpg",
        "overview": ""
      }
    ]
  }
};

export function getCachedTVSeasons(tmdbId: number): CachedTVSeries | undefined {
  return TV_SEASONS_CATALOG[tmdbId];
}
