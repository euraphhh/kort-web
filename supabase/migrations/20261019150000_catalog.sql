-- Catalog: business hours, professionals, their weekly hours, services and who does what.
-- Spec: docs/specs/painel-configuracoes-da-barbearia.md, painel-profissionais.md, painel-servicos.md
-- Rules: "inactivate, never delete" for professionals and services (appointment history);
-- tenant links use composite FKs (barbershop_id, id) so the database refuses cross-tenant links.

-- professional -------------------------------------------------------------

create table public.professional (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershop (id) on delete cascade,
  name text not null check (length(btrim(name)) > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Target of the composite FKs below.
  unique (barbershop_id, id)
);

create trigger professional_set_updated_at
  before update on public.professional
  for each row execute function public.set_updated_at();

-- FKs that were left open by the base migration (professional did not exist yet).
-- MATCH SIMPLE: owners have a null professional_id and are not checked.
alter table public.barbershop_member
  add constraint barbershop_member_professional_fk
  foreign key (barbershop_id, professional_id)
  references public.professional (barbershop_id, id);

alter table public.invite
  add constraint invite_professional_fk
  foreign key (barbershop_id, professional_id)
  references public.professional (barbershop_id, id);

-- business_hours -----------------------------------------------------------
-- Local time (America/Sao_Paulo), several intervals per weekday. weekday: 0 = Sunday ... 6 = Saturday.
-- The `time` type cannot hold 24:00, so a shop that closes at midnight ends at 23:59.

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershop (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  check (end_time > start_time),
  constraint business_hours_no_overlap exclude using gist (
    barbershop_id with =,
    weekday with =,
    tsrange(date '2000-01-01' + start_time, date '2000-01-01' + end_time) with &&
  )
);

-- professional_hours -------------------------------------------------------

create table public.professional_hours (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null,
  professional_id uuid not null,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  foreign key (barbershop_id, professional_id)
    references public.professional (barbershop_id, id) on delete cascade,
  check (end_time > start_time),
  constraint professional_hours_no_overlap exclude using gist (
    professional_id with =,
    weekday with =,
    tsrange(date '2000-01-01' + start_time, date '2000-01-01' + end_time) with &&
  )
);

create index professional_hours_barbershop_id_idx on public.professional_hours (barbershop_id);

-- A professional's interval must fit inside ONE business interval of that weekday
-- (so it cannot span the lunch break). Checked on write only: shrinking the business hours later
-- does not touch existing rows, the panel warns the owner instead (spec: configuracoes).
-- security definer so the check does not depend on the caller's RLS visibility.
create function public.check_professional_hours_within_business()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.business_hours b
    where b.barbershop_id = new.barbershop_id
      and b.weekday = new.weekday
      and b.start_time <= new.start_time
      and b.end_time >= new.end_time
  ) then
    raise exception 'professional hours must be within the business hours'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

revoke execute on function public.check_professional_hours_within_business() from public, anon, authenticated;

create trigger professional_hours_within_business
  before insert or update on public.professional_hours
  for each row execute function public.check_professional_hours_within_business();

-- service ------------------------------------------------------------------

