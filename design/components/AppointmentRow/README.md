Uma linha da agenda: horário, serviço, cliente e o estado do agendamento.

- Horário no formato 09h30, em números tabulares para a coluna alinhar.
- Na visão de um profissional, passe só `client`. Na visão "todos" do dono, passe também `professional` ("Pedro Alves · com João").
- Cancelado risca horário e serviço; as linhas canceladas ficam no fim da lista do dia.
- A linha inteira é o alvo de toque (abre o agendamento); mínimo de 44px. Ações rápidas como "Faltou" ficam dentro do detalhe ou num botão `ghost` na linha, nunca escondidas em gesto.
- Empilhe as linhas dentro de um cartão `surface-1`; a borda de cima de cada linha já faz a divisória.
