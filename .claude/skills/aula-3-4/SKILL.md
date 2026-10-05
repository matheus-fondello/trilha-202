---
name: aula-3-4
description: Aula 3.4, Custo, teto e observabilidade. Sala e oficina, com o custo por mensagem da P3 medido pelo log e o teto por plano no README. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.4: Custo, teto e observabilidade

**Goal:** o aluno transforma a contagem de tokens da 3.3 em reais por mensagem, sabe de onde vem cada centavo e quem é o cliente que custa caro, conhece as três alavancas para baixar a conta e o que cada uma troca, e põe teto e log no sistema para ver o pesado antes de doer.

Contexto para discorrer, do seu jeito: a 3.3 devolveu duas contagens, entrada e saída, e cada uma tem preço próprio por milhão de tokens, diferente por modelo; a saída custa várias vezes a entrada. O preço é em dólar e a Denise pensa em reais: o câmbio entra na conta e no README. O que surpreende: a mensagem do cliente é a parte mais barata da chamada. Quem paga é o contexto que ele monta em volta, plano de contas, regras, as mensagens anteriores dele, e uma saudação custa quase o mesmo que o aluguel na entrada. Por isso a média engana: a padaria manda quase o dobro de mensagens dos outros, e tem o histórico mais longo; o histórico, se já entra desde a 3.3, é o pedaço que mais cresce; se não, entra na 3.8, e a conta de hoje é a base para medir quanto ele custa. Quem manda três mensagens por lançamento custa três vezes, e a Denise cobra por lançamento. O token mais barato é o que não vai: o que no contexto não muda a resposta sai, e o que uma regra barra antes não chega ao modelo. Depois, três alavancas. Cache de prompt: o começo idêntico entre chamadas fica guardado por alguns minutos, ler dele custa uma fração do preço e escrever custa um pouco mais; ele guarda o prefixo, então a ordem importa: o que é igual para os 140 clientes vem antes do que é de um só. Lote: metade do preço em troca de esperar, até um dia. Modelo menor: a escolha da 3.1, que só vale medida. Teto é regra, não decisão do modelo: conferido antes da chamada, por cliente e por mês, e quem passou não chama o modelo; idem para entrada de tamanho absurdo, um áudio de dez minutos transcrito. O log tem uma linha por chamada, com cliente, modelo, tokens, custo, latência e resultado, e é de onde sai o número do README e o relatório da Denise; leva o identificador da mensagem e não o texto, como a 2.13 pediu. A margem fecha: custo contra o que o cliente paga.

Sala e oficina. A 1.6, a 2.13, a 3.1 e a 3.3 já foram dadas: referencie. Fica para depois: retry, que dobra o custo da mensagem que falhou (3.5); a conta inteira do negócio (5.3).

## Antes de começar

Confira no estado a pasta e o repositório da P3, e se a fluência da 3.3 passou: o endpoint responde. A P3 é corrigida no fim e a régua não está neste chat. Você não escreve o log nem escolhe o teto ou o modelo por ele: pergunte o que a Denise precisa ver no fim do mês e quanto um cliente pode custar antes de dar prejuízo, e trabalhe com a resposta. Os números vêm colados da oficina.

## Marcos

`node .claude/scripts/trilha.js milestone 3.4 <id>`:

- `tokens-e-preco`: ele sabe o que entra na conta de uma chamada e quanto vale cada lado. *Previsão, antes:* "bom dia denise, paguei o aluguel hoje, 2.800 no pix" tem dez palavras; quanto ele acha que a chamada da P3 cobra por ela, e de onde vem a maior parte? Caça quem acha que paga pelo tamanho da mensagem, e não pelo contexto em volta.
- `custo-por-execucao`: ele decompõe o custo de uma mensagem e acha o cliente pesado. *Aplicação:* a Denise quer saber quanto um cliente custa para decidir se o Essencial ainda fecha; que número ele dá a ela, e tirado de quem? Caça quem planeja pela média e não pelo pior caso.
- `reduzir`: ele sabe qual alavanca cabe na P3 e o que cada uma troca. *Conceito:* ele põe a mensagem do cliente no começo do prompt e o plano de contas depois, e liga o cache; o que acontece com a conta? Caça quem acha que o cache guarda pedaços soltos, e não o começo idêntico.
- `teto-e-log`: o teto é conferido antes de chamar o modelo, e cada chamada vira uma linha no log.
- `margem`: ele põe o custo por mensagem contra os R$ 3 do lançamento extra e o preço dos dois planos.

## Fluência

Na oficina, sobre a P3. **Você escolhe** cinco mensagens do material, com pelo menos uma da padaria e uma saudação, sem dizer a ele o destino de nenhuma; a saudação é para ele ver o custo de uma chamada sem lançamento. Ele as processa pelo sistema e cola o log. Depois, o teto barrando antes da chamada num cliente de teste, e o README com custo em reais, modelo, preço, câmbio e o teto de cada plano com o motivo. Refaça uma conta a partir dos tokens colados. Passa se o número do README sair do log e bater com a sua conta, se o teto barrar antes da chamada, e se ele disser qual pedaço do prompt pesa mais. Registre com `fluencia 3.4 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.5, Saída confiável e experiência. Gancho: hoje cada chamada virou uma linha no log com o resultado; na próxima, o que fazer quando esse resultado vem quebrado, sem a fila do Tiago cair.
