# Referências da trilha

Tudo aqui é opcional. A aula se sustenta sozinha: isto é para quem quer ir além, na hora ou depois. Você também pode pedir ao Claude, na sala: `/referencias`.

Cada aula tem no máximo uma **sugerida**, que é a que vale de verdade se você for ver só uma coisa. As **citadas** são a fonte do que foi dito na aula.

> Arquivo gerado por `node .claude/scripts/trilha.js dev referencias`. Para mudar algo, edite o `referencias.md` da aula e gere de novo.

## Módulo 0

### 0.1 Como funciona a trilha

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

### 1.11 Subagentes, MCP e plugins

**Sugerida**

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

## Módulo 2

### 2.1 O que significa shippar

**Sugerida**

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

### 2.2 Cliente, servidor e API

**Sugerida**

- **Next.js, *How to use environment variables in Next.js — Bundling Environment Variables for the Browser*** — documentação oficial · ~2 min de leitura
  https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
  É onde a fronteira entre front e back vira uma regra que se pode conferir: sem o prefixo `NEXT_PUBLIC_` a variável fica só no servidor, com o prefixo ela é colada dentro do JavaScript que desce para o navegador.

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

- **Anthropic, *Checkpointing*, seção "Limitations"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/checkpointing#limitations
  O contraste que a aula precisa, escrito pela própria Anthropic: o checkpoint não pega o que o bash mexeu, nem o que subagente editou, nem mudança feita fora da sessão, e a página fecha dizendo que ele não substitui controle de versão.

### 2.5 Branches, PRs e o remoto

**Sugerida**

- **GitHub, *How to create a pull request in 4 min | GitHub for Beginners*** — YouTube, ago/2024 · 3 min 44 s
  https://www.youtube.com/watch?v=nCKdihvneS0&hl=en&persist_hl=1
  Canal oficial do GitHub: em menos de quatro minutos o aluno vê a tela do PR de verdade — o botão, o diff, o merge — que é o que falta para quem nunca abriu um.

**Citadas na aula**

- **Scott Chacon e Ben Straub, *Ramificação (Branching) e Mesclagem (Merging) Básicas*** — Pro Git, 2ª edição, tradução pt-br · ~10 min de leitura (~4 min só a Ramificação Básica)
  https://git-scm.com/book/pt-br/v2/Ramifica%C3%A7%C3%A3o-Branching-no-Git-Ramifica%C3%A7%C3%A3o-Branching-e-Mesclagem-Merging-B%C3%A1sicas#_basic_branching
  Conta a história inteira em um exemplo: você está no meio da tarefa 53, chega um bug urgente, você troca de branch, resolve, volta e o trabalho continua onde estava — e a mesma página termina em conflito de merge, com os marcadores na tela.

- **GitHub, *About pull requests*** — GitHub Docs · ~2 min de leitura
  https://docs.github.com/en/pull-requests/get-started/about-pull-requests#key-parts-of-a-pull-request
  Lista o que um PR junta — Conversation, Commits, Checks, Files changed e a merge box — e é exatamente por isso que ele é a unidade de revisão: a conversa, o histórico, os testes e o diff no mesmo lugar.

- **Scott Chacon e Ben Straub, *Branches Remotos (Remote Branches)*** — Pro Git, 2ª edição, tradução pt-br · ~11 min de leitura (~3 min só a seção de push)
  https://git-scm.com/book/pt-br/v2/Ramifica%C3%A7%C3%A3o-Branching-no-Git-Branches-Remotos-Remote-Branches#_pushing_branches
  Diz a frase que desfaz a confusão mais comum de quem acabou de aprender git local: branches locais não são sincronizados sozinhos com o remoto, você empurra explicitamente o que quer compartilhar.

- **GitHub, *Reviewing proposed changes in a pull request*** — GitHub Docs · ~9 min de leitura (~2 min a seção Starting a review)
  https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request#starting-a-review
  Mostra onde o diff mora (aba Files changed), como alternar entre visão unificada e lado a lado, e como o comentário gruda numa linha específica — que é o que o revisor adversarial precisa apontar.

### 2.6 Segredos e ambientes

**Sugerida**

- **Joe Leon, *Anyone can Access Deleted and Private Repository Data on GitHub*** — Truffle Security, julho/2024 · 9 min de leitura
  https://trufflesecurity.com/blog/anyone-can-access-deleted-and-private-repo-data-github
  Demonstra que commit de fork apagado, de repositório apagado e de repositório que virou privado continua acessível pelo hash, e conclui que rotacionar a chave é a única remediação real.

