# Referências, aula 3.3

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três cuidados que valem para a aula inteira. A documentação vive em `platform.claude.com`; o endereço antigo (`docs.anthropic.com`) e o suporte antigo (`support.anthropic.com`) ainda redirecionam, mas não escreva nenhum dos dois. As páginas em português têm as âncoras em inglês — use as URLs exatas daqui, porque âncora traduzida não dá erro: a página abre no topo e ninguém percebe. E o nome do modelo aparece na primeira linha de quase todo exemplo e muda sem aviso: diga que `model` é parâmetro, não sintaxe, e mande conferir o nome vigente na oficina, que emenda na 1.6.

**Não há vídeo nesta aula, e a busca foi feita.** O canal oficial não devolve listagem para conferência automática, e eu não cito o que não abri; o curso da Anthropic Academy cobre exatamente estes marcos, mas exige cadastro e manda o aluno para um login no meio da aula; os vídeos de terceiros que achei são de Claude 3, de outra stack ou sem duração verificável. Se a 202 quiser vídeo aqui, o caminho é gravar dois minutos próprios: material de terceiro sobre chamada de API envelhece em semanas.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `a-chamada`**

- **Anthropic, *Comece a usar o Claude* — seção "Chame a API"** — Claude Platform Docs, em português, sem data · ~5 min de leitura
  https://platform.claude.com/docs/pt-BR/get-started#call-the-api
  A chamada mínima em abas por linguagem, com a resposta JSON inteira ao lado: o conteúdo, o motivo da parada e o `usage` com os tokens.

- **Anthropic, *Criar uma mensagem*** — Claude Platform Docs, referência da API, em português, sem data · consulta, não leitura
  https://platform.claude.com/docs/pt-BR/api/messages/create
  A referência do endpoint: confirma que `model`, `messages` e `max_tokens` são obrigatórios e que `system` e `stream` são campos de topo, não itens da lista de mensagens.

A primeira é o que o aluno leva para a oficina; a segunda é consulta sua, para responder "de onde vem esse campo" sem inventar. Não mande ler a referência: ela lista dezessete parâmetros de primeiro nível, e quem nunca chamou uma API se afoga ali.

**marco `chave-no-servidor`**

- **Anthropic, *anthropic-sdk-typescript* — seção "Requirements"** — GitHub, README oficial, em inglês · ~2 min de leitura
  https://github.com/anthropics/anthropic-sdk-typescript
  O próprio SDK se recusa a rodar no navegador e diz por quê: usar no browser expõe a credencial, e destravar isso exige ligar uma opção com "dangerously" no nome.

- **Anthropic, *Obtenha sua chave de API do Claude* — seção "Use sua chave de API"** — Claude Platform Docs, em português, sem data · ~3 min de leitura
  https://platform.claude.com/docs/pt-BR/get-api-key#use-your-api-key
  Onde a chave nasce, que ela aparece uma única vez, e que o SDK a lê sozinho da variável de ambiente: o aluno não escreve a chave no código em lugar nenhum.

- **Vercel, *How to use environment variables in Next.js* — seção "Bundling Environment Variables for the Browser"** — Next.js Docs, atualizado em ago/2026 · ~8 min de leitura
  https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
  O mecanismo exato pelo qual a chave vazaria na oficina dele: o prefixo `NEXT_PUBLIC_` embute o valor no pacote que vai para o navegador, e sem o prefixo a variável só existe no servidor.

O README do SDK é o melhor argumento do marco, porque a regra não é conselho da aula: é erro que o código dá. A página do Next.js registra um detalhe que vira bug silencioso: variável pública é congelada no build, então trocar o valor no painel depois não muda nada até o próximo deploy. Onde a chave fica no deploy foi a 2.6; não reabra.

**marco `prompt-por-chamada`**

- **Anthropic, *Usando a Messages API* — seção "Múltiplos turnos de conversa"** — Claude Platform Docs, em português, sem data · ~3 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/working-with-messages#multiple-conversational-turns
  A frase na documentação oficial: a API é sem estado, e o histórico inteiro vai junto a cada chamada. O exemplo ainda mostra que turnos do assistente podem ser escritos por você.

- **Anthropic, *Janelas de contexto* — seção "Como a janela de contexto funciona"** — Claude Platform Docs, em português, sem data · ~4 min de leitura (só a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/context-windows#how-the-context-window-works
  O que entra na conta de cada chamada: o system, toda mensagem da lista, as ferramentas definidas e a saída.

Cite só a primeira seção da segunda página: depois dela vem thinking, compaction e assinatura de bloco de pensamento, que não são desta aula e parecem pré-requisito quando aparecem na tela.

**marco `streaming`**

- **Anthropic, *Streaming de mensagens* — seção "Streaming com SDKs"** — Claude Platform Docs, em português, sem data · ~4 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/streaming#streaming-com-sdks
  Quatro linhas que trocam a chamada que devolve tudo no fim pela que devolve em pedaços: é o diff mínimo entre as duas.

- **Anthropic, *Streaming de mensagens* — seção "Requisição básica de streaming"** — Claude Platform Docs, em português, sem data · ~3 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/streaming#basic-streaming-request
  O fluxo cru de eventos, do começo ao fim, com os pedaços de texto chegando um a um — e os tokens aparecendo na abertura e no fechamento, não no meio.

- **MDN, *Using server-sent events*** — MDN Web Docs, atualizado em set/2026 · ~12 min de leitura, só em inglês
  https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
  O padrão por baixo do streaming, que é o mesmo que a própria documentação da Anthropic aponta na primeira linha.

A segunda âncora só existe em inglês na página traduzida, e é a que está aqui: não traduza nenhuma das duas. A do MDN é longa e sem versão em português: cite, não ofereça.

**no fechamento**

- **Rajasekaran, Dixon, Ryan e Hadfield, *Effective context engineering for AI agents* — seção "The anatomy of effective context"** — Anthropic Engineering, set/2025 · ~13 min de leitura, em inglês
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  A tese é o marco `prompt-por-chamada` dito pelo time que escreve isso em produção: achar o menor conjunto de tokens de alto sinal que produz o resultado desejado.

Único material longo da aula e o único em inglês que vale o tamanho. Vai no fechamento, como link solto para quem quiser; é orientado a agentes, então nunca como leitura pedida.

## Sugeridas

**marco `a-chamada`**

- **Anthropic, *Usando a Messages API* — seções "Requisição e resposta básicas" e "Múltiplos turnos de conversa"** — Claude Platform Docs, em português, sem data · ~6 min de leitura (as duas seções)
  https://platform.claude.com/docs/pt-BR/build-with-claude/working-with-messages
  A requisição básica e o JSON de resposta à vista, e logo depois a lista de mensagens crescendo turno a turno: as duas metades da aula na mesma página, em português.

Uma só sugerida, e ela serve dois marcos: ofereça no painel quando o `a-chamada` abrir, e volte a ela no `prompt-por-chamada` em vez de oferecer outra coisa. Antecipe duas minas antes de abrir: a página avisa que alguns parâmetros de amostragem dão erro nos modelos novos e que uma técnica de prefill não é mais suportada. São dois parágrafos sobre coisa que não existe mais; diga que ele lê as duas primeiras seções e para.
