// Punto unico de invocacion de la RPC confirm_or_correct_match_result
// (supabase/migrations/025_match_prize_settlement_rpc.sql). Ningun componente
// de UI debe llamar a supabase.rpc(...) directamente para esto ni conocer el
// nombre literal de la RPC -- todo pasa por confirmOrCorrectMatchResult().
//
// Alcance de este modulo (Fase 2A, Commit 1): tipos de parametros y de
// respuesta, traduccion de errores conocidos a un tipo discriminado,
// logging centralizado (sin datos sensibles ni objetos completos),
// validacion en runtime de la forma del jsonb devuelto, y validaciones
// comunes de los parametros antes de llamar a la red.

import { supabase } from './supabaseClient';

// -----------------------------------------------------------------------------
// Parametros de entrada -- misma forma que la firma real de la RPC (7
// parametros, los ultimos 5 con default null en Postgres; aca se modelan
// como opcionales para que el caller solo pase lo que tiene).
// -----------------------------------------------------------------------------
export const VALID_STATUSES = ['CONFIRMADO', 'RECHAZADO', 'PENDIENTE'] as const;
export type MatchResultStatus = (typeof VALID_STATUSES)[number];

export interface ConfirmMatchResultParams {
  matchId: string;
  newStatus: MatchResultStatus;
  homeGoals?: number | null;
  awayGoals?: number | null;
  homeScorers?: string | null;
  awayScorers?: string | null;
  reason?: string | null;
}

// -----------------------------------------------------------------------------
// Respuesta -- forma exacta del jsonb_build_object devuelto por la RPC
// (migracion 025, seccion final de confirm_or_correct_match_result).
// -----------------------------------------------------------------------------
export type MatchResultCallType =
  | 'NOOP_REPEAT'
  | 'ACTA_UPDATED_NO_FINANCIAL_CHANGE'
  | 'FINANCIAL_CHANGE';

export interface ConfirmMatchResultResponse {
  callType: MatchResultCallType;
  previousStatus: string;
  newStatus: string;
  previousWinnerClubId: string | null;
  newWinnerClubId: string | null;
  reversedAmount: number;
  paidAmount: number;
  settlementVersion: number;
}

// -----------------------------------------------------------------------------
// Error discriminado -- todo lo que puede salir mal se traduce a uno de estos
// codigos. Ningun caller necesita parsear texto de excepcion SQL.
// -----------------------------------------------------------------------------
export type MatchResultErrorCode =
  | 'INVALID_PARAMS'       // validacion client-side, antes de llamar a la red
  | 'RPC_UNAVAILABLE'      // la funcion no existe todavia (migracion no aplicada)
  | 'NOT_AUTHORIZED'       // "Solo un administrador..."
  | 'INVALID_STATUS'       // "Estado % invalido..."
  | 'MATCH_NOT_FOUND'      // "No se encontro el partido..."
  | 'INVALID_GOALS'        // "sin goles cargados" / "no pueden ser negativos"
  | 'DIRECT_WRITE_BLOCKED' // protect_match_result: "UPDATE directo" / "No se puede..."
  | 'MALFORMED_RESPONSE'   // la RPC respondio pero no con la forma esperada
  | 'UNKNOWN';

export interface MatchResultError {
  code: MatchResultErrorCode;
  message: string;
  /** Mensaje crudo del servidor, solo para logging/diagnostico -- no pensado para mostrar tal cual en la UI salvo en INVALID_GOALS/DIRECT_WRITE_BLOCKED, que son autoexplicativos (ver brief). */
  cause?: string;
}

export type ConfirmMatchResultOutcome =
  | { ok: true; data: ConfirmMatchResultResponse }
  | { ok: false; error: MatchResultError };

// -----------------------------------------------------------------------------
// Validaciones comunes -- se ejecutan antes de tocar la red. No duplican la
// autoridad del servidor (la RPC vuelve a validar todo), solo evitan un
// round-trip innecesario ante un error obvio del propio caller.
// -----------------------------------------------------------------------------
function validateParams(params: ConfirmMatchResultParams): MatchResultError | null {
  if (!params.matchId || params.matchId.trim() === '') {
    return { code: 'INVALID_PARAMS', message: 'Falta el identificador del partido.' };
  }
  if (!VALID_STATUSES.includes(params.newStatus)) {
    return {
      code: 'INVALID_PARAMS',
      message: `Estado "${params.newStatus}" invalido. Valores permitidos: ${VALID_STATUSES.join(', ')}.`
    };
  }
  if (params.homeGoals != null && params.homeGoals < 0) {
    return { code: 'INVALID_PARAMS', message: 'Los goles del equipo local no pueden ser negativos.' };
  }
  if (params.awayGoals != null && params.awayGoals < 0) {
    return { code: 'INVALID_PARAMS', message: 'Los goles del equipo visitante no pueden ser negativos.' };
  }
  return null;
}

// -----------------------------------------------------------------------------
// Validacion en runtime de la forma del jsonb devuelto -- no se confia en un
// cast de TypeScript sobre lo que llega de la red.
// -----------------------------------------------------------------------------
const VALID_CALL_TYPES: readonly MatchResultCallType[] = [
  'NOOP_REPEAT',
  'ACTA_UPDATED_NO_FINANCIAL_CHANGE',
  'FINANCIAL_CHANGE'
];

function isNonNegativeFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export function isConfirmMatchResultResponse(value: unknown): value is ConfirmMatchResultResponse {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.callType === 'string' &&
    (VALID_CALL_TYPES as readonly string[]).includes(v.callType) &&
    typeof v.previousStatus === 'string' &&
    typeof v.newStatus === 'string' &&
    (v.previousWinnerClubId === null || typeof v.previousWinnerClubId === 'string') &&
    (v.newWinnerClubId === null || typeof v.newWinnerClubId === 'string') &&
    isNonNegativeFiniteNumber(v.reversedAmount) &&
    isNonNegativeFiniteNumber(v.paidAmount) &&
    isNonNegativeInteger(v.settlementVersion)
  );
}

