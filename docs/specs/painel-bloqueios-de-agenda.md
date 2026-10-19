# [PAINEL] [MVP] Bloqueios de agenda

- **Spec no Notion:** ainda não existe (proposta; o bloqueio pontual é citado em `painel-agenda-tela-inicial.md`)
- **Card:** sem card ainda
- **Status:** proposta, precisa de aprovação do time
- **Depende de:** `painel-agenda-tela-inicial.md`, `painel-profissionais.md`

## Objetivo

A spec da Agenda define a criação do bloqueio (profissional, dia, início, fim, motivo opcional), mas não define como listar, editar e apagar. Esta spec fecha o ciclo.

## Comportamento

- Criar a partir da Agenda (profissional, dia, início, fim, motivo opcional), para almoço, folga ou consulta.
- O bloco aparece na Agenda e tira esses horários da disponibilidade que o agente enxerga.
- Abrir um bloqueio na Agenda permite editar ou apagar.
- Apagar um bloqueio devolve o horário à disponibilidade.
- Bloqueio sobre um agendamento existente: avisa e lista os agendamentos afetados, sem cancelá-los.

## Critérios de aceite

- [ ] Um bloqueio criado no painel faz o agente não oferecer aquele horário (critério da spec da Agenda).
- [ ] Apagar o bloqueio faz o horário voltar a ser oferecido.
- [ ] Criar bloqueio sobre agendamento existente não apaga nem cancela o agendamento e avisa o dono.
- [ ] Horários exibidos em America/Sao_Paulo e gravados em UTC.

## Em aberto

- [x] **Decidido (19/out/2026):** só bloqueio pontual no MVP. Recorrência fica com o horário semanal do profissional (vários intervalos no dia).
- [x] **Decidido (19/out/2026):** o barbeiro com login pode bloquear o próprio horário, e só o próprio.
- [ ] Marcar manualmente sobre um bloqueio: permitir com aviso (proposta da spec de Agendamento manual).
