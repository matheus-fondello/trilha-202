# Referências da trilha

Tudo aqui é opcional. A aula se sustenta sozinha: isto é para quem quer ir além, na hora ou depois. Você também pode pedir ao Claude, na sala: `/referencias`.

As **sugeridas** são o que o tutor oferece abrir ao lado durante a aula, cada uma no seu momento; se você for ver só uma coisa de uma aula, é uma delas. As **citadas** são a fonte do que foi dito na aula.

> Arquivo gerado por `node .claude/scripts/trilha.js dev referencias`. Para mudar algo, edite o `referencias.md` da aula e gere de novo.

## Módulo 0

### 0.1 Como funciona a trilha

**Sugerida**

- **Claude, *Which Claude model should you use?*** — canal oficial no YouTube, set/2026 · 3 min 45 s
  https://www.youtube.com/watch?v=71-8fJIGi34&hl=en&persist_hl=1
  O time do produto dizendo o que decide o custo de uma tarefa e como escolher modelo e esforço: a recomendação de plano desta aula em vídeo, já com a família de modelos atual.

**Citadas na aula**

- **Anthropic, *Models, usage, and limits in Claude Code*** — Central de Ajuda, atualizado em abr/2026 · 10 min de leitura
  https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code
  Saber em que modelo você está, trocar com `/model`, e por que a sessão piora quando o contexto enche.

- **Anthropic, *Use Claude Code with your Pro or Max plan*** — Central de Ajuda · 7 min de leitura
  https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan
  O que o plano cobre e quais são as saídas quando o limite bate: esperar, subir de plano, créditos.

- **Anthropic, *Commands*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/commands
  A lista canônica dos comandos. É aqui que ele confere quando um comando que viu num vídeo antigo não existe mais.

- **Claude Code, *CHANGELOG*** — repositório oficial no GitHub · consulta
  https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
  A prova de que a ferramenta muda toda semana, num lugar público. Serve para ele saber que não enlouqueceu.

- **Lydia Hallie, *Choosing a Claude model and effort level in Claude Code*** — blog da Anthropic, jul/2026 · 5 min de leitura
  https://claude.com/blog/claude-model-and-effort-level-in-claude-code
  O critério de decisão em texto: o agente não tentou o bastante, ou não sabia o bastante? É a mesma coisa que o vídeo sugerido diz, para quem preferir ler.

- **Anthropic, *Interactive mode*, seção "Wait for a usage limit to reset"** — documentação do Claude Code · 3 min a seção
  https://code.claude.com/docs/en/interactive-mode#wait-for-a-usage-limit-to-reset
  O mecanismo exato do "nunca perde trabalho": o Claude Code espera sozinho, mostra quando volta e retoma do ponto em que parou, sem reenviar a última mensagem.

## Módulo 1

### 1.1 Vibe coding e engenharia agêntica

**Sugerida**

- **Andrej Karpathy: From Vibe Coding to Agentic Engineering, com Stephanie Zhan** — Sequoia Capital, abr/2026 · 30 min
  https://www.youtube.com/watch?v=96jN2OCOfLs&hl=en&persist_hl=1
  É a aula inteira contada pelo cara que cunhou o termo, com o mesmo arco: vibe coding de um lado, engenharia agêntica do outro. Se ele for ver um só material desta aula, é este.

- **Andrej Karpathy, resumo em 12 pontos da conversa no Sequoia AI Ascent 2026** — karpathy.bearblog.dev, abr/2026 · 5 min de leitura
  https://karpathy.bearblog.dev/sequoia-ascent-2026/
  A mesma entrevista em doze pontos escritos pelo próprio Karpathy: vibe coding levanta o piso, engenharia agêntica segura a qualidade, e dá para terceirizar a execução, não o entendimento.

**Citadas na aula**

- **Andrej Karpathy, o tweet original** — X, fev/2025 · 6 linhas
  https://x.com/karpathy/status/1886192184808149383
  Ele descreve o modo sem julgar: "Accept All" sempre, não leio mais os diffs. O termo nasceu descritivo e virou xingamento depois.

- **Simon Willison, *Not all AI-assisted programming is vibe coding (but vibe coding rocks)*** — simonwillison.net, mar/2025 · 5 min de leitura
  https://simonwillison.net/2025/Mar/19/vibe-coding/
  A separação dos dois modos que esta aula usa, feita por quem a fez primeiro.

- **Simon Willison, *Vibe coding and agentic engineering are getting closer than I'd like*** — simonwillison.net, mai/2026 · 6 min de leitura
  https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/
  O mesmo autor, um ano depois, incomodado com a fronteira ficando borrada. Só para quem já digeriu a distinção; antes disso, embaralha.

- **Andrej Karpathy, a retrospectiva de um ano do tweet** — X, fev/2026 · post curto
  https://x.com/karpathy/status/2019137879310836075
  O autor do termo, um ano depois, cunhando "agentic engineering" como o nome que sucede vibe coding: "agentic" porque você quase não escreve o código direto, "engineering" porque é arte e ciência que se aprende.

### 1.2 Claude Code por dentro

**Sugerida**

- **Claude, *How Claude Code Works*** — canal oficial no YouTube, mai/2026 · 2 min 51 s
  https://www.youtube.com/watch?v=6bs5b4FltCU&hl=en&persist_hl=1
  A ementa desta aula em menos de três minutos — loop, janela de contexto, ferramentas e modos —, com o objetivo declarado de que o Claude Code pare de parecer caixa mágica.

**Citadas na aula**

- **Erik S. e Barry Zhang, *Building effective agents*** — Anthropic, engenharia, dez/2024 · 15 min de leitura
  https://www.anthropic.com/engineering/building-effective-agents
  A definição de agente sem marketing: o modelo dirige o próprio processo e ganha informação do ambiente a cada passo. É por isso que ele roda o teste.

- **Anthropic, *Terminal guide for new users*** — documentação do Claude Code · 10 min de leitura
  https://code.claude.com/docs/en/terminal-guide
  A página oficial para quem nunca usou terminal, com o que fazer quando o comando `claude` não é reconhecido.

- **Anthropic, *Advanced setup*, seção "Set up on Windows"** — documentação do Claude Code · 4 min de leitura
  https://code.claude.com/docs/en/setup#set-up-on-windows
  A tabela de Windows nativo contra WSL, e o aviso de que no WSL o `claude` roda de dentro do WSL, não do PowerShell.

- **Django Girls, *Introdução à linha de comando*** — tutorial.djangogirls.org, em português · 15 min de leitura
  https://tutorial.djangogirls.org/pt/intro_to_command_line/
  O único material em português escrito para quem nunca abriu um terminal: os quatro comandos, nos três sistemas, com exercício no fim.

- **Anthropic, *How Claude remembers your project*** — documentação do Claude Code · consulta, 20 min se lida inteira
  https://code.claude.com/docs/en/memory
  Os escopos de CLAUDE.md em ordem de carregamento, o `/init`, e o alvo de menos de 200 linhas por arquivo.

- **Anthropic, *Explore the .claude directory*** — documentação do Claude Code · explorador interativo, 5 min
  https://code.claude.com/docs/en/claude-directory
  A árvore `.claude/` clicável, com uma linha dizendo quando cada arquivo carrega. Bom para ele abrir ao lado enquanto olha a daqui.

- **Anthropic, *How Claude Code works*** — documentação do Claude Code · 13 min de leitura
  https://code.claude.com/docs/en/how-claude-code-works
  A versão escrita e completa do vídeo abaixo: o loop em três fases, a lista literal do que o agente acessa, e a frase que fecha o assunto — o Claude Code é o harness agêntico em volta do Claude.

### 1.3 Verificar, não ler

**Sugerida**

- **Simon Willison, *Your job is to deliver code you have proven to work*** — simonwillison.net, dez/2025 · 5 min de leitura
  https://simonwillison.net/2025/Dec/18/code-proven-to-work/
  A tese da aula sem vocabulário de ferramenta: se você não viu o código fazer a coisa certa com os próprios olhos, esse código não funciona, e isso é trabalho de quem opera, não do agente.

- **Anthropic, *Best practices for Claude Code*, seção "Give Claude a way to verify its work"** — documentação do Claude Code · 4 min a seção
  https://code.claude.com/docs/en/best-practices#give-claude-a-way-to-verify-its-work
  A aula inteira em uma seção, com uma tabela de prompts antes e depois que ele copia direto para a oficina.

- **Delba de Oliveira, *Building verification loops in Claude Code with skills*** — blog da Claude, jul/2026 · 5 min de leitura
  https://claude.com/blog/building-verification-loops-in-claude-code-with-skills
  O time do Claude Code encadeando revisão, simplificação e verificação como skills: o loop fechado virando hábito que sobrevive à sessão, não um comando solto.

**Citadas na aula**

- **Anthropic, *Claude Code power user tips*, seção "Verification — the #1 Tip"** — Central de Ajuda · 15 min de leitura
  https://support.claude.com/en/articles/14554000-claude-code-power-user-tips
  É a origem da frase que abre esta aula: se ele adotar uma única prática da lista inteira, que seja dar ao agente um jeito de conferir a própria saída.

- **Anthropic, *Keep Claude working toward a goal*** — documentação do Claude Code · 11 min de leitura
  https://code.claude.com/docs/en/goal
  A página do comando que esta aula ensina: como escrever a condição, o que o avaliador enxerga (só a conversa), e como limitar quantos turnos ele roda.

- **Simon Willison, *Agentic manual testing*** — guia Agentic Engineering Patterns, simonwillison.net, mar/2026 · 7 min de leitura
  https://simonwillison.net/guides/agentic-engineering-patterns/agentic-manual-testing/
  Quando um screenshot prova algo ("o menu está no lugar certo") e quando passar nos testes não basta: a pergunta do marco, respondida com casos.

- **Anthropic, *Best practices*, seção "Add an adversarial review step"** — documentação do Claude Code · 3 min de leitura
  https://code.claude.com/docs/en/best-practices#add-an-adversarial-review-step
  O prompt de revisão pronto — reporte lacunas, não preferências de estilo — e o contrapeso honesto: revisor mandado achar defeito sempre acha algum, e perseguir todos leva a excesso de engenharia.

### 1.4 Onde o LLM erra

**Sugerida**

- **3Blue1Brown, *Transformers, the tech behind LLMs*** — YouTube, abr/2024 · 27 min no total, trecho de 3 min
  https://www.youtube.com/watch?v=wjZofJX0v4M&hl=en&persist_hl=1
  Os três primeiros minutos, o capítulo "Predict, sample, repeat": o modelo produz uma distribuição de probabilidade sobre o próximo pedaço e sorteia dela. É a mecânica inteira desta aula, visual e sem metáfora.

- **OpenAI, *Por que os modelos de linguagem alucinam?*** — openai.com, set/2025 · 8 min de leitura
  https://openai.com/pt-BR/index/why-language-models-hallucinate/
  Em português, e com a explicação que reorganiza a cabeça do aluno: o modelo chuta porque a avaliação premia o chute e pune o "não sei" — do mesmo jeito que um aluno faz numa prova de múltipla escolha.

- **Claude, *Can you trust what AI tells you?*** — canal oficial no YouTube, série Claude Academy, ago/2026 · 5 min 3 s
  https://www.youtube.com/watch?v=cIMlBw2nqfA&hl=en&persist_hl=1
  Alucinação e sicofância juntas como as duas causas de "confiantemente errado", confiança como um dial e não um interruptor, e quatro hábitos de verificação: a regra que fecha a aula, dita por quem faz o modelo.

**Citadas na aula**

- **Adam Tauman Kalai, Ofir Nachum, Santosh Vempala e Edwin Zhang, *Why Language Models Hallucinate*** — arXiv, set/2025 · artigo científico
  https://arxiv.org/abs/2509.04664
  A fonte primária, para o aluno que quiser ver que isso não é opinião de blog.

- **OpenAI, *Sycophancy in GPT-4o: what happened and what we're doing about it*** — openai.com, abr/2025 · 3 min de leitura
  https://openai.com/index/sycophancy-in-gpt-4o/
  Sicofância não é teoria: uma versão que concordava com tudo foi ao ar e teve que ser revertida.

- **Sara Zan, *Setting the temperature to zero will make an LLM deterministic?*** — zansara.dev, mar/2026 · 6 min de leitura
  https://www.zansara.dev/posts/2026-03-24-temp-0-llm/
  Desmonta a resposta que todo mundo dá ("é só zerar a temperatura"): mesmo sem sorteio, o mesmo pedido pode dar respostas diferentes, e a saída é desenhar em volta da variação.

### 1.5 O prompt como interface

**Sugerida**

- **Claude, *The CLAUDE.md file*** — canal oficial no YouTube, série Claude Code 101, mai/2026 · 3 min 1 s
  https://www.youtube.com/watch?v=O0FGCxkHM-U&hl=en&persist_hl=1
  O que entra no arquivo e como os escopos carregam, mostrado na tela: o primeiro tratamento visual do arquivo que ele só viu em texto na 1.2.

- **DAIR.AI, *Dicas gerais para projetar prompts*** — Prompt Engineering Guide, em português · 8 min de leitura
  https://www.promptingguide.ai/pt/introduction/tips
  Em português e na ordem certa: comece simples, seja específico, evite imprecisão, e a seção "Fazer ou não fazer?", que é o antipadrão desta aula com exemplo.

**Citadas na aula**

- **Andrej Karpathy, *Software Is Changing (Again)*** — YouTube, canal Y Combinator, jun/2025 · 39 min no total, trecho de 5 min
  https://www.youtube.com/watch?v=LCEmiRjPEtQ&hl=en&persist_hl=1&t=280s
  O capítulo "Programming in English", de 4:40 a 6:10: a tese de que o modelo é um computador novo e o prompt é a linguagem em que se programa.

- **Prithvi Rajasekaran, Ethan Dixon, Carly Ryan e Jeremy Hadfield, *Effective context engineering for AI agents*** — Anthropic, engenharia, set/2025 · 15 min de leitura
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  É a fonte da regra desta aula: procurar o menor conjunto de informação de alto sinal, não a maior pilha de contexto.

- **Anthropic, *Best practices*, seção "Provide specific context in your prompts"** — documentação do Claude Code · 3 min de leitura
  https://code.claude.com/docs/en/best-practices#provide-specific-context-in-your-prompts
  Uma tabela de antes e depois com quatro pedidos ruins virando bons — já no vocabulário de quem fala com um agente, não com uma caixa de chat.

- **Anthropic, *Prompting best practices*, seção "Use examples effectively"** — documentação da plataforma Claude · 2 min a seção
  https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#use-examples-effectively
  Nomeia few-shot com todas as letras e dá a regra que a aula ensina: exemplo tem que ser relevante e diverso, senão o modelo copia um padrão que ninguém quis.

- **Anthropic, *Best practices for prompt engineering for 2026*** — blog da Claude, nov/2025 · 12 min de leitura
  https://claude.com/blog/best-practices-for-prompt-engineering
  Tem uma seção inteira de erros comuns, que é o espelho dos antipadrões desta aula.

### 1.6 Modos, permissões e modelo

**Sugerida**

- **Claude, *How auto mode works with Claude Code*** — canal oficial no YouTube, ago/2026 · 5 min 42 s no total, trecho de 3 min, de 0:44 a 3:33
  https://www.youtube.com/watch?v=b8SV4U6fEIc&hl=en&persist_hl=1&t=44s
  O classificador como um segundo leitor que aprova em vez de você, e por que o agente nunca aprova a própria ação, com tela.

- **Claude, *The Explore → Plan → Code → Commit workflow in Claude Code*** — canal oficial no YouTube, série Claude Code 101, mai/2026 · 3 min 11 s
  https://www.youtube.com/watch?v=xJQuF02NAK8&hl=en&persist_hl=1
  Plan mode no lugar dele: uma fase de entender antes da fase de mexer, com critério de sucesso escrito antes de codar.

- **John Hughes, *How we built Claude Code auto mode: a safer way to skip permissions*** — Anthropic, engenharia, mar/2026 · 12 min de leitura
  https://www.anthropic.com/engineering/claude-code-auto-mode
  Faz entender que o auto mode é um segundo modelo lendo por cima do ombro do primeiro. A melhor decisão de projeto está lá: o classificador não vê as mensagens do agente nem os resultados das ferramentas, só o que o usuário pediu e o comando a rodar — para que o agente não consiga argumentar em causa própria.

**Citadas na aula**

- **Conner Phillippi, *Auto mode is now the default in Claude Code for Pro, Max, and Team plans*** — blog da Claude, ago/2026 · 20 min de leitura
  https://claude.com/blog/auto-mode-default-in-claude-code
  Traz o número que ganha a discussão: num estudo com mil pessoas, humanos aprovando à mão pegaram 13,6% dos comandos perigosos; o classificador pegou 89%.

- **Simon Willison, *Breaking Claude Code Opus 5 Auto Mode*** — simonwillison.net, ago/2026 · 2 min de leitura
  https://simonwillison.net/2026/Aug/27/breaking-claude-code-opus-5-auto-mode/
  O contrapeso, e recente: um caso em que o classificador foi contornado em cerca de 80% das tentativas. Reduzir risco não é eliminar risco.

- **Anthropic, *Choose a permission mode*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/permission-modes
  A página canônica: os seis modos, em qual a sessão começa conforme o plano, e os limiares em que o auto mode pausa e devolve a decisão para o aluno.

- **Anthropic, *Model configuration*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/model-config
  A página que muda mais rápido e a única que vale como fonte: os apelidos do `/model` (`sonnet`, `opus`, `haiku`, `opusplan`, `best`), o padrão de cada plano, e os níveis de esforço com o que cada um serve.

- **Anthropic, *Claude Fable models on your plan*** — Central de Ajuda · 3 min de leitura
  https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan
  O Fable em cada plano: em todo plano pago, nunca como padrão; no Pro fora do limite e cobrado em créditos, no Max até metade da cota semanal.

- **Anthropic, *Choosing the right model*** — documentação da plataforma Claude · 6 min de leitura
  https://platform.claude.com/docs/en/about-claude/models/choosing-a-model
  Como escolher sem ter benchmark próprio, e o ponto que quase ninguém sabe: ajustar o esforço costuma render mais que trocar de modelo.

- **Claude, *Which Claude model should you use?*** — canal oficial no YouTube, set/2026 · 3 min 45 s
  https://www.youtube.com/watch?v=71-8fJIGi34&hl=en&persist_hl=1
  O que decide o custo de uma tarefa e quando escolher modelo e esforço: é a régua do marco, oficial e atual.

### 1.7 Higiene de contexto

**Sugerida**

- **Claude, *Context Management in Claude Code*** — canal oficial no YouTube, série Claude Code 101, mai/2026 · 3 min 30 s
  https://www.youtube.com/watch?v=eW3oTyfeWZ0&hl=en&persist_hl=1
  Oficial, curtíssimo e exatamente esta aula: contexto como memória de trabalho, quando compactar e quando limpar.

- **Teresa Torres, *Context Rot: Why AI Gets Worse the Longer You Chat (And How to Fix It)*** — Product Talk, fev/2026 · 21 min de leitura
  https://www.producttalk.org/context-rot/
  Gente de produto escrevendo para gente de produto: por que o agente piora depois de uma hora, o que acontece quando a janela passa da metade, e como o Claude Code deixa ver e controlar isso.

**Citadas na aula**

- **Anthropic, *Explore the context window*** — documentação do Claude Code · simulação interativa, 5 min
  https://code.claude.com/docs/en/context-window
  Uma sessão enchendo a janela em tempo real, com o custo de cada leitura de arquivo. Ver a barra encher ensina mais que qualquer parágrafo.

- **Prithvi Rajasekaran, Ethan Dixon, Carly Ryan e Jeremy Hadfield, *Effective context engineering for AI agents*** — Anthropic, engenharia, set/2025 · 15 min de leitura
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  Dá o vocabulário e nomeia as três estratégias que a aula ensina na mão: compactar, anotar fora da janela e delegar a subagente.

- **Matt Pocock, *Most devs don't understand how context windows work*** — YouTube, out/2025 · 9 min 33 s
  https://www.youtube.com/watch?v=-uW5-TaVXu4&hl=en&persist_hl=1
  Explica o "perdido no meio": o modelo enxerga pior o que está no miolo de uma janela cheia. É o porquê de limpar, não só o como.

- **Kelly Hong, Anton Troynikov e Jeff Huber, *Context Rot: How Increasing Input Tokens Impacts LLM Performance*** — Chroma, relatório técnico, jul/2025 · 25 min de leitura
  https://www.trychroma.com/research/context-rot
  A fonte que cunhou "context rot": dezoito modelos piorando conforme a entrada cresce, de forma desigual e sem aviso. É a prova do "a qualidade cai antes de qualquer aviso".

- **Anthropic, *Checkpointing*** — documentação do Claude Code · 8 min de leitura
  https://code.claude.com/docs/en/checkpointing
  Lista em preto no branco o que o desfazer não salva: mudança feita por comando de terminal, edição de subagente, alteração externa. A última seção se chama, literalmente, "não substitui controle de versão".

