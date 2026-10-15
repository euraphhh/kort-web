Campo de texto com rótulo, dica e erro, para os cadastros do painel (serviços, profissionais, horários, clientes).

- Rótulo sempre visível acima do campo; o placeholder é exemplo, nunca o rótulo ("Ex.: Corte e barba").
- Contorno em `border-control`, que tem contraste suficiente; a `border` comum não serve para campos.
- Use `inputMode="tel"` para telefone e `inputMode="decimal"` para preço. Preço em reais com vírgula ("R$ 40,00").
- Erro em uma frase que diz o que fazer ("Informe a duração em minutos"), nunca só "Campo inválido". O erro substitui a dica.
