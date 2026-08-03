import { Club, Player, ForumTopic, MatchResult, TransferItem, FinancialTransaction, TickerNewsItem, CompetitionSection, BudgetPackage } from '../types';
import { TOP10_LEAGUE_CLUBS } from './top10LeagueClubs';
import { generateAllCompetitionsFixtures } from '../utils/fixtureGenerator';

export const FC27_STANDARD_LOGO = 'https://cdn.sofifa.net/teams/241/60.png';
export const FC27_ADMIN_AVATAR = '/admin_avatar.png?v=3';

export const DRAFT_BOMBO_TEAMS = [
  {
    "id": "bombo-team-1",
    "name": "Paris Saint-Germain",
    "shortName": "PAR",
    "logoUrl": "https://cdn.sofifa.net/teams/73/60.png",
    "stadium": "Estadio Paris Saint-Germain",
    "country": "France",
    "league": "Ligue 1",
    "defaultBudget": 151470000
  },
  {
    "id": "bombo-team-2",
    "name": "FC Barcelona",
    "shortName": "FC ",
    "logoUrl": "https://cdn.sofifa.net/teams/241/60.png",
    "stadium": "Estadio FC Barcelona",
    "country": "Spain",
    "league": "La Liga",
    "defaultBudget": 150750000
  },
  {
    "id": "bombo-team-3",
    "name": "Arsenal",
    "shortName": "ARS",
    "logoUrl": "https://cdn.sofifa.net/teams/1/60.png",
    "stadium": "Estadio Arsenal",
    "country": "Brazil",
    "league": "Premier League",
    "defaultBudget": 150660000
  },
  {
    "id": "bombo-team-4",
    "name": "Manchester City",
    "shortName": "MAN",
    "logoUrl": "https://cdn.sofifa.net/teams/10/60.png",
    "stadium": "Estadio Manchester City",
    "country": "Norway",
    "league": "Premier League",
    "defaultBudget": 149400000
  },
  {
    "id": "bombo-team-5",
    "name": "Real Madrid",
    "shortName": "REA",
    "logoUrl": "https://cdn.sofifa.net/teams/243/60.png",
    "stadium": "Estadio Real Madrid",
    "country": "France",
    "league": "La Liga",
    "defaultBudget": 148590000
  },
  {
    "id": "bombo-team-6",
    "name": "Inter",
    "shortName": "INT",
    "logoUrl": "https://cdn.sofifa.net/teams/44/60.png",
    "stadium": "Estadio Inter",
    "country": "Italy",
    "league": "Serie A",
    "defaultBudget": 145350000
  },
  {
    "id": "bombo-team-7",
    "name": "Liverpool",
    "shortName": "LIV",
    "logoUrl": "https://cdn.sofifa.net/teams/9/60.png",
    "stadium": "Estadio Liverpool",
    "country": "Egypt",
    "league": "Premier League",
    "defaultBudget": 145260000
  },
  {
    "id": "bombo-team-8",
    "name": "Aston Villa",
    "shortName": "AST",
    "logoUrl": "https://cdn.sofifa.net/teams/2/60.png",
    "stadium": "Estadio Aston Villa",
    "country": "Argentina",
    "league": "Premier League",
    "defaultBudget": 145170000
  },
  {
    "id": "bombo-team-9",
    "name": "Juventus",
    "shortName": "JUV",
    "logoUrl": "https://cdn.sofifa.net/teams/45/60.png",
    "stadium": "Estadio Juventus",
    "country": "Brazil",
    "league": "Serie A",
    "defaultBudget": 144180000
  },
  {
    "id": "bombo-team-10",
    "name": "Atlético Madrid",
    "shortName": "ATL",
    "logoUrl": "https://cdn.sofifa.net/teams/240/60.png",
    "stadium": "Estadio Atlético Madrid",
    "country": "Slovenia",
    "league": "La Liga",
    "defaultBudget": 144090000
  },
  {
    "id": "bombo-team-11",
    "name": "Chelsea",
    "shortName": "CHE",
    "logoUrl": "https://cdn.sofifa.net/teams/5/60.png",
    "stadium": "Estadio Chelsea",
    "country": "England",
    "league": "Premier League",
    "defaultBudget": 143280000
  },
  {
    "id": "bombo-team-12",
    "name": "Manchester United",
    "shortName": "MAN",
    "logoUrl": "https://cdn.sofifa.net/teams/11/60.png",
    "stadium": "Estadio Manchester United",
    "country": "Portugal",
    "league": "Premier League",
    "defaultBudget": 142380000
  },
  {
    "id": "bombo-team-13",
    "name": "FC Bayern München",
    "shortName": "FC ",
    "logoUrl": "https://cdn.sofifa.net/teams/21/60.png",
    "stadium": "Estadio FC Bayern München",
    "country": "Germany",
    "league": "Bundesliga",
    "defaultBudget": 142380000
  },
  {
    "id": "bombo-team-14",
    "name": "Tottenham Hotspur",
    "shortName": "TOT",
    "logoUrl": "https://cdn.sofifa.net/teams/18/60.png",
    "stadium": "Estadio Tottenham Hotspur",
    "country": "England",
    "league": "Premier League",
    "defaultBudget": 142290000
  },
  {
    "id": "bombo-team-15",
    "name": "Napoli",
    "shortName": "NAP",
    "logoUrl": "https://cdn.sofifa.net/teams/48/60.png",
    "stadium": "Estadio Napoli",
    "country": "Belgium",
    "league": "Serie A",
    "defaultBudget": 141525000
  },
  {
    "id": "bombo-team-16",
    "name": "Borussia Dortmund",
    "shortName": "BOR",
    "logoUrl": "https://cdn.sofifa.net/teams/22/60.png",
    "stadium": "Estadio Borussia Dortmund",
    "country": "Switzerland",
    "league": "Bundesliga",
    "defaultBudget": 141210000
  },
  {
    "id": "bombo-team-17",
    "name": "AC Milan",
    "shortName": "AC ",
    "logoUrl": "https://cdn.sofifa.net/teams/47/60.png",
    "stadium": "Estadio AC Milan",
    "country": "France",
    "league": "Serie A",
    "defaultBudget": 140940000
  },
  {
    "id": "bombo-team-18",
    "name": "Real Betis Balompié",
    "shortName": "REA",
    "logoUrl": "https://cdn.sofifa.net/teams/449/60.png",
    "stadium": "Estadio Real Betis Balompié",
    "country": "Spain",
    "league": "La Liga",
    "defaultBudget": 140850000
  },
  {
    "id": "bombo-team-19",
    "name": "Villarreal CF",
    "shortName": "VIL",
    "logoUrl": "https://cdn.sofifa.net/teams/483/60.png",
    "stadium": "Estadio Villarreal CF",
    "country": "Spain",
    "league": "La Liga",
    "defaultBudget": 140310000
  },
  {
    "id": "bombo-team-20",
    "name": "Nottingham Forest",
    "shortName": "NOT",
    "logoUrl": "https://cdn.sofifa.net/teams/14/60.png",
    "stadium": "Estadio Nottingham Forest",
    "country": "England",
    "league": "Premier League",
    "defaultBudget": 138960000
  },
  {
    "id": "bombo-team-21",
    "name": "Newcastle United",
    "shortName": "NEW",
    "logoUrl": "https://cdn.sofifa.net/teams/13/60.png",
    "stadium": "Estadio Newcastle United",
    "country": "Brazil",
    "league": "Premier League",
    "defaultBudget": 138600000
  },
  {
    "id": "bombo-team-22",
    "name": "Sporting CP",
    "shortName": "SPO",
    "logoUrl": "https://cdn.sofifa.net/teams/237/60.png",
    "stadium": "Estadio Sporting CP",
    "country": "Denmark",
    "league": "Primeira Liga",
    "defaultBudget": 137880000
  },
  {
    "id": "bombo-team-23",
    "name": "Sunderland",
    "shortName": "SUN",
    "logoUrl": "https://cdn.sofifa.net/teams/106/60.png",
    "stadium": "Estadio Sunderland",
    "country": "Switzerland",
    "league": "Premier League",
    "defaultBudget": 137430000
  },
  {
    "id": "bombo-team-24",
    "name": "SL Benfica",
    "shortName": "SL ",
    "logoUrl": "https://cdn.sofifa.net/teams/234/60.png",
    "stadium": "Estadio SL Benfica",
    "country": "Greece",
    "league": "Primeira Liga",
    "defaultBudget": 136376470
  },
  {
    "id": "bombo-team-25",
    "name": "VfL Wolfsburg",
    "shortName": "VFL",
    "logoUrl": "https://cdn.sofifa.net/teams/175/60.png",
    "stadium": "Estadio VfL Wolfsburg",
    "country": "Poland",
    "league": "Bundesliga",
    "defaultBudget": 136260000
  },
  {
    "id": "bombo-team-26",
    "name": "Roma",
    "shortName": "ROM",
    "logoUrl": "https://cdn.sofifa.net/teams/52/60.png",
    "stadium": "Estadio Roma",
    "country": "Argentina",
    "league": "Serie A",
    "defaultBudget": 135947368
  },
  {
    "id": "bombo-team-27",
    "name": "Fiorentina",
    "shortName": "FIO",
    "logoUrl": "https://cdn.sofifa.net/teams/110374/60.png",
    "stadium": "Estadio Fiorentina",
    "country": "Spain",
    "league": "Serie A",
    "defaultBudget": 135635294
  },
  {
    "id": "bombo-team-28",
    "name": "AS Monaco",
    "shortName": "AS ",
    "logoUrl": "https://cdn.sofifa.net/teams/69/60.png",
    "stadium": "Estadio AS Monaco",
    "country": "Switzerland",
    "league": "Ligue 1",
    "defaultBudget": 135540000
  },
  {
    "id": "bombo-team-29",
    "name": "VfB Stuttgart",
    "shortName": "VFB",
    "logoUrl": "https://cdn.sofifa.net/teams/36/60.png",
    "stadium": "Estadio VfB Stuttgart",
    "country": "Germany",
    "league": "Bundesliga",
    "defaultBudget": 134730000
  },
  {
    "id": "bombo-team-30",
    "name": "Galatasaray SK",
    "shortName": "GAL",
    "logoUrl": "https://cdn.sofifa.net/teams/325/60.png",
    "stadium": "Estadio Galatasaray SK",
    "country": "Nigeria",
    "league": "Süper Lig",
    "defaultBudget": 134640000
  },
  {
    "id": "bombo-team-31",
    "name": "FC Porto",
    "shortName": "FC ",
    "logoUrl": "https://cdn.sofifa.net/teams/236/60.png",
    "stadium": "Estadio FC Porto",
    "country": "Portugal",
    "league": "Primeira Liga",
    "defaultBudget": 134152941
  },
  {
    "id": "bombo-team-32",
    "name": "Burnley",
    "shortName": "BUR",
    "logoUrl": "https://cdn.sofifa.net/teams/1796/60.png",
    "stadium": "Estadio Burnley",
    "country": "Slovakia",
    "league": "Premier League",
    "defaultBudget": 134010000
  },
  {
    "id": "bombo-team-33",
    "name": "Bayer 04 Leverkusen",
    "shortName": "BAY",
    "logoUrl": "https://cdn.sofifa.net/teams/32/60.png",
    "stadium": "Estadio Bayer 04 Leverkusen",
    "country": "Spain",
    "league": "Bundesliga",
    "defaultBudget": 133799999
  },
  {
    "id": "bombo-team-34",
    "name": "Everton",
    "shortName": "EVE",
    "logoUrl": "https://cdn.sofifa.net/teams/7/60.png",
    "stadium": "Estadio Everton",
    "country": "England",
    "league": "Premier League",
    "defaultBudget": 133699999
  },
  {
    "id": "bombo-team-35",
    "name": "Leeds United",
    "shortName": "LEE",
    "logoUrl": "https://cdn.sofifa.net/teams/8/60.png",
    "stadium": "Estadio Leeds United",
    "country": "Brazil",
    "league": "Premier League",
    "defaultBudget": 133470000
  },
  {
    "id": "bombo-team-36",
    "name": "Feyenoord",
    "shortName": "FEY",
    "logoUrl": "https://cdn.sofifa.net/teams/246/60.png",
    "stadium": "Estadio Feyenoord",
    "country": "England",
    "league": "Eredivisie",
    "defaultBudget": 133470000
  }
];

