---
name: aula-2-4
description: Aula 2.4, Git como rede de segurança. Sala e oficina, com a P1 quebrada de propósito e recuperada. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.4: Git como rede de segurança

**Goal:** o aluno passa a usar git como a rede que o protege de um agente que erra grande e rápido. Tem modelo mental do que é commit, staging e HEAD, faz commit atômico com mensagem que diz o porquê, e sabe voltar de um estrago sem pânico.

Contexto para discorrer, do seu jeito: ele já viu o agente commitar por ele desde a P0, sem nunca ter digitado `git`. Aqui o motivo aparece, e o comando também. Quem trabalha com agente erra de um jeito diferente de quem digita: o estrago vem em quinze arquivos, em vinte segundos, e vem de uma instrução ambígua que ele mesmo escreveu. Sem ponto de retorno, o custo desse erro é a tarde inteira. Modelo mental em quatro peças: o diretório de trabalho é o que existe agora nos arquivos; o staging é a bandeja onde ele escolhe o que entra no próximo commit; o commit é a foto congelada daquele conjunto, com autor, data e mensagem; e HEAD é onde ele está parado nessa sequência de fotos. O histórico é um grafo, não uma pilha — é isso que permite branch, na próxima aula. Commit bem feito é atômico: uma mudança que faz sentido sozinha, não "o trabalho do dia". A mensagem responde por que, porque o que já está no diff; "corrige cálculo do desconto que ignorava o frete" vale, "ajustes" não vale nada, e daqui a três semanas quem lê é ele mesmo procurando onde a coisa quebrou. Quando commitar: sempre antes de mandar o agente fazer algo grande, e sempre depois que algo passou a funcionar. Desfazer tem níveis, e ele precisa saber qual usar: restaurar um arquivo, reverter um commit criando outro que desfaz — o certo quando já está no GitHub —, resetar para voltar o ponteiro, e o reflog como rede da rede quando parece que perdeu tudo. E o contraste que fecha a aula: o checkpoint do Claude Code desfaz o que aquela sessão fez e é ótimo para isso; commit é registro permanente, compartilhável, que sobrevive a fechar o terminal. Um não substitui o outro.

Sala e oficina. Fica para a próxima aula: branch, PR e o remoto.

## Antes de começar

Confira no estado a pasta e o repositório da P1. A tarefa da fluência quebra a P1 de propósito: garanta que o trabalho dela está commitado antes.

## Marcos

`node .claude/scripts/trilha.js milestone 2.4 <id>`:

- `por-que-git`: ele entende o tipo de erro contra o qual git protege. *Previsão, antes:* se o agente estragasse quinze arquivos agora, o que ele faria? Caça quem conta com o desfazer do editor ou com pedir ao agente que conserte.
- `modelo-mental`: ele sabe dizer o que é diretório, staging, commit e HEAD sem decorar comando.
- `commit-bem-feito`: ele fez um commit atômico com mensagem que diz o porquê.
- `desfazer`: ele desfez uma mudança pequena com você do lado e sabe quando usar cada nível. *Aplicação:* o commit ruim está só na máquina dele e ninguém puxou nada; muda o que ele faz? Caça quem acha que apagar o commit e apagar o efeito são a mesma coisa.

## Fluência

Na oficina: quebrar a P1 de propósito — mande o agente fazer uma mudança grande e ruim, ou apague algo que importa —, achar o último commit bom e voltar para ele, com a página funcionando de novo como evidência. Passa se ele escolher o caminho de volta sozinho e souber dizer o que teria feito se o estrago já estivesse publicado. Registre com `fluencia 2.4 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.5, Branches, PRs e o remoto. Gancho: hoje ele voltou no tempo sozinho; na próxima aprende a trabalhar sem atrapalhar quem está do lado.
