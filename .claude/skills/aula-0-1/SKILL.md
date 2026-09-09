---
name: aula-0-1
description: Aula 0.1, Como funciona a trilha. Primeira aula do aluno; onboarding mais o combinado de como se estuda aqui. Só conversa, sem oficina e sem fluência. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 0.1: Como funciona a trilha

**Goal:** o aluno sai sabendo o jogo — como uma aula funciona, o que é obrigatório e o que é extra, o que a escola enxerga do que ele faz aqui, e o que fazer quando bate o limite do plano ou um comando não existe mais. É a aula mais curta da trilha: de vinte a trinta minutos com o onboarding junto, não uma hora. Não estique.

Contexto para discorrer, do seu jeito: uma aula é um chat, dura de 45 a 60 minutos e fecha com uma tarefa nova que ele faz sozinho; se ele fechar a janela no meio, a próxima sessão retoma de onde parou, porque o progresso está no disco e não na conversa. O quiz fecha o módulo, não a aula. O tronco é obrigatório e leva até o projeto final; o aprofundamento é para quem sobra tempo e não é pré-requisito de nada. Depois deste módulo e do próximo, a trilha se abre em três frentes — engenharia, IA no produto, negócio — com uma ordem padrão que você segue sem perguntar; ele pode desviar se pedir. A pasta em que ele está é a sala: é onde você mora, é onde o progresso dele fica gravado, e a pasta `trilha/` lá dentro é do harness — ele pode ler tudo, e nada ali se edita à mão. O material recebe aula nova de tempos em tempos, e atualizar é uma linha que você mostra quando for a hora; hoje não é. A partir da primeira prática ele vai trabalhar em duas janelas: esta, a sala, onde se conversa, e uma segunda, a oficina, onde ele constrói. Você monta a oficina com ele quando chegar lá, e não há nada para ele preparar hoje. Sobre o reporte, seja franco e específico: sobe metadado de progresso e uma avaliação estruturada por aula, com trechos curtos como evidência, nunca a conversa inteira; nota e critério não se mostram, feedback sim, e ele recebe um no fim de cada aula. O que fica só na máquina dele é a memória do professor, `trilha/aluno.md`: sete notas sobre como ele aprende, que ele pode ler quando quiser. É por essa memória que ele muda a aula: se quiser que você pergunte mais em vez de explicar tudo, que vá mais devagar, que use exemplo do projeto dele, que corte a teoria, é só dizer. Vira nota e vale nas aulas seguintes, não só nesta. Diga isso com todas as letras, porque ninguém imagina que pode pedir. Sobre limite de plano, e o cuidado aqui é de quem fala: quem escolhe o modelo de cada janela é ele, não você — você não controla nem o desta. Então isto é recomendação, e diga assim: o Opus vale para a sala, onde a conversa é de raciocínio, e o Sonnet para a oficina, onde o trabalho é executar o que já está decidido; duas janelas em Opus estouram o limite do Pro num dia de prática. Não há nada para ele mexer hoje, porque a oficina ainda não existe; a hora de acertar isso é quando vocês montarem a oficina, e trocar de modelo é assunto da 1.6. Quando o limite bate, ele espera renovar, troca de modelo ou sobe de plano, e nunca perde trabalho, porque o estado está no disco. Comandos do Claude Code mudam de uma versão para outra: se ele topar com um comando que não existe mais, é para avisar, não para achar que errou. A versão mínima que a trilha assume está em `trilha/config.json` e a dele você confere sozinho, com `claude --version`, sem passar a tarefa para ele.

Esta é a primeira vez que o aluno fala com um agente, e tudo o que ele precisa fazer hoje é escrever em português. Não peça comando, não peça terminal, não peça instalação, não mande ele abrir pasta nenhuma. O que precisar ser conferido na máquina, confira você — o terminal é seu, e ele vai ganhar o dele mais para a frente, quando já tiver visto o agente trabalhar.

Só conversa, aqui na sala. Sem oficina, sem fluência.

## Onboarding

Esta aula abre a trilha, então começa com onboarding em mensagens curtas, uma coisa por vez. Apresente-se em duas linhas, peça e-mail e primeiro nome, registre com `identificar` e pergunte o que ele já fez com IA. Só depois que isso fechou, a aula corre no ritmo normal.

## Marcos

`node .claude/scripts/trilha.js milestone 0.1 <id>`:

- `o-formato`: ele sabe como uma aula corre, como se retoma, e a diferença entre tronco e aprofundamento.
- `o-que-a-escola-ve`: ele sabe o que sobe daqui e o que não sobe, sem eufemismo, e sabe que pode pedir para você ensinar diferente.
- `quando-trava`: ele sabe o que fazer ao bater o limite do plano ou ao topar com um comando que não existe.

Sem pergunta marcada: isto é combinado, não matéria.

Fechamento da `tutor`, com `"fluencia": null`. Próxima aula: 1.1, Vibe coding e engenharia agêntica. Gancho: a partir daqui é matéria, e a primeira é sobre os dois jeitos de construir com IA.
