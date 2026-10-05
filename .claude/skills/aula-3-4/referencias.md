# Referências, aula 3.4

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três cuidados que valem para a aula inteira. A documentação vive em `platform.claude.com`, e as páginas em português têm as âncoras em inglês: use as URLs exatas daqui, porque âncora traduzida não dá erro, só abre a página no topo. Preço muda sem aviso e a tabela da Anthropic é em dólar: o número que vale é o do dia em que ele mediu, com a data, o modelo e o câmbio escritos no README, e nunca um preço que você lembra. E o câmbio da fatura não é a cotação do jornal: cartão internacional cobra imposto e spread do banco por cima, então diga para ele declarar qual câmbio usou em vez de discutir qual é o certo.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `tokens-e-preco`**

- **Anthropic, *Preços* — seção "Preços dos modelos"** — Claude Platform Docs, em português, sem data · ~3 min de leitura (a tabela e as notas abaixo dela)
  https://platform.claude.com/docs/pt-BR/about-claude/pricing#model-pricing
  A tabela oficial em dólar por milhão de tokens, com entrada, saída e as colunas de cache de cada modelo: a saída custa várias vezes a entrada.

A pergunta do marco é de previsão: só abra a tabela depois que ele responder. Três minas na página. A tabela lista modelos aposentados e de acesso restrito ao lado dos vigentes; mande ler só a linha do modelo que a P3 usa. A leitura de cache não é o mesmo desconto para todos (as notas de rodapé dão frações menores para alguns modelos), então não diga "cache custa 10%" como regra. E logo abaixo há um aviso de que os modelos mais novos usam um tokenizador que gera cerca de 30% mais tokens para o mesmo texto: a contagem da 3.3 vale para o modelo em que foi medida, e quem troca de modelo reconta. A seção "Exemplo prático", mais abaixo, é sobre outro produto: não cite.

**marco `custo-por-execucao`**

- **Anthropic, *Contagem de tokens* — seção "Como contar os tokens de uma mensagem"** — Claude Platform Docs, em português, sem data · ~3 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/token-counting#how-to-count-message-tokens
  Um endpoint que recebe o mesmo pedido da chamada e devolve só quantos tokens de entrada ele tem, sem chamar o modelo: o jeito de pesar cada pedaço do prompt separado.

É a ferramenta de decompor: contar o pedido inteiro, depois sem as mensagens anteriores, depois sem o plano de contas, e a diferença é o peso de cada pedaço. Ele pede isso ao Claude da oficina; você não dita como. A seção "Preços e limites de taxa", no fim da mesma página, diz que a contagem é gratuita. A própria página avisa que o número é estimativa: o que vai para o README sai do `usage` das chamadas reais, não daqui.

**marco `reduzir`**

- **Anthropic, *Cache de prompt* — seção "Como o cache de prompt funciona"** — Claude Platform Docs, em português, sem data · ~3 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/prompt-caching#how-prompt-caching-works
  O mecanismo em três passos: o sistema procura um prefixo idêntico do prompt já guardado, usa se achar e guarda se não achar; vale cinco minutos e renova a cada uso.

- **Anthropic, *Cache de prompt* — seção "Limitações do cache"** — Claude Platform Docs, em português, sem data · ~2 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/prompt-caching#cache-limitations
  O tamanho mínimo que o cache aceita, modelo por modelo, e a frase que mais importa: abaixo dele o pedido roda sem cache e nenhum erro é retornado.

- **Anthropic, *Processamento em lote* — seção "Limitações de lotes"** — Claude Platform Docs, em português, sem data · ~2 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/batch-processing#batch-limitations
  O preço do desconto, escrito: a maioria dos lotes termina em até uma hora, mas o resultado pode levar até 24, e o lote que não termina nesse prazo expira.

