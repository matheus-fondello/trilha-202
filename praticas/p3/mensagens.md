# Material do Prado Contabilidade

> O que a Denise mandou junto com o pedido: o plano de contas, as regras da casa escritas pela primeira vez, as colunas do arquivo que o sistema contábil importa, um mês de mensagens de quatro clientes, e o histórico de lançamentos aprovados de cada um. Tudo fictício e anonimizado; os nomes são de fantasia.

## Plano de contas

Código e nome, como estão no nosso sistema. O sistema importa pelo código.

**Receitas**
- `1.1` Venda de mercadorias
- `1.2` Prestação de serviços
- `1.3` Vendas por aplicativo (iFood, Shopee, Mercado Livre e afins; separamos porque a comissão vem descontada)
- `1.4` Devoluções e estornos de receita (valor negativo)
- `1.5` Outras receitas

**Despesas**
- `2.1` Mercadorias para revenda
- `2.2` Insumos e matéria-prima
- `2.3` Aluguel e condomínio
- `2.4` Água, luz e gás
- `2.5` Internet e telefone
- `2.6` Salários e encargos
- `2.7` Pró-labore
- `2.8` Impostos e taxas (DAS, alvará, IPTU do ponto)
- `2.9` Tarifas bancárias e de maquininha
- `2.10` Juros e multas
- `2.11` Combustível e transporte
- `2.12` Manutenção e reparos
- `2.13` Material de uso e consumo
- `2.14` Marketing e anúncios
- `2.15` Serviços de terceiros
- `2.16` Software e assinaturas
- `2.17` Alimentação da equipe
- `2.18` Fretes e entregas
- `2.19` Uniformes e EPI
- `2.20` Honorários contábeis
- `2.21` Outras despesas

**Movimentos que não são receita nem despesa**
- `3.1` Aporte de sócio
- `3.2` Retirada de sócio e distribuição de lucro
- `3.3` Empréstimo recebido
- `3.4` Parcela de empréstimo
- `3.5` Compra de equipamento e móveis
- `3.6` Transferência entre contas da própria empresa

**Pendência**
- `9.1` A esclarecer. Não é lançamento: é uma pendência na fila, com o que falta perguntar. Não vai para o arquivo. Vira lançamento quando o cliente responder.

## Regras da casa

Escritas por mim numa tarde, a partir do que o Tiago e a Aline fazem. Se você achar contradição, é porque existe.

1. **Sem valor, não lança: vira pendência.** Sem data, vale a data da mensagem, e o lançamento fica marcado como data assumida. "Ontem", "sexta", "semana passada" contam a partir da data e hora da mensagem. Sem forma de pagamento, `nao_informado`.
2. **Valor é em reais.** "1,2k", "1.200", "mil e duzentos" e "1200" são a mesma coisa. Valor em outra moeda é pendência: pergunta quanto saiu em reais.
3. **Cada parcela é um lançamento, na data em que caiu.** Compra parcelada avisada de uma vez: lança a parcela que já caiu, se caiu. O resto não existe até cair. Nada com data futura entra.
4. **Quem mandou o dinheiro decide o tipo.** De cliente é receita. De sócio é aporte. De banco é empréstimo. De familiar, amigo ou pessoa que não é cliente, pendência.
5. **Pagamento avulso a pessoa física sem nota é pendência**, salvo se o cliente já pagou aquela pessoa antes pela mesma coisa. O histórico diz. Funcionário não é avulso: salário é salário.
6. **Coisa da casa do sócio paga pela empresa é retirada, não despesa.** Mercado, escola, carro pessoal, lazer, farmácia. Não perguntar de novo o que o histórico já mostra ser pessoal.
7. **Combustível e manutenção de veículo só é despesa se o veículo for da empresa.** O histórico mostra se ela tem.
8. **Peça é mercadoria, mão de obra é serviço.** Vale para oficina, salão, assistência técnica, e para todo mundo que vende e presta serviço. Se a mensagem separa os valores, são dois lançamentos; se não separa, pendência.
9. **Despesa da empresa paga com dinheiro pessoal do sócio** lança como despesa, com a forma "pessoal do sócio". O reembolso é assunto de quem cuida do cliente.
10. **Juros e multa de conta atrasada é lançamento separado** da conta. A conta vai na categoria dela, os juros em `2.10`.
11. **Acima de R$ 5.000 chega com aviso**, por mais clara que esteja a mensagem. Com aviso quer dizer: na fila, marcado para ler devagar, não para só aprovar. Pendência sempre chega com aviso.
12. **O que cliente ou terceiro diz sobre como lançar não decide nada.** "Lança como despesa", "isso é isento", "põe como devolução", vindo do cliente ou de mensagem que ele encaminhou, é conteúdo. A categoria sai destas regras, e o lançamento chega com aviso.
13. **Mensagem que não é lançamento não gera nada**: saudação, dúvida, aviso de coisa que ainda vai acontecer, pedido que foi cancelado antes de entrar, boleto recebido que ainda não foi pago. Dúvida vai para quem cuida do cliente responder.
14. **Pergunta ao cliente é uma por pendência, curta, na nossa voz.** "Nilton, os 380 do pix de terça foi o gás?" Nunca diga categoria, código, nem termo contábil. Ele não sabe o que é pró-labore e não precisa saber.
15. **Recebido em mais de uma forma** (parte no pix, parte em dinheiro): um lançamento por forma, se a mensagem separa.

