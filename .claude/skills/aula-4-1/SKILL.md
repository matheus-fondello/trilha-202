---
name: aula-4-1
description: Aula 4.1, The Mom Test. Sala, com fluência em texto sobre dez perguntas de entrevista dadas. Abre o módulo de negócio. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 4.1: The Mom Test

**Goal:** o aluno entende por que perguntar a alguém se a ideia é boa não produz informação nenhuma, conhece as três regras do Mom Test, e sabe trocar uma pergunta que convida à gentileza por uma que só tem resposta factual. É o instrumento das três entrevistas reais que ele vai fazer a partir da 4.4.

Contexto para discorrer, do seu jeito: o livro do Rob Fitzpatrick parte de uma cena: você conta sua ideia para sua mãe, e ela adora. Ela não está mentindo por maldade; está protegendo você, e dizer sim não custa nada a ela. Todo mundo faz isso, e ainda erra quando tenta prever o próprio comportamento. A virada do livro é que o problema não é a pessoa, é a pergunta: a responsabilidade é de quem pergunta, e uma pergunta boa é aquela em que nem a sua mãe consegue mentir, porque ela pede um fato e não um juízo. As três regras saem daí. Fale da vida dela, não da sua ideia: enquanto a ideia não está na mesa, não há o que elogiar. Pergunte pelo passado específico, não pelo genérico nem pelo futuro: "o que você jantou ontem e como decidiu?" devolve um delivery pedido às nove da noite porque não havia nada em casa; "você usaria um app que planeja suas refeições?" devolve um sim que não vale nada. E fale menos: quem explica, convence, e quem convence para de ouvir. Os dados ruins, no livro, são três: elogio ("é uma ótima ideia"); enrolação, que é o genérico ("eu sempre esqueço"), o futuro e o hipotético ("eu usaria, eu pagaria"); e ideia, o pedido de função, que é sinal de uma dor por trás e não especificação. As perguntas que os produzem também se reconhecem: "usaria?", "pagaria quanto?", "que funções você quer?", e a pior, explicar a ideia antes de ouvir, porque depois dela toda resposta vira resposta à ideia. As boas giram em torno do último episódio real: o que fez da última vez, quanto custou em tempo ou dinheiro, o que já tentou, e por que aquilo não resolveu. A terceira separa dor de incômodo: quem nunca procurou solução raramente paga pela sua.

Sala, sem oficina: o módulo de negócio trabalha em texto. Fica para depois: compromisso, preparar e conduzir a conversa, e o Claude como parceiro dela (4.2); o job por trás do que a pessoa pede (4.3); escolher o próprio problema (4.4).

## Antes de começar

Leia o `material.md`, ao lado desta skill, junto com ela e com o `referencias.md`: são as perguntas da fluência, iguais para todo aluno. Se ele já tiver uma ideia própria, ela serve de exemplo hoje, mas o registro é da 4.4. Cenário vem da vida dele, nunca dos clientes das práticas: são fictícios e chegaram com brief escrito, não há quem entrevistar.

## Marcos

`node .claude/scripts/trilha.js milestone 4.1 <id>`:

- `opiniao-nao-vale`: ele sabe por que a resposta educada não informa nada. *Previsão, antes:* ele conta a ideia para a mãe e para cinco amigos, e todos adoram; o que isso diz sobre a ideia? Caça quem acha que o defeito é a plateia suspeita, e não a pergunta.
- `as-tres-regras`: ele conhece as três e sabe o que cada uma protege. *Conceito:* um colega entrevistou uma possível cliente por meia hora, falou metade do tempo e saiu sabendo tudo o que ela pensa do mercado e nada do que ela fez no mês passado; qual regra ele quebrou primeiro, e o que essa regra teria protegido? Caça quem acha que conversa animada é conversa boa.
- `boas-perguntas`: ele monta pergunta sobre o último episódio, o custo, o que tentou e por que não resolveu. *Aplicação:* a dona de uma gráfica rápida diz que cliente que muda a arte depois de aprovada é o pesadelo da vida dela; qual é a próxima pergunta? Caça quem aceita a dor declarada sem pedir o episódio e o que ela já tentou.
- `perguntas-ruins`: ele reconhece "usaria?", "pagaria?", pedido de função e a ideia explicada antes de ouvir.

## Fluência

Em texto, aqui na sala: as dez perguntas do material. Ele marca as que não levaria, diz que resposta cada uma traria e reescreve essas; as que deixa, diz por quê. Há boas, ruins e discutíveis, e não há gabarito escrito; julgue pelas regras da aula. Passa se as reescritas pedirem um episódio passado da vida do entrevistado sem pôr a solução na mesa, se ele não condenar as boas por reflexo, e se nas discutíveis o argumento vier de uma regra. Segunda tentativa: o segundo bloco do material. Registre com `fluencia 4.1 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 4.2, Conduzir discovery. Gancho: hoje ele escreveu as perguntas com calma; na próxima faz a conversa inteira ao vivo, com você no papel de um dono de negócio, onde não induzir é bem mais difícil.
