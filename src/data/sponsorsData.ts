import { Sponsor, SponsorObjective } from '../types';

export const INITIAL_SPONSORS: Sponsor[] = [
  { id: 'sponsor-adidas', name: 'adidas', logoUrl: '', tier: 1, requirementDivision: '1ra División', active: true },
  { id: 'sponsor-cocacola', name: 'Coca-Cola', logoUrl: '', tier: 2, requirementDivision: '1ra División', active: true },
  { id: 'sponsor-fedex', name: 'FedEx', logoUrl: '', tier: 3, active: true },
  { id: 'sponsor-nike', name: 'Nike', logoUrl: '', tier: 4, active: true },
  { id: 'sponsor-samsung', name: 'Samsung', logoUrl: '', tier: 5, active: true }
];

export const INITIAL_SPONSOR_OBJECTIVES: SponsorObjective[] = [
  // adidas
  { id: 'obj-adidas-1', sponsorId: 'sponsor-adidas', kind: 'CHAMPION', competition: 'UEFA Champions League', rewardMillions: 35, label: 'Campeon Champions' },
  { id: 'obj-adidas-2', sponsorId: 'sponsor-adidas', kind: 'CHAMPION', competition: 'UEFA Europa League', rewardMillions: 25, label: 'Campeon UEFA' },
  { id: 'obj-adidas-3', sponsorId: 'sponsor-adidas', kind: 'CHAMPION', competition: '1ra División', rewardMillions: 20, label: 'Campeon Liga' },
  { id: 'obj-adidas-4', sponsorId: 'sponsor-adidas', kind: 'LEAGUE_WINS', threshold: 20, rewardMillions: 20, label: 'Ganar 20 partidos de liga' },
  { id: 'obj-adidas-5', sponsorId: 'sponsor-adidas', kind: 'TOP_SCORER', competition: '1ra División', threshold: 30, rewardMillions: 20, label: 'Pichichi Liga con +30 goles' },
  { id: 'obj-adidas-6', sponsorId: 'sponsor-adidas', kind: 'TOP_SCORER', competition: 'UEFA Champions League', threshold: 0, rewardMillions: 10, label: 'Pichichi Champions' },
  { id: 'obj-adidas-7', sponsorId: 'sponsor-adidas', kind: 'TOP_SCORER', competition: 'UEFA Europa League', threshold: 0, rewardMillions: 7, label: 'Pichichi UEFA' },
  { id: 'obj-adidas-8', sponsorId: 'sponsor-adidas', kind: 'ASSISTS_THRESHOLD', competition: '1ra División', threshold: 30, rewardMillions: 10, label: '+30 asistencias en Liga (un solo jugador)' },

  // Coca-Cola
  { id: 'obj-cc-1', sponsorId: 'sponsor-cocacola', kind: 'CHAMPION', competition: 'UEFA Champions League', rewardMillions: 30, label: 'Campeon Champions' },
  { id: 'obj-cc-2', sponsorId: 'sponsor-cocacola', kind: 'CHAMPION', competition: 'UEFA Europa League', rewardMillions: 25, label: 'Campeon UEFA' },
  { id: 'obj-cc-3', sponsorId: 'sponsor-cocacola', kind: 'REACH_PHASE', competition: 'UEFA Champions League', phase: 'SEMIFINAL', rewardMillions: 20, label: 'Semis de Champions' },
  { id: 'obj-cc-4', sponsorId: 'sponsor-cocacola', kind: 'REACH_PHASE', competition: 'UEFA Europa League', phase: 'SEMIFINAL', rewardMillions: 10, label: 'Semis UEFA' },
  { id: 'obj-cc-5', sponsorId: 'sponsor-cocacola', kind: 'LEAGUE_WINS', threshold: 15, rewardMillions: 15, label: 'Ganar 15 partidos de liga' },
  { id: 'obj-cc-6', sponsorId: 'sponsor-cocacola', kind: 'TOP_SCORER', competition: '1ra División', threshold: 25, rewardMillions: 15, label: 'Pichichi Liga con +25 goles' },
  { id: 'obj-cc-7', sponsorId: 'sponsor-cocacola', kind: 'TOP_SCORER', competition: 'UEFA Champions League', threshold: 0, rewardMillions: 15, label: 'Pichichi Champions' },
  { id: 'obj-cc-8', sponsorId: 'sponsor-cocacola', kind: 'TOP_SCORER', competition: 'UEFA Europa League', threshold: 0, rewardMillions: 10, label: 'Pichichi UEFA' },
  { id: 'obj-cc-9', sponsorId: 'sponsor-cocacola', kind: 'ASSISTS_THRESHOLD', threshold: 25, rewardMillions: 10, label: '+25 asistencias (un jugador en una competicion)' },

  // FedEx
  { id: 'obj-fedex-1', sponsorId: 'sponsor-fedex', kind: 'CHAMPION', competition: 'Supercopa de Europa', rewardMillions: 20, label: 'Campeon Supercopa de Europa' },
  { id: 'obj-fedex-2', sponsorId: 'sponsor-fedex', kind: 'REACH_PHASE', competition: 'UEFA Champions League', phase: 'CUARTOS', rewardMillions: 15, label: '4tos de Champions' },
  { id: 'obj-fedex-3', sponsorId: 'sponsor-fedex', kind: 'REACH_PHASE', competition: 'UEFA Europa League', phase: 'CUARTOS', rewardMillions: 10, label: '4tos UEFA' },
  { id: 'obj-fedex-4', sponsorId: 'sponsor-fedex', kind: 'LEAGUE_WINS', threshold: 10, rewardMillions: 12, label: 'Ganar 10 partidos de liga' },
  { id: 'obj-fedex-5', sponsorId: 'sponsor-fedex', kind: 'TOP_SCORER', competition: '1ra División', threshold: 20, rewardMillions: 10, label: 'Pichichi Liga con +20 goles' },
  { id: 'obj-fedex-6', sponsorId: 'sponsor-fedex', kind: 'ASSISTS_THRESHOLD', threshold: 20, rewardMillions: 8, label: '+20 asistencias (un jugador en una competicion)' },

  // Nike
  { id: 'obj-nike-1', sponsorId: 'sponsor-nike', kind: 'CHAMPION', competition: 'Supercopa de Liga', rewardMillions: 15, label: 'Campeon Supercopa de Liga' },
  { id: 'obj-nike-2', sponsorId: 'sponsor-nike', kind: 'REACH_PHASE', competition: 'UEFA Champions League', phase: 'OCTAVOS', rewardMillions: 12, label: '8vos Champions' },
  { id: 'obj-nike-3', sponsorId: 'sponsor-nike', kind: 'REACH_PHASE', competition: 'UEFA Europa League', phase: 'OCTAVOS', rewardMillions: 8, label: '8vos UEFA' },
  { id: 'obj-nike-4', sponsorId: 'sponsor-nike', kind: 'LEAGUE_WINS', threshold: 8, rewardMillions: 10, label: 'Ganar 8 partidos de liga' },
  { id: 'obj-nike-5', sponsorId: 'sponsor-nike', kind: 'TOP_SCORER', competition: '1ra División', threshold: 15, rewardMillions: 8, label: 'Pichichi Liga con +15 goles' },
  { id: 'obj-nike-6', sponsorId: 'sponsor-nike', kind: 'ASSISTS_THRESHOLD', threshold: 15, rewardMillions: 5, label: '+15 asistencias (un jugador en una competicion)' },

  // Samsung
  { id: 'obj-sam-1', sponsorId: 'sponsor-samsung', kind: 'CHAMPION', competition: 'Mundial de Clubes', rewardMillions: 15, label: 'Campeon Mundial de Clubes' },
  { id: 'obj-sam-2', sponsorId: 'sponsor-samsung', kind: 'RUNNER_UP', competition: '1ra División', rewardMillions: 12, label: 'Subcampeon Liga' },
  { id: 'obj-sam-3', sponsorId: 'sponsor-samsung', kind: 'REACH_PHASE', competition: 'UEFA Champions League', phase: 'OCTAVOS', rewardMillions: 8, label: '8vos Champions' },
  { id: 'obj-sam-4', sponsorId: 'sponsor-samsung', kind: 'REACH_PHASE', competition: 'UEFA Europa League', phase: 'OCTAVOS', rewardMillions: 5, label: '8vos UEFA' },
  { id: 'obj-sam-5', sponsorId: 'sponsor-samsung', kind: 'LEAGUE_WINS', threshold: 7, rewardMillions: 7, label: 'Ganar 7 partidos de liga' },
  { id: 'obj-sam-6', sponsorId: 'sponsor-samsung', kind: 'TOP_SCORER', competition: '1ra División', threshold: 10, rewardMillions: 4, label: 'Pichichi Liga con +10 goles' },
  { id: 'obj-sam-7', sponsorId: 'sponsor-samsung', kind: 'ASSISTS_THRESHOLD', threshold: 10, rewardMillions: 2, label: '+10 asistencias (un jugador en una competicion)' }
];
