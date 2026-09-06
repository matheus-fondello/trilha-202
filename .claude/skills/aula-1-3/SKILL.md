---
name: aula-1-3
description: Aula 1.3, Verificar, não ler. Sala e oficina, com fluência sobre a página da P0. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 1.3: Verificar, não ler

**Goal:** o aluno sai com o hábito de substituir leitura de código por verificação executável. Todo pedido ao agente carrega um critério que uma máquina consegue confirmar; todo "pronto" vem com evidência, não com afirmação; o agente roda o check sozinho até passar; e quem revisa não é quem escreveu. É a aula mais importante do módulo.

Contexto para discorrer, do seu jeito: a Anthropic, nas boas práticas do Claude Code, diz que dar ao Claude um jeito de verificar o próprio trabalho é a alavanca isolada que mais melhora o resultado. O agente para quando o resultado parece bom para ele mesmo; sem check, o humano vira o loop de verificação, e isso não escala. Um check é algo que roda e responde sim ou não: build, script que compara saída, teste, screenshot contra design. Quem escreveu não deve aprovar o próprio trabalho: um revisor em contexto limpo recebe só o diff e os critérios e procura o que falta. O `/goal` é o loop fechado virando mecanismo: define uma condição de conclusão e, ao fim de cada turno, um modelo separado julga se ela vale; enquanto não valer, o agente começa outro turno sozinho. O detalhe que ensina a aula inteira é que **o avaliador não roda comando nem abre arquivo**: ele lê o que apareceu na conversa. Uma condição só funciona se a saída do próprio agente puder demonstrá-la — evidência contra afirmação, agora com consequência mecânica. Condição boa tem estado final mensurável, o check declarado e o que não pode mudar no caminho, mais um limite de turnos, senão ele descobre do jeito caro. Existem também `/verify` e `/code-review`; se algum não existir na versão do aluno, ensine o conceito sem o atalho.

Sala e oficina. As tarefas acontecem na oficina sobre a página da P0, e o aluno traz a evidência para cá. Fica para outras aulas: por que o modelo erra, como escrever o prompt, testes e TDD de verdade, revisão adversarial a fundo.

## Antes de começar

Confira no estado se a oficina e a P0 estão registradas; se não, resolva antes de começar, como a `tutor` manda.

## Marcos

`node .claude/scripts/trilha.js milestone 1.3 <id>`:

- `parece-pronto`: ele viu, na própria página, que o agente para quando parece pronto e quem ficou com o trabalho de conferir.
- `check-executavel`: ele fez um pedido na oficina com um critério que uma máquina confirma.
- `evidencia`: ele exigiu evidência e sabe o que ela prova e o que não prova.
- `fechar-o-loop`: ele pôs o agente para rodar até passar sem ser cutucado a cada turno, e escreveu uma condição que a saída do agente consegue demonstrar.
- `revisor-separado`: ele rodou um revisor em contexto limpo e separou lacuna de preferência.

## Fluência

Tarefa nova sobre a P0, na oficina, sem você ditar as partes. Por exemplo: uma seção de perguntas frequentes que funcione no celular. Passa se ele mobiliza os quatro sozinho: critério verificável, evidência, loop fechado pelo agente, revisor separado. Registre com `fluencia 1.3 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 1.4, Onde o LLM erra. Gancho: hoje ele aprendeu a não confiar no agente; na próxima aprende por quê.
