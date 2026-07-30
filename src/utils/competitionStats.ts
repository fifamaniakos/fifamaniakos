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

const findSofifaPlayerByName = (name: string) => {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return undefined;
  return SOFIFA_PLAYERS_DATABASE.find(p => p.name.trim().toLowerCase() === normalized);
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
      (match.playerEvents || []).forEach(ev => {
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

export type EuropeanQualificationZone = 'CHAMPIONS' | 'EUROPA';

export interface QualificationZoneInfo {
  zone: EuropeanQualificationZone;
  viaCopaDelRey: boolean;
}

export function computeDomesticQualificationZones(
  sortedClubs: Club[],
  copaDelReyChampionClubId?: string
): Record<string, QualificationZoneInfo> {
  const zones: Record<string, QualificationZoneInfo> = {};

  sortedClubs.forEach((club, idx) => {
    const pos = idx + 1;
    if (pos <= 4) {
      zones[club.id] = { zone: 'CHAMPIONS', viaCopaDelRey: false };
    } else if (pos === 5) {
      zones[club.id] = { zone: 'EUROPA', viaCopaDelRey: false };
    }
  });

  if (copaDelReyChampionClubId) {
    if (!zones[copaDelReyChampionClubId]) {
      zones[copaDelReyChampionClubId] = { zone: 'EUROPA', viaCopaDelRey: true };
    } else {
      const nextUnclassified = sortedClubs.find((club, idx) => idx + 1 > 5 && !zones[club.id]);
      if (nextUnclassified) {
        zones[nextUnclassified.id] = { zone: 'EUROPA', viaCopaDelRey: true };
      }
    }
  }

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
