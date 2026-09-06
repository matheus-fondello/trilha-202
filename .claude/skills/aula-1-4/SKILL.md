---
name: aula-1-4
description: Aula 1.4, Onde o LLM erra. Só conversa na sala, com fluência sobre um output com erro plantado. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 1.4: Onde o LLM erra

**Goal:** o aluno sai com um modelo mental honesto da máquina. Ele sabe o mínimo de mecânica para prever o erro, reconhece alucinação, não-determinismo e sicofância pelo sintoma, e consegue dizer, diante de uma tarefa nova, se aquilo é do tipo que o modelo faz bem ou do tipo que exige verificação apertada.

Contexto para discorrer, do seu jeito: o modelo prevê o próximo pedaço de texto, um de cada vez, a partir de tudo que está na janela. Isso explica quase todo comportamento estranho. A janela é finita e enche: quando enche, custa caro e a qualidade cai. O treino parou numa data, então versão de biblioteca lançada depois disso ele não conhece — e é exatamente por isso que o Claude Code lê o disco em vez de responder de memória. Alucinação não é mentira, é o modelo completando o padrão com a coisa mais plausível quando não sabe; por isso ela aparece justamente onde a resposta certa é específica e rara: nome de função pouco usada, número, citação, versão de API. Não-determinismo é o mesmo prompt devolvendo respostas diferentes, o que quebra a intuição de quem vem de software comum, onde a mesma entrada dá a mesma saída. Sicofância é a mais perigosa das três porque é confortável: o modelo tende a concordar com quem pergunta, então "não é melhor fazer X?" quase sempre vira "sim, ótima ideia". Ensine o aluno a perguntar neutro: "quais são os problemas dessa abordagem" em vez de "essa abordagem é boa, né". No fim, o mapa prático: transformar, sintetizar, escrever código comum e explicar são pontos fortes; contar, aritmética longa, tarefa longa sem verificação e saber o que não sabe são pontos fracos. A regra que fecha a aula: confiar é uma decisão que ele toma caso a caso, verificar é um hábito que não se negocia.

Só conversa, aqui na sala. Fica para outras aulas: como escrever o prompt, higiene de contexto, e a mecânica completa do modelo, que volta a fundo no módulo de IA no produto.

## Marcos

`node .claude/scripts/trilha.js milestone 1.4 <id>`:

- `mecanica-minima`: ele sabe que o modelo prevê o próximo pedaço, que a janela é finita e que o treino tem data.
- `alucinacao`: ele sabe por que acontece e em que terreno é mais provável. *Previsão, antes:* por que ele acha que o modelo inventa uma biblioteca que não existe? Caça quem acha que é bug ou falta de dado, quando é o mecanismo funcionando como sempre.
- `nao-determinismo-e-sicofania`: ele reconhece os dois e sabe fazer a pergunta neutra. *Aplicação:* ele pergunta "esse código está bom, né?" e o agente diz que sim. O que ele faz com essa resposta? Caça quem trata concordância como confirmação.
- `faz-bem-faz-mal`: ele consegue classificar uma tarefa nova nos dois lados.

## Fluência

Você monta um output de agente com um erro plantado — uma versão de biblioteca afirmada com confiança, um número que não fecha, ou um "testei e passou" sem evidência nenhuma. Nada que exija ler código: o erro tem que estar no que o agente **afirma**, não escondido no que ele escreveu. Ele acha o erro, diz de que tipo é e desenha a verificação que teria pegado aquilo antes. Passa se ele chega no tipo certo e a verificação que ele propõe é executável, não "eu leria com atenção". Registre com `fluencia 1.4 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 1.5, O prompt como interface. Deixe uma pergunta com ele: se o modelo vai para a média sempre que o pedido é ambíguo, de quem é a culpa quando o resultado vem morno?
