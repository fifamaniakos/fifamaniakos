-- 014: Cerrar la escritura directa de dinero y de la tabla de posiciones.
--
-- PROBLEMA
-- La policy "manager_update_own_club" (003) solo valida que la fila sea la del
-- manager:
--     using      (data->>'id' = public.current_manager_club_id())
--     with check (data->>'id' = public.current_manager_club_id())
-- Como el club entero vive dentro de `data` (jsonb), esa comprobacion no dice
-- nada sobre el resto de los campos. Un manager autenticado podia hacer, desde
-- la consola del navegador:
--     supabase.from('clubs')
--       .update({ data: { ...miClub, budget: 999999999, points: 99 } })
--       .eq('key', miClubId)
-- y auto-acreditarse dinero, ademas de falsear puntos, goles y division.
--
-- Todo el cuidado de 011 (RPC `security definer` que reciben identificadores y
-- no montos) quedaba puenteado, porque el camino de escritura directa a la
-- tabla seguia abierto en paralelo.
--
-- ENFOQUE
-- El mismo que 006 uso para `is_owner`: no se parchea policy por policy
-- (fragil, la proxima policy repite el error) sino que se bloquea a nivel de
-- trigger, que se aplica a toda escritura sin importar que policy la habilito.
--
-- Los RPC legitimos se distinguen con un parametro de configuracion propio
-- declarado en la propia funcion (`alter function ... set`). Postgres lo activa
-- al entrar a la funcion y lo restaura al salir, asi que no hace falta tocar
-- ni una linea del cuerpo de los RPC de 011/013 (menos riesgo de romperlos) y
-- el flag no puede quedar "pegado" en la sesion.
--
-- Un cliente no puede activar ese flag por su cuenta: PostgREST no expone SET.

-- ---------------------------------------------------------------------------
-- 1. Defensa en profundidad: pinnear search_path en las funciones de 003.
--    005 y 006 ya lo hacen; estas dos quedaron sin el.
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.managers
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.current_manager_club_id()
returns text
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select club_id from public.managers where user_id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- 2. UPDATE: un manager no puede mover ni el dinero ni la tabla de posiciones.
--
--    No se rechaza la escritura con un error: se revierten silenciosamente los
--    campos protegidos a su valor anterior, igual que hace 006 con is_owner.
--    Esto es intencional, porque useSupabaseTable manda SIEMPRE el objeto
--    completo: si el manager edita el nombre del estadio, el upsert incluye
--    igual `budget` y `points`. Rechazar con error romperia esa edicion
--    legitima; revertir deja pasar el cambio real e ignora el resto.
--    Efecto secundario deseable: si el cliente tenia datos viejos, la revision
--    evita que pise un presupuesto que un RPC actualizo mientras tanto.
-- ---------------------------------------------------------------------------

create or replace function public.protect_club_economy()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  campo text;
begin
  -- Llamada desde un RPC autorizado (ver bloque 4).
  if coalesce(current_setting('app.club_economy_write', true), '') = 'on' then
    return new;
  end if;

  -- Sin JWT (SQL Editor) o admin de la liga: se permite.
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  foreach campo in array array[
    'budget',
    'points', 'played', 'won', 'drawn', 'lost',
    'goalsFor', 'goalsAgainst', 'form',
    'division'
  ] loop
    if old.data ? campo then
      -- jsonb_set con un valor SQL NULL devuelve NULL para todo el objeto; por
      -- eso se pregunta primero si la clave existia.
      new.data := jsonb_set(new.data, array[campo], old.data -> campo, true);
    else
      -- Tampoco puede introducir un campo protegido que antes no estaba.
      new.data := new.data - campo;
    end if;
  end loop;

  return new;
end;
$$;

drop trigger if exists protect_club_economy on public.clubs;
create trigger protect_club_economy
  before update on public.clubs
  for each row execute function public.protect_club_economy();

