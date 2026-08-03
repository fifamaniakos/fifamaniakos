import { Club, MatchPhase, MatchResult, Player } from '../types';
import { SOFIFA_PLAYERS_DATABASE } from '../data/sofifaPlayersDatabase';

export const PHASE_LABELS: Record<MatchPhase, string> = {
  GRUPOS: 'Fase de Grupos',
  OCTAVOS: 'Octavos de Final',
  CUARTOS: 'Cuartos de Final',
  SEMIFINAL: 'Semifinal',
  FINAL: 'Final'
};

export interface CupStandingRow {
  clubId: string;
  club: Club;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export function computeCupStandings(clubs: Club[], matches: MatchResult[], competition: string): CupStandingRow[] {
  const rows: Record<string, CupStandingRow> = {};

  const ensureRow = (clubId: string): CupStandingRow | null => {
    if (!rows[clubId]) {
      const club = clubs.find(c => c.id === clubId);
      if (!club) return null;
      rows[clubId] = { clubId, club, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
    }
    return rows[clubId];
  };

  matches
    .filter(m => m.competition === competition && m.status === 'CONFIRMADO' && (!m.phase || m.phase === 'GRUPOS'))
    .forEach(m => {
      const home = ensureRow(m.homeClubId);
      const away = ensureRow(m.awayClubId);
      if (!home || !away) return;

      home.played += 1;
      away.played += 1;
      home.goalsFor += m.homeGoals;
      home.goalsAgainst += m.awayGoals;
      away.goalsFor += m.awayGoals;
      away.goalsAgainst += m.homeGoals;

      if (m.homeGoals > m.awayGoals) {
        home.won += 1;
        home.points += 3;
        away.lost += 1;
      } else if (m.homeGoals < m.awayGoals) {
        away.won += 1;
        away.points += 3;
        home.lost += 1;
      } else {
        home.drawn += 1;
        home.points += 1;
        away.drawn += 1;
        away.points += 1;
      }
    });

  return Object.values(rows).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;
    if (diffB !== diffA) return diffB - diffA;
    return b.goalsFor - a.goalsFor;
  });
}

export interface PlayerStatsAggregate {
  id: string;
  name: string;
  position: string;
  rating: number;
  clubName: string;
  clubLogo: string;
  photoUrl: string;
  cardType?: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  disciplinaryPoints: number;
}

// La busqueda se hace por cada goleador de cada partido y por cada jugador de
// cada plantilla, asi que un .find() lineal recorria los ~16.000 registros de
// SOFIFA (y re-normalizaba cada nombre) en cada llamada. El indice se arma una
// sola vez, de forma perezosa, para que el costo no se pague si la pantalla de
// estadisticas nunca se abre.
let sofifaPlayersByName: Map<string, (typeof SOFIFA_PLAYERS_DATABASE)[number]> | null = null;

const getSofifaIndex = () => {
  if (!sofifaPlayersByName) {
    sofifaPlayersByName = new Map();
    for (const player of SOFIFA_PLAYERS_DATABASE) {
      const key = player.name.trim().toLowerCase();
      // El primero gana, igual que el .find() anterior ante nombres repetidos.
      if (key && !sofifaPlayersByName.has(key)) sofifaPlayersByName.set(key, player);
    }
  }
  return sofifaPlayersByName;
};

const findSofifaPlayerByName = (name: string) => {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return undefined;
  return getSofifaIndex().get(normalized);
};

