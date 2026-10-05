# Referências, aula 3.5

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três cuidados que valem para a aula inteira. A P3 roda no plano gratuito: o Gemini é o recomendado, e a documentação dele vive em `ai.google.dev`, em inglês; o Groq é a alternativa, com o formato de lista de mensagens com papéis. O conceito da aula vale nos dois, e só o nome do campo muda. Saída estruturada mudou de forma no Gemini: a documentação de hoje ensina a API Interactions, com `response_format` levando `mime_type` e `schema`, e tutorial antigo usa o `generateContent`, com `responseMimeType` e `responseSchema`. As duas funcionam; se o agente da oficina misturar as duas, é por isso, e você manda conferir na página, não discute de memória. E modelo, limite e formato mudam de mês para mês: o que vale é a página no dia da oficina.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `schema`**

- **Google, *Structured outputs* — seção "Best practices"** — Gemini API Docs, atualizada em set/2026 · ~1 min de leitura (a seção), em inglês
  https://ai.google.dev/gemini-api/docs/structured-output#best-practices
  A tese do marco dita pelo próprio provedor: o JSON sai sintaticamente correto, e o valor se valida na aplicação, inclusive a saída que bate com o schema e está errada no sentido.

- **Google, *Structured outputs* — seção "JSON schema support"** — Gemini API Docs, atualizada em set/2026 · ~3 min de leitura (a seção e "Limitations", logo abaixo), em inglês
  https://ai.google.dev/gemini-api/docs/structured-output#json-schema-support
  O que o schema forçado aceita: `enum` para tipo, categoria e forma de pagamento, `format` de data, `minimum`, `required`. E, em "Limitations", que nem todo recurso do JSON Schema entra e schema grande ou muito aninhado pode ser recusado.

- **Groq, *Structured Outputs* — seção "Choosing between strict and best-effort mode"** — GroqCloud Docs, sem data · ~2 min de leitura (a seção), em inglês
  https://console.groq.com/docs/structured-outputs#choosing-between-strict-and-besteffort-mode
  Para quem foi pelo Groq: só o modo estrito garante o schema, e só em alguns modelos; o outro pode devolver erro 400 ou JSON válido que não bate com o schema.

A primeira é a resposta da pergunta de previsão: só abra depois que ele responder. A costura que a pergunta quer é de três degraus: pedir no prompt não garante nada; forçar garante a sintaxe e o `enum`; validar é o único que confere o valor. O Gemini aceita `minimum` no schema, e a mina está aí: no material, `valor` é sempre positivo, exceto o estorno da categoria `1.4`, que vai negativo. Um `minimum: 0` no schema forçado não deixa o modelo escrever o estorno certo, e o que sai é um estorno positivo que passa liso. O sinal depende da categoria, e regra que cruza dois campos mora na validação dele, não no schema. Se o agente da oficina propuser o Zod, é porque o exemplo de JavaScript da página gera o schema a partir dele; o mesmo Zod serve para validar a resposta depois, e a escolha é da oficina. O que importa é o resultado: a recusa com o motivo campo a campo, que é o que a fluência pede para ele colar. Não cite a documentação do Zod, que é código. A do Groq só entra se ele foi pelo Groq: lá, saída estruturada não combina com streaming, e o lançador não precisa de streaming (3.3).

**marco `quando-quebra`**

- **Google, *Interactions API* — campo `status` do recurso Interaction** — Gemini API Docs, referência da API, sem data · consulta, não leitura, em inglês
  https://ai.google.dev/api/interactions-api
  O "terminou ou foi cortada" que vem em toda resposta: `completed`, `failed`, e `incomplete`, que é a resposta que acabou com resultado pela metade, por exemplo por bater no limite de saída.

- **Google, *API errors* — seção "Standard API error codes"** — Gemini API Docs, atualizada em set/2026 · ~3 min de leitura (a tabela), em inglês
  https://ai.google.dev/gemini-api/docs/api-errors#api-error-codes
  Cada código com o que fazer. O 429 tem dois: o de limite por minuto, que se repete esperando, e o de cota do dia, que só volta quando a cota zera. Chave inválida e pedido torto não se repetem.

