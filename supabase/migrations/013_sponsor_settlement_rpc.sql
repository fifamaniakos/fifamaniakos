-- Liquidacion de patrocinadores.
--
-- El calculo de que objetivos se cumplieron vive en el cliente
-- (src/utils/sponsorEngine.ts), pero el PAGO tiene que ser server-side: si el
-- cliente pudiera escribir presupuestos directamente, cualquier manager podria
-- acreditarse dinero. Esta RPC solo la puede ejecutar un admin, valida que el
-- club exista, y usa la clave unica de sponsor_payouts para ser idempotente:
-- si un objetivo ya se pago, se saltea sin sumar el dinero otra vez.
--
-- Devuelve true si acredito el pago, false si ya estaba pagado.

create or replace function public.settle_sponsor_payout(
  p_club_id text,
  p_season_number int,
  p_objective_id text,
  p_amount numeric,
  p_concept text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  club_row public.clubs%rowtype;
  payout_key text;
  club_budget numeric;
  inserted boolean;
begin
  if not public.is_admin() then
    raise exception 'Solo un administrador puede liquidar patrocinadores.';
  end if;

  if p_amount <= 0 then
    raise exception 'El premio debe ser mayor a cero.';
  end if;

  payout_key := 'payout-' || p_club_id || '-' || p_season_number || '-' || p_objective_id;

  select * into club_row from public.clubs where key = p_club_id for update;
  if not found then
    raise exception 'No se encontro el club %.', p_club_id;
  end if;

  insert into public.sponsor_payouts (key, data)
  values (
    payout_key,
    jsonb_build_object(
      'id', payout_key,
      'clubId', p_club_id,
      'seasonNumber', p_season_number,
      'objectiveId', p_objective_id,
      'amount', p_amount,
      'paidAt', to_char(now(), 'DD/MM/YYYY')
    )
  )
  on conflict (key) do nothing;

  -- FOUND se pisa con el resultado del INSERT, asi que se captura antes de
  -- ejecutar cualquier otra sentencia.
  inserted := found;

  -- Si no se inserto nada, este objetivo ya se habia pagado: no se toca el
  -- presupuesto ni se duplica la transaccion.
  if not inserted then
    return false;
  end if;

  club_budget := coalesce((club_row.data->>'budget')::numeric, 0);

  update public.clubs
  set data = jsonb_set(data, '{budget}', to_jsonb(club_budget + p_amount), true),
    updated_at = now()
  where key = p_club_id;

  perform public.add_financial_transaction(p_club_id, 'INGRESO', p_concept, p_amount);

  return true;
end;
$$;

revoke execute on function public.settle_sponsor_payout(text, int, text, numeric, text) from public, anon;
grant execute on function public.settle_sponsor_payout(text, int, text, numeric, text) to authenticated;
