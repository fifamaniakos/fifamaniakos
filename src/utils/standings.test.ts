import { describe, expect, it } from 'vitest';
import { Club, MatchResult } from '../types';
import { matchDomesticDivision, normalizeDivision, recalculateStandings } from './standings';

const club = (id: string, division?: string): Club => ({
  id,
  name: id,
  shortName: id,
  manager: 'DT',
  gamertag: 'gt',
  platform: 'PS5',
  stadium: 'Estadio',
  logoUrl: '',
  division,
  budget: 0,
  played: 99,
  won: 99,
  drawn: 99,
  lost: 99,
  goalsFor: 99,
  goalsAgainst: 99,
  points: 99,
  form: ['W', 'W', 'W', 'W', 'W']
} as Club);

const match = (
  id: string,
  home: string,
  away: string,
  homeGoals: number,
  awayGoals: number,
  competition: string | undefined,
  matchday = 1,
  status: MatchResult['status'] = 'CONFIRMADO'
): MatchResult => ({
  id,
  matchday,
  competition,
  homeClubId: home,
  awayClubId: away,
  homeGoals,
  awayGoals,
  homeScorers: '',
  awayScorers: '',
  status,
  createdAt: '01/01/2026'
} as MatchResult);

describe('normalizeDivision', () => {
  it('trata las tres variantes de 1ra como la misma division', () => {
    expect(normalizeDivision(club('a'))).toBe('1ra División');
    expect(normalizeDivision(club('b', '1ra División'))).toBe('1ra División');
    expect(normalizeDivision(club('c', 'Primera División'))).toBe('1ra División');
  });

  it('reconoce las dos variantes de 2da', () => {
    expect(normalizeDivision(club('d', '2da División'))).toBe('2da División');
    expect(normalizeDivision(club('e', 'Segunda División'))).toBe('2da División');
  });
});

describe('matchDomesticDivision', () => {
  it('devuelve null para las copas', () => {
    expect(matchDomesticDivision(match('m', 'a', 'b', 1, 0, 'UEFA Champions League'))).toBeNull();
  });

  it('trata un partido sin competicion como 1ra (actas viejas)', () => {
    expect(matchDomesticDivision(match('m', 'a', 'b', 1, 0, undefined))).toBe('1ra División');
  });
});

describe('recalculateStandings', () => {
  it('no suma los partidos de copa a la tabla de la liga', () => {
    const clubs = [club('a'), club('b')];
    const matches = [
      match('m1', 'a', 'b', 2, 0, '1ra División', 1),
      match('m2', 'a', 'b', 5, 0, 'UEFA Champions League', 1),
      match('m3', 'a', 'b', 3, 0, 'UEFA Europa League', 2)
    ];

    const [a] = recalculateStandings(clubs, matches);
    expect(a.played).toBe(1);
    expect(a.won).toBe(1);
    expect(a.points).toBe(3);
    expect(a.goalsFor).toBe(2);
  });

  it('ignora los partidos no confirmados', () => {
    const [a] = recalculateStandings(
      [club('a')],
      [match('m1', 'a', 'b', 2, 0, '1ra División', 1, 'PENDIENTE')]
    );
    expect(a.played).toBe(0);
    expect(a.points).toBe(0);
  });

  it('no cuenta partidos de otra division para un club de 2da', () => {
    const clubs = [club('a', '2da División')];
    const matches = [
      match('m1', 'a', 'b', 1, 0, '2da División', 1),
      match('m2', 'a', 'b', 4, 0, '1ra División', 1)
    ];
    const [a] = recalculateStandings(clubs, matches);
    expect(a.played).toBe(1);
    expect(a.goalsFor).toBe(1);
  });

  it('parte de cero y no arrastra los valores guardados en el club', () => {
    const [a] = recalculateStandings([club('a')], []);
    expect(a.played).toBe(0);
    expect(a.points).toBe(0);
    expect(a.form).toEqual([]);
  });

  it('la racha son los ultimos 5 por jornada, sin importar el orden de la lista', () => {
    const matches = [
      match('m1', 'a', 'b', 1, 0, '1ra División', 1), // W
      match('m6', 'a', 'b', 0, 1, '1ra División', 6), // L
      match('m3', 'a', 'b', 1, 1, '1ra División', 3), // D
      match('m2', 'a', 'b', 1, 0, '1ra División', 2), // W
      match('m5', 'a', 'b', 0, 1, '1ra División', 5), // L
      match('m4', 'a', 'b', 1, 0, '1ra División', 4)  // W
    ];
    const [a] = recalculateStandings([club('a')], matches);
    expect(a.played).toBe(6);
    // J6 L, J5 L, J4 W, J3 D, J2 W
    expect(a.form).toEqual(['L', 'L', 'W', 'D', 'W']);
  });

  it('cuenta bien al visitante', () => {
    const [b] = recalculateStandings(
      [club('b')],
      [match('m1', 'a', 'b', 0, 2, '1ra División', 1)]
    );
    expect(b.won).toBe(1);
    expect(b.goalsFor).toBe(2);
    expect(b.goalsAgainst).toBe(0);
    expect(b.points).toBe(3);
  });
});
