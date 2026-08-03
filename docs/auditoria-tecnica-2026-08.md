# Auditoría técnica — FIFAMANIAKOS FC 27

Fecha: 2026-08-03 · Rama: `feature/backend-accounts-migration` · Commit de arreglos: `a66f99d`

Alcance real: 65 archivos TS/TSX (~26.000 líneas de código; los otros ~537.000 son
3 archivos de datos semilla) y 13 migraciones SQL.

---

## 0. El hallazgo que explica a casi todos los demás

**El proyecto no tenía `@types/react` ni `@types/react-dom` instalados.** React 19
no incluye sus propios tipos.

Consecuencias, todas verificadas con `tsc`:

- Los 5.116 errores `TS7026` significan que **todo el JSX era `any`**.
- Cada `React.FC<MisProps>` no validaba absolutamente nada: las interfaces de props
  eran decorativas. 230 `TS7031` (props implícitamente `any`) y 488 `TS7006`.
- Por lo tanto `npm run lint` (que es `tsc --noEmit`) **pasaba siempre**, sin importar
  lo que se escribiera. La regla de AGENTS.md "nada de `any`" se estaba violando
  ~800 veces de forma implícita, sin que nadie pudiera verlo.

Al instalar los tipos aparecieron **7 errores reales** (ver sección Bugs). Ninguno
era ruido: los 7 eran defectos genuinos.

`tsconfig.json` tampoco tiene `strict`, ni `noUnusedLocals`, ni `noImplicitAny`.

---

## 1. Código muerto encontrado

Medido con `tsc --noUnusedLocals --noUnusedParameters` y un análisis de grafo de
imports + referencias cruzadas.

**Eliminado en `a66f99d`:**

| Qué | Dónde | Por qué era muerto |
|---|---|---|
| `filteredSofifaPlayers` | `TransferMarket.tsx` | Se calculaba en cada render y **no se usaba en ningún lado** |
| `sofifaSearch`, `sofifaPosFilter`, `sofifaClubFilter` | `TransferMarket.tsx` | 3 `useState` cuyos setters no se llamaban desde ningún lado: filtros congelados en su valor por defecto |
| `getPositionBand()` | `bracketGenerator.ts` | Exportada, 1 sola ocurrencia en todo el repo (su propia definición) |
| `forumSections` | `Navbar.tsx` | Constante sin referencias |
| prop `onOpenForumSection` | `ForumModule.tsx` + `App.tsx` | Quedó sin uso al mover las secciones a la navbar |
| `useEffect`, `Users`, `CompetitionLogo` | `Navbar.tsx` | Imports sin uso |
| `Heart`, `Share2`, `User`, `ForumSectionTag` | `ForumModule.tsx` | Imports sin uso |

**Detectado y NO eliminado (requiere tu decisión o es riesgoso de hacer a mano):**

- **`DRAFT_BOMBO_TEAMS` — `src/data/initialData.ts`, líneas 8 a 369.** 362 líneas de
  datos (el 62% del archivo) con **una sola ocurrencia en todo el repo**: su propia
  declaración. Es borrado seguro, pero preferí no reescribir a mano un literal de
  362 líneas: el riesgo de corromper el archivo semilla supera el beneficio.
  Borrá el rango 8-369 desde el editor.
- **53 imports sin uso restantes** (mayormente iconos de `lucide-react`) repartidos en
  ~15 archivos. Los dejé porque son cosméticos y cada uno requiere un edit; conviene
  resolverlos de una vez activando `noUnusedLocals` (ver Mejoras).
- **Exports innecesarios**: `OFFICIAL_CURRENT_SQUADS`, `getMatchWinnerClubId`,
  `getDomesticStandingOrder`, `getSeededClubsForCompetition`, `buildDivisionParticipants`,
  `ManagerProfile` y 12 tipos más se exportan pero solo se usan dentro de su propio
  archivo. No es código muerto, es superficie de API innecesaria.

No hay archivos huérfanos: los 65 archivos están alcanzados desde `main.tsx`
(el único "huérfano" es `vite-env.d.ts`, que es correcto que lo sea).

---

## 2. Código duplicado encontrado

**Corregido:** el badge de categoría del foro estaba escrito dos veces en
`ForumModule.tsx` con dos cadenas de ternarios distintas — y las dos no coincidían:

- La del listado usaba las categorías reales.
- La del detalle del tema comparaba contra `'Resultados'` y `'Fichajes'`, que **ya no
  existen** en `ForumCategory`. Resultado: en el detalle, todos los temas se pintaban
  con el color de fallback.