export function computePlayerStatsForCompetition(
  clubs: Club[],
  players: Player[],
  matches: MatchResult[],
  competition: string
): PlayerStatsAggregate[] {
  const statsMap: Record<string, PlayerStatsAggregate> = {};

  matches
    .filter(m => m.competition === competition && m.status === 'CONFIRMADO')
    .forEach(match => {
      // Las alineaciones (APPEARANCE) solo sirven para contar PJ: sin este
      // filtro, cualquiera que haya sido titular apareceria en la tabla de
      // goleadores con 0 goles.
      (match.playerEvents || []).filter(ev => ev.type !== 'APPEARANCE').forEach(ev => {
        const key = ev.playerId || `${ev.playerName}-${ev.clubId}`;
        if (!statsMap[key]) {
          const club = clubs.find(c => c.id === ev.clubId);
          const knownPlayer = ev.playerId
            ? players.find(p => p.id === ev.playerId)
            : players.find(p => p.clubId === ev.clubId && p.name.trim().toLowerCase() === ev.playerName.trim().toLowerCase());
          const sofifaPlayer = !knownPlayer ? findSofifaPlayerByName(ev.playerName) : undefined;

          statsMap[key] = {
            id: key,
            name: ev.playerName,
            position: knownPlayer?.position || sofifaPlayer?.position || 'DC',
            rating: knownPlayer?.rating || sofifaPlayer?.rating || 80,
            clubName: club ? club.name : 'Club',
            clubLogo: club ? club.logoUrl : '',
            photoUrl: knownPlayer?.photoUrl || sofifaPlayer?.photoUrl || '',
            cardType: knownPlayer?.cardType || sofifaPlayer?.cardType,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            disciplinaryPoints: 0
          };
        }

        if (ev.type === 'GOAL') statsMap[key].goals += ev.count;
        if (ev.type === 'ASSIST') statsMap[key].assists += ev.count;
        if (ev.type === 'YELLOW_CARD') statsMap[key].yellowCards += ev.count;
        if (ev.type === 'RED_CARD') statsMap[key].redCards += ev.count;
        statsMap[key].disciplinaryPoints = statsMap[key].yellowCards * 1 + statsMap[key].redCards * 3;
      });
    });

  return Object.values(statsMap);
}

