# Mi Club Tabs Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-page `SquadBuilder.tsx` ("Mi Club") with a tabbed `MiClubHub.tsx` that splits its content into 8 pestañas (Juegos recientes, Estadísticas de equipo, Alineaciones, Estadio, Calendario y clasificación, Estadísticas completas, Estado Financiero, Historial de Transacciones), removing the always-visible tactical pitch from the main view.

**Architecture:** One new folder `src/components/miclub/` with 8 tab components (one file each) plus a `MiClubHub.tsx` container that owns the club banner, the "Añadir Jugador" modal, and the tab bar. `App.tsx` swaps its `SquadBuilder` usage for `MiClubHub`. `Club` gains 3 optional stadium fields in `types.ts` (no SQL migration needed — Supabase `clubs` table stores `data jsonb`). `AdminPanel.tsx`'s existing club-edit form gains inputs for those 3 fields.

**Tech Stack:** React 18 + TypeScript, Vite, Tailwind (utility classes only, no CSS files), lucide-react icons. No test runner in this project — verification is `npm run lint` (`tsc --noEmit`) after every task, `npm run build` at the end, plus a manual smoke-test checklist (dev server not started automatically; the last task lists exactly what to click through).

**Spec:** `docs/superpowers/specs/2026-08-01-mi-club-tabs-redesign-design.md`

---

## Task 1: Extend the `Club` type with stadium fields

**Files:**
- Modify: `src/types.ts:1-20`

- [ ] **Step 1: Add the 3 new optional fields to the `Club` interface**

In `src/types.ts`, the `Club` interface currently ends like this:

```ts
export interface Club {
  id: string;
  name: string;
  shortName: string;
  manager: string;
  gamertag: string;
  platform: 'PS5' | 'Xbox Series X' | 'PC';
  logoUrl: string;
  budget: number; // In Euros (€)
  division: string;
  stadium: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}
```

Change it to:

```ts
export interface Club {
  id: string;
  name: string;
  shortName: string;
  manager: string;
  gamertag: string;
  platform: 'PS5' | 'Xbox Series X' | 'PC';
  logoUrl: string;
  budget: number; // In Euros (€)
  division: string;
  stadium: string;
  stadiumCity?: string;
  stadiumCapacity?: number;
  stadiumPhotoUrl?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0) — `tsc --noEmit` passes because the new fields are optional, nothing else needs to change.

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: agregar campos opcionales de estadio (ciudad, capacidad, foto) al tipo Club"
```

---

## Task 2: `RecentGamesTab.tsx`

