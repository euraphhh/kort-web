begin;
create extension if not exists pgtap with schema extensions;

select plan(39);

-- fixtures (as the postgres superuser) ---------------------------------------
-- users a1 owner A, a2 barber A (professional c1), b1 owner B, e1 stranger (used as staff).
-- professionals c1, c2 in A; c3 in B. services d1 in A, d2 in B. customers f1, f2 in A; f3 in B.

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'owner-a@test.kort'),
  ('00000000-0000-0000-0000-0000000000a2', 'barber-a@test.kort'),
  ('00000000-0000-0000-0000-0000000000b1', 'owner-b@test.kort'),
  ('00000000-0000-0000-0000-0000000000e1', 'stranger@test.kort');

insert into public.barbershop (id, name) values
  ('00000000-0000-0000-0000-00000000aaaa', 'Barbearia A'),
  ('00000000-0000-0000-0000-00000000bbbb', 'Barbearia B');

insert into public.professional (id, barbershop_id, name) values
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-00000000aaaa', 'Joao'),
  ('00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-00000000aaaa', 'Pedro'),
  ('00000000-0000-0000-0000-0000000000c3', '00000000-0000-0000-0000-00000000bbbb', 'Caio');

insert into public.barbershop_member (barbershop_id, user_id, role, professional_id) values
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000a1', 'owner', null),
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000a2', 'barber',
    '00000000-0000-0000-0000-0000000000c1'),
  ('00000000-0000-0000-0000-00000000bbbb', '00000000-0000-0000-0000-0000000000b1', 'owner', null);

insert into public.service (id, barbershop_id, name, price_cents, duration_minutes) values
  ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-00000000aaaa', 'Corte', 4500, 30),
  ('00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-00000000bbbb', 'Corte', 5000, 30);

insert into public.customer (id, barbershop_id, name, phone) values
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-00000000aaaa', 'Maria', '+5511999990001'),
  ('00000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-00000000aaaa', 'Ana', '+5511999990002'),
  ('00000000-0000-0000-0000-0000000000f3', '00000000-0000-0000-0000-00000000bbbb', 'Carlos', '+5511999990003');

-- 2026-11-02 10:00-10:30 UTC for c1 (ap1) and c2 (ap2) in A, c3 in B (ap3).
insert into public.appointment
  (id, barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
values
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-00000000aaaa',
    '00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000c1',
    '00000000-0000-0000-0000-0000000000d1', '2026-11-02 10:00+00', '2026-11-02 10:30+00', 4500, 30, 'panel'),
  ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-00000000aaaa',
    '00000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000c2',
    '00000000-0000-0000-0000-0000000000d1', '2026-11-02 10:00+00', '2026-11-02 10:30+00', 4500, 30, 'agent'),
  ('00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-00000000bbbb',
    '00000000-0000-0000-0000-0000000000f3', '00000000-0000-0000-0000-0000000000c3',
    '00000000-0000-0000-0000-0000000000d2', '2026-11-02 10:00+00', '2026-11-02 10:30+00', 5000, 30, 'panel');

-- a block of c2 at 12h-13h
insert into public.schedule_block (barbershop_id, professional_id, starts_at, ends_at) values
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c2',
    '2026-11-02 12:00+00', '2026-11-02 13:00+00');

-- Runs a DML statement as the current role and returns how many rows it affected.
create function pg_temp.affected(q text) returns int
language plpgsql as $$
declare n int;
begin
  execute q;
  get diagnostics n = row_count;
  return n;
end;
$$;

-- constraints (as superuser) -------------------------------------------------

select throws_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f2',
      '00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 10:15+00', '2026-11-02 10:45+00', 4500, 30, 'panel')$$,
  '23P01', null, 'overlapping appointments of the same professional are refused (no overbooking)');

select lives_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f2',
      '00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 10:30+00', '2026-11-02 11:00+00', 4500, 30, 'panel')$$,
  'back-to-back appointments are fine');

