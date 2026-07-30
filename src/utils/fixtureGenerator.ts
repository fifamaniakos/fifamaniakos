import { Club, MatchResult } from '../types';

/**
 * Genera el fixture completo de partidos en formato Round-Robin (Ida y Vuelta opcional)
 * para cualquier lista de clubes y competición especificada.
 */
export function generateFixtureForClubs(
  clubs: Club[],
  competitionName: string = '1ra División',
  includeReturnLeg: boolean = true
): MatchResult[] {
  if (!clubs || clubs.length < 2) return [];

  const teamList = [...clubs];
  
  // Algoritmo Round-Robin (si el número de equipos es impar, se agrega un comodín BYE)
  const isOdd = teamList.length % 2 !== 0;
  if (isOdd) {
    teamList.push({ id: 'BYE', name: 'BYE' } as Club);
  }

  const numTeams = teamList.length;
  const numRounds = numTeams - 1;
  const half = numTeams / 2;

  const matches: MatchResult[] = [];
  const today = new Date().toLocaleDateString('es-ES');

  for (let round = 0; round < numRounds; round++) {
    const matchdayNumber = round + 1;

    for (let i = 0; i < half; i++) {
      const homeIndex = (round + i) % (numTeams - 1);
      let awayIndex = (numTeams - 1 - i + round) % (numTeams - 1);

      if (i === 0) {
        awayIndex = numTeams - 1;
      }

      const homeTeam = teamList[homeIndex];
      const awayTeam = teamList[awayIndex];

      if (homeTeam.id !== 'BYE' && awayTeam.id !== 'BYE') {
        matches.push({
          id: `fix-${competitionName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-r${matchdayNumber}-${homeTeam.id}-${awayTeam.id}`,
          matchday: matchdayNumber,
          competition: competitionName,
          homeClubId: homeTeam.id,
          awayClubId: awayTeam.id,
          homeGoals: 0,
          awayGoals: 0,
          homeScorers: '',
          awayScorers: '',
          status: 'PENDIENTE',
          createdAt: today
        });
      }
    }
  }

  // Partidos de Vuelta (intercambiando localía)
  if (includeReturnLeg) {
    const firstLegMatches = [...matches];
    firstLegMatches.forEach(m => {
      matches.push({
        id: `${m.id}-v`,
        matchday: m.matchday + numRounds,
        competition: competitionName,
        homeClubId: m.awayClubId,
        awayClubId: m.homeClubId,
        homeGoals: 0,
        awayGoals: 0,
        homeScorers: '',
        awayScorers: '',
        status: 'PENDIENTE',
        createdAt: today
      });
    });
  }

  return matches;
}

/**
 * Genera automáticamente fixtures para todas las competiciones principales:
 * - 1ra División
 * - 2da División
 * - UEFA Champions League
 * - UEFA Europa League
 * - Copa del Rey
 */
export function generateAllCompetitionsFixtures(clubs: Club[]): MatchResult[] {
  if (!clubs || clubs.length === 0) return [];

  const div1Clubs = clubs.filter(c => !c.division || c.division === '1ra División' || c.division === 'Primera División');
  const div2Clubs = clubs.filter(c => c.division === '2da División' || c.division === 'Segunda División');

  const targetDiv1 = div1Clubs.length >= 2 ? div1Clubs : clubs;
  const div1Matches = generateFixtureForClubs(targetDiv1, '1ra División', true);
  
  const div2Matches = div2Clubs.length >= 2 ? generateFixtureForClubs(div2Clubs, '2da División', true) : [];

  // UEFA Champions League (Top 8 equipos)
  const uefaClubs = targetDiv1.slice(0, 8);
  const uefaMatches = uefaClubs.length >= 4 ? generateFixtureForClubs(uefaClubs, 'UEFA Champions League', true) : [];

  // UEFA Europa League (Equipos 9 a 16)
  const europaClubs = targetDiv1.slice(8, 16);
  const europaMatches = europaClubs.length >= 4 ? generateFixtureForClubs(europaClubs, 'UEFA Europa League', true) : [];

  // Copa del Rey (Cuadro de eliminiatoria directa / liga reducida)
  const copaClubs = targetDiv1.slice(0, 16);
  const copaMatches = copaClubs.length >= 4 ? generateFixtureForClubs(copaClubs, 'Copa del Rey', false) : [];

  return [...div1Matches, ...div2Matches, ...uefaMatches, ...europaMatches, ...copaMatches];
}