// -----------------------------------------------------------------------------
// Traduccion de errores conocidos -- mapea el texto de excepcion de Postgres
// (RAISE EXCEPTION en la migracion 025 y en el trigger protect_match_result)
// y el codigo SQLSTATE a un MatchResultError. Los mensajes se buscan por
// substring, igual que hace el propio protocolo de pruebas de la migracion.
// -----------------------------------------------------------------------------
interface SupabaseRpcError {
  message: string;
  code?: string;
}

function translateServerError(error: SupabaseRpcError): MatchResultError {
  const message = error.message ?? '';

  if (error.code === '42883') {
    return {
      code: 'RPC_UNAVAILABLE',
      message: 'El sistema de confirmacion no esta disponible todavia. Contacta al administrador tecnico.',
      cause: message
    };
  }
  if (message.includes('Solo un administrador')) {
    return { code: 'NOT_AUTHORIZED', message: 'No tenes permisos para confirmar resultados.', cause: message };
  }
  if (message.includes('Estado') && message.includes('invalido')) {
    return { code: 'INVALID_STATUS', message, cause: message };
  }
  if (message.includes('No se encontro el partido')) {
    return { code: 'MATCH_NOT_FOUND', message: 'No se encontro el partido.', cause: message };
  }
  if (message.includes('sin goles cargados') || message.includes('no pueden ser negativos')) {
    return { code: 'INVALID_GOALS', message, cause: message };
  }
  if (
    message.includes('UPDATE directo') ||
    message.includes('No se puede crear un partido') ||
    message.includes('No se puede modificar') ||
    message.includes('No se puede confirmar/rechazar')
  ) {
    return { code: 'DIRECT_WRITE_BLOCKED', message, cause: message };
  }
  return { code: 'UNKNOWN', message: 'Ocurrio un error inesperado al confirmar el resultado.', cause: message };
}

// -----------------------------------------------------------------------------
// Logging centralizado -- distingue exito/error, nunca loguea el objeto
// completo de parametros ni de respuesta (podria incluir goleadores/razon de
// texto libre). Solo identificadores y clasificacion del resultado.
// -----------------------------------------------------------------------------
// Errores funcionales/de validacion esperados -- parte normal del flujo de
// negocio (el usuario no tiene permiso, cargo un estado invalido, etc.), no
// un problema tecnico. Se loguean en nivel info.
const EXPECTED_ERROR_CODES: readonly MatchResultErrorCode[] = [
  'INVALID_PARAMS',
  'INVALID_STATUS',
  'INVALID_GOALS',
  'NOT_AUTHORIZED',
  'MATCH_NOT_FOUND'
];

function logOutcome(matchId: string, outcome: ConfirmMatchResultOutcome): void {
  // NOTA: "=== true" (no "if (outcome.ok)") es deliberado, no estilo. Este
  // tsconfig no tiene strictNullChecks, y bajo esa config TS no angosta la
  // rama "else" de un union discriminado con un chequeo booleano implicito
  // -- reproducido y confirmado antes de este commit. La comparacion
  // explicita si angosta correctamente en ambas ramas.
  if (outcome.ok === true) {
    console.info('[matchResultRpc] confirm_or_correct_match_result OK', {
      matchId,
      callType: outcome.data.callType
    });
    return;
  }

  const logFn = EXPECTED_ERROR_CODES.includes(outcome.error.code) ? console.info : console.error;
  logFn('[matchResultRpc] confirm_or_correct_match_result ERROR', {
    matchId,
    code: outcome.error.code
  });
}

// -----------------------------------------------------------------------------
// Dependencia inyectable -- superficie minima de Supabase que este modulo
// necesita, para poder probarlo con un doble de prueba sin acoplarse al
// cliente real. En produccion se usa el `supabase` real por default.
// -----------------------------------------------------------------------------
export interface RpcCaller {
  rpc(
    fn: string,
    args: Record<string, unknown>
  ): PromiseLike<{ data: unknown; error: SupabaseRpcError | null }>;
}

const defaultCaller: RpcCaller = supabase;

// -----------------------------------------------------------------------------
// Funcion unica de invocacion.
// -----------------------------------------------------------------------------
export async function confirmOrCorrectMatchResult(
  params: ConfirmMatchResultParams,
  caller: RpcCaller = defaultCaller
): Promise<ConfirmMatchResultOutcome> {
  const validationError = validateParams(params);
  if (validationError) {
    const outcome: ConfirmMatchResultOutcome = { ok: false, error: validationError };
    logOutcome(params.matchId, outcome);
    return outcome;
  }

  const { data, error } = await caller.rpc('confirm_or_correct_match_result', {
    p_match_id: params.matchId,
    p_new_status: params.newStatus,
    p_home_goals: params.homeGoals ?? null,
    p_away_goals: params.awayGoals ?? null,
    p_home_scorers: params.homeScorers ?? null,
    p_away_scorers: params.awayScorers ?? null,
    p_reason: params.reason ?? null
  });

  let outcome: ConfirmMatchResultOutcome;
  if (error) {
    outcome = { ok: false, error: translateServerError(error) };
  } else if (!isConfirmMatchResultResponse(data)) {
    outcome = {
      ok: false,
      error: {
        code: 'MALFORMED_RESPONSE',
        message: 'La respuesta del servidor no tiene el formato esperado.'
      }
    };
  } else {
    outcome = { ok: true, data };
  }

  logOutcome(params.matchId, outcome);
  return outcome;
}
