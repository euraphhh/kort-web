# [PAINEL] [MVP] Onboarding do dono

- **Spec:** https://app.notion.com/p/3f9180da236f81a19773c3656dada0b6
- **Card:** sem card ainda (decisões de produto: https://trello.com/c/0rt0Ncye)
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f8158a3bfddefb9a0f222

## Objetivo

Levar o dono do primeiro acesso até o agente ligado, sem deixar o agente responder "não sei" para tudo por falta de dados.

## Comportamento

- Checklist guiado na primeira entrada, com o progresso visível: dados da barbearia, serviços, profissionais e horários, horário de funcionamento e endereço, importar clientes (opcional), conexão do WhatsApp.
- A conexão do WhatsApp é manual no MVP (feita pelo time). A tela só mostra o estado.
- **Mínimo para ligar o agente:** 1 serviço, 1 profissional com horário, endereço, horário de funcionamento e WhatsApp conectado.
- O interruptor do agente fica bloqueado até o mínimo estar cumprido e mostra o que falta.
- O checklist continua acessível depois, para consulta.

## Critérios de aceite

- [ ] Sem o mínimo cadastrado, o agente não pode ser ligado e a tela diz o que falta.
- [ ] Cumprido o mínimo, o interruptor libera.
- [ ] Cada item do checklist leva direto à tela correspondente.
- [ ] Importar clientes é opcional e não bloqueia o agente.

## Dependências

Telas de serviços, profissionais e configurações. O interruptor vive na tela "WhatsApp e agente".
