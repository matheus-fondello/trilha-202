# Referências, aula 3.5

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três cuidados que valem para a aula inteira. A documentação vive em `platform.claude.com`; não escreva `docs.anthropic.com`, que só redireciona. As páginas em português têm as âncoras em inglês: use as URLs exatas daqui, porque âncora traduzida não dá erro, a página abre no topo e ninguém percebe. E saída estruturada é recurso que mudou de forma em pouco tempo: o anúncio de lançamento e quase todo tutorial de terceiros ainda mostram cabeçalho beta e o parâmetro `output_format`, e a própria página oficial diz que os dois saíram (hoje é `output_config.format`, sem beta). Se o agente da oficina escrever a versão velha, é por isso; mande conferir na página, não discuta de memória.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `schema`**

- **Anthropic, *Saídas estruturadas* — seção "Por que usar saídas estruturadas"** — Claude Platform Docs, em português, sem data · ~1 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/structured-outputs#why-use-structured-outputs
  A lista do que dá errado quando a forma é só pedida no prompt — JSON que não abre, campo faltando, tipo trocado — e o que muda quando a API força a forma.

- **Anthropic, *Saídas estruturadas* — seção "Limitações do JSON Schema"** — Claude Platform Docs, em português, sem data · ~3 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/structured-outputs#json-schema-limitations
  Restrição numérica (`minimum`, `maximum`) e de tamanho de texto não entram no schema forçado: o "valor maior que zero" da regra do negócio não tem como ser garantido pela API, só pela validação dele.

A primeira é a abertura do marco, e ela vende a decodificação restrita como "sempre válida": é verdade para a sintaxe, e a segunda e a seção "Saídas inválidas" (no `quando-quebra`) mostram onde termina. É essa costura que a pergunta de previsão quer: o que a API garante, o que só a validação dele garante. Se o agente da oficina propuser o Zod, é porque o SDK de TypeScript o integra (a página da Anthropic cita); a escolha é da oficina, e o que importa é o resultado: a recusa com o motivo campo a campo, que é o que a fluência pede para ele colar. Não cite a documentação do Zod, que é código. E não deixe o agente da oficina montar o truque antigo de forçar uma ferramenta (`tool_choice` com `any` ou `tool`) para arrancar JSON: nos modelos vigentes (confira na página de erros) isso devolve 400, e a página de erros do marco seguinte, na seção "Uso forçado de ferramentas não suportado", manda usar saída estruturada quando a própria resposta precisa de formato fixo. Ferramenta com schema estrito garante a forma só quando o modelo decide chamá-la.

**marco `quando-quebra`**

- **Anthropic, *Saídas estruturadas* — seção "Saídas inválidas"** — Claude Platform Docs, em português, sem data · ~2 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/structured-outputs#invalid-outputs
  A própria documentação admite os buracos da forma forçada: a recusa vem com status 200 e pode não bater com o schema, a resposta cortada no `max_tokens` vem incompleta, e valor de `enum` pode voltar com maiúscula trocada sem erro nenhum.

- **Anthropic, *Motivos de parada e fallback* — seção "Referência rápida"** — Claude Platform Docs, em português, sem data · ~2 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/handling-stop-reasons#quick-reference
  Uma tabela: cada valor de `stop_reason`, quando acontece e o que fazer. É o mapa do "por que parou" que vem em toda resposta.

- **Anthropic, *Motivos de parada e fallback* — seção "Motivos de parada vs. erros"** — Claude Platform Docs, em português, sem data · ~2 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/handling-stop-reasons#stop-reasons-vs-errors
  A separação que o marco precisa: motivo de parada vem numa resposta que deu certo, erro vem como status 4xx ou 5xx. São dois caminhos no código dele, e cada um tem destino diferente.

- **Anthropic, *Erros da Claude API* — seção "Erros HTTP"** — Claude Platform Docs, em português, sem data · ~3 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/api/errors#http-errors
  Cada código com o que significa, e no fim o parágrafo que importa: os SDKs oficiais já repetem sozinhos, duas vezes, as falhas passageiras (conexão, limite de taxa, 5xx).

O parágrafo final da página de erros é a armadilha do marco: o aluno que manda o agente "pôr retry" pode ganhar repetição em cima da repetição que o SDK já faz, e a chave inválida da fluência (401) não é passageira, então repetir é só esperar mais para falhar igual. Use isso para a pergunta de o que se repete e o que vai direto para o fallback. A seção sobre recusa da página de motivos de parada sugere tentar de novo em outro modelo; para a P3 isso é decisão dele, não regra da aula. A seção sobre `pause_turn` é de ferramenta de servidor, não desta aula: pode pular.

**marco `determinismo`**

- **Anthropic, *Glossário* — seção "Temperature"** — Claude Platform Docs, em português, sem data · ~1 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/about-claude/glossary#temperature
  Dois parágrafos, e o segundo é a frase oficial: mesmo com a temperatura em zero, os resultados não são totalmente determinísticos, e entradas idênticas podem produzir saídas diferentes.

O "alguns modelos nem deixam mexer" da aula está na referência da API que a 3.3 listou: procure `temperature` na página, não passe âncora. Lá está o aviso de que o campo está obsoleto e que, nos modelos mais novos (confira no campo `temperature`), outro valor além de 1.0 devolve erro 400; se o aluno tentar baixar a temperatura no modelo vigente, a chamada falha, e é melhor ele saber antes que pelo erro. Nem o glossário nem a referência resolvem o marco: elas tiram do caminho a ideia de que repetível é correto. O que resolve é a conta sair do modelo, e isso não tem página para citar; é a oficina dele com teste passando.

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

Curto: pode pausar a aula, colado no marco, depois do Nielsen e antes da pergunta de aplicação. O vídeo é sobre página carregando; a ponte que você faz é que o clique do Tiago tem a mesma régua de tempo. Os últimos vinte segundos são propaganda do canal. Não há vídeo para os outros marcos, e a busca foi feita: a Anthropic não tem vídeo oficial de saída estruturada, e os de terceiros usam a sintaxe beta que já saiu.
