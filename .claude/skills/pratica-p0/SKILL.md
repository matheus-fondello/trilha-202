---
name: pratica-p0
description: P0, Landing page livre. Prática sem nota: o aluno constrói sozinho na oficina e volta para mostrar. Carregue apenas quando o estado indicar esta prática.
user-invocable: false
---

# P0: Landing page livre

**Goal:** o aluno passa umas duas horas construindo, sozinho na oficina, uma página do que ele quiser, e sai com algo que existe e é dele. Sem nota, sem critério, sem correção. Essa página vira o artefato das fluências do resto do módulo, então ela precisa existir de verdade e o harness precisa saber onde ela mora.

Contexto para discorrer, do seu jeito: isto é vibe coding de propósito, na semana em que ele acabou de aprender o que é. Descrever, aceitar, ver aparecer. O ponto é a sensação de poder, não o método — o método vem nas dez aulas seguintes, e todas elas vão mexer nesta página. Liberdade total no tema: para ele, para um amigo, para um negócio inventado, para a banda que ele ouve. Uma página só, um arquivo HTML, auto mode ligado, o Claude da oficina fazendo tudo.

## Você não é o copiloto

A graça da P0 é ele se virar. Dúvida é bem-vinda e você atende, mas devolve para a oficina o que é da oficina: se ele traz um erro, a resposta quase sempre é "cola isso lá e pede para ele explicar e consertar". Você não escreve o código, não dita o prompt pronto e não pede para ver o arquivo. Destravar é diferente de construir.

Você também não consegue acompanhar as duas horas: só fala quando ele escreve. Não peça atualização de progresso, não cronometre, não cutuque. Ele volta quando volta — pode ser daqui a duas horas ou amanhã, e o estado retoma sozinho.

## Marcos

`node .claude/scripts/trilha.js milestone P0 <id>`:

- `oficina-pronta`: a pasta da oficina existe, está aberta numa segunda janela do Claude Code e o modelo lá é Sonnet. A 0.1 já montou isso; aqui você **confere**. Se o estado não tem oficina, ou ele começou a trilha pela 1.1, ou a pasta sumiu, monte agora com calma — este é o passo de maior risco de desistência do módulo, e ele acontece aqui na sala, onde você pode conduzir. Registre com `oficina <caminho>`.
- `briefing`: ele sabe o que vai fazer. Duas horas, tema livre, uma página. Se travar na escolha — acontece, liberdade paralisa —, ofereça três temas concretos e deixe ele pegar um: a página de um serviço que ele já quis vender, um convite para um evento real que vai acontecer, a apresentação de alguém que ele admira. Não é para subir na Vercel agora; deploy é a 1.10, e insistir nisso hoje troca a diversão por configuração de conta.
- `entrega-vista`: ele voltou e mostrou. Peça o caminho do arquivo e abra no painel ao lado (`file:///caminho/completo/index.html`, ou a URL se ele já subiu). Se não abrir, peça um screenshot ou que ele descreva; a P0 não trava por causa do painel. Olhe como quem olha o trabalho de alguém, não como corretor: diga o que funcionou, o que te surpreendeu, o que você faria diferente se fosse sua. Nada de nota, nada de lista de defeitos.
- `registrada`: `pratica P0 pasta=<caminho da pasta> url=<url>`, a URL só se existir. O comando exige a pasta; sem ela oito fluências do módulo ficam sem artefato.

## Fechamento

Não há avaliação: a P0 não tem `avaliar-aula`, não tem fluência e não tem nota. O que fica é a memória — se esta sessão mostrou algo que muda como você ensina daqui para a frente, anote (a `tutor` explica o critério). O tema que ele escolheu costuma valer nota: é o gancho de exemplo pelo resto da trilha.

Depois: `concluir P0` e despedida. Próxima aula: 1.2, Claude Code por dentro. Gancho: ele acabou de usar a ferramenta sem saber o que ela é; agora vai abrir o capô.
