# Referências da trilha

Tudo aqui é opcional. A aula se sustenta sozinha: isto é para quem quer ir além, na hora ou depois. Você também pode pedir ao Claude, na sala: `/referencias`.

Cada aula tem no máximo uma **sugerida**, que é a que vale de verdade se você for ver só uma coisa. As **citadas** são a fonte do que foi dito na aula.

> Arquivo gerado por `node .claude/scripts/trilha.js dev referencias`. Para mudar algo, edite o `referencias.md` da aula e gere de novo.

## Módulo 0

### 0.1 Terminal, git mínimo e as duas janelas

**Sugerida**

- **Django Girls, *Introdução à linha de comando*** — tutorial.djangogirls.org, em português · 15 min de leitura
  https://tutorial.djangogirls.org/pt/intro_to_command_line/
  O único material em português escrito para quem nunca abriu um terminal: os quatro comandos, nos três sistemas, com exercício no fim.

**Citadas na aula**

- **Anthropic, *Terminal guide for new users*** — documentação do Claude Code · 10 min de leitura
  https://code.claude.com/docs/en/terminal-guide
  A página oficial para quem nunca usou terminal, com o que fazer quando o comando `claude` não é reconhecido.

- **Anthropic, *Advanced setup*, seção "Set up on Windows"** — documentação do Claude Code · 4 min de leitura
  https://code.claude.com/docs/en/setup#set-up-on-windows
  A tabela de Windows nativo contra WSL, e o aviso de que no WSL o `claude` roda de dentro do WSL, não do PowerShell.

- **GitHub, *Sobre o Git*** — GitHub Docs, em português · 10 min de leitura
  https://docs.github.com/pt/get-started/using-git/about-git
  Repositório, commit e clone em português e sem drama, que é exatamente o recorte desta aula.

- **Anthropic, *Quickstart*, passo 6** — documentação do Claude Code · 1 min de leitura
  https://code.claude.com/docs/en/quickstart
  Confirma na fonte que git aqui é conversa: "commit my changes with a descriptive message" e o agente faz.

- **Claude, *Your first Claude Code prompt*** — canal oficial no YouTube, mai/2026 · 2 min 27 s
  https://www.youtube.com/watch?v=gbetp6D7J_Q&hl=en&persist_hl=1
  Dois minutos e meio mostrando o primeiro prompt num projeto de verdade, e a diferença entre aprovar à mão e deixar correr.

- **Anthropic, *Claude Code 101*** — Claude Academy · curso gratuito, 12 aulas, 1h30
  https://academy.claude.com/courses
  De onde saem os vídeos curtos que aparecem nesta aula e na 1.2. Para quem quiser a versão longa, por conta própria.

### 0.2 Como se estuda aqui

**Sugerida**

- **Lydia Hallie, *Choosing a Claude model and effort level in Claude Code*** — blog da Anthropic, jul/2026 · 5 min de leitura
  https://claude.com/blog/claude-model-and-effort-level-in-claude-code
  Dá o critério de decisão que ele vai usar o resto da trilha: o agente não tentou o bastante, ou não sabia o bastante?

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

## Módulo 1

### 1.1 Vibe coding e engenharia agêntica

**Sugerida**

- **Andrej Karpathy: From Vibe Coding to Agentic Engineering, com Stephanie Zhan** — Sequoia Capital, abr/2026 · 30 min
  https://www.youtube.com/watch?v=96jN2OCOfLs&hl=en&persist_hl=1
  É a aula inteira contada pelo cara que cunhou o termo, com o mesmo arco: vibe coding de um lado, engenharia agêntica do outro. Se ele for ver um só material desta aula, é este.

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

### 1.2 Claude Code por dentro

**Sugerida**

- **Claude, *How Claude Code Works*** — canal oficial no YouTube, mai/2026 · 2 min 51 s
  https://www.youtube.com/watch?v=6bs5b4FltCU&hl=en&persist_hl=1
  A ementa desta aula em menos de três minutos — loop, janela de contexto, ferramentas e modos —, com o objetivo declarado de que o Claude Code pare de parecer caixa mágica.

