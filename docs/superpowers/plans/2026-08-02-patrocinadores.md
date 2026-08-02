# Sistema de Patrocinadores — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cada club firma un contrato con una marca patrocinadora; al cerrar la temporada el sistema evalúa qué cláusulas cumplió y acredita el dinero automáticamente en su presupuesto.

**Architecture:** Un motor de evaluación puro en `src/utils/sponsorEngine.ts` (sin I/O, testeable) que recibe clubes, partidos y objetivos y devuelve qué cláusulas se cumplieron con su progreso. La UI lo usa para mostrar progreso en vivo; el Panel de Administración lo usa para la vista previa de liquidación. El pago real se hace en una RPC de Postgres (`settle_sponsor_payouts`) que es idempotente y atómica, siguiendo el patrón de `011_financial_transfer_rpc.sql`.

**Tech Stack:** React 19 + TypeScript + Vite, Supabase (Postgres + Realtime + RLS), Tailwind 4, lucide-react. Tests con Vitest (se agrega en la Tarea 1).

---

## Decisiones de implementación que ajustan la spec

1. **Elegibilidad solo por división.** La spec definía `requirementMaxPosition` ("top 4 la temporada pasada"). `MatchResult` **no tiene `seasonNumber`**, así que la app no conserva historial por temporada y no hay forma de calcular la posición de la temporada anterior. El campo queda en el esquema pero **el código de elegibilidad lo ignora**; solo se aplica `requirementDivision`. Cuando exista historial de temporadas se activa sin migrar datos.
2. **Se agrega Vitest.** El proyecto hoy no tiene tests (`npm run lint` es `tsc --noEmit`). El motor mueve dinero de los clubes, así que se agrega Vitest acotado a `src/utils/*.test.ts`. La UI se verifica con `npm run lint` y `npm run build`, como pide el proyecto.
3. **Los montos se guardan en euros.** `rewardMillions` es lo que edita el admin; el motor y la RPC multiplican por 1.000.000 para que sea consistente con `Club.budget`.

---

## Estructura de archivos

**Crear:**
- `src/utils/sponsorEngine.ts` — motor de evaluación puro. Única responsabilidad: dado el estado de la liga, decir qué cláusulas cumplió cada club y con qué progreso.
- `src/utils/sponsorEngine.test.ts` — tests del motor.
- `src/data/sponsorsData.ts` — las 5 marcas de ejemplo con sus cláusulas (datos semilla).
- `src/components/miclub/SponsorTab.tsx` — pestaña "Patrocinador" de Mi Club (progreso + firma).
- `src/components/admin/SponsorsAdminSection.tsx` — ABM de marcas/cláusulas y liquidación con vista previa.
- `supabase/migrations/012_sponsors.sql` — 4 tablas + RLS.
- `supabase/migrations/013_sponsor_settlement_rpc.sql` — RPC de liquidación idempotente.

**Modificar:**
- `src/types.ts` — tipos `Sponsor`, `SponsorObjective`, `ClubSponsorContract`, `SponsorPayout`.
- `src/App.tsx` — 4 `useSupabaseTable` nuevos y paso de props.
- `src/components/miclub/MiClubHub.tsx` — registrar la pestaña nueva.
- `src/components/AdminPanel.tsx` — montar la sección nueva.
- `package.json` — devDependency `vitest` + script `test`.
- `docs/superpowers/specs/2026-08-02-patrocinadores-design.md` — anotar la decisión 1.

---

## Task 1: Infraestructura de tests

**Files:**
- Modify: `package.json`
- Create: `src/utils/sponsorEngine.test.ts`

- [ ] **Step 1: Instalar Vitest**

```bash
cd .worktrees/backend-accounts-migration
npm install -D vitest@^3.0.0
```

- [ ] **Step 2: Agregar el script `test` a package.json**

En `package.json`, dentro de `"scripts"`, agregar después de la línea de `"lint"`:

```json
    "test": "vitest run",
```

- [ ] **Step 3: Escribir un test que verifique que el runner corre**

Crear `src/utils/sponsorEngine.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';

describe('sponsorEngine', () => {
  it('el runner de tests funciona', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Correr los tests**

Run: `npm test`
Expected: PASS — 1 test pasado.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/utils/sponsorEngine.test.ts
git commit -m "chore: agregar vitest para testear el motor de patrocinadores"
```

---

## Task 2: Tipos de patrocinadores

**Files:**
- Modify: `src/types.ts` (agregar al final del archivo)

- [ ] **Step 1: Agregar los tipos**

Agregar al final de `src/types.ts`:

```typescript
export type SponsorObjectiveKind =
  | 'CHAMPION'
  | 'RUNNER_UP'
  | 'REACH_PHASE'
  | 'LEAGUE_WINS'
  | 'TOP_SCORER'
  | 'ASSISTS_THRESHOLD';

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  tier: number; // 1 = mas exigente y mejor pago, 5 = mas accesible
  requirementDivision?: string;
  // Definido en la spec pero todavia sin usar: la app no guarda historial por
  // temporada (MatchResult no tiene seasonNumber), asi que no se puede saber
  // en que puesto termino un club la temporada pasada.
  requirementMaxPosition?: number;
  active: boolean;
}

export interface SponsorObjective {
  id: string;
  sponsorId: string;
  kind: SponsorObjectiveKind;
  competition?: string;
  phase?: MatchPhase;
  threshold?: number;
  rewardMillions: number;
  label: string;
}

export interface ClubSponsorContract {
  id: string;
  clubId: string;
  sponsorId: string;
  seasonNumber: number;
  signedAt: string;
}

export interface SponsorPayout {
  id: string;
  clubId: string;
  seasonNumber: number;
  objectiveId: string;
  amount: number; // en euros
  paidAt: string;
}
```

- [ ] **Step 2: Verificar que compila**

Run: `npm run lint`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: tipos del sistema de patrocinadores"
```

---

## Task 3: Datos semilla de las 5 marcas

**Files:**
- Create: `src/data/sponsorsData.ts`

- [ ] **Step 1: Crear el archivo con las marcas y sus cláusulas**

Crear `src/data/sponsorsData.ts`:

```typescript
import { Sponsor, SponsorObjective } from '../types';

export const INITIAL_SPONSORS: Sponsor[] = [
  { id: 'sponsor-adidas', name: 'adidas', logoUrl: '', tier: 1, requirementDivision: '1ra División', active: true },
  { id: 'sponsor-cocacola', name: 'Coca-Cola', logoUrl: '', tier: 2, requirementDivision: '1ra División', active: true },
  { id: 'sponsor-fedex', name: 'FedEx', logoUrl: '', tier: 3, active: true },
  { id: 'sponsor-nike', name: 'Nike', logoUrl: '', tier: 4, active: true },
  { id: 'sponsor-samsung', name: 'Samsung', logoUrl: '', tier: 5, active: true }
];

