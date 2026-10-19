begin;
create extension if not exists pgtap with schema extensions;

-- Rules that must hold for EVERY table, present and future, so a new migration cannot quietly
-- break multi-tenant isolation: RLS everywhere, barbershop_id everywhere, nothing for anon,
-- search_path pinned on security definer functions, and no tenant sees another tenant's rows.

select plan(9);

-- structure checks --------------------------------------------------------------

select is(
  (select count(*)::int from pg_tables where schemaname = 'public' and not rowsecurity),
  0, 'every table in public has RLS enabled');

select is(
  (select count(*)::int
   from pg_tables t
   where t.schemaname = 'public'
     and t.tablename <> 'barbershop'
     and not exists (
       select 1 from information_schema.columns c
       where c.table_schema = 'public' and c.table_name = t.tablename and c.column_name = 'barbershop_id'
     )),
  0, 'every tenant table has a barbershop_id column');

select is(
  (select count(*)::int
   from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind in ('r', 'v')
     and (has_table_privilege('anon', c.oid, 'select,insert,update,delete')
          or has_any_column_privilege('anon', c.oid, 'select,insert,update'))),
  0, 'anon has no privilege on any table or view in public');

select is(
  (select count(*)::int
   from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute')),
  0, 'anon cannot execute any function in public');

select is(
  (select count(*)::int
   from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.prosecdef
     and coalesce(array_to_string(p.proconfig, ','), '') not like '%search_path=%'),
  0, 'every security definer function pins its search_path');

-- fixtures: the same data in every table for two barbershops --------------------

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'owner-a@test.kort'),
  ('00000000-0000-0000-0000-0000000000a2', 'barber-a@test.kort'),
  ('00000000-0000-0000-0000-0000000000b1', 'owner-b@test.kort');

do $$
declare
  i int;
  shops uuid[] := array['00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-00000000bbbb']::uuid[];
  owners uuid[] := array['00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000b1']::uuid[];
  profs uuid[] := array['00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c3']::uuid[];
  svcs uuid[] := array['00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000d2']::uuid[];
  custs uuid[] := array['00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000f2']::uuid[];
begin
  for i in 1..2 loop
    insert into public.barbershop (id, name) values (shops[i], 'Barbearia ' || i);
    insert into public.professional (id, barbershop_id, name) values (profs[i], shops[i], 'Prof ' || i);
    insert into public.barbershop_member (barbershop_id, user_id, role) values (shops[i], owners[i], 'owner');
    insert into public.service (id, barbershop_id, name, price_cents, duration_minutes)
      values (svcs[i], shops[i], 'Corte', 4500, 30);
    insert into public.customer (id, barbershop_id, name, phone)
      values (custs[i], shops[i], 'Cliente ' || i, '+55119999900' || i || '1');
    insert into public.professional_service (barbershop_id, professional_id, service_id)
      values (shops[i], profs[i], svcs[i]);
    insert into public.business_hours (barbershop_id, weekday, start_time, end_time)
      values (shops[i], 1, '09:00', '18:00');
    insert into public.professional_hours (barbershop_id, professional_id, weekday, start_time, end_time)
      values (shops[i], profs[i], 1, '09:00', '12:00');
    insert into public.appointment
      (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
      values (shops[i], custs[i], profs[i], svcs[i], '2026-11-02 10:00+00', '2026-11-02 10:30+00', 4500, 30, 'panel');
    insert into public.schedule_block (barbershop_id, professional_id, starts_at, ends_at)
      values (shops[i], profs[i], '2026-11-02 12:00+00', '2026-11-02 13:00+00');
    insert into public.invite (barbershop_id, professional_id) values (shops[i], profs[i]);
  end loop;

  -- a barber in A, tied to professional c1
  insert into public.barbershop_member (barbershop_id, user_id, role, professional_id)
    values (shops[1], '00000000-0000-0000-0000-0000000000a2', 'barber', profs[1]);
end;
$$;

-- helpers (run as the current role, so RLS applies) -------------------------------

-- Tables and views of public that show at least one row of the given barbershop.
create function pg_temp.cross_tenant_leaks(other uuid) returns text
language plpgsql as $$
declare r record; n int; leaks text[] := '{}';
begin
  for r in
    select c.relname::text as name
    from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
    where ns.nspname = 'public' and c.relkind in ('r', 'v')
  loop
    execute format(
      'select count(*) from public.%I where %I = %L',
      r.name,
      case when r.name in ('barbershop', 'barbershop_summary') then 'id' else 'barbershop_id' end,
      other) into n;
    if n > 0 then leaks := leaks || r.name; end if;
  end loop;
  return coalesce(array_to_string(leaks, ','), '');
end;
$$;

-- Positive control: tables where the given barbershop's owner sees none of their own rows.
create function pg_temp.empty_own_tables(own uuid) returns text
language plpgsql as $$
declare r record; n int; empty text[] := '{}';
begin
  for r in
    select c.relname::text as name
    from pg_class c join pg_namespace ns on ns.oid = c.relnamespace
    where ns.nspname = 'public' and c.relkind in ('r', 'v')
  loop
    execute format(
      'select count(*) from public.%I where %I = %L',
      r.name,
      case when r.name in ('barbershop', 'barbershop_summary') then 'id' else 'barbershop_id' end,
      own) into n;
    if n = 0 then empty := empty || r.name; end if;
  end loop;
  return coalesce(array_to_string(empty, ','), '');
end;
$$;

-- isolation ----------------------------------------------------------------------

set local role authenticated;

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select is(pg_temp.empty_own_tables('00000000-0000-0000-0000-00000000aaaa'), '',
  'control: the owner of A sees their own rows in every table (the isolation checks are not vacuous)');

select is(pg_temp.cross_tenant_leaks('00000000-0000-0000-0000-00000000bbbb'), '',
  'the owner of A sees no row of B in any table or view');

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);

select is(pg_temp.cross_tenant_leaks('00000000-0000-0000-0000-00000000aaaa'), '',
  'the owner of B sees no row of A in any table or view');

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);

select is(pg_temp.cross_tenant_leaks('00000000-0000-0000-0000-00000000bbbb'), '',
  'a barber of A sees no row of B in any table or view');

select * from finish();
rollback;
