# Cuadro Visual de Eliminatorias (Copas UEFA) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat "bombos" table in the Clasificación tab of the 3 UEFA cups with a read-only visual knockout bracket (Cuartos → Semis → Final) that auto-fills from the 1ra División standings and highlights confirmed winners as they advance.

**Architecture:** A new pure function `getKnockoutBracketData` in `src/utils/bracketGenerator.ts` derives a display-ready bracket structure (4 quarterfinal slots, 2 semifinal slots, 1 final slot — each with home/away club + winner flag) from existing seeding (`getSeededClubsForCompetition`) and existing knockout matches. A new presentational component `src/components/competitions/KnockoutBracket.tsx` renders that structure: a symmetric two-sided bracket on desktop, stacked rounds on mobile. `StandingsTable.tsx` swaps its old `BracketSeeding` table for this component when the competition is a UEFA cup.

**Tech Stack:** React 19 + TypeScript, Tailwind CSS v4 (utility classes, no new dependencies), lucide-react icons. No test framework is configured in this project (`npm run lint` runs `tsc --noEmit`) — verification is via type-checking plus manual browser testing with the `/run` skill, as called out in the spec.

**Spec:** `docs/superpowers/specs/2026-07-30-knockout-bracket-visual-design.md`

---

### Task 1: Add `getKnockoutBracketData` to `bracketGenerator.ts`

**Files:**
- Modify: `src/utils/bracketGenerator.ts`
- Test: none (no test framework in this project) — verified via `npm run lint` (Task 1 Step 3) and a throwaway manual check script (Task 1 Step 2) that is deleted after use.

- [ ] **Step 1: Add the types and function**

Append this to the end of `src/utils/bracketGenerator.ts` (after `getPositionBand`, keep `generatePendingKnockoutMatches` where it is):

```typescript
export interface BracketSlotTeam {
  club: Club | null;
  isWinner: boolean;
}

export interface BracketMatchSlot {
  home: BracketSlotTeam;
  away: BracketSlotTeam;
  status: 'PENDIENTE' | 'CONFIRMADO';
}

export interface KnockoutBracketData {
  quarterfinals: [BracketMatchSlot, BracketMatchSlot, BracketMatchSlot, BracketMatchSlot];
  semifinals: [BracketMatchSlot, BracketMatchSlot];
  final: BracketMatchSlot;
}

function slotFromMatch(
  clubs: Club[],
  match: MatchResult | undefined,
  fallbackHomeId: string | undefined,
  fallbackAwayId: string | undefined
): BracketMatchSlot {
  const homeId = match?.homeClubId ?? fallbackHomeId;
  const awayId = match?.awayClubId ?? fallbackAwayId;
  const homeClub = homeId ? clubs.find(c => c.id === homeId) ?? null : null;
  const awayClub = awayId ? clubs.find(c => c.id === awayId) ?? null : null;
  const isConfirmed = match?.status === 'CONFIRMADO';
  const winnerId = isConfirmed && match ? getMatchWinnerClubId(match) : null;

  return {
    home: { club: homeClub, isWinner: isConfirmed && winnerId === homeId },
    away: { club: awayClub, isWinner: isConfirmed && winnerId === awayId },
    status: isConfirmed ? 'CONFIRMADO' : 'PENDIENTE'
  };
}

/**
 * Builds a display-ready bracket (Cuartos -> Semifinal -> Final) for one of the
 * three UEFA cups, seeded straight from the 1ra División standings. Falls back to
 * the seeded clubs (no match generated yet) for rounds that don't exist as
 * MatchResult rows yet. Returns null if fewer than 8 clubs are seeded.
 */
export function getKnockoutBracketData(
  clubs: Club[],
  matches: MatchResult[],
  competition: string
): KnockoutBracketData | null {
  const seeded = getSeededClubsForCompetition(clubs, competition);
  if (seeded.length < 8) return null;

  const competitionMatches = matches.filter(m => m.competition === competition);
  const quarterfinalMatches = competitionMatches
    .filter(m => m.phase === 'CUARTOS')
    .sort((a, b) => a.matchday - b.matchday);
  const semifinalMatches = competitionMatches
    .filter(m => m.phase === 'SEMIFINAL')
    .sort((a, b) => a.matchday - b.matchday);
  const finalMatch = competitionMatches.find(m => m.phase === 'FINAL');

  const quarterfinals = [0, 1, 2, 3].map(i =>
    slotFromMatch(clubs, quarterfinalMatches[i], seeded[i]?.club.id, seeded[7 - i]?.club.id)
  ) as KnockoutBracketData['quarterfinals'];

  const qfWinnerId = (i: number): string | undefined => {
    const qf = quarterfinalMatches[i];
    return qf && qf.status === 'CONFIRMADO' ? getMatchWinnerClubId(qf) : undefined;
  };

  const semifinals: KnockoutBracketData['semifinals'] = [
    slotFromMatch(clubs, semifinalMatches[0], qfWinnerId(0), qfWinnerId(3)),
    slotFromMatch(clubs, semifinalMatches[1], qfWinnerId(1), qfWinnerId(2))
  ];

  const sfWinnerId = (i: number): string | undefined => {
    const sf = semifinalMatches[i];
    return sf && sf.status === 'CONFIRMADO' ? getMatchWinnerClubId(sf) : undefined;
  };

  const final = slotFromMatch(clubs, finalMatch, sfWinnerId(0), sfWinnerId(1));

  return { quarterfinals, semifinals, final };
}
```

