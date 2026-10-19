# [PAINEL] [MVP] Configurações da barbearia

- **Spec:** https://app.notion.com/p/3f9180da236f8141a0f6cdc484d21472
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f8158a3bfddefb9a0f222
- **Quem usa estes dados:** `agente-duvidas-basicas-faq.md` e `agente-lembretes-e-confirmacao.md`

## Objetivo

Reunir os dados e as regras da barbearia que o agente e a agenda consultam.

## Comportamento

- **Dados:** nome da barbearia, endereço e DDD padrão (obrigatório; usado na importação de telefones sem DDD).
- **Horário de funcionamento:** por dia da semana, com mais de um intervalo no mesmo dia (almoço fecha, volta à tarde). O horário dos profissionais fica dentro deste.
- **Regras de agenda:** antecedência mínima para agendar (padrão 30 min, pode ser 0) e limite para cancelar ou remarcar (padrão até 2h antes).
- Fuso fixo America/Sao_Paulo.
- Sem cobrança, plano ou pagamento no MVP.

## Critérios de aceite

- [ ] Alterar o horário de funcionamento muda o que o agente informa e oferece.
- [ ] Endereço e horário cadastrados são usados nas respostas de dúvidas do agente.
- [ ] Antecedência mínima zero permite agendar para o mesmo instante.
- [ ] Reduzir o horário de funcionamento não apaga agendamentos existentes e avisa os que ficaram fora.

## Em aberto

- [ ] A visão geral do agente diz que todas as regras de agenda são configuráveis. Proposta para o painel do MVP: expor só antecedência mínima e limite de cancelamento. Lembretes (24h e 1h) e número de alternativas ficam fixos e viram configuração depois.