export interface ClubPlayerStatRow {
  id: string;
  name: string;
  position: string;
  rating: number;
  photoUrl?: string;
  isStarter?: boolean;
  matchesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

// Estadisticas de los jugadores de un club sumando TODAS las competiciones.
// Se derivan de los eventos del acta de cada partido confirmado (la misma
// fuente que las tablas de goleadores/asistencias), no de campos guardados
// en el jugador: esos nunca se actualizan al reportar un partido, asi que la
// tabla de "Estadisticas completas" mostraba siempre 0.
export function computeClubPlayerStats(
  clubId: string,
  players: Player[],
  matches: MatchResult[]
): ClubPlayerStatRow[] {
  const rows: Record<string, ClubPlayerStatRow> = {};

  // El plantel entero aparece listado, aunque todavia no tenga eventos.
  players
    .filter(p => p.clubId === clubId)
    .forEach(p => {
      const sofifaPlayer = findSofifaPlayerByName(p.name);
      rows[p.name.trim().toLowerCase()] = {
        id: p.id,
        name: p.name,
        position: p.position,
        rating: p.rating,
        photoUrl: p.photoUrl || sofifaPlayer?.photoUrl || '',
        isStarter: p.isStarter,
        matchesPlayed: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      };
    });

  matches
    .filter(m => m.status === 'CONFIRMADO')
    .forEach(match => {
      // PJ se cuenta una vez por partido aunque el acta liste al jugador
      // repetido en la alineacion.
      const countedAppearances = new Set<string>();

      (match.playerEvents || [])
        .filter(ev => ev.clubId === clubId)
        .forEach(ev => {
          const key = ev.playerName.trim().toLowerCase();
          if (!key) return;

          if (!rows[key]) {
            // Un acta puede nombrar a alguien que ya no esta en el plantel
            // (vendido, o cargado a mano): igual cuenta lo que hizo.
            const sofifaPlayer = findSofifaPlayerByName(ev.playerName);
            rows[key] = {
              id: key,
              name: ev.playerName,
              position: sofifaPlayer?.position || '—',
              rating: sofifaPlayer?.rating || 0,
              photoUrl: sofifaPlayer?.photoUrl || '',
              matchesPlayed: 0,
              goals: 0,
              assists: 0,
              yellowCards: 0,
              redCards: 0
            };
          }

          if (ev.type === 'APPEARANCE' && !countedAppearances.has(key)) {
            countedAppearances.add(key);
            rows[key].matchesPlayed += 1;
          }
          if (ev.type === 'GOAL') rows[key].goals += ev.count;
          if (ev.type === 'ASSIST') rows[key].assists += ev.count;
          if (ev.type === 'YELLOW_CARD') rows[key].yellowCards += ev.count;
          if (ev.type === 'RED_CARD') rows[key].redCards += ev.count;
        });
    });

  return Object.values(rows).sort(
    (a, b) => b.goals - a.goals || b.assists - a.assists || a.name.localeCompare(b.name)
  );
}

export type EuropeanQualificationZone = 'CHAMPIONS' | 'EUROPA' | 'CONFERENCE';

export interface QualificationZoneInfo {
  zone: EuropeanQualificationZone;
}

export function computeDomesticQualificationZones(
  sortedClubs: Club[]
): Record<string, QualificationZoneInfo> {
  const zones: Record<string, QualificationZoneInfo> = {};

  sortedClubs.forEach((club, idx) => {
    const pos = idx + 1;
    if (pos <= 8) {
      zones[club.id] = { zone: 'CHAMPIONS' };
    } else if (pos <= 16) {
      zones[club.id] = { zone: 'EUROPA' };
    } else if (pos <= 24) {
      zones[club.id] = { zone: 'CONFERENCE' };
    }
  });

  return zones;
}

export interface FixtureRoundGroup {
  key: string;
  label: string;
  badge: string;
  date: string;
  matches: MatchResult[];
  confirmedCount: number;
}

const KNOCKOUT_PHASE_ORDER: MatchPhase[] = ['OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'];

const KNOCKOUT_PHASE_BADGE: Record<MatchPhase, string> = {
  GRUPOS: '',
  OCTAVOS: '8F',
  CUARTOS: 'CF',
  SEMIFINAL: 'SF',
  FINAL: 'F'
};

export function groupFixtureIntoRounds(matches: MatchResult[], competition: string): FixtureRoundGroup[] {
  const competitionMatches = matches.filter(m => m.competition === competition);

  const groupPhaseByMatchday: Record<number, MatchResult[]> = {};
  competitionMatches
    .filter(m => !m.phase || m.phase === 'GRUPOS')
    .forEach(m => {
      if (!groupPhaseByMatchday[m.matchday]) groupPhaseByMatchday[m.matchday] = [];
      groupPhaseByMatchday[m.matchday].push(m);
    });

  const jornadaGroups: FixtureRoundGroup[] = Object.keys(groupPhaseByMatchday)
    .map(Number)
    .sort((a, b) => a - b)
    .map(matchday => {
      const dayMatches = groupPhaseByMatchday[matchday];
      return {
        key: `J${matchday}`,
        label: `Jornada ${matchday}`,
        badge: `J${matchday}`,
        date: dayMatches[0]?.createdAt || '',
        matches: dayMatches,
        confirmedCount: dayMatches.filter(m => m.status === 'CONFIRMADO').length
      };
    });

  const knockoutGroups: FixtureRoundGroup[] = KNOCKOUT_PHASE_ORDER
    .map((phase): FixtureRoundGroup | null => {
      const phaseMatches = competitionMatches
        .filter(m => m.phase === phase)
        .sort((a, b) => a.matchday - b.matchday);
      if (phaseMatches.length === 0) return null;
      return {
        key: phase,
        label: PHASE_LABELS[phase],
        badge: KNOCKOUT_PHASE_BADGE[phase],
        date: phaseMatches[0]?.createdAt || '',
        matches: phaseMatches,
        confirmedCount: phaseMatches.filter(m => m.status === 'CONFIRMADO').length
      };
    })
    .filter((g): g is FixtureRoundGroup => g !== null);

  return [...jornadaGroups, ...knockoutGroups];
}
