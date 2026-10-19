---
name: revisar-rls-multitenant
description: Use em toda mudança em supabase/migrations, em queries, Server Actions, handlers de API, webhook ou tools do agente. Checklist de isolamento entre barbearias.
---

# Revisar RLS e multi-tenant

Um erro aqui vaza dado de uma barbearia para outra. Passe por cada item e diga o resultado.

## Schema e migrations (`supabase/migrations/`)

- [ ] Toda tabela nova tem `barbershop_id` (not null) e índice nele.
- [ ] RLS ligado (`enable row level security`) e policies por `barbershop_id`, usando o JWT do usuário.
- [ ] Papéis respeitados: `owner` vê a barbearia toda, `barber` só a própria agenda, `staff` só por claim.
- [ ] Anti-overbooking continua valendo: exclusion constraint em `tstzrange` por profissional, ignorando cancelados (`btree_gist`).
- [ ] Datas em UTC (`timestamptz`) e dinheiro em centavos (inteiro).
- [ ] Migration em SQL puro, pequena e reversível quando possível. Tipos gerados atualizados (`npm run db:types`).

## Código (painel, API, webhook, agente)

- [ ] O `barbershop_id` vem do servidor (sessão do usuário, ou número de WhatsApp que recebeu a mensagem). Nunca de parâmetro do cliente nem do modelo.
- [ ] Rotas que usam service role (webhook, jobs, agente) filtram por `barbershop_id` no código, porque o RLS não vale ali.
- [ ] Tools do agente não têm `barbershop_id` como parâmetro.
- [ ] Alterar um ID na URL ou no corpo nunca devolve dado de outra barbearia (devolve 404, não 403).
- [ ] Log sem dado pessoal desnecessário; dado pessoal só com acesso restrito e retenção de 90 dias.

## Testes

- [ ] Existe teste de isolamento: usuário da barbearia A não lê nem escreve dado da B.
- [ ] Existe teste do overbooking (dois agendamentos no mesmo horário, só um grava).
