---
name: aula-3-3
description: Aula 3.3, Chamar um modelo. Sala e oficina, com o brief da P3 entregue, a chave do provedor que ele escolheu criada e a primeira chamada de API no ar. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.3: Chamar um modelo

**Goal:** o aluno recebe o brief da P3 e faz a primeira chamada de modelo num produto dele, com a chave no servidor e nunca no navegador, sabendo que o modelo não lembra de nada entre chamadas, que o contexto é montado a cada vez, e para que serve responder em pedaços.

Contexto para discorrer, do seu jeito: as peças são as mesmas em qualquer provedor, só o nome do campo muda. A chamada leva o modelo, o *system* (quem o modelo é e quais são as regras), a entrada e um limite de saída. Volta o texto e os tokens de entrada e de saída, que na 3.4 viram o custo em reais e o limite do provedor gasto. O que mais confunde: **o modelo não lembra de nada.** O que parece memória é o histórico lido de novo: ou ele reenvia a lista, ou passa o id da chamada anterior e o servidor do provedor reenvia por ele (o Gemini chama isso de "com estado"). Daí a ideia central: o contexto não existe, é montado. Na P3 cada mensagem é chamada nova, e a montagem é a mensagem que chegou, as anteriores do mesmo cliente, o plano de contas, as regras da casa e o histórico daquele cliente. O que não entra, o modelo não sabe; o que entra demais gasta cota e atrapalha: a higiene de contexto da 1.7. Quem tem a chave gasta a cota em nome dele: por isso a tela chama o **seu** servidor, que chama o provedor com a chave da variável de ambiente. Na página, diz a documentação do Gemini, ela pode ser extraída. Streaming: a resposta chega em pedaços, o servidor repassa os eventos e a tela monta o texto aos poucos; a contagem de tokens que vale chega no evento final.

Sala e oficina. A 1.7, a 2.6 e a 3.2 já foram dadas: referencie. Fica para depois: custo e teto (3.4), saída estruturada e espera (3.5), injeção e o que o provedor faz com o dado (3.6).

## Antes de começar

**O brief da P3 entra hoje**, e é a primeira coisa da aula: `praticas/p3/brief.md`, com o material em `praticas/p3/mensagens.md`. Ele lê o brief inteiro antes do código. A P3 cresce daqui até a 3.8 e é corrigida no fim; a régua não está neste chat. Ela nasce nesta aula, na oficina: pasta nova, `git init`, repositório público no GitHub, a receita da 2.4 e da 2.5. Assim que existir, `node .claude/scripts/trilha.js pratica P3 pasta=<caminho> repo=<url do GitHub>`, sem URL: a URL só entra na entrega, e registrá-la abre a correção.

**A chave nasce hoje**, e o provedor é escolha dele. Apresente as opções sem empurrar nenhuma: o Gemini, gratuito, com a conta Google, na página de chaves de API do Google AI Studio; o Groq, gratuito; o Claude Haiku, pela API da Anthropic, que é paga em créditos comprados antes e barata por mensagem (o plano Pro do Claude não inclui a API; o Max e o Team trazem um crédito mensal dela); ou outro que ele já use. O gratuito tem limite de uso mais apertado e, em alguns, o provedor usa o que entra (3.6); o pago cobra cada chamada, então ele compra pouco crédito e deixa a recarga automática desligada. A chave vai para o `.env`, coberto pelo `.gitignore` (confira, é a 2.6), e nunca para o código, o README ou este chat. Modelo, limite e preço mudam: o modelo é dele, entre os que a página de preços do provedor mostra hoje; você não cita número de memória.

Hoje ele não resolve a P3: faz a chamada mais simples que já serve, e ela vai errar. Você não escreve o prompt nem escolhe o modelo: pergunte o que aquela chamada precisa saber e trabalhe com a resposta.

## Marcos

`node .claude/scripts/trilha.js milestone 3.3 <id>`:

- `a-chamada`: ele sabe o que vai numa chamada e o que volta, inclusive os tokens. *Previsão, antes:* ele manda a segunda mensagem de um cliente numa chamada nova, sem mais nada junto; o que o modelo sabe da primeira? Caça quem acha que o modelo lembra da conversa anterior porque o chat lembra.
- `chave-no-servidor`: ele sabe por que a chave nunca vai para o navegador, e qual desenho a mantém lá. *Aplicação:* ele põe a chave numa variável do JavaScript da página e publica o site; quem consegue ler aquela chave, e o que faz com ela? Caça quem acha que o risco é alguém "descobrir" a chave, e não que ela já está publicada.
- `prompt-por-chamada`: ele monta o contexto da chamada da P3 e diz de onde vem cada pedaço.
- `streaming`: ele sabe o que é responder em pedaços e onde isso serve. *Conceito:* o lançador da P3 roda quando a mensagem chega, sem ninguém olhando, e o Tiago só abre a fila pronta; streaming ajuda ali? Caça quem liga streaming por padrão, sem perguntar se alguém está esperando.
- `primeira-chamada`: a chamada acontece de verdade, na oficina, com a resposta e a contagem de tokens à vista.

## Fluência

Na oficina: um endpoint no ar que recebe uma mensagem de cliente e devolve a primeira versão do lançamento. **Você escolhe** a mensagem, do material, e pede a resposta do sistema. Peça duas evidências coláveis de que a chave ficou no servidor: a busca pelo começo dela no que o navegador baixou, vazia, e a aba de rede com a requisição indo para o domínio dele. O README ganha um `curl` pronto contra o endpoint, com uma mensagem do material e nenhuma credencial, mostrando como dizer de que cliente ela é e como mandar duas seguidas do mesmo: é por ele que a correção vê o sistema responder. Passa se a resposta existir e se ele apontar onde entra cada pedaço do contexto e o que aconteceria se faltasse. Saída torta em caso difícil não reprova. Registre com `fluencia 3.3 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.4, Custo, teto e observabilidade. Gancho: os tokens de hoje viram quanto cada mensagem custaria no plano pago, e isso decide se a feature cabe no plano de R$ 290.
