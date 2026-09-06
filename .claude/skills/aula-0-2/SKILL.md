---
name: aula-0-2
description: Aula 0.2, Como se estuda aqui. Quinze minutos, só conversa, sem oficina e sem fluência. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 0.2: Como se estuda aqui

**Goal:** o aluno sai sabendo o jogo — como uma aula funciona, o que é obrigatório e o que é extra, o que a escola enxerga do que ele faz aqui, e o que fazer quando bate o limite do plano ou um comando não existe mais. É a aula mais curta da trilha: quinze minutos, não uma hora. Não estique.

Contexto para discorrer, do seu jeito: uma aula é um chat, dura de 45 a 60 minutos e fecha com uma tarefa nova que ele faz sozinho; se ele fechar o terminal no meio, a próxima sessão retoma de onde parou, porque o progresso está no disco e não na conversa. O quiz fecha o módulo, não a aula. O tronco é obrigatório e leva até o projeto final; o aprofundamento é para quem sobra tempo e não é pré-requisito de nada. Depois deste módulo e do próximo, a trilha se abre em três frentes — engenharia, IA no produto, negócio — com uma ordem padrão que você segue sem perguntar; ele pode desviar se pedir. Sobre o reporte, seja franco e específico: sobe metadado de progresso e uma avaliação estruturada por aula, com trechos curtos como evidência, nunca a conversa inteira; nota e critério não se mostram, feedback sim, e ele acabou de receber um no fim da aula passada. Sobre limite de plano: Opus aqui na sala, Sonnet na oficina, porque duas janelas em Opus estouram o limite do Pro num dia de prática; quando o limite bate, ele espera renovar, troca de modelo ou sobe de plano, e nunca perde trabalho, porque o estado está no disco. Comandos do Claude Code mudam de uma versão para outra. A trilha assume uma versão mínima, que está em `trilha/config.json`; ele confere a dele com `claude --version`. Se encontrar um comando que não existe mais, é para avisar, não para achar que errou.

Só conversa, aqui na sala. Sem oficina, sem fluência.

## Marcos

`node .claude/scripts/trilha.js milestone 0.2 <id>`:

- `o-formato`: ele sabe como uma aula corre, como se retoma, e a diferença entre tronco e aprofundamento.
- `o-que-a-escola-ve`: ele sabe o que sobe daqui e o que não sobe, sem eufemismo.
- `quando-trava`: ele sabe o que fazer ao bater o limite do plano ou ao topar com um comando que não existe.

Fechamento da `tutor`, com `"fluencia": null`. Próxima aula: 1.1, Vibe coding e engenharia agêntica. Gancho: a partir daqui é matéria, e a primeira é sobre os dois jeitos de construir com IA.
