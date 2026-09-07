---
name: aula-3-2
description: Aula 3.2, Produto que usa IA. Sala, com fluência em texto sobre features descritas. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.2: Produto que usa IA

**Goal:** o aluno separa "usar IA para construir" de "construir um produto que usa IA", reconhece os formatos de feature de IA, e sabe dizer quando uma feature precisa de modelo e quando uma regra determinística resolve melhor — que é a decisão que mais separa produto que se sustenta de demo cara.

Contexto para discorrer, do seu jeito: até aqui a IA foi ferramenta dele; o que muda quando ela entra no produto é que o custo, o erro e a espera passam a ser do cliente. Três diferenças concretas. Custo vira variável: cada uso paga tokens, e uma feature que roda mil vezes por dia é uma linha na planilha, não uma assinatura fixa. Variância vira problema de produto: a mesma entrada pode gerar saídas diferentes, e o cliente não tolera isso onde tolera de você. Risco muda de dono: quando o agente errava para ele, ele conferia; quando erra para o cliente, alguém precisa ter desenhado o que acontece. Os formatos de feature dão vocabulário para conversar: transformar uma coisa em outra, extrair informação de texto bagunçado, classificar em categorias, gerar conteúdo novo, conversar, e agir — executar coisas no mundo. A dificuldade e o risco crescem nessa ordem, e quase todo produto bom de gente iniciante mora nos três primeiros. O critério do quando é mais simples do que parece: IA vale quando a entrada é bagunçada e a saída precisa ser organizada, e não vale quando existe regra clara. Calcular desconto por faixa de valor é uma regra de faixa, um "se" que qualquer programa resolve, não é modelo; ler um e-mail de cliente e dizer se é reclamação, dúvida ou elogio é modelo. Usar modelo onde regra resolve custa dinheiro, adiciona espera e introduz erro em coisa que era exata — e o inverso, tentar regra onde a entrada é linguagem humana, é o que gera sistema de mil `if` que ninguém mantém. Fecha com o que muda no produto: latência que precisa ser mostrada, incerteza que precisa aparecer na tela, e custo por uso que precisa caber no preço — todos assunto de aula própria mais adiante.

Sala. Sem oficina hoje: a mão na massa começa na 3.3, com a primeira chamada.

## Marcos

`node .claude/scripts/trilha.js milestone 3.2 <id>`:

- `duas-coisas-diferentes`: ele sabe o que muda quando a IA sai da mão dele e entra no produto. *Conceito:* a feature dele vai de cem para dez mil usos por dia numa semana; o que acontece com a conta dela, e o que aconteceria com a assinatura do Claude Code dele no mesmo período? Caça quem acha que é a mesma conta com outro nome.
- `formatos-de-feature`: ele nomeia os seis formatos e reconhece produtos que já usou em cada um.
- `quando-faz-sentido`: ele decide com critério, não por entusiasmo.
- `o-que-muda-no-produto`: ele cita latência, incerteza e custo por uso como coisas que aparecem para o cliente. *Aplicação:* a feature dele leva oito segundos para responder; o que aparece na tela nesse tempo, e o que aparece quando ela erra? Caça quem trata latência e incerteza como problema técnico e não como tela.

## Fluência

Em texto, aqui na sala: cinco features descritas por você — misture casos claros dos dois lados e pelo menos um ambíguo, tirados do tipo de negócio que ele conhece — e ele diz quais precisam de modelo, quais não, e por quê. Passa se o critério aparecer na justificativa, não só o veredito, e se ele acertar o ambíguo dizendo o que faltaria saber para decidir. Registre com `fluencia 3.2 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.3, Chamar um modelo. Gancho: na próxima ele recebe o brief da P3 e faz a primeira chamada de verdade, com a chave no servidor.
