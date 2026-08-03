-- 022: el control del Draft solo debe mirar ALTAS de jugadores, no ediciones.
--
-- EL BUG
-- useSupabaseTable guarda con `upsert`, que en Postgres es
-- `INSERT ... ON CONFLICT (key) DO UPDATE`. Un trigger BEFORE INSERT se dispara
-- ANTES de que Postgres detecte el conflicto, asi que tambien corria cuando la
-- fila ya existia y la operacion terminaba siendo un UPDATE.
--
-- Resultado: a un DT que ya habia usado su Draft, el trigger le rechazaba
-- cualquier modificacion de sus propios jugadores -- poner el valor de mercado,
-- cambiar la alineacion, marcar un jugador como vendido -- con el mensaje
-- "Ya usaste tu Draft en la temporada 1", que ademas no tenia nada que ver con
-- lo que estaba haciendo.
--
-- LA CORRECCION
-- Si ya existe una fila con ese `key`, esto no es un alta: es la parte INSERT
-- de un upsert que va a terminar en UPDATE. Se deja pasar sin mirar el Draft.
-- El limite sigue valiendo para jugadores nuevos, que es lo unico que el Draft
-- reparte gratis.

create or replace function public.enforce_draft_claim()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_gamertag text;
  v_platform text;
  v_season   int;
  v_claim    public.draft_claims%rowtype;
begin
  -- Modificacion de un jugador que ya existe (upsert que terminara en UPDATE):
  -- no es un alta, el Draft no tiene nada que decir aca.
  if exists (select 1 from public.players p where p.key = new.key) then
    return new;
  end if;

  -- Solo se restringe lo que llega desde el navegador. Dentro de un RPC
  -- `security definer` (ej: sign_free_agent_player, que SI cobra) current_user
  -- es el dueno de la funcion, asi que los fichajes pagos no pasan por aca.
  --
  -- Para que esta comparacion signifique algo, esta funcion NO puede ser
  -- `security definer` (ese fue el bug de 015).
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  select i.gamertag, i.platform into v_gamertag, v_platform
    from public.current_manager_identity() i;

  if v_gamertag is null then
    raise exception 'Tu cuenta no tiene un gamertag asociado.'
      using errcode = 'check_violation';
  end if;

  if not public.is_draft_open() then
    raise exception 'El Draft esta cerrado. Para incorporar jugadores usa el mercado de fichajes.'
      using errcode = 'check_violation';
  end if;

  v_season := public.current_season_number();

  -- Por DT, no por club: cambiar de club no da un Draft nuevo.
  select * into v_claim
    from public.draft_claims
   where gamertag = v_gamertag
     and platform = v_platform
     and season_number = v_season;

  if found then
    -- El Draft inserta las ~22 filas en una sola sentencia: si el registro es
    -- de ESTA misma transaccion, es el resto de la misma plantilla.
    if v_claim.claimed_tx <> txid_current() then
      raise exception 'Ya usaste tu Draft en la temporada %. Pedile al admin que te lo rehaga.', v_season
        using errcode = 'check_violation';
    end if;
  else
    perform public.claim_draft();
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Verificacion
--
--   a) Un DT que ya uso su Draft tiene que poder editar sus jugadores:
--      cambiar el valor de mercado desde Mi Club, alinear, poner en venta.
--
--   b) Y NO tiene que poder sortear una plantilla nueva: el boton sigue
--      apagado y, si se fuerza, la base responde "Ya usaste tu Draft".
--
--   c) Los fichajes pagos del mercado siguen funcionando (van por RPC).
-- ---------------------------------------------------------------------------
