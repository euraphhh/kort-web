begin;
create extension if not exists pgtap with schema extensions;

select plan(30);

-- fixtures (as the postgres superuser) ---------------------------------------
-- ids: users a1 owner A, a2 barber A (professional c1), b1 owner B, e1 stranger.
-- professionals c1 and c2 in A, c3 in B. services d1 in A, d2 in B.

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

insert into public.professional_service (barbershop_id, professional_id, service_id) values
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c1',
    '00000000-0000-0000-0000-0000000000d1'),
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c2',
    '00000000-0000-0000-0000-0000000000d1');

-- weekday 1 (Monday): open 09h-12h and 13h-18h in A.
insert into public.business_hours (barbershop_id, weekday, start_time, end_time) values
  ('00000000-0000-0000-0000-00000000aaaa', 1, '09:00', '12:00'),
  ('00000000-0000-0000-0000-00000000aaaa', 1, '13:00', '18:00');

insert into public.professional_hours (barbershop_id, professional_id, weekday, start_time, end_time) values
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c2', 1, '13:00', '18:00');

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
  $$insert into public.professional_service (barbershop_id, professional_id, service_id)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c3',
      '00000000-0000-0000-0000-0000000000d1')$$,
  '23503', null, 'a service cannot be linked to a professional of another barbershop');

select throws_ok(
  $$insert into public.barbershop_member (barbershop_id, user_id, role, professional_id)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000e1', 'barber',
      '00000000-0000-0000-0000-0000000000c3')$$,
  '23503', null, 'a member cannot be tied to a professional of another barbershop');

select throws_ok(
  $$insert into public.invite (barbershop_id, professional_id)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c3')$$,
  '23503', null, 'an invite cannot point to a professional of another barbershop');

select throws_ok(
  $$insert into public.business_hours (barbershop_id, weekday, start_time, end_time)
    values ('00000000-0000-0000-0000-00000000aaaa', 1, '11:00', '14:00')$$,
  '23P01', null, 'overlapping business hours are refused');

select lives_ok(
  $$insert into public.business_hours (barbershop_id, weekday, start_time, end_time) values
    ('00000000-0000-0000-0000-00000000aaaa', 2, '09:00', '12:00'),
    ('00000000-0000-0000-0000-00000000aaaa', 2, '12:00', '18:00')$$,
  'adjacent business hours are fine');

select throws_ok(
  $$insert into public.business_hours (barbershop_id, weekday, start_time, end_time)
    values ('00000000-0000-0000-0000-00000000aaaa', 3, '12:00', '09:00')$$,
  '23514', null, 'business hours must end after they start');

select lives_ok(
  $$insert into public.professional_hours (barbershop_id, professional_id, weekday, start_time, end_time)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c1', 1, '09:00', '12:00')$$,
  'professional hours inside the business hours are fine');

select throws_ok(
  $$insert into public.professional_hours (barbershop_id, professional_id, weekday, start_time, end_time)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c2', 1, '11:00', '14:00')$$,
  '23514', null, 'professional hours cannot span the lunch break');

select throws_ok(
  $$insert into public.professional_hours (barbershop_id, professional_id, weekday, start_time, end_time)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c1', 0, '09:00', '12:00')$$,
  '23514', null, 'professional hours on a closed day are refused');

select throws_ok(
  $$insert into public.professional_hours (barbershop_id, professional_id, weekday, start_time, end_time)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c1', 1, '10:00', '11:00')$$,
  '23P01', null, 'overlapping hours of the same professional are refused');

select throws_ok(
  $$insert into public.service (barbershop_id, name, price_cents, duration_minutes)
    values ('00000000-0000-0000-0000-00000000aaaa', 'Barba', -1, 20)$$,
  '23514', null, 'a service price cannot be negative');

select throws_ok(
  $$insert into public.service (barbershop_id, name, price_cents, duration_minutes)
    values ('00000000-0000-0000-0000-00000000aaaa', 'Barba', 3000, 0)$$,
  '23514', null, 'a service duration must be positive');

-- owner of A ---------------------------------------------------------------

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select is((select count(*)::int from public.professional), 2,
  'owner sees only the professionals of their own barbershop');

select is((select count(*)::int from public.service), 1,
  'owner sees only the services of their own barbershop');

select lives_ok(
  $$insert into public.service (barbershop_id, name, price_cents, duration_minutes)
    values ('00000000-0000-0000-0000-00000000aaaa', 'Barba', 3000, 20)$$,
  'owner can create a service');

select throws_ok(
  $$insert into public.service (barbershop_id, name, price_cents, duration_minutes)
    values ('00000000-0000-0000-0000-00000000bbbb', 'Barba', 3000, 20)$$,
  '42501', null, 'owner cannot create a service in another barbershop');

select lives_ok(
  $$insert into public.professional_hours (barbershop_id, professional_id, weekday, start_time, end_time)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c2', 2, '09:00', '12:00')$$,
  'owner can set a professional''s hours (validated by the trigger)');

select lives_ok(
  $$update public.professional set active = false where id = '00000000-0000-0000-0000-0000000000c2'$$,
  'owner can inactivate a professional');

select throws_ok(
  $$delete from public.professional where id = '00000000-0000-0000-0000-0000000000c2'$$,
  '42501', null, 'owner cannot delete a professional (inactivate instead)');

select throws_ok(
  $$delete from public.service where id = '00000000-0000-0000-0000-0000000000d1'$$,
  '42501', null, 'owner cannot delete a service (inactivate instead)');

-- barber of A (professional c1) ----------------------------------------------

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);

select is((select count(*)::int from public.professional), 1,
  'barber sees only their own professional');

select is((select count(*)::int from public.service), 2,
  'barber sees the services of their barbershop');

select ok((select count(*) from public.business_hours) > 0,
  'barber sees the business hours of their barbershop');

select is((select count(*)::int from public.professional_hours
  where professional_id = '00000000-0000-0000-0000-0000000000c2'), 0,
  'barber does not see the hours of another professional');

select is((select count(*)::int from public.professional_service), 1,
  'barber sees only their own professional-service links');

select throws_ok(
  $$insert into public.service (barbershop_id, name, price_cents, duration_minutes)
    values ('00000000-0000-0000-0000-00000000aaaa', 'Sobrancelha', 1500, 10)$$,
  '42501', null, 'barber cannot create services');

select is(
  pg_temp.affected($$update public.professional set name = 'hacked'
    where id = '00000000-0000-0000-0000-0000000000c1'$$),
  0, 'barber cannot update a professional');

-- owner of A can remove hours -------------------------------------------------

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select is(
  pg_temp.affected($$delete from public.professional_hours
    where professional_id = '00000000-0000-0000-0000-0000000000c1'$$),
  1, 'owner can remove a professional''s hours');

-- team (staff) ---------------------------------------------------------------

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000e1","role":"authenticated","app_metadata":{"kort_role":"staff"}}', true);

-- Only this file's own barbershops: the local seed adds a demo one.
select is((select count(*)::int from public.professional
  where barbershop_id in ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-00000000bbbb')), 3,
  'staff can read every professional');

-- anonymous ----------------------------------------------------------------

reset role;
set local role anon;

select throws_ok(
  $$select count(*) from public.service$$,
  '42501', null, 'anon has no access to services');

select * from finish();
rollback;