select lives_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, status, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f2',
      '00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 10:00+00', '2026-11-02 10:30+00', 4500, 30, 'cancelled', 'panel')$$,
  'a cancelled appointment does not conflict with an active one');

select throws_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f2',
      '00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 12:00+00', '2026-11-02 12:45+00', 4500, 30, 'panel')$$,
  '23514', null, 'the end must match the start plus the copied duration');

select throws_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f3',
      '00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 15:00+00', '2026-11-02 15:30+00', 4500, 30, 'panel')$$,
  '23503', null, 'an appointment cannot use a customer of another barbershop');

select throws_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f1',
      '00000000-0000-0000-0000-0000000000c3', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 15:00+00', '2026-11-02 15:30+00', 4500, 30, 'panel')$$,
  '23503', null, 'an appointment cannot use a professional of another barbershop');

select throws_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, status, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f1',
      '00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 15:00+00', '2026-11-02 15:30+00', 4500, 30, 'done', 'panel')$$,
  '23514', null, 'an unknown status is refused');

select throws_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, auto_closed, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f1',
      '00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 15:00+00', '2026-11-02 15:30+00', 4500, 30, true, 'panel')$$,
  '23514', null, 'only a completed appointment can be auto closed');

select throws_ok(
  $$insert into public.schedule_block (barbershop_id, professional_id, starts_at, ends_at)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c2',
      '2026-11-02 14:00+00', '2026-11-02 13:00+00')$$,
  '23514', null, 'a block must end after it starts');

select lives_ok(
  $$insert into public.schedule_block (barbershop_id, professional_id, starts_at, ends_at)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c2',
      '2026-11-02 10:00+00', '2026-11-02 10:30+00')$$,
  'a block can overlap an existing appointment (it does not cancel it)');

-- owner of A ---------------------------------------------------------------

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select is((select count(*)::int from public.appointment), 4,
  'owner sees only the appointments of their own barbershop');

select lives_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f2',
      '00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 12:00+00', '2026-11-02 12:30+00', 4500, 30, 'panel')$$,
  'owner can book an appointment (even over a block)');

select throws_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f2',
      '00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 16:00+00', '2026-11-02 16:30+00', 4500, 30, 'agent')$$,
  '42501', null, 'the panel cannot create agent appointments');

select throws_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f2',
      '00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 12:15+00', '2026-11-02 12:45+00', 4500, 30, 'panel')$$,
  '23P01', null, 'the owner cannot overbook either');

select throws_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000bbbb', '00000000-0000-0000-0000-0000000000f3',
      '00000000-0000-0000-0000-0000000000c3', '00000000-0000-0000-0000-0000000000d2',
      '2026-11-02 15:00+00', '2026-11-02 15:30+00', 5000, 30, 'panel')$$,
  '42501', null, 'owner cannot book in another barbershop');

select lives_ok(
  $$update public.appointment set status = 'cancelled' where id = '00000000-0000-0000-0000-000000001002'$$,
  'owner can cancel an appointment');

select lives_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f1',
      '00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 09:00+00', '2026-11-02 09:30+00', 4500, 30, 'panel')$$,
  'a cancelled slot can be booked again');

select throws_ok(
  $$delete from public.appointment where id = '00000000-0000-0000-0000-000000001001'$$,
  '42501', null, 'owner cannot delete an appointment (cancel instead)');

select throws_ok(
  $$update public.appointment set auto_closed = true, status = 'completed'
    where id = '00000000-0000-0000-0000-000000001001'$$,
  '42501', null, 'the panel cannot set auto_closed');

select throws_ok(
  $$update public.appointment set source = 'agent' where id = '00000000-0000-0000-0000-000000001001'$$,
  '42501', null, 'the panel cannot change the source');

-- barber of A (professional c1) ----------------------------------------------

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);

