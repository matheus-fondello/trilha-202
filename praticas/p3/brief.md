# Brief da P3 — Prado Contabilidade, o lançador

> Cliente fictício da 202, diferente do da P1 e da P2. O escritório não existe; os clientes dele, os planos e as mensagens são inventados e consistentes entre si, e você deve tratá-los como se fossem reais. As mensagens e o histórico estão em `praticas/p3/mensagens.md`: são o material de trabalho, e o único dado que você tem.

## O pedido

Sou a Denise, do Prado Contabilidade, em Piracicaba. Somos eu, o Tiago e a Aline na parte de lançamentos, e a Sônia no fiscal. Atendemos 140 empresas pequenas: padaria, oficina, salão, estúdio de pilates, loja de roupa, gente que presta serviço. Quase todas no Simples Nacional ou MEI.

O meu problema é o WhatsApp. O cliente pequeno não tem sistema, não tem planilha, e não vai ter. O que ele tem é o meu número. Ele paga o aluguel e me manda "paguei o aluguel, 2.800". Compra farinha e manda a foto da nota. Recebe do iFood e manda "entrou 6 mil do ifood". São mais ou menos cinco mil mensagens por mês, e cada uma vira um lançamento que o Tiago ou a Aline digitam no nosso sistema, depois de entender o que o cliente quis dizer, achar a categoria certa e, muitas vezes, perguntar de volta o que faltou. Dá uns três minutos por mensagem quando vai bem. São umas 250 horas por mês de gente lendo WhatsApp e digitando, e é o que impede a gente de pegar mais cliente.

Quero que a mensagem vire o lançamento sozinha, e que o Tiago e a Aline passem a **conferir** em vez de digitar. Conferir é rápido: olha, está certo, aprova. O que eles não podem é deixar de olhar. Lançamento errado é imposto errado, e quem responde sou eu.

## Três coisas

O lançador e a fila são o que eu preciso. A pergunta pronta é o que eu queria. Se não couber, corta a pergunta e me diz.

**1. O lançador.** Entra a mensagem do cliente, do jeito que ela chega: texto, áudio transcrito, e a foto da nota quando tem. Ele manda em duas ou três mensagens o que é uma coisa só, então as anteriores dele fazem parte da leitura. Sai o lançamento pronto para o nosso sistema: data, valor, tipo (receita, despesa, ou movimento que não é nenhum dos dois), categoria do nosso plano de contas, forma de pagamento, com quem foi, e uma descrição curta. Uma mensagem pode ter mais de um lançamento e pode não ter nenhum. E quando a mensagem não dá para lançar, porque faltou o valor, ou não dá para saber o que é, eu não quero um chute bonito: quero uma pendência na fila dizendo o que falta perguntar ao cliente. O plano de contas e as regras da casa estão no material.

**2. A fila de conferência.** É a tela do Tiago e da Aline. Cada lançamento que o sistema montou aparece com a mensagem original ao lado, eles aprovam, corrigem ou mandam de volta. A maioria é olhar e aprovar. Mas tem coisa que eu quero que chegue **com aviso**, para eles lerem devagar em vez de só clicar: lançamento grande, e tudo que a máquina não tinha como ter certeza. As regras dizem o que é. O que foi aprovado sai num arquivo que o nosso sistema importa (uma linha por lançamento; as colunas estão no material). Cada um vê os seus clientes: o Tiago cuida de 70 e a Aline de 70, e um não pode ver o do outro, porque já tivemos lançamento no cliente errado. Eu vejo tudo.

**3. A pergunta de volta.** Quando falta alguma coisa, hoje quem cuida do cliente escreve para ele à mão. Se o sistema já sabe o que falta, quero a pergunta pronta, na nossa voz, curta, para o Tiago ou a Aline mandarem. Se der para mandar sozinha pelo WhatsApp, melhor ainda, mas isso eu deixo com você.

## Como a gente faz hoje, e onde é fraco

- **Ler e entender.** O Tiago abre a conversa, lê a mensagem, e se precisar rola para cima para lembrar o que aquele cliente costuma mandar. "Pix pro Marcão 450" não diz nada para quem não sabe que o Marcão é quem conserta o forno da padaria. Com 70 clientes cada um, eles sabem de cor uns quarenta; nos outros trinta, perguntam de novo o que já perguntaram no mês passado.
- **Categoria.** Nosso plano de contas tem trinta e poucas categorias, e a escolha segue regras que estão na cabeça deles, não escritas em lugar nenhum. Eu escrevi as principais para você no material, e é a primeira vez que elas estão em texto.
- **O que dói.** Receita na categoria errada muda o imposto do cliente: na oficina, peça é venda de mercadoria e mão de obra é serviço, e o Simples cobra diferente de cada um. Despesa pessoal do sócio lançada como despesa da empresa infla o resultado e a gente diz para ele que pode distribuir um lucro que não existe. E dinheiro que entra de sócio, de banco ou de familiar lançado como receita paga imposto sobre o que não era venda. Os três erros já aconteceram aqui, com gente digitando. Não aceito que aconteçam mais com máquina do que acontecem com gente.
- **Quem manda na categoria somos nós.** Cliente e fornecedor palpitam: "lança como despesa", "isso é isento", "põe como devolução". Não decide nada. A categoria sai da nossa regra, e quando alguém tenta mandar, é justamente o lançamento que eu quero que chegue com aviso.
- **Perguntar.** Metade das perguntas é sempre a mesma: quanto, e isso é seu ou da empresa. A outra metade é caso.
- **Volume.** Tem cliente que manda tudo, inclusive o mercado da casa e o churrasco de domingo, e a gente lança o que é da empresa e ignora o resto. Não quero máquina gastando leitura com o churrasco de ninguém, nem agora, nem quando isso passar a ser cobrado.

