-- 021: arreglar admin_reset_league, que fallaba con "DELETE requires a WHERE clause".
--
-- Supabase deja activa la proteccion `safeupdate` para los roles de la API:
-- cualquier DELETE o UPDATE sin WHERE se rechaza, para que un borrado masivo
-- accidental no se lleve una tabla entera. 020 borraba tablas completas
-- (`delete from public.matches;`) y por eso no llegaba a ejecutarse.
--
-- La proteccion es correcta y no se desactiva: se le da a cada borrado una
-- condicion explicita. Todas las tablas tienen `key` como clave primaria (o
-- `gamertag` en draft_claims), asi que `where <pk> is not null` alcanza y deja
-- por escrito que el borrado es total y a proposito.

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
  delete from public.matches where key is not null;
  get diagnostics v_partidos = row_count;

  -- 2. Mercado de fichajes.
  delete from public.transfers where key is not null;
  get diagnostics v_fichajes = row_count;

  -- 3. Movimientos de dinero.
  delete from public.transactions where key is not null;
  get diagnostics v_transacciones = row_count;

  -- 4. Plantillas.
  delete from public.players where key is not null;
  get diagnostics v_jugadores = row_count;

  -- 5. Registro de Drafts usados, para que todos puedan volver a sortear.
  delete from public.draft_claims where gamertag is not null;

  -- 6. Tablas opcionales: pueden no existir todavia (012/013 sin correr).
  --    Se borran contratos y pagos, no el catalogo de patrocinadores.
  if to_regclass('public.sponsor_payouts') is not null then
    execute 'delete from public.sponsor_payouts where true';
  end if;
  if to_regclass('public.club_sponsor_contracts') is not null then
    execute 'delete from public.club_sponsor_contracts where true';
  end if;

  -- 7. Estado de suscripciones: las cuentas se van, asi que su estado de pago
  --    tambien. Si preferis conservarlo, comenta este bloque.
  if to_regclass('public.gamertag_subscriptions') is not null then
    execute 'delete from public.gamertag_subscriptions where true';
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
     )
   where key is not null;
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

-- ---------------------------------------------------------------------------
-- OJO: el borrado de draft_claims que hace el boton "Reset Draft" del modulo
-- de Sorteo va por PostgREST con `.eq('season_number', ...)`, asi que ya lleva
-- WHERE y no le afecta esta proteccion.
-- ---------------------------------------------------------------------------
