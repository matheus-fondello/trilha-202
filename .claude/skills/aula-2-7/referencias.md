# Referências, aula 2.7

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três ressalvas. A primeira é do painel: o link do repositório é o único jeito de você
abrir a issue ao lado da conversa, porque a allowlist é por URL e o caminho abre o item
e o que está abaixo dele — da raiz curada, `/issues/3` abre; de fora dela, nada do
GitHub abre. A segunda é das páginas em português do GitHub: a tradução é automática e
a barra lateral mistura português e inglês; se o aluno estranhar um termo, é tradução,
não outra coisa. A terceira: esta aula não tem vídeo. O que existe de curto sobre mexer
em projeto alheio é genérico, e o que merece pausa aqui é a issue dele.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `clonar-e-rodar`**

- **202 Lab, *Verificador de certificados da 202*** — repositório no GitHub, Node com Express e EJS · README e CONTRIBUTING em ~8 min
  https://github.com/matheus-fondello/202-certificados
  O projeto da aula, com as seis issues abertas: é o código que confere se um certificado da trilha é verdadeiro, e é dele que sai a cópia do aluno.

Abra a issue sorteada no painel a partir desta raiz. Você não clona nem roda nada: quem
faz isso é a oficina, e a sua parte é ler com ele o que a issue pede.

**marco `entender-sem-ler`**

- **Anthropic, *Common workflows*, seção "Understand new codebases"** — documentação do Claude Code · 3 min a seção
  https://code.claude.com/docs/en/common-workflows#understand-new-codebases
  As perguntas que dão o mapa de um projeto que se acabou de abrir — visão geral, onde mora cada parte, como um fluxo atravessa o código — na forma de receita, em vez de "leia o repositório".

- **Anthropic, *How Claude remembers your project*, seção "Set up a project CLAUDE.md"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/memory#set-up-a-project-claude-md
  O que o `/init` faz quando o projeto não tem nada: analisa o repositório e escreve um CLAUDE.md com comandos de build, instruções de teste e as convenções que encontrou.

O aluno já viu CLAUDE.md na 1.2 e na 1.5, sempre no projeto dele. Aqui a novidade é o
`/init` sobre código alheio, e o que ele escreve vale conferir contra o CONTRIBUTING:
o que o agente inferiu do código não é necessariamente a regra que o projeto pede.

**marco `mudar-pequeno`**

- **Google, *Small CLs*** — guia de engenharia do Google, em inglês · ~8 min de leitura
  https://google.github.io/eng-practices/review/developer/small-cls.html
  A lista de por que mudança pequena vence: é revisada mais rápido e mais a fundo, introduz menos bug, desperdiça menos trabalho quando a direção estava errada e é mais simples de reverter.

Na Google "CL" é o que o GitHub chama de pull request; traduza numa frase se ele abrir.
A segunda seção, sobre o que conta como pequeno, é a que responde "mas cabia tudo junto".

**marco `provar`**

- **GitHub, *Verificações de status*** — GitHub Docs, em português · 6 min de leitura
  https://docs.github.com/pt/pull-requests/reference/status-checks
  Diz o que o sinal do CI no PR significa: que os commits atendem às condições do repositório, o que está rodando, o que passou e o que precisa de atenção.

**marco `pr-como-conversa`**

- **GitHub, *Como criar uma solicitação de pull*** — GitHub Docs, em português · 6 min de leitura
  https://docs.github.com/pt/pull-requests/how-tos/create-pull-requests/creating-a-pull-request
  O passo a passo do PR entre duas branches do mesmo repositório, que é o caso dele, e a nota de que fork só entra quando não se tem permissão de escrita — na cópia dele, tem.

## Sugeridas

Uma no meio, colada ao marco, e o resumo do Feathers no fechamento.

**marco `pr-como-conversa`**

- **GitHub, *Ajudando outras pessoas a revisar suas alterações*** — GitHub Docs, em português · 5 min de leitura
  https://docs.github.com/pt/pull-requests/concepts/helping-others-review-your-changes#making-your-changes-easy-to-review
  As quatro coisas que fazem um PR revisável, e são exatamente as da fluência: mantê-lo pequeno, dizer por que a mudança é necessária e o que mudou, apontar onde olhar primeiro, e revisar o próprio diff antes de pedir revisão a alguém.

Cinco minutos, antes de ele escrever a descrição, não depois. O trecho de revisar o
próprio PR primeiro é o que costuma cair melhor: é a auto-revisão da 1.3 dita pelo GitHub.

**fechamento**

- **Nicolas Carlo, *The key points of Working Effectively with Legacy Code*** — understandlegacycode.com, fev/2020 · ~10 min de leitura
  https://understandlegacycode.com/blog/key-points-of-working-effectively-with-legacy-code/
  O resumo do livro de Michael Feathers que a ementa cita: código sem teste é código legado, o dilema de que para testar é preciso mudar e para mudar com segurança é preciso testar, e as receitas de mudança mínima para encaixar o novo sem reescrever o velho.

Em inglês, dez minutos, no fechamento. O aluno acabou de viver a versão pequena disso num
projeto que tinha testes; o texto mostra o que se faz quando não tem. Ofereça dizendo isso.
