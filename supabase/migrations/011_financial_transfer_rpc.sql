-- Registra fichajes con movimientos financieros atomicos.
--
-- Antes, el cliente intentaba actualizar transfers, players, clubs y
-- transactions por separado. Para un manager comprador eso chocaba con RLS al
-- tocar el club vendedor y, ademas, transactions no tenia lectura para el
-- propio manager. Estas funciones validan permisos y hacen todo en una sola
-- transaccion del lado de Postgres sin abrir updates directos sobre clubes de
-- terceros.

drop policy if exists "manager_read_own_transactions" on public.transactions;

create policy "manager_read_own_transactions" on public.transactions for select
  to authenticated
  using (club_id = public.current_manager_club_id());

create or replace function public.assert_can_transfer_for_buyer(p_buyer_club_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and p_buyer_club_id <> public.current_manager_club_id() then
    raise exception 'Solo podes fichar jugadores para tu propio club.';
  end if;
end;
$$;

create or replace function public.add_financial_transaction(
  p_club_id text,
  p_type text,
  p_concept text,
  p_amount numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  tx_id text := 'tx-' || replace(gen_random_uuid()::text, '-', '');
begin
  insert into public.transactions (key, data)
  values (
    tx_id,
    jsonb_build_object(
      'id', tx_id,
      'clubId', p_club_id,
      'type', p_type,
      'concept', p_concept,
      'amount', p_amount,
      'date', to_char(now(), 'DD/MM/YYYY')
    )
  );
end;
$$;

create or replace function public.complete_market_transfer(
  p_transfer_id text,
  p_buyer_club_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  transfer_row public.transfers%rowtype;
  buyer_row public.clubs%rowtype;
  seller_row public.clubs%rowtype;
  player_name text;
  player_id text;
  price numeric;
  buyer_budget numeric;
  seller_budget numeric;
begin
  perform public.assert_can_transfer_for_buyer(p_buyer_club_id);

  select * into transfer_row
  from public.transfers
  where key = p_transfer_id
  for update;

  if not found then
    raise exception 'La transferencia ya no existe.';
  end if;

  if transfer_row.data->>'status' <> 'DISPONIBLE' then
    raise exception 'Este jugador ya no esta disponible.';
  end if;

  if transfer_row.seller_club_id = p_buyer_club_id then
    raise exception 'El comprador y el vendedor no pueden ser el mismo club.';
  end if;

  price := coalesce((transfer_row.data->>'askingPrice')::numeric, 0);
  player_id := transfer_row.data->>'playerId';
  player_name := coalesce(transfer_row.data->'player'->>'name', 'Jugador');

  if coalesce(player_id, '') = '' then
    raise exception 'La transferencia no tiene jugador asociado.';
  end if;

  select * into buyer_row from public.clubs where key = p_buyer_club_id for update;
  if not found then
    raise exception 'No se encontro el club comprador.';
  end if;

  select * into seller_row from public.clubs where key = transfer_row.seller_club_id for update;
  if not found then
    raise exception 'No se encontro el club vendedor.';
  end if;

  buyer_budget := coalesce((buyer_row.data->>'budget')::numeric, 0);
  seller_budget := coalesce((seller_row.data->>'budget')::numeric, 0);

  if buyer_budget < price then
    raise exception 'Presupuesto insuficiente.';
  end if;

  update public.transfers
  set data = jsonb_set(
      jsonb_set(transfer_row.data, '{status}', '"VENDIDO"'::jsonb, true),
      '{buyerClubId}',
      to_jsonb(p_buyer_club_id),
      true
    ),
    updated_at = now()
  where key = p_transfer_id;

  update public.players
  set data = jsonb_set(
      jsonb_set(data, '{clubId}', to_jsonb(p_buyer_club_id), true),
      '{isStarter}',
      'false'::jsonb,
      true
    ),
    updated_at = now()
  where key = player_id;

  update public.clubs
  set data = jsonb_set(data, '{budget}', to_jsonb(buyer_budget - price), true),
    updated_at = now()
  where key = p_buyer_club_id;

  update public.clubs
  set data = jsonb_set(data, '{budget}', to_jsonb(seller_budget + price), true),
    updated_at = now()
  where key = transfer_row.seller_club_id;

  perform public.add_financial_transaction(p_buyer_club_id, 'GASTO', 'Fichaje de ' || player_name, price);
  perform public.add_financial_transaction(transfer_row.seller_club_id, 'INGRESO', 'Venta de ' || player_name, price);
end;
$$;

create or replace function public.complete_direct_transfer(
  p_player_id text,
  p_buyer_club_id text,
  p_price numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  player_row public.players%rowtype;
  buyer_row public.clubs%rowtype;
  seller_row public.clubs%rowtype;
  player_name text;
  seller_club_id text;
  buyer_budget numeric;
  seller_budget numeric;
  buyer_name text;
  seller_name text;
begin
  perform public.assert_can_transfer_for_buyer(p_buyer_club_id);

  if p_price <= 0 then
    raise exception 'El precio debe ser mayor a cero.';
  end if;

  select * into player_row from public.players where key = p_player_id for update;
  if not found then
    raise exception 'No se encontro el jugador.';
  end if;

  seller_club_id := player_row.club_id;
  player_name := coalesce(player_row.data->>'name', 'Jugador');

  if seller_club_id = p_buyer_club_id then
    raise exception 'El comprador y el vendedor no pueden ser el mismo club.';
  end if;

  select * into buyer_row from public.clubs where key = p_buyer_club_id for update;
  if not found then
    raise exception 'No se encontro el club comprador.';
  end if;

  select * into seller_row from public.clubs where key = seller_club_id for update;
  if not found then
    raise exception 'No se encontro el club vendedor.';
  end if;

  buyer_budget := coalesce((buyer_row.data->>'budget')::numeric, 0);
  seller_budget := coalesce((seller_row.data->>'budget')::numeric, 0);
  buyer_name := coalesce(buyer_row.data->>'name', 'Club comprador');
  seller_name := coalesce(seller_row.data->>'name', 'Club vendedor');

  if buyer_budget < p_price then
    raise exception 'Presupuesto insuficiente.';
  end if;

  update public.players
  set data = jsonb_set(
      jsonb_set(data, '{clubId}', to_jsonb(p_buyer_club_id), true),
      '{isStarter}',
      'false'::jsonb,
      true
    ),
    updated_at = now()
  where key = p_player_id;

  update public.clubs
  set data = jsonb_set(data, '{budget}', to_jsonb(buyer_budget - p_price), true),
    updated_at = now()
  where key = p_buyer_club_id;

  update public.clubs
  set data = jsonb_set(data, '{budget}', to_jsonb(seller_budget + p_price), true),
    updated_at = now()
  where key = seller_club_id;

  perform public.add_financial_transaction(
    p_buyer_club_id,
    'GASTO',
    'Fichaje directo de ' || player_name || ' (' || seller_name || ')',
    p_price
  );
  perform public.add_financial_transaction(
    seller_club_id,
    'INGRESO',
    'Venta directa de ' || player_name || ' a ' || buyer_name,
    p_price
  );
end;
$$;

create or replace function public.sign_free_agent_player(
  p_player jsonb,
  p_buyer_club_id text,
  p_price numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  buyer_row public.clubs%rowtype;
  buyer_budget numeric;
  player_id text;
  player_name text;
begin
  perform public.assert_can_transfer_for_buyer(p_buyer_club_id);

  if p_price <= 0 then
    raise exception 'El precio debe ser mayor a cero.';
  end if;

  player_id := p_player->>'id';
  player_name := coalesce(p_player->>'name', 'Jugador');

  if coalesce(player_id, '') = '' then
    raise exception 'El jugador no tiene id.';
  end if;

  select * into buyer_row from public.clubs where key = p_buyer_club_id for update;
  if not found then
    raise exception 'No se encontro el club comprador.';
  end if;

  buyer_budget := coalesce((buyer_row.data->>'budget')::numeric, 0);

  if buyer_budget < p_price then
    raise exception 'Presupuesto insuficiente.';
  end if;

  insert into public.players (key, data)
  values (
    player_id,
    jsonb_set(
      jsonb_set(p_player, '{clubId}', to_jsonb(p_buyer_club_id), true),
      '{value}',
      to_jsonb(p_price),
      true
    )
  )
  on conflict (key) do update
  set data = excluded.data,
    updated_at = now();

  update public.clubs
  set data = jsonb_set(data, '{budget}', to_jsonb(buyer_budget - p_price), true),
    updated_at = now()
  where key = p_buyer_club_id;

  perform public.add_financial_transaction(
    p_buyer_club_id,
    'GASTO',
    'Fichaje: ' || player_name,
    p_price
  );
end;
$$;

revoke execute on function public.assert_can_transfer_for_buyer(text) from public, anon, authenticated;
revoke execute on function public.add_financial_transaction(text, text, text, numeric) from public, anon, authenticated;

grant execute on function public.complete_market_transfer(text, text) to authenticated;
grant execute on function public.complete_direct_transfer(text, text, numeric) to authenticated;
grant execute on function public.sign_free_agent_player(jsonb, text, numeric) to authenticated;

-- Backfill contable para compras por clausula que ya quedaron marcadas como
-- VENDIDO antes de existir esta RPC. No modifica presupuestos para no duplicar
-- dinero si el saldo ya se habia actualizado; solo completa el historial.
insert into public.transactions (key, data)
select
  'tx-backfill-buy-' || t.key,
  jsonb_build_object(
    'id', 'tx-backfill-buy-' || t.key,
    'clubId', t.data->>'buyerClubId',
    'type', 'GASTO',
    'concept', 'Fichaje de ' || coalesce(t.data->'player'->>'name', 'Jugador'),
    'amount', coalesce((t.data->>'askingPrice')::numeric, 0),
    'date', to_char(now(), 'DD/MM/YYYY')
  )
from public.transfers t
where t.data->>'status' = 'VENDIDO'
  and coalesce(t.data->>'buyerClubId', '') <> ''
on conflict (key) do nothing;

insert into public.transactions (key, data)
select
  'tx-backfill-sell-' || t.key,
  jsonb_build_object(
    'id', 'tx-backfill-sell-' || t.key,
    'clubId', t.seller_club_id,
    'type', 'INGRESO',
    'concept', 'Venta de ' || coalesce(t.data->'player'->>'name', 'Jugador'),
    'amount', coalesce((t.data->>'askingPrice')::numeric, 0),
    'date', to_char(now(), 'DD/MM/YYYY')
  )
from public.transfers t
where t.data->>'status' = 'VENDIDO'
  and coalesce(t.data->>'buyerClubId', '') <> ''
on conflict (key) do nothing;
