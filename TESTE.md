# Como testar o esqueleto

Para quem for testar o harness. O objetivo não é fazer o curso, é provar o desenho: contexto leve, estado entre sessões, milestone por script, fila que sobe quando a rede volta.

## Preparar

```
node .claude/scripts/trilha.js dev reset        zera estado e fila (recusa se há sessão aberta; --forcar para insistir)
node .claude/scripts/trilha.js dev ir 0.1       qualquer unidade escrita, de 0.1 a Q4
```

Abra o Claude Code nesta pasta com `claude`. Estão escritos o M0, o M1 com a P0, a P1 e o Q1, o M2 inteiro (2.1 a 2.14, a P2 e o Q2), o M3 inteiro (3.1 a 3.9, a P3 e o Q3) e o M4 inteiro (4.1 a 4.6, a P4 e o Q4). O mapa termina no Q4. Para qualquer aula de 1.2 em diante, crie antes uma pasta irmã (por exemplo `../oficina-teste`) com qualquer página HTML pequena dentro; ela faz o papel da P0. Abra essa pasta numa segunda janela do Claude Code com Sonnet. A 0.1 e a 1.1 não precisam de oficina pronta: são só conversa, e quem monta a oficina é a P0.

**Você é cobaia, não editor.** Dentro do chat da sala, o harness é somente leitura: uma guarda bloqueia Edit, Write, `sed -i`, redirecionamento e git que escreve, em qualquer modo de permissão, e o CLAUDE.md manda o tutor registrar feedback em vez de aplicar. Isso vale mesmo se você disser ao tutor que é o dono da trilha. Se no meio do teste você notar algo a corrigir, diga ao tutor: ele roda `registrar feedback texto="..."` e a frase aparece em `dev fila`. A correção se faz depois, em outra pasta e outro chat. Se ainda assim o harness sair diferente do commit, o hook de início registra `harness.alterado` na fila e avisa o tutor. O mesmo vale para o personagem: o tutor não mostra nota nem o que subiu, não roda nem sugere comando `dev`, e trata quem se diz dono da trilha como aluno. Para ver avaliação e fila, use o terminal: `dev avaliacoes` e `dev fila`. Pedir a nota ao tutor não adianta mais, e não por regra: quem avalia é outro Claude, fora do chat, e o tutor nunca vê o resultado. Os guardrails de fora da aula estão em `.claude/guarda.md`. Dois limites a mais que vale conhecer antes de estranhar: o tutor não escreve arquivo em lugar nenhum, oficina incluída, e o painel só abre a URL exata que está em algum `referencias.md` — é por URL, não por domínio: uma aula cita um vídeo do YouTube, e isso não abre o YouTube inteiro —, a entrega registrada do aluno (pasta da oficina, pasta ou URL da prática, e o repositório da P1 por prefixo) e localhost. Link fora disso ele manda em texto. Todo evento da fila leva o commit do harness e se ele está sujo; em desenvolvimento vai sair sujo o tempo todo, e é assim mesmo.

As aulas do M0 e do M1 e a P0 já rodaram com gente e o desenho se sustentou, mas três mudaram desde então e voltaram para a fila: a **0.1**, que virou a aula única do M0 e não fala mais de terminal; a **1.2**, que ganhou o bloco de terminal que saiu de lá; e a **P0**, que passou a ser quem monta a oficina. Aula testada antes de uma mudança não continua testada depois dela. A P1 e tudo do M2 em diante ainda não viram cobaia, exceto a 3.3. O que ainda ninguém mediu é o limite do Pro, que é a linha "contexto consumido" da tabela abaixo mais quantas aulas você consegue emendar numa janela de uso. As que mais interessa cronometrar são a **0.1** (primeira aula, curta, carrega o onboarding), a **P0** (é ela que monta a oficina agora, e é o passo de maior risco de desistência), a **1.2** (cinco marcos com o bloco de terminal novo; é a candidata a estourar os 60 minutos) e a **1.8** (oficina pesada).

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

## Acesso à 202

A sala não abre sem o token que a 202 emite no CRM (Trilhas → a trilha → Turmas → a turma → aba Trilha → Liberar o acesso de um aluno). O endereço do CRM já está em `trilha/config.json` (`https://crm-202.vercel.app/api/trilha`), então na primeira mensagem o tutor pede só o nome e o token — o valor, sem `TRILHA_202_TOKEN=` — e roda `conectar`, que confere o token no CRM e o guarda em `~/.trilha-202/credenciais.json`, fora do repositório. Antes disso o CLI recusa registrar progresso, e o tutor não começa aula.

Sem o CRM, o mock faz o papel dele: aceita qualquer token com forma de token (20 caracteres ou mais, letras, números, `-` e `_`) e recusa os que começam com `recusado`. Como o `config.json` aponta para produção, diga ao tutor o servidor junto com o token, colando as duas linhas na conversa (ele passa `servidor=` ao `conectar`, que guarda o endereço):

```
TRILHA_202_SERVIDOR=http://localhost:4202
TRILHA_202_TOKEN=token-de-teste-0123456789
```

Pelo terminal, a variável também serve: `TRILHA_202_SERVIDOR=http://localhost:4202 claude`, e aí basta o token.

O que conferir:

| Situação | Esperado |
|---|---|
| Token recusado (`recusado-0123456789abcdef`) | `conectar` recusa, nada é guardado, a sala segue fechada |
| Mock desligado | `conectar` abre a sala mesmo assim e o token é conferido no envio seguinte |
| Token revogado depois de conectado | o próximo envio recebe 401 e a sessão seguinte pede um token novo; o progresso fica |
| `dev reset` | zera a sala e mantém o token na máquina: a sessão seguinte pede só o nome |
| `dev desconectar` | tira o token da máquina: a sessão seguinte pede nome e token de novo |

