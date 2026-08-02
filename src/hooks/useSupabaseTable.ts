import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Updater<T> = T[] | ((prev: T[]) => T[]);

const WRITE_BATCH_SIZE = 75;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function formatWriteError(table: string, action: 'guardar' | 'eliminar', message: string) {
  const isTimeout = message.toLowerCase().includes('statement timeout');
  const hint = isTimeout
    ? 'La operacion era grande y Supabase la corto por timeout. Intenta nuevamente; se guardara en lotes mas chicos.'
    : 'Puede que no tengas permiso para modificar estos datos.';

  return `No se pudo ${action} en ${table}: ${message}. ${hint}`;
}

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

        const persistChanges = async () => {
          for (const batch of chunk(toUpsert, WRITE_BATCH_SIZE)) {
            const { error } = await supabase
              .from(table)
              .upsert(batch.map((item) => ({ key: getKey(item), data: item })));

            if (error) {
              throw new Error(error.message);
            }
          }

          for (const batch of chunk(toDeleteKeys, WRITE_BATCH_SIZE)) {
            const { error } = await supabase
              .from(table)
              .delete()
              .in('key', batch);

            if (error) {
              throw new Error(error.message);
            }
          }
        };

        if (toUpsert.length > 0 || toDeleteKeys.length > 0) {
          persistChanges()
            .catch((error) => {
              const message = error instanceof Error ? error.message : String(error);
              const action = toUpsert.length > 0 ? 'guardar' : 'eliminar';
              console.error(`[useSupabaseTable] ${action} ${table} failed:`, message);
              if (error) {
                // Sin esto el cambio quedaba visible localmente aunque el
                // servidor lo hubiera rechazado (ej: RLS), haciendo que un
                // fallo de permisos pareciera "no pasa nada".
                setWriteError(formatWriteError(table, action, message));
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

  return [data, setData, loaded, writeError, clearWriteError, refetch] as const;
}
