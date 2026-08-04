import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  confirmOrCorrectMatchResult,
  isConfirmMatchResultResponse,
  type ConfirmMatchResultResponse,
  type RpcCaller
} from './matchResultRpc';

const validResponse: ConfirmMatchResultResponse = {
  callType: 'FINANCIAL_CHANGE',
  previousStatus: 'PENDIENTE',
  newStatus: 'CONFIRMADO',
  previousWinnerClubId: null,
  newWinnerClubId: 'club-a',
  reversedAmount: 0,
  paidAmount: 3000000,
  settlementVersion: 1
};

function fakeCaller(result: { data: unknown; error: { message: string; code?: string } | null }): RpcCaller {
  return { rpc: vi.fn().mockResolvedValue(result) };
}

describe('isConfirmMatchResultResponse', () => {
  it('acepta una respuesta con la forma exacta esperada', () => {
    expect(isConfirmMatchResultResponse(validResponse)).toBe(true);
  });

  it('rechaza callType fuera del enum conocido', () => {
    expect(isConfirmMatchResultResponse({ ...validResponse, callType: 'ALGO_RARO' })).toBe(false);
  });

  it('rechaza si falta un campo requerido', () => {
    const withoutPaidAmount: Record<string, unknown> = { ...validResponse };
    delete withoutPaidAmount.paidAmount;
    expect(isConfirmMatchResultResponse(withoutPaidAmount)).toBe(false);
  });

  it('rechaza null, undefined y tipos primitivos', () => {
    expect(isConfirmMatchResultResponse(null)).toBe(false);
    expect(isConfirmMatchResultResponse(undefined)).toBe(false);
    expect(isConfirmMatchResultResponse('CONFIRMADO')).toBe(false);
    expect(isConfirmMatchResultResponse(42)).toBe(false);
  });

  it('acepta previousWinnerClubId / newWinnerClubId en null', () => {
    expect(isConfirmMatchResultResponse({ ...validResponse, newWinnerClubId: null })).toBe(true);
  });

  const numericFields = ['reversedAmount', 'paidAmount', 'settlementVersion'] as const;

  describe.each(numericFields)('validacion numerica de %s', (field) => {
    it('rechaza NaN', () => {
      expect(isConfirmMatchResultResponse({ ...validResponse, [field]: NaN })).toBe(false);
    });

    it('rechaza Infinity', () => {
      expect(isConfirmMatchResultResponse({ ...validResponse, [field]: Infinity })).toBe(false);
    });

    it('rechaza -Infinity', () => {
      expect(isConfirmMatchResultResponse({ ...validResponse, [field]: -Infinity })).toBe(false);
    });

    it('rechaza el numero representado como string', () => {
      expect(isConfirmMatchResultResponse({ ...validResponse, [field]: '3000000' })).toBe(false);
    });

    it('rechaza valores negativos', () => {
      expect(isConfirmMatchResultResponse({ ...validResponse, [field]: -1 })).toBe(false);
    });
  });

  it('rechaza settlementVersion decimal', () => {
    expect(isConfirmMatchResultResponse({ ...validResponse, settlementVersion: 1.5 })).toBe(false);
  });

  it('acepta reversedAmount y paidAmount en 0 (frontera valida)', () => {
    expect(isConfirmMatchResultResponse({ ...validResponse, reversedAmount: 0, paidAmount: 0 })).toBe(true);
  });

  it('acepta settlementVersion en 0 (frontera valida)', () => {
    expect(isConfirmMatchResultResponse({ ...validResponse, settlementVersion: 0 })).toBe(true);
  });
});