A primeira só entra depois da resposta à pergunta de conceito, senão ela responde por ele. Na mesma página, o quadro "Erro comum" em "Como funciona a verificação automática de prefixos" (`#how-automatic-prefix-checking-works`) é o furo do lançador: marca do cache no bloco que muda a cada chamada, com a mensagem recebida como exemplo; quem ligou o cache do jeito mais simples e não vê leitura no `usage` caiu nele. A segunda é a armadilha que pega quem junta duas alavancas: o mínimo muda muito de modelo para modelo, e o modelo menor pede mais tokens para cachear do que o maior. Quem troca para o menor e liga o cache pode ficar sem cache nenhum e sem erro nenhum; a prova está no `usage`, com os dois campos de cache zerados. Também não prometa acerto de cache o dia inteiro: cinco minutos sem chamada e o prefixo expira, e a primeira mensagem depois disso paga a escrita, que custa mais que a entrada comum. Os multiplicadores estão na página de preços, seção "Cache de prompt" (`#prompt-caching`). Da página de lotes, uma linha que emenda no marco seguinte: o lote pode passar um pouco do limite de gasto configurado no console, porque roda em paralelo.

**marco `teto-e-log`**

- **Anthropic, *Cache de prompt* — seção "Acompanhando o desempenho do cache"** — Claude Platform Docs, em português, sem data · ~2 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/build-with-claude/prompt-caching#tracking-cache-performance
  Os três campos de entrada que o `usage` devolve com o cache ligado, e a soma que dá a entrada total: com cache, `input_tokens` é só o que vem depois do ponto de cache.

- **Anthropic, *Limites de taxa* — seção "Definindo seu próprio limite de gastos"** — Claude Platform Docs, em português, sem data · ~2 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/api/rate-limits#setting-your-own-spend-limit
  O teto mensal de gasto que o console oferece e o que acontece quando ele bate: as chamadas da conta passam a voltar com erro até o limite subir ou o mês virar.

A primeira é a razão de o log precisar dos três campos: quem soma só `input_tokens` e `output_tokens` com o cache ligado conta a entrada a menos, e o README sai errado. A segunda serve de contraste, não de solução: o limite do console é o cinto de segurança da conta inteira, não sabe quem é o Nilton, e quando bate para os 140 clientes de uma vez, o contrário do que a Denise pediu. O teto por cliente mora no código, antes da chamada. Para barrar a entrada de tamanho absurdo antes de chamar, volte à contagem de tokens do marco anterior. A página de uso do console mostra o gasto somado, em gráfico; ele confere o log contra ela, e não a lê no lugar do log.

**marco `margem`**

- **Ethan Ding, *tokens are getting more expensive*** — mandates (Substack), jul/2025 · ~9 min de leitura, em inglês
  https://ethanding.substack.com/p/ai-subscriptions-get-short-squeezed
  Por que preço fixo com uso desigual come a margem: o usuário pesado consome muitas vezes o que paga, e uma das saídas que o autor discute é cobrar pelo uso, que é o que o lançamento extra da Denise já faz.

Link solto no fechamento, nunca leitura na aula. É ensaio de opinião, escrito em minúsculas e com ironia, sobre assinaturas de ferramentas de código; os preços que ele cita são de modelos de 2025 e não servem para conta nenhuma, e a afirmação de que a Anthropic pôs a troca de modelo dentro dos pesos é especulação dele. Vale pelo mecanismo, que é o cliente pesado da aula em escala de empresa. A conta inteira do negócio é da 5.3: não abra aqui.

## Sugeridas

**marco `reduzir`**

- **IBM Technology (Martin Keen), *What is Prompt Caching? Optimize LLM Latency with AI Transformers*** — YouTube, canal oficial, fev/2026 · 9 min 6 s no total, trecho de 1 min 50 s, de 6:02 a 7:52
  https://www.youtube.com/watch?v=u57EnkQaUTY&hl=en&persist_hl=1&t=362s
  Um quadro com o prompt montado em camadas, instruções, documento, exemplos e pergunta, e o que acontece com o cache quando a pergunta vem no fim e quando vem no começo: a pergunta do marco, desenhada.

Uma só sugerida. Ofereça no painel depois que ele responder a pergunta de conceito, como conferência, não como explicação. Comece em 6:02 ("when does an LLM know what gets cached?") e pare em 7:52: antes disso é o funcionamento interno do modelo, que a aula não usa, e depois vêm números que não batem com a Anthropic (um mínimo único de 1.024 tokens e um prazo de cinco a dez minutos); os números certos estão nas páginas citadas acima. O vídeo diz que a comparação é token a token; na Anthropic ela é feita por bloco até o ponto de cache, e o efeito na ordem do prompt é o mesmo. Em inglês, com legenda em inglês.
