---
name: aula-2-5
description: Aula 2.5, Branches, PRs e o remoto. Sala e oficina, com um PR aberto na P1 e revisado por subagente. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.5: Branches, PRs e o remoto

**Goal:** o aluno trabalha em branch por tarefa, abre pull request, entende o PR como a unidade em que o trabalho é revisado e conversado, sabe empurrar e puxar do GitHub, e põe o revisor adversarial para ler o diff do PR em vez de ele mesmo tentar ler código.

Contexto para discorrer, do seu jeito: branch é a consequência prática do grafo da aula passada — em vez de uma fila única de commits, ele abre um caminho paralelo, trabalha lá, e a linha principal continua funcionando enquanto isso. O motivo, com agente, é mais forte do que era antes: uma tarefa mal dada estraga o caminho onde ela mora e não o resto, e abandonar uma branch inteira custa nada. Uma tarefa, uma branch. O PR é a peça que ele vai ver todo dia no mercado: é o pedido de juntar aquele caminho de volta na linha principal, e é a única unidade em que alguém consegue olhar um trabalho fechado, com contexto, antes de ele virar produção. Merge é a junção; conflito é quando duas mudanças mexeram no mesmo lugar e alguém precisa decidir qual vale — e essa decisão é dele, com o agente explicando as duas versões em português, não escolhendo por ele. GitHub é onde a cópia de referência mora: push manda, pull traz, e a diferença entre repositório público e privado é quem consegue ver, o que importa porque a P1 dele é pública de propósito, para virar portfólio. A CLI `gh` deixa o agente abrir e ler PR sem sair do terminal, e é aí que a 1.3 volta: o revisor em contexto limpo recebe o diff do PR e os critérios, e devolve o que falta. Repare no encaixe — o PR existe justamente para que a revisão tenha um recorte, e recorte é o que faz o revisor separado funcionar. A descrição do PR não é burocracia: é o texto que explica, para quem não viu ele trabalhar, o que mudou e por quê.

Sala e oficina. Fica para outras aulas: preview por PR na Vercel, e revisão adversarial a fundo.

## Antes de começar

Confira no estado o repositório da P1 e se o `gh` está autenticado na oficina. Se travar em login, trate como marco e siga: a aula não empaca por causa de autenticação.

## Marcos

`node .claude/scripts/trilha.js milestone 2.5 <id>`:

- `branch-por-tarefa`: ele abriu uma branch para uma tarefa e sabe por que não trabalha direto na principal.
- `pr-como-unidade`: existe um PR aberto na P1, com descrição que diz o que mudou e por quê.
- `o-remoto`: ele sabe o que push e pull fazem e o que muda entre repositório público e privado. *Aplicação:* o repositório da P1 é público de propósito; o que ele confere antes de dar push? Caça quem trata público como detalhe de configuração.
- `revisao-no-pr`: um revisor em contexto limpo leu o diff do PR e ele decidiu o que corrigir. *Conceito:* por que revisar o diff de um PR funciona melhor do que pedir ao agente para revisar o projeto inteiro? Caça quem acha que mais contexto sempre dá revisão melhor.

## Fluência

Na oficina, sobre a P1: uma segunda tarefa, do começo ao fim sem você dizer as etapas — branch, PR com descrição, subagente revisor em contexto limpo lendo o diff, e a decisão dele sobre o que do relatório vira correção e o que não vira. Passa se ele separar lacuna de preferência sem você apontar, como a 1.3 ensinou. Registre com `fluencia 2.5 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.6, Segredos e ambientes. Gancho: o PR dele está público, e é uma boa hora para saber o que nunca pode entrar num commit.
