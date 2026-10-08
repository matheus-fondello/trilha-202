---
name: aula-5-1
description: Aula 5.1, Modelos de negócio e preço. Sala, com fluência em texto: dois modelos e um preço em reais para a ideia do aluno; entram o brief e a pasta do plano da P5. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 5.1: Modelos de negócio e preço

**Goal:** o aluno descreve um modelo por quem paga, pelo quê e o que dispara a cobrança, sabe que número mede cada modelo, lê um DRE simplificado, e põe no plano da P5, aberto hoje, dois modelos para a ideia dele e um preço em reais defendido pelo valor.

Contexto para discorrer, do seu jeito: modelo não é setor nem produto ("é um app", "é SaaS"); é como o valor é criado, entregue e capturado (Osterwalder), e se descreve por quem paga, pelo quê, o que dispara a cobrança e com que frequência. Quem paga e quem usa, a 4.6 já separou. Cada modelo tem o seu número. Assinatura vive de o cliente ficar: MRR, a receita recorrente do mês, e churn, quem sai. Marketplace fica com o take rate, a fatia de cada transação, e vive de liquidez, a chance de quem procura achar: o app que leva a sobra de 300 feirantes de Belém a 12 restaurantes tem cadastro, não mercado. Na publicidade o cliente é o anunciante. Freemium é funil, não receita; usage-based cobra o consumo, como a API de um modelo cobra por token, e serve quando o uso custa. Serviço cresce contratando; comissão depende da venda alheia. Empresa grande roda várias linhas: uma traz o cliente, outra dá a margem. O DRE mostra isso de cima para baixo. Setembro de um brechó infantil em consignação em Joinville: vendas R$ 40.000, repasse às donas das peças R$ 24.000, receita (a comissão) R$ 16.000, imposto R$ 960, higienização R$ 1.040, lucro bruto R$ 14.000, despesas R$ 11.800 (aluguel, vendedora, sistema, pró-labore e a maquininha, R$ 1.000), resultado R$ 2.200. A maquininha sobe com a venda, e a 5.2 a separa. Preço: a disposição a pagar mora no valor para o cliente (horas, dinheiro, risco); o seu custo é só o piso. A âncora é o que ele já paga pela alternativa atual (4.5): planilha grátis ancora em zero, funcionário de meio período em centenas. Cobre cedo: o preço testa a dor, e quem jura que dói e não paga R$ 30 deu o elogio da 4.2. No one-feature, assinatura por padrão: a dor frequente da 4.5 volta todo mês, receita previsível sustenta um dono só, e é o que o checkout da 6.1 vende. Dor que acontece duas vezes na vida vira churn no segundo mês; aí, por uso. Um plano, um preço.

Sala; o plano, na oficina. A 4.2, a 4.5 e a 4.6 já foram dadas, e a 3.4 também, se ela está nas aulas concluídas: referencie só o que ele viu. Fica para depois: unit economics (5.2 e 5.3), canais (5.4), que jogo é (5.6), Stripe (6.1).

## Antes de começar

A P5 entra hoje, antes da matéria: ele lê `praticas/p5/brief.md` inteiro e cria na oficina `plano-p5/plano.md` com as oito seções do brief, pelos títulos dele, mais "O que ouvi". Na "1. O problema e de quem" leva, como rascunho e do jeito que tem, o beachhead, os critérios do ICP e a conta de mercado da 4.6, com o SAM também em número de clientes. Você não escreve nem revisa. Registre `pratica P5 pasta=<caminho>`, que não abre correção. O cliente é o beachhead da ideia. Você não escolhe modelo nem preço por ele: pergunte de onde vem cada número.

## Marcos

`node .claude/scripts/trilha.js milestone 5.1 <id>`:

- `quem-paga`: criar, entregar, capturar; de quem sai o dinheiro. *Previsão, antes:* o WhatsApp é de graça para ele; como ganha dinheiro? Caça quem responde com setor ou "vende dados", sem dizer quem paga, pelo quê e quando. "Publicidade" é meia resposta: há anúncio no Status desde 2025, mas a empresa paga por mensagem entregue.
- `onde-ganham`: os modelos principais, o gatilho de cada um e o número que o mede.
- `casos-e-dre`: o DRE, depois os casos vivos: volume numa linha, margem em outra. *Aplicação:* com o DRE à vista, a dona diz que faturou R$ 40 mil e quer uma segunda vendedora por R$ 2.900; cabe? Caça quem lê o que passou pelo caixa como receita, e receita como lucro. A melhor resposta é "só se ela vender mais; quanto?": a conta fica para a 5.2.
- `preco`: valor e não custo, âncora, cobrar cedo. *Aplicação:* uma ferramenta monta por foto o orçamento do pintor autônomo, a R$ 0,40 cada; hoje ele perde o domingo nisso e um cliente em três pela demora. Um colega manda cobrar R$ 9,90, "barato, ninguém pensa". Que preço ele daria, e de onde sai o número? Caça quem parte do custo ou do "barato para não assustar".
- `one-feature`: assinatura por padrão e quando não; o preço em reais que vai para o Stripe na 6.1.

A do DRE vai antes dos casos; a do preço, depois de valor e âncora explicados.

## Fluência

Em texto, sobre a ideia dele: dois modelos, cada um com quem paga, quem usa, pelo quê, gatilho, frequência, o que exige e o número a vigiar; a escolha de um, com preço mensal em reais e origem (valor, âncora da alternativa, entrevista; chute marcado, com o jeito de conferir). Passa se os dois diferirem no gatilho ou em quem paga, não só em faixa de preço; se o preço sair do valor ou da âncora, com o custo só de piso; se nenhum número for órfão; se ele disser que reação de cliente o faria rever o preço; e, fora da assinatura, por que a dor não se repete. Registre `fluencia 5.1 passou|nao-passou <tentativas>`. Passou, o texto vai na "4. Como ganha dinheiro", do jeito dele.

Fechamento da `tutor`. Próxima aula: 5.2, Unit economics I. Gancho: hoje ele pôs preço; na próxima, quanto dele sobra depois do que cada cliente custa, e quanto custa trazer um.