export const INITIAL_CLUBS: Club[] = TOP10_LEAGUE_CLUBS.map((club) => ({
  id: club.id,
  name: club.name,
  shortName: club.shortName,
  manager: 'Por Inscribir (Vacante)',
  gamertag: '@Por Inscribir',
  platform: 'PS5',
  stadium: club.stadium,
  country: club.country,
  league: club.league,
  logoUrl: club.logoUrl,
  division: club.division,
  budget: club.budget,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  points: 0,
  form: []
}));

export const INITIAL_PLAYERS: Player[] = [];
export const INITIAL_TOPICS: ForumTopic[] = [];
export const INITIAL_MATCHES: MatchResult[] = generateAllCompetitionsFixtures(INITIAL_CLUBS);
export const INITIAL_TRANSFERS: TransferItem[] = [];
export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [];

export const INITIAL_COMPETITION_SECTIONS: CompetitionSection[] = [
  {
    tag: 'normas',
    title: 'Normas Oficiales de Competición',
    content: `### 📜 REGLAMENTO DE REGULARIDAD Y JUGABILIDAD • FIFAMANIAKOS FC 27

---

### ⚽ 1. FORMATO DE PARTIDOS & CONFIGURACIÓN
* **Modo de Juego**: Amistosos Online en EA FC 27.
* **Duración por parte**: 6 minutos.
* **Velocidad de juego**: Normal.
* **Controles**: Libres (Manual, Semi o Asistido).
* **Conexión**: Se recomienda conexión por cable LAN. En caso de lag insostenible, ambos DTs deben avisar en los primeros 15 minutos para pausar y reiniciar la sala.

---

### ⏱️ 2. PUNTUALIDAD & TIEMPOS DE ESPERA
* **Tolerancia de espera**: 15 minutos máximo tras la hora acordada entre ambos managers.
* **Walkover (W.O. 3-0)**: Si un DT no se presenta tras 15 minutos sin justificación, el rival podrá solicitar los 3 puntos por Walkover previo reporte a la administración.
* **Desconexiones fortuitas**:
  * **Antes del min 60**: Se reinicia el encuentro disputando únicamente el tiempo restante y conservando la diferencia de goles previa.
  * **Después del min 75**: El marcador se da por finalizado a menos que el jugador afectado solicite disputar el tiempo pendiente.

---

### 🛡️ 3. FAIR PLAY & JUGABILIDAD
* **Prohibido el Anti-Juego**: Queda estrictamente prohibido pasar el balón repetidamente entre los defensores y el portero para congelar el partido a partir del minuto 80.
* **Uso de Pausas**: Las pausas solo deben solicitarse cuando el balón esté fuera de juego. Prohibido cortar jugadas manifiestas de gol del rival mediante pausas.

---

### 📊 4. REGISTRO & INGRESO DE DATOS DEL PARTIDO
* **Ingreso Directo en Plataforma**: Al finalizar el encuentro, el manager ganador (o el manager local en caso de empate) debe ingresar directamente en el módulo de Cargar Resultado todos los datos del partido:
  * Marcador final (Goles Local vs Goles Visitante).
  * Goleadores de cada equipo.
  * Asistidores del encuentro.
  * Tarjetas Amarillas y Rojas mostradas durante el juego.

---

### 💼 5. PLANTILLAS & DRAFT DE LIGA
* **Plantilla Oficial del Draft**: Cada club competirá exclusivamente con los 22 jugadores asignados en el Draft.
* **Tope de Cracks Elite**: Ninguna plantilla podrá superar el tope máximo de **3 Cracks Top Elite (+86 OVR)** al iniciar la temporada.`,
    updatedAt: new Date().toLocaleDateString()
  },
  {
    tag: 'ganancias',
    title: 'Ganancias y Premios de Competición',
    content: `### 💰 SISTEMA DE PREMIOS Y RECOMPENSAS ECONÓMICAS

---

### 🏆 1. PREMIOS DE CAMPEONATO DE LIGA
* 🥇 **Campeón de 1ra División**: $50.000.000 + Trofeo Oficial
* 🥈 **Subcampeón de Liga**: $30.000.000
* 🥉 **3er Puesto**: $15.000.000
* ⚽ **4to Puesto (Clasificación Champions)**: $10.000.000

---

### 🥇 2. BONIFICACIONES POR PARTIDO
* **Victoria en Liga**: $2.500.000 al presupuesto del club.
* **Empate en Liga**: $1.000.000 al presupuesto del club.
* **Derrota**: $0 (Sin penalización económica).

---

### ⭐ 3. PREMIOS INDIVIDUALES AL FINALIZAR TEMPORADA
* ⚽ **PichiChi (Máximo Goleador)**: $8.000.000
* 🎯 **Máximo Asistidor**: $6.000.000
* 🧤 **Zamora (Portero Menos Goleado)**: $6.000.000
* 🌟 **MVP de la Liga**: $10.000.000

---

### 🇪🇺 4. PREMIOS DE COPAS INTERNACIONALES (Champions & Europa League)
* **Campeón de Champions League**: $40.000.000
* **Subcampeón de Champions League**: $20.000.000
* **Campeón de Europa League**: $25.000.000
* **Subcampeón de Europa League**: $12.000.000`,
    updatedAt: new Date().toLocaleDateString()
  },
  {
    tag: 'sanciones',
    title: 'Código Disciplinario y Sanciones',
    content: `### ⚖️ CÓDIGO DISCIPLINARIO & SANCIONES OFICIALES

---

### 🟨 🟫 1. SANCIONES POR TARJETAS Y ACUMULACIÓN
* 🟥 **Tarjeta Roja Directa o Doble Amarilla**: **1 Partido de Suspensión** automático.
* 🟨 **Acumulación de Tarjetas Amarillas**: **3 Tarjetas Amarillas acumuladas** sancionan al jugador con **1 partido de suspensión**.

---

### 🔍 2. OBLIGACIÓN DE VERIFICACIÓN POR EL RIVAL
* **Verificación Previa**: **En caso de sanciones pendientes, el rival deberá verificar previamente en la plataforma que el jugador sancionado NO se encuentre alineado en el 11 titular ni en la banca de suplentes del club rival**.
* **Penalización por Alinear a un Suspendido**: Si un DT alinea a un jugador suspendido, **perderá automáticamente el encuentro por W.O. (3-0)** tras la comprobación del rival y la confirmación de la administración.

---

### 🚫 3. SANCIÓN POR INASISTENCIA (W.O.)
* **Primer W.O. no justificado**: Pérdida del partido 3-0 + Multa de **$5.000.000** del presupuesto del club.
* **Segundo W.O. consecutivo**: Pérdida del partido 3-0 + Resta de **-3 Puntos** en la tabla general.
* **Tercer W.O.**: Expulsión directa de la Liga y liberación de la plantilla al mercado.

---

### 💬 4. RESPETO & CONDUCTA EN COMUNIDAD
* Cero tolerancia a agresiones verbales o falta de respeto en los canales oficiales de WhatsApp/Discord.
* **Sanción**: Multa de $10.000.000 hasta la descalificación del torneo.`,
    updatedAt: new Date().toLocaleDateString()
  },
  {
    tag: 'apuestas',
    title: 'Reglamento de Apuestas Deportivas',
    content: `### 🎲 REGLAMENTO DE APUESTAS ENTRE MANAGERS

---

### 📌 1. NORMAS GENERALES DE APUESTAS
* Las apuestas se realizan exclusivamente con presupuesto virtual del club o créditos de plataforma.
* Ambos managers deben acordar el monto antes de la hora fijada para el encuentro.
* Toda apuesta debe dejarse registrada públicamente en la sección del Foro o Casa de Apuestas.

---

### 💵 2. LÍMITES DE APUESTA POR PARTIDO
* **Apuesta Mínima**: $1.000.000 de presupuesto.
* **Apuesta Máxima**: $20.000.000 de presupuesto por encuentro de Liga.
* **Finales y Clásicos**: Hasta $40.000.000 por partido.

---

### ⚖️ 3. LIQUIDACIÓN DE APUESTAS
* El resultado válido para el cobro de apuestas es el marcador ingresado oficialmente en la plataforma.
* En caso de suspensión o W.O., la apuesta queda **anulada** y se reintegra el saldo a ambos competidores.`,
    updatedAt: new Date().toLocaleDateString()
  },
  {
    tag: 'mercado',
    title: 'Reglamento del Mercado de Fichajes',
    content: `### 💼 REGLAMENTO OFICIAL DEL MERCADO DE FICHAJES

---

### 📅 1. VENTANAS DE TRANSFERENCIA
* **Mercado Abierto**: Las operaciones de compra, venta y préstamo de jugadores solo pueden realizarse durante las ventanas de mercado habilitadas por la administración.
* **Mercado Cerrado**: Fuera de las fechas habilitadas, ningún club podrá incorporar ni ceder jugadores bajo ningún concepto.

---

### 💰 2. PRESUPUESTO Y NEGOCIACIONES
* **Presupuesto Virtual**: Toda operación se realiza exclusivamente con el presupuesto virtual asignado a cada club.
* **Acuerdo entre Managers**: Toda transferencia debe ser acordada entre ambos DTs y confirmada ante la administración antes de hacerse efectiva.
* **Registro Obligatorio**: Ninguna transferencia es válida hasta ser registrada oficialmente en la plataforma por la administración.

---

### 🔁 3. LÍMITES POR CLUB
* **Fichajes por Ventana**: Máximo de **3 incorporaciones** por club en cada ventana de mercado.
* **Tope de Cracks Elite**: Ninguna plantilla podrá superar el tope máximo de **3 Cracks Top Elite (+86 OVR)**, incluyendo los fichajes realizados en el mercado.

---

### 🚫 4. PROHIBICIONES
* **Fichajes Fantasma**: Queda prohibido simular operaciones o inflar precios entre clubes aliados para evadir el control de presupuesto.
* **Incumplimiento**: Toda operación irregular detectada será anulada y podrá derivar en sanción económica o deportiva para los clubes involucrados.`,
    updatedAt: new Date().toLocaleDateString()
  }
];

export const INITIAL_BUDGET_PACKAGES: BudgetPackage[] = [
  { id: 'pkg-0', budgetMillions: 100, priceUsd: 2.5 },
  { id: 'pkg-1', budgetMillions: 200, priceUsd: 5 },
  { id: 'pkg-2', budgetMillions: 400, priceUsd: 10 }
];

export const INITIAL_TICKER_NEWS: TickerNewsItem[] = [
  { id: 'news-1', text: '🏆 ¡36 DTs Inscritos Esperando por el Sorteo Oficial de la Liga Online FC 27!', active: true, createdAt: new Date().toLocaleDateString() },
  { id: 'news-2', text: '⚽ Selecciona a cualquier DT inscrito en la pestaña Sorteo Draft para girar la ruleta y asignarle equipo.', active: true, createdAt: new Date().toLocaleDateString() }
];
