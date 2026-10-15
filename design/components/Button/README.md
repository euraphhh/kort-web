Botão de ação, com quatro pesos: primary, secondary, ghost e danger.

- Uma única `primary` por tela: a ação que o dono mais faz ali ("Novo agendamento", "Salvar serviço").
- `secondary` para as demais ações; `ghost` para ações leves dentro de cartões ("Ver detalhes"); `danger` só para o que apaga ou cancela ("Inativar", "Cancelar agendamento"), sempre com confirmação.
- Rótulo curto, com verbo e maiúscula só no início. Ícone opcional à esquerda (`icon`); botão só com ícone exige `aria-label`.
- Altura mínima de `target-min` (44px). Use `block` para ocupar a largura toda em formulários no celular.
- Passe `href` para virar link; senão é um `<button type="button">`.