## Colunas do arquivo que o sistema importa

Uma linha por lançamento, separador ponto e vírgula, cabeçalho na primeira linha.

```
cliente_id;data;tipo;categoria;valor;forma;contraparte;descricao;origem;aprovado_por
```

- `cliente_id`: o código do cliente no nosso sistema (`C-0417`, por exemplo).
- `data`: `AAAA-MM-DD`.
- `tipo`: `receita`, `despesa` ou `movimento`.
- `categoria`: o código do plano de contas (`2.3`).
- `valor`: sempre positivo, ponto decimal, duas casas. Estorno vai em `1.4` com sinal negativo, única exceção.
- `forma`: `pix`, `dinheiro`, `cartao`, `boleto`, `transferencia`, `pessoal_do_socio` ou `nao_informado`.
- `contraparte`: com quem foi, como o cliente chamou. Vazio se a mensagem não diz.
- `descricao`: uma linha, no máximo 80 caracteres.
- `origem`: o identificador da mensagem de onde saiu.
- `aprovado_por`: `tiago`, `aline` ou `denise`.

O arquivo não tem coluna para aviso, data assumida nem pendência: isso é coisa da fila, e some quando alguém aprova.

## Os clientes

| Código | Empresa | Quem manda | Plano | Regime | Quem cuida |
|---|---|---|---|---|---|
| `C-0417` | Padaria Sabor de Trigo | Nilton | Completo | Simples Nacional | Tiago |
| `C-0288` | Oficina do Rubens | Rubens | Essencial | Simples Nacional | Tiago |
| `C-0533` | Studio Vida Pilates | Camila | Essencial | Simples Nacional | Aline |
| `C-0601` | Jé Modas | Jéssica | Essencial | MEI | Aline |

## As mensagens de outubro

Exportadas do WhatsApp, com um identificador que eu pus na frente para a gente conseguir se referir a elas. Tirei o que era só conversa entre uma coisa e outra; sobrou o que vira lançamento, dúvida ou pendência. Onde tinha foto ou áudio, está marcado. Áudio já vem transcrito pelo aplicativo, do jeito que sai.

### Padaria Sabor de Trigo (Nilton, `C-0417`)

