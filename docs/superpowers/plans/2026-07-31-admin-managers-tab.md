# Admin Managers Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Cuentas" tab to `AdminPanel` that lists registered managers (email,
gamertag, platform, linked club, role) with role-toggle and delete-account actions,
while protecting the league's owner account from being demoted or deleted by any other
admin — enforced in the database, not just the UI.

**Architecture:** One new SQL migration adds an `is_owner` column to `managers`,
tightens the `admin_update_managers` RLS policy to exclude owner rows, and adds a
`security definer` RPC (`admin_delete_manager`) for account deletion (client can't
delete `auth.users` rows directly). `AdminPanel.tsx` gets a new tab that fetches
`managers` once on activation and renders a table with the two actions.

**Tech Stack:** Supabase (Postgres RLS + RPC), React 19, `@supabase/supabase-js`.

Ref: `docs/superpowers/specs/2026-07-31-admin-managers-tab-design.md`

---

### Task 1: Migración SQL — `is_owner`, policy y función de borrado

**Files:**
- Create: `supabase/migrations/005_owner_protection_and_admin_delete.sql`

- [ ] **Step 1: Escribir la migración**

```sql
-- Task: proteger al owner de la liga y permitir borrado de cuentas por un admin.

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
```

- [ ] **Step 2: Instrucción manual para marcar al owner**

Anotar en un comentario al final del archivo (no ejecutable, solo referencia) el UPDATE
que el usuario debe correr manualmente una sola vez, reemplazando el email real:

```sql
-- Ejecutar UNA vez, manualmente, para marcar la cuenta del creador de la liga:
-- update public.managers set is_owner = true where email = '<email del owner>';
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/005_owner_protection_and_admin_delete.sql
git commit -m "docs: add SQL migration for owner protection and admin account deletion"
```

---

### Task 2: Tab "Cuentas" — estado, fetch y botón de navegación

**Files:**
- Modify: `src/components/AdminPanel.tsx`

- [ ] **Step 1: Importar `supabase`, `useEffect` y el ícono `Users`**

La primera línea del archivo es actualmente:

```typescript
import React, { useState } from 'react';
```

Reemplazarla por:

```typescript
import React, { useState, useEffect } from 'react';
```

En el bloque de imports de lucide-react (arriba del archivo), agregar `Users` a la lista
existente:

```typescript
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Trophy,
  MessageSquare,
  DollarSign,
  Trash2,
  Edit3,
  PlusCircle,
  Pin,
  CheckCircle2,
  XCircle,
  Megaphone,
  Save,
  Plus,
  Radio,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Globe,
  Users
} from 'lucide-react';
```

Y agregar, junto al resto de imports relativos (cerca de `import { Modal } from './Modal';`):

```typescript
import { supabase } from '../lib/supabaseClient';
```

- [ ] **Step 2: Ampliar el union type de `adminTab`**

Ubicar la línea (dentro del componente, cerca del inicio):

```typescript
const [adminTab, setAdminTab] = useState<'cartel' | 'clubes' | 'partidos' | 'foro' | 'fichajes' | 'anuncios'>('cartel');
```

Y reemplazarla por:

```typescript
const [adminTab, setAdminTab] = useState<'cartel' | 'clubes' | 'partidos' | 'foro' | 'fichajes' | 'anuncios' | 'cuentas'>('cartel');
```

- [ ] **Step 3: Agregar el tipo y el estado de la lista de managers**

Justo debajo de la línea de `adminTab` del Step 2, agregar:

```typescript
interface ManagerRow {
  user_id: string;
  email: string;
  gamertag: string;
  platform: string;
  club_id: string | null;
  role: 'admin' | 'manager';
  is_owner: boolean;
  created_at: string;
}
```

(Nota: esta interface va **fuera** del cuerpo del componente, arriba de
`export const AdminPanel`, junto a `AdminPanelProps` — no dentro de la función.)

Y dentro del componente, junto al resto de los `useState`:

```typescript
const [managers, setManagers] = useState<ManagerRow[]>([]);
const [managersLoaded, setManagersLoaded] = useState(false);
const [managerActionError, setManagerActionError] = useState<string | null>(null);

const fetchManagers = async () => {
  const { data, error } = await supabase
    .from('managers')
    .select('user_id, email, gamertag, platform, club_id, role, is_owner, created_at')
    .order('created_at', { ascending: true });
  if (!error && data) {
    setManagers(data as ManagerRow[]);
  }
  setManagersLoaded(true);
};

useEffect(() => {
  if (adminTab === 'cuentas' && !managersLoaded) {
    fetchManagers();
  }
}, [adminTab, managersLoaded]);
```

- [ ] **Step 4: Agregar el botón de la pestaña**

Ubicar el bloque de botones de navegación (después del botón de `'anuncios'`, antes del
`</div>` que cierra `{/* Admin Sub-navigation Tabs */}`):

```jsx
        <button
          onClick={() => setAdminTab('anuncios')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase font-tech flex items-center gap-2 transition-all ${
            adminTab === 'anuncios'
              ? 'bg-[#00ba68] text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Anuncio Oficial
        </button>

        <button
          onClick={() => setAdminTab('cuentas')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase font-tech flex items-center gap-2 transition-all ${
            adminTab === 'cuentas'
              ? 'bg-[#00ba68] text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <Users className="w-4 h-4" /> Cuentas ({managers.length})
        </button>
      </div>
```

- [ ] **Step 5: Verificar tipos**

Run: `npm run lint`
Expected: sin errores (el tab de contenido todavía no existe, pero el botón y el estado
ya deberían compilar).

