# Rediseño de "Mi Club" en pestañas

## Contexto

Hoy la sección "Mi Club" (`activeTab === 'plantilla'`) es un único componente,
`src/components/SquadBuilder.tsx` (~1100 líneas), que muestra siempre visible:
banner del club, campo táctico con el 11 titular (formación editable), lista
de plantilla/suplentes, y al final un bloque financiero (ingresos/gastos/balance
+ historial de transacciones).

El usuario pidió sacar el campo táctico de la vista principal (ocupa demasiado
espacio) y reorganizar toda la sección en pestañas:

1. Juegos recientes
2. Estadísticas de equipo
3. Alineaciones
4. Estadio
5. Calendario y clasificación
6. Estadísticas completas
7. Estado Financiero y Movimientos de Dinero
8. Historial de Transacciones Financieras

## Decisiones ya tomadas (confirmadas con el usuario)

- Navegación: pestañas horizontales tipo pills (mismo patrón visual que los
  filtros de categoría del Foro), no sidebar ni todo-en-una-página.
- "Alineaciones" = el campo táctico actual completo (selector de formación +
  tocar jugador para marcar titular), sin recortar funcionalidad, solo movido
  a su propia pestaña junto con la lista de plantilla/suplentes.
- "Estadísticas de equipo" (resumen: PJ/PG/PE/PP/GF/GC/DG/Pts + forma) es
  distinta de "Estadísticas completas" (tabla por jugador: goles, asistencias,
  tarjetas).
- "Estadio": se agregan campos nuevos (ciudad, capacidad, foto). No requiere
  migración SQL — la tabla `clubs` en Supabase guarda todo como JSON
  (`data jsonb`), así que alcanza con extender el tipo `Club` en TypeScript.
  Solo el Admin puede editar estos datos (nuevo formulario en `AdminPanel`),
  los managers los ven de solo lectura.
- Un archivo de componente por pestaña (no agrupar Financiero + Historial).

## Arquitectura

Carpeta nueva `src/components/miclub/`:

```
src/components/miclub/
  MiClubHub.tsx              (reemplaza el uso de SquadBuilder en App.tsx)
  RecentGamesTab.tsx
  TeamStatsTab.tsx
  LineupTab.tsx
  StadiumTab.tsx
  ScheduleStandingsTab.tsx
  FullStatsTab.tsx
  FinancesTab.tsx
  TransactionsHistoryTab.tsx
```

`SquadBuilder.tsx` se elimina una vez migrado todo su contenido. `App.tsx`
importa `MiClubHub` en vez de `SquadBuilder` y le pasa exactamente los mismos
props que hoy recibe `SquadBuilder`, más `clubs` y `matches` (que hoy no
recibe, necesarios para Calendario/Clasificación y Juegos recientes) y
`onUpdateClub` (necesario para Estadio, ya existe como handler en App.tsx,
usado hoy solo por AdminPanel).

### `MiClubHub.tsx`

Responsable de:
- El guard "Selecciona o Inscribe un Club" (igual al actual, primera línea de
  `SquadBuilder`).
- El banner superior del club: logo, nombre, manager, presupuesto, media de
  plantilla, botón "Añadir Jugador" — se mueve tal cual desde `SquadBuilder`.
- El modal "Añadir Jugador" (formulario completo con búsqueda SOFIFA) — se
  mueve tal cual, vive acá porque es una acción global no atada a una pestaña.
- La barra de 8 pestañas (pills, estilo `CATEGORIES.map` del Foro) y el estado
  `activeMiClubTab`.
- Renderiza el componente de la pestaña activa pasándole solo los props que
  necesita.

### Pestañas — origen de cada una

| Pestaña | Componente | De dónde sale | Datos que usa |
|---|---|---|---|
| Juegos recientes | `RecentGamesTab` | Nuevo | `matches` filtrados por `homeClubId`/`awayClubId === currentClub.id` y `status === 'CONFIRMADO'`, ordenados por fecha desc, top ~8 |
| Estadísticas de equipo | `TeamStatsTab` | Nuevo (reutiliza campos ya calculados) | `currentClub.{played,won,drawn,lost,goalsFor,goalsAgainst,points,form}` + media de plantilla (mismo cálculo que hoy en `SquadBuilder`) |
| Alineaciones | `LineupTab` | Movido de `SquadBuilder` (campo táctico + lista de plantilla/suplentes con botones Valor/Precio de Traspaso/Titular/Eliminar) | `players`, `transfers`, `onToggleStarter`, `onUpdatePlayerValue`, `onSetTransferPrice`, `onRemoveFromMarket`, `onRemovePlayer` |
| Estadio | `StadiumTab` | Nuevo | `currentClub.stadium/stadiumCity/stadiumCapacity/stadiumPhotoUrl` (solo lectura para el manager) |
| Calendario y clasificación | `ScheduleStandingsTab` | Nuevo, pero reutiliza `StandingsTable` (`src/components/competitions/StandingsTable.tsx`) para la tabla de posiciones de `currentClub.division` | `clubs`, `matches` (todos los del club, jugados y pendientes, para el fixture) |
| Estadísticas completas | `FullStatsTab` | Nuevo, tabla simple por jugador (no reutiliza `PlayerStatsTable` porque ese es ranking de liga completa, no de un club) | `players` filtrados por `clubId`, usando `goals/assists/yellowCards/redCards/matchesPlayed` ya presentes en `Player` |
| Estado Financiero y Movimientos de Dinero | `FinancesTab` | Movido de `SquadBuilder` (las 3 tarjetas Ingresos/Gastos/Balance) | `transactions` filtradas por `clubId` |
| Historial de Transacciones Financieras | `TransactionsHistoryTab` | Movido de `SquadBuilder` (la tabla) | `transactions` filtradas por `clubId` |

## Cambios de datos

`types.ts`, interfaz `Club`: agregar 3 campos opcionales, sin tocar los
existentes:

```ts
stadiumCity?: string;
stadiumCapacity?: number;
stadiumPhotoUrl?: string;
```

`AdminPanel.tsx`: nuevo formulario "Editar Estadio" (por club) con nombre +
los 3 campos nuevos, que llama al `onUpdateClub` ya existente. No se toca
`onUpdateClub` en sí.

No hay migración SQL: la tabla `clubs` es `key text primary key, data jsonb`,
así que los campos nuevos simplemente aparecen en el JSON cuando se guardan.

## Fuera de alcance

- No se cambia el modal de "Añadir Jugador" ni la lógica de fichajes/mercado.
- No se toca `CompetitionsHub` ni `StandingsTable` — se importan y usan tal
  cual existen hoy.
- No se agregan stats nuevas al `Player` (goles/asistencias/tarjetas ya
  existen en el tipo, se asume que se completan desde otro flujo existente al
  cargar resultados de partido).
- El manager no puede editar los datos del estadio en esta iteración (queda
  para más adelante si se pide).
