---
name: aula-3-6
description: Aula 3.6, Segurança de IA. Sala e oficina, com a tríade achada na P3, uma perna cortada e uma entrada hostil provando o corte. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.6: Segurança de IA

**Goal:** o aluno entende por que texto de fora vira instrução, acha a tríade letal no sistema dele e corta uma perna no desenho, não no prompt, mantém o dado de cada cliente na chamada dele, e sabe dizer o que o modelo nunca faz sozinho.

Contexto para discorrer, do seu jeito: abra pelo gancho da 3.5. O treino dá peso ao *system* e desconfiança ao conteúdo de fora, então o lugar do texto muda a frequência, mas não é parede: tudo vira tokens na mesma janela, e texto com cara de ordem às vezes é seguido. Na P3 a injeção é indireta: quem opera é o escritório, então a mensagem do cliente já é conteúdo de terceiro, e a encaminhada do fornecedor, terceiro de terceiro. Separar regra de dado baixa a frequência e vale fazer, mas em segurança 95% é reprovar. Na 2.13 a defesa era não misturar texto de fora com comando; aqui misturar é o produto, e a defesa vai para o desenho. A pergunta vira o que acontece quando ela funciona, e a tríade letal responde: com dado privado, conteúdo não confiável e um caminho para fora juntos, um texto plantado faz o modelo pôr o dado na saída. A saída é menos óbvia do que parece. Isolamento é a mesma ideia: dado de um cliente só entra na chamada dele, nem em exemplo, nem em memória compartilhada, nem no prefixo do cache (3.4), que leva regra e plano de contas, nunca livro de cliente. E o provedor lê: no gratuito do Gemini, o que entra alimenta o Google e gente pode ler; passa com a Prado fictícia, não com cliente real. Na P3 o estrago mais provável é de integridade, que a tríade não cobre: a categoria obedecida passa no schema e vira imposto errado. O que segura é a pessoa e o aviso, e aviso que só o modelo decide a própria injeção desliga: o que dá para decidir em código, decida em código. Entrar no arquivo passa sempre por gente (o brief manda); falar com o cliente também, ou sai sozinho só com texto fixado por regra, que a mensagem não alcança. Humano no loop vale a atenção dele: duzentos itens por dia viram carimbo; o desenho diz onde ler devagar.

Sala e oficina. A 2.13, a 3.3 e a 3.5 já foram dadas: referencie. Fica para depois: evals (3.7), histórico como contexto (3.8), ferramentas e agente (3.9).

## Antes de começar

Confira no estado a pasta e o repositório da P3, e se a fluência da 3.5 passou: saída validada e o não entendido visível na fila. Se a fila ainda não separa quem vê o quê, ganha hoje, no servidor (a 2.13), provada por teste automatizado que a correção roda de novo; credencial de teste não vai para README nem chat. A P3 é corrigida no fim e a régua não está neste chat. Pergunte o que entra na chamada de um cliente (o histórico, se já entra, é a perna mais gorda) e o que sai e para onde: você não lê o código dele, não escolhe a perna que ele corta e não decide o que fazer com a ideia da Denise de aprender com os 140.

## Marcos

`node .claude/scripts/trilha.js milestone 3.6 <id>`:

- `injecao`: ele sabe por que conteúdo vira instrução e por que nenhum filtro resolve. *Previsão, antes:* para o modelo, qual é a diferença entre o *system* que ele escreveu e o texto da mensagem do cliente? Caça quem acha que o lugar onde o texto está é uma fronteira que o modelo não atravessa.
- `triade-letal`: ele nomeia as três pernas e sabe que cortar uma tira o caminho, não a injeção. *Conceito:* a pergunta de volta deixa de sair sozinha e passa pelo Tiago; a injeção ainda funciona? O que ela ainda consegue, e o que não consegue mais? Caça quem confunde cortar a perna com impedir o ataque.
- `isolamento`: ele sabe que o que entra no contexto pode sair, e onde o dado de um cliente vaza para outro, na fila e na chamada. *Aplicação:* o sistema aprende com os 140 de uma vez; o que entra na chamada do Rubens, e o que uma mensagem do Rubens consegue tirar dali? Caça quem mede a ideia pela leitura que melhora e esquece quem escreve.
- `humano-no-loop`: ele diz o que o modelo nunca faz sozinho no sistema dele, e por que a trava está no código.
- `prova-hostil`: uma entrada hostil passou pelo sistema dele e o corte segurou.

## Fluência

Na oficina, sobre a P3: ele aponta as três pernas no sistema dele, diz qual cortou e como. **Você escreve** uma entrada hostil nova, fora do material, na voz de um cliente, mirando o que o corte dele protege: é o teste de fora da 1.3. Ele escreve outra, mirando outra perna. Manda as duas e cola o item da fila e, se o log tem, o que entrou na chamada. E o teste automatizado do isolamento: como Tiago, o cliente da Aline não abre nem trocando o identificador no endereço, e como Denise todos abrem; ele roda e cola a saída. O README ganha a primeira versão do que o sistema nunca faz sozinho (o brief pede), com as duas entradas, quem escreveu cada uma e o resultado. Passa se as pernas forem do sistema dele e não genéricas, se o corte não depender de o modelo obedecer, se a evidência mostrar o estrago sem caminho e se o teste passar; modelo enganado não reprova. Registre com `fluencia 3.6 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.7, Evals. Gancho: hoje uma entrada hostil provou um caso; na próxima a pergunta deixa de ser se um caso passa e vira quantos passam, com um número que mexe quando o prompt muda.
