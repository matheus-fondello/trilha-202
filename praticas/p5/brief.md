# Brief da P5 — O plano do seu produto one-feature

> Desta vez não há cliente. O problema é seu, escolhido na 4.4, e quem vai decidir com base neste plano é você mesmo, no M6, quando for construir e cobrar. Você lê este brief na 5.1, no dia em que o plano nasce, e ele cresce nas aulas do M5 até a prática fechar.

## O que é o plano

Um produto one-feature é um problema, uma feature, um preço, uma página. Um negócio inteiro em cima de uma coisa só, bem feita: uma promessa na página, um botão de assinar e a coisa funcionando do outro lado. A feature pode usar IA ou não; uma regra determinística bem feita vale tanto quanto uma chamada de modelo. O que não vale é duas features pela metade no lugar de uma inteira.

O plano é a decisão tomada antes de abrir o editor. É a **spec da P6**: o que você escrever aqui é o que vai construir, pôr no ar e cobrar. Quem pular esta parte passa os dias da P6 refazendo escolha que cabia numa tarde.

## Onde ele mora

Numa pasta da oficina, `plano-p5/`, com um `plano.md` dentro, criada e registrada na 5.1. Na mesma pasta fica a planilha da 5.3, num formato que se leia como texto: um CSV, ou uma tabela dentro do `plano.md`. Se você fez a conta numa planilha do Excel ou do Google, exporte um CSV para a pasta: quem corrige lê texto.

O plano cresce nas aulas. Depois de cada fluência, você guarda o que escreveu na seção dela, do seu jeito, à mão ou com o Claude da oficina. O tutor não escreve nem revisa a redação: o plano é seu.

| Seção | Nasce em |
|---|---|
| 1, 2, 3 e 7 | 4.4 a 4.6, antes de o plano existir: você as escreve na P5, a partir da ideia registrada e do que ouviu |
| 4 | 5.1 |
| 5 | 5.2 e 5.3, com a planilha |
| 6 | 5.4 e 5.5 |
| 8 | 5.3, 5.6 e 5.7 |
| O que ouvi | as três entrevistas reais, feitas do M4 até aqui |

## As oito seções

Use estes títulos: as aulas citam cada seção pelo número e pelo nome.

**1. O problema e de quem.** Uma pessoa específica, com ofício e contexto, que dá para listar quem está dentro. "Empreendedores" não é resposta. A dor com um episódio, a frequência e o que custa. E o tamanho do mercado, de baixo para cima (4.6), em clientes.

**2. A feature, e o que ela não faz.** O que ela faz, em uma frase. Logo abaixo, a lista do que ela explicitamente não faz: é a lista que vai te salvar na P6.

**3. Como se resolve hoje.** Planilha, à mão, contratando alguém, ou não resolvendo. O que isso custa à pessoa e o que segura ela onde está. Se a resposta honesta for "ninguém sente isso", melhor descobrir agora.

**4. Como ganha dinheiro.** Quem paga, pelo quê, o que dispara a cobrança. O preço mensal em reais, que é o que vai para o Stripe na 6.1, e de onde ele saiu. Preço zero não é resposta: se ninguém pagaria, o plano diz isso.

**5. Quanto custa rodar.** O custo de uma execução da feature e de um cliente por mês, com o cliente que mais usa e não o da média. Se há modelo no meio, cada uso tem preço, e a P3 já te deu o número de partida. A margem, o que trazer um cliente custa, quanto ele vale, em quanto tempo devolve o que custou, e quantos clientes pagam o custo de rodar e um salário seu.

**6. De onde vêm os dez primeiros.** Canal concreto: um grupo, uma comunidade, a lista que você alcança esta semana, com a mensagem que você manda. "Redes sociais" e "marketing digital" são categorias, não canais. E, depois dos dez, os canais que você testaria e o funil até a receita.

**7. O que entra no MVP.** O que a P6 constrói nos cinco dias dela e, principalmente, o que fica de fora, cada corte com motivo. O critério é o da 4.5: fica o que testa a hipótese que pode matar o negócio. O caminho da pessoa até o valor, em passos, da página ao pagamento ao resultado.

