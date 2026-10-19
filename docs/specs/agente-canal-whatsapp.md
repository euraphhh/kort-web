# [AGENTE] [MVP] Canal WhatsApp (webhook, limites e número)

- **Origem:** versão do Notion removida em 19/out/2026; este arquivo é a fonte
- **Card:** [DEV] Canal WhatsApp (Meta Cloud API, número e webhook) (https://trello.com/c/ufFCMp6z)
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f81f68e3dcfa06d630d34

## Objetivo

Receber e enviar mensagens pela API oficial da Meta com segurança, sem duplicar e sem estourar custo.

## Requisitos

- **Número por barbearia.** O número que recebeu a mensagem define o `barbershop_id`, passado pelo servidor.
- **Coexistência.** A barbearia usa (ou migra para) o app WhatsApp Business e o número não pode estar ativo em outra configuração de Cloud API. Onboarding manual nas primeiras barbearias.
- **Deduplicação.** Mensagens repetidas pelo webhook da Meta são ignoradas pelo ID da mensagem.
- **Agrupamento.** Mensagens em sequência são juntadas em 3 a 5 segundos.
- **Rate limit.** Por telefone (hora e dia) e por barbearia, mais teto diário de custo de modelo por barbearia.
- **Janela de 24h.** Fora dela, só template aprovado.
- **Assinatura do webhook.** Validar que a requisição vem da Meta (proposta).
- **Ambiente de teste.** A Meta oferece número de teste, suficiente para construir o agente sem CNPJ.

## Critérios de aceite

- [ ] A mesma mensagem entregue duas vezes gera uma única resposta e um único agendamento.
- [ ] Mensagem recebida em um número cai na barbearia correta.
- [ ] Estouro de rate limit não gera chamadas ao modelo.
- [ ] Requisição sem assinatura válida é rejeitada.

## Em aberto

- [ ] CNPJ para a verificação de negócio na Meta (necessário para escalar).
- [ ] Tarifas oficiais de mensagens de serviço e utility em BRL (ver visão geral).
- [ ] Teste da coexistência com número real.
- [ ] Fila durável: QStash ou Vercel Queues. Decisão adiada para este card, com o volume real de mensagens.
- [ ] Sentry entra neste card (webhook e agente).
