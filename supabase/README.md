# supabase

Migrations em SQL puro (`migrations/`), schema, RLS e exclusion constraint anti-overbooking. O kort-web é dono do schema. Tipos gerados com a Supabase CLI em `src/lib/database.types.ts`.

## Rodar local

- `npx supabase start` (precisa do Docker). `npx supabase db reset` reaplica as migrations do zero.
- `npm run test:db` roda os testes pgTAP de `supabase/tests/database/` (RLS, isolamento entre barbearias, overbooking). O CI roda o mesmo no job `database tests`.
- `npm run db:types` regenera `src/lib/database.types.ts`. Rode depois de toda migration e commite o arquivo.
- `npx supabase stop` para parar.

## Regras

- Toda tabela do schema `public` tem `barbershop_id` e RLS ligado, e `anon` não tem acesso a nada. `tests/database/05_isolation.test.sql` quebra se uma migration nova violar isso.
- Funções `security definer` fixam `search_path` e revogam `execute` de `anon`.
- Nunca apague agendamento, profissional, serviço ou cliente: cancele ou inative.
- Migration nova vem com teste. Siga a skill `revisar-rls-multitenant`.

## Usuários de teste (seed)

`npx supabase db reset` aplica `seed.sql` e cria, só no banco local, a "Barbearia Demo" com `dono@kort.dev` (dono) e `barbeiro@kort.dev` (barbeiro), senha `kort-dev-123`. Nunca rode o seed em staging nem em produção. Com o app apontando para o Supabase local, `E2E_AUTH=1 npx playwright test tests/e2e/panel.spec.ts` roda os testes do painel logado (sem essa variável eles são ignorados).

## E-mails de autenticação

Localmente os e-mails não saem: caem no Mailpit, em http://127.0.0.1:54324. O texto da recuperação de senha está em `supabase/templates/recovery.html` (provisório, o time aprova o final) e é ligado em `config.toml`. Depois de mudar o `config.toml` ou o template, reinicie com `npx supabase stop` e `npx supabase start`.

O e2e da recuperação lê o e-mail no Mailpit e cria um usuário descartável pela API de admin: `E2E_AUTH=1 E2E_SUPABASE_SECRET_KEY=<secret key do supabase start> npx playwright test tests/e2e/password-recovery.spec.ts`.

## Configuração de produção (o `config.toml` só vale para o banco local)

No painel do Supabase de cada ambiente, em Authentication:

- **Sign In / Providers:** confirmar que "Allow new users to sign up" está **desligado** (o MVP não tem cadastro aberto) e que o provedor Email continua **ligado**. Localmente isso já é assim: o `enable_signup` global de `[auth]` é `false`.
- **Email > Password strength:** mínimo 8, com maiúscula, minúscula, número e símbolo.
- **Email Templates > Reset Password:** colar o HTML de `supabase/templates/recovery.html` e o assunto "Crie uma nova senha na kort". O link usa `{{ .SiteURL }}`, então o **Site URL** precisa ser a URL do painel.
- **URL Configuration:** Site URL e Redirect URLs com a URL do painel.
- **SMTP:** Resend (o domínio precisa estar verificado; sem ele só dá para enviar ao e-mail da própria conta).

