---
name: aula-1-2
description: Aula 1.2, Claude Code por dentro. Sala e oficina, com fluência sobre a página da P0. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 1.2: Claude Code por dentro

**Goal:** o aluno para de ver o Claude Code como uma caixa mágica. Ele entende que é um modelo dentro de um loop com ferramentas, abre pela primeira vez o terminal que o agente vem usando o tempo todo e se move nele sem decorar nada, sabe exatamente o que o agente enxerga e o que não enxerga, entende por que o disco é a memória e não o chat, e sai com um CLAUDE.md escrito por ele na pasta da oficina.

Contexto para discorrer, do seu jeito: o agente é um modelo que recebe uma tarefa, escolhe uma ferramenta, age, olha o resultado e decide de novo, até achar que terminou. Ele lê arquivo, escreve arquivo, roda comando no terminal e busca na rede — é por isso que ele consegue rodar o próprio teste, coisa que um chat não faz. E é só isso que ele vê: a pasta em que foi aberto, o terminal e a rede. Não vê a sua tela, não vê outra pasta, não lembra do chat de ontem. Como a sessão morre e a memória some, o que precisa sobreviver vai para o disco: o CLAUDE.md é o bilhete que o agente lê toda vez que abre ali. E bilhete bom é curto — dez linhas do que ele não descobriria sozinho valem mais que duzentas linhas de óbvio, porque tudo que está lá ocupa espaço em toda sessão, para sempre. O `/init` escreve um primeiro rascunho lendo o projeto; o trabalho do aluno é podar. As superfícies são a mesma ferramenta em roupas diferentes: terminal, extensão de IDE, app de desktop, web. Vale mostrar `/help`, `/context` e o Esc que interrompe — Esc é o botão mais importante da ferramenta e quase ninguém usa.

O terminal entra aqui, e entra por esse caminho: ele é uma das ferramentas do loop, e o aluno já viu o agente usá-la a tarde inteira na P0. Ele está no aplicativo, então o terminal dele fica ali mesmo, ao lado da conversa, e não é outro programa que ele precise caçar — guie pela função e trabalhe a partir do que ele disser que apareceu, sem recitar nome de botão. Não é um curso de terminal, é o mínimo para ele não ficar dependente do agente para saber onde as coisas estão — quatro comandos resolvem 95% da vida: onde estou, entra na pasta, lista o que tem, cria pasta. O que vale explicar de verdade é caminho: absoluto começa na raiz e é sempre o mesmo; relativo depende de onde você está, e é daí que vem quase toda confusão de iniciante. Diga com todas as letras para que serve: não é para ele digitar comando em vez de conversar com o agente, é para ele conseguir **conferir** o que o agente fez — o que amarra direto na 1.3, que vem a seguir e é sobre exatamente isso. Se ele estiver no Windows, PowerShell e WSL não são a mesma coisa e o comando errado trava tudo; descobrir em qual ele está é trabalho seu, e a própria linha que aparece na tela entrega (`PS C:\...>` é PowerShell, `nome@maquina:~$` é bash). Aproveite que ele tem terminal para entregar a única linha de manutenção da trilha: `git pull` dentro da pasta da sala é o que traz aula nova. Passe como receita, não como matéria — git de verdade é a 2.4 e a 2.5, e até lá ele continua vendo o agente commitar por ele.

Sala e oficina. Este repositório é um exemplo vivo: se ele quiser ver como um agente é configurado de verdade, a árvore `.claude/` daqui está aberta, e vocês vão dissecá-la a fundo na 1.8. Fica para outras aulas: por que o modelo erra, como escrever o prompt, modos e permissões, skills e hooks.

## Antes de começar

Confira no estado se a oficina e a P0 estão registradas; se não, resolva antes de começar, como a `tutor` manda.

## Marcos

`node .claude/scripts/trilha.js milestone 1.2 <id>`:

- `agente`: ele entendeu o loop — modelo, ferramenta, ação, observação — e por que isso permite ao agente rodar o próprio teste. *Previsão, antes:* quando ele pede uma mudança no Claude Code, o que ele acha que acontece entre o Enter e a resposta? Caça quem imagina um chat que escreve arquivo de uma vez, sem loop.
- `terminal`: ele abriu o terminal e se moveu sozinho — onde estou, entra, lista, cria — e sabe que aquilo é a mesma ferramenta que o agente usa. *Aplicação, com ele no terminal:* faça-o tentar de um lugar em que o caminho não resolve, e o terminal dizer que a pasta não existe quando ela existe. Pergunte ali, na hora do erro, o que aconteceu — não no fim do bloco, senão ela cai em cima da pergunta do marco seguinte. Caça quem ainda não separou caminho relativo de absoluto.
- `o-que-ele-ve`: ele sabe o alcance e os limites do que o agente enxerga. *Aplicação:* ontem ele conversou na oficina sobre a página; hoje abre um chat novo lá e escreve "continua". O que o agente sabe? Caça quem acha que o chat lembra.
- `disco-como-memoria`: ele entendeu por que o CLAUDE.md existe e por que curto vence completo.
- `superficies`: ele sabe onde o Claude Code roda e usou `/context` e o Esc.

## Fluência

Na oficina: `/init` na pasta da P0 e, em cima do rascunho, um CLAUDE.md dele com no máximo dez linhas. Passa se as linhas que ele manteve forem coisas que o agente não descobriria sozinho, e se ele souber justificar o que cortou. Registre com `fluencia 1.2 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 1.3, Verificar, não ler. Gancho: ele já sabe como o agente funciona e já tem o terminal para olhar o resultado; a próxima é a aula mais importante do módulo, sobre como saber se o que ele fez presta.
