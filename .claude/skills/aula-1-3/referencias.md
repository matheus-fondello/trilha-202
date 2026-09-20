# Referências, aula 1.3

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Documentação é material vivo e não traz data. Sempre linke a âncora da seção, nunca a
página inteira: a de boas práticas dá quase meia hora de leitura, e a seção que importa
aqui dá quatro minutos.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `parece-pronto`**

- **Anthropic, *Claude Code power user tips*, seção "Verification — the #1 Tip"** — Central de Ajuda · 15 min de leitura
  https://support.claude.com/en/articles/14554000-claude-code-power-user-tips
  É a origem da frase que abre esta aula: se ele adotar uma única prática da lista inteira, que seja dar ao agente um jeito de conferir a própria saída.

**marco `fechar-o-loop`**

- **Anthropic, *Keep Claude working toward a goal*** — documentação do Claude Code · 11 min de leitura
  https://code.claude.com/docs/en/goal
  A página do comando que esta aula ensina: como escrever a condição, o que o avaliador enxerga (só a conversa), e como limitar quantos turnos ele roda.

**marco `evidencia`**

- **Simon Willison, *Agentic manual testing*** — guia Agentic Engineering Patterns, simonwillison.net, mar/2026 · 7 min de leitura
  https://simonwillison.net/guides/agentic-engineering-patterns/agentic-manual-testing/
  Quando um screenshot prova algo ("o menu está no lugar certo") e quando passar nos testes não basta: a pergunta do marco, respondida com casos.

**marco `revisor-separado`**

- **Anthropic, *Best practices*, seção "Add an adversarial review step"** — documentação do Claude Code · 3 min de leitura
  https://code.claude.com/docs/en/best-practices#add-an-adversarial-review-step
  O prompt de revisão pronto — reporte lacunas, não preferências de estilo — e o contrapeso honesto: revisor mandado achar defeito sempre acha algum, e perseguir todos leva a excesso de engenharia.

O contrapeso do revisor é a parte que o aluno mais precisa ouvir, porque o entusiasmo
com o revisor adversarial é a armadilha seguinte. Vale citar em voz alta, não só linkar.

## Sugeridas

Três, cada uma no seu lugar: um texto curto no primeiro marco, a seção de trabalho no meio, e um
texto oficial no fechamento.

**marco `parece-pronto`**

- **Simon Willison, *Your job is to deliver code you have proven to work*** — simonwillison.net, dez/2025 · 5 min de leitura
  https://simonwillison.net/2025/Dec/18/code-proven-to-work/
  A tese da aula sem vocabulário de ferramenta: se você não viu o código fazer a coisa certa com os próprios olhos, esse código não funciona, e isso é trabalho de quem opera, não do agente.

Cinco minutos: ofereça quando o marco fechar, antes de entrar no check executável. Ele volta com
o porquê da aula; o resto é o como.

**marco `check-executavel`**

- **Anthropic, *Best practices for Claude Code*, seção "Give Claude a way to verify its work"** — documentação do Claude Code · 4 min a seção
  https://code.claude.com/docs/en/best-practices#give-claude-a-way-to-verify-its-work
  A aula inteira em uma seção, com uma tabela de prompts antes e depois que ele copia direto para a oficina.

Quatro minutos, e é material de trabalho, não de leitura. Ofereça no meio, quando o marco fechar:
ele abre ao lado e usa a tabela na própria tarefa.

**fechamento**

- **Delba de Oliveira, *Building verification loops in Claude Code with skills*** — blog da Claude, jul/2026 · 5 min de leitura
  https://claude.com/blog/building-verification-loops-in-claude-code-with-skills
  O time do Claude Code encadeando revisão, simplificação e verificação como skills: o loop fechado virando hábito que sobrevive à sessão, não um comando solto.

Ofereça no fechamento, depois do `fechar-o-loop`. Puxa o gancho para a 1.8 sem antecipá-la; não
explique o que é skill aqui.
