---
name: aula-3-7
description: Aula 3.7, Evals. Sala e oficina, com o eval da P3 rodando por script e o número lido depois de uma mudança no prompt ou no modelo. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.7: Evals

**Goal:** o aluno troca "testei umas mensagens e pareceu bom" por um número: casos com a saída esperada escrita por ele pelas regras, uma métrica que diz o que é acerto, um script que roda tudo, e o hábito de medir antes de mexer no prompt ou no modelo.

Contexto para discorrer, do seu jeito: conferir o lançador olhando é o "parece certo" da 2.10, e com modelo é pior: o prompt que conserta uma mensagem quebra outra sem avisar. Caso é entrada real mais saída esperada; vinte bastam para começar, do material: a mensagem clara, a que vira mais de um lançamento, a que não vira lançamento ou não pode chegar só para aprovar; e a entrada hostil da 3.6, cujo esperado o corte garante: é regressão de segurança. A saída esperada sai da regra da casa, escrita por ele **antes** de ver a do sistema: copiá-la dá cem por cento e não mede nada. Onde a regra depende do histórico do cliente, ele marca o caso e escreve agora os dois esperados, sem e com histórico: a 3.8 só liga e desliga a recuperação. Na métrica, o que tem resposta única compara-se exato, inclusive o destino da mensagem; quais campos do lançamento têm resposta única, ele decide. Campo a campo mostra onde ele erra mais, mas lançamento certo menos a categoria é imposto errado: conta o lançamento inteiro. Modelo como juiz só para texto livre — na P3, a pergunta de volta ao cliente; a descrição de uma linha raramente justifica —, respondendo passa ou não passa (entre um 3 e um 4 ninguém concorda, e meio ponto de melhora não diz nada), e, como também erra, conferido contra casos que ele julgou na mão antes de ganhar confiança. Modelo menor (3.4) ou contexto cortado para baratear é mudança como outra: só vale medida. Duas rodadas sem mudar nada mostram quanto o número oscila sozinho; diferença menor que isso não é melhora. Eval é o TDD da IA: o caso que falha vem antes da mudança no prompt, e o esperado só muda quando a releitura da regra mostra que estava errado, anotando a regra que decidiu; nunca porque o modelo respondeu diferente. Cada correção do Tiago na fila é um caso novo de graça (3.5).

Sala e oficina. A 2.10, a 3.5 e a 3.6 já foram dadas: referencie. Fica para depois: o histórico do cliente como contexto (3.8).

## Antes de começar

Confira no estado a pasta e o repositório da P3, e se a fluência da 3.6 passou: o lançador no ar, validado, com teto e a entrada hostil testada. Pergunte se o histórico já entra na chamada; se entra, o caso marcado mede com ele, e a 3.8 mede desligando. A P3 é corrigida no fim e a régua não está neste chat. Você não escreve caso nem script, e não diz a saída certa de mensagem nenhuma: pergunte qual regra da casa decidiu e trabalhe com a resposta.

## Marcos

`node .claude/scripts/trilha.js milestone 3.7 <id>`:

- `conjunto-de-casos`: ele escreveu a saída esperada pelas regras, antes de ver a do sistema. *Previsão, antes:* ele mexe no prompt do lançador amanhã; como saberia se ficou melhor ou pior? Caça quem confia em testar três mensagens na mão.
- `metrica`: ele sabe o que conta como acerto e onde cabe cada métrica. *Aplicação:* ele quer medir o valor do lançamento e se a pergunta de volta ao cliente saiu curta, na voz da casa e sem termo contábil; que métrica vai em cada uma, e quem confere o juiz? Caça quem põe modelo para julgar o que dá para comparar exato, ou confia no juiz sem conferir.
- `regressao`: ele mede antes de mudar, muda uma coisa, e lê o resultado caso a caso. *Conceito:* duas rodadas sem mexer em nada deram 14 e 15; ele muda o prompt e dá 16. Melhorou? Caça quem lê oscilação como melhora.
- `eval-e-tdd`: ele liga o eval ao loop da 2.10 e sabe quando a saída esperada muda (a regra) e quando não muda (o modelo).
- `eval-rodando`: os casos rodam por script na oficina e dão um número.

## Fluência

Na oficina, sobre a P3: vinte casos, do material e a entrada da 3.6, com a saída esperada escrita por ele pelas regras, rodando por script que imprime o número; duas rodadas sem mudança, depois uma mudança só, no prompt ou no modelo, e a terceira. Ele cola as três saídas e diz o que mudou; o README ganha o que o eval mede e quanto deu, como o brief pede. **Você escolhe** três casos da lista dele e pede a regra que decidiu cada saída esperada. Passa se os casos cobrirem a mensagem clara, a de mais de um lançamento e a que não vira lançamento ou chega com aviso, se ele disser a regra dos três escolhidos, e se ler a diferença caso a caso, separando o efeito da mudança do que já oscilava entre as duas primeiras. O número subir não é exigido. Cem por cento na primeira rodada pede que ele diga de onde veio cada saída esperada. Registre com `fluencia 3.7 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.8, Recuperação e memória. Gancho: o "pix pro marcão 450", que o Tiago só entende rolando a conversa para cima, o sistema lê no escuro, ou com o histórico inteiro de qualquer cliente; na próxima ele recebe só o daquele cliente, e o número de hoje diz se valeu.
