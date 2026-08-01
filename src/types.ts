export interface Club {
  id: string;
  name: string;
  shortName: string;
  manager: string;
  gamertag: string;
  platform: 'PS5' | 'Xbox Series X' | 'PC';
  logoUrl: string;
  budget: number; // In Euros (€)
  division: string;
  stadium: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export type PlayerPosition = 'POR' | 'DFC' | 'LI' | 'LD' | 'MCD' | 'MC' | 'MCO' | 'EI' | 'ED' | 'DC';

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Player {
  id: string;
  name: string;
  clubId: string;
  position: PlayerPosition;
  rating: number; // 40-99 OVR
  stats: PlayerStats;
  cardType: 'Gold' | 'Special' | 'Icon' | 'Silver';
  value: number; // Value in Euros (€) - Market value from SOFIFA/database
  releaseClause?: number; // Release clause set by manager (€)
  photoUrl: string;
  isStarter: boolean;
  nationality?: string;
  // Individual Player Statistics
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  matchesPlayed?: number;
}

export type ForumCategory =
  | 'Anuncios'
  | 'Normas competiciones'
  | 'Ganancias competiciones'
  | 'Sanciones'
  | 'Apuestas deportivas'
  | 'Quejas y sugerencias';

export type ForumSectionTag =
  | 'normas'
  | 'ganancias'
  | 'sanciones'
  | 'apuestas'
  | 'mercado';

export interface ForumReply {
  id: string;
  authorName: string;
  authorClub: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  isFounderAuthor?: boolean;
}

export interface ForumTopic {
  id: string;
  title: string;
  category: ForumCategory;
  authorName: string;
  authorClub: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  views: number;
  likes: number;
  replies: ForumReply[];
  isPinned?: boolean;
  isFounderAuthor?: boolean;
}

export interface CompetitionSection {
  tag: ForumSectionTag;
  title: string;
  content: string;
  updatedAt: string;
}

export interface BudgetPackage {
  id: string;
  budgetMillions: number; // Presupuesto extra en millones de €
  priceUsd: number;
}

export interface LeagueSettings {
  id: string;
  currentSeasonNumber: number;
}

export interface PlayerMatchEvent {
  playerId?: string;
  playerName: string;
  clubId: string;
  type: 'GOAL' | 'ASSIST' | 'YELLOW_CARD' | 'RED_CARD';
  count: number;
}

export type MatchPhase = 'GRUPOS' | 'OCTAVOS' | 'CUARTOS' | 'SEMIFINAL' | 'FINAL';

export interface MatchResult {
  id: string;
  matchday: number;
  competition?: '1ra División' | '2da División' | 'UEFA Champions League' | 'UEFA Europa League' | 'UEFA Conference League' | 'Supercopa de Europa' | string;
  phase?: MatchPhase;
  homeClubId: string;
  awayClubId: string;
  homeGoals: number;
  awayGoals: number;
  homeScorers: string;
  awayScorers: string;
  homeAssists?: string;
  awayAssists?: string;
  homeYellowCards?: string;
  awayYellowCards?: string;
  homeRedCards?: string;
  awayRedCards?: string;
  playerEvents?: PlayerMatchEvent[];
  proofImageUrl?: string;
  penaltyWinnerClubId?: string;
  status: 'PENDIENTE' | 'CONFIRMADO' | 'RECHAZADO';
  createdAt: string;
  notes?: string;
  // Marca que alguien cargó un acta para este partido. Distingue un partido
  // del fixture que nadie tocó todavía de uno con resultado cargado esperando
  // validación del admin. No se puede deducir de proofImageUrl porque la
  // captura es opcional al reportar.
  reportedAt?: string;
}

export interface TransferItem {
  id: string;
  playerId: string;
  player: Player;
  sellerClubId: string;
  askingPrice: number;
  status: 'DISPONIBLE' | 'VENDIDO';
  createdAt: string;
}

export interface FinancialTransaction {
  id: string;
  clubId: string;
  type: 'INGRESO' | 'GASTO';
  concept: string;
  amount: number;
  date: string;
}

export interface TickerNewsItem {
  id: string;
  text: string;
  active: boolean;
  createdAt?: string;
}
