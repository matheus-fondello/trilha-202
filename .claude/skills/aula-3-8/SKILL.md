---
name: aula-3-8
description: Aula 3.8, Recuperação e memória. Sala e oficina, com o histórico do cliente entrando na chamada da P3 e o eval medindo a diferença. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.8: Recuperação e memória

**Goal:** o aluno dá à chamada o que o produto tem guardado e o modelo não, só daquele cliente e pelo jeito mais simples de buscar que resolve, decide o que o sistema lembra de cada usuário e quem escreve isso, e mede no eval se ajudou.

Contexto para discorrer, do seu jeito: o Tiago sabe de cabeça que o Marcão conserta o forno; o modelo não sabe: os pesos não mudam com o uso (3.1) e a API não lembra de uma chamada para a outra (3.3). Ou entra na chamada, ou não existe. Recuperar é achar, num acervo maior, o pedaço que serve. Três jeitos, do simples ao caro: pela chave (a mensagem é deste cliente, pega o histórico dele); por busca de texto ("marcão" na contraparte); e por semelhança de sentido, com trechos virados vetor, os *embeddings*: outra chamada por mensagem e um índice para manter. RAG é "busca e põe no prompt", não sinônimo de vetor. Na P3 há chave, e ela ganha. O acervo pode ser só o export da Denise, e recuperar, o código ler a parte daquele cliente. Acervo pequeno nem pede busca: três meses de um cliente cabem inteiros. Caber não é valer: cada token entra em toda chamada, conta no custo de cada chamada e no limite por minuto do provedor (3.4), e dilui a atenção do modelo, o *context rot*. Memória por usuário é recuperar o que o produto escreveu antes, com três perguntas: o que guardar (o que muda a próxima resposta e custa perguntar de novo), onde (por usuário, com a chave dele; memória misturada é o vazamento da 3.6: pergunte o que ele decidiu lá sobre aprender com os 140, e se hoje muda) e quem escreve, a que mais pesa. O histórico aprovado é boa memória porque gente conferiu cada linha; saída crua do modelo guardada como fato vira o erro de hoje no contexto de amanhã. Montar em produção: o fixo primeiro, regras e plano de contas, o prefixo que o cache aproveita (3.4); depois o recuperado daquele cliente, delimitado como dado (higiene; a trava é o desenho da 3.6); por último a mensagem. Recuperar também piora: quem vê três meses do mesmo pagamento tende a completar com o número de sempre o que a mensagem não disse, o chute com cara de memória. Recuperar é mudança de prompt, e mudança de prompt se mede (3.7).

Sala e oficina. A 3.1, 3.3, 3.4, 3.6 e 3.7 já foram dadas: referencie. O modelo pedindo a busca por ferramenta fica para a 3.9.

## Antes de começar

Confira no estado a pasta e o repositório da P3, e se a fluência da 3.7 passou: é o eval dela que mede hoje. Pergunte se o histórico entra na chamada desde a 3.3, inteiro ou recortado, de que cliente e por qual código, e peça o prompt impresso. Se entra, hoje é deixá-lo só daquele cliente, pela chave, decidir até onde vai, delimitar e medir, com a recuperação desligada como rodada "sem"; se não, hoje é trazer. A P3 é corrigida no fim e a régua não está neste chat. Você não escreve código nem escolhe o que recuperar ou onde cortar: pergunte o que o Tiago sabe de cabeça e o sistema não, e trabalhe com a resposta.

## Marcos

`node .claude/scripts/trilha.js milestone 3.8 <id>`:

- `recuperar`: ele sabe os três jeitos de buscar e escolhe o mais simples que resolve. *Aplicação:* o Nilton escreve "pix pro rapaz do forno" em vez de "marcão"; chave, texto ou vetor resolve, e o que cada um custa a mais? Caça quem vai direto ao vetor porque acha que RAG é vetor.
- `quando-cabe-tudo`: ele sabe quando pôr o acervo inteiro basta e por que caber não é valer. *Conceito:* o histórico da padaria cresce todo mês; até quando ele manda tudo, e o que decide a hora de cortar? Caça quem decide pela janela, e não pela conta e pelo eval.
- `memoria-por-usuario`: ele decide o que guardar de cada cliente, onde, e quem escreve. *Aplicação:* alguém propõe guardar tudo o que o modelo respondeu, aprovado ou não, como memória do cliente; aceita? Caça quem guarda chute como fato e deixa o erro se ensinar.
- `contexto-em-producao`: ele montou a chamada com o recuperado, como dado, só daquele cliente, e mediu.

## Fluência

Na oficina, sobre a P3: o histórico aprovado entra na chamada e o eval da 3.7 roda sem e com ele, mesmo modelo. Os marcados na 3.7 já têm o esperado com histórico; se nada mexer, falta caso que dependa dele, e ele escreve outros pelas regras antes de medir, nunca da saída do sistema. Se o 429 do limite do provedor cortar uma rodada, ele espaça as chamadas, sem trocar de modelo. Peça coladas as duas saídas do eval, as linhas do log das duas rodadas com os tokens que o histórico somou e o que custam no preço pago do modelo, em reais, e o prompt impresso de uma chamada. O README ganha a rodada com e sem histórico, o comando de cada uma (a correção roda de novo), o custo por mensagem refeito, e se o limite por minuto ainda comporta a padaria. Passa se o recuperado vier por código e só daquele cliente, se as rodadas usarem os mesmos casos, e se ele explicar um caso que mudou pelo histórico e disser se algum piorou. Número que não sobe não reprova. Registre com `fluencia 3.8 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.9, Ferramentas e agentes no produto. Gancho: hoje o código decidiu o que buscar; na próxima é o modelo que pede a busca, como o Claude Code faz, e ele vai saber dizer por que a P3 é fluxo fixo e não agente.
