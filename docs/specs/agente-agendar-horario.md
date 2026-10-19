# [AGENTE] [MVP] Agendar horário

- **Origem:** versão do Notion removida em 19/out/2026; este arquivo é a fonte
- **Card:** [DEV] Tools determinísticas do agente (https://trello.com/c/iXSp0an1)
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f81f68e3dcfa06d630d34

## Objetivo

O cliente pede um serviço e sai da conversa com o horário gravado, sem app e sem link.

## Comportamento

- O agente coleta serviço, profissional (ou sem preferência) e dia/hora desejados.
- Sempre consulta `check_availability` antes de oferecer um horário. Nunca confia em disponibilidade consultada minutos antes.
- Se o horário pedido está ocupado, oferece os 2 ou 3 horários livres mais próximos, no mesmo dia e no dia seguinte.
- Sem preferência de profissional: escolhe quem estiver livre e fizer o serviço.
- Antes de gravar, resume serviço, profissional, dia, hora e barbearia. Só chama `create_appointment` depois do sim do cliente.
- Só diz que está agendado depois que a tool retornar sucesso.
- Datas relativas (sexta que vem, depois de amanhã, de noite) são resolvidas com data, hora e fuso America/Sao_Paulo informados no prompt. As tools só aceitam datas em ISO.

## Regras de negócio

- Uma agenda por profissional. Serviços com durações diferentes: o horário ocupado depende da duração do serviço.
- Antecedência mínima da barbearia (padrão 30 min).
- Sem overbooking: o Postgres impede com exclusion constraint por profissional. A tool trata o erro 23P01 e devolve "horário ocupado" ao modelo. Reserva temporária enquanto o cliente pensa fica fora do MVP.
- Cada agendamento tem status: agendado, concluído, cancelado, faltou.

## Critérios de aceite

- [ ] Pedido completo e horário livre: agenda e confirma depois de gravar.
- [ ] Dois clientes pedindo o mesmo horário ao mesmo tempo: só um é gravado e o outro recebe alternativas.
- [ ] Falha de gravação: o agente avisa e oferece outro horário, sem dizer que agendou.
- [ ] Pedido de horário dentro da antecedência mínima é recusado com alternativas.
- [ ] Datas relativas são interpretadas corretamente nos casos da suíte de evals.
- [ ] O agente nunca preenche `barbershop_id`.

## Fora do escopo

Pagamento, sinal, upsell, lista de espera, reserva temporária de horário.
