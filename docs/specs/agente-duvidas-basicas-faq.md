# [AGENTE] [MVP] Dúvidas básicas (FAQ)

- **Spec:** https://app.notion.com/p/3f9180da236f815aa59fc42bd5f11112
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f81f68e3dcfa06d630d34

## Objetivo

Responder o que o cliente costuma perguntar antes de agendar: preço, duração, serviços, profissionais, horário de funcionamento e endereço.

## Comportamento

- Toda informação vem de tools ou do cadastro da barbearia. O agente nunca afirma preço, horário, serviço ou endereço que não veio de uma tool.
- Se a informação não está cadastrada, o agente diz que não tem e oferece chamar um atendente.
- Perguntas fora do universo da barbearia são redirecionadas com educação: "isso eu não sei, mas posso te ajudar com agendamento".

## Dependências

O painel precisa permitir cadastrar horário de funcionamento e endereço (spec: `painel-configuracoes-da-barbearia.md`).

## Critérios de aceite

- [ ] Pergunta de preço de serviço cadastrado retorna o valor do cadastro.
- [ ] Pergunta sobre algo não cadastrado não gera resposta inventada e oferece atendente.
- [ ] Pergunta fora de escopo é redirecionada sem responder o conteúdo.

## Fora do escopo

Promoções, formas de pagamento, assinatura ou clube, cardápio de produtos.
