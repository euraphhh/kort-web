# [AGENTE] [MVP] Lembretes e confirmação

- **Spec:** https://app.notion.com/p/3f9180da236f81808bfcfa35f2b20887
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f81f68e3dcfa06d630d34

## Objetivo

Reduzir falta (no-show), que é a dor real da barbearia, sem virar spam.

## Comportamento

- **24h antes:** mensagem pedindo confirmação ou cancelamento. O cliente pode confirmar, cancelar ou remarcar.
- **1h antes:** só aviso ("te espero às 15h"). Não pede ação, porque o limite de cancelamento (2h) já passou.
- **Sem resposta ao de 24h:** o horário é mantido e marcado como "não confirmado" na agenda do barbeiro. Nunca cancela sozinho.
- Os lembretes são enviados fora da janela de 24h, então usam template aprovado pela Meta (categoria utility) e são cobrados por mensagem.
- Cliente que pediu para parar não recebe lembretes.
- Agendamento criado com menos de 24h de antecedência não recebe o lembrete de 24h (proposta).

## Critérios de aceite

- [ ] Agendamento ativo recebe o lembrete de 24h e o de 1h, uma única vez cada (sem duplicar em reenvio de job).
- [ ] Agendamento cancelado não recebe lembrete.
- [ ] Confirmação do cliente marca o agendamento como confirmado.
- [ ] Sem resposta, o agendamento aparece como não confirmado e continua ativo.
- [ ] Cliente em opt-out não recebe nenhum lembrete.

## Em aberto

- [x] **Decidido (19/out/2026):** agendamento criado com menos de 24h de antecedência não recebe o lembrete de 24h, só o de 1h. Pendente de refletir no Notion.

- [ ] Custo por lembrete entra na conta de franquia e preço (ver visão geral).
- [ ] Textos dos templates e aprovação na Meta.
