---
name: aula-3-1
description: Aula 3.1, O modelo por dentro. Sala, com fluência em texto. Abre o módulo de IA no produto. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.1: O modelo por dentro

**Goal:** o aluno entende de onde vem o comportamento de um modelo, separa o que está nos pesos do que precisa entrar pelo contexto, sabe por que existem modelos de tamanhos diferentes e escolhe o menor que resolve, e sabe o que "thinking" faz e o que custa. É a base para tudo que o módulo vai pedir dele como decisão de produto.

Contexto para discorrer, do seu jeito: ele já sabe, da 1.4, que o modelo prevê o próximo token. Aqui entra de onde vem essa previsão. Pré-treino é a fase longa e cara em que o modelo lê uma quantidade absurda de texto e aprende regularidade: como a linguagem se comporta, como o mundo é descrito, o que costuma vir depois do quê. O que sai daí não é um assistente, é um continuador de texto. O comportamento de assistente vem do pós-treino, que é bem menor e bem mais dirigido: exemplos de como responder, preferência humana entre respostas, regras. Duas consequências práticas. A primeira é que "saber" tem dois sentidos diferentes: o que está nos pesos — os números que o treino ajustou, e que são o modelo — é conhecimento paramétrico, generalizado e sem fonte, e por isso o modelo sabe o que é uma nota fiscal mas não sabe quantas a empresa dele emitiu ontem — esse tipo de coisa só entra pelo contexto, por busca, arquivo ou banco. É a mesma fronteira da 1.4 vista pelo lado de quem constrói: quando o produto precisa de um fato específico, alguém tem que colocar esse fato na conversa. A segunda é custo, e aqui é retomada, não novidade: na 1.6 ele já escolheu modelo por tarefa, mas o critério era o bolso e a pressa dele. Agora quem paga é o cliente e o volume é diário, então a mesma escolha muda de dono e de régua — o menor que resolve com qualidade aceitável, medida, e não o maior por segurança. Vale dizer por que os tamanhos existem: modelo maior custa e demora mais porque tem mais parâmetros para percorrer. Thinking também volta da 1.6 com outro peso: token de raciocínio é token de saída pago pelo cliente a cada uso, então ligar por hábito é decisão de custo, não de qualidade. Tudo isso volta na 3.4, quando ele medir o custo real da própria chamada.

Sala. Sem oficina: hoje é conceito, e a mão na massa começa na 3.3.

## Marcos

`node .claude/scripts/trilha.js milestone 3.1 <id>`:

- `pre-e-pos-treino`: ele separa as duas fases e sabe de onde vem o comportamento de assistente. *Previsão, antes:* de onde ele acha que vem o "jeito" de assistente do Claude? Caça quem acha que ele aprendeu a ser prestativo lendo a internet.
- `parametrico-versus-recuperado`: ele sabe o que precisa entrar pelo contexto. *Conceito:* ele acerta a capital do Acre e erra o CNPJ do cliente dele; os dois são fatos, por que um sai certo? Caça quem trata a janela de contexto como o lugar onde a memória do modelo mora.
- `tamanho-custo-latencia`: ele escolhe modelo por tarefa. *Aplicação:* classificar mil mensagens de suporte por dia em três categorias; qual tamanho de modelo, e por quê? Caça quem escolhe o maior por segurança.
- `thinking`: ele sabe quando thinking ajuda e o que ele custa.

## Fluência

Em texto, aqui na sala: você descreve uma feature de um negócio que ele conhece — um assistente que responde a dúvida de cliente sobre o próprio pedido — e ele diz o que o modelo já traz sozinho, o que alguém tem que pôr na conversa e de onde isso vem, e que tamanho de modelo usaria. Passa se ele separar pesos de contexto sem jargão emprestado e se a solução puser o fato na conversa em vez de "treinar de novo". Registre com `fluencia 3.1 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.2, Produto que usa IA. Gancho: hoje foi o modelo por dentro; na próxima, o que muda quando ele vira parte de um produto que outra pessoa paga para usar.
