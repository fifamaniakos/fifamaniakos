import { describe, it, expect } from 'vitest';
import { buildMatchReportSquad } from './matchReportSquad';

const officialRoma = [
  { name: 'Paulo Dybala', position: 'MCO' },
  { name: 'Lorenzo Pellegrini', position: 'MC' },
  { name: 'Gianluca Mancini', position: 'DFC' }
];

describe('buildMatchReportSquad', () => {
  it('BUG: fichar un jugador no puede dejar el desplegable con ese solo nombre', () => {
    const fichado = [{ name: 'Antonio Rudiger', position: 'DFC' }];

    const squad = buildMatchReportSquad(fichado, officialRoma);

    expect(squad.length).toBe(4);
    expect(squad.map(p => p.name)).toContain('Antonio Rudiger');
    expect(squad.map(p => p.name)).toContain('Paulo Dybala');
  });

  it('los jugadores propios del club van primero', () => {
    const squad = buildMatchReportSquad([{ name: 'Antonio Rudiger', position: 'DFC' }], officialRoma);
    expect(squad[0].name).toBe('Antonio Rudiger');
  });

  it('sin jugadores propios devuelve la plantilla oficial completa', () => {
    expect(buildMatchReportSquad([], officialRoma)).toHaveLength(3);
  });

  it('sin ninguna de las dos fuentes devuelve una lista vacia', () => {
    expect(buildMatchReportSquad([], [])).toEqual([]);
  });

  it('no repite un jugador que esta en las dos fuentes', () => {
    const squad = buildMatchReportSquad([{ name: 'Paulo Dybala', position: 'DC' }], officialRoma);

    expect(squad).toHaveLength(3);
    // Gana la ficha del club, que es la real: quedo como DC, no como MCO.
    expect(squad[0]).toEqual({ name: 'Paulo Dybala', pos: 'DC' });
  });

  it('no repite por diferencias de acentos ni de mayusculas', () => {
    const squad = buildMatchReportSquad(
      [{ name: '  paulo dybala  ', position: 'DC' }],
      officialRoma
    );
    expect(squad).toHaveLength(3);
  });

  it('descarta nombres vacios', () => {
    const squad = buildMatchReportSquad([{ name: '   ', position: 'DC' }], officialRoma);
    expect(squad).toHaveLength(3);
  });
});
