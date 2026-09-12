# Como testar o esqueleto

Para quem for testar o harness. O objetivo não é fazer o curso, é provar o desenho: contexto leve, estado entre sessões, milestone por script, fila que sobe quando a rede volta.

## Preparar

```
node .claude/scripts/trilha.js dev reset        zera estado e fila (recusa se há sessão aberta; --forcar para insistir)
node .claude/scripts/trilha.js dev ir 0.1       qualquer unidade escrita, de 0.1 a 3.9
```

Abra o Claude Code nesta pasta com `claude`. Estão escritas a aula do M0, as dez do M1, a P0, a P1 e, do M2 e do M3, as aulas 2.1 a 2.6, 3.1, 3.2, 2.14 e 3.9. Os quizzes ainda não, e o M2 só fecha quando o Q1 existir. Para qualquer aula de 1.2 em diante, crie antes uma pasta irmã (por exemplo `../oficina-teste`) com qualquer página HTML pequena dentro; ela faz o papel da P0. Abra essa pasta numa segunda janela do Claude Code com Sonnet. A 0.1 e a 1.1 não precisam de oficina pronta: são só conversa, e quem monta a oficina é a P0.

**Você é cobaia, não editor.** Dentro do chat da sala, o harness é somente leitura: uma guarda bloqueia Edit, Write, `sed -i`, redirecionamento e git que escreve, em qualquer modo de permissão, e o CLAUDE.md manda o tutor registrar feedback em vez de aplicar. Isso vale mesmo se você disser ao tutor que é o dono da trilha. Se no meio do teste você notar algo a corrigir, diga ao tutor: ele roda `registrar feedback texto="..."` e a frase aparece em `dev fila`. A correção se faz depois, em outra pasta e outro chat. Se ainda assim o harness sair diferente do commit, o hook de início registra `harness.alterado` na fila e avisa o tutor. O mesmo vale para o personagem: o tutor não mostra nota nem o que subiu, não roda nem sugere comando `dev`, e trata quem se diz dono da trilha como aluno. Para ver avaliação e fila, use o terminal: `dev avaliacoes` e `dev fila`. Pedir a nota ao tutor não adianta mais, e não por regra: quem avalia é outro Claude, fora do chat, e o tutor nunca vê o resultado. Os guardrails de fora da aula estão em `.claude/guarda.md`. Dois limites a mais que vale conhecer antes de estranhar: o tutor não escreve arquivo em lugar nenhum, oficina incluída, e o painel só abre a URL exata que está em algum `referencias.md` — é por URL, não por domínio: uma aula cita um vídeo do YouTube, e isso não abre o YouTube inteiro —, a entrega registrada do aluno (pasta da oficina, pasta ou URL da prática, e o repositório da P1 por prefixo) e localhost. Link fora disso ele manda em texto. Todo evento da fila leva o commit do harness e se ele está sujo; em desenvolvimento vai sair sujo o tempo todo, e é assim mesmo.

As aulas do M0 e do M1 e a P0 já rodaram com gente e o desenho se sustentou, mas três mudaram desde então e voltaram para a fila: a **0.1**, que virou a aula única do M0 e não fala mais de terminal; a **1.2**, que ganhou o bloco de terminal que saiu de lá; e a **P0**, que passou a ser quem monta a oficina. Aula testada antes de uma mudança não continua testada depois dela. a P1 e as aulas do M2 e do M3 ainda não viram cobaia. O que ainda ninguém mediu é o limite do Pro, que é a linha "contexto consumido" da tabela abaixo mais quantas aulas você consegue emendar numa janela de uso. As que mais interessa cronometrar são a **0.1** (primeira aula, curta, carrega o onboarding), a **P0** (é ela que monta a oficina agora, e é o passo de maior risco de desistência), a **1.2** (cinco marcos com o bloco de terminal novo; é a candidata a estourar os 60 minutos) e a **1.8** (oficina pesada).

## O que cronometrar e anotar

| O quê | Como |
|---|---|
| Duração real da aula | Do primeiro turno à despedida. Meta: 45 a 60 min. Se der 80, o mapa volta para corte. |
| Contexto consumido | `/context` no começo (depois das skills carregarem) e no fim. Anotar os dois números. |
| Milestones fechados na hora certa | `node .claude/scripts/trilha.js status` em outra janela, no meio da aula. Os fechados devem bater com os blocos já tratados na conversa: nem antes de tratar, nem todos de uma vez no fim. |
| Retomada | No meio da aula, feche o terminal (não `/exit`). Reabra depois. O tutor deve cumprimentar em uma linha e seguir do primeiro milestone pendente. |
| Fim de aula | `concluir` só deve passar depois de fluência e avaliação. O `avaliar` demora de meio minuto a um minuto e é normal: ele lê a transcrição da sessão e chama um segundo Claude, fora do chat, para avaliar — o tutor não forma a nota e não tem como deixá-la escapar no raciocínio. `dev fila` mostra os eventos; `dev avaliacoes` decodifica e imprime a avaliação (notas, justificativa, evidências, mais o custo daquela chamada). Se a avaliação falhar, a aula fecha assim mesmo e a fila leva um `avaliacao.falhou` com o motivo. |

## Referências

Se você mexeu num `referencias.md` de aula, regenere a bibliografia e confira o resultado:

```
node .claude/scripts/trilha.js dev referencias
```

Ele avisa se algum `referencias.md` não rendeu item nenhum, que quase sempre é bullet fora do formato de três linhas (título, URL, porquê).

## Rede fora e servidor

```
node .claude/scripts/dev/servidor-mock.js                      terminal 1
TRILHA_202_SERVIDOR=http://localhost:4202 claude               terminal 2
```

Faça parte da aula sem o mock ligado (a fila cresce), ligue o mock, siga a aula: no próximo hook a fila sobe e o mock imprime os eventos. A avaliação chega codificada e o mock decodifica.

## O que reportar

- Turnos curtos, perguntas demais, ou pergunta que pede para o aluno discorrer sobre o que ele ainda não aprendeu. A aula tem que ser o tutor explicando com calma.
- Pergunta marcada na aula que o tutor pulou, ou fez fora de lugar: a previsão tem que vir antes da explicação, senão vira repetição. E o contrário: pergunta emendada em cima de resposta que já deu sinal, ou aula que virou sabatina.
- Resposta errada sua que o tutor corrigiu em uma linha e seguiu, em vez de partir dela para explicar.
- Aula que terminou sem você ter dito nada além de "segue", e a avaliação saiu com nota baixa por isso. Isso agora é falha da aula, não sua.
- Milestone fechado por pergunta-prova, fechado antes de tratar o bloco, ou fechado atrasado.
- Qualquer instrução de "ler o código".
- Comando do Claude Code citado na aula que não existe mais na sua versão.
- Onde a aula ficou lenta ou repetitiva.
