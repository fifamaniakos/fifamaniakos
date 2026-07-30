import { Club, MatchPhase, MatchResult } from '../types';

interface BracketConfig {
  size: number;
  rounds: MatchPhase[];
  positionBand: [number, number];
}

const BRACKET_CONFIG: Record<string, BracketConfig> = {
  'UEFA Champions League': { size: 8, rounds: ['CUARTOS', 'SEMIFINAL', 'FINAL'], positionBand: [1, 8] },
  'UEFA Europa League': { size: 8, rounds: ['CUARTOS', 'SEMIFINAL', 'FINAL'], positionBand: [9, 16] },
  'UEFA Conference League': { size: 8, rounds: ['CUARTOS', 'SEMIFINAL', 'FINAL'], positionBand: [17, 24] }
};

export function getMatchWinnerClubId(match: MatchResult): string {
  if (match.homeGoals > match.awayGoals) return match.homeClubId;
  if (match.awayGoals > match.homeGoals) return match.awayClubId;
  return match.penaltyWinnerClubId || match.homeClubId;
}

export function getDomesticStandingOrder(clubs: Club[]): Club[] {
  return [...clubs]
    .filter(c => !c.division || c.division === '1ra División' || c.division === 'Primera División')
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffB = b.goalsFor - b.goalsAgainst;
      const diffA = a.goalsFor - a.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });
}

export function getSeededClubsForCompetition(
  clubs: Club[],
  competition: string
): { seed: number; club: Club; domesticPosition: number }[] {
  const config = BRACKET_CONFIG[competition];
  if (!config) return [];

  const domesticOrder = getDomesticStandingOrder(clubs);
  const [start, end] = config.positionBand;

  return domesticOrder.slice(start - 1, end).map((club, idx) => ({
    seed: idx + 1,
    club,
    domesticPosition: start + idx
  }));
}

export function getPositionBand(competition: string): [number, number] | undefined {
  return BRACKET_CONFIG[competition]?.positionBand;
}

function buildRoundMatches(
  competition: string,
  phase: MatchPhase,
  roundIndex: number,
  clubIds: string[]
): MatchResult[] {
  const today = new Date().toLocaleDateString('es-ES');
  const matches: MatchResult[] = [];
  const pairCount = clubIds.length / 2;

  for (let i = 0; i < pairCount; i++) {
    const homeClubId = clubIds[i];
    const awayClubId = clubIds[clubIds.length - 1 - i];
    matches.push({
      id: `bracket-${competition.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${phase.toLowerCase()}-${i}`,
      matchday: 1000 * (roundIndex + 1) + i,
      competition,
      phase,
      homeClubId,
      awayClubId,
      homeGoals: 0,
      awayGoals: 0,
      homeScorers: '',
      awayScorers: '',
      status: 'PENDIENTE',
      createdAt: today
    });
  }

  return matches;
}

export function generatePendingKnockoutMatches(clubs: Club[], matches: MatchResult[]): MatchResult[] {
  const generated: MatchResult[] = [];
  const domesticOrder = getDomesticStandingOrder(clubs);

  Object.entries(BRACKET_CONFIG).forEach(([competition, config]) => {
    let previousRoundWinnersOrdered: string[] | null = null;

    for (let roundIndex = 0; roundIndex < config.rounds.length; roundIndex++) {
      const phase = config.rounds[roundIndex];
      const existingRoundMatches = matches
        .filter(m => m.competition === competition && m.phase === phase)
        .sort((a, b) => a.matchday - b.matchday);

      if (existingRoundMatches.length > 0) {
        if (existingRoundMatches.some(m => m.status !== 'CONFIRMADO')) {
          return;
        }
        previousRoundWinnersOrdered = existingRoundMatches.map(getMatchWinnerClubId);
        continue;
      }

      const seededClubIds = roundIndex === 0
        ? domesticOrder.slice(config.positionBand[0] - 1, config.positionBand[1]).map(c => c.id)
        : previousRoundWinnersOrdered;

      const minRequired = roundIndex === 0 ? config.size : 2;
      if (!seededClubIds || seededClubIds.length < minRequired) return;

      generated.push(...buildRoundMatches(competition, phase, roundIndex, seededClubIds));
      return;
    }
  });

  return generated;
}
