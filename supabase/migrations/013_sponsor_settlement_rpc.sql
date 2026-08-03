-- Liquidacion de patrocinadores.
--
-- El calculo de QUE objetivos se cumplieron vive en el cliente
-- (src/utils/sponsorEngine.ts), pero el PAGO tiene que ser server-side: si el
-- cliente pudiera escribir presupuestos directamente, cualquier manager podria
-- acreditarse dinero.
--
-- Por eso esta RPC recibe solo IDENTIFICADORES, nunca montos. El premio, el
-- concepto y la marca contratada se leen de la base. Aunque un admin con la
-- consola abierta arme la llamada a mano, no puede inventar cuanto se paga ni
-- cobrar un objetivo de una marca que el club no firmo.
--
-- Devuelve true si acredito el pago, false si ese objetivo ya estaba pagado.

drop function if exists public.settle_sponsor_payout(text, int, text, numeric, text);

create or replace function public.settle_sponsor_payout(
  p_club_id text,
  p_season_number int,
  p_objective_id text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  club_row public.clubs%rowtype;
  contract_row public.club_sponsor_contracts%rowtype;
  objective_data jsonb;
  sponsor_id text;
  sponsor_name text;
  objective_label text;
  amount numeric;
  concept text;
  payout_key text;
  inserted boolean;
begin
  if not public.is_admin() then
    raise exception 'Solo un administrador puede liquidar patrocinadores.';
  end if;

  select * into club_row from public.clubs where key = p_club_id for update;
  if not found then
    raise exception 'No se encontro el club %.', p_club_id;
  end if;

  select * into contract_row
  from public.club_sponsor_contracts
  where club_id = p_club_id and season_number = p_season_number;

  if not found then
    raise exception 'El club % no tiene contrato de patrocinio en la temporada %.', p_club_id, p_season_number;
  end if;

  sponsor_id := contract_row.data->>'sponsorId';

  select data into objective_data
  from public.sponsor_objectives
  where key = p_objective_id;

  if objective_data is null then
    raise exception 'No existe el objetivo %.', p_objective_id;
  end if;

  -- Sin esta validacion se podria cobrar la clausula mas cara del catalogo
  -- estando contratado con la marca mas barata.
  if objective_data->>'sponsorId' is distinct from sponsor_id then
    raise exception 'El objetivo % no pertenece a la marca contratada por el club %.', p_objective_id, p_club_id;
  end if;

  amount := coalesce((objective_data->>'rewardMillions')::numeric, 0) * 1000000;
  if amount <= 0 then
    raise exception 'El objetivo % no tiene premio configurado.', p_objective_id;
  end if;

  objective_label := coalesce(objective_data->>'label', p_objective_id);
  select coalesce(data->>'name', 'Patrocinador') into sponsor_name
  from public.sponsors
  where key = sponsor_id;

  concept := 'Bonus ' || coalesce(sponsor_name, 'Patrocinador') || ' - ' || objective_label;

  -- Separador '|' en vez de '-': los ids de club y de objetivo ya contienen
  -- guiones, asi que concatenar con guiones permitia que dos tripletas
  -- distintas produjeran la misma clave y que un club perdiera su premio en
  -- silencio, reportado como "ya estaba pagado".
  payout_key := 'payout|' || p_club_id || '|' || p_season_number || '|' || p_objective_id;

  insert into public.sponsor_payouts (key, data)
  values (
    payout_key,
    jsonb_build_object(
      'id', payout_key,
      'clubId', p_club_id,
      'seasonNumber', p_season_number,
      'objectiveId', p_objective_id,
      'amount', amount,
      'paidAt', to_char(now(), 'DD/MM/YYYY')
    )
  )
  on conflict (key) do nothing;

  -- FOUND se pisa con el resultado de cada sentencia, asi que se captura
  -- inmediatamente despues del INSERT.
  inserted := found;

  -- Si no se inserto nada, este objetivo ya se habia pagado: no se toca el
  -- presupuesto ni se duplica la transaccion.
  if not inserted then
    return false;
  end if;

  update public.clubs
  set data = jsonb_set(
      data,
      '{budget}',
      to_jsonb(coalesce((club_row.data->>'budget')::numeric, 0) + amount),
      true
    ),
    updated_at = now()
  where key = p_club_id;

  perform public.add_financial_transaction(p_club_id, 'INGRESO', concept, amount);

  return true;
end;
$$;

revoke execute on function public.settle_sponsor_payout(text, int, text) from public, anon;
grant execute on function public.settle_sponsor_payout(text, int, text) to authenticated;
