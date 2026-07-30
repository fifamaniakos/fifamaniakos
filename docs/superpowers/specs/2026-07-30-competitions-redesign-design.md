# Rediseño de Competiciones — Design Spec

## Contexto

Hoy toda la sección "Competiciones" vive en un único componente, `src/components/LeagueTable.tsx` (~1238 líneas), que renderiza una barra superior de selección de competición (1ra División, 2da División, Champions League, Europa League, Copa del Rey, Todas) y, debajo, pestañas genéricas: Clasificación/Tabla, Fixture & Jornadas, Goleadores, Asistencias, Tarjetas, Partidos. La pestaña de fixture muestra **todos los partidos de todas las jornadas en una sola lista continua**.

Las copas europeas (Champions/Europa League) tienen además un hub aparte, `src/components/EuropeanCupsHub.tsx`, con su propio diseño: fase de grupos con una tabla de 36 clubes **hardcodeada** (datos de ejemplo, no conectados a resultados reales), más sub-pestañas "Cuadro" (llave eliminatoria) y "Reglamento".

## Objetivo

Rediseñar la sección de Competiciones para que:
1. Cada competición (1ra División, 2da División, Champions League, Europa League, Copa del Rey) tenga su propio espacio con: Clasificación, Fixture, Goleadores, Asistencias, Tarjetas — el mismo patrón de pestañas para las cinco.
2. El fixture ya no liste todas las jornadas juntas. Cada jornada se presenta como un "tema" (al estilo de un post de foro): una tarjeta con el número de jornada, fecha, y conteo de partidos/confirmados. Al hacer clic se abre el detalle con todos los resultados de esa jornada.

## Arquitectura

Nueva carpeta `src/components/competitions/`:

### `CompetitionsHub.tsx` (nuevo)
Pantalla de entrada a "Competiciones". Sustituye el render de `<LeagueTable />` en `App.tsx`.
- Grilla de 5 tarjetas, una por competición (1ra División, 2da División, Champions League, Europa League, Copa del Rey), cada una con ícono/color distintivo (reutilizando los mismos colores que hoy tiene la barra superior).
- Al hacer clic en una tarjeta, se navega a `CompetitionDetail` para esa competición (estado local `selectedCompetition`, o se reutiliza el `selectedCompetition`/`onSelectCompetition` que ya recibe `LeagueTable` desde `App.tsx`).
- Sin pestaña "Todas": cada competición se ve por separado. (Si en el futuro se quiere una vista combinada, queda fuera de este alcance.)

### `CompetitionDetail.tsx` (nuevo)
Sustituye tanto la lógica de pestañas de `LeagueTable.tsx` como todo `EuropeanCupsHub.tsx`.
- Header banner: nombre de competición + botón "Volver" a `CompetitionsHub`.
- 5 pestañas únicas para las 5 competiciones: **Clasificación · Fixture · Goleadores · Asistencias · Tarjetas**.
- Recibe `clubs`, `matches`, `players`, `competition` (string), `onAddMatchResult`.
- Todas las consultas de datos (`matches`, stats) se filtran internamente por `match.competition === competition`.

### `StandingsTable.tsx` (nuevo, extraído de `LeagueTable.tsx`)
- **1ra División / 2da División**: misma lógica actual — ordena `Club[]` filtrado por división, usando los campos ya existentes (`points`, `played`, `won`, etc.) y conserva la leyenda de zonas (octavos directos/playoff/eliminados para 1ra; ascenso directo/playoff para 2da).
- **Champions League / Europa League / Copa del Rey**: **nuevo cálculo en vivo**. Se agregan `MatchResult`s con `status === 'CONFIRMADO'` y `competition === <esa competición>` por club (PJ, PG, PE, PP, GF, GC, DG, Pts con 3/1/0), reutilizando la misma tabla visual. Se elimina el preset hardcodeado de 36 clubes de `EuropeanCupsHub.tsx`.
- Un club que no jugó ningún partido confirmado en esa competición no aparece en la tabla (en vez de mostrar filas en 0 para todos los clubes de la liga, ya que las copas no necesariamente incluyen a todos los clubes).

### `FixtureJornadaList.tsx` (nuevo)
- Agrupa `matches` de la competición activa por `matchday`, ordenados ascendentemente.
- Cada grupo se muestra como una tarjeta de "tema": "JORNADA N", fecha (se usa el `createdAt` del primer partido del grupo), y conteo "X partidos · Y confirmados".
- Click → abre `FixtureJornadaDetail` para esa jornada (navegación interna con estado local, no modal).

### `FixtureJornadaDetail.tsx` (nuevo, extraído de `LeagueTable.tsx`)
- Lista los partidos de esa única jornada (scoreboard, botón "Reportar Resultado", badge de captura validada), reutilizando tal cual el diseño de fila que ya existe hoy en la pestaña de fixture. Igual que hoy, el botón se muestra siempre (no hay control de `isAdmin` en el `LeagueTable.tsx` actual, así que no se introduce uno nuevo).
- Reutiliza el modal de "Reportar Resultado" y el modal de "Acta de Partido" ya existentes en `LeagueTable.tsx`, movidos sin cambios de comportamiento.
- Botón "Volver a Jornadas" regresa a `FixtureJornadaList`.

### `PlayerStatsTable.tsx` (nuevo, generaliza los 3 bloques casi idénticos de Goleadores/Asistencias/Tarjetas)
- Prop `statType: 'goals' | 'assists' | 'cards'` controla: color de banner, ícono, texto de cabecera, columna principal y criterio de orden. Reutiliza el resto de la estructura (podio top-3 solo para goleadores, como hoy).
- **Cambio de comportamiento**: las estadísticas se recalculan agregando únicamente los `playerEvents` de `MatchResult`s **confirmados de la competición activa** (antes se sumaban los `goals`/`assists`/`yellowCards`/`redCards` base de cada `Player` más los eventos de *todas* las competiciones). Esto es necesario para que Goleadores/Asistencias/Tarjetas realmente reflejen "de esta competición" y no un acumulado global.
- Búsqueda por nombre y filtro por club se mantienen igual que hoy.

## Archivos afectados

- **Nuevo**: `src/components/competitions/CompetitionsHub.tsx`, `CompetitionDetail.tsx`, `StandingsTable.tsx`, `FixtureJornadaList.tsx`, `FixtureJornadaDetail.tsx`, `PlayerStatsTable.tsx`.
- **Eliminado**: `src/components/LeagueTable.tsx`, `src/components/EuropeanCupsHub.tsx` (reemplazados por lo anterior).
- **Modificado**: `src/App.tsx` — reemplaza el render de `<LeagueTable ... />` por `<CompetitionsHub ... />`, mismas props que recibe hoy (`clubs`, `matches`, `players`, `selectedCompetition`, `onSelectCompetition`, `onAddMatchResult`, `currentClub`).

## Fuera de alcance

- No se toca el generador de fixtures (`fixtureGenerator.ts`), ni el modelo de datos (`types.ts`), ni `MatchReporter.tsx`, ni `AdminPanel.tsx`.
- No se agrega una vista "Todas las competiciones combinadas".
- No se conservan las sub-pestañas "Cuadro" (llave eliminatoria) ni "Reglamento" de `EuropeanCupsHub` — se eliminan según lo acordado.
