# Referências, aula 2.11

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Tudo aqui é em inglês, e vale dizer isso antes de soltar o primeiro link: os quatro daqui só existem em inglês. Nenhum dos quatro é sobre agente, e é de propósito: o método é o mesmo há cinquenta anos, o que mudou é quem executa o passo. O que o aluno precisa ver é que "reproduzir, isolar, hipótese, evidência" não é regra da 202 para conversar com o Claude; é o jeito de achar defeito em qualquer sistema, e o agente é bom em executar cada passo quando alguém sabe pedir o passo. A página de Zeller é longa e cheia de Python: mande a âncora, diga que a leitura é só aquela seção, e que o código ali é ilustração, não tarefa.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `do-sintoma-a-causa`**

- **Andreas Zeller, *Introduction to Debugging — The Scientific Method*, The Debugging Book** — livro aberto (CC BY-NC-SA), edição de 2024 · ~4 min de leitura (a seção)
  https://www.debuggingbook.org/html/Intro_Debugging.html#The-Scientific-Method
  Os cinco passos, escritos como ciência e não como truque: pergunta, hipótese, predição, experimento, e repetir até a hipótese não ter mais o que explicar.

Zeller é o autor de *Why Programs Fail*, o livro clássico do debugging sistemático; esta é a versão aberta e atual, do mesmo autor. As subseções logo abaixo (*Finding*, *Testing*, *Refining*, *Refuting a Hypothesis*) são o marco inteiro em miniatura: uma hipótese que não pode ser refutada não é hipótese. Mais abaixo, em *Checking Diagnoses*, está a regra que fecha o marco `causa-raiz-nao-supressao`: só se mexe no código com um diagnóstico que explica **por que** a falha acontece e **onde** o código está errado; sem as duas coisas, o que se tem é palpite.

**marco `instrumentos`**

- **David A. Wheeler, *Review of "Debugging" by David J. Agans*** — dwheeler.com, mar/2004 · ~8 min de leitura
  https://dwheeler.com/essays/debugging-agans.html
  Resume as nove regras de Agans com os subpontos de cada uma, e três delas são esta aula: "quit thinking and look", "change one thing at a time" e "if you didn't fix it, it ain't fixed".

O livro de Agans é de 2002 e não é aberto; a resenha de Wheeler é o melhor sumário livre das regras, e cita as três que importam aqui com as frases originais. "Quit thinking and look" é o argumento para log e screenshot: antes de teorizar, veja o valor. "If you didn't fix it, it ain't fixed" é a resposta pronta para "o agente disse que consertou": conferir que consertou, e que foi a sua mudança que consertou. Solte o link quando o aluno perguntar se não dá para o agente "só olhar o código e achar"; a resposta de Agans é que olhar sem instrumento é pensar, e pensar é onde o palpite mora.

**marco `causa-raiz-nao-supressao`**

- **Anthropic, *Best practices for Claude Code — Course-correct early and often*** — documentação oficial · ~2 min de leitura (a seção)
  https://code.claude.com/docs/en/best-practices#course-correct-early-and-often
  Diz com todas as letras a regra das duas correções: mais de duas no mesmo problema e o contexto está cheio de tentativas falhas; `/clear` e um prompt melhor com o que se aprendeu vence a sessão longa quase sempre.

A mesma página, em *Give Claude a way to verify its work*, tem a linha "address the root cause, don't suppress the error" na tabela de antes e depois, e é a única menção desta página ao que esta aula chama de supressão. A 1.7 já deu a regra; o que muda aqui é o conteúdo do prompt novo: reprodução, hipótese e o que já foi descartado. Sem isso, o `/clear` só reinicia o chute.

## Sugerida

- **Julia Evans, *A debugging manifesto*** — jvns.ca, dez/2022 · ~4 min de leitura
  https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/
  Oito princípios em uma página, e o primeiro é a aula inteira: "inspect, don't squash", deixe o bug no lugar e entenda o que aconteceu antes de mexer, porque consertar sem entender costuma deixar mais confuso, não menos.

Ofereça no painel no fim do marco `do-sintoma-a-causa`, antes dos instrumentos: são quatro minutos, pausa a aula sem custo, e o aluno volta com "inspect, don't squash" na cabeça, que é o que ele vai precisar quando o agente propuser o try/catch no marco `causa-raiz-nao-supressao`. "There's always a reason" e "trust nobody and nothing" são as outras duas que conversam com a aula: bug não é aleatório, e "o agente disse" não é evidência. Em inglês, com desenho; se ele recusar, nada depende de ter visto.