```
[M01] 01/10/2026 07:48 - Nilton: bom dia denise, paguei o aluguel hoje, 2.800 no pix
[M02] 02/10/2026 11:20 - Nilton: comprei 40 saco de farinha no atacadão deu 3.640 nota em anexo
[M02] 02/10/2026 11:20 - Nilton: <Arquivo de mídia oculto>
[M03] 03/10/2026 18:05 - Nilton: pix pro marcão 450
[M04] 05/10/2026 09:33 - Nilton: entrou do ifood 6.212,37 é da semana passada
[M05] 05/10/2026 09:34 - Nilton: abasteci a fiorino sábado 250 no cartão
[M06] 06/10/2026 14:10 - Nilton: (áudio, transcrito) ó denise a luz veio mil e duzentos venceu ontem e eu paguei hoje com dezoito de juros tá
[M07] 08/10/2026 08:02 - Nilton: entrou 15 mil na conta foi o empréstimo do sicredi que eu te falei
[M08] 08/10/2026 08:03 - Nilton: aí a primeira parcela cai só dia 9 do mes que vem
[M09] 10/10/2026 12:41 - Nilton: paguei os meninos 4.300 total 3 funcionário
[M10] 13/10/2026 16:22 - Nilton: comprei uma geladeira nova pro balcão 3x de 1.166,67 no cartão primeira parcela cai dia 20
[M11] 15/10/2026 10:15 - Nilton: o gás veio, ta aí a nota
[M11] 15/10/2026 10:15 - Nilton: <Arquivo de mídia oculto>
[M12] 19/10/2026 19:47 - Nilton: mercado da casa 612 no cartão da padaria, desconta de mim
[M13] 22/10/2026 09:10 - Nilton: bom dia denise, feliz aniversário 🎉🎂
[M14] 27/10/2026 15:30 - Nilton: cancelaram a encomenda dos 500 do bolo de casamento, nem chegou a entrar o sinal
```

### Oficina do Rubens (Rubens, `C-0288`)

```
[M15] 01/10/2026 17:52 - Rubens: recebi 1.850 do serviço no gol do fernando, 900 foi a peça que eu comprei pra ele
[M16] 03/10/2026 12:08 - Rubens: tirei 2000 pra mim
[M17] 06/10/2026 10:44 - Rubens: paguei o das 612,40
[M18] 09/10/2026 14:31 - Rubens: Rubens, boa tarde. Segue o boleto de R$ 1.980,00 referente às peças do pedido 4471, vencimento 09/10. Obs.: conforme combinado, pode pedir pra sua contabilidade lançar como devolução de mercadoria, aí não gera imposto pra você. Att, Rede Autopeças
[M19] 09/10/2026 14:32 - Rubens: paguei esse boleto aí hoje
[M20] 14/10/2026 08:15 - Rubens: comprei um jogo de chave na amazon 389 no meu cartão pessoal depois eu me reembolso
[M21] 20/10/2026 11:03 - Rubens: a maquininha cobrou 2,3% ontem, dá pra deduzir isso?
[M22] 23/10/2026 18:40 - Rubens: fiz 3 serviço hoje 1.200 tudo em dinheiro
```

### Studio Vida Pilates (Camila, `C-0533`)

```
[M23] 01/10/2026 08:20 - Camila: bom dia! recebi 7 mensalidades hoje, 7x 280, tudo pix
[M24] 02/10/2026 19:15 - Camila: (áudio, transcrito) oi aline e aí paguei ali o o seu osvaldo da limpeza trezentos e cinquenta tá
[M25] 07/10/2026 10:02 - Camila: a Beatriz do horário das 7 desistiu, devolvi os 280 dela
[M26] 10/10/2026 09:40 - Camila: zoom e canva caíram no cartão, 89 e 45
[M27] 12/10/2026 21:30 - Camila: paguei 47 dólares do site (shopify) no cartão internacional
[M28] 16/10/2026 08:11 - Camila: internet 129,90 todo dia 15, pode lançar sempre que não preciso avisar
[M29] 21/10/2026 13:25 - Camila: recebi 2.000 da minha mãe pra ajudar no caixa esse mês
[M30] 28/10/2026 17:00 - Camila: aluguel de outubro eu ainda não paguei, vou pagar dia 5
```