describe('confirmOrCorrectMatchResult -- validacion client-side (sin llamar a la red)', () => {
  it('rechaza matchId vacio sin invocar rpc()', async () => {
    const caller = fakeCaller({ data: validResponse, error: null });
    const outcome = await confirmOrCorrectMatchResult({ matchId: '', newStatus: 'CONFIRMADO' }, caller);
    expect(outcome).toEqual({ ok: false, error: { code: 'INVALID_PARAMS', message: expect.any(String) } });
    expect(caller.rpc).not.toHaveBeenCalled();
  });

  it('rechaza un status invalido sin invocar rpc()', async () => {
    const caller = fakeCaller({ data: validResponse, error: null });
    // @ts-expect-error -- forzando un valor invalido a proposito
    const outcome = await confirmOrCorrectMatchResult({ matchId: 'm1', newStatus: 'ALGO_RARO' }, caller);
    expect(outcome.ok).toBe(false);
    if (outcome.ok === false) expect(outcome.error.code).toBe('INVALID_PARAMS');
    expect(caller.rpc).not.toHaveBeenCalled();
  });

  it('rechaza goles negativos sin invocar rpc()', async () => {
    const caller = fakeCaller({ data: validResponse, error: null });
    const outcome = await confirmOrCorrectMatchResult(
      { matchId: 'm1', newStatus: 'CONFIRMADO', homeGoals: -1, awayGoals: 0 },
      caller
    );
    expect(outcome.ok).toBe(false);
    if (outcome.ok === false) expect(outcome.error.code).toBe('INVALID_PARAMS');
    expect(caller.rpc).not.toHaveBeenCalled();
  });
});

