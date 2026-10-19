# [PAINEL] [MVP] Profissionais

- **Spec:** https://app.notion.com/p/3f9180da236f812b9e8cf06ed461c845
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f8158a3bfddefb9a0f222
- **Uso pelo agente:** `agente-agendar-horario.md`

## Objetivo

Cadastrar quem atende, quais serviços faz e quando trabalha, porque o agente só oferece horário de quem realmente está disponível.

## Comportamento

- **Cadastro:** nome, serviços que faz, horário semanal e status (ativo ou inativo).
- **Horário semanal:** por dia da semana, com mais de um intervalo no mesmo dia. Precisa ficar dentro do horário de funcionamento da barbearia.
- **Serviços que faz:** seleção entre os serviços ativos. A relação profissional e serviço nasce com preço e duração opcionais, vazios no MVP (V1 preenche, sem migração).
- **Acesso:** sem login por padrão. Convite por link opcional (ver `painel-login-e-acesso.md`).
- **Inativar**, nunca apagar. O agente só enxerga profissionais ativos.
- Uma agenda por profissional.

## Critérios de aceite

- [ ] Horário fora do funcionamento da barbearia é recusado, com mensagem clara.
- [ ] O agente só oferece horários dentro do horário semanal do profissional e nunca de profissional inativo.
- [ ] O agente só oferece um serviço para profissionais que o fazem.
- [ ] Inativar mantém o histórico de agendamentos.

## Em aberto

- [ ] Inativar profissional com agendamentos futuros: bloquear até remarcar ou cancelar (proposta) ou permitir e listar os afetados?
