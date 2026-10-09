# Referências, aula 3.3

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Quatro cuidados que valem para a aula inteira. A documentação do Gemini vive em `ai.google.dev`, e a versão em português sai com `?hl=pt-br`; as âncoras continuam em inglês, então use as URLs exatas daqui, porque âncora traduzida não dá erro: a página abre no topo e ninguém percebe. A documentação de hoje ensina a API Interactions (`ai.interactions.create`, texto em `output_text`, system em `system_instruction`); tutorial e vídeo de antes de meados de 2026 usam `generateContent`, com outros nomes de campo, e os exemplos de contagem de tokens pedem o SDK `@google/genai` acima da versão 2.0.0. O nome do modelo aparece na primeira linha de todo exemplo e muda sem aviso: `model` é parâmetro, não sintaxe, e o que vale é a coluna "Nível sem custo financeiro" da página de preços no dia da aula. E limite e preço do gratuito mudam de mês para mês: você não cita número, ele confere na página oficial e no AI Studio dele.

**Não há vídeo nesta aula.** O formato da API do Gemini mudou em 2026, e vídeo de terceiro sobre chamada de API envelhece em semanas: o que ensina `generateContent` põe o aluno a copiar campo que a documentação de hoje já não mostra. Se a 202 quiser vídeo aqui, o caminho é gravar dois minutos próprios.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `a-chamada`**

- **Google, *Geração de texto* — seção "Instruções do sistema e outras configurações"** — Gemini API Docs, em português, atualizada em set/2026 · ~4 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/text-generation?hl=pt-br#system-instructions
  O system como campo próprio da chamada, separado da entrada, e os ajustes de geração num bloco à parte, o `generation_config`.

- **Google, *Interactions API* — referência** — Gemini API Docs, em inglês, sem data · consulta, não leitura
  https://ai.google.dev/api/interactions-api
  A referência do endpoint: `model`, `input`, `system_instruction`, `generation_config.max_output_tokens`, `stream`, `store`, os eventos do streaming e o `usage` com `total_input_tokens` e `total_output_tokens`.

A primeira é o que o aluno leva para a oficina; a segunda é consulta sua, para responder "de onde vem esse campo" sem inventar. Não mande ler a referência: quem nunca chamou uma API se afoga ali. O exemplo da primeira mostra temperatura e nível de raciocínio no `generation_config`; o limite de saída (`max_output_tokens`) mora no mesmo bloco, mas só aparece na referência.

**marco `chave-no-servidor`**

- **Google, *Como usar chaves da API Gemini* — seção "Regras de segurança críticas"** — Gemini API Docs, em português, atualizada em set/2026 · ~3 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/api-key?hl=pt-br#critical-security-rules
  A regra dita pelo próprio provedor: chave fora do Git, e chave em app web ou móvel pode ser extraída pelo usuário; para app do lado do cliente, um servidor no meio faz a chamada.

- **Google, *Google Gen AI SDK for TypeScript and JavaScript* — aviso "API Key Security"** — GitHub, README oficial, em inglês · ~2 min de leitura
  https://github.com/googleapis/js-genai
  O SDK roda no navegador e não impede ninguém: só avisa para não expor a chave no código do cliente. A trava é o desenho dele, não a biblioteca.

- **Vercel, *How to use environment variables in Next.js* — seção "Bundling Environment Variables for the Browser"** — Next.js Docs, atualizado em ago/2026 · ~8 min de leitura
  https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
  O mecanismo exato pelo qual a chave vazaria na oficina dele: o prefixo `NEXT_PUBLIC_` embute o valor no pacote que vai para o navegador, e sem o prefixo a variável só existe no servidor.

O README do SDK é o melhor argumento do marco: a biblioteca deixa, e quem decide é ele. A página do Next.js registra um detalhe que vira bug silencioso: variável pública é congelada no build, então trocar o valor no painel depois não muda nada até o próximo deploy. Onde a chave fica no deploy foi a 2.6; não reabra. A mesma página do Google tem a seção "Opção 1: usar variáveis de ambiente (recomendado)", que confirma que o SDK lê `GEMINI_API_KEY` sozinho; se as duas variáveis existirem, vale a `GOOGLE_API_KEY`, que é a causa de "troquei a chave e nada mudou".

**marco `prompt-por-chamada`**

- **Google, *Geração de texto* — seção "Conversas sem estado"** — Gemini API Docs, em português, atualizada em set/2026 · ~2 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/text-generation?hl=pt-br#stateless-conversations
  O histórico montado e enviado por quem chama, a cada vez: é o caso da P3, em que cada mensagem é chamada nova e a montagem é dele.

- **Google, *Entender e contar tokens* — seção "Contar tokens multiturno"** — Gemini API Docs, em português, atualizada em set/2026 · ~3 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/tokens?hl=pt-br#multi-turn-tokens
  A prova de que o modelo relê tudo: mesmo quando o servidor guarda a conversa, o uso da segunda rodada inclui os tokens das duas.

A segunda desarma quem saiu do quickstart achando que "com estado" é memória do modelo: é o provedor reenviando por ele, e contando.

**marco `streaming`**

