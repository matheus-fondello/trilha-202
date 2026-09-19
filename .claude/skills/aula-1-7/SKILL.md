---
name: aula-1-7
description: Aula 1.7, Higiene de contexto. Sala e oficina, com fluência em duas tarefas separadas sobre a P0. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 1.7: Higiene de contexto

**Goal:** o aluno passa a administrar a janela de contexto como recurso. Ele reconhece pelos sintomas que a sessão azedou, separa uma tarefa por chat, sabe salvar posição antes de mudança grande e sabe voltar quando o agente destrói algo, e usa subagente para investigar sem sujar o próprio contexto.

Contexto para discorrer, do seu jeito: tudo na sessão — o que ele escreveu, o que o agente leu, cada saída de comando — ocupa a mesma janela, e ela enche muito mais rápido do que parece. Quando enche, a qualidade cai antes de qualquer aviso, e os sintomas são reconhecíveis: o agente repete o que já fez, esquece uma decisão de dez minutos atrás, ou se contradiz. A regra que resolve 80% disso é uma tarefa por chat, e `/clear` entre elas. A outra regra é sobre a espiral: se ele corrigiu a mesma coisa duas vezes e não andou, o contexto já está poluído com as tentativas erradas; limpar e reescrever o pedido do zero é mais rápido que insistir, e é contraintuitivo justamente porque parece jogar trabalho fora. `/compact` com instrução é diferente de compactar no automático — dizer o que precisa sobreviver muda o que fica. O `/rewind` desfaz o que o agente fez na sessão, e vale ser explícito: não substitui git; commit antes de mudança grande é o cinto de segurança de verdade, porque sobrevive ao fim da sessão. Subagente é contexto descartável: mandar investigar e receber a conclusão, sem trazer para a sua janela o lixo da investigação. O `/btw` resolve a pergunta lateral sem que ela entre no histórico, e é das melhores coisas da ferramenta. E `/rename` mais `claude --resume` são o que permitem ter uma frente de trabalho por sessão e voltar para ela dias depois sabendo qual é qual.

Sala e oficina. Fica para a 1.11: subagentes por papel e sessões paralelas em worktree.

## Antes de começar

Confira no estado se a oficina e a P0 estão registradas; se não, resolva antes de começar, como a `tutor` manda.

## Marcos

`node .claude/scripts/trilha.js milestone 1.7 <id>`:

- `a-janela-e-o-recurso`: ele sabe que a janela enche e reconhece os três sintomas. *Previsão, antes:* por que ele acha que o agente fica pior depois de uma hora de conversa? Caça quem acha que ele "cansa" ou que é aleatório.
- `um-chat-uma-tarefa`: ele limpa entre tarefas e sabe a regra das duas correções. *Aplicação:* duas correções seguidas não pegaram. Terceira tentativa, ou o quê? Caça quem insiste no mesmo chat.
- `checkpoints`: ele compactou com instrução, desfez algo, e sabe por que commit é o cinto de verdade.
- `sessoes`: ele nomeou uma sessão, retomou, e sabe usar subagente para não sujar o contexto.

## Fluência

Na oficina, duas tarefas na página da P0 em chats separados. Numa, ele compacta com instrução no meio e a tarefa continua sem perder o fio. Na outra, ele deixa o agente fazer uma mudança errada de propósito e desfaz. Passa se ele souber dizer, no fim, o que sobreviveu à compactação e o que o desfazer não teria salvado. Registre com `fluencia 1.7 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 1.8, Skills, hooks e guardrails. Gancho: até aqui ele operou a ferramenta como ela veio; na próxima ele começa a moldá-la.
