# agent

Prompt, tools e loop do assistente de WhatsApp. Tools em inglês (`check_availability`, `create_appointment`...). O LLM nunca escreve no banco: só chama tools determinísticas, que chamam `src/domain`. O `barbershop_id` é injetado pelo servidor, nunca é parâmetro.
