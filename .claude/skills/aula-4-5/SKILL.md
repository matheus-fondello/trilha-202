---
name: aula-4-5
description: Aula 4.5, Problem-solution fit e MVP. Sala, com fluência em texto: a hipótese que mata a ideia do aluno e o MVP que a testa. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 4.5: Problem-solution fit e MVP

**Goal:** o aluno testa a dor da ideia dele contra o que a pessoa já faz hoje, entende que MVP é o menor experimento que responde à pergunta que pode matar o negócio, e chega no escopo por subtração, fluxo antes de tela.

Contexto para discorrer, do seu jeito: problem-solution fit é ter evidência de que a dor existe e de que a solução é preferida à alternativa atual, antes de sinal de mercado (o product-market fit, que não é desta aula). Dor boa é real (aconteceu, com data), frequente (toda semana, não duas por ano) e cara (dinheiro, tempo ou reputação). O concorrente é a alternativa atual, que joga em casa com as forças da 4.3: a escola de natação que perde aluno no inverno já liga uma a uma para as mães oferecendo reposição, e o produto disputa com essas ligações. O problema errado é resolver muito bem o que ninguém tem: o app impecável de validade da geladeira esbarra em gente que diz odiar o desperdício e nunca gastou um minuto para evitá-lo. Com agente, o custo do problema errado não é o código, são as semanas e a confiança falsa da coisa pronta. MVP: "mínimo" qualifica o experimento. Ordenadas as hipóteses por "se for falsa, o negócio acaba?" e "quanto já sei dela?", a que mata quase nunca é "consigo construir": é "alguém troca o que faz hoje" ou "alguém paga", escrita com o resultado que faz desistir antes do teste. O formato é escolhido pela hipótese: concierge, o resultado entregue à mão (o Food on the Table: o app da pergunta ruim da 4.1 existiu, e começou à mão); landing ou vídeo que promete o que não existe e mede quem tenta entrar (o vídeo da Dropbox); mágico de Oz, tela real e motor humano (a Zappos comprava na loja o sapato de cada pedido); one-feature, a feature única que faz o job inteiro, o formato da P6. Subtração é o minimum feature set do Steve Blank: sai tudo que nenhum episódio real pediu, cada corte com motivo. UX é o fluxo, os passos até o resultado; UI é a tela. Quem começa desenha tela; o MVP conta passos até o valor, e quais são feitos à mão.

Sala. Fica para depois: mercado e ICP (4.6), preço (5.1), canal e funil (5.4), concierge para achar os primeiros clientes (5.5).

## Antes de começar

A cobrança da entrevista segue o resumo; se ele fez uma, use o que ela trouxe no `dor-real`. Se a aula mudar a ideia, registre a versão nova com `ideia texto=` e, se a dor ou a alternativa mudou, `hipoteses="<quem; dor; alternativa>"` inteiras; mudar é dado.

## Marcos

`node .claude/scripts/trilha.js milestone 4.5 <id>`:

- `dor-real`: ele passa a dor dele pelos três adjetivos e nomeia a alternativa atual. *Aplicação:* na ideia dele, a pessoa resolve hoje com a alternativa que ele nomeou, que ela já conhece e não custa nada; o que o produto precisa ganhar dela para a pessoa trocar? Caça quem compara produto com produto e esquece as forças que seguram (4.3).
- `problema-errado`: ele sabe como se constrói bem o que ninguém tem. *Conceito:* um colega põe no ar num fim de semana, com agente, o app da geladeira, e duzentas pessoas baixam na primeira semana; o que isso prova sobre a dor? Caça quem toma curiosidade e download por troca de comportamento.
- `hipotese-e-mvp`: ele separa produto pequeno de experimento pequeno e conhece os quatro formatos.
- `subtracao`: ele chega no escopo tirando, com motivo. *Aplicação:* a dona de uma confeitaria de encomendas pede site com catálogo, carrinho e fidelidade, e contou, com data, três encomendas perdidas no último mês por responder o preço só no dia seguinte. O que entra? Caça quem soma pedidos em vez de seguir o episódio.
- `fluxo-antes-de-tela`: ele separa fluxo de tela e conta em passos o caminho até o valor, marcando os que se fazem à mão.

## Fluência

Em texto, sobre a ideia registrada: ele lista as hipóteses, aponta a que mata e por quê, e desenha o MVP que a testa — formato, o fluxo em passos na frente de uma pessoa real, o resultado combinado antes que o faria desistir, o que fica de fora. Hipótese e formato são dele. Passa se a hipótese for de troca ou de pagamento, ou se ele justificar por que na ideia dele a técnica mata; se o resultado que o faria desistir, combinado antes, for um número ou um comportamento observável; e se o MVP for experimento contado como fluxo, não produto encolhido. Registre com `fluencia 4.5 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 4.6, Mercado, ICP e beachhead. Gancho: hoje ele decidiu o que testar; na próxima, com quem, porque "todo mundo que tem essa dor" não é mercado, e o primeiro grupo escolhido muda produto, preço e mensagem.
