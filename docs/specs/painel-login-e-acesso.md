# [PAINEL] [MVP] Login e acesso

- **Spec:** https://app.notion.com/p/3f9180da236f81f9a762e8ad6c6e9e2a
- **Card:** sem card ainda (depende do schema multi-tenant e RLS: https://trello.com/c/JWs7fJyU)
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f8158a3bfddefb9a0f222

## Objetivo

Dar ao dono (e, se quiser, ao barbeiro) acesso ao painel, isolado por barbearia.

## Comportamento

- Login por e-mail e senha (Supabase Auth), com recuperação de senha por e-mail.
- Dois perfis: **dono** vê tudo da barbearia; **barbeiro** vê só a própria agenda.
- O barbeiro não precisa de login: o dono gerencia a agenda dele. Quem quiser acesso próprio recebe um convite por link, enviado pelo dono.
- No MVP as primeiras barbearias são criadas pelo time (pilotos). Cadastro aberto de novas barbearias fica para depois (proposta).
- Isolamento entre barbearias: toda tabela tem `barbershop_id` e o RLS fica ligado para o painel, como definido na arquitetura.
- Sessão longa no celular, para o barbeiro não precisar entrar de novo várias vezes ao dia (proposta).

## Critérios de aceite

- [ ] Usuário de uma barbearia nunca vê dado de outra, mesmo alterando IDs na URL.
- [ ] Barbeiro com login não acessa a agenda de outro profissional.
- [ ] Convite por link cria o acesso do barbeiro já ligado ao profissional correto.
- [ ] Recuperação de senha funciona por e-mail.

## Em aberto

- [x] **Decidido (19/out/2026):** o barbeiro com login pode marcar compareceu ou faltou, bloquear o próprio horário e criar agendamento manual na própria agenda. Ver clientes **não** foi liberado. Pendente de refletir no Notion.
- [x] **Decidido (19/out/2026):** o convite por link expira e o dono pode reenviar. Prazo de expiração: 24h. Pendente de refletir no Notion.
