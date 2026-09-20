# Referências, aula 1.11

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três ressalvas desta aula. Documentação é material vivo e não traz data: se não bater
com a versão do aluno, vale a máquina dele. As páginas de subagentes e de MCP são
longas e cheias de opção — cite e siga, não são leitura de aula. E o navegador da
fluência é a extensão do Chrome, que exige plano direto (o Pro serve) e não roda em
WSL; se não conectar, um servidor MCP de navegador instalado por comando cumpre a
mesma fluência, e a página de MCP mostra como se adiciona um.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `subagentes-por-papel`**

- **Anthropic, *Extend Claude Code*** — documentação do Claude Code · ~12 min de leitura
  https://code.claude.com/docs/en/features-overview
  A referência da ementa: a tabela que casa cada peça com o gatilho que a pede — quando vira CLAUDE.md, skill, subagente, MCP, hook ou plugin — e quanto contexto cada uma custa.

- **Anthropic, *Create custom subagents*** — documentação do Claude Code · ~25 min de leitura
  https://code.claude.com/docs/en/sub-agents
  O arquivo em `.claude/agents/` com nome, descrição, ferramentas e modelo; o contexto isolado que devolve só o resumo; e os subagentes que já vêm prontos.

A primeira é a visão geral e cabe na abertura; a segunda é referência de trabalho para
a fluência, e o aluno não precisa lê-la para escrever o revisor — quem escreve o arquivo
é o Claude da oficina, a pedido dele.

**marco `sessoes-paralelas`**

- **Anthropic, *Run parallel sessions with worktrees*, seção "Start Claude in a worktree"** — documentação do Claude Code · 3 min a seção
  https://code.claude.com/docs/en/worktrees#start-claude-in-a-worktree
  O que o worktree é (cópia própria do repositório, na mesma história), o comando que abre um, e que exige repositório git.

- **Anthropic, *Desktop application*, seção "Work in parallel with sessions"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/desktop#work-in-parallel-with-sessions
  A opção de worktree no diálogo de sessão nova do aplicativo, que é onde o aluno está; o comando fica para quem usa terminal.

**marco `mcp`**

- **Anthropic, *Connect Claude Code to tools via MCP*** — documentação do Claude Code · ~15 min de leitura
  https://code.claude.com/docs/en/mcp
  Como um servidor se adiciona, os três escopos (o de projeto vai para o repositório) e o aviso em destaque: confira se confia no servidor antes de conectar, porque servidor que busca conteúdo externo expõe a injeção.

- **Anthropic, *Use Claude Code with Chrome*** — documentação do Claude Code · ~10 min de leitura
  https://code.claude.com/docs/en/chrome
  O navegador da fluência. A extensão compartilha o login do aluno, então o agente alcança qualquer site em que ele já esteja logado: é o exemplo mais nítido de alcance que a aula tem.

**marco `plugins`**

- **Anthropic, *Discover and install prebuilt plugins through marketplaces*, seção "Security"** — documentação do Claude Code · 1 min a seção
  https://code.claude.com/docs/en/discover-plugins#security
  Três frases: plugin e marketplace executam código arbitrário na máquina, com os privilégios do usuário; instale só de fonte em que confia.

- **Stephen Thoemmes, *How "Clinejection" Turned an AI Bot into a Supply Chain Attack*** — Snyk, fev/2026 · ~13 min de leitura
  https://snyk.io/blog/cline-supply-chain-attack-prompt-injection-github-actions/
  O caso da aula, passo a passo: injeção pelo título de uma issue, credencial vazada, versão adulterada no npm por oito horas instalando outro agente — dado não confiável entrando no agente mais ferramenta que executa.

A seção de segurança da documentação vale citar em voz alta, não só linkar: é a
Anthropic dizendo que não controla o que vai dentro de um plugin. O caso da Cline é
longo e técnico no meio (cache de CI); o que o aluno precisa está no começo e no fim.

- **SentinelOne, *When Your AI Coding Plugin Starts Picking Your Dependencies: Marketplace Skills and Dependency Hijack in Claude Code*** — sentinelone.com, jan/2026 · 2 min de leitura
  https://www.sentinelone.com/blog/marketplace-skills-and-dependency-hijack-in-claude-code/
  Um segundo mecanismo, no Claude Code mesmo: o plugin malicioso não rouba credencial, troca a fonte de instalação de um pacote, e a versão adulterada entra limpa, sem erro.

Fecha a lacuna "isso também acontece aqui": o Cline é de outra ferramenta, este é desta.

## Sugeridas

**marco `mcp`**

- **Claude, *MCP in Claude Code*** — canal oficial no YouTube, série Claude Code 101, mai/2026 · 3 min 37 s
  https://www.youtube.com/watch?v=kkBFmwkDzdo&hl=en&persist_hl=1
  Adicionar um servidor, escopar por equipe e o custo de contexto, mostrados por dentro do Claude Code em vez do protocolo em abstrato.

Ofereça quando o marco abrir: mecanismo primeiro, risco depois. Três minutos pausam sem custo.

- **Simon Willison, *The lethal trifecta for AI agents: private data, untrusted content, and external communication*** — simonwillison.net, jun/2025 · ~7 min de leitura
  https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
  A régua para decidir o que conectar: dado privado, conteúdo não confiável e saída para fora. Juntar os três num agente é o risco, e MCP convida a juntar sem perceber.

Sete minutos: ofereça logo depois do vídeo, no fim do marco e antes de entrar em plugins. A régua
dele é o que o aluno vai usar na pergunta de aplicação seguinte. Se o aluno reclamar da data, é
bom sinal: pergunte o que mudou desde então e o que não mudou.
