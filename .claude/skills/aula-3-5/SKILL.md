---
name: aula-3-5
description: Aula 3.5, Saída confiável e experiência. Sala e oficina: a saída da P3 validada, cada falha com destino visível e os estados da tela. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.5: Saída confiável e experiência

**Goal:** o aluno para de tratar a resposta do modelo como dado pronto: valida toda saída contra um schema, decide para onde vai cada falha, tira do modelo o que uma conta resolve, e desenha a tela do clique à resposta, inclusive quando a resposta é "não entendi".

Contexto para discorrer, do seu jeito: a saída da P3 vira item de fila e linha de arquivo, e torta vira imposto errado. Pedir JSON no prompt é pedido, não contrato. Todo provedor força a forma com a saída estruturada (no Gemini, o schema vai na chamada), e isso resolve a sintaxe, não a verdade: um código de categoria que existe pode ser o errado, e a documentação manda conferir o valor na aplicação. Por isso validar sempre, em código, no servidor, antes de virar item, com a regra do negócio junto da forma: categoria do plano, sinal do valor, a pendência como item diferente do lançamento. Quebra de quatro jeitos: a chamada falha, para no limite de saída, o provedor bloqueia, ou volta inteira e inválida; toda resposta diz se terminou ou foi cortada. Repetir vale para o passageiro, e cada repetição é outra chamada no log da 3.4: gasta cota. O corte no limite não se resolve repetindo igual, nem a cota do dia, que só volta amanhã; a do minuto, sim. O que falha de novo vira item de não entendido, com a mensagem original, em vez de sumir ou chegar como lançamento em branco. Não entendido não é pendência: a pendência é leitura que deu certo e sabe o que perguntar ao cliente; o não entendido só pede o olho do Tiago. Temperatura baixa reduz a variação, não a zera, e há modelo em que a documentação manda nem mexer. O que é aritmética sai do modelo: ler o "mil e duzentos" é dele, mas "1,2k" é 1.200 e "ontem" se conta a partir da data da mensagem, em código e com teste. Regra que é regra roda em código, nunca no prompt torcendo. Latência percebida é a espera que alguém sente: o lançador roda sem ninguém olhando (3.3), então ela mora no clique, e cada clique tem estados: esperando, pronto, vazio, erro dizendo o que fazer. Otimismo, mostrar antes da confirmação, só vale onde o resultado é quase certo. Incerteza se mostra: o que foi assumido aparece como assumido (a data da regra 1); e a correção do Tiago, guardada com a mensagem e o que o sistema disse, é caso de eval da 3.7.

Sala e oficina. A 2.10, a 3.3 e a 3.4 já foram dadas: referencie. Fica para depois: injeção (3.6), eval (3.7), histórico como contexto (3.8).

## Antes de começar

Confira no estado a pasta e o repositório da P3, e se a fluência da 3.4 passou. **A fila nasce hoje**, mínima, para receber a saída validada: item com a mensagem original ao lado, aprovar e corrigir, aviso visível, não entendido como item próprio; login, arquivo e o resto vêm depois. A P3 é corrigida no fim e a régua não está neste chat. Você não escreve o schema nem decide por ele o que fazer em cada falha: pergunte o que o Tiago precisa ver em cada caso e trabalhe com a resposta. Ele não lê o schema; confere pelo que a validação recusa.

## Marcos

`node .claude/scripts/trilha.js milestone 3.5 <id>`:

- `schema`: ele separa pedir a forma, forçar a forma e validar o conteúdo. *Previsão, antes:* o prompt diz "responda só em JSON com estes campos"; das cinco mil mensagens do mês, quantas voltam como pedido, e o que acontece com as outras? Caça quem trata instrução no prompt como contrato.
- `quando-quebra`: ele nomeia os jeitos de vir quebrado, lê o motivo da parada, e decide o que se repete e para onde vai o que falha de novo.
- `determinismo`: ele separa o que é regra do que é leitura, e tira do modelo o que uma conta resolve. *Conceito:* ele baixa a temperatura ao mínimo, e a mensagem que ontem saiu na categoria errada hoje sai igualzinha; o que ele consertou? Caça quem confunde repetível com correto.
- `latencia-percebida`: ele sabe onde alguém espera no sistema dele e desenha os estados de cada clique. *Aplicação:* o Tiago aprova e a gravação leva dois segundos: o item sai da lista na hora? Caça quem aplica otimismo onde o resultado é incerto.
- `errar-com-graca`: o não entendido aparece como tal, o assumido aparece como assumido, e a correção do Tiago fica guardada.

## Fluência

Na oficina, sobre a P3. **Você escolhe** duas mensagens do material, uma clara e uma em que valor ou data pedem conta, e ele cola a saída de cada uma. Depois provoca três falhas e cola o resultado: uma saída inválida entregue direto à validação, sem chamar o modelo, e um 429 do limite do provedor, os dois escritos como teste no repositório, que roda sem chave e sem abrir a fila; e um corte pelo limite de saída. E os estados da fila, em texto ou print. Passa se cada falha chegar à fila como não entendido, com a mensagem original e o motivo, e nunca como lançamento (o 429 do minuto pode esperar); se valor e data forem conferidos em código, com teste passando; e se a fila tiver espera e erro dizendo o que fazer. Registre com `fluencia 3.5 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 3.6, Segurança de IA. Gancho: o schema garante a forma da saída, não de quem veio a ordem; na próxima, uma mensagem do material tenta mandar no sistema, e a saída que obedece passa pela validação sem erro.
