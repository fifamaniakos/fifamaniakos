import { describe, it, expect } from 'vitest';
import { Club, MatchResult } from '../types';
import { isChampionOf, isRunnerUpOf } from './sponsorEngine';

export const club = (id: string, division = '1ra División'): Club => ({
  id,
  name: id,
  shortName: id,
  manager: 'M',
  gamertag: 'G',
  platform: 'PS5',
  logoUrl: '',
  budget: 0,
  division,
  stadium: 'E',
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  points: 0,
  form: []
});

export const match = (over: Partial<MatchResult>): MatchResult => ({
  id: Math.random().toString(),
  matchday: 1,
  homeClubId: 'a',
  awayClubId: 'b',
  homeGoals: 0,
  awayGoals: 0,
  homeScorers: '',
  awayScorers: '',
  status: 'CONFIRMADO',
  createdAt: '',
  ...over
});

describe('isChampionOf', () => {
  const clubs = [club('a'), club('b')];

  it('en copa, el campeon es el ganador de la FINAL', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', phase: 'FINAL', homeClubId: 'a', awayClubId: 'b', homeGoals: 2, awayGoals: 1 })
    ];
    expect(isChampionOf('a', clubs, matches, 'UEFA Champions League')).toBe(true);
    expect(isChampionOf('b', clubs, matches, 'UEFA Champions League')).toBe(false);
  });

  it('en copa, si la FINAL termino empatada usa penaltyWinnerClubId', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', phase: 'FINAL', homeClubId: 'a', awayClubId: 'b', homeGoals: 1, awayGoals: 1, penaltyWinnerClubId: 'b' })
    ];
    expect(isChampionOf('b', clubs, matches, 'UEFA Champions League')).toBe(true);
    expect(isChampionOf('a', clubs, matches, 'UEFA Champions League')).toBe(false);
  });

  it('en liga, el campeon es el primero de la tabla', () => {
    const matches = [
      match({ competition: '1ra División', homeClubId: 'b', awayClubId: 'a', homeGoals: 3, awayGoals: 0 })
    ];
    expect(isChampionOf('b', clubs, matches, '1ra División')).toBe(true);
    expect(isChampionOf('a', clubs, matches, '1ra División')).toBe(false);
  });

  it('ignora partidos no confirmados', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', phase: 'FINAL', homeClubId: 'a', awayClubId: 'b', homeGoals: 2, awayGoals: 1, status: 'PENDIENTE' })
    ];
    expect(isChampionOf('a', clubs, matches, 'UEFA Champions League')).toBe(false);
  });

  it('devuelve false si la competicion no existe', () => {
    expect(isChampionOf('a', clubs, [], 'Mundial de Clubes')).toBe(false);
  });
});

describe('isRunnerUpOf', () => {
  const clubs = [club('a'), club('b')];

  it('en copa, el subcampeon es el perdedor de la FINAL', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', phase: 'FINAL', homeClubId: 'a', awayClubId: 'b', homeGoals: 2, awayGoals: 1 })
    ];
    expect(isRunnerUpOf('b', clubs, matches, 'UEFA Champions League')).toBe(true);
  });

  it('en liga, el subcampeon es el segundo de la tabla', () => {
    const matches = [
      match({ competition: '1ra División', homeClubId: 'b', awayClubId: 'a', homeGoals: 3, awayGoals: 0 })
    ];
    expect(isRunnerUpOf('a', clubs, matches, '1ra División')).toBe(true);
    expect(isRunnerUpOf('b', clubs, matches, '1ra División')).toBe(false);
  });
});
