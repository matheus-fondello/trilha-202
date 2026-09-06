# Referências, aula 1.2

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Documentação é material vivo e não traz data: se o que ela diz não bate com a versão
do aluno, o que vale é a máquina dele. Trocar `/en/` por `/pt/` na URL dá a versão em
português — mas não faça isso nesta aula: a tradução de `how-claude-code-works` está
atrasada justamente na parte de modos de permissão.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `agente`**

- **Erik S. e Barry Zhang, *Building effective agents*** — Anthropic, engenharia, dez/2024 · 15 min de leitura
  https://www.anthropic.com/engineering/building-effective-agents
  A definição de agente sem marketing: o modelo dirige o próprio processo e ganha informação do ambiente a cada passo. É por isso que ele roda o teste.

**marco `disco-como-memoria`**

- **Anthropic, *How Claude remembers your project*** — documentação do Claude Code · consulta, 20 min se lida inteira
  https://code.claude.com/docs/en/memory
  Os escopos de CLAUDE.md em ordem de carregamento, o `/init`, e o alvo de menos de 200 linhas por arquivo.

**marco `superficies`**

- **Anthropic, *Explore the .claude directory*** — documentação do Claude Code · explorador interativo, 5 min
  https://code.claude.com/docs/en/claude-directory
  A árvore `.claude/` clicável, com uma linha dizendo quando cada arquivo carrega. Bom para ele abrir ao lado enquanto olha a daqui.

O explorador da `.claude/` casa com a hora de mostrar que ele está dentro do exemplo.
A dissecação a sério fica para a 1.8; aqui é só um olhar de reconhecimento.

**marco `superficies`**

- **Anthropic, *How Claude Code works*** — documentação do Claude Code · 13 min de leitura
  https://code.claude.com/docs/en/how-claude-code-works
  A versão escrita e completa do vídeo abaixo: o loop em três fases, a lista literal do que o agente acessa, e a frase que fecha o assunto — o Claude Code é o harness agêntico em volta do Claude.

## Sugerida

- **Claude, *How Claude Code Works*** — canal oficial no YouTube, mai/2026 · 2 min 51 s
  https://www.youtube.com/watch?v=6bs5b4FltCU&hl=en&persist_hl=1
  A ementa desta aula em menos de três minutos — loop, janela de contexto, ferramentas e modos —, com o objetivo declarado de que o Claude Code pare de parecer caixa mágica.

Três minutos pausam a aula sem custo. Ofereça cedo, depois do marco `agente`: o vídeo
faz o trabalho visual que a sua explicação não faz, e o resto da aula rende mais.
