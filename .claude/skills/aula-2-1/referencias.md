# Referências, aula 2.1

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Tudo aqui está em inglês; nenhum tem tradução decente em português, então quando citar
um trecho, traduza você na hora em vez de mandar o aluno traduzir. Dois envelhecem
rápido e por motivos opostos: o número do METR é de julho de 2025 e vale como método,
não como placar de hoje, e o texto do Addy é de janeiro de 2026 e fala de modelos que
já mudaram — o argumento sobrevive, os exemplos não.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `no-ar-nao-e-shippado`**

- **Google, *Appendix E: Launch Coordination Checklist*** — Site Reliability Engineering (O'Reilly, 2016) · leitura de ~3 min
  https://sre.google/sre-book/launch-checklist/
  A lista que o Google exigia antes de considerar um serviço lançado: arquitetura, capacidade, o que acontece quando a máquina morre, monitoramento, segurança, dependências. Nada disso é escrever a funcionalidade.

O valor aqui é o tamanho da lista, não o conteúdo dela. Tem jargão de infra (rack, cluster, DNS) que o aluno não precisa entender; deixa claro que a leitura é para ver a extensão do que fica entre "funciona na minha máquina" e "está shippado".

**marco `o-ciclo`**

- **Martin Fowler, *Is High Quality Software Worth the Cost?*** — martinfowler.com, mai/2019 · ~16 min
  https://martinfowler.com/articles/is-quality-worth-cost.html
  Mostra por que a manutenção domina o custo do ciclo: quase toda programação acontece dentro de código que já existe, então o preço de mudar depois pesa mais que o de construir.

Use quando chegar na última fase do ciclo, para o aluno não tratar manutenção como apêndice. É o mesmo argumento que volta na 2.4 e no problema dos 80%.

**marco `onde-a-ia-acelera`**

- **Joel Becker, Nate Rush, Beth Barnes e David Rein, *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*** — METR, jul/2025 · ~18 min
  https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
  Ensaio randomizado com 16 devs experientes em repositórios que eles já conheciam: com IA levaram 19% mais tempo, e mesmo depois achavam que tinham sido 20% mais rápidos.

O ponto pedagógico é a diferença entre percepção e medição, não "IA é ruim". Se o aluno usar isso para desqualificar a ferramenta, lembre que o estudo mede código maduro que o dev já domina, que é exatamente onde a IA não acelera. A própria página hoje abre com um aviso de que os resultados estão desatualizados e aponta um estudo de 2026: o método continua valendo, o placar já foi substituído pelos próprios autores, e vale dizer isso antes de o aluno ver o banner.

**marco `os-oitenta-por-cento`**

- **Addy Osmani, *The 80% Problem in Agentic Coding*** — Elevate (Substack), jan/2026 · ~17 min
  https://addyo.substack.com/p/the-80-problem-in-agentic-coding
  O texto que dá nome ao problema: o agente entrega os 80% que funcionam, e o que sobra é dívida de compreensão, código que você aprovou sem saber explicar.

É longo e é só prévia nesta aula. Cita e segue; o assunto abre de verdade na 2.4.

## Sugerida

- **Martin Fowler, *Continuous Delivery*** — martinfowler.com, mai/2013, atualizado ago/2014 · ~4 min
  https://martinfowler.com/bliki/ContinuousDelivery.html
  Quatro minutos que fixam o teste prático de "pronto": o patrocinador pode pedir para colocar a versão atual em produção agora, e ninguém se assusta.

Ofereça logo depois do marco `o-ciclo`, no meio da aula. É curto o bastante para abrir no painel, ler junto e voltar, e o teste do "a qualquer momento" é a melhor ponte para o marco seguinte.
