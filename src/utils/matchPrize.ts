import { FinancialTransaction, MatchResult } from '../types';

export const MATCH_WIN_PRIZE = 3000000;

export interface MatchPrizeEffect {
  /** Ajustes de presupuesto por club (puede ser negativo al corregir un acta). */
  budgetDeltas: Record<string, number>;
  /** Ids de transacciones a borrar (el premio anterior de este mismo partido). */
  removeTransactionIds: string[];
  /** Transaccion de premio a crear, si hay ganador. */
  addTransaction: FinancialTransaction | null;
}

/**
 * El id de la transaccion de premio se deriva del id del partido.
 *
 * Antes era `tx-${Date.now()}`: cada vez que se volvia a guardar el acta de un
 * partido ya confirmado se creaba OTRA transaccion y se sumaban otros 3M. Un
 * manager que editaba el acta tres veces cobraba tres premios, y el
 * presupuesto dejaba de coincidir con el Historial de Transacciones. Con un id
 * derivado del partido el premio es idempotente: se paga una sola vez.
 */
export function matchPrizeTransactionId(matchId: string): string {
  return `tx-premio-${matchId}`;
}

export function matchWinnerClubId(match: MatchResult): string | null {
  if (match.status !== 'CONFIRMADO') return null;
  if (match.homeGoals > match.awayGoals) return match.homeClubId;
  if (match.awayGoals > match.homeGoals) return match.awayClubId;
  return null;
}

/**
 * Calcula que hay que hacer con el premio por victoria de un partido, dado el
 * estado actual de las transacciones.
 *
 * Contempla la correccion de un acta: si el partido ya habia pagado premio a
 * un club y el resultado corregido lo da ganador a otro (o a nadie), se
 * revierte el premio anterior antes de acreditar el nuevo.
 */
export function computeMatchPrizeEffect(
  match: MatchResult,
  transactions: FinancialTransaction[],
  today: string
): MatchPrizeEffect {
  const prizeId = matchPrizeTransactionId(match.id);
  const existing = transactions.find(t => t.id === prizeId) || null;
  const winnerId = matchWinnerClubId(match);

  if (existing && existing.clubId === winnerId) {
    return { budgetDeltas: {}, removeTransactionIds: [], addTransaction: null };
  }

  const budgetDeltas: Record<string, number> = {};
  if (existing) {
    budgetDeltas[existing.clubId] = (budgetDeltas[existing.clubId] || 0) - existing.amount;
  }
  if (winnerId) {
    budgetDeltas[winnerId] = (budgetDeltas[winnerId] || 0) + MATCH_WIN_PRIZE;
  }

  return {
    budgetDeltas,
    removeTransactionIds: existing ? [prizeId] : [],
    addTransaction: winnerId
      ? {
          id: prizeId,
          clubId: winnerId,
          type: 'INGRESO',
          concept: `Premio Victoria Jornada ${match.matchday}`,
          amount: MATCH_WIN_PRIZE,
          date: today
        }
      : null
  };
}
