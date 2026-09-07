# Referências, aula 2.4

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

O Pro Git é gratuito e a tradução pt-br dos três capítulos abaixo está completa e é boa,
mas o vocabulário dela diverge do que a aula fala: "preparado" é staged, "área de preparação"
é staging area, "commitado" é committed. Diga o par nas duas línguas quando linkar, senão
o aluno lê a página e não reconhece o que acabou de ouvir. A página de checkpointing do
Claude Code muda com frequência, então confirme na hora que a seção citada ainda existe.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `modelo-mental`**

- **Chacon e Straub, *Pro Git*, cap. 1.3 "O que é Git?", seção "Os Três Estados"** — Apress / git-scm.com, 2ª edição · 3 min a seção
  https://git-scm.com/book/pt-br/v2/Primeiros-Passos-O-que-%C3%A9-Git%3F#_os_tr%C3%AAs_estados
  Meia página em português que fecha o modelo mental inteiro: modificado, preparado e commitado, e as três áreas correspondentes — diretório de trabalho, área de preparação e diretório .git.

**marco `commit-bem-feito`**

- **Chacon e Straub, *Pro Git*, cap. 5.2 "Contribuindo com um Projeto", seção "Diretrizes de Commit"** — Apress / git-scm.com, 2ª edição · 4 min a seção
  https://git-scm.com/book/pt-br/v2/Git-Distribu%C3%ADdo-Contribuindo-com-um-Projeto#_commit_guidelines
  É a régua do próprio projeto Git para commit atômico e mensagem no imperativo, com o critério que interessa aqui: cada commit muda uma coisa só e a mensagem diz por quê.

**marco `desfazer`**

- **Chacon e Straub, *Pro Git*, cap. 2.4 "Desfazendo Coisas"** — Apress / git-scm.com, 2ª edição · 8 min de leitura
  https://git-scm.com/book/pt-br/v2/Fundamentos-do-Git-Desfazendo-Coisas
  Traz `--amend`, tirar da preparação e descartar modificação nas duas formas, a antiga com `reset`/`checkout` e a nova com `restore`, e avisa em que ponto exato o desfazer passa a perder trabalho.

O capítulo mistura `reset`/`checkout` com `restore` porque cobre Git antigo e novo. Diga ao
aluno que `restore` é a forma de hoje e que ele vai ver a antiga em qualquer resposta de IA
ou tutorial de 2019. `reflog` não está nesta página; se ele quiser ir atrás, é o cap. 7.1
"Seleção de Revisão" e o 10.7 "Manutenção e Recuperação de Dados", e nenhum dos dois cabe
nesta aula.

**marco `desfazer`**

- **Anthropic, *Checkpointing*, seção "Limitations"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/checkpointing#limitations
  O contraste que a aula precisa, escrito pela própria Anthropic: o checkpoint não pega o que o bash mexeu, nem o que subagente editou, nem mudança feita fora da sessão, e a página fecha dizendo que ele não substitui controle de versão.

Esse é o item mais importante da aula e o que mais contraria a intuição do aluno, que acabou
de descobrir o `/rewind` e acha que já tem rede. Vale ler em voz alta a limitação do bash:
o agente roda `rm` e `mv` o tempo todo, e é exatamente isso que o checkpoint não desfaz.

## Sugerida

- **Chris Beams, *How to Write a Git Commit Message*** — cbea.ms, ago/2014 · 12 min de leitura
  https://cbea.ms/git-commit/
  As sete regras que viraram o padrão de fato, e a sétima é a aula inteira: use o corpo da mensagem para explicar o quê e o porquê, nunca o como.

Ofereça no painel logo depois que o marco `commit-bem-feito` fechar, enquanto o aluno ainda
está escrevendo a mensagem dele. É em inglês, e três das sete regras são convenção de largura
de linha que não importa para ele — avise isso ao oferecer, e mande olhar os exemplos de antes
e depois no fim do texto, que é onde a diferença aparece.
