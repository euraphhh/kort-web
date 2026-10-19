# [PAINEL] [MVP] WhatsApp e agente

- **Spec:** https://app.notion.com/p/3f9180da236f810a881dfaa9236e1f9f
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f8158a3bfddefb9a0f222
- **Comportamento do agente:** `agente-handoff-para-humano.md` e `agente-canal-whatsapp.md`

## Objetivo

Dar ao dono controle e visibilidade do agente: ligar ou desligar, ver se o WhatsApp está conectado e devolver conversas que foram para atendimento humano.

## Comportamento

- **Status da conexão:** conectado ou com erro. A conexão em si é manual no MVP (feita pelo time), então a tela só mostra o estado.
- **Interruptor do agente:** o dono liga e desliga por barbearia. Fica bloqueado até o mínimo do onboarding estar cumprido.
- **Conversas em handoff:** lista das conversas em que o agente pausou, com cliente, horário e o resumo do que o cliente queria. O dono não vê o histórico completo.
- **Devolver ao agente:** botão por conversa para retomar o atendimento automático.

## Critérios de aceite

- [ ] Com o interruptor desligado, o agente não responde novas mensagens.
- [ ] Conversa pausada aparece na lista com o resumo.
- [ ] "Devolver ao agente" faz o agente voltar a responder naquela conversa.
- [ ] O dono não consegue ler o histórico completo das conversas pelo painel.

## Em aberto

- [ ] **Esta tela vai crescer (observação de 19/out/2026):** a tela de configurações do agente precisa ser bem específica. Hoje a spec cobre só status, interruptor, handoffs e devolução. Falta especificar o que mais o dono configura (por exemplo, regras de agenda expostas, mensagens e lembretes) e o que fica fixo no MVP.

- [x] **Decidido (19/out/2026):** com o agente desligado, os lembretes já programados continuam, porque pertencem ao agendamento. O dono atende as mensagens novas pelo próprio app. Pendente de refletir no Notion.
- [x] **Decidido (19/out/2026):** quando a conexão do WhatsApp cai, o painel mostra uma faixa de erro (palavra e ícone) e o dono e o time recebem e-mail pelo Resend. Pendente de refletir no Notion.
