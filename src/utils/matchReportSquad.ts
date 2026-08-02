export interface SquadOption {
  name: string;
  pos: string;
}

interface NamedPlayer {
  name: string;
  position: string;
}

// "Rudiger" y "Rudiger" con diereses son el mismo jugador: los fichajes se
// cargan escritos a mano y las plantillas oficiales vienen de la base de
// SOFIFA, asi que sin normalizar los acentos el mismo nombre aparecia dos
// veces en el desplegable. El rango ̀-ͯ son las tildes y diereses
// combinantes que deja sueltos normalize('NFD').
const normalizeName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/**
 * Arma la lista de jugadores que se ofrece al cargar un acta.
 *
 * Antes esto era un if/else: si el club tenia AL MENOS un jugador propio
 * cargado se devolvian solo esos, y la plantilla oficial no se miraba nunca.
 * El resultado era que fichar un jugador dejaba el desplegable con ese unico
 * nombre y sin el resto del equipo, justo cuando hay que reportar quien hizo
 * los goles.
 *
 * Ahora se combinan las dos fuentes: primero los jugadores propios del club
 * (son los reales, con su ficha y su valor) y despues los de la plantilla
 * oficial que todavia no esten, para poder nombrar a cualquiera que haya
 * jugado el partido.
 */
export function buildMatchReportSquad(
  clubPlayers: NamedPlayer[],
  officialSquad: NamedPlayer[]
): SquadOption[] {
  const options: SquadOption[] = [];
  const seen = new Set<string>();

  const add = (player: NamedPlayer) => {
    const key = normalizeName(player.name);
    if (!key || seen.has(key)) return;
    seen.add(key);
    options.push({ name: player.name, pos: player.position });
  };

  clubPlayers.forEach(add);
  officialSquad.forEach(add);

  return options;
}