create table public.service (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershop (id) on delete cascade,
  name text not null check (length(btrim(name)) > 0),
  price_cents integer not null check (price_cents >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (barbershop_id, id)
);

create trigger service_set_updated_at
  before update on public.service
  for each row execute function public.set_updated_at();

-- professional_service -----------------------------------------------------
-- Price and duration are optional overrides, empty in the MVP (V1 fills them, no migration needed).

create table public.professional_service (
  barbershop_id uuid not null,
  professional_id uuid not null,
  service_id uuid not null,
  price_cents integer check (price_cents >= 0),
  duration_minutes integer check (duration_minutes > 0),
  created_at timestamptz not null default now(),
  primary key (professional_id, service_id),
  foreign key (barbershop_id, professional_id)
    references public.professional (barbershop_id, id) on delete cascade,
  foreign key (barbershop_id, service_id)
    references public.service (barbershop_id, id) on delete cascade
);

create index professional_service_barbershop_service_idx
  on public.professional_service (barbershop_id, service_id);

-- privileges ---------------------------------------------------------------
-- Nothing for anon. Authenticated gets only what the panel needs; no DELETE on professional and
-- service (inactivate instead). Ids and timestamps are never client-writable.

revoke all on
  public.professional, public.business_hours, public.professional_hours,
  public.service, public.professional_service
from anon, authenticated;

grant select on
  public.professional, public.business_hours, public.professional_hours,
  public.service, public.professional_service
to authenticated;

grant insert (barbershop_id, name, active) on public.professional to authenticated;
grant update (name, active) on public.professional to authenticated;

grant insert (barbershop_id, weekday, start_time, end_time) on public.business_hours to authenticated;
grant update (weekday, start_time, end_time) on public.business_hours to authenticated;
grant delete on public.business_hours to authenticated;

grant insert (barbershop_id, professional_id, weekday, start_time, end_time)
  on public.professional_hours to authenticated;
grant update (weekday, start_time, end_time) on public.professional_hours to authenticated;
grant delete on public.professional_hours to authenticated;

grant insert (barbershop_id, name, price_cents, duration_minutes, active) on public.service to authenticated;
grant update (name, price_cents, duration_minutes, active) on public.service to authenticated;

grant insert (barbershop_id, professional_id, service_id, price_cents, duration_minutes)
  on public.professional_service to authenticated;
grant update (price_cents, duration_minutes) on public.professional_service to authenticated;
grant delete on public.professional_service to authenticated;

-- RLS ----------------------------------------------------------------------
-- Owner: full access to their barbershop. Barber: read-only, and only their own professional,
-- hours and services (plus the shop's business hours and service list the agenda needs).
-- Team (staff): read-only everywhere.

alter table public.professional enable row level security;
alter table public.business_hours enable row level security;
alter table public.professional_hours enable row level security;
alter table public.service enable row level security;
alter table public.professional_service enable row level security;

create policy professional_select on public.professional
  for select to authenticated
  using (
    public.is_owner(barbershop_id)
    or public.is_staff()
    or id = public.member_professional_id(barbershop_id)
  );
create policy professional_insert on public.professional
  for insert to authenticated with check (public.is_owner(barbershop_id));
create policy professional_update on public.professional
  for update to authenticated
  using (public.is_owner(barbershop_id)) with check (public.is_owner(barbershop_id));

create policy business_hours_select on public.business_hours
  for select to authenticated
  using (public.is_member(barbershop_id) or public.is_staff());
create policy business_hours_insert on public.business_hours
  for insert to authenticated with check (public.is_owner(barbershop_id));
create policy business_hours_update on public.business_hours
  for update to authenticated
  using (public.is_owner(barbershop_id)) with check (public.is_owner(barbershop_id));
create policy business_hours_delete on public.business_hours
  for delete to authenticated using (public.is_owner(barbershop_id));

create policy professional_hours_select on public.professional_hours
  for select to authenticated
  using (
    public.is_owner(barbershop_id)
    or public.is_staff()
    or professional_id = public.member_professional_id(barbershop_id)
  );
create policy professional_hours_insert on public.professional_hours
  for insert to authenticated with check (public.is_owner(barbershop_id));
create policy professional_hours_update on public.professional_hours
  for update to authenticated
  using (public.is_owner(barbershop_id)) with check (public.is_owner(barbershop_id));
create policy professional_hours_delete on public.professional_hours
  for delete to authenticated using (public.is_owner(barbershop_id));

create policy service_select on public.service
  for select to authenticated
  using (public.is_member(barbershop_id) or public.is_staff());
create policy service_insert on public.service
  for insert to authenticated with check (public.is_owner(barbershop_id));
create policy service_update on public.service
  for update to authenticated
  using (public.is_owner(barbershop_id)) with check (public.is_owner(barbershop_id));

create policy professional_service_select on public.professional_service
  for select to authenticated
  using (
    public.is_owner(barbershop_id)
    or public.is_staff()
    or professional_id = public.member_professional_id(barbershop_id)
  );
create policy professional_service_insert on public.professional_service
  for insert to authenticated with check (public.is_owner(barbershop_id));
create policy professional_service_update on public.professional_service
  for update to authenticated
  using (public.is_owner(barbershop_id)) with check (public.is_owner(barbershop_id));
create policy professional_service_delete on public.professional_service
  for delete to authenticated using (public.is_owner(barbershop_id));