**Citadas na aula**

- **Vercel, *How to use environment variables in Next.js*** — documentação do Next.js · 6 min de leitura
  https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
  Explica que o prefixo `NEXT_PUBLIC_` faz o valor ser gravado dentro do JavaScript entregue ao navegador: é a prova, na documentação oficial, de que existe uma diferença dura entre variável do servidor e variável pública.

- **GitHub, *Remover dados confidenciais de um repositório*** — GitHub Docs, em português · 10 min de leitura
  https://docs.github.com/pt/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository#about-removing-sensitive-data-from-a-repository
  A própria documentação do GitHub diz que o primeiro passo é revogar ou trocar o segredo, e que reescrever o histórico pode nem ser necessário depois disso — é a ordem invertida do que o aluno imagina.

- **Adam Wiggins, *III. Configurações*, The Twelve-Factor App** — 12factor.net, 2011, revisto em 2017 · 3 min de leitura
  https://12factor.net/pt_br/config
  Traz o teste que resolve a dúvida de uma vez: se o repositório pudesse virar público agora mesmo, sem vazar nenhuma credencial, a configuração está no lugar certo.

- **Vercel, *Environments* — seção Preview Environment** — documentação da Vercel · 2 min de leitura
  https://vercel.com/docs/deployments/environments#preview-environment-pre-production
  Lista exatamente o que dispara um preview (commit fora da branch de produção, pull request, `vercel` sem `--prod`) e a diferença entre a URL da branch e a URL do commit.

### 2.8 O problema bem definido

**Sugerida**

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

- **Anthropic, *Best practices*, seção "Let Claude interview you"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/best-practices#let-claude-interview-you
  O último parágrafo é a definição de spec útil que esta aula cobra: nomeia arquivos e interfaces, diz o que fica fora, e termina com uma verificação ponta a ponta que prova que a feature funciona.

- **Edsger W. Dijkstra, *On the foolishness of "natural language programming"* (EWD 667)** — E.W. Dijkstra Archive, Universidade do Texas, c. 1978 · ~5 min de leitura
  https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html
  Argumenta que a naturalidade da língua é a facilidade de dizer coisas cujo absurdo não é óbvio, e que o símbolo formal é privilégio, não fardo: é a objeção mais forte à tese de que a spec é o código.

### 2.10 Testes e TDD com agentes

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

### 3.9 Ferramentas e agentes no produto

**Sugerida**

- **Barry Zhang, *How We Build Effective Agents*** — AI Engineer, abr/2025 · 15 min
  https://www.youtube.com/watch?v=D7_ipDqhtwk&hl=en&persist_hl=1
  Um dos autores do artigo defende, em quinze minutos, que agente é caro e que workflow resolve quase tudo: é a tese do último marco dita por quem escreveu a fonte.

**Citadas na aula**

- **Anthropic, *How tool use works*** — Claude Platform Docs · ~1 min de leitura (a seção)
  https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works#the-agentic-loop-client-tools
  A seção escreve o loop como cinco passos em torno do `stop_reason`, que é exatamente o que o aluno precisa ver para entender que o modelo pede e o servidor executa.

- **Anthropic, *How the agent loop works*** — Claude Code Docs, Agent SDK · ~1 min de leitura (a seção)
  https://code.claude.com/docs/en/agent-sdk/agent-loop#the-loop-at-a-glance
  Um loop de agente real, em produto que roda, descrito em cinco passos e um diagrama: serve de contraste concreto com o fluxo fixo.

- **Erik S. e Barry Zhang, *Building effective agents*** — Anthropic Engineering, dez/2024 · ~10 min de leitura (a seção)
  https://www.anthropic.com/engineering/building-effective-agents#building-blocks-workflows-and-agents
  É a fonte dos cinco padrões que a aula usa, cada um com o diagrama e uma linha de quando aplicar; a ementa da aula é o índice desta seção.

- **Model Context Protocol, *Architecture overview*** — modelcontextprotocol.io · ~2 min de leitura (a seção)
  https://modelcontextprotocol.io/docs/learn/architecture#primitives
  Define as três primitivas do servidor — tools, resources, prompts — que é o que separa MCP de "mais um jeito de chamar API".