Reemplazado por un único `CATEGORY_BADGE_CLASS: Record<ForumCategory, string>`. Al ser
un `Record` tipado, si mañana se agrega una categoría **TypeScript obliga a definir su
color**, cosa que la cadena de ternarios nunca hizo.

**Detectado, no unificado (semánticas distintas, no es duplicación real):**
`matchPrize.matchWinnerClubId()` devuelve `null` en empate y exige `CONFIRMADO`;
`bracketGenerator.getMatchWinnerClubId()` resuelve por penales. Nombres casi idénticos
para reglas distintas — vale la pena renombrarlos (`ligaWinner` / `knockoutWinner`).

---

## 3. Bugs encontrados

1. **`club.badgeUrl` no existe en `Club`** (4 sitios: `Navbar`, `ForumModule`,
   `DraftLotteryModule` ×2). El patrón `club.logoUrl || club.badgeUrl` pretendía ser un
   fallback de escudo roto, pero `badgeUrl` no está en el tipo ni en ningún dato: la
   expresión siempre resolvía a `undefined`. **El fallback nunca funcionó.**
   *Corregido:* `ClubLogo` ya maneja `src` vacío y `onError`, así que el `||` sobraba.

2. **`AdminPanel` declaraba `onUpdateMatchResult` con 2-4 parámetros y lo llamaba con 6.**
   La implementación real en `App.tsx` sí acepta los goleadores. No rompía en runtime
   (JS ignora la firma), pero cualquier refactor guiado por tipos habría borrado los
   goleadores silenciosamente. *Corregido:* la firma de la prop ahora refleja la real.

3. **Ramas muertas en el foro:** comparaciones contra `'Resultados'`/`'Fichajes'`,
   imposibles de satisfacer. *Corregido* junto con la duplicación.

4. **Riesgo latente en `useSupabaseTable`:** cada escritura envía **el objeto completo**
   (`upsert({ key, data: item })`). Dos pestañas o dos managers editando el mismo club
   se pisan enteros: gana el último en escribir, incluso en campos que no tocó. No es
   un bug visible hoy, pero es la causa raíz del riesgo de seguridad #1.

---

## 4. Riesgos de seguridad

> Esta sección **no se aplicó**. AGENTS.md pide explícitamente explicar antes de tocar
> permisos/RLS, y las migraciones se corren a mano en el SQL Editor.

### 4.1 CRÍTICO — Un manager puede editarse el presupuesto y la tabla de posiciones

`003_rls_policies.sql`:

```sql
create policy "manager_update_own_club" on public.clubs for update
  to authenticated
  using (data->>'id' = public.current_manager_club_id())
  with check (data->>'id' = public.current_manager_club_id());
```

La policy **solo valida que la fila sea la suya**. Como el club entero vive dentro de
`data` (jsonb), un manager autenticado puede reescribir *cualquier* campo:

```js
// desde la consola del navegador, con sesión de manager normal
await supabase.from('clubs')
  .update({ data: { ...miClub, budget: 999999999, points: 99 } })
  .eq('key', miClubId)
```

Esto pasa RLS. Se puede auto-acreditar dinero **y falsear puntos, goles y división**.

No hay nada que lo impida: busqué triggers y no existe ninguno sobre `clubs`. Los
únicos triggers del proyecto son `on_auth_user_created` y `protect_is_owner`.

Todo el cuidado de `011_financial_transfer_rpc.sql` (RPC `security definer` que recibe
identificadores y no montos) queda **puenteado**, porque el camino de escritura directa
a la tabla sigue abierto en paralelo.

Es exactamente el agujero que `006_lock_is_owner_column.sql` cerró para `is_owner`, y su
propio comentario ya avisaba: *"En vez de parchear cada policy (frágil: la próxima policy
que se agregue puede repetir el error), se bloquea el cambio a nivel de trigger"*. Ese
razonamiento nunca se aplicó a `budget`.

### 4.2 CRÍTICO — Un manager puede ficharse jugadores gratis

`010_manager_players_insert_delete.sql`:

```sql
create policy "manager_insert_own_players" on public.players for insert
  to authenticated
  with check (club_id = public.current_manager_club_id());
```

Un manager puede insertar **cualquier** jugador en su plantilla sin pasar por
`sign_free_agent_player()`, que es la RPC que cobra el fichaje. El pago es opcional.

Ojo: esta policy **existe por un motivo legítimo** y está documentado en el encabezado
de la migración (sin ella se rompe el Draft). **No hay que borrarla:** lo que faltaba no
era el permiso, sino la *ventana* en la que ese permiso vale.

