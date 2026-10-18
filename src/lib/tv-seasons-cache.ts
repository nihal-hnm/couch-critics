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
    "totalEpisodes": 153,
    "runtime": 22,
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/9AeiA1XtP5sel2tAf9LaGeUjhDb.jpg",
    "seasons": [
      {
        "seasonNumber": 1,
        "name": "Season 1",
        "episodeCount": 22,
        "posterUrl": "https://image.tmdb.org/t/p/w500/9hL8os3A3pGpdvQtt029zj2pURy.jpg",
        "overview": "Brooklyn Nine-Nine Season 1",
        "episodes": [
          {
            "seasonNumber": 1,
            "episodeNumber": 1,
            "title": "Pilot",
            "runtime": 30,
            "overview": "Detective Jake Peralta is a talented, but carefree police detective at Brooklyn's 99th precinct who, along with his eclectic group of colleagues, are used to having a lax captain around the office. However, when tightly-wound Captain Ray Holt takes over, he is determined to make this dysfunctional group of detectives into the best precinct in Brooklyn.",
            "airDate": "2013-09-17"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 2,
            "title": "The Tagger",
            "runtime": 30,
            "overview": "When Jake is late for roll call, Captain Ray Holt assigns him to a graffiti case that Jake feels is below his level. However, when the culprit turns out to be the Deputy Commissioner's son, the case becomes a major problem. Meanwhile, Gina's psychic friend visits the precinct and gets inside Charles' head.",
            "airDate": "2013-09-24"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 3,
            "title": "The Slump",
            "runtime": 30,
            "overview": "Jake has a slew of unsolved cases that he can't seem to close, and the other detectives don't want his losing streak to rub off on them. Meanwhile, Holt asks Amy to run lead on the Junior Policeman Program for at-risk youth, and she enlists Rosa and Gina's help. Also, Boyle helps Sergeant Jeffords with a special case he cannot solve.",
            "airDate": "2013-10-01"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 4,
            "title": "M.E. Time",
            "runtime": 30,
            "overview": "Much to the team's annoyance, Jake hits on an attractive medical examiner, Dr. Rossi, at a crime scene and holds up the autopsy report. He learns his lesson when Dr. Rossi turns out to be more than he bargained for. Meanwhile, Amy's purse-snatching case is stalled when the sketch artist is out sick, but she discovers that Sgt. Jeffords has hidden artistic talents.",
            "airDate": "2013-10-08"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 5,
            "title": "The Vulture",
            "runtime": 30,
            "overview": "A detective from Special Crimes, takes over Jake's nearly solved murder case and steals his thunder. Over a few drinks, Jake enlists the precinct to get revenge and find the murder weapon before \"The Vulture\" does. Across town, Captain Holt and Gina help Terry get re-certified to carry a gun.",
            "airDate": "2013-10-15"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 6,
            "title": "Halloween",
            "runtime": 30,
            "overview": "It's Halloween night, a busy time of the year for any police precinct. Amy detests the holiday, and is not thrilled when she has to don a costume to go undercover on street patrol with Charles. Back at the precinct, Jake bets Captain Holt that he can steal his Medal of Valor before midnight, which results in him bringing out some costumes of his own.",
            "airDate": "2013-10-22"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 7,
            "title": "48 Hours",
            "runtime": 30,
            "overview": "When Jake makes an arrest without a lot of proof, he only has 48 hours to collect evidence, or else the \"perp\" will be released. After his unsuccessful interrogation of the suspect, Jake forces his co-workers to spend their weekend helping him crack the case. So, while the team is stuck at the precinct, Charles judges a pie contest between Gina and Rosa, and Holt helps Terry look better in the eyes of his in-laws.",
            "airDate": "2013-11-05"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 8,
            "title": "Old School",
            "runtime": 30,
            "overview": "Jake's dream comes true when he gets to spend the day with his hero, Jimmy Brogan, a former crime reporter. But the dream becomes a nightmare when Jake's comments about Holt and the precinct are considered \"on the record.\" Meanwhile, Terry and Charles try to teach Rosa how to be less terrifying on the witness stand.",
            "airDate": "2013-11-12"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 9,
            "title": "Sal's Pizza",
            "runtime": 30,
            "overview": "When Sal's Pizza burns down and the fire marshal quickly assumes that the owner is the prime suspect in the investigation, Jake does everything in his power to prove him wrong, even if it means stepping out of his jurisdiction. Meanwhile back at the precinct, chaos ensues when a computer virus publishes everyone's browser history.",
            "airDate": "2013-11-19"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 10,
            "title": "Thanksgiving",
            "runtime": 30,
            "overview": "Amy wants to host a Thanksgiving dinner for the entire precinct, but it turns into a holiday disaster when Holt and Jake have to leave to go catch a perp. Boyle steps in to save Turkey Day.",
            "airDate": "2013-11-26"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 11,
            "title": "Christmas",
            "runtime": 30,
            "overview": "Captain Holt receives death threats and Jake is put in charge of his security, a job he enjoys and abuses as much as he can. Meanwhile, Amy attempts to get the precinct to take a Christmas photo for Holt, but a lack of enthusiasm and Rosa's refusal to smile defeats her efforts. Also, Sergeant Terry Jeffords gets his mojo back.",
            "airDate": "2013-12-03"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 12,
            "title": "Pontiac Bandit",
            "runtime": 30,
            "overview": "Jake is interested in one of Rosa's perps, Doug Judy, who has information about the \"Pontiac Bandit,\" a car thief whom Jake has been tracking for years. Meanwhile, the station tries to accommodate a scooter-bound Charles' every need when he returns to work, but he proves to be too much to handle. And Captain Holt struggles to find a home for two puppies.",
            "airDate": "2014-01-07"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 13,
            "title": "The Bet",
            "runtime": 30,
            "overview": "Jake and Amy's ongoing bet about who can make more arrests comes to a close. Meanwhile, Charles receives the Medal of Valor for getting shot in the line of duty, but the pain medication he is taking causes him to reveal his true opinions about his colleagues.",
            "airDate": "2014-01-14"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 14,
            "title": "The Ebony Falcon",
            "runtime": 30,
            "overview": "On his first task back in the field, Terry busts a steroid ring, and in doing so, takes cues from Jake on how to harness his emotions. Meanwhile, Amy and Rosa help solve a breaking-and-entering case at Gina's apartment.",
            "airDate": "2014-01-21"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 15,
            "title": "Operation: Broken Feather",
            "runtime": 30,
            "overview": "Jake and Amy investigate a string of hotel robberies together, but Jake turns on her when he finds out she may leave the Nine-Nine to work in the Special Crimes unit with \"The Vulture\". Meanwhile Captain Holt and Sergeant Jeffords strategize to make the precinct more efficient.",
            "airDate": "2014-02-02"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 16,
            "title": "The Party",
            "runtime": 30,
            "overview": "The officers in the precinct head over to Holt's house to celebrate his birthday, but they wind up making a poor impression on his husband.",
            "airDate": "2014-02-04"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 17,
            "title": "Full Boyle",
            "runtime": 30,
            "overview": "Detective Boyle's new romance has upped his swagger, but Jake intervenes before his colleague goes \"Full Boyle\" and gets too serious, too soon, with his girlfriend. Meanwhile, Rosa and Amy have trouble taking a costumed citizen crime-fighter seriously, and Captain Holt has a new opponent.",
            "airDate": "2014-02-11"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 18,
            "title": "The Apartment",
            "runtime": 30,
            "overview": "Jake's crushing debt finally catches up to him, and he is in danger of losing his apartment, unless Gina can find a way to bail him out. Captain Holt and Sergeant Jeffords hold performance reviews for the entire precinct, and Rosa and Boyle have a run-in with one of the weekend squad officers .",
            "airDate": "2014-02-25"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 19,
            "title": "Tactical Village",
            "runtime": 30,
            "overview": "The precinct heads to Tactical Village Day, a mandatory training course in which all regional precincts compete. While there, Amy runs into Teddy, a fellow officer she used to date. Meanwhile, Holt becomes addicted to a game on his phone and Rosa is pissed at Charles for not inviting her to his wedding.",
            "airDate": "2014-03-04"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 20,
            "title": "Fancy Brudgom",
            "runtime": 30,
            "overview": "Charles asks Jake to be the best man at his wedding, a role that requires Jake to be supportive in important wedding decisions, ranging from cake tasting to floral arrangements. Meanwhile, Terry, Amy and Gina support each other as they start a new extreme diet and Holt helps Rosa make a sincere apology.",
            "airDate": "2014-03-11"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 21,
            "title": "Unsolvable",
            "runtime": 30,
            "overview": "When Jake gets the weekend off, he decides to take on a cold case that everyone thinks is unsolvable, but with the help of Terry, the two try to crack the case once and for all. Meanwhile, Amy plans a romantic trip with Teddy and Gina and Rosa let Charles in on one of their best-kept secrets.",
            "airDate": "2014-03-18"
          },
          {
            "seasonNumber": 1,
            "episodeNumber": 22,
            "title": "Charges and Specs",
            "runtime": 30,
            "overview": "Jake's investigation of philanthropic civic leader Lucas Wint is shut down by Commissioner Podalski. Still determined to crack the case, Jake enlists Amy and a reluctant Captain Holt to help him uncover more evidence, even if it means facing suspension. Meanwhile, Charles is devastated over pre-marital problems with Vivian, and Gina knows just how to cheer him up.",
            "airDate": "2014-03-25"
          }
        ]
      },
      {
        "seasonNumber": 2,
        "name": "Season 2",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/lvST5TSkJqN4yyhDy5IgyoBDize.jpg",
        "overview": "Brooklyn Nine-Nine Season 2",
        "episodes": [
          {
            "seasonNumber": 2,
            "episodeNumber": 1,
            "title": "Undercover",
            "runtime": 30,
            "overview": "Jake's undercover FBI operation ends in a successful sting, until he learns one mobster has gotten away. As Jake enlists Charles' help to track him down, Holt tests the squad's patience with practice drills.",
            "airDate": "2014-09-28"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 2,
            "title": "Chocolate Milk",
            "runtime": 30,
            "overview": "Holt is taken by surprise when his longtime nemesis, Deputy Chief Madeline Wuntch arrives for an inspection of his precinct. Meanwhile, Jake and Terry test the boundaries of \"work friends\" vs. \"friend friends\" as they investigate a stabbing at a hipster chocolate milk bar.",
            "airDate": "2014-10-05"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 3,
            "title": "The Jimmy Jab Games",
            "runtime": 30,
            "overview": "The squad has time to kill when the arrival of the Serbian President's motorcade to Brooklyn has been delayed. So, Jake launches \"The Jimmy Jab Games,\" an annual series of competitions in the precinct. Meanwhile, Terry and Holt take on a new drug task force approved by Holt's nemesis, Deputy Chief Madeline Wuntch.",
            "airDate": "2014-10-12"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 4,
            "title": "Halloween II",
            "runtime": 30,
            "overview": "The Peralta/Holt annual Halloween bet continues when Jake challenges the Captain that he can steal his watch before midnight. Meanwhile, Gina is upset that her dance team, Floorgasm, kicks her off the squad and Terry confronts her about her bad attitude.",
            "airDate": "2014-10-19"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 5,
            "title": "The Mole",
            "runtime": 30,
            "overview": "There's a mole in the precinct and Holt and Jake need to find out who it is before Deputy Chief Madeline Wuntch gets wind of it. Meanwhile, Terry and Rosa visit a \"silent\" disco to uncover new leads for their new drug task force.",
            "airDate": "2014-11-02"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 6,
            "title": "Jake and Sophia",
            "runtime": 30,
            "overview": "Jake hits it off with Sophia, a woman whom he meets at a bar, only to find out she is the defense attorney for a perp he is trying to put in jail. Meanwhile, Gina and Charles work to put their relationship behind them.",
            "airDate": "2014-11-09"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 7,
            "title": "Lockdown",
            "runtime": 30,
            "overview": "The precinct goes into lockdown mode on Thanksgiving night, and Jake, who was left in charge, is confident in his ability to keep spirits high and avoid chaos. Amy is less confident, as things spiral out of control.",
            "airDate": "2014-11-16"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 8,
            "title": "USPIS",
            "runtime": 30,
            "overview": "While attempting to catch a drug dealer, Jake and Charles reluctantly join forces with the nerdy lead investigator at the U.S. Postal Service, Jack Danger. Meanwhile, the rest of the team helps Amy quit smoking.",
            "airDate": "2014-11-23"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 9,
            "title": "The Road Trip",
            "runtime": 30,
            "overview": "In an attempt to add a touch of romance to their work trip, Jake invites his girlfriend, Sophia, as well as Amy's boyfriend, Teddy, to join them at a B&amp;B. Meanwhile, Rosa adamantly refuses to admit to Terry and Gina that she is sick, and Charles is eager to help Holt with his anniversary breakfast.",
            "airDate": "2014-11-30"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 10,
            "title": "The Pontiac Bandit Returns",
            "runtime": 30,
            "overview": "Aka Doug Judy, is back in custody, after jamming up Jake and Rosa in his previous encounter with them. But when Rosa discovers that Judy knows the whereabouts of the \"Giggle Pig\" drug leader, Capt. Holt offers the perp a plea deal to help track down the drug kingpin. Meanwhile, Gina and Boyle are nervous that their parents might be getting too close, and Santiago makes Holt a Christmas gift against his wishes.",
            "airDate": "2014-12-07"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 11,
            "title": "Stakeout",
            "runtime": 30,
            "overview": "Jake and Charles' bro-mance starts to crack when they volunteer for an eight-day stakeout in very close quarters. Meanwhile, Captain Holt's nephew, Marcus, comes to Brooklyn and captures Rosa's attention.",
            "airDate": "2014-12-14"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 12,
            "title": "Beach House",
            "runtime": 30,
            "overview": "The team is excited to spend the weekend at Charles' beach house for a detectives-only-getaway, until Jake ruins the fun by inviting Captain Holt. Meanwhile, Charles helps Rosa send romantic texts to her new boyfriend, and Gina tries to get Amy drunk, simply for her own enjoyment.",
            "airDate": "2015-01-04"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 13,
            "title": "Payback",
            "runtime": 30,
            "overview": "The squad decides it's high time Jake paid them back all the money he has owed them from over the years. Meanwhile, Amy and Holt team up to re-open the Brooklyn Broiler case.",
            "airDate": "2015-01-11"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 14,
            "title": "Defense Rests",
            "runtime": 30,
            "overview": "When Sophia's job gets in the way of her relationship with Jake, Jake tries to smooth things over with her boss. Meanwhile, Wuntch needs Holt's help for a job recommendation.",
            "airDate": "2015-01-25"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 15,
            "title": "Windbreaker City",
            "runtime": 30,
            "overview": "Jake is heartbroken over Sophia, but his spirits are lifted when the squad is invited to a Homeland Security terrorist training simulation. That is, until the agent in charge assigns them the lame role of playing hostages. Meanwhile, Gina administers a psychological exam to Holt, and Amy and Rosa compete for a day off from work.",
            "airDate": "2015-02-08"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 16,
            "title": "The Wednesday Incident",
            "runtime": 30,
            "overview": "When Jake notices that Holt has been acting moody, he teams up with Holt's husband to figure out what happened. Meanwhile, at the precinct, Charles tries to get a confession out of a geriatric suspect who pretends to be senile and adorable whenever Amy and Rosa are around.",
            "airDate": "2015-02-15"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 17,
            "title": "Boyle-Linetti Wedding",
            "runtime": 30,
            "overview": "It's the day of Gina and Charles' parents' wedding, and the whole squad is given a job to fulfill for the ceremony. However, Jake and Amy get sidetracked chasing a criminal, and Terry struggles to officiate the wedding.",
            "airDate": "2015-03-01"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 18,
            "title": "Captain Peralta",
            "runtime": 30,
            "overview": "Jake's mainly absentee father, Roger, comes to town to spend some time with his son. Jake can't wait to see him, but Charles is skeptical of Roger's intentions. Meanwhile, Holt tasks Amy, Terry, Gina and Rosa with an impossible brain teaser in exchange for Beyoncé tickets.",
            "airDate": "2015-03-08"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 19,
            "title": "Sabotage",
            "runtime": 30,
            "overview": "After a streak of really bad luck, Jake thinks he's being sabotaged by an enemy. Holt assigns Amy and Rosa to investigate the truth. Meanwhile, Holt hurts Gina's feelings by calling her dance troupe a \"hobby,\" and Charles is stuck working a case with Scully and Hitchcock in Jake's absence.",
            "airDate": "2015-03-15"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 20,
            "title": "AC/DC",
            "runtime": 30,
            "overview": "After Jake injures himself on a case, Terry forces him take time off and rest - something Jake doesn't know how to do. Across town, Holt and Rosa try to avoid intimate conversation during a double-date with their significant others.",
            "airDate": "2015-04-26"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 21,
            "title": "Det. Dave Majors",
            "runtime": 30,
            "overview": "Jake is excited to work a case with the best detective in the NYPD, Detective Majors, until Majors shares his intentions to ask Amy out on a date. Meanwhile, Charles and Gina try to convince Terry to stay at the Nine-Nine when he considers accepting an offer to work at a private security firm.",
            "airDate": "2015-05-03"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 22,
            "title": "The Chopper",
            "runtime": 30,
            "overview": "Holt is wary when Wuntch lets Jake work his dream case, worried that she is setting him up to fail. Back at the precinct, Amy, Rosa and Gina help Terry host a field trip for a local magnet school.",
            "airDate": "2015-05-10"
          },
          {
            "seasonNumber": 2,
            "episodeNumber": 23,
            "title": "Johnny and Dora",
            "runtime": 30,
            "overview": "Jake and Amy go undercover to catch Brooklyn's most notorious identity thief, and the case brings them closer together - very close. Meanwhile, the entire precinct is caught off-guard when one of their own says goodbye to the Nine-Nine.",
            "airDate": "2015-05-17"
          }
        ]
      },
      {
        "seasonNumber": 3,
        "name": "Season 3",
        "episodeCount": 23,
        "posterUrl": "https://image.tmdb.org/t/p/w500/nqlpXFbyCGzeBaDVC2E6PO5itCw.jpg",
        "overview": "Brooklyn Nine-Nine Season 3",
        "episodes": [
          {
            "seasonNumber": 3,
            "episodeNumber": 1,
            "title": "New Captain",
            "runtime": 30,
            "overview": "After Holt is transferred to the NYPD Department of Public Relations, the new captain's arrival causes the precinct to dissolve into chaos, despite Terry's best efforts to keep everyone on point. Meanwhile, Jake and Amy face the aftermath of their \"for reals\" kiss.",
            "airDate": "2015-09-27"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 2,
            "title": "The Funeral",
            "runtime": 30,
            "overview": "The Nine-Nine gets another personnel change that could put Jake and Amy's budding relationship at risk. Meanwhile, Terry assists Holt with an important public relations matter, and Rosa and Gina try to convince Charles to rethink his affection for a fellow officer.",
            "airDate": "2015-10-04"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 3,
            "title": "Boyle's Hunch",
            "runtime": 30,
            "overview": "Jake thinks Boyle might have met his soulmate in Genevieve, an art gallery owner, and he tries to help set them up. Meanwhile, Rosa deals with inter-precinct theft and Holt seeks Amy's help with an image campaign.",
            "airDate": "2015-10-11"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 4,
            "title": "The Oolong Slayer",
            "runtime": 30,
            "overview": "When investigating a serial killer, Jake enlists Holt's help in an attempt to solve the case off the radar. At the precinct, Rosa and Amy are forced to deal with demands from an old adversary and Terry discovers a new obsession.",
            "airDate": "2015-10-18"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 5,
            "title": "Halloween, Part III",
            "runtime": 30,
            "overview": "The third installment of Captain Holt and Jake's Halloween heist culminates with a tie-breaking competition to claim the title of \"amazing detective slash genius.\" This year, Jake and Holt split the squad into two teams to help them win.",
            "airDate": "2015-10-25"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 6,
            "title": "Into the Woods",
            "runtime": 30,
            "overview": "Jake and Charles convince Terry to take a weekend camping trip as a much needed \"babymoon,\" but they soon realize it might not be the idealistic weekend for which they had hoped. Meanwhile back at the precinct, Holt gives Rosa some important relationship advice and Amy enlists Gina's help to prepare her for an important presentation.",
            "airDate": "2015-11-08"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 7,
            "title": "The Mattress",
            "runtime": 30,
            "overview": "Jake and Amy convince the Captain to let them work a case together involving a new street drug, but their new relationship gets in the way. Meanwhile, at the precinct, Charles panics when he realizes he's damaged one of Holt's prized possessions and Terry teaches Rosa a lesson in discipline.",
            "airDate": "2015-11-15"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 8,
            "title": "Ava",
            "runtime": 30,
            "overview": "Jake's in charge of entertaining Sharon while Terry and Rosa head off to learn about the Douglass Street murders, but Sharon's water breaks and crisis ensues at the precinct; and Amy and Charles must process paperwork by hand due to an internet outage. Meanwhile, Holt is forced to confront his ex-boyfriend.",
            "airDate": "2015-11-22"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 9,
            "title": "The Swedes",
            "runtime": 30,
            "overview": "In an attempt to solve an international case, Jake and Rosa are forced to work with a pair of Swedish cops and things get very competitive, very quickly. Meanwhile, Amy and Terry offer to help Gina prepare for a big test and Holt enlists Charles to sub in as his squash partner for an annual tournament.",
            "airDate": "2015-12-06"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 10,
            "title": "Yippie Kayak",
            "runtime": 30,
            "overview": "Jake, Charles and Gina are involved in a real-life \"Die Hard\" situation while off-duty on Christmas Eve, and Terry must leave his family celebration to try to save his squad. Meanwhile, Amy tries to prove she's just as tough as Holt and Rosa.",
            "airDate": "2015-12-13"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 11,
            "title": "Hostage Situation",
            "runtime": 30,
            "overview": "Charles and Genevieve want to take their relationship to a new level, but his ex-wife, Eleanor, steamrolls their plans. Meanwhile, Amy asks Terry to write a recommendation letter with disastrous results, and Holt and Rosa enlist Gina's help to solve a case.",
            "airDate": "2016-01-05"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 12,
            "title": "9 Days",
            "runtime": 30,
            "overview": "When Captain Holt and Jake accidentally contract the mumps during an investigation, they decide to be quarantined together in hopes of still solving the case. Meanwhile, Rosa tries to help Boyle through a mourning process, and Terry is forced to clean up Hitchcock and Scully's mess.",
            "airDate": "2016-01-19"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 13,
            "title": "The Cruise",
            "runtime": 30,
            "overview": "Jake and Amy are excited to go on their first real vacation together, but Amy's perfectly planned cruise ship itinerary is thwarted when they discover an old adversary is on board with them. Meanwhile, Gina and Terry help Captain Holt survive a visit from his sister, Debbie, and Charles and Rosa vie for the same apartment.",
            "airDate": "2016-01-26"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 14,
            "title": "Karen Peralta",
            "runtime": 30,
            "overview": "On his birthday, Jake brings Amy to meet his mother, but a surprise appearance by his dad throws a wrench in his special day. Meanwhile, Rosa and Charles struggle with a new mandate regarding body cams while on a stakeout with Terry, and Gina forgets to inform the precinct about an important plan of Holt's.",
            "airDate": "2016-02-02"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 15,
            "title": "The 9-8",
            "runtime": 30,
            "overview": "The Nine-Nine host the detectives from the Nine-Eight, their neighboring precinct, reuniting Jake with his old partner. Charles is immediately jealous and tries to reclaim his best friend status with Jake. Meanwhile, the rest of the precinct tries to be welcoming to the Nine-Eight, but it doesn't go as well as they had planned.",
            "airDate": "2016-02-09"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 16,
            "title": "House Mouses",
            "runtime": 30,
            "overview": "When Jake insults Hitchcock and Scully's work ethic in the precinct, they force their way into one of his cases in attempt to prove themselves. Meanwhile, Amy and Gina help Rosa conquer one of her biggest fears, and Holt and Boyle work a celebrity case.",
            "airDate": "2016-02-16"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 17,
            "title": "Adrian Pimento",
            "runtime": 30,
            "overview": "When an unstable detective returns to the Nine-Nine after years undercover, Jake doesn't know what to make of him. Meanwhile, Charles' rebellious behavior pits him against the precinct's custodian, and Holt enlists Gina's help in directing a \"fun and informational\" video starring himself and Rosa.",
            "airDate": "2016-02-23"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 18,
            "title": "Cheddar",
            "runtime": 30,
            "overview": "Holt allows Amy and Jake to house-sit for him while he visits Kevin in Paris, but mayhem ensues when Holt's beloved dog, Cheddar, goes missing under their watch. Meanwhile, a romantic fling between Adrian Pimento and Rosa disrupts Terry and the rest of the precinct.",
            "airDate": "2016-03-01"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 19,
            "title": "Terry Kitties",
            "runtime": 30,
            "overview": "In an attempt to prove to his old precinct that he's not a joke, Terry enlists Jake's help in solving a case from his past. Meanwhile, Adrian moves in with Charles, with mixed results, and Amy invites herself to a hyper-competitive training exercise with Holt and Rosa.",
            "airDate": "2016-03-15"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 20,
            "title": "Paranoia",
            "runtime": 30,
            "overview": "Rosa enlists Jake to help change Terry's disapproving opinion about her fast-moving relationship with Adrian Pimento. But their love for each other is put on hold when Pimento thinks someone from his past is trying to kill him.",
            "airDate": "2016-03-29"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 21,
            "title": "Maximum Security",
            "runtime": 30,
            "overview": "In an attempt to get information on a criminal operation, Amy has to go undercover at a women's prison and befriend one of the prisoners. Meanwhile back at the precinct, Holt and the team plan a fake funeral in an attempt to catch a hitman.",
            "airDate": "2016-04-05"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 22,
            "title": "The Bureau",
            "runtime": 30,
            "overview": "With Pimento's life still in peril, Captain Holt calls on an old friend in the FBI to help with a seemingly impossible heist. Meanwhile Amy makes a breakthrough while undercover, and Terry and Gina discover an information leak in the Nine-Nine.",
            "airDate": "2016-04-12"
          },
          {
            "seasonNumber": 3,
            "episodeNumber": 23,
            "title": "Greg and Larry",
            "runtime": 30,
            "overview": "After a surprising turn of events in the Nine-Nine's attempt to track down Adrian Pimento's hitman, the precinct drops everything when they suspect Holt is in danger.",
            "airDate": "2016-04-19"
          }
        ]
      },
      {
        "seasonNumber": 4,
        "name": "Season 4",
        "episodeCount": 22,
        "posterUrl": "https://image.tmdb.org/t/p/w500/6fsr582nvms8E4ag3jb3oHL76en.jpg",
        "overview": "Brooklyn Nine-Nine Season 4",
        "episodes": [
          {
            "seasonNumber": 4,
            "episodeNumber": 1,
            "title": "Coral Palms, Part 1",
            "runtime": 30,
            "overview": "Jake and Holt remain in Florida, adjusting to their new lives under the Witness Protection Program, while Jimmy \"The Butcher\" Figgis is still on the loose. Their one human link to their regular lives is U.S. Marshall Karen Haas, but their anonymity may be in danger...",
            "airDate": "2016-09-20"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 2,
            "title": "Coral Palms, Part 2",
            "runtime": 30,
            "overview": "After Jimmy \"The Butcher\" Figgis sees Jake and Holt's viral video, the two begin plotting their attack. However, they are forced to experience the other side of the interrogation table when caught red-handed. Back at the precinct, a questionable new Captain takes over.",
            "airDate": "2016-09-27"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 3,
            "title": "Coral Palms, Part 3",
            "runtime": 30,
            "overview": "The team makes a road trip to Florida to try to help Jake and Holt take down Figgis. With an unforeseen injury and yet another interruption by Sheriff Reynolds, the plan doesn't follow through quite like they all had hoped. In the midst of the chaos, Jake and Amy share an awkward reunion.",
            "airDate": "2016-10-04"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 4,
            "title": "The Night Shift",
            "runtime": 30,
            "overview": "As Jake struggles with his first case back at the precinct, he encounters Jess Day, who is visiting New York, and enlists her to help him find his suspect. Meanwhile, Holt researches ways to increase office morale and Amy tries to figure out why Rosa keeps taking such long breaks.",
            "airDate": "2016-10-11"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 5,
            "title": "Halloween IV",
            "runtime": 30,
            "overview": "It's Halloween in the Nine-Nine, which can only mean one thing: heist time. This year, the squad members pull out all the stops in their quest to win the new defending title of \"Ultimate Detective Slash Genius.\" Lines are drawn and plans are made, but there can only be one reigning champion",
            "airDate": "2016-10-18"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 6,
            "title": "Monster in the Closet",
            "runtime": 30,
            "overview": "Pimento and Rosa decide to pick up where they left off and get married, so the whole squad preps a perfect wedding under Amy's careful direction. Pimento enlists Jake and Gina to hunt for his grandmother's ruby earrings for Rosa to wear in the ceremony, but the universe has other plans for them.",
            "airDate": "2016-11-15"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 7,
            "title": "Mr. Santiago",
            "runtime": 30,
            "overview": "At Amy's intricately planned Thanksgiving dinner, Jake goes \"full Santiago\" (binder and all) in order to impress her father, a former cop. With Jake and Amy's focus elsewhere, Charles is left on turkey duty and Holt helps Pimento cope after learning he can no longer work for the NYPD.",
            "airDate": "2016-11-22"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 8,
            "title": "Skyfire Cycle",
            "runtime": 30,
            "overview": "When famous author DC Parlov receives death threats, Jake and Terry take the case, so that Terry can meet his lifelong hero. Back at the precinct, Gina forces her way into the Boyle clan of cousins in an attempt to choose the location of the annual Boyle family vacation. Meanwhile, Holt's anger peaks when Amy chooses Kevin's side in their argument about a math puzzle.",
            "airDate": "2016-11-29"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 9,
            "title": "The Overmining",
            "runtime": 30,
            "overview": "Captain \"CJ\" is having major problems with a big case, and Jake and Holt find the motivation to help him out. Inside the precinct, war ensues when Terry enforces a green initiative and tells Gina to get rid of her precious space heater, while Rosa and Boyle take a break from the night shift to visit a foot massage parlor.",
            "airDate": "2016-12-06"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 10,
            "title": "Captain Latvia",
            "runtime": 30,
            "overview": "Charles enlists Jake's help in tracking down his son's favorite toy for Christmas, and the pair finds themselves accidentally facing off against a Latvian criminal ring as a result. Back at the precinct, the team gears up for their annual Christmas carol competition against their sworn enemy: the MTA.",
            "airDate": "2016-12-13"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 11,
            "title": "The Fugitive, Part 1",
            "runtime": 30,
            "overview": "A mass escape of convicts from a prison van in the streets of Brooklyn sends the entire squad on a manhunt. The only key witness? Former NFL running back Marshawn Lynch. Meanwhile, Jake and Amy place a bet on who can bring in the most escaped convicts - and the loser has to move into the winner's apartment. Then, with only one fugitive still on the loose, Jake enlists a surprising ally.",
            "airDate": "2017-01-01"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 12,
            "title": "The Fugitive, Part 2",
            "runtime": 30,
            "overview": "With only one fugitive left on the loose after a mass escape of convicts from a prison van in the streets of Brooklyn that sent the entire squad on a manhunt, Jake enlists a surprising ally.",
            "airDate": "2017-01-01"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 13,
            "title": "The Audit",
            "runtime": 30,
            "overview": "With the crime rate lowered, Brooklyn will be shutting down one of its precincts – permanently. The Nine-Nine is confident they will be evaluated fairly, until the official auditor turns out to be Amy's ex-boyfriend, Teddy. The whole squad then must band together to try to save the precinct.",
            "airDate": "2017-04-11"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 14,
            "title": "Serve & Protect",
            "runtime": 30,
            "overview": "Terry's ex replaces Teddy in evaluating the precinct, but Jake and Rosa are distracted by a burglary case that occurred on the set of one of their favorite detective TV shows. As the rest of the Nine-Nine concentrate on the audit (and Terry's past relationship strategies), Jake and Rosa pass time with the series star and producer, who meddle in the case and charm Jake with the glamour of show business.",
            "airDate": "2017-04-18"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 15,
            "title": "The Last Ride",
            "runtime": 30,
            "overview": "In what could be their last case as partners, Jake and Charles go to great extremes to apprehend a local bike thief. Terry shockingly isn't in the lead for \"Mr. Nine-Nine\" (the detective who has solved the most cases), leaving Rosa determined to boost his ego. Meanwhile, Amy spends some precious time with Holt.",
            "airDate": "2017-04-25"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 16,
            "title": "Moo Moo",
            "runtime": 30,
            "overview": "Sergeant Jeffords is stopped by a fellow police officer while off-duty in his own neighborhood. When the incident escalates, Terry wants to file an official complaint against him, but Captain Holt has other ideas. Meanwhile, Jake and Amy get a glimpse into the difficulties of parenthood and answer some tough questions when they babysit Terry's kids.",
            "airDate": "2017-05-02"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 17,
            "title": "Cop-Con",
            "runtime": 30,
            "overview": "The precinct packs up and heads to the Tri-State Police Officers' annual Cop-Con, which is usually the Nine-Nine's excuse for a big annual party. But the squad's fun is threatened this year when Holt asks them to be on their best behavior. Then, Amy suddenly vanishes hours before taking the Sergeant Exam, and it's up to Jake and Rosa to find her before it's too late.",
            "airDate": "2017-05-09"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 18,
            "title": "Chasing Amy",
            "runtime": 30,
            "overview": "Amy suddenly vanishes hours before taking the Sergeant Exam, and it's up to Jake and Rosa to find her before it's too late.",
            "airDate": "2017-05-09"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 19,
            "title": "Your Honor",
            "runtime": 30,
            "overview": "Captain Holt's mom seeks support from the precinct after her house is robbed. Meanwhile, Terry, Rosa and Boyle remodel the breakroom and Amy teaches Gina how to change her own car tire.",
            "airDate": "2017-05-16"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 20,
            "title": "The Slaughterhouse",
            "runtime": 30,
            "overview": "Jake and Rosa try to earn the respect of their idol; Charles, Terry and Gina try to resolve Scully and Hitchcock's conflict.",
            "airDate": "2017-05-16"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 21,
            "title": "The Bank Job",
            "runtime": 30,
            "overview": "As Jake and Rosa continue their search for a bank-robbing operation with Lieutenant Hawkins, they realize there's more to her team than meets the eye.",
            "airDate": "2017-05-23"
          },
          {
            "seasonNumber": 4,
            "episodeNumber": 22,
            "title": "Crime and Punishment",
            "runtime": 30,
            "overview": "Jake and Rosa are framed for a crime they didn't commit, it's up to the Nine-Nine to find a way to bust them out.",
            "airDate": "2017-05-23"
          }
        ]
      },
      {
        "seasonNumber": 5,
        "name": "Season 5",
        "episodeCount": 22,
        "posterUrl": "https://image.tmdb.org/t/p/w500/dWOF2pJBNfunspM7PpVG6O9LWj3.jpg",
        "overview": "Brooklyn Nine-Nine Season 5",
        "episodes": [
          {
            "seasonNumber": 5,
            "episodeNumber": 1,
            "title": "The Big House, Part 1",
            "runtime": 30,
            "overview": "Jake and Rosa assimilate to their new lives behind bars, but both are coping in very different ways. Jake bonds with his cellmate, Caleb, and is forced to join a prison gang led by notorious inmate Romero, in order to gain his protection. Meanwhile, in the women's prison, Rosa puts Holt and Terry to the test by having them complete outrageous favors for her. Back in the precinct, Amy and Charles are doing all they can to exonerate their colleagues.",
            "airDate": "2017-09-26"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 2,
            "title": "The Big House, Part 2",
            "runtime": 30,
            "overview": "When the warden asks Jake to investigate Romero's drug smuggling operation, Jake and Caleb find themselves caught between the loyalty Jake has sworn to both of them. Meanwhile, Amy is offered a deal by a local mobster who claims he can prove that Hawkins is guilty, but Holt and the rest of the gang think they have a safer plan.",
            "airDate": "2017-10-03"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 3,
            "title": "Kicks",
            "runtime": 30,
            "overview": "Now that he's officially back at the precinct and desperate to solve a real case, Jake finds a loophole to get out of his temporarily designated desk duty. Unfortunately, that loophole rests on his ability to pass an official evaluation performed by Holt. While Charles provides Jake with moral support, Terry and Amy help Rosa, who believes Pimento may be cheating on her.",
            "airDate": "2017-10-10"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 4,
            "title": "HalloVeen",
            "runtime": 30,
            "overview": "The Nine-Nine embarks on its fifth annual Halloween Heist and, as usual, everybody has a plan and no one is safe. Relationships and friendships are tested as the title \"Amazing Human Slash Genius\" must be snagged by midnight, leaving everyone pitted against each other.",
            "airDate": "2017-10-17"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 5,
            "title": "Bad Beat",
            "runtime": 30,
            "overview": "To track down the infamous arms dealer Dan \"Daniel\" Valdano, Jake and Terry go undercover at an illegal gambling club, but when Holt gets involved to coach the two in the art of poker, his addiction resurfaces. Meanwhile, Boyle buys a food truck that was formerly used in a brutal string of murders without telling his investor, Amy, and Hitchcock and Scully challenge Rosa to a \"Butt-lympics\".",
            "airDate": "2017-11-07"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 6,
            "title": "The Venue",
            "runtime": 30,
            "overview": "The always unwelcome Vulture pops back into Jake and Amy's lives, threatening to swoop in and take something important away from them. Meanwhile, Boyle and Rosa must track down \"Sergeant Peanut Butter,\" the kidnapped NYPD horse that Charles envies, and Holt challenges Terry to be less image-conscious.",
            "airDate": "2017-11-14"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 7,
            "title": "Two Turkeys",
            "runtime": 30,
            "overview": "Jake and Amy attempt to get their parents to bond over Thanksgiving dinner, but their first holiday together as a family does not go well. Meanwhile, at the precinct, Holt and Kevin's special Thanksgiving pie is stolen from his office and Holt searches through the ranks for the possible culprit.",
            "airDate": "2017-11-21"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 8,
            "title": "Return to Skyfire",
            "runtime": 30,
            "overview": "When Terry's favorite author, DC Parlov, returns to the precinct because his latest manuscript was stolen, Terry and Jake convince Rosa to go undercover with them at a fantasy fiction convention to find the culprit. As drama ensues between Parlov and another writer, Terry admits that he's been writing a book of his own. Back at the precinct, Holt, Amy and Charles take a forensics course, but Charles' big mouth gets him in trouble.",
            "airDate": "2017-11-28"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 9,
            "title": "99",
            "runtime": 30,
            "overview": "While the entire precinct attends a funeral in LA, Holt learns that he is in the running to become Chief Commissioner of the NYPD - his dream job. But after missing their flight back to New York, Jake must devise a variety of ways to get Holt back in time for the interview. Forced to stay with some estranged members of the Boyle family, Amy tries to convince everyone that she can be laid back, Terry panics about losing his first-class flight and Charles uncovers some new information about Rosa's personal life.",
            "airDate": "2017-12-05"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 10,
            "title": "Game Night",
            "runtime": 30,
            "overview": "Rosa begs Jake to help her break some big news to her parents, but her plan is thrown off when they wrongly assume the two are dating. Gina returns to help the 99 get their internet access back from the Cyber Crimes division.",
            "airDate": "2017-12-12"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 11,
            "title": "The Favor",
            "runtime": 30,
            "overview": "When Seamus Murphy returns to redeem the favor Holt owes him, the precinct searches for a loophole that will allow Holt to uphold his end of the bargain without breaking the law.",
            "airDate": "2017-12-12"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 12,
            "title": "Safe House",
            "runtime": 30,
            "overview": "After Seamus threatens Kevin, Holt devises an elaborate plan to hide him in a safe house, with Jake as his guard. Kevin is miserable as the 99 works overtime to find Seamus and take him down.",
            "airDate": "2018-03-18"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 13,
            "title": "The Negotiation",
            "runtime": 30,
            "overview": "Jake is called upon to negotiate a hostage situation with a jewel thief, only to discover that the culprit seems to be a familiar face. Amy and Gina help Charles with the high demands of his new food truck, and Holt panics when a member of the Police Commissioner selection committee decides to interview Hitchcock about Holt.",
            "airDate": "2018-03-25"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 14,
            "title": "The Box",
            "runtime": 30,
            "overview": "Jake embarks on an all-night long interrogation in order to elicit a confession out of a suspect. But when Captain Holt skips the opera in order to stay back and help, the two cops clash over how to get him to talk.",
            "airDate": "2018-04-01"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 15,
            "title": "The Puzzle Master",
            "runtime": 30,
            "overview": "Jake surprises Amy with an investigation into a string of arsons connected to her favorite crossword puzzle author, Vin Stermley. Meanwhile, Gina helps Holt jazz up his Commissioner candidate speech, and Terry, Rosa, Hitchcock and Scully argue over who is most deserving of the new detective car.",
            "airDate": "2018-04-08"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 16,
            "title": "NutriBoom",
            "runtime": 30,
            "overview": "Jake and Charles realize that they've been suckered into the cult-like NutriBoom pyramid scheme, and must find a way to sever their contracts.",
            "airDate": "2018-04-15"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 17,
            "title": "DFW",
            "runtime": 30,
            "overview": "Jake invites his newly discovered half-sister to stay with him in New York, but when he and Amy realize she's a bit of a nightmare, they must find a way to get her back home to Dallas.",
            "airDate": "2018-04-15"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 18,
            "title": "Gray Star Mutual",
            "runtime": 30,
            "overview": "When a fire destroys Charles' food truck, Pimento unexpectedly shows up to the scene as the insurance agent. Meanwhile, Rosa helps Amy to see that it's okay to get excited about picking her wedding dress, and Gina and Terry coach Holt in the art of social media.",
            "airDate": "2018-04-22"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 19,
            "title": "Bachelor/ette Party",
            "runtime": 30,
            "overview": "Charles plans an elaborate scavenger hunt for Jake's bachelor party, but the day goes awry when the guys decide to take some shortcuts instead. Meanwhile, Amy's bachelorette party escalates when the ladies realize she previously slept with a member of her soon-to-be wedding band.",
            "airDate": "2018-04-29"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 20,
            "title": "Show Me Going",
            "runtime": 30,
            "overview": "When Rosa responds to an active shooter alert, the rest of the squad is forced to stay back, desperately fearing for her safety. Feeling helpless, Jake frantically brainstorms ways to offer his assistance, Terry faces an existential crisis and Gina and Amy try to make themselves useful by fixing Rosa's broken toilet.",
            "airDate": "2018-05-06"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 21,
            "title": "White Whale",
            "runtime": 30,
            "overview": "Rosa and Amy team up to take down their \"white whale\" suspect - a ruthless killer who has managed to elude them for seven years - while Terry helps Jake tackle his wedding planning chores. Then, Captain Holt and his rival, Olivia Crawford, try to convince each other to step down in the campaign for Commissioner.",
            "airDate": "2018-05-13"
          },
          {
            "seasonNumber": 5,
            "episodeNumber": 22,
            "title": "Jake & Amy",
            "runtime": 30,
            "overview": "Jake and Amy's wedding day is majorly threatened, and Charles and the whole squad rush to help save it. Amidst the chaos, Holt hesitates to open the email that will indicate if he has won his campaign for Commissioner, despite Gina's encouragement. Meanwhile, Terry gently pushes Rosa towards a potential love interest.",
            "airDate": "2018-05-20"
          }
        ]
      },
      {
        "seasonNumber": 6,
        "name": "Season 6",
        "episodeCount": 18,
        "posterUrl": "https://image.tmdb.org/t/p/w500/xa9xA4Ieju9cyVkfJ47n1hnbHWB.jpg",
        "overview": "Brooklyn Nine-Nine Season 6",
        "episodes": [
          {
            "seasonNumber": 6,
            "episodeNumber": 1,
            "title": "Honeymoon",
            "runtime": 30,
            "overview": "Jake and Amy go on their honeymoon. Capt. Holt finds out whether he is the new commissioner of the NYPD.",
            "airDate": "2019-01-10"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 2,
            "title": "Hitchcock & Scully",
            "runtime": 30,
            "overview": "Jake and Charles investigate a case of Hitchcock and Scully from the 1980s. Meanwhile, Amy's uniformed officers and Terry's detectives fight over limited resources.",
            "airDate": "2019-01-17"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 3,
            "title": "The Tattler",
            "runtime": 30,
            "overview": "Jake and Gina attend their 20th high school reunion. Back at the Nine-Nine, Charles helps Rosa with her love life.",
            "airDate": "2019-01-24"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 4,
            "title": "Four Movements",
            "runtime": 30,
            "overview": "Gina plays a high-stakes game of chess with Captain Holt. Rosa and Amy take Gina out for a fancy brunch. Jake and Gina must use their wits to infiltrate a posh club.",
            "airDate": "2019-01-31"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 5,
            "title": "A Tale of Two Bandits",
            "runtime": 30,
            "overview": "Terry believes the Pontiac Bandit is stealing cars again, but Jake is convinced his friend wouldn't do that. The rest of the squad fight to keep Shaw's a police bar after some firemen stake their claim to it.",
            "airDate": "2019-02-07"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 6,
            "title": "The Crime Scene",
            "runtime": 30,
            "overview": "Jake and Rosa must deal with a mother in mourning as they work and rework a crime scene in order to solve a difficult murder case with confusing evidence.",
            "airDate": "2019-02-14"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 7,
            "title": "The Honeypot",
            "runtime": 30,
            "overview": "Jake and Holt clash over the merits of a new hire in the 99th precinct. Terry, Amy, Rosa and Charles try to do something about the cluttered bullpen.",
            "airDate": "2019-02-21"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 8,
            "title": "He Said, She Said",
            "runtime": 30,
            "overview": "Jake and Amy investigate a difficult \"he said, she said\" case. Holt becomes suspicious after learning his lifelong arch nemesis died in a prison transport accident.",
            "airDate": "2019-02-28"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 9,
            "title": "The Golden Child",
            "runtime": 30,
            "overview": "Jake helps Amy navigate the complicated relationship she has with her brother, David. Charles introduces some drama into an undercover mission involving Terry and Holt.",
            "airDate": "2019-03-07"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 10,
            "title": "Gintars",
            "runtime": 30,
            "overview": "A visitor from Latvia causes Charles and Jake to investigate Nikolaj's family. Holt and Amy bring in famed forensic scientist Dr. Yee to help close a case for Rosa.",
            "airDate": "2019-03-14"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 11,
            "title": "The Therapist",
            "runtime": 30,
            "overview": "Charles brings Jake into a case when a therapist reports one of his patient's missing. Holt finds out Rosa has a new girlfriend that everyone else has met. Amy believes she has accidentally received a package meant for Terry.",
            "airDate": "2019-03-21"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 12,
            "title": "Casecation",
            "runtime": 30,
            "overview": "Work is so busy for Jake and Amy that they end up celebrating their anniversary while standing guard over a comatose patient in the hospital.",
            "airDate": "2019-04-11"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 13,
            "title": "The Bimbo",
            "runtime": 30,
            "overview": "Holt and Jake investigate a case at Kevin's university. Back at the precinct, Terry and Amy take the squad out for lunch.",
            "airDate": "2019-04-18"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 14,
            "title": "Ticking Clocks",
            "runtime": 30,
            "overview": "In an episode that takes place in real time, Jake and the squad must track down a hacker who has infiltrated the Nine-Nine's servers. Rosa deals with relationship issues. Hitchcock and Scully attempt to cook the perfect lasagna.",
            "airDate": "2019-04-25"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 15,
            "title": "Return of the King",
            "runtime": 30,
            "overview": "When Gina returns to the Nine-Nine, Jake and Terry get drawn into her life. Holt learns that Charles's son, Nikolaj, may be a genius. Rosa copes with an injury.",
            "airDate": "2019-05-02"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 16,
            "title": "Cinco de Mayo",
            "runtime": 30,
            "overview": "In order to distract Terry from the stress of his upcoming lieutenant's exam, Jake, Holt and the squad decide to hold the annual Halloween Heist on a new date, Cinco de Mayo.",
            "airDate": "2019-05-09"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 17,
            "title": "Sicko",
            "runtime": 30,
            "overview": "Jake and Charles investigate a dangerous serial killer. Holt continues to spar with his rival, Commissioner Kelly. Terry finds out about whether or not he has passed the lieutenant's exam.",
            "airDate": "2019-05-16"
          },
          {
            "seasonNumber": 6,
            "episodeNumber": 18,
            "title": "Suicide Squad",
            "runtime": 30,
            "overview": "Desperate circumstances call for desperate measures, as Jake, Holt, Amy, Terry, Rosa and Charles must ally themselves with old enemies",
            "airDate": "2019-05-16"
          }
        ]
      },
      {
        "seasonNumber": 7,
        "name": "Season 7",
        "episodeCount": 13,
        "posterUrl": "https://image.tmdb.org/t/p/w500/kJUpn3xnymCbdxInyZVGFW5vGYR.jpg",
        "overview": "Brooklyn Nine-Nine Season 7",
        "episodes": [
          {
            "seasonNumber": 7,
            "episodeNumber": 1,
            "title": "Manhunter",
            "runtime": 30,
            "overview": "Jake leads a manhunt after an assassination attempt on a city councilor. Holt adjusts to his new position as a uniformed officer.",
            "airDate": "2020-02-06"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 2,
            "title": "Captain Kim",
            "runtime": 30,
            "overview": "A new captain at the Nine-Nine attempts to ingratiate herself with Jake and the squad by inviting them over to her house for a dinner party.",
            "airDate": "2020-02-06"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 3,
            "title": "Pimemento",
            "runtime": 30,
            "overview": "Adrian Pimento shows up unexpectedly to seek Jake and Charles' help after claiming someone is trying to kill him. The rest of the squad endures a Workplace Conflict seminar.",
            "airDate": "2020-02-13"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 4,
            "title": "The Jimmy Jab Games II",
            "runtime": 30,
            "overview": "Competitive juices are flowing as Jake and the squad compete in the second Jimmy Jab Games.",
            "airDate": "2020-02-20"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 5,
            "title": "Debbie",
            "runtime": 30,
            "overview": "When cocaine and weapons are stolen from the evidence lock-up, the squad must investigate the Nine-Nine itself.",
            "airDate": "2020-02-27"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 6,
            "title": "Trying",
            "runtime": 30,
            "overview": "Jake and Amy work an uncrackable case while Holt adjusts to a new beat. Hitchcock looks for the love of his life.",
            "airDate": "2020-03-05"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 7,
            "title": "Ding Dong",
            "runtime": 30,
            "overview": "Captain Holt deals with a personal loss. Jake must decide whether to take Terry or Charles to an exclusive event.",
            "airDate": "2020-03-12"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 8,
            "title": "The Takeback",
            "runtime": 30,
            "overview": "Doug Judy is back and this time things between him and Jake are personal. Amy and Charles try to find the perfect new vending machine for the Nine-Nine.",
            "airDate": "2020-03-19"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 9,
            "title": "Dillman",
            "runtime": 30,
            "overview": "When a prank goes disastrously awry, things at the Nine-Nine take a distinctly Agatha Christie turn.",
            "airDate": "2020-03-26"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 10,
            "title": "Admiral Peralta",
            "runtime": 30,
            "overview": "Jake and his father deal with unsettled family business. Amy and Rosa work a high-profile case. Terry wants to join the NYPD band.",
            "airDate": "2020-04-02"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 11,
            "title": "Valloweaster",
            "runtime": 30,
            "overview": "The squad competes in an effort to determine who is the greatest human/genius.",
            "airDate": "2020-04-09"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 12,
            "title": "Ransom",
            "runtime": 30,
            "overview": "Holt asks for Jake's help in a case that is exceptionally meaningful to him. Charles and Terry work together on a side business.",
            "airDate": "2020-04-16"
          },
          {
            "seasonNumber": 7,
            "episodeNumber": 13,
            "title": "Lights Out",
            "runtime": 30,
            "overview": "The entire squad is on high alert when a massive blackout hits Brooklyn.",
            "airDate": "2020-04-23"
          }
        ]
      },
      {
        "seasonNumber": 8,
        "name": "Season 8",
        "episodeCount": 10,
        "posterUrl": "https://image.tmdb.org/t/p/w500/8PmhuCEB9W3Cc5ZDJunnV1m68IZ.jpg",
        "overview": "Brooklyn Nine-Nine Season 8",
        "episodes": [
          {
            "seasonNumber": 8,
            "episodeNumber": 1,
            "title": "The Good Ones",
            "runtime": 30,
            "overview": "Amy returns from maternity leave. Jake and Rosa work a difficult case.",
            "airDate": "2021-08-12"
          },
          {
            "seasonNumber": 8,
            "episodeNumber": 2,
            "title": "The Lake House",
            "runtime": 30,
            "overview": "The squad takes up Holt on an offer for a weekend getaway.",
            "airDate": "2021-08-12"
          },
          {
            "seasonNumber": 8,
            "episodeNumber": 3,
            "title": "Blue Flu",
            "runtime": 30,
            "overview": "Capt. Holt and Amy manage an understaffed precinct. Jake and Charles investigate.",
            "airDate": "2021-08-19"
          },
          {
            "seasonNumber": 8,
            "episodeNumber": 4,
            "title": "Balancing",
            "runtime": 30,
            "overview": "Jake and Amy create a system to balance work and childcare. Rosa gets a new houseguest.",
            "airDate": "2021-08-19"
          },
          {
            "seasonNumber": 8,
            "episodeNumber": 5,
            "title": "PB & J",
            "runtime": 30,
            "overview": "Jake takes an old friend for a ride.",
            "airDate": "2021-08-26"
          },
          {
            "seasonNumber": 8,
            "episodeNumber": 6,
            "title": "The Set Up",
            "runtime": 30,
            "overview": "When the FBI takes over a high-profile case, Jake keeps digging. Amy and Rosa negotiate with O'Sullivan and the police union.",
            "airDate": "2021-08-26"
          },
          {
            "seasonNumber": 8,
            "episodeNumber": 7,
            "title": "Game of Boyles",
            "runtime": 30,
            "overview": "Terry, Jake and Charles visit the Boyle Family Farm. Amy and Rosa help out Capt. Holt.",
            "airDate": "2021-09-02"
          },
          {
            "seasonNumber": 8,
            "episodeNumber": 8,
            "title": "Renewal",
            "runtime": 30,
            "overview": "The squad comes together to work an important high-stakes case.",
            "airDate": "2021-09-02"
          },
          {
            "seasonNumber": 8,
            "episodeNumber": 9,
            "title": "The Last Day (1)",
            "runtime": 30,
            "overview": "The squad take stock of their eight years together and look toward their future.",
            "airDate": "2021-09-16"
          },
          {
            "seasonNumber": 8,
            "episodeNumber": 10,
            "title": "The Last Day (2)",
            "runtime": 30,
            "overview": "The squad take stock of their eight years together and look toward their future.",
            "airDate": "2021-09-16"
          }
        ]
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
