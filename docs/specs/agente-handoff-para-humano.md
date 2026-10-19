# [AGENTE] [MVP] Handoff para humano

- **Spec:** https://app.notion.com/p/3f9180da236f81248f5edf11dae05eb0
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f81f68e3dcfa06d630d34

## Objetivo

Passar a conversa para uma pessoa da barbearia sem o agente falar por cima dela.

## Gatilhos

- O agente não entendeu o cliente duas vezes seguidas.
- O cliente pede para falar com uma pessoa.
- O assunto está fora do que o agente resolve (reclamação, caso especial, informação não cadastrada).
- O dono responde pelo app WhatsApp Business: o agente pausa automaticamente nessa conversa.

## Comportamento

- `escalate_to_human` pausa o agente naquela conversa e registra um resumo do que o cliente queria.
- Durante a pausa, o agente não responde nada.
- O dono responde pelo próprio WhatsApp, no mesmo número. O cliente não vê troca de número.
- Retomada: manualmente (botão no painel) ou por tempo sem atividade.
- O dono vê no painel apenas o resumo do handoff, não o histórico completo.

## Critérios de aceite

- [ ] Depois de escalar, nenhuma mensagem automática é enviada naquela conversa.
- [ ] Mensagem do dono pelo app pausa o agente.
- [ ] Retomada manual faz o agente voltar a responder.
- [ ] O resumo do handoff é salvo e visível ao dono.

## Em aberto

- [ ] Como o dono é avisado: com coexistência a conversa aparece no app dele, mas é preciso testar se basta ou se ainda precisa de aviso.
- [x] **Decidido (19/out/2026):** no MVP a retomada é só manual (botão no painel), sem retomada por tempo. Isso substitui "ou por tempo sem atividade" no Comportamento. Pendente de refletir no Notion.
- [ ] Validar a coexistência com número real antes de fechar este desenho.
