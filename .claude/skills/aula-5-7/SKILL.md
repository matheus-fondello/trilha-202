---
name: aula-5-7
description: Aula 5.7, A matemática do venture. Sala, com fluência em texto: se a ideia do aluno é venture-backable. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 5.7: A matemática do venture

**Goal:** o aluno entende a aritmética do fundo e o que o dinheiro cobra, faz a conta de default alive da ideia dele, diz se ela é venture-backable sem confundir isso com ser boa, e sabe o interesse da 202 nisso.

Contexto para discorrer, do seu jeito: o fundo é um intermediário, com dinheiro de terceiros, prazo e promessa de devolver um múltiplo. O retorno segue uma power law: nos dados da Horsley Bridge, uns 6% dos investimentos geraram uns 60% do retorno. Num fundo fictício de R$ 100 milhões em vinte cheques de R$ 5 milhões, o acerto só paga os erros se puder devolver o fundo, vinte vezes o cheque; por isso o fundo procura empresa que possa faturar uns US$ 100 milhões por ano (a régua do Balfour) e pergunta se ela pode ser a ponta da curva, não se é boa. Um sistema de pedidos para revendas de gás, 3 mil no perfil a R$ 200 por mês, fatura uns R$ 7 milhões por ano com o mercado inteiro: ótimo para dois sócios, fora da régua. O cheque cobra crescimento contratado, piso que sobe (o dinheiro vira folha e os clientes necessários se multiplicam) e mão única: quem se paga e não basta ao fundo vira órfão dele. Default alive é a pergunta do Graham: com a despesa de hoje e o crescimento dos últimos meses, chega-se ao lucro com o caixa que há? O mesmo sistema, com caixa de R$ 60 mil, despesa de R$ 15 mil e R$ 6 mil de receita neste mês, crescendo a partir do próximo: a 10% ao mês, lucra no 11º tendo queimado uns R$ 54 mil; a 7%, o caixa acaba no 9º e o lucro só viria no 15º. Sem receita, inverta: com este caixa e esta despesa, que crescimento seria preciso. Pergunte cedo demais. Levanta-se quando o dinheiro compra crescimento que não viria sem ele e o fundo quer a empresa, nunca para tapar default dead (o fatal pinch). Sinais de venture-backable: teto de outra ordem, crescimento que se compõe, algo que melhora com escala (rede, dado, custo marginal quase nulo), precisar de dinheiro antes de se pagar, como o aluguel de máquinas agrícolas entre produtores, que queima até ter os dois lados. A maioria não tem, e tudo bem (5.6). A 202 se diz em público um ecossistema de talentos nas universidades, com a missão de que eles criem ou façam crescer a nova safra de startups do Brasil; produto dela que amadurece sai como empresa, e quem quer fundar a sua tem a 202 junto. A página da trilha diz que procura gente de alto potencial e acompanha ritmo, entregas e jeito de pensar; o jeito que a trilha treinou: verificar em vez de acreditar, dar origem ao número, dizer não à própria ideia com a conta na mão.

Sala; a oficina só para a planilha e o plano. Valuation e diluição: fora da trilha, volte a clientes e meses. Fica para depois: o plano inteiro (P5), o preço no Stripe (6.1).

## Antes de começar

Na pasta do plano: a planilha da 5.3 (sem ela, a conta vai em texto) e, na seção 1, o mercado da 4.6, inteiro e em clientes; sem ele, conta agora em uma linha, de baixo para cima, com origem. Você não dá número nem veredicto. Da 202, só o que está nas duas páginas públicas das referências; não prometa investimento, vaga nem convite.

## Marcos

`node .claude/scripts/trilha.js milestone 5.7 <id>`:

- `power-law`: cada cheque precisa poder devolver o fundo. *Previsão, antes:* um fundo põe dinheiro em vinte empresas; quantas precisam dar muito certo para ele dar certo? Caça quem imagina o fundo ganhando na média.
- `o-que-o-dinheiro-cobra`: o que o cheque cobra. *Conceito:* um negócio que se paga com 150 clientes a R$ 200 por mês aceita R$ 2 milhões e contrata oito pessoas a R$ 12 mil; de quantos clientes passa a precisar para não morrer? Caça quem acha que caixa cheio dá segurança.
- `default-alive`: a conta, e quando levantar. *Aplicação:* o dono das revendas, a 7%, decide levantar com qualquer investidor quando faltarem três meses de caixa; como chega nessa conversa, e o que podia ter mexido antes? Caça quem trata levantar como a saída de default dead.
- `venture-backable`: os sinais, e por que a maioria não tem.
- `a-202`: o que ela é, o que quer e o que procura.

## Fluência

Em texto, sobre a ideia registrada: venture-backable ou não, defendido com o teto (seção 1) contra a régua do fundo, os sinais que tem e os que faltam, a conta de default alive (acrescentando à planilha da 5.3 o caixa e o crescimento, chutados e marcados; sem receita, a invertida) e de quantos clientes precisaria se um cheque, de valor chutado por ele, virasse folha. Parte do jogo da 5.6, sem refazê-lo. Faça uma vez o advogado do lado oposto. Passa se o veredicto sair dos números e dos sinais; se a conta chegar a um mês ou a um crescimento necessário, com origem ou chute em cada número; se ele não trocar "não é captável" por "não presta" nem "é captável" por "devo levantar"; e se a resposta ao advogado usar a estrutura do negócio. "Não é" passa tão bem quanto "é"; "pequeno é bom" sem conta não passa. Registre `fluencia 5.7 passou|nao-passou <tentativas>`. Depois ele guarda veredicto e conta no `plano.md`, em "8. O que mata isso", do jeito dele; você não revisa a redação.

Fechamento da `tutor`. Próxima unidade: P5, Plano de negócio do produto one-feature. Gancho: na P5 ele fecha o plano, que é a spec do M6, e alguém vai perguntar de onde veio cada número.
