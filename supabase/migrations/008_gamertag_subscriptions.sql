-- Sub-proyecto suscripciones: Temporada 1 gratis para todos; desde la
-- Temporada 2 se cobra USD 8/mes. Todavia no hay pasarela de pago conectada
-- -- por ahora `status` lo cambia el admin a mano desde el panel (Cuentas)
-- hasta que se integre un cobro real.
--
-- OJO: el estado de suscripcion se rastrea por (gamertag, platform), NO por
-- `managers.user_id` ni por email. Si se colgara del user_id, un DT al que
-- se le vence la suscripcion podria simplemente registrar una cuenta nueva
-- con otro email -- la fila de manager nueva arrancaria "sin suscripcion
-- marcada" en cualquiera de los dos sentidos, pero mas importante: cualquier
-- historial de pago/estado quedaria perdido y atado a una cuenta que ya no
-- se usa. Ademas, `gamertag_taken()` (004) ya impide registrar dos cuentas
-- con el mismo gamertag+plataforma mientras la fila anterior exista, asi que
-- el gamertag es el identificador estable del "DT real" -- se cuelga la
-- suscripcion de ahi.

create table public.gamertag_subscriptions (
  gamertag text not null,
  platform text not null,
  status text not null default 'inactive',
  updated_at timestamptz not null default now(),
  primary key (gamertag, platform)
);

alter table public.gamertag_subscriptions enable row level security;

-- Cualquier usuario logueado puede leer (necesario para que cada manager
-- pueda calcular si el a el le toca pagar); solo el admin puede escribir.
create policy "authenticated_read_gamertag_subscriptions"
  on public.gamertag_subscriptions for select
  to authenticated using (true);

create policy "admin_all_gamertag_subscriptions"
  on public.gamertag_subscriptions for all
  using (public.is_admin())
  with check (public.is_admin());
