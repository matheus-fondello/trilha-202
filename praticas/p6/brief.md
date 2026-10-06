# Brief da P6 — O seu produto, no ar

> Desta vez também não há cliente. O problema é seu, o plano é seu, e a P6 é o produto que o plano da P5 descreve: ele é a spec. Você lê este brief na 6.1, no dia em que o repositório nasce, e o produto cresce na 6.1 e na 6.2; a 6.3 ensaia o README e a demo, e a prática fecha o resto. É a última entrega da trilha.

## O que é

Não é protótipo nem demonstração: é um negócio pequeno funcionando de ponta a ponta, num endereço público que qualquer pessoa abre. Um problema, uma feature, um preço, uma página, e o caminho do dinheiro entre eles fechado de verdade, em modo de teste.

O mínimo para chamar isso de negócio são cinco coisas.

**1. Uma página que vende.** A 1.9 de novo, agora com o produto seu. A pessoa da seção 1 do plano chega, entende em segundos o que é e para quem, vê o preço e tem uma ação: assinar. A página tem que convencer alguém a pagar, não só existir bonita, e tudo o que ela afirma tem de onde veio: o que você ouviu nas entrevistas, o que o produto faz, o que você mediu. Depoimento inventado e "milhares de clientes" não entram.

**2. Conta de usuário.** Alguém se cadastra, entra e é reconhecido. Não invente autenticação: use a do seu stack, como na 2.3. E cada estado da pessoa tem o que ela vê: sem assinatura, aguardando pagamento, ativa, renovação que falhou, cancelada. Foi o desenho da 6.1.

**3. A feature funcionando, com dado de verdade.** A da seção 2, no escopo da seção 7. Funcionando inteira, com entrada do tipo que a pessoa da seção 1 traria (tirada do que você ouviu, de fonte pública ou montada a partir disso, sem dado pessoal de ninguém), não lorem ipsum nem resposta fixa. Uma feature inteira vale mais que três pela metade: tenha a única hiper funcional.

**4. Assinatura, com o fluxo pagou → tem acesso fechado.** A Stripe, em sandbox, com o Checkout hospedado, no preço mensal em reais da seção 4. Quem libera o acesso é o seu servidor, quando a Stripe avisa pelo webhook e ele confere que o aviso veio mesmo dela; a volta do navegador para a página de sucesso, sozinha, não libera nada: se a página de retorno libera, é consultando a sessão no seu servidor, e para o cliente dela, nunca para quem estiver logado abrindo a página (a 6.2). Quando a Stripe desiste de cobrar a renovação (`unpaid` ou `canceled`), o acesso sai; o que acontece no meio, enquanto ela tenta de novo (`past_due`), é decisão sua, escrita. Cancelar e trocar o cartão funcionam (o portal do cliente da Stripe faz os dois). É a parte nova e é onde mora o aprendizado desta entrega: a 6.1 e a 6.2 inteiras. Se o seu plano não cobra por assinatura, a P6 vende o plano mensal mais próximo do seu modelo (um pacote de usos por mês, por exemplo), e o plano revisado diz o que isso muda.

**5. No ar.** Deploy com URL pública de produção, que abre sem login numa janela anônima. A URL de prévia protegida do provedor não serve.

## O pagamento

Sandbox, conta brasileira, criada no painel na 6.1 e nunca ativada. **Ninguém paga nada**: nem você, nem quem testa, nem quem confere. Se algum passo pedir documento, conta bancária ou cartão seu, pare e conte ao tutor o que viu.

A assinatura é em **cartão de teste**. Quando este brief foi escrito, em outubro de 2026, a conta brasileira da Stripe não tinha Pix Automático, que é a recorrência do Pix, e o Pix avulso aparecia ora liberado, ora sob convite. O Pix entra no seu produto como fato do mercado brasileiro, dito com honestidade, não como forma de pagamento que você é obrigado a ter. O estado **aguardando pagamento** é real e você o vive com o **boleto**: gerado agora, pago depois, e enquanto isso a tela diz o que falta e quanto leva, sem prometer o que não aconteceu. Se a sua sandbox não oferecer boleto, diga no README e mostre o aguardando pelo teste e pela tela com o estado posto à mão. Forma de pagamento e nome de tela mudam: vale a documentação da Stripe na data, nas referências da 6.1.

Quatro coisas que não se negociam, e que a 6.1 e a 6.2 puseram no seu projeto: a chave de servidor da Stripe e o segredo do webhook ficam em variável de ambiente do servidor, nunca no navegador nem no repositório; dado de cartão não chega perto do seu banco; o webhook só aceita evento com assinatura conferida, e sem o segredo configurado ele recusa, nunca aceita; e o log guarda o tipo, o ID e o resultado do evento, não o corpo dele.

## Se a feature usa IA

As regras da P3 valem inteiras. A chave do modelo fica no servidor, e é a do plano gratuito do Gemini ou do Groq: ninguém paga a API. Cada uso tem um teto por assinante, ligado ao preço e à margem da seção 5, conferido antes de chamar o modelo. A saída é validada antes de virar tela, e quando vem quebrada o produto diz que não entendeu em vez de inventar. O limite do gratuito vai aparecer, e o produto trata o erro sem quebrar nem perder o que a pessoa mandou. Cada chamada vai para o log com os tokens, que é de onde sai quanto o uso custaria no plano pago.

