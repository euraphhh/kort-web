# [AGENTE] [MVP] Remarcar e cancelar

- **Origem:** versão do Notion removida em 19/out/2026; este arquivo é a fonte
- **Card:** [DEV] Tools determinísticas do agente (https://trello.com/c/iXSp0an1)
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f81f68e3dcfa06d630d34

## Objetivo

O cliente muda ou cancela um agendamento pelo WhatsApp, dentro das regras da barbearia.

## Comportamento

- O agente busca os agendamentos futuros do cliente com `get_customer_appointments`. Se houver mais de um, pergunta qual.
- Dentro do limite (padrão: até 2h antes), executa. Remarcar segue as mesmas regras de agendar: consulta disponibilidade, resume e só grava após o sim.
- Remarcar é uma operação única: se o novo horário falhar, o original permanece.
- Cancelar pede confirmação antes de gravar (proposta).
- Só confirma ao cliente depois de a tool retornar sucesso.
- Faltas não são tratadas aqui: o status "faltou" é registrado pelo painel.

## Critérios de aceite

- [ ] Cancelamento dentro do limite grava status cancelado e libera o horário.
- [ ] Remarcação para horário ocupado mantém o agendamento original e oferece alternativas.
- [ ] Cliente com dois agendamentos futuros é perguntado sobre qual quer mexer.
- [ ] O agente não altera agendamento de outro cliente.

## Em aberto

- [x] **Decidido (19/out/2026):** depois do limite de 2h o agente escala para humano (handoff), em vez de recusar. Pendente de refletir no Notion.
