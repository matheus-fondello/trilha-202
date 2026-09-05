---
name: aula-1-3
description: Aula 1.3, Verificar, não ler. Sala e oficina, com fluência sobre a página da P0. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 1.3: Verificar, não ler

**Goal:** o aluno sai com o hábito de substituir leitura de código por verificação executável. Todo pedido ao agente carrega um critério que uma máquina consegue confirmar; todo "pronto" vem com evidência, não com afirmação; o agente roda o check sozinho até passar; e quem revisa não é quem escreveu. É a aula mais importante do módulo.

Contexto para discorrer, do seu jeito: a Anthropic, nas boas práticas do Claude Code, diz que dar ao Claude um jeito de verificar o próprio trabalho é a alavanca isolada que mais melhora o resultado. O agente para quando o resultado parece bom para ele mesmo; sem check, o humano vira o loop de verificação, e isso não escala. Um check é algo que roda e responde sim ou não: build, script que compara saída, teste, screenshot contra design. Quem escreveu não deve aprovar o próprio trabalho: um revisor em contexto limpo recebe só o diff e os critérios e procura o que falta. Na versão do Claude Code fixada pela trilha existem `/verify` e `/code-review`; se não existirem na do aluno, ensine o conceito sem o atalho.

Sala e oficina. As tarefas acontecem na oficina sobre a página da P0, e o aluno traz a evidência para cá. Fica para outras aulas: por que o modelo erra, como escrever o prompt, testes e TDD de verdade, revisão adversarial a fundo.

## Antes de começar

Confira no estado se a oficina e a P0 estão registradas; se não, pergunte onde ficam e registre com `oficina` e `pratica P0`. Se a P0 não existe, peça ao aluno para gerar na oficina uma página HTML simples de um arquivo só, sem critério nenhum, e registre como P0: a aula precisa de algo para verificar.

## Marcos

`node .claude/scripts/trilha.js milestone 1.3 <id>`:

- `parece-pronto`: ele viu, na própria página, que o agente para quando parece pronto e quem ficou com o trabalho de conferir.
- `check-executavel`: ele fez um pedido na oficina com um critério que uma máquina confirma.
- `evidencia`: ele exigiu evidência e sabe o que ela prova e o que não prova.
- `fechar-o-loop`: o agente rodou o check sozinho até passar, por instrução dele.
- `revisor-separado`: ele rodou um revisor em contexto limpo e separou lacuna de preferência.

## Fluência

Tarefa nova sobre a P0, na oficina, sem você ditar as partes. Por exemplo: uma seção de perguntas frequentes que funcione no celular. Passa se ele mobiliza os quatro sozinho: critério verificável, evidência, loop fechado pelo agente, revisor separado. Registre com `fluencia 1.3 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 1.4, Onde o LLM erra. Gancho: hoje ele aprendeu a não confiar no agente; na próxima aprende por quê.
