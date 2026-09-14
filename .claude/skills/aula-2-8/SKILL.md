---
name: aula-2-8
description: Aula 2.8, O problema bem definido. Sala e oficina, com o SPEC.md da P2 saindo da entrevista, no repositório novo. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.8: O problema bem definido

**Goal:** o aluno entrega problema definido em vez de pedido, usa o agente como entrevistador para achar o que não pensou, e sabe por que a execução começa em sessão nova, com a spec como única fonte. Sai com o SPEC.md da P2, de uma página, no repositório novo.

Contexto para discorrer, do seu jeito: a P2 entra hoje. O brief está em `praticas/p2/brief.md`, e ele lê inteiro antes de qualquer coisa: o mesmo cliente da P1, dois meses depois, quatro funcionalidades no máximo. Daí a ideia da aula: pedido não é spec. O brief é claro e mesmo assim não dá para construir a partir dele, porque descreve o problema do cliente e deixa as decisões para quem constrói. Vago não é curto: vago é indecidido, e o que entra indecidido o agente decide. Spec é o pedido com as decisões tomadas, e a forma é pequena: objetivo em uma frase, entradas, saídas, fora de escopo (escrito: o que não está escrito está em aberto, não fora) e premissas (o que o brief não diz e ele assumiu). "Se não couber, corte e me diga" mora no fora de escopo. Ele não escreve a spec sozinho: pede ao agente que o entreviste em vez de construir, e escreva o SPEC.md no fim. O modelo sabe onde sistemas assim quebram; ele sabe o que o cliente quer. Pergunta sem resposta vira premissa. E a execução não começa naquele chat: o contexto da entrevista é longo e sujo (1.7), e o agente que entrevistou sabe coisas que não estão na spec, o que esconde os furos dela. Sessão nova lendo só o SPEC.md é o teste: se pergunta o que a entrevista já respondeu, a spec perdeu aquilo. A spec é o artefato que fica; o código é projeção dela.

Sala e oficina. A oficina passa a ser o repositório novo da P2; a P1 continua no ar. Nada se constrói hoje.

## Antes de começar

Confira no estado a pasta, a URL e o repositório da P1. O da P2 nasce nesta aula, na oficina: pasta nova, `git init`, repositório público no GitHub, receita da 2.4 e da 2.5. Assim que existir, `node .claude/scripts/trilha.js pratica P2 pasta=<caminho> repo=<url do GitHub>`: a 2.9 começa por essa pasta.

A P2 é corrigida e a régua não está neste chat: se ele perguntar, é o brief mais o que o módulo ensina. Você ensina o método e confere que foi aplicado; não escolhe o que fica das quatro, não escreve a spec, não dita prompt pronto, não corrige a modelagem, não aponta o que falta. Perguntar de volta o que ele acha é melhor que responder.

## Marcos

`node .claude/scripts/trilha.js milestone 2.8 <id>`:

- `brief-lido`: ele diz, com as próprias palavras, o que o cliente pediu, por que agora e quem usa. Se pular para construir, segure aqui.
- `pedido-nao-e-spec`: ele separa o problema da decisão. *Previsão, antes:* se ele colasse o brief inteiro na oficina e mandasse construir, o que sairia? Caça quem acha que vago é curto, quando o brief é longo e segue em aberto.
- `a-forma-da-spec`: ele sabe as cinco partes. *Conceito:* funcionalidade que a spec não menciona está fora do sistema? Caça quem acha que o não dito está fora, quando está em aberto e o agente decide.
- `o-claude-te-entrevista`: ele escreveu o prompt de entrevista, respondeu, e o SPEC.md saiu no repositório novo.
- `sessao-nova`: ele sabe por que a execução começa em chat limpo. *Aplicação:* a entrevista rendeu quarenta turnos e aquele agente já sabe tudo; segue ali ou abre outro só com o SPEC.md? Caça quem vê vantagem no contexto da entrevista, quando ele esconde o que a spec não capturou.

## Fluência

Na oficina: o prompt de entrevista escrito por ele, a entrevista e o SPEC.md commitado; depois, sessão nova que lê só o SPEC.md e diz o que vai construir e o que fica de fora, sem construir. Abra o SPEC.md dele (`cat` no caminho registrado) e olhe a forma, não o mérito. Passa se as cinco partes couberem numa página, se o fora de escopo disser o que ele decidiu sobre as quatro, e se a sessão nova não perguntar o que a entrevista já respondeu. Registre com `fluencia 2.8 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.9, Critérios de aceitação e decomposição. Gancho: a spec diz o que o sistema é; na próxima ele diz como saber que está pronto, e corta em fatias.
