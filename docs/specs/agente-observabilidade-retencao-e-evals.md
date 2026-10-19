# [AGENTE] [MVP] Observabilidade, retenção e evals

- **Origem:** versão do Notion removida em 19/out/2026; este arquivo é a fonte
- **Card:** [DEV] Observabilidade, retenção e evals do agente (https://trello.com/c/6d0g2BW0)
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f81f68e3dcfa06d630d34

## Objetivo

Saber o que o agente fez quando ele errar, guardar dados pelo tempo certo e medir qualidade antes de cada mudança.

## Observabilidade

- Log de cada conversa e de cada chamada de tool, com parâmetros e resultado.
- Acesso restrito ao time. O log contém dado pessoal.
- Métricas mínimas: mensagens por barbearia, agendamentos feitos pelo agente, handoffs, áudios recebidos, erros de tool, custo de modelo por barbearia.

## Retenção

Histórico de conversa guardado por 90 dias. O dono vê só o resumo do handoff.

## Evals (critério de aceite do agente)

Suíte com cerca de 30 conversas simuladas, rodada a cada mudança de prompt ou de modelo. Cobertura mínima:

- Agendar com datas relativas (amanhã de manhã, sexta que vem)
- Horário ocupado e oferta de alternativas
- Remarcar e cancelar, com um e com vários agendamentos
- Pergunta fora de escopo
- Tentativa de prompt injection
- Falha de tool (o agente não pode dizer que agendou)
- Áudio e mensagem incompreensível
- Handoff e retomada

## Critérios de aceite

- [ ] Toda chamada de tool aparece no log com o resultado.
- [ ] A suíte de evals roda com um comando e reporta aprovado ou reprovado por caso.
- [ ] Dados com mais de 90 dias são removidos.

## Em aberto

- [ ] Modelo: começar com Sonnet e testar Haiku depois. Os evals decidem.
