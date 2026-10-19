# [PAINEL] [V1] Cadastro aberto de novas barbearias

- **Spec no Notion:** ainda não existe (proposta; a spec de Login diz que cadastro aberto fica para depois)
- **Card:** sem card ainda
- **Status:** proposta para a V1, **fora do MVP**
- **Depende de:** `painel-login-e-acesso.md`, `painel-onboarding-do-dono.md`

## Objetivo

Permitir que um dono crie a própria barbearia sem depender do time. No MVP isso não existe: as primeiras barbearias (pilotos) são criadas pelo time.

## Telas

1. **Criar conta:** nome, e-mail e senha do dono.
2. **Confirmar e-mail.**
3. **Dados mínimos da barbearia:** nome, e depois segue para o checklist de onboarding.

## Comportamento (proposta)

- Cria a barbearia e o vínculo do usuário como dono (`barbershop_member` com papel `owner`).
- Cai direto no onboarding do dono.
- A conexão do WhatsApp continua manual enquanto não houver fluxo próprio. Cadastro aberto não liga o agente sozinho: o onboarding bloqueia o interruptor até o mínimo estar cumprido.

## Critérios de aceite

- [ ] Uma conta nova cria uma barbearia isolada das demais (RLS por `barbershop_id`).
- [ ] O novo dono cai no onboarding com o checklist vazio.
- [ ] Sem e-mail confirmado não há acesso ao painel.

## Em aberto

- [ ] Proteção contra abuso (limite de criação, verificação).
- [ ] Aceite de termos e privacidade no cadastro (ver `painel-termos-e-privacidade.md`).
- [ ] Como fica a cobrança. Preço e planos são decisão em aberto do produto; o MVP não cobra.
- [ ] Como o WhatsApp é conectado sem o time.
