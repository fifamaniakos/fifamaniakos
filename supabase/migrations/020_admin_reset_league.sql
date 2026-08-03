-- 020: reinicio total de la liga (solo admin).
--
-- Deja la liga como el dia cero: sin actas, sin fixture, sin mercado, sin
-- movimientos de dinero, sin plantillas, sin cuentas de managers y con todos
-- los clubes libres para volver a inscribirse.
--
-- POR QUE UNA RPC Y NO BORRAR DESDE EL CLIENTE
-- Un borrado desde el navegador queda sujeto a RLS tabla por tabla, se corta a
-- la mitad ante el primer rechazo y no puede tocar auth.users. Aca todo pasa
-- en UNA transaccion: o se reinicia entero, o no se reinicia nada.
--
-- DOS CANDADOS, porque esto no tiene vuelta atras:
--   1. Solo admin (is_admin()).
--   2. Hay que mandar la palabra exacta 'REINICIAR'.
--
-- QUE NO BORRA, a proposito:
--   * Las cuentas de admin y la del fundador (is_owner). Si se borraran, el
--     que ejecuta el reinicio se quedaria afuera de su propia liga.
--   * Los clubes en si: se conservan (nombre, escudo, estadio, division) y se
--     dejan como "Por Inscribir (Vacante)" con presupuesto inicial y
--     estadisticas en cero. Borrarlos dejaria la liga sin nada donde anotarse.
--   * El foro, el cartel de noticias y las secciones del reglamento.

create or replace function public.admin_reset_league(p_confirmacion text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_partidos      int := 0;
  v_jugadores     int := 0;
  v_transacciones int := 0;
  v_fichajes      int := 0;
  v_cuentas       int := 0;
  v_clubes        int := 0;
  v_borradas      int;
begin
  if not public.is_admin() then
    raise exception 'Solo un administrador puede reiniciar la liga.'
      using errcode = 'insufficient_privilege';
  end if;

  if p_confirmacion is distinct from 'REINICIAR' then
    raise exception 'Confirmacion invalida. Hay que escribir REINICIAR para continuar.'
      using errcode = 'check_violation';
  end if;

  -- 1. Actas, fixture, goleadores y tarjetas (todo vive dentro de matches).
  delete from public.matches;
  get diagnostics v_partidos = row_count;

  -- 2. Mercado de fichajes.
  delete from public.transfers;
  get diagnostics v_fichajes = row_count;

  -- 3. Movimientos de dinero.
  delete from public.transactions;
  get diagnostics v_transacciones = row_count;

  -- 4. Plantillas.
  delete from public.players;
  get diagnostics v_jugadores = row_count;

  -- 5. Registro de Drafts usados, para que todos puedan volver a sortear.
  delete from public.draft_claims;

  -- 6. Tablas opcionales: pueden no existir todavia (012/013 sin correr).
  --    Se borran contratos y pagos, no el catalogo de patrocinadores.
  if to_regclass('public.sponsor_payouts') is not null then
    execute 'delete from public.sponsor_payouts';
  end if;
  if to_regclass('public.club_sponsor_contracts') is not null then
    execute 'delete from public.club_sponsor_contracts';
  end if;

  -- 7. Estado de suscripciones: las cuentas se van, asi que su estado de pago
  --    tambien. Si preferis conservarlo, comenta este bloque.
  if to_regclass('public.gamertag_subscriptions') is not null then
    execute 'delete from public.gamertag_subscriptions';
  end if;

  -- 8. Cuentas de managers. Se conservan admins y fundador: sin esto, el que
  --    ejecuta el reinicio se borra a si mismo. El borrado en auth.users
  --    arrastra la fila de managers por el `on delete cascade` de 002.
  delete from auth.users u
   using public.managers m
   where m.user_id = u.id
     and m.role <> 'admin'
     and coalesce(m.is_owner, false) = false;
  get diagnostics v_cuentas = row_count;

  -- Los admins que sobreviven quedan sin club asignado.
  update public.managers set club_id = null where club_id is not null;

  -- 9. Clubes: vuelven a estar libres, con presupuesto inicial y la tabla en
  --    cero. Se conserva la identidad (nombre, escudo, estadio, division).
  update public.clubs
     set data = data || jsonb_build_object(
       'manager',      'Por Inscribir (Vacante)',
       'gamertag',     '@Por Inscribir',
       'budget',       100000000,
       'played',       0,
       'won',          0,
       'drawn',        0,
       'lost',         0,
       'goalsFor',     0,
       'goalsAgainst', 0,
       'points',       0,
       'form',         '[]'::jsonb
     );
  get diagnostics v_clubes = row_count;

  -- 10. Temporada 1 y Draft cerrado.
  update public.seasons
     set data = data || jsonb_build_object('currentSeasonNumber', 1, 'draftOpen', false)
   where key = 'current';

  return jsonb_build_object(
    'partidos_borrados',      v_partidos,
    'jugadores_borrados',     v_jugadores,
    'transacciones_borradas', v_transacciones,
    'fichajes_borrados',      v_fichajes,
    'cuentas_borradas',       v_cuentas,
    'clubes_liberados',       v_clubes
  );
end;
$$;

-- Solo un usuario logueado puede intentarlo; adentro se verifica que sea admin.
revoke all on function public.admin_reset_league(text) from public, anon;
grant execute on function public.admin_reset_league(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Uso desde el SQL Editor (equivalente al boton del Panel):
--   select public.admin_reset_league('REINICIAR');
--
-- Verificacion posterior:
--   select count(*) from public.matches;       -- 0
--   select count(*) from public.players;       -- 0
--   select count(*) from public.transactions;  -- 0
--   select count(*) from public.transfers;     -- 0
--   select email, role, is_owner, club_id from public.managers;  -- solo admins
--   select data->>'manager', data->>'budget' from public.clubs limit 5;
-- ---------------------------------------------------------------------------
