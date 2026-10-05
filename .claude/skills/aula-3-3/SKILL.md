---
name: aula-3-3
description: Aula 3.3, Chamar um modelo. Sala e oficina, com o brief da P3 entregue e a primeira chamada de API no ar. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.3: Chamar um modelo

**Goal:** o aluno recebe o brief da P3 e faz a primeira chamada de modelo dentro de um produto dele, com a chave no servidor e nunca no navegador, sabendo que cada chamada chega sem memória nenhuma, que o contexto é montado por ele a cada vez, e para que serve responder em pedaços.

Contexto para discorrer, do seu jeito: o Claude Code é um produto construído em cima de uma API; hoje ele constrói o dele. A chamada leva o modelo, o *system* — quem o modelo é nessa tarefa e quais são as regras —, a lista de mensagens e o `max_tokens`. Dois detalhes derrubam a primeira chamada de quem copia exemplo de outro provedor: o *system* é campo separado, não um item da lista, e o `max_tokens` é obrigatório e é quem corta a resposta no meio quando vem curto. Volta o texto e a contagem de tokens de entrada e de saída, que na 3.4 vira dinheiro. O caminho curto é o SDK oficial, que lê a chave da variável de ambiente da 2.6 sozinho; por baixo é HTTP. O ponto que mais confunde quem veio do chat: **a API não lembra de nada.** Cada chamada é uma folha em branco, e o que parece memória num chatbot é a lista inteira reenviada a cada vez. Daí a ideia central: o contexto não é algo que existe, é algo que você monta. Na P3, a montagem é a mensagem que chegou, mais o plano de contas, mais as regras da casa, mais o histórico daquele cliente, cada pedaço vindo de um lugar do sistema. O que não entra, o modelo não sabe; o que entra demais, ele paga e ainda atrapalha — a higiene de contexto da 1.7 aplicada a código. A chave é identidade e cartão de crédito na mesma string, e por isso o desenho é sempre o mesmo: a tela chama o **seu** servidor, ele chama a Anthropic com a chave da variável de ambiente, e a resposta volta. O navegador barra a chamada direta por padrão e existe uma opção que destrava isso; ligá-la não resolve nada, porque a chave já foi publicada junto com a página. Por fim, o streaming: a resposta chega em pedaços, o servidor repassa os eventos e a tela monta o texto aos poucos; a contagem de tokens continua vindo nos eventos de abertura e de fechamento, não no meio.

Sala e oficina. A 1.7, a 2.6 e a 3.2 já foram dadas: referencie. Fica para depois: custo e teto (3.4), saída estruturada e o que o usuário vê enquanto espera (3.5), injeção de prompt (3.6).

## Antes de começar

**O brief da P3 entra hoje**, e é a primeira coisa da aula: `praticas/p3/brief.md`, com o material em `praticas/p3/mensagens.md`. Ele lê o brief inteiro antes de qualquer código — é o Prado Contabilidade, um escritório que quer transformar mensagem de WhatsApp em lançamento. A P3 cresce daqui até a 3.8 e é corrigida no fim; a régua não está neste chat. Ela nasce nesta aula, na oficina: pasta nova, `git init`, repositório público no GitHub, a receita da 2.4 e da 2.5. Assim que existir, `node .claude/scripts/trilha.js pratica P3 pasta=<caminho> repo=<url do GitHub>`, sem URL: a URL só entra na entrega, e registrá-la abre a correção. Hoje ele não resolve a P3: faz a chamada mais simples que já produz algo útil, e ela vai errar em vários casos. Você não escreve o prompt nem escolhe o modelo: pergunte o que aquela chamada precisa saber e trabalhe com a resposta.

## Marcos

`node .claude/scripts/trilha.js milestone 3.3 <id>`:

- `a-chamada`: ele sabe o que vai numa chamada e o que volta, inclusive os tokens. *Previsão, antes:* ele manda a segunda mensagem de um cliente numa chamada nova, sem mais nada junto; o que o modelo sabe da primeira? Caça quem acha que o modelo lembra da conversa anterior porque o chat lembra.
- `chave-no-servidor`: ele sabe por que a chave nunca vai para o navegador, e qual desenho a mantém lá. *Aplicação:* ele põe a chave numa variável do JavaScript da página e publica o site; quem consegue ler aquela chave, e o que faz com ela? Caça quem acha que o risco é alguém "descobrir" a chave, e não que ela já está publicada.
- `prompt-por-chamada`: ele monta o contexto da chamada da P3 e diz de onde vem cada pedaço.
- `streaming`: ele sabe o que é responder em pedaços e onde isso serve. *Conceito:* o lançador da P3 roda quando a mensagem chega, sem ninguém olhando, e o Tiago só abre a fila pronta; streaming ajuda ali? Caça quem liga streaming por padrão, sem perguntar se alguém está esperando.
- `primeira-chamada`: a chamada acontece de verdade, na oficina, com a resposta e a contagem de tokens à vista.

## Fluência

Na oficina: um endpoint no ar que recebe uma mensagem de cliente e devolve a primeira versão do lançamento, com a chave no servidor. **Você escolhe** a mensagem, do material, e pede a resposta do sistema dele para ela. Peça duas evidências coláveis de que a chave ficou no servidor: a busca pelos primeiros caracteres dela no que o navegador baixou, vindo vazia, e a linha da aba de rede com a requisição saindo para o domínio dele, não para a Anthropic. Passa se a resposta existir e se ele apontar onde entra cada pedaço do contexto e o que aconteceria se faltasse. Saída torta em caso difícil não reprova. Registre com `fluencia 3.3 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.4, Custo, teto e observabilidade. Gancho: a contagem de tokens que ele viu hoje vira preço por mensagem, e é isso que decide se a feature cabe no plano de R$ 290 que o cliente cobra.
