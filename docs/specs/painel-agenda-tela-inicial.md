# [PAINEL] [MVP] Agenda (tela inicial)

- **Spec:** https://app.notion.com/p/3f9180da236f8154a54cd010825fd09f
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f8158a3bfddefb9a0f222

## Objetivo

Mostrar o dia da barbearia e ser a porta de entrada do painel. Sem dashboard no MVP.

## Comportamento

- **Tela inicial:** a agenda do dia, com dois contadores no topo: "a fechar" (leva à fila) e "não confirmados".
- **Celular:** um profissional por vez, com seletor no topo. **Desktop:** colunas lado a lado. O dono tem a opção "todos". O barbeiro com login vê só a própria agenda.
- Navegação entre dias, com atalho para hoje. Horários exibidos em America/Sao_Paulo.
- **Card do agendamento:** horário, cliente, serviço, status, marca de não confirmado e origem (agente ou painel). A origem permite medir quanto o agente agenda.
- **Detalhe do agendamento:** remarcar, cancelar, marcar compareceu ou faltou, abrir o cliente.
- **Bloqueio pontual:** o dono cria um bloqueio (profissional, dia, início, fim, motivo opcional) para almoço, folga ou consulta. O bloco aparece na agenda e tira esses horários da disponibilidade que o agente enxerga.
- Botão para criar agendamento manual a partir de qualquer horário livre.

## Critérios de aceite

- [ ] A tela inicial abre no dia de hoje, com os contadores corretos.
- [ ] No celular, trocar de profissional no seletor muda a agenda exibida.
- [ ] Um bloqueio criado no painel faz o agente não oferecer aquele horário.
- [ ] Agendamento criado pelo agente aparece na agenda com a origem "agente".
- [ ] Agendamento não confirmado mostra a marca e conta no contador.
- [ ] Barbeiro com login não vê a agenda de outro profissional.

## Fora do escopo

Dashboard, relatórios, visão mensal, arrastar e soltar para remarcar.
