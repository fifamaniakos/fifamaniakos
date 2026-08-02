import { Club, MatchResult } from '../types';
import { isDivision2Club } from './leagueParticipants';

export type DomesticDivision = '1ra División' | '2da División';

/**
 * La division de un club, normalizada.
 *
 * Los datos vienen con tres variantes historicas del mismo valor:
 * `'1ra División'`, `'Primera División'` y `undefined` (clubes anteriores a que
 * existiera el campo). Comparar el string crudo hace que el mismo club entre o
 * no en la tabla segun como se haya cargado.
 */
export function normalizeDivision(club: Club): DomesticDivision {
  return isDivision2Club(club) ? '2da División' : '1ra División';
}

/**
 * Normaliza la competicion de un partido a una division domestica, o null si
 * el partido es de copa (Champions, Europa League, Conference).
 *
 * Un partido sin `competition` se considera domestico: son actas viejas,
 * cargadas cuando la unica competicion que existia era la liga.
 */
export function matchDomesticDivision(match: MatchResult): DomesticDivision | null {
  const competition = (match.competition || '').trim();
  if (competition === '') return '1ra División';
  if (competition === '1ra División' || competition === 'Primera División') return '1ra División';
  if (competition === '2da División' || competition === 'Segunda División') return '2da División';
  return null;
}

/**
 * Recalcula la tabla de posiciones de cada club a partir de los partidos.
 *
 * Solo cuentan los partidos CONFIRMADOS de la propia division del club: antes
 * se sumaban TODOS los partidos confirmados, asi que ganar en Champions daba
 * 3 puntos en la tabla de 1ra y los PJ de la clasificacion nunca coincidian
 * con las jornadas jugadas de la liga.
 *
 * Es puramente derivado de `matches` (la fuente de verdad) y nunca se persiste
 * de vuelta en `clubs`: un manager solo tiene permiso RLS para actualizar su
 * propio club, no la fila de sus rivales.
 */
export function recalculateStandings(clubsList: Club[], matchesList: MatchResult[]): Club[] {
  const confirmedByDivision = new Map<DomesticDivision, MatchResult[]>();

  matchesList
    .filter(m => m.status === 'CONFIRMADO')
    .forEach(m => {
      const division = matchDomesticDivision(m);
      if (!division) return;
      const bucket = confirmedByDivision.get(division);
      if (bucket) bucket.push(m);
      else confirmedByDivision.set(division, [m]);
    });

  return clubsList.map(club => {
    const clubMatches = (confirmedByDivision.get(normalizeDivision(club)) || []).filter(
      m => m.homeClubId === club.id || m.awayClubId === club.id
    );

    let played = 0;
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;
    let points = 0;
    const form: ('W' | 'D' | 'L')[] = [];

    // La racha son los ultimos 5 partidos: hay que ordenarlos por jornada
    // explicitamente. Antes se invertia el array tal como venia de la base, que
    // no tiene orden garantizado, asi que la "racha reciente" mostraba cinco
    // resultados cualquiera.
    const byMatchdayDesc = [...clubMatches].sort((a, b) => b.matchday - a.matchday);

    byMatchdayDesc.forEach(m => {
      played += 1;
      const isHome = m.homeClubId === club.id;
      const myGoals = isHome ? m.homeGoals : m.awayGoals;
      const oppGoals = isHome ? m.awayGoals : m.homeGoals;

      goalsFor += myGoals;
      goalsAgainst += oppGoals;

      if (myGoals > oppGoals) {
        won += 1;
        points += 3;
        if (form.length < 5) form.push('W');
      } else if (myGoals === oppGoals) {
        drawn += 1;
        points += 1;
        if (form.length < 5) form.push('D');
      } else {
        lost += 1;
        if (form.length < 5) form.push('L');
      }
    });

    return { ...club, played, won, drawn, lost, goalsFor, goalsAgainst, points, form };
  });
}
