# [PAINEL] [MVP] Agendamento manual

- **Spec:** https://app.notion.com/p/3f9180da236f81908248e7f1cba954ab
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f8158a3bfddefb9a0f222
- **Regras do agente:** `agente-agendar-horario.md`

## Objetivo

O dono marca, remarca e cancela agendamentos que chegam por telefone ou pessoalmente, para a agenda refletir a realidade e o agente não oferecer horário ocupado.

## Comportamento

- **Campos:** cliente (busca por nome ou telefone, ou cria na hora), serviço, profissional, data e hora.
- **Cliente novo na hora:** o telefone é obrigatório, porque é ele que liga o cliente ao agente depois.
- **Overbooking:** nunca. O Postgres recusa agendamentos sobrepostos do mesmo profissional, e a tela mostra o conflito.
- **O dono ignora** a antecedência mínima e o limite de cancelamento ou remarcação, porque a regra é dele.
- **Fora do horário de funcionamento:** permite, com aviso.
- **Preço e duração** do serviço são gravados no agendamento no momento da criação.
- **Avisar o cliente por WhatsApp:** checkbox ao marcar, remarcar ou cancelar, desligado por padrão (cada aviso é mensagem paga). O lembrete de 24h dispara normalmente para qualquer agendamento ativo.
- Origem do agendamento: painel.

## Critérios de aceite

- [ ] Dois agendamentos no mesmo horário do mesmo profissional são impedidos pelo banco.
- [ ] Cliente novo não é criado sem telefone.
- [ ] Marcar dentro da antecedência mínima funciona para o dono.
- [ ] Marcar fora do horário de funcionamento mostra aviso e permite.
- [ ] Com o checkbox desligado, nenhuma mensagem é enviada; ligado, o cliente recebe o aviso.
- [ ] Mudar o preço do serviço depois não altera o preço de agendamentos existentes.

## Em aberto

- [ ] Marcar em horário fora da disponibilidade do profissional ou sobre um bloqueio: permitir com aviso (proposta), exceto sobrepor outro agendamento.
- [ ] O barbeiro com login tem as mesmas exceções do dono?
