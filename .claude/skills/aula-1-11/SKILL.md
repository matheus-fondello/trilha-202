---
name: aula-1-11
description: Aula 1.11, Subagentes, MCP e plugins. Aprofundamento, fora do tronco. Sala e oficina, com fluência sobre a P0. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 1.11: Subagentes, MCP e plugins `[aprofundamento]`

**Goal:** o aluno sabe estender o agente sem perder o controle do que entra nele — subagente por papel em arquivo, sessão paralela em worktree, MCP como alcance, plugin como código de terceiro — e que conectar e instalar são decisões de segurança, não de conveniência.

Contexto para discorrer, do seu jeito: aula de aprofundamento, ele chegou adiantado. Abra pelo que ele já sabe: o revisor da 1.3 funcionava porque não tinha o histórico de quem escreveu. Subagente é isso com nome — um Claude à parte, com contexto, instrução e ferramentas próprias, que recebe uma tarefa e devolve um resumo. Em `.claude/agents/` vira arquivo, com a descrição dizendo quando ser chamado, como a skill da 1.8. O que ensina: revisor que só pode ler não conserta o que revisa, e é a ferramenta negada, não a instrução, que garante isso — impedir em vez de instruir. Sessão paralela é outra coisa: duas janelas na mesma pasta colidem no mesmo arquivo; o worktree dá a cada sessão uma cópia própria do repositório na mesma história, e o aplicativo oferece isso ao abrir uma sessão. Vale quando as frentes não se tocam; não vale quando dependem uma da outra, e cada sessão a mais gasta o plano em dobro. Precisa de repositório com commit: se a P0 ainda não é um, fica descrito; git é a 2.4 e a 2.15 retoma isto. MCP é o protocolo pelo qual uma ferramenta de fora — navegador, banco, serviço — se apresenta ao modelo com uma lista de ações. Ao conectar, o modelo ganha o alcance daquela ferramenta com a credencial dele, o servidor recebe o que o modelo manda, e o que devolve entra no contexto como texto — e texto carrega instrução. Esta sala nega o Chrome real e amarra o painel aos links curados por isso, e a configuração de MCP de projeto sobe com o repositório, que na P1 é público. Plugin é pacote: skills, hooks, agentes e servidores MCP juntos. A documentação diz com todas as letras: plugin executa código na máquina dele, com a permissão dele. Ler antes de instalar é conferir o inventário que o instalador mostra — hook roda sem o modelo decidir — e a origem. O caso da Cline, em fevereiro: injeção pelo título de uma issue vazou credencial do bot da própria ferramenta, e uma versão adulterada no npm instalou outro agente por oito horas. Atualização automática também é cadeia de suprimento.

Sala e oficina. Fora do tronco: nada aqui é pré-requisito de prática. Na oficina ele conecta o que quiser; aqui, não.

## Antes de começar

Confira no estado se a oficina e a P0 estão registradas; se não, resolva antes, como a `tutor` manda.

## Marcos

`node .claude/scripts/trilha.js milestone 1.11 <id>`:

- `subagentes-por-papel`: ele sabe o que um subagente tem de próprio, por que a lista de ferramentas garante o papel, e onde o arquivo mora; o mesmo vale para um escritor com voz fixa.
- `sessoes-paralelas`: ele sabe o que o worktree separa e o que custa. *Aplicação:* três pendências na P0: trocar a fonte, escrever as perguntas frequentes, consertar o formulário que não envia. Abre três sessões? Caça quem paraleliza por hábito, sem ver se as frentes se tocam e o que isso gasta do plano.
- `mcp`: ele sabe o que conectar dá ao modelo e o que o servidor passa a ver. *Conceito:* ele conecta o navegador logado para testar a P0. O que mais o agente passou a alcançar, além da página? Caça quem acha que conectar dá ao modelo só o uso que ele tinha em mente.
- `plugins`: ele sabe o que vem num plugin e o que confere antes de instalar. *Aplicação:* um colega manda um plugin de revisão de segurança, cheio de estrelas. Instala? O que olha antes? Caça quem trata plugin como aplicativo de loja, quando é código de terceiro com a permissão dele.

## Fluência

Na oficina, sobre a P0: um revisor que exista como arquivo em `.claude/agents/`, sem ferramenta de escrita, chamado pelo nome sobre uma mudança real e devolvendo lacunas; e um navegador conectado por MCP, abrindo a página e reportando algo que ele confere na tela. Passa se os dois rodaram com evidência e se ele diz, sem você perguntar, o que cada um passou a alcançar. Registre com `fluencia 1.11 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Depois desta, ele volta para a aula de tronco onde estava; diga qual é ao se despedir.
