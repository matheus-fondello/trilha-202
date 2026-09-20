# Referências, aula 1.6

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Esta é a aula que mais envelhece: nomes de modo, limiares e padrões por plano mudam.
Confira a página de modos antes de afirmar número em aula, e diga ao aluno que o que
vale é o que a máquina dele mostra.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `auto-mode`**

- **Conner Phillippi, *Auto mode is now the default in Claude Code for Pro, Max, and Team plans*** — blog da Claude, ago/2026 · 20 min de leitura
  https://claude.com/blog/auto-mode-default-in-claude-code
  Traz o número que ganha a discussão: num estudo com mil pessoas, humanos aprovando à mão pegaram 13,6% dos comandos perigosos; o classificador pegou 89%.

- **Simon Willison, *Breaking Claude Code Opus 5 Auto Mode*** — simonwillison.net, ago/2026 · 2 min de leitura
  https://simonwillison.net/2026/Aug/27/breaking-claude-code-opus-5-auto-mode/
  O contrapeso, e recente: um caso em que o classificador foi contornado em cerca de 80% das tentativas. Reduzir risco não é eliminar risco.

Use os dois juntos, nessa ordem, e não só o primeiro. A conclusão que a aula quer não é
"pode confiar", é "o padrão é melhor que você aprovando no automático, e mesmo assim
trabalho perigoso pede isolamento".

**marco `manual-e-allowlist`**

- **Anthropic, *Choose a permission mode*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/permission-modes
  A página canônica: os seis modos, em qual a sessão começa conforme o plano, e os limiares em que o auto mode pausa e devolve a decisão para o aluno.

**marco `modelo-e-custo`**

- **Anthropic, *Model configuration*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/model-config
  A página que muda mais rápido e a única que vale como fonte: os apelidos do `/model` (`sonnet`, `opus`, `haiku`, `opusplan`, `best`), o padrão de cada plano, e os níveis de esforço com o que cada um serve.

Confira aqui antes de afirmar nome, padrão ou nível; a aula diz "o Pro abre em Sonnet" e "o esforço padrão é alto" porque esta página dizia isso em setembro de 2026.

- **Anthropic, *Choosing the right model*** — documentação da plataforma Claude · 6 min de leitura
  https://platform.claude.com/docs/en/about-claude/models/choosing-a-model
  Como escolher sem ter benchmark próprio, e o ponto que quase ninguém sabe: ajustar o esforço costuma render mais que trocar de modelo.

- **Claude, *Which Claude model should you use?*** — canal oficial no YouTube, set/2026 · 3 min 45 s
  https://www.youtube.com/watch?v=71-8fJIGi34&hl=en&persist_hl=1
  O que decide o custo de uma tarefa e quando escolher modelo e esforço: é a régua do marco, oficial e atual.

Foi a sugerida do fechamento da 0.1. Se ele viu, cite e siga; se não viu, é a hora, mas não faça dele a terceira pausa da aula.

## Sugeridas

Dois vídeos oficiais curtos no meio, um por marco, e o texto de engenharia no fechamento.

**marco `auto-mode`**

- **Claude, *How auto mode works with Claude Code*** — canal oficial no YouTube, ago/2026 · 5 min 42 s no total, trecho de 3 min, de 0:44 a 3:33
  https://www.youtube.com/watch?v=b8SV4U6fEIc&hl=en&persist_hl=1&t=44s
  O classificador como um segundo leitor que aprova em vez de você, e por que o agente nunca aprova a própria ação, com tela.

Diga o corte: de 0:44 a 3:33, e volta. De 3:33 a 4:49 é configuração de regras para equipe, que é
o marco `manual-e-allowlist`; ofereça como segundo corte só se ele estiver interessado.

**marco `plan-mode`**

- **Claude, *The Explore → Plan → Code → Commit workflow in Claude Code*** — canal oficial no YouTube, série Claude Code 101, mai/2026 · 3 min 11 s
  https://www.youtube.com/watch?v=xJQuF02NAK8&hl=en&persist_hl=1
  Plan mode no lugar dele: uma fase de entender antes da fase de mexer, com critério de sucesso escrito antes de codar.

O vídeo vende o fluxo inteiro e o fim fala de revisão por subagente, que é matéria da 1.11; emende
numa frase. Ele não diz "plano não é permissão", então a pergunta do marco continua sendo sua.

**fechamento**

- **John Hughes, *How we built Claude Code auto mode: a safer way to skip permissions*** — Anthropic, engenharia, mar/2026 · 12 min de leitura
  https://www.anthropic.com/engineering/claude-code-auto-mode
  Faz entender que o auto mode é um segundo modelo lendo por cima do ombro do primeiro. A melhor decisão de projeto está lá: o classificador não vê as mensagens do agente nem os resultados das ferramentas, só o que o usuário pediu e o comando a rodar — para que o agente não consiga argumentar em causa própria.

Doze minutos, e é texto de engenharia. Ofereça no fechamento, para quem estiver curioso depois da
discussão de confiança e do vídeo. Aluno que só quer operar não precisa.
