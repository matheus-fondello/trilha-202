---
name: quiz-m1
description: Q1, Quiz do módulo 1. Dez perguntas fechadas e duas abertas, sem nota e sem portão, conduzidas pelo script. Carregue apenas quando o estado indicar este quiz.
user-invocable: false
---

# Q1: Quiz do módulo 1

**Goal:** o aluno passa pelas doze perguntas, uma de cada vez, e sai com o módulo fixado e com a lista honesta do que ficou para revisitar. Não é prova: não vira nota, não bloqueia o M2, não reprova. O quiz é o recap do módulo — a correção de cada pergunta, na hora, é o que fixa. De 25 a 35 minutos.

Contexto para discorrer, do seu jeito, na abertura: ele chega depois de dez aulas, da P0 no ar e da P1 entregue e corrigida. As perguntas assumem esse repertório e misturam as aulas, sem seguir a ordem do módulo. Nenhuma se resolve sabendo o nome de um comando, e as alternativas erradas são coisas que gente competente faz — errar aqui é informação, não vergonha. O que sobe para a 202 é cada resposta, com a alternativa escolhida: é assim que a 202 descobre qual aula precisa melhorar. Erro vira dívida na memória dele, apontando a aula, e revisitar é oferecido, nunca imposto. Diga isso em quatro ou cinco linhas e comece; não estique a abertura.

Só conversa, aqui na sala. Sem oficina, sem fluência, sem avaliação de fim de aula.

## Quem conduz é o script

`node .claude/scripts/trilha.js quiz Q1` imprime a pergunta da vez. Você cola o que saiu, inteiro e sem retoque: enunciado, pergunta e alternativas, no mesmo formato. Não resuma, não reordene, não troque palavra, não acrescente dica nem comentário entre o enunciado e as alternativas. Termine o turno pedindo a letra.

Quando ele responder com uma letra clara, `quiz Q1 responder <n> <letra>`. O script grava a resposta primeiro e só então imprime a correção, já com a pergunta seguinte embaixo. Você cola a correção como veio, desenvolve a partir dela em duas a seis linhas, e cola a pergunta seguinte no mesmo turno.

- Uma pergunta por turno, na ordem, e não há refazer: o que vale é a primeira resposta. Se ele mudar de ideia depois de gravada, a resposta nova vira conversa, não registro.
- Se a resposta não for uma letra clara ("acho que b ou c", "a segunda"), pergunte de novo. Não escolha por ele e não registre por dedução.
- Antes da resposta você não ajuda: nem dica, nem "pensa no que a 1.3 dizia", nem eliminar alternativa. Se ele pedir, diga que a correção vem logo em seguida e que errar aqui só serve para ele. Você também não tem o gabarito: o banco não abre daqui.
- Depois da correção, desenvolva a partir do texto que o script deu — a explicação canônica é a mesma para todo aluno, e é ela que vale. Não invente uma segunda teoria, não contradiga o gabarito. Se ele discordar com argumento de verdade, ouça, mantenha a correção e registre a objeção com `registrar feedback texto="..."`, com as palavras dele: é assim que a pergunta melhora.
- Se ele disser que não sabe, é uma resposta legítima numa fechada? Não: peça a melhor aposta, com a razão. A alternativa que ele escolhe sem certeza diz mais sobre a aula do que um "não sei".

Quem responde certo lê uma linha só. Não infle o acerto com elogio; se quiser, uma frase sobre por que a alternativa mais tentadora era tentadora.

## As duas abertas

As perguntas 11 e 12 pedem texto. Ele escreve o que quiser, no tamanho que quiser, e você não intervém enquanto ele escreve: nem "quer que eu ajude a organizar", nem pergunta guia. Se ele disser que não sabe, peça que escreva o que pensa mesmo assim, em três linhas; se insistir, é isso que se grava.

Grave a resposta dele inteira, com as palavras dele: escreva em `trilha/tmp/q1-<n>.txt` e rode `quiz Q1 responder <n> arquivo=trilha/tmp/q1-<n>.txt`. O script grava, apaga o arquivo e devolve a **régua** da pergunta, para a sua leitura. A régua tem três partes e diz qual delas separa quem fez o módulo. Não cole a régua e não dê nota: converse. Diga o que a resposta dele já tinha, o que faltou e por que faltou, em prosa, a partir da régua e citando o que ele escreveu. Se faltou a parte que separa, é a dívida mais importante do quiz.

## Fechamento

Quando a última resposta entra, o script diz o que ficou para revisitar, por aula. Isso não é placar: ele já viu cada correção, e você não anuncia "acertou tantas". Diga o que ficou para revisitar e por quê — qual aula, e em que momento do M2 aquilo volta a ser necessário — e o que as abertas mostraram. Revisitar é oferta: as aulas estão no disco e ele pode abrir qualquer uma; você não marca revisão nem condiciona a próxima aula a isso.

Depois, na ordem que a `tutor` manda para todo fechamento: primeiro o que o aluno lê, depois os comandos. Uma nota na memória com a chave `revisitar-m1`, dizendo o que revisitar e o que você vai fazer com isso na próxima aula em que o assunto aparecer (nota é dívida com ação futura, não descrição); se nada ficou para revisitar, a nota é sobre o que as abertas mostraram, ou nenhuma. E `concluir Q1`. Não rode `avaliar`: o quiz não tem avaliação de fim de aula. A próxima é a 2.1, em chat novo.

Nome do chat, no primeiro turno: "Q1 Quiz do módulo 1".
