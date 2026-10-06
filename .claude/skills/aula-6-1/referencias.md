# Referências, aula 6.1

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três cuidados que valem para a aula inteira. Os fatos da Stripe abaixo foram conferidos na documentação oficial em 05/10/2026, e **mudam**: disponibilidade de forma de pagamento, nome de tela, comportamento da sandbox. A documentação da Stripe sai em português com `?locale=pt-BR`, mas vários trechos continuam em inglês, e ela chama a sandbox de **área restrita** em português e de *sandbox* no painel em inglês: é a mesma coisa. A Stripe está no meio de trocas de nome (test clocks aparecem como *Simulations*, as ferramentas de desenvolvedor como Workbench). E toda página de integração da Stripe hoje oferece instalar habilidades de agente e a CLI logo no topo: não é desta aula; a CLI entra na 6.2.

**Não há vídeo nesta aula.** O painel e os nomes da Stripe mudaram em 2025 e 2026, e vídeo de terceiro sobre Checkout mostra tela que ele não vai achar. O ciclo do Checkout tem um diagrama oficial de dois minutos, que é a sugerida.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `o-fluxo-inteiro`**

- **Stripe, *Como funcionam as assinaturas*** — Stripe Docs, em português, sem data · consulta, não leitura
  https://docs.stripe.com/billing/subscriptions/overview?locale=pt-BR
  Os estados de uma assinatura (`incomplete`, `active`, `past_due`, `unpaid`, `canceled` e outros), as 23 horas para pagar a primeira fatura, `canceled` como estado final e a instrução de revogar o acesso em `unpaid`.

É consulta sua, para o desenho dele ter os estados certos; não mande ler, é a página mais técnica da aula. Se um pagamento de renovação que falha leva a `past_due` ou direto a `unpaid` depende de configuração do painel dele: diga isso em vez de escolher um. A regra completa de quando revogar, com os eventos, é da 6.2.

**marco `conta-de-usuario`**

- **Supabase, *Auth*** — Supabase Docs, em inglês, sem data · ~5 min de leitura
  https://supabase.com/docs/guides/auth
  A visão geral do que vem pronto: cadastro, login, sessão. É o "não invente autenticação" da 2.3 com nome.

- **Supabase, *User Management*** — Supabase Docs, em inglês, sem data · ~6 min de leitura
  https://supabase.com/docs/guides/auth/managing-user-data
  O perfil numa tabela `public.profiles` que aponta para o usuário do Auth, porque o esquema do Auth não sai na API. É onde mora o id do cliente na Stripe.

- **Supabase, *Creating a Supabase client for SSR*** — Supabase Docs, em inglês, sem data · consulta
  https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
  A sessão mora em cookie, e a página diz com todas as letras: no servidor, nunca confiar em `getSession()`, que lê o cookie sem revalidar; conferir com `getClaims()`.

- **Stripe, *Create a Checkout Session*** — Stripe API Reference, em inglês, sem data · consulta, não leitura
  https://docs.stripe.com/api/checkout/sessions/create
  Os campos que ligam a sessão ao usuário dele: `client_reference_id` e `customer`. Também `mode`, `success_url` e `cancel_url`.

A página da trigger que cria o perfil avisa que trigger quebrada bloqueia o cadastro: se o agente dele criar uma, o teste é cadastrar um usuário novo. A da sessão no servidor é consulta para você responder "como o servidor sabe quem é", sem pedir que ele leia código. A referência da API é sua.

**marco `sandbox-e-preco`**

- **Stripe, *Contas da Stripe*** — Stripe Docs, em português, sem data · ~3 min de leitura
  https://docs.stripe.com/get-started/account?locale=pt-BR
  Logo depois de criar a conta dá para usar a área restrita, sem movimentar dinheiro; configurar a conta é só para pagamento real.

- **Stripe, *Áreas restritas*** — Stripe Docs, em português com trechos em inglês, sem data · ~5 min de leitura
  https://docs.stripe.com/sandboxes?locale=pt-BR
  A sandbox geral contra a do modo de teste, e a recomendação da Stripe: integração nova vai numa geral, que isola dados e configurações da produção.

- **Stripe, *Chaves de API*** — Stripe Docs, em português, sem data · ~6 min de leitura
  https://docs.stripe.com/keys?locale=pt-BR
  A tabela das chaves: a publicável (`pk_`) pode ir para o navegador; a restrita (`rk_`) e a secreta (`sk_`) não. A Stripe não recomenda mais a secreta para uso novo.

Qual chave de servidor ele usa é decisão dele: a restrita é a recomendação da Stripe e pede escolher as permissões; a secreta funciona e tem poder total. O que não é decisão é onde ela mora (2.6). Não diga se o cadastro pede cartão: a documentação não fala, e ninguém conferiu com conta criada.

