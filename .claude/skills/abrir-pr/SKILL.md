---
name: abrir-pr
description: Use antes de dar push ou abrir PR. Confere checks, commits, spec, card e segredos.
---

# Antes de subir

Rode estes passos, nesta ordem, e só suba se todos passarem.

1. **Checks locais:** `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`. Se algum falhar, corrija. Não pule hooks nem o CI.
2. **Skills aplicáveis** (rode cada uma que se encaixar na mudança):
   - mexeu em `supabase/`, queries, API, webhook ou agente: `revisar-rls-multitenant`
   - mexeu em tela ou componente: `revisar-ui`
3. **Diff:** leia o `git diff` inteiro. Sem segredo, `.env`, token ou dado pessoal. Sem arquivo fora da área do card (se tiver, avise).
4. **Commits:** pequenos, convencionais e em inglês (`feat:`, `fix:`, `docs:`, `chore:`). Código, comentários e nomes de tools em inglês; interface e prompts em pt-BR.
5. **Branch:** curta (`feat/...`, `fix/...`), saindo de `dev`. PR para `dev`. Para publicar, PR de `dev` para `main`, que só você (tech lead) aprova.
6. **PR:** preencha o template: arquivo da spec em `docs/specs/`, card do Trello e como testar. Atualize a spec no mesmo PR se uma decisão mudou.
7. **CI verde** é obrigatório para mergear.