## Reaproveitar ou recomeçar

Por padrão, a P6 parte do motor da P3: a chamada no servidor, o schema validado, o teto, o log, o eval, com o domínio trocado para o seu problema. Reaproveitar, trazer só as peças ou recomeçar é o que o seu plano diz, e não conta ponto nem desconto; só precisa estar escrito, com o porquê. Se a sua ideia não usa IA, você recomeça, e a feature é a regra que você mesmo escreve, testada como a 2.10 ensinou.

## O que você entrega

- **A URL** do produto no ar, a de produção, e o **repositório público**.
- **O README em camadas**, o da 6.3. No topo, para quem não abre código: o problema, de quem, o que o produto faz, o preço e onde vê-lo funcionando. Depois, a prova de que funciona, com um print de cada estado da conta (sem assinatura, aguardando pagamento, ativa, renovação que falhou, cancelada), sem dado pessoal na tela: quem confere não entra na conta, e é por eles que vê o que ela vê. Depois, as decisões e o que ficou de fora, com o motivo, e uma vez em que o agente errou e você pegou, com a evidência. Embaixo, as receitas.
- **As receitas, para quem nunca viu o sistema.** Quem confere não tem senha nem usuário de nada, não paga, não abre o Checkout e não vai te perguntar nada. Então o README diz como rodar os testes, entre eles os quatro da 6.2 (paga e acessa; não paga e não acessa; webhook falha e não libera; renovação falha e perde), que rodam sem rede e sem chave; como rodar a feature nos casos dela, fora do site (o eval, se for o motor da P3); e traz três `curl` prontos contra o produto no ar, que qualquer um copia e roda: um evento de pagamento inventado, sem assinatura válida, mandado ao webhook, e recusado; a feature chamada sem sessão, e recusada; a página de retorno do Checkout aberta com um ID de sessão inventado, sem liberar nada. Tudo o que esses `curl` mandam é inventado: o ID do evento, o da sessão e o do usuário que o corpo cita, um que não existe no seu banco. Webhook, feature e página de retorno moram no mesmo endereço da URL que você registra: quem confere só alcança esse endereço. Escreva cada `curl` como ele roda e diga em que terminal; no PowerShell antigo do Windows, `curl` é outro comando.
- **O vídeo**, de até três minutos, num link que abre sem login, posto no README: o problema, o fluxo usado de verdade, a prova e uma decisão difícil, sem tour de código. O vídeo é para gente: o recrutador, a 202, o fundador que não vai rodar receita nenhuma. Nada de chave, `.env` ou dado pessoal na tela.
- **O plano da P5 revisado, no repositório**: o `plano.md` e a planilha, com o que mudou e por quê, seção por seção onde mudou. Construir ensina: o preço que foi para a Stripe, o corte que você fez no meio, o custo que o log mediu no lugar da estimativa, o risco que ficou maior ou menor. "Nada mudou" também é resposta, se for verdade. As pessoas das entrevistas continuam descritas pelo ofício, sem nome: o repositório é público.

Credencial nenhuma no README, no repositório, no histórico, no vídeo ou no chat: nem chave, nem segredo do webhook, nem senha, nem usuário de teste. O repositório traz um `.env.example` com o nome de cada variável, sem valor. O segredo que os testes usam para assinar o evento montado é inventado e tem cara de falso, diferente do que está no `.env`. A 2.6 ensinou o porquê.

## O que não há

Não há cliente para corrigir o rumo no meio do caminho, e não há resposta certa. Não há dinheiro de verdade, conta ativada nem Pix Automático. Não há formato de stack, de design nem de domínio. E não há prazo: a referência da trilha é cinco dias, umas doze horas além das aulas, e é referência.

Lembre do problema dos oitenta por cento: chegar perto do fim é rápido, fechar é lento, e é no último pedaço que mora o webhook em produção, o estado de erro e a tela que ninguém previu. Comece pelo caminho do dinheiro. Página bonita com checkout quebrado é um negócio que não existe; checkout fechado com página simples é um negócio pequeno, mas é um negócio.

## O que acontece no chat da P6

Você chega com o produto pela metade, e o trabalho é terminar. O tutor destrava ferramenta (o deploy, a variável que não chegou ao servidor, a Stripe CLI, o webhook que não chega em produção) e não decide conteúdo: preço, corte, tela e texto são seus, e ele não revisa antes da entrega. Você faz o inventário do que falta, fecha o README, põe tudo no ar, registra a entrega, e roda na frente dele as receitas do README como estão escritas.

## Depois da entrega

A correção acontece num chat novo, com quem não acompanhou o trabalho: ela lê este brief, o seu README e o plano revisado, roda os testes e a feature na sua pasta e chama o produto no ar pelas suas receitas, e devolve feedback, sem nota. Depois vem o Q6, o quiz do módulo, e com ele a trilha acaba. O que fica é o produto: a URL, o repositório e o vídeo vão para o portfólio que você montou na 6.3.
