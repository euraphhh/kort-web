# [PAINEL] [MVP] Configurações da barbearia

- **Origem:** versão do Notion removida em 19/out/2026; este arquivo é a fonte
- **Card:** [DEV] Cadastros base: serviços, profissionais e configurações (https://trello.com/c/uUdAvzis)
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f8158a3bfddefb9a0f222
- **Quem usa estes dados:** `agente-duvidas-basicas-faq.md` e `agente-lembretes-e-confirmacao.md`

## Objetivo

Reunir os dados e as regras da barbearia que o agente e a agenda consultam.

## Comportamento

- **Dados:** nome da barbearia, endereço e DDD padrão (obrigatório; usado na importação de telefones sem DDD).
- **Horário de funcionamento:** por dia da semana, com mais de um intervalo no mesmo dia (almoço fecha, volta à tarde). O horário dos profissionais fica dentro deste.
- **Regras de agenda:** antecedência mínima para agendar (padrão 30 min, pode ser 0) e limite para cancelar ou remarcar (padrão até 2h antes) e janela máxima de agendamento, quantos dias à frente o cliente pode marcar (padrão 30 dias; decidido em 19/out/2026, campo `max_advance_days` a criar no banco).
- Fuso fixo America/Sao_Paulo.
- Sem cobrança, plano ou pagamento no MVP.

## Critérios de aceite

- [ ] Alterar o horário de funcionamento muda o que o agente informa e oferece.
- [ ] Endereço e horário cadastrados são usados nas respostas de dúvidas do agente.
- [ ] Antecedência mínima zero permite agendar para o mesmo instante.
- [ ] Reduzir o horário de funcionamento não apaga agendamentos existentes e avisa os que ficaram fora.

## Em aberto

- [ ] A visão geral do agente diz que todas as regras de agenda são configuráveis. Proposta para o painel do MVP: expor só antecedência mínima e limite de cancelamento. Lembretes (24h e 1h) e número de alternativas ficam fixos e viram configuração depois.
