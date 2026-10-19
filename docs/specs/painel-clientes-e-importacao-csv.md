# [PAINEL] [MVP] Clientes e importação de CSV

- **Spec:** https://app.notion.com/p/3f9180da236f81a693eafbbf5b5e7fb9
- **Card:** sem card ainda
- **Status:** spec escrita, não implementada
- **Decisões gerais:** https://app.notion.com/p/3f9180da236f8158a3bfddefb9a0f222
- **Como o agente usa o cliente:** `agente-conversa-e-identificacao.md`

## Objetivo

Manter a base de clientes da barbearia e trazer quem já é cliente, para o agente reconhecê-lo pelo número e chamá-lo pelo nome.

## Comportamento

- **Lista** com busca por nome ou telefone. **Detalhe:** nome, telefone, histórico de agendamentos e quantidade de faltas.
- **Cadastro e edição manual.** Telefone é obrigatório e único por barbearia.
- **Inativar**, nunca apagar. Cliente inativo não aparece na busca padrão e o agente ignora o cadastro.
- Cliente que pediu para parar de receber mensagens aparece sinalizado (proposta).
- **Importação por CSV**, com colunas nome e telefone obrigatórias:
  - Mostra uma **prévia** antes de gravar, com os erros (telefone inválido, linha vazia).
  - Normaliza o telefone para o formato internacional. Sem DDD, usa o DDD padrão da barbearia.
  - Telefone que já existe é ignorado e listado no relatório.
  - Pede um **aceite do dono** de que tem autorização para usar aqueles contatos (LGPD) antes de gravar.
  - Ao final, relatório com importados, ignorados e com erro.

## Critérios de aceite

- [ ] CSV com telefones em formatos diferentes (com e sem 55, com e sem 9, com parênteses) é normalizado para o mesmo formato.
- [ ] Telefone já cadastrado não gera cliente duplicado.
- [ ] Nada é gravado sem o aceite.
- [ ] Linhas com erro não impedem a importação das válidas e aparecem no relatório.
- [ ] Cliente importado é reconhecido pelo agente na primeira mensagem.

## Em aberto

- [ ] Procedimento de anonimização por pedido de eliminação (LGPD), manual pelo time no MVP.
- [ ] DDD padrão: campo nas Configurações.
