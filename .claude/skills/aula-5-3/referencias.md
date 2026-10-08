# Referências, aula 5.3

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Tudo aqui está em inglês, menos o conversor do Banco Central. As fontes de métrica são de fundo de investimento e de SaaS americano com capital: servem pela definição e pelo mecanismo, não pelos números de referência, que são de outro tamanho de empresa e de outra década. Não traga deles benchmark de churn ou de margem para a ideia do aluno; o número dele vem da origem que ele declarar.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `churn-domina`**

- **Jeff Jordan, Anu Hariharan, Frank Chen e Preethi Kasireddy, *16 Startup Metrics*, itens 5 "LTV" e 11 "Churn"** — a16z, ago/2015 · ~5 min de leitura (os dois itens)
  https://a16z.com/16-startup-metrics/
  A referência da ementa: o LTV como margem de contribuição vezes vida média, com a vida em 1 dividido pelo churn mensal, e a diferença entre churn bruto e líquido, em que o líquido esconde a perda.

A página não tem âncora: mande ele procurar os itens 5 e 11. Três coisas que ela diz e a aula usa. Com poucos meses de dado, eles preferem medir o LTV de 12 e de 24 meses, pelo que já aconteceu, a projetar a vida por 1/churn. Isso é medição de quem já tem cliente; para a ideia dele, sem cliente, o análogo honesto é limitar a vida a 12 meses (margem vezes 12) e dizer que esse teto é escolha dele, não a medida da a16z. O LTV deles é sobre margem de contribuição, que é a da 5.2. E o item 11 define o churn mensal por clientes perdidos sobre a base do mês anterior, a mesma conta da pergunta do `coorte`; não abra antes de ele responder.

**marco `coorte`**

- **Anu Hariharan, Frank Chen e Jeff Jordan, *16 More Startup Metrics*, item 10 "Cohort Analysis"** — a16z, set/2015 · ~3 min de leitura (o item)
  https://a16z.com/16-more-startup-metrics/
  Coorte passo a passo: escolher a ação que conta como uso, o período certo para o negócio, e o que se quer ver na curva, retenção que estabiliza depois de alguns meses e coorte nova melhor que a velha.

Só o item 10; o resto da página é de marketplace e de tamanho de mercado, que não é desta aula. O exemplo da página é um gráfico de uma ferramenta de análise de 2013 com 44 pessoas numa coorte: serve para mostrar como a tabela se lê, e de quebra mostra o problema do número pequeno.

**marco `payback-e-caixa`**

- **David Skok, *SaaS Metrics 2.0 – A Guide to Measuring and Improving What Matters*, seções "The SaaS P&L / Cash Flow Trough", "Is your SaaS business viable?" e "Getting paid in advance"** — For Entrepreneurs, blog do autor, jan/2013, revisto em jun/2026 · ~8 min de leitura (as três seções); o artigo inteiro passa de meia hora
  https://www.forentrepreneurs.com/saas-metrics-2/
  A referência de fundo do tema: o buraco de caixa de quem paga o CAC hoje e recebe a margem mês a mês, mais fundo quanto mais rápido se cresce; as duas regras de bolso (razão acima de 3, CAC de volta em menos de 12 meses, nos melhores em 5 a 7), ditas pelo autor como guias; e cobrar adiantado como saída.

- **David Skok, *SaaS Metrics 2.0 – Detailed Definitions*, seções "LTV : CAC Ratio" e "Months to recover CAC"** — For Entrepreneurs, blog do autor, 2014, revisto em dez/2020 · ~3 min de leitura (as duas seções)
  https://www.forentrepreneurs.com/saas-metrics-2-definitions-2/
  O suplemento do artigo acima, com o limite de cada regra escrito pelo próprio autor: o 3 supõe o LTV feito sobre a receita e margem bruta de 80% ou mais, e os 12 meses de payback são de 2011; em venda para grandes empresas, em que o cliente compra mais com o tempo, 20 meses funcionam.

Mande ler só as seções, pelo título: o artigo principal é longo e é SaaS B2B com time de vendas, e as definições não têm âncora para essas duas (a 5.2 citou a mesma página na âncora do LTV). Cite depois da pergunta do marco, porque a resposta mora em "Getting paid in advance": cobrar adiantado, com desconto, para o cliente financiar o próprio CAC, ao custo de fechar menos. Leia o 3 com cuidado, porque é fácil inverter. O do Skok é sobre LTV de receita com margem de 80%, ou seja, cerca de 2,4 sobre a margem; a aula faz o LTV sobre a margem (5.2), com o custo de IA dentro, então um 3 aqui é mais exigente que o dele, não menos. O perigo real é o contrário: quem compara razão de receita num produto de margem 50% com a regra do 3 acha que tem 3 e tem 1,5. E os 20 meses dependem de o cliente pagar mais com o tempo, o que o negócio pequeno de assinatura dele não tem; quem banca do bolso não tem nem o capital barato que o Skok diz que as grandes têm.

