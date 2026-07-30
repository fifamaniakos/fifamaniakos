export { SOFIFA_PLAYERS_DATABASE as SOFIFA_PLAYERS } from './sofifaPlayersDatabase';
export type { SoFifaPlayerPreset } from './sofifaPlayersDatabase';

export interface SoFifaClubPreset {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  stadium: string;
  country: string;
  league: string;
  defaultBudget: number;
}

export const SOFIFA_CLUBS: SoFifaClubPreset[] = [
  {
    "id": "eafc-club-0",
    "name": "Real Madrid",
    "shortName": "REA",
    "logoUrl": "https://drop-assets.ea.com/images/Pk8nYrWuRt895RlhJx8jI/445d98b711f413a3a1e70c41b19b0f95/l243.png",
    "stadium": "Estadio Real Madrid",
    "country": "Francia",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-1",
    "name": "Manchester City",
    "shortName": "MAN",
    "logoUrl": "https://drop-assets.ea.com/images/4asmNLic4aQn6cjlEg1t5u/88bea3ddd6c1f620bbf813041f248685/l10.png",
    "stadium": "Estadio Manchester City",
    "country": "España",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-2",
    "name": "FC Bayern München",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/3p0dv1pGWIH6lGAKZssZKH/4f70d2c5a3c147f3e006c863e85e4993/l21.png",
    "stadium": "Estadio FC Bayern München",
    "country": "Inglaterra",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-3",
    "name": "Arsenal",
    "shortName": "ARS",
    "logoUrl": "https://drop-assets.ea.com/images/2ng99bvkwKaA228PJje39i/09d2df89a78377d3f8d3f78469cbadc9/l1.png",
    "stadium": "Estadio Arsenal",
    "country": "Noruega",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-4",
    "name": "PSG",
    "shortName": "PSG",
    "logoUrl": "https://drop-assets.ea.com/images/2QwnhmHh5K7bjkfZAF7ZCi/7c53874542fb5c606ff810a4b1f6b88b/l73.png",
    "stadium": "Estadio PSG",
    "country": "Italia",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-5",
    "name": "Liverpool",
    "shortName": "LIV",
    "logoUrl": "https://drop-assets.ea.com/images/3mmzooNXBDCKuCy6kWcGQo/2e332a30fe2a7225a88fcb1898f48bbf/l9.png",
    "stadium": "Estadio Liverpool",
    "country": "Brasil",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-6",
    "name": "Lombardia FC",
    "shortName": "LOM",
    "logoUrl": "https://drop-assets.ea.com/images/1thPMvXN97JgFvt6ASWr4c/d2ca0a691a98c344305bc0975ab70314/l131682.png",
    "stadium": "Estadio Lombardia FC",
    "country": "Argentina",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-7",
    "name": "FC Barcelona",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/5VXhqALaBzgvb2YG8iJxlq/990024f3e3ecc9e6c37eae41ebef86bd/l241.png",
    "stadium": "Estadio FC Barcelona",
    "country": "Alemania",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-8",
    "name": "Inter Miami CF",
    "shortName": "INT",
    "logoUrl": "https://drop-assets.ea.com/images/3luAerlx8cliy5XNziWvOA/b7785fb1a6915d5044b4f954d83e4915/l112893.png",
    "stadium": "Estadio Inter Miami CF",
    "country": "Argentina",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-9",
    "name": "Atlético de Madrid",
    "shortName": "ATL",
    "logoUrl": "https://drop-assets.ea.com/images/vYcueolPvaGx8blMqhPZ5/5dc3479fc8b85d475fd980c53fc2056f/l240.png",
    "stadium": "Estadio Atlético de Madrid",
    "country": "Francia",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-10",
    "name": "Leverkusen",
    "shortName": "LEV",
    "logoUrl": "https://drop-assets.ea.com/images/mGqQw1um1ucUAshcK0Eop/9c7fe656f526c98b217ff2a052377b5c/l32.png",
    "stadium": "Estadio Leverkusen",
    "country": "Alemania",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-11",
    "name": "Borussia Dortmund",
    "shortName": "BOR",
    "logoUrl": "https://drop-assets.ea.com/images/TmqxUZk2FrbFXOK1kdE89/3dce225926ac7cfd9f283ecd731fa710/l22.png",
    "stadium": "Estadio Borussia Dortmund",
    "country": "Suiza",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-12",
    "name": "Galatasaray",
    "shortName": "GAL",
    "logoUrl": "https://drop-assets.ea.com/images/6P5sN0m3ZRE23vjlT8gh5q/f7f9acf3a7be5ea12f889d93dbdfd48f/l325.png",
    "stadium": "Estadio Galatasaray",
    "country": "Nigeria",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-13",
    "name": "AS Roma",
    "shortName": "AS ",
    "logoUrl": "https://drop-assets.ea.com/images/2ruQP0TDYcCmtVFKr9qMBI/5f53795056598b1faac31300900b8671/l52.png",
    "stadium": "Estadio AS Roma",
    "country": "Argentina",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-14",
    "name": "Milano FC",
    "shortName": "MIL",
    "logoUrl": "https://drop-assets.ea.com/images/6D3s1RlLRER3UOunC4Lofv/ec87a4178160a87521b0b7c688e7638e/l131681.png",
    "stadium": "Estadio Milano FC",
    "country": "Francia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-15",
    "name": "Al Hilal",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/S6sbDN9mfGaVn2VJDekYR/c6f580c98a0d614b0b308a89a241c6ab/l605.png",
    "stadium": "Estadio Al Hilal",
    "country": "Brasil",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-16",
    "name": "Man Utd",
    "shortName": "MAN",
    "logoUrl": "https://drop-assets.ea.com/images/5xxJeUfFY6FEQZEJyJK35/990979becf88b88ecb6461dc441c2ebf/l11.png",
    "stadium": "Estadio Man Utd",
    "country": "Portugal",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-17",
    "name": "Spurs",
    "shortName": "SPU",
    "logoUrl": "https://drop-assets.ea.com/images/7kUcyCh5xGrzQlcjP2Q9NH/11aba507486f44765ee5938b1b5b097e/l18.png",
    "stadium": "Estadio Spurs",
    "country": "República de Corea",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-18",
    "name": "Aston Villa",
    "shortName": "AST",
    "logoUrl": "https://drop-assets.ea.com/images/57c0ppYsEA88xL0gxqce8K/99605df97c6a96ea3b6e8a424c217af0/l2.png",
    "stadium": "Estadio Aston Villa",
    "country": "Argentina",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-19",
    "name": "Al Nassr",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/6oPkjdKPFc4aHfFp7UGXB7/262e529bd81a51c0b5f317e61b3f5985/l112139.png",
    "stadium": "Estadio Al Nassr",
    "country": "Portugal",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-20",
    "name": "Al Ittihad",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/21L35ZnVrrvEeFouMeqs8Q/b631b443b4d37e1712ed79f2487d850c/l607.png",
    "stadium": "Estadio Al Ittihad",
    "country": "Francia",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-21",
    "name": "Juventus",
    "shortName": "JUV",
    "logoUrl": "https://drop-assets.ea.com/images/6zWQmPATtK8lpsiXbKb3mY/6b2d1dab08ef14f63271a5cd70a0db0d/l45.png",
    "stadium": "Estadio Juventus",
    "country": "Brasil",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-22",
    "name": "Athletic Club",
    "shortName": "ATH",
    "logoUrl": "https://drop-assets.ea.com/images/5lGGXYvaOCdAYlo8xWPzQb/7092243785809519c68b482ad21b2c41/l448.png",
    "stadium": "Estadio Athletic Club",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-23",
    "name": "SSC Napoli",
    "shortName": "SSC",
    "logoUrl": "https://drop-assets.ea.com/images/2FIV26KpnSXl3Nv8Ar6jk3/d8461aa150da3d433fccc34bc80c978f/l48.png",
    "stadium": "Estadio SSC Napoli",
    "country": "Georgia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-24",
    "name": "Newcastle Utd",
    "shortName": "NEW",
    "logoUrl": "https://drop-assets.ea.com/images/69fXoaX4p9zFwKaZYoNtNX/14d86649a9b5a3f7e876cc3d46357b5d/l13.png",
    "stadium": "Estadio Newcastle Utd",
    "country": "Brasil",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-25",
    "name": "Al Ahli",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/3lVk0osL7o6YMhHuK4YYD6/5e106847b59ce2a4f0bfb55988d812c3/l112387.png",
    "stadium": "Estadio Al Ahli",
    "country": "Argelia",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-26",
    "name": "Valencia CF",
    "shortName": "VAL",
    "logoUrl": "https://drop-assets.ea.com/images/3rBiULK7uv6Uim0qpaPGXG/123be59c7edf775fa3df08effc267f43/l461.png",
    "stadium": "Estadio Valencia CF",
    "country": "Georgia",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-27",
    "name": "RB Leipzig",
    "shortName": "RB ",
    "logoUrl": "https://drop-assets.ea.com/images/1EoW6b2VkhiP3S0vqikd9s/f181f899a2037360f70a9a8aba18af30/l112172.png",
    "stadium": "Estadio RB Leipzig",
    "country": "Bélgica",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-28",
    "name": "Chelsea",
    "shortName": "CHE",
    "logoUrl": "https://drop-assets.ea.com/images/6T0vfhzb3y9R6YVtmVwYcD/b99723a87536e30979c7cbdb8bba9310/l5.png",
    "stadium": "Estadio Chelsea",
    "country": "Inglaterra",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-29",
    "name": "Celta",
    "shortName": "CEL",
    "logoUrl": "https://drop-assets.ea.com/images/3t0uDwxQg2iWoXop58je1a/d5c49ec269ace3a1ad2ded5fb2e8a9ec/l450.png",
    "stadium": "Estadio Celta",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-30",
    "name": "Sporting CP",
    "shortName": "SPO",
    "logoUrl": "https://drop-assets.ea.com/images/2bL9oGApMvbYE1o0Byl8KB/c914cde8141f11124f026cb198a0eb00/l237.png",
    "stadium": "Estadio Sporting CP",
    "country": "Suecia",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-31",
    "name": "FC Porto",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/3rIoG9U8fPPfaXZiGOGtvw/37c0c0ceefe454e9c299d4cc1852671f/l236.png",
    "stadium": "Estadio FC Porto",
    "country": "Portugal",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-32",
    "name": "Real Sociedad",
    "shortName": "REA",
    "logoUrl": "https://drop-assets.ea.com/images/2ohvULVVtNoXptjhNS2dLq/08d0f2d7ecfd9e0f43ce837a4e73d139/l457.png",
    "stadium": "Estadio Real Sociedad",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-33",
    "name": "River Plate",
    "shortName": "RIV",
    "logoUrl": "https://drop-assets.ea.com/images/3a9cbBltvLpgMO1eByYVRq/bc311aba63f687dc0480c592dfeca1b4/l1876.png",
    "stadium": "Estadio River Plate",
    "country": "Argentina",
    "league": "Libertadores",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-34",
    "name": "Sassuolo",
    "shortName": "SAS",
    "logoUrl": "https://drop-assets.ea.com/images/1XH03NyWoyYHO0EH69QYG4/fe0a0c7effe48754e97248d04e352f4e/l111974.png",
    "stadium": "Estadio Sassuolo",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-35",
    "name": "Al Shabab",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/VTUgGrOQD2Ao8gd3KhDfS/d43f1f7d0af58701cce9229eb9771652/l111674.png",
    "stadium": "Estadio Al Shabab",
    "country": "Bélgica",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-36",
    "name": "SL Benfica",
    "shortName": "SL ",
    "logoUrl": "https://drop-assets.ea.com/images/2DamHkQ1ZP1CYVjFPp6ofg/3e07292021842fdadb7aaaa84e7473aa/l234.png",
    "stadium": "Estadio SL Benfica",
    "country": "Argentina",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-37",
    "name": "Fenerbahçe",
    "shortName": "FEN",
    "logoUrl": "https://drop-assets.ea.com/images/3sfoNHvqDPqhM1PsEE1sNM/b9dcc82d0e2fba3efc8e8d0ed4c216a6/l326.png",
    "stadium": "Estadio Fenerbahçe",
    "country": "Marruecos",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-38",
    "name": "Beşiktaş",
    "shortName": "BEŞ",
    "logoUrl": "https://drop-assets.ea.com/images/Sx4dfrxgLrl3y1lm5Wj8p/fe2d92ed674ea49ea5ee3ac8d9842897/l327.png",
    "stadium": "Estadio Beşiktaş",
    "country": "Portugal",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-39",
    "name": "LAFC",
    "shortName": "LAF",
    "logoUrl": "https://drop-assets.ea.com/images/7HVxXj38u4xwAYPYjnYeBm/dd7c8333fd89f025a52fa53a96406475/l112996.png",
    "stadium": "Estadio LAFC",
    "country": "Francia",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-40",
    "name": "Villarreal CF",
    "shortName": "VIL",
    "logoUrl": "https://drop-assets.ea.com/images/xvk9pCQTX74mWG8EjcgYU/f631ffd2c7ac06bd43f2547fc44463c4/l483.png",
    "stadium": "Estadio Villarreal CF",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-41",
    "name": "Everton",
    "shortName": "EVE",
    "logoUrl": "https://drop-assets.ea.com/images/6Cth6wtCt1i37ZjPMZKIm3/4c68def58bf71a34afa1870cad4d5cfe/l7.png",
    "stadium": "Estadio Everton",
    "country": "Inglaterra",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-42",
    "name": "Latium",
    "shortName": "LAT",
    "logoUrl": "https://drop-assets.ea.com/images/APtVhL3q3cFDG9pkum0Q4/cbfe542e327cc69c0890b8b5a189fad7/l115841.png",
    "stadium": "Estadio Latium",
    "country": "Italia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-43",
    "name": "West Ham Utd",
    "shortName": "WES",
    "logoUrl": "https://drop-assets.ea.com/images/60X4vXPDgGISHaqyOdUGkg/c7def9840658d49d646e4895e9e04e94/l19.png",
    "stadium": "Estadio West Ham Utd",
    "country": "Argentina",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-44",
    "name": "Ajax",
    "shortName": "AJA",
    "logoUrl": "https://drop-assets.ea.com/images/3vDHoYa0pxdah1d3lHEAMe/8d79a7bab130bda618e70b67cabb961c/l131359.png",
    "stadium": "Estadio Ajax",
    "country": "Holanda",
    "league": "Nederland Vrouwen Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-45",
    "name": "Girona FC",
    "shortName": "GIR",
    "logoUrl": "https://drop-assets.ea.com/images/40lM20ITshJSKsZtWMGQ8m/3f11cea65b14635cc29654b6ba13c0b6/l110062.png",
    "stadium": "Estadio Girona FC",
    "country": "Ucrania",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-46",
    "name": "Torino",
    "shortName": "TOR",
    "logoUrl": "https://drop-assets.ea.com/images/hSLWPIkJFJBzTMyk85qej/40d38d4675390d6677c4f17dddae5627/l54.png",
    "stadium": "Estadio Torino",
    "country": "Colombia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-47",
    "name": "Real Betis",
    "shortName": "REA",
    "logoUrl": "https://drop-assets.ea.com/images/4rODtg2WvYGHhUGfPXxilW/e047163865b561a0ced87f9f593498c1/l449.png",
    "stadium": "Estadio Real Betis",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-48",
    "name": "Al Qadsiah",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/OQhve5ubflu5c5OXWRlUV/4874b82f2bab16f04e6702812ac521a6/l112391.png",
    "stadium": "Estadio Al Qadsiah",
    "country": "Gabón",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-49",
    "name": "TSG Hoffenheim",
    "shortName": "TSG",
    "logoUrl": "https://drop-assets.ea.com/images/1ylwMQ1ia5SGcXYoIKhtdK/b24a8fed6fb30e01ea3fd15184b0046c/l10029.png",
    "stadium": "Estadio TSG Hoffenheim",
    "country": "Alemania",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-50",
    "name": "Bergamo Calcio",
    "shortName": "BER",
    "logoUrl": "https://drop-assets.ea.com/images/19gWEcyonp2fvk02MNHZOA/83b82283fc62f7010b529a53a0724eee/l115845.png",
    "stadium": "Estadio Bergamo Calcio",
    "country": "Italia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-51",
    "name": "RCD Mallorca",
    "shortName": "RCD",
    "logoUrl": "https://drop-assets.ea.com/images/3M8ak3PmmUDRXsH9mryxH9/54d5da4b609ccf51bd0564abad99cc0e/l453.png",
    "stadium": "Estadio RCD Mallorca",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-52",
    "name": "SC Freiburg",
    "shortName": "SC ",
    "logoUrl": "https://drop-assets.ea.com/images/TnclXkBIoI1MtJBmRvObq/83167db02b49b274917cec5814510b79/l25.png",
    "stadium": "Estadio SC Freiburg",
    "country": "Alemania",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-53",
    "name": "Olympique Lyon",
    "shortName": "OLY",
    "logoUrl": "https://drop-assets.ea.com/images/s2BAEtejMk8pyJDqN3uyR/9938fd597d35ed59158d5b441aa07455/l66.png",
    "stadium": "Estadio Olympique Lyon",
    "country": "Francia",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-54",
    "name": "Fulham",
    "shortName": "FUL",
    "logoUrl": "https://drop-assets.ea.com/images/1YL8ULAZyOPtffpFGZcGe8/84ec5701079276f33aa349d253fa0321/l144.png",
    "stadium": "Estadio Fulham",
    "country": "Alemania",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-55",
    "name": "RC Lens",
    "shortName": "RC ",
    "logoUrl": "https://drop-assets.ea.com/images/3HrZR8go9EdkyD4jpbWPic/0fcbfb41b4d42943916892d763af8d55/l64.png",
    "stadium": "Estadio RC Lens",
    "country": "Francia",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-56",
    "name": "FC Rosengård",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/1Md1TbXImAOZNlCJhMUClT/c62bc82d01216ca552a444bf2fdfc592/l131362.png",
    "stadium": "Estadio FC Rosengård",
    "country": "Suecia",
    "league": "Sverige Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-57",
    "name": "Al Fayha",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/3u5Hyla3Uqp1SDvPyS2X5x/78a5bea18628d97e18761d19113d5cec/l113057.png",
    "stadium": "Estadio Al Fayha",
    "country": "Inglaterra",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-58",
    "name": "Frankfurt",
    "shortName": "FRA",
    "logoUrl": "https://drop-assets.ea.com/images/3KK76lJIZtlRnPaAgbD85V/5614e02825eb0ed03b69a9d078e40db9/l1824.png",
    "stadium": "Estadio Frankfurt",
    "country": "Alemania",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-59",
    "name": "Como",
    "shortName": "COM",
    "logoUrl": "https://drop-assets.ea.com/images/3y8mulzaICjwfi7inFVld2/ec9c71566982f8df59f26e81745143ec/l1745.png",
    "stadium": "Estadio Como",
    "country": "Francia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-60",
    "name": "FC Cincinnati",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/6LPKd3WwcBZ8LDcUuykbnj/ff5428082b780a98ebcb981a8891c58e/l113149.png",
    "stadium": "Estadio FC Cincinnati",
    "country": "Argentina",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-61",
    "name": "SC Braga",
    "shortName": "SC ",
    "logoUrl": "https://drop-assets.ea.com/images/4qjtfL57Y3CxvssFaOwnJT/08cfda01d445741b93fd0f8163a4b267/l1896.png",
    "stadium": "Estadio SC Braga",
    "country": "Portugal",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-62",
    "name": "LOSC Lille",
    "shortName": "LOS",
    "logoUrl": "https://drop-assets.ea.com/images/tfbRaZiFuJ9jTer1qcf0Z/95171efd06d2494735c0e8a7c5aa9df2/l65.png",
    "stadium": "Estadio LOSC Lille",
    "country": "Canadá",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-63",
    "name": "Sin Club",
    "shortName": "SIN",
    "logoUrl": "https://drop-assets.ea.com/images/5xHpRhSwl3xEjJiepk1JH8/e665662058bca65a85e0ab1abbe7c261/l116003.png",
    "stadium": "Estadio Sin Club",
    "country": "Holanda",
    "league": "Eredivisie",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-64",
    "name": "Crystal Palace",
    "shortName": "CRY",
    "logoUrl": "https://drop-assets.ea.com/images/6j7pLWl2t3yl13bu6Y9s5K/91a346d14011a610d95ec956816b6a38/l1799.png",
    "stadium": "Estadio Crystal Palace",
    "country": "Inglaterra",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-65",
    "name": "Bolonia",
    "shortName": "BOL",
    "logoUrl": "https://drop-assets.ea.com/images/46WRpnCKdCAJlQHuRwlxXF/a7ac6606d8a808d382d4dd5c484eb60e/l189.png",
    "stadium": "Estadio Bolonia",
    "country": "Suiza",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-66",
    "name": "AS Monaco",
    "shortName": "AS ",
    "logoUrl": "https://drop-assets.ea.com/images/6XicH1VsjyR3WbTdpk99p3/8b11b6c53072e6c9c042eb77f3c6a8f4/l69.png",
    "stadium": "Estadio AS Monaco",
    "country": "Rusia",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-67",
    "name": "Brighton",
    "shortName": "BRI",
    "logoUrl": "https://drop-assets.ea.com/images/1mFLMjuFkxQjbRaTLKZ8Gm/277b9eb6d29d37064d1d82063b06f681/l1808.png",
    "stadium": "Estadio Brighton",
    "country": "Turquía",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-68",
    "name": "Rayo Vallecano",
    "shortName": "RAY",
    "logoUrl": "https://drop-assets.ea.com/images/3SSzCmmavBBvrdJVySdnrm/f51360f07320e2dba9520037d3789543/l480.png",
    "stadium": "Estadio Rayo Vallecano",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-69",
    "name": "Southampton",
    "shortName": "SOU",
    "logoUrl": "https://drop-assets.ea.com/images/3OnFJRNzgcEJCYie4l5hMX/6b5cac084db188e258168b4fc3b4a72d/l17.png",
    "stadium": "Estadio Southampton",
    "country": "Inglaterra",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-70",
    "name": "Trabzonspor",
    "shortName": "TRA",
    "logoUrl": "https://drop-assets.ea.com/images/3AF1UCNvLwZs5kapbWuCk9/e1cebee09f0953e5653311d5a29365ee/l436.png",
    "stadium": "Estadio Trabzonspor",
    "country": "Montenegro",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-71",
    "name": "Getafe CF",
    "shortName": "GET",
    "logoUrl": "https://drop-assets.ea.com/images/44YMNWepTyO6Bq40e9JFvy/a282461a849f13c104c8163cd2253e2a/l1860.png",
    "stadium": "Estadio Getafe CF",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-72",
    "name": "VfB Stuttgart",
    "shortName": "VFB",
    "logoUrl": "https://drop-assets.ea.com/images/5kfh9LrPvDQKbQNF6k7CSF/9a70e7082aaba3b46ea8bd1e699f62de/l36.png",
    "stadium": "Estadio VfB Stuttgart",
    "country": "Alemania",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-73",
    "name": "UD Las Palmas",
    "shortName": "UD ",
    "logoUrl": "https://drop-assets.ea.com/images/3LhdSKEsOYaica4AL0iOd1/f5d6f6e6251707012eb2bf9e7966235c/l472.png",
    "stadium": "Estadio UD Las Palmas",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-74",
    "name": "Royal Amberes FC",
    "shortName": "ROY",
    "logoUrl": "https://drop-assets.ea.com/images/1wT4b98gccpzVFHeTx5Uqk/c32f89ede86de13b615f5ab7f9984964/l230.png",
    "stadium": "Estadio Royal Amberes FC",
    "country": "Bélgica",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-75",
    "name": "VfL Wolfsburg",
    "shortName": "VFL",
    "logoUrl": "https://drop-assets.ea.com/images/4mw5u30yjPmzh9OVqKB0YV/ad59c24a84c9afb0a877046fadeb9c9e/l175.png",
    "stadium": "Estadio VfL Wolfsburg",
    "country": "Alemania",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-76",
    "name": "OGC Niza",
    "shortName": "OGC",
    "logoUrl": "https://drop-assets.ea.com/images/zByYanPvcCULBfC8OITvN/a262863aa77bfb1551a403f5f9b49f28/l72.png",
    "stadium": "Estadio OGC Niza",
    "country": "Francia",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-77",
    "name": "AFC Bournemouth",
    "shortName": "AFC",
    "logoUrl": "https://drop-assets.ea.com/images/5Z6J6MhqjuJVwE7SVnfr5E/6075ff3239d67bdf8258a067ed93ccdb/l1943.png",
    "stadium": "Estadio AFC Bournemouth",
    "country": "Brasil",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-78",
    "name": "Lecce",
    "shortName": "LEC",
    "logoUrl": "https://drop-assets.ea.com/images/24tjxIlBXF6g0puyjqRqqx/04aa5e48c5938944bee35b1893c0d0fa/l347.png",
    "stadium": "Estadio Lecce",
    "country": "Italia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-79",
    "name": "Sevilla FC",
    "shortName": "SEV",
    "logoUrl": "https://drop-assets.ea.com/images/1xocxSBJ3RrgP3Jponcw9H/b5b340790217ad2685083e1765b24273/l481.png",
    "stadium": "Estadio Sevilla FC",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-80",
    "name": "Al Ettifaq",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/4iiu5yKgXLP6VztXNaebb1/19909c746281492a1191662354871832/l112096.png",
    "stadium": "Estadio Al Ettifaq",
    "country": "Costa de Marfil",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-81",
    "name": "Fiorentina",
    "shortName": "FIO",
    "logoUrl": "https://drop-assets.ea.com/images/j2Zuc19dll43zq88V7CgZ/d2e748909a451985aed5a26b122a4d8f/l110374.png",
    "stadium": "Estadio Fiorentina",
    "country": "Islandia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-82",
    "name": "O. Marsella",
    "shortName": "O. ",
    "logoUrl": "https://drop-assets.ea.com/images/3t06Qm41tT2gB8NqJYXdue/928373951a71a9a8565497e6481925d1/l219.png",
    "stadium": "Estadio O. Marsella",
    "country": "Dinamarca",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-83",
    "name": "Brentford",
    "shortName": "BRE",
    "logoUrl": "https://drop-assets.ea.com/images/3UCvZhjBB0odWNL0OPusuK/1de0f5b97a2e137201670df2cf09e1a5/l1925.png",
    "stadium": "Estadio Brentford",
    "country": "Camerún",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-84",
    "name": "Hajduk Split",
    "shortName": "HAJ",
    "logoUrl": "https://drop-assets.ea.com/images/1bDWS6ltUYonMzwG7kzCXP/d426bbccb973c5e62dcd62397cd4211e/l263.png",
    "stadium": "Estadio Hajduk Split",
    "country": "Croacia",
    "league": "Liga Hrvatska",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-85",
    "name": "Montpellier",
    "shortName": "MON",
    "logoUrl": "https://drop-assets.ea.com/images/2s81zEAC1P8205XDHZ2rKf/eec584c08f6be8db257d7012c1b6cfb0/l70.png",
    "stadium": "Estadio Montpellier",
    "country": "Francia",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-86",
    "name": "Celtic",
    "shortName": "CEL",
    "logoUrl": "https://drop-assets.ea.com/images/16GwjVn0vBxAdBx5F4uW0q/6a96b7c86f98010e0b9cd943dc48d4ca/l78.png",
    "stadium": "Estadio Celtic",
    "country": "Dinamarca",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-87",
    "name": "Club Brujas",
    "shortName": "CLU",
    "logoUrl": "https://drop-assets.ea.com/images/7nHwlhyC2uPcLbb3LoBS82/08409177bc75126cfd7a9005fe3faa00/l231.png",
    "stadium": "Estadio Club Brujas",
    "country": "Bélgica",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-88",
    "name": "Al Fateh",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/6v7yU4RrTQPgruLFIKjFOR/9757e8a4070b872b3be68038edfccf95/l112390.png",
    "stadium": "Estadio Al Fateh",
    "country": "Armenia",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-89",
    "name": "Wolves",
    "shortName": "WOL",
    "logoUrl": "https://drop-assets.ea.com/images/3DIKyPF6XcAgIrI3Wv0UBo/4b26ac5525105f84de13860ebe177633/l110.png",
    "stadium": "Estadio Wolves",
    "country": "Argelia",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-90",
    "name": "Newell's",
    "shortName": "NEW",
    "logoUrl": "https://drop-assets.ea.com/images/4myHS85tfHbXceOM9VjH8v/042425c3bd14407977ea4c0039327c56/l110396.png",
    "stadium": "Estadio Newell's",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-91",
    "name": "Stade Brestois",
    "shortName": "STA",
    "logoUrl": "https://drop-assets.ea.com/images/4XvdCr8oJZa7xEMRoncHFd/f5f7c79ba216eb1429e5366b79269861/l378.png",
    "stadium": "Estadio Stade Brestois",
    "country": "Holanda",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-92",
    "name": "CA Osasuna",
    "shortName": "CA ",
    "logoUrl": "https://drop-assets.ea.com/images/5T0gPuxPGVG3BLEP9wYxLx/8be8ef52e215bc47956d1084f702409d/l479.png",
    "stadium": "Estadio CA Osasuna",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-93",
    "name": "Red Bulls",
    "shortName": "RED",
    "logoUrl": "https://drop-assets.ea.com/images/5f7uIjuRx6ua3nQqfm7qZr/8e8274e586ad7e6e0df6dd7e3f085e72/l689.png",
    "stadium": "Estadio Red Bulls",
    "country": "Suecia",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-94",
    "name": "Notting. Forest",
    "shortName": "NOT",
    "logoUrl": "https://drop-assets.ea.com/images/60CgBQCMt7Dtcjip9xUxg8/5fa49387c380bf4772138b215ef4fd85/l14.png",
    "stadium": "Estadio Notting. Forest",
    "country": "Inglaterra",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-95",
    "name": "New England",
    "shortName": "NEW",
    "logoUrl": "https://drop-assets.ea.com/images/48ngeALXrPB00VU1uedurz/7841d93996c63753d1244626bbc2a3aa/l691.png",
    "stadium": "Estadio New England",
    "country": "España",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-96",
    "name": "CD Leganés",
    "shortName": "CD ",
    "logoUrl": "https://drop-assets.ea.com/images/5wIhu0tRIl6Dpm16gEyS9g/baab87e4a6e3affba1225057be183b2e/l100888.png",
    "stadium": "Estadio CD Leganés",
    "country": "Costa de Marfil",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-97",
    "name": "M'gladbach",
    "shortName": "M'G",
    "logoUrl": "https://drop-assets.ea.com/images/4eJmGBw11G3Rn334GUOKaV/7571515e89d9e3b02893855bbdb28dbb/l23.png",
    "stadium": "Estadio M'gladbach",
    "country": "Francia",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-98",
    "name": "AEK Athens",
    "shortName": "AEK",
    "logoUrl": "https://drop-assets.ea.com/images/4qTLnCKd5EuaAqSHT6TqiQ/e696de56fdde60bfd4d62ec6b59682ee/l278.png",
    "stadium": "Estadio AEK Athens",
    "country": "Argentina",
    "league": "Hellas Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-99",
    "name": "Nashville SC",
    "shortName": "NAS",
    "logoUrl": "https://drop-assets.ea.com/images/4FvmPxTXK6or9m3GMc0HxL/1e3e8d34f2cc18c60f7564781ff93279/l114162.png",
    "stadium": "Estadio Nashville SC",
    "country": "Alemania",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-100",
    "name": "Monza",
    "shortName": "MON",
    "logoUrl": "https://drop-assets.ea.com/images/6YrkZJWBBNtoW2AmE6rtnS/2d8db35e1d08805b35c6a770741f9044/l111811.png",
    "stadium": "Estadio Monza",
    "country": "Italia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-101",
    "name": "Strasbourg",
    "shortName": "STR",
    "logoUrl": "https://drop-assets.ea.com/images/5ujpJkozlZbo3FNV0Fi84H/d39ffa173bd150d5f10bcfe3392abe54/l76.png",
    "stadium": "Estadio Strasbourg",
    "country": "Serbia",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-102",
    "name": "Al Ain FC",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/7N0bj9ejtui6dQADUbJ4qT/60355b19aff7a02c72d8494e24de49f9/l111701.png",
    "stadium": "Estadio Al Ain FC",
    "country": "Marruecos",
    "league": "United Emirates League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-103",
    "name": "Union Berlin",
    "shortName": "UNI",
    "logoUrl": "https://drop-assets.ea.com/images/32dPG6jDXuIAOhWKeTYmeG/8d2df657c666abfbf84baaa732140a2a/l1831.png",
    "stadium": "Estadio Union Berlin",
    "country": "Dinamarca",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-104",
    "name": "Slavia Praha",
    "shortName": "SLA",
    "logoUrl": "https://drop-assets.ea.com/images/1NkqmM5XlW1qFxF0FuhWAe/af305c7102a2aff1890a38dd5db90b66/l131360.png",
    "stadium": "Estadio Slavia Praha",
    "country": "República Checa",
    "league": "Ceska Liga Žen",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-105",
    "name": "1. FSV Mainz 05",
    "shortName": "1. ",
    "logoUrl": "https://drop-assets.ea.com/images/4QO9B5tBI7mcWhzDDO3b6N/f70a1fd45fb4a6dd80ceea61a3e91c4d/l169.png",
    "stadium": "Estadio 1. FSV Mainz 05",
    "country": "Alemania",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-106",
    "name": "Real Salt Lake",
    "shortName": "REA",
    "logoUrl": "https://drop-assets.ea.com/images/3eUFG3nUjsAlEkWJfLf0L2/50dda64859401b5180ff6b5352a98b5c/l111065.png",
    "stadium": "Estadio Real Salt Lake",
    "country": "Colombia",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-107",
    "name": "Kasımpaşa",
    "shortName": "KAS",
    "logoUrl": "https://drop-assets.ea.com/images/2CgrBm9OJoVzlBGvDZ4zyr/6b0558f4e736946b662322ffa998f76a/l111339.png",
    "stadium": "Estadio Kasımpaşa",
    "country": "República Checa",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-108",
    "name": "Leicester City",
    "shortName": "LEI",
    "logoUrl": "https://drop-assets.ea.com/images/4BhVwLyplKIUlwmC0mmsPM/885243174655c4aac2f8fc094ffcc619/l95.png",
    "stadium": "Estadio Leicester City",
    "country": "Portugal",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-109",
    "name": "Sparta Praha",
    "shortName": "SPA",
    "logoUrl": "https://drop-assets.ea.com/images/WsjKkMgEXh4mceoAQzFIi/d0b9c0ac886f0f3f3f91ca6ebda21577/l267.png",
    "stadium": "Estadio Sparta Praha",
    "country": "Serbia",
    "league": "Česká Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-110",
    "name": "St. Louis CITY SC",
    "shortName": "ST.",
    "logoUrl": "https://drop-assets.ea.com/images/eIrGY3kgFRZliYnLEgqiu/7863060a763b907f45e623c8e22c85b4/l113018.png",
    "stadium": "Estadio St. Louis CITY SC",
    "country": "Suiza",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-111",
    "name": "Ferencvárosi TC",
    "shortName": "FER",
    "logoUrl": "https://drop-assets.ea.com/images/7iVvbVFFpSoNI3csHutnMv/2d26c636be8aaaffe2a945ab1f2bfb3c/l1874.png",
    "stadium": "Estadio Ferencvárosi TC",
    "country": "Hungría",
    "league": "Magyar Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-112",
    "name": "Shanghai Port FC",
    "shortName": "SHA",
    "logoUrl": "https://drop-assets.ea.com/images/34ZzFx1drA41OC6XP622rj/1813ad3ebc95ffaa95e37b8c05a8ae6d/l112540.png",
    "stadium": "Estadio Shanghai Port FC",
    "country": "Brasil",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-113",
    "name": "Olympiacos FC",
    "shortName": "OLY",
    "logoUrl": "https://drop-assets.ea.com/images/2hyiQlv23Ipa7IOEtN7qAv/39a4514bd5a02d0d6db09d8eb2564c8f/l280.png",
    "stadium": "Estadio Olympiacos FC",
    "country": "Marruecos",
    "league": "Hellas Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-114",
    "name": "Al Taawoun",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/7p6TA5ewyxs1qzy8ym2ydy/15c716ca66c2ffcbed401be345ff6f8e/l112393.png",
    "stadium": "Estadio Al Taawoun",
    "country": "Holanda",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-115",
    "name": "Whitecaps FC",
    "shortName": "WHI",
    "logoUrl": "https://drop-assets.ea.com/images/4B78Zk7BiGtY0lEDTDanGT/ba8604b69a6cab6fd0c668aefebc800c/l101112.png",
    "stadium": "Estadio Whitecaps FC",
    "country": "Escocia",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-116",
    "name": "Stade Rennais FC",
    "shortName": "STA",
    "logoUrl": "https://drop-assets.ea.com/images/7CHlTnryGZyOatI2WOFXiP/def56f5b08c456e671d09d3a47cc327b/l74.png",
    "stadium": "Estadio Stade Rennais FC",
    "country": "Argelia",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-117",
    "name": "Columbus Crew",
    "shortName": "COL",
    "logoUrl": "https://drop-assets.ea.com/images/3LJ9c5c9nJUBzMikYz1R6i/31afe3203efd8ab80b825008b28c9d54/l687.png",
    "stadium": "Estadio Columbus Crew",
    "country": "Colombia",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-118",
    "name": "Houston Dynamo",
    "shortName": "HOU",
    "logoUrl": "https://drop-assets.ea.com/images/4OxchMB3Rc8AR48fXlJuek/f0802b4ebe4cef4b413ccf382d950b7d/l698.png",
    "stadium": "Estadio Houston Dynamo",
    "country": "México",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-119",
    "name": "Toronto FC",
    "shortName": "TOR",
    "logoUrl": "https://drop-assets.ea.com/images/30i1VjDrANfk70TiMD5FAP/bcad393870bfc3b08eeda1507c8ca63f/l111651.png",
    "stadium": "Estadio Toronto FC",
    "country": "Italia",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-120",
    "name": "Stade de Reims",
    "shortName": "STA",
    "logoUrl": "https://drop-assets.ea.com/images/5oKEEJDtJHf5nAnu6Y6Tjg/0e9208b1d19e95d71b98da63fc039549/l379.png",
    "stadium": "Estadio Stade de Reims",
    "country": "Japón",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-121",
    "name": "D. Alavés",
    "shortName": "D. ",
    "logoUrl": "https://drop-assets.ea.com/images/5VGQ2vTkXWSoS9l8HL69Yi/2bc91cc1635bacb9cd0418a4f94400fa/l463.png",
    "stadium": "Estadio D. Alavés",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-122",
    "name": "Panathinaikos",
    "shortName": "PAN",
    "logoUrl": "https://drop-assets.ea.com/images/zBYvcvWRAiK0eUY0XmU05/eebc4858ed03bb676b80ce8b9cef6919/l1884.png",
    "stadium": "Estadio Panathinaikos",
    "country": "Serbia",
    "league": "Hellas Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-123",
    "name": "Orlando City",
    "shortName": "ORL",
    "logoUrl": "https://drop-assets.ea.com/images/2v0SzLTlk8reZAYV0kDrAH/39d28af286ec356ed9f70e279cf3ac22/l112606.png",
    "stadium": "Estadio Orlando City",
    "country": "Colombia",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-124",
    "name": "LA Galaxy",
    "shortName": "LA ",
    "logoUrl": "https://drop-assets.ea.com/images/eGVllmGrNtxd7wDWFgngP/a1d4ff6c7bbfaaefe0b5ab8c641af314/l697.png",
    "stadium": "Estadio LA Galaxy",
    "country": "España",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-125",
    "name": "Toulouse FC",
    "shortName": "TOU",
    "logoUrl": "https://drop-assets.ea.com/images/5EcfjMCX8afaXxC2kefK7V/41323bd3f20c2b1932bf3e939ddde465/l1809.png",
    "stadium": "Estadio Toulouse FC",
    "country": "Francia",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-126",
    "name": "Boca Juniors",
    "shortName": "BOC",
    "logoUrl": "https://drop-assets.ea.com/images/4v42cau4ZlAgfPnWHaQSKn/a9fa2af475b4b779ed13870c7f1ec66b/l1877.png",
    "stadium": "Estadio Boca Juniors",
    "country": "Argentina",
    "league": "Sudamericana",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-127",
    "name": "Dynamo Kyiv",
    "shortName": "DYN",
    "logoUrl": "https://drop-assets.ea.com/images/Vn6kgtvJTVHRxr7VKv1uQ/524fcf57ad88faa97991b86fbb4ecbea/l101047.png",
    "stadium": "Estadio Dynamo Kyiv",
    "country": "Ucrania",
    "league": "Ukrayina Liha",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-128",
    "name": "Rangers",
    "shortName": "RAN",
    "logoUrl": "https://drop-assets.ea.com/images/5lOjqHjEdrBuaj323x9jDf/b5504a0894594d6c3dfa97cca700e572/l86.png",
    "stadium": "Estadio Rangers",
    "country": "Inglaterra",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-129",
    "name": "RSC Anderlecht",
    "shortName": "RSC",
    "logoUrl": "https://drop-assets.ea.com/images/6fPz45ZIDQWOd7Lqv0GuZF/045eacfd4e3fade98ceca05cb12b6c60/l229.png",
    "stadium": "Estadio RSC Anderlecht",
    "country": "Bélgica",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-130",
    "name": "PAOK FC",
    "shortName": "PAO",
    "logoUrl": "https://drop-assets.ea.com/images/5goZMQS107pyc49zxrozAC/509a07a4d44e6315d1e5f6d556485f05/l393.png",
    "stadium": "Estadio PAOK FC",
    "country": "Serbia",
    "league": "Hellas Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-131",
    "name": "Al Orobah",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/3W0QE8rOlhAVP4wxrGBuve/10c8fa77248cba5d20488c868e6dc476/Al_Orobah.png",
    "stadium": "Estadio Al Orobah",
    "country": "Francia",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-132",
    "name": "UD Almería",
    "shortName": "UD ",
    "logoUrl": "https://drop-assets.ea.com/images/FAmWMe0vGqbNyM0eXSrcJ/8d8775ecaa93c19c612645ca81adcfd9/l1861.png",
    "stadium": "Estadio UD Almería",
    "country": "Portugal",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-133",
    "name": "RB Salzburgo",
    "shortName": "RB ",
    "logoUrl": "https://drop-assets.ea.com/images/nNiid5nKwX6NdLfbcgqgg/aa868fc5e73791dede875c372c6ef14f/l191.png",
    "stadium": "Estadio RB Salzburgo",
    "country": "Alemania",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-134",
    "name": "Portland Timbers",
    "shortName": "POR",
    "logoUrl": "https://drop-assets.ea.com/images/7C9kkwlzZqMYICvgPuO01Q/92c49765f38b6263c9bbb8130d33c837/l111140.png",
    "stadium": "Estadio Portland Timbers",
    "country": "Brasil",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-135",
    "name": "Luton Town",
    "shortName": "LUT",
    "logoUrl": "https://drop-assets.ea.com/images/21V5hD2vkZp4kRSXkklZPQ/b83a1de86c7ad733aad76e20756c9ab5/l1923.png",
    "stadium": "Estadio Luton Town",
    "country": "Inglaterra",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-136",
    "name": "Austin FC",
    "shortName": "AUS",
    "logoUrl": "https://drop-assets.ea.com/images/5iMrok4c9RiWrTJSYAOaku/5abef45ebc1d3e6e1c0c9885e402acf1/l114161.png",
    "stadium": "Estadio Austin FC",
    "country": "Argentina",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-137",
    "name": "SV Werder Bremen",
    "shortName": "SV ",
    "logoUrl": "https://drop-assets.ea.com/images/5UE88g3Vfeo6kFu8lh1s26/cfc99dce8f7c7dc22a8a39920383cf3d/l38.png",
    "stadium": "Estadio SV Werder Bremen",
    "country": "Alemania",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-138",
    "name": "Al Kholood",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/6Dgz7XfpO4LC26QsupWomA/62820f025654566a7c92ffac3b3b39dc/l131735.png",
    "stadium": "Estadio Al Kholood",
    "country": "Brasil",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-139",
    "name": "KRC Genk",
    "shortName": "KRC",
    "logoUrl": "https://drop-assets.ea.com/images/2064Z9wPzJbjkzW3n9b4RQ/ef883d28dde3104b3bea959320b4597a/l673.png",
    "stadium": "Estadio KRC Genk",
    "country": "Bélgica",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-140",
    "name": "FC Dallas",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/2CowojBwwfe8I0tl2xDyEg/251f5781f470875f502bb8e708e1d5e5/l695.png",
    "stadium": "Estadio FC Dallas",
    "country": "España",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-141",
    "name": "Cagliari",
    "shortName": "CAG",
    "logoUrl": "https://drop-assets.ea.com/images/5sjhiBbFzi7mnkVrR5zk76/7ecf5510b695d3053df0fa1f94cd4cea/l1842.png",
    "stadium": "Estadio Cagliari",
    "country": "Italia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-142",
    "name": "R. Valladolid CF",
    "shortName": "R. ",
    "logoUrl": "https://drop-assets.ea.com/images/3ebJia31wVgnP0HJGFLvJq/71de68e158a7dff7b4c29268fc0e278f/l462.png",
    "stadium": "Estadio R. Valladolid CF",
    "country": "Venezuela",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-143",
    "name": "Genoa",
    "shortName": "GEN",
    "logoUrl": "https://drop-assets.ea.com/images/K5vcQ5KjT64Rr1dZZu3RG/0955cabcb0645ef5649ed69904e4b502/l110556.png",
    "stadium": "Estadio Genoa",
    "country": "Ucrania",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-144",
    "name": "Hellas Verona",
    "shortName": "HEL",
    "logoUrl": "https://drop-assets.ea.com/images/5sDHfKyYzQUx61yjdwHNAs/f27b36d6fa211871a9936b452406ccc6/l206.png",
    "stadium": "Estadio Hellas Verona",
    "country": "Italia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-145",
    "name": "Lanús",
    "shortName": "LAN",
    "logoUrl": "https://drop-assets.ea.com/images/3YdIDtCdoAVx6qHfneuLay/c0dc2285e2422882233c8137a4f40606/l110395.png",
    "stadium": "Estadio Lanús",
    "country": "Argentina",
    "league": "Sudamericana",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-146",
    "name": "FC Lorient",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/2OREXtP0UjOBQ3BJc30m0J/34b2b866809a7b77368f22c29d98b7ae/l217.png",
    "stadium": "Estadio FC Lorient",
    "country": "Suiza",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-147",
    "name": "Damac",
    "shortName": "DAM",
    "logoUrl": "https://drop-assets.ea.com/images/6gKKqYXDgBKORqOOE36eYd/1bfb60aa1fa300a0174140a89e1f3d7b/l113217.png",
    "stadium": "Estadio Damac",
    "country": "Camerún",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-148",
    "name": "Dinamo Zagreb",
    "shortName": "DIN",
    "logoUrl": "https://drop-assets.ea.com/images/2xEcSelhmWxCdUWZosWED0/a0ddc6b9cc62ea75de64dc65762a827d/l211.png",
    "stadium": "Estadio Dinamo Zagreb",
    "country": "Croacia",
    "league": "Liga Hrvatska",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-149",
    "name": "Ipswich Town",
    "shortName": "IPS",
    "logoUrl": "https://drop-assets.ea.com/images/7fIdsybp17hzndBNSrJIR/b7e1786480ee521c6dca3d3ec45e8d48/l94.png",
    "stadium": "Estadio Ipswich Town",
    "country": "Inglaterra",
    "league": "Premier League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-150",
    "name": "RCD Espanyol",
    "shortName": "RCD",
    "logoUrl": "https://drop-assets.ea.com/images/5NYvCpO1y0HynMKlJEcgRy/87d88f05181ecc55ecb3c86a6ce505d0/l452.png",
    "stadium": "Estadio RCD Espanyol",
    "country": "España",
    "league": "LALIGA EA SPORTS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-151",
    "name": "Racing Club",
    "shortName": "RAC",
    "logoUrl": "https://drop-assets.ea.com/images/A8RKWVxKQsKjBbty5kzt6/a21fa30821daf7c6a65546e58558c496/l101085.png",
    "stadium": "Estadio Racing Club",
    "country": "Colombia",
    "league": "Sudamericana",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-152",
    "name": "1. FC Köln",
    "shortName": "1. ",
    "logoUrl": "https://drop-assets.ea.com/images/1YRZmYboKO3TLN8LdJdFjk/6015406736cb01c604c6e911040ed238/l31.png",
    "stadium": "Estadio 1. FC Köln",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-153",
    "name": "Shakhtar Donetsk",
    "shortName": "SHA",
    "logoUrl": "https://drop-assets.ea.com/images/2boV5vckSWy81CHbJ0bNdO/bc02139a7497860e5af88f7a13c32523/l101059.png",
    "stadium": "Estadio Shakhtar Donetsk",
    "country": "Ucrania",
    "league": "Ukrayina Liha",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-154",
    "name": "Leeds Utd",
    "shortName": "LEE",
    "logoUrl": "https://drop-assets.ea.com/images/4GwGagnihmCNc321tRi8qB/07ddd8a7768922d58f01c2b6f2964a18/l8.png",
    "stadium": "Estadio Leeds Utd",
    "country": "Austria",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-155",
    "name": "Sunderland",
    "shortName": "SUN",
    "logoUrl": "https://drop-assets.ea.com/images/6ja62Iw2LyY8cVrud4aSHi/aa6c15e4a2ceed66f92099108bea9dfa/l106.png",
    "stadium": "Estadio Sunderland",
    "country": "Ghana",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-156",
    "name": "Estudiantes",
    "shortName": "EST",
    "logoUrl": "https://drop-assets.ea.com/images/4YAQMFITOGB7FMvl3pAP52/0b2344540d9573f06dea8d5ed3af4bff/l101083.png",
    "stadium": "Estadio Estudiantes",
    "country": "Argentina",
    "league": "Libertadores",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-157",
    "name": "Parma",
    "shortName": "PAR",
    "logoUrl": "https://drop-assets.ea.com/images/5yViIzJxGDnBEeuNhjjHJc/adbfeb6c414f290e1aa51813f26cd829/l50.png",
    "stadium": "Estadio Parma",
    "country": "Brasil",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-158",
    "name": "FK Bodø/Glimt",
    "shortName": "FK ",
    "logoUrl": "https://drop-assets.ea.com/images/6tn2m1mm20cckFsvUL8AEG/a2cc4cd5cb3203af9b077dc705109903/l918.png",
    "stadium": "Estadio FK Bodø/Glimt",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-159",
    "name": "Burnley",
    "shortName": "BUR",
    "logoUrl": "https://drop-assets.ea.com/images/6CqBvyQgjJzPA5vU64paT8/03d21bd0df65afa73b752f66ca5c1714/l1796.png",
    "stadium": "Estadio Burnley",
    "country": "Alemania",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-160",
    "name": "Granada CF",
    "shortName": "GRA",
    "logoUrl": "https://drop-assets.ea.com/images/n379Zs757PZRjAHkeaOAw/63c30cacf664c291250442251848dcd9/l110832.png",
    "stadium": "Estadio Granada CF",
    "country": "Argentina",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-161",
    "name": "San Lorenzo",
    "shortName": "SAN",
    "logoUrl": "https://drop-assets.ea.com/images/3KG1XvmWFfY1Xp5QJk34KJ/f9dc8f3b7f55053c525a4a44a0c4eb52/l1013.png",
    "stadium": "Estadio San Lorenzo",
    "country": "Argentina",
    "league": "Libertadores",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-162",
    "name": "R. Union St.-G.",
    "shortName": "R. ",
    "logoUrl": "https://drop-assets.ea.com/images/6qEBd0g4qIBH3X6KtaTayV/e7405958edc583e79f63c0e71e560c77/l2014.png",
    "stadium": "Estadio R. Union St.-G.",
    "country": "Inglaterra",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-163",
    "name": "Rosario Central",
    "shortName": "ROS",
    "logoUrl": "https://drop-assets.ea.com/images/4A7PCwuGJb5YWjRaD4BuXm/f4161b7e626811f4379ebbc4d28abd15/l110580.png",
    "stadium": "Estadio Rosario Central",
    "country": "Colombia",
    "league": "Libertadores",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-164",
    "name": "Nantes",
    "shortName": "NAN",
    "logoUrl": "https://drop-assets.ea.com/images/3xZ7onNB3vSemaIEmalF3k/d87612f125c8d293ebcc202f04e3ec11/l71.png",
    "stadium": "Estadio Nantes",
    "country": "España",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-165",
    "name": "Chicago Fire FC",
    "shortName": "CHI",
    "logoUrl": "https://drop-assets.ea.com/images/7k2qagGU1kOmxOQfXiNYMm/dd188abb2e3ac2d56015ca1ad0115d0c/l693.png",
    "stadium": "Estadio Chicago Fire FC",
    "country": "Bélgica",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-166",
    "name": "Başakşehir",
    "shortName": "BAŞ",
    "logoUrl": "https://drop-assets.ea.com/images/zVaLMDwzieKwlZFk2bZ6K/58d008680451b4cf46041e38987cf69b/l101014.png",
    "stadium": "Estadio Başakşehir",
    "country": "Brasil",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-167",
    "name": "Empoli",
    "shortName": "EMP",
    "logoUrl": "https://drop-assets.ea.com/images/a595CAAnVxyNY6xTQq11E/8991a044339808a889c92bb73ec453bd/l1746.png",
    "stadium": "Estadio Empoli",
    "country": "Italia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-168",
    "name": "F.C. København",
    "shortName": "F.C",
    "logoUrl": "https://drop-assets.ea.com/images/6r6we9mj39z5Irzr0aRxQU/4066cee956fb6aca5b2021644a14f82f/l819.png",
    "stadium": "Estadio F.C. København",
    "country": "Dinamarca",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-169",
    "name": "Círculo Brujas",
    "shortName": "CÍR",
    "logoUrl": "https://drop-assets.ea.com/images/3B7cR0sHmUUw9m7fliqe2U/50001b0d0a513f9f098cbbcc10638d39/l1750.png",
    "stadium": "Estadio Círculo Brujas",
    "country": "Togo",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-170",
    "name": "Cádiz CF",
    "shortName": "CÁD",
    "logoUrl": "https://drop-assets.ea.com/images/6oKeJaihji0OrrH29bFEKK/b9c52432e822f087fa9ce2d2924553ee/l1968.png",
    "stadium": "Estadio Cádiz CF",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-171",
    "name": "FC Augsburg",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/1LMXVBp9QlIruHH6OejXOw/97f61074046861f13beaf6216a07edb5/l100409.png",
    "stadium": "Estadio FC Augsburg",
    "country": "Holanda",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-172",
    "name": "Hannover 96",
    "shortName": "HAN",
    "logoUrl": "https://drop-assets.ea.com/images/1TJxIrTqB2N7LSZZiKYoVl/f16269b889ec4647e87d35369a9adf97/l485.png",
    "stadium": "Estadio Hannover 96",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-173",
    "name": "Sheffield Utd",
    "shortName": "SHE",
    "logoUrl": "https://drop-assets.ea.com/images/3QhayzKjMV2yOdihydTnVZ/c272cce245fae380f220f4c9cca689f1/l1794.png",
    "stadium": "Estadio Sheffield Utd",
    "country": "Holanda",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-174",
    "name": "Konyaspor",
    "shortName": "KON",
    "logoUrl": "https://drop-assets.ea.com/images/3KZwnvj4tCl6duVX44EC9G/0caeba3d1925d8649cbb4fc56345abd7/l101033.png",
    "stadium": "Estadio Konyaspor",
    "country": "Brasil",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-175",
    "name": "Talleres",
    "shortName": "TAL",
    "logoUrl": "https://drop-assets.ea.com/images/1R2LqksefAtfdbvZTyQGWH/bc50746e52d4eafae765204e5a4e1dcd/l112670.png",
    "stadium": "Estadio Talleres",
    "country": "Argentina",
    "league": "Libertadores",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-176",
    "name": "París FC",
    "shortName": "PAR",
    "logoUrl": "https://drop-assets.ea.com/images/3q4gMefpvBrGdVOPMxk1dD/d310abcaf71d2a45ee4362b169469a93/l111817.png",
    "stadium": "Estadio París FC",
    "country": "Francia",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-177",
    "name": "Vitória SC",
    "shortName": "VIT",
    "logoUrl": "https://drop-assets.ea.com/images/3gj0rsCEv47Uirop4H5fae/d80e273e8f42b5bb1c49cb2fa2e4bb21/l1887.png",
    "stadium": "Estadio Vitória SC",
    "country": "Portugal",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-178",
    "name": "Heidenheim",
    "shortName": "HEI",
    "logoUrl": "https://drop-assets.ea.com/images/6dl6SeJkgA1H6G1sodfRJj/043b959d86a91b252159ff32eb46a14a/l111235.png",
    "stadium": "Estadio Heidenheim",
    "country": "Alemania",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-179",
    "name": "Sivasspor",
    "shortName": "SIV",
    "logoUrl": "https://drop-assets.ea.com/images/3EhjIgaUyFgvhoKz8Yy149/b255ef892f8433425c8d3e844622d646/Sivasspor.png",
    "stadium": "Estadio Sivasspor",
    "country": "Albania",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-180",
    "name": "FC Midtjylland",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/3OQnXwNFwM3MRzQFROVSyX/44407183d4b263858ce9d6b2b5a50195/l1516.png",
    "stadium": "Estadio FC Midtjylland",
    "country": "Suiza",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-181",
    "name": "Sounders FC",
    "shortName": "SOU",
    "logoUrl": "https://drop-assets.ea.com/images/shSYfoaz73Wl4jmu7iCIe/4e5b8a5d40d573c7de9b2899452d78cf/l111144.png",
    "stadium": "Estadio Sounders FC",
    "country": "Brasil",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-182",
    "name": "Levante UD",
    "shortName": "LEV",
    "logoUrl": "https://drop-assets.ea.com/images/2oEcMGN20bO9T7WnqcPZFI/746be807481bcc10a1912919922ac2e5/l1853.png",
    "stadium": "Estadio Levante UD",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-183",
    "name": "Shandong Taishan",
    "shortName": "SHA",
    "logoUrl": "https://drop-assets.ea.com/images/5stS6MCacAlqwxgK5oGbGJ/98edb4dd6434b83c8dff553603f392dd/l111724.png",
    "stadium": "Estadio Shandong Taishan",
    "country": "Brasil",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-184",
    "name": "VfL Bochum 1848",
    "shortName": "VFL",
    "logoUrl": "https://drop-assets.ea.com/images/1Jpul9d3tAZClDoAdJ6MRw/d787dfe9032f73ea01a355956dd55a64/l160.png",
    "stadium": "Estadio VfL Bochum 1848",
    "country": "Alemania",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-185",
    "name": "Vélez Sarsfield",
    "shortName": "VÉL",
    "logoUrl": "https://drop-assets.ea.com/images/7npiMv3iWuBU6UGoPKMDzm/6856e8f10f2137a1f28d5a911b95c350/l101088.png",
    "stadium": "Estadio Vélez Sarsfield",
    "country": "Uruguay",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-186",
    "name": "Al Khaleej",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/1RyALtBA51dh9V9jhV3XbV/a288ba6d75056f219d2b64d45b5054a7/l112883.png",
    "stadium": "Estadio Al Khaleej",
    "country": "Portugal",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-187",
    "name": "Sampdoria",
    "shortName": "SAM",
    "logoUrl": "https://drop-assets.ea.com/images/2YmqUCjCvZk5yvgtCvidwF/c41bf732b0e70c81f0d2faefaede120a/l1837.png",
    "stadium": "Estadio Sampdoria",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-188",
    "name": "FC Famalicão",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/2BwueRB5sADahPpanYYRrO/9a99f9a6b9f3fe583af2da07c2ae262f/l112809.png",
    "stadium": "Estadio FC Famalicão",
    "country": "Francia",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-189",
    "name": "Sp. Charleroi",
    "shortName": "SP.",
    "logoUrl": "https://drop-assets.ea.com/images/7MZjUJqGtBBMgTBoalpeXO/0553e80b7ecd320e3ec0bba523e3757c/l670.png",
    "stadium": "Estadio Sp. Charleroi",
    "country": "Argelia",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-190",
    "name": "AS Saint-Étienne",
    "shortName": "AS ",
    "logoUrl": "https://drop-assets.ea.com/images/5MQDL5KvE9wgSeFC12qs95/b73cf35907b421f2fef86d4e5184b230/l1819.png",
    "stadium": "Estadio AS Saint-Étienne",
    "country": "Marruecos",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-191",
    "name": "Pohang Steelers",
    "shortName": "POH",
    "logoUrl": "https://drop-assets.ea.com/images/1YYaRCNy4yDWlCmIQCXxZB/fa49fc026b64eb53bc1cb6142e40d309/l1474.png",
    "stadium": "Estadio Pohang Steelers",
    "country": "Brasil",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-192",
    "name": "Udinese",
    "shortName": "UDI",
    "logoUrl": "https://drop-assets.ea.com/images/eksZxUrkppoFO3BHpIKxc/ce0190c8a5e09464b8019123eb42a39d/l55.png",
    "stadium": "Estadio Udinese",
    "country": "Eslovenia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-193",
    "name": "Philadelphia U.",
    "shortName": "PHI",
    "logoUrl": "https://drop-assets.ea.com/images/5okVfDvo8Vcgp5mqovBHJm/c286d0caa8776d5d9a6ff7b9f43a4c3d/l112134.png",
    "stadium": "Estadio Philadelphia U.",
    "country": "Jamaica",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-194",
    "name": "R. Oviedo",
    "shortName": "R. ",
    "logoUrl": "https://drop-assets.ea.com/images/1T0WoM8QmdkGaHUzqSll3a/13e4f9aa029c861d5766dd1eb4f6a75f/l110827.png",
    "stadium": "Estadio R. Oviedo",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-195",
    "name": "Casa Pia AC",
    "shortName": "CAS",
    "logoUrl": "https://drop-assets.ea.com/images/4NT6GBzKu0hky4pc6700Vj/cdc3d80990d943576d7b9dd2d8846fa4/l114510.png",
    "stadium": "Estadio Casa Pia AC",
    "country": "Portugal",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-196",
    "name": "R. Sporting",
    "shortName": "R. ",
    "logoUrl": "https://drop-assets.ea.com/images/7EQycAuCy6CEVABWUekZLt/dbf53d920a63c1a028904dddb1f1844e/l459.png",
    "stadium": "Estadio R. Sporting",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-197",
    "name": "Gil Vicente",
    "shortName": "GIL",
    "logoUrl": "https://drop-assets.ea.com/images/4NrTKZNrTGTxLhe8oMuhxP/a8334000a30c120b5387f8dbe0322574/l1888.png",
    "stadium": "Estadio Gil Vicente",
    "country": "Brasil",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-198",
    "name": "Rio Ave FC",
    "shortName": "RIO",
    "logoUrl": "https://drop-assets.ea.com/images/3MILonedzqVboqAI0s5slN/77e1b2cc0fe90e40f69c4acb278e171e/l744.png",
    "stadium": "Estadio Rio Ave FC",
    "country": "Brasil",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-199",
    "name": "Le Havre AC",
    "shortName": "LE ",
    "logoUrl": "https://drop-assets.ea.com/images/7IYWPdU9YKwfNMZeFNwkdQ/076a30fc65780281a69cb43ae11a2ba3/l1738.png",
    "stadium": "Estadio Le Havre AC",
    "country": "Francia",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-200",
    "name": "Palermo",
    "shortName": "PAL",
    "logoUrl": "https://drop-assets.ea.com/images/1JEFlwDn6hw4yiIJvPqwcW/369ccfacdf2f2e39dca5d95c99000e67/l1843.png",
    "stadium": "Estadio Palermo",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-201",
    "name": "Clermont Foot 63",
    "shortName": "CLE",
    "logoUrl": "https://drop-assets.ea.com/images/7eLCpnLD7Pvw0xyxGHsDcv/a698c9f64bf2e66c736d13406c8070e4/l1815.png",
    "stadium": "Estadio Clermont Foot 63",
    "country": "Senegal",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-202",
    "name": "Elche CF",
    "shortName": "ELC",
    "logoUrl": "https://drop-assets.ea.com/images/4i9SsTrlHBPTyWh3SBWTDl/151d49c14cd2b1f48547d9445b8c2c7e/l468.png",
    "stadium": "Estadio Elche CF",
    "country": "Argentina",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-203",
    "name": "Austria Viena",
    "shortName": "AUS",
    "logoUrl": "https://drop-assets.ea.com/images/5e9jo6xN2bnrGdzPYTUxoK/6ffb19b5d1ce1b05c33f5959f39031b5/l256.png",
    "stadium": "Estadio Austria Viena",
    "country": "Austria",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-204",
    "name": "Molde FK",
    "shortName": "MOL",
    "logoUrl": "https://drop-assets.ea.com/images/2q4audoCo1FZkqfch2Ykld/e91ffa1e19e9b824d5375a52dd5bbfe7/l417.png",
    "stadium": "Estadio Molde FK",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-205",
    "name": "Al Wehda",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/19nhMP7fQd4LcQ1pvGFE4Q/96c2d60cac91a49fc5ef48351ef11b0b/Al_Wehda.png",
    "stadium": "Estadio Al Wehda",
    "country": "Marruecos",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-206",
    "name": "SJ Earthquakes",
    "shortName": "SJ ",
    "logoUrl": "https://drop-assets.ea.com/images/24K6PFhSK3sFDydoFSN794/48139889372bb3d6db2fd41a924c5431/l111928.png",
    "stadium": "Estadio SJ Earthquakes",
    "country": "Argentina",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-207",
    "name": "FC Seoul",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/6ayQgkHeJXDN0qKmBK8yi/860e90db016f468ab9a0a76e64ae9442/l982.png",
    "stadium": "Estadio FC Seoul",
    "country": "Rusia",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-208",
    "name": "Ulsan HD FC",
    "shortName": "ULS",
    "logoUrl": "https://drop-assets.ea.com/images/4JSzJwU0mAeHMAO6coONRs/405ce029cfc5e18af22441e2141a8a73/l1473.png",
    "stadium": "Estadio Ulsan HD FC",
    "country": "República de Corea",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-209",
    "name": "Minnesota United",
    "shortName": "MIN",
    "logoUrl": "https://drop-assets.ea.com/images/632umlZ6r0HxZcYgoNFx3h/190ea770d54566bc9ea6479273ef4ed6/l111138.png",
    "stadium": "Estadio Minnesota United",
    "country": "Finlandia",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-210",
    "name": "Zhejiang Pro",
    "shortName": "ZHE",
    "logoUrl": "https://drop-assets.ea.com/images/5j7LbyBsOHUcryu18AKfPH/33d01fa69af8f28be68913b4933efbc8/l112163.png",
    "stadium": "Estadio Zhejiang Pro",
    "country": "Brasil",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-211",
    "name": "Independiente",
    "shortName": "IND",
    "logoUrl": "https://drop-assets.ea.com/images/1jWKtSnzOJLCUGQjgSw9B6/1c59266ca28d3abb505fb74ca58f12df/l110093.png",
    "stadium": "Estadio Independiente",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-212",
    "name": "Gaziantep",
    "shortName": "GAZ",
    "logoUrl": "https://drop-assets.ea.com/images/34vBMcAafsImubAt41dcR9/7a87c863ba62c27b426c051623d97d8e/l110776.png",
    "stadium": "Estadio Gaziantep",
    "country": "Rumanía",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-213",
    "name": "RC Deportivo",
    "shortName": "RC ",
    "logoUrl": "https://drop-assets.ea.com/images/73l28GYWv26WmXONG7VMRy/26efbc4f6d7aff91387d0083de03cd2e/l242.png",
    "stadium": "Estadio RC Deportivo",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-214",
    "name": "Venezia",
    "shortName": "VEN",
    "logoUrl": "https://drop-assets.ea.com/images/4oRMTpjQWJzNTb5EzszD2f/cf5a478ab8265df7c16b5789ee8cab4d/l205.png",
    "stadium": "Estadio Venezia",
    "country": "Finlandia",
    "league": "Serie A Enilive",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-215",
    "name": "Hertha BSC",
    "shortName": "HER",
    "logoUrl": "https://drop-assets.ea.com/images/2D5gtkF7NpnQEj6eBJfXfp/466c740b318e2eeff5fa95f49da8f1b9/l166.png",
    "stadium": "Estadio Hertha BSC",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-216",
    "name": "Estoril Praia",
    "shortName": "EST",
    "logoUrl": "https://drop-assets.ea.com/images/4EBkdF7YMR1RL5L9qErtsN/6fc6b086d096abfd5cdd44d288e99050/l10020.png",
    "stadium": "Estadio Estoril Praia",
    "country": "España",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-217",
    "name": "Argentinos Jrs.",
    "shortName": "ARG",
    "logoUrl": "https://drop-assets.ea.com/images/4C3hj7I5EQYQ20DcdWMSBv/1c9a44078723e53076018d3c74574437/l111019.png",
    "stadium": "Estadio Argentinos Jrs.",
    "country": "Argentina",
    "league": "Sudamericana",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-218",
    "name": "Adana Demirspor",
    "shortName": "ADA",
    "logoUrl": "https://drop-assets.ea.com/images/5b5MY97fqM5qG3h3mjcfs9/ca1ec179929e79eb3eed3d7df7e021bd/Adana_Demirspor.png",
    "stadium": "Estadio Adana Demirspor",
    "country": "Turquía",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-219",
    "name": "FC Malinas",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/2WupBfXKg69mIhwL872xXS/642e54f53ded21ed63e589485a4e0798/l110724.png",
    "stadium": "Estadio FC Malinas",
    "country": "Bélgica",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-220",
    "name": "Hearts",
    "shortName": "HEA",
    "logoUrl": "https://drop-assets.ea.com/images/2mfFbaE9ByqIuH2By4SYxe/1356a36b8760e0fc252a07e4892efffd/l80.png",
    "stadium": "Estadio Hearts",
    "country": "Escocia",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-221",
    "name": "Coventry City",
    "shortName": "COV",
    "logoUrl": "https://drop-assets.ea.com/images/2gQg3oJShWcRNapNPs6nwg/f151b26049eba7d246ca89edcdd19388/l1800.png",
    "stadium": "Estadio Coventry City",
    "country": "Inglaterra",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-222",
    "name": "Brøndby IF",
    "shortName": "BRØ",
    "logoUrl": "https://drop-assets.ea.com/images/5lfBrm7kOb7cl8l7qm4dIm/3c07a35972ab6e19f1b25e6b318866dc/l269.png",
    "stadium": "Estadio Brøndby IF",
    "country": "Holanda",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-223",
    "name": "FC Lugano",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/P7rPFiuaTOWZYfQKFSeVW/4409623f9da863990f92e02d6de2f76d/l10032.png",
    "stadium": "Estadio FC Lugano",
    "country": "Suiza",
    "league": "CSSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-224",
    "name": "Servette FC",
    "shortName": "SER",
    "logoUrl": "https://drop-assets.ea.com/images/5cpTngwqrlh5ZGS6NqubQE/38e56024320e759fd0f556ce1eb6fd75/l324.png",
    "stadium": "Estadio Servette FC",
    "country": "Bosnia y Herzegovina",
    "league": "CSSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-225",
    "name": "Viktoria Plzeň",
    "shortName": "VIK",
    "logoUrl": "https://drop-assets.ea.com/images/5LmNp7F4reMrhue3FZ3lD5/7222160e6e0c97516d2c783964ac3c8c/l110468.png",
    "stadium": "Estadio Viktoria Plzeň",
    "country": "República Checa",
    "league": "Česká Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-226",
    "name": "AJ Auxerre",
    "shortName": "AJ ",
    "logoUrl": "https://drop-assets.ea.com/images/1bqZtPlVC4DJC6d0eJ3wF3/d7b36902b29fff13d5cccba0d2b3ef21/l57.png",
    "stadium": "Estadio AJ Auxerre",
    "country": "Costa de Marfil",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-227",
    "name": "Cremonese",
    "shortName": "CRE",
    "logoUrl": "https://drop-assets.ea.com/images/5qGQiqAc43aS9qGMCgpOAT/60c44a125cdec67fa0bae64fb42aa10a/l111434.png",
    "stadium": "Estadio Cremonese",
    "country": "Argentina",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-228",
    "name": "R. Racing Club",
    "shortName": "R. ",
    "logoUrl": "https://drop-assets.ea.com/images/5V2bkOk8FIEJMEWuz70tnI/91475989a56e0b4171b890356993af7b/l456.png",
    "stadium": "Estadio R. Racing Club",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-229",
    "name": "LASK",
    "shortName": "LAS",
    "logoUrl": "https://drop-assets.ea.com/images/2IaqcXGAFPUX7ZB3PKrB1w/bf771aac860cb3b6e680de79b5b0e407/l252.png",
    "stadium": "Estadio LASK",
    "country": "Austria",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-230",
    "name": "Charlotte FC",
    "shortName": "CHA",
    "logoUrl": "https://drop-assets.ea.com/images/2XdxNo0fpuLxoylkpYWVlt/aeb3ddd9bb97accae5777262a7822e27/l114640.png",
    "stadium": "Estadio Charlotte FC",
    "country": "Israel",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-231",
    "name": "SD Eibar",
    "shortName": "SD ",
    "logoUrl": "https://drop-assets.ea.com/images/4WIKsgvUeBP5w25SP1ugQS/9cf176f4585d3c4c62d2822e0f99858e/l467.png",
    "stadium": "Estadio SD Eibar",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-232",
    "name": "Real Zaragoza",
    "shortName": "REA",
    "logoUrl": "https://drop-assets.ea.com/images/5f2bOjCOoPvgHb4P1Az46S/cf532789018c02fa25f07fc6336b4542/l244.png",
    "stadium": "Estadio Real Zaragoza",
    "country": "Albania",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-233",
    "name": "D.C. United",
    "shortName": "D.C",
    "logoUrl": "https://drop-assets.ea.com/images/39NBzzFzXJxgEhgxVbx1bw/72fdd18d2896756539591de967275156/l688.png",
    "stadium": "Estadio D.C. United",
    "country": "Bélgica",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-234",
    "name": "Standard Lieja",
    "shortName": "STA",
    "logoUrl": "https://drop-assets.ea.com/images/5kh9CgGBVXFJ9hz4prrdHU/cae0ecb087e4f0dc17329b6bccb02eae/l232.png",
    "stadium": "Estadio Standard Lieja",
    "country": "Bélgica",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-235",
    "name": "Stoke City",
    "shortName": "STO",
    "logoUrl": "https://drop-assets.ea.com/images/3st1bfyqsj6hKWrPlC4ifm/bc7dd0e68df131050a6b8946829261f6/l1806.png",
    "stadium": "Estadio Stoke City",
    "country": "Holanda",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-236",
    "name": "Blackburn",
    "shortName": "BLA",
    "logoUrl": "https://drop-assets.ea.com/images/2cdgM916lzZI1c5NYtqi2c/7f207c65668877d40dd2ce2da845f1c6/l3.png",
    "stadium": "Estadio Blackburn",
    "country": "Inglaterra",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-237",
    "name": "Südtirol",
    "shortName": "SÜD",
    "logoUrl": "https://drop-assets.ea.com/images/1KPMKujFTlrtkyr66cgM0g/38a828615a781742a496d16a06fe327c/l112494.png",
    "stadium": "Estadio Südtirol",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-238",
    "name": "QPR",
    "shortName": "QPR",
    "logoUrl": "https://drop-assets.ea.com/images/5uNWzWCM1Nyq0h9L82B4Fx/4217e9596e7a51a9b886a486a5cf0e4b/l15.png",
    "stadium": "Estadio QPR",
    "country": "Marruecos",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-239",
    "name": "Cardiff City",
    "shortName": "CAR",
    "logoUrl": "https://drop-assets.ea.com/images/7BJE7e1wC6SnGZdbWq7aTX/631d8f80f0b60e86be142e6481da7b79/l1961.png",
    "stadium": "Estadio Cardiff City",
    "country": "Inglaterra",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-240",
    "name": "Gimnasia",
    "shortName": "GIM",
    "logoUrl": "https://drop-assets.ea.com/images/3j5axj5LUSaPA3xTCmBYUO/1cedd6daf68ab1e12083333fb174f4ba/l101084.png",
    "stadium": "Estadio Gimnasia",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-241",
    "name": "Moreirense FC",
    "shortName": "MOR",
    "logoUrl": "https://drop-assets.ea.com/images/6AQOrmGMn4AiDNBQPeb9ak/0cf859fc34d66f10a1e739b312f1ed52/l1900.png",
    "stadium": "Estadio Moreirense FC",
    "country": "Brasil",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-242",
    "name": "KV Cortrique",
    "shortName": "KV ",
    "logoUrl": "https://drop-assets.ea.com/images/TRpDDMgliCFeT3iiC3Spp/c24afb1ef51ca13070e69e0ba3faff54/KV_Kortrijk.png",
    "stadium": "Estadio KV Cortrique",
    "country": "Bélgica",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-243",
    "name": "Banfield",
    "shortName": "BAN",
    "logoUrl": "https://drop-assets.ea.com/images/1Scs88aAFwUITTcHvzxjnc/4059beaa3acc9614d27bb33b52707ca4/l110404.png",
    "stadium": "Estadio Banfield",
    "country": "Ecuador",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-244",
    "name": "Huracán",
    "shortName": "HUR",
    "logoUrl": "https://drop-assets.ea.com/images/3FJoWMsQWBn1s7iu1eVCYM/6c279863936f9aa0fd1eb1a704cec7ca/l111711.png",
    "stadium": "Estadio Huracán",
    "country": "Chile",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-245",
    "name": "BSC Young Boys",
    "shortName": "BSC",
    "logoUrl": "https://drop-assets.ea.com/images/8VBEw8DGcz4EDqhJUuAfw/edd537527e950001ddf4c17e470bfafb/l900.png",
    "stadium": "Estadio BSC Young Boys",
    "country": "RD Congo",
    "league": "CSSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-246",
    "name": "Belgrano",
    "shortName": "BEL",
    "logoUrl": "https://drop-assets.ea.com/images/6DO3TSy0AxrUyUGCPtjhbh/2365c6c79492f4d14c64c8470a2f6314/l111022.png",
    "stadium": "Estadio Belgrano",
    "country": "Argentina",
    "league": "Sudamericana",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-247",
    "name": "Al Raed",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/TbgO4t4NP5IQgdjzMqMn3/3242bc2211b2ebb245ca9e8b37aaf9ea/Al_Raed.png",
    "stadium": "Estadio Al Raed",
    "country": "Marruecos",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-248",
    "name": "Hamburger SV",
    "shortName": "HAM",
    "logoUrl": "https://drop-assets.ea.com/images/Vwj9mu65nCqScjLevwVoY/37cf47cedf66f85ed8078fe491b122a7/l28.png",
    "stadium": "Estadio Hamburger SV",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-249",
    "name": "SK Sturm Graz",
    "shortName": "SK ",
    "logoUrl": "https://drop-assets.ea.com/images/U3cNfuz1b4g9a5PLgT7vM/498019dcaedd6c6acaa8efd10ebd6415/l209.png",
    "stadium": "Estadio SK Sturm Graz",
    "country": "Eslovenia",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-250",
    "name": "Pogoń Szczecin",
    "shortName": "POG",
    "logoUrl": "https://drop-assets.ea.com/images/1ffYfc0SXL58dGkCML5QwA/7e2047fca023c6cc2c1ccaa935ecea3f/l110746.png",
    "stadium": "Estadio Pogoń Szczecin",
    "country": "Polonia",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-251",
    "name": "Norwich City",
    "shortName": "NOR",
    "logoUrl": "https://drop-assets.ea.com/images/7o6o0SBCe2scNTDZcX13sy/1f3e34348bf728dbac2afb6b3f67d680/l1792.png",
    "stadium": "Estadio Norwich City",
    "country": "Escocia",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-252",
    "name": "Çaykur Rizespor",
    "shortName": "ÇAY",
    "logoUrl": "https://drop-assets.ea.com/images/7n0Ea6O0YO0jCvir4aAuJ5/0eac5bb7245d7c5ba20fa62a773f4cee/l101037.png",
    "stadium": "Estadio Çaykur Rizespor",
    "country": "Bosnia y Herzegovina",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-253",
    "name": "FC Metz",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/72z6j1ScmjiNH7B8lK1jCd/7fb28b950ceb4566459f1b3fd6d80c87/l68.png",
    "stadium": "Estadio FC Metz",
    "country": "Francia",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-254",
    "name": "FC Basilea 1893",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/3Pch82RlxKrcAbcxJRaXPd/5960afa4e37bb3f71de4ba619cebeaee/l896.png",
    "stadium": "Estadio FC Basilea 1893",
    "country": "Suiza",
    "league": "CSSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-255",
    "name": "Holstein Kiel",
    "shortName": "HOL",
    "logoUrl": "https://drop-assets.ea.com/images/76Cty7M0clW2muhwvShdQI/8305498ec9ead0cb7fda5a9d3a175deb/l576.png",
    "stadium": "Estadio Holstein Kiel",
    "country": "Alemania",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-256",
    "name": "FC St. Pauli",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/5T624XIJuQHAzZ40IwcdRn/4413b83d7bdf21e02132fa086b4a355d/l110329.png",
    "stadium": "Estadio FC St. Pauli",
    "country": "Australia",
    "league": "Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-257",
    "name": "Alanyaspor",
    "shortName": "ALA",
    "logoUrl": "https://drop-assets.ea.com/images/2Mtv0bO6eTuZXXTOCAo2XV/5f60dcfeb4ad99e54f13df795d0a2d79/l113142.png",
    "stadium": "Estadio Alanyaspor",
    "country": "Turquía",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-258",
    "name": "1. FC Nürnberg",
    "shortName": "1. ",
    "logoUrl": "https://drop-assets.ea.com/images/18NAIE3iAwgz0ApMa0FAgB/4eba73ffbd5aec78779d16ae71c3b101/l171.png",
    "stadium": "Estadio 1. FC Nürnberg",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-259",
    "name": "KAA Gent",
    "shortName": "KAA",
    "logoUrl": "https://drop-assets.ea.com/images/6yyNmrjeahHfB0uWJP0pD/1531a54f512af00033f9dbe78c78c0bb/l674.png",
    "stadium": "Estadio KAA Gent",
    "country": "Bélgica",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-260",
    "name": "Daejeon Hana",
    "shortName": "DAE",
    "logoUrl": "https://drop-assets.ea.com/images/3M6vf1wgtgGyRj63KAD9m3/cc8481d2a07596b39d64d990fdc173b2/l980.png",
    "stadium": "Estadio Daejeon Hana",
    "country": "República de Corea",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-261",
    "name": "Gimcheon Sangmu",
    "shortName": "GIM",
    "logoUrl": "https://drop-assets.ea.com/images/5jDWW3t8DbH6JXgZmWjMsY/7fdde6d2ac92ad12fb20d4fa6811e698/l2055.png",
    "stadium": "Estadio Gimcheon Sangmu",
    "country": "República de Corea",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-262",
    "name": "Instituto",
    "shortName": "INS",
    "logoUrl": "https://drop-assets.ea.com/images/6kXARUlBpdTR33bUsF4yaf/3b2f25a2172d85c7adca45d0c9c08678/l110953.png",
    "stadium": "Estadio Instituto",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-263",
    "name": "Sydney FC",
    "shortName": "SYD",
    "logoUrl": "https://drop-assets.ea.com/images/3mpn3MDw8xd2m9VQsOJEBr/c561cb779fcd9ca0f2de6b4a822f7c58/l111400.png",
    "stadium": "Estadio Sydney FC",
    "country": "Inglaterra",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-264",
    "name": "Salerno",
    "shortName": "SAL",
    "logoUrl": "https://drop-assets.ea.com/images/7EKQXbaFASYg0HbVFSs8lP/175ec8fd456925f8f143a7f70879b30f/Salernitana.png",
    "stadium": "Estadio Salerno",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-265",
    "name": "Hull City",
    "shortName": "HUL",
    "logoUrl": "https://drop-assets.ea.com/images/5Uc4aTJOQyjzSXC2vj0B5h/32ce96322eb17c65d9d1bcdc52c43985/l1952.png",
    "stadium": "Estadio Hull City",
    "country": "Alemania",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-266",
    "name": "Colorado Rapids",
    "shortName": "COL",
    "logoUrl": "https://drop-assets.ea.com/images/4dg1q8vEHMWFO5UxDAFI62/174a283a2f32ab1fc87c8ec05a805e84/l694.png",
    "stadium": "Estadio Colorado Rapids",
    "country": "Estados Unidos",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-267",
    "name": "Beijing FC",
    "shortName": "BEI",
    "logoUrl": "https://drop-assets.ea.com/images/1YvvKsrmkSlgNps2YfKvSz/26e2ee4cf654812b02b05d9ef6dda1b8/l111768.png",
    "stadium": "Estadio Beijing FC",
    "country": "Camerún",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-268",
    "name": "Godoy Cruz",
    "shortName": "GOD",
    "logoUrl": "https://drop-assets.ea.com/images/3V3IzF2dwJdQzGTVQhv6EO/36c340ad07362c643a00419c405eedfb/l111706.png",
    "stadium": "Estadio Godoy Cruz",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-269",
    "name": "BK Häcken",
    "shortName": "BK ",
    "logoUrl": "https://drop-assets.ea.com/images/7AY55zmb8J1HxePmSrReax/647d26829247d5030298356968662d4b/l711.png",
    "stadium": "Estadio BK Häcken",
    "country": "Dinamarca",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-270",
    "name": "Eyüpspor",
    "shortName": "EYÜ",
    "logoUrl": "https://drop-assets.ea.com/images/PWn9qDhcULfk23HjX2iml/81ded5b6a22d207286e1cbe621ee7725/l131174.png",
    "stadium": "Estadio Eyüpspor",
    "country": "España",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-271",
    "name": "SV Darmstadt 98",
    "shortName": "SV ",
    "logoUrl": "https://drop-assets.ea.com/images/7pK2ffyShh0BG6wpVmq7Rd/b0b14645a0b948fbd1c2b29ccf9387d7/l110502.png",
    "stadium": "Estadio SV Darmstadt 98",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-272",
    "name": "Daegu FC",
    "shortName": "DAE",
    "logoUrl": "https://drop-assets.ea.com/images/4N6Z2zx2UHMrygzxcn5FLU/21bdbc0cda7fd7cc8abc6791fa5d9056/l2056.png",
    "stadium": "Estadio Daegu FC",
    "country": "Brasil",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-273",
    "name": "Arouca",
    "shortName": "ARO",
    "logoUrl": "https://drop-assets.ea.com/images/6TS5K2cgvvwPpBxwjH7PQV/c71fb859857329f6e28cd5d23f8aadcf/l112513.png",
    "stadium": "Estadio Arouca",
    "country": "Portugal",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-274",
    "name": "Changchun Yatai",
    "shortName": "CHA",
    "logoUrl": "https://drop-assets.ea.com/images/JLoi6Ylv0JNOXzlwfDEaj/1a079d21dca64bc60dbbdd7e3ec3f52f/l111769.png",
    "stadium": "Estadio Changchun Yatai",
    "country": "Zambia",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-275",
    "name": "Samsunspor",
    "shortName": "SAM",
    "logoUrl": "https://drop-assets.ea.com/images/49SwBlbAndg3gbnSzl3NPX/738756631e7ad2dabaead9003604d5db/l748.png",
    "stadium": "Estadio Samsunspor",
    "country": "Francia",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-276",
    "name": "West Bromwich",
    "shortName": "WES",
    "logoUrl": "https://drop-assets.ea.com/images/7tGyhQeTlyxsYgMjtsTs8D/a81704775cdc739eaff837ac911a4eb7/l109.png",
    "stadium": "Estadio West Bromwich",
    "country": "Inglaterra",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-277",
    "name": "Preston",
    "shortName": "PRE",
    "logoUrl": "https://drop-assets.ea.com/images/6tv0Z4tKPLwUYOP6uLaZ15/7d139088e9f1778815c484ad65c90795/l1801.png",
    "stadium": "Estadio Preston",
    "country": "Inglaterra",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-278",
    "name": "Plymouth Argyle",
    "shortName": "PLY",
    "logoUrl": "https://drop-assets.ea.com/images/GYj79GgV2KIW6xIZtDC07/dc33552b0d5dd4886d9ccee0c93ce387/l1929.png",
    "stadium": "Estadio Plymouth Argyle",
    "country": "Inglaterra",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-279",
    "name": "Boavista FC",
    "shortName": "BOA",
    "logoUrl": "https://drop-assets.ea.com/images/4W5My0PbAk19bIuvZOPJ42/e1604b9829771c92e33ba1c46a091602/Boavista_FC.png",
    "stadium": "Estadio Boavista FC",
    "country": "Uruguay",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-280",
    "name": "Angers SCO",
    "shortName": "ANG",
    "logoUrl": "https://drop-assets.ea.com/images/4X5jDzZlLlvjjfl3gGgWDz/cef1a10b1b5e946648957a4d1089f6ab/l1530.png",
    "stadium": "Estadio Angers SCO",
    "country": "Argelia",
    "league": "Ligue 1 McDonald's",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-281",
    "name": "Pisa",
    "shortName": "PIS",
    "logoUrl": "https://drop-assets.ea.com/images/6DfSpNABeyrlXE4KPph3hG/2958a98dfea4d81f07b4491d3215c270/l110738.png",
    "stadium": "Estadio Pisa",
    "country": "Dinamarca",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-282",
    "name": "Kaiserslautern",
    "shortName": "KAI",
    "logoUrl": "https://drop-assets.ea.com/images/48rCnuSfPVoerVsgdS54pq/206745ed9f32255148d93b7b6365fddc/l29.png",
    "stadium": "Estadio Kaiserslautern",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-283",
    "name": "FC St. Gallen",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/6oXijy08x7AduhQ0MgtVF/86a7b32e91f403572eedac635fac0ba9/l898.png",
    "stadium": "Estadio FC St. Gallen",
    "country": "RD Congo",
    "league": "CSSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-284",
    "name": "Estrela Amadora",
    "shortName": "EST",
    "logoUrl": "https://drop-assets.ea.com/images/6dtdBaEQoNMbbZSoQJOY5w/6604e537a235083a10b40c2d0f599f06/l718.png",
    "stadium": "Estadio Estrela Amadora",
    "country": "Portugal",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-285",
    "name": "Shanghái Shenhua",
    "shortName": "SHA",
    "logoUrl": "https://drop-assets.ea.com/images/75pnQIgCJFt2JIohg2Hauc/0516a37518bb1186ac3d572e15c4b786/l110955.png",
    "stadium": "Estadio Shanghái Shenhua",
    "country": "Francia",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-286",
    "name": "Reggiana",
    "shortName": "REG",
    "logoUrl": "https://drop-assets.ea.com/images/3OXGllrUGnpXPaFoPUD9jn/41a80408f95eec5006c6fd811c37f23b/l110740.png",
    "stadium": "Estadio Reggiana",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-287",
    "name": "APOEL FC",
    "shortName": "APO",
    "logoUrl": "https://drop-assets.ea.com/images/np0Yz4fqwMGXDRLKcA7r6/56ed909c58ed620c2b6201b1554a0d3d/l100135.png",
    "stadium": "Estadio APOEL FC",
    "country": "Eslovenia",
    "league": "Liga Cyprus",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-288",
    "name": "Ind. Rivadavia",
    "shortName": "IND",
    "logoUrl": "https://drop-assets.ea.com/images/5EPl32mUWnIxS5jFIbwwLh/ffcc8957706ba4a68145dabcdbb77211/l111020.png",
    "stadium": "Estadio Ind. Rivadavia",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-289",
    "name": "Millwall",
    "shortName": "MIL",
    "logoUrl": "https://drop-assets.ea.com/images/10t4Y8ZhN0jBRYGgSvZqqa/ab5f241429688886f120d0e34f600c09/l97.png",
    "stadium": "Estadio Millwall",
    "country": "Inglaterra",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-290",
    "name": "Unión",
    "shortName": "UNI",
    "logoUrl": "https://drop-assets.ea.com/images/InPYiKZbKde1NUlkdacCB/fb7a07ab161894e723272605a3ae24db/l111716.png",
    "stadium": "Estadio Unión",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-291",
    "name": "Malmö FF",
    "shortName": "MAL",
    "logoUrl": "https://drop-assets.ea.com/images/ie7tItNjjh8EsmNf3DzXG/e06b2b774c80b6b87d88afdee0ba7de9/l320.png",
    "stadium": "Estadio Malmö FF",
    "country": "Brasil",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-292",
    "name": "Djurgårdens IF",
    "shortName": "DJU",
    "logoUrl": "https://drop-assets.ea.com/images/5xfI9ljbBcCXCPRyeKymQG/0a52c971d038691f44d9c5a70a07d2dc/l710.png",
    "stadium": "Estadio Djurgårdens IF",
    "country": "Suecia",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-293",
    "name": "Chengdu FC",
    "shortName": "CHE",
    "logoUrl": "https://drop-assets.ea.com/images/3fGAQCGqtKzek6w0jW3lnF/c5d0881e103bfe46841118af2d214e4a/l116360.png",
    "stadium": "Estadio Chengdu FC",
    "country": "Brasil",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-294",
    "name": "Racing de Ferrol",
    "shortName": "RAC",
    "logoUrl": "https://drop-assets.ea.com/images/29I64i1Z8MHbEQdAniv1si/7dddfe968af23ad2aabb5ae290aeeb12/Racing_de_Ferrol.png",
    "stadium": "Estadio Racing de Ferrol",
    "country": "Cabo Verde",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-295",
    "name": "Qarabağ FK",
    "shortName": "QAR",
    "logoUrl": "https://drop-assets.ea.com/images/2JxFk2gCTlyiAsUzsXuStD/45b9c1c34070243414e7485139413abe/l113888.png",
    "stadium": "Estadio Qarabağ FK",
    "country": "Brasil",
    "league": "Liga Azerbaijan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-296",
    "name": "Lausanne-Sport",
    "shortName": "LAU",
    "logoUrl": "https://drop-assets.ea.com/images/4dDIhNDLKw3ch6RLm8Asz8/604c66057c82a36d432c9f7062afb514/l1862.png",
    "stadium": "Estadio Lausanne-Sport",
    "country": "Bélgica",
    "league": "CSSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-297",
    "name": "Hatayspor",
    "shortName": "HAT",
    "logoUrl": "https://drop-assets.ea.com/images/Km3CH1huJKRusXgnF1f2D/64fed1efc3aeb363dd51c2a53bcf8ae2/Hatayspor.png",
    "stadium": "Estadio Hatayspor",
    "country": "Argelia",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-298",
    "name": "FC Nordsjælland",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/gSMMRVyaLXhtvthut1pcw/183d3ba801ceef22eb46156bb2573801/l1788.png",
    "stadium": "Estadio FC Nordsjælland",
    "country": "Dinamarca",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-299",
    "name": "FC Schalke 04",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/5EKirX0RaDRkEm6Ye2TZPJ/36e510bb520335208b13ffd3c9ba1220/l34.png",
    "stadium": "Estadio FC Schalke 04",
    "country": "Turquía",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-300",
    "name": "Melbourne City",
    "shortName": "MEL",
    "logoUrl": "https://drop-assets.ea.com/images/1XScyNZzA618ZhIFrLQWeQ/1a86ddea6e00ca7096da38cc3ccd79c8/l112224.png",
    "stadium": "Estadio Melbourne City",
    "country": "Australia",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-301",
    "name": "Göztepe",
    "shortName": "GÖZ",
    "logoUrl": "https://drop-assets.ea.com/images/3wtNdRJMkrouZWTfZrG9aR/43e4b77bee85f788fffc2c437f179a31/l101026.png",
    "stadium": "Estadio Göztepe",
    "country": "Polonia",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-302",
    "name": "Raków",
    "shortName": "RAK",
    "logoUrl": "https://drop-assets.ea.com/images/kEZlFrqfAkNfIzHq1ElTR/c6e17b57ff712cbf2f3acef34c0a1c09/l114326.png",
    "stadium": "Estadio Raków",
    "country": "España",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-303",
    "name": "FC Zürich",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/10Ai35BVG7LLnZohvmPo8y/f3cad76b715490123789d03f1abd0527/l131361.png",
    "stadium": "Estadio FC Zürich",
    "country": "Suiza",
    "league": "Schweizer Damen Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-304",
    "name": "SM Caen",
    "shortName": "SM ",
    "logoUrl": "https://drop-assets.ea.com/images/6RhLxZzRDUAfHL5ikoTFb4/3fb4c11849b17c0f96836b80a4d469da/SM_Caen.png",
    "stadium": "Estadio SM Caen",
    "country": "Guinea-Bissau",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-305",
    "name": "Univ. Craiova",
    "shortName": "UNI",
    "logoUrl": "https://drop-assets.ea.com/images/2G0njxgc39B2CNCaYnUvzO/13e27cdd6555ac5b1d463b476ad4e18b/l308.png",
    "stadium": "Estadio Univ. Craiova",
    "country": "Rumanía",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-306",
    "name": "New York City FC",
    "shortName": "NEW",
    "logoUrl": "https://drop-assets.ea.com/images/BJhoD5d8b2BP4SGRS7PYh/39a45c63ab3fbda10faa0d2247a77829/l112828.png",
    "stadium": "Estadio New York City FC",
    "country": "Argentina",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-307",
    "name": "Middlesbrough",
    "shortName": "MID",
    "logoUrl": "https://drop-assets.ea.com/images/6dWJ6rMR0DkZhJDw8C0Eux/b45a8d4c9479c72c45c3d801d29c8f26/l12.png",
    "stadium": "Estadio Middlesbrough",
    "country": "Estados Unidos",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-308",
    "name": "Incheon United",
    "shortName": "INC",
    "logoUrl": "https://drop-assets.ea.com/images/KcLdZFsVdmPhhz9wBYlLU/ed9600204e9b2a8adde55c72efb71d4f/l110765.png",
    "stadium": "Estadio Incheon United",
    "country": "Montenegro",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-309",
    "name": "Al-Okhdood",
    "shortName": "AL-",
    "logoUrl": "https://drop-assets.ea.com/images/1JoKWtkgodTXYYNlvp2d73/b74c95d094fc90774c8e06f76d6b7093/l113060.png",
    "stadium": "Estadio Al-Okhdood",
    "country": "Zimbabue",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-310",
    "name": "FCSB",
    "shortName": "FCS",
    "logoUrl": "https://drop-assets.ea.com/images/6MywRdNNz3TeWXPNKTJdEr/630780849ebd6e856e6e855cd2c1589b/l100761.png",
    "stadium": "Estadio FCSB",
    "country": "Rumanía",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-311",
    "name": "Frosinone",
    "shortName": "FRO",
    "logoUrl": "https://drop-assets.ea.com/images/35tTZvfFMDawbbdlPaDA3q/efcd9dee1d887005c909dc280caab426/l111657.png",
    "stadium": "Estadio Frosinone",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-312",
    "name": "Spezia",
    "shortName": "SPE",
    "logoUrl": "https://drop-assets.ea.com/images/2qrtNCwHo9a8wvFgWh83LD/5631884d4a82dedac2432e04b5259612/l113974.png",
    "stadium": "Estadio Spezia",
    "country": "Polonia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-313",
    "name": "Auckland FC",
    "shortName": "AUC",
    "logoUrl": "https://drop-assets.ea.com/images/3hav87medpC01z2VSVjoKt/21bce0851156472166a95db13d6849c9/l131739.png",
    "stadium": "Estadio Auckland FC",
    "country": "Japón",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-314",
    "name": "Farense",
    "shortName": "FAR",
    "logoUrl": "https://drop-assets.ea.com/images/3qsWq9kvUuW4wRscZroDkK/deebc92b7ff90ad5a22939a4a8361e4d/Farense.png",
    "stadium": "Estadio Farense",
    "country": "Portugal",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-315",
    "name": "Watford",
    "shortName": "WAT",
    "logoUrl": "https://drop-assets.ea.com/images/2MxNfPhOs9sFL7KH8k5Pcd/1be0302e620f2da1b08f09fa9c7bcc64/l1795.png",
    "stadium": "Estadio Watford",
    "country": "Francia",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-316",
    "name": "AGF",
    "shortName": "AGF",
    "logoUrl": "https://drop-assets.ea.com/images/tbiz70DI2xDhDu23tuXKJ/a3efd7681daef79a704f4b7b9a90a501/l271.png",
    "stadium": "Estadio AGF",
    "country": "Dinamarca",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-317",
    "name": "Viking FK",
    "shortName": "VIK",
    "logoUrl": "https://drop-assets.ea.com/images/1Hqasdq2pv68jPdGkVNm2k/9dc6b08e8c7744c3c6b6b1fe8b702311/l300.png",
    "stadium": "Estadio Viking FK",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-318",
    "name": "Tianjin JMT FC",
    "shortName": "TIA",
    "logoUrl": "https://drop-assets.ea.com/images/7DvvnWwDyYhfUBQtEzZAFk/5cfc72cd99ab4182e0878452a4f2c19e/l111774.png",
    "stadium": "Estadio Tianjin JMT FC",
    "country": "Portugal",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-319",
    "name": "Karlsruher SC",
    "shortName": "KAR",
    "logoUrl": "https://drop-assets.ea.com/images/hH4bpZJ2bDYK5biA3C9tW/3e48260efb6ce6b9751e9b87f8ddcdcf/l1832.png",
    "stadium": "Estadio Karlsruher SC",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-320",
    "name": "Atlanta United",
    "shortName": "ATL",
    "logoUrl": "https://drop-assets.ea.com/images/7eEpDrKitxMaqo5dk0Kude/7c71b8ba391e5c5cd891bdc1fc5f1111/l112885.png",
    "stadium": "Estadio Atlanta United",
    "country": "Perú",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-321",
    "name": "Henan FC",
    "shortName": "HEN",
    "logoUrl": "https://drop-assets.ea.com/images/6vhxJJmcwfq5d7fQwKVyud/295bae807604479befb41d61f42f8566/l111779.png",
    "stadium": "Estadio Henan FC",
    "country": "Ghana",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-322",
    "name": "Düsseldorf",
    "shortName": "DÜS",
    "logoUrl": "https://drop-assets.ea.com/images/3dRdiefAOqkWiYbZO4e5Xo/83a09925f2b132c229c4aba1a3fd99e4/l110636.png",
    "stadium": "Estadio Düsseldorf",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-323",
    "name": "Kilmarnock",
    "shortName": "KIL",
    "logoUrl": "https://drop-assets.ea.com/images/1Mqm0CYeGgxacDRVpjV4de/36308bc05fa59980a5025517bb02a2a9/l82.png",
    "stadium": "Estadio Kilmarnock",
    "country": "Escocia",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-324",
    "name": "Sheffield Wed.",
    "shortName": "SHE",
    "logoUrl": "https://drop-assets.ea.com/images/7pPfjOGVq9NkKHgnoLFLQC/6f72d113d8d7f061305156096ededd7f/l1807.png",
    "stadium": "Estadio Sheffield Wed.",
    "country": "Escocia",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-325",
    "name": "Swansea City",
    "shortName": "SWA",
    "logoUrl": "https://drop-assets.ea.com/images/60iyv11p84xXjnNC397ovE/a5a3cc893fef05eb845c27ffb893f510/l1960.png",
    "stadium": "Estadio Swansea City",
    "country": "Portugal",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-326",
    "name": "Defensa",
    "shortName": "DEF",
    "logoUrl": "https://drop-assets.ea.com/images/2ruznTVz4m1bXkEsnhla7D/0db1bdae3868aea37588eb26e97ecad8/l111710.png",
    "stadium": "Estadio Defensa",
    "country": "Argentina",
    "league": "Sudamericana",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-327",
    "name": "Qingdao W. Coast",
    "shortName": "QIN",
    "logoUrl": "https://drop-assets.ea.com/images/6mlVjdbMZtcXb0iKBo4FRV/37d77a83195cd206a7b844128fe48a4b/l131488.png",
    "stadium": "Estadio Qingdao W. Coast",
    "country": "Francia",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-328",
    "name": "SK Rapid",
    "shortName": "SK ",
    "logoUrl": "https://drop-assets.ea.com/images/1plGFaGzhM3VnKYc7vXWGP/e7dc121e48fd45ddb7610f73d054b9dd/l254.png",
    "stadium": "Estadio SK Rapid",
    "country": "Croacia",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-329",
    "name": "Grenoble Foot 38",
    "shortName": "GRE",
    "logoUrl": "https://drop-assets.ea.com/images/4Asb3sL7UoRZXXuhZsRUon/3e76800f052e0f8583c1065dd1dc2f43/l1805.png",
    "stadium": "Estadio Grenoble Foot 38",
    "country": "Francia",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-330",
    "name": "Yverdon-Sport FC",
    "shortName": "YVE",
    "logoUrl": "https://drop-assets.ea.com/images/1TYAzpX25UF6JKbTOgBG5F/664efd17d49f9b2ecbd452d565f1a816/Yverdon_Sport_FC.png",
    "stadium": "Estadio Yverdon-Sport FC",
    "country": "Francia",
    "league": "CSSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-331",
    "name": "Braunschweig",
    "shortName": "BRA",
    "logoUrl": "https://drop-assets.ea.com/images/5jkkWPIfk1u091NsmJkpj6/9415b9ec620b3f8e4ae41562abc0ca76/l110500.png",
    "stadium": "Estadio Braunschweig",
    "country": "Bosnia y Herzegovina",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-332",
    "name": "Birmingham City",
    "shortName": "BIR",
    "logoUrl": "https://drop-assets.ea.com/images/thYc5t6lm0FfJimcndqwM/8cbcaf66d7ee8cc1fc07a06f79a9d53b/l88.png",
    "stadium": "Estadio Birmingham City",
    "country": "Polonia",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-333",
    "name": "Módena",
    "shortName": "MÓD",
    "logoUrl": "https://drop-assets.ea.com/images/56YCIUSXyO8KvMgbtPfqju/d9f733d17fe14950b7bc3121dd69c494/l1744.png",
    "stadium": "Estadio Módena",
    "country": "Brasil",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-334",
    "name": "Kayserispor",
    "shortName": "KAY",
    "logoUrl": "https://drop-assets.ea.com/images/3TGo7Ce6EszOiy0MUreE5B/a2aafc442f982c91dce4c3f57fc4e486/l101020.png",
    "stadium": "Estadio Kayserispor",
    "country": "Guinea-Bissau",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-335",
    "name": "CF Montréal",
    "shortName": "CF ",
    "logoUrl": "https://drop-assets.ea.com/images/yzJi3vuvdF06K3QQVDO3p/85e2d179e30ce50d389956a5655359fd/l111139.png",
    "stadium": "Estadio CF Montréal",
    "country": "Uruguay",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-336",
    "name": "CD Tenerife",
    "shortName": "CD ",
    "logoUrl": "https://drop-assets.ea.com/images/3QoePXdKW0qGfgFqcLiq8i/73da852f8f581dace45dc53cef48ab0e/CD_Tenerife.png",
    "stadium": "Estadio CD Tenerife",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-337",
    "name": "Catanzaro",
    "shortName": "CAT",
    "logoUrl": "https://drop-assets.ea.com/images/5HmzPVK774cwOoV4xms9TZ/bbd44d2a20754034142b5545828a906a/l110908.png",
    "stadium": "Estadio Catanzaro",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-338",
    "name": "Qingdao Hainiu",
    "shortName": "QIN",
    "logoUrl": "https://drop-assets.ea.com/images/4oYjQqoUAWtBcNoPMtH3Ll/c9098a227c478f12be7e631c54ac33d3/l131173.png",
    "stadium": "Estadio Qingdao Hainiu",
    "country": "Brasil",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-339",
    "name": "Platense",
    "shortName": "PLA",
    "logoUrl": "https://drop-assets.ea.com/images/5MRmqHRNGOpLB6rt6afdQw/c27a9727c13d5e1fd465b8e91199b290/l112689.png",
    "stadium": "Estadio Platense",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-340",
    "name": "Bristol City",
    "shortName": "BRI",
    "logoUrl": "https://drop-assets.ea.com/images/6RU4ldBPffGH8fEGfh4Ih6/d6f96d29c4f7e4419c97687245f67853/l1919.png",
    "stadium": "Estadio Bristol City",
    "country": "Inglaterra",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-341",
    "name": "Bari",
    "shortName": "BAR",
    "logoUrl": "https://drop-assets.ea.com/images/7583xBpfKjFwiz2h4hUnqj/240ef956ef4a96cfd6e7bda43fd77dc0/l1848.png",
    "stadium": "Estadio Bari",
    "country": "Uruguay",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-342",
    "name": "Santa Clara",
    "shortName": "SAN",
    "logoUrl": "https://drop-assets.ea.com/images/53IEL5NTK7wsA5oFghZvg7/38e193b44a85f6ac65f7c95457abd1e7/l1438.png",
    "stadium": "Estadio Santa Clara",
    "country": "Portugal",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-343",
    "name": "Macarthur FC",
    "shortName": "MAC",
    "logoUrl": "https://drop-assets.ea.com/images/4eXAfWN4g2oTY1vWvWzAWY/fc4fec1716b1c16a3e22a58fe78fcb3b/l114604.png",
    "stadium": "Estadio Macarthur FC",
    "country": "Francia",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-344",
    "name": "Widzew Łódź",
    "shortName": "WID",
    "logoUrl": "https://drop-assets.ea.com/images/2Ie8sL2NlusGmUlqUOtcEM/d316808ffacd519d1eba8fb65d5e8c3f/l301.png",
    "stadium": "Estadio Widzew Łódź",
    "country": "Polonia",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-345",
    "name": "Preußen Münster",
    "shortName": "PRE",
    "logoUrl": "https://drop-assets.ea.com/images/6i72RcVa4hQK7EVOm2OpRz/eb2916e42bb88265b60051aa45ef2b97/l531.png",
    "stadium": "Estadio Preußen Münster",
    "country": "Holanda",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-346",
    "name": "Bodrum FK",
    "shortName": "BOD",
    "logoUrl": "https://drop-assets.ea.com/images/5uQXSnPFEEUt5XhRgnpBFU/5422243484b9370c38f319a4d22c838e/Bodrum_FK.png",
    "stadium": "Estadio Bodrum FK",
    "country": "Francia",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-347",
    "name": "Fürth",
    "shortName": "FÜR",
    "logoUrl": "https://drop-assets.ea.com/images/4W0novqbVToBCyguXyY0mJ/f987173c5a37354bd322196e35384689/l165.png",
    "stadium": "Estadio Fürth",
    "country": "Suecia",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-348",
    "name": "Jagiellonia",
    "shortName": "JAG",
    "logoUrl": "https://drop-assets.ea.com/images/1kEF1rQq7xxrkXVkXtB8jp/f0b4a69d28388a793c211ae6b7dc12f1/l110745.png",
    "stadium": "Estadio Jagiellonia",
    "country": "España",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-349",
    "name": "Sarmiento",
    "shortName": "SAR",
    "logoUrl": "https://drop-assets.ea.com/images/47krh9O79avKCp6PLgVGpZ/d9abdbed5fbdab376713418fe830fee8/l112713.png",
    "stadium": "Estadio Sarmiento",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-350",
    "name": "IFK Norrköping",
    "shortName": "IFK",
    "logoUrl": "https://drop-assets.ea.com/images/4GwGxFqkHVIBffBoXAd6iX/2db80b8973b27c633b978ca94f6b625c/l702.png",
    "stadium": "Estadio IFK Norrköping",
    "country": "Suecia",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-351",
    "name": "Antalyaspor",
    "shortName": "ANT",
    "logoUrl": "https://drop-assets.ea.com/images/3AVsa1ib8kBQEyEBNcK5yb/d22acf36ececca2c9d4bde6baa36d1b0/l741.png",
    "stadium": "Estadio Antalyaspor",
    "country": "Suecia",
    "league": "Trendyol Süper Lig",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-352",
    "name": "Jeonbuk Hyundai",
    "shortName": "JEO",
    "logoUrl": "https://drop-assets.ea.com/images/6IFYQ6ZaqQ2I9oIzFaouTx/1a1acfce338af628fcb049aa4514a260/l1477.png",
    "stadium": "Estadio Jeonbuk Hyundai",
    "country": "República de Corea",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-353",
    "name": "Málaga CF",
    "shortName": "MÁL",
    "logoUrl": "https://drop-assets.ea.com/images/6ulWIbWny6fRuOChCjNJBf/a5ee9d59be2725133e39b35c3057c332/l573.png",
    "stadium": "Estadio Málaga CF",
    "country": "Portugal",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-354",
    "name": "Cangzhou FC",
    "shortName": "CAN",
    "logoUrl": "https://drop-assets.ea.com/images/2wSulocPa31eCTCadbFPdv/565a109c4a8f9b381cb328a91c11be28/Cangzhou_FC.png",
    "stadium": "Estadio Cangzhou FC",
    "country": "RD Congo",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-355",
    "name": "OH Leuven",
    "shortName": "OH ",
    "logoUrl": "https://drop-assets.ea.com/images/BKrD9M2cbnE405KQhTSbs/63ee6b09efc556a3d9a5444805713ead/l100087.png",
    "stadium": "Estadio OH Leuven",
    "country": "Francia",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-356",
    "name": "Bengaluru FC",
    "shortName": "BEN",
    "logoUrl": "https://drop-assets.ea.com/images/6xvozr7ClvFB7EJWWuG52V/ceabe32816b130887e5eca01b5c0fbbc/l113302.png",
    "stadium": "Estadio Bengaluru FC",
    "country": "España",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-357",
    "name": "Suwon FC",
    "shortName": "SUW",
    "logoUrl": "https://drop-assets.ea.com/images/4SLceNzgPFcdaaUQv8IGDr/e18ae623940f7f113e5c61ce97178737/l112558.png",
    "stadium": "Estadio Suwon FC",
    "country": "Brasil",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-358",
    "name": "Górnik Zabrze",
    "shortName": "GÓR",
    "logoUrl": "https://drop-assets.ea.com/images/59QrkW1rixjVQvyLu7Hzol/61853fcdd34c038b0f47fcda5948e58f/l420.png",
    "stadium": "Estadio Górnik Zabrze",
    "country": "Alemania",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-359",
    "name": "Sporting KC",
    "shortName": "SPO",
    "logoUrl": "https://drop-assets.ea.com/images/13WhbvGLJR6rx38tqFKd30/5e09806843bc14115cd9bc4b77d09bca/l696.png",
    "stadium": "Estadio Sporting KC",
    "country": "México",
    "league": "MLS",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-360",
    "name": "SD Huesca",
    "shortName": "SD ",
    "logoUrl": "https://drop-assets.ea.com/images/C02W4JZIbiLlYbETzaGmM/d39bce57ad2552f86ac6c09ea40b16d5/l110839.png",
    "stadium": "Estadio SD Huesca",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-361",
    "name": "Atlético Tucumán",
    "shortName": "ATL",
    "logoUrl": "https://drop-assets.ea.com/images/6L3YkoD8cwQ5ui33qjJXS6/f906216d8c80b0c85ed3960c88568e56/l111708.png",
    "stadium": "Estadio Atlético Tucumán",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-362",
    "name": "Lech Poznań",
    "shortName": "LEC",
    "logoUrl": "https://drop-assets.ea.com/images/WBIzLOyoW9KwEgyyRGJQz/df42891efaa247a000c6a4ac5964472e/l873.png",
    "stadium": "Estadio Lech Poznań",
    "country": "Polonia",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-363",
    "name": "Burgos CF",
    "shortName": "BUR",
    "logoUrl": "https://drop-assets.ea.com/images/4d3jSKTVG38hvtaqAxroeB/8f50608a3c1e603ee7614ea2ce3149eb/l10846.png",
    "stadium": "Estadio Burgos CF",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-364",
    "name": "Rosenborg BK",
    "shortName": "ROS",
    "logoUrl": "https://drop-assets.ea.com/images/52tubMFrzz9FGkvJn6i2Pk/fc8586193e8a9652c33628067979deaf/l298.png",
    "stadium": "Estadio Rosenborg BK",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-365",
    "name": "KVC Westerlo",
    "shortName": "KVC",
    "logoUrl": "https://drop-assets.ea.com/images/ZmiA3Bp6LyA6c6zkfVlAG/5bd0db54214702e4380ff6544baa9d29/l681.png",
    "stadium": "Estadio KVC Westerlo",
    "country": "Ucrania",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-366",
    "name": "STVV",
    "shortName": "STV",
    "logoUrl": "https://drop-assets.ea.com/images/2QoYCL1jsyz3q5s1vOv5XG/b6ee322f1bb087d17f0a87b222a0992b/l680.png",
    "stadium": "Estadio STVV",
    "country": "Japón",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-367",
    "name": "IF Elfsborg",
    "shortName": "IF ",
    "logoUrl": "https://drop-assets.ea.com/images/2WJ0zQLfEbGtg0D0uitwee/301bcbd249aa1656c1fd02c53ab7c22f/l700.png",
    "stadium": "Estadio IF Elfsborg",
    "country": "Kosovo",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-368",
    "name": "CD Castellón",
    "shortName": "CD ",
    "logoUrl": "https://drop-assets.ea.com/images/7c8oo7wtd4Qkrh8FqfWKPU/4b792fa122f16e852325f08355920bf3/l100852.png",
    "stadium": "Estadio CD Castellón",
    "country": "Irán",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-369",
    "name": "Magdeburg",
    "shortName": "MAG",
    "logoUrl": "https://drop-assets.ea.com/images/r8y1kfsEGix5QFM8dzrKo/650f9d82fa7b42ba04e94936547fa290/l110588.png",
    "stadium": "Estadio Magdeburg",
    "country": "Turquía",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-370",
    "name": "Jeju United",
    "shortName": "JEJ",
    "logoUrl": "https://drop-assets.ea.com/images/Kq8ars2etTVcUU5qVfBvQ/61ef2bd967a6d543b0b65518a99dd36c/l1478.png",
    "stadium": "Estadio Jeju United",
    "country": "Brasil",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-371",
    "name": "Cesena",
    "shortName": "CES",
    "logoUrl": "https://drop-assets.ea.com/images/2crKwDXMpJoZ6DZqDas0vs/e29e757956a2d80670d388a18e1bb687/l110915.png",
    "stadium": "Estadio Cesena",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-372",
    "name": "Wolfsberger AC",
    "shortName": "WOL",
    "logoUrl": "https://drop-assets.ea.com/images/3je630Jyv9mb9KEvwkSUhx/015c05bf33a512f1ae8d3cbd838381cf/l111822.png",
    "stadium": "Estadio Wolfsberger AC",
    "country": "Austria",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-373",
    "name": "Hammarby",
    "shortName": "HAM",
    "logoUrl": "https://drop-assets.ea.com/images/4SIO9ELhp2ZyXu773gfOPC/b364b64f9447953b11745bbbf41ffb11/l708.png",
    "stadium": "Estadio Hammarby",
    "country": "Suecia",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-374",
    "name": "Brescia",
    "shortName": "BRE",
    "logoUrl": "https://drop-assets.ea.com/images/2HUlKV0oKVbsOFcIIInNee/fc18c99c3243e058cc11a8c16e1f04b5/Brescia.png",
    "stadium": "Estadio Brescia",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-375",
    "name": "Hibernian",
    "shortName": "HIB",
    "logoUrl": "https://drop-assets.ea.com/images/6o5W9nuyQPZWVQ7qcjIURb/8481fa31adff16242528f72db25befe0/l81.png",
    "stadium": "Estadio Hibernian",
    "country": "Australia",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-376",
    "name": "Derby County",
    "shortName": "DER",
    "logoUrl": "https://drop-assets.ea.com/images/39mimPZHdodG2eh5BaPQ8r/d4f0d2a9fe2f1c2bc7aee7d87369ddb0/l91.png",
    "stadium": "Estadio Derby County",
    "country": "República de Irlanda",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-377",
    "name": "Albacete BP",
    "shortName": "ALB",
    "logoUrl": "https://drop-assets.ea.com/images/CMKxSo1AqK54ojnSmDtdz/d35315460e7517f85fce1daa3966fe44/l1854.png",
    "stadium": "Estadio Albacete BP",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-378",
    "name": "FC Winterthur",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/u5eiPKomGMlLJi88SzYGZ/31ec237a7663daa00cf16acab045d5b7/l1713.png",
    "stadium": "Estadio FC Winterthur",
    "country": "Suiza",
    "league": "CSSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-379",
    "name": "East Bengal",
    "shortName": "EAS",
    "logoUrl": "https://drop-assets.ea.com/images/6TVbAxNBHS6Q78Q3x5DbUM/d2badba165890ee2d0f970d3b2114f45/l111629.png",
    "stadium": "Estadio East Bengal",
    "country": "Grecia",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-380",
    "name": "AVS Futebol SAD",
    "shortName": "AVS",
    "logoUrl": "https://drop-assets.ea.com/images/1Tgaed7XvkeGtmI6LXEGeU/dc19c669908598ebec15e8db0032c3c1/l131463.png",
    "stadium": "Estadio AVS Futebol SAD",
    "country": "Brasil",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-381",
    "name": "SZ Peng City",
    "shortName": "SZ ",
    "logoUrl": "https://drop-assets.ea.com/images/5KiIrGyhUjQDOp1E6lBAEE/caeacf9bc5632b75fd052e244ebe03e4/l131487.png",
    "stadium": "Estadio SZ Peng City",
    "country": "Serbia",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-382",
    "name": "Wuhan Three Towns",
    "shortName": "WUH",
    "logoUrl": "https://drop-assets.ea.com/images/70vfYCygFDqKB0b59X9CQc/84c4554dff2762f0f8ffdb0dca7f4acf/l116361.png",
    "stadium": "Estadio Wuhan Three Towns",
    "country": "Portugal",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-383",
    "name": "Tigre",
    "shortName": "TIG",
    "logoUrl": "https://drop-assets.ea.com/images/1YnAgAGiL7YIIUPy20mcnh/61c15cbad1d5dd3e65bb186bad72bd00/l111715.png",
    "stadium": "Estadio Tigre",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-384",
    "name": "Huddersfield",
    "shortName": "HUD",
    "logoUrl": "https://drop-assets.ea.com/images/1oUovqvMwD3jv3ZU5yMtib/55d2831929dc314e398e05b786f15927/l1939.png",
    "stadium": "Estadio Huddersfield",
    "country": "Polonia",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-385",
    "name": "Gwangju FC",
    "shortName": "GWA",
    "logoUrl": "https://drop-assets.ea.com/images/4Qf8axdWj9Nv0tmzCvL3nH/e230f6ee7abf149b74f57e0f51b87083/l112258.png",
    "stadium": "Estadio Gwangju FC",
    "country": "República de Corea",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-386",
    "name": "FC Luzern",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/piGUNzgSoQ3OMqxeGH3Ps/02c80916fdcd0aeeb7ba4499d541b0cd/l897.png",
    "stadium": "Estadio FC Luzern",
    "country": "Alemania",
    "league": "CSSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-387",
    "name": "Meizhou Hakka",
    "shortName": "MEI",
    "logoUrl": "https://drop-assets.ea.com/images/YrYNrtBWtpmo5rsmF8II5/af3d5e5859981a6b6343d19b34cebb1c/l114628.png",
    "stadium": "Estadio Meizhou Hakka",
    "country": "Montenegro",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-388",
    "name": "FC Sion",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/63kMHO9IrWeNtfmZE8kQyh/3e36c32e6401bec21e920d09f99da570/l110770.png",
    "stadium": "Estadio FC Sion",
    "country": "Suiza",
    "league": "CSSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-389",
    "name": "Cosenza",
    "shortName": "COS",
    "logoUrl": "https://drop-assets.ea.com/images/olTC0J1No0YuWIIf12ZiT/a84caec3fa517c54b44fb98af67979f1/Cosenza.png",
    "stadium": "Estadio Cosenza",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-390",
    "name": "SC Paderborn 07",
    "shortName": "SC ",
    "logoUrl": "https://drop-assets.ea.com/images/4fDk15LlgEs7hSd09FuuN6/53b95eecea56c405ffd714609abfc63d/l10030.png",
    "stadium": "Estadio SC Paderborn 07",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-391",
    "name": "Barracas Central",
    "shortName": "BAR",
    "logoUrl": "https://drop-assets.ea.com/images/lNLvLLy1oSZjVQSbogAtj/f71701cd9c83992564b9261d03044714/l113044.png",
    "stadium": "Estadio Barracas Central",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-392",
    "name": "GC Zürich",
    "shortName": "GC ",
    "logoUrl": "https://drop-assets.ea.com/images/2EIRi3oDJupHKu78fzgxU8/e15cac36cde472d8d97cb0eaba396d4f/l322.png",
    "stadium": "Estadio GC Zürich",
    "country": "Camerún",
    "league": "CSSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-393",
    "name": "Aberdeen",
    "shortName": "ABE",
    "logoUrl": "https://drop-assets.ea.com/images/1tNvCEhZUplbj7hMJ6z0dW/e374ae0cfa5fe643725121fc6674d5a1/l77.png",
    "stadium": "Estadio Aberdeen",
    "country": "Escocia",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-394",
    "name": "Legia Warszawa",
    "shortName": "LEG",
    "logoUrl": "https://drop-assets.ea.com/images/443RsYqUHR8qQ7mewrt7sU/10b64536075942d7dfaceb2432e42198/l1871.png",
    "stadium": "Estadio Legia Warszawa",
    "country": "Camerún",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-395",
    "name": "Brisbane Roar",
    "shortName": "BRI",
    "logoUrl": "https://drop-assets.ea.com/images/2L67iwPzC0MBqm5YQv0J57/c3e6be7ea654273f0a5b628c4b305dad/l111395.png",
    "stadium": "Estadio Brisbane Roar",
    "country": "República de Irlanda",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-396",
    "name": "Randers FC",
    "shortName": "RAN",
    "logoUrl": "https://drop-assets.ea.com/images/7Bt0W4NrUfLwgEiF7q4MS0/f230d222ede6924c693e6ee66ee9ef5e/l1786.png",
    "stadium": "Estadio Randers FC",
    "country": "Dinamarca",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-397",
    "name": "USL Dunkerque",
    "shortName": "USL",
    "logoUrl": "https://drop-assets.ea.com/images/Yl41sv4yRyM5iHXVwfxOE/b0f38acf2b93ae20b1c35c185467056a/l111276.png",
    "stadium": "Estadio USL Dunkerque",
    "country": "Francia",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-398",
    "name": "Adelaide United",
    "shortName": "ADE",
    "logoUrl": "https://drop-assets.ea.com/images/1dq94M4USkNg6QCzT74whP/3f7c658775ac5da3389a3a222a40ed46/l111393.png",
    "stadium": "Estadio Adelaide United",
    "country": "Holanda",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-399",
    "name": "Farul Constanța",
    "shortName": "FAR",
    "logoUrl": "https://drop-assets.ea.com/images/4Sc2sgxP3GNX4aS6CytoVw/a320b8cac3d983d02fb57aebe4dcce8b/l110075.png",
    "stadium": "Estadio Farul Constanța",
    "country": "Rumanía",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-400",
    "name": "Nacional",
    "shortName": "NAC",
    "logoUrl": "https://drop-assets.ea.com/images/4F0sgnOW3XygWtEbF65jyt/2a47941e79d1b79f5ca49f3a853ded2b/l1891.png",
    "stadium": "Estadio Nacional",
    "country": "Portugal",
    "league": "Liga Portugal",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-401",
    "name": "TSV Hartberg",
    "shortName": "TSV",
    "logoUrl": "https://drop-assets.ea.com/images/1DEn9IDotaqW0fhD5V5PXH/d58834149c60c4af50df444095d911a1/l2017.png",
    "stadium": "Estadio TSV Hartberg",
    "country": "Kosovo",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-402",
    "name": "Odisha FC",
    "shortName": "ODI",
    "logoUrl": "https://drop-assets.ea.com/images/6P8vYOw02ST7HEE0SSj9lR/aae0ffc32d3c1f2c1bf7153056226af4/l113257.png",
    "stadium": "Estadio Odisha FC",
    "country": "Marruecos",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-403",
    "name": "Cittadella",
    "shortName": "CIT",
    "logoUrl": "https://drop-assets.ea.com/images/4v92ngeTYfiQ6HQLGWGmOa/f2391120e569c0a5d2964dfd4530de44/Cittadella.png",
    "stadium": "Estadio Cittadella",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-404",
    "name": "Oxford Utd",
    "shortName": "OXF",
    "logoUrl": "https://drop-assets.ea.com/images/3eeltV7S1s5TyCJbM4FhXN/af665b7031645d84f4e71926b4ee9c32/l1951.png",
    "stadium": "Estadio Oxford Utd",
    "country": "Inglaterra",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-405",
    "name": "Zagłębie Lubin",
    "shortName": "ZAG",
    "logoUrl": "https://drop-assets.ea.com/images/5ZSfiEbhAgF9DnZE2v245H/ae8761faff6674a7d98c49e88c9febbe/l110749.png",
    "stadium": "Estadio Zagłębie Lubin",
    "country": "Polonia",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-406",
    "name": "Red Star FC",
    "shortName": "RED",
    "logoUrl": "https://drop-assets.ea.com/images/3ILbnHvzrDNkKnDT0xyb9S/9bb32695ee7684f41a790bc5ba84d704/l111273.png",
    "stadium": "Estadio Red Star FC",
    "country": "Francia",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-407",
    "name": "Wrexham",
    "shortName": "WRE",
    "logoUrl": "https://drop-assets.ea.com/images/27xBPh99UFnzjmeNtXu5Gm/fc4ec58e1b91de3cbca90ab18f802320/l1947.png",
    "stadium": "Estadio Wrexham",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-408",
    "name": "CD Mirandés",
    "shortName": "CD ",
    "logoUrl": "https://drop-assets.ea.com/images/2eOpibQ0nadvrKSF32pz22/06fdce212b366014676dcec245c6d8a0/l110069.png",
    "stadium": "Estadio CD Mirandés",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-409",
    "name": "SK Brann",
    "shortName": "SK ",
    "logoUrl": "https://drop-assets.ea.com/images/6HVfKkfvTPIuWemKgNki2G/834ef506dc118a7827447832138a36cf/l919.png",
    "stadium": "Estadio SK Brann",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-410",
    "name": "Amiens SC",
    "shortName": "AMI",
    "logoUrl": "https://drop-assets.ea.com/images/2VovpiZhmqBS8iFklO7V8J/ea020a3af84fd0cf589b886db6a2ba87/l1816.png",
    "stadium": "Estadio Amiens SC",
    "country": "Malí",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-411",
    "name": "CD Eldense",
    "shortName": "CD ",
    "logoUrl": "https://drop-assets.ea.com/images/6th6RtsUwVVdJICekFNiKz/b9df3dbc02be7ecc4ff909bc7db68c3a/CD_Eldense.png",
    "stadium": "Estadio CD Eldense",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-412",
    "name": "FC Rapid 1923",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/7zYBAT6AQqBcSaMoBSxK3O/d7b13ee113e46c2cc1f21508bcefd677/l310.png",
    "stadium": "Estadio FC Rapid 1923",
    "country": "Eslovaquia",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-413",
    "name": "Central Coast",
    "shortName": "CEN",
    "logoUrl": "https://drop-assets.ea.com/images/3N0yryiXeNaVBVB09VbbAi/857a9106836a19defa4ca97eeb95d402/l111396.png",
    "stadium": "Estadio Central Coast",
    "country": "Vanuatu",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-414",
    "name": "Pau FC",
    "shortName": "PAU",
    "logoUrl": "https://drop-assets.ea.com/images/1YG9aYrroJmeGcJeby3OeF/37a3318824c26226ac1591aa7a331de9/l110321.png",
    "stadium": "Estadio Pau FC",
    "country": "Senegal",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-415",
    "name": "Melb. Victory",
    "shortName": "MEL",
    "logoUrl": "https://drop-assets.ea.com/images/38KjMIBvVdG6GBt4VEhMk2/60a666b7ff0cd770a61077d1a76296b4/l111397.png",
    "stadium": "Estadio Melb. Victory",
    "country": "Francia",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-416",
    "name": "FC Cartagena",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/1tAPQUQ5vj3knXNI72SrhH/3ab0204975e0580ec927c7c5e7a81016/FC_Cartagena.png",
    "stadium": "Estadio FC Cartagena",
    "country": "Argentina",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-417",
    "name": "FC Univ. Cluj",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/3tTKGYE6jEtvPj18LK7YxS/d7971ccc4409962d72a1d03ff6ac688a/l110751.png",
    "stadium": "Estadio FC Univ. Cluj",
    "country": "Rumanía",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-418",
    "name": "Piast Gliwice",
    "shortName": "PIA",
    "logoUrl": "https://drop-assets.ea.com/images/1L5eHon1T9UnhuzoCNGydZ/df84d30c756a068e1a81d15274dbce63/l111086.png",
    "stadium": "Estadio Piast Gliwice",
    "country": "Portugal",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-419",
    "name": "Central Córdoba",
    "shortName": "CEN",
    "logoUrl": "https://drop-assets.ea.com/images/53joER8sL1FzOrPsRJKonW/eef48828b4d1dc8e7a008e6bf676b6bd/l112965.png",
    "stadium": "Estadio Central Córdoba",
    "country": "Uruguay",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-420",
    "name": "AIK",
    "shortName": "AIK",
    "logoUrl": "https://drop-assets.ea.com/images/9rqxOK5IQfDBdt17lJOHP/839b0c3ab7be3e45f252070b5031e442/l433.png",
    "stadium": "Estadio AIK",
    "country": "Suecia",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-421",
    "name": "Laval MFC",
    "shortName": "LAV",
    "logoUrl": "https://drop-assets.ea.com/images/1uQi5QSSoswIWIw5Tv5AxT/b6f97ad3f4666db554816a662bceb659/l1814.png",
    "stadium": "Estadio Laval MFC",
    "country": "Malí",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-422",
    "name": "Arminia Bielefeld",
    "shortName": "ARM",
    "logoUrl": "https://drop-assets.ea.com/images/2gLhxSVTf7A6qftdVu2xhH/5b1da3466b0e54cb6d6c285c50a817c8/l159.png",
    "stadium": "Estadio Arminia Bielefeld",
    "country": "Nigeria",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-423",
    "name": "Stal Mielec",
    "shortName": "STA",
    "logoUrl": "https://drop-assets.ea.com/images/4xYrNOOhGDEskSuYgoCVUg/9d0a0e74d920d2f1cab90c683dba0b08/Stal_Mielec.png",
    "stadium": "Estadio Stal Mielec",
    "country": "Bielorrusia",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-424",
    "name": "Silkeborg IF",
    "shortName": "SIL",
    "logoUrl": "https://drop-assets.ea.com/images/UO62xokBPFGoQcmT14HpB/7e16d72acbbbf8b97534da7149b1dc9f/l270.png",
    "stadium": "Estadio Silkeborg IF",
    "country": "Perú",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-425",
    "name": "SCR Altach",
    "shortName": "SCR",
    "logoUrl": "https://drop-assets.ea.com/images/6XrnYZ1ebux42Vvj5ec41e/f466b06a14462b8356599e9f6d597965/l15009.png",
    "stadium": "Estadio SCR Altach",
    "country": "Macedonia del Norte",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-426",
    "name": "Wehen Wiesbaden",
    "shortName": "WEH",
    "logoUrl": "https://drop-assets.ea.com/images/7FXx2qT0VWVDtWI3RGwg53/452dd68a0c3020eca8fb306013470ff4/l492.png",
    "stadium": "Estadio Wehen Wiesbaden",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-427",
    "name": "CFR 1907 Cluj",
    "shortName": "CFR",
    "logoUrl": "https://drop-assets.ea.com/images/4GGeKJ0EhuYo0mkVUsQwZ8/ba2dff73d4b4ce299ccdfbf9ea89d6ed/l114385.png",
    "stadium": "Estadio CFR 1907 Cluj",
    "country": "Grecia",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-428",
    "name": "Perth Glory",
    "shortName": "PER",
    "logoUrl": "https://drop-assets.ea.com/images/1F2HZbGOTYXiGtCdVcZncA/679daccdcbccbc76c661e7698798b0df/l111399.png",
    "stadium": "Estadio Perth Glory",
    "country": "Australia",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-429",
    "name": "FC Hansa Rostock",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/7ms0pZHujSy83ekKMWklbT/50181b683906caa28cbaf0953ea1bcb3/l27.png",
    "stadium": "Estadio FC Hansa Rostock",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-430",
    "name": "Reading",
    "shortName": "REA",
    "logoUrl": "https://drop-assets.ea.com/images/7z6eAzQJfM3BN5sWGAC1Av/8ab8867095f16213018d48ff48746b02/l1793.png",
    "stadium": "Estadio Reading",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-431",
    "name": "Bolton",
    "shortName": "BOL",
    "logoUrl": "https://drop-assets.ea.com/images/6oJyD2lAk6pX8eU3Ug93bp/eba08c6a23a5a06deea545634c3977ae/l4.png",
    "stadium": "Estadio Bolton",
    "country": "Portugal",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-432",
    "name": "Mantova",
    "shortName": "MAN",
    "logoUrl": "https://drop-assets.ea.com/images/3lfxnCVXglHBKYae9P3kTE/640c6ff64bf923b5cf201018f6ae1444/l111433.png",
    "stadium": "Estadio Mantova",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-433",
    "name": "IFK Göteborg",
    "shortName": "IFK",
    "logoUrl": "https://drop-assets.ea.com/images/5QWuNo8IqfyvCSoMcLs0vG/2f026ba3ee0883a9f32f4d2d3c0351da/l319.png",
    "stadium": "Estadio IFK Göteborg",
    "country": "Dinamarca",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-434",
    "name": "Ś. Wrocław",
    "shortName": "Ś. ",
    "logoUrl": "https://drop-assets.ea.com/images/6dbFhCxA0OWu6Ue3GE5YT6/043e492c5688f5b7896ec1c64aee5152/_l_sk_Wroc_aw.png",
    "stadium": "Estadio Ś. Wrocław",
    "country": "Rumanía",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-435",
    "name": "FC Ingolstadt 04",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/55PlXUgUtdd15UCGB4zKGM/e191864a378ea7ba4e9e05ca5ab968d9/l111239.png",
    "stadium": "Estadio FC Ingolstadt 04",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-436",
    "name": "Portsmouth",
    "shortName": "POR",
    "logoUrl": "https://drop-assets.ea.com/images/35j8CtwBupwZBahDGdcL5h/fef1a934e4cdacb74a5c7598535b1e82/l1790.png",
    "stadium": "Estadio Portsmouth",
    "country": "Inglaterra",
    "league": "EFL Championship",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-437",
    "name": "Wanderers",
    "shortName": "WAN",
    "logoUrl": "https://drop-assets.ea.com/images/6voyUT7bxYCGhlQac4lc9R/447639213b021fe926c345a782b711f5/l112427.png",
    "stadium": "Estadio Wanderers",
    "country": "Australia",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-438",
    "name": "Charlton Athl.",
    "shortName": "CHA",
    "logoUrl": "https://drop-assets.ea.com/images/nmdGMjwOVwYQdxS4jHNQS/2842b6831792855efe388bad0ca94640/l89.png",
    "stadium": "Estadio Charlton Athl.",
    "country": "Escocia",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-439",
    "name": "St. Johnstone",
    "shortName": "ST.",
    "logoUrl": "https://drop-assets.ea.com/images/3Cee1HAzJqwrkkp4T6yxcx/3e7b40d482751569ddb93ed26575f58b/St._Johnstone.png",
    "stadium": "Estadio St. Johnstone",
    "country": "República de Irlanda",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-440",
    "name": "ES Troyes AC",
    "shortName": "ES ",
    "logoUrl": "https://drop-assets.ea.com/images/1gUmI4CkMmp3PmiHa5TKwK/bc522d6a337aa0ca277222c0d315caa6/l294.png",
    "stadium": "Estadio ES Troyes AC",
    "country": "Francia",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-441",
    "name": "Rotherham Utd",
    "shortName": "ROT",
    "logoUrl": "https://drop-assets.ea.com/images/2udXUKPzXwW4kUrzd1628Y/a5d91aa3a8fe71c21ae38bea13fb3143/l1797.png",
    "stadium": "Estadio Rotherham Utd",
    "country": "Jamaica",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-442",
    "name": "Mohun Bagan SG",
    "shortName": "MOH",
    "logoUrl": "https://drop-assets.ea.com/images/16RelXbaeJAT6iOsEbIOUc/70eb0bca2ceda3464af4d5a61ab0d4df/l113146.png",
    "stadium": "Estadio Mohun Bagan SG",
    "country": "Australia",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-443",
    "name": "K. Beerschot VA",
    "shortName": "K. ",
    "logoUrl": "https://drop-assets.ea.com/images/5TZN6OQIexCSsViu681BY2/1300443126cc04ac2e7407c8ed258644/K._Beerschot_VA.png",
    "stadium": "Estadio K. Beerschot VA",
    "country": "Francia",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-444",
    "name": "VfL Osnabrück",
    "shortName": "VFL",
    "logoUrl": "https://drop-assets.ea.com/images/2E6RCXvRcpwm7RrJS48Bz9/a588ef29082d45f5dc541061a65ed036/l487.png",
    "stadium": "Estadio VfL Osnabrück",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-445",
    "name": "Jamshedpur FC",
    "shortName": "JAM",
    "logoUrl": "https://drop-assets.ea.com/images/t6ASsk2XBevasTv54D1RM/4db226032854a4958868c5cad8f22cf6/l114168.png",
    "stadium": "Estadio Jamshedpur FC",
    "country": "Nigeria",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-446",
    "name": "Grazer AK",
    "shortName": "GRA",
    "logoUrl": "https://drop-assets.ea.com/images/2PBNrVN0FGIERqTpIHcMyr/674f31ad65967fa853610e0214f9be1e/l113616.png",
    "stadium": "Estadio Grazer AK",
    "country": "Croacia",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-447",
    "name": "Lillestrøm SK",
    "shortName": "LIL",
    "logoUrl": "https://drop-assets.ea.com/images/5kYBlmudzbUvVN0QZCjhh2/113e458e8e7bac4757b58535ca62ba9c/Lillestr_m_SK.png",
    "stadium": "Estadio Lillestrøm SK",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-448",
    "name": "Rot-Weiss Essen",
    "shortName": "ROT",
    "logoUrl": "https://drop-assets.ea.com/images/4oDtlTOSwniQYuMypK4x4V/d8f8b98515d083f9ae5e12837516a108/l526.png",
    "stadium": "Estadio Rot-Weiss Essen",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-449",
    "name": "Odds BK",
    "shortName": "ODD",
    "logoUrl": "https://drop-assets.ea.com/images/J3h7JFHK55y5iXCCynTvv/1c810c75040a396cb54e5f84dcc6e03f/Odds_BK.png",
    "stadium": "Estadio Odds BK",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-450",
    "name": "Dynamo Dresden",
    "shortName": "DYN",
    "logoUrl": "https://drop-assets.ea.com/images/2EwqkMMPwGSIcGncshS2vH/24b30e43b00953a10a1de207293b47af/l503.png",
    "stadium": "Estadio Dynamo Dresden",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-451",
    "name": "Dep. Riestra",
    "shortName": "DEP",
    "logoUrl": "https://drop-assets.ea.com/images/2ex78lFGr7LWTHEzFyJIp/a8c6b6106d0127de786f1bc92bc6fdf3/l115472.png",
    "stadium": "Estadio Dep. Riestra",
    "country": "Argentina",
    "league": "Primera División",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-452",
    "name": "SV Elversberg",
    "shortName": "SV ",
    "logoUrl": "https://drop-assets.ea.com/images/72k9OuLJJMEyPfKbRGM9HF/5410d9a7186e29cecdf7dfb8d3316ec3/l580.png",
    "stadium": "Estadio SV Elversberg",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-453",
    "name": "Sarpsborg 08",
    "shortName": "SAR",
    "logoUrl": "https://drop-assets.ea.com/images/40G8rPL5eEBBeswe9jZMph/1e584282e91aa80e9985fc1f34710148/l112199.png",
    "stadium": "Estadio Sarpsborg 08",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-454",
    "name": "Nantong Zhiyun FC",
    "shortName": "NAN",
    "logoUrl": "https://drop-assets.ea.com/images/5VrjVG7PUShhzoUt2aUeSh/e7f08891da29118d36dbfcba8020b7a9/Nantong_Zhiyun_FC.png",
    "stadium": "Estadio Nantong Zhiyun FC",
    "country": "Sierra Leona",
    "league": "CSL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-455",
    "name": "Jahn Regensburg",
    "shortName": "JAH",
    "logoUrl": "https://drop-assets.ea.com/images/3YQmf9G1OH9B4mePuBZV83/097ecbe1f24b072b5cebff7f130d1fb8/l543.png",
    "stadium": "Estadio Jahn Regensburg",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-456",
    "name": "FCV Dender EH",
    "shortName": "FCV",
    "logoUrl": "https://drop-assets.ea.com/images/29uq8Oz2wV1B7Oi9DLauT/cb8b630b2977b5fc4782e58fc3b6a245/l537.png",
    "stadium": "Estadio FCV Dender EH",
    "country": "República Checa",
    "league": "1A Pro League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-457",
    "name": "Wycombe",
    "shortName": "WYC",
    "logoUrl": "https://drop-assets.ea.com/images/2n0OJt5rodbleQw7Qv6RZ8/a29bf0cb08a86484d328a2f17ff7018d/l1933.png",
    "stadium": "Estadio Wycombe",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-458",
    "name": "Gangwon FC",
    "shortName": "GAN",
    "logoUrl": "https://drop-assets.ea.com/images/3KurW9J2AdOMwTUZ0Sa4jz/49febdd62ab257191e22008c6c79c4b9/l112115.png",
    "stadium": "Estadio Gangwon FC",
    "country": "República de Corea",
    "league": "K League 1",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-459",
    "name": "Viborg FF",
    "shortName": "VIB",
    "logoUrl": "https://drop-assets.ea.com/images/4odfZtCIfVBYUid9sYvntL/0755873274fd3cbd7545118235cdff58/l1443.png",
    "stadium": "Estadio Viborg FF",
    "country": "Dinamarca",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-460",
    "name": "Austria Klagenfurt",
    "shortName": "AUS",
    "logoUrl": "https://drop-assets.ea.com/images/aJCQJ1oNTKN1mab9D7vaq/c2103e79b25974c0d36515c8241336a3/Austria_Klagenfurt.png",
    "stadium": "Estadio Austria Klagenfurt",
    "country": "Austria",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-461",
    "name": "AC Ajaccio",
    "shortName": "AC ",
    "logoUrl": "https://drop-assets.ea.com/images/4cbX6Uwxa2qqF3VXs0WTZb/2ff99d7aa11adbc9ce6e755c265730a5/AC_Ajaccio.png",
    "stadium": "Estadio AC Ajaccio",
    "country": "Francia",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-462",
    "name": "Sepsi OSK",
    "shortName": "SEP",
    "logoUrl": "https://drop-assets.ea.com/images/3io8hDLMyUavXqz1MkMphC/1c17587dfc09746bfabb96aea9354bd9/Sepsi_OSK.png",
    "stadium": "Estadio Sepsi OSK",
    "country": "Japón",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-463",
    "name": "GKS Katowice",
    "shortName": "GKS",
    "logoUrl": "https://drop-assets.ea.com/images/2IEQ6ZRXOPC5uOICdTvJhQ/3a3cc78ffe5389b5bc5c89930b7c5331/l110206.png",
    "stadium": "Estadio GKS Katowice",
    "country": "Polonia",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-464",
    "name": "Peterborough",
    "shortName": "PET",
    "logoUrl": "https://drop-assets.ea.com/images/7SATDSx19Og4re9mLkLxL/11129628077d3e05ab6ffd39f3789f86/l1938.png",
    "stadium": "Estadio Peterborough",
    "country": "Ghana",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-465",
    "name": "Motor Lublin",
    "shortName": "MOT",
    "logoUrl": "https://drop-assets.ea.com/images/4H5EHthTHhlNLCDXStMJAr/bf4615908847e6e0a27f27f11718f925/l111097.png",
    "stadium": "Estadio Motor Lublin",
    "country": "España",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-466",
    "name": "Carrarese Calcio",
    "shortName": "CAR",
    "logoUrl": "https://drop-assets.ea.com/images/2YkDCKdGeHKrUq3YW2X3ec/e09204340a7493925a8cfa7a435e4550/l112493.png",
    "stadium": "Estadio Carrarese Calcio",
    "country": "Argentina",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-467",
    "name": "FK Haugesund",
    "shortName": "FK ",
    "logoUrl": "https://drop-assets.ea.com/images/5KTk3xyhtL99u4bXnpPH7V/651e4e1b09ed52e8e6cac15b7f20c08e/l1463.png",
    "stadium": "Estadio FK Haugesund",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-468",
    "name": "Strømsgodset IF",
    "shortName": "STR",
    "logoUrl": "https://drop-assets.ea.com/images/7754YouKSxBVDtCU3t1KrQ/cf47a81deb3d45571ec77fdac4fb0da5/l922.png",
    "stadium": "Estadio Strømsgodset IF",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-469",
    "name": "WSG Tirol",
    "shortName": "WSG",
    "logoUrl": "https://drop-assets.ea.com/images/4S9E0UbWsYBOGm5gRR7K87/53316052683af0711b2e7854ebdccf80/l15040.png",
    "stadium": "Estadio WSG Tirol",
    "country": "Austria",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-470",
    "name": "Cracovia",
    "shortName": "CRA",
    "logoUrl": "https://drop-assets.ea.com/images/6E8N9b2s70agwQByMJTKqG/36e05f098d5346e94d6e73923bb44e16/l110747.png",
    "stadium": "Estadio Cracovia",
    "country": "Holanda",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-471",
    "name": "KFUM-Kameratene",
    "shortName": "KFU",
    "logoUrl": "https://drop-assets.ea.com/images/3cV5WgcvHVGzEZ9LqVfmNq/c0d44c60346840f0378efc7329c190da/l131491.png",
    "stadium": "Estadio KFUM-Kameratene",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-472",
    "name": "FC Martigues",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/55u4bAmUioHheOMfhT2W3e/166f7f0c09d6aa1a9ba78ba2eb8c86ca/FC_Martigues.png",
    "stadium": "Estadio FC Martigues",
    "country": "Marruecos",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-473",
    "name": "Mansfield Town",
    "shortName": "MAN",
    "logoUrl": "https://drop-assets.ea.com/images/6BOyMmtoDRyxyaRer9IAvR/62404bbe280dc12629691fcd613b54ea/l1940.png",
    "stadium": "Estadio Mansfield Town",
    "country": "Australia",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-474",
    "name": "Punjab FC",
    "shortName": "PUN",
    "logoUrl": "https://drop-assets.ea.com/images/1PbIc518pM2MbOIT18ZmdO/8c6071d53b475aff1bd1683a36227236/l115202.png",
    "stadium": "Estadio Punjab FC",
    "country": "Noruega",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-475",
    "name": "Well. Phoenix",
    "shortName": "WEL",
    "logoUrl": "https://drop-assets.ea.com/images/3hYzlopzcMBoUTlEDG65u4/d5ed33e9573dd1f979420c44311e2c9e/l111766.png",
    "stadium": "Estadio Well. Phoenix",
    "country": "Nueva Zelanda",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-476",
    "name": "En Avant Guingamp",
    "shortName": "EN ",
    "logoUrl": "https://drop-assets.ea.com/images/5TlAEVXeshEAAcBMLKCE0I/1326792214fde110c65b6bbbf541b7ef/l62.png",
    "stadium": "Estadio En Avant Guingamp",
    "country": "Francia",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-477",
    "name": "SV Waldhof",
    "shortName": "SV ",
    "logoUrl": "https://drop-assets.ea.com/images/70xHuX7sLHfnC1D6GovGpx/b1d02eac6cb2de754ed1a23df7cc91bd/l110532.png",
    "stadium": "Estadio SV Waldhof",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-478",
    "name": "FC Dinamo 1948",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/72vt49KHWLN6ItNQcltprs/b55156b6acee218890db1ab7613ea04b/l100757.png",
    "stadium": "Estadio FC Dinamo 1948",
    "country": "Togo",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-479",
    "name": "Shamrock Rovers",
    "shortName": "SHA",
    "logoUrl": "https://drop-assets.ea.com/images/3bV6HnN1K0U4vLoFw601V5/34d97579209f0218fe532d737a577bd4/l306.png",
    "stadium": "Estadio Shamrock Rovers",
    "country": "República de Irlanda",
    "league": "SSE Airtricity PD",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-480",
    "name": "SC Oțelul Galați",
    "shortName": "SC ",
    "logoUrl": "https://drop-assets.ea.com/images/3KVDvXdWqSKXUV8rBx5FNc/44b16ca4fbaa2430b02bec88d31b485e/l110072.png",
    "stadium": "Estadio SC Oțelul Galați",
    "country": "Italia",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-481",
    "name": "Vejle Boldklub",
    "shortName": "VEJ",
    "logoUrl": "https://drop-assets.ea.com/images/1ryRgfNM5fLqL2buzlcur5/3fece6a917750a9365edca27a2462862/l822.png",
    "stadium": "Estadio Vejle Boldklub",
    "country": "Croacia",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-482",
    "name": "FC Goa",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/cP7EFBSaV0CgGbS2Clkvv/82ca0d2b5de4bfcd5e5d372f90a1c84b/l113298.png",
    "stadium": "Estadio FC Goa",
    "country": "Serbia",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-483",
    "name": "SC Bastia",
    "shortName": "SC ",
    "logoUrl": "https://drop-assets.ea.com/images/3HfllaC913vcDQdVZHlkHi/1831663ffe29ac3b45d7077138f61f3e/l58.png",
    "stadium": "Estadio SC Bastia",
    "country": "Francia",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-484",
    "name": "IFK Värnamo",
    "shortName": "IFK",
    "logoUrl": "https://drop-assets.ea.com/images/2Fi53mpu0MkLQr0TNrMZws/da1498bdee5b7277755135bc81c14cfc/l112126.png",
    "stadium": "Estadio IFK Värnamo",
    "country": "Suecia",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-485",
    "name": "Lincoln City",
    "shortName": "LIN",
    "logoUrl": "https://drop-assets.ea.com/images/4AWfCdXXUK16MIELtcVAK4/3e2c8b1314a2cfaa570e6b9987942412/l149.png",
    "stadium": "Estadio Lincoln City",
    "country": "Escocia",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-486",
    "name": "SSV Ulm 1846",
    "shortName": "SSV",
    "logoUrl": "https://drop-assets.ea.com/images/2WYW8ycwWAwyVZAjGSHvje/ee478a10507bf0f77b592d52117854b6/l110176.png",
    "stadium": "Estadio SSV Ulm 1846",
    "country": "Alemania",
    "league": "Bundesliga 2",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-487",
    "name": "Western United",
    "shortName": "WES",
    "logoUrl": "https://drop-assets.ea.com/images/3cL22ZhdWFfc9sp6u7lsbd/e84db359b8edde0f6c43494e8d760db2/l114023.png",
    "stadium": "Estadio Western United",
    "country": "Australia",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-488",
    "name": "Blau-Weiss Linz",
    "shortName": "BLA",
    "logoUrl": "https://drop-assets.ea.com/images/3bs7EvsECVogQahgKK0aO2/09a89aab6ce9b1fd96ee23c4c120d832/l110720.png",
    "stadium": "Estadio Blau-Weiss Linz",
    "country": "Austria",
    "league": "Ö. Bundesliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-489",
    "name": "Northampton Town",
    "shortName": "NOR",
    "logoUrl": "https://drop-assets.ea.com/images/7EaAqs28wh0J6pBW7IQBTM/3f1a0985fbadeb376ae0cf7fae568bd1/l1930.png",
    "stadium": "Estadio Northampton Town",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-490",
    "name": "Barnsley",
    "shortName": "BAR",
    "logoUrl": "https://drop-assets.ea.com/images/4SZ6F5ZWRUqIl3F8S7xavk/0008cbd7beb2ab793e204b004485fb87/l1932.png",
    "stadium": "Estadio Barnsley",
    "country": "República de Irlanda",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-491",
    "name": "Blackpool",
    "shortName": "BLA",
    "logoUrl": "https://drop-assets.ea.com/images/75kqpMjcWpNtvZ6P88VX2j/9cf09992b53f46b2e6b58df37a45ed5f/l1926.png",
    "stadium": "Estadio Blackpool",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-492",
    "name": "Notts County",
    "shortName": "NOT",
    "logoUrl": "https://drop-assets.ea.com/images/5eebK2aodR2yEruJpnxjmz/1b2db9eff4de0d4ae633f4ea674bfaa2/l1937.png",
    "stadium": "Estadio Notts County",
    "country": "Malta",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-493",
    "name": "Mumbai City FC",
    "shortName": "MUM",
    "logoUrl": "https://drop-assets.ea.com/images/3PQORLIvah2U2ryIg78bXJ/6331d74ca93cd3d54c6ba8b0f2f6151a/l113300.png",
    "stadium": "Estadio Mumbai City FC",
    "country": "Grecia",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-494",
    "name": "AaB",
    "shortName": "AAB",
    "logoUrl": "https://drop-assets.ea.com/images/2x8AB5Vp1E2mErWdiCvKFI/75275b199ea352e8652d989720f218f8/AaB.png",
    "stadium": "Estadio AaB",
    "country": "Holanda",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-495",
    "name": "Kerala Blasters",
    "shortName": "KER",
    "logoUrl": "https://drop-assets.ea.com/images/hLAmjMPteKEmV62WNfiDk/0e9140dc2d5008e986039d281cda997a/l113299.png",
    "stadium": "Estadio Kerala Blasters",
    "country": "Uruguay",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-496",
    "name": "FC Erzgebirge Aue",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/4jzEruxQWPOWMxZGNgB9Gi/999c1a54448717536d5c0a805ff5f561/l506.png",
    "stadium": "Estadio FC Erzgebirge Aue",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-497",
    "name": "Córdoba CF",
    "shortName": "CÓR",
    "logoUrl": "https://drop-assets.ea.com/images/4H59ckAQfKKLAEwpEAdkrw/7d9a5d08383d993995fce72fff34bfd4/l1867.png",
    "stadium": "Estadio Córdoba CF",
    "country": "España",
    "league": "LALIGA HYPERMOTION",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-498",
    "name": "Saarbrücken",
    "shortName": "SAA",
    "logoUrl": "https://drop-assets.ea.com/images/kXT0Hdwx6prQL18kylch8/46ba268cda604f4787cc8586c2c30d38/l523.png",
    "stadium": "Estadio Saarbrücken",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-499",
    "name": "Exeter City",
    "shortName": "EXE",
    "logoUrl": "https://drop-assets.ea.com/images/3dkkM5zv8ErGHQtLKYLgR5/0eed2bd5fdb2f93128c4ebd383a31e64/l143.png",
    "stadium": "Estadio Exeter City",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-500",
    "name": "Rodez AF",
    "shortName": "ROD",
    "logoUrl": "https://drop-assets.ea.com/images/7DZ3IAgdKz3oBOHexEyeZs/4ff61a73b6ba46a531fbe6a2a0959ad5/l111659.png",
    "stadium": "Estadio Rodez AF",
    "country": "RD Congo",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-501",
    "name": "Brommapojkarna",
    "shortName": "BRO",
    "logoUrl": "https://drop-assets.ea.com/images/4bvnLjarwey9TCVZOEqUm3/f3cd5d9ceb327ee5479234b37b3f3d15/l111705.png",
    "stadium": "Estadio Brommapojkarna",
    "country": "Gabón",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-502",
    "name": "St. Mirren",
    "shortName": "ST.",
    "logoUrl": "https://drop-assets.ea.com/images/1dbWLWFup9oWFgOycN45vg/2e5e62d22b08ae9098d1dfee8ee30065/l100805.png",
    "stadium": "Estadio St. Mirren",
    "country": "Escocia",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-503",
    "name": "Stevenage",
    "shortName": "STE",
    "logoUrl": "https://drop-assets.ea.com/images/43v6io9tLnqIhi7mK6ZtnS/070069d3a69abf7b7fff92d2a64de6e5/l361.png",
    "stadium": "Estadio Stevenage",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-504",
    "name": "Radomiak Radom",
    "shortName": "RAD",
    "logoUrl": "https://drop-assets.ea.com/images/3I0eFFwFwn4yXQSxWxtTEO/90a3f7d99511e9ed65efd817a7a8fc00/l111088.png",
    "stadium": "Estadio Radomiak Radom",
    "country": "Portugal",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-505",
    "name": "Wigan Athletic",
    "shortName": "WIG",
    "logoUrl": "https://drop-assets.ea.com/images/6z7nPmJVTiyBYSTMmdeF8l/9789e182eab4e651dc631b00dc3671d3/l1917.png",
    "stadium": "Estadio Wigan Athletic",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-506",
    "name": "Motherwell",
    "shortName": "MOT",
    "logoUrl": "https://drop-assets.ea.com/images/60TseHVsj7Xt7fVE52Ft9i/8bcf7344426a645faa0bd4bc8c724282/l83.png",
    "stadium": "Estadio Motherwell",
    "country": "Australia",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-507",
    "name": "1860 Munich",
    "shortName": "186",
    "logoUrl": "https://drop-assets.ea.com/images/2fvTTdw72eQBkLp4aPTas1/2de9e73c5ec1adc4cfdebd8f49a609b5/l33.png",
    "stadium": "Estadio 1860 Munich",
    "country": "Holanda",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-508",
    "name": "FC Petrolul",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/1FBVrq068QwIPyg9jRPurv/002f707177e2ad685921bf07171846e6/l110078.png",
    "stadium": "Estadio FC Petrolul",
    "country": "República Checa",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-509",
    "name": "FC Hermannstadt",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/WKwLglD8mgRDuvTyznwd7/b608c36c8482b14e842dfe95d2091799/l114147.png",
    "stadium": "Estadio FC Hermannstadt",
    "country": "Rumanía",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-510",
    "name": "SV Sandhausen",
    "shortName": "SV ",
    "logoUrl": "https://drop-assets.ea.com/images/5x8ZRBoongLzs5lUnxGj3S/2e4183e7d94087dd742b99441a96cfdc/SV_Sandhausen.png",
    "stadium": "Estadio SV Sandhausen",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-511",
    "name": "FC Gloria Buzău",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/ztJqePbNO1YC0vmFHcZ13/8d5290469557b4b117ac8a0e06bf899c/FC_Gloria_Buz_u.png",
    "stadium": "Estadio FC Gloria Buzău",
    "country": "Rumanía",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-512",
    "name": "Chennaiyin FC",
    "shortName": "CHE",
    "logoUrl": "https://drop-assets.ea.com/images/4YOe3z41nuHpvAK0ihHdZC/c3a3b82dc914c6ceff911103c2502dab/l113297.png",
    "stadium": "Estadio Chennaiyin FC",
    "country": "Nigeria",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-513",
    "name": "Chesterfield",
    "shortName": "CHE",
    "logoUrl": "https://drop-assets.ea.com/images/3UnqBO2xr8EQmmCfdzUcWz/3d911f4b54a557b5d30cfd912ddf9d2a/l1924.png",
    "stadium": "Estadio Chesterfield",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-514",
    "name": "FC Annecy",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/7BRyMVq04pjcIaQNqO1zAR/67ce6944c840021a44db4388ab075990/l131447.png",
    "stadium": "Estadio FC Annecy",
    "country": "Francia",
    "league": "Ligue 2 BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-515",
    "name": "NorthEast United",
    "shortName": "NOR",
    "logoUrl": "https://drop-assets.ea.com/images/2tDOKh9YRwo1sZDXXzFIql/9c864abdcf26eca6ec02e9884d16ad0f/l113040.png",
    "stadium": "Estadio NorthEast United",
    "country": "España",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-516",
    "name": "FC Botoșani",
    "shortName": "FC ",
    "logoUrl": "https://drop-assets.ea.com/images/17wpminsy3XIoBH5iOX843/d6becbcc5996c90368e3cee0fb6a5c72/l110752.png",
    "stadium": "Estadio FC Botoșani",
    "country": "Rumanía",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-517",
    "name": "B. Dortmund II",
    "shortName": "B. ",
    "logoUrl": "https://drop-assets.ea.com/images/6NwuAlLSmOTN7IzV7cV6af/0c886386d590fc519d691e1a1c9ba890/B._Dortmund_II.png",
    "stadium": "Estadio B. Dortmund II",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-518",
    "name": "Kalmar FF",
    "shortName": "KAL",
    "logoUrl": "https://drop-assets.ea.com/images/6xfASAoWVRBZUKbwI30C3k/5459a064f5f515b7ad8cd26802b22b70/Kalmar_FF.png",
    "stadium": "Estadio Kalmar FF",
    "country": "Montenegro",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-519",
    "name": "Tromsø IL",
    "shortName": "TRO",
    "logoUrl": "https://drop-assets.ea.com/images/3g86b9S4x0nYHaoQVrbHY9/7bd31bf9fb88ecb2ca44cee28828ea2c/l418.png",
    "stadium": "Estadio Tromsø IL",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-520",
    "name": "Colchester Utd",
    "shortName": "COL",
    "logoUrl": "https://drop-assets.ea.com/images/3fyfbjNYDlsTnRb5422slW/b5ad94362ce38dd4c7eb4da154a5be4b/l1935.png",
    "stadium": "Estadio Colchester Utd",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-521",
    "name": "Mjällby AIF",
    "shortName": "MJÄ",
    "logoUrl": "https://drop-assets.ea.com/images/2R8BSFngBCfvRboYU4yWaQ/7317fdcd076f7427d2c09a5d22aea240/l112072.png",
    "stadium": "Estadio Mjällby AIF",
    "country": "Suecia",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-522",
    "name": "Korona Kielce",
    "shortName": "KOR",
    "logoUrl": "https://drop-assets.ea.com/images/n1UIQXiAB4J6UpxbB8Yzc/0b478c3b1b852310bde8b7662879ac89/l111083.png",
    "stadium": "Estadio Korona Kielce",
    "country": "Bélgica",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-523",
    "name": "Politehnica Iași",
    "shortName": "POL",
    "logoUrl": "https://drop-assets.ea.com/images/2qDrPiukpfa2EoXiWrurud/2f51c1599b8edd6b81482c3371ac48bf/Politehnica_Ia_i.png",
    "stadium": "Estadio Politehnica Iași",
    "country": "Rumanía",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-524",
    "name": "HJK Helsinki",
    "shortName": "HJK",
    "logoUrl": "https://drop-assets.ea.com/images/1IRF7QfSee8Pg3RKocIxCc/8044aedffcc2e33c776c5b141429eb38/l100325.png",
    "stadium": "Estadio HJK Helsinki",
    "country": "Ghana",
    "league": "Finnliiga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-525",
    "name": "Doncaster",
    "shortName": "DON",
    "logoUrl": "https://drop-assets.ea.com/images/1Ci1wHcUdLK6UWZFWsxMuf/4c158ba73e25a3862915e55b1bca8a3f/l142.png",
    "stadium": "Estadio Doncaster",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-526",
    "name": "Dundee United",
    "shortName": "DUN",
    "logoUrl": "https://drop-assets.ea.com/images/59iEXPE6OzSfUHmdRpJVnK/3e05bd9ad4905eae8baf31e4c097724a/l181.png",
    "stadium": "Estadio Dundee United",
    "country": "Australia",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-527",
    "name": "Dundee FC",
    "shortName": "DUN",
    "logoUrl": "https://drop-assets.ea.com/images/4dyO31OqfSFQyB08gXD5WW/62cc547e95505f438e302ba10d4676b4/l180.png",
    "stadium": "Estadio Dundee FC",
    "country": "Francia",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-528",
    "name": "Puszcza",
    "shortName": "PUS",
    "logoUrl": "https://drop-assets.ea.com/images/2kxyPuHF44dVrTk3TTwi9I/d7146600ab934bb888e73f88e1e46d5f/Puszcza.png",
    "stadium": "Estadio Puszcza",
    "country": "Polonia",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-529",
    "name": "Lyngby BK",
    "shortName": "LYN",
    "logoUrl": "https://drop-assets.ea.com/images/4qRObuXQoJUF5a9XNHLkkV/afa96894888159129de32972ca44f16c/Lyngby_BK.png",
    "stadium": "Estadio Lyngby BK",
    "country": "Ghana",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-530",
    "name": "Al Riyadh",
    "shortName": "AL ",
    "logoUrl": "https://drop-assets.ea.com/images/1L9oQXove9EYtLUufOd5s2/6136b6d3c0a27fd6e686305be57baae7/l113037.png",
    "stadium": "Estadio Al Riyadh",
    "country": "Arabia Saudí",
    "league": "ROSHN Saudi League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-531",
    "name": "UTA Arad",
    "shortName": "UTA",
    "logoUrl": "https://drop-assets.ea.com/images/3NVXoIX1d9jINCaLMbPNhC/8af9c613166baa8de632b82a4285e1ff/l110750.png",
    "stadium": "Estadio UTA Arad",
    "country": "Portugal",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-532",
    "name": "SC Verl",
    "shortName": "SC ",
    "logoUrl": "https://drop-assets.ea.com/images/7s81PciNjeDRzSzRWtLD7A/44b00265be8918b5e6659106fe81bf5f/l110501.png",
    "stadium": "Estadio SC Verl",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-533",
    "name": "Halmstads BK",
    "shortName": "HAL",
    "logoUrl": "https://drop-assets.ea.com/images/6q9YQpulSqRrkMjySFvz1L/8ed407437f8c2cf1ce2b3d813ccece8b/l321.png",
    "stadium": "Estadio Halmstads BK",
    "country": "Suecia",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-534",
    "name": "Cambridge Utd",
    "shortName": "CAM",
    "logoUrl": "https://drop-assets.ea.com/images/2aVS5FfKUM9M5MRIpxYoft/8f3ee2bf245080fe7361a618de4ba087/l1944.png",
    "stadium": "Estadio Cambridge Utd",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-535",
    "name": "Fredrikstad FK",
    "shortName": "FRE",
    "logoUrl": "https://drop-assets.ea.com/images/59caPI9gpPpEF3nwZdbCxV/9dbef553ba48b01cc93cec4d43955c27/l2041.png",
    "stadium": "Estadio Fredrikstad FK",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-536",
    "name": "Lechia Gdańsk",
    "shortName": "LEC",
    "logoUrl": "https://drop-assets.ea.com/images/36lqabDvQJnC78XKCIrkKd/fd37adc0df95e6956171657069dfde7c/l111091.png",
    "stadium": "Estadio Lechia Gdańsk",
    "country": "Brasil",
    "league": "PKO BP Ekstraklasa",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-537",
    "name": "Sønderjyske",
    "shortName": "SØN",
    "logoUrl": "https://drop-assets.ea.com/images/4ZAD9euz4dJUycxWKymyeG/31e9d906f91c7a228dc22f98417a287a/l1447.png",
    "stadium": "Estadio Sønderjyske",
    "country": "Dinamarca",
    "league": "3F Superliga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-538",
    "name": "Port Vale",
    "shortName": "POR",
    "logoUrl": "https://drop-assets.ea.com/images/1LTwl3Ng5n2rmEZ3n6VRiN/4a29c01af0f1c1b2922d47d3afb0a8e6/l1928.png",
    "stadium": "Estadio Port Vale",
    "country": "Escocia",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-539",
    "name": "SS Juve Stabia",
    "shortName": "SS ",
    "logoUrl": "https://drop-assets.ea.com/images/26gp50uhjnTWSFsbR3MIoO/08d682ca66989cdd42ffce72c4705f29/l112124.png",
    "stadium": "Estadio SS Juve Stabia",
    "country": "Italia",
    "league": "Serie BKT",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-540",
    "name": "Galway United",
    "shortName": "GAL",
    "logoUrl": "https://drop-assets.ea.com/images/4xAOgDP3IiTh300eCCQpgD/83ced13b61c44635347958bb14c9983a/l1571.png",
    "stadium": "Estadio Galway United",
    "country": "República de Irlanda",
    "league": "SSE Airtricity PD",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-541",
    "name": "Bristol Rovers",
    "shortName": "BRI",
    "logoUrl": "https://drop-assets.ea.com/images/2eUJrPyHqhokoFWhia5SNW/86b77952cf575e0800f2333ed18995f8/l1962.png",
    "stadium": "Estadio Bristol Rovers",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-542",
    "name": "St. Pats",
    "shortName": "ST.",
    "logoUrl": "https://drop-assets.ea.com/images/2Ql5IGkxsDhe86OyJLPS18/0e6a6bf3964d01fa9e8b24c15a0a0ba7/l423.png",
    "stadium": "Estadio St. Pats",
    "country": "República de Irlanda",
    "league": "SSE Airtricity PD",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-543",
    "name": "Aleman. Aachen",
    "shortName": "ALE",
    "logoUrl": "https://drop-assets.ea.com/images/4AUZx6ttnGaxofdYWnGTP8/f97b6b4b0d42acddc80108496444b574/l1826.png",
    "stadium": "Estadio Aleman. Aachen",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-544",
    "name": "Leyton Orient",
    "shortName": "LEY",
    "logoUrl": "https://drop-assets.ea.com/images/2YQJRRyvQJJ6ZvMAli1i5k/aadd884e8aa8eea064efdb33e5bffeea/l1958.png",
    "stadium": "Estadio Leyton Orient",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-545",
    "name": "Bradford City",
    "shortName": "BRA",
    "logoUrl": "https://drop-assets.ea.com/images/1XI3tr2OTCDakjovcC5gMM/bc18fadc79dba3315c0d09d6643f0dcb/l1804.png",
    "stadium": "Estadio Bradford City",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-546",
    "name": "Viktoria Köln",
    "shortName": "VIK",
    "logoUrl": "https://drop-assets.ea.com/images/1eb4GZoBlkQmLM8kLjUvBl/2bfcd8492daff919b9a883f0a280f1d5/l110645.png",
    "stadium": "Estadio Viktoria Köln",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-547",
    "name": "Stockport",
    "shortName": "STO",
    "logoUrl": "https://drop-assets.ea.com/images/2ZakDKa7nQDoWGtXW8S4vX/665f9057df247f8d376f16eeed2f95a5/l1931.png",
    "stadium": "Estadio Stockport",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-548",
    "name": "Shelbourne",
    "shortName": "SHE",
    "logoUrl": "https://drop-assets.ea.com/images/3U0Bo6TVAKSTJe8PZNzKiX/cf8e45ac6b47ba2ccb4881ca18f0f25f/l834.png",
    "stadium": "Estadio Shelbourne",
    "country": "República de Irlanda",
    "league": "SSE Airtricity PD",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-549",
    "name": "MK Dons",
    "shortName": "MK ",
    "logoUrl": "https://drop-assets.ea.com/images/18kQE4oU1HB6eiS57O5Fnu/1718feb87935d96143934fab46888af9/l1798.png",
    "stadium": "Estadio MK Dons",
    "country": "República de Irlanda",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-550",
    "name": "Unterhaching",
    "shortName": "UNT",
    "logoUrl": "https://drop-assets.ea.com/images/gkmsjKI1gvFBimgfzQxlz/9f436f32942cd195b23cf8199bca01bd/Unterhaching.png",
    "stadium": "Estadio Unterhaching",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-551",
    "name": "Fleetwood Town",
    "shortName": "FLE",
    "logoUrl": "https://drop-assets.ea.com/images/2gpycuAhVbCsVZt4oekuPa/1778e333fd752a20a716fa23919a9a36/l112260.png",
    "stadium": "Estadio Fleetwood Town",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-552",
    "name": "Shrewsbury Town",
    "shortName": "SHR",
    "logoUrl": "https://drop-assets.ea.com/images/74ZYHcw4ZZBuv1m92HJweo/57d44ef994d3069f7c75bc7a7a1b428d/l127.png",
    "stadium": "Estadio Shrewsbury Town",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-553",
    "name": "HamKam Fotball",
    "shortName": "HAM",
    "logoUrl": "https://drop-assets.ea.com/images/2WZ0Izqf0tsColShaztSGD/225a18dd7a92fa822019a90b4cb46cf3/l1756.png",
    "stadium": "Estadio HamKam Fotball",
    "country": "Noruega",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-554",
    "name": "Salford City",
    "shortName": "SAL",
    "logoUrl": "https://drop-assets.ea.com/images/49sHHRNr1x8t4jCiEVduEf/39d963a3ccec52d39cfccf50011483f0/l113926.png",
    "stadium": "Estadio Salford City",
    "country": "Gales",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-555",
    "name": "Carlisle Utd",
    "shortName": "CAR",
    "logoUrl": "https://drop-assets.ea.com/images/2nYxD19h4tptqXKCTABjpp/8c6e85fa6cdcea2bb818f6f43d1c9576/Carlisle_United.png",
    "stadium": "Estadio Carlisle Utd",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-556",
    "name": "Burton Albion",
    "shortName": "BUR",
    "logoUrl": "https://drop-assets.ea.com/images/5nGomTmcwWIZUmcu2xrRjk/9fbec7dcb5e47017bab105b6e288b719/l15015.png",
    "stadium": "Estadio Burton Albion",
    "country": "Inglaterra",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-557",
    "name": "Energie Cottbus",
    "shortName": "ENE",
    "logoUrl": "https://drop-assets.ea.com/images/3jo5A8MTYOT9ybdaGt0LJz/9889695dd535756857efabacec26592a/l162.png",
    "stadium": "Estadio Energie Cottbus",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-558",
    "name": "Crewe Alexandra",
    "shortName": "CRE",
    "logoUrl": "https://drop-assets.ea.com/images/7BeWodfG7PPK0GuxGfVsGZ/72bb00629deae2657f3c3158fa6b4f93/l121.png",
    "stadium": "Estadio Crewe Alexandra",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-559",
    "name": "Derry City",
    "shortName": "DER",
    "logoUrl": "https://drop-assets.ea.com/images/1rg56llHAILbKWcWAMZXPY/010109d4ae0d0210d2c317bf595d15fc/l445.png",
    "stadium": "Estadio Derry City",
    "country": "República de Irlanda",
    "league": "SSE Airtricity PD",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-560",
    "name": "Walsall",
    "shortName": "WAL",
    "logoUrl": "https://drop-assets.ea.com/images/6YpdT7F8GaemWz8jTGNaNj/e27e36bd4f4b57d8481295b9abf969a6/l1803.png",
    "stadium": "Estadio Walsall",
    "country": "Guyana",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-561",
    "name": "Swindon Town",
    "shortName": "SWI",
    "logoUrl": "https://drop-assets.ea.com/images/4svmsZAfnp5Lt0dljVI0kY/f05c5635bdec7123623da932bfee8011/l1934.png",
    "stadium": "Estadio Swindon Town",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-562",
    "name": "Gillingham",
    "shortName": "GIL",
    "logoUrl": "https://drop-assets.ea.com/images/6DlLiaK0h1veyS82ywPKdh/20034f8325126a53a713685e8c080dd7/l1802.png",
    "stadium": "Estadio Gillingham",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-563",
    "name": "Barrow",
    "shortName": "BAR",
    "logoUrl": "https://drop-assets.ea.com/images/GQM1dZFQBtEvvq0Vmdm1m/1f94056b3dfe1ecf7a7e186e6d5d7b0d/l381.png",
    "stadium": "Estadio Barrow",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-564",
    "name": "Sligo Rovers",
    "shortName": "SLI",
    "logoUrl": "https://drop-assets.ea.com/images/7IE9l9nnKSYbHthfvhmPd0/dbcfd5bf4be0196f26900cbfb0a4a9ad/l563.png",
    "stadium": "Estadio Sligo Rovers",
    "country": "República de Irlanda",
    "league": "SSE Airtricity PD",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-565",
    "name": "Sandefjord",
    "shortName": "SAN",
    "logoUrl": "https://drop-assets.ea.com/images/59VfwkjxrOOF5uVApnkTLo/c618faaab47d1aa403676fdb9a5a9315/l1757.png",
    "stadium": "Estadio Sandefjord",
    "country": "Suecia",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-566",
    "name": "IK Sirius",
    "shortName": "IK ",
    "logoUrl": "https://drop-assets.ea.com/images/1wCiF3WMMbK8LkSt8vbz75/68b0979dea68379cf713918903aff3c0/l113458.png",
    "stadium": "Estadio IK Sirius",
    "country": "Suecia",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-567",
    "name": "Unirea Slobozia",
    "shortName": "UNI",
    "logoUrl": "https://drop-assets.ea.com/images/49oMF7ROeeiY72FxNQfXSz/50c457f6482e24898c02fb8bb7909f60/l131459.png",
    "stadium": "Estadio Unirea Slobozia",
    "country": "Ucrania",
    "league": "SUPERLIGA",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-568",
    "name": "Newcastle Jets",
    "shortName": "NEW",
    "logoUrl": "https://drop-assets.ea.com/images/7oWveGzyWfiqr43qBGBbn1/b230f5eefddcd3fcf51413aef799c0f4/l111398.png",
    "stadium": "Estadio Newcastle Jets",
    "country": "Australia",
    "league": "A-League",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-569",
    "name": "VfB Stuttgart II",
    "shortName": "VFB",
    "logoUrl": "https://drop-assets.ea.com/images/4SisGwcFCCDDLl26aSE8Sd/d9c0af85c6943209e408a89510ae58ca/l110697.png",
    "stadium": "Estadio VfB Stuttgart II",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-570",
    "name": "Crawley Town",
    "shortName": "CRA",
    "logoUrl": "https://drop-assets.ea.com/images/4T4qCB9StU88HGtwgGNSlw/e6916d385fb311b16399a0ffe32a3edf/l110890.png",
    "stadium": "Estadio Crawley Town",
    "country": "San Cristóbal y Nieves",
    "league": "EFL League One",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-571",
    "name": "Morecambe",
    "shortName": "MOR",
    "logoUrl": "https://drop-assets.ea.com/images/2tcAI0azphE0qDDBCUgU8B/f372c63318f9d6ed2544d51dcd0a7fe5/Morecambe.png",
    "stadium": "Estadio Morecambe",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-572",
    "name": "Västerås SK",
    "shortName": "VÄS",
    "logoUrl": "https://drop-assets.ea.com/images/2NDtJanskgRb0iGPvDPWOx/6109ec32b2d9334d742df41909168232/V_ster_s_SK.png",
    "stadium": "Estadio Västerås SK",
    "country": "Suecia",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-573",
    "name": "AFC Wimbledon",
    "shortName": "AFC",
    "logoUrl": "https://drop-assets.ea.com/images/4CSxEMexBLlrlRyI8uYbRF/959a98f960f44431bd38f2942e32b5ed/l112259.png",
    "stadium": "Estadio AFC Wimbledon",
    "country": "Líbano",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-574",
    "name": "Ross County",
    "shortName": "ROS",
    "logoUrl": "https://drop-assets.ea.com/images/52kOSGhJHadFVZKJ0KgNRt/6ab79499fedb9e6c3643e96fc11c11f7/Ross_County.png",
    "stadium": "Estadio Ross County",
    "country": "Escocia",
    "league": "Scottish Prem",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-575",
    "name": "Kristiansund BK",
    "shortName": "KRI",
    "logoUrl": "https://drop-assets.ea.com/images/6ZqLtnjNnRlF4WMDuDGuzf/7b8cfce53f7f97d77188da7638c3d215/l113459.png",
    "stadium": "Estadio Kristiansund BK",
    "country": "Estados Unidos",
    "league": "Eliteserien",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-576",
    "name": "GAIS",
    "shortName": "GAI",
    "logoUrl": "https://drop-assets.ea.com/images/pFixT8HR3hdjuGjtVdsDA/6e4ff3db8367f2edafb45a7cf692b26f/l111594.png",
    "stadium": "Estadio GAIS",
    "country": "Suecia",
    "league": "Allsvenskan",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-577",
    "name": "Tranmere Rovers",
    "shortName": "TRA",
    "logoUrl": "https://drop-assets.ea.com/images/bytnUpEwmA7lGSrHZlLJb/e2677126cf5ec5526887ad1aa54a14d9/l15048.png",
    "stadium": "Estadio Tranmere Rovers",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-578",
    "name": "Harrogate Town",
    "shortName": "HAR",
    "logoUrl": "https://drop-assets.ea.com/images/4BTB7QVt2PqcEaBlOwXxRn/2da5ee69898429eefe4935a7a15ba319/l112222.png",
    "stadium": "Estadio Harrogate Town",
    "country": "República de Irlanda",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-579",
    "name": "Cheltenham Town",
    "shortName": "CHE",
    "logoUrl": "https://drop-assets.ea.com/images/WNgARRfu2ZKPQ5Wdq5x3v/f2db91a00c13699a53d538aa6d681879/l1936.png",
    "stadium": "Estadio Cheltenham Town",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-580",
    "name": "Bromley FC",
    "shortName": "BRO",
    "logoUrl": "https://drop-assets.ea.com/images/5QMJcSaYvq4G4G5NXEWrZb/5fdc5698d16c626312981487df96cefb/l112764.png",
    "stadium": "Estadio Bromley FC",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-581",
    "name": "Bohemians",
    "shortName": "BOH",
    "logoUrl": "https://drop-assets.ea.com/images/3jD4AZNPX7RO7xILXNp3iA/65fee06c4dbf89d9b485c50548756037/l305.png",
    "stadium": "Estadio Bohemians",
    "country": "República de Irlanda",
    "league": "SSE Airtricity PD",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-582",
    "name": "Hannover 96 II",
    "shortName": "HAN",
    "logoUrl": "https://drop-assets.ea.com/images/3oJBiazKF00XHTcifbRbj4/261ed27734c5fb8aee0d6a7caa9a5b19/Hannover_96_II.png",
    "stadium": "Estadio Hannover 96 II",
    "country": "Alemania",
    "league": "3. Liga",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-583",
    "name": "Grimsby Town",
    "shortName": "GRI",
    "logoUrl": "https://drop-assets.ea.com/images/01GyA7LmGGZ20uBq1CvsZl/ef44409164a8f1436c9237815effed27/l92.png",
    "stadium": "Estadio Grimsby Town",
    "country": "Inglaterra",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-584",
    "name": "Newport County",
    "shortName": "NEW",
    "logoUrl": "https://drop-assets.ea.com/images/6eQLmTo8W8k6NGFfszbfQp/edc62e6f361883488722deb506697ea7/l112254.png",
    "stadium": "Estadio Newport County",
    "country": "República de Irlanda",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-585",
    "name": "Accrington",
    "shortName": "ACC",
    "logoUrl": "https://drop-assets.ea.com/images/600lHjS2SRGndegIUNqjOk/7eac8da2b96f0d62d17ec571e2fe4fe3/l110313.png",
    "stadium": "Estadio Accrington",
    "country": "Irlanda del N.",
    "league": "EFL League Two",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-586",
    "name": "Waterford",
    "shortName": "WAT",
    "logoUrl": "https://drop-assets.ea.com/images/2qVLWMkIJtGyU6e8IFvhc6/ebbf356a570f14b1390dcf81ef1b7697/l753.png",
    "stadium": "Estadio Waterford",
    "country": "República de Irlanda",
    "league": "SSE Airtricity PD",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-587",
    "name": "Dundalk",
    "shortName": "DUN",
    "logoUrl": "https://drop-assets.ea.com/images/2wXChTAWqvBn2r3peZqudi/29e821b7764a795facac8264432650f7/Dundalk.png",
    "stadium": "Estadio Dundalk",
    "country": "República de Irlanda",
    "league": "SSE Airtricity PD",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-588",
    "name": "Drogheda United",
    "shortName": "DRO",
    "logoUrl": "https://drop-assets.ea.com/images/1t1GAbg4h6kEtLFlNhVFrK/3d12966996700e4c7b96e622cf235a30/l1572.png",
    "stadium": "Estadio Drogheda United",
    "country": "República de Irlanda",
    "league": "SSE Airtricity PD",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-589",
    "name": "Mohammedan SC",
    "shortName": "MOH",
    "logoUrl": "https://drop-assets.ea.com/images/2HLxe3xbYrsJRq7UqcCtxV/3c739e41d1a1d4060de8fb11973d04e9/l111633.png",
    "stadium": "Estadio Mohammedan SC",
    "country": "Ghana",
    "league": "ISL",
    "defaultBudget": 100000000
  },
  {
    "id": "eafc-club-590",
    "name": "Hyderabad FC",
    "shortName": "HYD",
    "logoUrl": "https://drop-assets.ea.com/images/29GZk3XH5TdV5cQ7WxPo9t/e005ecbde26e28e8140cac0b943498bd/l113301.png",
    "stadium": "Estadio Hyderabad FC",
    "country": "India",
    "league": "ISL",
    "defaultBudget": 100000000
  }
];

export const GET_SOFIFA_COUNTRIES = (): string[] => {
  const countries = new Set<string>();
  SOFIFA_CLUBS.forEach(c => {
    if (c.country) countries.add(c.country);
  });
  return Array.from(countries).sort();
};

export const GET_SOFIFA_LEAGUES_BY_COUNTRY = (country?: string): string[] => {
  const leagues = new Set<string>();
  SOFIFA_CLUBS.forEach(c => {
    if (!country || c.country === country) {
      if (c.league) leagues.add(c.league);
    }
  });
  return Array.from(leagues).sort();
};

export const GET_SOFIFA_CLUBS_BY_FILTER = (country?: string, league?: string): SoFifaClubPreset[] => {
  return SOFIFA_CLUBS.filter(c => {
    const matchCountry = !country || c.country === country;
    const matchLeague = !league || c.league === league;
    return matchCountry && matchLeague;
  });
};
