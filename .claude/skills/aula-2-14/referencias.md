# Referências, aula 2.14

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Duas ressalvas desta aula. As duas peças de harness saem do site do Martin Fowler mas são assinadas pela Birgitta Böckeler — o aluno que procurar "Martin Fowler harness engineering" cai lá do mesmo jeito; se ele perguntar, diga que o site é editado pelo Fowler e a autoria é dela. E o Osmani escreve "os 70%", não os 80: o número não importa, o argumento é o mesmo, e é bom dizer isso em vez de deixar o aluno achar que errou a conta.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `modelo-versus-harness`**

- **Birgitta Böckeler, *Harness engineering for coding agent users*** — martinfowler.com, abr/2026 · ~14 min de leitura
  https://martinfowler.com/articles/harness-engineering.html
  Define harness como "tudo num agente menos o modelo" e organiza as peças em guias (antes de agir) e sensores (depois de agir), computacionais ou inferenciais — é o vocabulário que a aula inteira usa.

Este é o texto-âncora do marco. Se o aluno só for ler um link da aula, que seja este.

**marco `context-engineering`**

- **Anthropic (Applied AI), *Effective context engineering for AI agents*** — Anthropic Engineering, set/2025 · ~15 min de leitura
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  Explica context rot e as três saídas para tarefa longa — compactação, anotação em disco e subagente —, que é exatamente o que a aula chama de carregar sob demanda e usar o disco como memória.

Serve os dois marcos: cite no `context-engineering` e volte a ele no `tarefas-longas`, que é a seção final do artigo.

**marco `sensores`**

- **Birgitta Böckeler, *Maintainability sensors for coding agents*** — martinfowler.com, mai/2026 · ~33 min de leitura
  https://martinfowler.com/articles/sensors-for-coding-agents.html
  Sensor por sensor com o que ela achou na prática: linter com mensagem escrita para o agente, regra de dependência, dado de acoplamento, revisão de modularidade pelo próprio modelo, suíte de testes como sensor de regressão e teste de mutação.

Longo e cheio de código. É citada, não leitura de aula: solte o link e siga. Se o aluno quiser um pedaço só, mande o começo, sobre linter.

**marco `fan-out`**

- **Anthropic, *Run Claude Code programmatically*** — documentação do Claude Code · ~10 min de leitura
  https://code.claude.com/docs/en/headless
  A flag `-p`, o formato de saída em JSON e o que mais um script precisa para chamar o modelo uma vez por item e ler a resposta.

Documentação viva, sem data: se não bater com a versão do aluno, vale a máquina dele. Cite e siga; a fluência não pede que ele monte um laço.

**marco `os-oitenta-de-verdade`**

- **Addy Osmani, *The 70% problem: Hard truths about AI-assisted coding*** — Elevate (newsletter do autor), dez/2024 · ~11 min de leitura
  https://addyo.substack.com/p/the-70-problem-hard-truths-about
  Nomeia onde mora o resto: caso de borda, depuração que gera novo defeito, estado de tela inacabado, acessibilidade, desempenho em aparelho lento — e por que quem não tem modelo mental do código fica preso ali.

O mais antigo da lista e ainda o melhor no ponto. Se o aluno reclamar da data, é bom sinal: pergunte o que mudou desde então e o que não mudou.

## Sugerida

- **Geoffrey Litt, *Understanding is the new bottleneck*** — geoffreylitt.com, jul/2026 · ~11 min de leitura
  https://www.geoffreylitt.com/2026/07/02/understanding-is-the-new-bottleneck
  Argumenta que entender o código deixou de ser para conferir e passou a ser para participar: sem modelo mental você não consegue nem propor o próximo passo. Fecha a aula virando o harness do agente para o lado de quem opera.

Ofereça no fechamento, depois do `os-oitenta-de-verdade`, não antes: o texto só cai bem quando o aluno já viu que o 20 que falta é dele. É curto, então pausar a aula para ler também funciona se ele preferir.
