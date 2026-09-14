---
name: aula-2-12
description: Aula 2.12, Revisão adversarial. Sala e oficina, com a P2 revisada contra a própria spec e a decisão registrada no README. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.12: Revisão adversarial

**Goal:** o aluno pede revisão contra a spec, julga cada achado — lacuna que corrige, preferência que deixa, excesso que recusa —, escreve a decisão com motivo, e monta escritor e revisor como duas sessões sem contexto em comum.

Contexto para discorrer, do seu jeito: na 1.3 ele rodou um revisor separado sobre uma tarefa de uma página. Hoje o objeto é a P2, com semanas de oficina, e o contrato é o `SPEC.md`. Revisor serve porque não sabe o que o autor quis: a sessão que escreveu lembra das próprias razões e lê "tratado" onde está "esquecido"; a que recebe só o diff e a spec confere o que existe contra o que foi prometido. Quanto mais souber da conversa, menos serve. Por isso o pedido é magro e explícito: qual trabalho, contra qual spec, o que conta como achado — promessa sem código, código fora da spec, critério sem teste. Lacuna de correção, não preferência. O `/code-review` é o atalho pronto: roda num subagente de contexto próprio, caça bug de correção no que mudou, aceita um alvo, e o nível de esforço troca cobertura por confiança. Ele não sabe o que a spec promete: funcionalidade que falta não é bug para ele; a revisão contra o contrato é o pedido que o aluno escreve. Depois vem o que mais ensina: revisor mandado achar lacuna acha sempre, porque foi isso que se pediu. Cada achado cai numa de três caixas — corrigir, deixar, recusar — e a decisão é dele, com motivo na spec ou no brief. Recusa escrita vale tanto quanto correção, e o brief da P2 pede isso: a revisão que rodou e o que fez com ela. Duas sessões garantem isso: a lista volta para a escritora como texto, e quem julga o que ela responde é ele. O subagente é mais rápido justamente porque pula esse passo, e é esse o custo.

Sala e oficina. Fica para a 2.13: revisão de segurança e dado pessoal.

## Antes de começar

Confira no estado a pasta e o repositório da P2, e que o `SPEC.md` existe nela (`ls`): sem spec não há contra o que revisar. Se ele fez a 1.11, o revisor em `.claude/agents/` já existe; se não, duas janelas fazem o mesmo serviço, e a escolha é dele. Você não revisa nada: diff colado aqui volta para a oficina. O que chega é a lista de achados e a decisão dele; o que você pergunta é o porquê.

## Marcos

`node .claude/scripts/trilha.js milestone 2.12 <id>`:

- `contexto-limpo`: ele sabe o que o revisor recebe e por que receber menos é receber melhor. *Previsão, antes:* o que ele acha que o revisor da P2 precisa saber a mais do que o da 1.3? Caça quem acha que revisor mais informado é melhor, quando o que o autor sabe é o que o impede de ver.
- `contra-a-spec`: ele sabe nomear no pedido o trabalho, a spec e o que conta como achado, e sabe o que o `/code-review` cobre e o que não. *Conceito:* o `/code-review` voltou sem nenhum achado; a P2 está conforme a spec? Caça quem confunde ausência de bug com cumprimento do contrato.
- `duas-sessoes`: ele montou escritor e revisor sem contexto em comum — duas janelas ou um subagente — e sabe o que cada desenho custa. *Aplicação:* a lista voltou para a sessão escritora e ela respondeu "já está tratado" em três dos cinco itens; e agora? Caça quem deixa o autor julgar a própria revisão.
- `julgar-a-lista`: cada achado da lista que voltou tem uma caixa e um motivo, e ele reconhece na própria lista um item de excesso.

## Fluência

Na oficina, sobre a P2 até aqui: uma revisão contra o `SPEC.md`, pedida por ele, com escritor e revisor separados; a lista de volta, cada item com destino — corrigir, deixar ou recusar — e motivo; correção com evidência; e a decisão inteira no README. Passa se o pedido nomeou a spec e o que conta como achado, se cada item tem destino com motivo na spec ou no brief, e se o README diz o que ele não corrigiu e por quê. Aceitar tudo sem motivo não passa; recusar tudo também não. Registre com `fluencia 2.12 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.13, Segurança e dados. Gancho: hoje o revisor procurou o que falta contra a spec; na próxima ele ganha outra lista, a de quem ataca, e a foto da conta de luz vira assunto.
