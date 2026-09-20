# Referências, aula 2.9

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Tudo aqui é em inglês, e vale avisar antes de mandar o primeiro link: o material sério
sobre critério e decomposição não existe traduzido. Duas das citadas são a mesma página
de boas práticas que a 1.3 e a 2.8 já abriram, em âncoras diferentes: se ele já leu, cite
e siga. A palestra de Sean Grove, *The New Code*, é da 2.8; não a ofereça de novo, mas
o marco `linguagem-natural` é o lugar de lembrá-la, porque o fecho desta aula é a tese dela
aplicada ao projeto dele. Nenhuma das citadas fala do simulador: o exemplo desta aula é
o SPEC.md dele, e os links entram como prova de que a forma tem nome e dono.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `criterio-verificavel`**

- **Martin Fowler, *Given When Then*** — martinfowler.com, ago/2013 · ~3 min de leitura
  https://martinfowler.com/bliki/GivenWhenThen.html
  Dá nome à forma que a aula pede: *given* é o estado antes, *when* é a ação, *then* é o resultado esperado — e diz que a mesma estrutura serve em prosa informal, sem ferramenta.

O exemplo dele é de bolsa de valores; troque pelo do aluno na hora de explicar. O que
importa é a última frase da estrutura: o *then* é uma consulta, não uma ação. Critério
que termina em "e o sistema fica bom" não tem *then*.

- **Anthropic, *Best practices*, seção "Give Claude a way to verify its work"** — documentação do Claude Code · 4 min a seção
  https://code.claude.com/docs/en/best-practices#give-claude-a-way-to-verify-its-work
  A primeira linha da tabela é um critério de aceitação inteiro: em vez de "implemente uma função que valida e-mail", os três exemplos com o resultado esperado de cada um.

Foi a sugerida da 1.3; aqui só a primeira linha da tabela interessa. Se ele lembrar
da aula, é reconhecimento e não leitura: "é a mesma coisa que você fez na P0, agora
para o projeto inteiro".

- **Alistair Mavin, *EARS: Easy Approach to Requirements Syntax*** — alistairmavin.com, página do criador do método · 5 min de leitura
  https://alistairmavin.com/ears/
  Um segundo formalismo para critério verificável, mais rígido que o Given-When-Then: "while precondição, when gatilho, o sistema shall resposta", criado para sistema crítico e hoje citado em spec para agente.

Onde Fowler é prosa informal para humano, EARS é sintaxe fechada para reduzir ambiguidade; o mesmo motivo por que a aula pede critério com exemplo.

**marco `spec-como-contrato`**

- **Anthropic, *Best practices*, seção "Let Claude interview you"** — documentação do Claude Code · 2 min a seção
  https://code.claude.com/docs/en/best-practices#let-claude-interview-you
  O último parágrafo é a definição de spec útil que esta aula cobra: nomeia arquivos e interfaces, diz o que fica fora, e termina com uma verificação ponta a ponta que prova que a feature funciona.

É a seção que a 2.8 usou para a entrevista. Ele já esteve nela; o que ele não leu com
atenção foi o parágrafo final, porque na 2.8 ainda não tinha o que verificar. Aponte
o parágrafo, não a seção.

**marco `linguagem-natural`**

- **Edsger W. Dijkstra, *On the foolishness of "natural language programming"* (EWD 667)** — E.W. Dijkstra Archive, Universidade do Texas, c. 1978 · ~5 min de leitura
  https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html
  Argumenta que a naturalidade da língua é a facilidade de dizer coisas cujo absurdo não é óbvio, e que o símbolo formal é privilégio, não fardo: é a objeção mais forte à tese de que a spec é o código.

Cinquenta anos depois, a máquina que ele achou impossível existe, e o problema que ele
descreveu continua inteiro: a ambiguidade que passa despercebida. Não use como "ele
estava errado"; use como "ele estava certo sobre o risco, e a resposta é o critério com
exemplo, que é o pedaço formal dentro da spec em português". O aluno que ler o texto
vai achar o tom arrogante; é, e não importa.

## Sugeridas

**marco `fatias-verticais`**

- **Ralph Jocham, *Vertical Slicing and Sprint Goals*** — canal Scrum.org no YouTube, série Scrum Tapas, dez/2023 · 2 min 42 s
  https://www.youtube.com/watch?v=urZ1TIycedU&hl=en&persist_hl=1
  Fatia vertical em menos de três minutos, por um Professional Scrum Trainer, com o mesmo argumento da aula: atravessa a pilha inteira.

Ofereça quando o marco abrir, antes de discorrer. Inglês sem legenda.

**fechamento**

- **Henrik Kniberg, *Making sense of MVP — and why I prefer Earliest Testable/Usable/Lovable*** — Crisp's Blog, jan/2016 · ~15 min de leitura
  https://blog.crisp.se/2016/01/25/henrikkniberg/making-sense-of-mvp
  O desenho do skate e do carro: entregar uma roda por vez não serve para ninguém, entregar um skate inteiro serve e ensina — e o primeiro corte é o que responde à maior dúvida, não o mais bonito.

Quinze minutos: no fechamento, quando ele já ouviu "atravessa da tela ao dado" e ainda acha que
a fatia fina é uma versão pobre do sistema. O texto é sobre produto e cliente, não sobre agente:
a transferência para "o que o agente constrói primeiro" é sua, não dele. Nada na fluência depende
de ter lido.
