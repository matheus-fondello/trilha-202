---
name: aula-1-10
description: Aula 1.10, Design e deploy. Sala e oficina, com fluência gerando variação a partir de um design no disco e pondo a P0 no ar. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 1.10: Design e deploy

**Goal:** o aluno consegue fazer uma página parecer profissional sem ser designer, sabe dar ao agente um sistema visual no disco em vez de pedir "deixa bonito", e põe a página no ar entendendo o que "no ar" significa. Fecha o módulo aplicando a 1.3 ao visual: screenshot contra o design é um check como qualquer outro.

Contexto para discorrer, do seu jeito: quase toda página amadora erra as mesmas quatro coisas, e as quatro têm conserto mecânico. Hierarquia: o olho tem que saber o que ler primeiro, e isso se faz com tamanho e peso, não com cor. Espaço: iniciante aperta tudo, e respiro é o que mais separa página amadora de profissional. Uma fonte só, com dois ou três tamanhos. Uma cor de ação, usada exclusivamente no que ele quer que seja clicado — se tudo é colorido, nada chama. Depois disso vem o pulo: escrever essas decisões num arquivo no disco, com os valores exatos de cor, tamanho e espaçamento, e mandar o agente ler aquilo. É a mesma ideia do CLAUDE.md aplicada ao visual — em vez de "deixa mais bonito", que é ambíguo e volta na média, ele passa a ter um padrão que o agente consegue seguir e ele consegue cobrar. Sobre stack, seja direto: página estática de um arquivo resolve muita coisa e não tem vergonha nenhuma nisso; a trilha usa Next e Vercel porque é o caminho mais curto entre "existe na minha máquina" e "existe na internet", e porque cresce quando o projeto virar produto. Deploy fecha com o que ele precisa entender de verdade: cada versão ganha um endereço de preview antes de virar produção, e produção é o endereço que ele manda para alguém. E a verificação visual amarra o módulo: pedir screenshot depois da mudança e comparar com o design é evidência, exatamente como o teste era na 1.3.

Sala e oficina. Última aula do módulo: depois dela vem a P1, do zero, para o cliente do brief.

## Antes de começar

Confira no estado se a oficina e a P0 estão registradas; se não, resolva antes de começar, como a `tutor` manda. Pôr no ar depende de conta, login e rede, então trate como marco e não como requisito: se travar hoje, registre onde parou, diga que a P1 vai pedir URL e que ele tem a semana toda, e siga. A aula não empaca por causa de deploy.

## Marcos

`node .claude/scripts/trilha.js milestone 1.10 <id>`:

- `design-sem-ser-designer`: ele consegue apontar hierarquia, espaço, fonte e cor de ação na própria página.
- `sistema-no-disco`: existe um arquivo de design na pasta da P0, escrito com valores, e o agente o usou. *Conceito:* o que muda no resultado quando o design está num arquivo em vez de no pedido? Caça quem acha que "deixa bonito" e um arquivo de tokens são o mesmo pedido dito de dois jeitos.
- `stack-e-deploy`: ele sabe por que a trilha usa esta stack e o que preview e produção significam. *Aplicação:* um amigo abriu o link do preview e disse que a página está no ar. Está? Caça quem acha que preview é produção. Com a P0 em produção, registre a URL — e o repositório, se já existir: `pratica P0 url=<url> repo=<url>`. É o que leva o link da P0 à 202, que até aqui só sabia que ela foi concluída.
- `verificar-visual`: ele usou screenshot como evidência contra o design, não como enfeite.

## Fluência

Na oficina: entregar ao agente o arquivo de design e pedir uma variação da página da P0, recebendo screenshot como evidência. Passa se ele conseguir apontar, no screenshot, onde a variação seguiu o design e onde não seguiu. Registre com `fluencia 1.10 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próximo passo: a P1, a landing page do brief, feita do zero. Gancho: o módulo inteiro esteve remendando a página da P0; a P1 é a prova de que ele consegue fazer sozinho desde a primeira linha.
