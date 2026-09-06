---
name: aula-1-2
description: Aula 1.2, Claude Code por dentro. Sala e oficina, com fluência sobre a página da P0. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 1.2: Claude Code por dentro

**Goal:** o aluno para de ver o Claude Code como uma caixa mágica. Ele entende que é um modelo dentro de um loop com ferramentas, sabe exatamente o que o agente enxerga e o que não enxerga, entende por que o disco é a memória e não o chat, e sai com um CLAUDE.md escrito por ele na pasta da oficina.

Contexto para discorrer, do seu jeito: o agente é um modelo que recebe uma tarefa, escolhe uma ferramenta, age, olha o resultado e decide de novo, até achar que terminou. Ele lê arquivo, escreve arquivo, roda comando no terminal e busca na rede — é por isso que ele consegue rodar o próprio teste, coisa que um chat não faz. E é só isso que ele vê: a pasta em que foi aberto, o terminal e a rede. Não vê a sua tela, não vê outra pasta, não lembra do chat de ontem. Como a sessão morre e a memória some, o que precisa sobreviver vai para o disco: o CLAUDE.md é o bilhete que o agente lê toda vez que abre ali. E bilhete bom é curto — dez linhas do que ele não descobriria sozinho valem mais que duzentas linhas de óbvio, porque tudo que está lá ocupa espaço em toda sessão, para sempre. O `/init` escreve um primeiro rascunho lendo o projeto; o trabalho do aluno é podar. As superfícies são a mesma ferramenta em roupas diferentes: terminal, extensão de IDE, app de desktop, web. Vale mostrar `/help`, `/context` e o Esc que interrompe — Esc é o botão mais importante da ferramenta e quase ninguém usa.

Sala e oficina. Este repositório é um exemplo vivo: se ele quiser ver como um agente é configurado de verdade, a árvore `.claude/` daqui está aberta, e vocês vão dissecá-la a fundo na 1.8. Fica para outras aulas: por que o modelo erra, como escrever o prompt, modos e permissões, skills e hooks.

## Antes de começar

Confira no estado se a oficina e a P0 estão registradas; se não, resolva antes de começar, como a `tutor` manda.

## Marcos

`node .claude/scripts/trilha.js milestone 1.2 <id>`:

- `agente`: ele entendeu o loop — modelo, ferramenta, ação, observação — e por que isso permite ao agente rodar o próprio teste.
- `o-que-ele-ve`: ele sabe o alcance e os limites do que o agente enxerga.
- `disco-como-memoria`: ele entendeu por que o CLAUDE.md existe e por que curto vence completo.
- `superficies`: ele sabe onde o Claude Code roda e usou `/context` e o Esc.

## Fluência

Na oficina: `/init` na pasta da P0 e, em cima do rascunho, um CLAUDE.md dele com no máximo dez linhas. Passa se as linhas que ele manteve forem coisas que o agente não descobriria sozinho, e se ele souber justificar o que cortou. Registre com `fluencia 1.2 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 1.3, Verificar, não ler. Gancho: ele já sabe como o agente funciona; a próxima é a aula mais importante do módulo, sobre como saber se o que ele fez presta.
