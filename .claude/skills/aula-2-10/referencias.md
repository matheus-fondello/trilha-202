# Referências, aula 2.10

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Tudo em inglês; avise antes de soltar o primeiro link. Os dois textos do Beck vêm do mesmo
boletim: um é o método sem agente, de 2023, e o outro é ele mesmo rodando o método com agente, de
2025. Se o aluno só for ler um, é o segundo.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `plausivel-por-construcao`**

- **Martin Fowler, *Test Pyramid*** — martinfowler.com (bliki), mai/2012 · ~4 min de leitura
  https://martinfowler.com/bliki/TestPyramid.html
  A figura dos três tipos de teste com o custo de cada um, e a razão de ter muitos embaixo e poucos em cima: o de ponta a ponta pela tela é frágil, caro de escrever e lento de rodar.

Antigo e curto. O desenho é o que interessa; se ele perguntar pelos nomes das camadas, o do meio
não importa para a aula.

**marco `o-loop`**

- **Kent Beck, *Canon TDD*** — Software Design: Tidy First? (boletim do autor), dez/2023 · ~6 min de leitura
  https://newsletter.kentbeck.com/p/canon-tdd
  Os cinco passos do TDD como o autor do método os escreve, e os erros que ele lista: escrever todos os testes antes, teste sem afirmação só para cobertura, e refatorar no meio da implementação.

O endereço antigo do boletim (`tidyfirst.substack.com`) redireciona para este; se o painel abrir
o antigo, é o mesmo texto.

**marco `nao-conserta-o-teste`**

- **Kent Beck, *Augmented Coding: Beyond the Vibes*** — Software Design: Tidy First? (boletim do autor), jun/2025 · ~8 min de leitura
  https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes
  O autor do TDD rodando o loop com um agente: "implement the test, then implement only enough code to make that test pass", e o sinal de que o gênio está trapaceando, "disabling or deleting tests".

É o texto-âncora da aula: cite a frase do gênio em voz alta quando chegar ao marco.

**marco `check-automatico`**

- **Anthropic, *Automate actions with hooks*, seção "Auto-format code after edits"** — documentação do Claude Code · 2 min de leitura (a seção)
  https://code.claude.com/docs/en/hooks-guide#auto-format-code-after-edits
  O hook de `PostToolUse` com o filtro `Edit|Write`, que roda um comando depois de cada edição; trocar o formatador pelo comando de teste é o hook da fluência.

A 1.8 já mostrou hooks por esta página; a âncora é nova. O aluno pede ao Claude da oficina que
escreva o hook, como a documentação sugere; você não dita o JSON.

## Sugerida

Nenhuma nesta aula: o texto do Beck de 2025 é curto e já entra como citada no marco que importa.
