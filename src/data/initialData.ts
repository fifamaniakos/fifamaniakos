import { Club, Player, ForumTopic, MatchResult, TransferItem, FinancialTransaction, TickerNewsItem, CompetitionSection, BudgetPackage } from '../types';
import { generateAllCompetitionsFixtures } from '../utils/fixtureGenerator';

export const FC27_STANDARD_LOGO = 'https://cdn.sofifa.net/teams/241/60.png';

export const DRAFT_BOMBO_TEAMS = [
  {
    "id": "bombo-team-1",
    "name": "Paris Saint-Germain",
    "shortName": "PAR",
    "logoUrl": "https://cdn.sofifa.net/teams/73/60.png",
    "stadium": "Estadio Paris Saint-Germain",
    "country": "France",
    "league": "Ligue 1",
    "defaultBudget": 151470000
  },
  {
    "id": "bombo-team-2",
    "name": "FC Barcelona",
    "shortName": "FC ",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "stadium": "Estadio FC Barcelona",
    "country": "Spain",
    "league": "La Liga",
    "defaultBudget": 150750000
  },
  {
    "id": "bombo-team-3",
    "name": "Arsenal",
    "shortName": "ARS",
    "logoUrl": "https://cdn.sofifa.net/teams/1/60.png",
    "stadium": "Estadio Arsenal",
    "country": "Brazil",
    "league": "Premier League",
    "defaultBudget": 150660000
  },
  {
    "id": "bombo-team-4",
    "name": "Manchester City",
    "shortName": "MAN",
    "logoUrl": "https://cdn.sofifa.net/teams/10/60.png",
    "stadium": "Estadio Manchester City",
    "country": "Norway",
    "league": "Premier League",
    "defaultBudget": 149400000
  },
  {
    "id": "bombo-team-5",
    "name": "Real Madrid",
    "shortName": "REA",
    "logoUrl": "https://cdn.sofifa.net/teams/243/60.png",
    "stadium": "Estadio Real Madrid",
    "country": "France",
    "league": "La Liga",
    "defaultBudget": 148590000
  },
  {
    "id": "bombo-team-6",
    "name": "Inter",
    "shortName": "INT",
    "logoUrl": "https://cdn.sofifa.net/teams/44/60.png",
    "stadium": "Estadio Inter",
    "country": "Italy",
    "league": "Serie A",
    "defaultBudget": 145350000
  },
  {
    "id": "bombo-team-7",
    "name": "Liverpool",
    "shortName": "LIV",
    "logoUrl": "https://cdn.sofifa.net/teams/9/60.png",
    "stadium": "Estadio Liverpool",
    "country": "Egypt",
    "league": "Premier League",
    "defaultBudget": 145260000
  },
  {
    "id": "bombo-team-8",
    "name": "Aston Villa",
    "shortName": "AST",
    "logoUrl": "https://cdn.sofifa.net/teams/2/60.png",
    "stadium": "Estadio Aston Villa",
    "country": "Argentina",
    "league": "Premier League",
    "defaultBudget": 145170000
  },
  {
    "id": "bombo-team-9",
    "name": "Juventus",
    "shortName": "JUV",
    "logoUrl": "https://cdn.sofifa.net/teams/45/60.png",
    "stadium": "Estadio Juventus",
    "country": "Brazil",
    "league": "Serie A",
    "defaultBudget": 144180000
  },
  {
    "id": "bombo-team-10",
    "name": "Atlético Madrid",
    "shortName": "ATL",
    "logoUrl": "https://cdn.sofifa.net/teams/240/60.png",
    "stadium": "Estadio Atlético Madrid",
    "country": "Slovenia",
    "league": "La Liga",
    "defaultBudget": 144090000
  },
  {
    "id": "bombo-team-11",
    "name": "Chelsea",
    "shortName": "CHE",
    "logoUrl": "https://cdn.sofifa.net/teams/5/60.png",
    "stadium": "Estadio Chelsea",
    "country": "England",
    "league": "Premier League",
    "defaultBudget": 143280000
  },
  {
    "id": "bombo-team-12",
    "name": "Manchester United",
    "shortName": "MAN",
    "logoUrl": "https://cdn.sofifa.net/teams/11/60.png",
    "stadium": "Estadio Manchester United",
    "country": "Portugal",
    "league": "Premier League",
    "defaultBudget": 142380000
  },
  {
    "id": "bombo-team-13",
    "name": "FC Bayern München",
    "shortName": "FC ",
    "logoUrl": "https://cdn.sofifa.net/teams/21/60.png",
    "stadium": "Estadio FC Bayern München",
    "country": "Germany",
    "league": "Bundesliga",
    "defaultBudget": 142380000
  },
  {
    "id": "bombo-team-14",
    "name": "Tottenham Hotspur",
    "shortName": "TOT",
    "logoUrl": "https://cdn.sofifa.net/teams/18/60.png",
    "stadium": "Estadio Tottenham Hotspur",
    "country": "England",
    "league": "Premier League",
    "defaultBudget": 142290000
  },
  {
    "id": "bombo-team-15",
    "name": "Napoli",
    "shortName": "NAP",
    "logoUrl": "https://cdn.sofifa.net/teams/48/60.png",
    "stadium": "Estadio Napoli",
    "country": "Belgium",
    "league": "Serie A",
    "defaultBudget": 141525000
  },
  {
    "id": "bombo-team-16",
    "name": "Borussia Dortmund",
    "shortName": "BOR",
    "logoUrl": "https://cdn.sofifa.net/teams/22/60.png",
    "stadium": "Estadio Borussia Dortmund",
    "country": "Switzerland",
    "league": "Bundesliga",
    "defaultBudget": 141210000
  },
  {
    "id": "bombo-team-17",
    "name": "AC Milan",
    "shortName": "AC ",
    "logoUrl": "https://cdn.sofifa.net/teams/47/60.png",
    "stadium": "Estadio AC Milan",
    "country": "France",
    "league": "Serie A",
    "defaultBudget": 140940000
  },
  {
    "id": "bombo-team-18",
    "name": "Real Betis Balompié",
    "shortName": "REA",
    "logoUrl": "https://cdn.sofifa.net/teams/449/60.png",
    "stadium": "Estadio Real Betis Balompié",
    "country": "Spain",
    "league": "La Liga",
    "defaultBudget": 140850000
  },
  {
    "id": "bombo-team-19",
    "name": "Villarreal CF",
    "shortName": "VIL",
    "logoUrl": "https://cdn.sofifa.net/teams/483/60.png",
    "stadium": "Estadio Villarreal CF",
    "country": "Spain",
    "league": "La Liga",
    "defaultBudget": 140310000
  },
  {
    "id": "bombo-team-20",
    "name": "Nottingham Forest",
    "shortName": "NOT",
    "logoUrl": "https://cdn.sofifa.net/teams/14/60.png",
    "stadium": "Estadio Nottingham Forest",
    "country": "England",
    "league": "Premier League",
    "defaultBudget": 138960000
  },
  {
    "id": "bombo-team-21",
    "name": "Newcastle United",
    "shortName": "NEW",
    "logoUrl": "https://cdn.sofifa.net/teams/13/60.png",
    "stadium": "Estadio Newcastle United",
    "country": "Brazil",
    "league": "Premier League",
    "defaultBudget": 138600000
  },
  {
    "id": "bombo-team-22",
    "name": "Sporting CP",
    "shortName": "SPO",
    "logoUrl": "https://cdn.sofifa.net/teams/237/60.png",
    "stadium": "Estadio Sporting CP",
    "country": "Denmark",
    "league": "Primeira Liga",
    "defaultBudget": 137880000
  },
  {
    "id": "bombo-team-23",
    "name": "Sunderland",
    "shortName": "SUN",
    "logoUrl": "https://cdn.sofifa.net/teams/106/60.png",
    "stadium": "Estadio Sunderland",
    "country": "Switzerland",
    "league": "Premier League",
    "defaultBudget": 137430000
  },
  {
    "id": "bombo-team-24",
    "name": "SL Benfica",
    "shortName": "SL ",
    "logoUrl": "https://cdn.sofifa.net/teams/234/60.png",
    "stadium": "Estadio SL Benfica",
    "country": "Greece",
    "league": "Primeira Liga",
    "defaultBudget": 136376470
  },
  {
    "id": "bombo-team-25",
    "name": "VfL Wolfsburg",
    "shortName": "VFL",
    "logoUrl": "https://cdn.sofifa.net/teams/175/60.png",
    "stadium": "Estadio VfL Wolfsburg",
    "country": "Poland",
    "league": "Bundesliga",
    "defaultBudget": 136260000
  },
  {
    "id": "bombo-team-26",
    "name": "Roma",
    "shortName": "ROM",
    "logoUrl": "https://cdn.sofifa.net/teams/52/60.png",
    "stadium": "Estadio Roma",
    "country": "Argentina",
    "league": "Serie A",
    "defaultBudget": 135947368
  },
  {
    "id": "bombo-team-27",
    "name": "Fiorentina",
    "shortName": "FIO",
    "logoUrl": "https://cdn.sofifa.net/teams/110374/60.png",
    "stadium": "Estadio Fiorentina",
    "country": "Spain",
    "league": "Serie A",
    "defaultBudget": 135635294
  },
  {
    "id": "bombo-team-28",
    "name": "AS Monaco",
    "shortName": "AS ",
    "logoUrl": "https://cdn.sofifa.net/teams/69/60.png",
    "stadium": "Estadio AS Monaco",
    "country": "Switzerland",
    "league": "Ligue 1",
    "defaultBudget": 135540000
  },
  {
    "id": "bombo-team-29",
    "name": "VfB Stuttgart",
    "shortName": "VFB",
    "logoUrl": "https://cdn.sofifa.net/teams/36/60.png",
    "stadium": "Estadio VfB Stuttgart",
    "country": "Germany",
    "league": "Bundesliga",
    "defaultBudget": 134730000
  },
  {
    "id": "bombo-team-30",
    "name": "Galatasaray SK",
    "shortName": "GAL",
    "logoUrl": "https://cdn.sofifa.net/teams/325/60.png",
    "stadium": "Estadio Galatasaray SK",
    "country": "Nigeria",
    "league": "Süper Lig",
    "defaultBudget": 134640000
  },
  {
    "id": "bombo-team-31",
    "name": "FC Porto",
    "shortName": "FC ",
    "logoUrl": "https://cdn.sofifa.net/teams/236/60.png",
    "stadium": "Estadio FC Porto",
    "country": "Portugal",
    "league": "Primeira Liga",
    "defaultBudget": 134152941
  },
  {
    "id": "bombo-team-32",
    "name": "Burnley",
    "shortName": "BUR",
    "logoUrl": "https://cdn.sofifa.net/teams/1796/60.png",
    "stadium": "Estadio Burnley",
    "country": "Slovakia",
    "league": "Premier League",
    "defaultBudget": 134010000
  },
  {
    "id": "bombo-team-33",
    "name": "Bayer 04 Leverkusen",
    "shortName": "BAY",
    "logoUrl": "https://cdn.sofifa.net/teams/32/60.png",
    "stadium": "Estadio Bayer 04 Leverkusen",
    "country": "Spain",
    "league": "Bundesliga",
    "defaultBudget": 133799999
  },
  {
    "id": "bombo-team-34",
    "name": "Everton",
    "shortName": "EVE",
    "logoUrl": "https://cdn.sofifa.net/teams/7/60.png",
    "stadium": "Estadio Everton",
    "country": "England",
    "league": "Premier League",
    "defaultBudget": 133699999
  },
  {
    "id": "bombo-team-35",
    "name": "Leeds United",
    "shortName": "LEE",
    "logoUrl": "https://cdn.sofifa.net/teams/8/60.png",
    "stadium": "Estadio Leeds United",
    "country": "Brazil",
    "league": "Premier League",
    "defaultBudget": 133470000
  },
  {
    "id": "bombo-team-36",
    "name": "Feyenoord",
    "shortName": "FEY",
    "logoUrl": "https://cdn.sofifa.net/teams/246/60.png",
    "stadium": "Estadio Feyenoord",
    "country": "England",
    "league": "Eredivisie",
    "defaultBudget": 133470000
  }
];

