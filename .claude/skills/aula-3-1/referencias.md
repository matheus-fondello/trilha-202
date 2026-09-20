# Referências, aula 3.1

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Duas armadilhas nesta aula. A documentação da Anthropic está em `platform.claude.com`; `docs.claude.com` ainda responde, mas devolve 302 para lá, então use o endereço final. E a página de modelos envelhece rápido: os nomes, os preços e as janelas da tabela mudam de geração em geração, e o texto da aula não deve depender de um número específico — o que se ensina é a forma da tabela (latência, preço de entrada, preço de saída, janela), não a linha do Opus de hoje.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `pre-e-pos-treino`**

- **Anthropic, *Claude's Character*** — anthropic.com, jun/2024 · ~8 min de leitura
  https://www.anthropic.com/research/claude-character
  O laboratório descrevendo, em primeira pessoa, que traços de comportamento do assistente foram treinados de propósito depois do pré-treino, e não emergiram sozinhos.

Solte quando o aluno perceber que "ser um assistente" não vem do pré-treino. O post é a prova de que o comportamento é uma decisão de produto: alguém escolheu os traços e treinou o modelo com dados sintéticos gerados por ele mesmo. Não precisa que o aluno leia agora.

**marco `parametrico-versus-recuperado`**

- **Anthropic (Applied AI), *Effective context engineering for AI agents*** — Anthropic Engineering, set/2025 · ~15 min de leitura
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  Trata contexto como recurso finito e defende buscar informação no momento do uso, por referência leve, em vez de despejar tudo no prompt.

Cabe no parágrafo em que o aluno pergunta "então por que não colo o manual inteiro?". O post responde com o argumento de custo e de retorno decrescente, que é o mesmo argumento que sustenta busca e arquivos.

**marco `tamanho-custo-latencia`**

- **Anthropic, *Models overview*, seção "Compare models"** — platform.claude.com · ~2 min de leitura
  https://platform.claude.com/docs/en/models/overview#latest-models-comparison
  A tabela com latência comparativa, preço por milhão de tokens de entrada e de saída e tamanho de janela lado a lado: é a conta que decide qual modelo usar.

A âncora certa é `#latest-models-comparison`, apesar de o título da seção na página ser "Compare models". Se abrir a página inteira, o aluno começa pelo texto de escolha de modelo; a âncora cai direto na tabela.

**marco `thinking`**

- **Anthropic, *Thinking*, seção "How thinking works"** — platform.claude.com · ~2 min de leitura
  https://platform.claude.com/docs/en/build-with-claude/thinking#how-thinking-works
  Mostra o raciocínio como blocos de conteúdo que chegam antes da resposta, resumidos e cobrados como saída — thinking é texto gerado e pago, não um modo mágico.

O parágrafo de abertura da página, logo acima dessa seção, é onde está a frase do custo. Use para desfazer a ideia de que ligar thinking é grátis.

## Sugeridas

**marco `pre-e-pos-treino`**

- **Louis-François Bouchard, *Base Model vs Instruct Model*** — What's AI, YouTube, dez/2025 · 1 min 20 s
  https://www.youtube.com/watch?v=TRVmuskzE5Y&hl=en&persist_hl=1
  Em oitenta segundos: o modelo base só continua texto e não tenta ajudar; o modelo instruído foi treinado para seguir instrução. Mesmo conhecimento, comportamento diferente.

Ofereça quando o marco abrir, antes de explicar.

- **Sebastian Raschka, *Reinforcement Learning with Human Feedback (RLHF) in 4 minutes*** — YouTube, fev/2025 · 4 min 6 s
  https://www.youtube.com/watch?v=vJ4SsfmeQlk&hl=en&persist_hl=1
  Como a preferência humana vira sinal de treino, por um autor de referência em ML aplicado: é o pedaço do pós-treino que a aula menciona e nenhuma outra referência aprofunda.

Ofereça depois, quando você já disse que pós-treino usa preferência humana e ele perguntar como
isso funciona. Os dois em inglês.

**fechamento**

- **Andrej Karpathy, *Deep Dive into LLMs like ChatGPT*** — YouTube, fev/2025 · 3h31min
  https://www.youtube.com/watch?v=7xTGNNLPyMI&hl=en&persist_hl=1
  O único material geral que percorre a pilha inteira de treino, do dado bruto da internet ao modelo que se comporta como assistente, sem exigir matemática do espectador.

Ofereça no fechamento, nunca no meio: são três horas e meia, e o aluno tem que ver no tempo dele. Diga qual pedaço vale primeiro, senão ele abre e desiste. O trecho da aula é de 00:59:23 ("pretraining to post-training") a 01:20:32, uns vinte minutos que cobrem os dois primeiros marcos; quem ficar curioso sobre paramétrico versus recuperado continua em 01:20:32 ("hallucinations, tool use, knowledge/working memory") e quem quiser thinking pula para 01:46:56 ("models need tokens to think"). Está em inglês, com legenda automática decente.
