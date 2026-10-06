---
name: aula-6-2
description: Aula 6.2, Webhook e estado. Sala e oficina: o ataque à URL de retorno e ao webhook na P6, o webhook verificado, o estado no banco e os testes do acesso. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 6.2: Webhook e estado

**Goal:** o aluno liga o acesso da P6 ao pagamento de um jeito que resiste a quem não pagou: vê o ataque funcionar no projeto dele, só libera pelo que o servidor confirma com a Stripe, guarda o estado da assinatura no banco e o confere a cada uso, e prova o acesso com testes feitos a partir dos critérios dele.

Contexto para discorrer, do seu jeito: o Checkout devolve o cliente à `success_url`, e o atalho é liberar ali: voltou, pagou. A URL é pública: um clube de moldes de crochê que libera na página de obrigado vale de graça para o grupo de WhatsApp inteiro. O argumento da Stripe para o webhook é confiabilidade: o cliente pode cair antes da página, no boleto nem volta, e a renovação não volta a lugar nenhum. O de segurança é nosso (2.2). A Stripe recomenda liberar *também* no retorno, consultando a sessão no servidor e lendo o `payment_status`, nunca porque a URL abriu; e a sessão libera o cliente dela (o `customer` ou o `client_reference_id` da 6.1), nunca quem está logado abrindo a página. Quem prova que o webhook veio da Stripe é o `Stripe-Signature`, conferido pela biblioteca oficial com o `whsec_` e o corpo cru. O quickstart de assinaturas em Node só verifica se o segredo estiver configurado: falta a variável no deploy, e o forjado passa. No boleto, o `checkout.session.completed` chega com o boleto gerado, não pago, e a assinatura pode ficar `active` antes: quem libera no `completed` sem olhar `payment_status` libera para quem não pagou. A Stripe não garante ordem nem entrega única: guarda-se o ID de cada evento processado, e liberar duas vezes, mesmo em paralelo, dá no mesmo. O estado mora no banco, com os estados da 6.1, conferido pela feature no servidor a cada pedido. `canceled` e `unpaid` revogam; `past_due` é decisão dele, escrita. O evento pode carregar e-mail, endereço e documento: o corpo não vai ao log.

Sala e oficina. A 2.4, a 2.10 e a 6.1 já foram dadas: referencie. Fica para depois: README e demo (6.3), o endpoint no ar.

## Antes de começar

Confira no estado a pasta e o repositório da P6 e se a fluência da 6.1 passou: checkout de teste em cartão ligado ao usuário e uma rota da feature só para logado, sem olhar pagamento. Você não escreve teste nem código nem decide o que `past_due` faz: os critérios são dele, o agente implementa, vale a evidência colada. A régua da P6 não está aqui.

## Marcos

`node .claude/scripts/trilha.js milestone 6.2 <id>`:

- `o-erro-classico`: na oficina, num branch descartável (2.4), o agente liga o acesso à volta do navegador; ele abre, logado noutra conta, a URL de retorno de quem pagou, vê o acesso aparecer e descarta o branch. *Previsão, antes:* alguém cria conta grátis e abre, logado, a página de sucesso de quem pagou; o que o sistema faz? Caça quem acha que chegar à página prova o pagamento.
- `webhook-verificado`: o `stripe listen` encaminha à rota, com o `whsec_` dele (não o do painel), um `stripe trigger` chega com 200, e um `completed` inventado, sem assinatura, por `curl` contra localhost, volta recusado, também com a variável do segredo apagada (nunca 200); a rota ainda só confere e responde. *Conceito:* o boleto foi pago e a Stripe entrega o mesmo evento duas vezes, quase juntas; se a liberação soma trinta dias por evento, o que acontece, e o que impede? Caça quem acha que conferir o ID antes basta, com as duas chegando juntas.
- `estado-no-banco`: ele decidiu os estados, que evento muda cada um e onde a feature confere; um checkout com boleto (CPF de teste) vai até a página do boleto e a tela de espera acende pelo estado que o webhook gravou; sem boleto na sandbox, o mesmo pelo `stripe trigger` dos `async_payment`. *Aplicação, antes do boleto:* ele paga com boleto, o `completed` chega e a assinatura aparece `active`; o boleto vence sem pagar. O que o banco dele diz, e o que devia dizer? Caça quem lê `active` como "pagou".

## Fluência

Ele escreve aqui os quatro testes como critérios de aceitação: paga e acessa; não paga e não acessa (boleto gerado, URL de retorno, e a sessão paga de outro usuário aberta noutra conta); webhook falha e não libera (assinatura inválida, boleto vencido); renovação falha e perde. Cada um com o evento que entra e a resposta da feature. O primeiro começa com o mesmo usuário, sem evento, recusado: é o que o deixa vermelho contra o acesso solto. O evento é montado no teste e assinado com segredo de teste; o que consultaria a Stripe, o teste substitui, sem você ditar como. Vermelho colado, implementação, verde; depois, de novo, a URL de retorno, o `curl` forjado e a feature chamada por `curl` sem sessão. Passa se os critérios forem verificáveis, o vermelho vier antes do código, o verde for o mesmo teste, rodar sem rede nem chave, o ataque repetido não liberar nada e o log do `trigger` trouxer tipo, ID e resultado, sem o corpo. Os outros três seguem até a P6. Os `curl` viram receita: o README da P6 vai precisar deles prontos contra a URL no ar, sem credencial. Registre com `fluencia 6.2 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 6.3, Mostrar o trabalho. Gancho: o produto já recusa quem não pagou; na próxima, ele aprende a contar um sistema seu a quem nunca o viu.
