# Referências, aula 3.8

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três cuidados que valem para a aula inteira. A P3 roda em API gratuita: o caminho recomendado é o Gemini, com chave do Google AI Studio, e o Groq é a alternativa. A documentação de API citada aqui é a do Gemini, em `ai.google.dev`, em inglês; use as URLs exatas daqui. Modelo no gratuito, limite por minuto e por dia, mínimo de cache e preço do plano pago mudam de um mês para o outro: o número que vale é o da página oficial no dia, e o limite do gratuito é o que o aluno lê no AI Studio dele, nunca um que você lembra. Os textos da Anthropic que ficaram são conceito, não documentação do provedor dele, e valem para qualquer modelo. Segundo: o texto da Anthropic sobre recuperação aparece duas vezes nesta aula, e ele existe para vender uma técnica mais pesada (embeddings contextualizados, reranking) que a P3 não precisa. Cite só as duas seções indicadas e não deixe o resto do artigo virar sugestão de arquitetura. Terceiro: quase todo material sobre RAG explica RAG pelo vetor, inclusive o da Anthropic. A aula diz o contrário, que RAG é "busca e põe no prompt" e vetor é um dos jeitos. Quando citar, diga isso antes que a página diga outra coisa.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `recuperar`**

- **Daniel Ford (Anthropic), *Introducing Contextual Retrieval* — seção "A primer on RAG: scaling to larger knowledge bases"** — Anthropic Engineering, set/2024 · ~3 min de leitura (a seção), em inglês
  https://www.anthropic.com/engineering/contextual-retrieval#a-primer-on-rag-scaling-to-larger-knowledge-bases
  O RAG de vetor em três passos e, logo depois, o caso em que o vetor erra: um código exato, "TS-999", que só a busca por texto acha. É o "marcão" da P3 com outro nome.

- **Google, *Embeddings* — seção "Storing embeddings"** — Gemini API Docs, atualizada em set/2026 · ~1 min de leitura (a seção), em inglês
  https://ai.google.dev/gemini-api/docs/embeddings#store-embeddings
  Em produção, vetor pede um banco de vetores para guardar, indexar e buscar, e a seção lista os serviços que fazem isso. É o custo concreto do jeito caro: mais uma peça para manter, quando a chave resolve.

Os dois entram depois que ele respondeu a pergunta do marco: o TS-999 e o custo do vetor entregam parte da resposta. A seção do artigo apresenta o vetor primeiro e a busca por texto como remendo; inverta a ordem ao falar, porque na P3 a chave do cliente vem antes das duas. O topo da página de embeddings diz que vetor dá resultado mais preciso que busca por palavra-chave; no "marcão" do Nilton é o contrário, e você diz isso antes. Não diga que vetor é caro em dinheiro: em 05/10/2026 o modelo de embedding do Gemini era de graça no plano gratuito (confira na página de preço antes de repetir). O custo é outro: mais uma chamada por mensagem, que conta no limite por minuto, o banco de vetores, e reindexar o acervo quando ele cresce; a seção "Migration from gemini-embedding-001", na mesma página, conta que trocar de modelo de embedding obriga a refazer todos os vetores, porque os espaços não se comparam. O resto da página é código em várias linguagens e tabela de modelos, e não serve à oficina dele.

**marco `quando-cabe-tudo`**

- **Daniel Ford (Anthropic), *Introducing Contextual Retrieval* — seção "A note on simply using a longer prompt"** — Anthropic Engineering, set/2024 · ~1 min de leitura (a seção), em inglês
  https://www.anthropic.com/engineering/contextual-retrieval#a-note-on-simply-using-a-longer-prompt
  A frase que a aula usa: abaixo de duzentos mil tokens, umas quinhentas páginas, ponha o acervo inteiro no prompt, sem RAG. Três parágrafos, e o primeiro começa dizendo que às vezes a solução mais simples é a melhor.

- **Rajasekaran, Dixon, Ryan e Hadfield, *Effective context engineering for AI agents* — seção "Why context engineering is important to building capable agents"** — Anthropic Engineering, set/2025 · ~2 min de leitura (a seção), em inglês
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents#why-context-engineering-is-important-to-building-capable-agents
  O *context rot* dito pela Anthropic: quanto mais tokens na janela, pior o modelo recupera o que está nela, e contexto vira recurso finito com retorno decrescente. É o "caber não é valer".

Os dois em sequência, nessa ordem: o primeiro autoriza pôr tudo, o segundo diz por que isso tem limite antes do limite da janela. Duas datas para dizer ao citar. Os duzentos mil tokens são de 2024 e de um modelo da Anthropic, quando a janela era desse tamanho; hoje ela é maior, e o número vale como régua de simplicidade, não como teto técnico. No gratuito há uma régua mais curta que a janela: o limite de tokens por minuto, que o histórico inteiro consome a cada mensagem. E o mesmo parágrafo traz números de cache (mais de 2x na latência, até 90% no custo) que são da Anthropic e da época: os do provedor dele foram da 3.4, não reabra. E o segundo não é texto novo: ele cruza com ele desde a 1.5. A fonte que cunhou *context rot*, o relatório da Chroma, já foi citada na 1.7 e a seção da Anthropic linka para ela; não repita.

**marco `memoria-por-usuario`**

- **Simon Willison, *I really don’t like ChatGPT’s new memory dossier* — seção "We’re losing control of the context"** — simonwillison.net, mai/2025 · ~2 min de leitura (a seção), ~10 min o texto, em inglês
  https://simonwillison.net/2025/May/21/chatgpt-new-memory/#we-re-losing-control-of-the-context
  Um usuário avançado descobrindo que a memória que o produto escreveu sozinho mudou respostas sem ele saber, e pedindo memória por projeto. "Quem escreve" e "onde", vistos do lado de quem usa.

