# Sistema de Patrocinadores — Diseño

Fecha: 2026-08-02
Rama: `feature/backend-accounts-migration`

## Objetivo

Cada club de FIFAMANIAKOS firma un contrato con una marca patrocinadora. La
marca define un conjunto de cláusulas ("si ganás la Champions, +35 millones").
Al cerrar la temporada el sistema evalúa qué cláusulas cumplió cada club y
acredita automáticamente el dinero en su presupuesto, dejando el movimiento
registrado en el Historial de Transacciones de Mi Club.

## Decisiones tomadas

| Decisión | Elección | Motivo |
|---|---|---|
| Relación club ↔ patrocinador | **Un patrocinador por club**, marcas escalonadas por categoría | Realismo: adidas no firma con un club de 2da. Crea una decisión estratégica (contrato ambicioso vs. seguro). |
| Momento del pago | **Al cerrar la temporada** | Evita casos borde (un pichichi que pierde el puesto en la última jornada ya habría cobrado). |
| Cláusulas de pichichi | Debe ser máximo goleador **y** superar el umbral | Es lo que dice literalmente "PICHICHI LIGA + DE 30 GOLES". |
| Cláusulas de asistencias | Solo superar el umbral, sin necesidad de ser el máximo | Es lo que dice literalmente "+ DE 30 ASISTENCIAS (1 SOLO JUGADOR)". |
| Empate en el pichichi | Cobran todos los clubes empatados | Equivalente al Botín de Oro compartido. |

## Modelo de datos

### `sponsors`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `name` | text | adidas, Coca-Cola, FedEx, Nike, Samsung |
| `logoUrl` | text | |
| `tier` | int | 1 = más exigente y mejor pago, 5 = más accesible |
| `requirementDivision` | text \| null | División mínima para poder firmar (ej. `1ra División`) |
| `requirementMaxPosition` | int \| null | Posición máxima en la temporada anterior (ej. 4 = top 4). **Definido pero sin implementar:** `MatchResult` no tiene `seasonNumber`, así que la app no conserva historial por temporada y no hay forma de calcular la posición anterior. La elegibilidad usa solo `requirementDivision`. |
| `active` | bool | |

Un club califica para una marca si cumple **ambos** requisitos no nulos. Los
clubes sin temporada previa (recién inscriptos) solo califican para marcas con
`requirementMaxPosition` nulo.

### `sponsor_objectives`

Una fila por cláusula. `kind` determina cómo la evalúa el motor.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `sponsorId` | uuid | FK a `sponsors` |
| `kind` | enum | Ver tabla de tipos abajo |
| `competition` | text \| null | Nombre de la competición; null = cualquiera |
| `phase` | text \| null | Solo para `REACH_PHASE` |
| `threshold` | int \| null | Mínimo de victorias / goles / asistencias |
| `rewardMillions` | int | Premio en millones de € |
| `label` | text | Texto que se muestra al manager |

Tipos de cláusula:

| `kind` | Parámetros usados | Ejemplo |
|---|---|---|
| `CHAMPION` | `competition` | CAMPEON CHAMPIONS: +35 MILL |
| `RUNNER_UP` | `competition` | SUBCAMPEON LIGA: +12 MILL |
| `REACH_PHASE` | `competition`, `phase` | SEMIS DE CHAMPIONS: +20 MILL |
| `LEAGUE_WINS` | `threshold` | GANAR 20 PARTIDOS DE LIGA: +20 MILL |
| `TOP_SCORER` | `competition`, `threshold` | PICHICHI LIGA +30 GOLES: +20 MILL |
| `ASSISTS_THRESHOLD` | `competition`, `threshold` | +30 ASISTENCIAS: +10 MILL |

### `club_sponsor_contracts`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `clubId` | uuid | |
| `sponsorId` | uuid | |
| `seasonNumber` | int | De `LeagueSettings.currentSeasonNumber` |
| `signedAt` | timestamp | |

Único por (`clubId`, `seasonNumber`).

### `sponsor_payouts`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `clubId` | uuid | |
| `seasonNumber` | int | |
| `objectiveId` | uuid | |
| `amount` | bigint | En € (millones × 1.000.000) |
| `paidAt` | timestamp | |

Único por (`clubId`, `seasonNumber`, `objectiveId`). Esta restricción es lo que
hace la liquidación **idempotente**: correrla dos veces no paga dos veces.

## Motor de cálculo

Solo se consideran partidos con `status: 'CONFIRMADO'`.

- **`CHAMPION` / `RUNNER_UP`** — en Liga (1ra/2da) sale de la tabla de posiciones
  final de esa división. En copas, del ganador/perdedor del partido con
  `phase: 'FINAL'`, resolviendo con `penaltyWinnerClubId` si terminó empatado.
