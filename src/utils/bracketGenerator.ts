import { Club, MatchPhase, MatchResult } from '../types';
import { computeCupStandings } from './competitionStats';

interface BracketConfig {
  size: number;
  rounds: MatchPhase[];
}

const BRACKET_CONFIG: Record<string, BracketConfig> = {
  'UEFA Champions League': { size: 8, rounds: ['CUARTOS', 'SEMIFINAL', 'FINAL'] },
  'UEFA Europa League': { size: 8, rounds: ['CUARTOS', 'SEMIFINAL', 'FINAL'] },
  'Copa del Rey': { size: 16, rounds: ['OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'] }
};

const isGroupPhaseMatch = (m: MatchResult) => !m.phase || m.phase === 'GRUPOS';

export function getMatchWinnerClubId(match: MatchResult): string {
  if (match.homeGoals > match.awayGoals) return match.homeClubId;
  if (match.awayGoals > match.homeGoals) return match.awayClubId;
  return match.penaltyWinnerClubId || match.homeClubId;
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

  Object.entries(BRACKET_CONFIG).forEach(([competition, config]) => {
    const groupMatches = matches.filter(m => m.competition === competition && isGroupPhaseMatch(m));
    if (groupMatches.length === 0) return;
    if (groupMatches.some(m => m.status !== 'CONFIRMADO')) return;

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
        ? computeCupStandings(clubs, groupMatches, competition).slice(0, config.size).map(row => row.clubId)
        : previousRoundWinnersOrdered;

      if (!seededClubIds || seededClubIds.length < 2) return;

      generated.push(...buildRoundMatches(competition, phase, roundIndex, seededClubIds));
      return;
    }
  });

  return generated;
}