export const INITIAL_SPONSOR_OBJECTIVES: SponsorObjective[] = [
  // adidas
  { id: 'obj-adidas-1', sponsorId: 'sponsor-adidas', kind: 'CHAMPION', competition: 'UEFA Champions League', rewardMillions: 35, label: 'Campeon Champions' },
  { id: 'obj-adidas-2', sponsorId: 'sponsor-adidas', kind: 'CHAMPION', competition: 'UEFA Europa League', rewardMillions: 25, label: 'Campeon UEFA' },
  { id: 'obj-adidas-3', sponsorId: 'sponsor-adidas', kind: 'CHAMPION', competition: '1ra División', rewardMillions: 20, label: 'Campeon Liga' },
  { id: 'obj-adidas-4', sponsorId: 'sponsor-adidas', kind: 'LEAGUE_WINS', threshold: 20, rewardMillions: 20, label: 'Ganar 20 partidos de liga' },
  { id: 'obj-adidas-5', sponsorId: 'sponsor-adidas', kind: 'TOP_SCORER', competition: '1ra División', threshold: 30, rewardMillions: 20, label: 'Pichichi Liga con +30 goles' },
  { id: 'obj-adidas-6', sponsorId: 'sponsor-adidas', kind: 'TOP_SCORER', competition: 'UEFA Champions League', threshold: 0, rewardMillions: 10, label: 'Pichichi Champions' },
  { id: 'obj-adidas-7', sponsorId: 'sponsor-adidas', kind: 'TOP_SCORER', competition: 'UEFA Europa League', threshold: 0, rewardMillions: 7, label: 'Pichichi UEFA' },
  { id: 'obj-adidas-8', sponsorId: 'sponsor-adidas', kind: 'ASSISTS_THRESHOLD', competition: '1ra División', threshold: 30, rewardMillions: 10, label: '+30 asistencias en Liga (un solo jugador)' },

  // Coca-Cola
  { id: 'obj-cc-1', sponsorId: 'sponsor-cocacola', kind: 'CHAMPION', competition: 'UEFA Champions League', rewardMillions: 30, label: 'Campeon Champions' },
  { id: 'obj-cc-2', sponsorId: 'sponsor-cocacola', kind: 'CHAMPION', competition: 'UEFA Europa League', rewardMillions: 25, label: 'Campeon UEFA' },
  { id: 'obj-cc-3', sponsorId: 'sponsor-cocacola', kind: 'REACH_PHASE', competition: 'UEFA Champions League', phase: 'SEMIFINAL', rewardMillions: 20, label: 'Semis de Champions' },
  { id: 'obj-cc-4', sponsorId: 'sponsor-cocacola', kind: 'REACH_PHASE', competition: 'UEFA Europa League', phase: 'SEMIFINAL', rewardMillions: 10, label: 'Semis UEFA' },
  { id: 'obj-cc-5', sponsorId: 'sponsor-cocacola', kind: 'LEAGUE_WINS', threshold: 15, rewardMillions: 15, label: 'Ganar 15 partidos de liga' },
  { id: 'obj-cc-6', sponsorId: 'sponsor-cocacola', kind: 'TOP_SCORER', competition: '1ra División', threshold: 25, rewardMillions: 15, label: 'Pichichi Liga con +25 goles' },
  { id: 'obj-cc-7', sponsorId: 'sponsor-cocacola', kind: 'TOP_SCORER', competition: 'UEFA Champions League', threshold: 0, rewardMillions: 15, label: 'Pichichi Champions' },
  { id: 'obj-cc-8', sponsorId: 'sponsor-cocacola', kind: 'TOP_SCORER', competition: 'UEFA Europa League', threshold: 0, rewardMillions: 10, label: 'Pichichi UEFA' },
  { id: 'obj-cc-9', sponsorId: 'sponsor-cocacola', kind: 'ASSISTS_THRESHOLD', threshold: 25, rewardMillions: 10, label: '+25 asistencias (un jugador en una competicion)' },

  // FedEx
  { id: 'obj-fedex-1', sponsorId: 'sponsor-fedex', kind: 'CHAMPION', competition: 'Supercopa de Europa', rewardMillions: 20, label: 'Campeon Supercopa de Europa' },
  { id: 'obj-fedex-2', sponsorId: 'sponsor-fedex', kind: 'REACH_PHASE', competition: 'UEFA Champions League', phase: 'CUARTOS', rewardMillions: 15, label: '4tos de Champions' },
  { id: 'obj-fedex-3', sponsorId: 'sponsor-fedex', kind: 'REACH_PHASE', competition: 'UEFA Europa League', phase: 'CUARTOS', rewardMillions: 10, label: '4tos UEFA' },
  { id: 'obj-fedex-4', sponsorId: 'sponsor-fedex', kind: 'LEAGUE_WINS', threshold: 10, rewardMillions: 12, label: 'Ganar 10 partidos de liga' },
  { id: 'obj-fedex-5', sponsorId: 'sponsor-fedex', kind: 'TOP_SCORER', competition: '1ra División', threshold: 20, rewardMillions: 10, label: 'Pichichi Liga con +20 goles' },
  { id: 'obj-fedex-6', sponsorId: 'sponsor-fedex', kind: 'ASSISTS_THRESHOLD', threshold: 20, rewardMillions: 8, label: '+20 asistencias (un jugador en una competicion)' },

  // Nike
  { id: 'obj-nike-1', sponsorId: 'sponsor-nike', kind: 'CHAMPION', competition: 'Supercopa de Liga', rewardMillions: 15, label: 'Campeon Supercopa de Liga' },
  { id: 'obj-nike-2', sponsorId: 'sponsor-nike', kind: 'REACH_PHASE', competition: 'UEFA Champions League', phase: 'OCTAVOS', rewardMillions: 12, label: '8vos Champions' },
  { id: 'obj-nike-3', sponsorId: 'sponsor-nike', kind: 'REACH_PHASE', competition: 'UEFA Europa League', phase: 'OCTAVOS', rewardMillions: 8, label: '8vos UEFA' },
  { id: 'obj-nike-4', sponsorId: 'sponsor-nike', kind: 'LEAGUE_WINS', threshold: 8, rewardMillions: 10, label: 'Ganar 8 partidos de liga' },
  { id: 'obj-nike-5', sponsorId: 'sponsor-nike', kind: 'TOP_SCORER', competition: '1ra División', threshold: 15, rewardMillions: 8, label: 'Pichichi Liga con +15 goles' },
  { id: 'obj-nike-6', sponsorId: 'sponsor-nike', kind: 'ASSISTS_THRESHOLD', threshold: 15, rewardMillions: 5, label: '+15 asistencias (un jugador en una competicion)' },

  // Samsung
  { id: 'obj-sam-1', sponsorId: 'sponsor-samsung', kind: 'CHAMPION', competition: 'Mundial de Clubes', rewardMillions: 15, label: 'Campeon Mundial de Clubes' },
  { id: 'obj-sam-2', sponsorId: 'sponsor-samsung', kind: 'RUNNER_UP', competition: '1ra División', rewardMillions: 12, label: 'Subcampeon Liga' },
  { id: 'obj-sam-3', sponsorId: 'sponsor-samsung', kind: 'REACH_PHASE', competition: 'UEFA Champions League', phase: 'OCTAVOS', rewardMillions: 8, label: '8vos Champions' },
  { id: 'obj-sam-4', sponsorId: 'sponsor-samsung', kind: 'REACH_PHASE', competition: 'UEFA Europa League', phase: 'OCTAVOS', rewardMillions: 5, label: '8vos UEFA' },
  { id: 'obj-sam-5', sponsorId: 'sponsor-samsung', kind: 'LEAGUE_WINS', threshold: 7, rewardMillions: 7, label: 'Ganar 7 partidos de liga' },
  { id: 'obj-sam-6', sponsorId: 'sponsor-samsung', kind: 'TOP_SCORER', competition: '1ra División', threshold: 10, rewardMillions: 4, label: 'Pichichi Liga con +10 goles' },
  { id: 'obj-sam-7', sponsorId: 'sponsor-samsung', kind: 'ASSISTS_THRESHOLD', threshold: 10, rewardMillions: 2, label: '+10 asistencias (un jugador en una competicion)' }
];
```

Nota: en `TOP_SCORER` un `threshold: 0` significa "solo hay que ser el maximo goleador, sin minimo de goles" (ej. "PICHICHI CHAMPIONS" sin numero). En `ASSISTS_THRESHOLD` un `competition` ausente significa "en cualquier competicion, contada por separado".

- [ ] **Step 2: Verificar que compila**

Run: `npm run lint`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/data/sponsorsData.ts
git commit -m "feat: datos semilla de las 5 marcas patrocinadoras"
```

---

## Task 4: Motor — helpers y CHAMPION / RUNNER_UP

**Files:**
- Create: `src/utils/sponsorEngine.ts`
- Modify: `src/utils/sponsorEngine.test.ts`

- [ ] **Step 1: Escribir los tests que fallan**

Reemplazar todo el contenido de `src/utils/sponsorEngine.test.ts`:

```typescript
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
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `npm test`
Expected: FAIL — no existe el módulo `./sponsorEngine` / no exporta `isChampionOf`.

- [ ] **Step 3: Implementar el motor**

Crear `src/utils/sponsorEngine.ts`:

```typescript
import { Club, MatchPhase, MatchResult } from '../types';
import { computeCupStandings } from './competitionStats';

// Las divisiones se resuelven por tabla de posiciones; el resto de las
// competiciones son eliminatorias y se resuelven por el partido de FINAL.
const LEAGUE_COMPETITIONS = ['1ra División', '2da División'];

const isLeague = (competition: string) => LEAGUE_COMPETITIONS.includes(competition);

const confirmedMatches = (matches: MatchResult[], competition: string) =>
  matches.filter(m => m.competition === competition && m.status === 'CONFIRMADO');

