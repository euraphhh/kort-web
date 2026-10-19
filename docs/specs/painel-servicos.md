# [PAINEL] [MVP] Serviços

- **Origem:** versão do Notion removida em 19/out/2026; este arquivo é a fonte
- **Card:** [DEV] Cadastros base: serviços, profissionais e configurações (https://trello.com/c/uUdAvzis)
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f8158a3bfddefb9a0f222
- **Perguntas de preço no agente:** `agente-duvidas-basicas-faq.md`

## Objetivo

Cadastrar o que a barbearia vende, com preço e duração, que são a fonte de verdade do agente.

## Comportamento

- **Cadastro:** nome, preço (em centavos, exibido em reais), duração em minutos e status (ativo ou inativo).
- **Preço e duração padrão da barbearia.** Preço ou tempo diferente por profissional fica na V1. Contorno no MVP: cadastrar dois serviços (corte e corte sênior).
- **Combos** (corte e barba) são um serviço à parte, com duração e preço próprios. Sem lógica de pacote. Vários serviços no mesmo agendamento é V1.
- **Inativar**, nunca apagar. O agente só oferece serviços ativos.
- **Mudar o preço ou a duração** vale só para agendamentos futuros: o agendamento grava os valores do momento.
- Quais profissionais fazem cada serviço é definido na tela de Profissionais.

## Critérios de aceite

- [ ] Serviço inativo some do agente e continua nos agendamentos antigos.
- [ ] Alterar o preço não muda agendamentos existentes.
- [ ] A duração do serviço define o espaço ocupado na agenda.
- [ ] Preço é armazenado como inteiro em centavos.

## Em aberto

- [ ] Confirmar com barbeiros se preço e duração únicos por serviço bastam.