-- ---------------------------------------------------------------------------
-- 3. INSERT: la policy "manager_insert_own_club" (003) solo exige que el id no
--    sea nulo, asi que cualquier autenticado podia crear un club con el
--    presupuesto, la division y los puntos que quisiera. Se fuerzan los valores
--    de alta (los mismos que usa el cliente al inscribir: App.tsx).
-- ---------------------------------------------------------------------------

create or replace function public.enforce_new_club_defaults()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if coalesce(current_setting('app.club_economy_write', true), '') = 'on' then
    return new;
  end if;

  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  new.data := new.data || jsonb_build_object(
    'budget',        100000000,
    'played',        0,
    'won',           0,
    'drawn',         0,
    'lost',          0,
    'goalsFor',      0,
    'goalsAgainst',  0,
    'points',        0,
    'form',          '[]'::jsonb
  );

  return new;
end;
$$;

drop trigger if exists enforce_new_club_defaults on public.clubs;
create trigger enforce_new_club_defaults
  before insert on public.clubs
  for each row execute function public.enforce_new_club_defaults();

-- ---------------------------------------------------------------------------
-- 4. Autorizar a los RPC que SI tienen que mover dinero.
--
--    IMPORTANTE: sin este bloque el trigger del punto 2 revierte los pagos y
--    los traspasos dejan de funcionar. Si alguna funcion no existe todavia
--    (012/013 pueden no estar corridas), se avisa y hay que volver a ejecutar
--    ESTE bloque despues de crearla.
-- ---------------------------------------------------------------------------

do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public.complete_market_transfer(text, text)',
    'public.complete_direct_transfer(text, text, numeric)',
    'public.sign_free_agent_player(jsonb, text, numeric)',
    'public.settle_sponsor_payout(text, integer, text)'
  ] loop
    if to_regprocedure(fn) is not null then
      execute format('alter function %s set "app.club_economy_write" = ''on''', fn);
      raise notice 'OK: flag aplicado a %', fn;
    else
      raise warning 'FALTA: % no existe todavia. Corre su migracion y volve a ejecutar el bloque 4 de 014.', fn;
    end if;
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Verificacion posterior (correr a mano, con una sesion de manager comun).
--
--    a) El agujero quedo cerrado: el update no da error, pero el presupuesto
--       NO cambia.
--         update public.clubs
--            set data = jsonb_set(data, '{budget}', to_jsonb(999999999))
--          where key = '<id-de-mi-club>';
--         select data->>'budget' from public.clubs where key = '<id-de-mi-club>';
--
--    b) Los traspasos siguen funcionando: comprar un jugador desde la app y
--       confirmar que el presupuesto del comprador baja y el del vendedor sube.
--       Si (b) falla, es que el bloque 4 no encontro alguna funcion.
--
--    c) Confirmar que quedaron los dos triggers:
--         select tgname from pg_trigger
--          where tgrelid = 'public.clubs'::regclass and not tgisinternal;
--
-- ---------------------------------------------------------------------------
-- LO QUE ESTA MIGRACION NO RESUELVE (decision pendiente)
--
--    "manager_insert_own_players" (010) permite a un manager insertar cualquier
--    jugador en su propio club sin pasar por sign_free_agent_player(), que es
--    la RPC que cobra el fichaje. Es decir: el pago sigue siendo opcional.
--
--    NO se toca aca a proposito. Esa policy existe por un motivo legitimo y
--    documentado en 010: sin ella el Draft se rompe, y el Draft reparte
--    jugadores gratis por diseno y lo puede usar un manager comun para su
--    propio club (App.tsx, pestana 'sorteo'). Bloquear el INSERT directo
--    romperia esa pantalla.
--
--    El arreglo correcto necesita que la base sepa cuando el Draft esta
--    abierto (por ejemplo un flag en `seasons`) y permitir el INSERT gratis
--    solo en esa ventana, o mover la asignacion del Draft a una RPC.
--    Requiere decidir la regla de negocio primero.
-- ---------------------------------------------------------------------------