export const INITIAL_CLUBS: Club[] = [
  {
    "id": "registered-dt-1",
    "name": "Por Sortear #1",
    "shortName": "CAR",
    "manager": "Carlos_Pro",
    "gamertag": "@Carlos_PSN",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-2",
    "name": "Por Sortear #2",
    "shortName": "LUC",
    "manager": "Lucas_FIFA",
    "gamertag": "@Lucas_Xbox",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-3",
    "name": "Por Sortear #3",
    "shortName": "MAR",
    "manager": "Marcos_DT",
    "gamertag": "@Marcos_PC",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-4",
    "name": "Por Sortear #4",
    "shortName": "SAN",
    "manager": "Santi_FC27",
    "gamertag": "@Santi_PS5",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-5",
    "name": "Por Sortear #5",
    "shortName": "NIC",
    "manager": "Nico_Esports",
    "gamertag": "@Nico_SeriesX",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-6",
    "name": "Por Sortear #6",
    "shortName": "FRA",
    "manager": "Fran_Gamer",
    "gamertag": "@Fran_Steam",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-7",
    "name": "Por Sortear #7",
    "shortName": "MAT",
    "manager": "Mateo_King",
    "gamertag": "@Mateo_PSN",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-8",
    "name": "Por Sortear #8",
    "shortName": "JAV",
    "manager": "Javier_Manager",
    "gamertag": "@Javi_Xbox",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-9",
    "name": "Por Sortear #9",
    "shortName": "DIE",
    "manager": "Diego_Tactics",
    "gamertag": "@Diego_PC",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-10",
    "name": "Por Sortear #10",
    "shortName": "GON",
    "manager": "Gonzalo_Master",
    "gamertag": "@Gonza_PS5",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-11",
    "name": "Por Sortear #11",
    "shortName": "ALE",
    "manager": "Alex_Pro",
    "gamertag": "@Alex_Xbox",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-12",
    "name": "Por Sortear #12",
    "shortName": "BRU",
    "manager": "Bruno_DT",
    "gamertag": "@Bruno_PC",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-13",
    "name": "Por Sortear #13",
    "shortName": "IGN",
    "manager": "Ignacio_Winner",
    "gamertag": "@Nacho_PSN",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-14",
    "name": "Por Sortear #14",
    "shortName": "TOM",
    "manager": "Tomas_Champ",
    "gamertag": "@Tomi_Xbox",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-15",
    "name": "Por Sortear #15",
    "shortName": "AGU",
    "manager": "Agustin_FC",
    "gamertag": "@Agus_PC",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-16",
    "name": "Por Sortear #16",
    "shortName": "VAL",
    "manager": "Valentino_Star",
    "gamertag": "@Valen_PS5",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-17",
    "name": "Por Sortear #17",
    "shortName": "FEL",
    "manager": "Felipe_Ultra",
    "gamertag": "@Feli_Xbox",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-18",
    "name": "Por Sortear #18",
    "shortName": "BEN",
    "manager": "Benjamin_Play",
    "gamertag": "@Benja_PC",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-19",
    "name": "Por Sortear #19",
    "shortName": "JOA",
    "manager": "Joaquin_Gamer",
    "gamertag": "@Joaco_PSN",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-20",
    "name": "Por Sortear #20",
    "shortName": "SEB",
    "manager": "Sebastian_Boss",
    "gamertag": "@Seba_Xbox",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-21",
    "name": "Por Sortear #21",
    "shortName": "RAM",
    "manager": "Ramiro_DT",
    "gamertag": "@Rama_PC",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-22",
    "name": "Por Sortear #22",
    "shortName": "FAC",
    "manager": "Facundo_ES",
    "gamertag": "@Facu_PS5",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-23",
    "name": "Por Sortear #23",
    "shortName": "EZE",
    "manager": "Ezekiel_Champ",
    "gamertag": "@Zeke_Xbox",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-24",
    "name": "Por Sortear #24",
    "shortName": "ALV",
    "manager": "Alvaro_Pro",
    "gamertag": "@Alvaro_PC",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-25",
    "name": "Por Sortear #25",
    "shortName": "EST",
    "manager": "Esteban_Tactics",
    "gamertag": "@Esteban_PSN",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-26",
    "name": "Por Sortear #26",
    "shortName": "GAB",
    "manager": "Gabriel_King",
    "gamertag": "@Gabi_Xbox",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-27",
    "name": "Por Sortear #27",
    "shortName": "MAX",
    "manager": "Maximo_Manager",
    "gamertag": "@Maxi_PC",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-28",
    "name": "Por Sortear #28",
    "shortName": "DAM",
    "manager": "Damian_FC",
    "gamertag": "@Dami_PS5",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-29",
    "name": "Por Sortear #29",
    "shortName": "ADR",
    "manager": "Adrian_Ultra",
    "gamertag": "@Adri_Xbox",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-30",
    "name": "Por Sortear #30",
    "shortName": "FED",
    "manager": "Federico_Star",
    "gamertag": "@Fede_PC",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-31",
    "name": "Por Sortear #31",
    "shortName": "MAN",
    "manager": "Manuel_Gamer",
    "gamertag": "@Manu_PSN",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-32",
    "name": "Por Sortear #32",
    "shortName": "MAR",
    "manager": "Martin_Boss",
    "gamertag": "@Tincho_Xbox",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-33",
    "name": "Por Sortear #33",
    "shortName": "PAB",
    "manager": "Pablo_Play",
    "gamertag": "@Pablo_PC",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-34",
    "name": "Por Sortear #34",
    "shortName": "GUI",
    "manager": "Guillermo_Master",
    "gamertag": "@Guille_PS5",
    "platform": "PS5",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-35",
    "name": "Por Sortear #35",
    "shortName": "IVA",
    "manager": "Ivan_ES",
    "gamertag": "@Ivan_Xbox",
    "platform": "Xbox Series X",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  },
  {
    "id": "registered-dt-36",
    "name": "Por Sortear #36",
    "shortName": "CRI",
    "manager": "Cristian_Pro",
    "gamertag": "@Cris_PC",
    "platform": "PC",
    "stadium": "Por Asignar en Draft",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "division": "1ra División",
    "budget": 100000000,
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0,
    "form": []
  }
];
export const INITIAL_PLAYERS: Player[] = [];
export const INITIAL_TOPICS: ForumTopic[] = [];
export const INITIAL_MATCHES: MatchResult[] = generateAllCompetitionsFixtures(INITIAL_CLUBS);
export const INITIAL_TRANSFERS: TransferItem[] = [];
export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [];

