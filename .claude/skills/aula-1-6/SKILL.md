---
name: aula-1-6
description: Aula 1.6, Modos, permissões e modelo. Sala e oficina, com fluência em plan mode sobre a página da P0. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 1.6: Modos, permissões e modelo

**Goal:** o aluno passa a escolher com quanta rédea o agente trabalha, em vez de aceitar o padrão sem saber que existe. Ele entende o que o auto mode aprova por ele e o que ele bloqueia, sabe quando descer para aprovação manual, usa plan mode como separação entre explorar e executar, e escolhe modelo por tarefa em vez de usar o mais caro sempre.

Contexto para discorrer, do seu jeito: o auto mode é o padrão hoje, e o que ele faz é pôr um classificador no lugar do humano que clicava "sim" em tudo — ele aprova a ação comum e barra o que é perigoso de verdade: escalar escopo além do que foi pedido, mexer em infraestrutura que ele não conhece, e ação que veio de conteúdo que o agente leu em vez de vir de você, que é o ataque que interessa a quem quer usar seu agente contra você. Quando o agente esbarra na barreira três vezes seguidas, ou vinte na sessão, o auto mode pausa e o Claude Code volta a perguntar — isso é sinal, não defeito. Vale saber onde o auto mode não vale: `claude -p` e o SDK começam no modo Manual. Manual é o nome de interface do modo que na configuração se chama `default`, e é para quando ele quer ver cada passo, tipicamente em código que não é dele. O mecanismo tem que sair da aula com ele: `Shift+Tab` roda entre os modos, `/permissions` mostra e edita as regras, e uma regra de permitir tira a pergunta do comando que ele roda o dia inteiro. Para trabalho que ele não quer que toque no resto da máquina, existe sandbox — e é essa a resposta certa quando o assunto for risco, não confiar mais no classificador. Plan mode não é modo de permissão, e essa confusão é a mais comum: é separar a fase de entender da fase de mexer. Vale quando a tarefa é incerta, toca vários arquivos ou entra em código desconhecido; não vale quando o diff cabe numa frase, e aí plan mode é cerimônia que custa tempo. O plano sai num arquivo que ele lê, edita e aprova; `Ctrl+G` abre esse plano no editor. Editar o plano antes de executar é onde mora o ganho, e quase ninguém faz — em boa parte porque ninguém conta que dá para abrir. Modelo é a última alavanca, e aqui os nomes importam porque ele já ouviu os dois na 0.2 sem a régua: Opus para decidir e desenhar, Sonnet para executar o que já está desenhado, Haiku para tarefa mecânica que dá para delegar. Troca-se com `/model`. Raciocínio estendido quando o problema é difícil de verdade, não por hábito. `/context` mostra o quanto da janela já foi, e a status line deixa isso à vista o tempo todo.

Sala e oficina. Esta é a aula que mais envelhece: nomes de modo, limiares e padrão por plano mudam de versão para versão. Confira na sua antes de afirmar número, e diga ao aluno que o que vale é o que a máquina dele mostra.

## Antes de começar

Confira no estado se a oficina e a P0 estão registradas; se não, resolva antes de começar, como a `tutor` manda.

## Marcos

`node .claude/scripts/trilha.js milestone 1.6 <id>`:

- `auto-mode`: ele sabe o que o classificador aprova por ele e o que ele barra. *Previsão, antes:* ele usa auto mode desde a primeira aula; o que ele acha que está sendo aprovado por ele e o que está sendo barrado? Caça quem acha que aprova tudo, ou que barra por "perigo" genérico.
- `manual-e-allowlist`: ele sabe quando descer para aprovação manual e como.
- `plan-mode`: ele entendeu que plano não é permissão, e sabe quando pular. *Conceito:* plano aprovado, e no meio da execução o agente encontra algo que o plano não previu. O que acontece? Caça quem acha que plano é contrato.
- `modelo-e-custo`: ele escolhe modelo por tarefa e sabe medir o contexto.

## Fluência

Na oficina, em Sonnet: uma mudança que toca mais de um arquivo da página da P0, feita em plan mode, com o plano editado por ele antes de aprovar. Passa se ele mudou alguma coisa no plano e sabe dizer por quê. Registre com `fluencia 1.6 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 1.7, Higiene de contexto. Gancho: ele vem gastando um recurso desde a primeira aula sem nunca ter olhado o medidor.
