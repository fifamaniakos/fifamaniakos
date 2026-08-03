# Contexto obligatorio antes de tocar este proyecto

Pegá esto al principio de cualquier sesión (nueva o retomada) antes de pedir cambios.

## Ubicación de trabajo

- Trabajá **exclusivamente** en:
  `c:\Users\HP\.gemini\antigravity\scratch\fifamaniakos---liga-online-fc-27\.worktrees\backend-accounts-migration`
- Rama: `feature/backend-accounts-migration`
- **NUNCA** toques ni corras nada desde la carpeta principal del proyecto
  (`...\fifamaniakos---liga-online-fc-27`, sin `.worktrees\...`) — esa es una
  copia vieja sin la migración a Supabase. Si corrés `npm run dev` desde ahí
  por error, vas a ver la versión vieja de la app aunque el código nuevo esté
  bien.
- Antes de levantar `npm run dev`, verificá si ya hay un proceso escuchando en
  el puerto 3000 y confirmá que corre desde el **worktree correcto** (podés
  chequear con `Get-CimInstance Win32_Process -Filter "ProcessId = <pid>" |
  Select CommandLine` en PowerShell). Si es de la carpeta vieja, matalo y
  levantá el del worktree.

## Reglas de cambios

- **No revertir código sin entender por qué existe.** Si hay un comentario
  explicando una restricción (ej: "esto evita 403 de RLS"), leelo antes de
  tocar esa línea. Si un botón/función "no funciona", el problema casi nunca
  es la restricción en sí — es buscar la causa real.
- **No hagas commits sin avisar** en cambios que tocan permisos, RLS, quién
  puede hacer qué (`isAdmin`, `currentClubId`, políticas de Supabase). Explicá
  el cambio antes de aplicarlo.
- Siempre correr `npm run lint` (y `npm run build` si el cambio es grande)
  antes de dar algo por terminado.
- Revisá `git log --oneline -15` al empezar para saber qué se hizo en la
  sesión anterior antes de asumir que hace falta implementar algo de cero.

## Estado de la base de datos

- Proyecto Supabase: `hqybpfppqimssindwgns`.
- Las migraciones son archivos SQL en `supabase/migrations/`, se corren a
  mano en el SQL Editor de Supabase (no hay acceso MCP/CLI a la base desde
  este entorno). Antes de asumir que algo "no funciona en la base", preguntá
  si todas las migraciones (001 a la más reciente) ya se corrieron.