export const INITIAL_COMPETITION_SECTIONS: CompetitionSection[] = [
  {
    tag: 'normas',
    title: 'Normas Oficiales de Competición',
    content: `### 📜 REGLAMENTO DE REGULARIDAD Y JUGABILIDAD • FIFAMANIAKOS FC 27

---

### ⚽ 1. FORMATO DE PARTIDOS & CONFIGURACIÓN
* **Modo de Juego**: Amistosos Online en EA FC 27.
* **Duración por parte**: 6 minutos.
* **Velocidad de juego**: Normal.
* **Controles**: Libres (Manual, Semi o Asistido).
* **Conexión**: Se recomienda conexión por cable LAN. En caso de lag insostenible, ambos DTs deben avisar en los primeros 15 minutos para pausar y reiniciar la sala.

---

### ⏱️ 2. PUNTUALIDAD & TIEMPOS DE ESPERA
* **Tolerancia de espera**: 15 minutos máximo tras la hora acordada entre ambos managers.
* **Walkover (W.O. 3-0)**: Si un DT no se presenta tras 15 minutos sin justificación, el rival podrá solicitar los 3 puntos por Walkover previo reporte a la administración.
* **Desconexiones fortuitas**:
  * **Antes del min 60**: Se reinicia el encuentro disputando únicamente el tiempo restante y conservando la diferencia de goles previa.
  * **Después del min 75**: El marcador se da por finalizado a menos que el jugador afectado solicite disputar el tiempo pendiente.

---

### 🛡️ 3. FAIR PLAY & JUGABILIDAD
* **Prohibido el Anti-Juego**: Queda estrictamente prohibido pasar el balón repetidamente entre los defensores y el portero para congelar el partido a partir del minuto 80.
* **Uso de Pausas**: Las pausas solo deben solicitarse cuando el balón esté fuera de juego. Prohibido cortar jugadas manifiestas de gol del rival mediante pausas.

---

### 📊 4. REGISTRO & INGRESO DE DATOS DEL PARTIDO
* **Ingreso Directo en Plataforma**: Al finalizar el encuentro, el manager ganador (o el manager local en caso de empate) debe ingresar directamente en el módulo de Cargar Resultado todos los datos del partido:
  * Marcador final (Goles Local vs Goles Visitante).
  * Goleadores de cada equipo.
  * Asistidores del encuentro.
  * Tarjetas Amarillas y Rojas mostradas durante el juego.

---

### 💼 5. PLANTILLAS & DRAFT DE LIGA
* **Plantilla Oficial del Draft**: Cada club competirá exclusivamente con los 22 jugadores asignados en el Draft.
* **Tope de Cracks Elite**: Ninguna plantilla podrá superar el tope máximo de **3 Cracks Top Elite (+86 OVR)** al iniciar la temporada.`,
    updatedAt: new Date().toLocaleDateString()
  },
  {
    tag: 'ganancias',
    title: 'Ganancias y Premios de Competición',
    content: `### 💰 SISTEMA DE PREMIOS Y RECOMPENSAS ECONÓMICAS

---

### 🏆 1. PREMIOS DE CAMPEONATO DE LIGA
* 🥇 **Campeón de 1ra División**: $50.000.000 + Trofeo Oficial
* 🥈 **Subcampeón de Liga**: $30.000.000
* 🥉 **3er Puesto**: $15.000.000
* ⚽ **4to Puesto (Clasificación Champions)**: $10.000.000

---

### 🥇 2. BONIFICACIONES POR PARTIDO
* **Victoria en Liga**: $2.500.000 al presupuesto del club.
* **Empate en Liga**: $1.000.000 al presupuesto del club.
* **Derrota**: $0 (Sin penalización económica).

---

### ⭐ 3. PREMIOS INDIVIDUALES AL FINALIZAR TEMPORADA
* ⚽ **PichiChi (Máximo Goleador)**: $8.000.000
* 🎯 **Máximo Asistidor**: $6.000.000
* 🧤 **Zamora (Portero Menos Goleado)**: $6.000.000
* 🌟 **MVP de la Liga**: $10.000.000

---

### 🇪🇺 4. PREMIOS DE COPAS INTERNACIONALES (Champions & Europa League)
* **Campeón de Champions League**: $40.000.000
* **Subcampeón de Champions League**: $20.000.000
* **Campeón de Europa League**: $25.000.000
* **Subcampeón de Europa League**: $12.000.000`,
    updatedAt: new Date().toLocaleDateString()
  },
  {
    tag: 'sanciones',
    title: 'Código Disciplinario y Sanciones',
    content: `### ⚖️ CÓDIGO DISCIPLINARIO & SANCIONES OFICIALES

---

### 🟨 🟫 1. SANCIONES POR TARJETAS Y ACUMULACIÓN
* 🟥 **Tarjeta Roja Directa o Doble Amarilla**: **1 Partido de Suspensión** automático.
* 🟨 **Acumulación de Tarjetas Amarillas**: **3 Tarjetas Amarillas acumuladas** sancionan al jugador con **1 partido de suspensión**.

---

### 🔍 2. OBLIGACIÓN DE VERIFICACIÓN POR EL RIVAL
* **Verificación Previa**: **En caso de sanciones pendientes, el rival deberá verificar previamente en la plataforma que el jugador sancionado NO se encuentre alineado en el 11 titular ni en la banca de suplentes del club rival**.
* **Penalización por Alinear a un Suspendido**: Si un DT alinea a un jugador suspendido, **perderá automáticamente el encuentro por W.O. (3-0)** tras la comprobación del rival y la confirmación de la administración.

---

### 🚫 3. SANCIÓN POR INASISTENCIA (W.O.)
* **Primer W.O. no justificado**: Pérdida del partido 3-0 + Multa de **$5.000.000** del presupuesto del club.
* **Segundo W.O. consecutivo**: Pérdida del partido 3-0 + Resta de **-3 Puntos** en la tabla general.
* **Tercer W.O.**: Expulsión directa de la Liga y liberación de la plantilla al mercado.

---

### 💬 4. RESPETO & CONDUCTA EN COMUNIDAD
* Cero tolerancia a agresiones verbales o falta de respeto en los canales oficiales de WhatsApp/Discord.
* **Sanción**: Multa de $10.000.000 hasta la descalificación del torneo.`,
    updatedAt: new Date().toLocaleDateString()
  },
  {
    tag: 'apuestas',
    title: 'Reglamento de Apuestas Deportivas',
    content: `### 🎲 REGLAMENTO DE APUESTAS ENTRE MANAGERS

---

### 📌 1. NORMAS GENERALES DE APUESTAS
* Las apuestas se realizan exclusivamente con presupuesto virtual del club o créditos de plataforma.
* Ambos managers deben acordar el monto antes de la hora fijada para el encuentro.
* Toda apuesta debe dejarse registrada públicamente en la sección del Foro o Casa de Apuestas.

---

### 💵 2. LÍMITES DE APUESTA POR PARTIDO
* **Apuesta Mínima**: $1.000.000 de presupuesto.
* **Apuesta Máxima**: $20.000.000 de presupuesto por encuentro de Liga.
* **Finales y Clásicos**: Hasta $40.000.000 por partido.

---

### ⚖️ 3. LIQUIDACIÓN DE APUESTAS
* El resultado válido para el cobro de apuestas es el marcador ingresado oficialmente en la plataforma.
* En caso de suspensión o W.O., la apuesta queda **anulada** y se reintegra el saldo a ambos competidores.`,
    updatedAt: new Date().toLocaleDateString()
  }
];

export const INITIAL_BUDGET_PACKAGES: BudgetPackage[] = [
  { id: 'pkg-0', budgetMillions: 100, priceUsd: 2.5 },
  { id: 'pkg-1', budgetMillions: 200, priceUsd: 5 },
  { id: 'pkg-2', budgetMillions: 400, priceUsd: 10 }
];

export const INITIAL_TICKER_NEWS: TickerNewsItem[] = [
  { id: 'news-1', text: '🏆 ¡36 DTs Inscritos Esperando por el Sorteo Oficial de la Liga Online FC 27!', active: true, createdAt: new Date().toLocaleDateString() },
  { id: 'news-2', text: '⚽ Selecciona a cualquier DT inscrito en la pestaña Sorteo Draft para girar la ruleta y asignarle equipo.', active: true, createdAt: new Date().toLocaleDateString() }
];
