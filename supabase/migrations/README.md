# Migraciones SQL manuales

El conector MCP de Supabase no está disponible en esta sesión de Claude Code, así que
estas migraciones no se aplicaron automáticamente (a diferencia de lo que asume el plan
en `docs/superpowers/plans/2026-07-30-backend-accounts-migration.md`). Correlas a mano,
en este orden, en el **SQL Editor** del proyecto `hqybpfppqimssindwgns`:

1. `001_league_tables.sql` — tablas de liga (patrón `key`/`data`) + Realtime.
2. `002_managers_table.sql` — tabla `managers` (cuentas reales).
3. `003_rls_policies.sql` — Row Level Security y políticas de admin/manager.

Después de correrlas, verificar en el dashboard (Table Editor → 12 tablas en `public`,
Authentication → Policies → RLS habilitado en todas) o pedirme que lo confirme una vez
que el conector MCP esté disponible en esta sesión.
