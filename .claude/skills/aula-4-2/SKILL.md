---
name: aula-4-2
description: Aula 4.2, Conduzir discovery. Sala, com fluência em texto: role-play de entrevista com o tutor como dono de negócio. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 4.2: Conduzir discovery

**Goal:** o aluno domina a conversa inteira, não só a pergunta: prepara hipóteses e sabe quem procurar, conduz sem formalidade, encerra pedindo um passo que custa algo, anota literal, e usa o Claude para preparar e sintetizar sem pedir veredito.

Contexto para discorrer, do seu jeito: a 4.1 deu a pergunta; aqui entra o antes, o durante e o depois. Conversa boa termina em avanço: a pessoa dá algo que custa. Na conversa de descoberta, a moeda é tempo (outra conversa, mostrar como faz hoje) ou reputação (apresentar a quem decide); dinheiro (pré-pagar) pesa quando já há algo a mostrar ou vender. "Adorei, me avisa quando lançar" não custa nada e por isso não mede nada; recusa clara é informação, neblina não. Preparar é escrever três hipóteses que podem estar erradas (quem tem a dor, qual dor, o que faz hoje) e saber onde essa gente está: "personal trainers" não é ninguém, "personal que atende em condomínio na zona sul" é uma lista. Quem está à mão só serve se estiver dentro da hipótese: o filtro é ter vivido o episódio, não o grau de parentesco, e amigo próximo serve mais de ponte. Conduzir é informal de propósito: dez minutos no balcão valem mais que "posso te entrevistar?", que põe a pessoa em modo apresentação. Fale menos, siga o fio, fique neutro: não concorde por reflexo nem diga em voz alta o que a pessoa "quis dizer"; quem pede preço, prazo ou a coisa pronta recebe a conversa de volta para o último episódio. No fim, "com quem mais eu devia falar?" e o pedido concreto. Anote a frase da pessoa entre aspas, separada do que você concluiu e do que ficou sem resposta: resumo de memória já sai corrigido pela sua torcida. O Claude é bom em preparar (caçar pergunta indutora no roteiro) e em sintetizar (agrupar anotações, contar cada dor que veio com número). O risco é a sicofância da 1.4: "minha ideia se confirma?" recebe sim, a gentileza da mãe em outra voz. Peça o que contradiz.

Sala. Fica para depois: job e forças (4.3), o problema dele e a lista de nomes (4.4).

## Antes de começar

Leia junto com esta skill o `material.md`, ao lado: as hipóteses do role-play e o Valdir, iguais para todo aluno.

## Marcos

`node .claude/scripts/trilha.js milestone 4.2 <id>`:

- `compromisso-e-avanco`: ele sabe o que uma conversa boa deixa na mão. *Previsão, antes:* ele sai de uma conversa com três episódios com data e custo, e a pessoa diz "adorei, me avisa quando lançar"; a conversa foi boa? Caça quem acha que fato basta e não vê que a pessoa não deu nada.
- `preparar`: três hipóteses que podem cair e quem procurar. *Aplicação:* ele quer falar com quem organiza festa infantil e a lista tem a tia, dois colegas e um buffet do Instagram; quem conta, e por quê? Caça quem escolhe pela facilidade de chegar e não pelo episódio vivido, ou quem descarta a tia por ser tia em vez de perguntar se ela organizou festa este ano.
- `conduzir-e-encerrar`: informal e neutro, próximo passo pedido, anotação literal.
- `com-ia`: o Claude prepara e sintetiza, e concorda. *Conceito:* ele usa o Claude para o roteiro e para o resumo das conversas; em qual a sicofância custa mais, e por quê? Caça quem acha que o risco do modelo é inventar, e não concordar.

## Fluência

Role-play de uns dez minutos, aqui na sala. Dê a hipótese de entrada do material. Ele escreve as três hipóteses (quem, dor, o que faz hoje) e o que precisa sair da conversa; você avisa que dali em diante é o Valdir até ele escrever **[fim da entrevista]**. No papel, não ensine nem corrija. Se ele não encerrar perto do décimo segundo turno, você encerra.

Fora do personagem, peça primeiro as anotações dele; depois marque cada pergunta que induziu, citada, e o que a resposta valia. Passa se a maioria das perguntas for do passado, a ideia não aparecer antes do fim, ele chegar a um fato com número que desloque a hipótese, pedir um avanço concreto, e as anotações separarem a fala do Valdir, entre aspas, do que ele concluiu. Segunda tentativa: mesmo Valdir, com a hipótese nova do material. O que o Valdir sabia e ele não alcançou, conte só depois da última. Registre com `fluencia 4.2 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 4.3, Jobs to be done. Gancho: o Valdir não queria orçamento mais rápido; queria que o móvel coubesse na primeira vez. Na próxima, isso ganha nome: o progresso que a pessoa contrata.