- **Guillaume Billey, *Getting More Out of Claude Code in the Terminal*, da seção "Visualize Your Context Window" ao fim** — Marmelab, mai/2026 · 4 min o trecho
  https://marmelab.com/blog/2026/05/12/claude-code-hidden-commands.html
  Com print de cada um: `/context` mostrando o que ocupa a janela, `/compact` com instrução, `/rewind` e `/clear` lado a lado, e o `/btw` como pergunta que não entra no histórico.

- **Anthropic, *Manage sessions*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/sessions
  Nomear, retomar e ramificar sessão, e o que uma sessão retomada de fato restaura.

### 1.8 Skills, hooks e guardrails

**Sugerida**

- **Claude, *How skills compare to other Claude Code features*** — canal oficial no YouTube, série Claude Code Skills, fev/2026 · 3 min 1 s
  https://www.youtube.com/watch?v=IgNN4v0BJdU&hl=en&persist_hl=1
  A régua da aula dita pela Anthropic: skills, CLAUDE.md, subagentes, hooks e MCP resolvem problemas diferentes, e saber qual é qual evita construir a coisa errada.

- **Claude, *Hooks in Claude Code*** — canal oficial no YouTube, série Claude Code 101, mai/2026 · 3 min 21 s
  https://www.youtube.com/watch?v=IkaPHiMDazM&hl=en&persist_hl=1
  Um hook rodando sozinho depois de uma edição e outro bloqueando uma operação perigosa: os mesmos exemplos da aula, na tela. Mesma série da 1.2 e da 1.7.

- **Michael Segner, *Steering Claude Code: when to use CLAUDE.md, skills, hooks, and subagents*** — blog da Anthropic, jun/2026 · 5 min de leitura
  https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more
  Os mecanismos de customização comparados por custo de contexto e por autoridade, com a regra de bolso que esta aula ensina: procedimento vira skill, comportamento que precisa acontecer sempre vira hook.

**Citadas na aula**

- **Barry Zhang, Keith Lazuka e Mahesh Murag, *Equipping agents for the real world with Agent Skills*** — Anthropic, engenharia, out/2025 · 10 min de leitura
  https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
  O porquê do formato, por quem o projetou: revelação progressiva, e o aviso de que o nome e a descrição são o que decide o disparo.

- **Anthropic, *Extend Claude with skills*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/skills
  A anatomia completa: frontmatter, ciclo de vida do conteúdo, invocação por `/nome` e o `disable-model-invocation` para skill de efeito colateral.

- **Anthropic, *Automate actions with hooks*** — documentação do Claude Code · 25 min de leitura
  https://code.claude.com/docs/en/hooks-guide
  O passo a passo do primeiro hook, e a definição que nenhuma paráfrase melhora: controle determinístico, a ação acontece em vez de depender de o modelo escolher rodá-la.

- **Anthropic, *Extend Claude Code*** — documentação do Claude Code · 12 min de leitura
  https://code.claude.com/docs/en/features-overview
  Tem a tese desta aula em três frases: "nunca edite o .env" no CLAUDE.md é um pedido, não uma garantia; o hook que bloqueia a edição é imposição.

- **Anthropic, *Configure permissions*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/permissions
  As regras de permitir, perguntar e negar em `settings.json`, versionáveis junto com o projeto.

- **Claude, *Configuration and multi-file skills*** — canal oficial no YouTube, série Claude Code Skills, fev/2026 · 4 min 4 s
  https://www.youtube.com/watch?v=98KaK_rn5rQ&hl=en&persist_hl=1
  Campos do frontmatter, restrição de ferramenta e skill maior em vários arquivos: o "descrição vaga é o defeito número um" mostrado nos campos reais.

### 1.9 Uma página que vende

**Sugerida**

- **Alisha Conlin-Hurd, *Fix Your Above The Fold*** — YouTube, canal Persuasion Experience, out/2023 · 8 min 16 s no total, trecho de 2 min 52 s, de 0:22 a 3:14
  https://www.youtube.com/watch?v=bwwL1G6XUz0&hl=en&persist_hl=1&t=22s
  A primeira dobra se montando ao vivo, bloco a bloco, com páginas reais: a anatomia dos textos do Harry Dry vista em vez de lida.

- **Alex Cattoni, *Long vs Short Landing Page — One Converted At 80.27%*** — YouTube, canal Copy Posse, ago/2025 · 11 min 34 s no total, trecho de 2 min 46 s, de 2:08 a 4:54
  https://www.youtube.com/watch?v=v_YQ5M3MEro&hl=en&persist_hl=1&t=128s
  Os números de um teste A/B de verdade, com a diferença percentual dita em voz alta: o "sem medir você está adivinhando" da aula com prova, e não como regra.

- **Julian Shapiro, *Startup Handbook: Landing Page Copywriting*** — julian.com · 15 min de leitura
  https://www.julian.com/guide/startup/landing-pages
  A aula inteira num texto: a fórmula da conversão, a estrutura em sete blocos e um roteiro de como pedir feedback da página sem receber elogio educado.

**Citadas na aula**

- **Harry Dry, *My step-by-step guide to landing pages that convert*** — Marketing Examples · 4 min de leitura
  https://marketingexamples.com/landing-page/guide
  Dez passos, cinco acima da dobra e cinco abaixo, cada um com exemplo real de página que existe.

- **Therese Fessenden, *Scrolling and Attention*** — Nielsen Norman Group, abr/2018 · 12 min de leitura
  https://www.nngroup.com/articles/scrolling-and-attention/
  Eyetracking com 120 pessoas: 57% do tempo de olhar fica acima da dobra. Serve para a primeira dobra deixar de ser folclore e virar dado.

- **Harry Dry, *17 tips for great copywriting*** — Marketing Examples · 5 min de leitura
  https://marketingexamples.com/copywriting/tips
  Dezessete regras com exemplo de marca em cada uma, incluindo a desta aula: ninguém liga para o que você faz, e sim para o que você faz por ele.

- **Vercel, *Tracking custom events*** — documentação da Vercel, atualizado em jun/2026 · 6 min de leitura
  https://vercel.com/docs/analytics/custom-events
  O evento no botão, em três linhas de código, na plataforma em que a página dele vai estar depois da próxima aula.

### 1.10 Design e deploy

**Sugerida**

- **Kevin Powell, *Web design tips for developers*** — YouTube, fev/2021 · 21 min 12 s no total, trecho de 3 min 50 s, de 10:27 a 14:17 (capítulo "contrast with color")
  https://www.youtube.com/watch?v=ykn4XNDwW7Q&hl=en&persist_hl=1&t=627s
  Uma cor de ação, usada só no que se quer clicado, trocada ao vivo numa página real com o antes e o depois na tela: a regra da aula mostrada em vez de dita.

- **Breno Luiz, *Como hospedar um site na Vercel em 3 minutos*** — YouTube, em português, dez/2025 · 3 min 1 s
  https://www.youtube.com/watch?v=mhbYavuW9T4&hl=en&persist_hl=1
  Três minutos, em português, conectando o repositório e vendo o site no ar. Aqui o obstáculo é de interface, e ver alguém clicando resolve melhor que ler.

- **Erik D. Kennedy, *7 Rules for Creating Gorgeous UI (Updated for 2024)*, parte 1** — Learn UI Design, atualizado em jun/2024 · 13 min de leitura
  https://www.learnui.design/blog/7-rules-for-creating-gorgeous-ui-part-1.html
  Luz vem de cima, preto e branco antes da cor, e dobre o espaço em branco. É a única coisa desta aula cujo efeito ele vê na própria página no mesmo dia.

**Citadas na aula**

- **Anthropic, *Introducing Claude Design*** — Anthropic, abr/2026 · 6 min de leitura
  https://www.anthropic.com/news/claude-design-anthropic-labs
  Descrever, receber uma primeira versão e refinar por conversa e edição direta, em vez de pedir "deixa mais bonito" no escuro.

- **Lisa Demchenko, *How to write a DESIGN.md file Claude can actually use*** — Process to Pixels, mai/2026 · 9 min de leitura
  https://processtopixels.substack.com/p/writing-a-designmd-file-claude-can
  A estrutura do arquivo, não só a ideia dele: briefing do produto, tokens com a intenção por trás de cada valor, tipografia com a lógica da escolha, e uma seção do que não fazer.

- **Vercel, *Next.js Installation*** — documentação do Next.js, atualizado em jul/2026 · 10 min de leitura
  https://nextjs.org/docs/app/getting-started/installation
  A porta de entrada da stack e o que vem por padrão. Detalhe que vale mostrar: o gerador já cria um arquivo de instruções para agentes de código.

- **Vercel, *Environments*** — documentação da Vercel, atualizado em ago/2026 · 8 min de leitura
  https://vercel.com/docs/deployments/environments
  O que "no ar" significa: cada branch vira uma URL de pré-visualização, e produção é o endereço que ele manda para alguém.

- **Vercel, *Getting started with Vercel*** — documentação da Vercel, atualizado em ago/2026 · 4 min de leitura
  https://vercel.com/docs/getting-started-with-vercel
  A rede de segurança quando a tela não bater com a do vídeo: os dois caminhos oficiais, pelo terminal e pelo painel.

- **Anthropic, *Best practices for Claude Code*, seção "Give Claude a way to verify its work"** — documentação do Claude Code · 3 min a seção
  https://code.claude.com/docs/en/best-practices#give-claude-a-way-to-verify-its-work
  Traz o screenshot como check na forma de prompt copiável: implemente, tire um screenshot do resultado, compare com o original, liste as diferenças e corrija.

### 1.11 Subagentes, MCP e plugins

**Sugerida**

- **Claude, *MCP in Claude Code*** — canal oficial no YouTube, série Claude Code 101, mai/2026 · 3 min 37 s
  https://www.youtube.com/watch?v=kkBFmwkDzdo&hl=en&persist_hl=1
  Adicionar um servidor, escopar por equipe e o custo de contexto, mostrados por dentro do Claude Code em vez do protocolo em abstrato.

- **Simon Willison, *The lethal trifecta for AI agents: private data, untrusted content, and external communication*** — simonwillison.net, jun/2025 · ~7 min de leitura
  https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
  A régua para decidir o que conectar: dado privado, conteúdo não confiável e saída para fora. Juntar os três num agente é o risco, e MCP convida a juntar sem perceber.

**Citadas na aula**

- **Anthropic, *Extend Claude Code*** — documentação do Claude Code · ~12 min de leitura
  https://code.claude.com/docs/en/features-overview
  A referência da ementa: a tabela que casa cada peça com o gatilho que a pede — quando vira CLAUDE.md, skill, subagente, MCP, hook ou plugin — e quanto contexto cada uma custa.

- **Anthropic, *Create custom subagents*** — documentação do Claude Code · ~25 min de leitura
  https://code.claude.com/docs/en/sub-agents
  O arquivo em `.claude/agents/` com nome, descrição, ferramentas e modelo; o contexto isolado que devolve só o resumo; e os subagentes que já vêm prontos.

- **Anthropic, *Run parallel sessions with worktrees*, seção "Start Claude in a worktree"** — documentação do Claude Code · 3 min a seção
  https://code.claude.com/docs/en/worktrees#start-claude-in-a-worktree
  O que o worktree é (cópia própria do repositório, na mesma história), o comando que abre um, e que exige repositório git.

- **Anthropic, *Desktop application*, seção "Work in parallel with sessions"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/desktop#work-in-parallel-with-sessions
  A opção de worktree no diálogo de sessão nova do aplicativo, que é onde o aluno está; o comando fica para quem usa terminal.

- **Anthropic, *Connect Claude Code to tools via MCP*** — documentação do Claude Code · ~15 min de leitura
  https://code.claude.com/docs/en/mcp
  Como um servidor se adiciona, os três escopos (o de projeto vai para o repositório) e o aviso em destaque: confira se confia no servidor antes de conectar, porque servidor que busca conteúdo externo expõe a injeção.

- **Anthropic, *Use Claude Code with Chrome*** — documentação do Claude Code · ~10 min de leitura
  https://code.claude.com/docs/en/chrome
  O navegador da fluência. A extensão compartilha o login do aluno, então o agente alcança qualquer site em que ele já esteja logado: é o exemplo mais nítido de alcance que a aula tem.

- **Anthropic, *Discover and install prebuilt plugins through marketplaces*, seção "Security"** — documentação do Claude Code · 1 min a seção
  https://code.claude.com/docs/en/discover-plugins#security
  Três frases: plugin e marketplace executam código arbitrário na máquina, com os privilégios do usuário; instale só de fonte em que confia.

- **Stephen Thoemmes, *How "Clinejection" Turned an AI Bot into a Supply Chain Attack*** — Snyk, fev/2026 · ~13 min de leitura
  https://snyk.io/blog/cline-supply-chain-attack-prompt-injection-github-actions/
  O caso da aula, passo a passo: injeção pelo título de uma issue, credencial vazada, versão adulterada no npm por oito horas instalando outro agente — dado não confiável entrando no agente mais ferramenta que executa.

- **SentinelOne, *When Your AI Coding Plugin Starts Picking Your Dependencies: Marketplace Skills and Dependency Hijack in Claude Code*** — sentinelone.com, jan/2026 · 2 min de leitura
  https://www.sentinelone.com/blog/marketplace-skills-and-dependency-hijack-in-claude-code/
  Um segundo mecanismo, no Claude Code mesmo: o plugin malicioso não rouba credencial, troca a fonte de instalação de um pacote, e a versão adulterada entra limpa, sem erro.

## Módulo 2

### 2.1 O que significa shippar

**Sugerida**

- **Fireship, *DevOps CI/CD Explained in 100 Seconds*** — YouTube, mar/2020 · 1 min 55 s
  https://www.youtube.com/watch?v=scEDHsr3APg&hl=en&persist_hl=1
  A esteira que sustenta o "posso colocar em produção agora": integrar, testar, empacotar, publicar, em animação. É a metade do ciclo que a IA não acelerou, desenhada.

- **Martin Fowler, *Continuous Delivery*** — martinfowler.com, mai/2013, atualizado ago/2014 · ~4 min
  https://martinfowler.com/bliki/ContinuousDelivery.html
  Quatro minutos que fixam o teste prático de "pronto": o patrocinador pode pedir para colocar a versão atual em produção agora, e ninguém se assusta.

**Citadas na aula**

