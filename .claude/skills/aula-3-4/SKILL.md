---
name: aula-3-4
description: Aula 3.4, Custo, teto e observabilidade. Sala e oficina: quanto cada mensagem da P3 custaria no plano pago, medido pelo log, e o teto por plano. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.4: Custo, teto e observabilidade

**Goal:** o aluno transforma a contagem de tokens da 3.3 em quanto cada mensagem custaria em reais no plano pago, sabe de onde vem cada centavo e quem é o cliente caro, conhece as três alavancas que baixam a conta e o que cada uma troca, e põe teto e log para ver o pesado antes de doer.

Contexto para discorrer, do seu jeito: a P3 roda no plano gratuito do provedor (o Gemini, recomendado; o Groq, alternativa) e não custa nada. A conta é de quanto custaria no pago, o número de que a Denise precisa para pôr preço quando o volume passar do gratuito, e com livro de cliente real ela nem poderia usar o gratuito, em que o provedor usa o que entra no produto dele (3.6). A 3.3 devolveu entrada e saída, cada uma com seu preço por milhão e por modelo; a saída custa várias vezes a entrada, e o raciocínio é cobrado como saída. O preço é em dólar, a Denise pensa em reais: câmbio e data vão no README. O que surpreende: a mensagem do cliente é a parte mais barata da chamada. Pesa o contexto em volta, plano de contas, regras, as mensagens anteriores dele, e uma saudação custa quase o mesmo que o aluguel na entrada. Por isso a média engana: a padaria manda quase o dobro de mensagens e tem o histórico mais longo. Quem manda três mensagens por lançamento custa o triplo, e a Denise cobra por lançamento. O token mais barato é o que não vai. Três alavancas. Cache: o começo idêntico entre chamadas sai por uma fração do preço, então o que é igual para os 140 vem antes do que é de um só. Lote: metade do preço, esperando até um dia, só no pago. Modelo menor: a escolha da 3.1, que só vale medida. Teto é regra, não decisão do modelo: conferido antes da chamada, por cliente e por mês, e quem passou não chama o modelo; idem para entrada de tamanho absurdo. Por baixo, o teto do provedor: o gratuito limita requisições por minuto e por dia e tokens por minuto, por projeto e não por chave, e o excesso volta com erro 429. Esse limite não sabe quem é o Nilton: um cliente que dispara gasta a cota dos 140, e o teto por cliente mora no código. O log tem uma linha por chamada, com cliente, modelo, tokens, custo, latência e resultado, o 429 incluído, e o identificador da mensagem, não o texto (2.13); dele saem o README e o relatório da Denise. A margem fecha: custo contra o que o cliente paga.

Sala e oficina. A 1.6, a 2.13, a 3.1 e a 3.3 já foram dadas: referencie. Fica para depois: retry, que dobra o custo e a cota da mensagem que falhou (3.5); a conta do negócio (5.3).

## Antes de começar

Confira no estado a pasta e o repositório da P3 e se a fluência da 3.3 passou. A P3 é corrigida no fim e a régua não está neste chat. Você não escreve o log nem escolhe teto ou modelo por ele: pergunte o que a Denise precisa ver no fim do mês e quanto um cliente pode custar, e trabalhe com a resposta. Preço, modelos do gratuito e limites mudam: ele confere na página oficial e no AI Studio dele, e você não cita número de memória.

## Marcos

`node .claude/scripts/trilha.js milestone 3.4 <id>`:

- `tokens-e-preco`: ele sabe o que entra na conta de uma chamada e quanto vale cada lado. *Previsão, antes:* "bom dia denise, paguei o aluguel hoje, 2.800 no pix" tem dez palavras; quanto a chamada da P3 custaria por ela no plano pago, e de onde vem a maior parte? Caça quem acha que paga pelo tamanho da mensagem, e não pelo contexto em volta.
- `custo-por-execucao`: ele decompõe o custo de uma mensagem e acha o cliente pesado. *Aplicação:* a Denise quer saber quanto um cliente custa para decidir se o Essencial ainda fecha; que número ele dá, e tirado de quem? Caça quem planeja pela média e não pelo pior caso.
- `reduzir`: ele sabe qual alavanca cabe na P3 e o que cada uma troca. *Conceito:* ele põe a mensagem do cliente no começo do prompt e o plano de contas depois, contando com o cache; o que acontece com a conta? Caça quem acha que o cache guarda pedaços soltos, e não o começo idêntico.
- `teto-e-log`: o teto por cliente é conferido antes de chamar o modelo e fica abaixo do limite do gratuito, e cada chamada vira uma linha no log.
- `margem`: ele põe o custo por mensagem contra os R$ 3 do lançamento extra e o preço dos dois planos.

## Fluência

Na oficina, sobre a P3. **Você escolhe** cinco mensagens do material, com pelo menos uma da padaria e uma saudação, sem dizer o destino de nenhuma; a saudação mostra o custo de uma chamada sem lançamento. Ele as processa pelo sistema e cola o log. Depois, um teste automatizado do repositório em que o teto barra um cliente sem chamar o modelo: é como a correção confere. E o README com quanto cada mensagem custaria no pago, em reais, com modelo, preço, câmbio e data, o limite do gratuito que ele leu, e o teto de cada plano com o motivo; credencial nenhuma. Refaça uma conta a partir dos tokens colados. Passa se o número do README sair do log e bater com a sua conta, se o teste do teto passar, e se ele disser qual pedaço do prompt pesa mais. Registre com `fluencia 3.4 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.5, Saída confiável e experiência. Gancho: hoje cada chamada virou uma linha no log; na próxima, o que fazer quando a resposta vem quebrada, e nasce a fila do Tiago.
