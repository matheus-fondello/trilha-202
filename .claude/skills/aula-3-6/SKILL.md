---
name: aula-3-6
description: Aula 3.6, Segurança de IA. Sala e oficina, com a tríade achada na P3, uma perna cortada e uma entrada hostil provando o corte. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.6: Segurança de IA

**Goal:** o aluno entende por que texto de fora vira instrução dentro de um modelo, reconhece a tríade letal num sistema dele, corta uma perna no desenho e não no prompt, mantém o dado de cada cliente na chamada daquele cliente, e sabe dizer o que o modelo nunca faz sozinho.

Contexto para discorrer, do seu jeito: abra cobrando o gancho da 3.5, que a 2.13 já tinha anunciado: uma mensagem do material tenta mandar no sistema, e a saída que obedece passa limpa pela validação. O treino dá peso ao *system* e desconfiança ao conteúdo de fora, então o lugar do texto muda a frequência; parede não é: tudo vira tokens na mesma janela, e texto com cara de ordem às vezes é seguido. Direta é a que quem usa o sistema digita; indireta chega no conteúdo de terceiros que o modelo lê. Na P3 quem opera é o escritório: a mensagem do cliente já é conteúdo de terceiro, e a encaminhada do fornecedor é terceiro de terceiro. Separar regra de dado vale fazer, porque baixa a frequência: a mensagem entra marcada como dado, com a origem dita e encapsulada (JSON ou tags), e o *system* diz que instrução ali dentro é conteúdo. Só não é isso que segura: em segurança 95% é reprovar, porque quem ataca tenta de novo. Na 2.13 a defesa era nunca misturar texto de fora com comando; aqui misturar é o produto, por isso a defesa sai do filtro e vai para o desenho. A pergunta vira "o que acontece quando funciona", e a tríade letal responde: dado privado, conteúdo não confiável e um caminho para fora, juntos, deixam um texto plantado fazer o modelo ler o dado e pôr na saída. A saída é menos óbvia do que parece. Corte uma perna e o ataque perde o caminho, mesmo com o modelo enganado. Isolamento é a mesma ideia: o que entra no contexto pode sair na resposta, então dado de um cliente só entra na chamada dele, seja no prompt, em exemplo, em memória compartilhada ou no prefixo fixo que o cache da 3.4 reaproveita: parte fixa é regra e plano de contas, nunca livro de cliente. A autorização da 2.13, o Carlos sem ver o lead da Renata, aqui tem duas faces: na fila, o Tiago não vê os clientes da Aline nem trocando o identificador no endereço, com a regra no servidor; na chamada, o contexto de um cliente não leva nada de outro. Na P3 o estrago mais provável é de integridade, e a tríade não o cobre: a categoria obedecida é válida no schema e vira imposto errado. O schema garante a forma, não de quem veio a ordem; o que segura é a pessoa e o aviso, e um aviso que só o modelo decide, a própria injeção desliga: o que dá para decidir em código, decida em código. Entrar no arquivo passa sempre por gente, porque o brief manda; falar com o cliente passa por gente, ou sai sozinho só com texto fixado por regra que o conteúdo da mensagem não alcança. Humano no loop vale a atenção dele: aprovar duzentos itens por dia vira carimbo; o desenho diz onde ler devagar.

Sala e oficina. A 2.13, a 3.3 e a 3.5 já foram dadas: referencie. Fica para depois: medir com casos (3.7), o histórico do cliente como contexto recuperado (3.8), ferramentas e agente (3.9).

## Antes de começar

Confira no estado a pasta e o repositório da P3, e se a fluência da 3.5 passou: a saída é validada e a fila mostra o não entendido. A P3 é corrigida no fim e a régua não está neste chat. Pergunte o que entra hoje na chamada de um cliente. Se o histórico já entra, ele é a perna mais gorda do dado privado. Se não, a perna é a mensagem e as anteriores daquele cliente, mais o que a fila guarda dos outros, e a 3.8 vai engordá-la. Você não escolhe a perna que ele corta, não decide o que fazer com a ideia da Denise de aprender com os 140, e não lê o código dele: pergunte também o que sai e para onde, e trabalhe com a resposta. A prova roda na oficina e a evidência vem colada.

## Marcos

`node .claude/scripts/trilha.js milestone 3.6 <id>`:

- `injecao`: ele sabe por que conteúdo vira instrução e por que nenhum filtro resolve. *Previsão, antes:* para o modelo, qual é a diferença entre o *system* que ele escreveu e o texto da mensagem do cliente? Caça quem acha que o lugar onde o texto está é uma fronteira que o modelo não atravessa.
- `triade-letal`: ele nomeia as três pernas e sabe que cortar uma tira o caminho, não a injeção. *Conceito:* a pergunta de volta deixa de sair sozinha e passa pelo Tiago; a injeção ainda funciona? O que ela ainda consegue, e o que não consegue mais? Caça quem confunde cortar a perna com impedir o ataque.
- `isolamento`: ele sabe que o que entra no contexto pode sair, e onde o dado de um cliente vaza para outro, na fila e na chamada. *Aplicação:* o sistema aprende com os 140 de uma vez; o que entra na chamada do Rubens, e o que uma mensagem do Rubens consegue tirar dali? Caça quem mede a ideia pela leitura que melhora e esquece quem escreve.
- `humano-no-loop`: ele diz o que o modelo nunca faz sozinho no sistema dele, e por que a trava está no código.
- `prova-hostil`: uma entrada hostil passou pelo sistema dele e o corte segurou.

## Fluência

Na oficina, sobre a P3: ele aponta as três pernas no sistema dele (que dado privado entra na chamada, que conteúdo vem de fora, por onde algo sai), diz qual cortou e como, e prova. **Você escreve** uma entrada hostil nova, fora do material, na voz de um cliente, mirando o que o corte dele protege. Ele manda pelo sistema e cola o que saiu: o item da fila e, se o log tem, o que entrou na chamada. A parte do README que o brief pede sobre o que o sistema nunca faz sozinho ganha a primeira versão, com essa entrada e o resultado. Passa se as pernas forem do sistema dele e não genéricas, se o corte não depender de o modelo obedecer, e se a evidência mostrar o estrago sem caminho; modelo enganado não reprova. Registre com `fluencia 3.6 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.7, Evals. Gancho: hoje uma entrada hostil provou um caso; na próxima a pergunta deixa de ser se um caso passa e vira quantos passam, com um número que mexe quando o prompt muda.