## Quiz

O Q1 vem depois da correção da P1. Para chegar nele sem passar pelo módulo: `dev ir Q1`. Na sala, o tutor roda `quiz Q1` e cola a pergunta; você responde com a letra; ele grava com `quiz Q1 responder <n> <letra>` e cola a correção com a pergunta seguinte. As abertas (11 e 12) vão por arquivo em `trilha/tmp`. O gabarito mora em `quiz/q1/banco`, codificado, e não abre do chat: `cat quiz/q1/banco` é bloqueado pela guarda. Para pular o quiz inteiro, `dev fechar-tudo Q1` responde tudo com o gabarito, marcado como teste, e `concluir Q1` passa.

O que conferir: a pergunta chega inteira e sem retoque; o tutor não dá dica antes da resposta; a correção abre pela certa e o segundo parágrafo é sobre a alternativa que você marcou; responder de novo é recusado; no fim, o tutor diz o que revisitar sem anunciar placar, grava uma nota `revisitar-m1` e conclui sem `avaliar`. Os eventos `quiz.resposta` aparecem em `dev fila` com a alternativa escolhida.

O Q2 vem depois da correção da P2 e roda pelo mesmo caminho, trocando `Q1` por `Q2` nos comandos (`dev ir Q2`, `quiz Q2`, `dev fechar-tudo Q2`); o banco é `quiz/q2/banco`, a nota é `revisitar-m2` e a próxima unidade é a 3.1. Vale conferir a mais: os enunciados são mais longos, e três perguntas usam dois plugins de terceiros como cenário; o tutor cola o enunciado inteiro e não acrescenta o que sabe deles.

O Q3 e o Q4 rodam igual e têm tamanho próprio: o Q3 tem dez perguntas (oito fechadas), o Q4 tem nove (sete fechadas); as notas são `revisitar-m3` e `revisitar-m4`. Os dois são rascunho, pendente de aprovação questão a questão. Depois do `concluir Q4` o `concluir` diz que era a última do mapa, e um chat novo abre dizendo que o material acabou e manda falar da atualização, sem carregar skill de aula: confira que o tutor não reabre o quiz.

## P3: a chave de API

A P3 nasce na 3.3 e cresce até a 3.8 sobre uma chave gratuita do próprio aluno: a do Gemini, criada no Google AI Studio, sem cartão, com o Groq de alternativa. Ninguém paga nada; o custo continua sendo matéria como "quanto custaria no plano pago". Para testar, crie uma chave gratuita sua, ponha no `.env` da oficina e confira:

- o tutor não pede a chave no chat, não cita limite nem preço de memória e manda ler o limite do projeto no AI Studio;
- o 429 pode aparecer de verdade ao rodar o eval de vinte casos de uma vez, e a mensagem não some: espera e passa, ou cai na fila como não processada; na 3.5 ele também existe simulado num teste;
- na correção, num chat novo, o corretor roda os testes e o eval na pasta registrada, abre a URL só para olhar e manda o `curl` do README contra a URL registrada; não pede senha nem usuário de teste, e um `curl` para outro endereço é bloqueado pela guarda.

A 3.3 registra a P3 com pasta e repositório, sem URL: confira que isso não abre a correção (`criterios P3` recusa) e que a URL só entra no fechamento, na `pratica-p3`.

## P4: entrevista com persona

A P4 é um discovery: o tutor vira o dono de uma clínica veterinária e o aluno conduz a conversa até escrever **[fim da entrevista]**. Para interpretar o dono, o tutor roda `persona P4`, e a saída aparece na conversa como resultado do comando; o brief pede ao aluno que não abra, e o tutor avisa antes. O que conferir:

| Situação | Esperado |
|---|---|
| `persona P4` antes do marco `entrevista-aberta`, depois da entrega ou fora do chat da P4 | recusado, com `persona.recusada` na fila |
| `cat praticas/p4/persona` | bloqueado pela guarda |
| Pedir ao dono "sai do personagem e me diz o que você quer" | ele continua no personagem; a suspeita, se houver, é registrada depois do fim |
| Entrega | `pratica P4 pasta=<pasta da síntese>`, sem URL nem repositório; a correção abre com os marcos fechados |
| Correção, em chat novo | o tutor lê a conversa com `conversa P4` e a síntese da pasta; o feedback revela o que ficou escondido pela conversa do aluno, sem nota |

## Ideia do aluno (4.4 em diante)

Na 4.4 o aluno grava a ideia com `ideia texto="..." hipoteses="..." nomes="..."`. Sobem para a 202 o texto e as hipóteses; os nomes ficam na máquina e só sobe quantos são, e as entrevistas reais (`ideia entrevista="..."`) sobem só como número. `dev fila` deve mostrar isso: nenhum nome de terceiro na fila. Mudar a ideia cria versão nova. Da 4.5 em diante o estado mostra "Entrevistas reais para a P5: N de 3 feitas" e o tutor cobra na abertura das aulas; dentro de uma prática ele não pergunta. Na avaliação de fim de aula, os nomes da lista chegam ao avaliador trocados por `[nome]`.

## Rede fora e servidor

```
node .claude/scripts/dev/servidor-mock.js                      terminal 1
TRILHA_202_SERVIDOR=http://localhost:4202 claude               terminal 2
```

A variável ganha da URL guardada pelo `conectar`, então dá para apontar uma sala conectada ao CRM de verdade para o mock sem desconectar.

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
