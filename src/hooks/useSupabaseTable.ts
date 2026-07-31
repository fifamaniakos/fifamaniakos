import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Updater<T> = T[] | ((prev: T[]) => T[]);

export function useSupabaseTable<T>(
  table: string,
  initialData: T[],
  getKey: (item: T) => string
) {
  const [data, setDataState] = useState<T[]>(initialData);
  const [loaded, setLoaded] = useState(false);
  const [writeError, setWriteError] = useState<string | null>(null);

  // Al fallar una escritura se recarga desde el servidor en vez de intentar
  // revertir a mano: la base es la fuente de verdad y Realtime pudo haber
  // aplicado otros cambios entre medio.
  const refetch = useCallback(async () => {
    const { data: rows, error } = await supabase.from(table).select('key, data');
    if (!error && rows) {
      setDataState(rows.map((r) => r.data as T));
    }
  }, [table]);

  useEffect(() => {
    let active = true;

    supabase
      .from(table)
      .select('key, data')
      .then(({ data: rows, error }) => {
        if (!active) return;
        if (error) {
          console.error(`[useSupabaseTable] fetch ${table} failed:`, error.message);
          setWriteError(`No se pudieron cargar los datos de ${table}: ${error.message}`);
          setLoaded(true);
          return;
        }
        if (rows && rows.length > 0) {
          setDataState(rows.map((r) => r.data as T));
        }
        setLoaded(true);
      });

    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          setDataState((prev) => {
            if (payload.eventType === 'DELETE') {
              const deletedKey = (payload.old as { key: string }).key;
              return prev.filter((item) => getKey(item) !== deletedKey);
            }
            const incoming = (payload.new as { data: T }).data;
            const incomingKey = getKey(incoming);
            const exists = prev.some((item) => getKey(item) === incomingKey);
            return exists
              ? prev.map((item) => (getKey(item) === incomingKey ? incoming : item))
              : [...prev, incoming];
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [table]);

  const setData = useCallback(
    (updater: Updater<T>) => {
      setDataState((prev) => {
        const next = typeof updater === 'function' ? (updater as (p: T[]) => T[])(prev) : updater;

        const prevByKey = new Map<string, T>(prev.map((item) => [getKey(item), item]));
        const nextKeys = new Set(next.map((item) => getKey(item)));

        const toUpsert = next.filter((item) => {
          const before = prevByKey.get(getKey(item));
          return !before || JSON.stringify(before) !== JSON.stringify(item);
        });
        const toDeleteKeys = [...prevByKey.keys()].filter((key) => !nextKeys.has(key));

        if (toUpsert.length > 0) {
          supabase
            .from(table)
            .upsert(toUpsert.map((item) => ({ key: getKey(item), data: item })))
            .then(({ error }) => {
              if (error) {
                console.error(`[useSupabaseTable] upsert ${table} failed:`, error.message);
                // Sin esto el cambio quedaba visible localmente aunque el
                // servidor lo hubiera rechazado (ej: RLS), haciendo que un
                // fallo de permisos pareciera "no pasa nada".
                setWriteError(
                  `No se pudo guardar en ${table}: ${error.message}. ` +
                  `Puede que no tengas permiso para modificar estos datos.`
                );
                refetch();
              }
            });
        }
        if (toDeleteKeys.length > 0) {
          supabase
            .from(table)
            .delete()
            .in('key', toDeleteKeys)
            .then(({ error }) => {
              if (error) {
                console.error(`[useSupabaseTable] delete ${table} failed:`, error.message);
                setWriteError(
                  `No se pudo eliminar en ${table}: ${error.message}. ` +
                  `Puede que no tengas permiso para modificar estos datos.`
                );
                refetch();
              }
            });
        }

        return next;
      });
    },
    [table, refetch]
  );

  const clearWriteError = useCallback(() => setWriteError(null), []);

  return [data, setData, loaded, writeError, clearWriteError] as const;
}