**marco `custo-por-execucao`**

- **Martin Casado e Matt Bornstein, *The New Business of AI (and How It's Different From Traditional Software)*** — a16z, fev/2020 · ~15 min de leitura, mas basta a abertura (~2 min)
  https://a16z.com/the-new-business-of-ai-and-how-its-different-from-traditional-software/
  O mecanismo da margem que some, dito por quem investe em software: empresas de IA com margem bruta em torno de 50 a 60%, contra 60 a 80% ou mais no SaaS comparável, porque cada uso consome computação e às vezes gente.

É de antes das APIs de modelo de linguagem: o custo de que eles falam é treino, nuvem e revisão humana, não token. O número é anedótico, como o texto admite, e de 2020; vale o mecanismo, que é o da aula: no software comum servir mais um uso custa quase nada, com modelo não. A conta da ideia dele sai do custo da P3 ou da tabela de preços abaixo, não daqui. Se ele já fez a 3.4, o ensaio do Ethan Ding que ela deixou para cá é o mesmo mecanismo em escala de empresa; se ele lembrar, ligue os dois, sem reabrir.

- **Banco Central do Brasil, *Conversor de moedas*** — bcb.gov.br, em português · consulta
  https://www.bcb.gov.br/conversao
  Fonte pública do câmbio do dia, com data, para a linha da planilha que converte o custo do modelo de dólar para real.

Câmbio de qualquer outra fonte vale se tiver data e origem escritas; o que não vale é número sem data.

- **Google, *Gemini Developer API pricing*** — Gemini API Docs, atualizado em out/2026 · ~3 min de leitura (o bloco do modelo que a ideia usaria)
  https://ai.google.dev/gemini-api/docs/pricing
  A tabela oficial em dólar por milhão de tokens, entrada e saída separadas, modelo por modelo: a fonte pública com data para estimar uma execução de quem ainda não tem o número da P3.

É a mesma tabela que a 3.4 usa. Quem fez a P3 já tem modelo, preço e data no README dela, e só volta aqui se o preço mudou desde então: a linha da planilha muda e a data junto. Quem não fez lê só o bloco do modelo que a ideia usaria, e nele só a primeira tabela (Standard), e a conta sai da coluna do pago: a do gratuito diz "Free of charge" ou "Not available", e não é preço. Se a linha do preço diz que vale até uma data, a planilha usa o preço de depois dela, ou diz que usou o promocional e até quando. Se a ideia usaria outro provedor, vale a tabela dele, na mesma unidade.

## Sugeridas

Duas: uma curta colada ao marco `coorte` e uma longa no fechamento.

**marco `coorte`**

- **Y Combinator (Tom Blomfield), *Consumer Startup Metrics | Startup School*** — YouTube, canal oficial, jan/2024 · 22 min 26 s no total, trecho de 1 min 11 s, de 13:47 a 14:58
  https://www.youtube.com/watch?v=fdD4y4Civp4&hl=en&persist_hl=1&t=827s
  Retenção quando o uso não é assinatura: qual período define um cliente ativo, que vai do Facebook todo dia ao Airbnb a cada seis meses, e por que esse período sai da frequência com que o cliente bom usa.

Continua exatamente onde a 5.2 cortou o mesmo vídeo. Ofereça depois da pergunta de conceito, quando ele estiver pensando no período certo da ideia dele. Comece em 13:47 ("Okay, next, retention") e pare em 14:58, antes de "what some companies have figured out": antes do corte é margem por cliente, que é da 5.2; depois vem o momento mágico, que é ativação e é da 5.4, e o NPS. Blomfield fala do Monzo, banco digital que ele fundou; não use o caso como número de referência. Em inglês, com legenda automática em inglês.

**fechamento**

- **Bill Gurley, *The Dangerous Seduction of the Lifetime Value (LTV) Formula*** — Above the Crowd, set/2012 · ~11 min de leitura
  https://abovethecrowd.com/2012/09/04/the-dangerous-seduction-of-the-lifetime-value-ltv-formula/
  Dez motivos para não idolatrar o LTV, escritos por um investidor: a fórmula é palpite com cara de ciência, e as variáveis se puxam umas às outras (preço maior aumenta o churn, mais mídia sobe o CAC e traz cliente pior), que é o limite da sensibilidade de uma entrada por vez.

Ofereça no fechamento, depois da fluência, como leitura para levar. A seção que conversa com a aula é "The LTV Variables 'Tug' at One Another", a dos cinco cavaleiros amarrados pela mesma corda. O texto é de consumo americano de 2012 e fala de orçamentos de marketing de milhões de dólares; atravessa pelo mecanismo. Ele usa churn anual na vida média, não mensal: se o aluno estranhar, é a conversão da aula.