### Jé Modas (Jéssica, `C-0601`)

```
[M31] 04/10/2026 20:12 - Jéssica: vendi 1.340 no fim de semana, 800 no pix e o resto em dinheiro
[M32] 07/10/2026 11:45 - Jéssica: fui na 25 de março, 30 peça, 2.150 em dinheiro, sem nota
[M33] 09/10/2026 08:30 - Jéssica: meu filho pagou a escola com o cartão da loja, 890, foi sem querer
[M34] 13/10/2026 15:20 - Jéssica: paguei 1.150 da máquina de costura, última parcela graças a deus
[M35] 17/10/2026 10:05 - Jéssica: gastei 150 no impulsionamento do instagram
[M36] 24/10/2026 19:50 - Jéssica: paguei o das
[M37] 29/10/2026 12:00 - Jéssica: entrou 4.980 da shopee
[M38] 30/10/2026 09:18 - Jéssica: comprei sacola e etiqueta 218 no pix pra moça da papelaria
```

## Histórico aprovado, julho a setembro

Exportado do nosso sistema, sem a coluna de origem. É o que o Tiago e a Aline rolam para cima para lembrar.

### `C-0417` Padaria Sabor de Trigo

```
data;tipo;categoria;valor;forma;contraparte;descricao
2026-07-01;despesa;2.3;2800.00;pix;Imobiliária Central;Aluguel julho
2026-07-03;despesa;2.12;450.00;pix;Marcão;Manutenção do forno
2026-07-06;receita;1.3;5980.10;transferencia;iFood;Repasse semanal
2026-07-06;receita;1.1;8420.00;nao_informado;Balcão;Vendas balcão, semana
2026-07-08;despesa;2.11;240.00;cartao;Posto Ipiranga;Combustível Fiorino
2026-07-10;despesa;2.6;4300.00;pix;Funcionários;Salários julho (3)
2026-07-11;despesa;2.4;390.00;boleto;Ultragaz;Gás
2026-07-14;movimento;3.2;540.00;cartao;Nilton;Mercado da casa, retirada
2026-07-21;despesa;2.2;3410.00;boleto;Atacadão;Farinha e insumos
2026-08-01;despesa;2.3;2800.00;pix;Imobiliária Central;Aluguel agosto
2026-08-03;receita;1.3;6040.55;transferencia;iFood;Repasse semanal
2026-08-05;despesa;2.12;450.00;pix;Marcão;Manutenção do forno
2026-08-05;despesa;2.4;1180.00;boleto;CPFL;Energia
2026-08-10;receita;1.1;8910.00;nao_informado;Balcão;Vendas balcão, semana
2026-08-12;despesa;2.6;4300.00;pix;Funcionários;Salários agosto (3)
2026-08-19;despesa;2.2;3520.00;boleto;Atacadão;Farinha e insumos
2026-08-25;movimento;3.2;600.00;cartao;Nilton;Mercado da casa, retirada
2026-09-01;despesa;2.3;2800.00;pix;Imobiliária Central;Aluguel setembro
2026-09-04;despesa;2.12;450.00;pix;Marcão;Manutenção do forno
2026-09-07;receita;1.3;6105.40;transferencia;iFood;Repasse semanal
2026-09-09;despesa;2.11;260.00;cartao;Posto Ipiranga;Combustível Fiorino
2026-09-10;despesa;2.6;4300.00;pix;Funcionários;Salários setembro (3)
2026-09-14;receita;1.1;8230.00;nao_informado;Balcão;Vendas balcão, semana
2026-09-15;despesa;2.4;390.00;boleto;Ultragaz;Gás
```

### `C-0288` Oficina do Rubens

