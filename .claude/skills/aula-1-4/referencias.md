# Referências, aula 1.4

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `alucinacao`**

- **Adam Tauman Kalai, Ofir Nachum, Santosh Vempala e Edwin Zhang, *Why Language Models Hallucinate*** — arXiv, set/2025 · artigo científico
  https://arxiv.org/abs/2509.04664
  A fonte primária, para o aluno que quiser ver que isso não é opinião de blog.

**marco `nao-determinismo-e-sicofania`**

- **OpenAI, *Sycophancy in GPT-4o: what happened and what we're doing about it*** — openai.com, abr/2025 · 3 min de leitura
  https://openai.com/index/sycophancy-in-gpt-4o/
  Sicofância não é teoria: uma versão que concordava com tudo foi ao ar e teve que ser revertida.

- **Sara Zan, *Setting the temperature to zero will make an LLM deterministic?*** — zansara.dev, mar/2026 · 6 min de leitura
  https://www.zansara.dev/posts/2026-03-24-temp-0-llm/
  Desmonta a resposta que todo mundo dá ("é só zerar a temperatura"): mesmo sem sorteio, o mesmo pedido pode dar respostas diferentes, e a saída é desenhar em volta da variação.

Para quem perguntar por que nem sem sorteio a resposta se repete. Assume o vocabulário de token e distribuição que o 3Blue1Brown acabou de dar; funciona depois dele, não antes.

## Sugeridas

Três, cada uma colada no seu marco: a mecânica em vídeo, a explicação em português, e a regra
que fecha a aula em vídeo. Nenhuma passa de oito minutos.

**marco `mecanica-minima`**

- **3Blue1Brown, *Transformers, the tech behind LLMs*** — YouTube, abr/2024 · 27 min no total, trecho de 3 min
  https://www.youtube.com/watch?v=wjZofJX0v4M&hl=en&persist_hl=1
  Os três primeiros minutos, o capítulo "Predict, sample, repeat": o modelo produz uma distribuição de probabilidade sobre o próximo pedaço e sorteia dela. É a mecânica inteira desta aula, visual e sem metáfora.

Ofereça no painel logo que o marco abrir, e diga o recorte em voz alta: **assista até os
3 minutos e volte**. Do minuto três em diante vira álgebra linear e o aluno se perde achando
que devia entender. Se ele quiser saber por que a mesma pergunta dá respostas diferentes, o
trecho de 22:22 a 26:03 fecha isso.

**marco `alucinacao`**

- **OpenAI, *Por que os modelos de linguagem alucinam?*** — openai.com, set/2025 · 8 min de leitura
  https://openai.com/pt-BR/index/why-language-models-hallucinate/
  Em português, e com a explicação que reorganiza a cabeça do aluno: o modelo chuta porque a avaliação premia o chute e pune o "não sei" — do mesmo jeito que um aluno faz numa prova de múltipla escolha.

Oito minutos e em português, então cabe pausar a aula. Ofereça quando o marco
`alucinacao` fechar, e espere ele voltar: a analogia da prova é boa demais para você
resumir por cima.

**marco `faz-bem-faz-mal`**

- **Claude, *Can you trust what AI tells you?*** — canal oficial no YouTube, série Claude Academy, ago/2026 · 5 min 3 s
  https://www.youtube.com/watch?v=cIMlBw2nqfA&hl=en&persist_hl=1
  Alucinação e sicofância juntas como as duas causas de "confiantemente errado", confiança como um dial e não um interruptor, e quatro hábitos de verificação: a regra que fecha a aula, dita por quem faz o modelo.

Ofereça quando o marco abrir, porque é ele em vídeo. Se a aula já estiver longa, só o corte de
3:04 ao fim ("trust is a dial" e os quatro hábitos, dois minutos): os dois defeitos ele acabou de
ver. Inglês com legenda automática.
