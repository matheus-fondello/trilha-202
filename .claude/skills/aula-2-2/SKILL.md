---
name: aula-2-2
description: Aula 2.2, Cliente, servidor e API. Sala e oficina, com a P1 ganhando servidor e consumindo uma API pública. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.2: Cliente, servidor e API

**Goal:** o aluno consegue desenhar o caminho de um clique até o servidor e de volta, sabe o que roda no navegador e o que roda no servidor — e por que essa fronteira decide onde um segredo pode viver —, entende o que é uma API, e transforma a página estática da P1 num projeto com servidor que consome uma API pública ao vivo.

Contexto para discorrer, do seu jeito: tudo na web é o mesmo par, pedido e resposta. O navegador pede um endereço, alguém do outro lado responde, e o que volta pode ser página, dado ou erro. Dentro do pedido cabem três coisas que ele precisa reconhecer quando o agente falar delas: o endereço, o método (buscar algo é diferente de mandar algo) e o código de status da resposta, onde 200 é "deu certo", 404 é "não existe" e 500 é "quebrou aqui do meu lado". A fronteira que importa é onde o código roda. O que está no navegador é do usuário: ele abre, lê, copia e muda se quiser — então chave de API no navegador é chave publicada. O que está no servidor é seu, e é por isso que qualquer coisa com segredo, cobrança ou dado de outra pessoa mora lá. API é um contrato entre dois programas: um endereço que responde dado, quase sempre em JSON, que é só um jeito de escrever objeto e lista em texto, com regras de uso e limite. Aí vem a parte prática desta aula, e não fuja dela: a P1 dele pode ser um HTML estático, e HTML estático não tem servidor nenhum. Rota é um endereço do servidor dele que responde a um pedido; para ter uma, o projeto precisa virar um projeto Next. A 1.10 já disse por que a trilha é Next; hoje é a primeira vez que ele precisa disso de verdade, porque rota exige servidor. É também a primeira vez que ele reestrutura um projeto que já está no ar, e é matéria: peça a conversão ao agente com escopo declarado — a página tem que continuar igual, o que muda é a estrutura em volta —, e verifique com evidência, screenshot antes e depois. Se a P1 dele já for Next, o caminho é mais curto e a conversa é a mesma. Depois disso, uma rota nova consulta uma API pública sem chave e devolve o resultado. Limite e erro entram aqui: toda API pública corta quem abusa, e a rota tem que responder alguma coisa quando o outro lado não responde.

Sala e oficina. Fica para outras aulas: banco e schema, segredo em variável de ambiente, e API com chave.

## Antes de começar

Confira no estado a pasta e o repositório da P1. Olhe a pasta (`ls`) para saber se ela é HTML estático ou projeto Next em vez de perguntar: a resposta muda o tamanho do marco `a-pagina-ganha-servidor`, e é dado que está na máquina. Antes de pedir a conversão, confira que o trabalho da P1 está commitado e que existe ponto de retorno — a 2.4 explica por que isso vira regra, aqui basta não perder o artefato que sustenta o módulo.

## Marcos

`node .claude/scripts/trilha.js milestone 2.2 <id>`:

- `requisicao-e-resposta`: ele descreve o caminho do clique à resposta e reconhece método e status.
- `front-e-back`: ele sabe o que roda onde e por que a fronteira existe. *Aplicação:* ele quer mostrar na página a cotação de uma API que exige chave; onde a chamada acontece, e por quê? Caça quem acha que "está no código" é o mesmo que "está escondido".
- `a-pagina-ganha-servidor`: a P1 virou um projeto com rota, com a página igual ao que era, verificado por evidência, e a versão convertida está no ar. Se o endereço mudou, `pratica P1 url=<nova>`: a URL registrada é a que a correção viu e a que as próximas aulas conferem.
- `api-e-contrato`: ele abriu um endpoint público no navegador, leu o JSON que voltou e reconhece o contrato — o que precisa mandar, o que volta, e o que a outra ponta responde quando falha ou corta.

## Fluência

Na oficina, sobre a P1: uma rota que consulta uma API pública sem chave, escolhida por ele, com a página mostrando algo útil quando a outra ponta demora ou corta, mais o desenho em texto do caminho do clique ao servidor e de volta, feito por ele. Passa se ele montar a rota sem você ditar as partes, se o desenho puser a fronteira no lugar certo, e se a falha da API tiver resposta na tela. Registre com `fluencia 2.2 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.3, Banco, dados e a stack. Gancho: hoje o dado veio de fora e sumiu quando a página recarregou; na próxima ele aprende onde guardar dado que fica.
