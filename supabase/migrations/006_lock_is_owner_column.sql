-- Fix de seguridad: 005 dejaba `is_owner` modificable por cualquier cliente
-- autenticado. La policy "admin_update_managers" solo exige is_admin() en el
-- with check (no repite `not is_owner` contra la fila NUEVA), y la policy
-- preexistente "manager_update_own_row" (003) ni siquiera menciona la
-- columna. Resultado: un manager comun podia hacer
--   update(managers).set({ is_owner: true }).eq('user_id', miPropioId)
-- y auto-otorgarse la proteccion de fundador.
--
-- En vez de parchear cada policy (fragil: la proxima policy que se agregue
-- puede repetir el error), se bloquea el cambio a nivel de trigger: cualquier
-- UPDATE que llegue con sesion de usuario (auth.uid() no nulo, es decir, via
-- PostgREST/el cliente de Supabase) que intente modificar `is_owner` queda
-- revertido silenciosamente a su valor anterior. Las consultas ejecutadas
-- directamente en el SQL Editor (sin JWT, auth.uid() nulo) siguen pudiendo
-- marcar al owner manualmente.

create or replace function public.protect_is_owner_column()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.is_owner is distinct from old.is_owner and auth.uid() is not null then
    new.is_owner := old.is_owner;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_is_owner on public.managers;
create trigger protect_is_owner
  before update on public.managers
  for each row execute function public.protect_is_owner_column();

-- Defensa en profundidad adicional: pinnear search_path en la funcion
-- security definer de borrado (patron recomendado por los advisories de
-- Supabase/Postgres para evitar hijacking de search_path).
create or replace function public.admin_delete_manager(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_is_owner boolean;
begin
  if not public.is_admin() then
    raise exception 'Solo un administrador puede eliminar cuentas.';
  end if;

  select is_owner into target_is_owner from public.managers where user_id = target_user_id;

  if target_is_owner then
    raise exception 'No se puede eliminar la cuenta del creador de la liga.';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'No podés eliminar tu propia cuenta desde este panel.';
  end if;

  delete from auth.users where id = target_user_id;
end;
$$;
