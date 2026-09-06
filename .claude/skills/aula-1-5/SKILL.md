---
name: aula-1-5
description: Aula 1.5, O prompt como interface. Sala e oficina, com fluência sobre a página da P0. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 1.5: O prompt como interface

**Goal:** o aluno para de "conversar com uma IA" e passa a projetar a entrada de um sistema capaz. Ele escreve instrução sem ambiguidade, escolhe o contexto certo em vez do máximo de contexto, usa exemplo quando descrever não basta, e trata prompt como hipótese que se diagnostica, não como sorte que se repete.

Contexto para discorrer, do seu jeito: o giro é de responsabilidade — se a saída veio ruim, a pergunta não é se o modelo é burro, é o que faltou na entrada. Instrução clara tem verbo, objeto, formato e público; onde há ambiguidade o modelo vai para a média, que é o resultado mais genérico possível, e é daí que vem quase todo texto sem graça que ele já recebeu. Restrição negativa ajuda quando ele já sabe o que não quer, e quase sempre ele só descobre isso depois da primeira tentativa. Contexto é o segundo eixo: o certo, não o muito, porque encher a janela de arquivo irrelevante piora a resposta em vez de melhorar; `@arquivo`, imagem e URL colocam a coisa certa na mesa. E há dois lugares de onde a instrução vem: a que emoldura a sessão inteira e a que ele digita agora — o CLAUDE.md é a moldura que fica no disco em vez de ser recolada toda vez, e entra como mensagem de usuário logo depois do prompt de sistema, não como o prompt de sistema. Exemplo vence descrição quando a forma importa, e isso tem nome: few-shot, mostrar dois ou três casos em vez de descrever o que você quer. Dois exemplos bem escolhidos ensinam mais que um parágrafo de adjetivos — e o exemplo errado contamina, porque o modelo copia o padrão inclusive o defeito. Peça formato explícito quando a saída vai ser usada por outra coisa, e peça os passos quando o raciocínio precisa ser auditável, não por hábito. Os antipadrões valem nome: o prompt-oração ("por favor, capriche"), tudo numa mensagem só, e a iteração cega, que muda três coisas de uma vez e não aprende nada porque não dá para saber qual delas funcionou.

Sala e oficina. A tarefa acontece na oficina, sobre a página da P0, e ele traz os dois resultados para cá. Fica para outras aulas: contexto como recurso a ser administrado ao longo da sessão, e prompt de sistema dentro de um produto, no módulo de IA no produto.

## Antes de começar

Confira no estado se a oficina e a P0 estão registradas; se não, resolva antes de começar, como a `tutor` manda.

## Marcos

`node .claude/scripts/trilha.js milestone 1.5 <id>`:

- `instrucao-clara`: ele escreve pedido com verbo, objeto, formato e público, e enxerga a ambiguidade que sobrou.
- `contexto-e-moldura`: ele escolhe o contexto certo e sabe por que mais nem sempre é melhor.
- `exemplos-e-forma`: ele usou exemplo ou formato explícito onde descrever não bastava.
- `iteracao`: ele diagnostica o que falhou em vez de repetir o pedido com outras palavras.

## Fluência

Você dá um prompt propositalmente ruim para uma mudança na página da P0 — vago, sem formato, sem critério. Ele roda na oficina como está, reescreve justificando cada mudança, roda de novo e traz os dois resultados. Passa se as justificativas apontarem para o que faltava na entrada, e não para o modelo. Registre com `fluencia 1.5 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 1.6, Modos, permissões e modelo. Gancho: saber pedir é metade. A outra metade é decidir quanto o agente faz sem perguntar.
