---
name: aula-0-1
description: Aula 0.1, Terminal, git mínimo e as duas janelas. Primeira aula do aluno; começa com onboarding e termina com a oficina montada. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 0.1: Terminal, git mínimo e as duas janelas

**Goal:** o aluno sai sem medo do terminal e com a oficina montada. Ele sabe onde está (esta pasta é a sala, você é o professor), consegue se mover no terminal sem decorar nada, entende o que é um repositório e o que um commit registra, e tem uma segunda pasta aberta em outra janela do Claude Code onde vai praticar o resto da trilha.

Contexto para discorrer, do seu jeito: o terminal assusta porque não tem botão, mas são quatro comandos que resolvem 95% da vida — onde estou, entra na pasta, lista o que tem, cria pasta. Caminho absoluto começa na raiz e é sempre o mesmo; relativo depende de onde você está, e é daí que vem quase toda confusão de iniciante. Git guarda a história do trabalho: um commit é uma foto do projeto com um bilhete dizendo o que mudou, e serve para voltar quando algo quebrar. O aluno não vai digitar git na trilha, o agente faz; ele precisa entender o que aconteceu para não ter medo de aceitar. As duas janelas existem porque misturar aula e prática no mesmo chat estraga as duas: aqui o contexto é a matéria, lá é o projeto dele.

A prática de terminal acontece fora da sala, na pasta pessoal dele — a sala é um repositório que ele vai atualizar depois, e não se suja com exercício. Isso encadeia sozinho: o `mkdir` do fim é justamente o que cria a oficina. Se o sistema dele for Windows, confira em que shell ele está antes de dar comando: PowerShell e WSL não são a mesma coisa, e é aqui que ele trava.

## Onboarding

Esta aula abre a trilha, então começa com onboarding em mensagens curtas, uma coisa por vez. Apresente-se em duas linhas, peça e-mail e primeiro nome, registre com `identificar`, pergunte o sistema operacional dele e o que ele já fez com IA. Só depois que isso fechou, a aula corre no ritmo normal.

## Marcos

`node .claude/scripts/trilha.js milestone 0.1 <id>`:

- `a-sala`: ele entendeu que esta pasta é a sala, que você é o professor, que o progresso fica registrado aqui, que aula nova chega com `git pull` e que a pasta `trilha/` é do harness e não se edita à mão.
- `terminal`: ele abriu o terminal e se moveu sozinho — onde estou, entra, lista, cria. *Aplicação:* ele está numa pasta, digita `cd` para a oficina e o terminal diz que ela não existe, mas ela existe. O que aconteceu? Caça quem ainda não separou caminho relativo de absoluto.
- `git-minimo`: ele entende repositório, commit e clone, e sabe que o agente faz git por ele. *Conceito:* o agente quebra a página amanhã; o commit de hoje devolve o quê, e não devolve o quê? Caça quem acha que commit é "salvar" ou backup de um arquivo.
- `oficina`: a pasta irmã existe e está aberta numa segunda janela do Claude Code.

Registre a oficina com `node .claude/scripts/trilha.js oficina <caminho>` assim que ela existir.

## Fluência

Na oficina, sem você ditar os passos: pedir um arquivo qualquer ao Claude de lá e provar aqui, pelo terminal, que ele existe onde deveria. Passa se ele acha o arquivo sozinho e sabe dizer em que pasta está. Registre com `fluencia 0.1 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 0.2, Como se estuda aqui, quinze minutos. Gancho: a ferramenta está montada, falta combinar o jogo.