- **Google, *API errors* — seção "Generation blocked codes"** — Gemini API Docs, atualizada em set/2026 · ~1 min de leitura (a seção), em inglês
  https://ai.google.dev/gemini-api/docs/api-errors#generation-blocked-codes
  O terceiro jeito de quebrar: o provedor bloqueia a saída por política ou segurança, com um código que diz o motivo, e a página manda mudar a entrada, não repetir igual.

- **Google, *Troubleshooting guide* — seção "Retry strategy"** — Gemini API Docs, atualizada em out/2026 · ~2 min de leitura (a seção), em inglês
  https://ai.google.dev/gemini-api/docs/troubleshooting#retry-strategy
  Os SDKs oficiais já repetem sozinhos, com espera crescente, as falhas passageiras (429 e 5xx), e a lista do que não se repete nunca: 400, sintaxe, e 403, que a página liga à chave (a tabela de erros dá 401 para chave inválida; nenhum dos dois se repete).

A primeira é consulta sua, para responder "de onde ele tira se terminou" sem inventar; procure `status` na página, não passe âncora. No Groq, formato OpenAI, o mesmo papel é do `finish_reason`, que vem `length` quando bate no limite. A seção de retry é a armadilha do marco: quem manda o agente "pôr retry" pode ganhar repetição em cima da repetição que o SDK já faz. A página dá o exemplo do SDK de Python; se o dele é o de JavaScript, ele pede ao agente para conferir o que o SDK já repete antes de escrever o próprio. Chave inválida não é passageira: a tabela dá 401, e repetir é só esperar mais para falhar igual. O 429 da fluência é simulado num teste, porque esperar o real é esperar a cota acabar; e o 429 do dia não se resolve com espera de segundos: o que falha por ele vai para o não entendido com o motivo dito, porque a cota só volta de madrugada no horário de Brasília (3.4). Cada repetição gasta cota, e no pago custaria: é a linha do log da 3.4. O que fazer com o bloqueio, tentar outro modelo ou mandar direto para o Tiago, é decisão dele, não regra da aula.

**marco `determinismo`**

- **Anthropic, *Glossário* — seção "Temperature"** — Claude Platform Docs, em português, sem data · ~1 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/about-claude/glossary#temperature
  Dois parágrafos, e o segundo é a frase que vale para qualquer provedor: mesmo com a temperatura em zero, os resultados não são totalmente determinísticos, e entradas idênticas podem produzir saídas diferentes.

- **Google, *Gemini 3 Developer Guide* — seção "Temperature"** — Gemini API Docs, atualizada em set/2026 · ~1 min de leitura (a seção), em inglês
  https://ai.google.dev/gemini-api/docs/gemini-3#temperature
  O "nem mexa" da aula: nos modelos Gemini 3 a recomendação é deixar a temperatura no padrão, 1.0, porque baixar pode fazer o modelo entrar em loop ou raciocinar pior.

O glossário é da Anthropic, mas a própria página diz que os conceitos não são exclusivos do Claude, e é por isso que ele fica aqui, mesmo com a P3 fora da API dela. A segunda é para quem está no Flash da família 3: se ele baixar a temperatura ao mínimo, como na pergunta do marco, pode piorar a leitura em vez de estabilizá-la, e é melhor saber antes. Mina: a página de estratégias de prompt do Gemini diz que temperatura zero é determinística. Não cite e não discuta; a pergunta do marco já mostra que, mesmo que a saída repita, repetível não é correto. Nenhuma das duas resolve o marco. O que resolve é a conta sair do modelo, e isso não tem página para citar: é a oficina dele com teste passando.

**marco `latencia-percebida`**

- **Jakob Nielsen, *Response Times: The 3 Important Limits*** — Nielsen Norman Group, 1993, revisado em jan/2024 · ~4 min de leitura, em inglês
  https://www.nngroup.com/articles/response-times-3-important-limits/
  Os três limites que ninguém revogou: até 0,1 s parece instantâneo, até 1 s o raciocínio não se interrompe, passando de 10 s a pessoa vai fazer outra coisa e precisa saber quando volta.

