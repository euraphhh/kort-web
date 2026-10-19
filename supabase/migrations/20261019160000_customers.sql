-- Customers of a barbershop (the people who talk to the WhatsApp agent).
-- Spec: docs/specs/painel-clientes-e-importacao-csv.md, agente-conversa-e-identificacao.md
-- Rules: phone is required and unique per barbershop; inactivate, never delete; barbers have no
-- access to customers; opt-out is recorded by the agent (service role), never by the panel.

create table public.customer (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershop (id) on delete cascade,
  name text not null check (length(btrim(name)) > 0),
  -- E.164 (international format, e.g. +5511999999999). Normalization lives in src/domain.
  phone text not null check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  active boolean not null default true,
  -- Customer asked to stop receiving automatic messages ("parar").
  opted_out boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (barbershop_id, phone),
  -- Target of the composite FK from appointment.
  unique (barbershop_id, id)
);

create trigger customer_set_updated_at
  before update on public.customer
  for each row execute function public.set_updated_at();

-- privileges ---------------------------------------------------------------
-- No DELETE (inactivate instead). opted_out is writable only by the service role.

revoke all on public.customer from anon, authenticated;
grant select on public.customer to authenticated;
grant insert (barbershop_id, name, phone) on public.customer to authenticated;
grant update (name, phone, active) on public.customer to authenticated;

-- RLS ----------------------------------------------------------------------
-- Owner: full access to their barbershop's customers. Barber: none. Team (staff): read-only.

alter table public.customer enable row level security;

create policy customer_select on public.customer
  for select to authenticated
  using (public.is_owner(barbershop_id) or public.is_staff());

create policy customer_insert on public.customer
  for insert to authenticated
  with check (public.is_owner(barbershop_id));

create policy customer_update on public.customer
  for update to authenticated
  using (public.is_owner(barbershop_id))
  with check (public.is_owner(barbershop_id));