- **`REACH_PHASE`** — el club aparece en algún partido de esa fase **o de una
  posterior**. Orden: `GRUPOS` < `OCTAVOS` < `CUARTOS` < `SEMIFINAL` < `FINAL`.
  Así un campeón de Champions también cumple "semis" y "4tos" si su marca los
  premia.
- **`LEAGUE_WINS`** — victorias del club en partidos de su propia división.
- **`TOP_SCORER`** — agrega `playerEvents` de tipo `GOAL` por jugador filtrando
  por `competition`, toma el máximo, y verifica que además supere `threshold`.
  Empate en el máximo: cobran todos los clubes empatados.
- **`ASSISTS_THRESHOLD`** — agrega `playerEvents` de tipo `ASSIST` por jugador y
  competición; se cumple si algún jugador del club supera `threshold`.

## UI

### Mi Club → pestaña "Patrocinador"

Escudo y nombre de la marca contratada, la lista completa de sus cláusulas con
el estado de cada una (`Cumplido ✓`, `Vas 14 de 20`, `No alcanzado`) y el total
acumulado proyectado. El progreso se calcula en vivo aunque el pago sea al
cierre, para que el manager sepa todo el año qué está persiguiendo.

Si el club todavía no firmó y la temporada no arrancó, la pestaña muestra el
selector de marcas para las que califica.

### Panel de Administración → sección "Patrocinadores"

- ABM de marcas y de sus cláusulas, con montos editables.
- Vista de qué marca firmó cada club en la temporada actual.
- Botón **"Liquidar patrocinadores"**: muestra primero una **vista previa** de
  cada pago (club, cláusula, monto) para revisión. Recién al confirmar se
  acreditan los presupuestos, se crean los `sponsor_payouts` y se generan las
  `FinancialTransaction`.

### Firma del contrato

El manager elige su marca al inicio de temporada entre las que califica. Una vez
que la temporada arrancó (hay al menos un partido confirmado) el contrato queda
bloqueado — si no, cambiarían de marca al final para maximizar el cobro.

## Efecto del pago

Cada pago liquidado produce:

1. Una fila en `sponsor_payouts`.
2. Un `FinancialTransaction` de tipo `INGRESO` con concepto
   `"Bonus <marca> — <label de la cláusula>"`.
3. El incremento correspondiente en `Club.budget`.

Los tres pasos van en la misma transacción de base de datos (RPC de Supabase),
igual que el patrón ya usado en `011_financial_transfer_rpc.sql`.

## Decisiones tomadas durante la implementación

Estas se decidieron después de escribir la spec original, revisando el código:

- **Contratos y pagos son privados por club.** Cada manager ve solo lo suyo; el
  admin ve todo. Es el mismo criterio que ya usaba la tabla `transactions`.
- **El manager solo puede FIRMAR su contrato, nunca modificarlo ni borrarlo.**
  El bloqueo de "temporada ya arrancada" es una regla de pantalla, y una
  pantalla no es un permiso: con permiso de UPDATE, un manager podía jugar toda
  la temporada, ver qué ganó, y recién entonces cambiar a la marca que mejor le
  pagaba por ese título. Corregir un contrato mal firmado es tarea del admin.
- **La RPC de liquidación no recibe montos del cliente.** Recibe solo
  identificadores (club, temporada, objetivo) y lee el premio y el concepto
  desde la base, rechazando objetivos que no pertenezcan a la marca que ese club
  contrató. Esto cierra la clase entera de ataques, no solo el caso conocido.
- **Umbrales:** un objetivo con `threshold: 30` se cumple con **30 exactos**
  (comparación `>=`). Las etiquetas dicen "+30 goles"; si se quiere que digan lo
  mismo que hace el sistema, hay que cambiar el texto, no la lógica.
- **Empate perfecto en la tabla de liga:** si dos clubes empatan en puntos,
  diferencia de gol y goles a favor, **no se corona a ninguno**. El orden que
  devuelve la tabla en ese caso depende del orden de llegada de los partidos, y
  preferimos no pagar antes que pagarle al club equivocado.
- **Finales duplicadas:** si hay más de un partido cargado como `FINAL` en la
  misma competición, vale el de `createdAt` más reciente.

## Alcance conocido / limitaciones

Las competiciones **Supercopa de Europa**, **Supercopa de Liga** y **Mundial de
Clubes** aparecen en las cláusulas de ejemplo pero **no existen todavía** en la
app (`CompetitionsHub.tsx` solo conoce 1ra, 2da, UCL, UEL y UECL). El sistema
soporta esas cláusulas y las guarda, pero nunca se cumplirán hasta que esas
competiciones se creen. El motor las trata como "no alcanzado" sin error.
