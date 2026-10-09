# Referências, aula 3.4

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três cuidados que valem para a aula inteira. A documentação do Gemini vive em `ai.google.dev` e é em inglês: use as URLs exatas daqui, porque âncora errada não dá erro, só abre a página no topo. Preço, modelos e limites mudam sem aviso, e a data pesa: o preço pago do Flash atual tem aumento marcado para 01/01/2027, então o número que vale é o do dia em que ele mediu, com modelo, preço, câmbio e data escritos no README, e nunca um que você lembra. E os limites do gratuito do Gemini não são publicados em tabela: cada projeto vê os seus no AI Studio, em https://aistudio.google.com/rate-limit, página que pede login. Ele abre no navegador dele, não no painel, e é o número que ele leu ali que entra no teto; não cite número de blog nem de memória. Pagar ou não foi a escolha dele na 3.3, e não se troca no meio da aula para fugir de um limite: quem está no gratuito não sobe de nível por causa do 429, e quem está no pago confere o gasto no painel do provedor. As referências abaixo são do Gemini, do Groq e da Anthropic; ele lê as do provedor que escolheu.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `tokens-e-preco`**

- **Google, *Gemini Developer API pricing*** — Gemini API Docs, atualizado em out/2026 · ~3 min de leitura (o bloco do modelo que ele usa)
  https://ai.google.dev/gemini-api/docs/pricing
  A tabela oficial em dólar por milhão de tokens, com a coluna do gratuito ao lado da do pago: entrada, saída "incluindo os tokens de raciocínio" e cache, modelo por modelo.

