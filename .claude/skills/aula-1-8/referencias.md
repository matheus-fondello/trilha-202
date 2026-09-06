# Referências, aula 1.8

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Documentação é material vivo e não traz data. Antes de citar nome de evento de hook ou
campo de frontmatter, confira na referência: mudam com frequência. Trocar `/en/` por
`/pt/` na URL dá a versão em português, e a de hooks está fiel.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `skills`**

- **Barry Zhang, Keith Lazuka e Mahesh Murag, *Equipping agents for the real world with Agent Skills*** — Anthropic, engenharia, out/2025 · 10 min de leitura
  https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
  O porquê do formato, por quem o projetou: revelação progressiva, e o aviso de que o nome e a descrição são o que decide o disparo.

- **Anthropic, *Extend Claude with skills*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/skills
  A anatomia completa: frontmatter, ciclo de vida do conteúdo, invocação por `/nome` e o `disable-model-invocation` para skill de efeito colateral.

**marco `hooks`**

- **Anthropic, *Automate actions with hooks*** — documentação do Claude Code · 25 min de leitura
  https://code.claude.com/docs/en/hooks-guide
  O passo a passo do primeiro hook, e a definição que nenhuma paráfrase melhora: controle determinístico, a ação acontece em vez de depender de o modelo escolher rodá-la.

**marco `guardrails`**

- **Anthropic, *Extend Claude Code*** — documentação do Claude Code · 12 min de leitura
  https://code.claude.com/docs/en/features-overview
  Tem a tese desta aula em três frases: "nunca edite o .env" no CLAUDE.md é um pedido, não uma garantia; o hook que bloqueia a edição é imposição.

- **Anthropic, *Configure permissions*** — documentação do Claude Code · consulta
  https://code.claude.com/docs/en/permissions
  As regras de permitir, perguntar e negar em `settings.json`, versionáveis junto com o projeto.

A referência completa de eventos de hook (`code.claude.com/docs/en/hooks`) tem mais de
trinta entradas com schema. É a sua fonte para conferir os nomes antes de citá-los, não
material para o aluno: mandar um calouro para lá assusta mais do que ensina.

## Sugerida

- **Michael Segner, *Steering Claude Code: when to use CLAUDE.md, skills, hooks, and subagents*** — blog da Anthropic, jun/2026 · 5 min de leitura
  https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more
  Os mecanismos de customização comparados por custo de contexto e por autoridade, com a regra de bolso que esta aula ensina: procedimento vira skill, comportamento que precisa acontecer sempre vira hook.

Cinco minutos, então cabe no meio da aula. Ofereça depois de fechar o marco `hooks`,
quando a distinção entre skill e hook estiver fresca e ele ainda tiver a dúvida na mão.
