---
name: aula-1-8
description: Aula 1.8, Skills, hooks e guardrails. Sala e oficina, com fluência criando uma skill e uma regra de negar. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 1.8: Skills, hooks e guardrails

**Goal:** o aluno para de ser usuário da ferramenta e vira quem a configura. Ele sabe quando uma instrução repetida deve virar skill e quando uma regra tem que virar hook, entende que skill é sugestão que o modelo escolhe usar e hook é garantia que roda independente do modelo, e sai com as duas coisas funcionando na oficina.

Contexto para discorrer, do seu jeito: a régua é simples e vale enunciar cedo. Se ele explica a mesma coisa toda semana, isso é uma skill: um arquivo com a instrução, que fica no disco e é carregado só quando faz sentido — e o que decide o carregamento é a descrição, não o conteúdo, por isso descrição vaga é o defeito número um de skill ruim. Se a regra não pode depender do humor do modelo, isso é um hook: um script que dispara num evento — antes de uma ferramenta rodar, quando a sessão começa, quando ela termina — e faz a mesma coisa sempre, porque é código, não julgamento. Formatar depois de editar, bloquear escrita numa pasta, registrar o que aconteceu, rodar o teste ao fim: hook. Um gancho que vale puxar: o `/goal` que ele usou na 1.3 é um hook de fim de turno por baixo, criado para durar só aquela sessão — ele já mexeu num hook sem saber que era um. A parte de guardrail fecha o raciocínio: regra de negar nas configurações e hook que bloqueia não são o modelo se comportando bem, são o modelo não conseguindo fazer aquilo. Essa diferença entre "ele foi instruído a não" e "ele não consegue" é o que separa configuração de segurança de verdade. E aqui vem a melhor parte da aula: este repositório é um harness completo e ele está dentro dele. Abra a árvore `.claude/` com o aluno, mostre a skill do tutor, a skill desta aula, o hook que registra o começo da sessão e o comando que grava o marco. A aula inteira em que ele está sentado é o exemplo.

Sala e oficina. Confira na sua versão os nomes de eventos e opções antes de citá-los; se algo mudou, ensine o conceito com o que existe.

## Antes de começar

Confira no estado se a oficina e a P0 estão registradas; se não, resolva antes de começar, como a `tutor` manda.

## Marcos

`node .claude/scripts/trilha.js milestone 1.8 <id>`:

- `skills`: ele entendeu a anatomia e que a descrição é o que dispara o carregamento.
- `hooks`: ele entendeu evento e script determinístico, e sabe dar um caso de uso próprio.
- `guardrails`: ele entendeu a diferença entre instruir e impedir.
- `dissecar-o-harness`: ele abriu a árvore `.claude/` daqui e reconheceu as peças em funcionamento.

## Fluência

Na oficina: uma skill para alguma tarefa que ele já repetiu na página da P0, e uma regra de negar que proteja algo que ele não quer que o agente toque. A regra tem que ser provada — ele pede ao agente para fazer justamente aquilo e mostra o bloqueio. Passa se a skill disparar sozinha na situação certa e o bloqueio acontecer de fato. Registre com `fluencia 1.8 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 1.9, Uma página que vende. Gancho: a ferramenta está dominada; as duas últimas aulas do módulo são sobre fazer a página prestar.