- **Google, *Geração de texto* — seção "Respostas de streaming"** — Gemini API Docs, em português, atualizada em set/2026 · ~3 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/text-generation?hl=pt-br#streaming-responses
  A mesma chamada com `stream: true`, e o laço que recebe os pedaços de texto um a um: é o diff mínimo entre as duas.

- **MDN, *Using server-sent events*** — MDN Web Docs, atualizado em set/2026 · ~12 min de leitura, só em inglês
  https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
  O padrão por baixo do streaming, que é o mesmo que o quickstart do Gemini nomeia.

Na referência da Interactions API, o `usage` completo vem no evento `interaction.completed`, o último: é o que sustenta "a conta que vale chega no fim". A do MDN é longa e sem versão em português: cite, não ofereça.

**marco `primeira-chamada`**

- **Google, *Preços da API Gemini Developer*** — Gemini API Docs, em português, atualizada em out/2026 · consulta, não leitura
  https://ai.google.dev/gemini-api/docs/pricing?hl=pt-br
  Para quem escolher o Gemini: a coluna "Nível sem custo financeiro" diz quais modelos estão no gratuito hoje; é dali que ele escolhe o modelo, e é a mesma página que a 3.4 usa para o custo.

- **Groq, *Quickstart*** — GroqDocs, em inglês, sem data · ~4 min de leitura
  https://console.groq.com/docs/quickstart
  Para quem escolher o Groq: onde nasce a chave, a variável `GROQ_API_KEY`, e a chamada no formato de lista de mensagens com papéis.

- **Groq, *Rate Limits*** — GroqDocs, em inglês, sem data · consulta, não leitura
  https://console.groq.com/docs/rate-limits
  A tabela do plano Free, que é a lista dos modelos que ele pode usar de graça.

- **Anthropic, *Get started with Claude*** — Claude Platform Docs, em inglês, sem data · ~4 min de leitura (a aba TypeScript)
  https://platform.claude.com/docs/en/get-started
  Para quem escolher o Claude: a conta no Console, a chave, a variável `ANTHROPIC_API_KEY` que o SDK lê sozinho, e a primeira chamada com os tokens de entrada e de saída na resposta.

- **Anthropic, *How do I pay for my Claude API usage?*** — Claude Help Center, em inglês, sem data · ~2 min de leitura
  https://support.claude.com/en/articles/8977456-how-do-i-pay-for-my-api-usage
  A API é paga com créditos comprados antes, e a recarga automática liga e desliga na página de cobrança.

- **Anthropic, *Why is Claude API usage billed separately from my paid Claude plan?*** — Claude Help Center, em inglês, sem data · ~1 min de leitura
  https://support.claude.com/en/articles/9876003-i-have-a-paid-claude-plan-pro-max-team-or-enterprise-plans-why-do-i-have-to-pay-separately-to-use-the-claude-api-and-console
  Por que a assinatura desta sala não paga a API: o plano cobre o Claude no aplicativo, e a API é cobrada à parte; o Max e o Team trazem um crédito mensal de API.

Os quatro provedores são opções do mesmo tamanho: apresente-os juntos e deixe a escolha com ele, com o que cada um custa em dinheiro e em limite. No Groq, o exemplo do quickstart usa um modelo que hoje não está na tabela do Free: o modelo sai da tabela de limites, não do exemplo. Quem escolher o Claude pago compra pouco crédito, deixa a recarga automática desligada e põe um limite de gasto no Console; a página de limites está nas referências da 3.4. As páginas de preço são consulta para a escolha do modelo; a conta do custo é a 3.4.

**no fechamento**

- **Rajasekaran, Dixon, Ryan e Hadfield, *Effective context engineering for AI agents* — seção "The anatomy of effective context"** — Anthropic Engineering, set/2025 · ~13 min de leitura, em inglês
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  A tese é o marco `prompt-por-chamada` dito por quem constrói isso em produção: achar o menor conjunto de tokens de alto sinal que produz o resultado desejado. Vale para qualquer provedor.

Único material longo da aula e o único em inglês que vale o tamanho. Vai no fechamento, como link solto para quem quiser; é orientado a agentes, então nunca como leitura pedida.

## Sugeridas

**marco `a-chamada`**

- **Google, *Vamos começar* — seções 1 a 4** — Gemini API Docs, em português, atualizada em out/2026 · ~7 min de leitura (as quatro seções)
  https://ai.google.dev/gemini-api/docs/quickstart?hl=pt-br
  A chave, a primeira chamada com a resposta e os tokens à vista, o streaming, e a conversa de vários turnos nos dois jeitos, com estado e sem estado: a aula inteira na mesma página, em português.

Uma só sugerida, e ela serve dois marcos: ofereça no painel quando o `a-chamada` abrir, e volte a ela no `prompt-por-chamada`, na seção 4, em vez de oferecer outra coisa. Antecipe duas minas antes de abrir: logo depois da seção da chave vem "Fazer upgrade para o nível pago", que pede faturamento e não é para a P3; e a seção 5, multimodal, não é desta aula. Diga que ele lê da 1 à 4, pula o upgrade, e para.
