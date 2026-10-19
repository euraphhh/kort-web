-- Agenda: appointments (with the anti-overbooking exclusion constraint) and schedule blocks.
-- Spec: docs/specs/agente-agendar-horario.md, painel-agenda-tela-inicial.md,
--       painel-agendamento-manual.md, painel-bloqueios-de-agenda.md, painel-fila-a-fechar.md
-- Rules: no overbooking, guaranteed by Postgres; price and duration are copied at creation;
-- never delete an appointment (cancel it); UTC in the database.

-- appointment --------------------------------------------------------------

create table public.appointment (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershop (id) on delete cascade,
  customer_id uuid not null,
  professional_id uuid not null,
  service_id uuid not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  -- Copied from the service when the appointment is created; later price changes do not touch it.
  price_cents integer not null check (price_cents >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  status text not null default 'scheduled'
    check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  -- 'agent' rows are written by the server (service role); the panel only creates 'panel' rows.
  source text not null check (source in ('agent', 'panel')),
  confirmed boolean not null default false,
  -- Set by the 48h job: closed without anyone marking attended or no-show.
  auto_closed boolean not null default false,
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- History is kept: these FKs do not cascade.
  foreign key (barbershop_id, customer_id) references public.customer (barbershop_id, id),
  foreign key (barbershop_id, professional_id) references public.professional (barbershop_id, id),
  foreign key (barbershop_id, service_id) references public.service (barbershop_id, id),
  check (ends_at > starts_at),
  check (ends_at = starts_at + make_interval(mins => duration_minutes)),
  check (not auto_closed or status = 'completed'),
  -- No overbooking: a professional cannot have two overlapping appointments, cancelled ones aside.
  -- Error 23P01 is turned into "horario ocupado" by the agent tool and by the panel.
  constraint appointment_no_overlap exclude using gist (
    professional_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status <> 'cancelled')
);

create index appointment_barbershop_starts_at_idx on public.appointment (barbershop_id, starts_at);
create index appointment_customer_id_idx on public.appointment (customer_id);

create trigger appointment_set_updated_at
  before update on public.appointment
  for each row execute function public.set_updated_at();

-- schedule_block -----------------------------------------------------------
-- One-off block (lunch, day off, appointment elsewhere). Deliberately NOT part of the exclusion
-- constraint: the owner may book over a block, with a warning (spec: agendamento manual).
-- It only removes those hours from the availability the agent sees.

create table public.schedule_block (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null,
  professional_id uuid not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (barbershop_id, professional_id)
    references public.professional (barbershop_id, id) on delete cascade,
  check (ends_at > starts_at)
);

create index schedule_block_professional_starts_at_idx
  on public.schedule_block (professional_id, starts_at);
create index schedule_block_barbershop_id_idx on public.schedule_block (barbershop_id);

-- customers a barber can see ---------------------------------------------------
-- A barber has no customer list, but sees the customers of the appointments on their own agenda.

create function public.barber_serves_customer(p_barbershop_id uuid, p_customer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.appointment a
    where a.barbershop_id = p_barbershop_id
      and a.customer_id = p_customer_id
      and a.professional_id = public.member_professional_id(p_barbershop_id)
  );
$$;

revoke execute on function public.barber_serves_customer(uuid, uuid) from public, anon;
grant execute on function public.barber_serves_customer(uuid, uuid) to authenticated;

drop policy customer_select on public.customer;
create policy customer_select on public.customer
  for select to authenticated
  using (
    public.is_owner(barbershop_id)
    or public.is_staff()
    or public.barber_serves_customer(barbershop_id, id)
  );

-- find or create a customer by exact phone ---------------------------------------
-- Lets a barber book for a customer without listing customers: exact phone in, id out.
-- Never returns another customer's data. Members of the barbershop only.

create function public.find_or_create_customer(p_barbershop_id uuid, p_name text, p_phone text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if not public.is_member(p_barbershop_id) then
    raise exception 'not a member of this barbershop' using errcode = 'insufficient_privilege';
  end if;

  select c.id into v_id
  from public.customer c
  where c.barbershop_id = p_barbershop_id and c.phone = p_phone;

  if v_id is null then
    insert into public.customer (barbershop_id, name, phone)
    values (p_barbershop_id, p_name, p_phone)
    returning id into v_id;
  end if;

  return v_id;
end;
$$;

revoke execute on function public.find_or_create_customer(uuid, text, text) from public, anon;
grant execute on function public.find_or_create_customer(uuid, text, text) to authenticated;

-- privileges ---------------------------------------------------------------
-- No DELETE on appointments (cancel instead). auto_closed and source are never updatable by the panel.

revoke all on public.appointment, public.schedule_block from anon, authenticated;

grant select on public.appointment, public.schedule_block to authenticated;

grant insert (
  barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at,
  price_cents, duration_minutes, status, source, confirmed
) on public.appointment to authenticated;

grant update (
  customer_id, professional_id, service_id, starts_at, ends_at,
  price_cents, duration_minutes, status, confirmed
) on public.appointment to authenticated;

grant insert (barbershop_id, professional_id, starts_at, ends_at, reason)
  on public.schedule_block to authenticated;
grant update (starts_at, ends_at, reason) on public.schedule_block to authenticated;
grant delete on public.schedule_block to authenticated;

-- RLS ----------------------------------------------------------------------
-- Owner: everything in their barbershop. Barber: only their own professional's agenda
-- (close, book, reschedule, cancel, block). Team (staff): read-only.

alter table public.appointment enable row level security;
alter table public.schedule_block enable row level security;

create policy appointment_select on public.appointment
  for select to authenticated
  using (
    public.is_owner(barbershop_id)
    or public.is_staff()
    or professional_id = public.member_professional_id(barbershop_id)
  );

-- The panel only creates 'panel' appointments; the agent (service role) creates 'agent' ones.
create policy appointment_insert on public.appointment
  for insert to authenticated
  with check (
    source = 'panel'
    and (
      public.is_owner(barbershop_id)
      or professional_id = public.member_professional_id(barbershop_id)
    )
  );

create policy appointment_update on public.appointment
  for update to authenticated
  using (
    public.is_owner(barbershop_id)
    or professional_id = public.member_professional_id(barbershop_id)
  )
  with check (
    public.is_owner(barbershop_id)
    or professional_id = public.member_professional_id(barbershop_id)
  );

create policy schedule_block_select on public.schedule_block
  for select to authenticated
  using (
    public.is_owner(barbershop_id)
    or public.is_staff()
    or professional_id = public.member_professional_id(barbershop_id)
  );

create policy schedule_block_insert on public.schedule_block
  for insert to authenticated
  with check (
    public.is_owner(barbershop_id)
    or professional_id = public.member_professional_id(barbershop_id)
  );

create policy schedule_block_update on public.schedule_block
  for update to authenticated
  using (
    public.is_owner(barbershop_id)
    or professional_id = public.member_professional_id(barbershop_id)
  )
  with check (
    public.is_owner(barbershop_id)
    or professional_id = public.member_professional_id(barbershop_id)
  );

create policy schedule_block_delete on public.schedule_block
  for delete to authenticated
  using (
    public.is_owner(barbershop_id)
    or professional_id = public.member_professional_id(barbershop_id)
  );
