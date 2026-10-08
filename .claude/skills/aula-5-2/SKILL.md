---
name: aula-5-2
description: Aula 5.2, Unit economics I. Sala, com fluência em texto sobre números dados: margem de contribuição, CAC e LTV com a conta aberta. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 5.2: Unit economics I

**Goal:** o aluno escolhe a unidade antes de qualquer fórmula, separa variável de fixo pelo comportamento e não pelo nome da linha, e calcula com a conta aberta a margem de contribuição, o CAC completo contra o só de mídia, com orgânico e pago separados, e o LTV sobre a margem, sabendo que cada número é uma definição escrita.

Contexto para discorrer, do seu jeito: unit economics é o teste de existência do negócio: unidade que não se paga não melhora em escala. A unidade é aquilo de que se conta o custo de trazer e o que deixa: na assinatura, o assinante; na loja sem recompra, o pedido, porque cada um custa trazer; no marketplace com recorrência, o cliente, uma série de transações, com a margem por transação vezes quantas ele faz. Unidade errada não dá erro, dá veredicto invertido. Margem de contribuição é a receita da unidade menos tudo que sobe ao vender uma a mais: insumo, embalagem, frete, taxa do meio de pagamento, comissão do aplicativo, e no produto com IA o custo de cada chamada ao modelo, pelo preço do plano pago (quem fez a 3.4 já tem esse número; quem não fez, a 5.3 o estima). Fixo é o que não se mexe: aluguel, pró-labore, contador. O teste é "com um cliente a mais amanhã, essa linha sobe?", e não o nome nem o jeito de cobrar. E há o fixo em degrau: a segunda máquina da lavanderia só entra quando a primeira não dá conta. A margem bruta desconta só o custo do produto; a de contribuição, também o de vender e entregar, e é a que paga o fixo: fixo dividido por ela dá quantas unidades empatam. CAC é o que custou trazer os clientes do período dividido por quantos vieram. Mídia é uma fatia; entram o tempo de quem atende e vende, mesmo sócio, o brinde de boas-vindas, a recompensa de indicação. Indicação recompensada é aquisição paga. Mídia dividida por todos os novos, orgânicos inclusive, faz o anúncio parecer mais barato; para decidir se aumenta o anúncio, conta o gasto pago sobre quem o pago trouxe. CAC não tem valor certo: tem definição escrita, com numerador, denominador e janela. LTV é a margem por mês vezes a vida média, que é 1/churn mensal: 3% dá 33 meses. Sobre receita, conta como valor um dinheiro que já saiu pela outra porta. E é previsão: a vida sai de poucos meses de cancelamento e projeta um futuro que ninguém viu.

Sala; oficina só para anotar no plano. A 5.1 já foi dada, e a 3.4 também, se ela está nas aulas concluídas: referencie só o que ele viu. Fica para depois: churn por coorte, LTV:CAC, payback, a margem que o custo de IA come e a sensibilidade (5.3); custo por canal e funil (5.4).

## Antes de começar

Leia o `material.md` junto com esta skill: são os números da fluência. Confira no estado a pasta da P5 registrada na 5.1. Você não faz conta por ele antes de ele fechar a dele.

## Marcos

`node .claude/scripts/trilha.js milestone 5.2 <id>`:

- `a-unidade`: de que se conta o custo de trazer e o que ele deixa, antes de qualquer fórmula. *Aplicação:* um app liga cuidadoras de idosos a famílias e fica com 15% de cada plantão, e a maioria das famílias marca toda semana com a mesma cuidadora; qual é a unidade, e o que dá errado na conta se ele escolher outra? Caça quem escolhe sem dizer que lado gera a receita e o que se repete.
- `margem-de-contribuicao`: variável e fixo pelo comportamento, e a margem que paga o fixo. *Previsão, antes:* uma loja de açaí vende a tigela a R$ 28 pelo aplicativo e gasta R$ 9 de insumo; quanto sobra por tigela? Caça quem desconta o insumo e esquece comissão, embalagem e cupom. Só depois de fechar a da unidade e pedir passagem.
- `cac-completo`: o que entra além da mídia, orgânico contra pago, e o denominador dito.
- `ltv-sobre-margem`: margem vezes vida média, nunca receita. *Conceito:* um serviço de limpeza de piscina por plano mensal abriu há cinco meses, perde 4% dos clientes por mês e diz que cada um fica dois anos; o que ele viu, e o que supôs? Caça quem toma o LTV por medição.

## Fluência

Em texto, sobre o primeiro bloco do material: ele refaz as duas contas da frase da Júlia, cada número com a linha de onde saiu, e diz o que ela pode afirmar. Não peça parte por parte; quando ele fechar, refaça a conta e confira linha a linha. Passa se a transportadora entrar como variável, porque a fatura acompanha as caixas; kit e presente de indicação, no CAC e não na margem (o kit descontado uma vez do LTV, por escrito, vale); o CAC completo trouxer o tempo da Júlia, com o denominador dito e o anúncio separado da indicação; o LTV sair da margem, com a vida de 1/churn dita como previsão; e as contas baterem com as suas, ou divergirem por uma definição escrita e mantida. Segunda tentativa: o segundo bloco, com os mesmos critérios; a folha dos barbeiros, paga por corte, faz o papel da transportadora, e a barba de graça, o do kit. Registre com `fluencia 5.2 passou|nao-passou <tentativas>`. Depois, ele anota no `plano.md` da P5, na seção 5. Quanto custa rodar, do jeito dele, a unidade da ideia e as linhas de custo variável que já enxerga, sem número inventado: a conta é da 5.3.

Fechamento da `tutor`. Próxima aula: 5.3, Unit economics II. Gancho: hoje o churn veio dado e o CAC ficou ao lado do LTV sem comparação; na próxima os dois se encontram, o tempo entra na conta, e a ideia dele passa pelo teste com o custo de IA dentro.
