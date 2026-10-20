-- Local seed data (supabase db reset). DEV ONLY: fake accounts with a known password, never run
-- against staging or production.
--
--   dono@kort.dev    owner of "Barbearia Demo"       password: kort-dev-123
--   barbeiro@kort.dev barber (professional João)      password: kort-dev-123

insert into public.barbershop (id, name)
values ('00000000-0000-4000-8000-000000000001', 'Barbearia Demo');

insert into public.professional (id, barbershop_id, name)
values ('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-000000000001', 'João');

-- Auth users: the columns GoTrue expects as non-null strings are set to '' on purpose.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000b1', 'authenticated', 'authenticated',
   'dono@kort.dev', crypt('kort-dev-123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000b2', 'authenticated', 'authenticated',
   'barbeiro@kort.dev', crypt('kort-dev-123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), u.id, u.id::text, 'email',
       jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
       now(), now(), now()
from auth.users u
where u.email in ('dono@kort.dev', 'barbeiro@kort.dev');

insert into public.barbershop_member (barbershop_id, user_id, role, professional_id)
values
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-0000000000b1', 'owner', null),
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-0000000000b2', 'barber',
   '00000000-0000-4000-8000-0000000000a1');
