---
name: implementar-spec
description: Use ao começar a implementar um card do Trello. Lê a spec em docs/specs/, transforma os critérios de aceite em testes e fecha a spec no mesmo PR.
---

# Implementar uma spec

Rode antes de escrever código e de novo antes de subir.

1. **Confirme o card.** O card precisa estar em "Em andamento" no Trello. Sem card em andamento, não crie nem mexa nessa área. Um card por vez.
2. **Leia a spec** no arquivo de `docs/specs/` citado pelo card. Se o status for "proposta", ela não está aprovada: pergunte, não suponha.
3. **Liste os critérios de aceite** e o que está em "Em aberto". Item em aberto que bloqueia o card: pergunte antes de decidir.
4. **Escreva os testes primeiro.** Um teste por critério de aceite. Regra de agenda ou de dinheiro mora só em `src/domain`, com teste. UI e agente nunca reimplementam essas regras.
5. **Implemente** só o que a spec pede. Nada fora do escopo ("Fora do escopo" da spec vale).
6. **Feche a spec no mesmo PR:** marque os critérios cumpridos, mude o status e registre qualquer decisão nova como `[x] Decidido (data)`.
7. Rode a skill `abrir-pr` antes de subir.

Regras que não se quebra: o LLM nunca escreve no banco; só confirma depois de gravar; sem overbooking (garantido pelo Postgres); toda tabela tem `barbershop_id`, injetado pelo servidor; UTC no banco e America/Sao_Paulo na tela; dinheiro em centavos.
