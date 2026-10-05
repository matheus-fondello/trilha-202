---
name: aula-3-7
description: Aula 3.7, Evals. Sala e oficina, com o eval da P3 rodando por script e o número lido depois de uma mudança no prompt ou no modelo. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.7: Evals

**Goal:** o aluno troca "testei umas mensagens e pareceu bom" por um número: casos com a saída esperada escrita por ele pelas regras, uma métrica que diz o que é acerto, um script que roda tudo, e o hábito de medir antes de mexer no prompt ou no modelo.

Contexto para discorrer, do seu jeito: até aqui ele conferiu o lançador olhando, que é o "parece certo" da 2.10 com outro nome; com modelo é pior, porque a mudança de prompt que conserta uma mensagem quebra outra sem avisar. Para o Hamel Husain, produto de IA que empaca quase sempre empacou por falta de eval. Um caso é uma entrada real mais a saída esperada, e vinte bem escolhidos bastam para começar. Saem do material: a mensagem clara, a que vira mais de um lançamento, e a que não vira lançamento ou não pode chegar só para aprovar; e a entrada hostil da 3.6, cujo esperado o corte garante: é regressão de segurança. A saída esperada é escrita por ele, lendo a regra da casa, **antes** de ver o que o sistema respondeu; copiar a resposta do sistema dá cem por cento e não mede nada. Onde a regra depende do histórico do cliente, ele marca o caso e escreve agora os dois esperados, sem e com histórico, os dois pela regra: a 3.8 só liga e desliga a recuperação, e nada se reescreve depois de ver a saída. Na métrica, o que tem resposta única compara-se exato, inclusive para onde a mensagem vai; quais campos do lançamento têm resposta única, ele decide. Parcial, campo a campo, mostra onde ele erra mais; mas lançamento com tudo certo menos a categoria é imposto errado, e o que importa é o lançamento inteiro. Texto livre é que pede modelo como juiz — na P3, a pergunta de volta ao cliente, curta, na voz da casa e sem termo contábil; a descrição de uma linha raramente justifica —, e com cuidado: ele responde passa ou não passa, porque entre um 3 e um 4 ninguém concorda e uma melhora de meio ponto não diz nada; e, como também erra, é conferido contra casos que o aluno julgou na mão antes de ganhar confiança. Regressão é a disciplina: o número antes de mexer, uma mudança por vez, o número depois, lido caso a caso, não só no total. Trocar para o modelo menor da 3.4, ou cortar contexto para baratear, é mudança como outra: só vale medida, caso a caso. Rodar duas vezes sem mudar nada mostra quanto o número oscila sozinho; diferença menor que isso não é melhora. Eval é o TDD da IA: o caso que falha vem antes da mudança no prompt, e a regra da 2.10 volta com outra cara: o esperado só muda quando a releitura da regra mostra que ele estava errado, e a mudança se anota com a regra que decidiu; nunca porque o modelo respondeu diferente. Cada correção do Tiago na fila é um caso novo de graça, como a 3.5 apontou.

Sala e oficina. A 2.10, a 3.5 e a 3.6 já foram dadas: referencie. Fica para depois: o histórico do cliente como contexto (3.8).

## Antes de começar

Confira no estado a pasta e o repositório da P3, e se a fluência da 3.6 passou: o lançador está no ar, validado, com teto e a entrada hostil testada. Pergunte se o histórico já entra na chamada; se entra, o caso marcado mede com ele, e a 3.8 mede desligando. A P3 é corrigida no fim e a régua não está neste chat. Você não escreve caso nem script, e não diz qual é a saída certa de mensagem nenhuma: pergunte qual regra da casa decidiu e trabalhe com a resposta. Casos, saída do script e número vêm colados da oficina.

## Marcos

`node .claude/scripts/trilha.js milestone 3.7 <id>`:

- `conjunto-de-casos`: ele escreveu a saída esperada pelas regras, antes de ver a do sistema. *Previsão, antes:* ele mexe no prompt do lançador amanhã; como saberia se ficou melhor ou pior? Caça quem confia em testar três mensagens na mão.
- `metrica`: ele sabe o que conta como acerto e onde cabe cada métrica. *Aplicação:* ele quer medir o valor do lançamento e se a pergunta de volta ao cliente saiu curta, na voz da casa e sem termo contábil; que métrica vai em cada uma, e quem confere o juiz? Caça quem põe modelo para julgar o que dá para comparar exato, ou confia no juiz sem conferir.
- `regressao`: ele mede antes de mudar, muda uma coisa, e lê o resultado caso a caso. *Conceito:* duas rodadas sem mexer em nada deram 14 e 15; ele muda o prompt e dá 16. Melhorou? Caça quem lê oscilação como melhora.
- `eval-e-tdd`: ele liga o eval ao loop da 2.10 e sabe quando a saída esperada muda (a regra) e quando não muda (o modelo).
- `eval-rodando`: os casos rodam por script na oficina e dão um número.

## Fluência

Na oficina, sobre a P3: vinte casos, do material e a entrada da 3.6, com a saída esperada escrita por ele a partir das regras, rodando por script que imprime o número; o script roda duas vezes sem mudança (são centavos), depois uma mudança só, no prompt ou no modelo, e a terceira rodada. Ele cola as três saídas e diz o que mudou; o README ganha o que o eval mede e quanto deu, como o brief pede. **Você escolhe** três casos da lista dele e pede a regra que decidiu cada saída esperada. Passa se os casos cobrirem a mensagem clara, a de mais de um lançamento e a que não vira lançamento ou chega com aviso, se ele disser a regra dos três escolhidos, e se ler a diferença caso a caso, separando o efeito da mudança do que já oscilava entre as duas primeiras. O número subir não é exigido. Cem por cento na primeira rodada pede que ele diga de onde veio cada saída esperada. Registre com `fluencia 3.7 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.8, Recuperação e memória. Gancho: o "pix pro marcão 450", que o Tiago só entende rolando a conversa para cima, o sistema lê no escuro, ou com o histórico inteiro de qualquer cliente; na próxima ele recebe só o daquele cliente, pelo caminho certo, e o número de hoje diz se valeu.