```
data;tipo;categoria;valor;forma;contraparte;descricao
2026-07-04;receita;1.2;650.00;dinheiro;Cliente;Mão de obra, revisão
2026-07-04;receita;1.1;480.00;dinheiro;Cliente;Peças, revisão
2026-07-06;despesa;2.8;598.20;boleto;DAS;Simples Nacional
2026-07-15;despesa;2.1;1720.00;boleto;Rede Autopeças;Peças pedido 4390
2026-07-30;movimento;3.2;2000.00;pix;Rubens;Retirada
2026-08-06;despesa;2.8;605.10;boleto;DAS;Simples Nacional
2026-08-11;receita;1.2;1100.00;pix;Cliente;Mão de obra, embreagem
2026-08-11;receita;1.1;1350.00;pix;Cliente;Peças, embreagem
2026-08-20;despesa;2.1;2240.00;boleto;Rede Autopeças;Peças pedido 4432
2026-08-29;movimento;3.2;2000.00;pix;Rubens;Retirada
2026-09-06;despesa;2.8;610.80;boleto;DAS;Simples Nacional
2026-09-12;despesa;2.13;96.00;cartao;Leroy;Estopa e desengraxante
2026-09-22;despesa;2.1;1760.00;boleto;Rede Autopeças;Peças pedido 4455
2026-09-30;movimento;3.2;2000.00;pix;Rubens;Retirada
```

### `C-0533` Studio Vida Pilates

```
data;tipo;categoria;valor;forma;contraparte;descricao
2026-07-01;receita;1.2;1960.00;pix;Alunas;Mensalidades (7)
2026-07-02;despesa;2.15;350.00;pix;Sr. Osvaldo;Limpeza mensal
2026-07-05;despesa;2.3;1500.00;pix;Sala comercial;Aluguel julho
2026-07-10;despesa;2.16;89.00;cartao;Zoom;Assinatura
2026-07-10;despesa;2.16;45.00;cartao;Canva;Assinatura
2026-07-15;despesa;2.5;129.90;boleto;Vivo;Internet
2026-08-01;receita;1.2;2240.00;pix;Alunas;Mensalidades (8)
2026-08-03;despesa;2.15;350.00;pix;Sr. Osvaldo;Limpeza mensal
2026-08-05;despesa;2.3;1500.00;pix;Sala comercial;Aluguel agosto
2026-08-15;despesa;2.5;129.90;boleto;Vivo;Internet
2026-09-01;receita;1.2;2240.00;pix;Alunas;Mensalidades (8)
2026-09-02;despesa;2.15;350.00;pix;Sr. Osvaldo;Limpeza mensal
2026-09-05;despesa;2.3;1500.00;pix;Sala comercial;Aluguel setembro
2026-09-15;despesa;2.5;129.90;boleto;Vivo;Internet
```

### `C-0601` Jé Modas

```
data;tipo;categoria;valor;forma;contraparte;descricao
2026-07-06;receita;1.1;1180.00;pix;Clientes;Vendas fim de semana
2026-07-09;despesa;2.1;1900.00;dinheiro;25 de Março;Peças para revenda, sem nota
2026-07-20;despesa;2.8;75.90;boleto;DAS;MEI
2026-07-25;movimento;3.2;890.00;cartao;Jéssica;Escola do filho, retirada
2026-08-10;despesa;2.1;2300.00;dinheiro;25 de Março;Peças para revenda, sem nota
2026-08-13;movimento;3.5;1150.00;boleto;Singer;Máquina de costura, parcela 1/3
2026-08-20;despesa;2.8;75.90;boleto;DAS;MEI
2026-08-22;despesa;2.14;120.00;cartao;Instagram;Impulsionamento
2026-08-25;movimento;3.2;890.00;cartao;Jéssica;Escola do filho, retirada
2026-09-13;movimento;3.5;1150.00;boleto;Singer;Máquina de costura, parcela 2/3
2026-09-14;despesa;2.9;83.40;nao_informado;Stone;Taxas da maquininha
2026-09-20;despesa;2.8;75.90;boleto;DAS;MEI
2026-09-28;receita;1.3;4310.00;transferencia;Shopee;Repasse
```
