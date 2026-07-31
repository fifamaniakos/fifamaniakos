# Pestaña de Cuentas/DTs en el Panel de Administrador

> **For agentic workers:** REQUIRED SUB-SKILL: usar superpowers:writing-plans para convertir este spec en un plan de implementación tarea por tarea.

**Goal:** Darle al admin visibilidad de los DTs registrados (email, gamertag, plataforma,
club vinculado, rol) desde una pestaña nueva en `AdminPanel`, con acciones básicas para
promover/degradar el rol y eliminar una cuenta — sin depender del SQL Editor de Supabase
para el día a día. El creador de la liga (owner) queda protegido a nivel de base de
datos contra degradación o eliminación por parte de otros admins.

**Contexto:** Esta es una extensión post-migración del trabajo de
`docs/superpowers/plans/2026-07-30-backend-accounts-migration.md`. La tabla `managers` y
sus políticas RLS ya existen (`supabase/migrations/001-004`); este spec agrega una
columna de protección de owner y una función de borrado con privilegios elevados, más la
UI para consumir todo esto.

---

## Diseño

### 1. Columna `is_owner` en `managers`

`alter table public.managers add column is_owner boolean not null default false;`

Se setea a `true` manualmente vía SQL Editor solo para la cuenta del creador de la liga
(`dimenzajp33@gmail.com`), fuera de cualquier flujo de la app. No hay UI para asignar o
quitar este flag — es deliberadamente inaccesible desde el cliente.

### 2. Protección del owner en las políticas RLS

Las políticas existentes `admin_update_managers` (Task 5) se reemplazan para exigir que
la fila objetivo no sea el owner:

```sql
drop policy if exists "admin_update_managers" on public.managers;
create policy "admin_update_managers" on public.managers for update
  using (public.is_admin() and not is_owner)
  with check (public.is_admin());
```

Esto bloquea, a nivel de base de datos, que cualquier admin (incluido uno promovido
recientemente) modifique la fila del owner — sin importar qué haga el frontend.

### 3. Función `admin_delete_manager` (borrado con privilegios elevados)

El cliente no puede borrar filas de `auth.users` directamente (no hay policy RLS que
alcance esa tabla desde el rol `authenticated`). Se agrega una función `security definer`
que:
- Valida que quien llama es admin (`public.is_admin()`).
- Valida que el objetivo no sea el owner (`not is_owner`, y no sea uno mismo — no tiene
  sentido "eliminar mi propia cuenta" desde este botón).
- Borra de `auth.users` (arrastra la fila de `managers` por `on delete cascade`).

```sql
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
```

El club que tenía asignado el manager eliminado **no se toca** — sigue existiendo con
sus datos tal cual, solo queda sin `manager` vinculado en `managers` (la fila de `clubs`
en sí no tiene FK a `managers`, así que no hay nada que limpiar ahí).

### 4. UI: nueva pestaña "Cuentas" en `AdminPanel.tsx`

- Se agrega `'cuentas'` al union type de `adminTab` y un botón más en la barra de tabs
  existente (mismo patrón visual que `CLUBES`, `ACTAS`, etc.).
- Al activar la pestaña, se hace un fetch único (`supabase.from('managers').select('*')`,
  sin realtime — es una vista de administración que se abre puntualmente, no necesita
  sincronización en vivo) y se guarda en un `useState` local del componente.
- Tabla con columnas: Email, Gamertag, Plataforma, Club vinculado (resuelto contra la
  prop `clubs` ya existente por `club_id`), Rol, Creado el.
- Fila del owner: insignia "Fundador" en vez de los botones de acción (ocultos, no
  deshabilitados — evita la tentación de "probar igual").
- Resto de filas: toggle Rol (admin ⇄ manager, vía
  `supabase.from('managers').update({ role: nuevoRol }).eq('user_id', id)`, protegido
  igual por la policy `admin_update_managers`) y botón "Eliminar cuenta" (con
  confirmación `confirm()`, llama a `supabase.rpc('admin_delete_manager', { target_user_id: id })`
  y refresca la lista local).

### Fuera de alcance

- No hay edición de gamertag/plataforma/email desde este panel (son inmutables por
  diseño de la tabla `managers` en el spec original).
- No hay paginación — la liga es acotada (36 clubes de 1ra + eventuales suplentes), una
  tabla simple alcanza.
- No se agrega un rol "owner" separado en el enum `role` (sigue siendo `admin`/`manager`);
  `is_owner` es un flag de protección, no un tercer rol funcional.

---

## Archivos afectados

- `supabase/migrations/005_owner_protection_and_admin_delete.sql` (nuevo)
- `src/components/AdminPanel.tsx` (nueva pestaña, tabla, acciones)

## Testing

Sin suite automatizada en el proyecto (igual que el resto de la app). Verificación
manual:
1. Como owner, ver la pestaña "Cuentas" y confirmar que la propia fila muestra "Fundador"
   sin botones de acción.
2. Promover un manager de prueba a admin desde el toggle; loguearse con esa cuenta y
   confirmar que **no** puede degradar ni eliminar al owner (ni el botón aparece, ni un
   intento manual vía consola del navegador con `supabase.rpc(...)` contra el owner
   debería tener éxito — la policy/función lo rechaza).
3. Eliminar la cuenta de prueba desde el panel y confirmar que desaparece de `managers`
   y de la lista de `auth.users`, mientras que su club sigue intacto en `clubs`.