**Citadas na aula**

- **Erik S. e Barry Zhang, *Building effective agents*** — Anthropic, engenharia, dez/2024 · 15 min de leitura
  https://www.anthropic.com/engineering/building-effective-agents
  A definição de agente sem marketing: o modelo dirige o próprio processo e ganha informação do ambiente a cada passo. É por isso que ele roda o teste.

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

- **Anthropic, *Best practices for Claude Code*, seção "Give Claude a way to verify its work"** — documentação do Claude Code · 4 min a seção
  https://code.claude.com/docs/en/best-practices#give-claude-a-way-to-verify-its-work
  A aula inteira em uma seção, com uma tabela de prompts antes e depois que ele copia direto para a oficina.

**Citadas na aula**

- **Anthropic, *Claude Code power user tips*, seção "Verification — the #1 Tip"** — Central de Ajuda · 15 min de leitura
  https://support.claude.com/en/articles/14554000-claude-code-power-user-tips
  É a origem da frase que abre esta aula: se ele adotar uma única prática da lista inteira, que seja dar ao agente um jeito de conferir a própria saída.

- **Anthropic, *Keep Claude working toward a goal*** — documentação do Claude Code · 11 min de leitura
  https://code.claude.com/docs/en/goal
  A página do comando que esta aula ensina: como escrever a condição, o que o avaliador enxerga (só a conversa), e como limitar quantos turnos ele roda.

- **Anthropic, *Best practices*, seção "Add an adversarial review step"** — documentação do Claude Code · 3 min de leitura
  https://code.claude.com/docs/en/best-practices#add-an-adversarial-review-step
  O prompt de revisão pronto — reporte lacunas, não preferências de estilo — e o contrapeso honesto: revisor mandado achar defeito sempre acha algum, e perseguir todos leva a excesso de engenharia.

### 1.4 Onde o LLM erra

**Sugerida**

- **OpenAI, *Por que os modelos de linguagem alucinam?*** — openai.com, set/2025 · 8 min de leitura
  https://openai.com/pt-BR/index/why-language-models-hallucinate/
  Em português, e com a explicação que reorganiza a cabeça do aluno: o modelo chuta porque a avaliação premia o chute e pune o "não sei" — do mesmo jeito que um aluno faz numa prova de múltipla escolha.

**Citadas na aula**

- **3Blue1Brown, *Transformers, the tech behind LLMs*** — YouTube, abr/2024 · 27 min no total, trecho de 3 min
  https://www.youtube.com/watch?v=wjZofJX0v4M&hl=en&persist_hl=1
  Os três primeiros minutos, o capítulo "Predict, sample, repeat": o modelo produz uma distribuição de probabilidade sobre o próximo pedaço e sorteia dela. É a mecânica inteira desta aula, visual e sem metáfora.

- **Adam Tauman Kalai, Ofir Nachum, Santosh Vempala e Edwin Zhang, *Why Language Models Hallucinate*** — arXiv, set/2025 · artigo científico
  https://arxiv.org/abs/2509.04664
  A fonte primária, para o aluno que quiser ver que isso não é opinião de blog.

- **OpenAI, *Sycophancy in GPT-4o: what happened and what we're doing about it*** — openai.com, abr/2025 · 3 min de leitura
  https://openai.com/index/sycophancy-in-gpt-4o/
  Sicofância não é teoria: uma versão que concordava com tudo foi ao ar e teve que ser revertida.

### 1.5 O prompt como interface

**Sugerida**

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

- **Anthropic, *Best practices for prompt engineering for 2026*** — blog da Claude, nov/2025 · 12 min de leitura
  https://claude.com/blog/best-practices-for-prompt-engineering
  Tem uma seção inteira de erros comuns, que é o espelho dos antipadrões desta aula.