describe('confirmOrCorrectMatchResult -- llamada exitosa', () => {
  it('invoca la RPC con los nombres de parametro exactos y devuelve la respuesta tipada', async () => {
    const caller = fakeCaller({ data: validResponse, error: null });
    const outcome = await confirmOrCorrectMatchResult(
      { matchId: 'm1', newStatus: 'CONFIRMADO', homeGoals: 2, awayGoals: 0, homeScorers: 'A', awayScorers: '' },
      caller
    );

    expect(caller.rpc).toHaveBeenCalledWith('confirm_or_correct_match_result', {
      p_match_id: 'm1',
      p_new_status: 'CONFIRMADO',
      p_home_goals: 2,
      p_away_goals: 0,
      p_home_scorers: 'A',
      p_away_scorers: '',
      p_reason: null
    });
    expect(outcome).toEqual({ ok: true, data: validResponse });
  });

  it('parametros opcionales ausentes se envian como null, no undefined', async () => {
    const caller = fakeCaller({ data: validResponse, error: null });
    await confirmOrCorrectMatchResult({ matchId: 'm1', newStatus: 'CONFIRMADO' }, caller);

    const callArgs = (caller.rpc as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(callArgs).toEqual({
      p_match_id: 'm1',
      p_new_status: 'CONFIRMADO',
      p_home_goals: null,
      p_away_goals: null,
      p_home_scorers: null,
      p_away_scorers: null,
      p_reason: null
    });
  });
});

describe('confirmOrCorrectMatchResult -- traduccion de errores del servidor', () => {
  const cases: Array<[string, { message: string; code?: string }, string]> = [
    ['RPC inexistente (42883)', { message: 'function ... does not exist', code: '42883' }, 'RPC_UNAVAILABLE'],
    ['no autorizado', { message: 'Solo un administrador puede confirmar o corregir el resultado de un partido.' }, 'NOT_AUTHORIZED'],
    ['estado invalido', { message: 'Estado FOO invalido. Valores permitidos: CONFIRMADO, RECHAZADO, PENDIENTE.' }, 'INVALID_STATUS'],
    ['partido no encontrado', { message: 'No se encontro el partido m1.' }, 'MATCH_NOT_FOUND'],
    ['goles nulos', { message: 'El partido esta sin goles cargados.' }, 'INVALID_GOALS'],
    ['goles negativos', { message: 'Los goles no pueden ser negativos.' }, 'INVALID_GOALS'],
    ['escritura directa bloqueada (UPDATE)', { message: 'No se puede confirmar/rechazar el partido m1 con un UPDATE directo. Usa confirm_or_correct_match_result().' }, 'DIRECT_WRITE_BLOCKED'],
    ['escritura directa bloqueada (INSERT)', { message: 'No se puede crear un partido con status "CONFIRMADO" directamente.' }, 'DIRECT_WRITE_BLOCKED'],
    ['escritura directa bloqueada (campo protegido)', { message: 'No se puede modificar "homeClubId" del partido m1 (ya esta CONFIRMADO) con un UPDATE directo.' }, 'DIRECT_WRITE_BLOCKED'],
    ['error desconocido', { message: 'boom' }, 'UNKNOWN']
  ];

  it.each(cases)('%s -> %s', async (_label, serverError, expectedCode) => {
    const caller = fakeCaller({ data: null, error: serverError });
    const outcome = await confirmOrCorrectMatchResult({ matchId: 'm1', newStatus: 'CONFIRMADO' }, caller);
    expect(outcome.ok).toBe(false);
    if (outcome.ok === false) expect(outcome.error.code).toBe(expectedCode);
  });
});

describe('confirmOrCorrectMatchResult -- respuesta malformada', () => {
  it('devuelve MALFORMED_RESPONSE si la RPC responde sin error pero con forma invalida', async () => {
    const caller = fakeCaller({ data: { algo: 'inesperado' }, error: null });
    const outcome = await confirmOrCorrectMatchResult({ matchId: 'm1', newStatus: 'CONFIRMADO' }, caller);
    expect(outcome).toEqual({
      ok: false,
      error: { code: 'MALFORMED_RESPONSE', message: expect.any(String) }
    });
  });
});

describe('confirmOrCorrectMatchResult -- severidad de logging', () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    infoSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('usa console.info para un resultado exitoso', async () => {
    const caller = fakeCaller({ data: validResponse, error: null });
    await confirmOrCorrectMatchResult({ matchId: 'm1', newStatus: 'CONFIRMADO' }, caller);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('usa console.info (no console.error) para un error funcional esperado (NOT_AUTHORIZED)', async () => {
    const caller = fakeCaller({
      data: null,
      error: { message: 'Solo un administrador puede confirmar o corregir el resultado de un partido.' }
    });
    await confirmOrCorrectMatchResult({ matchId: 'm1', newStatus: 'CONFIRMADO' }, caller);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('usa console.info (no console.error) para INVALID_PARAMS client-side', async () => {
    const caller = fakeCaller({ data: validResponse, error: null });
    await confirmOrCorrectMatchResult({ matchId: '', newStatus: 'CONFIRMADO' }, caller);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('usa console.error para un error tecnico (DIRECT_WRITE_BLOCKED)', async () => {
    const caller = fakeCaller({
      data: null,
      error: { message: 'No se puede confirmar/rechazar el partido m1 con un UPDATE directo. Usa confirm_or_correct_match_result().' }
    });
    await confirmOrCorrectMatchResult({ matchId: 'm1', newStatus: 'CONFIRMADO' }, caller);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it('usa console.error para MALFORMED_RESPONSE', async () => {
    const caller = fakeCaller({ data: { algo: 'inesperado' }, error: null });
    await confirmOrCorrectMatchResult({ matchId: 'm1', newStatus: 'CONFIRMADO' }, caller);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it('no incluye el mensaje crudo del servidor ni el payload completo en los logs', async () => {
    const caller = fakeCaller({
      data: null,
      error: { message: 'No se puede confirmar/rechazar el partido m1 con un UPDATE directo. Usa confirm_or_correct_match_result().' }
    });
    await confirmOrCorrectMatchResult(
      { matchId: 'm1', newStatus: 'CONFIRMADO', homeScorers: 'Fulano', reason: 'motivo privado' },
      caller
    );
    const loggedArgs = errorSpy.mock.calls[0];
    expect(JSON.stringify(loggedArgs)).not.toContain('Fulano');
    expect(JSON.stringify(loggedArgs)).not.toContain('motivo privado');
    expect(JSON.stringify(loggedArgs)).not.toContain('UPDATE directo');
  });
});