/** Devuelve [ganadorId, perdedorId] de la final de una copa, o null si no se jugo. */
function finalResult(matches: MatchResult[], competition: string): [string, string] | null {
  const final = confirmedMatches(matches, competition).find(m => m.phase === 'FINAL');
  if (!final) return null;

  if (final.homeGoals > final.awayGoals) return [final.homeClubId, final.awayClubId];
  if (final.awayGoals > final.homeGoals) return [final.awayClubId, final.homeClubId];

  // Empate: solo hay campeon si se cargo quien gano por penales.
  if (!final.penaltyWinnerClubId) return null;
  const loser = final.penaltyWinnerClubId === final.homeClubId ? final.awayClubId : final.homeClubId;
  return [final.penaltyWinnerClubId, loser];
}

function positionInLeague(clubId: string, clubs: Club[], matches: MatchResult[], competition: string): number {
  const standings = computeCupStandings(clubs, matches, competition);
  return standings.findIndex(row => row.clubId === clubId);
}

export function isChampionOf(clubId: string, clubs: Club[], matches: MatchResult[], competition: string): boolean {
  if (isLeague(competition)) {
    return positionInLeague(clubId, clubs, matches, competition) === 0;
  }
  const result = finalResult(matches, competition);
  return result !== null && result[0] === clubId;
}

export function isRunnerUpOf(clubId: string, clubs: Club[], matches: MatchResult[], competition: string): boolean {
  if (isLeague(competition)) {
    return positionInLeague(clubId, clubs, matches, competition) === 1;
  }
  const result = finalResult(matches, competition);
  return result !== null && result[1] === clubId;
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npm test`
Expected: PASS — todos los tests de `isChampionOf` e `isRunnerUpOf`.

- [ ] **Step 5: Commit**

```bash
git add src/utils/sponsorEngine.ts src/utils/sponsorEngine.test.ts
git commit -m "feat: motor de patrocinadores - campeon y subcampeon"
```

---

## Task 5: Motor — REACH_PHASE

**Files:**
- Modify: `src/utils/sponsorEngine.ts`
- Modify: `src/utils/sponsorEngine.test.ts`

- [ ] **Step 1: Escribir los tests que fallan**

Agregar al final de `src/utils/sponsorEngine.test.ts` (y agregar `reachedPhase` al import de `./sponsorEngine` en la primera línea de imports):

```typescript
describe('reachedPhase', () => {
  it('se cumple si el club jugo esa fase', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', phase: 'CUARTOS', homeClubId: 'a', awayClubId: 'b' })
    ];
    expect(reachedPhase('a', matches, 'UEFA Champions League', 'CUARTOS')).toBe(true);
  });

  it('se cumple si el club llego a una fase POSTERIOR', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', phase: 'FINAL', homeClubId: 'a', awayClubId: 'b' })
    ];
    expect(reachedPhase('a', matches, 'UEFA Champions League', 'CUARTOS')).toBe(true);
  });

  it('no se cumple si solo llego a una fase ANTERIOR', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', phase: 'OCTAVOS', homeClubId: 'a', awayClubId: 'b' })
    ];
    expect(reachedPhase('a', matches, 'UEFA Champions League', 'CUARTOS')).toBe(false);
  });

  it('no cuenta partidos de otro club', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', phase: 'FINAL', homeClubId: 'b', awayClubId: 'c' })
    ];
    expect(reachedPhase('a', matches, 'UEFA Champions League', 'CUARTOS')).toBe(false);
  });

  it('ignora partidos no confirmados', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', phase: 'FINAL', homeClubId: 'a', awayClubId: 'b', status: 'RECHAZADO' })
    ];
    expect(reachedPhase('a', matches, 'UEFA Champions League', 'CUARTOS')).toBe(false);
  });
});
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `npm test`
Expected: FAIL — `reachedPhase` no está exportado.

- [ ] **Step 3: Implementar**

Agregar a `src/utils/sponsorEngine.ts`:

```typescript
// Orden de avance en una eliminatoria. Llegar a la final implica haber pasado
// cuartos, asi que un objetivo de "4tos" se cumple tambien siendo campeon.
const PHASE_ORDER: MatchPhase[] = ['GRUPOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'];

export function reachedPhase(
  clubId: string,
  matches: MatchResult[],
  competition: string,
  phase: MatchPhase
): boolean {
  const targetIndex = PHASE_ORDER.indexOf(phase);
  if (targetIndex === -1) return false;

  return confirmedMatches(matches, competition).some(m => {
    if (m.homeClubId !== clubId && m.awayClubId !== clubId) return false;
    if (!m.phase) return false;
    return PHASE_ORDER.indexOf(m.phase) >= targetIndex;
  });
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/sponsorEngine.ts src/utils/sponsorEngine.test.ts
git commit -m "feat: motor de patrocinadores - llegar a una fase"
```

---

## Task 6: Motor — LEAGUE_WINS

**Files:**
- Modify: `src/utils/sponsorEngine.ts`
- Modify: `src/utils/sponsorEngine.test.ts`

- [ ] **Step 1: Escribir los tests que fallan**

Agregar al final de `src/utils/sponsorEngine.test.ts` (y agregar `countLeagueWins` al import):

```typescript
describe('countLeagueWins', () => {
  const clubs = [club('a', '1ra División'), club('b', '1ra División')];

  it('cuenta victorias de local y de visitante en su division', () => {
    const matches = [
      match({ competition: '1ra División', homeClubId: 'a', awayClubId: 'b', homeGoals: 2, awayGoals: 0 }),
      match({ competition: '1ra División', homeClubId: 'b', awayClubId: 'a', homeGoals: 0, awayGoals: 1 })
    ];
    expect(countLeagueWins('a', clubs, matches)).toBe(2);
  });

  it('no cuenta empates ni derrotas', () => {
    const matches = [
      match({ competition: '1ra División', homeClubId: 'a', awayClubId: 'b', homeGoals: 1, awayGoals: 1 }),
      match({ competition: '1ra División', homeClubId: 'a', awayClubId: 'b', homeGoals: 0, awayGoals: 2 })
    ];
    expect(countLeagueWins('a', clubs, matches)).toBe(0);
  });

  it('no cuenta partidos de copa', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', homeClubId: 'a', awayClubId: 'b', homeGoals: 3, awayGoals: 0 })
    ];
    expect(countLeagueWins('a', clubs, matches)).toBe(0);
  });

  it('usa la division del propio club', () => {
    const segunda = [club('a', '2da División'), club('b', '2da División')];
    const matches = [
      match({ competition: '2da División', homeClubId: 'a', awayClubId: 'b', homeGoals: 1, awayGoals: 0 })
    ];
    expect(countLeagueWins('a', segunda, matches)).toBe(1);
  });

  it('devuelve 0 si el club no existe', () => {
    expect(countLeagueWins('zzz', clubs, [])).toBe(0);
  });
});
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `npm test`
Expected: FAIL — `countLeagueWins` no está exportado.

- [ ] **Step 3: Implementar**

Agregar a `src/utils/sponsorEngine.ts`:

```typescript
export function countLeagueWins(clubId: string, clubs: Club[], matches: MatchResult[]): number {
  const club = clubs.find(c => c.id === clubId);
  if (!club) return 0;

  return confirmedMatches(matches, club.division).filter(m => {
    if (m.homeClubId === clubId) return m.homeGoals > m.awayGoals;
    if (m.awayClubId === clubId) return m.awayGoals > m.homeGoals;
    return false;
  }).length;
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/sponsorEngine.ts src/utils/sponsorEngine.test.ts
git commit -m "feat: motor de patrocinadores - victorias de liga"
```

---

## Task 7: Motor — TOP_SCORER y ASSISTS_THRESHOLD

**Files:**
- Modify: `src/utils/sponsorEngine.ts`
- Modify: `src/utils/sponsorEngine.test.ts`

- [ ] **Step 1: Escribir los tests que fallan**

Agregar al final de `src/utils/sponsorEngine.test.ts` (y agregar `topScorerProgress`, `bestAssistsProgress` al import):

```typescript
const goal = (playerName: string, clubId: string, count: number) => ({
  playerName,
  clubId,
  type: 'GOAL' as const,
  count
});

const assist = (playerName: string, clubId: string, count: number) => ({
  playerName,
  clubId,
  type: 'ASSIST' as const,
  count
});

describe('topScorerProgress', () => {
  it('el club del maximo goleador cumple si supera el umbral', () => {
    const matches = [
      match({ competition: '1ra División', playerEvents: [goal('Haaland', 'a', 31), goal('Mbappe', 'b', 20)] })
    ];
    expect(topScorerProgress('a', matches, '1ra División', 30)).toEqual({ met: true, current: 31, target: 30 });
    expect(topScorerProgress('b', matches, '1ra División', 30).met).toBe(false);
  });

  it('ser pichichi sin llegar al umbral NO cumple', () => {
    const matches = [
      match({ competition: '1ra División', playerEvents: [goal('Haaland', 'a', 28)] })
    ];
    expect(topScorerProgress('a', matches, '1ra División', 30).met).toBe(false);
  });

  it('con umbral 0 alcanza con ser el maximo goleador', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', playerEvents: [goal('Haaland', 'a', 5), goal('Mbappe', 'b', 3)] })
    ];
    expect(topScorerProgress('a', matches, 'UEFA Champions League', 0).met).toBe(true);
    expect(topScorerProgress('b', matches, 'UEFA Champions League', 0).met).toBe(false);
  });

  it('si hay empate en el maximo, cumplen todos los clubes empatados', () => {
    const matches = [
      match({ competition: '1ra División', playerEvents: [goal('Haaland', 'a', 30), goal('Mbappe', 'b', 30)] })
    ];
    expect(topScorerProgress('a', matches, '1ra División', 30).met).toBe(true);
    expect(topScorerProgress('b', matches, '1ra División', 30).met).toBe(true);
  });

  it('suma goles del mismo jugador en varios partidos', () => {
    const matches = [
      match({ competition: '1ra División', playerEvents: [goal('Haaland', 'a', 2)] }),
      match({ competition: '1ra División', playerEvents: [goal('Haaland', 'a', 3)] })
    ];
    expect(topScorerProgress('a', matches, '1ra División', 0).current).toBe(5);
  });

  it('no mezcla competiciones', () => {
    const matches = [
      match({ competition: 'UEFA Champions League', playerEvents: [goal('Haaland', 'a', 10)] })
    ];
    expect(topScorerProgress('a', matches, '1ra División', 0).current).toBe(0);
  });
});

