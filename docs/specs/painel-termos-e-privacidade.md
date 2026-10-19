# [PAINEL] [MVP] Termos de uso e política de privacidade

- **Spec no Notion:** ainda não existe (proposta, **precisa ser discutida com o time**)
- **Card:** depende do [NEGÓCIO] Legal/Jurídico (https://trello.com/c/D01uSnXW)
- **Status:** em discussão. Não implementar antes de decidir.

## Objetivo

O produto trata dado pessoal de clientes finais (nome e telefone) e manda mensagem por WhatsApp. A LGPD e a Meta exigem textos e consentimentos que as specs já pressupõem, mas ninguém definiu onde ficam.

## Onde as specs já pedem isso

- `painel-clientes-e-importacao-csv.md`: aceite do dono de que tem autorização para usar os contatos importados (LGPD).
- `agente-guardrails-audio-e-opt-out.md`: opt-out ("parar") exigido pela Meta e pela LGPD.
- `agente-observabilidade-retencao-e-evals.md`: retenção de 90 dias de dado pessoal em log.
- `painel-cadastro-de-barbearia-v1.md`: aceite de termos no cadastro aberto.

## O que precisaria existir (a decidir)

- Termos de uso e política de privacidade, em páginas públicas (provavelmente no site, fora do painel).
- Aceite registrado pelo dono no primeiro acesso, com data e versão do texto.
- Papel de cada parte: a barbearia é a controladora dos dados dos clientes dela e o kort é operador? Isso muda o texto e precisa de validação jurídica.
- Canal e procedimento para pedido de eliminação de dados (hoje: manual pelo time).

## Em aberto (tudo)

- [ ] Quem redige e valida os textos (o card Legal/Jurídico está no Backlog).
- [ ] Onde o aceite é pedido: primeiro login do dono, na importação de CSV, ou nos dois.
- [ ] Como versionar o texto e registrar quem aceitou qual versão.
- [ ] Se o assistente avisa o cliente final sobre o tratamento dos dados no primeiro contato.
- [ ] Rodapé da landing e do painel com os links.
