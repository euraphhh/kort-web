# [PAINEL] [MVP] Esqueci a senha, redefinir senha e aceitar convite

- **Spec no Notion:** ainda não existe (proposta, derivada de `painel-login-e-acesso.md`)
- **Card:** [DEV] Login e acesso do painel (https://trello.com/c/zuas9jXb)
- **Status:** proposta, precisa de aprovação do time. Implementado em 20/out/2026: telas 1, 2 e 3 (login, esqueci a senha e redefinir senha). A tela 4 (aceitar convite) fica com o card Equipe e convites, que cria os convites e define como o link é lido (função no banco ou chave de serviço).
- **Depende de:** `painel-login-e-acesso.md`, schema multi-tenant e RLS

## Objetivo

Transformar em telas o que a spec de Login e acesso já exige: recuperação de senha por e-mail e convite do barbeiro por link.

## Telas

1. **Login:** e-mail e senha, link "esqueci a senha". Erro de credencial sem dizer se o e-mail existe.
2. **Esqueci a senha:** campo de e-mail. A resposta é sempre a mesma, exista ou não a conta.
3. **Redefinir senha:** aberta pelo link do e-mail, com nova senha e confirmação.
4. **Aceitar convite:** aberta pelo link enviado pelo dono. O barbeiro define a senha e entra já ligado ao profissional correto.

## Comportamento

- E-mails de autenticação saem pelo Resend, via SMTP do Supabase (ver arquitetura).
- Sessão longa no celular (proposta da spec de Login).
- Link de redefinição e link de convite são de uso único.

## Critérios de aceite

- [x] Recuperação de senha funciona por e-mail (critério da spec de Login). Feito em 20/out/2026: esqueci a senha, link do e-mail (`/auth/confirm`) e redefinir senha (`/reset-password`).
- [ ] Convite por link cria o acesso do barbeiro já ligado ao profissional correto (critério da spec de Login).
- [x] Link já usado ou expirado mostra mensagem clara e leva a pedir novo. (Vale para o link de redefinição; o do convite vem com o card de equipe.)
- [x] A tela de "esqueci a senha" não revela se o e-mail existe.
- [ ] Todas as telas funcionam no celular e nos temas claro e escuro, com foco visível e rótulos nos campos.

## Em aberto

- [x] **Decidido (19/out/2026):** o convite expira e pode ser reenviado pelo dono.
- [x] **Decidido (19/out/2026):** o convite expira em 24h.
- [x] **Decidido (20/out/2026):** regra de senha: no mínimo 8 caracteres, com letra maiúscula, minúscula, número e símbolo. No Supabase é `password_requirements = lower_upper_letters_digits_symbols`. Pendente de refletir no Notion.
- [ ] Texto dos e-mails (voz e conteúdo precisam de aprovação do time).