**marco `checkout-hospedado`**

- **Stripe, *Criar uma página de pagamentos*** — Stripe Docs, em português, sem data · ~4 min de leitura
  https://docs.stripe.com/payments/checkout?locale=pt-BR
  As três formas de pôr o pagamento na tela, com a página completa hospedada pela Stripe como a recomendada e a de menor manutenção.

- **Stripe, *Guia de segurança de integração*** — Stripe Docs, em português, sem data · ~8 min de leitura
  https://docs.stripe.com/security/guide?locale=pt-BR
  O argumento contra o formulário próprio: quem lida com número de cartão direto pode ter de cumprir mais de 300 controles do PCI DSS; com o Checkout, o dado vai direto para a Stripe.

- **Stripe, *Testes*** — Stripe Docs, em português, sem data · consulta
  https://docs.stripe.com/testing?locale=pt-BR
  O `4242 4242 4242 4242`, com qualquer data futura e qualquer CVC, e os cartões que recusam.

- **Stripe, *Disponibilize um portal do cliente aos seus clientes*** — Stripe Docs, em português, sem data · ~5 min de leitura
  https://docs.stripe.com/customer-management?locale=pt-BR
  Trocar cartão, ver fatura e cancelar, imediatamente ou no fim do período, numa página que a Stripe hospeda: o passo de cancelamento do desenho dele.

**marco `aguardando-pagamento`**

- **Banco Central do Brasil, *Pix Automático*** — bcb.gov.br, em português, sem data · ~4 min de leitura
  https://www.bcb.gov.br/estabilidadefinanceira/pix-automatico
  O que é, pela fonte: o pagador autoriza uma vez, define o valor máximo, e o banco agenda e avisa antes de cada cobrança.

- **Stripe, *Pagamentos com PIX*** — Stripe Docs, em português, sem data · ~6 min de leitura
  https://docs.stripe.com/payments/pix?locale=pt-BR
  A frase que decide a P6: "O Pix Automático não está disponível no Brasil". Sobre o Pix avulso, a página diz que a conta brasileira aceita; a tabela geral diz que é sob convite. A recorrência por Pix só existe para empresa de fora cobrando brasileiro.

- **Stripe, *Payment method support*** — Stripe Docs, em inglês, sem data · consulta
  https://docs.stripe.com/payments/payment-methods/payment-method-support?locale=pt-BR
  A tabela geral, onde o Pix aparece como "BR (Invite only)": a contradição com a página do Pix, que ninguém resolve sem conta criada.

- **Stripe, *Pagamentos por boleto*** — Stripe Docs, em português com trechos em inglês, sem data · ~3 min de leitura (o topo)
  https://docs.stripe.com/payments/boleto?locale=pt-BR
  O boleto como forma de pagamento só da conta brasileira, em reais, com a confirmação em até um dia útil: é o estado de espera que o desenho dele precisa ter.

- **Aurora Harley, *Visibility of System Status*** — Nielsen Norman Group, jun/2018 · ~9 min de leitura, em inglês
  https://www.nngroup.com/articles/visibility-system-status/
  A primeira heurística de usabilidade: o sistema sempre diz em que estado está, com retorno em tempo razoável. É a "tela honesta" com nome.

A página do Pix e a tabela geral se contradizem sobre o Pix avulso: diga que se confere na conta dele, sem prometer que vai aparecer. Pix Automático não se testa na conta dele, e você diz isso com a frase da página; criar conta de outro país para ter Pix Automático não é caminho da trilha. O boleto entra hoje só no desenho e na tela de espera em texto; testar o boleto na sandbox, com CPF de teste, é da 6.2, e a página do boleto no Checkout está nas referências dela.

## Sugeridas

**marco `o-fluxo-inteiro`**

- **Stripe, *Como funciona o Checkout* — seção "Checkout lifecycle"** — Stripe Docs, em inglês, sem data · ~2 min (quatro passos e um diagrama)
  https://docs.stripe.com/payments/checkout/how-checkout-works?payment-ui=stripe-hosted&locale=pt-BR#lifecycle
  O ciclo inteiro do Checkout hospedado em quatro passos e um diagrama de quem fala com quem: aplicação, servidor, Stripe, cliente.

Ofereça no painel quando o desenho dele já tiver os passos de antes do pagamento, para ele comparar com o que escreveu; não antes, senão ele copia. A seção está em inglês mesmo com o português pedido; o que importa é o diagrama. O quarto passo diz que um webhook libera o pedido: deixe a palavra no ar, é a 6.2. Ele lê a seção e para; o resto da página é configuração.
