-- Task 10: Permitir a un manager insertar y eliminar jugadores de su propio club
-- Correr DESPUES de 003_rls_policies.sql
--
-- 003 solo agrego "manager_update_own_players" (UPDATE). Sin politicas de
-- INSERT/DELETE para managers, un manager no podia:
--   - Recibir jugadores del Draft (INSERT)
--   - Usar "Anadir Jugador" en Mi Club (INSERT)
--   - Eliminar/vender un jugador de su plantilla (DELETE)
-- Esas escrituras se rechazaban por RLS sin aviso visible mas alla del
-- mensaje generico de useSupabaseTable, y el estado local se revertia solo.

create policy "manager_insert_own_players" on public.players for insert
  to authenticated
  with check (club_id = public.current_manager_club_id());

create policy "manager_delete_own_players" on public.players for delete
  to authenticated
  using (club_id = public.current_manager_club_id());