This relies on the pairing that `buildRoundMatches` already produces: quarterfinal index `0` plays index `3`'s winner in semifinal `0` (home vs away = clubIds[0] vs clubIds[3]), and quarterfinal `1` plays `2` in semifinal `1`. That's why `qfWinnerId(0)`/`qfWinnerId(3)` feed `semifinals[0]`, and `qfWinnerId(1)`/`qfWinnerId(2)` feed `semifinals[1]`.

- [ ] **Step 2: Manually verify the function with a throwaway script**

Create a temporary file `scratch-verify.ts` in the project root:

```typescript
import { getKnockoutBracketData } from './src/utils/bracketGenerator';
import { Club, MatchResult } from './src/types';

const clubs: Club[] = Array.from({ length: 8 }, (_, i) => ({
  id: `c${i + 1}`,
  name: `Club ${i + 1}`,
  shortName: `C${i + 1}`,
  manager: 'M',
  gamertag: 'g',
  platform: 'PC',
  logoUrl: '',
  budget: 0,
  division: '1ra División',
  stadium: 's',
  played: 1,
  won: 1,
  drawn: 0,
  lost: 0,
  goalsFor: 8 - i,
  goalsAgainst: 0,
  points: (8 - i) * 3,
  form: []
}));

const matches: MatchResult[] = [
  { id: 'qf0', matchday: 1000, competition: 'UEFA Champions League', phase: 'CUARTOS', homeClubId: 'c1', awayClubId: 'c8', homeGoals: 2, awayGoals: 0, homeScorers: '', awayScorers: '', status: 'CONFIRMADO', createdAt: '' }
];

const data = getKnockoutBracketData(clubs, matches, 'UEFA Champions League');
console.log(JSON.stringify(data, null, 2));
```

Run: `npx tsx scratch-verify.ts`

Expected: prints a JSON object where `quarterfinals[0].home.club.id === 'c1'`, `quarterfinals[0].home.isWinner === true`, `quarterfinals[0].away.isWinner === false`, `quarterfinals[1..3]` have real clubs from the fallback seeds (`c2`..`c7`) with `status: "PENDIENTE"`, and `semifinals[0].home.club` is `null` (quarterfinal 3 hasn't been played, so its winner is unknown).

Delete `scratch-verify.ts` after confirming the output (`rm scratch-verify.ts` / `Remove-Item scratch-verify.ts`) — it's a manual check, not part of the codebase.

- [ ] **Step 3: Type-check**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/utils/bracketGenerator.ts
git commit -m "feat: add getKnockoutBracketData for cup bracket display"
```

---

### Task 2: Create `KnockoutBracket.tsx`

**Files:**
- Create: `src/components/competitions/KnockoutBracket.tsx`
- Test: none (presentational component, verified visually in Task 4)

- [ ] **Step 1: Write the component**

Create `src/components/competitions/KnockoutBracket.tsx`:

```tsx
import React from 'react';
import { Trophy } from 'lucide-react';
import { Club, MatchResult } from '../../types';
import { BracketMatchSlot, BracketSlotTeam, getKnockoutBracketData } from '../../utils/bracketGenerator';

interface KnockoutBracketProps {
  clubs: Club[];
  matches: MatchResult[];
  competition: string;
}

const TeamRow: React.FC<{ team: BracketSlotTeam; align?: 'left' | 'right' }> = ({ team, align = 'left' }) => (
  <div
    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-tech font-bold ${
      team.isWinner ? 'bg-white/15 border-[#38BDF8]/60 text-white' : 'bg-white/5 border-white/10 text-slate-300'
    } ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}
  >
    {team.club ? (
      <>
        <img src={team.club.logoUrl} alt={team.club.name} className="w-5 h-5 rounded object-cover shrink-0" />
        <span className="truncate max-w-[110px]">{team.club.name}</span>
      </>
    ) : (
      <span className="text-slate-500">—</span>
    )}
  </div>
);