Además del Draft, había un segundo camino gratis que no estaba en el radar:
`TransferMarket.tsx` no tiene **ninguna** referencia a `isAdmin`, así que el botón
"Sincronizar plantilla oficial de EA FC" estaba disponible para cualquier usuario y
asignaba una plantilla real completa sin cobrar.

**Resuelto en `supabase/migrations/015_draft_window.sql`** (aplicada el 2026-08-03), con
la regla de negocio que definió el dueño de la liga: un manager solo recibe jugadores
gratis con el Draft abierto, y una sola vez por club y temporada.

Dos detalles de diseño que no eran obvios:

- **Hace falta una tabla (`draft_claims`), no alcanza una policy.** Si la condición fuera
  "el club todavía no tiene jugadores", al manager le bastaba con borrar su plantilla
  (cosa que `manager_delete_own_players` le permite) para volver a sortear hasta conseguir
  mejores cartas. Borrar jugadores no deshace el registro.
- **Se guarda la transacción que creó el registro.** El Draft inserta las ~22 filas en una
  sola sentencia; sin eso, la fila 1 creaba el registro y las filas 2 a 22 quedaban
  rechazadas por "ya usaste tu Draft".

Un tercer detalle que habría sido un bug silencioso: en un `BEFORE INSERT` las columnas
generadas todavía no están calculadas, así que el trigger lee `data->>'clubId'` y no
`new.club_id` (que sería `NULL`).

### 4.3 ALTO — Cualquier autenticado puede crear clubes arbitrarios

```sql
create policy "manager_insert_own_club" on public.clubs for insert
  to authenticated
  with check (data->>'id' is not null);
```

El único requisito es que el `id` no sea nulo. Cualquier usuario registrado puede
insertar clubes con el presupuesto, la división y los puntos que quiera.

### 4.4 Arreglo aplicado: `supabase/migrations/014_lock_club_economy.sql`

**Ejecutada con éxito en Supabase el 2026-08-03.** Cubre 4.1, 4.3 y 4.5. Deja 4.2
explícitamente afuera, con el motivo documentado en el propio archivo.

Puntos clave del diseño:

- Sigue el patrón de 006 (trigger, no parche por policy).
- **No toca ni una línea de los RPC de 011/013.** Distingue al RPC legítimo de la
  escritura directa por el **rol efectivo**: PostgREST ejecuta lo del navegador como
  `authenticated`, mientras que dentro de un `security definer` (los 4 RPC lo son)
  `current_user` pasa a ser el dueño, `postgres`.
- Por eso los triggers son **SECURITY INVOKER** (sin `security definer`): si fueran
  definer, `current_user` sería siempre el dueño y no distinguirían nada.
- El trigger **revierte** los campos protegidos en vez de rechazar la escritura, porque
  `useSupabaseTable` manda siempre el objeto completo: si un manager edita el estadio, el
  upsert incluye igual `budget`. Rechazar rompería esa edición legítima.

**Intento fallido previo, documentado para que no se repita:** la primera versión usaba
`alter function ... set "app.club_economy_write" = 'on'`. Supabase lo rechaza con
`42501: permission denied to set parameter`, porque su rol `postgres` no es superusuario y
desde PG15 fijar un parámetro personalizado de forma persistente requiere privilegios
sobre ese parámetro. El enfoque por rol es además más robusto: no hay un bloque que se
pueda olvidar de re-aplicar cuando se creen RPC nuevas.

El esquema de la solución, para referencia:

```sql
-- 014_lock_club_economy.sql  (PROPUESTA — revisar y correr a mano)

create or replace function public.protect_club_economy()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  campo text;
begin
  -- Los RPC de dinero marcan la transaccion como autorizada.
  if coalesce(current_setting('app.club_economy_write', true), '') = 'on' then
    return new;
  end if;

  -- Sin JWT (SQL Editor) o admin: se permite.
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  -- Un manager no puede mover por escritura directa ni el dinero ni la tabla.
  foreach campo in array array[
    'budget','points','played','won','drawn','lost',
    'goalsFor','goalsAgainst','form','division'
  ] loop
    new.data := jsonb_set(new.data, array[campo], old.data -> campo, true);
  end loop;

  return new;
end;
$$;

drop trigger if exists protect_club_economy on public.clubs;
create trigger protect_club_economy
  before update on public.clubs
  for each row execute function public.protect_club_economy();
```

