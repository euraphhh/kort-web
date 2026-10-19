# [PAINEL] [MVP] Equipe e convites

- **Spec no Notion:** ainda não existe (proposta, derivada de `painel-login-e-acesso.md` e `painel-profissionais.md`)
- **Card:** sem card ainda
- **Status:** proposta, precisa de aprovação do time
- **Depende de:** `painel-login-e-acesso.md`, `painel-profissionais.md`

## Objetivo

Dar ao dono um lugar para dar acesso ao barbeiro. A spec de Login diz que "quem quiser acesso próprio recebe um convite por link, enviado pelo dono", mas não define a tela.

## Comportamento

- Só o dono vê esta tela.
- Lista os profissionais com a situação do acesso: sem acesso, convite pendente, com acesso.
- Ação por profissional: enviar convite (por link), reenviar, revogar acesso.
- O convite é sempre ligado a um profissional já cadastrado. O acesso do barbeiro mostra só a própria agenda.
- Estado sempre por palavra e ícone, não só por cor.

## Critérios de aceite

- [ ] Convite por link cria o acesso do barbeiro já ligado ao profissional correto.
- [ ] Barbeiro com login não acessa a agenda de outro profissional.
- [ ] Revogar acesso encerra a sessão do barbeiro e mantém o profissional e o histórico.
- [ ] Barbeiro não vê esta tela.

## Em aberto

- [x] **Decidido (19/out/2026):** o convite expira e pode ser reenviado. Falta definir o prazo.
- [x] **Decidido (19/out/2026):** o barbeiro marca compareceu/faltou, bloqueia o próprio horário e cria agendamento manual na própria agenda. Não vê a lista de clientes.
- [ ] Mais de um dono por barbearia?
