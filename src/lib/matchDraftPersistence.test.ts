import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { persistPendingMatchDraft, type DraftPersistenceCaller } from './matchDraftPersistence';
import type { MatchResult } from '../types';

const validDraft: MatchResult = {
  id: 'match-1',
  matchday: 1,
  homeClubId: 'club-a',
  awayClubId: 'club-b',
  homeGoals: 0,
  awayGoals: 0,
  homeScorers: '',
  awayScorers: '',
  status: 'PENDIENTE',
  createdAt: '01/01/2026, 00:00'
};

function fakeCaller(result: { error: { message: string } | null }): {
  caller: DraftPersistenceCaller;
  upsertMock: ReturnType<typeof vi.fn>;
} {
  const upsertMock = vi.fn().mockResolvedValue(result);
  return {
    caller: { from: vi.fn().mockReturnValue({ upsert: upsertMock }) },
    upsertMock
  };
}

describe('persistPendingMatchDraft -- validacion antes de la red', () => {
  it('acepta un partido PENDIENTE valido', async () => {
    const { caller, upsertMock } = fakeCaller({ error: null });
    const outcome = await persistPendingMatchDraft(validDraft, caller);
    expect(outcome).toEqual({ ok: true });
    expect(upsertMock).toHaveBeenCalledTimes(1);
  });

  it('rechaza status CONFIRMADO sin invocar la red', async () => {
    const { caller, upsertMock } = fakeCaller({ error: null });
    const outcome = await persistPendingMatchDraft({ ...validDraft, status: 'CONFIRMADO' }, caller);
    expect(outcome.ok).toBe(false);
    if (outcome.ok === false) expect(outcome.error.code).toBe('INVALID_DRAFT');
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it('rechaza status RECHAZADO sin invocar la red', async () => {
    const { caller, upsertMock } = fakeCaller({ error: null });
    const outcome = await persistPendingMatchDraft({ ...validDraft, status: 'RECHAZADO' }, caller);
    expect(outcome.ok).toBe(false);
    if (outcome.ok === false) expect(outcome.error.code).toBe('INVALID_DRAFT');
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it('rechaza id vacio sin invocar la red', async () => {
    const { caller, upsertMock } = fakeCaller({ error: null });
    const outcome = await persistPendingMatchDraft({ ...validDraft, id: '' }, caller);
    expect(outcome.ok).toBe(false);
    if (outcome.ok === false) expect(outcome.error.code).toBe('INVALID_DRAFT');
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it('rechaza clubes faltantes sin invocar la red', async () => {
    const { caller, upsertMock } = fakeCaller({ error: null });
    const outcome = await persistPendingMatchDraft({ ...validDraft, homeClubId: '' }, caller);
    expect(outcome.ok).toBe(false);
    if (outcome.ok === false) expect(outcome.error.code).toBe('INVALID_DRAFT');
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it('rechaza clubes iguales sin invocar la red', async () => {
    const { caller, upsertMock } = fakeCaller({ error: null });
    const outcome = await persistPendingMatchDraft({ ...validDraft, awayClubId: validDraft.homeClubId }, caller);
    expect(outcome.ok).toBe(false);
    if (outcome.ok === false) expect(outcome.error.code).toBe('INVALID_DRAFT');
    expect(upsertMock).not.toHaveBeenCalled();
  });
});

describe('persistPendingMatchDraft -- payload enviado', () => {
  it('envia exactamente { key, data } con el match completo', async () => {
    const { caller, upsertMock } = fakeCaller({ error: null });
    await persistPendingMatchDraft(validDraft, caller);
    expect(upsertMock).toHaveBeenCalledWith([{ key: validDraft.id, data: validDraft }]);
  });

  it('conserva 0, string vacio y arrays vacios del acta sin transformarlos', async () => {
    const draftWithEmptyValues: MatchResult = {
      ...validDraft,
      homeGoals: 0,
      awayGoals: 0,
      homeScorers: '',
      awayScorers: '',
      playerEvents: []
    };
    const { caller, upsertMock } = fakeCaller({ error: null });
    await persistPendingMatchDraft(draftWithEmptyValues, caller);
    const sentRow = upsertMock.mock.calls[0][0][0];
    expect(sentRow.data.homeGoals).toBe(0);
    expect(sentRow.data.awayGoals).toBe(0);
    expect(sentRow.data.homeScorers).toBe('');
    expect(sentRow.data.awayScorers).toBe('');
    expect(sentRow.data.playerEvents).toEqual([]);
  });
});

describe('persistPendingMatchDraft -- errores de red', () => {
  it('devuelve WRITE_FAILED si Supabase responde con error sin lanzar', async () => {
    const { caller } = fakeCaller({ error: { message: 'permission denied for table matches' } });
    const outcome = await persistPendingMatchDraft(validDraft, caller);
    expect(outcome).toEqual({
      ok: false,
      error: { code: 'WRITE_FAILED', message: expect.any(String), cause: 'permission denied for table matches' }
    });
  });

  it('devuelve UNKNOWN si el caller inyectado rechaza inesperadamente', async () => {
    const caller: DraftPersistenceCaller = {
      from: vi.fn().mockReturnValue({ upsert: vi.fn().mockRejectedValue(new Error('network down')) })
    };
    const outcome = await persistPendingMatchDraft(validDraft, caller);
    expect(outcome.ok).toBe(false);
    if (outcome.ok === false) {
      expect(outcome.error.code).toBe('UNKNOWN');
      expect(outcome.error.cause).toBe('network down');
    }
  });
});

describe('persistPendingMatchDraft -- logging', () => {
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

  it('usa console.info para un guardado exitoso', async () => {
    const { caller } = fakeCaller({ error: null });
    await persistPendingMatchDraft(validDraft, caller);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).toHaveBeenCalledWith(expect.any(String), { matchId: validDraft.id });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('usa console.info (no console.error) para un error de validacion esperado', async () => {
    const { caller } = fakeCaller({ error: null });
    await persistPendingMatchDraft({ ...validDraft, id: '' }, caller);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('usa console.error para un fallo tecnico de escritura', async () => {
    const { caller } = fakeCaller({ error: { message: 'timeout' } });
    await persistPendingMatchDraft(validDraft, caller);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(expect.any(String), { matchId: validDraft.id, code: 'WRITE_FAILED' });
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it('no incluye el partido completo ni campos sensibles del acta en los logs', async () => {
    const richDraft: MatchResult = {
      ...validDraft,
      homeLineup: 'Jugador Secreto',
      notes: 'nota privada',
      proofImageUrl: 'https://ejemplo.com/prueba.png'
    };
    const { caller } = fakeCaller({ error: null });
    await persistPendingMatchDraft(richDraft, caller);
    const loggedArgs = infoSpy.mock.calls[0];
    expect(JSON.stringify(loggedArgs)).not.toContain('Jugador Secreto');
    expect(JSON.stringify(loggedArgs)).not.toContain('nota privada');
    expect(JSON.stringify(loggedArgs)).not.toContain('ejemplo.com');
  });
});