Y **cada** RPC que mueve dinero (`complete_market_transfer`, `complete_direct_transfer`,
`sign_free_agent_player` en 011; `settle_sponsor_payout` en 013) necesita, como primera
línea de su cuerpo:

```sql
perform set_config('app.club_economy_write', 'on', true);  -- true = solo esta transaccion
```

Sin ese `set_config`, **el trigger revierte los pagos y rompe los traspasos**. Por eso no
lo apliqué solo: hay que actualizar las 4 funciones en la misma migración.

Para 4.2 y 4.3 el arreglo no es mecánico y quiero tu criterio: lo razonable es exigir que
el alta de jugadores pase por RPC (y dejar el INSERT directo solo al admin y al Draft), y
que el INSERT de clubes valide que el club sea el del manager que lo crea.

### 4.5 Otros puntos

- `is_admin()` y `current_manager_club_id()` (003) son `security definer` **sin**
  `set search_path`. Las funciones de 005/006 sí lo pinnean. Los advisories de Supabase
  recomiendan hacerlo siempre. Arreglo de 1 línea.
- `transactions` tiene dos policies redundantes: `admin_all_transactions` (FOR ALL) ya
  cubre a `admin_read_transactions` (FOR SELECT).

---

## 5. Problemas de arquitectura

1. **Dos caminos de escritura conviviendo.** Existen las RPC transaccionales (011/013) y,
   en paralelo, la escritura directa a tablas vía `useSupabaseTable`. Mientras el segundo
   camino siga abierto, el primero es una recomendación, no un control. Es el problema de
   fondo detrás de toda la sección 4.
2. **`useSupabaseTable` escribe el objeto entero.** Impide cualquier control por campo,
   provoca sobreescrituras entre usuarios y obliga a que las policies sean todo-o-nada.
3. **Componentes gigantes:** `AdminPanel.tsx` (2.351 líneas), `ForumModule.tsx` (~950),
   `TransferMarket.tsx` (~905), `FixtureJornadaDetail.tsx` (892).
4. **Lógica de negocio dentro de React:** `App.tsx` (1.229 líneas) concentra el estado
   global y los handlers. La parte pura ya está bien separada en `src/utils/` (con tests),
   ese patrón debería extenderse.

---

## 6. Problemas de performance

1. **Corregido — búsqueda lineal sobre 15.979 jugadores.**
   `competitionStats.findSofifaPlayerByName()` hacía `.find()` sobre
   `SOFIFA_PLAYERS_DATABASE` re-normalizando `.trim().toLowerCase()` de cada candidato,
   y se llama desde 3 sitios, todos dentro de bucles (por goleador de cada partido y por
   jugador de cada plantilla). Ahora hay un `Map` construido una sola vez, de forma
   perezosa: de O(n·16.000) a O(n).
2. **Corregido — `filteredSofifaPlayers`:** un `.filter()` sobre 15.979 elementos en
   **cada render** de `TransferMarket`, cuyo resultado no se usaba.
3. **Pendiente — el bundle carga ~537.000 líneas de datos.** `sofifaPlayersDatabase.ts`
   (415k) y `officialCurrentSquads.ts` (122k) se importan estáticamente, así que entran al
   bundle inicial aunque el usuario nunca abra el buscador. Candidatos claros a `import()`
   dinámico o a moverse a una tabla de Supabase.

---

## 7. Mejoras recomendadas (por impacto)

1. **Cerrar los agujeros de la sección 4.** Es lo único que puede costar dinero real.
2. **Activar `noUnusedLocals` + `noUnusedParameters`** tras limpiar los 53 imports
   restantes: convierte el código muerto en un error de build en vez de en deuda.
3. **Avanzar hacia `strict: true`.** Hoy quedan 5.948 errores bajo `--strict`, casi todos
   `any` implícito. Es mucho de golpe, pero se puede ir archivo por archivo, empezando por
   `src/utils/` (que ya está tipado y testeado).
4. **Cargar las bases de datos SOFIFA de forma diferida** (punto 6.3).
5. **Dividir `AdminPanel.tsx`** en las secciones que ya tiene como tabs internas.
6. **Renombrar** `matchWinnerClubId` / `getMatchWinnerClubId` para que no parezcan lo mismo.
7. **Borrar `DRAFT_BOMBO_TEAMS`** (`initialData.ts` 8-369).

---

## 8. Refactorizaciones realizadas

Todas en el commit `a66f99d`.

