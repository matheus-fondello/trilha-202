---
name: aula-2-11
description: Aula 2.11, Debugging sem ler código. Sala e oficina, com um bug da P2 levado à causa e coberto por teste. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.11: Debugging sem ler código

**Goal:** o aluno para de mandar "está errado, conserta" e passa a conduzir o agente do sintoma à causa: reproduz, isola, escreve a hipótese, exige a evidência que a confirma e só então deixa corrigir — e vê quando o agente está só tentando coisas.

Contexto para discorrer, do seu jeito: bug é a distância entre o que ele esperava e o que apareceu, e o primeiro passo não é corrigir, é descrevê-la: o que fez, o que esperava, o que veio. Reproduzir é a base: bug que aparece sob comando está quase resolvido. Isolar é encolher o caso até sobrar só o que quebra: se o simulador erra com "R$ 1.234,56", erra com "1234,56"? Com "1234.56"? Hipótese é uma frase que prediz algo observável ("se é a vírgula, o consumo sai cem vezes maior"), e evidência é a predição confirmada por algo que rodou. Um passo por vez: duas mudanças e o bug sumir não diz qual era a causa. Log mostra o valor no meio do caminho, onde o dado virou o que não devia; teste é a reprodução automatizada (o da 2.10 já roda por hook); screenshot, o que a tela mostra. O mais subestimado é pedir ao agente a explicação em português do caminho do valor, da entrada ao resultado, e ler procurando o passo em que a história quebra: sem ler código. Erro sintático é o que a máquina pega sozinha, compilador, tipo, lint, e o agente resolve sem ninguém. Erro conceitual só o entendimento do sistema pega: a conta certa com a tarifa errada, o Fio B esquecido; o teste pega esse erro só depois que alguém que entendeu o escreveu, e é por isso que a fluência termina em teste. A aula caça o "tentar coisas": com só "está errado", o agente chuta a correção mais plausível, depois a segunda, e cedo ou tarde engole o erro num try/catch ou troca a mensagem. É supressão: o sintoma some, a causa fica. A regra da 1.7 vale aqui: duas correções sem andar, `/clear`, e o prompt novo leva reprodução, hipótese e o que já foi descartado.

Sala e oficina. A 1.3, a 1.4 e a 1.7 já foram dadas: referencie. Fica para depois: a revisão que procura o bug antes de ele aparecer (2.12) e entrada hostil e dado pessoal (2.13).

## Antes de começar

Confira no estado a pasta e o repositório da P2, e se a fluência da 2.10 passou (se não, o teste da fluência de hoje é o primeiro do projeto). A evidência vem colada da oficina; você não lê o código dele. A P2 é corrigida: você ensina o método, não diz onde está o bug nem o que mudar; o que ele acha vem antes.

## Marcos

`node .claude/scripts/trilha.js milestone 2.11 <id>`:

- `do-sintoma-a-causa`: ele descreve o bug como esperado e observado, reproduz, isola e escreve a hipótese antes da correção. *Previsão, antes:* o simulador mostrou um número errado e ele manda "está errado, conserta"; o que o agente faz com isso? Caça quem imagina que o agente investiga; ele chuta a correção mais plausível.
- `instrumentos`: ele sabe o que cada instrumento mostra e pediu ao agente a explicação em português de um caminho de dado.
- `conceitual-ou-sintatico`: ele separa o erro que a máquina pega do que só quem entende o sistema pega. *Conceito:* build e testes verdes, e o simulador diz a quem paga R$ 200 que compensa; que tipo de erro é esse, e quem pegaria? Caça quem acha que verde é certo.
- `causa-raiz-nao-supressao`: ele reconhece supressão, sabe a regra das duas correções e escreve o prompt novo. *Aplicação:* terceira tentativa, o agente propõe um try/catch com "tente novamente" e o erro some da tela. Aceita? Caça quem confunde "não quebra mais" com "consertado".

## Fluência

Você não escreve código: o que você planta é entrada. Proponha cenários e ele roda na oficina até algo quebrar: "R$ 1.234,56", conta de zero, campo vazio, cidade fora das quatro, duas simulações seguidas com o mesmo contato. Se nada quebrar, vale o bug real que ele já tem. Sobre ele: reproduzir sob comando, isolar, hipótese escrita antes de qualquer correção, evidência colada aqui que a confirma, correção da causa, e um teste que falhava antes e passa depois. Passa se a hipótese vier antes da correção, a evidência for colada e não afirmada, e o teste cobrir o caso que quebrou. Registre com `fluencia 2.11 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.12, Revisão adversarial. Gancho: hoje ele correu atrás do bug que apareceu; na próxima, alguém procura o bug antes de ele aparecer.