const MatchCard: React.FC<{ slot: BracketMatchSlot; align?: 'left' | 'right' }> = ({ slot, align = 'left' }) => (
  <div className="flex flex-col gap-1">
    <TeamRow team={slot.home} align={align} />
    <TeamRow team={slot.away} align={align} />
  </div>
);

const RoundLabel: React.FC<{ children: React.ReactNode; gold?: boolean }> = ({ children, gold }) => (
  <div className={`text-[10px] font-tech uppercase tracking-wider text-center ${gold ? 'text-amber-400' : 'text-indigo-300/80'}`}>
    {children}
  </div>
);

export const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ clubs, matches, competition }) => {
  const data = getKnockoutBracketData(clubs, matches, competition);

  if (!data) {
    return (
      <div className="fc-card p-10 text-center border-dashed border-slate-300 bg-white text-slate-500 text-sm font-tech">
        Todavía no hay 8 clubes clasificados en 1ra División para armar el cuadro de {competition}.
      </div>
    );
  }

  const { quarterfinals, semifinals, final } = data;

  return (
    <div className="fc-card rounded-2xl overflow-hidden border-slate-800 shadow-xl bg-gradient-to-br from-[#0a1a3f] to-[#142a5c] p-5">
      <div className="hidden md:grid grid-cols-5 gap-4 items-center">
        <div className="space-y-10">
          <RoundLabel>Cuartos</RoundLabel>
          <MatchCard slot={quarterfinals[0]} />
          <MatchCard slot={quarterfinals[3]} />
        </div>
        <div className="space-y-10">
          <RoundLabel>Semis</RoundLabel>
          <div className="h-16" />
          <MatchCard slot={semifinals[0]} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <RoundLabel gold>Final</RoundLabel>
          <Trophy className="w-9 h-9 text-amber-400" />
          <MatchCard slot={final} />
        </div>
        <div className="space-y-10">
          <RoundLabel>Semis</RoundLabel>
          <div className="h-16" />
          <MatchCard slot={semifinals[1]} align="right" />
        </div>
        <div className="space-y-10">
          <RoundLabel>Cuartos</RoundLabel>
          <MatchCard slot={quarterfinals[1]} align="right" />
          <MatchCard slot={quarterfinals[2]} align="right" />
        </div>
      </div>

      <div className="md:hidden space-y-5">
        <div>
          <RoundLabel>Cuartos de Final</RoundLabel>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {quarterfinals.map((slot, i) => (
              <MatchCard key={i} slot={slot} />
            ))}
          </div>
        </div>
        <div>
          <RoundLabel>Semifinal</RoundLabel>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {semifinals.map((slot, i) => (
              <MatchCard key={i} slot={slot} />
            ))}
          </div>
        </div>
        <div>
          <RoundLabel gold>Final</RoundLabel>
          <div className="mt-2">
            <MatchCard slot={final} />
          </div>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Type-check**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/competitions/KnockoutBracket.tsx
git commit -m "feat: add KnockoutBracket visual component"
```

---

### Task 3: Wire `KnockoutBracket` into `StandingsTable.tsx`

**Files:**
- Modify: `src/components/competitions/StandingsTable.tsx`

- [ ] **Step 1: Swap the import**

In `src/components/competitions/StandingsTable.tsx:1-5`, replace:

```typescript
import React from 'react';
import { Club, MatchResult } from '../../types';
import { computeDomesticQualificationZones } from '../../utils/competitionStats';
import { getSeededClubsForCompetition } from '../../utils/bracketGenerator';
import { Star, Globe, Shield } from 'lucide-react';
```

with:

```typescript
import React from 'react';
import { Club, MatchResult } from '../../types';
import { computeDomesticQualificationZones } from '../../utils/competitionStats';
import { Star, Globe, Shield } from 'lucide-react';
import { KnockoutBracket } from './KnockoutBracket';
```

- [ ] **Step 2: Pass `matches` through and render the bracket**

Replace the top-level `StandingsTable` component (`StandingsTable.tsx:16-30`):

```typescript
export const StandingsTable: React.FC<StandingsTableProps> = ({ clubs, competition }) => {
  if (DOMESTIC_COMPETITIONS.includes(competition)) {
    return <DomesticStandings clubs={clubs} competition={competition} />;
  }

  if (BRACKET_COMPETITIONS.includes(competition)) {
    return <BracketSeeding clubs={clubs} competition={competition} />;
  }

  return (
    <div className="fc-card p-10 text-center border-dashed border-slate-300 bg-white text-slate-500 text-sm font-tech">
      No hay clasificación disponible para {competition}.
    </div>
  );
};
```

with:

```typescript
export const StandingsTable: React.FC<StandingsTableProps> = ({ clubs, matches, competition }) => {
  if (DOMESTIC_COMPETITIONS.includes(competition)) {
    return <DomesticStandings clubs={clubs} competition={competition} />;
  }

  if (BRACKET_COMPETITIONS.includes(competition)) {
    return <KnockoutBracket clubs={clubs} matches={matches} competition={competition} />;
  }

  return (
    <div className="fc-card p-10 text-center border-dashed border-slate-300 bg-white text-slate-500 text-sm font-tech">
      No hay clasificación disponible para {competition}.
    </div>
  );
};
```

- [ ] **Step 3: Delete the old `BracketSeeding` component**

Delete the entire `BracketSeeding` component at the bottom of `src/components/competitions/StandingsTable.tsx` (from `const BracketSeeding: React.FC<{ clubs: Club[]; competition: string }> = ({ clubs, competition }) => {` through its closing `};`) — it's now dead code, fully replaced by `KnockoutBracket`.

- [ ] **Step 4: Type-check**

Run: `npm run lint`
Expected: no errors. In particular, confirm there's no "unused import" style error for `Star`/`Globe`/`Shield` (still used in `DomesticStandings`) and no leftover reference to `getSeededClubsForCompetition` or `BracketSeeding`.

- [ ] **Step 5: Commit**

```bash
git add src/components/competitions/StandingsTable.tsx
git commit -m "feat: render KnockoutBracket in place of bombos table for UEFA cups"
```

---

### Task 4: Manual verification in the browser

**Files:** none (verification only)

- [ ] **Step 1: Launch the app**

Use the `/run` skill (or `npm run dev`) to start the app and open it in a browser.

- [ ] **Step 2: Verify the empty/seeded state**

Navigate to Competiciones → UEFA Champions League → pestaña Clasificación. With fewer than 8 clubs in 1ra División: confirm the "Todavía no hay 8 clubes clasificados..." message shows. With 8+ clubs and no matches confirmed yet: confirm the bracket renders with all 8 seeded clubs placed (Cuartos filled, Semis and Final showing "—" placeholders).

- [ ] **Step 3: Verify winner progression**

Using the pestaña Fixture, confirm a result for one Cuartos match (mark it `CONFIRMADO` with a winner). Go back to Clasificación and confirm: the winning club is highlighted (lighter background) in that quarterfinal slot, and once all 4 Cuartos are confirmed, the Semifinal slots populate with the correct winners (matching the pairing described in Task 1: QF0+QF3 winners → SF0, QF1+QF2 winners → SF1).

- [ ] **Step 4: Verify responsiveness**

Resize the browser to a mobile width (or use dev tools device emulation) and confirm the bracket switches to the stacked single-column layout (Cuartos → Semis → Final) without horizontal scrolling.

- [ ] **Step 5: Verify the other two cups and domestic leagues are unaffected**

Check UEFA Europa League and UEFA Conference League render their own brackets (seeded from positions 9-16 and 17-24 respectively). Check 1ra División and 2da División Clasificación tabs still show the original standings table, unchanged.

- [ ] **Step 6: Report results to the user**

Summarize what was checked and any visual issues found. If everything matches the spec, no further action needed — this plan doesn't require a commit for this task (verification only).

---

## Self-Review Notes

- **Spec coverage:** "reemplaza tabla de bombos con cuadro visual" → Task 3. "autocompletado desde 1ra División" → Task 1 (`getSeededClubsForCompetition` reuse). "resalta ganador y avanza" → Task 1 (`isWinner`) + Task 2 (highlight styling). "responsive stack en mobile" → Task 2 (`md:hidden` block). "mensaje si <8 clubes" → Task 2 Step 1 fallback branch. "Fixture sin cambios" → no task touches `FixtureJornadaList`/`FixtureJornadaDetail`. "sin tests automatizados, verificación manual" → Task 4 + explicit notes in Task 1/2 Files sections.
- **Type consistency:** `BracketMatchSlot`, `BracketSlotTeam`, `KnockoutBracketData`, `getKnockoutBracketData` are named identically across Task 1 (definition) and Task 2 (import/usage). `StandingsTableProps` already declares `matches: MatchResult[]` (unchanged in this plan) — Task 3 just starts destructuring it.
