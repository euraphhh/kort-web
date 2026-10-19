# [PAINEL] [MVP] Perfil e conta do usuário

- **Spec no Notion:** ainda não existe (proposta, derivada de `painel-login-e-acesso.md`)
- **Card:** [DEV] Layout, navegação e estados do painel (https://trello.com/c/l6CeTSk0)
- **Status:** proposta, precisa de aprovação do time
- **Depende de:** `painel-login-e-acesso.md`

## Objetivo

Dar a quem tem login (dono e barbeiro) um lugar para cuidar da própria conta, sem depender do time.

## Comportamento (proposta de mínimo)

- Ver nome, e-mail e papel (dono ou barbeiro).
- Trocar a senha, pedindo a senha atual.
- Trocar o e-mail, com confirmação por e-mail.
- Sair da conta.
- Tema claro, escuro ou do sistema (os dois temas precisam funcionar).

## Critérios de aceite

- [ ] Trocar a senha exige a senha atual.
- [ ] Trocar o e-mail só vale depois de confirmado pelo novo endereço.
- [ ] Sair da conta encerra a sessão neste aparelho.
- [ ] O barbeiro só vê e altera os próprios dados.

## Em aberto

- [ ] Excluir a própria conta: no MVP fica com o time (ver pedidos de LGPD em `painel-termos-e-privacidade.md`).
- [ ] Onde esta tela mora na navegação do celular.
- [ ] O dono e o barbeiro editam o próprio nome? O nome do profissional vem do cadastro em `painel-profissionais.md`.
