# Referências, aula 6.2

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três cuidados que valem para a aula inteira. Os links da Stripe levam `locale=pt-BR`, como os da 6.1, e as âncoras são em inglês: use a URL exata daqui, porque âncora errada não dá erro, só abre a página no topo. Eventos, nomes de tela, a CLI e o próprio nome do ambiente de teste (hoje "sandbox", "área restrita" na versão em português) mudam sem aviso: se a página não bater com o que ele vê, vale a tela dele, e você não completa de memória. E a Stripe argumenta pelo webhook com **confiabilidade** (o cliente pode não voltar à página, a renovação nunca volta); o argumento de que qualquer um abre a URL de retorno sem pagar é nosso, decorrente, e não está na página dela. Não o atribua à Stripe. O do webhook forjado, esse sim, ela escreve.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `o-erro-classico`**

- **Stripe, *Executar pedidos* — seção "Execução de gatilhos na sua página de destino"** — Stripe Docs, em português, sem data · ~4 min de leitura (a seção e o aviso do topo)
  https://docs.stripe.com/checkout/fulfillment?payment-ui=stripe-hosted&locale=pt-BR#trigger-fulfillment-on-landing-page
  O aviso de que não dá para depender da página de retorno, porque não é garantido que o cliente chegue a ela, e a receita certa de liberar também ali: consultar a sessão na API, no servidor, e ler o `payment_status`.

A pergunta do marco é de previsão: só cite depois que ele responder e depois de ele ter visto, no branch descartável, o acesso aparecer para a outra conta. O que a página ensina fecha só metade do furo: consultar a sessão prova que ela foi paga, não que quem abriu a página é quem pagou; o que se libera é o cliente da sessão. O aviso em destaque fica no topo da página, acima da âncora; mande ler os dois. A página diz que o webhook é obrigatório para quem vende assinatura ou aceita pagamento com confirmação adiada, que é o caso dele duas vezes.

**marco `webhook-verificado`**

- **Stripe, *Receba eventos da Stripe no seu endpoint de webhook* — seção "Verificar se eventos são enviados da Stripe"** — Stripe Docs, em português, sem data · ~5 min de leitura (a seção)
  https://docs.stripe.com/webhooks?locale=pt-BR#verify-events
  A frase da Stripe sobre o ataque: sem verificação, um invasor manda evento falso para conceder acesso; e como conferir o `Stripe-Signature` com a biblioteca oficial, o segredo `whsec_` e o corpo cru.

- **Stripe, *Receba eventos...* — seção "Práticas recomendadas para uso de webhooks"** — Stripe Docs, em português, sem data · ~6 min de leitura (a seção inteira: duplicados é a primeira subseção, a resposta rápida é a última)
  https://docs.stripe.com/webhooks?locale=pt-BR#best-practices
  Evento duplicado acontece e se trata guardando o ID de cada evento processado, e o 2xx sai rápido, antes da lógica demorada.

- **Stripe, *stripe listen*** — Stripe CLI Reference, sem data · ~2 min de leitura
  https://docs.stripe.com/cli/listen?locale=pt-BR
  O `--forward-to` que encaminha os eventos da sandbox para a rota local e devolve o segredo de assinatura dele, que não muda entre reinícios.

- **Stripe, *stripe login*** — Stripe CLI Reference, sem data · ~1 min de leitura
  https://docs.stripe.com/cli/login?locale=pt-BR
  O passo que trava: nas versões da CLI acima da 1.50.0, o administrador da conta libera o acesso da CLI no painel antes de o login funcionar. Ele é o administrador da conta dele.

- **Stripe, *stripe trigger*** — Stripe CLI Reference, sem data · ~2 min de leitura
  https://docs.stripe.com/cli/trigger?locale=pt-BR
  Dispara um evento com objetos de verdade na sandbox, entre eles os do checkout, da fatura e da assinatura que a aula usa.

- **Stripe, *stripe-node* — seção "Testing Webhook signing"** — GitHub, README da biblioteca oficial, sem data · ~1 min de leitura
  https://github.com/stripe/stripe-node#testing-webhook-signing
  A biblioteca gera um cabeçalho de assinatura válido para um evento montado no teste, com um segredo de teste: é o que deixa os quatro testes da fluência rodarem sem rede e sem chave.

- **OWASP, *Logging Cheat Sheet* — seção "Data to exclude"** — OWASP Cheat Sheet Series, sem data · ~2 min de leitura (a seção)
  https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude
  A lista do que não vai para o log, ou vai mascarado: token, chave, identificador de governo, dado de cartão e dado pessoal sensível. É o "log limpo" da ementa, item por item.

