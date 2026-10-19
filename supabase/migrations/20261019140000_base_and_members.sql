-- Base schema: tenants (barbershop), members and invites, plus the role helpers RLS relies on.
-- Spec: docs/specs/painel-login-e-acesso.md, docs/specs/painel-recuperacao-de-senha-e-convite.md
-- Rules: every tenant table carries barbershop_id; RLS on for the panel (user JWT);
-- the service role (webhook, agent, jobs) bypasses RLS, so isolation there is done in code.

create extension if not exists btree_gist with schema extensions;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- barbershop ---------------------------------------------------------------

create table public.barbershop (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  address text,
  -- Required to import phones without area code. Collected during onboarding, so nullable here.
  default_ddd text check (default_ddd ~ '^[0-9]{2}$'),
  min_notice_minutes integer not null default 30 check (min_notice_minutes >= 0),
  cancel_limit_minutes integer not null default 120 check (cancel_limit_minutes >= 0),
  agent_enabled boolean not null default false,
  -- Set by the kort team in the MVP (manual WhatsApp connection).
  whatsapp_phone_number text,
  whatsapp_connection_status text not null default 'not_connected'
    check (whatsapp_connection_status in ('not_connected', 'connected', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index barbershop_whatsapp_phone_number_key
  on public.barbershop (whatsapp_phone_number)
  where whatsapp_phone_number is not null;

create trigger barbershop_set_updated_at
  before update on public.barbershop
  for each row execute function public.set_updated_at();

-- barbershop_member --------------------------------------------------------

create table public.barbershop_member (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershop (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'barber')),
  -- FK to professional is added with that table. A barber must be tied to a professional.
  professional_id uuid,
  created_at timestamptz not null default now(),
  unique (barbershop_id, user_id),
  check (role = 'owner' or professional_id is not null)
);

-- One owner per barbershop in the MVP.
create unique index barbershop_member_one_owner
  on public.barbershop_member (barbershop_id)
  where role = 'owner';

create index barbershop_member_user_id_idx on public.barbershop_member (user_id);

-- invite -------------------------------------------------------------------

create table public.invite (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershop (id) on delete cascade,
  -- FK to professional is added with that table.
  professional_id uuid not null,
  token uuid not null unique default gen_random_uuid(),
  expires_at timestamptz not null default now() + interval '24 hours',
  accepted_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index invite_barbershop_id_idx on public.invite (barbershop_id);

-- role helpers -------------------------------------------------------------
-- security definer so policies can read barbershop_member without recursing into its own RLS.

create function public.is_member(p_barbershop_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.barbershop_member m
    where m.barbershop_id = p_barbershop_id
      and m.user_id = (select auth.uid())
  );
$$;

create function public.is_owner(p_barbershop_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.barbershop_member m
    where m.barbershop_id = p_barbershop_id
      and m.user_id = (select auth.uid())
      and m.role = 'owner'
  );
$$;

create function public.member_professional_id(p_barbershop_id uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select m.professional_id
  from public.barbershop_member m
  where m.barbershop_id = p_barbershop_id
    and m.user_id = (select auth.uid())
    and m.role = 'barber';
$$;

-- Internal team: set by the kort team in app_metadata (users cannot edit it).
create function public.is_staff()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((select auth.jwt()) -> 'app_metadata' ->> 'kort_role', '') = 'staff';
$$;

revoke execute on function
  public.is_member(uuid),
  public.is_owner(uuid),
  public.member_professional_id(uuid),
  public.is_staff()
from public, anon;

grant execute on function
  public.is_member(uuid),
  public.is_owner(uuid),
  public.member_professional_id(uuid),
  public.is_staff()
to authenticated;

-- privileges ---------------------------------------------------------------
-- Defense in depth: nothing for anon, and only what the panel needs for authenticated.

revoke all on public.barbershop, public.barbershop_member, public.invite from anon, authenticated;

grant select on public.barbershop to authenticated;
-- WhatsApp number and connection status are managed by the team, not by the owner.
grant update (name, address, default_ddd, min_notice_minutes, cancel_limit_minutes, agent_enabled)
  on public.barbershop to authenticated;

grant select, delete on public.barbershop_member to authenticated;
grant select, insert, delete on public.invite to authenticated;

-- RLS ----------------------------------------------------------------------

alter table public.barbershop enable row level security;
alter table public.barbershop_member enable row level security;
alter table public.invite enable row level security;

create policy barbershop_select on public.barbershop
  for select to authenticated
  using (public.is_member(id) or public.is_staff());

create policy barbershop_update on public.barbershop
  for update to authenticated
  using (public.is_owner(id))
  with check (public.is_owner(id));

-- Members are created by the server (invite acceptance, team scripts), never by the client.
create policy barbershop_member_select on public.barbershop_member
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_owner(barbershop_id)
    or public.is_staff()
  );

-- The owner can revoke a barber's access, never another owner.
create policy barbershop_member_delete on public.barbershop_member
  for delete to authenticated
  using (public.is_owner(barbershop_id) and role = 'barber');

create policy invite_select on public.invite
  for select to authenticated
  using (public.is_owner(barbershop_id));

create policy invite_insert on public.invite
  for insert to authenticated
  with check (public.is_owner(barbershop_id));

create policy invite_delete on public.invite
  for delete to authenticated
  using (public.is_owner(barbershop_id));
