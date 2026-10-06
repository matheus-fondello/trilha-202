---
name: aula-5-3
description: Aula 5.3, Unit economics II. Sala, com fluência em texto: a planilha da ideia do aluno, com o custo da P3 dentro. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 5.3: Unit economics II

**Goal:** o aluno lê o churn por coorte e sabe por que manda no LTV, separa o teste do modelo (LTV:CAC) do de caixa (payback), põe o custo de IA na margem e sai com a planilha da ideia, cada número com origem, dizendo se o negócio vive e o que o mata primeiro.

Contexto para discorrer, do seu jeito: o churn deixa de ser dado. Mensal e anual não se convertem multiplicando: 5% ao mês perde 46% no ano (sobram 0,95¹²), não 60%. O 1/churn da 5.2 não é linear: de 6% para 4% a vida vai de 17 para 25 meses; de 4% para 2%, de 25 para 50. O churn do mês mistura quem entrou em meses diferentes; coorte é o grupo que entrou junto, seguido mês a mês. A curva boa cai no começo e achata; a ruim vai a zero. Com dez clientes, um cancelamento é 10%: ruído. O período de medir segue a frequência da dor (4.5). Sem cliente, churn é chute com origem nas entrevistas (quanto a dor se repete), e limitar a vida a 12 meses é um teto honesto, dito como escolha. LTV:CAC testa o modelo (regra de bolso: mais de 3); payback, o CAC dividido pela margem mensal, testa o caixa (menos de 12 meses; os melhores, 5 a 7). O 3 do Skok é sobre LTV de receita com margem de 80%; sobre a margem da 5.2 é mais exigente, e o perigo é o inverso: 3 na receita, com margem de 50%, é 1,5 na margem. Payback de 20 meses só fecha onde o cliente paga mais com o tempo. Quem banca do bolso paga o CAC hoje e recebe aos poucos: crescer rápido aprofunda o buraco, e o ano adiantado, com desconto, vira o caixa. Vida menor que o payback: o cliente sai antes de devolver o CAC. Com IA, cada uso tem preço, e preço fixo com uso desigual entrega a margem ao cliente pesado (3.4). O custo da P3 por mensagem no pago é a referência de uma execução, ajustada pelo que a dele carrega e quantas chamadas faz, vezes o uso mensal do cliente pesado. O gratuito não é preço de produto, e o provedor usa o dado (3.6). Custo em dólar, preço em real: câmbio e preço do modelo mudam sozinhos. Sensibilidade é mexer uma entrada por vez (churn, custo por execução ou CAC em dobro, preço 20% menor) e achar a que vira o veredicto com a menor mudança; na vida elas se puxam. Essa é o que mata primeiro; se for chute, vira pergunta da próxima entrevista.

Sala; a oficina só para a planilha do plano. Referencie a 3.4, a 4.5, a 5.1 e a 5.2. Fica para depois: o CAC por canal (5.4), os dez primeiros (5.5), que jogo é (5.6), a conta da empresa inteira (5.7).

## Antes de começar

Confira no estado a pasta do plano (P5), com a unidade e as linhas de variável da 5.2 (se não estiverem, ele diz agora, em uma linha), e a da P3. O custo por mensagem está no README da P3: leia e confirme com ele modelo, preço, câmbio e data; sem o número lá, ele refaz a conta da 3.4 com o preço do dia. Churn, CAC e uso não são seus: pergunte de onde vem cada um.

## Marcos

`node .claude/scripts/trilha.js milestone 5.3 <id>`:

- `churn-domina`: mensal e anual; a vida não é linear no churn. *Previsão, antes:* um app de pedidos de reposição para restaurantes por quilo perde 6% dos clientes por mês; ir de 6% a 4% e de 4% a 2% vale o mesmo para o LTV? Caça quem acha que cada ponto de churn vale igual.
- `coorte`: a curva por grupo de entrada, o número pequeno, o período certo. *Conceito:* um app de controle de garantias para bicicletarias perdia 3 de 30 clientes por mês; uma feira trouxe mais 30 em setembro e o churn de outubro caiu para 5%. Melhorou? Caça quem lê o churn do mês sem separar quem entrou quando.
- `payback-e-caixa`: razão, payback, onde as regras param, o caixa. *Aplicação:* um sistema de controle de caçambas para locadoras de entulho: R$ 100 de margem por mês, CAC de R$ 900, churn de 3%; razão de 3,7, payback de nove meses. O fundador tem R$ 12 mil e uma feira onde fecharia vinte de uma vez, a R$ 900 cada. Vai? Caça quem toma razão boa por licença para gastar sem olhar o caixa.
- `custo-por-execucao`: o custo da P3 levado à execução dele, pelo cliente pesado; a margem que some.
- `sensibilidade`: entradas com origem, separadas das contas, mexidas uma por vez até o veredicto virar.

## Fluência

A planilha da ideia, na pasta do plano (CSV exportado ou tabela no `plano.md`: quem corrige lê texto), à mão ou com o Claude da oficina; ele cola aqui. Entradas: preço (5.1), variável por cliente com o custo da P3, CAC, churn, fixo de rodar mais um salário dele. Contas: margem de contribuição, vida, LTV, LTV:CAC, payback, clientes que pagam o fixo. Refaça uma conta do que ele colou. Passa se cada entrada tiver origem (entrevista, P3, fonte pública ou chute com o jeito de conferir); se o variável sair do custo por execução vezes o uso do cliente pesado, com câmbio e data (ou do que ele nomeou, sem IA); se a sua conta bater; se ele dobrar o churn e mexer mais uma entrada, uma de cada vez; e se disser se o negócio vive e que entrada o mata primeiro, com o valor em que vira. Registre `fluencia 5.3 passou|nao-passou <tentativas>`. Depois ele guarda o texto nas seções **5. Quanto custa rodar** e **8. O que mata isso** do `plano.md`, do jeito dele; a 8, a 5.6 e a 5.7 completam.

Fechamento da `tutor`. Próxima aula: 5.4, Distribuição: canais, fits e funil. Gancho: hoje o CAC entrou como chute; na próxima, de onde vêm os clientes, quanto custa cada canal e onde o funil vaza.
