# [PAINEL] [MVP] Login e acesso

- **Origem:** versão do Notion removida em 19/out/2026; este arquivo é a fonte
- **Card:** [DEV] Login e acesso do painel (https://trello.com/c/zuas9jXb)
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
- [x] **Decidido (19/out/2026):** menu do painel por papel. Dono: Agenda, A fechar, Clientes, Serviços, Equipe, Configurações e Perfil. Barbeiro: Agenda, A fechar e Perfil. Rotas em inglês: `/agenda`, `/to-close`, `/customers`, `/services`, `/team`, `/settings`, `/profile` (a agenda fica em `/agenda` porque a landing ocupa `/`). Pendente de refletir no Notion.
