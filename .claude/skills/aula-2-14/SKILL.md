---
name: aula-2-14
description: Aula 2.14, Harness engineering. Aprofundamento, fora do tronco. Sala e oficina, com o harness de uma tarefa longa desenhado e montado. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.14: Harness engineering `[aprofundamento]`

**Goal:** o aluno para de atribuir o resultado ao modelo e passa a ver o que está em volta dele — instrução, ferramenta, sandbox, feedback, memória —, sabe montar o ambiente de uma tarefa longa antes de começá-la, e entende onde mora o 20% que não sai fácil.

Contexto para discorrer, do seu jeito: esta é aula de aprofundamento, e ele chegou aqui porque está adiantado. A pergunta que a abre é boa: o mesmo modelo, na mão de duas pessoas, produz resultados muito diferentes — o que muda? Muda o harness, que é tudo que decide o que o modelo vê, o que ele pode fazer, e o que volta para ele quando faz. Cinco peças. Instrução, que é o que já está no CLAUDE.md e nas skills. Ferramenta, que é o alcance dele: o que ele pode rodar, ler e abrir. Sandbox, que é o limite do estrago. Feedback, que é como ele descobre que errou. Memória, que é o que sobrevive entre sessões. Context engineering é a parte que ele mais sente: a janela é finita e enche, então o desenho certo carrega sob demanda em vez de despejar tudo na abertura, compacta com instrução em vez de deixar o sistema escolher, e usa o disco como memória longa — plano em arquivo, decisão em arquivo, estado em arquivo. Sensores é o conceito que amarra o módulo inteiro: teste, linter (o programa que reclama do que está fora do padrão), tipo (a forma declarada de cada dado, que a máquina confere) e hook (o gatilho que roda algo sozinho a cada passo) são sinal executável, e cada sinal que a máquina consegue produzir é um lugar a menos onde a alucinação passa despercebida. Um agente com bons sensores erra menos porque descobre sozinho, não porque é mais inteligente. Para tarefa longa, o desenho é explícito: plano escrito no disco antes de começar, pontos de retomada, e a aceitação de que a sessão vai acabar no meio. E aí o problema dos 80% aparece de verdade, não como prévia: os primeiros 80% saem porque são o caminho comum, e o resto é borda, erro, dado sujo e integração — reserve tempo para ele em vez de se surpreender. Este repositório é exemplo em funcionamento, e ele já viveu as cinco peças por fora: a skill que só abre na aula da vez, o estado que aparece no começo da sessão, o comando que registra o marco, a guarda que recusa em vez de pedir. Descreva o desenho pelo que ele usou; o código do harness você não abre, e dizer isso é melhor do que esconder — é o guardrail da aula funcionando na frente dele.

Sala e oficina. Aula fora do tronco: nada aqui é pré-requisito de prática nenhuma.

## Antes de começar

Ele precisa de uma tarefa longa de verdade para desenhar. Ofereça uma que sirva ao projeto que ele já tem — uma migração, uma varredura de qualidade em todas as páginas, um relatório que exige percorrer dados — e deixe ele escolher.

## Marcos

`node .claude/scripts/trilha.js milestone 2.14 <id>`:

- `modelo-versus-harness`: ele nomeia as cinco peças e reconhece cada uma no que já usou. *Previsão, antes:* duas pessoas com o mesmo Claude Code chegam a resultados muito diferentes; o que ele acha que explica a diferença? Caça quem atribui ao prompt sozinho.
- `context-engineering`: ele sabe por que carregar sob demanda vence carregar tudo, e usa o disco como memória.
- `sensores`: ele lista os sinais executáveis que um projeto dele poderia ter e não tem. *Conceito:* por que um projeto com testes e tipos rende melhor com o mesmo modelo? Caça quem acha que o ganho é o agente "saber mais".
- `tarefas-longas`: ele sabe por que o plano vai para o disco e o que é um ponto de retomada.
- `os-oitenta-de-verdade`: ele sabe onde o 20% costuma morar no tipo de projeto que faz.

## Fluência

Na oficina: desenhar o harness da tarefa longa escolhida — o que o agente vai ler, o que pode rodar, que sinal diz que deu certo, onde o plano mora, como retomar — e montar isso de fato, com pelo menos um sensor novo funcionando. Passa se o desenho vier antes da execução e se o sensor for executável, não uma promessa de conferir depois. Registre com `fluencia 2.14 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Depois desta, ele volta para a aula de tronco onde estava; diga qual é ao se despedir.