## Como cobramos, e o que isso significa para você

Cobramos por plano: **Essencial**, R$ 290 por mês com até 80 lançamentos; **Completo**, R$ 490 com até 250; e acima disso, R$ 3,00 por lançamento extra.

Me disseram que, para começar, dá para rodar isso sem pagar nada, e que é quando o volume cresce que passa a ser cobrado por mensagem. Ótimo para testar, mas eu não decido preço pelo de graça. Com cinco mil mensagens por mês, a gente passa do gratuito, e aí cada mensagem processada vai custar alguma coisa. Se custar mais do que uns centavos, o negócio não fecha. Então eu preciso saber exatamente quanto **me custaria** cada mensagem, em reais, quando passar do gratuito, antes de decidir se isso entra no preço ou se vira um serviço à parte.

E quero um teto de mensagens por cliente por mês, na casa do plano dele: ninguém manda muito mais mensagem do que lançamento. O cliente do Essencial que manda 400 mensagens não pode me custar 400 vezes: a partir de um ponto, a mensagem fica na fila para o Tiago olhar à mão, como hoje, e eu fico sabendo que aquele cliente está no plano errado. Me disseram também que o de graça tem limite de uso por minuto e por dia, e que a gente vai bater nele. Quando bater, nada de tela quebrada nem mensagem perdida: a mensagem espera e passa depois, ou cai na fila para olhar à mão, e o Tiago vê que foi isso.

Não vou dizer como o sistema tem que ler mensagem. Estou dizendo como a gente lê e onde a gente erra.

## Quem usa

- **O Tiago e a Aline.** Na tela o dia inteiro, entre o telefone e o WhatsApp. Precisam ver a mensagem original e o lançamento lado a lado e resolver em segundos. Quando o sistema não entendeu, precisam ver isso na hora, não descobrir depois que um lançamento inventado passou.
- **Eu.** Vejo tudo, quero saber quanto o mês teria custado se a gente já estivesse pagando, e quem passou do teto. Não quero mexer em mais nada.
- **O cliente.** Não usa nada. Continua mandando mensagem para o meu número como sempre. Se receber pergunta, tem que parecer que foi a gente que escreveu.

## O que temos de dado

- **As mensagens.** Um mês de conversa de quatro clientes, exportado do WhatsApp com data e hora, anonimizado. Está no material. É assim que eles escrevem, e é com isso que você tem que funcionar. Tirei o que era só conversa e as fotos, porque não dá para anonimizar nota fiscal; onde tinha foto, está marcado.
- **O histórico.** Os lançamentos aprovados dos últimos meses de cada cliente, exportados do nosso sistema. É o que o Tiago rola para cima para lembrar. Consigo exportar isso de qualquer cliente. E tenho uma ideia: se o sistema aprender com os 140 de uma vez, o Marcão da padaria ensina o sistema sobre todos os Marcãos. Nunca se sabe o que vai servir.
- **O plano de contas e as regras da casa.** No material. As regras são as que estão na cabeça do Tiago e da Aline, escritas por mim numa tarde. Se você achar contradição, é porque existe.
- **As colunas do arquivo** que o nosso sistema importa. No material.

## O que não entra

Conciliação bancária não entra: a gente continua batendo o extrato do jeito que bate. Nota fiscal eletrônica não entra, o XML já chega por outro caminho. O sistema não fala com o nosso sistema contábil, ele gera o arquivo e a gente importa. E ele não decide sozinho: nada entra no nosso sistema sem um dos três ter aprovado.

## O que você entrega

O sistema no ar e o repositório público. Dentro dele: o resultado do eval, com os casos e o número; quanto custaria cada mensagem processada quando passar do gratuito, em reais, saído do que o sistema mediu de verdade e não estimado; e um README com as decisões, o que ficou de fora e por quê, quanto custaria e onde está o teto, o que o eval mede e quanto deu, e o que o sistema nunca faz sozinho, incluindo o que acontece quando uma mensagem tenta mandar nele.

Quem for conferir o seu trabalho não vai ter senha nem usuário de nada, e nenhuma senha vai para o repositório, que é público. Então o README também diz como rodar os testes, como rodar o eval de novo, e traz um exemplo pronto de mensagem mandada ao sistema no ar, que qualquer um copia e roda. E que o Tiago não vê os clientes da Aline eu quero provado num teste que qualquer um roda, não numa promessa.