- **React, *useOptimistic* — seção "Optimistic delete with error recovery"** — React Docs, sem data · ~3 min de leitura (a seção), em inglês
  https://react.dev/reference/react/useOptimistic#optimistic-delete-with-error-recovery
  O otimismo com rede de segurança: o item sai da lista na hora do clique e, se a gravação falhar, volta com a mensagem de erro. É a resposta certa para a pergunta do marco.

O texto do Nielsen é de 1993 e é por isso que serve: os números vêm da percepção humana, não da tecnologia, e não envelheceram. Use os dois segundos da pergunta do marco contra ele: dois segundos passam do limite de um. A página do React só vale se a oficina dele for Next ou React, que é o caso de quem converteu na 2.2; o exemplo é código com um sandbox ao lado, e o que você cita é o comportamento, não o código. Streaming foi matéria da 3.3: se ele perguntar, referencie e não reabra.

**marco `errar-com-graca`**

- **Google PAIR, *Explainability + Trust* — seção "Determine if you should show confidence"** — People + AI Guidebook, 2019 · ~3 min de leitura (a seção e as duas seguintes), em inglês
  https://pair.withgoogle.com/chapter/explainability-trust/#determine-if-you-should-show-confidence
  Contra a tentação do percentual de confiança: 85,8% contra 87% não muda a decisão de ninguém, e confiança alta enganosa faz aceitar sem olhar. Logo abaixo, a alternativa por categoria, cada uma dizendo o que fazer.

- **Tim Neusesser e Evan Sunwall, *Error-Message Guidelines* — seção "Communication Guidelines"** — Nielsen Norman Group, mai/2023 · ~3 min de leitura (a seção), em inglês
  https://www.nngroup.com/articles/error-message-guidelines/#toc-communication-guidelines-2
  "Ocorreu um erro" não diz nada: a mensagem descreve o problema exato, sem jargão, e oferece o que fazer em seguida. É o estado de erro da tela dele, escrito.

O PAIR já apareceu na 3.2, no capítulo de erros (o caminho depois da falha), que é o "não entendido" com a mensagem original à vista; diga que é a mesma fonte, outro capítulo, e siga. Esta serve para o "assumido aparece como assumido": no lançador, o que o Tiago precisa ver é qual data foi presumida, não um número de confiança. Nenhuma das duas fala do que fazer com a correção do Tiago; isso fica com o material do fechamento.

**no fechamento**

- **Eugene Yan, *Patterns for Building LLM-based Systems & Products* — seções "Defensive UX" e "Collect user feedback"** — eugeneyan.com, jul/2023 · ~10 min de leitura (as duas seções; o texto inteiro tem 66 min), em inglês
  https://eugeneyan.com/writing/llm-patterns/#defensive-ux-to-anticipate--handle-errors-gracefully
  A aula inteira por quem constrói isso em produção: o produto que assume de saída que o modelo vai errar e desenha para isso, e a correção de quem usa como o dado que alimenta o eval.

Único material longo da aula, e vai como link solto, nunca como leitura pedida. A âncora abre em "Defensive UX"; a seção sobre feedback vem logo depois dela. O texto é de 2023: as ferramentas que ele lista na seção de guardrails, acima da âncora, envelheceram, e a seção de evals é matéria da 3.7. Diga que ele lê as duas seções e para.

## Sugeridas

**marco `latencia-percebida`**

- **Samhita Tankala (NN/g), *Skeleton Screens vs. Progress Bars vs. Spinners*** — YouTube, canal oficial NNgroup, set/2024 · 3 min 30 s, em inglês
  https://www.youtube.com/watch?v=4GWqJEfzvmg&hl=en&persist_hl=1
  Os três jeitos de mostrar espera e quando cada um serve: abaixo de 1 s nenhum, até 10 s esqueleto ou spinner, acima disso barra com estimativa.

Curto: pode pausar a aula, colado no marco, depois do Nielsen e antes da pergunta de aplicação. O vídeo é sobre página carregando; a ponte que você faz é que o clique do Tiago tem a mesma régua de tempo. Os últimos vinte segundos são propaganda do canal. Não há vídeo para os outros marcos: saída estruturada muda de forma rápido demais, a do Gemini trocou os nomes de campo ao passar para a API Interactions, e vídeo de terceiro mostra a forma de antes.