A OWASP é em inglês. O log ele confere pela saída de um `stripe trigger`, sem ler código: o que aparecer além de tipo, ID e resultado sai, e isso é condição da fluência. Instalar a CLI é `npm install -g @stripe/cli` em qualquer sistema (o README da CLI no GitHub também dá Homebrew, winget e Scoop); o agente da oficina faz, e ele confere pela versão. A página de webhooks diz "Use ambas as proteções": a lista de IPs da Stripe e a assinatura. Diga isso como ela diz; a aula cobra a assinatura, e a lista de IPs fica como segunda camada que ele decide. O quickstart oficial de assinaturas (https://docs.stripe.com/billing/quickstart?locale=pt-BR) é a armadilha da aula, não referência para ele copiar: o exemplo em Node verifica o evento só se o segredo estiver definido, e senão usa o corpo como veio. Com a variável do segredo preenchida, ele recusa o forjado, e o defeito só aparece onde a variável falta, como num deploy sem ela: por isso o `curl` forjado do marco `webhook-verificado` roda também com a variável apagada, e tem de voltar recusado ou quebrar, nunca 200. O `stripe-node` volta na fluência: não dite o código, diga que a biblioteca tem como assinar um evento de teste e deixe o agente achar.

**marco `estado-no-banco`**

- **Stripe, *Pagamentos por boleto* — seção "Execute seu pedidos"** — Stripe Docs, em português, sem data · ~2 min de leitura (a tabela)
  https://docs.stripe.com/payments/boleto/accept-a-payment?payment-ui=checkout&locale=pt-BR#fulfill-your-orders
  A tabela que desmonta o atalho: `checkout.session.completed` quer dizer que a Stripe gerou o boleto, e só o `async_payment_succeeded` quer dizer pago; o `async_payment_failed` é o boleto vencido.

- **Stripe, *Visão geral das assinaturas* — seção "Formas de pagamento com confirmação de pagamento adiada"** — Stripe Docs, em português, sem data · ~1 min de leitura (a seção)
  https://docs.stripe.com/billing/subscriptions/overview?locale=pt-BR#delayed-payment-confirmation
  A assinatura paga por forma adiada pode ir direto para `active` sem passar por `incomplete`, e continua `active` se o pagamento falhar depois.

- **Stripe, *Usar webhooks com assinaturas* — seção "Capturar alterações de status de assinaturas"** — Stripe Docs, em português, sem data · ~3 min de leitura (a seção e a tabela de status)
  https://docs.stripe.com/billing/subscriptions/webhooks?locale=pt-BR#state-changes
  `canceled` e `unpaid` revogam o acesso, e o que acontece depois de uma renovação que falha (`past_due`, `canceled` ou `unpaid`) depende da configuração que ele escolhe no painel.

As duas primeiras só depois da resposta à pergunta de aplicação, senão respondem por ele. O boleto de teste usa o CPF `000.000.000-00`; com um e-mail comum ele se paga sozinho em cerca de três minutos, e `succeed_immediately@` no começo do e-mail paga em segundos. Se a sandbox dele não mostrar o boleto, `stripe trigger checkout.session.async_payment_succeeded` e `..._failed` fazem o mesmo papel. A tabela de status é longa; mande ler as linhas de `active`, `past_due`, `canceled` e `unpaid`. O que `past_due` faz com o acesso é decisão dele, escrita no README; a página não decide por ele. Para gerar a falha de renovação à mão, a página de testes de faturamento (https://docs.stripe.com/billing/testing?locale=pt-BR#payment-failures) traz o cartão que falha só na cobrança seguinte, mas a fatura leva cerca de uma hora para abrir: na aula, o teste montado da fluência é o caminho; não prometa receita mais rápida, nenhuma está escrita na documentação.

## Sugeridas

**marco `webhook-verificado`**

- **Stripe Developers (James Beswick), *Webhook handling – Building rock-solid Stripe integrations #1*** — YouTube, canal oficial, jun/2025 · 6 min
  https://www.youtube.com/watch?v=47sSju0UhPk&hl=en&persist_hl=1
  Os três cuidados do marco na voz de quem faz a Stripe: verificar a assinatura, aguentar o evento duplicado e responder rápido, processando depois.

Uma só sugerida, curta, colada ao marco: ofereça depois da resposta à pergunta de conceito, como conferência. Em inglês. O código que aparecer na tela não é o do projeto dele, e não vira instrução para o agente: vale o mecanismo. A descrição do vídeo aponta a página de requisições idempotentes da API: ela trata da chave de idempotência nas chamadas que o servidor faz à Stripe, não do evento duplicado que chega ao webhook. Não confunda as duas.
