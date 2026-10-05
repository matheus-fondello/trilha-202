# Referências, aula 3.7

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Tudo em inglês menos a documentação da Anthropic; avise antes do primeiro link. Três cuidados para a aula inteira. O texto do Hamel Husain é de março de 2024: a tese e o método não envelheceram, mas metade do artigo é sobre o que não é desta aula (teste A/B, RAG, fine-tuning), e ele usa um modelo para gerar as entradas de teste — aqui as entradas saem do material da P3 e a saída esperada sai das regras, escrita por ele. Diga isso antes de ele ler, senão ele volta querendo pedir ao Claude da oficina os vinte casos prontos com resposta. O artigo da Anthropic, *Demystifying evals for AI agents*, é escrito para agente e os exemplos são de agente (Terminal-Bench, SWE-Bench, pass@k): o lançador dele é um workflow, então ele leva o princípio e deixa o exemplo. E a página da documentação discorda da aula em dois pontos, que você precisa antecipar: ela aceita juiz dando nota de 1 a 5 e diz para evitar avaliação humana sempre que der. A aula fica com passa ou não passa, e com os casos julgados na mão servindo para conferir o juiz — a própria página manda testar a confiabilidade do juiz antes de escalar, e é por aí que você costura.

**Vídeo, a busca foi feita.** O da Anthropic sobre avaliar prompt no Console (2024, 3 min 20 s) foi visto e descartado: gera os casos automaticamente, o contrário do primeiro marco, e a página da ferramenta que ele mostra hoje redireciona para a página geral de avaliação. O único curto que passou é o do Hamel, nas sugeridas.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `conjunto-de-casos`**

- **Hamel Husain, *Your AI Product Needs Evals* — seção "Step 1: Write Scoped Tests"** — hamel.dev, mar/2024 · ~2 min de leitura (a seção)
  https://hamel.dev/blog/posts/evals/#step-1-write-scoped-tests
  Quebrar a feature em cenários e escrever um teste para cada um: o exemplo dele é um imóvel encontrado, vários e nenhum, que é o mesmo desenho da mensagem clara, da que vira mais de um lançamento e da que não vira nenhum.

- **Mikaela Grace, Jeremy Hadfield, Rodrigo Olivares e Jiri De Jonghe, *Demystifying evals for AI agents* — seção "Collect tasks for the initial eval dataset"** — Anthropic Engineering, jan/2026, atualizado em mar/2026 · ~3 min de leitura (a seção)
  https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents#collect-tasks-for-the-initial-eval-dataset
  Vinte a cinquenta casos simples bastam para começar; um bom caso é aquele em que dois especialistas chegariam sozinhos ao mesmo veredito; e o conjunto testa o que deve acontecer e o que não deve.

A tese do Hamel que a aula cita, a de que produto de IA que empaca quase sempre empacou por falta de eval, está no primeiro parágrafo do artigo; a seção daqui é a parte que ele usa hoje. Pare a leitura antes do "Step 2", que é onde entra a geração sintética, e não abra o código de exemplo da seção: o desenho é o que interessa. No da Anthropic, o "Step 3" é o argumento da mensagem que não vira lançamento: conjunto que só testa um lado ensina o sistema a errar para o outro.

**marco `metrica`**

- **Anthropic, *Defina critérios de sucesso e crie avaliações* — seção "Avalie suas avaliações"** — Claude Platform Docs, em português, sem data · ~3 min de leitura (a seção e as dicas logo abaixo)
  https://platform.claude.com/docs/pt-BR/test-and-evaluate/develop-tests#grade-your-evaluations
  Os três jeitos de dar a nota — por código, por gente, por modelo — com a regra de escolher o mais rápido e confiável que der conta, e o exemplo do juiz que responde só "correct" ou "incorrect".

- **Hamel Husain, *A Field Guide to Rapidly Improving AI Products* — seção "Creating Trustworthy Evaluation Systems"** — hamel.dev, mar/2025 · ~4 min de leitura (os itens 1 a 3)
  https://hamel.dev/blog/posts/field-guide/#creating-trustworthy-evaluation-systems
  Por que passa ou não passa ganha de escala de 1 a 5, e como medir se o juiz concorda com a pessoa antes de confiar nele: "a 10% increase in passing outputs is immediately meaningful".