**Files:**
- Create: `src/components/miclub/RecentGamesTab.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React from 'react';
import { Club, MatchResult } from '../../types';
import { ClubLogo } from '../ClubLogo';
import { CompetitionLogo } from '../competitions/CompetitionLogo';
import { CalendarClock } from 'lucide-react';

interface RecentGamesTabProps {
  currentClub: Club;
  clubs: Club[];
  matches: MatchResult[];
}

export const RecentGamesTab: React.FC<RecentGamesTabProps> = ({ currentClub, clubs, matches }) => {
  const recentMatches = matches
    .filter(m => m.status === 'CONFIRMADO' && (m.homeClubId === currentClub.id || m.awayClubId === currentClub.id))
    .sort((a, b) => b.matchday - a.matchday)
    .slice(0, 8);

  if (recentMatches.length === 0) {
    return (
      <div className="fc-card p-10 rounded-2xl border-slate-200 text-center text-slate-500 text-sm font-tech">
        <CalendarClock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        Todavía no hay partidos confirmados para {currentClub.name}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentMatches.map(match => {
        const isHome = match.homeClubId === currentClub.id;
        const opponentId = isHome ? match.awayClubId : match.homeClubId;
        const opponent = clubs.find(c => c.id === opponentId);
        const ownGoals = isHome ? match.homeGoals : match.awayGoals;
        const opponentGoals = isHome ? match.awayGoals : match.homeGoals;

        const result: 'W' | 'D' | 'L' = ownGoals > opponentGoals ? 'W' : ownGoals < opponentGoals ? 'L' : 'D';
        const resultStyle = {
          W: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          D: 'bg-slate-100 text-slate-700 border-slate-300',
          L: 'bg-rose-100 text-rose-800 border-rose-300'
        }[result];
        const resultLabel = { W: 'GANÓ', D: 'EMPATÓ', L: 'PERDIÓ' }[result];

        return (
          <div
            key={match.id}
            className="fc-card p-4 rounded-2xl border-slate-200 flex items-center justify-between gap-4 flex-wrap"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-tech font-extrabold uppercase border shrink-0 ${resultStyle}`}>
                {resultLabel}
              </span>
              {match.competition && <CompetitionLogo competition={match.competition} size="sm" />}
              <div className="min-w-0">
                <p className="text-[10px] text-slate-500 font-tech uppercase">
                  Jornada {match.matchday} {match.competition ? `• ${match.competition}` : ''} • {isHome ? 'Local' : 'Visitante'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <ClubLogo src={opponent?.logoUrl} alt={opponent?.name || 'Rival'} className="w-6 h-6 rounded object-cover shrink-0" />
                  <span className="font-bold text-sm text-slate-900 truncate">vs {opponent?.name || 'Rival'}</span>
                </div>
              </div>
            </div>

            <div className="font-display font-black text-2xl text-slate-900 shrink-0">
              {isHome ? `${match.homeGoals} - ${match.awayGoals}` : `${match.awayGoals} - ${match.homeGoals}`}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/miclub/RecentGamesTab.tsx
git commit -m "feat: agregar pestana Juegos recientes de Mi Club"
```

---

## Task 3: `TeamStatsTab.tsx`

**Files:**
- Create: `src/components/miclub/TeamStatsTab.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React from 'react';
import { Club, Player } from '../../types';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TeamStatsTabProps {
  currentClub: Club;
  players: Player[];
}

export const TeamStatsTab: React.FC<TeamStatsTabProps> = ({ currentClub, players }) => {
  const starters = players.filter(p => p.clubId === currentClub.id && p.isStarter);
  const avgRating = starters.length > 0
    ? Math.round(starters.reduce((acc, p) => acc + p.rating, 0) / starters.length)
    : 0;
  const goalDifference = currentClub.goalsFor - currentClub.goalsAgainst;

  const stats: { label: string; value: string | number; accent?: string }[] = [
    { label: 'Partidos Jugados', value: currentClub.played },
    { label: 'Ganados', value: currentClub.won, accent: 'text-emerald-700' },
    { label: 'Empatados', value: currentClub.drawn, accent: 'text-slate-700' },
    { label: 'Perdidos', value: currentClub.lost, accent: 'text-rose-700' },
    { label: 'Goles a Favor', value: currentClub.goalsFor },
    { label: 'Goles en Contra', value: currentClub.goalsAgainst },
    { label: 'Diferencia de Gol', value: goalDifference > 0 ? `+${goalDifference}` : goalDifference, accent: goalDifference >= 0 ? 'text-emerald-700' : 'text-rose-700' },
    { label: 'Puntos', value: currentClub.points, accent: 'text-[#00ba68]' }
  ];

  const formIcon = { W: TrendingUp, D: Minus, L: TrendingDown };
  const formStyle = {
    W: 'bg-emerald-500 text-white',
    D: 'bg-slate-400 text-white',
    L: 'bg-rose-500 text-white'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(stat => (
          <div key={stat.label} className="fc-card p-4 rounded-2xl border-slate-200 text-center">
            <span className="text-[10px] font-tech uppercase text-slate-500 block mb-1">{stat.label}</span>
            <span className={`font-display font-black text-2xl ${stat.accent || 'text-slate-900'}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="fc-card p-5 rounded-2xl border-slate-200 space-y-3">
        <h3 className="font-display font-bold text-sm uppercase text-slate-800 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" /> Racha Reciente
        </h3>
        {currentClub.form.length > 0 ? (
          <div className="flex items-center gap-2">
            {currentClub.form.map((result, idx) => {
              const Icon = formIcon[result];
              return (
                <span
                  key={idx}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${formStyle[result]}`}
                  title={result === 'W' ? 'Ganado' : result === 'D' ? 'Empatado' : 'Perdido'}
                >
                  <Icon className="w-4 h-4" />
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-tech italic">Sin partidos jugados todavía.</p>
        )}
      </div>

      <div className="fc-card p-5 rounded-2xl border-slate-200 flex items-center justify-between">
        <span className="text-xs font-tech font-bold uppercase text-slate-500">Media de Plantilla (11 Titular)</span>
        <span className="font-display font-black text-3xl text-[#00ba68]">{avgRating} OVR</span>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/miclub/TeamStatsTab.tsx
git commit -m "feat: agregar pestana Estadisticas de equipo de Mi Club"
```

---

## Task 4: `StadiumTab.tsx`

**Files:**
- Create: `src/components/miclub/StadiumTab.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React from 'react';
import { Club } from '../../types';
import { Landmark, MapPin, Users } from 'lucide-react';

interface StadiumTabProps {
  currentClub: Club;
}

export const StadiumTab: React.FC<StadiumTabProps> = ({ currentClub }) => {
  const hasPhoto = !!currentClub.stadiumPhotoUrl;

  return (
    <div className="fc-card rounded-2xl border-slate-200 overflow-hidden shadow-md">
      <div
        className="h-48 md:h-64 relative flex items-end p-6"
        style={
          hasPhoto
            ? { backgroundImage: `url(${currentClub.stadiumPhotoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 60%, #0f172a 100%)' }
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10">
          <span className="px-2.5 py-1 bg-[#02f59b] text-black text-[10px] font-extrabold uppercase rounded font-tech tracking-wider">
            Estadio Oficial
          </span>
          <h1 className="font-display font-black text-2xl md:text-4xl text-white uppercase italic tracking-wide mt-2 flex items-center gap-2">
            <Landmark className="w-7 h-7 text-[#02f59b] shrink-0" />
            {currentClub.stadium || 'Por Asignar'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-tech uppercase text-slate-500 font-bold block">Ciudad</span>
            <span className="font-display font-bold text-sm text-slate-900">
              {currentClub.stadiumCity || 'No especificada'}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-tech uppercase text-slate-500 font-bold block">Capacidad</span>
            <span className="font-display font-bold text-sm text-slate-900">
              {currentClub.stadiumCapacity ? `${currentClub.stadiumCapacity.toLocaleString('es-ES')} espectadores` : 'No especificada'}
            </span>
          </div>
        </div>
      </div>

      <p className="px-6 pb-6 text-[11px] text-slate-400 font-tech italic">
        Estos datos los carga el Administrador de la Liga desde el Panel de Administración.
      </p>
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/miclub/StadiumTab.tsx
git commit -m "feat: agregar pestana Estadio de Mi Club"
```

---

## Task 5: `ScheduleStandingsTab.tsx`

**Files:**
- Create: `src/components/miclub/ScheduleStandingsTab.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React from 'react';
import { Club, MatchResult } from '../../types';
import { StandingsTable } from '../competitions/StandingsTable';
import { ClubLogo } from '../ClubLogo';
import { CompetitionLogo } from '../competitions/CompetitionLogo';
import { CalendarDays, ListOrdered } from 'lucide-react';

interface ScheduleStandingsTabProps {
  currentClub: Club;
  clubs: Club[];
  matches: MatchResult[];
}

export const ScheduleStandingsTab: React.FC<ScheduleStandingsTabProps> = ({ currentClub, clubs, matches }) => {
  const clubMatches = matches
    .filter(m => m.homeClubId === currentClub.id || m.awayClubId === currentClub.id)
    .sort((a, b) => a.matchday - b.matchday);

  const statusStyle: Record<MatchResult['status'], string> = {
    CONFIRMADO: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    PENDIENTE: 'bg-amber-100 text-amber-800 border-amber-300',
    RECHAZADO: 'bg-rose-100 text-rose-800 border-rose-300'
  };

  return (
    <div className="space-y-6">
      <div className="fc-card p-5 rounded-2xl border-slate-200 space-y-3">
        <h3 className="font-display font-bold text-sm uppercase text-slate-800 flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-blue-500" /> Calendario de {currentClub.name}
        </h3>

        {clubMatches.length === 0 ? (
          <p className="text-xs text-slate-400 font-tech italic py-4 text-center">No hay partidos programados todavía.</p>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {clubMatches.map(match => {
              const isHome = match.homeClubId === currentClub.id;
              const opponent = clubs.find(c => c.id === (isHome ? match.awayClubId : match.homeClubId));
              return (
                <div key={match.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    {match.competition && <CompetitionLogo competition={match.competition} size="sm" />}
                    <span className="text-[10px] font-tech text-slate-500 uppercase shrink-0">J{match.matchday}</span>
                    <ClubLogo src={opponent?.logoUrl} alt={opponent?.name || 'Rival'} className="w-6 h-6 rounded object-cover shrink-0" />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {isHome ? 'vs' : '@'} {opponent?.name || 'Rival'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {match.status === 'CONFIRMADO' && (
                      <span className="font-display font-black text-sm text-slate-900">
                        {match.homeGoals} - {match.awayGoals}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[9px] font-tech font-extrabold uppercase border ${statusStyle[match.status]}`}>
                      {match.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-display font-bold text-sm uppercase text-slate-800 flex items-center gap-1.5">
          <ListOrdered className="w-4 h-4 text-emerald-600" /> Clasificación — {currentClub.division || '1ra División'}
        </h3>
        <StandingsTable clubs={clubs} matches={matches} competition={currentClub.division || '1ra División'} />
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/miclub/ScheduleStandingsTab.tsx
git commit -m "feat: agregar pestana Calendario y clasificacion de Mi Club"
```

---

## Task 6: `FullStatsTab.tsx`

**Files:**
- Create: `src/components/miclub/FullStatsTab.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React from 'react';
import { Club, Player } from '../../types';
import { BarChart3 } from 'lucide-react';

interface FullStatsTabProps {
  currentClub: Club;
  players: Player[];
}

export const FullStatsTab: React.FC<FullStatsTabProps> = ({ currentClub, players }) => {
  const clubPlayers = players
    .filter(p => p.clubId === currentClub.id)
    .sort((a, b) => (b.goals || 0) - (a.goals || 0));

  if (clubPlayers.length === 0) {
    return (
      <div className="fc-card p-10 rounded-2xl border-slate-200 text-center text-slate-500 text-sm font-tech">
        <BarChart3 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        {currentClub.name} todavía no tiene jugadores en la plantilla.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 fc-card">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-100 text-slate-600 font-tech uppercase text-[10px]">
          <tr>
            <th className="p-3">Jugador</th>
            <th className="p-3">Pos</th>
            <th className="p-3 text-center">OVR</th>
            <th className="p-3 text-center">PJ</th>
            <th className="p-3 text-center">Goles</th>
            <th className="p-3 text-center">Asist.</th>
            <th className="p-3 text-center">TA</th>
            <th className="p-3 text-center">TR</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 font-tech">
          {clubPlayers.map(player => (
            <tr key={player.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="p-3 font-bold text-slate-900">{player.name}</td>
              <td className="p-3">
                <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">{player.position}</span>
              </td>
              <td className="p-3 text-center font-mono font-bold text-slate-700">{player.rating}</td>
              <td className="p-3 text-center">{player.matchesPlayed || 0}</td>
              <td className="p-3 text-center font-display font-black text-emerald-700">{player.goals || 0}</td>
              <td className="p-3 text-center font-display font-black text-blue-700">{player.assists || 0}</td>
              <td className="p-3 text-center">
                <span className="font-mono font-bold text-amber-700">{player.yellowCards || 0}</span>
              </td>
              <td className="p-3 text-center">
                <span className="font-mono font-bold text-rose-700">{player.redCards || 0}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/miclub/FullStatsTab.tsx
git commit -m "feat: agregar pestana Estadisticas completas de Mi Club"
```

---

## Task 7: `FinancesTab.tsx`

Moves the "Ingresos / Gastos / Balance" cards out of `SquadBuilder.tsx` (currently `src/components/SquadBuilder.tsx:552-593`, inside the bigger "Presupuesto & Libro de Cuentas del Club" block) into its own tab, unchanged.

**Files:**
- Create: `src/components/miclub/FinancesTab.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React from 'react';
import { Club, FinancialTransaction } from '../../types';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface FinancesTabProps {
  currentClub: Club;
  transactions: FinancialTransaction[];
}

export const FinancesTab: React.FC<FinancesTabProps> = ({ currentClub, transactions }) => {
  const clubTransactions = transactions.filter(t => t.clubId === currentClub.id);
  const totalIncome = clubTransactions.filter(t => t.type === 'INGRESO').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = clubTransactions.filter(t => t.type === 'GASTO').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="fc-card p-6 rounded-2xl border-slate-200 shadow-lg space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-slate-900 uppercase italic flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#00ba68]" /> Estado Financiero y Movimientos de Dinero
          </h2>
          <p className="text-xs text-slate-500 font-tech">Resumen contable de fichajes/ventas del {currentClub.name}.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-tech text-slate-500 uppercase">Presupuesto Actual:</span>
          <span className="font-display font-black text-2xl text-[#00ba68] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            €{(currentClub.budget / 1000000).toFixed(2)}M
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-tech uppercase text-emerald-800 font-bold block">Total Ingresos (Ventas)</span>
            <span className="font-display font-black text-lg text-emerald-700">+${(totalIncome / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500 text-white rounded-lg flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-tech uppercase text-rose-800 font-bold block">Total Gastos (Fichajes)</span>
            <span className="font-display font-black text-lg text-rose-700">-${(totalExpenses / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${netBalance >= 0 ? 'bg-slate-800 text-[#02f59b]' : 'bg-rose-800 text-rose-200'}`}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-tech uppercase text-slate-500 font-bold block">Balance Neto</span>
            <span className={`font-display font-black text-lg ${netBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {netBalance >= 0 ? '+' : ''}${(netBalance / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/miclub/FinancesTab.tsx
git commit -m "feat: agregar pestana Estado Financiero de Mi Club"
```

---

## Task 8: `TransactionsHistoryTab.tsx`

Moves the transactions table out of `SquadBuilder.tsx` (currently `src/components/SquadBuilder.tsx:595-643`) into its own tab, unchanged.

**Files:**
- Create: `src/components/miclub/TransactionsHistoryTab.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React from 'react';
import { Club, FinancialTransaction } from '../../types';
import { FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TransactionsHistoryTabProps {
  currentClub: Club;
  transactions: FinancialTransaction[];
}

export const TransactionsHistoryTab: React.FC<TransactionsHistoryTabProps> = ({ currentClub, transactions }) => {
  const clubTransactions = transactions.filter(t => t.clubId === currentClub.id);

  return (
    <div className="space-y-3">
      <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
        <FileText className="w-4 h-4 text-slate-500" /> Historial de Transacciones Financieras
      </h3>

      {clubTransactions.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-tech uppercase text-[10px]">
              <tr>
                <th className="p-3">Tipo</th>
                <th className="p-3">Concepto / Detalle</th>
                <th className="p-3 text-right">Monto ($)</th>
                <th className="p-3 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-tech">
              {clubTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    {tx.type === 'INGRESO' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                        <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> INGRESO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-300">
                        <ArrowUpRight className="w-3 h-3 text-rose-600" /> GASTO
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-bold text-slate-800">{tx.concept}</td>
                  <td className={`p-3 text-right font-display font-black text-sm ${tx.type === 'INGRESO' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'INGRESO' ? '+' : '-'}${(tx.amount / 1000000).toFixed(2)}M
                  </td>
                  <td className="p-3 text-right text-slate-500 font-mono text-[11px]">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs font-tech italic">
          No hay movimientos de dinero registrados aún para {currentClub.name}.
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/miclub/TransactionsHistoryTab.tsx
git commit -m "feat: agregar pestana Historial de Transacciones de Mi Club"
```

---

## Task 9: `LineupTab.tsx`

Moves the tactical pitch (formation selector + 11 titular) and the plantilla/suplentes roster list — currently `src/components/SquadBuilder.tsx:211-644` (pitch + roster) plus the "Precio de Traspaso" and "Valor de Mercado" modals (currently `src/components/SquadBuilder.tsx:855-1091`) — into its own tab. Logic is unchanged; only the surrounding wrapper (which used to be one big `<div className="space-y-6">` for the whole page) is scoped to just this tab.

**Files:**
- Create: `src/components/miclub/LineupTab.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React, { useState } from 'react';
import { Player, Club, TransferItem } from '../../types';
import { Zap, Trash2, Edit3, Tag, X } from 'lucide-react';

interface LineupTabProps {
  currentClub: Club;
  players: Player[];
  transfers: TransferItem[];
  onRemovePlayer: (playerId: string) => void;
  onToggleStarter: (playerId: string) => void;
  onUpdatePlayerValue?: (playerId: string, newValue: number) => void;
  onSetTransferPrice?: (player: Player, price: number) => void;
  onRemoveFromMarket?: (playerId: string) => void;
}

const FORMATIONS = [
  { name: '4-3-3', positions: ['POR', 'LI', 'DFC', 'DFC', 'LD', 'MC', 'MCD', 'MC', 'EI', 'DC', 'ED'] },
  { name: '4-2-3-1', positions: ['POR', 'LI', 'DFC', 'DFC', 'LD', 'MCD', 'MCD', 'EI', 'MCO', 'ED', 'DC'] },
  { name: '4-4-2', positions: ['POR', 'LI', 'DFC', 'DFC', 'LD', 'EI', 'MC', 'MC', 'ED', 'DC', 'DC'] },
  { name: '3-5-2', positions: ['POR', 'DFC', 'DFC', 'DFC', 'MCD', 'MCD', 'EI', 'MCO', 'ED', 'DC', 'DC'] }
];

export const LineupTab: React.FC<LineupTabProps> = ({
  currentClub,
  players,
  transfers,
  onRemovePlayer,
  onToggleStarter,
  onUpdatePlayerValue,
  onSetTransferPrice,
  onRemoveFromMarket
}) => {
  const [formation, setFormation] = useState('4-3-3');

  const [transferPriceEditPlayer, setTransferPriceEditPlayer] = useState<Player | null>(null);
  const [newTransferPriceInput, setNewTransferPriceInput] = useState<number>(30000000);

  const [valueEditPlayer, setValueEditPlayer] = useState<Player | null>(null);
  const [newValueInput, setNewValueInput] = useState<number>(25000000);

  const clubPlayers = players.filter(p => p.clubId === currentClub.id);
  const starters = clubPlayers.filter(p => p.isStarter);
  const substitutes = clubPlayers.filter(p => !p.isStarter);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pitch Display (2 cols) */}
        <div className="lg:col-span-2 pitch-bg rounded-2xl p-6 border-2 border-emerald-600/40 shadow-2xl relative min-h-[520px] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-24 border-b-2 border-white/20 rounded-b-full w-2/3 mx-auto pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 border-t-2 border-white/20 rounded-t-full w-2/3 mx-auto pointer-events-none" />
          <div className="absolute inset-y-1/2 inset-x-0 border-t-2 border-white/20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full pointer-events-none" />

          <div className="relative z-10 flex justify-between items-center bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 mb-2">
            <span className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#02f59b]" /> Táctica & Alineación Titular
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-tech uppercase">Formación:</span>
              <select
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
                className="bg-[#080d0a] text-xs font-bold text-[#02f59b] border border-emerald-500/40 px-2.5 py-1 rounded focus:outline-none"
              >
                {FORMATIONS.map(f => (
                  <option key={f.name} value={f.name}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          {(() => {
            const elevenStarters = starters.slice(0, 11);

            const gks = elevenStarters.filter(p => ['POR', 'GK'].includes(p.position));
            const gk = gks[0] || elevenStarters[0];
            const outfield = elevenStarters.filter(p => p.id !== gk?.id);

            const naturalDefs = outfield.filter(p => ['DFC', 'LD', 'LI', 'CAD', 'CAI'].includes(p.position));
            const naturalMids = outfield.filter(p => ['MC', 'MCD', 'MCO', 'MI', 'MD'].includes(p.position));
            const naturalFwds = outfield.filter(p => ['DC', 'EI', 'ED', 'SD'].includes(p.position));
            const others = outfield.filter(p =>
              !['DFC', 'LD', 'LI', 'CAD', 'CAI', 'MC', 'MCD', 'MCO', 'MI', 'MD', 'DC', 'EI', 'ED', 'SD'].includes(p.position)
            );

            let lines: { title: string; players: Player[] }[] = [];

            if (formation === '4-2-3-1') {
              const lineDEF = naturalDefs.slice(0, 4);
              const remainingDefs = naturalDefs.slice(4);

              const lineCDM = naturalMids.filter(p => ['MCD', 'MC'].includes(p.position)).slice(0, 2);
              const usedCdmIds = new Set(lineCDM.map(p => p.id));
              const remainingMids = naturalMids.filter(p => !usedCdmIds.has(p.id));

              const lineCAM = remainingMids.slice(0, 3);
              const usedCamIds = new Set(lineCAM.map(p => p.id));
              const unusedMids = remainingMids.filter(p => !usedCamIds.has(p.id));

              const poolST = [...naturalFwds, ...unusedMids, ...remainingDefs, ...others];
              const lineST = poolST.slice(0, 1);
              const usedStId = lineST[0]?.id;

              const unusedPool = poolST.filter(p => p.id !== usedStId);

              while (lineDEF.length < 4 && unusedPool.length > 0) {
                lineDEF.push(unusedPool.pop()!);
              }

              lines = [
                { title: 'Delantero Centro (1)', players: lineST },
                { title: 'Medias Puntas / Extremos (3)', players: lineCAM },
                { title: 'Pivotes Defensivos (2)', players: lineCDM },
                { title: 'Defensas (4)', players: lineDEF },
                { title: 'Portero (1)', players: gk ? [gk] : [] }
              ];
            } else {
              let targetCounts = { fwds: 3, mids: 3, defs: 4 };
              if (formation === '4-4-2') targetCounts = { fwds: 2, mids: 4, defs: 4 };
              if (formation === '3-5-2') targetCounts = { fwds: 2, mids: 5, defs: 3 };

              let lineDEF = naturalDefs.slice(0, targetCounts.defs);
              let remDefs = naturalDefs.slice(targetCounts.defs);

              let lineFWD = naturalFwds.slice(0, targetCounts.fwds);
              let remFwds = naturalFwds.slice(targetCounts.fwds);

              let lineMID = [...naturalMids, ...remFwds, ...others];

              while (lineDEF.length < targetCounts.defs && remDefs.length > 0) {
                lineDEF.push(remDefs.shift()!);
              }
              while (lineFWD.length < targetCounts.fwds && lineMID.length > targetCounts.mids) {
                lineFWD.push(lineMID.pop()!);
              }

              lines = [
                { title: 'Delanteros', players: lineFWD },
                { title: 'Mediocampistas', players: lineMID.slice(0, targetCounts.mids) },
                { title: 'Defensas', players: lineDEF },
                { title: 'Portero', players: gk ? [gk] : [] }
              ];
            }

            const renderCard = (player: Player) => {
              const transferItem = transfers.find(t => (t.player.id === player.id || t.player.name === player.name) && t.status === 'DISPONIBLE');
              return (
                <div
                  key={player.id}
                  onClick={() => onToggleStarter(player.id)}
                  className="relative group cursor-pointer transition-all hover:scale-105 hover:z-30"
                >
                  <div className={`p-1.5 rounded-xl text-center shadow-lg border transition-all ${
                    player.cardType === 'Special' ? 'fc-special-card text-black border-amber-300' :
                    player.cardType === 'Gold' ? 'fc-gold-card text-black border-amber-400' :
                    'bg-slate-900 border-slate-700 text-white'
                  }`}>
                    <div className="flex justify-between items-center font-display font-extrabold text-[10px] px-1">
                      <span className="text-xs font-mono leading-none">{player.rating}</span>
                      <span className="uppercase text-[9px] bg-black/40 text-white px-1 py-0.5 rounded">{player.position}</span>
                    </div>

                    <div className="w-10 h-10 rounded-lg bg-black/20 border border-black/30 mx-auto my-1 flex items-center justify-center overflow-hidden shadow-inner relative">
                      {player.photoUrl ? (
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="font-display font-black text-xs">{player.position}</span>
                      )}
                    </div>

                    <h4 className="font-display font-extrabold text-[10px] truncate uppercase tracking-tight text-slate-950">
                      {player.name}
                    </h4>

                    {transferItem && (
                      <div className="mt-0.5 bg-amber-400 text-slate-950 font-display font-black text-[8px] px-1 py-0.2 rounded shadow uppercase truncate">
                        🏷️ €{(transferItem.askingPrice / 1000000).toFixed(1)}M
                      </div>
                    )}
                  </div>
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[8px] px-1 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity z-40">
                    Banca
                  </span>
                </div>
              );
            };

            return (
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[500px] py-2 space-y-2">
                {starters.length === 0 ? (
                  <div className="my-auto text-center py-12 text-white font-tech bg-black/40 p-4 rounded-xl border border-white/10">
                    No hay titulares asignados. Haz clic en los jugadores de la derecha para llenar el 11 titular.
                  </div>
                ) : (
                  lines.map((line, lIdx) => (
                    <div key={lIdx} className="flex justify-around items-center gap-2 sm:gap-6 px-4">
                      {line.players.map(player => (
                        <div key={player.id} className="w-24 sm:w-28 flex-1 max-w-[125px]">
                          {renderCard(player)}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            );
          })()}
        </div>

        {/* Squad Roster List / Substitutes (1 col) */}
        <div className="fc-card p-5 rounded-2xl border-slate-200 space-y-4 shadow-md">
          <h3 className="font-display font-bold text-lg uppercase text-slate-900 flex items-center justify-between border-b border-slate-200 pb-2">
            <span>Suplentes & Plantilla ({substitutes.length})</span>
            <span className="text-xs text-slate-500 font-tech">Haz clic para alternar titular</span>
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {clubPlayers.map((player) => {
              const transferItem = transfers.find(t => (t.player.id === player.id || t.player.name === player.name) && t.status === 'DISPONIBLE');

              return (
                <div
                  key={player.id}
                  className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                    transferItem
                      ? 'bg-amber-50/80 border-amber-300'
                      : player.isStarter
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0 relative">
                      <img
                        src={player.photoUrl || `https://cdn.sofifa.net/players/231/747/25_120.png`}
                        alt={player.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-display font-extrabold text-xs text-black shrink-0 ${
                      player.cardType === 'Special' ? 'bg-[#02f59b]' : 'bg-amber-400'
                    }`}>
                      {player.rating}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5 flex-wrap">
                        <span>{player.name}</span>
                        <span className="text-[9px] font-mono text-slate-600 bg-slate-200 px-1 rounded">
                          {player.position}
                        </span>
                        {player.releaseClause && player.releaseClause > 0 && (
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-display font-black uppercase px-1.5 py-0.5 rounded border border-amber-500 shadow-xs flex items-center gap-1 animate-pulse">
                            <Tag className="w-2.5 h-2.5 shrink-0" /> FICHABLE
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[10px] font-tech">
                        <span className="text-slate-500 font-semibold">
                          Valor Referencial: <strong className="font-mono text-slate-700">€{((player.value || 0) / 1000000).toFixed(1)}M</strong>
                        </span>
                        {player.releaseClause && player.releaseClause > 0 ? (
                          <span className="text-[#00ba68] font-bold">
                            Precio de Traspaso: <strong className="font-mono">€{(player.releaseClause / 1000000).toFixed(1)}M</strong> · visible en el Mercado
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold italic">
                            No Transferible (ningún club puede ficharlo todavía)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    {onUpdatePlayerValue && (
                      <button
                        onClick={() => {
                          setValueEditPlayer(player);
                          setNewValueInput(player.value || 25000000);
                        }}
                        className="px-2 py-1 rounded text-[10px] font-extrabold font-tech uppercase bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 flex items-center gap-1 transition-colors"
                        title="Editar el valor de mercado de referencia (informativo, no afecta compras)"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" /> Valor
                      </button>
                    )}

                    {onSetTransferPrice && (
                      <button
                        onClick={() => {
                          setTransferPriceEditPlayer(player);
                          setNewTransferPriceInput(player.releaseClause && player.releaseClause > 0 ? player.releaseClause : (player.value || 25000000));
                        }}
                        className="px-2 py-1 rounded text-[10px] font-extrabold font-tech uppercase bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 flex items-center gap-1 transition-colors"
                        title="Fijar el precio por el que cualquier club puede fichar a este jugador (lo lista en el Mercado de Fichajes)"
                      >
                        <Tag className="w-3 h-3 text-emerald-600" /> {player.releaseClause && player.releaseClause > 0 ? 'Editar Precio' : 'Poner Fichable'}
                      </button>
                    )}

                    {onRemoveFromMarket && player.releaseClause && player.releaseClause > 0 && (
                      <button
                        onClick={() => {
                          if (confirm(`¿Quitar a ${player.name} del Mercado de Fichajes? Ya no será fichable por otros clubes.`)) {
                            onRemoveFromMarket(player.id);
                          }
                        }}
                        className="px-2 py-1 rounded text-[10px] font-extrabold font-tech uppercase bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1 transition-colors"
                        title="Quitar del Mercado de Fichajes"
                      >
                        <X className="w-3 h-3" /> Quitar
                      </button>
                    )}

                    <button
                      onClick={() => onToggleStarter(player.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold font-tech uppercase transition-colors ${
                        player.isStarter
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                    >
                      {player.isStarter ? '11 Titular' : 'Hacer Titular'}
                    </button>

                    <button
                      onClick={() => onRemovePlayer(player.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL: Precio de Traspaso (une Cláusula + Vender en un solo paso) */}
      {transferPriceEditPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-md w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <Tag className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Precio de Traspaso
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">{currentClub.name}</p>
                </div>
              </div>
              <button
                onClick={() => setTransferPriceEditPlayer(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 text-white shadow-inner">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-[#02f59b] font-display font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500">
                {transferPriceEditPlayer.position}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-black text-lg text-white uppercase leading-tight truncate">
                  {transferPriceEditPlayer.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-[10px] bg-[#02f59b] text-black font-extrabold px-1.5 py-0.5 rounded font-mono">
                    {transferPriceEditPlayer.position}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {transferPriceEditPlayer.rating} OVR
                  </span>
                  <span className="text-[10px] text-slate-400 font-tech">
                    {currentClub.name}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (onSetTransferPrice && transferPriceEditPlayer) {
                onSetTransferPrice(transferPriceEditPlayer, Number(newTransferPriceInput));
                alert(`¡Listo! ${transferPriceEditPlayer.name} ya es fichable por cualquier club de la liga pagando €${(Number(newTransferPriceInput) / 1000000).toFixed(1)}M. Aparece en el Mercado de Fichajes.`);
              }
              setTransferPriceEditPlayer(null);
            }} className="space-y-4">

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                  Precio de Traspaso (€ Euros) *
                </label>
                <input
                  type="number"
                  value={newTransferPriceInput}
                  onChange={(e) => setNewTransferPriceInput(Number(e.target.value))}
                  step="1000000"
                  min="1000000"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-display font-black text-[#00ba68] focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
                <span className="text-xs font-display font-bold text-[#00ba68] mt-1 block">
                  Valor asignado: €{(newTransferPriceInput / 1000000).toFixed(1)}M Millones
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-tech font-bold uppercase text-slate-500 block">Valores Rápidos:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[15000000, 30000000, 50000000, 80000000, 100000000, 150000000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNewTransferPriceInput(val)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-colors ${
                        newTransferPriceInput === val
                          ? 'bg-[#00ba68] text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                      }`}
                    >
                      €{val / 1000000}M
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed font-tech">
                💡 <strong>Cómo funciona:</strong> apenas guardes, cualquier club de la liga va a poder ver y fichar a{' '}
                {transferPriceEditPlayer.name} en el Mercado de Fichajes pagando exactamente este monto — no hace
                falta que negocies ni que aceptes nada, el fichaje se confirma solo.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTransferPriceEditPlayer(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5"
                >
                  <Tag className="w-4 h-4" /> Guardar y Poner Fichable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Modificar Valor de Mercado de Jugador en Mi Club */}
      {valueEditPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-md w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <Edit3 className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Valor de Mercado
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">{currentClub.name}</p>
                </div>
              </div>
              <button
                onClick={() => setValueEditPlayer(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 text-white shadow-inner">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-[#02f59b] font-display font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500">
                {valueEditPlayer.position}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-black text-lg text-white uppercase leading-tight truncate">
                  {valueEditPlayer.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-[10px] bg-[#02f59b] text-black font-extrabold px-1.5 py-0.5 rounded font-mono">
                    {valueEditPlayer.position}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {valueEditPlayer.rating} OVR
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (onUpdatePlayerValue && valueEditPlayer) {
                onUpdatePlayerValue(valueEditPlayer.id, Number(newValueInput));
                alert(`¡Valor actualizado! El valor de mercado de ${valueEditPlayer.name} es ahora €${(Number(newValueInput) / 1000000).toFixed(1)}M.`);
              }
              setValueEditPlayer(null);
            }} className="space-y-4">

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                  Nuevo Valor de Mercado (€ Euros) *
                </label>
                <input
                  type="number"
                  value={newValueInput}
                  onChange={(e) => setNewValueInput(Number(e.target.value))}
                  step="1000000"
                  min="1000000"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-display font-black text-[#00ba68] focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
                <span className="text-xs font-display font-bold text-[#00ba68] mt-1 block">
                  Valor asignado: €{(newValueInput / 1000000).toFixed(1)}M Millones
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-tech font-bold uppercase text-slate-500 block">Valores Rápidos:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[10000000, 25000000, 50000000, 80000000, 120000000, 180000000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNewValueInput(val)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-colors ${
                        newValueInput === val
                          ? 'bg-[#00ba68] text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                      }`}
                    >
                      €{val / 1000000}M
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-tech">
                💡 <strong>Nota:</strong> Este es el precio de referencia que se usa como oferta por defecto cuando otro club quiere fichar a {valueEditPlayer.name} directamente (fuera de una cláusula). No afecta la cláusula de rescisión.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setValueEditPlayer(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> Guardar Valor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/miclub/LineupTab.tsx
git commit -m "feat: agregar pestana Alineaciones de Mi Club (campo tactico + plantilla)"
```

---

## Task 10: `MiClubHub.tsx`

Owns the club banner, the "Añadir Jugador" modal (moved unchanged from `src/components/SquadBuilder.tsx:646-853`), the tab bar, and renders whichever tab is active.

**Files:**
- Create: `src/components/miclub/MiClubHub.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React, { useState } from 'react';
import { ClubLogo } from '../ClubLogo';
import { Player, Club, PlayerPosition, FinancialTransaction, TransferItem, MatchResult } from '../../types';
import { Shield, UserPlus, Sparkles, X, PlayCircle, BarChart3, Users2, Landmark, CalendarDays, BarChart4, Wallet, FileText } from 'lucide-react';
import { SOFIFA_PLAYERS } from '../../data/sofifaData';
import { RecentGamesTab } from './RecentGamesTab';
import { TeamStatsTab } from './TeamStatsTab';
import { LineupTab } from './LineupTab';
import { StadiumTab } from './StadiumTab';
import { ScheduleStandingsTab } from './ScheduleStandingsTab';
import { FullStatsTab } from './FullStatsTab';
import { FinancesTab } from './FinancesTab';
import { TransactionsHistoryTab } from './TransactionsHistoryTab';

interface MiClubHubProps {
  currentClub: Club | null;
  clubs: Club[];
  matches: MatchResult[];
  players: Player[];
  transactions?: FinancialTransaction[];
  transfers?: TransferItem[];
  onAddPlayer: (player: Player) => void;
  onRemovePlayer: (playerId: string) => void;
  onToggleStarter: (playerId: string) => void;
  onUpdatePlayerValue?: (playerId: string, newValue: number) => void;
  onSetTransferPrice?: (player: Player, price: number) => void;
  onRemoveFromMarket?: (playerId: string) => void;
}

type MiClubTab = 'recientes' | 'stats-equipo' | 'alineaciones' | 'estadio' | 'calendario' | 'stats-completas' | 'financiero' | 'transacciones';

const TABS: { id: MiClubTab; label: string; icon: React.ElementType }[] = [
  { id: 'recientes', label: 'Juegos Recientes', icon: PlayCircle },
  { id: 'stats-equipo', label: 'Estadísticas de Equipo', icon: BarChart3 },
  { id: 'alineaciones', label: 'Alineaciones', icon: Users2 },
  { id: 'estadio', label: 'Estadio', icon: Landmark },
  { id: 'calendario', label: 'Calendario y Clasificación', icon: CalendarDays },
  { id: 'stats-completas', label: 'Estadísticas Completas', icon: BarChart4 },
  { id: 'financiero', label: 'Estado Financiero', icon: Wallet },
  { id: 'transacciones', label: 'Historial de Transacciones', icon: FileText }
];

export const MiClubHub: React.FC<MiClubHubProps> = ({
  currentClub,
  clubs,
  matches,
  players,
  transactions = [],
  transfers = [],
  onAddPlayer,
  onRemovePlayer,
  onToggleStarter,
  onUpdatePlayerValue,
  onSetTransferPrice,
  onRemoveFromMarket
}) => {
  const [activeMiClubTab, setActiveMiClubTab] = useState<MiClubTab>('recientes');
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

  const [sofifaClubSearch, setSofifaClubSearch] = useState<string>('');
  const [sofifaClubFilter, setSofifaClubFilter] = useState<string>('');
  const [sofifaSearchQuery, setSofifaSearchQuery] = useState<string>('');
  const [selectedSofifaPlayerId, setSelectedSofifaPlayerId] = useState<string>('');

  const sofifaClubNames = React.useMemo(
    () => Array.from(new Set(SOFIFA_PLAYERS.map(p => p.clubName).filter(Boolean))).sort() as string[],
    []
  );

  const filteredSofifaClubNames = React.useMemo(() => {
    const q = sofifaClubSearch.trim().toLowerCase();
    if (!q) return sofifaClubNames;
    return sofifaClubNames.filter(club => club.toLowerCase().includes(q));
  }, [sofifaClubNames, sofifaClubSearch]);

  const [name, setName] = useState('');
  const [position, setPosition] = useState<PlayerPosition>('DC');
  const [rating, setRating] = useState(85);
  const [cardType, setCardType] = useState<'Gold' | 'Special' | 'Icon' | 'Silver'>('Gold');
  const [value, setValue] = useState(25000000);
  const [photoUrl, setPhotoUrl] = useState('');
  const [pace, setPace] = useState(85);
  const [shooting, setShooting] = useState(82);
  const [passing, setPassing] = useState(80);
  const [dribbling, setDribbling] = useState(84);
  const [defending, setDefending] = useState(55);
  const [physical, setPhysical] = useState(78);

  const handleSelectSofifaPlayer = (playerId: string) => {
    setSelectedSofifaPlayerId(playerId);
    if (!playerId) return;

    const preset = SOFIFA_PLAYERS.find(p => p.id === playerId);
    if (preset) {
      setName(preset.name);
      setPosition(preset.position);
      setRating(preset.rating);
      setCardType(preset.cardType);
      setValue(preset.value);
      setPhotoUrl(preset.photoUrl);
      setPace(preset.stats.pace);
      setShooting(preset.stats.shooting);
      setPassing(preset.stats.passing);
      setDribbling(preset.stats.dribbling);
      setDefending(preset.stats.defending);
      setPhysical(preset.stats.physical);
    }
  };

  if (!currentClub) {
    return (
      <div className="p-8 text-center fc-card rounded-xl">
        <Shield className="w-12 h-12 text-[#02f59b] mx-auto mb-3" />
        <h2 className="font-display font-bold text-2xl text-white">Selecciona o Inscribe un Club</h2>
        <p className="text-xs text-slate-400 mt-1">Debes tener un club asignado para gestionar la plantilla.</p>
      </div>
    );
  }

  const clubPlayers = players.filter(p => p.clubId === currentClub.id);
  const starters = clubPlayers.filter(p => p.isStarter);
  const avgRating = starters.length > 0
    ? Math.round(starters.reduce((acc, p) => acc + p.rating, 0) / starters.length)
    : 0;

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      name,
      clubId: currentClub.id,
      position,
      rating: Number(rating),
      stats: {
        pace: Number(pace),
        shooting: Number(shooting),
        passing: Number(passing),
        dribbling: Number(dribbling),
        defending: Number(defending),
        physical: Number(physical)
      },
      cardType,
      value: Number(value),
      photoUrl: photoUrl || '',
      isStarter: clubPlayers.length < 11
    };

    onAddPlayer(newPlayer);
    setShowAddPlayerModal(false);
    setName('');
    setPhotoUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="fc-card p-6 rounded-2xl border-emerald-300 bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <ClubLogo src={currentClub.logoUrl} alt={currentClub.name} className="w-16 h-16 rounded-xl object-cover border-2 border-[#02f59b]" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-3xl text-white italic uppercase tracking-wider">
                {currentClub.name}
              </h1>
              <span className="bg-[#02f59b] text-black text-[10px] font-extrabold px-2 py-0.5 rounded font-mono uppercase">
                {currentClub.platform}
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-tech">
              Manager: <strong className="text-[#02f59b]">@{currentClub.manager}</strong> ({currentClub.gamertag}) • Estadio: {currentClub.stadium}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[10px] text-emerald-200 font-tech uppercase block">Media Plantilla</span>
            <span className="font-display font-black text-2xl text-[#02f59b]">{avgRating} OVR</span>
          </div>

          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[10px] text-emerald-200 font-tech uppercase block">Jugadores</span>
            <span className="font-display font-black text-2xl text-white">{clubPlayers.length}</span>
          </div>

          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[10px] text-emerald-200 font-tech uppercase block">Presupuesto</span>
            <span className="font-display font-black text-xl text-[#02f59b]">${(currentClub.budget / 1000000).toFixed(1)}M</span>
          </div>

          <button
            onClick={() => setShowAddPlayerModal(true)}
            className="fc-button-primary px-4 py-2.5 text-xs uppercase flex items-center gap-1.5 shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Añadir Jugador
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMiClubTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                activeMiClubTab === tab.id
                  ? 'bg-[#00ba68] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      {activeMiClubTab === 'recientes' && (
        <RecentGamesTab currentClub={currentClub} clubs={clubs} matches={matches} />
      )}
      {activeMiClubTab === 'stats-equipo' && (
        <TeamStatsTab currentClub={currentClub} players={players} />
      )}
      {activeMiClubTab === 'alineaciones' && (
        <LineupTab
          currentClub={currentClub}
          players={players}
          transfers={transfers}
          onRemovePlayer={onRemovePlayer}
          onToggleStarter={onToggleStarter}
          onUpdatePlayerValue={onUpdatePlayerValue}
          onSetTransferPrice={onSetTransferPrice}
          onRemoveFromMarket={onRemoveFromMarket}
        />
      )}
      {activeMiClubTab === 'estadio' && (
        <StadiumTab currentClub={currentClub} />
      )}
      {activeMiClubTab === 'calendario' && (
        <ScheduleStandingsTab currentClub={currentClub} clubs={clubs} matches={matches} />
      )}
      {activeMiClubTab === 'stats-completas' && (
        <FullStatsTab currentClub={currentClub} players={players} />
      )}
      {activeMiClubTab === 'financiero' && (
        <FinancesTab currentClub={currentClub} transactions={transactions} />
      )}
      {activeMiClubTab === 'transacciones' && (
        <TransactionsHistoryTab currentClub={currentClub} transactions={transactions} />
      )}

      {/* Modal: Crear / Editar Jugador */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-2xl w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <UserPlus className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Añadir Jugador
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">Registra o importa un jugador para {currentClub.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddPlayerModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlayer} className="space-y-4">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#02f59b] font-tech uppercase">
                    <Sparkles className="w-3.5 h-3.5" /> Búsqueda de Jugador Oficial
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-300 font-tech uppercase mb-1">
                    Buscar Club
                  </label>
                  <input
                    type="text"
                    value={sofifaClubSearch}
                    onChange={(e) => setSofifaClubSearch(e.target.value)}
                    placeholder="Ej: Real Madrid, Boca..."
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#02f59b] mb-2"
                  />
                  <select
                    value={sofifaClubFilter}
                    onChange={(e) => {
                      setSofifaClubFilter(e.target.value);
                      setSelectedSofifaPlayerId('');
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#02f59b] mb-2"
                  >
                    <option value="">-- Todos los Clubes ({filteredSofifaClubNames.length}) --</option>
                    {filteredSofifaClubNames.map(club => (
                      <option key={club} value={club}>{club}</option>
                    ))}
                  </select>

                  <label className="block text-[10px] text-slate-300 font-tech uppercase mb-1">
                    Buscar por Nombre
                  </label>
                  <input
                    type="text"
                    value={sofifaSearchQuery}
                    onChange={(e) => setSofifaSearchQuery(e.target.value)}
                    placeholder="Ej: Messi..."
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#02f59b] mb-2"
                  />
                  <select
                    value={selectedSofifaPlayerId}
                    onChange={(e) => handleSelectSofifaPlayer(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#02f59b]"
                  >
                    <option value="">
                      {sofifaClubFilter ? `-- Jugadores de ${sofifaClubFilter} --` : '-- Autocompletar con Jugador Oficial --'}
                    </option>
                    {SOFIFA_PLAYERS
                      .filter(p => {
                        if (sofifaClubFilter && p.clubName !== sofifaClubFilter) return false;
                        const q = sofifaSearchQuery.trim().toLowerCase();
                        if (!q) return true;
                        return p.name.toLowerCase().includes(q) || (p.clubName || '').toLowerCase().includes(q);
                      })
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 500)
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          ⭐ {p.name} ({p.rating} OVR) — €{(p.value / 1000000).toFixed(0)}M [{p.clubName || 'Libre'}]
                        </option>
                      ))}
                  </select>
                  <p className="text-[10px] text-slate-500 font-tech mt-1">
                    Elegí un club para ver automáticamente su plantel, o buscá por nombre entre los +18.000 jugadores oficiales.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">Nombre del Jugador *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Jude Bellingham"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00ba68]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">Posición *</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as PlayerPosition)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00ba68]"
                  >
                    <option value="POR">POR - Portero</option>
                    <option value="DFC">DFC - Defensa Central</option>
                    <option value="LI">LI - Lateral Izquierdo</option>
                    <option value="LD">LD - Lateral Derecho</option>
                    <option value="MCD">MCD - Medio Defensivo</option>
                    <option value="MC">MC - Mediocentro</option>
                    <option value="MCO">MCO - Medio Ofensivo</option>
                    <option value="EI">EI - Extremo Izquierdo</option>
                    <option value="ED">ED - Extremo Derecho</option>
                    <option value="DC">DC - Delantero Centro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">Valoración OVR</label>
                  <input
                    type="number"
                    min="50"
                    max="99"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00ba68]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">Valor (€)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00ba68]"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-tech font-bold text-slate-500 uppercase">Atributos del Jugador (Valores Oficiales)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Ritmo (PAC)</span>
                    <input type="number" value={pace} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Tiro (SHO)</span>
                    <input type="number" value={shooting} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Pase (PAS)</span>
                    <input type="number" value={passing} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Regate (DRI)</span>
                    <input type="number" value={dribbling} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Defensa (DEF)</span>
                    <input type="number" value={defending} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Físico (PHY)</span>
                    <input type="number" value={physical} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPlayerModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition"
                >
                  Guardar Jugador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add src/components/miclub/MiClubHub.tsx
git commit -m "feat: agregar MiClubHub con banner, modal Anadir Jugador y barra de 8 pestanas"
```

---

## Task 11: Wire `MiClubHub` into `App.tsx` and remove `SquadBuilder`

**Files:**
- Modify: `src/App.tsx:10` (import), `src/App.tsx:1153-1166` (usage)
- Delete: `src/components/SquadBuilder.tsx`

- [ ] **Step 1: Swap the import**

In `src/App.tsx`, find:

```ts
import { SquadBuilder } from './components/SquadBuilder';
```

Replace with:

```ts
import { MiClubHub } from './components/miclub/MiClubHub';
```

- [ ] **Step 2: Swap the usage**

Find the block (around line 1153):

```tsx
        {activeTab === 'plantilla' && (
          <SquadBuilder
            currentClub={currentClub}
            players={players}
            transactions={transactions}
            transfers={transfers}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            onToggleStarter={handleToggleStarter}
            onUpdatePlayerValue={handleUpdatePlayerValue}
            onSetTransferPrice={handleSetTransferPrice}
            onRemoveFromMarket={handleRemoveFromMarket}
          />
        )}
```

Replace with:

```tsx
        {activeTab === 'plantilla' && (
          <MiClubHub
            currentClub={currentClub}
            clubs={clubs}
            matches={matches}
            players={players}
            transactions={transactions}
            transfers={transfers}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            onToggleStarter={handleToggleStarter}
            onUpdatePlayerValue={handleUpdatePlayerValue}
            onSetTransferPrice={handleSetTransferPrice}
            onRemoveFromMarket={handleRemoveFromMarket}
          />
        )}
```

(`clubs` and `matches` are already in scope in `App.tsx` — they're the same variables passed a few lines above to `CompetitionsHub`.)

- [ ] **Step 3: Delete the old file**

```bash
rm src/components/SquadBuilder.tsx
```

- [ ] **Step 4: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0). If it fails because something else in the codebase still imports `SquadBuilder`, grep for it first:

Run: `grep -rn "SquadBuilder" src`
Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git rm src/components/SquadBuilder.tsx
git commit -m "refactor: reemplazar SquadBuilder por MiClubHub en Mi Club"
```

---

## Task 12: Admin can edit stadium fields

**Files:**
- Modify: `src/components/AdminPanel.tsx:288-293` (state), `:398-419` (start/save handlers), `:848-855` (JSX form)

- [ ] **Step 1: Add state for the 3 new fields**

In `src/components/AdminPanel.tsx`, find the existing edit-state declarations (around line 288):

```ts
  const [editBudget, setEditBudget] = useState<number>(0);
  const [editManager, setEditManager] = useState<string>('');
```

Right after `editLogoUrl` (around line 293), add:

```ts
  const [editStadium, setEditStadium] = useState<string>('');
  const [editStadiumCity, setEditStadiumCity] = useState<string>('');
  const [editStadiumCapacity, setEditStadiumCapacity] = useState<number>(0);
  const [editStadiumPhotoUrl, setEditStadiumPhotoUrl] = useState<string>('');
```

- [ ] **Step 2: Populate them in `startEditClub` and include them in `saveClubEdit`**

Find:

```ts
  const startEditClub = (club: Club) => {
    setEditingClubId(club.id);
    setEditBudget(club.budget);
    setEditManager(club.manager);
    setEditName(club.name);
    setEditGamertag(club.gamertag);
    setEditDivision(club.division || '1ra División');
    setEditLogoUrl(club.logoUrl);
  };

  const saveClubEdit = (club: Club) => {
    onUpdateClub({
      ...club,
      name: editName,
      manager: editManager,
      gamertag: editGamertag,
      budget: editBudget,
      division: editDivision,
      logoUrl: editLogoUrl || club.logoUrl
    });
    setEditingClubId(null);
  };
```

Replace with:

```ts
  const startEditClub = (club: Club) => {
    setEditingClubId(club.id);
    setEditBudget(club.budget);
    setEditManager(club.manager);
    setEditName(club.name);
    setEditGamertag(club.gamertag);
    setEditDivision(club.division || '1ra División');
    setEditLogoUrl(club.logoUrl);
    setEditStadium(club.stadium || '');
    setEditStadiumCity(club.stadiumCity || '');
    setEditStadiumCapacity(club.stadiumCapacity || 0);
    setEditStadiumPhotoUrl(club.stadiumPhotoUrl || '');
  };

  const saveClubEdit = (club: Club) => {
    onUpdateClub({
      ...club,
      name: editName,
      manager: editManager,
      gamertag: editGamertag,
      budget: editBudget,
      division: editDivision,
      logoUrl: editLogoUrl || club.logoUrl,
      stadium: editStadium || club.stadium,
      stadiumCity: editStadiumCity || undefined,
      stadiumCapacity: editStadiumCapacity || undefined,
      stadiumPhotoUrl: editStadiumPhotoUrl || undefined
    });
    setEditingClubId(null);
  };
```

- [ ] **Step 3: Add the 4 inputs to the edit form JSX**

Find (around line 848):

```tsx
                          <input
                            type="text"
                            value={editLogoUrl}
                            onChange={(e) => setEditLogoUrl(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-[10px] text-slate-600 font-mono"
                            placeholder="URL de imagen (https://...)"
                          />
                        </div>
                      ) : (
```

Replace with:

```tsx
                          <input
                            type="text"
                            value={editLogoUrl}
                            onChange={(e) => setEditLogoUrl(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-[10px] text-slate-600 font-mono"
                            placeholder="URL de imagen (https://...)"
                          />
                          <div className="pt-1.5 mt-1.5 border-t border-slate-200 space-y-1">
                            <span className="text-[9px] font-tech font-bold text-slate-400 uppercase block">Estadio</span>
                            <input
                              type="text"
                              value={editStadium}
                              onChange={(e) => setEditStadium(e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-700"
                              placeholder="Nombre del estadio"
                            />
                            <div className="flex gap-1">
                              <input
                                type="text"
                                value={editStadiumCity}
                                onChange={(e) => setEditStadiumCity(e.target.value)}
                                className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-700"
                                placeholder="Ciudad"
                              />
                              <input
                                type="number"
                                value={editStadiumCapacity || ''}
                                onChange={(e) => setEditStadiumCapacity(Number(e.target.value))}
                                className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-700 font-mono"
                                placeholder="Capacidad"
                              />
                            </div>
                            <input
                              type="text"
                              value={editStadiumPhotoUrl}
                              onChange={(e) => setEditStadiumPhotoUrl(e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-[10px] text-slate-600 font-mono"
                              placeholder="URL de foto del estadio (https://...)"
                            />
                          </div>
                        </div>
                      ) : (
```

- [ ] **Step 4: Verify it compiles**

Run: `npm run lint`
Expected: no output (exit code 0).

- [ ] **Step 5: Commit**

```bash
git add src/components/AdminPanel.tsx
git commit -m "feat: agregar edicion de datos de estadio (ciudad, capacidad, foto) en AdminPanel"
```

---

## Task 13: Final verification and push

**Files:** none (verification only)

- [ ] **Step 1: Full lint pass**

Run: `npm run lint`
Expected: no output (exit code 0).

- [ ] **Step 2: Full production build**

Run: `npm run build`
Expected: ends with `✓ built in ...s` and `dist\server.cjs` written, no errors (the existing "chunks are larger than 500 kB" warning is pre-existing and unrelated to this change).

- [ ] **Step 3: Manual smoke test**

Since this project has no automated UI tests, run the dev server and click through this checklist before declaring the feature done:

Run: `npm run dev` (leave it running, open the printed local URL in a browser)

Checklist:
- [ ] Open "Mi Club" — the tactical pitch is **not** visible by default; instead there's a banner + 8 pills (Juegos Recientes, Estadísticas de Equipo, Alineaciones, Estadio, Calendario y Clasificación, Estadísticas Completas, Estado Financiero, Historial de Transacciones).
- [ ] Click "Alineaciones" — the tactical pitch and formation selector appear, same as before; clicking a player still toggles titular/banca.
- [ ] Click "Juegos Recientes" — shows recent confirmed matches for the current club, or the empty state if none.
- [ ] Click "Estadísticas de Equipo" — shows PJ/PG/PE/PP/GF/GC/DG/Pts cards and the form streak.
- [ ] Click "Estadio" — shows the stadium name (and city/capacity/photo if an Admin already set them).
- [ ] Click "Calendario y Clasificación" — shows the club's fixture list and the standings table for its division.
- [ ] Click "Estadísticas Completas" — shows a table of the club's players with goals/assists/cards.
- [ ] Click "Estado Financiero" — shows the same 3 income/expense/balance cards as before.
- [ ] Click "Historial de Transacciones" — shows the same transactions table as before.
- [ ] "Añadir Jugador" button in the top banner still opens the modal and creates a player correctly regardless of which tab is active.
- [ ] As Admin, open Panel de Administración → Clubes, click "Editar Datos" on a club, confirm the new Estadio/Ciudad/Capacidad/Foto inputs appear and save correctly (check the club's "Estadio" tab afterward reflects the change).

Stop the dev server (Ctrl+C) once the checklist passes.

- [ ] **Step 4: Push**

```bash
git push origin feature/backend-accounts-migration
```

Expected: push succeeds, report the final commit hash to the user.
