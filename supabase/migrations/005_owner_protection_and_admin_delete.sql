-- Task 5/5: proteger al owner de la liga y permitir borrado de cuentas por un admin.

alter table public.managers add column is_owner boolean not null default false;

drop policy if exists "admin_update_managers" on public.managers;
create policy "admin_update_managers" on public.managers for update
  using (public.is_admin() and not is_owner)
  with check (public.is_admin());

create or replace function public.admin_delete_manager(target_user_id uuid)
returns void
language plpgsql
security definer
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

grant execute on function public.admin_delete_manager(uuid) to authenticated;

-- Ejecutar UNA vez, manualmente, para marcar la cuenta del creador de la liga:
-- update public.managers set is_owner = true where email = '<email del owner>';
