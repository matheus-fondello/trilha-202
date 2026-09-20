# Referências, aula 1.7

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `a-janela-e-o-recurso`**

- **Anthropic, *Explore the context window*** — documentação do Claude Code · simulação interativa, 5 min
  https://code.claude.com/docs/en/context-window
  Uma sessão enchendo a janela em tempo real, com o custo de cada leitura de arquivo. Ver a barra encher ensina mais que qualquer parágrafo.

- **Prithvi Rajasekaran, Ethan Dixon, Carly Ryan e Jeremy Hadfield, *Effective context engineering for AI agents*** — Anthropic, engenharia, set/2025 · 15 min de leitura
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  Dá o vocabulário e nomeia as três estratégias que a aula ensina na mão: compactar, anotar fora da janela e delegar a subagente.

- **Matt Pocock, *Most devs don't understand how context windows work*** — YouTube, out/2025 · 9 min 33 s
  https://www.youtube.com/watch?v=-uW5-TaVXu4&hl=en&persist_hl=1
  Explica o "perdido no meio": o modelo enxerga pior o que está no miolo de uma janela cheia. É o porquê de limpar, não só o como.

O vídeo é de outubro de 2025 e não conhece `/rewind` nem `/btw`. Se ele assistir, emende
numa frase que hoje há mais ferramenta do que aparece lá.

- **Kelly Hong, Anton Troynikov e Jeff Huber, *Context Rot: How Increasing Input Tokens Impacts LLM Performance*** — Chroma, relatório técnico, jul/2025 · 25 min de leitura
  https://www.trychroma.com/research/context-rot
  A fonte que cunhou "context rot": dezoito modelos piorando conforme a entrada cresce, de forma desigual e sem aviso. É a prova do "a qualidade cai antes de qualquer aviso".

Longo e técnico; é para quem perguntar "quem mediu isso". A Teresa Torres, no fechamento, é a versão para leigo e cita este.

**marco `checkpoints`**

- **Anthropic, *Checkpointing*** — documentação do Claude Code · 8 min de leitura
  https://code.claude.com/docs/en/checkpointing
  Lista em preto no branco o que o desfazer não salva: mudança feita por comando de terminal, edição de subagente, alteração externa. A última seção se chama, literalmente, "não substitui controle de versão".

- **Guillaume Billey, *Getting More Out of Claude Code in the Terminal*, da seção "Visualize Your Context Window" ao fim** — Marmelab, mai/2026 · 4 min o trecho
  https://marmelab.com/blog/2026/05/12/claude-code-hidden-commands.html
  Com print de cada um: `/context` mostrando o que ocupa a janela, `/compact` com instrução, `/rewind` e `/clear` lado a lado, e o `/btw` como pergunta que não entra no histórico.

As três primeiras seções são de terminal e não são desta aula; diga para começar em "Visualize Your Context Window". Já conhece o `/btw`, que o vídeo do Pocock não conhece.

**marco `sessoes`**

- **Anthropic, *Manage sessions*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/sessions
  Nomear, retomar e ramificar sessão, e o que uma sessão retomada de fato restaura.

O post de engenharia é bom, mas foi escrito para quem constrói agentes. Se ele for ver
uma coisa só, é o vídeo abaixo; o post fica para quem pedir mais.

## Sugeridas

**marco `um-chat-uma-tarefa`**

- **Claude, *Context Management in Claude Code*** — canal oficial no YouTube, série Claude Code 101, mai/2026 · 3 min 30 s
  https://www.youtube.com/watch?v=eW3oTyfeWZ0&hl=en&persist_hl=1
  Oficial, curtíssimo e exatamente esta aula: contexto como memória de trabalho, quando compactar e quando limpar.

Três minutos e meio não quebram o ritmo. Ofereça no meio da aula, depois do marco, e espere ele
voltar antes de seguir.

**fechamento**

- **Teresa Torres, *Context Rot: Why AI Gets Worse the Longer You Chat (And How to Fix It)*** — Product Talk, fev/2026 · 21 min de leitura
  https://www.producttalk.org/context-rot/
  Gente de produto escrevendo para gente de produto: por que o agente piora depois de uma hora, o que acontece quando a janela passa da metade, e como o Claude Code deixa ver e controlar isso.

Vinte minutos: só no fechamento. É anterior ao `/btw` e cita o Replit junto com o Claude Code;
nada contradiz a aula.
