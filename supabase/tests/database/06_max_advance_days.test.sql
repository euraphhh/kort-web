begin;
create extension if not exists pgtap with schema extensions;

select plan(6);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'owner-a@test.kort'),
  ('00000000-0000-0000-0000-0000000000a2', 'barber-a@test.kort');

insert into public.barbershop (id, name) values
  ('00000000-0000-0000-0000-00000000aaaa', 'Barbearia A');

insert into public.professional (id, barbershop_id, name) values
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-00000000aaaa', 'Joao');

insert into public.barbershop_member (barbershop_id, user_id, role, professional_id) values
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000a1', 'owner', null),
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000a2', 'barber',
    '00000000-0000-0000-0000-0000000000c1');

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

select is(
  (select max_advance_days from public.barbershop where id = '00000000-0000-0000-0000-00000000aaaa'),
  30, 'a new barbershop allows booking up to 30 days ahead');

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select lives_ok(
  $$update public.barbershop set max_advance_days = 60 where id = '00000000-0000-0000-0000-00000000aaaa'$$,
  'the owner can change the booking window');

select throws_ok(
  $$update public.barbershop set max_advance_days = 0 where id = '00000000-0000-0000-0000-00000000aaaa'$$,
  '23514', null, 'the booking window cannot be less than 1 day');

select throws_ok(
  $$update public.barbershop set max_advance_days = 366 where id = '00000000-0000-0000-0000-00000000aaaa'$$,
  '23514', null, 'the booking window cannot be more than 365 days');

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);

select is(
  pg_temp.affected($$update public.barbershop set max_advance_days = 90
    where id = '00000000-0000-0000-0000-00000000aaaa'$$),
  0, 'a barber cannot change the booking window');

reset role;
select is(
  (select max_advance_days from public.barbershop where id = '00000000-0000-0000-0000-00000000aaaa'),
  60, 'only the owner''s change was applied');

select * from finish();
rollback;