- **Harrison Chase, *Memory for agents*** — LangChain Blog, out/2024 · ~6 min de leitura, em inglês
  https://www.langchain.com/blog/memory-for-agents
  Memória é específica de cada aplicação: o que guardar depende do produto. E dá o vocabulário: a memória "episódica", exemplos de casos que deram certo postos no prompt, é o que o histórico aprovado da P3 é.

Os dois só depois que ele respondeu a pergunta do marco, nunca antes: ambos entregam a resposta. O Chase serve também de contraexemplo. A memória "semântica" dele é fato extraído pelo modelo e guardado, exatamente o desenho que a pergunta põe em xeque; mostre isso como decisão que se toma, não como errado em si. O Willison relata o ChatGPT de maio de 2025, e o recurso mudou desde então: cite como o relato de um usuário naquele momento, não como descrição do produto de hoje. O endereço antigo do blog da LangChain (`blog.langchain.com`) redireciona para este; use este, e note que o texto não tem âncora de seção, por isso vai inteiro.

**marco `contexto-em-producao`**

- **Google, *Context caching* — seção "Implicit caching"** — Gemini API Docs, atualizada em set/2026 · ~1 min de leitura (a seção), em inglês
  https://ai.google.dev/gemini-api/docs/caching#implicit-caching
  Volta da 3.4, não matéria nova: o cache vem ligado sem fazer nada, e as duas dicas da página são pôr o conteúdo grande e comum no começo do prompt e mandar pedidos de prefixo parecido em pouco tempo. É a ordem da aula escrita pela documentação, e o `usage` diz quantos tokens vieram do cache.

- **Google, *Long context* — FAQ "Where is the best place to put my query in the context window?"** — Gemini API Docs, atualizada em jun/2026 · ~1 min de leitura (esta pergunta e a seguinte), em inglês
  https://ai.google.dev/gemini-api/docs/long-context#where_is_the_best_place_to_put_my_query_in_the_context_window
  Pergunta no fim, depois de todo o contexto. E a pergunta logo abaixo, mesmo defendendo o contexto longo, abre dizendo que o token desnecessário é melhor evitar: o "caber não é valer" na voz do provedor.

Antecipe uma aparente contradição: o cache manda o fixo primeiro, e a página de contexto longo manda a pergunta por último, depois do dado. Não brigam. As regras e o plano de contas são o system, que vem antes de tudo e é o prefixo que o cache aproveita; dentro do pedido, o histórico do cliente vem antes da mensagem nova. O mínimo de tokens para o cache pegar muda por modelo e está numa tabela na página do cache: com a parte fixa da P3 abaixo dele, não há cache e não há erro, e só o `usage` mostra; não prometa acerto de cache. No gratuito o cache não muda o que ele paga, que é nada; muda o que custaria no pago, que é a conta do README. A seção "Long context limitations", na mesma página, diz que procurar várias informações num contexto longo não tem a precisão de procurar uma só: é o *context rot* do marco anterior, se ele voltar a ele. Delimitar é higiene, a trava é o desenho da 3.6: encapsular como dado ele já aprendeu lá, não ensine de novo. Como separar o histórico da mensagem, com que tag e o que vai dentro é escolha dele; não dite um formato.

**no fechamento**

- **Rajasekaran, Dixon, Ryan e Hadfield, *Effective context engineering for AI agents* — seção "Context retrieval and agentic search"** — Anthropic Engineering, set/2025 · ~5 min de leitura (a seção), em inglês
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents#context-retrieval-and-agentic-search
  Buscar antes da chamada contra deixar o agente buscar na hora, com ferramenta, guardando só referências leves, e o meio-termo híbrido. É a ponte para a 3.9.

É a referência da ementa, e entra aqui pela seção que emenda no gancho da próxima aula. Link solto junto do gancho, para quem quiser; não abra o debate de agente nesta aula. É texto que ele já cruzou várias vezes, desde a 1.5; aqui volta pela seção de recuperação. Não o apresente como novo.

## Sugeridas

Não há vídeo curto colado a um marco, e a busca foi feita. O vídeo curto oficial mais conhecido sobre o assunto, *What is Retrieval-Augmented Generation (RAG)?*, da IBM, tem 6 min 35 s, é de 2023 e fala de RAG para trazer dado atualizado e fonte, não da escolha entre chave, texto e vetor, que é o que esta aula decide.

**no fechamento**

- **IBM Technology, *Is RAG Still Needed? Choosing the Best Approach for LLMs*** — YouTube, canal oficial, mar/2026 · 11 min 9 s, em inglês, com legenda em inglês
  https://www.youtube.com/watch?v=UabBYexBD4k&hl=en&persist_hl=1
  RAG e contexto longo lado a lado, com capítulos sobre onde cada um ganha e onde falha, da "loteria da recuperação" ao problema do ruído, até a escolha por caso.

Onze minutos não pausam aula: ofereça no painel no fechamento, como a sugerida da aula. Duas coisas para dizer antes de abrir. O caso dele é acervo sem chave, por isso ele só compara vetor com contexto longo; o aluno acabou de ver que a P3 tem chave e que ela ganha das duas. E o meio do vídeo defende o contexto longo com força, e o fim pondera; quem parar no meio sai achando que é para pôr tudo sempre, o que a aula acabou de desmentir. A descrição abre com propaganda de certificação: não é material da aula.
