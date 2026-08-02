import { Club, MatchPhase, MatchResult } from '../types';
import { computeCupStandings } from './competitionStats';

// Las divisiones se resuelven por tabla de posiciones; el resto de las
// competiciones son eliminatorias y se resuelven por el partido de FINAL.
const LEAGUE_COMPETITIONS = ['1ra División', '2da División'];

const isLeague = (competition: string) => LEAGUE_COMPETITIONS.includes(competition);

const confirmedMatches = (matches: MatchResult[], competition: string) =>
  matches.filter(m => m.competition === competition && m.status === 'CONFIRMADO');

/** Devuelve [ganadorId, perdedorId] de la final de una copa, o null si no se jugo. */
function finalResult(matches: MatchResult[], competition: string): [string, string] | null {
  const final = confirmedMatches(matches, competition).find(m => m.phase === 'FINAL');
  if (!final) return null;

  if (final.homeGoals > final.awayGoals) return [final.homeClubId, final.awayClubId];
  if (final.awayGoals > final.homeGoals) return [final.awayClubId, final.homeClubId];

  // Empate: solo hay campeon si se cargo quien gano por penales.
  if (!final.penaltyWinnerClubId) return null;
  const loser = final.penaltyWinnerClubId === final.homeClubId ? final.awayClubId : final.homeClubId;
  return [final.penaltyWinnerClubId, loser];
}

function positionInLeague(clubId: string, clubs: Club[], matches: MatchResult[], competition: string): number {
  const standings = computeCupStandings(clubs, matches, competition);
  return standings.findIndex(row => row.clubId === clubId);
}

export function isChampionOf(clubId: string, clubs: Club[], matches: MatchResult[], competition: string): boolean {
  if (isLeague(competition)) {
    return positionInLeague(clubId, clubs, matches, competition) === 0;
  }
  const result = finalResult(matches, competition);
  return result !== null && result[0] === clubId;
}

export function isRunnerUpOf(clubId: string, clubs: Club[], matches: MatchResult[], competition: string): boolean {
  if (isLeague(competition)) {
    return positionInLeague(clubId, clubs, matches, competition) === 1;
  }
  const result = finalResult(matches, competition);
  return result !== null && result[1] === clubId;
}

// Orden de avance en una eliminatoria. Llegar a la final implica haber pasado
// cuartos, asi que un objetivo de "4tos" se cumple tambien siendo campeon.
const PHASE_ORDER: MatchPhase[] = ['GRUPOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'];

export function reachedPhase(
  clubId: string,
  matches: MatchResult[],
  competition: string,
  phase: MatchPhase
): boolean {
  const targetIndex = PHASE_ORDER.indexOf(phase);
  if (targetIndex === -1) return false;

  return confirmedMatches(matches, competition).some(m => {
    if (m.homeClubId !== clubId && m.awayClubId !== clubId) return false;
    if (!m.phase) return false;
    return PHASE_ORDER.indexOf(m.phase) >= targetIndex;
  });
}