select is((select count(*)::int from public.appointment), 3,
  'barber sees only the appointments of their own professional');

select is((select count(*)::int from public.appointment
  where professional_id = '00000000-0000-0000-0000-0000000000c2'), 0,
  'barber does not see another professional''s appointments');

select is((select count(*)::int from public.customer), 2,
  'barber sees only the customers of their own agenda');

select lives_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f1',
      '00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 14:00+00', '2026-11-02 14:30+00', 4500, 30, 'panel')$$,
  'barber can book on their own agenda');

select throws_ok(
  $$insert into public.appointment (barbershop_id, customer_id, professional_id, service_id, starts_at, ends_at, price_cents, duration_minutes, source)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000f1',
      '00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000d1',
      '2026-11-02 14:00+00', '2026-11-02 14:30+00', 4500, 30, 'panel')$$,
  '42501', null, 'barber cannot book on another professional''s agenda');

select is(
  pg_temp.affected($$update public.appointment set status = 'no_show'
    where id = '00000000-0000-0000-0000-000000001001'$$),
  1, 'barber can close their own appointment');

select is(
  pg_temp.affected($$update public.appointment set status = 'completed'
    where id = '00000000-0000-0000-0000-000000001002'$$),
  0, 'barber cannot close another professional''s appointment');

select throws_ok(
  $$update public.appointment set professional_id = '00000000-0000-0000-0000-0000000000c2'
    where id = '00000000-0000-0000-0000-000000001001'$$,
  '42501', null, 'barber cannot hand an appointment to another professional');

select lives_ok(
  $$insert into public.schedule_block (barbershop_id, professional_id, starts_at, ends_at, reason)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c1',
      '2026-11-02 17:00+00', '2026-11-02 18:00+00', 'dentista')$$,
  'barber can block their own time');

select throws_ok(
  $$insert into public.schedule_block (barbershop_id, professional_id, starts_at, ends_at)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c2',
      '2026-11-02 17:00+00', '2026-11-02 18:00+00')$$,
  '42501', null, 'barber cannot block another professional''s time');

select is((select count(*)::int from public.schedule_block), 1,
  'barber sees only their own blocks');

select is(
  public.find_or_create_customer('00000000-0000-0000-0000-00000000aaaa', 'Qualquer', '+5511999990001'),
  '00000000-0000-0000-0000-0000000000f1'::uuid,
  'find_or_create_customer returns the existing customer for an exact phone');

select isnt(
  public.find_or_create_customer('00000000-0000-0000-0000-00000000aaaa', 'Novo', '+5511999990099'),
  null::uuid, 'find_or_create_customer registers a new phone');

select throws_ok(
  $$select public.find_or_create_customer('00000000-0000-0000-0000-00000000bbbb', 'Intruso', '+5511999990077')$$,
  '42501', null, 'find_or_create_customer refuses another barbershop');

select throws_ok(
  $$select public.find_or_create_customer('00000000-0000-0000-0000-00000000aaaa', 'Ruim', '123')$$,
  '23514', null, 'find_or_create_customer refuses a phone out of international format');

-- owner of B ---------------------------------------------------------------

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);

select is((select count(*)::int from public.appointment), 1,
  'owner of B sees only the appointments of B');

-- team (staff) ---------------------------------------------------------------

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000e1","role":"authenticated","app_metadata":{"kort_role":"staff"}}', true);

select cmp_ok((select count(*)::int from public.appointment), '>=', 5,
  'staff can read the appointments of every barbershop');

select is(
  pg_temp.affected($$update public.appointment set status = 'cancelled'
    where id = '00000000-0000-0000-0000-000000001003'$$),
  0, 'staff cannot change appointments');

-- anonymous ----------------------------------------------------------------

reset role;
set local role anon;

select throws_ok(
  $$select count(*) from public.appointment$$,
  '42501', null, 'anon has no access to appointments');

select * from finish();
rollback;