A primeira é a taxonomia; a segunda é o cuidado com o juiz que a primeira deixa leve. As âncoras da página em português estão em inglês, e é a URL daqui: não traduza. O endereço antigo da página (`define-success`) redireciona para este. O código de exemplo da documentação traz o nome de um modelo na primeira linha: `model` é parâmetro, como a 3.3 já disse. Leia com ele até o item 3 do Hamel; o 4 é sobre escalar sem perder gente, que não é o problema dele.

**marco `regressao`**

- **Grace, Hadfield, Olivares e De Jonghe, *Demystifying evals for AI agents* — seção "Capability vs. regression evals"** — Anthropic Engineering, jan/2026 · ~1 min de leitura (a seção)
  https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents#capability-vs-regression-evals
  A diferença entre o eval que mede o que o sistema ainda não faz e o que guarda o que ele já fazia, que deve passar quase sempre: queda ali é sinal de que algo quebrou.

- **Grace, Hadfield, Olivares e De Jonghe, *Demystifying evals for AI agents* — seção "How to think about non-determinism in evaluations for agents"** — Anthropic Engineering, jan/2026 · menos de 1 min (só o primeiro parágrafo)
  https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents#how-to-think-about-non-determinism-in-evaluations-for-agents
  Um caso que passou numa rodada pode falhar na seguinte sem nada ter mudado: é a razão de rodar duas vezes antes de chamar diferença de melhora.

Da segunda, só o primeiro parágrafo. O resto é pass@k e pass^k, com fórmula, e é matemática que a aula não pede.

**marco `eval-e-tdd`**

- **Grace, Hadfield, Olivares e De Jonghe, *Demystifying evals for AI agents* — seção "Maintain and use the eval long-term"** — Anthropic Engineering, jan/2026 · ~3 min de leitura (a seção)
  https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents#maintain-and-use-the-eval-long-term
  "Eval-driven development": escrever o eval do que o sistema ainda não faz e iterar até ele passar, e manter o eval como se mantém teste unitário.

A seção abre com o "Step 6", que é o caso a caso do marco anterior dito pela Anthropic — eles não confiam no número antes de alguém ler os casos — e fecha com o "Step 8", que é este marco. Se ele quiser rever o loop, os dois textos do Kent Beck estão no `referencias.md` da 2.10: aponte para lá, não traga de novo.

**marco `eval-rodando`**

- **Hamel Husain, *Your AI Product Needs Evals* — seção "Step 3: Run & Track Your Tests Regularly"** — hamel.dev, mar/2024 · ~1 min de leitura (a seção)
  https://hamel.dev/blog/posts/evals/#step-3-run-track-your-tests-regularly
  Rodar os testes do jeito que der menos atrito na stack que já existe, e guardar o resultado ao longo do tempo para ver se está melhorando.

O exemplo dele é integração contínua com painel de métricas. Para o aluno, o "menos atrito" é um script que imprime o número e o README com o resultado de cada rodada; nada de CI nem painel nesta aula.

## Sugeridas

**marco `metrica`**

- **Hamel Husain, *How To Approach Your AI Evals*, trecho de 2:14 ao fim** — YouTube, canal do autor, jun/2026 · 4 min 18 s no total, trecho de 2 min
  https://www.youtube.com/watch?v=DZxaPNYi_k0&hl=en&persist_hl=1&t=134s
  O autor do texto da aula separando teste por código de modelo como juiz, e dizendo que o juiz erra com frequência e se mede contra rótulo de gente antes de ganhar confiança.

Ofereça quando ele tiver entendido o exato e for a vez do juiz. Começa em 2:14, que é onde o vídeo entra nos tipos de eval; os dois primeiros minutos são sobre olhar os dados de produção, que ele ainda não tem. A descrição do vídeo é propaganda do curso do autor: ignore.

**fechamento**

- **Hamel Husain, *Your AI Product Needs Evals*** — hamel.dev, mar/2024 · ~25 min de leitura
  https://hamel.dev/blog/posts/evals/
  O texto nomeado na ementa, inteiro: os três níveis de eval, o caso real de um assistente de imobiliária que empacou porque cada falha consertada fazia surgir outra, e o método que montaram em torno do eval para sair disso.

O único material longo da aula. Ofereça no fechamento, depois do `eval-rodando`, repetindo o aviso da abertura: as partes de A/B, RAG e fine-tuning são para depois, e o fim do texto anuncia o curso do autor.