- [ ] **Step 6: Commit**

```bash
git add src/components/AdminPanel.tsx
git commit -m "feat: add Cuentas tab navigation and managers fetch to AdminPanel"
```

---

### Task 3: Tabla de managers con acciones (rol y borrado)

**Files:**
- Modify: `src/components/AdminPanel.tsx`

- [ ] **Step 1: Agregar los handlers de acción**

Junto al resto de los handlers del componente (por ejemplo cerca de `fetchManagers` del
Task 2), agregar:

```typescript
const handleToggleManagerRole = async (manager: ManagerRow) => {
  const newRole = manager.role === 'admin' ? 'manager' : 'admin';
  setManagerActionError(null);
  const { error } = await supabase
    .from('managers')
    .update({ role: newRole })
    .eq('user_id', manager.user_id);
  if (error) {
    setManagerActionError(error.message);
    return;
  }
  setManagers(prev => prev.map(m => m.user_id === manager.user_id ? { ...m, role: newRole } : m));
};

const handleDeleteManager = async (manager: ManagerRow) => {
  if (!confirm(`¿Eliminar la cuenta de ${manager.email} (${manager.gamertag})? Esta acción no se puede deshacer.`)) {
    return;
  }
  setManagerActionError(null);
  const { error } = await supabase.rpc('admin_delete_manager', { target_user_id: manager.user_id });
  if (error) {
    setManagerActionError(error.message);
    return;
  }
  setManagers(prev => prev.filter(m => m.user_id !== manager.user_id));
};
```

- [ ] **Step 2: Agregar el bloque de contenido de la pestaña**

Ubicar el cierre del bloque `{adminTab === 'anuncios' && ( ... )}` (termina con `)}` justo
antes del comentario `{/* Modal: Inscribir Nuevo Club (Admin) */}`) y agregar, inmediatamente
después de ese `)}`:

```jsx
      {/* TAB 7: CUENTAS DE MANAGERS */}
      {adminTab === 'cuentas' && (
        <div className="fc-card p-6 rounded-2xl border-slate-200 space-y-6 shadow-md">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-display font-extrabold text-xl text-slate-900 uppercase italic flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-700" /> Cuentas de DTs Registrados
            </h2>
            <p className="text-xs text-slate-500 font-tech mt-1">
              Gestioná el rol de los managers registrados. La cuenta del Fundador de la
              liga está protegida y no puede modificarse desde aquí.
            </p>
          </div>

          {managerActionError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-tech">
              {managerActionError}
            </div>
          )}

          {!managersLoaded ? (
            <p className="text-xs text-slate-500 font-tech">Cargando cuentas...</p>
          ) : managers.length === 0 ? (
            <p className="text-xs text-slate-500 font-tech">Todavía no hay DTs registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-tech">
                <thead>
                  <tr className="text-left text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Gamertag</th>
                    <th className="py-2 pr-3">Plataforma</th>
                    <th className="py-2 pr-3">Club</th>
                    <th className="py-2 pr-3">Rol</th>
                    <th className="py-2 pr-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map(manager => {
                    const linkedClub = clubs.find(c => c.id === manager.club_id);
                    return (
                      <tr key={manager.user_id} className="border-b border-slate-100">
                        <td className="py-2 pr-3 font-semibold text-slate-800">{manager.email}</td>
                        <td className="py-2 pr-3">{manager.gamertag}</td>
                        <td className="py-2 pr-3">{manager.platform}</td>
                        <td className="py-2 pr-3">{linkedClub?.name ?? '—'}</td>
                        <td className="py-2 pr-3 uppercase">{manager.role}</td>
                        <td className="py-2 pr-3">
                          {manager.is_owner ? (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold uppercase text-[10px]">
                              Fundador
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleManagerRole(manager)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-bold uppercase"
                              >
                                {manager.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                              </button>
                              <button
                                onClick={() => handleDeleteManager(manager)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold uppercase flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Eliminar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
```

- [ ] **Step 3: Verificar tipos**

Run: `npm run lint`
Expected: sin errores de TypeScript.

- [ ] **Step 4: Commit**

```bash
git add src/components/AdminPanel.tsx
git commit -m "feat: add managers table with role toggle and delete-account actions"
```

---

### Task 4: Verificación manual

No hay suite automatizada en el proyecto. Checklist manual (requiere que el usuario haya
corrido la migración del Task 1, incluyendo el UPDATE manual que marca `is_owner = true`
en la cuenta del creador):

- [ ] **Step 1:** Como owner, abrir la pestaña "Cuentas" y confirmar que la propia fila
  muestra la insignia "Fundador" sin botones de acción.
- [ ] **Step 2:** Promover una cuenta de prueba a admin con el botón "Hacer admin";
  loguearse con esa cuenta y confirmar que en su vista de "Cuentas" la fila del owner
  también muestra solo la insignia (sin botones), y que un intento manual de
  `supabase.rpc('admin_delete_manager', { target_user_id: '<uuid del owner>' })` desde la
  consola del navegador devuelve el error `No se puede eliminar la cuenta del creador de
  la liga.`.
- [ ] **Step 3:** Eliminar la cuenta de prueba con el botón "Eliminar"; confirmar que
  desaparece de la tabla y de `auth.users` (verificar en el dashboard de Supabase), y que
  su club sigue existiendo intacto en la pestaña "Clubes".
- [ ] **Step 4:** Run `npm run lint` una vez más sobre el archivo completo para confirmar
  que no quedó nada roto.
