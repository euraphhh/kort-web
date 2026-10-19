# [INTERNO] [MVP] Painel do time (papel staff)

- **Spec no Notion:** ainda não existe (proposta; a arquitetura prevê o papel `staff` via claim, sem telas)
- **Card:** sem card ainda
- **Status:** proposta, precisa de aprovação do time
- **Depende de:** schema multi-tenant e RLS, `painel-login-e-acesso.md`

## Objetivo

No MVP o time cria as barbearias, conecta o WhatsApp manualmente e investiga erros do agente. Hoje nada disso tem tela. Esta spec lista o mínimo para operar os pilotos.

## Comportamento (proposta de mínimo)

- Acesso só para usuários com papel `staff`, separado do painel do dono.
- **Barbearias:** criar a barbearia piloto e o usuário dono, ver a lista e o estado do onboarding de cada uma.
- **WhatsApp:** registrar o número de cada barbearia (que define o `barbershop_id` no servidor) e ver o estado da conexão.
- **Agente:** ver e desligar o agente de uma barbearia.
- **Logs de conversa e de tool:** acesso restrito ao time, com retenção de 90 dias (ver `agente-observabilidade-retencao-e-evals.md`).
- **Pedidos de LGPD:** o procedimento de anonimização é manual pelo time no MVP (ver `painel-clientes-e-importacao-csv.md`).

## Critérios de aceite

- [ ] Usuário sem o papel `staff` não acessa nenhuma rota do painel do time.
- [ ] Logs só são visíveis ao `staff`; o dono nunca vê o histórico completo.
- [ ] Toda ação do `staff` sobre dados de uma barbearia fica registrada.

## Em aberto

- [ ] Isso vira tela no MVP ou fica como script e SQL enquanto são poucos pilotos? É a decisão que mais muda o esforço.
- [ ] Como o `staff` "entra" numa barbearia para ajudar o dono (visualizar como).
- [ ] Onde ficam as métricas de custo de modelo por barbearia.
