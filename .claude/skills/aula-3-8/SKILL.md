---
name: aula-3-8
description: Aula 3.8, Recuperação e memória. Sala e oficina, com o histórico do cliente entrando na chamada da P3 e o eval medindo a diferença. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.8: Recuperação e memória

**Goal:** o aluno dá à chamada o que o produto tem guardado e o modelo não, só daquele cliente e pelo jeito mais simples de buscar que resolve, trazendo o histórico ou recortando o que já entra, decide o que o sistema lembra de cada usuário e quem escreve essa lembrança, e mede no eval se ajudou.

Contexto para discorrer, do seu jeito: a 3.1 separou pesos de contexto, e a 3.3 mostrou que a API não lembra de nada. Que o Marcão conserta o forno, o Tiago sabe de cabeça e o modelo não, nem aprende com o uso: ou entra na chamada, ou não existe. Recuperar é achar, num acervo maior, o pedaço que serve à chamada. Três jeitos, do simples ao caro: pela chave (a mensagem é deste cliente, pega o histórico dele); por busca de texto ("marcão" na contraparte); e por semelhança de sentido, com trechos virados vetor, os *embeddings*. RAG é o nome genérico de "busca e põe no prompt", não sinônimo de vetor. Na P3 existe chave, e chave ganha de vetor. O acervo é o banco, um arquivo, o export da Denise; recuperar de arquivo, na P3, é o código ler a parte daquele cliente antes de chamar. Acervo pequeno nem pede busca: três meses de um cliente cabem inteiros, e a Anthropic diz que abaixo de uns duzentos mil tokens pôr tudo é legítimo. Caber não é valer: cada token entra na conta de toda chamada (3.4), e a atenção do modelo se dilui quando o contexto incha, o *context rot*. Memória por usuário é recuperar o que o produto escreveu antes, e o desenho tem três perguntas: o que guardar (o que muda a próxima resposta e custa perguntar de novo), onde (por usuário, com a chave dele; memória misturada é o vazamento da 3.6: pergunte o que ele decidiu lá sobre a ideia da Denise de aprender com os 140, e se hoje isso muda) e quem escreve, a que mais pesa. O histórico aprovado é boa memória porque gente conferiu cada linha; saída crua do modelo guardada como fato faz o erro de hoje virar contexto amanhã. A memória que você guarda dele é a mesma decisão: quem escreve é o modelo, e por isso ela tem limite e ele lê. Montar em produção: o fixo primeiro, regras e plano de contas, que o cache da 3.4 aproveita; depois o recuperado daquele cliente, delimitado como dado e não como instrução, higiene contra confundir as partes e não a trava, que segue sendo o desenho da 3.6; por último a mensagem. E recuperar também piora: quem vê três meses do mesmo pagamento tende a completar com o número de sempre o que a mensagem não disse, o chute bonito do brief com cara de memória. Recuperar é mudança de prompt, e mudança de prompt se mede (3.7).

Sala e oficina. A 3.1, a 3.3, a 3.4, a 3.6 e a 3.7 já foram dadas: referencie. Fica para depois: o modelo pedindo a busca ou abrindo o arquivo sozinho, por ferramenta (3.9).

## Antes de começar

Confira no estado a pasta e o repositório da P3, e se a fluência da 3.7 passou: é o eval dela que mede hoje. Pergunte se o histórico já entra na chamada desde a 3.3, e como: inteiro ou recortado, de que cliente, por qual código, e peça o prompt impresso de uma chamada. Se entra, hoje é deixá-lo só daquele cliente, pela chave, decidir até onde vai, delimitar e medir, e a rodada "sem" é a recuperação desligada; se não, hoje é trazer. A P3 é corrigida no fim e a régua não está neste chat. Você não escreve código nem escolhe o que recuperar ou onde cortar: pergunte o que o Tiago sabe de cabeça e o sistema não, e trabalhe com a resposta.

## Marcos

`node .claude/scripts/trilha.js milestone 3.8 <id>`:

- `recuperar`: ele sabe os três jeitos de buscar e escolhe o mais simples que resolve. *Aplicação:* o Nilton escreve "pix pro rapaz do forno" em vez de "marcão"; chave, texto ou vetor resolve, e o que cada um custa a mais? Caça quem vai direto ao vetor porque acha que RAG é vetor.
- `quando-cabe-tudo`: ele sabe quando pôr o acervo inteiro basta e por que caber não é valer. *Conceito:* o histórico da padaria cresce todo mês; até quando ele manda tudo, e o que decide a hora de cortar? Caça quem decide pela janela, e não pela conta e pelo eval.
- `memoria-por-usuario`: ele decide o que guardar de cada cliente, onde, e quem escreve. *Aplicação:* alguém propõe guardar tudo o que o modelo respondeu, aprovado ou não, como memória do cliente; aceita? Caça quem guarda chute como fato e deixa o erro se ensinar.
- `contexto-em-producao`: ele montou a chamada com o recuperado, como dado, só daquele cliente, e mediu.

## Fluência

Na oficina, sobre a P3: o histórico aprovado chega à chamada recuperado por código, só daquele cliente, e o eval da 3.7 roda sem e com ele, mesmo modelo e mesmos casos. Os marcados na 3.7 já têm o esperado com histórico; se nada mexer, falta caso que dependa dele, e ele escreve outros pelas regras antes de medir, nunca copiando a saída do sistema. Peça coladas as duas saídas do eval, as linhas do log das duas rodadas, com quanto o histórico somou por mensagem em reais, e o prompt de uma chamada, impresso pelo sistema, mostrando o que entrou. Passa se o recuperado vier por código e só daquele cliente, se as rodadas usarem os mesmos casos, e se ele explicar um caso que mudou pelo histórico e disser se algum piorou. Número que não sobe não reprova. Registre com `fluencia 3.8 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.9, Ferramentas e agentes no produto. Gancho: hoje o código decidiu o que buscar antes de chamar o modelo; na próxima é o modelo que pede a busca, como o Claude Code faz, e ele vai saber dizer por que a P3 é um fluxo fixo e não um agente.
