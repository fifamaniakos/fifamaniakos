import { describe, expect, it } from 'vitest';
import { FinancialTransaction, MatchResult } from '../types';
import { MATCH_WIN_PRIZE, computeMatchPrizeEffect, matchPrizeTransactionId } from './matchPrize';

const match = (
  homeGoals: number,
  awayGoals: number,
  status: MatchResult['status'] = 'CONFIRMADO'
): MatchResult => ({
  id: 'fix-1ra-r1-a-b',
  matchday: 1,
  competition: '1ra División',
  homeClubId: 'a',
  awayClubId: 'b',
  homeGoals,
  awayGoals,
  homeScorers: '',
  awayScorers: '',
  status,
  createdAt: '01/01/2026'
} as MatchResult);

const prizeTx = (clubId: string): FinancialTransaction => ({
  id: matchPrizeTransactionId('fix-1ra-r1-a-b'),
  clubId,
  type: 'INGRESO',
  concept: 'Premio Victoria Jornada 1',
  amount: MATCH_WIN_PRIZE,
  date: '01/01/2026'
});

describe('computeMatchPrizeEffect', () => {
  it('acredita el premio al local ganador', () => {
    const effect = computeMatchPrizeEffect(match(2, 0), [], '01/01/2026');
    expect(effect.budgetDeltas).toEqual({ a: MATCH_WIN_PRIZE });
    expect(effect.addTransaction?.clubId).toBe('a');
    expect(effect.removeTransactionIds).toEqual([]);
  });

  it('acredita el premio al visitante ganador', () => {
    const effect = computeMatchPrizeEffect(match(0, 3), [], '01/01/2026');
    expect(effect.budgetDeltas).toEqual({ b: MATCH_WIN_PRIZE });
  });

  it('no paga nada en un empate', () => {
    const effect = computeMatchPrizeEffect(match(1, 1), [], '01/01/2026');
    expect(effect.budgetDeltas).toEqual({});
    expect(effect.addTransaction).toBeNull();
  });

  it('no paga nada si el acta no esta confirmada', () => {
    const effect = computeMatchPrizeEffect(match(2, 0, 'PENDIENTE'), [], '01/01/2026');
    expect(effect.addTransaction).toBeNull();
    expect(effect.budgetDeltas).toEqual({});
  });

  it('es idempotente: re-guardar el mismo acta no vuelve a pagar', () => {
    const effect = computeMatchPrizeEffect(match(2, 0), [prizeTx('a')], '01/01/2026');
    expect(effect.budgetDeltas).toEqual({});
    expect(effect.addTransaction).toBeNull();
    expect(effect.removeTransactionIds).toEqual([]);
  });

  it('corrige el acta: revierte el premio anterior y paga al nuevo ganador', () => {
    const effect = computeMatchPrizeEffect(match(0, 1), [prizeTx('a')], '01/01/2026');
    expect(effect.budgetDeltas).toEqual({ a: -MATCH_WIN_PRIZE, b: MATCH_WIN_PRIZE });
    expect(effect.removeTransactionIds).toEqual([matchPrizeTransactionId('fix-1ra-r1-a-b')]);
    expect(effect.addTransaction?.clubId).toBe('b');
  });

  it('corrige a empate: revierte el premio y no crea otro', () => {
    const effect = computeMatchPrizeEffect(match(1, 1), [prizeTx('a')], '01/01/2026');
    expect(effect.budgetDeltas).toEqual({ a: -MATCH_WIN_PRIZE });
    expect(effect.addTransaction).toBeNull();
    expect(effect.removeTransactionIds).toHaveLength(1);
  });
});
