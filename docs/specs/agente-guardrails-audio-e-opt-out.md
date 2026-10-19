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

- [x] **Decidido (19/out/2026):** imagens, figurinhas e outras mídias recebem a mesma resposta do áudio (só lê texto, pede para escrever) e entram na mesma métrica de mídia não suportada.
- [x] **Decidido (19/out/2026):** quando o rate limit estoura para um telefone, o agente avisa uma única vez que vai demorar para responder e silencia até liberar. Estouro não gera chamada ao modelo. Texto do aviso precisa de aprovação do time.