### 1.6 Modos, permissões e modelo

**Sugerida**

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

- **Anthropic, *Choosing the right model*** — documentação da plataforma Claude · 6 min de leitura
  https://platform.claude.com/docs/en/about-claude/models/choosing-a-model
  Como escolher sem ter benchmark próprio, e o ponto que quase ninguém sabe: ajustar o esforço costuma render mais que trocar de modelo.

### 1.7 Higiene de contexto

**Sugerida**

- **Claude, *Context Management in Claude Code*** — canal oficial no YouTube, série Claude Code 101, mai/2026 · 3 min 30 s
  https://www.youtube.com/watch?v=eW3oTyfeWZ0&hl=en&persist_hl=1
  Oficial, curtíssimo e exatamente esta aula: contexto como memória de trabalho, quando compactar e quando limpar.

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

- **Anthropic, *Checkpointing*** — documentação do Claude Code · 8 min de leitura
  https://code.claude.com/docs/en/checkpointing
  Lista em preto no branco o que o desfazer não salva: mudança feita por comando de terminal, edição de subagente, alteração externa. A última seção se chama, literalmente, "não substitui controle de versão".

- **Anthropic, *Manage sessions*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/sessions
  Nomear, retomar e ramificar sessão, e o que uma sessão retomada de fato restaura.

### 1.8 Skills, hooks e guardrails

**Sugerida**

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

### 1.9 Uma página que vende

**Sugerida**

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

- **Erik D. Kennedy, *7 Rules for Creating Gorgeous UI (Updated for 2024)*, parte 1** — Learn UI Design, atualizado em jun/2024 · 13 min de leitura
  https://www.learnui.design/blog/7-rules-for-creating-gorgeous-ui-part-1.html
  Luz vem de cima, preto e branco antes da cor, e dobre o espaço em branco. É a única coisa desta aula cujo efeito ele vê na própria página no mesmo dia.

**Citadas na aula**

- **Anthropic, *Introducing Claude Design*** — Anthropic, abr/2026 · 6 min de leitura
  https://www.anthropic.com/news/claude-design-anthropic-labs
  Descrever, receber uma primeira versão e refinar por conversa e edição direta, em vez de pedir "deixa mais bonito" no escuro.

- **Vercel, *Next.js Installation*** — documentação do Next.js, atualizado em jul/2026 · 10 min de leitura
  https://nextjs.org/docs/app/getting-started/installation
  A porta de entrada da stack e o que vem por padrão. Detalhe que vale mostrar: o gerador já cria um arquivo de instruções para agentes de código.

- **Vercel, *Environments*** — documentação da Vercel, atualizado em ago/2026 · 8 min de leitura
  https://vercel.com/docs/deployments/environments
  O que "no ar" significa: cada branch vira uma URL de pré-visualização, e produção é o endereço que ele manda para alguém.

- **Breno Luiz, *Como hospedar um site na Vercel em 3 minutos*** — YouTube, em português, dez/2025 · 3 min 1 s
  https://www.youtube.com/watch?v=mhbYavuW9T4&hl=en&persist_hl=1
  Três minutos, em português, conectando o repositório e vendo o site no ar. Aqui o obstáculo é de interface, e ver alguém clicando resolve melhor que ler.

- **Vercel, *Getting started with Vercel*** — documentação da Vercel, atualizado em ago/2026 · 4 min de leitura
  https://vercel.com/docs/getting-started-with-vercel
  A rede de segurança quando a tela não bater com a do vídeo: os dois caminhos oficiais, pelo terminal e pelo painel.

- **Anthropic, *Best practices for Claude Code*, seção "Give Claude a way to verify its work"** — documentação do Claude Code · 3 min a seção
  https://code.claude.com/docs/en/best-practices#give-claude-a-way-to-verify-its-work
  Traz o screenshot como check na forma de prompt copiável: implemente, tire um screenshot do resultado, compare com o original, liste as diferenças e corrija.
