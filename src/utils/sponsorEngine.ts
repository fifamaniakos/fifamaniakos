import { Club, MatchPhase, MatchResult, Sponsor, SponsorObjective } from '../types';
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

export function countLeagueWins(clubId: string, clubs: Club[], matches: MatchResult[]): number {
  const club = clubs.find(c => c.id === clubId);
  if (!club) return 0;

  return confirmedMatches(matches, club.division).filter(m => {
    if (m.homeClubId === clubId) return m.homeGoals > m.awayGoals;
    if (m.awayClubId === clubId) return m.awayGoals > m.homeGoals;
    return false;
  }).length;
}

export interface ObjectiveProgress {
  met: boolean;
  current: number;
  target: number;
}

/**
 * Suma un tipo de evento por jugador dentro de una competicion.
 * La clave es playerId cuando existe; si no, nombre + club, igual que hace
 * computePlayerStatsForCompetition, porque las actas permiten cargar jugadores
 * que no estan en la plantilla.
 */
function totalsByPlayer(
  matches: MatchResult[],
  competition: string,
  type: 'GOAL' | 'ASSIST'
): { key: string; clubId: string; total: number }[] {
  const totals = new Map<string, { key: string; clubId: string; total: number }>();

  confirmedMatches(matches, competition).forEach(m => {
    (m.playerEvents || []).forEach(ev => {
      if (ev.type !== type) return;
      const key = ev.playerId || `${ev.playerName}-${ev.clubId}`;
      const existing = totals.get(key);
      if (existing) {
        existing.total += ev.count;
      } else {
        totals.set(key, { key, clubId: ev.clubId, total: ev.count });
      }
    });
  });

  return [...totals.values()];
}

const competitionsIn = (matches: MatchResult[]): string[] =>
  [...new Set(matches.map(m => m.competition).filter((c): c is string => !!c))];

export function topScorerProgress(
  clubId: string,
  matches: MatchResult[],
  competition: string,
  threshold: number
): ObjectiveProgress {
  const totals = totalsByPlayer(matches, competition, 'GOAL');
  const best = totals.reduce((max, row) => Math.max(max, row.total), 0);
  const clubBest = totals
    .filter(row => row.clubId === clubId)
    .reduce((max, row) => Math.max(max, row.total), 0);

  // Empate en el maximo: cumplen todos los clubes empatados (Botin de Oro
  // compartido). Por eso se compara con >= y no con identidad de jugador.
  const isTopScorer = clubBest > 0 && clubBest >= best;

  return {
    met: isTopScorer && clubBest >= threshold,
    current: clubBest,
    target: threshold
  };
}

export function bestAssistsProgress(
  clubId: string,
  matches: MatchResult[],
  competition: string | undefined,
  threshold: number
): ObjectiveProgress {
  // "un solo jugador en una sola competicion": nunca se suman competiciones
  // distintas, se toma el mejor total individual de cada una por separado.
  const competitions = competition ? [competition] : competitionsIn(matches);

  const clubBest = competitions.reduce((max, comp) => {
    const totals = totalsByPlayer(matches, comp, 'ASSIST').filter(row => row.clubId === clubId);
    return totals.reduce((inner, row) => Math.max(inner, row.total), max);
  }, 0);

  return {
    met: clubBest >= threshold && clubBest > 0,
    current: clubBest,
    target: threshold
  };
}

export interface ContractLine extends ObjectiveProgress {
  objectiveId: string;
  label: string;
  amount: number; // en euros; 0 si no se cumplio
}

export interface ContractEvaluation {
  lines: ContractLine[];
  totalAmount: number;
}

const booleanProgress = (met: boolean): ObjectiveProgress => ({
  met,
  current: met ? 1 : 0,
  target: 1
});

export function evaluateObjective(
  clubId: string,
  clubs: Club[],
  matches: MatchResult[],
  objective: SponsorObjective
): ObjectiveProgress {
  switch (objective.kind) {
    case 'CHAMPION':
      return booleanProgress(
        !!objective.competition && isChampionOf(clubId, clubs, matches, objective.competition)
      );

    case 'RUNNER_UP':
      return booleanProgress(
        !!objective.competition && isRunnerUpOf(clubId, clubs, matches, objective.competition)
      );

    case 'REACH_PHASE':
      return booleanProgress(
        !!objective.competition &&
          !!objective.phase &&
          reachedPhase(clubId, matches, objective.competition, objective.phase)
      );

    case 'LEAGUE_WINS': {
      const target = objective.threshold ?? 0;
      const current = countLeagueWins(clubId, clubs, matches);
      return { met: current >= target, current, target };
    }

    case 'TOP_SCORER':
      if (!objective.competition) return booleanProgress(false);
      return topScorerProgress(clubId, matches, objective.competition, objective.threshold ?? 0);

    case 'ASSISTS_THRESHOLD':
      return bestAssistsProgress(clubId, matches, objective.competition, objective.threshold ?? 0);

    default:
      return booleanProgress(false);
  }
}

export function evaluateContract(
  clubId: string,
  clubs: Club[],
  matches: MatchResult[],
  objectives: SponsorObjective[]
): ContractEvaluation {
  const lines: ContractLine[] = objectives.map(objective => {
    const progress = evaluateObjective(clubId, clubs, matches, objective);
    return {
      ...progress,
      objectiveId: objective.id,
      label: objective.label,
      amount: progress.met ? objective.rewardMillions * 1_000_000 : 0
    };
  });

  return {
    lines,
    totalAmount: lines.reduce((sum, line) => sum + line.amount, 0)
  };
}

export function eligibleSponsors(club: Club, sponsors: Sponsor[]): Sponsor[] {
  // requirementMaxPosition queda deliberadamente sin evaluar: la app no guarda
  // historial por temporada (MatchResult no tiene seasonNumber), asi que no hay
  // forma de saber en que puesto termino el club la temporada pasada.
  return sponsors.filter(sponsor => {
    if (!sponsor.active) return false;
    if (sponsor.requirementDivision && sponsor.requirementDivision !== club.division) return false;
    return true;
  });
}
