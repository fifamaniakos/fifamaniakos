// Persistencia explicita y awaited de un partido en estado PENDIENTE.
// (Fase 2A, Commit 3 -- infraestructura previa a migrar handleCreateMatchSubmit
// y el camino admin de FixtureJornadaDetail.)
//
// Existe porque useSupabaseTable.setData no sirve para un flujo secuencial:
// actualiza React de forma optimista antes de escribir, dispara el upsert real
// en segundo plano sin exponer su resultado al caller (devuelve void), y deja
// que Realtime reconcilie despues. Este modulo hace lo opuesto a proposito:
// sin actualizacion optimista, sin Realtime, un unico upsert awaited cuyo
// resultado (exito o error) se puede encadenar con confirmOrCorrectMatchResult
// en el caller.
//
// Responsabilidad unica: dejar una fila PENDIENTE persistida en la base y
// devolver si funciono. No confirma resultados, no llama a la RPC, no toca
// estado de React.

import { supabase } from './supabaseClient';
import type { MatchResult } from '../types';

// -----------------------------------------------------------------------------
// Resultado -- union discriminada, igual que en matchResultRpc.ts.
// -----------------------------------------------------------------------------
export type MatchDraftErrorCode = 'INVALID_DRAFT' | 'WRITE_FAILED' | 'UNKNOWN';

export interface MatchDraftError {
  code: MatchDraftErrorCode;
  message: string;
  cause?: string;
}

export type PersistPendingMatchDraftOutcome =
  | { ok: true }
  | { ok: false; error: MatchDraftError };

// -----------------------------------------------------------------------------
// Validacion en runtime -- el helper solo debe poder escribir partidos
// PENDIENTE. No es una validacion de negocio completa (eso lo hace la RPC al
// confirmar); es una guarda para que este modulo no se use por error para
// escribir CONFIRMADO/RECHAZADO directo, que el trigger protect_match_result
// bloquea igual, pero mejor fallar aca con un mensaje claro que dejar que
// llegue un error crudo de Postgres.
// -----------------------------------------------------------------------------
function validateDraft(match: MatchResult): MatchDraftError | null {
  if (!match.id || match.id.trim() === '') {
    return { code: 'INVALID_DRAFT', message: 'Falta el identificador del partido.' };
  }
  if (match.status !== 'PENDIENTE') {
    return {
      code: 'INVALID_DRAFT',
      message: `Este helper solo persiste partidos en PENDIENTE (recibido: "${match.status}").`
    };
  }
  if (!match.homeClubId || !match.awayClubId) {
    return { code: 'INVALID_DRAFT', message: 'Faltan homeClubId y/o awayClubId.' };
  }
  if (match.homeClubId === match.awayClubId) {
    return { code: 'INVALID_DRAFT', message: 'El equipo local y visitante no pueden ser el mismo.' };
  }
  return null;
}

// -----------------------------------------------------------------------------
// Logging centralizado -- minimo, sin el partido completo.
// -----------------------------------------------------------------------------
function logOutcome(matchId: string, outcome: PersistPendingMatchDraftOutcome): void {
  if (outcome.ok === true) {
    console.info('[matchDraftPersistence] persistPendingMatchDraft OK', { matchId });
    return;
  }

  const logFn = outcome.error.code === 'INVALID_DRAFT' ? console.info : console.error;
  logFn('[matchDraftPersistence] persistPendingMatchDraft ERROR', {
    matchId,
    code: outcome.error.code
  });
}

// -----------------------------------------------------------------------------
// Dependencia inyectable -- misma superficie minima que el upsert real de
// Supabase necesita para este caso de uso, para poder testear sin acoplarse
// al cliente real.
// -----------------------------------------------------------------------------
interface SupabaseUpsertError {
  message: string;
}

export interface DraftPersistenceCaller {
  from(table: string): {
    upsert(rows: Array<{ key: string; data: MatchResult }>): PromiseLike<{ error: SupabaseUpsertError | null }>;
  };
}

const defaultCaller: DraftPersistenceCaller = supabase;

// -----------------------------------------------------------------------------
// Funcion unica de persistencia.
// -----------------------------------------------------------------------------
export async function persistPendingMatchDraft(
  match: MatchResult,
  caller: DraftPersistenceCaller = defaultCaller
): Promise<PersistPendingMatchDraftOutcome> {
  const validationError = validateDraft(match);
  if (validationError) {
    const outcome: PersistPendingMatchDraftOutcome = { ok: false, error: validationError };
    logOutcome(match.id, outcome);
    return outcome;
  }

  let outcome: PersistPendingMatchDraftOutcome;
  try {
    const { error } = await caller.from('matches').upsert([{ key: match.id, data: match }]);

    if (error) {
      outcome = {
        ok: false,
        error: {
          code: 'WRITE_FAILED',
          message: 'No se pudo guardar el partido. Intenta nuevamente.',
          cause: error.message
        }
      };
    } else {
      outcome = { ok: true };
    }
  } catch (thrown) {
    // El caller inyectado (o el cliente real) puede rechazar de forma
    // inesperada; sin este catch esa rejection se propagaria sin manejar
    // hacia un flujo que en App.tsx sera fire-and-forget desde un onClick.
    const cause = thrown instanceof Error ? thrown.message : String(thrown);
    outcome = {
      ok: false,
      error: { code: 'UNKNOWN', message: 'Ocurrio un error inesperado al guardar el partido.', cause }
    };
  }

  logOutcome(match.id, outcome);
  return outcome;
}