describe('bestAssistsProgress', () => {
  it('cumple si un jugador supera el umbral, sin ser el maximo', () => {
    const matches = [
      match({ competition: '1ra División', playerEvents: [assist('De Bruyne', 'a', 31), assist('Rodri', 'b', 40)] })
    ];
    expect(bestAssistsProgress('a', matches, '1ra División', 30)).toEqual({ met: true, current: 31, target: 30 });
  });

  it('no suma asistencias de dos jugadores distintos del mismo club', () => {
    const matches = [
      match({ competition: '1ra División', playerEvents: [assist('De Bruyne', 'a', 20), assist('Foden', 'a', 20)] })
    ];
    expect(bestAssistsProgress('a', matches, '1ra División', 30).met).toBe(false);
  });

  it('sin competicion, toma el mejor total de una sola competicion', () => {
    const matches = [
      match({ competition: '1ra División', playerEvents: [assist('De Bruyne', 'a', 9)] }),
      match({ competition: 'UEFA Champions League', playerEvents: [assist('De Bruyne', 'a', 9)] })
    ];
    // 9 + 9 no cuenta como 18: son competiciones distintas.
    expect(bestAssistsProgress('a', matches, undefined, 10).met).toBe(false);
    expect(bestAssistsProgress('a', matches, undefined, 10).current).toBe(9);
  });
});
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `npm test`
Expected: FAIL — `topScorerProgress` no está exportado.

- [ ] **Step 3: Implementar**

Agregar a `src/utils/sponsorEngine.ts`:

```typescript
export interface ObjectiveProgress {
  met: boolean;
  current: number;
  target: number;
}

/**
 * Suma un tipo de evento por jugador dentro de una competicion.
 * La clave es playerId cuando existe; si no, nombre + club, igual que hace
 * computePlayerStatsForCompetition, porque las actas permiten cargar jugadores
 * que no estan en la plantilla.
 */
function totalsByPlayer(
  matches: MatchResult[],
  competition: string,
  type: 'GOAL' | 'ASSIST'
): { key: string; clubId: string; total: number }[] {
  const totals = new Map<string, { key: string; clubId: string; total: number }>();

  confirmedMatches(matches, competition).forEach(m => {
    (m.playerEvents || []).forEach(ev => {
      if (ev.type !== type) return;
      const key = ev.playerId || `${ev.playerName}-${ev.clubId}`;
      const existing = totals.get(key);
      if (existing) {
        existing.total += ev.count;
      } else {
        totals.set(key, { key, clubId: ev.clubId, total: ev.count });
      }
    });
  });

  return [...totals.values()];
}

const competitionsIn = (matches: MatchResult[]): string[] =>
  [...new Set(matches.map(m => m.competition).filter((c): c is string => !!c))];

export function topScorerProgress(
  clubId: string,
  matches: MatchResult[],
  competition: string,
  threshold: number
): ObjectiveProgress {
  const totals = totalsByPlayer(matches, competition, 'GOAL');
  const best = totals.reduce((max, row) => Math.max(max, row.total), 0);
  const clubBest = totals
    .filter(row => row.clubId === clubId)
    .reduce((max, row) => Math.max(max, row.total), 0);

  // Empate en el maximo: cumplen todos los clubes empatados (Botin de Oro
  // compartido). Por eso se compara con >= y no con identidad de jugador.
  const isTopScorer = clubBest > 0 && clubBest >= best;

  return {
    met: isTopScorer && clubBest >= threshold,
    current: clubBest,
    target: threshold
  };
}

export function bestAssistsProgress(
  clubId: string,
  matches: MatchResult[],
  competition: string | undefined,
  threshold: number
): ObjectiveProgress {
  // "un solo jugador en una sola competicion": nunca se suman competiciones
  // distintas, se toma el mejor total individual de cada una por separado.
  const competitions = competition ? [competition] : competitionsIn(matches);

  const clubBest = competitions.reduce((max, comp) => {
    const totals = totalsByPlayer(matches, comp, 'ASSIST').filter(row => row.clubId === clubId);
    return totals.reduce((inner, row) => Math.max(inner, row.total), max);
  }, 0);

  return {
    met: clubBest >= threshold && clubBest > 0,
    current: clubBest,
    target: threshold
  };
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/sponsorEngine.ts src/utils/sponsorEngine.test.ts
git commit -m "feat: motor de patrocinadores - pichichi y asistencias"
```

---

## Task 8: Motor — orquestador `evaluateObjective` y `evaluateContract`

**Files:**
- Modify: `src/utils/sponsorEngine.ts`
- Modify: `src/utils/sponsorEngine.test.ts`

- [ ] **Step 1: Escribir los tests que fallan**

Agregar al final de `src/utils/sponsorEngine.test.ts` (y agregar `evaluateObjective`, `evaluateContract`, `eligibleSponsors` al import; agregar `Sponsor`, `SponsorObjective` al import de `../types`):

