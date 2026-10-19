# [PAINEL] [MVP] Esqueci a senha, redefinir senha e aceitar convite

- **Spec no Notion:** ainda não existe (proposta, derivada de `painel-login-e-acesso.md`)
- **Card:** sem card ainda
- **Status:** proposta, precisa de aprovação do time
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

- [ ] Recuperação de senha funciona por e-mail (critério da spec de Login).
- [ ] Convite por link cria o acesso do barbeiro já ligado ao profissional correto (critério da spec de Login).
- [ ] Link já usado ou expirado mostra mensagem clara e leva a pedir novo.
- [ ] A tela de "esqueci a senha" não revela se o e-mail existe.
- [ ] Todas as telas funcionam no celular e nos temas claro e escuro, com foco visível e rótulos nos campos.

## Em aberto

- [ ] Alcance do convite no MVP: expira? pode reenviar? (herdado da spec de Login)
- [ ] Regra mínima de senha.
- [ ] Texto dos e-mails (voz e conteúdo precisam de aprovação do time).