**8. O que mata isso.** O risco real, com o número em que o negócio vira, e não uma lista genérica. Custo maior que o preço, ninguém achar o produto, a dor não doer o bastante para alguém pagar: qual é o seu, e como você vai saber cedo. Aqui também ficam que jogo o negócio joga (5.6) e se precisa de dinheiro de fora (5.7), com a conta.

**O que ouvi.** As três entrevistas: quem era cada pessoa, o que ela fez e contou, separado do que você concluiu, e o que contrariou o plano, com o que você mudou por causa disso (ou por que não mudou).

## Três regras

**Todo número tem de onde veio.** "Custa uns R$ 30 por mês" não passa. "Cada execução gasta uns quatro mil tokens, que na tabela de tal data dá tanto, e o cliente que mais usa roda vinte por mês" passa. A origem é uma de quatro: o que alguém fez e te contou numa entrevista, o que você mediu (o log da P3), uma fonte pública com a data, ou um chute dito como chute, com o jeito de conferir. Chute marcado é honesto; chute com cara de análise é o que a trilha inteira tentou tirar de você.

**Direto, não volumoso.** O plano inteiro cabe em umas 2.000 palavras, fora a planilha: umas quatro páginas. Documento longo gerado por IA conta contra, não a favor. O que se lê aqui é decisão tomada, não texto. Use o Claude da oficina para pensar junto, desafiar suas premissas e fazer as contas; as escolhas são suas.

**Três pessoas ouvidas.** Três pessoas reais do público da seção 1, ouvidas antes de fechar o plano, sobre o que fizeram e não sobre o que fariam: o que a 4.1 e a 4.2 ensinaram. Escreva o que ouviu, inclusive quando contrariou o plano. A armadilha mais cara é resolver muito bem o problema errado. Descreva cada pessoa pelo que ela é (o ofício, há quanto tempo, o tamanho do negócio), não pelo nome: o plano revisado vai para o repositório público da P6.

## O que a P6 vai pedir

A P6 é o produto deste plano, no ar: a página que vende, a conta, a feature da seção 2 no escopo da seção 7, a assinatura no preço da seção 4, em modo de teste, liberando o acesso quando o pagamento confirma. O plano revisado vai junto, no repositório, com o que mudou e por quê.

Por padrão, a P6 parte do motor da P3: a chamada no servidor, a saída validada, o teto, o log, o eval, com o domínio trocado para o seu problema. Reaproveitar ou recomeçar é decisão sua, e não conta ponto nem desconto; só precisa estar escrita, na seção 2 ou na 7, com o porquê. Se a sua ideia não usa IA, você recomeça, e a feature é a regra que você mesmo escreve.

## O que não há

Não há cliente a agradar nem resposta certa: um plano que conclui, com a conta na mão, que o negócio não fecha como está vale mais do que um otimista sem origem. Não há URL nem repositório nesta prática: entrega-se a pasta. Não há formato obrigatório além das seções; tabela, tópico ou prosa, como servir. E não há prazo: a referência da trilha é dois dias, umas seis horas além das aulas, e é referência.

## O que acontece no chat da P5

O tutor confere que as três entrevistas estão registradas; com menos, ele registra a que você trouxer e espera. Depois você fecha o que falta no plano. Com o plano pronto, e antes da entrega, o tutor faz o papel de quem vai decidir com base nele: pergunta de onde veio cada número e cada premissa que sustenta o plano, uma de cada vez, começando pelas que mais pesam. Ele só pergunta; não sugere número nem diz qual está errado. Você corrige, marca como chute com o jeito de conferir, ou mantém com o motivo. Então você registra a entrega.

## Depois da entrega

A correção acontece num chat novo, com quem não acompanhou o trabalho nem a conversa das premissas: ela lê este brief, o seu plano e o registro da sua ideia, e devolve feedback, sem nota. Depois vem o Q5, o quiz do módulo, e então o M6, onde o plano vira produto.