```typescript
const objective = (over: Partial<SponsorObjective>): SponsorObjective => ({
  id: 'o1',
  sponsorId: 's1',
  kind: 'LEAGUE_WINS',
  rewardMillions: 10,
  label: 'test',
  ...over
});

describe('evaluateObjective', () => {
  const clubs = [club('a'), club('b')];

  it('LEAGUE_WINS reporta progreso parcial', () => {
    const matches = [
      match({ competition: '1ra División', homeClubId: 'a', awayClubId: 'b', homeGoals: 1, awayGoals: 0 })
    ];
    const obj = objective({ kind: 'LEAGUE_WINS', threshold: 20 });
    expect(evaluateObjective('a', clubs, matches, obj)).toEqual({ met: false, current: 1, target: 20 });
  });

  it('CHAMPION reporta 1/1 cuando se cumple', () => {
    const matches = [
      match({ competition: '1ra División', homeClubId: 'a', awayClubId: 'b', homeGoals: 1, awayGoals: 0 })
    ];
    const obj = objective({ kind: 'CHAMPION', competition: '1ra División' });
    expect(evaluateObjective('a', clubs, matches, obj)).toEqual({ met: true, current: 1, target: 1 });
  });

  it('una competicion que no existe todavia no se cumple ni rompe', () => {
    const obj = objective({ kind: 'CHAMPION', competition: 'Mundial de Clubes' });
    expect(evaluateObjective('a', clubs, [], obj)).toEqual({ met: false, current: 0, target: 1 });
  });

  it('REACH_PHASE sin phase definida no se cumple', () => {
    const obj = objective({ kind: 'REACH_PHASE', competition: 'UEFA Champions League' });
    expect(evaluateObjective('a', clubs, [], obj).met).toBe(false);
  });
});

describe('evaluateContract', () => {
  const clubs = [club('a'), club('b')];

  it('devuelve una linea por objetivo con su premio en euros', () => {
    const matches = [
      match({ competition: '1ra División', homeClubId: 'a', awayClubId: 'b', homeGoals: 1, awayGoals: 0 })
    ];
    const objectives = [
      objective({ id: 'o1', kind: 'CHAMPION', competition: '1ra División', rewardMillions: 20 }),
      objective({ id: 'o2', kind: 'LEAGUE_WINS', threshold: 20, rewardMillions: 15 })
    ];
    const result = evaluateContract('a', clubs, matches, objectives);

    expect(result.lines).toHaveLength(2);
    expect(result.lines[0]).toMatchObject({ objectiveId: 'o1', met: true, amount: 20_000_000 });
    expect(result.lines[1]).toMatchObject({ objectiveId: 'o2', met: false, amount: 0 });
    expect(result.totalAmount).toBe(20_000_000);
  });
});

describe('eligibleSponsors', () => {
  const sponsors: Sponsor[] = [
    { id: 's1', name: 'adidas', logoUrl: '', tier: 1, requirementDivision: '1ra División', active: true },
    { id: 's2', name: 'Samsung', logoUrl: '', tier: 5, active: true },
    { id: 's3', name: 'Vieja', logoUrl: '', tier: 3, active: false }
  ];

  it('un club de 1ra puede firmar con todas las activas', () => {
    expect(eligibleSponsors(club('a', '1ra División'), sponsors).map(s => s.id)).toEqual(['s1', 's2']);
  });

  it('un club de 2da no puede firmar con las que exigen 1ra', () => {
    expect(eligibleSponsors(club('a', '2da División'), sponsors).map(s => s.id)).toEqual(['s2']);
  });

  it('nunca devuelve marcas inactivas', () => {
    expect(eligibleSponsors(club('a'), sponsors).some(s => s.id === 's3')).toBe(false);
  });
});
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `npm test`
Expected: FAIL — `evaluateObjective` no está exportado.

- [ ] **Step 3: Implementar**

Agregar `Sponsor, SponsorObjective` al import de `../types` en `src/utils/sponsorEngine.ts`, y agregar al final del archivo:

```typescript
export interface ContractLine extends ObjectiveProgress {
  objectiveId: string;
  label: string;
  amount: number; // en euros; 0 si no se cumplio
}

export interface ContractEvaluation {
  lines: ContractLine[];
  totalAmount: number;
}

const booleanProgress = (met: boolean): ObjectiveProgress => ({
  met,
  current: met ? 1 : 0,
  target: 1
});

export function evaluateObjective(
  clubId: string,
  clubs: Club[],
  matches: MatchResult[],
  objective: SponsorObjective
): ObjectiveProgress {
  switch (objective.kind) {
    case 'CHAMPION':
      return booleanProgress(
        !!objective.competition && isChampionOf(clubId, clubs, matches, objective.competition)
      );

    case 'RUNNER_UP':
      return booleanProgress(
        !!objective.competition && isRunnerUpOf(clubId, clubs, matches, objective.competition)
      );

    case 'REACH_PHASE':
      return booleanProgress(
        !!objective.competition &&
          !!objective.phase &&
          reachedPhase(clubId, matches, objective.competition, objective.phase)
      );

    case 'LEAGUE_WINS': {
      const target = objective.threshold ?? 0;
      const current = countLeagueWins(clubId, clubs, matches);
      return { met: current >= target, current, target };
    }

    case 'TOP_SCORER':
      if (!objective.competition) return booleanProgress(false);
      return topScorerProgress(clubId, matches, objective.competition, objective.threshold ?? 0);

    case 'ASSISTS_THRESHOLD':
      return bestAssistsProgress(clubId, matches, objective.competition, objective.threshold ?? 0);

    default:
      return booleanProgress(false);
  }
}

export function evaluateContract(
  clubId: string,
  clubs: Club[],
  matches: MatchResult[],
  objectives: SponsorObjective[]
): ContractEvaluation {
  const lines: ContractLine[] = objectives.map(objective => {
    const progress = evaluateObjective(clubId, clubs, matches, objective);
    return {
      ...progress,
      objectiveId: objective.id,
      label: objective.label,
      amount: progress.met ? objective.rewardMillions * 1_000_000 : 0
    };
  });

  return {
    lines,
    totalAmount: lines.reduce((sum, line) => sum + line.amount, 0)
  };
}

