---
name: aula-3-9
description: Aula 3.9, Ferramentas e agentes no produto. Sala, com fluência em texto de escolha de padrão. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 3.9: Ferramentas e agentes no produto

**Goal:** o aluno entende como um modelo usa ferramentas dentro de um produto, separa workflow de agente, conhece os padrões de composição e escolhe entre eles com critério — sabendo que a resposta certa quase sempre é a mais simples.

Contexto para discorrer, do seu jeito: é a última aula antes da P3, e ele já construiu uma feature de IA. Tool use é a peça que ele já viu funcionar por fora, no Claude Code, e agora vê por dentro: o modelo não executa nada: ele recebe uma lista de ferramentas descritas em texto, e quando decide usar uma, devolve um pedido estruturado dizendo qual e com quais argumentos. Quem executa é o servidor dele, que faz o trabalho e manda o resultado de volta como mais uma mensagem. O modelo continua sendo só texto entrando e texto saindo; a capacidade de agir mora no código em volta, e a segurança também — o servidor é quem decide o que existe para ser chamado e o que nunca vai existir. Daí sai a distinção que organiza o resto: workflow é um caminho que ele desenhou, com os passos fixos, onde o modelo faz uma parte de cada vez; agente é um loop em que o modelo decide o próximo passo até achar que terminou. Workflow é previsível, barato e fácil de depurar, isto é, de achar onde errou; agente é flexível e caro, e falha de jeitos que ninguém antecipa. Os padrões de composição são as formas de workflow que aparecem sempre: encadeamento, quando uma saída alimenta a próxima etapa; roteamento, quando uma classificação decide qual caminho seguir; paralelização, quando as partes são independentes; orquestrador e trabalhadores, quando a divisão do trabalho só é conhecida em execução; avaliador e otimizador, quando uma segunda passada critica a primeira. MCP é o protocolo que padroniza como uma ferramenta se descreve e se conecta, e o Agent SDK é o loop de agente pronto para quem precisa de um. E o fecho, que é o mais valioso: quase sempre um workflow basta. Agente se justifica quando o número de passos é imprevisível e o valor de acertar sozinho compensa o custo e o risco; fora disso, é complexidade cara comprada por entusiasmo.

Sala.

## Marcos

`node .claude/scripts/trilha.js milestone 3.9 <id>`:

- `tool-use`: ele sabe quem pede e quem executa. *Conceito:* se o modelo devolve só texto, como é que ele consegue mandar um e-mail? Caça quem acha que o modelo executa a ação por conta própria.
- `workflow-versus-agente`: ele separa fluxo fixo de loop com decisão, com o custo de cada um.
- `padroes`: ele reconhece os cinco padrões e dá um exemplo real de dois deles.
- `mcp-e-sdk`: ele sabe o que cada um resolve e quando não precisa de nenhum.
- `quando-workflow-basta`: ele sabe o que precisa ser verdade para um agente valer a pena. *Aplicação:* um cliente pede "um agente que cuida do atendimento"; o que ele precisaria descobrir antes de aceitar que é agente mesmo? Caça quem escolhe pelo nome da coisa e não pela imprevisibilidade dos passos.

## Fluência

Em texto, aqui na sala: você descreve uma feature de um negócio real, com entrada bagunçada e mais de uma etapa, e ele escolhe entre workflow e agente, nomeia o padrão, e justifica pelo que a feature exige. Passa se a justificativa citar a previsibilidade dos passos e o custo, e se ele disser o que mudaria na decisão se um dado do enunciado fosse outro. Registre com `fluencia 3.9 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próximo passo: a P3, o fechamento da feature em dois dias. Gancho: a feature dele é um workflow, e agora ele sabe dizer por quê.
