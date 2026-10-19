# [PAINEL] [MVP] Estados vazios, erro e carregamento

- **Spec no Notion:** ainda não existe (proposta, transversal a todas as telas do painel)
- **Card:** sem card ainda
- **Status:** proposta, precisa de aprovação do time e de componentes no design system

## Objetivo

Definir um comportamento único para tela vazia, carregando, erro, sem permissão e página inexistente, para as 10 telas do painel não inventarem cada uma o seu.

## Estados

| Estado | Quando | O que mostra |
|---|---|---|
| Vazio | Lista sem itens (clientes, serviços, profissionais, fila) | Uma frase curta e a próxima ação |
| Carregando | Dados a caminho | Esqueleto da própria tela, sem salto de layout |
| Erro | Falha ao carregar ou gravar | Mensagem clara e botão de tentar de novo |
| Sem permissão | Barbeiro tentando abrir tela do dono | Mensagem e volta para a agenda |
| 404 | Rota ou registro inexistente (inclui ID de outra barbearia) | Mensagem neutra, sem revelar que o registro existe em outra barbearia |
| Conflito | Overbooking recusado pelo banco | Mostra o conflito, conforme `painel-agendamento-manual.md` |

## Regras

- Estado nunca só por cor: sempre palavra e ícone.
- Usa só tokens do design system. O painel separa por borda, não por sombra.
- Textos em pt-BR, voz provisória da landing (você, frases curtas, sem gíria). Textos finais são aprovados pelo time.

## Critérios de aceite

- [ ] Toda tela do painel tem os estados vazio, carregando e erro definidos.
- [ ] Abrir registro de outra barbearia por URL mostra 404, não 403.
- [ ] Nenhum estado depende só de cor.

## Em aberto

- [ ] O design system não tem componente de estado vazio, esqueleto nem mensagem de erro. Precisam ser propostos e aprovados antes de codar.
