begin;
create extension if not exists pgtap with schema extensions;

select plan(26);

-- fixtures (as the postgres superuser) ---------------------------------------

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'owner-a@test.kort'),
  ('00000000-0000-0000-0000-0000000000a2', 'barber-a@test.kort'),
  ('00000000-0000-0000-0000-0000000000b1', 'owner-b@test.kort');

insert into public.barbershop (id, name) values
  ('00000000-0000-0000-0000-00000000aaaa', 'Barbearia A'),
  ('00000000-0000-0000-0000-00000000bbbb', 'Barbearia B');

-- Members and invites point to real professionals of their own barbershop (composite FK).
insert into public.professional (id, barbershop_id, name) values
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-00000000aaaa', 'Joao'),
  ('00000000-0000-0000-0000-0000000000c9', '00000000-0000-0000-0000-00000000bbbb', 'Caio');

insert into public.barbershop_member (barbershop_id, user_id, role, professional_id) values
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000a1', 'owner', null),
  ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000a2', 'barber',
    '00000000-0000-0000-0000-0000000000c1'),
  ('00000000-0000-0000-0000-00000000bbbb', '00000000-0000-0000-0000-0000000000b1', 'owner', null);

insert into public.invite (barbershop_id, professional_id) values
  ('00000000-0000-0000-0000-00000000bbbb', '00000000-0000-0000-0000-0000000000c9');

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

-- owner of A ---------------------------------------------------------------

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select is((select count(*)::int from public.barbershop), 1,
  'owner sees only their own barbershop');

select is((select count(*)::int from public.barbershop_member), 2,
  'owner sees the members of their own barbershop only');

select is((select count(*)::int from public.invite), 0,
  'owner does not see invites of another barbershop');

select is(
  pg_temp.affected($$update public.barbershop set name = 'hacked'
    where id = '00000000-0000-0000-0000-00000000bbbb'$$),
  0, 'owner cannot update another barbershop');

select lives_ok(
  $$update public.barbershop set name = 'Barbearia A2' where id = '00000000-0000-0000-0000-00000000aaaa'$$,
  'owner can update their own barbershop');

select throws_ok(
  $$update public.barbershop set whatsapp_phone_number = '5511999999999'
    where id = '00000000-0000-0000-0000-00000000aaaa'$$,
  '42501', null, 'owner cannot change the WhatsApp number (team only)');

select lives_ok(
  $$insert into public.invite (barbershop_id, professional_id)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c1')$$,
  'owner can create an invite for their own barbershop');

select throws_ok(
  $$insert into public.invite (barbershop_id, professional_id)
    values ('00000000-0000-0000-0000-00000000bbbb', '00000000-0000-0000-0000-0000000000c1')$$,
  '42501', null, 'owner cannot create an invite for another barbershop');

select throws_ok(
  $$insert into public.invite (barbershop_id, professional_id, expires_at)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c1',
      now() + interval '10 years')$$,
  '42501', null, 'owner cannot set the invite expiry');

select is(
  (select created_by from public.invite where barbershop_id = '00000000-0000-0000-0000-00000000aaaa'),
  '00000000-0000-0000-0000-0000000000a1'::uuid,
  'invite created_by defaults to the logged in user');

-- barber of A --------------------------------------------------------------

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);

select is((select count(*)::int from public.barbershop), 0,
  'barber cannot read the barbershop table (WhatsApp number, rules)');

select is((select count(*)::int from public.barbershop_summary), 1,
  'barber sees only their own barbershop through the summary view');

select is((select count(*)::int from public.barbershop_member), 1,
  'barber sees only their own member row');

select is((select count(*)::int from public.invite), 0,
  'barber does not see invites');

select throws_ok(
  $$insert into public.invite (barbershop_id, professional_id)
    values ('00000000-0000-0000-0000-00000000aaaa', '00000000-0000-0000-0000-0000000000c1')$$,
  '42501', null, 'barber cannot create invites');

select is(
  pg_temp.affected($$update public.barbershop set name = 'hacked'
    where id = '00000000-0000-0000-0000-00000000aaaa'$$),
  0, 'barber cannot update the barbershop');

select is(
  pg_temp.affected($$delete from public.barbershop_member
    where user_id = '00000000-0000-0000-0000-0000000000a1'$$),
  0, 'barber cannot delete members');

-- owner of A revokes access --------------------------------------------------

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select is(
  pg_temp.affected($$delete from public.barbershop_member
    where user_id = '00000000-0000-0000-0000-0000000000a1'$$),
  0, 'owner cannot delete an owner row');

select is(
  pg_temp.affected($$delete from public.barbershop_member
    where user_id = '00000000-0000-0000-0000-0000000000a2'$$),
  1, 'owner can revoke a barber');

-- anonymous ----------------------------------------------------------------

reset role;
set local role anon;

select throws_ok(
  $$select count(*) from public.barbershop$$,
  '42501', null, 'anon has no access to barbershop');

-- constraints (as superuser) -------------------------------------------------

reset role;

select throws_ok(
  $$insert into public.barbershop_member (barbershop_id, user_id, role)
    values ('00000000-0000-0000-0000-00000000bbbb', '00000000-0000-0000-0000-0000000000a2', 'owner')$$,
  '23505', null, 'a barbershop cannot have two owners');

select throws_ok(
  $$insert into public.barbershop_member (barbershop_id, user_id, role)
    values ('00000000-0000-0000-0000-00000000bbbb', '00000000-0000-0000-0000-0000000000a2', 'barber')$$,
  '23514', null, 'a barber must be tied to a professional');

-- staff claim --------------------------------------------------------------

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}', true);
select is((select count(*)::int from public.barbershop_member), 1,
  'owner of B sees only the members of B');

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);
select is(public.is_staff(), false, 'is_staff is false without the claim');

select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated","app_metadata":{"kort_role":"staff"}}', true);
select is(public.is_staff(), true, 'is_staff is true with app_metadata.kort_role = staff');
select is((select count(*)::int from public.barbershop), 2,
  'staff can read every barbershop');

select * from finish();
rollback;
