begin;
create extension if not exists pgtap with schema extensions;

select plan(16);

-- fixtures (as the postgres superuser) ---------------------------------------
-- users a1 owner A, a2 barber A (professional c1), b1 owner B, e1 stranger.

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'owner-a@test.kort'),
  ('00000000-0000-0000-0000-0000000000a2', 'barber-a@test.kort'),
  ('00000000-0000-0000-0000-0000000000b1', 'owner-b@test.kort'),
  ('00000000-0000-0000-0000-0000000000e1', 'stranger@test.kort');

insert into public.barbershop (id, name) values
  ('00000000-0000-0000-0000-00000000aaaa', 'Barbearia A'),
  ('00000000-0000-0000-0000-00000000bbbb', 'Barbearia B');

insert into public.professional (id, barbershop_id, name) values
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-00000000aaaa', 'Joao');

insert into public.barbershop_member (barbershop_id, user_id, role, professional_id) values
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000a1', 'owner', null),
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000a2', 'barber',
    '00000000-0000-0000-0000-0000000000c1'),
  ('00000000-0000-0000-0000-00000000bbbb', '00000000-0000-0000-0000-0000000000b1', 'owner', null);

insert into public.customer (id, barbershop_id, name, phone) values
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-00000000aaaa', 'Maria', '+5511999990001'),
  ('00000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-00000000bbbb', 'Carlos', '+5511999990002');

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
  $$insert into public.customer (barbershop_id, name, phone)
    values ('00000000-0000-0000-0000-00000000aaaa', 'Outra Maria', '+5511999990001')$$,
  '23505', null, 'the same phone cannot be registered twice in a barbershop');

select lives_ok(
  $$insert into public.customer (barbershop_id, name, phone)
    values ('00000000-0000-0000-0000-00000000bbbb', 'Maria', '+5511999990001')$$,
  'the same phone can exist in another barbershop');

select throws_ok(
  $$insert into public.customer (barbershop_id, name, phone)
    values ('00000000-0000-0000-0000-00000000aaaa', 'Sem DDI', '11999990003')$$,
  '23514', null, 'a phone must be in international format');

select throws_ok(
  $$insert into public.customer (barbershop_id, name, phone)
    values ('00000000-0000-0000-0000-00000000aaaa', '   ', '+5511999990004')$$,
  '23514', null, 'a customer needs a name');

-- owner of A ---------------------------------------------------------------

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select is((select count(*)::int from public.customer), 1,
  'owner sees only the customers of their own barbershop');

select lives_ok(
  $$insert into public.customer (barbershop_id, name, phone)
    values ('00000000-0000-0000-0000-00000000aaaa', 'Joana', '+5511999990005')$$,
  'owner can register a customer');

select throws_ok(
  $$insert into public.customer (barbershop_id, name, phone)
    values ('00000000-0000-0000-0000-00000000bbbb', 'Joana', '+5511999990006')$$,
  '42501', null, 'owner cannot register a customer in another barbershop');

select lives_ok(
  $$update public.customer set active = false where id = '00000000-0000-0000-0000-0000000000f1'$$,
  'owner can inactivate a customer');

select throws_ok(
  $$update public.customer set opted_out = true where id = '00000000-0000-0000-0000-0000000000f1'$$,
  '42501', null, 'owner cannot change the opt-out flag (agent only)');

select throws_ok(
  $$delete from public.customer where id = '00000000-0000-0000-0000-0000000000f1'$$,
  '42501', null, 'owner cannot delete a customer (inactivate instead)');

select is(
  pg_temp.affected($$update public.customer set name = 'hacked'
    where id = '00000000-0000-0000-0000-0000000000f2'$$),
  0, 'owner cannot update a customer of another barbershop');

-- barber of A ----------------------------------------------------------------

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);

select is((select count(*)::int from public.customer), 0,
  'barber cannot read customers');

select throws_ok(
  $$insert into public.customer (barbershop_id, name, phone)
    values ('00000000-0000-0000-0000-00000000aaaa', 'Barbeiro', '+5511999990007')$$,
  '42501', null, 'barber cannot register customers');

-- team (staff) ---------------------------------------------------------------

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000e1","role":"authenticated","app_metadata":{"kort_role":"staff"}}', true);

select cmp_ok((select count(*)::int from public.customer), '>=', 3,
  'staff can read customers of every barbershop');

select is(
  pg_temp.affected($$update public.customer set name = 'hacked'
    where id = '00000000-0000-0000-0000-0000000000f2'$$),
  0, 'staff cannot change customers');

-- anonymous ----------------------------------------------------------------

reset role;
set local role anon;

select throws_ok(
  $$select count(*) from public.customer$$,
  '42501', null, 'anon has no access to customers');

select * from finish();
rollback;
