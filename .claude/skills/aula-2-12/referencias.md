# Referências, aula 2.12

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Duas ressalvas. A documentação do Claude Code muda de versão em versão, e a página do
`/code-review` é a que mais muda: nome de flag, nível de esforço, o que roda em segundo
plano. Se o que o aluno vê na máquina dele não bater com o que a página diz, vale a máquina
dele, e o conceito não depende do comando. As três páginas do Google são de 2019, escritas
para revisor humano lendo o trabalho de outro humano; é de propósito. O aluno vai perceber
que a régua do que procurar e do que deixar passar não mudou com o agente, só mudou quem
produz a lista. Tudo em inglês, avise antes de mandar.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `contexto-limpo`**

- **Anthropic, *Create custom subagents*, seção "Manage subagent context"** — documentação do Claude Code · 3 min a seção
  https://code.claude.com/docs/en/sub-agents#manage-subagent-context
  Diz em uma frase o que o revisor não vê: a conversa, as skills já carregadas e os arquivos já lidos; ele parte só da tarefa que recebe.

Solte quando o aluno perguntar "mas ele não vai entender nada sem o contexto". A resposta da
página é que isso é o desenho, não uma limitação, e a seção lista o que entra no contexto de
um subagente e o que nunca chega.

**marco `contra-a-spec`**

- **Anthropic, *Best practices*, seção "Add an adversarial review step"** — documentação do Claude Code · 3 min a seção
  https://code.claude.com/docs/en/best-practices#add-an-adversarial-review-step
  O pedido modelo, contra um plano: cada requisito implementado, os casos de borda com teste, nada fora do escopo mudou; lacunas, não preferências. Troque o plano pela spec e é o pedido da fluência.

- **Anthropic, *Code Review*, seção "Review a diff locally"** — documentação do Claude Code · 4 min a seção
  https://code.claude.com/docs/en/code-review#review-a-diff-locally
  O que o `/code-review` faz: revisa num subagente com contexto próprio, caça bug de correção e limpeza, aceita um alvo, e o nível de esforço troca cobertura por confiança.

A 1.3 citou a seção e leu o aviso do fim em voz alta. Hoje o aviso vira matéria, porque ele
tem uma lista real na mão e vai triá-la: revisor mandado achar lacuna acha sempre,
e perseguir todas leva a excesso. A página do `/code-review` abre com um produto de equipe
que não é o assunto; mande a âncora, não a página, e se ele rolar para cima diga que aquilo
é revisão automática em pull request, que fica para outra hora.

**marco `duas-sessoes`**

- **Anthropic, *Best practices*, seção "Run multiple Claude sessions"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/best-practices#run-multiple-claude-sessions
  A tabela escritor e revisor em duas sessões, com a frase que justifica o desenho: contexto novo melhora a revisão porque o modelo não fica do lado do código que acabou de escrever.

**marco `julgar-a-lista`**

- **Google, *The Standard of Code Review*** — Google Engineering Practices, 2019 · 5 min de leitura
  https://google.github.io/eng-practices/review/reviewer/standard.html
  Não existe código perfeito, só código melhor; e fato técnico vence opinião e preferência. É a régua para decidir o que entra na caixa de corrigir.

- **Google, *How to write code review comments*, seção "Label comment severity"** — Google Engineering Practices, 2019 · 1 min a seção
  https://google.github.io/eng-practices/review/reviewer/comments.html#label-comment-severity
  Três rótulos que um revisor humano usa: nit, opcional, só para saber. Se o revisor do aluno não rotula, ele rotula; é a mesma triagem.

- **Google, *What to look for in a code review*, seção "Complexity"** — Google Engineering Practices, 2019 · 1 min a seção
  https://google.github.io/eng-practices/review/reviewer/looking-for.html#complexity
  Resolva o problema que existe agora, não o que alguém especula que pode existir: é a definição de excesso de engenharia que o aluno usa para recusar achado com motivo.

O rótulo de severidade é o gancho para as três caixas da aula: nit e opcional são preferência,
e "para saber" é o que se deixa. A página de complexidade dá nome ao que o revisor sugere
demais; peça que ele ache na própria lista um item que cai ali antes de mandar o link.

## Sugerida

- **Google, *What to look for in a code review*** — Google Engineering Practices, 2019 · 8 min de leitura
  https://google.github.io/eng-practices/review/reviewer/looking-for.html
  A lista inteira do que um revisor procura, do desenho ao teste, com a distinção que a fluência precisa: funcionalidade e teste são lacuna, nome e estilo são preferência.

Ofereça no painel durante o marco `contra-a-spec`, antes de ele escrever o pedido: são oito
minutos, e ele volta com o vocabulário para dizer ao revisor o que conta como achado e, depois,
para triar o que voltou. Se ele preferir não parar, guarde para o fechamento; a fluência
funciona sem ela.
