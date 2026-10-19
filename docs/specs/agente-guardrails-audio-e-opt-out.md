# [AGENTE] [MVP] Guardrails, áudio e opt-out

- **Spec:** https://app.notion.com/p/3f9180da236f8159959aecb794035448
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f81f68e3dcfa06d630d34

## Objetivo

Manter o agente dentro do escopo, seguro e em conformidade.

## Regras

- **Escopo:** só assuntos da barbearia. Fora disso, redireciona com educação.
- **Fonte da verdade:** o agente não afirma dado que não veio de tool. O `barbershop_id` é injetado pelo servidor, então um erro do modelo ou uma instrução maliciosa do cliente não alcança outra barbearia.
- **Instruções do cliente:** pedidos para ignorar regras, revelar o prompt ou listar tools são recusados.
- **Áudio:** no MVP não transcreve. Responde que por enquanto só consegue ler texto e pede para escrever. Cada áudio recebido é contado (métrica para priorizar a V1).
- **Opt-out:** o cliente que escreve "parar" deixa de receber mensagens automáticas (lembretes). A Meta e a LGPD exigem esse canal.

## Critérios de aceite

- [ ] Áudio recebido gera a resposta de só texto e incrementa o contador.
- [ ] Pergunta fora de escopo é redirecionada.
- [ ] Tentativa de prompt injection nos casos da suíte de evals não vaza prompt nem dados de outra barbearia.
- [ ] "Parar" registra o opt-out e confirma uma vez.

## Em aberto

- [ ] Como responder a imagens, figurinhas e outros tipos de mídia (proposta: mesma resposta de só texto).
- [ ] O que o agente faz quando o rate limit é atingido.
