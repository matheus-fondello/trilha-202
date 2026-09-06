# Como testar o esqueleto

Para quem for testar o harness. O objetivo não é fazer o curso, é provar o desenho: contexto leve, estado entre sessões, milestone por script, fila que sobe quando a rede volta.

## Preparar

```
node .claude/scripts/trilha.js dev reset        zera estado e fila (recusa se há sessão aberta; --forcar para insistir)
node .claude/scripts/trilha.js dev ir 1.1       ou 1.3
```

Abra o Claude Code nesta pasta com `claude`. Para a 1.3, crie antes uma pasta irmã (por exemplo `../oficina-teste`) com qualquer página HTML pequena dentro; ela faz o papel da P0. Abra essa pasta numa segunda janela do Claude Code com Sonnet.

## O que cronometrar e anotar

| O quê | Como |
|---|---|
| Duração real da aula | Do primeiro turno à despedida. Meta: 45 a 60 min. Se der 80, o mapa volta para corte. |
| Contexto consumido | `/context` no começo (depois das skills carregarem) e no fim. Anotar os dois números. |
| Milestones fechados na hora certa | `node .claude/scripts/trilha.js status` em outra janela, no meio da aula. Os fechados devem bater com os blocos já tratados na conversa: nem antes de tratar, nem todos de uma vez no fim. |
| Retomada | No meio da aula, feche o terminal (não `/exit`). Reabra depois. O tutor deve cumprimentar em uma linha e seguir do primeiro milestone pendente. |
| Fim de aula | `concluir` só deve passar depois de fluência e avaliação. `dev fila` mostra os eventos; `dev avaliacoes` decodifica e imprime a avaliação que o tutor registrou (notas, justificativa, evidências). |

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

- Turnos curtos, perguntas demais, ou pergunta que pede para o aluno discorrer sobre o que ele ainda não aprendeu. A aula tem que ser o tutor explicando com calma; pergunta cabe só depois de ter material sólido na mesa.
- Milestone fechado por pergunta-prova, fechado antes de tratar o bloco, ou fechado atrasado.
- Qualquer instrução de "ler o código".
- Comando do Claude Code citado na aula que não existe mais na sua versão.
- Onde a aula ficou lenta ou repetitiva.