| Qué había | Qué eliminé | Por qué | Qué quedó |
|---|---|---|---|
| Sin `@types/react`; JSX y props en `any` | — | El lint no verificaba nada; las interfaces de props eran decorativas | `@types/react` y `@types/react-dom` en devDependencies; `tsc` ahora detecta errores reales |
| `logoUrl \|\| badgeUrl` en 4 sitios | El `\|\| badgeUrl` | `badgeUrl` no existe en `Club`: siempre `undefined`, el fallback nunca funcionó | `src={club.logoUrl}`; el fallback real lo hace `ClubLogo` con `onError` |
| Firma de `onUpdateMatchResult` con 2-4 params | La firma vieja | Se la llamaba con 6; la implementación real acepta 6 | Firma alineada con `handleUpdateMatchResult` |
| 2 cadenas de ternarios para el color de categoría, una obsoleta | Ambas cadenas | Duplicación + ramas imposibles (`'Resultados'`, `'Fichajes'`) | Un `CATEGORY_BADGE_CLASS: Record<ForumCategory,string>` que obliga a cubrir toda categoría nueva |
| `.find()` lineal sobre 15.979 jugadores | El `.find()` | Se llamaba dentro de bucles; re-normalizaba cada nombre en cada iteración | Índice `Map` perezoso, construido una vez |
| `filteredSofifaPlayers` + 3 `useState` de filtro | Todo el bloque | El resultado no se usaba y los setters no se llamaban nunca | Nada: eran cálculo y estado puramente muertos |
| `getPositionBand`, `forumSections`, prop `onOpenForumSection` | Los tres | Sin referencias en todo el repo | — |

---

## 9. Verificaciones finales

Comprobado, no asumido:

- ✅ `npx tsc --noEmit` → **0 errores** (con los tipos de React ya instalados y activos).
- ✅ `npm test` → **82/82 tests** en 5 archivos.
- ✅ `npm run build` → OK (queda un warning preexistente de esbuild sobre `import.meta`).
- ✅ **Archivos huérfanos:** 0 (grafo de imports resuelto desde `main.tsx`).
- ✅ **Referencias tras cada borrado:** verificadas con grep antes de eliminar. Un error
  mío quedó registrado: quité `Scale`/`Coins`/`Gavel`/`Dice5` de `ForumModule` creyéndolos
  sin uso, `tsc` lo detectó y los restauré. Ese es justamente el valor de tener tipos.
- ✅ **Componentes duplicados:** no encontré ninguno.
- ✅ **Utilidades duplicadas:** solo el par de "winner" (semánticas distintas, documentado).
- ✅ **Sistemas viejos conviviendo con nuevos:** encontrado uno, importante — RPC
  transaccional vs. escritura directa a tablas (sección 5.1). **No lo resolví**: es un
  cambio de permisos y requiere tu aprobación.

**Lo que NO pude verificar, explícitamente:**

- **Nada de lo que depende de la base de datos real.** No tengo acceso al proyecto Supabase
  (ni MCP ni CLI), así que los riesgos de la sección 4 están deducidos leyendo las
  migraciones, no explotados contra la base. **Recomiendo confirmar 4.1 a mano** con una
  sesión de manager de prueba antes de dar por buena mi lectura.
- **Índices SQL:** no puedo medir planes de ejecución sin la base. No evalué índices
  faltantes con datos reales.
- **Migraciones 012 y 013** siguen sin correrse en producción (según AGENTS.md), así que
  la parte de patrocinadores no se puede validar de punta a punta.
- **CSS/Tailwind:** revisión superficial. Con ~26k líneas de JSX, un análisis serio de
  clases contradictorias o estilos muertos necesita una herramienta dedicada.
- **Comportamiento en runtime:** no levanté la app ni hice clic en nada. La verificación es
  compilador + tests + build.
- **Migración `014` — estado de verificación:**
  - ✅ Aplicó sin errores en Supabase (2026-08-03).
  - ✅ Los dos triggers existen sobre `public.clubs` (`protect_club_economy` y
    `enforce_new_club_defaults`), confirmado con `pg_trigger`.
  - ✅ **Los traspasos siguen funcionando:** compra de un jugador desde la app, el
    presupuesto del comprador baja. Esto valida el supuesto central del diseño — que
    dentro de un RPC `security definer` `current_user` no es `authenticated` — que era
    el único punto donde este enfoque podía fallar.
  - ⬜ **Pendiente:** intentar el exploit con una sesión de manager común y confirmar que
    el presupuesto no cambia. Ojo: desde el SQL Editor se corre como `postgres`, así que
    ahí el trigger deja pasar a propósito y el valor sí cambia — eso no es un fallo.
