# Referências, aula 2.5

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

A documentação do GitHub é reorganizada com frequência e os caminhos mudam (a página de revisão passou para `/how-tos/` em 2026); se um link cair, o título ainda encontra a página na busca do próprio site. Nestas duas páginas do Pro Git em português a âncora está em inglês (`#_basic_branching`, `#_pushing_branches`) mesmo com o texto todo traduzido — é assim mesmo, não conserte. Não vale como regra: noutras páginas do mesmo livro a âncora vem em português, então confira em vez de supor.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `branch-por-tarefa`**

- **Scott Chacon e Ben Straub, *Ramificação (Branching) e Mesclagem (Merging) Básicas*** — Pro Git, 2ª edição, tradução pt-br · ~10 min de leitura (~4 min só a Ramificação Básica)
  https://git-scm.com/book/pt-br/v2/Ramifica%C3%A7%C3%A3o-Branching-no-Git-Ramifica%C3%A7%C3%A3o-Branching-e-Mesclagem-Merging-B%C3%A1sicas#_basic_branching
  Conta a história inteira em um exemplo: você está no meio da tarefa 53, chega um bug urgente, você troca de branch, resolve, volta e o trabalho continua onde estava — e a mesma página termina em conflito de merge, com os marcadores na tela.

O motivo do branch por tarefa é esse troca-de-contexto, não organização. Cite quando o aluno perguntar "por que não trabalhar direto na main". A parte de conflito da mesma página (`#_basic_merge_conflicts`) serve de novo no `pr-como-unidade`, se o assunto vier.

**marco `pr-como-unidade`**

- **GitHub, *About pull requests*** — GitHub Docs · ~2 min de leitura
  https://docs.github.com/en/pull-requests/get-started/about-pull-requests#key-parts-of-a-pull-request
  Lista o que um PR junta — Conversation, Commits, Checks, Files changed e a merge box — e é exatamente por isso que ele é a unidade de revisão: a conversa, o histórico, os testes e o diff no mesmo lugar.

Página curtíssima e em inglês simples; serve de link solto, não de leitura.

- **Philomatics, *Never fear merge conflicts again — git merge/pull tutorial*** — YouTube, mai/2024 · 5 min 12 s
  https://www.youtube.com/watch?v=DloR0BOGNU0&hl=en&persist_hl=1
  Só sobre conflito, no terminal: como ler os marcadores, como abortar o merge se travar, e como fechar depois de escolher.

Reserva: cite se o conflito aparecer na oficina, não como pausa da aula.

**marco `o-remoto`**

- **Scott Chacon e Ben Straub, *Branches Remotos (Remote Branches)*** — Pro Git, 2ª edição, tradução pt-br · ~11 min de leitura (~3 min só a seção de push)
  https://git-scm.com/book/pt-br/v2/Ramifica%C3%A7%C3%A3o-Branching-no-Git-Branches-Remotos-Remote-Branches#_pushing_branches
  Diz a frase que desfaz a confusão mais comum de quem acabou de aprender git local: branches locais não são sincronizados sozinhos com o remoto, você empurra explicitamente o que quer compartilhar.

Se o aluno quiser a lista de comandos do `gh`, `gh pr --help` na própria máquina responde melhor e mais atualizado que qualquer link; não mande ele para a página do manual.

**marco `revisao-no-pr`**

- **GitHub, *Reviewing proposed changes in a pull request*** — GitHub Docs · ~9 min de leitura (~2 min a seção Starting a review)
  https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request#starting-a-review
  Mostra onde o diff mora (aba Files changed), como alternar entre visão unificada e lado a lado, e como o comentário gruda numa linha específica — que é o que o revisor adversarial precisa apontar.

Aqui a referência é sobre a mecânica da tela, não sobre julgar código. O julgamento continua sendo do revisor adversarial lendo o diff; o aluno lê o comentário, não o código.

## Sugeridas

**marco `branch-por-tarefa`**

- **Peter Cottle, *Learn Git Branching*, em português, níveis 1 a 3 da introdução** — learngitbranching.js.org · interativo, uns 10 min para os três níveis
  https://learngitbranching.js.org/?locale=pt_BR
  O aluno digita `git commit`, `git branch` e `git merge` numa página que desenha o grafo em tempo real: o commit vira um círculo, a branch uma etiqueta que anda, o merge o nó com dois pais. É a única forma de ele ver o grafo da 2.4 virar branch.

Corte dito: "faça só os três primeiros níveis da introdução e volte; o quarto é rebase e não é
assunto de hoje". São uns dez minutos, mais que o normal para uma pausa, e valem porque é a
imagem de que a aula inteira precisa. Ele digita git de mentira numa página, o que contraria de
leve o "conferir, não digitar"; diga que aqui o propósito é o desenho.

**marco `pr-como-unidade`**

- **GitHub, *How to create a pull request in 4 min | GitHub for Beginners*** — YouTube, ago/2024 · 3 min 44 s
  https://www.youtube.com/watch?v=nCKdihvneS0&hl=en&persist_hl=1
  Canal oficial do GitHub: em menos de quatro minutos o aluno vê a tela do PR de verdade — o botão, o diff, o merge — que é o que falta para quem nunca abriu um.

- **GitHub, *How to merge a pull request | Introduction to GitHub*** — YouTube, canal oficial, ago/2024 · 3 min 23 s
  https://www.youtube.com/watch?v=FDXSgyDGmho&hl=en&persist_hl=1
  O segundo tempo: o PR aberto vira merge na tela, e no meio (1:05 a 2:56) aparece um conflito de verdade, com os marcadores e a decisão de qual versão vale.

Ofereça os dois em sequência, logo depois do marco e antes de ele abrir o primeiro PR pelo `gh`:
sete minutos de vídeo oficial que fecham o ciclo do PR. Avise que está em inglês e que os vídeos
criam e mesclam pela interface web, enquanto na aula quem cria é o `gh`; o que importa é
reconhecer a tela depois.
