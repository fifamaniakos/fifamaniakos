-- Task 4/5 fix: el insert en managers durante el signup fallaba con
-- "new row violates row-level security policy" porque, con confirmacion de
-- email activada, supabase.auth.signUp() no deja sesion activa de inmediato
-- (auth.uid() es null), y la policy manager_insert_own_row exige `to authenticated`.
--
-- Solucion: un trigger SECURITY DEFINER en auth.users que crea la fila de
-- managers con privilegios elevados (bypassea RLS), sin depender de que el
-- cliente tenga sesion. Tambien se agrega una funcion RPC para el chequeo de
-- gamertag duplicado, que antes fallaba silenciosamente por el mismo motivo
-- (el select anonimo a managers no devuelve filas por RLS).

create or replace function public.gamertag_taken(p_gamertag text, p_platform text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.managers
    where gamertag = p_gamertag and platform = p_platform
  );
$$;

grant execute on function public.gamertag_taken(text, text) to anon, authenticated;

create or replace function public.handle_new_manager()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.managers (user_id, email, gamertag, platform, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'gamertag',
    new.raw_user_meta_data->>'platform',
    'manager'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_manager();