export function eligibleSponsors(club: Club, sponsors: Sponsor[]): Sponsor[] {
  // requirementMaxPosition queda deliberadamente sin evaluar: la app no guarda
  // historial por temporada (MatchResult no tiene seasonNumber), asi que no hay
  // forma de saber en que puesto termino el club la temporada pasada.
  return sponsors.filter(sponsor => {
    if (!sponsor.active) return false;
    if (sponsor.requirementDivision && sponsor.requirementDivision !== club.division) return false;
    return true;
  });
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npm test`
Expected: PASS — toda la suite.

- [ ] **Step 5: Verificar tipos**

Run: `npm run lint`
Expected: sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/utils/sponsorEngine.ts src/utils/sponsorEngine.test.ts
git commit -m "feat: motor de patrocinadores - evaluacion de contrato y elegibilidad"
```

---

## Task 9: Migración 012 — tablas y RLS

**Files:**
- Create: `supabase/migrations/012_sponsors.sql`

- [ ] **Step 1: Escribir la migración**

Crear `supabase/migrations/012_sponsors.sql`:

```sql
-- Sistema de patrocinadores.
--
-- sponsors y sponsor_objectives son catalogo publico: cualquiera puede leerlos
-- (el manager necesita ver que le exige cada marca antes de firmar) pero solo
-- el admin los edita.
--
-- club_sponsor_contracts lo escribe el manager para su propio club. Los pagos
-- (sponsor_payouts) los escribe unicamente la RPC de liquidacion, que corre con
-- security definer: ningun cliente puede insertarlos a mano, porque eso seria
-- poder acreditarse dinero.

create table if not exists public.sponsors (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsor_objectives (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.club_sponsor_contracts (
  key text primary key,
  club_id text generated always as (data->>'clubId') stored,
  season_number int generated always as ((data->>'seasonNumber')::int) stored,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create unique index if not exists club_sponsor_contracts_one_per_season
  on public.club_sponsor_contracts (club_id, season_number);

create table if not exists public.sponsor_payouts (
  key text primary key,
  club_id text generated always as (data->>'clubId') stored,
  season_number int generated always as ((data->>'seasonNumber')::int) stored,
  objective_id text generated always as (data->>'objectiveId') stored,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Esta restriccion es lo que hace idempotente la liquidacion: correrla dos
-- veces no puede pagar dos veces el mismo objetivo.
create unique index if not exists sponsor_payouts_unique
  on public.sponsor_payouts (club_id, season_number, objective_id);

alter table public.sponsors enable row level security;
alter table public.sponsor_objectives enable row level security;
alter table public.club_sponsor_contracts enable row level security;
alter table public.sponsor_payouts enable row level security;

-- Catalogo: lectura para todos, escritura solo admin.
drop policy if exists "sponsors_read_all" on public.sponsors;
create policy "sponsors_read_all" on public.sponsors for select to anon, authenticated using (true);

drop policy if exists "sponsors_admin_write" on public.sponsors;
create policy "sponsors_admin_write" on public.sponsors for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "sponsor_objectives_read_all" on public.sponsor_objectives;
create policy "sponsor_objectives_read_all" on public.sponsor_objectives for select to anon, authenticated using (true);

drop policy if exists "sponsor_objectives_admin_write" on public.sponsor_objectives;
create policy "sponsor_objectives_admin_write" on public.sponsor_objectives for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Contratos: todos ven quien firmo con quien (es informacion publica de la
-- liga); cada manager solo puede firmar por su propio club.
drop policy if exists "contracts_read_all" on public.club_sponsor_contracts;
create policy "contracts_read_all" on public.club_sponsor_contracts for select to anon, authenticated using (true);

drop policy if exists "contracts_manager_write" on public.club_sponsor_contracts;
create policy "contracts_manager_write" on public.club_sponsor_contracts for all to authenticated
  using (public.is_admin() or club_id = public.current_manager_club_id())
  with check (public.is_admin() or club_id = public.current_manager_club_id());

-- Pagos: lectura para todos (el historial de premios es publico). Sin politica
-- de escritura a proposito: solo la RPC security definer puede insertar.
drop policy if exists "payouts_read_all" on public.sponsor_payouts;
create policy "payouts_read_all" on public.sponsor_payouts for select to anon, authenticated using (true);

alter publication supabase_realtime add table public.sponsors;
alter publication supabase_realtime add table public.sponsor_objectives;
alter publication supabase_realtime add table public.club_sponsor_contracts;
alter publication supabase_realtime add table public.sponsor_payouts;
```

- [ ] **Step 2: Verificar el patrón contra una migración existente**

Run: `grep -n "is_admin\|current_manager_club_id\|supabase_realtime" supabase/migrations/003_rls_policies.sql | head -20`
Expected: confirmar que `public.is_admin()` y `public.current_manager_club_id()` existen y que el patrón de `alter publication` coincide. Si los nombres difieren, ajustar la migración 012 antes de seguir.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/012_sponsors.sql
git commit -m "feat: migracion de tablas y RLS de patrocinadores"
```

---

## Task 10: Migración 013 — RPC de liquidación

**Files:**
- Create: `supabase/migrations/013_sponsor_settlement_rpc.sql`

- [ ] **Step 1: Escribir la migración**

Crear `supabase/migrations/013_sponsor_settlement_rpc.sql`:

```sql
-- Liquidacion de patrocinadores.
--
-- El calculo de que objetivos se cumplieron vive en el cliente
-- (src/utils/sponsorEngine.ts), pero el PAGO tiene que ser server-side: si el
-- cliente pudiera escribir presupuestos directamente, cualquier manager podria
-- acreditarse dinero. Esta RPC solo la puede ejecutar un admin, valida que el
-- club exista, y usa el indice unico de sponsor_payouts para ser idempotente:
-- si un objetivo ya se pago, se saltea sin sumar el dinero otra vez.

create or replace function public.settle_sponsor_payout(
  p_club_id text,
  p_season_number int,
  p_objective_id text,
  p_amount numeric,
  p_concept text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  club_row public.clubs%rowtype;
  payout_key text;
  club_budget numeric;
begin
  if not public.is_admin() then
    raise exception 'Solo un administrador puede liquidar patrocinadores.';
  end if;

  if p_amount <= 0 then
    raise exception 'El premio debe ser mayor a cero.';
  end if;

  payout_key := 'payout-' || p_club_id || '-' || p_season_number || '-' || p_objective_id;

  select * into club_row from public.clubs where key = p_club_id for update;
  if not found then
    raise exception 'No se encontro el club %.', p_club_id;
  end if;

  insert into public.sponsor_payouts (key, data)
  values (
    payout_key,
    jsonb_build_object(
      'id', payout_key,
      'clubId', p_club_id,
      'seasonNumber', p_season_number,
      'objectiveId', p_objective_id,
      'amount', p_amount,
      'paidAt', to_char(now(), 'DD/MM/YYYY')
    )
  )
  on conflict (key) do nothing;

  -- Si no se inserto nada, este objetivo ya se habia pagado: no se toca el
  -- presupuesto ni se duplica la transaccion.
  if not found then
    return false;
  end if;

  club_budget := coalesce((club_row.data->>'budget')::numeric, 0);

  update public.clubs
  set data = jsonb_set(data, '{budget}', to_jsonb(club_budget + p_amount), true),
    updated_at = now()
  where key = p_club_id;

  perform public.add_financial_transaction(p_club_id, 'INGRESO', p_concept, p_amount);

  return true;
end;
$$;

revoke execute on function public.settle_sponsor_payout(text, int, text, numeric, text) from public, anon;
grant execute on function public.settle_sponsor_payout(text, int, text, numeric, text) to authenticated;
```

- [ ] **Step 2: Verificar la firma de `add_financial_transaction`**

Run: `grep -n "create or replace function public.add_financial_transaction" -A 6 supabase/migrations/011_financial_transfer_rpc.sql`
Expected: `(p_club_id text, p_type text, p_concept text, p_amount numeric)` — coincide con el `perform` de arriba.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/013_sponsor_settlement_rpc.sql
git commit -m "feat: RPC idempotente de liquidacion de patrocinadores"
```

- [ ] **Step 4: Avisar al usuario**

Las migraciones 012 y 013 se corren **a mano en el SQL Editor de Supabase** (proyecto `hqybpfppqimssindwgns`). Pegarle al usuario el contenido de ambos archivos en el chat y confirmar que las corrió antes de probar la liquidación.

---

## Task 11: Cablear las tablas en App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Agregar los imports**

En `src/App.tsx`, agregar a la lista de tipos importados desde `./types`: `Sponsor`, `SponsorObjective`, `ClubSponsorContract`, `SponsorPayout`.

Agregar junto a los demás imports de datos:

```typescript
import { INITIAL_SPONSORS, INITIAL_SPONSOR_OBJECTIVES } from './data/sponsorsData';
```

- [ ] **Step 2: Agregar los cuatro hooks**

Insertar inmediatamente después del bloque de `tickerNews` (`useSupabaseTable<TickerNewsItem>`, alrededor de la línea 413):

```typescript
  const [sponsors, setSponsors] = useSupabaseTable<Sponsor>(
    'sponsors',
    INITIAL_SPONSORS,
    (s) => s.id
  );

  const [sponsorObjectives, setSponsorObjectives] = useSupabaseTable<SponsorObjective>(
    'sponsor_objectives',
    INITIAL_SPONSOR_OBJECTIVES,
    (o) => o.id
  );

  const [sponsorContracts, setSponsorContracts] = useSupabaseTable<ClubSponsorContract>(
    'club_sponsor_contracts',
    [],
    (c) => c.id
  );

  const [sponsorPayouts] = useSupabaseTable<SponsorPayout>(
    'sponsor_payouts',
    [],
    (p) => p.id
  );
```

- [ ] **Step 3: Verificar que compila**

Run: `npm run lint`
Expected: sin errores. Si TypeScript avisa que `setSponsors` / `setSponsorObjectives` / `setSponsorContracts` / `sponsorPayouts` no se usan, ignorarlo por ahora: se consumen en las Tareas 12 y 13.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: cablear tablas de patrocinadores en App"
```

---

## Task 12: Pestaña "Patrocinador" en Mi Club

**Files:**
- Create: `src/components/miclub/SponsorTab.tsx`
- Modify: `src/components/miclub/MiClubHub.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Crear el componente**

Crear `src/components/miclub/SponsorTab.tsx`:

```typescript
import React from 'react';
import { Handshake, Check, Lock } from 'lucide-react';
import { Club, ClubSponsorContract, MatchResult, Sponsor, SponsorObjective } from '../../types';
import { evaluateContract, eligibleSponsors } from '../../utils/sponsorEngine';

interface SponsorTabProps {
  currentClub: Club;
  clubs: Club[];
  matches: MatchResult[];
  sponsors: Sponsor[];
  sponsorObjectives: SponsorObjective[];
  sponsorContracts: ClubSponsorContract[];
  currentSeasonNumber: number;
  onSignSponsor: (sponsorId: string) => void;
}

const formatMillions = (amount: number) => `${(amount / 1_000_000).toFixed(0)} M €`;

export const SponsorTab: React.FC<SponsorTabProps> = ({
  currentClub,
  clubs,
  matches,
  sponsors,
  sponsorObjectives,
  sponsorContracts,
  currentSeasonNumber,
  onSignSponsor
}) => {
  const contract = sponsorContracts.find(
    c => c.clubId === currentClub.id && c.seasonNumber === currentSeasonNumber
  );

  // La temporada se considera arrancada apenas hay un partido confirmado: a
  // partir de ahi el contrato se bloquea, porque si no el manager cambiaria de
  // marca al final para maximizar el cobro.
  const seasonStarted = matches.some(m => m.status === 'CONFIRMADO');

  if (!contract) {
    const options = eligibleSponsors(currentClub, sponsors);

    if (seasonStarted) {
      return (
        <div className="fc-card p-8 rounded-xl text-center">
          <Lock className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="font-display font-bold text-xl text-white">Sin patrocinador esta temporada</h3>
          <p className="text-xs text-slate-400 mt-2">
            La temporada ya comenzo, asi que no se pueden firmar contratos nuevos. Vas a poder elegir marca al inicio de la Temporada {currentSeasonNumber + 1}.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="fc-card p-6 rounded-xl">
          <h3 className="font-display font-bold text-xl text-white">Elegi tu patrocinador</h3>
          <p className="text-xs text-slate-400 mt-1">
            Una vez que arranque la temporada no vas a poder cambiarlo. Las marcas mas exigentes pagan mas.
          </p>
        </div>

        {options.length === 0 && (
          <div className="fc-card p-6 rounded-xl text-center text-sm text-slate-400">
            No hay marcas disponibles para tu division todavia.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {options.map(sponsor => {
            const objectives = sponsorObjectives.filter(o => o.sponsorId === sponsor.id);
            const maxTotal = objectives.reduce((sum, o) => sum + o.rewardMillions, 0);

            return (
              <div key={sponsor.id} className="fc-card p-5 rounded-xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-lg text-white">{sponsor.name}</h4>
                  <span className="text-xs text-[#02f59b] font-bold">Hasta {maxTotal} M €</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1">
                  {objectives.map(o => (
                    <li key={o.id} className="flex justify-between gap-3">
                      <span>{o.label}</span>
                      <span className="text-slate-400 whitespace-nowrap">+{o.rewardMillions} M</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onSignSponsor(sponsor.id)}
                  className="mt-auto bg-[#02f59b] text-slate-900 font-bold text-sm rounded-lg py-2 hover:brightness-110"
                >
                  Firmar con {sponsor.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const sponsor = sponsors.find(s => s.id === contract.sponsorId);
  const objectives = sponsorObjectives.filter(o => o.sponsorId === contract.sponsorId);
  const evaluation = evaluateContract(currentClub.id, clubs, matches, objectives);
  const byId = new Map(objectives.map(o => [o.id, o]));

  return (
    <div className="space-y-4">
      <div className="fc-card p-6 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Handshake className="w-8 h-8 text-[#02f59b]" />
          <div>
            <h3 className="font-display font-bold text-xl text-white">{sponsor?.name ?? 'Patrocinador'}</h3>
            <p className="text-xs text-slate-400">Temporada {contract.seasonNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Acumulado</p>
          <p className="font-display font-black text-2xl text-[#02f59b]">{formatMillions(evaluation.totalAmount)}</p>
        </div>
      </div>

      <div className="fc-card rounded-xl overflow-hidden">
        {evaluation.lines.map(line => {
          const objective = byId.get(line.objectiveId);
          const percent = line.target > 0 ? Math.min(100, (line.current / line.target) * 100) : 0;

          return (
            <div key={line.objectiveId} className="p-4 border-b border-white/5 last:border-b-0">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-white flex items-center gap-2">
                  {line.met && <Check className="w-4 h-4 text-[#02f59b]" />}
                  {line.label}
                </span>
                <span className={`text-sm font-bold whitespace-nowrap ${line.met ? 'text-[#02f59b]' : 'text-slate-500'}`}>
                  +{objective?.rewardMillions ?? 0} M €
                </span>
              </div>

              {line.target > 1 && !line.met && (
                <div className="mt-2">
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#02f59b]" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Vas {line.current} de {line.target}</p>
                </div>
              )}

              {!line.met && line.target <= 1 && (
                <p className="text-[11px] text-slate-500 mt-1">No alcanzado</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 text-center">
        Los premios se acreditan cuando el administrador cierra la temporada.
      </p>
    </div>
  );
};
```

- [ ] **Step 2: Registrar la pestaña en MiClubHub**

En `src/components/miclub/MiClubHub.tsx`:

1. Agregar al import de `lucide-react` el ícono `Handshake`.
2. Agregar al import de `../../types` los tipos `Sponsor`, `SponsorObjective`, `ClubSponsorContract`.
3. Agregar el import del componente: `import { SponsorTab } from './SponsorTab';`
4. Agregar a `MiClubHubProps`:

```typescript
  sponsors?: Sponsor[];
  sponsorObjectives?: SponsorObjective[];
  sponsorContracts?: ClubSponsorContract[];
  currentSeasonNumber?: number;
  onSignSponsor?: (sponsorId: string) => void;
```

5. Cambiar el tipo `MiClubTab` para incluir `'patrocinador'`:

```typescript
type MiClubTab = 'recientes' | 'stats-equipo' | 'alineaciones' | 'estadio' | 'calendario' | 'stats-completas' | 'financiero' | 'transacciones' | 'patrocinador';
```

6. Agregar la entrada al array `TABS`, después de `'transacciones'`:

```typescript
  { id: 'patrocinador', label: 'Patrocinador', icon: Handshake }
```

7. Agregar los parámetros nuevos a la desestructuración del componente:

```typescript
  sponsors = [],
  sponsorObjectives = [],
  sponsorContracts = [],
  currentSeasonNumber = 1,
  onSignSponsor
```

8. Renderizar la pestaña donde se renderizan las demás (junto a `{activeMiClubTab === 'transacciones' && ...}`):

```typescript
      {activeMiClubTab === 'patrocinador' && (
        <SponsorTab
          currentClub={currentClub}
          clubs={clubs}
          matches={matches}
          sponsors={sponsors}
          sponsorObjectives={sponsorObjectives}
          sponsorContracts={sponsorContracts}
          currentSeasonNumber={currentSeasonNumber}
          onSignSponsor={onSignSponsor ?? (() => {})}
        />
      )}
```

- [ ] **Step 3: Pasar las props desde App.tsx**

En `src/App.tsx`, agregar el handler de firma cerca de los demás handlers (antes del `return`):

```typescript
  const handleSignSponsor = (sponsorId: string) => {
    if (!currentClubId) return;
    const contractId = `contract-${currentClubId}-${currentSeasonNumber}`;
    setSponsorContracts(prev => [
      ...prev.filter(c => c.id !== contractId),
      {
        id: contractId,
        clubId: currentClubId,
        sponsorId,
        seasonNumber: currentSeasonNumber,
        signedAt: new Date().toISOString()
      }
    ]);
  };
```

Y agregar al JSX donde se renderiza `<MiClubHub ... />`:

```typescript
            sponsors={sponsors}
            sponsorObjectives={sponsorObjectives}
            sponsorContracts={sponsorContracts}
            currentSeasonNumber={currentSeasonNumber}
            onSignSponsor={handleSignSponsor}
```

- [ ] **Step 4: Verificar que compila y buildea**

Run: `npm run lint && npm run build`
Expected: ambos sin errores.

- [ ] **Step 5: Commit**

```bash
git add src/components/miclub/SponsorTab.tsx src/components/miclub/MiClubHub.tsx src/App.tsx
git commit -m "feat: pestana Patrocinador en Mi Club con progreso y firma"
```

---

## Task 13: Sección de patrocinadores en el Panel de Administración

**Files:**
- Create: `src/components/admin/SponsorsAdminSection.tsx`
- Modify: `src/components/AdminPanel.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Crear el componente**

Crear `src/components/admin/SponsorsAdminSection.tsx`:

```typescript
import React, { useState } from 'react';
import { Handshake, Play, AlertTriangle } from 'lucide-react';
import { Club, ClubSponsorContract, MatchResult, Sponsor, SponsorObjective, SponsorPayout } from '../../types';
import { evaluateContract } from '../../utils/sponsorEngine';
import { supabase } from '../../lib/supabaseClient';

interface SponsorsAdminSectionProps {
  clubs: Club[];
  matches: MatchResult[];
  sponsors: Sponsor[];
  sponsorObjectives: SponsorObjective[];
  sponsorContracts: ClubSponsorContract[];
  sponsorPayouts: SponsorPayout[];
  currentSeasonNumber: number;
  onUpdateObjective: (objective: SponsorObjective) => void;
}

interface PreviewRow {
  clubId: string;
  clubName: string;
  sponsorName: string;
  objectiveId: string;
  label: string;
  amount: number;
  alreadyPaid: boolean;
}

const formatMillions = (amount: number) => `${(amount / 1_000_000).toFixed(0)} M €`;

export const SponsorsAdminSection: React.FC<SponsorsAdminSectionProps> = ({
  clubs,
  matches,
  sponsors,
  sponsorObjectives,
  sponsorContracts,
  sponsorPayouts,
  currentSeasonNumber,
  onUpdateObjective
}) => {
  const [preview, setPreview] = useState<PreviewRow[] | null>(null);
  const [settling, setSettling] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const buildPreview = (): PreviewRow[] => {
    const rows: PreviewRow[] = [];

    sponsorContracts
      .filter(contract => contract.seasonNumber === currentSeasonNumber)
      .forEach(contract => {
        const club = clubs.find(c => c.id === contract.clubId);
        const sponsor = sponsors.find(s => s.id === contract.sponsorId);
        if (!club || !sponsor) return;

        const objectives = sponsorObjectives.filter(o => o.sponsorId === sponsor.id);
        const evaluation = evaluateContract(club.id, clubs, matches, objectives);

        evaluation.lines
          .filter(line => line.met)
          .forEach(line => {
            rows.push({
              clubId: club.id,
              clubName: club.name,
              sponsorName: sponsor.name,
              objectiveId: line.objectiveId,
              label: line.label,
              amount: line.amount,
              alreadyPaid: sponsorPayouts.some(
                p =>
                  p.clubId === club.id &&
                  p.seasonNumber === currentSeasonNumber &&
                  p.objectiveId === line.objectiveId
              )
            });
          });
      });

    return rows;
  };

  const settle = async () => {
    if (!preview) return;
    setSettling(true);
    setResult(null);

    let paid = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of preview) {
      const { data, error } = await supabase.rpc('settle_sponsor_payout', {
        p_club_id: row.clubId,
        p_season_number: currentSeasonNumber,
        p_objective_id: row.objectiveId,
        p_amount: row.amount,
        p_concept: `Bonus ${row.sponsorName} - ${row.label}`
      });

      if (error) {
        errors.push(`${row.clubName} / ${row.label}: ${error.message}`);
      } else if (data === true) {
        paid += 1;
      } else {
        skipped += 1;
      }
    }

    setSettling(false);
    setPreview(null);
    setResult(
      errors.length > 0
        ? `Pagados: ${paid}. Ya estaban pagados: ${skipped}. Errores: ${errors.join(' | ')}`
        : `Listo. Pagados: ${paid}. Ya estaban pagados: ${skipped}.`
    );
  };

  const pendingTotal = (preview ?? [])
    .filter(row => !row.alreadyPaid)
    .reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="space-y-6">
      <div className="fc-card p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <Handshake className="w-6 h-6 text-[#02f59b]" />
          <h3 className="font-display font-bold text-xl text-white">Patrocinadores</h3>
        </div>
        <p className="text-xs text-slate-400">
          Temporada {currentSeasonNumber}. {sponsorContracts.filter(c => c.seasonNumber === currentSeasonNumber).length} contratos firmados.
        </p>
      </div>

      <div className="fc-card p-6 rounded-xl space-y-4">
        <h4 className="font-display font-bold text-lg text-white">Premios por marca</h4>
        {sponsors.map(sponsor => (
          <div key={sponsor.id} className="space-y-2">
            <p className="text-sm font-bold text-[#02f59b]">{sponsor.name}</p>
            {sponsorObjectives
              .filter(o => o.sponsorId === sponsor.id)
              .map(objective => (
                <div key={objective.id} className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-300">{objective.label}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={objective.rewardMillions}
                      onChange={e =>
                        onUpdateObjective({ ...objective, rewardMillions: Number(e.target.value) || 0 })
                      }
                      className="w-20 bg-slate-800 text-white text-xs rounded px-2 py-1 border border-white/10"
                    />
                    <span className="text-xs text-slate-500">M €</span>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="fc-card p-6 rounded-xl space-y-4">
        <h4 className="font-display font-bold text-lg text-white">Liquidacion</h4>

        {!preview && (
          <button
            onClick={() => setPreview(buildPreview())}
            className="bg-[#02f59b] text-slate-900 font-bold text-sm rounded-lg px-4 py-2 hover:brightness-110"
          >
            Ver vista previa de pagos
          </button>
        )}

        {preview && (
          <>
            {preview.length === 0 && (
              <p className="text-xs text-slate-400">Ningun club cumplio objetivos todavia.</p>
            )}

            {preview.length > 0 && (
              <div className="space-y-1">
                {preview.map(row => (
                  <div
                    key={`${row.clubId}-${row.objectiveId}`}
                    className="flex items-center justify-between gap-3 text-xs border-b border-white/5 py-2"
                  >
                    <span className="text-white">
                      {row.clubName} <span className="text-slate-500">— {row.sponsorName}: {row.label}</span>
                    </span>
                    <span className={row.alreadyPaid ? 'text-slate-500 line-through' : 'text-[#02f59b] font-bold'}>
                      {formatMillions(row.amount)}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 text-sm">
                  <span className="text-slate-300">Total a acreditar</span>
                  <span className="font-display font-black text-xl text-[#02f59b]">{formatMillions(pendingTotal)}</span>
                </div>

                <div className="flex items-start gap-2 text-[11px] text-amber-400 pt-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Esto suma dinero al presupuesto de cada club y crea las transacciones. Los tachados ya se pagaron y se saltean.</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={settle}
                disabled={settling || preview.length === 0}
                className="bg-[#02f59b] text-slate-900 font-bold text-sm rounded-lg px-4 py-2 disabled:opacity-40 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                {settling ? 'Liquidando...' : 'Confirmar y acreditar'}
              </button>
              <button
                onClick={() => setPreview(null)}
                disabled={settling}
                className="text-slate-400 text-sm px-4 py-2 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        {result && <p className="text-xs text-slate-300">{result}</p>}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Montar la sección en AdminPanel**

En `src/components/AdminPanel.tsx`:

1. Agregar `import { SponsorsAdminSection } from './admin/SponsorsAdminSection';`
2. Agregar a los tipos importados desde `../types`: `Sponsor`, `SponsorObjective`, `ClubSponsorContract`, `SponsorPayout`.
3. Agregar a las props del componente:

```typescript
  sponsors: Sponsor[];
  sponsorObjectives: SponsorObjective[];
  sponsorContracts: ClubSponsorContract[];
  sponsorPayouts: SponsorPayout[];
  currentSeasonNumber: number;
  onUpdateSponsorObjective: (objective: SponsorObjective) => void;
```

4. Renderizar `<SponsorsAdminSection ... />` al final del contenido del panel, pasándole `clubs`, `matches`, `sponsors`, `sponsorObjectives`, `sponsorContracts`, `sponsorPayouts`, `currentSeasonNumber` y `onUpdateObjective={onUpdateSponsorObjective}`.

Si `AdminPanel` ya usa un sistema de secciones o tabs internas, agregar la sección siguiendo ese mismo patrón en vez de renderizarla suelta al final.

- [ ] **Step 3: Pasar las props desde App.tsx**

En `src/App.tsx`, agregar el handler:

```typescript
  const handleUpdateSponsorObjective = (objective: SponsorObjective) => {
    setSponsorObjectives(prev => prev.map(o => (o.id === objective.id ? objective : o)));
  };
```

Y en el JSX donde se renderiza `<AdminPanel ... />`:

```typescript
          sponsors={sponsors}
          sponsorObjectives={sponsorObjectives}
          sponsorContracts={sponsorContracts}
          sponsorPayouts={sponsorPayouts}
          currentSeasonNumber={currentSeasonNumber}
          onUpdateSponsorObjective={handleUpdateSponsorObjective}
```

- [ ] **Step 4: Verificar**

Run: `npm run lint && npm test && npm run build`
Expected: los tres sin errores.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/SponsorsAdminSection.tsx src/components/AdminPanel.tsx src/App.tsx
git commit -m "feat: seccion de patrocinadores en el Panel de Administracion"
```

---

## Task 14: Actualizar la spec y push final

**Files:**
- Modify: `docs/superpowers/specs/2026-08-02-patrocinadores-design.md`

- [ ] **Step 1: Anotar la decisión sobre `requirementMaxPosition`**

En la sección "### `sponsors`" del archivo de spec, reemplazar la fila de la tabla:

```markdown
| `requirementMaxPosition` | int \| null | Posición máxima en la temporada anterior (ej. 4 = top 4) |
```

por:

```markdown
| `requirementMaxPosition` | int \| null | Posición máxima en la temporada anterior (ej. 4 = top 4). **Definido pero sin implementar:** `MatchResult` no tiene `seasonNumber`, así que la app no conserva historial por temporada y no hay forma de calcular la posición anterior. La elegibilidad usa solo `requirementDivision`. |
```

- [ ] **Step 2: Verificación final completa**

Run: `npm run lint && npm test && npm run build`
Expected: los tres sin errores.

- [ ] **Step 3: Commit y push**

```bash
git add docs/superpowers/specs/2026-08-02-patrocinadores-design.md
git commit -m "docs: aclarar que requirementMaxPosition queda sin implementar"
git push origin feature/backend-accounts-migration
```

- [ ] **Step 4: Reportar al usuario**

Informar el hash del último commit y recordar que las migraciones `012_sponsors.sql` y `013_sponsor_settlement_rpc.sql` hay que correrlas a mano en el SQL Editor de Supabase antes de que el sistema funcione en producción.
