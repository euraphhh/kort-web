# [PAINEL] [MVP] Fila a fechar (status do agendamento)

- **Spec:** https://app.notion.com/p/3f9180da236f813598abfbe5b782cd72
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f8158a3bfddefb9a0f222

## Objetivo

Manter o status dos agendamentos confiável, principalmente as faltas, sem exigir disciplina perfeita do barbeiro.

## Por que não fechar tudo automaticamente

Falta que ninguém marcou virar "compareceu" subestima a taxa de falta. Esse dado alimenta o histórico de faltas, a lista de espera e o sinal por Pix, que são as expansões previstas do no-show.

## Comportamento

- **Fila a fechar:** agendamentos cujo horário já passou e que não têm status. Aparece como contador na tela inicial e como lista própria.
- Cada item tem dois toques: **compareceu** ou **faltou**.
- **Marcar todos como compareceu** resolve o caso comum de uma vez, com confirmação antes de gravar.
- O botão **faltou** também fica no card da agenda, para marcar na hora, 10 ou 15 minutos depois do horário.
- **Fallback:** o que ficar 48h sem ação vira "concluído" com a marca **fechado automaticamente**. Relatórios podem descontar esses casos, e o time sabe quanto do dado é confiável.
- Sem notificação push no MVP (é web). Depende de o dono abrir o painel, e o fallback cobre isso.
- Status possíveis: agendado, concluído, cancelado, faltou.

## Critérios de aceite

- [ ] Agendamento passado sem status aparece na fila e no contador.
- [ ] Compareceu e faltou gravam o status e tiram o item da fila.
- [ ] "Marcar todos como compareceu" só afeta os itens da fila e pede confirmação.
- [ ] Após 48h sem ação o agendamento vira concluído com a marca "fechado automaticamente", distinguível de um fechado manualmente.
- [ ] Barbeiro com login só vê e fecha os próprios agendamentos.

## Fora do escopo

Histórico de faltas por cliente, lista de espera, sinal por Pix e relatório de taxa de falta (backlog).
