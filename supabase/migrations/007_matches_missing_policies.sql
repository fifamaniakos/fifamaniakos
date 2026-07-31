-- Fix de seguridad/funcionalidad: a "matches" (a diferencia del resto de las
-- tablas, que usan "for all" para el admin) le faltaban dos politicas:
--
-- 1. INSERT para admin: sin esto, "Generar Fixtures" desde el Panel de Admin
--    fallaba silenciosamente contra RLS (el fixture se veia en la UI de forma
--    optimista pero nunca se guardaba en la base).
-- 2. UPDATE para manager sobre sus propios partidos PENDIENTES: los partidos
--    se pre-generan como filas PENDIENTE; cuando un manager "carga un acta",
--    en realidad esta actualizando esa fila existente, no insertando una
--    nueva. La policy manager_insert_own_matches (003) solo cubre el INSERT,
--    nunca el UPDATE, asi que cargar un resultado fallaba siempre para
--    cualquier manager no-admin.
--
-- El with check de la policy de manager fuerza que el estado se mantenga en
-- PENDIENTE despues del update (un manager puede completar el marcador, pero
-- solo un admin puede pasarlo a CONFIRMADO via admin_update_matches).

create policy "admin_insert_matches" on public.matches for insert
  with check (public.is_admin());

create policy "manager_update_own_pending_matches" on public.matches for update
  to authenticated
  using (
    (home_club_id = public.current_manager_club_id() or away_club_id = public.current_manager_club_id())
    and status = 'PENDIENTE'
  )
  with check (
    (home_club_id = public.current_manager_club_id() or away_club_id = public.current_manager_club_id())
    and status = 'PENDIENTE'
  );
