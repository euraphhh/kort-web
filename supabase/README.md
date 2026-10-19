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
