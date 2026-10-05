# Referências, aula 3.8

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três cuidados que valem para a aula inteira. A documentação vive em `platform.claude.com`, e as páginas em português têm as âncoras em inglês: use as URLs exatas daqui, porque âncora traduzida não dá erro, a página abre no topo e ninguém percebe. O endereço antigo das dicas de contexto longo (`.../prompt-engineering/long-context-tips`) ainda redireciona, mas para dentro de uma página de nove mil palavras; não escreva ele. Segundo: o texto da Anthropic sobre recuperação aparece duas vezes nesta aula, e ele existe para vender uma técnica mais pesada (embeddings contextualizados, reranking) que a P3 não precisa. Cite só as duas seções indicadas e não deixe o resto do artigo virar sugestão de arquitetura. Terceiro: quase todo material sobre RAG explica RAG pelo vetor, inclusive o da Anthropic. A aula diz o contrário, que RAG é "busca e põe no prompt" e vetor é um dos jeitos. Quando citar, diga isso antes que a página diga outra coisa.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `recuperar`**

- **Daniel Ford (Anthropic), *Introducing Contextual Retrieval* — seção "A primer on RAG: scaling to larger knowledge bases"** — Anthropic Engineering, set/2024 · ~3 min de leitura (a seção), em inglês
  https://www.anthropic.com/engineering/contextual-retrieval#a-primer-on-rag-scaling-to-larger-knowledge-bases
  O RAG de vetor em três passos e, logo depois, o caso em que o vetor erra: um código exato, "TS-999", que só a busca por texto acha. É o "marcão" da P3 com outro nome.

- **Anthropic, *Embeddings* — seção "Como obter embeddings com a Anthropic"** — Claude Platform Docs, em português, sem data · ~1 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/embeddings#how-to-get-embeddings-with-anthropic
  A Anthropic não tem modelo de embedding próprio: buscar por vetor é outro fornecedor, outra chave e outra conta. É o custo concreto de escolher o jeito caro quando a chave resolve.

Os dois entram depois que ele respondeu a pergunta do marco: o TS-999 e o custo do vetor entregam parte da resposta. A seção do artigo apresenta o vetor primeiro e a busca por texto como remendo; inverta a ordem ao falar, porque na P3 a chave do cliente vem antes das duas. Use a página de embeddings só pela frase do topo da seção: o resto é Python de outro fornecedor e tabela de modelos, e não serve à oficina dele.

**marco `quando-cabe-tudo`**

- **Daniel Ford (Anthropic), *Introducing Contextual Retrieval* — seção "A note on simply using a longer prompt"** — Anthropic Engineering, set/2024 · ~1 min de leitura (a seção), em inglês
  https://www.anthropic.com/engineering/contextual-retrieval#a-note-on-simply-using-a-longer-prompt
  A frase que a aula usa: abaixo de duzentos mil tokens, umas quinhentas páginas, ponha o acervo inteiro no prompt, sem RAG. Três parágrafos, e o primeiro começa dizendo que às vezes a solução mais simples é a melhor.

- **Rajasekaran, Dixon, Ryan e Hadfield, *Effective context engineering for AI agents* — seção "Why context engineering is important to building capable agents"** — Anthropic Engineering, set/2025 · ~2 min de leitura (a seção), em inglês
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents#why-context-engineering-is-important-to-building-capable-agents
  O *context rot* dito pela Anthropic: quanto mais tokens na janela, pior o modelo recupera o que está nela, e contexto vira recurso finito com retorno decrescente. É o "caber não é valer".

Os dois em sequência, nessa ordem: o primeiro autoriza pôr tudo, o segundo diz por que isso tem limite antes do limite da janela. Duas datas para dizer ao citar. Os duzentos mil tokens são de 2024, quando a janela era desse tamanho; hoje ela é maior, e o número vale como régua de simplicidade, não como teto técnico. E o mesmo parágrafo traz números de cache (mais de 2x na latência, até 90% no custo) que são da época: os vigentes foram da 3.4, não reabra. E o segundo não é texto novo: ele cruza com ele desde a 1.5. A fonte que cunhou *context rot*, o relatório da Chroma, já foi citada na 1.7 e a seção da Anthropic linka para ela; não repita.

**marco `memoria-por-usuario`**

- **Simon Willison, *I really don’t like ChatGPT’s new memory dossier* — seção "We’re losing control of the context"** — simonwillison.net, mai/2025 · ~2 min de leitura (a seção), ~10 min o texto, em inglês
  https://simonwillison.net/2025/May/21/chatgpt-new-memory/#we-re-losing-control-of-the-context
  Um usuário avançado descobrindo que a memória que o produto escreveu sozinho mudou respostas sem ele saber, e pedindo memória por projeto. "Quem escreve" e "onde", vistos do lado de quem usa.

- **Harrison Chase, *Memory for agents*** — LangChain Blog, out/2024 · ~6 min de leitura, em inglês
  https://www.langchain.com/blog/memory-for-agents
  Memória é específica de cada aplicação: o que guardar depende do produto. E dá o vocabulário: a memória "episódica", exemplos de casos que deram certo postos no prompt, é o que o histórico aprovado da P3 é.

Os dois só depois que ele respondeu a pergunta do marco, nunca antes: ambos entregam a resposta. O Chase serve também de contraexemplo. A memória "semântica" dele é fato extraído pelo modelo e guardado, exatamente o desenho que a pergunta põe em xeque; mostre isso como decisão que se toma, não como errado em si. O Willison relata o ChatGPT de maio de 2025, e o recurso mudou desde então: cite como o relato de um usuário naquele momento, não como descrição do produto de hoje. O endereço antigo do blog da LangChain (`blog.langchain.com`) redireciona para este; use este, e note que o texto não tem âncora de seção, por isso vai inteiro.

**marco `contexto-em-producao`**

- **Anthropic, *Cache de prompt* — seção "Práticas recomendadas para um cache eficaz"** — Claude Platform Docs, em português, sem data · ~2 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/prompt-caching#best-practices-for-effective-caching
  Volta da 3.4, não matéria nova: prefixo estático, sufixo variável, e o sufixo nomeado com todas as letras, "contexto por solicitação" e "a mensagem recebida". É a ordem da aula escrita pela documentação.

- **Anthropic, *Melhores práticas de prompting* — seção "Prompting de contexto longo"** — Claude Platform Docs, em português, sem data · ~3 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/prompt-engineering/claude-prompting-best-practices#long-context-prompting
  Dados longos acima, pergunta no fim, e cada documento na sua tag com a fonte ao lado. É a ordem da montagem e a tag por documento, ditas pela documentação.

Antecipe uma aparente contradição: o cache manda o fixo primeiro, e a página de contexto longo manda o dado longo antes das instruções. Não brigam. As regras e o plano de contas são o `system`, que vem antes de tudo e é o que o cache aproveita; dentro da mensagem, o histórico do cliente vem antes da mensagem nova. A página de melhores práticas é enorme e abre com orientação por modelo: mande direto à seção. A seção de contexto longo fala de entrada acima de uns vinte mil tokens, com vários documentos, e o ganho de até 30% que ela cita vale para isso; a chamada da P3 fica bem abaixo. Use a ordem e a tag, não prometa o número. Delimitar é higiene, a trava é o desenho da 3.6: encapsular como dado ele já aprendeu lá, não ensine de novo. E os exemplos de tag da página são em inglês e de outro domínio; não traduza um deles para a P3 na conversa, que é ditar prompt. O nome das tags e o que vai dentro é escolha dele.

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
