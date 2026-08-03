import { describe, it, expect } from 'vitest';
import { Club } from '../types';
import { buildLeagueClubs, fitDivisionToCount, isVacantClub } from './leagueParticipants';
import {
  expectedMatchdayCount,
  generateFixtureForClubs,
  isFixtureInSyncWithParticipants
} from './fixtureGenerator';

const makeClub = (id: string, overrides: Partial<Club> = {}): Club => ({
  id,
  name: id,
  shortName: id.slice(0, 3).toUpperCase(),
  manager: 'DT Real',
  gamertag: `@${id}`,
  platform: 'PS5',
  stadium: `Estadio ${id}`,
  logoUrl: '',
  division: '1ra División',
  budget: 100000000,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  points: 0,
  form: [],
  ...overrides
});

const claimed = (n: number, prefix = 'dt') =>
  Array.from({ length: n }, (_, i) => makeClub(`${prefix}-${i + 1}`));

const jornadas = (matches: { matchday: number }[]) => new Set(matches.map(m => m.matchday)).size;

describe('cupo por división vs. fixture', () => {
  it('BUG: bajar el cupo de 36 a 20 debe dejar 20 participantes, no 36', () => {
    // 36 clubes ya reclamados (el cupo anterior estaba en 36).
    const clubs = claimed(36);

    const league = buildLeagueClubs(clubs, 20, 0);

    expect(league).toHaveLength(20);
  });

  it('BUG: con cupo 20 el fixture debe tener 38 jornadas, no 70', () => {
    const league = buildLeagueClubs(claimed(36), 20, 0);
    const fixture = generateFixtureForClubs(league, '1ra División', true);

    expect(jornadas(fixture)).toBe(38);
  });

  it('36 equipos siguen dando 70 jornadas (control del cálculo)', () => {
    expect(expectedMatchdayCount(36)).toBe(70);
    expect(expectedMatchdayCount(20)).toBe(38);
    expect(expectedMatchdayCount(21)).toBe(42); // impar -> BYE
    expect(expectedMatchdayCount(1)).toBe(0);
  });

  it('rellena con vacantes cuando faltan equipos para el cupo', () => {
    const league = buildLeagueClubs(claimed(3), 20, 0);
    expect(league).toHaveLength(20);
    expect(league.filter(isVacantClub)).toHaveLength(17);
  });

  it('descarta primero los vacantes al recortar', () => {
    const mixed = [
      ...claimed(4),
      makeClub('vac-1', { manager: 'Por Inscribir (Vacante)' }),
      makeClub('vac-2', { manager: 'Por Inscribir (Vacante)' })
    ];
    const fitted = fitDivisionToCount(mixed, 4, 'club-1ra-slot', '1ra División');
    expect(fitted.map(c => c.id)).toEqual(['dt-1', 'dt-2', 'dt-3', 'dt-4']);
  });

  it('el cupo manda incluso si hay más DTs inscriptos que lugares', () => {
    const fitted = fitDivisionToCount(claimed(5), 3, 'club-1ra-slot', '1ra División');
    expect(fitted).toHaveLength(3);
  });

  it('los clubes vacantes del catálogo (migración 009) no juegan la liga', () => {
    const catalogo = Array.from({ length: 234 }, (_, i) =>
      makeClub(`club-top10-${i}`, { manager: 'Por Inscribir (Vacante)' })
    );
    const league = buildLeagueClubs([...catalogo, ...claimed(2)], 20, 0);
    expect(league).toHaveLength(20);
    expect(league.filter(c => c.id.startsWith('club-top10-'))).toHaveLength(0);
  });

  it('separa correctamente 1ra y 2da división', () => {
    const clubs = [
      ...claimed(2, 'a'),
      makeClub('b-1', { division: '2da División' }),
      makeClub('sin-division', { division: undefined })
    ];
    const league = buildLeagueClubs(clubs, 10, 6);
    // Un club sin division cuenta como de 1ra (conserva su `division` vacía).
    expect(league.filter(c => c.division !== '2da División')).toHaveLength(10);
    expect(league.filter(c => c.division === '2da División')).toHaveLength(6);
  });
});

describe('reconciliación fixture <-> cupo', () => {
  it('detecta un fixture viejo de 36 equipos cuando el cupo es 20', () => {
    const viejo = generateFixtureForClubs(claimed(36), '1ra División', true);
    expect(jornadas(viejo)).toBe(70);
    expect(isFixtureInSyncWithParticipants(viejo, '1ra División', 20)).toBe(false);
  });

  it('acepta un fixture que sí corresponde al cupo', () => {
    const nuevo = generateFixtureForClubs(claimed(20), '1ra División', true);
    expect(isFixtureInSyncWithParticipants(nuevo, '1ra División', 20)).toBe(true);
  });

  it('ignora los partidos de otras competiciones y las eliminatorias', () => {
    const div1 = generateFixtureForClubs(claimed(20), '1ra División', true);
    const div2 = generateFixtureForClubs(claimed(8, 'b'), '2da División', true);
    const copa = div1.slice(0, 4).map(m => ({ ...m, competition: 'Champions League', phase: 'FINAL' as const }));
    const todos = [...div1, ...div2, ...copa];

    expect(isFixtureInSyncWithParticipants(todos, '1ra División', 20)).toBe(true);
    expect(isFixtureInSyncWithParticipants(todos, '2da División', 8)).toBe(true);
  });

  it('con cupo 0 o 1 el fixture correcto es vacío', () => {
    expect(isFixtureInSyncWithParticipants([], '1ra División', 0)).toBe(true);
    expect(isFixtureInSyncWithParticipants([], '1ra División', 1)).toBe(true);
  });
});
