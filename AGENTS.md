# FIFAMANIAKOS FC 27 — Instrucciones para agentes de IA

App de una liga online de FIFA: clubes, fixture, actas de partido, fichajes,
finanzas, foro y patrocinadores. React 19 + TypeScript + Vite, con Supabase
(Postgres + Realtime + RLS) como backend. Estilos con Tailwind 4.

---

## 1. Dónde trabajar (lo más importante)

**Trabajá EXCLUSIVAMENTE en el worktree:**

```
c:\Users\HP\.gemini\antigravity\scratch\fifamaniakos---liga-online-fc-27\.worktrees\backend-accounts-migration
```

**Rama:** `feature/backend-accounts-migration`

**NUNCA toques ni corras nada desde la carpeta principal del proyecto** (la ruta
sin `.worktrees\...`). Es una copia vieja, anterior a la migración a Supabase.
Si corrés `npm run dev` desde ahí por error, la app se ve vieja y rota aunque el
código nuevo esté perfecto, y vas a perder horas debuggeando un fantasma.

---

## 2. Dónde pushear

**Remoto:** `origin` → `https://github.com/fifamaniakos/fifamaniakos.git`

```bash
git push origin feature/backend-accounts-migration
```

**El push no es opcional.** Cuando termines cualquier cambio (código y/o SQL),
hacé commit **y push** a esa rama antes de dar nada por terminado. Sin el push,
el cambio queda solo en la copia local: no se ve en GitHub ni en el sitio
desplegado. Decí explícitamente que pusheaste y pasá el hash del commit.

No pushees a `main` ni abras PR salvo que te lo pidan.

---

## 3. Antes de empezar cualquier tarea

1. Corré `git log --oneline -15` para ver qué se hizo antes. Muchas cosas que
   parecen faltar ya están implementadas.
2. Si la tarea toca la base de datos, **preguntá si todas las migraciones ya se
   corrieron** antes de concluir que "algo no funciona en la base".

---

## 4. Base de datos (Supabase)

**Proyecto:** `hqybpfppqimssindwgns`

Las migraciones son archivos SQL en `supabase/migrations/`, numerados. **Se
corren a mano en el SQL Editor de Supabase** — no hay acceso por MCP ni por CLI
desde el entorno de desarrollo. Si escribís una migración nueva, pegá el SQL en
el chat para que el humano lo ejecute.

**Patrón de tablas:** todas tienen la misma forma `key text primary key, data
jsonb, updated_at`. El objeto TypeScript entero vive en `data`. Las columnas
extra son `generated always as (data->>'campo') stored` cuando hacen falta para
índices o policies.

**Helpers de RLS** (definidos en `003_rls_policies.sql`), usalos siempre en vez
de reinventarlos:

- `public.is_admin()`
- `public.current_manager_club_id()`

**Estado en el cliente:** todo pasa por el hook `useSupabaseTable<T>(tabla,
datosIniciales, getKey)`, que sincroniza con Postgres + Realtime. Leelo antes de
agregar estado nuevo; hay ~14 usos en `src/App.tsx` como referencia.

---

## 5. Reglas de seguridad que no se negocian

Esta app maneja el dinero de la liga (presupuestos, fichajes, premios). Ya se
encontró y cerró un agujero por el que un manager podía acreditarse millones.

- **Cualquier operación que mueva dinero va en una RPC de Postgres**
  (`security definer` + `set search_path = public`), nunca escribiendo
  presupuestos desde el cliente. Mirá `011_financial_transfer_rpc.sql` y
  `013_sponsor_settlement_rpc.sql` como patrón.
- **Las RPC reciben identificadores, no montos.** Si el cliente puede mandar
  cuánto se paga, alguien con la consola abierta va a elegir cuánto cobrar.
- **Una regla que vive solo en la pantalla no es un permiso.** Si el botón está
  deshabilitado pero la policy permite la escritura, la regla no existe.
- **No reviertas código sin entender por qué existe.** Si hay un comentario
  explicando una restricción (ej: "esto evita 403 de RLS", "sin esto un manager
  podía..."), leelo antes de tocarlo. Casi nunca el problema es la restricción.
- **No hagas commits sin avisar en cambios que tocan permisos, RLS, o quién
  puede hacer qué.** Explicá el cambio antes de aplicarlo.

---

## 6. Verificación antes de decir "listo"

```bash
npm run lint    # tsc --noEmit
npm test        # vitest run
npm run build   # solo si el cambio es grande
```

Los tres tienen que pasar. **Reportá la salida real**, no digas "debería
funcionar". Si algo falla, decilo con el output.

---

## 7. Levantar el servidor

```bash
npm run dev     # tsx server.ts → http://localhost:3000
```

**Antes de levantarlo, revisá si ya hay algo corriendo en el puerto 3000** y
confirmá que sea del worktree correcto antes de matarlo o reemplazarlo.

---

## 8. Convenciones de código

- **Comentarios en español, y explican el _porqué_, no el _qué_.** Un comentario
  que dice "suma los goles" es ruido; uno que dice "APPEARANCE marca que el
  jugador estuvo en la alineación: es lo único que permite contar PJ" es útil.
  Referencia de estilo: `src/utils/competitionStats.ts`, `src/hooks/useSupabaseTable.ts`.
- **Nada de `any`.** `npm run lint` es `tsc --noEmit` y tiene que quedar limpio.
- **Textos de UI en español.** Estilo visual: clases `fc-card`, verde `#02f59b`,
  `font-display`, iconos de `lucide-react`.
- **Lógica de negocio pura y testeada, aparte de React.** Los cálculos van a
  `src/utils/` sin I/O ni JSX, para poder testearlos con Vitest.
  Ejemplo: `src/utils/sponsorEngine.ts` (46 tests).

---

## 9. Mapa rápido del código

| Ruta | Qué es |
|---|---|
| `src/App.tsx` | Estado global, wiring de todas las tablas, handlers |
| `src/types.ts` | Todos los tipos del dominio |
| `src/utils/` | Lógica pura: standings, fixture, brackets, patrocinadores |
| `src/components/miclub/` | Pestañas de "Mi Club" |
| `src/components/competitions/` | Tablas, fixture, brackets, estadísticas |
| `src/components/AdminPanel.tsx` | Panel de admin (~2200 líneas, tabs internas) |
| `src/data/` | Datos semilla (clubes, jugadores SOFIFA, patrocinadores) |
| `supabase/migrations/` | Migraciones SQL numeradas |
| `docs/superpowers/specs/` | Especificaciones de diseño de features |
| `docs/superpowers/plans/` | Planes de implementación |

---

## 10. Estado pendiente conocido

- Las migraciones **`012_sponsors.sql`** y **`013_sponsor_settlement_rpc.sql`**
  (sistema de patrocinadores) están escritas y commiteadas pero **todavía no se
  corrieron** en Supabase. Hasta que se corran, la pestaña "Patrocinador" y la
  sección de patrocinadores del Panel no funcionan.
- Las competiciones **Mundial de Clubes**, **Supercopa de Europa** y **Supercopa
  de Liga** tienen cláusulas de patrocinio cargadas pero **no existen** como
  competiciones en la app, así que esos objetivos nunca se cumplen.
- `MatchResult` **no tiene `seasonNumber`**: la app no conserva historial por
  temporada. Cualquier feature que necesite "lo que pasó la temporada pasada"
  requiere agregar eso primero.