- **Google, *Appendix E: Launch Coordination Checklist*** — Site Reliability Engineering (O'Reilly, 2016) · leitura de ~3 min
  https://sre.google/sre-book/launch-checklist/
  A lista que o Google exigia antes de considerar um serviço lançado: arquitetura, capacidade, o que acontece quando a máquina morre, monitoramento, segurança, dependências. Nada disso é escrever a funcionalidade.

- **Martin Fowler, *Is High Quality Software Worth the Cost?*** — martinfowler.com, mai/2019 · ~16 min
  https://martinfowler.com/articles/is-quality-worth-cost.html
  Mostra por que a manutenção domina o custo do ciclo: quase toda programação acontece dentro de código que já existe, então o preço de mudar depois pesa mais que o de construir.

- **Joel Becker, Nate Rush, Beth Barnes e David Rein, *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*** — METR, jul/2025 · ~18 min
  https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
  Ensaio randomizado com 16 devs experientes em repositórios que eles já conheciam: com IA levaram 19% mais tempo, e mesmo depois achavam que tinham sido 20% mais rápidos.

- **Addy Osmani, *The 80% Problem in Agentic Coding*** — Elevate (Substack), jan/2026 · ~17 min
  https://addyo.substack.com/p/the-80-problem-in-agentic-coding
  O texto que dá nome ao problema: o agente entrega os 80% que funcionam, e o que sobra é dívida de compreensão, código que você aprovou sem saber explicar.

- **Wikipédia, *Ninety–ninety rule*** — artigo · 2 min de leitura
  https://en.wikipedia.org/wiki/Ninety%E2%80%93ninety_rule
  A frase de Tom Cargill (Bell Labs, 1985): os primeiros 90% do código levam 90% do tempo, e os 10% finais levam os outros 90%.

### 2.2 Cliente, servidor e API

**Sugerida**

- **Fireship, *Computer Networking in 100 Seconds*** — YouTube, ago/2020 · 2 min 17 s
  https://www.youtube.com/watch?v=keeqnciDVOo&hl=en&persist_hl=1
  O caminho do clique à resposta em animação: o pacote saindo do navegador, atravessando a rede e voltando. A MDN citada mostra o texto da requisição; este mostra o caminho que o texto percorre.

- **Next.js, *How to use environment variables in Next.js — Bundling Environment Variables for the Browser*** — documentação oficial · ~2 min de leitura
  https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
  É onde a fronteira entre front e back vira uma regra que se pode conferir: sem o prefixo `NEXT_PUBLIC_` a variável fica só no servidor, com o prefixo ela é colada dentro do JavaScript que desce para o navegador.

- **Yudi Ganeko, *O que é API (em 2 minutos)*** — YouTube, em português, set/2025 · 2 min 34 s
  https://www.youtube.com/watch?v=Q-lyQ7BdDXE&hl=en&persist_hl=1
  API como contrato dito em português, com exemplo fora de código: o conceito em voz, antes ou depois da ViaCEP, que é a demonstração viva.

**Citadas na aula**

- **MDN Web Docs, *How the web works — HTTP basics*** — documentação · ~4 min de leitura
  https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works#http_basics
  Mostra uma requisição HTTP crua de duas linhas (`GET /en-US/ HTTP/2` e o `Host:`), o `200` da resposta, e logo abaixo destrincha uma URL em protocolo, domínio e caminho.

- **MDN Web Docs, *Introdução ao lado servidor — programação do lado do servidor e do lado cliente são iguais?*** — documentação · ~3 min de leitura
  https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Extensions/Server-side/First_steps/Introduction#a_programação_do_lado_do_servidor_e_do_lado_cliente_são_iguais
  Separa as duas responsabilidades sem virar aula de linguagem: o cliente cuida de como a página parece e se comporta, o servidor decide qual conteúdo sai.

- **ViaCEP, *Webservice CEP e IBGE gratuito*** — documentação · ~4 min de leitura
  https://viacep.com.br/
  Contrato inteiro numa página só: o formato do endpoint, o JSON que volta, o `400` para CEP malformado e o `"erro": "true"` — string, não booleano — para CEP válido que não existe.

- **Next.js, *Route Handlers — Convention*** — documentação oficial · ~1 min de leitura (a seção)
  https://nextjs.org/docs/app/getting-started/route-handlers#convention
  Diz em quatro linhas o que é uma rota de servidor no Next.js: um arquivo `route.ts` dentro de `app/`, uma função exportada por método HTTP, e a regra de que `route.js` e `page.js` não convivem no mesmo caminho.

### 2.3 Banco, dados e a stack

**Sugerida**

- **Fireship, *SQL Explained in 100 Seconds*** — YouTube, abr/2021 · 2 min 23 s
  https://www.youtube.com/watch?v=zsjvFFKOm3c&hl=en&persist_hl=1
  Em dois minutos mostra tabela, linha, coluna e uma consulta rodando, que é o que ele precisa reconhecer para conferir o agente.

- **CockroachDB, *What is a Foreign Key Constraint? Understanding Primary & Foreign Keys*** — YouTube, canal oficial, jul/2021 · 3 min 52 s
  https://www.youtube.com/watch?v=5kiMg7GXAsY&hl=en&persist_hl=1
  As duas tabelas lado a lado, a de muitos apontando para a de um: relação um-para-muitos e chave estrangeira no mesmo vídeo, que é a seta que o Fireship não desenha.

**Citadas na aula**

- **MDN Web Docs, *JSON*** — glossário, em português · leitura ~2 min
  https://developer.mozilla.org/pt-BR/docs/Glossary/JSON
  Duas frases dão o vocabulário exato (objeto, array, aninhamento) e dizem o que JSON *não* representa.

- **Supabase, *Tables and Data*** — documentação, seção "Primary keys" · leitura ~1 min
  https://supabase.com/docs/guides/database/tables#primary-keys
  Define chave primária em quatro linhas, e duas seções abaixo mostra de onde vem a palavra "relacional".

- **Supabase, *Database Migrations*** — documentação, seção "Schema migrations" · leitura ~3 min
  https://supabase.com/docs/guides/deployment/database-migrations#schema-migrations
  Mostra uma mudança de schema virando arquivo datado e versionado, que é a resposta concreta a "por que dói mudar depois".

- **OWASP Cheat Sheet Series, *Authentication Cheat Sheet*** — documentação, seção "Authentication General Guidelines" · leitura ~15 min
  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-general-guidelines
  O tamanho da lista é o argumento: ID, senha, recuperação, hash, TLS, reautenticação, mensagem de erro, ataque automatizado.

### 2.4 Git como rede de segurança

**Sugerida**

- **ByteByteGo, *How Git Works: Explained in 4 Minutes*** — YouTube, nov/2023 · 4 min 18 s
  https://www.youtube.com/watch?v=e9lnsKot_SQ&hl=en&persist_hl=1
  As quatro áreas (diretório de trabalho, staging, repositório local, remoto) com os comandos como setas entre elas: o desenho que a prosa descreve e não consegue mostrar.

- **Philomatics, *Undo a git commit — git reset/revert — pushed/not pushed*** — YouTube, set/2024 · 3 min 27 s
  https://www.youtube.com/watch?v=GytsxgB4-HU&hl=en&persist_hl=1
  Se o commit ainda não subiu, `reset`; se já está no remoto, `revert` cria outro commit que desfaz, com o grafo nas duas situações. É a pergunta de aplicação do marco, respondida na tela.

- **Chris Beams, *How to Write a Git Commit Message*** — cbea.ms, ago/2014 · 12 min de leitura
  https://cbea.ms/git-commit/
  As sete regras que viraram o padrão de fato, e a sétima é a aula inteira: use o corpo da mensagem para explicar o quê e o porquê, nunca o como.

**Citadas na aula**

- **Chacon e Straub, *Pro Git*, cap. 1.3 "O que é Git?", seção "Os Três Estados"** — Apress / git-scm.com, 2ª edição · 3 min a seção
  https://git-scm.com/book/pt-br/v2/Primeiros-Passos-O-que-%C3%A9-Git%3F#_os_tr%C3%AAs_estados
  Meia página em português que fecha o modelo mental inteiro: modificado, preparado e commitado, e as três áreas correspondentes — diretório de trabalho, área de preparação e diretório .git.

- **Chacon e Straub, *Pro Git*, cap. 5.2 "Contribuindo com um Projeto", seção "Diretrizes de Commit"** — Apress / git-scm.com, 2ª edição · 4 min a seção
  https://git-scm.com/book/pt-br/v2/Git-Distribu%C3%ADdo-Contribuindo-com-um-Projeto#_commit_guidelines
  É a régua do próprio projeto Git para commit atômico e mensagem no imperativo, com o critério que interessa aqui: cada commit muda uma coisa só e a mensagem diz por quê.

- **Chacon e Straub, *Pro Git*, cap. 2.4 "Desfazendo Coisas"** — Apress / git-scm.com, 2ª edição · 8 min de leitura
  https://git-scm.com/book/pt-br/v2/Fundamentos-do-Git-Desfazendo-Coisas
  Traz `--amend`, tirar da preparação e descartar modificação nas duas formas, a antiga com `reset`/`checkout` e a nova com `restore`, e avisa em que ponto exato o desfazer passa a perder trabalho.

- **Katie Sylor-Miller, *Dangit, Git!?!*, versão em português** — dangitgit.com, 2016, tradução da comunidade · 6 min de leitura
  https://dangitgit.com/pt_BR
  Nove situações do ponto de vista de quem acabou de errar, e a primeira resposta é o `reflog`, que a aula chama de rede da rede e o Pro Git citado não cobre.

- **Anthropic, *Checkpointing*, seção "Limitations"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/checkpointing#limitations
  O contraste que a aula precisa, escrito pela própria Anthropic: o checkpoint não pega o que o bash mexeu, nem o que subagente editou, nem mudança feita fora da sessão, e a página fecha dizendo que ele não substitui controle de versão.

### 2.5 Branches, PRs e o remoto

**Sugerida**

- **Peter Cottle, *Learn Git Branching*, em português, níveis 1 a 3 da introdução** — learngitbranching.js.org · interativo, uns 10 min para os três níveis
  https://learngitbranching.js.org/?locale=pt_BR
  O aluno digita `git commit`, `git branch` e `git merge` numa página que desenha o grafo em tempo real: o commit vira um círculo, a branch uma etiqueta que anda, o merge o nó com dois pais. É a única forma de ele ver o grafo da 2.4 virar branch.

- **GitHub, *How to create a pull request in 4 min | GitHub for Beginners*** — YouTube, ago/2024 · 3 min 44 s
  https://www.youtube.com/watch?v=nCKdihvneS0&hl=en&persist_hl=1
  Canal oficial do GitHub: em menos de quatro minutos o aluno vê a tela do PR de verdade — o botão, o diff, o merge — que é o que falta para quem nunca abriu um.

- **GitHub, *How to merge a pull request | Introduction to GitHub*** — YouTube, canal oficial, ago/2024 · 3 min 23 s
  https://www.youtube.com/watch?v=FDXSgyDGmho&hl=en&persist_hl=1
  O segundo tempo: o PR aberto vira merge na tela, e no meio (1:05 a 2:56) aparece um conflito de verdade, com os marcadores e a decisão de qual versão vale.

**Citadas na aula**

- **Scott Chacon e Ben Straub, *Ramificação (Branching) e Mesclagem (Merging) Básicas*** — Pro Git, 2ª edição, tradução pt-br · ~10 min de leitura (~4 min só a Ramificação Básica)
  https://git-scm.com/book/pt-br/v2/Ramifica%C3%A7%C3%A3o-Branching-no-Git-Ramifica%C3%A7%C3%A3o-Branching-e-Mesclagem-Merging-B%C3%A1sicas#_basic_branching
  Conta a história inteira em um exemplo: você está no meio da tarefa 53, chega um bug urgente, você troca de branch, resolve, volta e o trabalho continua onde estava — e a mesma página termina em conflito de merge, com os marcadores na tela.

- **GitHub, *About pull requests*** — GitHub Docs · ~2 min de leitura
  https://docs.github.com/en/pull-requests/get-started/about-pull-requests#key-parts-of-a-pull-request
  Lista o que um PR junta — Conversation, Commits, Checks, Files changed e a merge box — e é exatamente por isso que ele é a unidade de revisão: a conversa, o histórico, os testes e o diff no mesmo lugar.

- **Philomatics, *Never fear merge conflicts again — git merge/pull tutorial*** — YouTube, mai/2024 · 5 min 12 s
  https://www.youtube.com/watch?v=DloR0BOGNU0&hl=en&persist_hl=1
  Só sobre conflito, no terminal: como ler os marcadores, como abortar o merge se travar, e como fechar depois de escolher.

- **Scott Chacon e Ben Straub, *Branches Remotos (Remote Branches)*** — Pro Git, 2ª edição, tradução pt-br · ~11 min de leitura (~3 min só a seção de push)
  https://git-scm.com/book/pt-br/v2/Ramifica%C3%A7%C3%A3o-Branching-no-Git-Branches-Remotos-Remote-Branches#_pushing_branches
  Diz a frase que desfaz a confusão mais comum de quem acabou de aprender git local: branches locais não são sincronizados sozinhos com o remoto, você empurra explicitamente o que quer compartilhar.

- **GitHub, *Reviewing proposed changes in a pull request*** — GitHub Docs · ~9 min de leitura (~2 min a seção Starting a review)
  https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request#starting-a-review
  Mostra onde o diff mora (aba Files changed), como alternar entre visão unificada e lado a lado, e como o comentário gruda numa linha específica — que é o que o revisor adversarial precisa apontar.

### 2.6 Segredos e ambientes

**Sugerida**

- **Zeljka Zorz, *The shocking speed of AWS key exploitation*** — Help Net Security, dez/2024 · 3 min de leitura
  https://www.helpnetsecurity.com/2024/12/02/revoke-exposed-aws-keys/
  Chaves plantadas de propósito no GitHub foram usadas em média 6,6 minutos depois do push, e o alerta da AWS chegou em 1,4: apagar o commit depois disso não protege nada.

- **Mario Souto (Dev Soutinho), *Controlando valores de DEV, PROD e dados sensíveis com variáveis de ambiente*** — YouTube, em português, set/2020 · 17 min no total, dois trechos: de 0:00 a 3:00 e de 13:44 a 15:21
  https://www.youtube.com/watch?v=BP2KQtCyzo8&hl=en&persist_hl=1
  Criador brasileiro explicando, em português, que o mesmo código lê valores diferentes conforme onde roda; e no segundo trecho a pegadinha da pergunta do marco: variável que o front lê vai parar no JavaScript que o navegador baixa.

- **Vercel, *Environments on Vercel*** — YouTube, canal oficial, jan/2024 · 11 min 34 s no total, trecho de 2 min, de 3:08 a 5:23
  https://www.youtube.com/watch?v=nZrAgov_-D8&hl=en&persist_hl=1&t=188s
  A branch virando um endereço próprio de preview e a produção ficando intocada, na tela da própria Vercel: a cena que ele vai reproduzir na oficina com a P1.

- **Joe Leon, *Anyone can Access Deleted and Private Repository Data on GitHub*** — Truffle Security, julho/2024 · 9 min de leitura
  https://trufflesecurity.com/blog/anyone-can-access-deleted-and-private-repo-data-github
  Demonstra que commit de fork apagado, de repositório apagado e de repositório que virou privado continua acessível pelo hash, e conclui que rotacionar a chave é a única remediação real.

**Citadas na aula**

- **Vercel, *How to use environment variables in Next.js*** — documentação do Next.js · 6 min de leitura
  https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
  Explica que o prefixo `NEXT_PUBLIC_` faz o valor ser gravado dentro do JavaScript entregue ao navegador: é a prova, na documentação oficial, de que existe uma diferença dura entre variável do servidor e variável pública.

- **GitHub, *Secret scanning and push protection are enabled by default on new public repositories*** — GitHub Changelog, mar/2024 · 1 min de leitura
  https://github.blog/changelog/2024-03-11-secret-scanning-and-push-protection-are-enabled-by-default-on-new-public-repositories/
  Todo repositório público novo de conta pessoal já bloqueia o push de chave conhecida: se a mensagem aparecer no terminal, não é erro, é a rede do GitHub.

- **GitHub, *Remover dados confidenciais de um repositório*** — GitHub Docs, em português · 10 min de leitura
  https://docs.github.com/pt/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository#about-removing-sensitive-data-from-a-repository
  A própria documentação do GitHub diz que o primeiro passo é revogar ou trocar o segredo, e que reescrever o histórico pode nem ser necessário depois disso — é a ordem invertida do que o aluno imagina.

- **Adam Wiggins, *III. Configurações*, The Twelve-Factor App** — 12factor.net, 2011, revisto em 2017 · 3 min de leitura
  https://12factor.net/pt_br/config
  Traz o teste que resolve a dúvida de uma vez: se o repositório pudesse virar público agora mesmo, sem vazar nenhuma credencial, a configuração está no lugar certo.

- **Vercel, *Environments* — seção Preview Environment** — documentação da Vercel · 2 min de leitura
  https://vercel.com/docs/deployments/environments#preview-environment-pre-production
  Lista exatamente o que dispara um preview (commit fora da branch de produção, pull request, `vercel` sem `--prod`) e a diferença entre a URL da branch e a URL do commit.

### 2.7 Projeto que não é seu

**Sugerida**

- **GitHub, *Ajudando outras pessoas a revisar suas alterações*** — GitHub Docs, em português · 2 min a seção
  https://docs.github.com/pt/pull-requests/concepts/helping-others-review-your-changes#making-your-changes-easy-to-review
  O que faz um PR revisável, e é o que a fluência pede: mantê-lo pequeno, dar contexto e dizer onde olhar primeiro, revisar o próprio diff antes de pedir revisão a alguém, e olhar o que a mudança abre de segurança.

- **Nicolas Carlo, *The key points of Working Effectively with Legacy Code*** — understandlegacycode.com · ~10 min de leitura
  https://understandlegacycode.com/blog/key-points-of-working-effectively-with-legacy-code/
  O resumo do livro de Michael Feathers que a ementa cita: código sem teste é código legado, o dilema de que para testar é preciso mudar e para mudar com segurança é preciso testar, e as receitas de mudança mínima para encaixar o novo sem reescrever o velho.

**Citadas na aula**

- **202 Lab, *Verificador de certificados da 202*** — repositório no GitHub, Node com Express e EJS · README e CONTRIBUTING em ~8 min
  https://github.com/matheus-fondello/202-certificados
  O projeto da aula, com as seis issues abertas: é o código que confere se um certificado da trilha é verdadeiro, e é dele que sai a cópia do aluno.

- **Anthropic, *Common workflows*, seção "Understand new codebases"** — documentação do Claude Code · 3 min a seção
  https://code.claude.com/docs/en/common-workflows#understand-new-codebases
  As perguntas que dão o mapa de um projeto que se acabou de abrir — visão geral, onde mora cada parte, como um fluxo atravessa o código — na forma de receita, em vez de "leia o repositório".

- **Anthropic, *How Claude remembers your project*, seção "Set up a project CLAUDE.md"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/memory#set-up-a-project-claude-md
  O que o `/init` faz quando o projeto não tem nada: analisa o repositório e escreve um CLAUDE.md com comandos de build, instruções de teste e as convenções que encontrou.

- **Google, *Small CLs*** — guia de engenharia do Google, em inglês · ~8 min de leitura
  https://google.github.io/eng-practices/review/developer/small-cls.html
  A lista de por que mudança pequena vence: é revisada mais rápido e mais a fundo, introduz menos bug, desperdiça menos trabalho quando a direção estava errada e é mais simples de reverter.

- **GitHub, *Verificações de status*** — GitHub Docs, em português · 5 min de leitura
  https://docs.github.com/pt/pull-requests/reference/status-checks
  Diz o que o sinal do CI no PR significa: que os commits atendem às condições do repositório, o que está rodando, o que passou e o que precisa de atenção.

- **GitHub, *Como criar uma solicitação de pull*** — GitHub Docs, em português · 6 min de leitura
  https://docs.github.com/pt/pull-requests/how-tos/create-pull-requests/creating-a-pull-request
  O passo a passo do PR entre duas branches do mesmo repositório, que é o caso dele, e a nota de que fork só entra quando não se tem permissão de escrita — na cópia dele, tem.

### 2.8 O problema bem definido

**Sugerida**

- **Radek Sienkiewicz (VelvetShark), *Stop prompting Claude Code — let it interview you (the "spec" workflow)*** — YouTube, jan/2026 · 9 min 7 s no total, trecho de 4 min 44 s, de 0:00 a 4:44
  https://www.youtube.com/watch?v=ob9WWuYlS5Q&hl=en&persist_hl=1
  O prompt de entrevista rodando de verdade: uma frase vira spec depois de trinta e duas perguntas. É o que ele acabou de fazer, visto de fora, com número para calibrar expectativa.

- **Sean Grove, *The New Code*** — YouTube, canal AI Engineer, jul/2025 · 21 min 35 s
  https://www.youtube.com/watch?v=8rABwKRsec4&hl=en&persist_hl=1
  Argumenta que o código é uma projeção com perda da spec, que hoje se joga fora o prompt e se guarda o código gerado (o contrário de guardar a fonte), e mostra o Model Spec da OpenAI como spec versionada, com teste por cláusula.

**Citadas na aula**

- **Joel Spolsky, *Painless Functional Specifications – Part 2: What's a Spec?*** — Joel on Software, out/2000 · ~8 min de leitura
  https://www.joelonsoftware.com/2000/10/03/painless-functional-specifications-part-2-whats-a-spec/
  Lista o que uma spec carrega e tem a seção "Nongoals": a lista do que não vai existir, escrita, porque todo mundo tem a funcionalidade favorita e fazer todas custa infinito.

- **Anthropic, *Best practices*, seção "Let Claude interview you"** — documentação do Claude Code · 2 min de leitura (a seção)
  https://code.claude.com/docs/en/best-practices#let-claude-interview-you
  Traz o prompt de entrevista em quatro linhas, manda escrever o SPEC.md no fim, e diz na frase seguinte que a execução começa em sessão nova, com o que a spec mais útil tem: o que fica de fora e uma verificação ponta a ponta.

- **Harper Reed, *My LLM codegen workflow atm*** — harper.blog, fev/2025 · ~13 min de leitura
  https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/
  É a origem do padrão: "uma pergunta de cada vez", cada uma construída sobre a resposta anterior, a spec compilada no fim e salva como `spec.md` no repositório, e o plano feito em outra conversa.

### 2.9 Critérios de aceitação e decomposição

**Sugerida**

- **Ralph Jocham, *Vertical Slicing and Sprint Goals*** — canal Scrum.org no YouTube, série Scrum Tapas, dez/2023 · 2 min 42 s
  https://www.youtube.com/watch?v=urZ1TIycedU&hl=en&persist_hl=1
  Fatia vertical em menos de três minutos, por um Professional Scrum Trainer, com o mesmo argumento da aula: atravessa a pilha inteira.

- **Henrik Kniberg, *Making sense of MVP — and why I prefer Earliest Testable/Usable/Lovable*** — Crisp's Blog, jan/2016 · ~15 min de leitura
  https://blog.crisp.se/2016/01/25/henrikkniberg/making-sense-of-mvp
  O desenho do skate e do carro: entregar uma roda por vez não serve para ninguém, entregar um skate inteiro serve e ensina — e o primeiro corte é o que responde à maior dúvida, não o mais bonito.

**Citadas na aula**

- **Martin Fowler, *Given When Then*** — martinfowler.com, ago/2013 · ~3 min de leitura
  https://martinfowler.com/bliki/GivenWhenThen.html
  Dá nome à forma que a aula pede: *given* é o estado antes, *when* é a ação, *then* é o resultado esperado — e diz que a mesma estrutura serve em prosa informal, sem ferramenta.

- **Anthropic, *Best practices*, seção "Give Claude a way to verify its work"** — documentação do Claude Code · 4 min a seção
  https://code.claude.com/docs/en/best-practices#give-claude-a-way-to-verify-its-work
  A primeira linha da tabela é um critério de aceitação inteiro: em vez de "implemente uma função que valida e-mail", os três exemplos com o resultado esperado de cada um.

- **Alistair Mavin, *EARS: Easy Approach to Requirements Syntax*** — alistairmavin.com, página do criador do método · 5 min de leitura
  https://alistairmavin.com/ears/
  Um segundo formalismo para critério verificável, mais rígido que o Given-When-Then: "while precondição, when gatilho, o sistema shall resposta", criado para sistema crítico e hoje citado em spec para agente.

- **Anthropic, *Best practices*, seção "Let Claude interview you"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/best-practices#let-claude-interview-you
  O último parágrafo é a definição de spec útil que esta aula cobra: nomeia arquivos e interfaces, diz o que fica fora, e termina com uma verificação ponta a ponta que prova que a feature funciona.

- **Edsger W. Dijkstra, *On the foolishness of "natural language programming"* (EWD 667)** — E.W. Dijkstra Archive, Universidade do Texas, c. 1978 · ~5 min de leitura
  https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html
  Argumenta que a naturalidade da língua é a facilidade de dizer coisas cujo absurdo não é óbvio, e que o símbolo formal é privilégio, não fardo: é a objeção mais forte à tese de que a spec é o código.

### 2.10 Testes e TDD com agentes

**Sugerida**

- **Matt Pocock, *Red Green Refactor is OP With Claude Code*** — YouTube, canal do autor · 5 min 19 s
  https://www.youtube.com/watch?v=hYZdIwFIy-c&hl=en&persist_hl=1
  O mesmo autor citado na 1.7 rodando vermelho, verde, refatorar com o Claude Code de verdade, na ferramenta que o aluno usa.

- **Jeongho Nam, *AI Deleted My Tests and Said "All Tests Pass" — A Horror Story from Porting `typia` from TypeScript to Go*** — DEV Community, mai/2025 · 9 min de leitura
  https://dev.to/samchon/ai-deleted-my-tests-and-said-all-tests-pass-a-horror-story-from-porting-typia-from-typescript-2bmf
  O mantenedor de uma biblioteca real contando quatro tentativas de portar o projeto com agente, três delas trapaceando de formas diferentes: apagar teste, tabela de busca no lugar da lógica, categoria de teste excluída do CI em segredo.

**Citadas na aula**

- **Martin Fowler, *Test Pyramid*** — martinfowler.com (bliki), mai/2012 · ~4 min de leitura
  https://martinfowler.com/bliki/TestPyramid.html
  A figura dos três tipos de teste com o custo de cada um, e a razão de ter muitos embaixo e poucos em cima: o de ponta a ponta pela tela é frágil, caro de escrever e lento de rodar.

- **Kent Beck, *Canon TDD*** — Software Design: Tidy First? (boletim do autor), dez/2023 · ~6 min de leitura
  https://newsletter.kentbeck.com/p/canon-tdd
  Os cinco passos do TDD como o autor do método os escreve, e os erros que ele lista: escrever todos os testes antes, teste sem afirmação só para cobertura, e refatorar no meio da implementação.

- **Kent Beck, *Augmented Coding: Beyond the Vibes*** — Software Design: Tidy First? (boletim do autor), jun/2025 · ~8 min de leitura
  https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes
  O autor do TDD rodando o loop com um agente: "implement the test, then implement only enough code to make that test pass", e o sinal de que o gênio está trapaceando, "disabling or deleting tests".

- **Anthropic, *Automate actions with hooks*, seção "Auto-format code after edits"** — documentação do Claude Code · 2 min de leitura (a seção)
  https://code.claude.com/docs/en/hooks-guide#auto-format-code-after-edits
  O hook de `PostToolUse` com o filtro `Edit|Write`, que roda um comando depois de cada edição; trocar o formatador pelo comando de teste é o hook da fluência.

### 2.11 Debugging sem ler código

**Sugerida**

- **Julia Evans, *A debugging manifesto*** — jvns.ca, dez/2022 · ~4 min de leitura
  https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/
  Oito princípios em uma página, e o primeiro é a aula inteira: "inspect, don't squash", deixe o bug no lugar e entenda o que aconteceu antes de mexer, porque consertar sem entender costuma deixar mais confuso, não menos.

- **MIT OpenCourseWare, *What is "rubber duck debugging?"*** — YouTube, canal oficial do MIT OCW · 5 min 15 s
  https://www.youtube.com/watch?v=f98ogUP80KI&hl=en&persist_hl=1
  Ana Bell, do MIT, demonstrando ao vivo o instrumento que a aula chama de mais subestimado: explicar o caminho do valor em voz alta e ver o erro aparecer no meio da explicação, com um pato em vez do Claude.

- **Daniel R. Collins, *Syntax vs. logic errors*** — YouTube, canal do autor (professor de Ciência da Computação, CUNY) · 1 min 35 s
  https://www.youtube.com/watch?v=SYDKQqAJ7UU&hl=en&persist_hl=1
  Os dois tipos de erro lado a lado, com código na tela: um que a linguagem recusa, outro que roda liso e devolve o número errado.

**Citadas na aula**

- **Andreas Zeller, *Introduction to Debugging — The Scientific Method*, The Debugging Book** — livro aberto (CC BY-NC-SA), edição de 2024 · ~4 min de leitura (a seção)
  https://www.debuggingbook.org/html/Intro_Debugging.html#The-Scientific-Method
  Os cinco passos, escritos como ciência e não como truque: pergunta, hipótese, predição, experimento, e repetir até a hipótese não ter mais o que explicar.

- **David A. Wheeler, *Review of "Debugging" by David J. Agans*** — dwheeler.com, mar/2004 · ~8 min de leitura
  https://dwheeler.com/essays/debugging-agans.html
  Resume as nove regras de Agans com os subpontos de cada uma, e três delas são esta aula: "quit thinking and look", "change one thing at a time" e "if you didn't fix it, it ain't fixed".

- **Anthropic, *Best practices for Claude Code — Course-correct early and often*** — documentação oficial · ~2 min de leitura (a seção)
  https://code.claude.com/docs/en/best-practices#course-correct-early-and-often
  Diz com todas as letras a regra das duas correções: mais de duas no mesmo problema e o contexto está cheio de tentativas falhas; `/clear` e um prompt melhor com o que se aprendeu vence a sessão longa quase sempre.

### 2.12 Revisão adversarial

**Sugerida**

- **Google, *What to look for in a code review*** — Google Engineering Practices, 2019 · 8 min de leitura
  https://google.github.io/eng-practices/review/reviewer/looking-for.html
  A lista inteira do que um revisor procura, do desenho ao teste, com a distinção que a fluência precisa: funcionalidade e teste são lacuna, nome e estilo são preferência.

- **Jeff Atwood, *The Ten Commandments of Egoless Programming*** — Coding Horror, mai/2006, a partir de Gerald Weinberg (1971) · 3 min de leitura
  https://blog.codinghorror.com/the-ten-commandments-of-egoless-programming/
  Dez frases sobre separar o código de quem o escreveu: você não é o seu código, critique o código e não a pessoa, revisão existe para achar problema.

**Citadas na aula**

- **Anthropic, *Create custom subagents*, seção "Manage subagent context"** — documentação do Claude Code · 3 min a seção
  https://code.claude.com/docs/en/sub-agents#manage-subagent-context
  Diz em uma frase o que o revisor não vê: a conversa, as skills já carregadas e os arquivos já lidos; ele parte só da tarefa que recebe.

- **Anthropic, *Best practices*, seção "Add an adversarial review step"** — documentação do Claude Code · 3 min a seção
  https://code.claude.com/docs/en/best-practices#add-an-adversarial-review-step
  O pedido modelo, contra um plano: cada requisito implementado, os casos de borda com teste, nada fora do escopo mudou; lacunas, não preferências. Troque o plano pela spec e é o pedido da fluência.

- **Anthropic, *Code Review*, seção "Review a diff locally"** — documentação do Claude Code · 4 min a seção
  https://code.claude.com/docs/en/code-review#review-a-diff-locally
  O que o `/code-review` faz: revisa num subagente com contexto próprio, caça bug de correção e limpeza, aceita um alvo, e o nível de esforço troca cobertura por confiança.

- **Anthropic, *Best practices*, seção "Run multiple Claude sessions"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/best-practices#run-multiple-claude-sessions
  A tabela escritor e revisor em duas sessões, com a frase que justifica o desenho: contexto novo melhora a revisão porque o modelo não fica do lado do código que acabou de escrever.

- **Google, *The Standard of Code Review*** — Google Engineering Practices, 2019 · 5 min de leitura
  https://google.github.io/eng-practices/review/reviewer/standard.html
  Não existe código perfeito, só código melhor; e fato técnico vence opinião e preferência. É a régua para decidir o que entra na caixa de corrigir.

- **Google, *How to write code review comments*, seção "Label comment severity"** — Google Engineering Practices, 2019 · 1 min a seção
  https://google.github.io/eng-practices/review/reviewer/comments.html#label-comment-severity
  Três rótulos que um revisor humano usa: nit, opcional, só para saber. Se o revisor do aluno não rotula, ele rotula; é a mesma triagem.

- **Google, *What to look for in a code review*, seção "Complexity"** — Google Engineering Practices, 2019 · 1 min a seção
  https://google.github.io/eng-practices/review/reviewer/looking-for.html#complexity
  Resolva o problema que existe agora, não o que alguém especula que pode existir: é a definição de excesso de engenharia que o aluno usa para recusar achado com motivo.

### 2.13 Segurança e dados

**Sugerida**

- **Aikido Security, *Broken Access Control Explained: OWASP Top 10 A01 Explained with Examples*** — YouTube, set/2024 · 7 min 3 s no total, trecho de 4 min 22 s, de 0:00 a 4:22
  https://www.youtube.com/watch?v=vUFVxoV5y_I&hl=en&persist_hl=1
  Controle de acesso quebrado com o vazamento de 2022 da Optus, quase dez milhões de clientes: um identificador sequencial numa API sem checar quem pede, a mesma forma do Carlos trocando o número no endereço da Renata.

**Citadas na aula**

- **Supabase, *Row Level Security*, seção "Understand Row Level Security"** — documentação do Supabase · 3 min de leitura (a seção)
  https://supabase.com/docs/guides/database/postgres/row-level-security#understand-row-level-security
  A regra por linha como o banco a escreve: uma política que só devolve as linhas em que o dono é quem está logado, e a explicação de que ela funciona como um filtro que a consulta não consegue tirar.

- **OWASP, *OWASP Top 10:2025*** — owasp.org, edição 2025 · ~5 min a página inicial
  https://top10.owasp.org/2025
  Os dez riscos mais comuns em aplicações web, com controle de acesso quebrado em primeiro (A01) e injeção em quinto (A05): é a lista que o subagente de segurança recebe como checklist.

- **OWASP, *2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps*** — genai.owasp.org, edição 2025 · ~5 min a página inicial
  https://genai.owasp.org/llm-top-10/
  A lista irmã para sistemas com modelo de linguagem, com injeção de prompt em primeiro (LLM01) e vazamento de informação sensível em segundo: entra aqui como aviso e volta na P3.

- **Brasil, *Lei nº 13.709/2018 (LGPD)*, art. 5º, 6º e 20** — Planalto, ago/2018, texto consolidado · 5 min os três artigos
  https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm#art5
  As definições de dado pessoal e sensível (art. 5º, I e II), os princípios de finalidade e necessidade (art. 6º, I e III) e o direito à revisão de decisão automatizada (art. 20), que são os três pontos que a aula usa.

- **Jeniffer Mendonça, *CPF, endereço e renda: ONG revela comércio de dados pessoais no Telegram*** — Núcleo Jornalismo, mar/2026 · ~4 min de leitura
  https://nucleo.jor.br/curtas/2026-03-12-cpf-endereco-e-renda-ong-revela-comercio-de-dados-pessoais-no-telegram/
  O levantamento da Derechos Digitales com dez grupos brasileiros do Telegram vendendo CPF, endereço e renda por bot, com dado que só pode ter saído de base vazada: é o exemplo de fonte vazada contra fonte pública.

### 2.14 Harness engineering

**Sugerida**

- **Thariq Shihipar, Sid Bidasaria e Robert Boyce, *How the Claude Code team uses Claude Code*, trecho "from tool calls to goals"** — canal oficial Claude no YouTube, set/2026 · 22 min no total, trecho de 1 min 42 s, de 0:35 a 2:17
  https://www.youtube.com/watch?v=S-sYlFiGFv8&hl=en&persist_hl=1&t=35s
  A própria equipe do Claude Code, com nome e cargo, contando por que passou a dar objetivo em vez de tarefa passo a passo: o time que constrói o harness desta sala dizendo que harness é decisão de design.

- **Geoffrey Litt, *Understanding is the new bottleneck*** — geoffreylitt.com, jul/2026 · ~11 min de leitura
  https://www.geoffreylitt.com/2026/07/02/understanding-is-the-new-bottleneck
  Argumenta que entender o código deixou de ser para conferir e passou a ser para participar: sem modelo mental você não consegue nem propor o próximo passo. Fecha a aula virando o harness do agente para o lado de quem opera.

**Citadas na aula**

- **Birgitta Böckeler, *Harness engineering for coding agent users*** — martinfowler.com, abr/2026 · ~14 min de leitura
  https://martinfowler.com/articles/harness-engineering.html
  Define harness como "tudo num agente menos o modelo" e organiza as peças em guias (antes de agir) e sensores (depois de agir), computacionais ou inferenciais — é o vocabulário que a aula inteira usa.

- **Anthropic (Applied AI), *Effective context engineering for AI agents*** — Anthropic Engineering, set/2025 · ~15 min de leitura
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  Explica context rot e as três saídas para tarefa longa — compactação, anotação em disco e subagente —, que é exatamente o que a aula chama de carregar sob demanda e usar o disco como memória.

- **Birgitta Böckeler, *Maintainability sensors for coding agents*** — martinfowler.com, mai/2026 · ~33 min de leitura
  https://martinfowler.com/articles/sensors-for-coding-agents.html
  Sensor por sensor com o que ela achou na prática: linter com mensagem escrita para o agente, regra de dependência, dado de acoplamento, revisão de modularidade pelo próprio modelo, suíte de testes como sensor de regressão e teste de mutação.

- **Anthropic, *Run Claude Code programmatically*** — documentação do Claude Code · ~10 min de leitura
  https://code.claude.com/docs/en/headless
  A flag `-p`, o formato de saída em JSON e o que mais um script precisa para chamar o modelo uma vez por item e ler a resposta.

- **Addy Osmani, *The 70% problem: Hard truths about AI-assisted coding*** — Elevate (newsletter do autor), dez/2024 · ~11 min de leitura
  https://addyo.substack.com/p/the-70-problem-hard-truths-about
  Nomeia onde mora o resto: caso de borda, depuração que gera novo defeito, estado de tela inacabado, acessibilidade, desempenho em aparelho lento — e por que quem não tem modelo mental do código fica preso ali.

## Módulo 3

### 3.1 O modelo por dentro

**Sugerida**

- **Louis-François Bouchard, *Base Model vs Instruct Model*** — What's AI, YouTube, dez/2025 · 1 min 20 s
  https://www.youtube.com/watch?v=TRVmuskzE5Y&hl=en&persist_hl=1
  Em oitenta segundos: o modelo base só continua texto e não tenta ajudar; o modelo instruído foi treinado para seguir instrução. Mesmo conhecimento, comportamento diferente.

- **Sebastian Raschka, *Reinforcement Learning with Human Feedback (RLHF) in 4 minutes*** — YouTube, fev/2025 · 4 min 6 s
  https://www.youtube.com/watch?v=vJ4SsfmeQlk&hl=en&persist_hl=1
  Como a preferência humana vira sinal de treino, por um autor de referência em ML aplicado: é o pedaço do pós-treino que a aula menciona e nenhuma outra referência aprofunda.

- **Andrej Karpathy, *Deep Dive into LLMs like ChatGPT*** — YouTube, fev/2025 · 3h31min
  https://www.youtube.com/watch?v=7xTGNNLPyMI&hl=en&persist_hl=1
  O único material geral que percorre a pilha inteira de treino, do dado bruto da internet ao modelo que se comporta como assistente, sem exigir matemática do espectador.

**Citadas na aula**

- **Anthropic, *Claude's Character*** — anthropic.com, jun/2024 · ~8 min de leitura
  https://www.anthropic.com/research/claude-character
  O laboratório descrevendo, em primeira pessoa, que traços de comportamento do assistente foram treinados de propósito depois do pré-treino, e não emergiram sozinhos.

- **Anthropic (Applied AI), *Effective context engineering for AI agents*** — Anthropic Engineering, set/2025 · ~15 min de leitura
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  Trata contexto como recurso finito e defende buscar informação no momento do uso, por referência leve, em vez de despejar tudo no prompt.

- **Anthropic, *Models overview*, seção "Compare models"** — platform.claude.com · ~2 min de leitura
  https://platform.claude.com/docs/en/models/overview#latest-models-comparison
  A tabela com latência comparativa, preço por milhão de tokens de entrada e de saída e tamanho de janela lado a lado: é a conta que decide qual modelo usar.

- **Anthropic, *Thinking*, seção "How thinking works"** — platform.claude.com · ~2 min de leitura
  https://platform.claude.com/docs/en/build-with-claude/thinking#how-thinking-works
  Mostra o raciocínio como blocos de conteúdo que chegam antes da resposta, resumidos e cobrados como saída — thinking é texto gerado e pago, não um modo mágico.

### 3.2 Produto que usa IA

**Sugerida**

- **Apple Support, *How to use Writing Tools with Apple Intelligence*** — YouTube, canal oficial (UK), abr/2026 · 1 min 34 s
  https://www.youtube.com/watch?v=iCKG5rDteXY&hl=en&persist_hl=1
  Corrigir, resumir e reescrever dentro de qualquer campo de texto do sistema, sem abrir chat nenhum: os formatos transformar e extrair acontecendo no fluxo de escrita de alguém.

- **GitHub, *Code Completion Made Easy with GitHub Copilot*** — YouTube, canal oficial, dez/2024 · 58 s
  https://www.youtube.com/watch?v=Wk1GVJWt2JA&hl=en&persist_hl=1
  Sugestão de código aparecendo enquanto se digita, aceita com Tab: o formato gerar no fluxo, sem chat, e familiar porque é o que o Claude Code faz na oficina.

- **Maggie Appleton, *Language Model Sketchbook, or Why I Hate Chatbots*** — maggieappleton.com, jun/2023 · ~6 min de leitura
  https://maggieappleton.com/lm-sketchbook
  Três esboços de interface que não são chat — sugestões que aparecem enquanto se escreve, cadeias de causa e consequência, menu de botão direito — com o argumento de que o chat é a solução preguiçosa.

**Citadas na aula**

- **Anthropic, *Ticket routing* — seção "Build a strong prompt"** — Claude Platform Docs, sem data · ~5 min de leitura
  https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing#build-a-strong-prompt
  Uma feature de classificar inteira, do jeito que ela existe em produção: ticket em texto livre entra, uma categoria de uma lista fechada sai.

- **Google PAIR, *User Needs + Defining Success* — seção "When AI is probably not better"** — People + AI Guidebook, 2019 · ~1 min de leitura (a seção)
  https://pair.withgoogle.com/chapter/user-needs/#when-ai-is-probably-not-better
  Seis situações em que a regra ganha do modelo, com exemplo em cada uma: previsibilidade, informação estática, erro caro, transparência, pressa de ir ao mercado, e tarefa que ninguém quer automatizada.

- **Erik S. e Barry Zhang, *Building effective agents* — seção "When (and when not) to use agents"** — Anthropic Engineering, dez/2024 · ~1 min de leitura (a seção)
  https://www.anthropic.com/engineering/building-effective-agents#when-and-when-not-to-use-agents
  Cem palavras que dizem para achar a solução mais simples possível e só subir a complexidade quando ela se justifica, incluindo a hipótese de não construir nada agêntico.

- **Anthropic, *Optimizing for cost and intelligence* — seção "Compare models on cost per task"** — Claude Platform Docs, sem data · ~3 min de leitura (a seção)
  https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence#compare-models-on-cost-per-task
  Números reais de custo por tarefa concluída, e o caso em que o modelo mais caro por token sai mais barato no fim, que é onde a intuição de preço costuma errar.

- **Google PAIR, *Errors + Graceful Failure*, seção "Provide paths forward from failure"** — People + AI Guidebook, 2019 · 3 min a seção
  https://pair.withgoogle.com/chapter/errors-failing/#section3
  O que pôr na tela quando a IA erra: focar no que a pessoa pode fazer a seguir, não só admitir a falha, com o exemplo do garçom que oferece alternativa em vez de dizer "acabou".

### 3.3 Chamar um modelo

**Sugerida**

- **Google, *Vamos começar* — seções 1 a 4** — Gemini API Docs, em português, atualizada em out/2026 · ~7 min de leitura (as quatro seções)
  https://ai.google.dev/gemini-api/docs/quickstart?hl=pt-br
  A chave, a primeira chamada com a resposta e os tokens à vista, o streaming, e a conversa de vários turnos nos dois jeitos, com estado e sem estado: a aula inteira na mesma página, em português.

**Citadas na aula**

- **Google, *Geração de texto* — seção "Instruções do sistema e outras configurações"** — Gemini API Docs, em português, atualizada em set/2026 · ~4 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/text-generation?hl=pt-br#system-instructions
  O system como campo próprio da chamada, separado da entrada, e os ajustes de geração num bloco à parte, o `generation_config`.

- **Google, *Interactions API* — referência** — Gemini API Docs, em inglês, sem data · consulta, não leitura
  https://ai.google.dev/api/interactions-api
  A referência do endpoint: `model`, `input`, `system_instruction`, `generation_config.max_output_tokens`, `stream`, `store`, os eventos do streaming e o `usage` com `total_input_tokens` e `total_output_tokens`.

- **Google, *Como usar chaves da API Gemini* — seção "Regras de segurança críticas"** — Gemini API Docs, em português, atualizada em set/2026 · ~3 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/api-key?hl=pt-br#critical-security-rules
  A regra dita pelo próprio provedor: chave fora do Git, e chave em app web ou móvel pode ser extraída pelo usuário; para app do lado do cliente, um servidor no meio faz a chamada.

- **Google, *Google Gen AI SDK for TypeScript and JavaScript* — aviso "API Key Security"** — GitHub, README oficial, em inglês · ~2 min de leitura
  https://github.com/googleapis/js-genai
  O SDK roda no navegador e não impede ninguém: só avisa para não expor a chave no código do cliente. A trava é o desenho dele, não a biblioteca.

- **Vercel, *How to use environment variables in Next.js* — seção "Bundling Environment Variables for the Browser"** — Next.js Docs, atualizado em ago/2026 · ~8 min de leitura
  https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
  O mecanismo exato pelo qual a chave vazaria na oficina dele: o prefixo `NEXT_PUBLIC_` embute o valor no pacote que vai para o navegador, e sem o prefixo a variável só existe no servidor.

- **Google, *Geração de texto* — seção "Conversas sem estado"** — Gemini API Docs, em português, atualizada em set/2026 · ~2 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/text-generation?hl=pt-br#stateless-conversations
  O histórico montado e enviado por quem chama, a cada vez: é o caso da P3, em que cada mensagem é chamada nova e a montagem é dele.

- **Google, *Entender e contar tokens* — seção "Contar tokens multiturno"** — Gemini API Docs, em português, atualizada em set/2026 · ~3 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/tokens?hl=pt-br#multi-turn-tokens
  A prova de que o modelo relê tudo: mesmo quando o servidor guarda a conversa, o uso da segunda rodada inclui os tokens das duas.

- **Google, *Geração de texto* — seção "Respostas de streaming"** — Gemini API Docs, em português, atualizada em set/2026 · ~3 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/text-generation?hl=pt-br#streaming-responses
  A mesma chamada com `stream: true`, e o laço que recebe os pedaços de texto um a um: é o diff mínimo entre as duas.

- **MDN, *Using server-sent events*** — MDN Web Docs, atualizado em set/2026 · ~12 min de leitura, só em inglês
  https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
  O padrão por baixo do streaming, que é o mesmo que o quickstart do Gemini nomeia.

- **Google, *Preços da API Gemini Developer*** — Gemini API Docs, em português, atualizada em out/2026 · consulta, não leitura
  https://ai.google.dev/gemini-api/docs/pricing?hl=pt-br
  A coluna "Nível sem custo financeiro" diz quais modelos estão no gratuito hoje; é dali que ele escolhe o modelo, e é a mesma página que a 3.4 usa para o quanto custaria.

- **Groq, *Quickstart*** — GroqDocs, em inglês, sem data · ~4 min de leitura
  https://console.groq.com/docs/quickstart
  A alternativa, se o Gemini não abrir para ele: onde nasce a chave, a variável `GROQ_API_KEY`, e a chamada no formato de lista de mensagens com papéis.

- **Groq, *Rate Limits*** — GroqDocs, em inglês, sem data · consulta, não leitura
  https://console.groq.com/docs/rate-limits
  A tabela do plano Free, que é a lista dos modelos que ele pode usar de graça.

- **Rajasekaran, Dixon, Ryan e Hadfield, *Effective context engineering for AI agents* — seção "The anatomy of effective context"** — Anthropic Engineering, set/2025 · ~13 min de leitura, em inglês
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  A tese é o marco `prompt-por-chamada` dito por quem constrói isso em produção: achar o menor conjunto de tokens de alto sinal que produz o resultado desejado. Vale para qualquer provedor.

### 3.4 Custo, teto e observabilidade

**Sugerida**

- **IBM Technology (Martin Keen), *What is Prompt Caching? Optimize LLM Latency with AI Transformers*** — YouTube, canal oficial, fev/2026 · 9 min 6 s no total, trecho de 1 min 50 s, de 6:02 a 7:52
  https://www.youtube.com/watch?v=u57EnkQaUTY&hl=en&persist_hl=1&t=362s
  Um quadro com o prompt montado em camadas, instruções, documento, exemplos e pergunta, e o que acontece com o cache quando a pergunta vem no fim e quando vem no começo: a pergunta do marco, desenhada.

**Citadas na aula**

- **Google, *Gemini Developer API pricing*** — Gemini API Docs, atualizado em out/2026 · ~3 min de leitura (o bloco do modelo que ele usa)
  https://ai.google.dev/gemini-api/docs/pricing
  A tabela oficial em dólar por milhão de tokens, com a coluna do gratuito ao lado da do pago: entrada, saída "incluindo os tokens de raciocínio" e cache, modelo por modelo.

- **Google, *Understand and count tokens* — seção "Count tokens"** — Gemini API Docs, atualizado em set/2026 · ~3 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/tokens#count-tokens
  Os dois jeitos de contar: antes de mandar, só a entrada, sem gerar resposta; e depois, no `usage` de toda resposta, com entrada, saída, raciocínio e cache em campos separados.

- **Google, *Context caching* — seção "Implicit caching"** — Gemini API Docs, atualizado em set/2026 · ~2 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/caching#implicit-caching
  O cache que já vem ligado, sem configurar nada: o conselho de pôr o conteúdo grande e comum no começo do prompt, o tamanho mínimo modelo por modelo, e o campo do `usage` que prova se pegou.

- **Google, *Batch API* — seção "Technical details"** — Gemini API Docs, atualizado em set/2026 · ~2 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/batch-mode#technical-details
  O preço do desconto, escrito: metade do custo da chamada comum, em troca de um prazo de até 24 horas para o resultado.

- **Google, *Rate limits* — seção "How rate limits work"** — Gemini API Docs, atualizado em set/2026 · ~2 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/rate-limits#how-rate-limits-work
  As três medidas do limite (requisições por minuto, tokens de entrada por minuto, requisições por dia), que valem por projeto e não por chave, com a cota diária zerando à meia-noite do horário do Pacífico.

- **Groq, *Rate Limits* — seção "Rate Limits"** — GroqCloud Docs, sem data · ~2 min de leitura (a tabela do plano Free)
  https://console.groq.com/docs/rate-limits#rate-limits
  Um provedor que publica a tabela: requisições e tokens por minuto e por dia de cada modelo no plano gratuito, por organização, e o erro 429 com o tempo de espera quando passa.

- **Ethan Ding, *tokens are getting more expensive*** — mandates (Substack), jul/2025 · ~9 min de leitura, em inglês
  https://ethanding.substack.com/p/ai-subscriptions-get-short-squeezed
  Por que preço fixo com uso desigual come a margem: o usuário pesado consome muitas vezes o que paga, e uma das saídas que o autor discute é cobrar pelo uso, que é o que o lançamento extra da Denise já faz.

### 3.5 Saída confiável e experiência

**Sugerida**

- **Samhita Tankala (NN/g), *Skeleton Screens vs. Progress Bars vs. Spinners*** — YouTube, canal oficial NNgroup, set/2024 · 3 min 30 s, em inglês
  https://www.youtube.com/watch?v=4GWqJEfzvmg&hl=en&persist_hl=1
  Os três jeitos de mostrar espera e quando cada um serve: abaixo de 1 s nenhum, até 10 s esqueleto ou spinner, acima disso barra com estimativa.

**Citadas na aula**

- **Google, *Structured outputs* — seção "Best practices"** — Gemini API Docs, atualizada em set/2026 · ~1 min de leitura (a seção), em inglês
  https://ai.google.dev/gemini-api/docs/structured-output#best-practices
  A tese do marco dita pelo próprio provedor: o JSON sai sintaticamente correto, e o valor se valida na aplicação, inclusive a saída que bate com o schema e está errada no sentido.

- **Google, *Structured outputs* — seção "JSON schema support"** — Gemini API Docs, atualizada em set/2026 · ~3 min de leitura (a seção e "Limitations", logo abaixo), em inglês
  https://ai.google.dev/gemini-api/docs/structured-output#json-schema-support
  O que o schema forçado aceita: `enum` para tipo, categoria e forma de pagamento, `format` de data, `minimum`, `required`. E, em "Limitations", que nem todo recurso do JSON Schema entra e schema grande ou muito aninhado pode ser recusado.

- **Groq, *Structured Outputs* — seção "Choosing between strict and best-effort mode"** — GroqCloud Docs, sem data · ~2 min de leitura (a seção), em inglês
  https://console.groq.com/docs/structured-outputs#choosing-between-strict-and-besteffort-mode
  Para quem foi pelo Groq: só o modo estrito garante o schema, e só em alguns modelos; o outro pode devolver erro 400 ou JSON válido que não bate com o schema.

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

- **Anthropic, *Glossário* — seção "Temperature"** — Claude Platform Docs, em português, sem data · ~1 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/about-claude/glossary#temperature
  Dois parágrafos, e o segundo é a frase que vale para qualquer provedor: mesmo com a temperatura em zero, os resultados não são totalmente determinísticos, e entradas idênticas podem produzir saídas diferentes.

- **Google, *Gemini 3 Developer Guide* — seção "Temperature"** — Gemini API Docs, atualizada em set/2026 · ~1 min de leitura (a seção), em inglês
  https://ai.google.dev/gemini-api/docs/gemini-3#temperature
  O "nem mexa" da aula: nos modelos Gemini 3 a recomendação é deixar a temperatura no padrão, 1.0, porque baixar pode fazer o modelo entrar em loop ou raciocinar pior.

- **Jakob Nielsen, *Response Times: The 3 Important Limits*** — Nielsen Norman Group, 1993, revisado em jan/2024 · ~4 min de leitura, em inglês
  https://www.nngroup.com/articles/response-times-3-important-limits/
  Os três limites que ninguém revogou: até 0,1 s parece instantâneo, até 1 s o raciocínio não se interrompe, passando de 10 s a pessoa vai fazer outra coisa e precisa saber quando volta.

- **React, *useOptimistic* — seção "Optimistic delete with error recovery"** — React Docs, sem data · ~3 min de leitura (a seção), em inglês
  https://react.dev/reference/react/useOptimistic#optimistic-delete-with-error-recovery
  O otimismo com rede de segurança: o item sai da lista na hora do clique e, se a gravação falhar, volta com a mensagem de erro. É a resposta certa para a pergunta do marco.

- **Google PAIR, *Explainability + Trust* — seção "Determine if you should show confidence"** — People + AI Guidebook, 2019 · ~3 min de leitura (a seção e as duas seguintes), em inglês
  https://pair.withgoogle.com/chapter/explainability-trust/#determine-if-you-should-show-confidence
  Contra a tentação do percentual de confiança: 85,8% contra 87% não muda a decisão de ninguém, e confiança alta enganosa faz aceitar sem olhar. Logo abaixo, a alternativa por categoria, cada uma dizendo o que fazer.

- **Tim Neusesser e Evan Sunwall, *Error-Message Guidelines* — seção "Communication Guidelines"** — Nielsen Norman Group, mai/2023 · ~3 min de leitura (a seção), em inglês
  https://www.nngroup.com/articles/error-message-guidelines/#toc-communication-guidelines-2
  "Ocorreu um erro" não diz nada: a mensagem descreve o problema exato, sem jargão, e oferece o que fazer em seguida. É o estado de erro da tela dele, escrito.

- **Eugene Yan, *Patterns for Building LLM-based Systems & Products* — seções "Defensive UX" e "Collect user feedback"** — eugeneyan.com, jul/2023 · ~10 min de leitura (as duas seções; o texto inteiro tem 66 min), em inglês
  https://eugeneyan.com/writing/llm-patterns/#defensive-ux-to-anticipate--handle-errors-gracefully
  A aula inteira por quem constrói isso em produção: o produto que assume de saída que o modelo vai errar e desenha para isso, e a correção de quem usa como o dado que alimenta o eval.

### 3.6 Segurança de IA

**Sugerida**

- **Microsoft Developer, *Episode 4: Indirect Prompt Injection Explained*, série AI Red Teaming 101** — YouTube, canal oficial, jul/2025 · 6 min 28 s no total, trecho de 3 min 25 s, de 0:00 a 3:25
  https://www.youtube.com/watch?v=s_Ztu6c-IGQ&hl=en&persist_hl=1
  Gary Lopez, do time de red team da Microsoft, mostra o prompt do sistema, a mensagem do usuário e o dado de fora colados numa coisa só antes de chegar ao modelo, e um e-mail plantado que manda procurar outros e-mails e mandar o conteúdo para fora: o modelo não vê a diferença.

**Citadas na aula**

- **Anthropic, *Mitigar jailbreaks e injeções de prompt* — seção "Injeção indireta de prompt"** — Claude Platform Docs, em português, sem data · ~5 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks#indirect-prompt-injection
  A distinção da aula na voz de quem faz o modelo: na direta o adversário é o usuário, na indireta é o conteúdo de terceiros que o modelo lê em nome dele — e a seção manda limitar o acesso para que uma injeção bem-sucedida cause o mínimo de dano, e fecha mandando atacar o próprio sistema com conteúdo plantado antes de pôr no ar, que é a prova de hoje.

- **OWASP, *LLM01:2025 Prompt Injection*** — genai.owasp.org, edição 2025 · ~8 min de leitura
  https://genai.owasp.org/llmrisk/llm01-prompt-injection/
  O primeiro item da lista, com a frase que fecha a questão do filtro: dado o funcionamento probabilístico dos modelos, não está claro que exista prevenção infalível.

- **Simon Willison, *The lethal trifecta for AI agents* — seção "Guardrails won't protect you"** — simonwillison.net, jun/2025 · ~1 min de leitura (a seção)
  https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/#guardrails
  O argumento do 95% em quatro linhas: produto de guardrail promete pegar quase todos os ataques, e em segurança de aplicação web isso é nota de reprovação.

- **Anthropic, *Mitigating the risk of prompt injections in browser use* — seção "Claude's progress on browser use robustness"** — Anthropic Research, nov/2025 · ~6 min de leitura, em inglês
  https://www.anthropic.com/research/prompt-injection-defenses#claudes-progress-on-browser-use-robustness
  A própria Anthropic, ao anunciar 1% de ataques bem-sucedidos, escreve que isso ainda é risco relevante e que nenhum agente é imune.

- **Simon Willison, *The lethal trifecta for AI agents: private data, untrusted content, and external communication*** — simonwillison.net, jun/2025 · ~7 min de leitura
  https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
  A referência da ementa: as três pernas nomeadas, a lista de caminhos para fora (uma chamada de API, carregar uma imagem, até um link para o usuário clicar), e a observação de que os fornecedores consertaram quase todos os casos fechando a saída.

- **Simon Willison, *Superhuman AI exfiltrates emails*** — simonwillison.net, jan/2026 · ~2 min de leitura
  https://simonwillison.net/2026/Jan/12/superhuman-ai-exfiltrates-emails/
  A tríade inteira num caso real de cliente de e-mail: o usuário pede o resumo da caixa, um e-mail plantado faz o assistente mandar dados financeiros, jurídicos e médicos para um formulário do atacante por uma imagem que a tela carrega; a causa foi a regra que deixava a tela carregar a imagem, e a empresa publicou um conserto.

- **OWASP, *LLM02:2025 Sensitive Information Disclosure* — seção "Example Attack Scenarios"** — genai.owasp.org, edição 2025 · ~6 min de leitura
  https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/#user-content-example-attack-scenarios
  O primeiro cenário é o do marco, em uma linha: um usuário recebe na resposta o dado pessoal de outro usuário. A página também trata do dado que entra no treino e reaparece na saída.

- **Google, *Gemini API Additional Terms of Service* — seção "Unpaid Services", parte "How Google Uses Your Data"** — ai.google.dev, atualizada em abr/2026 · ~2 min de leitura (a seção)
  https://ai.google.dev/gemini-api/terms#data-use-unpaid
  O provedor também é quem lê o contexto: no plano gratuito, que é o da P3, o Google usa o que entra e o que sai para desenvolver os produtos dele, revisores humanos podem ler, e os próprios termos mandam não enviar informação sensível, confidencial ou pessoal.

- **Groq, *Your Data in GroqCloud*** — console.groq.com, sem data · ~3 min de leitura
  https://console.groq.com/docs/your-data
  O contraste, para quem foi pelo Groq: por padrão ele não guarda o dado das chamadas, salvo log temporário de erro e abuso por até 30 dias.

- **OWASP, *LLM06:2025 Excessive Agency* — seção "Prevention and Mitigation Strategies"** — genai.owasp.org, edição 2025 · ~7 min de leitura
  https://genai.owasp.org/llmrisk/llm062025-excessive-agency/#user-content-prevention-and-mitigation-strategies
  Duas mitigações que são o marco: pôr uma pessoa para aprovar ação de alto impacto antes de ela acontecer, e fazer a autorização no sistema de baixo em vez de deixar o modelo decidir se uma ação é permitida.

- **Simon Willison, *Design Patterns for Securing LLM Agents against Prompt Injections* — seção "The scope of the problem"** — simonwillison.net, jun/2025 · ~3 min de leitura (a seção)
  https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/#scope-of-the-problem
  O princípio comum de um artigo de pesquisadores da IBM, da Invariant Labs, da ETH Zurich, do Google e da Microsoft: depois que o modelo leu conteúdo não confiável, ele precisa estar preso de forma que seja impossível esse conteúdo disparar uma ação com consequência.

- **Anthropic, *Beyond permission prompts: making Claude Code more secure and autonomous* — seção "Keeping users secure on Claude Code"** — Anthropic Engineering, out/2025 · ~2 min de leitura (a seção)
  https://www.anthropic.com/engineering/claude-code-sandboxing#keeping-users-secure-on-claude-code
  O nome do carimbo: clicar "aprovar" o tempo todo leva à fadiga de aprovação, em que a pessoa deixa de prestar atenção no que aprova — e isso deixa o sistema menos seguro, não mais.

- **OWASP, *2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps*** — genai.owasp.org, edição 2025 · ~5 min a página inicial
  https://genai.owasp.org/llm-top-10/
  A lista que a 2.13 apresentou como aviso e que aqui vira checklist: injeção, vazamento de informação sensível e agência excessiva são os três de hoje; os outros sete ficam para quem quiser, depois.

### 3.7 Evals

**Sugerida**

- **Hamel Husain, *How To Approach Your AI Evals*, trecho de 2:14 ao fim** — YouTube, canal do autor, jun/2026 · 4 min 18 s no total, trecho de 2 min
  https://www.youtube.com/watch?v=DZxaPNYi_k0&hl=en&persist_hl=1&t=134s
  O autor do texto da aula separando teste por código de modelo como juiz, e dizendo que o juiz erra com frequência e se mede contra rótulo de gente antes de ganhar confiança.

- **Hamel Husain, *Your AI Product Needs Evals*** — hamel.dev, mar/2024 · ~25 min de leitura
  https://hamel.dev/blog/posts/evals/
  O texto nomeado na ementa, inteiro: os três níveis de eval, o caso real de um assistente de imobiliária que empacou porque cada falha consertada fazia surgir outra, e o método que montaram em torno do eval para sair disso.

**Citadas na aula**

- **Hamel Husain, *Your AI Product Needs Evals* — seção "Step 1: Write Scoped Tests"** — hamel.dev, mar/2024 · ~2 min de leitura (a seção)
  https://hamel.dev/blog/posts/evals/#step-1-write-scoped-tests
  Quebrar a feature em cenários e escrever um teste para cada um: o exemplo dele é um imóvel encontrado, vários e nenhum, que é o mesmo desenho da mensagem clara, da que vira mais de um lançamento e da que não vira nenhum.

- **Mikaela Grace, Jeremy Hadfield, Rodrigo Olivares e Jiri De Jonghe, *Demystifying evals for AI agents* — seção "Collect tasks for the initial eval dataset"** — Anthropic Engineering, jan/2026, atualizado em mar/2026 · ~3 min de leitura (a seção)
  https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents#collect-tasks-for-the-initial-eval-dataset
  Vinte a cinquenta casos simples bastam para começar; um bom caso é aquele em que dois especialistas chegariam sozinhos ao mesmo veredito; e o conjunto testa o que deve acontecer e o que não deve.

- **Anthropic, *Defina critérios de sucesso e crie avaliações* — seção "Avalie suas avaliações"** — Claude Platform Docs, em português, sem data · ~3 min de leitura (a seção e as dicas logo abaixo)
  https://platform.claude.com/docs/pt-BR/test-and-evaluate/develop-tests#grade-your-evaluations
  Os três jeitos de dar a nota — por código, por gente, por modelo — com a regra de escolher o mais rápido e confiável que der conta, e o exemplo do juiz que responde só "correct" ou "incorrect".

- **Hamel Husain, *A Field Guide to Rapidly Improving AI Products* — seção "Creating Trustworthy Evaluation Systems"** — hamel.dev, mar/2025 · ~4 min de leitura (os itens 1 a 3)
  https://hamel.dev/blog/posts/field-guide/#creating-trustworthy-evaluation-systems
  Por que passa ou não passa ganha de escala de 1 a 5, e como medir se o juiz concorda com a pessoa antes de confiar nele: "a 10% increase in passing outputs is immediately meaningful".

- **Grace, Hadfield, Olivares e De Jonghe, *Demystifying evals for AI agents* — seção "Capability vs. regression evals"** — Anthropic Engineering, jan/2026 · ~1 min de leitura (a seção)
  https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents#capability-vs-regression-evals
  A diferença entre o eval que mede o que o sistema ainda não faz e o que guarda o que ele já fazia, que deve passar quase sempre: queda ali é sinal de que algo quebrou.

- **Grace, Hadfield, Olivares e De Jonghe, *Demystifying evals for AI agents* — seção "How to think about non-determinism in evaluations for agents"** — Anthropic Engineering, jan/2026 · menos de 1 min (só o primeiro parágrafo)
  https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents#how-to-think-about-non-determinism-in-evaluations-for-agents
  Um caso que passou numa rodada pode falhar na seguinte sem nada ter mudado: é a razão de rodar duas vezes antes de chamar diferença de melhora.

- **Grace, Hadfield, Olivares e De Jonghe, *Demystifying evals for AI agents* — seção "Maintain and use the eval long-term"** — Anthropic Engineering, jan/2026 · ~3 min de leitura (a seção)
  https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents#maintain-and-use-the-eval-long-term
  "Eval-driven development": escrever o eval do que o sistema ainda não faz e iterar até ele passar, e manter o eval como se mantém teste unitário.

- **Hamel Husain, *Your AI Product Needs Evals* — seção "Step 3: Run & Track Your Tests Regularly"** — hamel.dev, mar/2024 · ~1 min de leitura (a seção)
  https://hamel.dev/blog/posts/evals/#step-3-run-track-your-tests-regularly
  Rodar os testes do jeito que der menos atrito na stack que já existe, e guardar o resultado ao longo do tempo para ver se está melhorando.

- **Google, *Rate limits* — seção "How rate limits work"** — Gemini API Docs, atualizada em set/2026 · ~1 min de leitura (a seção)
  https://ai.google.dev/gemini-api/docs/rate-limits#how-rate-limits-work
  As três medidas do limite (requisições por minuto, tokens de entrada por minuto, requisições por dia), que estourar qualquer uma dá erro, que o limite é do projeto e não da chave, e que o diário zera à meia-noite do Pacífico.

- **Groq, *Rate Limits*** — GroqDocs, sem data · ~2 min de leitura (a tabela do plano gratuito e os cabeçalhos)
  https://console.groq.com/docs/rate-limits
  Para quem foi pelo Groq: o limite por minuto, por dia e de tokens de cada modelo no gratuito, e o `429` com o `retry-after` dizendo quanto esperar.

### 3.8 Recuperação e memória

**Sugerida**

- **IBM Technology, *Is RAG Still Needed? Choosing the Best Approach for LLMs*** — YouTube, canal oficial, mar/2026 · 11 min 9 s, em inglês, com legenda em inglês
  https://www.youtube.com/watch?v=UabBYexBD4k&hl=en&persist_hl=1
  RAG e contexto longo lado a lado, com capítulos sobre onde cada um ganha e onde falha, da "loteria da recuperação" ao problema do ruído, até a escolha por caso.

**Citadas na aula**

- **Daniel Ford (Anthropic), *Introducing Contextual Retrieval* — seção "A primer on RAG: scaling to larger knowledge bases"** — Anthropic Engineering, set/2024 · ~3 min de leitura (a seção), em inglês
  https://www.anthropic.com/engineering/contextual-retrieval#a-primer-on-rag-scaling-to-larger-knowledge-bases
  O RAG de vetor em três passos e, logo depois, o caso em que o vetor erra: um código exato, "TS-999", que só a busca por texto acha. É o "marcão" da P3 com outro nome.

- **Google, *Embeddings* — seção "Storing embeddings"** — Gemini API Docs, atualizada em set/2026 · ~1 min de leitura (a seção), em inglês
  https://ai.google.dev/gemini-api/docs/embeddings#store-embeddings
  Em produção, vetor pede um banco de vetores para guardar, indexar e buscar, e a seção lista os serviços que fazem isso. É o custo concreto do jeito caro: mais uma peça para manter, quando a chave resolve.

- **Daniel Ford (Anthropic), *Introducing Contextual Retrieval* — seção "A note on simply using a longer prompt"** — Anthropic Engineering, set/2024 · ~1 min de leitura (a seção), em inglês
  https://www.anthropic.com/engineering/contextual-retrieval#a-note-on-simply-using-a-longer-prompt
  A frase que a aula usa: abaixo de duzentos mil tokens, umas quinhentas páginas, ponha o acervo inteiro no prompt, sem RAG. Três parágrafos, e o primeiro começa dizendo que às vezes a solução mais simples é a melhor.

- **Rajasekaran, Dixon, Ryan e Hadfield, *Effective context engineering for AI agents* — seção "Why context engineering is important to building capable agents"** — Anthropic Engineering, set/2025 · ~2 min de leitura (a seção), em inglês
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents#why-context-engineering-is-important-to-building-capable-agents
  O *context rot* dito pela Anthropic: quanto mais tokens na janela, pior o modelo recupera o que está nela, e contexto vira recurso finito com retorno decrescente. É o "caber não é valer".

- **Simon Willison, *I really don’t like ChatGPT’s new memory dossier* — seção "We’re losing control of the context"** — simonwillison.net, mai/2025 · ~2 min de leitura (a seção), ~10 min o texto, em inglês
  https://simonwillison.net/2025/May/21/chatgpt-new-memory/#we-re-losing-control-of-the-context
  Um usuário avançado descobrindo que a memória que o produto escreveu sozinho mudou respostas sem ele saber, e pedindo memória por projeto. "Quem escreve" e "onde", vistos do lado de quem usa.

- **Harrison Chase, *Memory for agents*** — LangChain Blog, out/2024 · ~6 min de leitura, em inglês
  https://www.langchain.com/blog/memory-for-agents
  Memória é específica de cada aplicação: o que guardar depende do produto. E dá o vocabulário: a memória "episódica", exemplos de casos que deram certo postos no prompt, é o que o histórico aprovado da P3 é.

- **Google, *Context caching* — seção "Implicit caching"** — Gemini API Docs, atualizada em set/2026 · ~1 min de leitura (a seção), em inglês
  https://ai.google.dev/gemini-api/docs/caching#implicit-caching
  Volta da 3.4, não matéria nova: o cache vem ligado sem fazer nada, e as duas dicas da página são pôr o conteúdo grande e comum no começo do prompt e mandar pedidos de prefixo parecido em pouco tempo. É a ordem da aula escrita pela documentação, e o `usage` diz quantos tokens vieram do cache.

- **Google, *Long context* — FAQ "Where is the best place to put my query in the context window?"** — Gemini API Docs, atualizada em jun/2026 · ~1 min de leitura (esta pergunta e a seguinte), em inglês
  https://ai.google.dev/gemini-api/docs/long-context#where_is_the_best_place_to_put_my_query_in_the_context_window
  Pergunta no fim, depois de todo o contexto. E a pergunta logo abaixo, mesmo defendendo o contexto longo, abre dizendo que o token desnecessário é melhor evitar: o "caber não é valer" na voz do provedor.

- **Rajasekaran, Dixon, Ryan e Hadfield, *Effective context engineering for AI agents* — seção "Context retrieval and agentic search"** — Anthropic Engineering, set/2025 · ~5 min de leitura (a seção), em inglês
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents#context-retrieval-and-agentic-search
  Buscar antes da chamada contra deixar o agente buscar na hora, com ferramenta, guardando só referências leves, e o meio-termo híbrido. É a ponte para a 3.9.

### 3.9 Ferramentas e agentes no produto

**Sugerida**

- **Alex Albert e Erik S., *Building more effective AI agents*, trecho "Using the Claude Agent SDK to build agents"** — canal oficial Anthropic no YouTube, out/2025 · 19 min no total, trecho de 1 min 40 s, de 3:20 a 5:00
  https://www.youtube.com/watch?v=uhJJgc-0iTQ&hl=en&persist_hl=1&t=200s
  O coautor do artigo explicando o que o Agent SDK resolve e quando não precisa dele: a metade do marco que a citada de MCP não cobre.

- **Alex Albert e Erik S., *Building more effective AI agents*, trechos "The evolution of workflows and agents" e "The value of simple agent architectures"** — canal oficial Anthropic no YouTube, out/2025 · 19 min no total, trecho de 2 min 50 s, de 6:40 a 9:30
  https://www.youtube.com/watch?v=uhJJgc-0iTQ&hl=en&persist_hl=1&t=400s
  O mesmo coautor revisitando a tese quase um ano depois: o que mudou desde dezembro de 2024 e o que continua valendo sobre preferir a arquitetura mais simples.

- **Barry Zhang, *How We Build Effective Agents*** — AI Engineer, abr/2025 · 15 min
  https://www.youtube.com/watch?v=D7_ipDqhtwk&hl=en&persist_hl=1
  Um dos autores do artigo defende, em quinze minutos, que agente é caro e que workflow resolve quase tudo: é a tese do último marco dita por quem escreveu a fonte.

**Citadas na aula**

- **Anthropic, *How tool use works*** — Claude Platform Docs · ~1 min de leitura (a seção)
  https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works#the-agentic-loop-client-tools
  A seção escreve o loop como cinco passos em torno do `stop_reason`, que é exatamente o que o aluno precisa ver para entender que o modelo pede e o servidor executa.

- **Ken Aizawa e colaboradores, *Writing effective tools for AI agents—using AI agents*** — Anthropic, engenharia, set/2025 · ~12 min de leitura
  https://www.anthropic.com/engineering/writing-tools-for-agents
  A outra metade da história: como se escreve a ferramenta do lado do servidor para o modelo pedir bem, com seleção, descrição clara e resposta econômica em contexto.

- **Anthropic, *How the agent loop works*** — Claude Code Docs, Agent SDK · ~1 min de leitura (a seção)
  https://code.claude.com/docs/en/agent-sdk/agent-loop#the-loop-at-a-glance
  Um loop de agente real, em produto que roda, descrito em cinco passos e um diagrama: serve de contraste concreto com o fluxo fixo.

- **Erik S. e Barry Zhang, *Building effective agents*** — Anthropic Engineering, dez/2024 · ~10 min de leitura (a seção)
  https://www.anthropic.com/engineering/building-effective-agents#building-blocks-workflows-and-agents
  É a fonte dos cinco padrões que a aula usa, cada um com o diagrama e uma linha de quando aplicar; a ementa da aula é o índice desta seção.

- **Model Context Protocol, *Architecture overview*** — modelcontextprotocol.io · ~2 min de leitura (a seção)
  https://modelcontextprotocol.io/docs/learn/architecture#primitives
  Define as três primitivas do servidor — tools, resources, prompts — que é o que separa MCP de "mais um jeito de chamar API".

## Módulo 4

### 4.1 The Mom Test

**Sugerida**

- **Rob Fitzpatrick, *[Remote Mom Test 1] Reminder of the Mom Test and intro to remote custdev*** — YouTube, canal Rob Fitzpatrick, mar/2020 · 4 min 39 s no total, trecho de 1 min 23 s, de 0:46 a 2:09
  https://www.youtube.com/watch?v=bcWqxq2fJgY&hl=en&persist_hl=1&t=46s
  O autor em um minuto e meio: não pergunte sobre a sua ideia, porque ela põe o seu ego na mesa e a pessoa se retrai, e ninguém prevê o próprio comportamento; pergunte o que ela já faz.

**Citadas na aula**

- **Rob Fitzpatrick, *The Mom Test*** — página oficial do livro, momtestbook.com · livro de ~130 páginas, duas horas de leitura
  https://www.momtestbook.com/
  A fonte da aula: o manual de conversa com cliente para quando todo mundo está sendo educado com você, escrito por um programador que foi empurrado para falar com cliente.

- **Rob Fitzpatrick, *[The Mom Test] 0% Bias Isn't Realistic*** — YouTube, canal Rob Fitzpatrick, jul/2026 · 4 min 25 s, em inglês
  https://www.youtube.com/watch?v=TCNV-pemGl8&hl=en&persist_hl=1
  O próprio autor dizendo que uma pergunta indutora para mudar de assunto é aceitável se o que vem depois for história concreta, e que conversa com zero viés não chega a lugar nenhum.

- **Gustaf Alströmer, *How To Talk To Users*** — Y Combinator, Startup School, YouTube, dez/2022 · 17 min 31 s no total, trecho de 3 min 59 s, de 8:42 a 12:41
  https://www.youtube.com/watch?v=z1iF1c8w5Lg&hl=en&persist_hl=1&t=522s
  Seis perguntas boas, as que descarrilam a entrevista ("vai usar?", "que funções melhorariam?"), e dois casos de pedido de função que escondia outra dor: o Gmail lento e os hóspedes do Airbnb que queriam o telefone do anfitrião.

### 4.2 Conduzir discovery

**Sugerida**

- **Rob Fitzpatrick, *[The Mom Test] AI can't run your customer interviews (but it \*can\* help in other ways)*** — YouTube, jun/2026 · 7 min 3 s, o trecho de 2:14 a 5:41
  https://www.youtube.com/watch?v=uUr0zxUqIGA&hl=en&persist_hl=1&t=134s
  O autor dizendo onde o modelo ajuda: ensaiar a conversa antes e, depois, ler a transcrição como treinador ("não me diga o que isso significa para o meu negócio; me mostre onde eu comecei a vender").

**Citadas na aula**

- **Rob Fitzpatrick, *[Mom Test Q&A] Open learning + hard commitment in single meeting?*** — YouTube, set/2025 · 4 min 51 s, só o começo até 1:10
  https://www.youtube.com/watch?v=ldy5S1JPVKA&hl=en&persist_hl=1
  O autor dizendo que "a gente se fala de novo qualquer hora?" recebe sim e por isso não vale nada, e que o pedido vale mais quanto mais concreto for o gatilho da próxima conversa.

- **Rob Fitzpatrick, *[The Mom Test] Finding Customers With Problems Worth Solving?*** — YouTube, jun/2026 · 4 min 31 s, o trecho de 2:48 ao fim
  https://www.youtube.com/watch?v=2IKTpN7oFco&hl=en&persist_hl=1&t=168s
  O par "quem e onde": um tipo de pessoa e o lugar onde se acha essa pessoa, e a preferência por quem já gasta esforço tentando resolver o problema.

- **Rob Fitzpatrick, *[The Mom Test] "Keeping it casual" in B2B? It still works (and is often optimal)*** — YouTube, jun/2026 · 7 min, o trecho até 1:37
  https://www.youtube.com/watch?v=xJ35YAvOULQ&hl=en&persist_hl=1
  Por que formalidade atrapalha: quanto mais cara de reunião, mais a pessoa entra em modo negociação e se defende; e conversa informal custa menos quando você descobre que falou com a pessoa errada.

- **Teresa Torres, *The Interview Snapshot* — seção "The Memorable Quote"** — Product Talk, fev/2024 · ~3 min de leitura (a seção)
  https://www.producttalk.org/interview-snapshot/#the-memorable-quote
  A frase da pessoa guardada como ela disse, separada do que o time concluiu, que mora noutra seção da mesma ficha: é a anotação literal da aula com forma.

- **Sharma e outros (Anthropic), *Towards Understanding Sycophancy in Language Models* — seção 3.1, "AI Assistants Can Give Biased Feedback"** — arXiv, out/2023 · ~3 min de leitura (a seção)
  https://arxiv.org/html/2310.13548#S3.SS1
  O mesmo texto avaliado sem opinião e com o usuário dizendo que gosta, não gosta, escreveu ou não escreveu. O parecer acompanha a opinião, não o texto.

- **Gustaf Alströmer (Y Combinator), *How To Talk To Users | Startup School*, a partir de "Who should I talk to?"** — YouTube, dez/2022 · 17 min 31 s, o trecho de 3:23 a 8:35
  https://www.youtube.com/watch?v=z1iF1c8w5Lg&hl=en&persist_hl=1&t=203s
  Um sócio da YC passando a conversa inteira, de quem procurar e como abordar até o que fazer com as anotações, com uma entrevista encenada no meio.

### 4.3 Jobs to be done

**Sugerida**

- **Clayton Christensen Institute, *What is Jobs to Be Done Theory?*** — canal oficial do Christensen Institute no YouTube, abr/2024 · 4 min 54 s
  https://www.youtube.com/watch?v=k01edeNOC_U&hl=en&persist_hl=1
  Em cinco minutos: o job como progresso mais circunstância, as quatro forças, por que perfil não prediz escolha, e o caso do Moesta com aposentados que não compravam apartamento por acabamento, e sim travavam na mudança.

**Citadas na aula**

- **Carmen Nobel, *Clay Christensen's Milkshake Marketing*** — HBS Working Knowledge, fev/2011 · ~7 min de leitura
  https://www.library.hbs.edu/working-knowledge/clay-christensens-milkshake-marketing
  O caso contado inteiro e de graça: 40% dos milkshakes vendidos logo cedo, para viagem, o trajeto chato e uma mão livre, e o outro job, o agrado que o pai compra para o filho.

- **Clayton Christensen Institute, *Jobs to Be Done Theory* — seção "Definition"** — christenseninstitute.org, atualizado em mai/2025 · ~2 min de leitura (a seção)
  https://www.christenseninstitute.org/theory/jobs-to-be-done/
  A definição dita pelo instituto do Christensen: progresso numa circunstância, nas dimensões funcional, social e emocional, contra demografia e atributo de produto.

- **Clayton M. Christensen, Taddy Hall, Karen Dillon e David S. Duncan, *Competing Against Luck*** — página oficial do livro, Christensen Institute, out/2016 · ~2 min de leitura
  https://www.christenseninstitute.org/books/competing-against-luck/
  O livro em que a teoria do job foi escrita por inteiro; a página resume a tese em um parágrafo: cliente não compra produto, contrata para um job.

- **Bob Moesta e Chris Spiek, *The Four Forces of Progress*** — jobstobedone.org, página sem data, conferida em out/2026 · ~4 min de leitura
  https://jobstobedone.org/the-four-forces/
  As quatro forças pelos dois que as nomearam, com a desigualdade da troca escrita e a frase que é o marco: a maioria dos times só mexe na atração e ignora as duas que seguram.

- **Bob Moesta e Chris Spiek, *The Timeline: From First Thought to Purchase*** — jobstobedone.org, página sem data, conferida em out/2026 · ~6 min de leitura
  https://jobstobedone.org/the-timeline/
  A linha do tempo da troca, marco a marco, e o aviso que vale para a fluência: o primeiro pensamento quase sempre vem antes do que a pessoa conta.

- **Alan Klement, *Designing features using Job Stories* — seção "Enter the Job Story"** — Inside Intercom, dez/2013 · ~7 min de leitura
  https://www.intercom.com/blog/using-job-stories-design-features-ui-ux/#enter-the-job-story
  O texto que popularizou a job story, proposta antes pelo Paul Adams no mesmo blog: "When ___, I want to ___, so I can ___": situação, motivação, resultado, no lugar de "como persona, quero funcionalidade".

### 4.4 Escolher o seu problema

**Sugerida**

- **Jared Friedman, *How to Get and Evaluate Startup Ideas* — trecho "4 most common mistakes", de 1:44 a 6:29** — Y Combinator, YouTube, nov/2022 · 4 min 45 s (o vídeo tem 32 min 21 s)
  https://www.youtube.com/watch?v=Th8JoIan4dg&hl=en&persist_hl=1&t=104s
  Um sócio da YC chama de solução em busca de problema o "IA é legal, onde eu aplico IA?". Diz que pobreza global é abstrata demais para começar e mostra o app de combinar o fim de semana com os amigos, que todo mundo tenta e ninguém faz dar certo.

**Citadas na aula**

- **Paul Graham, *How to Get Startup Ideas* — seções "Problems" e "Noticing"** — paulgraham.com, nov/2012 · ~30 min de leitura (o ensaio inteiro), em inglês
  https://paulgraham.com/startupideas.html
  Dá nome à ideia inventada que soa plausível e ninguém quer ("made-up" ou "sitcom"). Tem a confissão do próprio autor, que perdeu seis meses pondo galerias de arte na internet sem que elas quisessem, e manda prestar atenção ao que incomoda no dia a dia.

- **Rob Fitzpatrick, *[Mom Test] Mini-workshop to find critical gaps in your customer understanding* — trecho de 0:00 a 3:07** — YouTube, canal do autor, jan/2026 · 3 min (o vídeo tem 7 min 30 s)
  https://www.youtube.com/watch?v=tOojBwR8cis&hl=en&persist_hl=1
  O autor do Mom Test pergunta se você sabe contar o que a pessoa faz hoje, por que não faz melhor e o que já tentou. Diz também que quem nunca tentou nada talvez não se importe: é a terceira hipótese, e o alerta do "nada".

- **Rob Fitzpatrick, *Impatience is killing your customer learning* — trecho de 3:32 a 4:45** — YouTube, canal do autor, fev/2025 · 1 min 15 s (o vídeo tem 6 min 12 s)
  https://www.youtube.com/watch?v=jgZalrJPKko&hl=en&persist_hl=1&t=212s
  O que ele mais viu acontecer: a descoberta raramente joga a ideia fora, e muitas vezes mostra que um dos públicos se importa muito mais que os outros. A ideia muda de versão e não morre.

- **Teresa Torres, *Continuous Discovery*** — Product Talk, glossário, atualizado em set/2026 · ~1 min de leitura
  https://www.producttalk.org/glossary-discovery-continuous-discovery/
  A definição de quem popularizou o hábito: contato toda semana, pequeno e frequente, e não uma rodada grande de pesquisa uma vez. É o ritmo de uma entrevista por semana.

### 4.5 Problem-solution fit e MVP

**Sugerida**

- **Steve Blank, *The Art of the MVP. 2 Minutes to See Why*** — canal de Steve Blank, YouTube, jan/2015 · 1 min 44 s
  https://www.youtube.com/watch?v=Fj0qsAyKPN8&hl=en&persist_hl=1
  O autor da referência da ementa, em menos de dois minutos: MVP não é produto mínimo, nem lista de features cortada no prazo; é o que sai de conversar e iterar sobre a dor. E para o mercado novo, pergunte como a pessoa gasta o tempo hoje e o que usa para resolver.

**Citadas na aula**

- **Kevin Hale, *How to Evaluate Startup Ideas* — trecho "The problem"** — Y Combinator, Startup School, YouTube, jul/2019 · 26 min 38 s (o trecho tem 1 min 25 s)
  https://www.youtube.com/watch?v=DOtCl5PU8F0&hl=en&persist_hl=1&t=405s
  Um sócio da YC lista o que faz um problema valer empresa: urgente, caro, obrigatório, frequente. É a régua dos três adjetivos da aula dita por quem avalia os pedidos que chegam à YC.

- **Eric Ries, *Minimum Viable Product: a guide*** — Startup Lessons Learned, ago/2009 · ~6 min de leitura
  https://www.startuplessonslearned.com/2009/08/minimum-viable-product-guide.html
  A definição original, e ela não fala de tamanho: o MVP é a versão que traz o máximo de aprendizado validado sobre o cliente com o mínimo de esforço.

- **Eric Ries, *How DropBox Started As A Minimal Viable Product*** — TechCrunch, out/2011, trecho do livro *The Lean Startup* · ~5 min de leitura
  https://techcrunch.com/2011/10/19/dropbox-minimal-viable-product/
  O vídeo que mostrava um produto que ainda não funcionava, e a lista de espera que foi de 5 mil a 75 mil numa noite. Ries chama a hipótese testada de "salto de fé": é a hipótese que mata, com outro nome.

- **Manuel Rosso, *Concierge MVP: learning from early adopters at Food on the Table*** — SlideShare, slides da conferência Startup Lessons Learned, mar/2011 · 9 slides
  https://www.slideshare.net/slideshow/manuel-rosso-food-on-the-table/7239850
  O fundador contando o concierge por dentro: atendimento cara a cara, plano de refeições e lista de compras mandados por e-mail, nada de código antes de alguém adotar à mão.

- **Steve Blank, *Perfection By Subtraction – The Minimum Feature Set*** — steveblank.com, mar/2010 · ~6 min de leitura
  https://steveblank.com/2010/03/04/perfection-by-subtraction-the-minimum-feature-set/
  A referência da ementa. O conjunto mínimo é o menor problema que o cliente pagaria para resolver, e o inimigo nomeado é a lista de features em que cada item traz "mais um cliente".

- **Jeff Patton, *The New User Story Backlog is a Map*** — jpattonassociates.com, out/2008, atualizado em abr/2023 · ~12 min de leitura
  https://jpattonassociates.com/the-new-backlog/
  O mapa da jornada: as atividades da pessoa em fila da esquerda para a direita, e o primeiro corte é o que atravessa o fluxo inteiro de ponta a ponta, não uma tela terminada.

### 4.6 Mercado, ICP e beachhead

**Sugerida**

- **Geoffrey Moore com Lenny Rachitsky, *Geoffrey Moore on finding your beachhead, crossing the chasm, and dominating a market*, trecho "Finding your beachhead segment"** — Lenny's Podcast, YouTube, jan/2024 · 1h24min no total, trecho de 3 min 30 s, de 5:58 a 9:28
  https://www.youtube.com/watch?v=RBbINB5HSHk&hl=en&persist_hl=1&t=358s
  O autor do livro explicando por que o primeiro mercado é pequeno: ser peixe grande no lago, chegar a 30 ou 50% do segmento, e o mecanismo por baixo, que é o pragmático comprar o que vê o colega comprando.

**Citadas na aula**

- **Bill Aulet, *Disciplined Entrepreneurship*, passo 2 "Beachhead Market"** — d-eship.com, site oficial do livro, sem data · ~6 min de leitura
  https://www.d-eship.com/step2/
  As três condições que fazem de um grupo um mercado: o mesmo produto, o mesmo jeito de vender e gente que conversa entre si. Se os clientes não se falam, a venda não se espalha.

- **Bill Aulet, *Disciplined Entrepreneurship*, passo 4 "Beachhead Total Addressable Market (TAM)"** — d-eship.com, site oficial do livro, sem data · ~6 min de leitura
  https://www.d-eship.com/step4/
  Conta de baixo para cima feita por quem escreveu o método: clientes identificados em conversa, depois a densidade (quantos usuários por unidade contável) para estender a conta aos que ele não conheceu.

- **Governo Federal, *Mapa de Empresas*** — gov.br, em português, dados atualizados todo mês · consulta, não leitura
  https://www.gov.br/empresas-e-negocios/pt-br/mapa-de-empresas
  Fonte pública para contar empresas com CNPJ por município e atividade econômica: é o lugar de onde sai a primeira linha da conta de quem vende para negócio.

- **Kiran Shahid, *Ideal customer profiles and buyer personas: How are they different?*, seção "What is an ideal customer profile?"** — HubSpot Blog, atualizado em set/2025 · ~4 min de leitura (a seção)
  https://blog.hubspot.com/customers/ideal-customer-profiles-and-buyer-personas-are-they-different#what-is-an-icp
  O ICP escrito como critérios com valor (faturamento mínimo, setor, se tem sistema e gente para implantar, urgência da dor) e tratado como o primeiro filtro de qualificação, que descarta quem nunca vai fechar.

- **Bill Aulet, *Disciplined Entrepreneurship*, passo 12 "Decision-Making Unit (DMU)"** — d-eship.com, site oficial do livro, sem data · ~5 min de leitura
  https://www.d-eship.com/step12/
  Quem usa, quem defende e quem assina o cheque, separados: no consumo os papéis costumam cair na mesma pessoa, na venda para empresa se espalham por três ou mais.

- **Geoffrey A. Moore, *Crossing the Chasm*** — geoffreyamoore.com, página do livro no site do autor; 3ª edição, HarperBusiness, 2014
  https://geoffreyamoore.com/book/crossing-the-chasm/
  A fonte do abismo: a passagem dos primeiros compradores visionários para a maioria pragmática, e a escolha de um mercado-alvo como o jeito de atravessar.

## Módulo 5

### 5.1 Modelos de negócio e preço

**Sugerida**

- **Strategyzer, *Business Model Canvas Explained*** — canal da Strategyzer, YouTube, set/2011 · 2 min 20 s, em inglês
  https://www.youtube.com/watch?v=QoAOzMTLP5s&hl=en&persist_hl=1
  O canvas da referência da ementa, apresentado em dois minutos pela empresa dos autores: o modelo de negócio inteiro numa página só, com a infraestrutura que existe "to create, deliver and capture value". Tem legenda em português feita à mão.

- **Kevin Hale, *Startup Pricing 101* — trecho "The pricing thermometer" e "Pricing mistakes", de 2:50 a 6:34** — Y Combinator, YouTube, set/2019 · 3 min 44 s (o vídeo tem 19 min 32 s), em inglês
  https://www.youtube.com/watch?v=jwXlo9gy_k4&hl=en&persist_hl=1&t=170s
  Um sócio da YC desenha custo, preço e valor num termômetro: entre custo e preço está a razão de vender, entre preço e valor a razão de comprar. Preço se faz pelo valor, não por custo mais margem, e o erro número um que ele vê é cobrar de menos.

**Citadas na aula**

- **Meta, *Preços da Plataforma do WhatsApp Business*** — whatsappbusiness.com, em português, página viva · consulta, não leitura
  https://whatsappbusiness.com/pt-br/products/platform-pricing/
  A resposta da previsão na fonte: as empresas pagam por mensagem entregue, por categoria (marketing, utilidade, autenticação, serviço), e quem conversa não paga nada.

- **Meta, *Helping You Find More Channels and Businesses on WhatsApp*** — Meta Newsroom, jun/2025 · ~4 min de leitura, em inglês
  https://about.fb.com/news/2025/06/helping-you-find-more-channels-businesses-on-whatsapp/
  O anúncio de 16/06/2025: anúncio no Status, canais promovidos e assinatura mensal de canal, tudo na aba de Atualizações e longe das conversas. É a metade de verdade de quem responde "publicidade".

- **Alexander Osterwalder e Yves Pigneur, *Business Model Generation*** — Wiley, 2010; página do livro no site da Strategyzer, empresa dos autores, com prévia gratuita de 72 páginas
  https://www.strategyzer.com/library/business-model-generation
  A referência da ementa, que deu ao mundo o vocabulário de modelo de negócio e o canvas de nove blocos.

- **Bill Gurley, *A Rake Too Far: Optimal Platform Pricing Strategy*** — Above the Crowd, abr/2013 · ~10 min de leitura, em inglês
  https://abovethecrowd.com/2013/04/18/a-rake-too-far-optimal-platformpricing-strategy/
  O texto de referência sobre take rate, de um investidor de marketplaces: a fatia alta vira atrito no preço final, empurra quem vende para fora e abre espaço para o concorrente. A frase que fica: há diferença entre o que você consegue extrair e o que deveria.

- **Stripe, *Modelos de assinatura SaaS 101*, seção "Quais são os tipos de modelos de assinatura de SaaS?"** — Stripe, em português, atualizado em jul/2026 · 1 a 2 min (a seção, ~300 palavras)
  https://stripe.com/br/resources/more/saas-subscription-models-101-a-guide-for-getting-started#quais-sao-os-tipos-de-modelos-de-assinatura-de-saas
  As variações da assinatura numa lista curta de sete tipos, a maioria com um exemplo conhecido: preço fixo, faixas, por usuário, por uso, freemium, pagamento conforme o uso e híbrido.

- **Amazon, *Amazon.com Announces Fourth Quarter Results*** — release de resultados, fev/2026, dados do ano de 2025 · PDF, consulta
  https://s2.q4cdn.com/299287126/files/doc_earnings/2025/q4/earnings-result/AMZN-Q4-2025-Earnings-Release.pdf
  A tabela de segmentos: a AWS pequena nas vendas e grande no lucro.

- **Apple, *Form 10-K* do ano fiscal de 2025** — SEC, out/2025 · consulta, seções "Products and Services Performance" e "Gross Margin"
  https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm
  Receita e margem bruta separadas entre aparelho e serviço.

- **Starbucks, *Form 10-K* do ano fiscal de 2025** — SEC, nov/2025 · consulta, quadro de lojas próprias e licenciadas e a tabela de receitas
  https://www.sec.gov/Archives/edgar/data/829224/000082922425000114/sbux-20250928.htm
  A mesma marca em dois modelos: a loja própria e a licenciada.

- **Stripe, *Carta anual de 2025*** — Stripe, fev/2026 · página em português de um minuto; a carta é um PDF em inglês de 24/02/2026, ~20 min, linkado na página
  https://stripe.com/br/annual-updates/2025
  O volume que passou pela Stripe em 2025 está na página; a alta de 34%, na primeira linha do PDF. Separa o que passa pelo caixa do que fica.

- **Stripe, *Preços*** — stripe.com, Brasil, em português, página viva · consulta
  https://stripe.com/br/pricing
  A tabela pública do que a Stripe cobra por transação, por cartão nacional e por Pix. Sai do preço que ele vai cobrar.

### 5.2 Unit economics I

**Sugerida**

- **Tom Blomfield, *Consumer Startup Metrics*, trecho "Unit Economics"** — Y Combinator, Startup School, YouTube, jan/2024 · 22 min 26 s no total, trecho de 2 min 50 s, de 10:57 a 13:47
  https://www.youtube.com/watch?v=fdD4y4Civp4&hl=en&persist_hl=1&t=657s
  Um dos fundadores do Monzo, banco digital britânico, contando o que era custo variável por cliente (cartão de reposição, atendimento, fraude, tarifa de transferência), o que fica de fora por ser fixo, e que chegaram a meio milhão de clientes perdendo de 30 a 40 libras por cliente por ano antes de consertar.

- **Tom Blomfield, *Consumer Startup Metrics*, trecho do canal barato que dava prejuízo** — Y Combinator, Startup School, YouTube, jan/2024 · trecho de 1 min 42 s, de 7:15 a 8:57
  https://www.youtube.com/watch?v=fdD4y4Civp4&hl=en&persist_hl=1&t=435s
  Um blog de economia trazia clientes baratíssimos que davam prejuízo com saque no exterior: CAC baixo não vale nada sem a margem do lado. E o CAC medido até o cliente que fica, não até o cadastro.

**Citadas na aula**

- **David Skok, *Startup Killer: the Cost of Customer Acquisition*, seção "Business Model"** — For Entrepreneurs, blog do autor, dez/2009 · ~2 min de leitura (a seção, no começo do texto)
  https://www.forentrepreneurs.com/startup-killer/
  A definição do autor da referência da aula: todo o custo de vender e de divulgar no período, salários incluídos, dividido pelos clientes que chegaram no período. E, no mesmo parágrafo, o LTV feito sobre a margem e não sobre a receita.

- **David Skok, *SaaS Metrics 2.0 – Detailed Definitions*, de "Customer Lifetime" a "Lifetime Value of Customer"** — For Entrepreneurs, blog do autor, 2014, revisto em dez/2020 · ~4 min de leitura (o trecho)
  https://www.forentrepreneurs.com/saas-metrics-2-definitions-2/#LTV
  A vida média como 1 dividido pelo churn, com o exemplo dos 3% ao mês que dão 33 meses, e o LTV que só fica preciso quando a margem entra na conta.

### 5.3 Unit economics II

**Sugerida**

- **Y Combinator (Tom Blomfield), *Consumer Startup Metrics | Startup School*** — YouTube, canal oficial, jan/2024 · 22 min 26 s no total, trecho de 1 min 11 s, de 13:47 a 14:58
  https://www.youtube.com/watch?v=fdD4y4Civp4&hl=en&persist_hl=1&t=827s
  Retenção quando o uso não é assinatura: qual período define um cliente ativo, que vai do Facebook todo dia ao Airbnb a cada seis meses, e por que esse período sai da frequência com que o cliente bom usa.

- **Bill Gurley, *The Dangerous Seduction of the Lifetime Value (LTV) Formula*** — Above the Crowd, set/2012 · ~11 min de leitura
  https://abovethecrowd.com/2012/09/04/the-dangerous-seduction-of-the-lifetime-value-ltv-formula/
  Dez motivos para não idolatrar o LTV, escritos por um investidor: a fórmula é palpite com cara de ciência, e as variáveis se puxam umas às outras (preço maior aumenta o churn, mais mídia sobe o CAC e traz cliente pior), que é o limite da sensibilidade de uma entrada por vez.

**Citadas na aula**

- **Jeff Jordan, Anu Hariharan, Frank Chen e Preethi Kasireddy, *16 Startup Metrics*, itens 5 "LTV" e 11 "Churn"** — a16z, ago/2015 · ~5 min de leitura (os dois itens)
  https://a16z.com/16-startup-metrics/
  A referência da ementa: o LTV como margem de contribuição vezes vida média, com a vida em 1 dividido pelo churn mensal, e a diferença entre churn bruto e líquido, em que o líquido esconde a perda.

- **Anu Hariharan, Frank Chen e Jeff Jordan, *16 More Startup Metrics*, item 10 "Cohort Analysis"** — a16z, set/2015 · ~3 min de leitura (o item)
  https://a16z.com/16-more-startup-metrics/
  Coorte passo a passo: escolher a ação que conta como uso, o período certo para o negócio, e o que se quer ver na curva, retenção que estabiliza depois de alguns meses e coorte nova melhor que a velha.

- **David Skok, *SaaS Metrics 2.0 – A Guide to Measuring and Improving What Matters*, seções "The SaaS P&L / Cash Flow Trough", "Is your SaaS business viable?" e "Getting paid in advance"** — For Entrepreneurs, blog do autor, jan/2013, revisto em jun/2026 · ~8 min de leitura (as três seções); o artigo inteiro passa de meia hora
  https://www.forentrepreneurs.com/saas-metrics-2/
  A referência de fundo do tema: o buraco de caixa de quem paga o CAC hoje e recebe a margem mês a mês, mais fundo quanto mais rápido se cresce; as duas regras de bolso (razão acima de 3, CAC de volta em menos de 12 meses, nos melhores em 5 a 7), ditas pelo autor como guias; e cobrar adiantado como saída.

- **David Skok, *SaaS Metrics 2.0 – Detailed Definitions*, seções "LTV : CAC Ratio" e "Months to recover CAC"** — For Entrepreneurs, blog do autor, 2014, revisto em dez/2020 · ~3 min de leitura (as duas seções)
  https://www.forentrepreneurs.com/saas-metrics-2-definitions-2/
  O suplemento do artigo acima, com o limite de cada regra escrito pelo próprio autor: o 3 supõe o LTV feito sobre a receita e margem bruta de 80% ou mais, e os 12 meses de payback são de 2011; em venda para grandes empresas, em que o cliente compra mais com o tempo, 20 meses funcionam.

- **Martin Casado e Matt Bornstein, *The New Business of AI (and How It's Different From Traditional Software)*** — a16z, fev/2020 · ~15 min de leitura, mas basta a abertura (~2 min)
  https://a16z.com/the-new-business-of-ai-and-how-its-different-from-traditional-software/
  O mecanismo da margem que some, dito por quem investe em software: empresas de IA com margem bruta em torno de 50 a 60%, contra 60 a 80% ou mais no SaaS comparável, porque cada uso consome computação e às vezes gente.

- **Banco Central do Brasil, *Conversor de moedas*** — bcb.gov.br, em português · consulta
  https://www.bcb.gov.br/conversao
  Fonte pública do câmbio do dia, com data, para a linha da planilha que converte o custo do modelo de dólar para real.

- **Google, *Gemini Developer API pricing*** — Gemini API Docs, atualizado em out/2026 · ~3 min de leitura (o bloco do modelo que a ideia usaria)
  https://ai.google.dev/gemini-api/docs/pricing
  A tabela oficial em dólar por milhão de tokens, entrada e saída separadas, modelo por modelo: a fonte pública com data para estimar uma execução de quem ainda não tem o número da P3.

### 5.4 Distribuição: canais, fits e funil

**Sugerida**

- **Brian Balfour com Lenny Rachitsky, *Why ChatGPT will be the next big growth channel (and how to capitalize on it)*, trecho "The importance of distribution"** — Lenny's Podcast, YouTube, ago/2025 · 1h29min no total, trecho de 3 min 23 s, de 4:45 a 8:08
  https://www.youtube.com/watch?v=cX4cL6B-_aU&hl=en&persist_hl=1&t=285s
  Produto ótimo é necessário e não basta, e por que ficou mais difícil: o incumbente copia mais rápido, a distribuição orgânica encolheu (busca, LinkedIn) e a IA escreve software para todo mundo.

- **Peter Thiel, *Selling Customers -- Getting the Product Out*** — Entrepreneurship.org, YouTube, publicado em ago/2013 · 4 min 58 s
  https://www.youtube.com/watch?v=1RrSEqcR2gY&hl=en&persist_hl=1
  O PayPal de 1999 procurando canal: outdoor cada vez mais caro, o grande parceiro bancário que não deu em nada, os 10 dólares a quem entrava e mais 10 a quem indicava, uns 20 por cliente, contra uns 65 do clique pago, e os vendedores do eBay pedindo para usar o logo.

**Citadas na aula**

- **Peter Thiel com Blake Masters, *Zero to One*, cap. 11 "If You Build It, Will They Come?"** — penguinrandomhouse.com, página do livro na editora; Crown, 2014
  https://www.penguinrandomhouse.com/books/234730/zero-to-one-by-peter-thiel-with-blake-masters/
  O capítulo sobre distribuição: venda ruim, mais que produto ruim, é o que derruba a maioria, e quem constrói tende a subestimar a venda.

- **Alex Rampell, *Distribution vs. Innovation*** — a16z, nov/2015 · ~6 min de leitura
  https://a16z.com/distribution-vs-innovation/
  A frase que resume a assimetria: a briga entre startup e incumbente se decide em quem chega primeiro, a startup à distribuição ou o incumbente à inovação.

- **Guilherme Lima, *Distribuição: Fundamentos de Go-to-Market de Startups Escaláveis*** — Astella, mai/2023 · ~3 min de leitura, em português
  https://www.astella.com.br/matrix/distribuicao-fundamentos-de-go-to-market-de-startups-escalaveis
  Um fundo brasileiro dizendo a mesma coisa em português: produto três estrelas com distribuição cinco estrelas ganha do contrário.

- **Gabriel Weinberg e Justin Mares, *Traction*, introdução e cap. 1 "Traction Channels"** — penguinrandomhouse.com, excerto na página do livro na editora; Portfolio, 2015 · ~10 min de leitura do excerto
  https://www.penguinrandomhouse.com/books/319121/traction-by-gabriel-weinberg-and-justin-mares/
  Os dezenove canais do livro, um parágrafo cada, com a empresa que cresceu por ele, e o erro do próprio Weinberg no começo do DuckDuckGo: usar o canal que tinha dado certo na empresa anterior.

- **Andrew Chen, *The Law of Shitty Clickthroughs*** — andrewchen.com, abr/2012 · ~7 min de leitura
  https://andrewchen.com/the-law-of-shitty-clickthroughs/
  Por que canal alugado decai: todo canal que funciona atrai todo mundo e piora. O banner de 1994 teve 78% de cliques; o anúncio do Facebook de 2011, 0,05%.

- **Brian Balfour, *Product Channel Fit Will Make or Break Your Growth Strategy*** — brianbalfour.com, jul/2017 · ~9 min de leitura
  https://brianbalfour.com/essays/product-channel-fit-for-growth
  "Produtos são feitos para caber em canais; canais não se moldam a produtos", com o que cada canal exige do produto: anúncio pede valor rápido e proposta larga, conteúdo gerado por usuário pede motivo para contribuir.

- **Brian Balfour, *Get Out of the ARPU-CAC Danger Zone with Channel Model Fit*** — brianbalfour.com, jul/2017 · ~7 min de leitura
  https://brianbalfour.com/essays/channel-model-fit-for-user-acquisition
  O espectro entre receita por cliente e custo de aquisição, e a zona do meio: preço alto demais para o canal barato funcionar, baixo demais para pagar o canal caro.

- **Brian Balfour, *Four Fits For $100M+ Growth*** — brianbalfour.com, índice da série, sem data · ~4 min de leitura
  https://brianbalfour.com/four-fits-growth-framework
  Os quatro encaixes de uma vez (mercado e produto, produto e canal, canal e modelo, modelo e mercado) e por que mexer em um mexe nos outros.

- **Gabriel Weinberg, *Real Traction and How to Get It*** — Startup Grind Local, YouTube, jun/2014 (entrevista de jun/2013) · 3 min
  https://www.youtube.com/watch?v=UcAiF42qaTM&hl=en&persist_hl=1
  O autor do Bullseye contando o método antes de o livro sair: cortar o viés, olhar todos os canais, reduzir aos mais promissores, testar em paralelo e dobrar a aposta no que pegar.

- **Dave McClure, *Startup Metrics for Pirates: AARRR!*** — SlideShare, slides da Startonomics SF, 2008 · 58 slides
  https://www.slideshare.net/slideshow/startup-metrics-for-pirates-presentation/629833
  A origem dos cinco estágios, cada um definido numa linha pelo autor: de onde vem o usuário, se a primeira visita foi boa, se ele volta, se indica, se paga.

### 5.5 B2B, B2C e os dez primeiros

**Sugerida**

- **Gustaf Alströmer, *How to Get Your First Customers*, trecho do exemplo da Brex e de como escrever o e-mail** — Y Combinator, Startup School, YouTube, dez/2022 · 22 min 53 s no total, trecho de 3 min 30 s, de 5:05 a 8:35
  https://www.youtube.com/watch?v=hyYCn_kAngI&hl=en&persist_hl=1&t=305s
  Os dois fundadores brasileiros da Brex tirando os dez primeiros clientes do próprio lote da YC com um e-mail, e o sócio da YC desmontando o que fez o e-mail funcionar: curto, sem jargão, dizendo o que o produto faz e pelo problema de quem lê, texto puro, com um pedido no fim.

- **Gustaf Alströmer, *How to Get Your First Customers*, trecho "The sales funnel"** — Y Combinator, Startup School, YouTube, dez/2022 · 22 min 53 s no total, trecho de 5 min 13 s, de 8:37 a 13:50
  https://www.youtube.com/watch?v=hyYCn_kAngI&hl=en&persist_hl=1&t=517s
  O funil do fundador em seis passos (lista, contato, conversa, preço, fechar, pôr para usar), e três conselhos que reordenam a lista da 4.4: os primeiros clientes têm que ser os mais fáceis, quem enrola em três conversas se dispensa, e a maioria não é adepta inicial, só não responde.

**Citadas na aula**

- **Paul Graham, *Do Things that Don't Scale*, seções "Recruit", "Consult" e "Manual"** — paulgraham.com, jul/2013 · ~20 min de leitura (o ensaio inteiro), em inglês
  https://www.paulgraham.com/ds.html
  A referência da aula. Recrutar usuário à mão é o mais comum que não escala; a instalação Collison; o limite em que atenção paga por hora vira consultoria; e ser o próprio software no começo para saber o que automatizar depois.

- **Lenny Rachitsky, *How today's fastest growing B2B businesses found their first ten customers*** — Lenny's Newsletter, jul/2020 · ~15 min de leitura, em inglês
  https://www.lennysnewsletter.com/p/how-todays-fastest-growing-b2b-businesses
  Vinte empresas B2B e de onde vieram os dez primeiros: a rede pessoal (amigos, ex-colegas, investidores), o lugar onde o cliente já está, e imprensa. A Square indo de porta em porta em pequeno comércio é o caso mais perto da ideia dele.

### 5.6 Startup, small business, lifestyle

**Sugerida**

- **Rob Walling, *If I Had To Start Over, Here's 3 Steps I'd Take to $1M+ Revenue*, trecho dos três degraus e do primeiro** — YouTube, canal Rob Walling, nov/2022 · 11 min no total, trecho de 2 min 20 s, de 0:33 a 2:52
  https://www.youtube.com/watch?v=3qUJnFyRlyQ&hl=en&persist_hl=1&t=33s
  O autor resume os três degraus e diz por que o primeiro produto mora dentro de um ecossistema que já traz o cliente, com a analogia de jogar nas ligas menores antes da principal.

**Citadas na aula**

- **Paul Graham, *Startup = Growth*** — paulgraham.com, set/2012 · ~20 min de leitura
  https://paulgraham.com/growth.html
  A definição que a aula usa, "uma empresa desenhada para crescer rápido", com o barbeiro e o buscador lado a lado, a taxa semanal de 5 a 7% da YC e a tabela que mostra o que 1%, 5% e 10% por semana viram em um ano.

- **David Heinemeier Hansson, *RECONSIDER*** — Signal v. Noise, blog da Basecamp, 05/11/2015 · ~12 min de leitura
  https://signalvnoise.com/posts/3972-reconsider
  As razões de quem recusou investidor (independência, cliente que paga pelo produto, raízes longas, semana de quarenta horas) e a conta das chances: 30% de chance de ganhar US$ 3 milhões e 0,3% de chance de ganhar US$ 300 milhões valem o mesmo no papel e pedem estratégias opostas.

- **Rob Walling, *The Stair Step Method of Bootstrapping*** — robwalling.com, 26/03/2015 · ~9 min de leitura
  https://robwalling.com/essays/2015/03/26/the-stair-step-method-of-bootstrapping
  Os três degraus por quem os nomeou, com os casos de quem subiu, e a conta que explica o canal gratuito dos primeiros degraus: produto de US$ 10 a 15 de valor por cliente não paga anúncio nem conteúdo.

### 5.7 A matemática do venture

**Sugerida**

- **Paul Graham, *Default Alive or Default Dead?*, do começo até "plan A isn't working"** — paulgraham.com, out/2015 · ~3 min o trecho, ~7 min o ensaio
  https://paulgraham.com/aord.html
  A pergunta na formulação original, por que tanto fundador não sabe a resposta, e o conselho de começar a fazê-la cedo demais em vez de tarde, com um plano B escrito para o caso de o dinheiro não vir.

- **Dalton Caldwell e Michael Seibel, *Should Your Startup Bootstrap or Raise Venture Capital?*, trecho "Why Seek VC?" e "It's Not Personal"** — Y Combinator, YouTube, fev/2024 · 14 min no total, trecho de 2 min 23 s, de 8:37 a 11:00
  https://www.youtube.com/watch?v=D81y-kh11oI&hl=en&persist_hl=1&t=517s
  Quando o venture faz sentido: precisar de milhões antes de se pagar e não haver outro jeito de conseguir; e por que o não do fundo é conta, não juízo sobre a pessoa ou a ideia.

**Citadas na aula**

- **Chris Dixon, *The Babe Ruth Effect in Venture Capital*** — cdixon.org, jun/2015 · 3 min de leitura
  https://cdixon.org/2015/06/07/the-babe-ruth-effect-in-venture-capital/
  A fonte dos 6% que geram 60% do retorno, com dados da Horsley Bridge sobre centenas de fundos, e o achado que contraria o bom senso: os melhores fundos perdem dinheiro em mais investimentos do que os bons.

- **Bruno Peroni, *Messy Middle e os órfãos de VC*** — Astella, gestora brasileira, jun/2023 · ~7 min de leitura, em português
  https://www.astella.com.br/matrix/messy-middle-e-os-orfaos-de-vc
  O *fund returner* explicado por quem investe aqui: a empresa que sozinha devolve o fundo, mais de 10x o cheque; e, na seção "Stable Growers", o que acontece com quem levantou, tem cliente e às vezes lucro, e cresce pouco para o fundo.

- **Brian Balfour, *The Model Market Fit Threshold & What it Means for Your Growth Strategy*** — brianbalfour.com, jul/2017 · ~7 min de leitura
  https://brianbalfour.com/essays/model-market-fit-threshold-for-growth
  A régua de bolso que liga o teto ao fundo sem falar de valuation: receita anual por cliente, vezes clientes no mercado, vezes a fatia que dá para pegar, tem que dar US$ 100 milhões por ano ou mais.

- **Paul Graham, *How to Raise Money*, seção "Don't raise money unless you want it and it wants you"** — paulgraham.com, set/2013 · a seção tem 1 min; o ensaio inteiro é longo
  https://paulgraham.com/fr.html
  O que faz uma startup é crescer rápido, não captar; quem não quer crescer mais rápido, ou não cresceria mais rápido com o dinheiro, não deve levantar, e nem quem ainda não consegue convencer ninguém.

- **Paul Graham, *The Fatal Pinch*** — paulgraham.com, dez/2014 · ~6 min de leitura
  https://paulgraham.com/pinch.html
  Por que a empresa que conta em levantar de novo para sobreviver chega na conversa na pior posição: gasta mais do que da primeira vez, o investidor exige mais, e ela já começa a parecer fracasso.

- **202 Lab, *A tese*** — 202lab.com.br, site oficial, sem data · ~4 min de leitura, em português
  https://202lab.com.br/tese
  O que a 202 diz que é e o que quer: ecossistema de talentos nas universidades, as cinco frentes (trilhas, rede, serviço, produto, alocação) e a missão de que esses talentos criem ou façam crescer startups.

- **202 Lab, *A trilha*, seção "O percurso"** — 202lab.com.br, site oficial, sem data · 2 min a seção, em português
  https://202lab.com.br/trilha/inscricao
  O que vem depois da trilha, dito pela 202: o que ela acompanha (ritmo, entregas, jeito de pensar), o convite possível ao time, a apresentação a startups e parceiras, e a 202 junto de quem quer fundar.

## Módulo 6

### 6.1 O fluxo pagou → tem acesso

**Sugerida**

- **Stripe, *Como funciona o Checkout* — seção "Checkout lifecycle"** — Stripe Docs, em inglês, sem data · ~2 min (quatro passos e um diagrama)
  https://docs.stripe.com/payments/checkout/how-checkout-works?payment-ui=stripe-hosted&locale=pt-BR#lifecycle
  O ciclo inteiro do Checkout hospedado em quatro passos e um diagrama de quem fala com quem: aplicação, servidor, Stripe, cliente.

**Citadas na aula**

- **Stripe, *Como funcionam as assinaturas*** — Stripe Docs, em português, sem data · consulta, não leitura
  https://docs.stripe.com/billing/subscriptions/overview?locale=pt-BR
  Os estados de uma assinatura (`incomplete`, `active`, `past_due`, `unpaid`, `canceled` e outros), as 23 horas para pagar a primeira fatura, `canceled` como estado final e a instrução de revogar o acesso em `unpaid`.

- **Supabase, *Auth*** — Supabase Docs, em inglês, sem data · ~5 min de leitura
  https://supabase.com/docs/guides/auth
  A visão geral do que vem pronto: cadastro, login, sessão. É o "não invente autenticação" da 2.3 com nome.

- **Supabase, *User Management*** — Supabase Docs, em inglês, sem data · ~6 min de leitura
  https://supabase.com/docs/guides/auth/managing-user-data
  O perfil numa tabela `public.profiles` que aponta para o usuário do Auth, porque o esquema do Auth não sai na API. É onde mora o id do cliente na Stripe.

- **Supabase, *Creating a Supabase client for SSR*** — Supabase Docs, em inglês, sem data · consulta
  https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
  A sessão mora em cookie, e a página diz com todas as letras: no servidor, nunca confiar em `getSession()`, que lê o cookie sem revalidar; conferir com `getClaims()`.

- **Stripe, *Create a Checkout Session*** — Stripe API Reference, em inglês, sem data · consulta, não leitura
  https://docs.stripe.com/api/checkout/sessions/create
  Os campos que ligam a sessão ao usuário dele: `client_reference_id` e `customer`. Também `mode`, `success_url` e `cancel_url`.

- **Stripe, *Contas da Stripe*** — Stripe Docs, em português, sem data · ~3 min de leitura
  https://docs.stripe.com/get-started/account?locale=pt-BR
  Logo depois de criar a conta dá para usar a área restrita, sem movimentar dinheiro; configurar a conta é só para pagamento real.

- **Stripe, *Áreas restritas*** — Stripe Docs, em português com trechos em inglês, sem data · ~5 min de leitura
  https://docs.stripe.com/sandboxes?locale=pt-BR
  A sandbox geral contra a do modo de teste, e a recomendação da Stripe: integração nova vai numa geral, que isola dados e configurações da produção.

- **Stripe, *Chaves de API*** — Stripe Docs, em português, sem data · ~6 min de leitura
  https://docs.stripe.com/keys?locale=pt-BR
  A tabela das chaves: a publicável (`pk_`) pode ir para o navegador; a restrita (`rk_`) e a secreta (`sk_`) não. A Stripe não recomenda mais a secreta para uso novo.

- **Stripe, *Criar uma página de pagamentos*** — Stripe Docs, em português, sem data · ~4 min de leitura
  https://docs.stripe.com/payments/checkout?locale=pt-BR
  As três formas de pôr o pagamento na tela, com a página completa hospedada pela Stripe como a recomendada e a de menor manutenção.

- **Stripe, *Guia de segurança de integração*** — Stripe Docs, em português, sem data · ~8 min de leitura
  https://docs.stripe.com/security/guide?locale=pt-BR
  O argumento contra o formulário próprio: quem lida com número de cartão direto pode ter de cumprir mais de 300 controles do PCI DSS; com o Checkout, o dado vai direto para a Stripe.

- **Stripe, *Testes*** — Stripe Docs, em português, sem data · consulta
  https://docs.stripe.com/testing?locale=pt-BR
  O `4242 4242 4242 4242`, com qualquer data futura e qualquer CVC, e os cartões que recusam.

- **Stripe, *Disponibilize um portal do cliente aos seus clientes*** — Stripe Docs, em português, sem data · ~5 min de leitura
  https://docs.stripe.com/customer-management?locale=pt-BR
  Trocar cartão, ver fatura e cancelar, imediatamente ou no fim do período, numa página que a Stripe hospeda: o passo de cancelamento do desenho dele.

- **Banco Central do Brasil, *Pix Automático*** — bcb.gov.br, em português, sem data · ~4 min de leitura
  https://www.bcb.gov.br/estabilidadefinanceira/pix-automatico
  O que é, pela fonte: o pagador autoriza uma vez, define o valor máximo, e o banco agenda e avisa antes de cada cobrança.

- **Stripe, *Pagamentos com PIX*** — Stripe Docs, em português, sem data · ~6 min de leitura
  https://docs.stripe.com/payments/pix?locale=pt-BR
  A frase que decide a P6: "O Pix Automático não está disponível no Brasil". Sobre o Pix avulso, a página diz que a conta brasileira aceita; a tabela geral diz que é sob convite. A recorrência por Pix só existe para empresa de fora cobrando brasileiro.

- **Stripe, *Payment method support*** — Stripe Docs, em inglês, sem data · consulta
  https://docs.stripe.com/payments/payment-methods/payment-method-support?locale=pt-BR
  A tabela geral, onde o Pix aparece como "BR (Invite only)": a contradição com a página do Pix, que ninguém resolve sem conta criada.

- **Stripe, *Pagamentos por boleto*** — Stripe Docs, em português com trechos em inglês, sem data · ~3 min de leitura (o topo)
  https://docs.stripe.com/payments/boleto?locale=pt-BR
  O boleto como forma de pagamento só da conta brasileira, em reais, com a confirmação em até um dia útil: é o estado de espera que o desenho dele precisa ter.

- **Aurora Harley, *Visibility of System Status*** — Nielsen Norman Group, jun/2018 · ~9 min de leitura, em inglês
  https://www.nngroup.com/articles/visibility-system-status/
  A primeira heurística de usabilidade: o sistema sempre diz em que estado está, com retorno em tempo razoável. É a "tela honesta" com nome.

### 6.2 Webhook e estado

**Sugerida**

- **Stripe Developers (James Beswick), *Webhook handling – Building rock-solid Stripe integrations #1*** — YouTube, canal oficial, jun/2025 · 6 min
  https://www.youtube.com/watch?v=47sSju0UhPk&hl=en&persist_hl=1
  Os três cuidados do marco na voz de quem faz a Stripe: verificar a assinatura, aguentar o evento duplicado e responder rápido, processando depois.

**Citadas na aula**

- **Stripe, *Executar pedidos* — seção "Execução de gatilhos na sua página de destino"** — Stripe Docs, em português, sem data · ~4 min de leitura (a seção e o aviso do topo)
  https://docs.stripe.com/checkout/fulfillment?payment-ui=stripe-hosted&locale=pt-BR#trigger-fulfillment-on-landing-page
  O aviso de que não dá para depender da página de retorno, porque não é garantido que o cliente chegue a ela, e a receita certa de liberar também ali: consultar a sessão na API, no servidor, e ler o `payment_status`.

- **Stripe, *Receba eventos da Stripe no seu endpoint de webhook* — seção "Verificar se eventos são enviados da Stripe"** — Stripe Docs, em português, sem data · ~5 min de leitura (a seção)
  https://docs.stripe.com/webhooks?locale=pt-BR#verify-events
  A frase da Stripe sobre o ataque: sem verificação, um invasor manda evento falso para conceder acesso; e como conferir o `Stripe-Signature` com a biblioteca oficial, o segredo `whsec_` e o corpo cru.

- **Stripe, *Receba eventos...* — seção "Práticas recomendadas para uso de webhooks"** — Stripe Docs, em português, sem data · ~6 min de leitura (a seção inteira: duplicados é a primeira subseção, a resposta rápida é a última)
  https://docs.stripe.com/webhooks?locale=pt-BR#best-practices
  Evento duplicado acontece e se trata guardando o ID de cada evento processado, e o 2xx sai rápido, antes da lógica demorada.

- **Stripe, *stripe listen*** — Stripe CLI Reference, sem data · ~2 min de leitura
  https://docs.stripe.com/cli/listen?locale=pt-BR
  O `--forward-to` que encaminha os eventos da sandbox para a rota local e devolve o segredo de assinatura dele, que não muda entre reinícios.

- **Stripe, *stripe login*** — Stripe CLI Reference, sem data · ~1 min de leitura
  https://docs.stripe.com/cli/login?locale=pt-BR
  O passo que trava: nas versões da CLI acima da 1.50.0, o administrador da conta libera o acesso da CLI no painel antes de o login funcionar. Ele é o administrador da conta dele.

- **Stripe, *stripe trigger*** — Stripe CLI Reference, sem data · ~2 min de leitura
  https://docs.stripe.com/cli/trigger?locale=pt-BR
  Dispara um evento com objetos de verdade na sandbox, entre eles os do checkout, da fatura e da assinatura que a aula usa.

- **Stripe, *stripe-node* — seção "Testing Webhook signing"** — GitHub, README da biblioteca oficial, sem data · ~1 min de leitura
  https://github.com/stripe/stripe-node#testing-webhook-signing
  A biblioteca gera um cabeçalho de assinatura válido para um evento montado no teste, com um segredo de teste: é o que deixa os quatro testes da fluência rodarem sem rede e sem chave.

- **OWASP, *Logging Cheat Sheet* — seção "Data to exclude"** — OWASP Cheat Sheet Series, sem data · ~2 min de leitura (a seção)
  https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude
  A lista do que não vai para o log, ou vai mascarado: token, chave, identificador de governo, dado de cartão e dado pessoal sensível. É o "log limpo" da ementa, item por item.

- **Stripe, *Pagamentos por boleto* — seção "Execute seu pedidos"** — Stripe Docs, em português, sem data · ~2 min de leitura (a tabela)
  https://docs.stripe.com/payments/boleto/accept-a-payment?payment-ui=checkout&locale=pt-BR#fulfill-your-orders
  A tabela que desmonta o atalho: `checkout.session.completed` quer dizer que a Stripe gerou o boleto, e só o `async_payment_succeeded` quer dizer pago; o `async_payment_failed` é o boleto vencido.

- **Stripe, *Visão geral das assinaturas* — seção "Formas de pagamento com confirmação de pagamento adiada"** — Stripe Docs, em português, sem data · ~1 min de leitura (a seção)
  https://docs.stripe.com/billing/subscriptions/overview?locale=pt-BR#delayed-payment-confirmation
  A assinatura paga por forma adiada pode ir direto para `active` sem passar por `incomplete`, e continua `active` se o pagamento falhar depois.

- **Stripe, *Usar webhooks com assinaturas* — seção "Capturar alterações de status de assinaturas"** — Stripe Docs, em português, sem data · ~3 min de leitura (a seção e a tabela de status)
  https://docs.stripe.com/billing/subscriptions/webhooks?locale=pt-BR#state-changes
  `canceled` e `unpaid` revogam o acesso, e o que acontece depois de uma renovação que falha (`past_due`, `canceled` ou `unpaid`) depende da configuração que ele escolhe no painel.

### 6.3 Mostrar o trabalho

**Sugerida**

- **Simon Willison, *Your job is to deliver code you have proven to work*** — simonwillison.net, 18/12/2025 · ~6 min de leitura, em inglês
  https://simonwillison.net/2025/Dec/18/code-proven-to-work/
  O trabalho não é entregar código, é entregar código com a prova de que funciona: o teste manual com a saída colada ou um vídeo da tela, o teste automático, e o agente obrigado a provar antes de você.

- **Julia Evans, *Get your work recognized: write a brag document*** — jvns.ca, 28/06/2019 · ~11 min de leitura, em inglês
  https://jvns.ca/blog/brag-documents/
  Anotar o que você fez e por que importou enquanto ainda lembra, porque ninguém lembra por você, nem você mesmo seis meses depois.

**Citadas na aula**

- **GitHub, *Sobre o arquivo README do repositório*** — GitHub Docs, em português, sem data · ~3 min de leitura
  https://docs.github.com/pt/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
  "Um README, muitas vezes, é o primeiro item que um visitante verá", e a lista do que ele costuma dizer: o que o projeto faz, por que é útil, como começar.

- **Jina Yoon, *24 tips for giving S-tier demos*** — PostHog, newsletter, 28/05/2026 · ~7 min de leitura, em inglês
  https://posthog.com/newsletter/how-to-demo
  Dicas tiradas de demos de hackathon: um ponto só, abrir pela dor que todo mundo conhece, demonstrar contra o jeito de hoje, nada de código puro na tela, ensaiar em voz alta.

- **GitHub, *Gerenciar o README do seu perfil*** — GitHub Docs, em português, sem data · ~3 min de leitura
  https://docs.github.com/pt/account-and-profile/how-tos/profile-customization/managing-your-profile-readme
  Um repositório público com o mesmo nome do usuário vira a apresentação do perfil: o lugar natural para a linha de cada projeto.

- **GitHub, *Fixar itens no seu perfil*** — GitHub Docs, em português, sem data · ~2 min de leitura
  https://docs.github.com/pt/account-and-profile/how-tos/profile-customization/pinning-items-to-your-profile
  Até seis repositórios fixados no topo do perfil: P1, P2, P3 e, depois, a P6 cabem com folga.

- **Supabase, *Project Pausing*** — Supabase Docs, sem data · ~2 min de leitura, em inglês
  https://supabase.com/docs/guides/platform/free-project-pausing
  Projeto do plano gratuito com pouca atividade em sete dias é pausado, e se retoma pelo painel: é por isso que a URL que abria em setembro pode não responder hoje.
