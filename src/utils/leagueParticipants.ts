import { Club } from '../types';

export type DivisionLabel = '1ra División' | '2da División';

// Un club del catalogo (migracion 009) que todavia no tiene DT: no juega la
// liga, solo esta disponible para que alguien lo elija al inscribirse.
export function isVacantClub(club: Club): boolean {
  const manager = (club.manager || '').toLowerCase();
  return manager.includes('vacante') || manager.includes('por inscribir');
}

export function isDivision1Club(club: Club): boolean {
  // Un club sin division cae en 1ra por defecto (datos viejos previos a que
  // existiera el campo `division`).
  return !club.division || club.division === '1ra División' || club.division === 'Primera División';
}

export function isDivision2Club(club: Club): boolean {
  return club.division === '2da División' || club.division === 'Segunda División';
}

function buildVacantSlot(idPrefix: string, num: number, divisionLabel: DivisionLabel): Club {
  return {
    id: `${idPrefix}-${num}`,
    name: `Equipo ${num}`,
    shortName: `EQ${num}`,
    manager: 'Por Inscribir (Vacante)',
    gamertag: 'Pendiente',
    platform: 'PS5',
    stadium: `Estadio Equipo ${num}`,
    logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
    division: divisionLabel,
    budget: 100000000,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    form: []
  };
}

/**
 * Ajusta una division al cupo configurado por el admin.
 *
 * Antes esta funcion SOLO rellenaba: si ya habia mas clubes que el cupo,
 * devolvia la lista intacta. Bajar el cupo de 36 a 20 no achicaba nada y el
 * fixture se seguia armando con 36 participantes (70 jornadas en vez de 38).
 * Ahora tambien recorta, priorizando los clubes con DT real sobre los lugares
 * vacantes: si hay que sacar equipos, se sacan primero los que nadie ocupa.
 */
export function fitDivisionToCount(
  divisionClubs: Club[],
  targetCount: number,
  idPrefix: string,
  divisionLabel: DivisionLabel
): Club[] {
  const safeTarget = Math.max(0, Math.floor(targetCount));

  if (divisionClubs.length > safeTarget) {
    const claimed = divisionClubs.filter(c => !isVacantClub(c));
    const vacant = divisionClubs.filter(c => isVacantClub(c));
    // El cupo manda: la cantidad de jornadas del fixture se calcula sobre esta
    // lista, asi que devolver mas equipos que el cupo es exactamente el bug.
    // Se sacan primero los lugares vacantes; si aun asi sobran, se recorta
    // tambien entre los clubes con DT (el admin puso un cupo menor a la
    // cantidad de inscriptos y la UI se lo tiene que mostrar asi).
    return [...claimed, ...vacant].slice(0, safeTarget);
  }

  const padded = [...divisionClubs];
  const slotIdPattern = new RegExp(`^${idPrefix}-(\\d+)$`);
  const missingCount = safeTarget - divisionClubs.length;

  for (let i = 1; i <= missingCount; i++) {
    // Un slot puede seguir teniendo su id de slot aunque ya se le haya
    // asignado un club real, que cambia el nombre a algo que ya no matchea
    // "Equipo N". Sin chequear tambien el id, ese slot se contaba como libre
    // y se regeneraba un duplicado con el mismo id.
    const existingNumSet = new Set(
      padded
        .flatMap(c => {
          const nameMatch = c.name.match(/^Equipo\s+(\d+)$/i);
          const idMatch = c.id.match(slotIdPattern);
          return [
            nameMatch ? parseInt(nameMatch[1], 10) : null,
            idMatch ? parseInt(idMatch[1], 10) : null
          ];
        })
        .filter((n): n is number => n !== null)
    );

    let nextNum = 1;
    while (existingNumSet.has(nextNum)) nextNum++;

    padded.push(buildVacantSlot(idPrefix, nextNum, divisionLabel));
  }

  return padded;
}

/**
 * Participantes reales de una division: los clubes con DT, mas lugares
 * vacantes genericos ("Equipo N") hasta completar el cupo.
 *
 * Los clubes vacantes del catalogo (migracion 009, 234 clubes) NO entran: son
 * opciones para elegir al inscribirse, no equipos jugando.
 */
export function buildDivisionParticipants(
  divisionClubs: Club[],
  targetCount: number,
  idPrefix: string,
  divisionLabel: DivisionLabel
): Club[] {
  const claimedClubs = divisionClubs.filter(c => !isVacantClub(c));
  return fitDivisionToCount(claimedClubs, targetCount, idPrefix, divisionLabel);
}

export function buildLeagueClubs(
  loadedClubs: Club[],
  division1TeamCount: number,
  division2TeamCount: number
): Club[] {
  return [
    ...buildDivisionParticipants(
      loadedClubs.filter(isDivision1Club),
      division1TeamCount,
      'club-1ra-slot',
      '1ra División'
    ),
    ...buildDivisionParticipants(
      loadedClubs.filter(isDivision2Club),
      division2TeamCount,
      'club-2da-slot',
      '2da División'
    )
  ];
}
