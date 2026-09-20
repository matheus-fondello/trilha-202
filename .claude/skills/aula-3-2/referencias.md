# Referências, aula 3.2

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Duas armadilhas nesta aula. A documentação da Anthropic muda de endereço e de conteúdo sem aviso: se um link não abrir, diga isso ao aluno e siga, não invente substituto na hora. E o guia do Google é de 2019, escrito antes dos modelos de linguagem: o vocabulário dele é de ML clássico e alguns exemplos envelheceram (o item "an agent or bot experience", que está na lista vizinha, a do que a IA faz melhor, hoje soa datado), mas o teste que ele propõe — regra resolve? — é exatamente o desta aula, e é por isso que ele está aqui. Diga isso quando citar. Cuidado também para não gastar o "Building effective agents" aqui como se fosse aula de padrões de orquestração: nesta aula ele entra só pela seção de quando não usar. Os padrões ficam para a 3.9.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `formatos-de-feature`**

- **Anthropic, *Ticket routing* — seção "Build a strong prompt"** — Claude Platform Docs, sem data · ~5 min de leitura
  https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing#build-a-strong-prompt
  Uma feature de classificar inteira, do jeito que ela existe em produção: ticket em texto livre entra, uma categoria de uma lista fechada sai.

Use para mostrar o formato "classificar" em concreto, não para mandar ler. A página tem bastante Python; cite o desenho — entrada bagunçada, lista de saídas definida antes, resposta em tag para o resto do sistema consumir — e deixe o código de lado.

**marco `quando-faz-sentido`**

- **Google PAIR, *User Needs + Defining Success* — seção "When AI is probably not better"** — People + AI Guidebook, 2019 · ~1 min de leitura (a seção)
  https://pair.withgoogle.com/chapter/user-needs/#when-ai-is-probably-not-better
  Seis situações em que a regra ganha do modelo, com exemplo em cada uma: previsibilidade, informação estática, erro caro, transparência, pressa de ir ao mercado, e tarefa que ninguém quer automatizada.

- **Erik S. e Barry Zhang, *Building effective agents* — seção "When (and when not) to use agents"** — Anthropic Engineering, dez/2024 · ~1 min de leitura (a seção)
  https://www.anthropic.com/engineering/building-effective-agents#when-and-when-not-to-use-agents
  Cem palavras que dizem para achar a solução mais simples possível e só subir a complexidade quando ela se justifica, incluindo a hipótese de não construir nada agêntico.

São dois recortes do mesmo teste por caminhos diferentes: o do Google é uma lista de casos, o da Anthropic é uma regra de ordem. Cite os dois no mesmo bloco, o Google primeiro por ser mais concreto. A frase da Anthropic sobre trocar latência e custo por desempenho é a ponte natural para o marco seguinte.

**marco `o-que-muda-no-produto`**

- **Anthropic, *Optimizing for cost and intelligence* — seção "Compare models on cost per task"** — Claude Platform Docs, sem data · ~3 min de leitura (a seção)
  https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence#compare-models-on-cost-per-task
  Números reais de custo por tarefa concluída, e o caso em que o modelo mais caro por token sai mais barato no fim, que é onde a intuição de preço costuma errar.

Serve para tirar "custo por uso" do abstrato. O aluno não precisa entender o benchmark; precisa ver que o preço de uma feature de IA se mede por tarefa entregue, não por chamada, e que a conta muda quando o modelo muda.

- **Google PAIR, *Errors + Graceful Failure*, seção "Provide paths forward from failure"** — People + AI Guidebook, 2019 · 3 min a seção
  https://pair.withgoogle.com/chapter/errors-failing/#section3
  O que pôr na tela quando a IA erra: focar no que a pessoa pode fazer a seguir, não só admitir a falha, com o exemplo do garçom que oferece alternativa em vez de dizer "acabou".

Mesma fonte da citada de `quando-faz-sentido`, outro capítulo; é a metade do marco que a latência não cobre.

## Sugeridas

**marco `formatos-de-feature`**

- **Apple Support, *How to use Writing Tools with Apple Intelligence*** — YouTube, canal oficial (UK), abr/2026 · 1 min 34 s
  https://www.youtube.com/watch?v=iCKG5rDteXY&hl=en&persist_hl=1
  Corrigir, resumir e reescrever dentro de qualquer campo de texto do sistema, sem abrir chat nenhum: os formatos transformar e extrair acontecendo no fluxo de escrita de alguém.

- **GitHub, *Code Completion Made Easy with GitHub Copilot*** — YouTube, canal oficial, dez/2024 · 58 s
  https://www.youtube.com/watch?v=Wk1GVJWt2JA&hl=en&persist_hl=1
  Sugestão de código aparecendo enquanto se digita, aceita com Tab: o formato gerar no fluxo, sem chat, e familiar porque é o que o Claude Code faz na oficina.

Os dois somam menos de três minutos; ofereça juntos quando o marco abrir, antes da Appleton. Um é
escrita comum, o outro é código: dois formatos diferentes. Se for um só, o da Apple fala mais
direto com quem não programa.

- **Maggie Appleton, *Language Model Sketchbook, or Why I Hate Chatbots*** — maggieappleton.com, jun/2023 · ~6 min de leitura
  https://maggieappleton.com/lm-sketchbook
  Três esboços de interface que não são chat — sugestões que aparecem enquanto se escreve, cadeias de causa e consequência, menu de botão direito — com o argumento de que o chat é a solução preguiçosa.

Ofereça no painel logo depois dos vídeos, ainda no meio da aula. É curta, tem imagens e vídeos curtos, e o efeito é imediato: o aluno volta com a percepção de que "conversar" é um formato entre vários e quase nunca o melhor. Se ele já chegou nessa conclusão sozinho durante o marco, ofereça mesmo assim, mas no fechamento.
