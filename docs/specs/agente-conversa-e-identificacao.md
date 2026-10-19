# [AGENTE] [MVP] Conversa e identificação do cliente

- **Spec:** https://app.notion.com/p/3f9180da236f813aaf51ec41599e1e6e
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f81f68e3dcfa06d630d34

## Objetivo

Receber o cliente no WhatsApp, saber quem é e de qual barbearia, e conduzir a conversa no tom do kort.

## Comportamento

- A barbearia é identificada pelo número que recebeu a mensagem. O cliente é identificado pelo telefone.
- Cliente novo: o agente pede nome e sobrenome e cria o cadastro. Cliente importado por CSV: o agente já o chama pelo nome.
- Tom único e fixo no MVP: mensagens em minúsculas e com gírias, nomes próprios com maiúscula, frases naturais. Abertura de exemplo: "opa! eu sou o assistente da barbearia [nome da barbearia]. como posso te ajudar hoje?"
- Quando não entende: pede para repetir. Na segunda vez seguida, oferece chamar um atendente (aciona o handoff).
- Mensagens picotadas ("oi" / "quero cortar" / "amanhã") são agrupadas: o agente espera 3 a 5 segundos depois da última e processa tudo junto.

## Critérios de aceite

- [ ] Dado um número novo, o agente cria o cliente após receber nome e sobrenome e segue para o pedido original.
- [ ] Dado um número já cadastrado, o agente não pergunta o nome de novo.
- [ ] Três mensagens em menos de 3 segundos geram uma única resposta.
- [ ] Duas mensagens incompreensíveis seguidas resultam na oferta de atendente.
- [ ] Nenhuma resposta usa dados de outra barbearia.

## Fora do escopo

Tom configurável por barbearia. Conversa com o dono. Cliente em mais de uma barbearia no mesmo número já é suportado pelo modelo de dados, mas não tem fluxo próprio no MVP.

## Em aberto

- [ ] Nome e sobrenome ou só nome. Pedir mais dados no 1º contato aumenta o risco de desistência; revisar com dados reais.