A pergunta do marco é de previsão: só abra a tabela depois que ele responder. Quatro minas na página. Ela lista dezenas de modelos, de imagem, áudio e vídeo inclusive; mande ler só o bloco do modelo que a P3 usa, e nele só a primeira tabela (Standard). As tabelas Batch, Flex e Priority logo abaixo são outros jeitos de chamar: Batch volta no marco `reduzir`, as outras duas não são desta aula. A coluna do gratuito diz "Free of charge" em tudo, e a conta sai da coluna do pago. E a última linha de cada tabela, "Used to improve our products", é Yes no gratuito e No no pago: é o motivo de a Denise de verdade não poder usar o gratuito, e é gancho da 3.6, não matéria de hoje. Quem está no Groq lê o preço pago na página de modelos dele (https://console.groq.com/docs/models), na mesma unidade.

- **Anthropic, *Pricing*** — Claude Platform Docs, em inglês, sem data · ~3 min de leitura (a primeira tabela, Model pricing)
  https://platform.claude.com/docs/en/about-claude/pricing
  A tabela oficial em dólar por milhão de tokens, modelo por modelo: entrada, saída e cache, e o desconto de lote mais abaixo.

Para quem está no Claude. Duas minas: o Haiku 5.5 tem dois preços, um para prompt de até 100 mil tokens e outro, mais alto, para prompt maior, e a P3 fica no primeiro; e os modelos 4.7 em diante contam mais tokens para o mesmo texto que os antigos, então o número de tokens que vale é o que a resposta da API devolve, não uma estimativa por caractere.

**marco `custo-por-execucao`**

- **Google, *Understand and count tokens* — seção "Count tokens"** — Gemini API Docs, atualizado em set/2026 · ~3 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/tokens#count-tokens
  Os dois jeitos de contar: antes de mandar, só a entrada, sem gerar resposta; e depois, no `usage` de toda resposta, com entrada, saída, raciocínio e cache em campos separados.

É a ferramenta de decompor: contar o pedido inteiro, depois sem as mensagens anteriores, depois sem o plano de contas, e a diferença é o peso de cada pedaço. Ele pede isso ao Claude da oficina; você não dita como. O número que vai para o README sai do `usage` das chamadas reais, não da contagem prévia. A regra de bolso da página (um token, uns quatro caracteres) é medida em inglês; para as mensagens da Prado, vale a contagem. O raciocínio vem num campo próprio e é cobrado como saída: quem soma só entrada e saída e esquece o raciocínio conta a menos.

**marco `reduzir`**

- **Google, *Context caching* — seção "Implicit caching"** — Gemini API Docs, atualizado em set/2026 · ~2 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/caching#implicit-caching
  O cache que já vem ligado, sem configurar nada: o conselho de pôr o conteúdo grande e comum no começo do prompt, o tamanho mínimo modelo por modelo, e o campo do `usage` que prova se pegou.

- **Google, *Batch API* — seção "Technical details"** — Gemini API Docs, atualizado em set/2026 · ~2 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/batch-mode#technical-details
  O preço do desconto, escrito: metade do custo da chamada comum, em troca de um prazo de até 24 horas para o resultado.

A primeira só entra depois da resposta à pergunta de conceito, senão ela responde por ele. A armadilha da P3 está na tabela da seção: o cache só liga acima de um mínimo de tokens de entrada, que é maior nos Flash atuais do que nos antigos, e os Flash-Lite nem aparecem nela. Um prompt da P3 com plano de contas e regras pode ficar abaixo do mínimo, e aí não há cache nem erro nenhum; a prova é `total_cached_tokens` zerado no `usage`. Quem troca para o modelo menor e conta com o cache pode ficar sem os dois descontos ao mesmo tempo. A página não dá prazo de validade do cache, só manda mandar prefixos parecidos "em pouco tempo": não prometa acerto o dia inteiro. O preço da leitura em cache está na tabela de preços de cada modelo; não diga uma fração como regra. Do lote, diga o que ele troca: até um dia de espera, quando o Tiago quer a fila pronta no mesmo dia; e lote não existe no gratuito ("Not available" na tabela Batch).

**marco `teto-e-log`**

- **Google, *Rate limits* — seção "How rate limits work"** — Gemini API Docs, atualizado em set/2026 · ~2 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/rate-limits#how-rate-limits-work
  As três medidas do limite (requisições por minuto, tokens de entrada por minuto, requisições por dia), que valem por projeto e não por chave, com a cota diária zerando à meia-noite do horário do Pacífico.

- **Groq, *Rate Limits* — seção "Rate Limits"** — GroqCloud Docs, sem data · ~2 min de leitura (a tabela do plano Free)
  https://console.groq.com/docs/rate-limits#rate-limits
  Um provedor que publica a tabela: requisições e tokens por minuto e por dia de cada modelo no plano gratuito, por organização, e o erro 429 com o tempo de espera quando passa.

- **Anthropic, *Rate limits*** — Claude Platform Docs, em inglês, sem data · ~4 min de leitura (as seções "Spend limits" e "Rate limits")
  https://platform.claude.com/docs/en/api/rate-limits
  O pago também tem limite: requisições e tokens de entrada e de saída por minuto, por organização e por modelo, com o 429 e o tempo de espera; e o limite de gasto mensal que ele mesmo põe no Console.

A primeira é o teto real que o sistema bate, e é contraste, não solução: é da conta inteira, não sabe quem é o Nilton, e quando bate, bate para os 140 clientes de uma vez, o contrário do que a Denise pediu. O teto por cliente mora no código, antes da chamada, abaixo desse. Meia-noite do Pacífico é de madrugada em Brasília, entre 4h e 5h conforme o horário de verão de lá: a cota do dia não vira à meia-noite dele. O erro que volta é o 429, e a tabela de erros do Gemini tem duas linhas dele: o do minuto, que passa esperando, e o da cota do dia, que não. Ele entra no log como resultado. A do Groq serve a todos como ordem de grandeza: oito mil tokens por minuto acabam em poucas mensagens com o contexto da P3. A da Anthropic é para quem está no pago: organização nova começa com limite menor que o da tabela, e o limite de gasto que ele põe no Console devolve outro erro, que o sistema também precisa tratar sem perder a mensagem. Para barrar a entrada de tamanho absurdo antes de chamar, volte à contagem do marco anterior.

**marco `margem`**

- **Ethan Ding, *tokens are getting more expensive*** — mandates (Substack), jul/2025 · ~9 min de leitura, em inglês
  https://ethanding.substack.com/p/ai-subscriptions-get-short-squeezed
  Por que preço fixo com uso desigual come a margem: o usuário pesado consome muitas vezes o que paga, e uma das saídas que o autor discute é cobrar pelo uso, que é o que o lançamento extra da Denise já faz.

Link solto no fechamento, nunca leitura na aula. É ensaio de opinião, escrito em minúsculas e com ironia, sobre assinaturas de ferramentas de código; os preços que ele cita são de modelos de 2025 e não servem para conta nenhuma, e a afirmação de que a Anthropic pôs a troca de modelo dentro dos pesos é especulação dele. Vale pelo mecanismo, que é o cliente pesado da aula em escala de empresa. A conta inteira do negócio é da 5.3: não abra aqui.

## Sugeridas

**marco `reduzir`**

- **IBM Technology (Martin Keen), *What is Prompt Caching? Optimize LLM Latency with AI Transformers*** — YouTube, canal oficial, fev/2026 · 9 min 6 s no total, trecho de 1 min 50 s, de 6:02 a 7:52
  https://www.youtube.com/watch?v=u57EnkQaUTY&hl=en&persist_hl=1&t=362s
  Um quadro com o prompt montado em camadas, instruções, documento, exemplos e pergunta, e o que acontece com o cache quando a pergunta vem no fim e quando vem no começo: a pergunta do marco, desenhada.

Uma só sugerida. Ofereça no painel depois que ele responder a pergunta de conceito, como conferência, não como explicação. Comece em 6:02 ("when does an LLM know what gets cached?") e pare em 7:52: antes disso é o funcionamento interno do modelo, que a aula não usa, e depois vêm números que não valem para o Gemini (um mínimo único de 1.024 tokens e um prazo de cinco a dez minutos); o mínimo certo, por modelo, está na página de cache citada acima. O vídeo não é sobre um provedor só, e o efeito da ordem do prompt vale para todos. Em inglês, com legenda em inglês.
