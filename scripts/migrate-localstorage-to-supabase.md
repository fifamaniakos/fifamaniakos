# Migración de datos existentes + cuenta admin real

Estos pasos son manuales: requieren acceso al navegador donde el admin tiene los datos
reales de la liga y al SQL Editor de Supabase (proyecto `hqybpfppqimssindwgns`). No hay
script automatizado porque el conector MCP de Supabase no estuvo disponible durante esta
migración (ver `supabase/migrations/README.md`).

**Importante:** corré primero `supabase/migrations/001_league_tables.sql`,
`002_managers_table.sql` y `003_rls_policies.sql`, en ese orden, antes de seguir estos
pasos — si no, las tablas destino no existen todavía.

## Paso 1: Exportar los datos actuales del admin

En el navegador donde el admin tiene los datos reales de la liga (la versión de la app
**antes** de este merge, con localStorage), abrir la consola del navegador y ejecutar:

```javascript
const keys = ['fc27_clubs', 'fc27_players', 'fc27_topics', 'fc27_matches',
  'fc27_transfers', 'fc27_transactions', 'fm_ticker_news',
  'fc27_competition_sections', 'fc27_budget_packages'];
const dump = Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)]));
copy(JSON.stringify(dump));
```

Esto copia el export al portapapeles. Pegarlo en un archivo `localstorage-export.json`
fuera del repo (por ejemplo en tu carpeta de scratch local).

## Paso 2: Crear la cuenta admin real

1. Abrir la app ya migrada (`npm run dev`), abrir el modal de **Inscripción de DT** y
   registrarte con tu email real y una contraseña — esto crea la cuenta en
   `auth.users` + una fila en `public.managers` con `role = 'manager'`.
2. En el SQL Editor de Supabase, promoverla a admin:

```sql
update public.managers set role = 'admin' where email = '<email del admin>';
```

3. Volver a loguearte (o refrescar la página) para que `AuthContext` recargue el
   perfil con `role = 'admin'`.

## Paso 3: Importar los datos exportados

Con el contenido de `localstorage-export.json` del Paso 1, para cada clave, correr en el
SQL Editor un `insert` como el siguiente (ejemplo para `clubs` — repetir el patrón para
las demás tablas, reemplazando el nombre de tabla y pegando el JSON correspondiente):

```sql
insert into public.clubs (key, data)
select value->>'id', value
from jsonb_array_elements('<contenido de fc27_clubs pegado acá>'::jsonb)
on conflict (key) do update set data = excluded.data;
```

Mapeo de clave localStorage → tabla → campo `key`:

| Clave localStorage | Tabla Supabase | Campo `key` |
|---|---|---|
| `fc27_clubs` | `clubs` | `id` |
| `fc27_players` | `players` | `id` |
| `fc27_topics` | `forum_topics` | `id` |
| `fc27_matches` | `matches` | `id` |
| `fc27_transfers` | `transfers` | `id` |
| `fc27_transactions` | `transactions` | `id` |
| `fm_ticker_news` | `ticker_news` | `id` |
| `fc27_competition_sections` | `competition_sections` | `tag` |
| `fc27_budget_packages` | `budget_packages` | `id` |

El `on conflict (key) do update` hace la importación idempotente (podés re-correrla sin
duplicar filas si algo falla a mitad de camino).

## Paso 4: Verificar los datos importados

```sql
select count(*) from public.clubs;
select count(*) from public.players;
select count(*) from public.forum_topics;
select count(*) from public.matches;
select count(*) from public.transfers;
select count(*) from public.transactions;
select count(*) from public.ticker_news;
select count(*) from public.competition_sections;
select count(*) from public.budget_packages;
```

Comparar cada conteo contra `JSON.parse(dump.<clave>).length` del export original.

## Paso 5: Confirmar en la app

Con el admin logueado con su cuenta real, abrir la app y verificar visualmente que la
tabla de posiciones, el foro y el historial de partidos coinciden con lo que había antes
de la migración.
