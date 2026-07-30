# Cuadro visual de eliminatorias para copas UEFA

## Contexto

Las copas europeas (UEFA Champions League, UEFA Europa League, UEFA Conference League) ya clasifican sus 8 clubes automáticamente desde la tabla de posiciones de 1ra División (`getSeededClubsForCompetition` / `getDomesticStandingOrder` en `src/utils/bracketGenerator.ts`), usando puntos → diferencia de gol → goles a favor. Champions toma los puestos 1º-8º, Europa League 9º-16º, Conference League 17º-24º. Esta lógica de clasificación ya es correcta y no requiere cambios.

El problema es de presentación: hoy la pestaña "Clasificación" de una copa (`StandingsTable.tsx` → `BracketSeeding`) muestra una tabla plana de "bombos" (seed, club, posición doméstica), en vez de un cuadro de eliminatorias visual como el de una transmisión de TV (imagen de referencia: cuadro simétrico con Cuartos a ambos lados convergiendo en una Final central con trofeo, sobre fondo oscuro).

## Objetivo

Reemplazar la tabla de bombos por un cuadro de eliminatorias visual, autocompletado según la clasificación de 1ra División, que muestre el progreso real del torneo (ganadores confirmados avanzando de ronda).

## Alcance

- Afecta únicamente la pestaña **Clasificación** de las 3 copas UEFA (`UEFA Champions League`, `UEFA Europa League`, `UEFA Conference League`).
- La pestaña **Fixture** no se modifica: sigue siendo el lugar donde se cargan resultados por cruce (`FixtureJornadaList` / `FixtureJornadaDetail`), sin cambios.
- El cuadro nuevo es de **solo lectura** (no es clickeable para cargar resultados).
- Las ligas domésticas (1ra/2da División) no se tocan; siguen mostrando `DomesticStandings` como hoy.

## Diseño

### Componente nuevo: `KnockoutBracket.tsx`

Ubicado en `src/components/competitions/KnockoutBracket.tsx`. Recibe `clubs`, `matches` y `competition`, y renderiza el cuadro completo de 3 rondas (Cuartos de Final → Semifinal → Final) para esa copa.

**Estructura visual (basada en el mockup A aprobado):**
- Contenedor con fondo degradado oscuro (`#0a1a3f` → `#142a5c`), estilo tarjeta redondeada, consistente con la identidad visual del resto de la app (mismo patrón `fc-card` / paleta oscura ya usada en el header de `CompetitionDetail`).
- Fila superior de etiquetas de ronda: `Cuartos` (izq) — `Semis` (izq) — `FINAL` (centro, dorado) — `Semis` (der) — `Cuartos` (der).
- Columna izquierda: 4 cruces de Cuartos apilados verticalmente, cada uno mostrando escudo + nombre de los 2 clubes.
- De cada par de cruces de Cuartos sale una línea conectora hacia el cruce de Semifinal correspondiente (2 cruces de Semifinal a la izquierda del centro).
- Centro: ícono/trofeo con la etiqueta "FINAL" y los 2 finalistas (o placeholders "—" si aún no están definidos).
- Columna derecha: espejo de la izquierda (Semis derecha, luego Cuartos derecha), ya que el cuadro reparte los 8 sembrados en dos mitades (seeds 1-4 a la izquierda, 5-8 a la derecha, o el criterio de emparejamiento que ya usa `buildRoundMatches` en `bracketGenerator.ts` — el nuevo componente solo consume esos partidos, no reordena el emparejamiento).
- En mobile (viewport angosto), el cuadro colapsa a las rondas apiladas verticalmente (mismo contenido, layout de columna única) para evitar scroll horizontal ilegible — no es la opción B rechazada como estilo general, sino solo el comportamiento responsive de la opción A elegida.

**Datos y estados de cada cruce:**
- Cruce sin jugar (`status !== 'CONFIRMADO'`): muestra escudo + nombre de ambos clubes sembrados, sin resaltado.
- Cruce con resultado confirmado: usa `getMatchWinnerClubId` (ya existe en `bracketGenerator.ts`) para resaltar al ganador (texto en blanco/negrita + fondo levemente iluminado) y atenuar al perdedor.
- Ronda siguiente aún no generada (p. ej. Semifinal antes de que terminen todos los Cuartos): la casilla de esa ronda muestra placeholders "—" en vez de nombres de club. Esto ocurre naturalmente porque `generatePendingKnockoutMatches` no genera la ronda siguiente hasta que la anterior esté completa; el componente simplemente no encuentra el match y renderiza el placeholder.
- Si la copa todavía no tiene 8 clubes clasificados en 1ra División (liga muy chica o recién arrancando), se muestra un mensaje breve en vez del cuadro (mismo mensaje/estilo que hoy usa `BracketSeeding` cuando `seeded.length === 0`).

### Cambio en `StandingsTable.tsx`

En `BracketSeeding` (o renombrando ese bloque), reemplazar el `return` que arma la tabla de bombos por `<KnockoutBracket clubs={clubs} matches={matches} competition={competition} />`. Para esto, `StandingsTable` necesita empezar a recibir `matches` en esa rama (ya lo recibe como prop, se está filtrando/pasando por `CompetitionDetail`).

### Testing

- Verificación manual en navegador (`/run`): abrir cada una de las 3 copas con datos de ejemplo en distintos estados (0 resultados cargados, Cuartos parcialmente jugados, Cuartos completos con Semis generadas, torneo completo con Final jugada) y confirmar que el cuadro se autocompleta y resalta ganadores correctamente.
- No se requieren tests automatizados nuevos (el proyecto no tiene suite de tests configurada); se valida con el flujo manual anterior.

## Fuera de alcance

- No se cambia el algoritmo de sembrado ni de emparejamiento (`bracketGenerator.ts`).
- No se agrega carga de resultados desde el cuadro (eso se sigue haciendo en Fixture).
- No se toca la vista de ligas domésticas.
