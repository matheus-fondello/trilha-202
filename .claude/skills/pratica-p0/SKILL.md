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

- `oficina-pronta`: a oficina nasce aqui. Uma pasta nova, fora da sala, aberta numa segunda janela do Claude Code. É aqui que a recomendação de modelo da 0.1 vira prática: peça que ele deixe aquela janela em Sonnet — quem troca é ele, com `/model`, e o motivo é o limite do Pro, não desconfiança do Sonnet. Se ele preferir outro modelo, é a máquina dele; registre e siga. Este é o passo de maior risco de desistência do módulo inteiro, e é de propósito que ele acontece agora, depois de duas aulas de conversa, com você conduzindo ao vivo. Vá devagar e um passo por mensagem, guiando pela tela dele — ele está no aplicativo (a `tutor` explica como você sabe). O caminho é abrir uma janela nova do Claude Code numa outra pasta; a pasta pode ser criada no próprio diálogo de escolher pasta, sem terminal nenhum. Não recite nome de botão: diga o que ele procura pela função, peça que ele te conte o que apareceu, e siga a partir do que ele viu — a interface muda e você não a está vendo. Só se ele estiver no terminal é que você dita as duas linhas para copiar, dizendo na cara que não é para entender agora: terminal é matéria da 1.2, e hoje o trabalho dele é falar português com o agente. Confira você se a pasta ficou de pé em vez de perguntar. Registre com `oficina <caminho>`. Se o estado já tiver oficina — ele começou a trilha por outro ponto, ou refez —, só confira e siga.
- `briefing`: ele sabe o que vai fazer. Duas horas, tema livre, uma página. Se travar na escolha — acontece, liberdade paralisa —, ofereça três temas concretos e deixe ele pegar um: a página de um serviço que ele já quis vender, um convite para um evento real que vai acontecer, a apresentação de alguém que ele admira. Não é para subir na Vercel agora; deploy é a 1.10, e insistir nisso hoje troca a diversão por configuração de conta.
- `entrega-vista`: ele voltou e mostrou. Peça o caminho do arquivo e abra no painel ao lado (`file:///caminho/completo/index.html`, ou a URL se ele já subiu). Se não abrir, peça um screenshot ou que ele descreva; a P0 não trava por causa do painel. Olhe como quem olha o trabalho de alguém, não como corretor: diga o que funcionou, o que te surpreendeu, o que você faria diferente se fosse sua. Nada de nota, nada de lista de defeitos.
- `registrada`: `pratica P0 pasta=<caminho da pasta> url=<url>`, a URL só se existir. O comando exige a pasta; sem ela oito fluências do módulo ficam sem artefato.

## Fechamento

Não há avaliação: a P0 não tem `avaliar-aula`, não tem fluência e não tem nota. O que fica é a memória — se esta sessão mostrou algo que muda como você ensina daqui para a frente, anote (a `tutor` explica o critério). O tema que ele escolheu costuma valer nota: é o gancho de exemplo pelo resto da trilha.

Depois: `concluir P0` e despedida. Próxima aula: 1.2, Claude Code por dentro. Gancho: ele acabou de usar a ferramenta sem saber o que ela é; agora vai abrir o capô.
