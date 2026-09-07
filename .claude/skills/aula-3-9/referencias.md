# Referências, aula 3.9

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três dos quatro links são documentação viva e mudam sem aviso: a Anthropic moveu a doc do Agent SDK
para `code.claude.com` quando renomeou o Claude Code SDK, e o MCP versiona a doc por data de protocolo,
então `/docs/learn/architecture` redireciona para a versão vigente. Se uma âncora não abrir na seção certa,
mande o aluno rolar até o título em vez de improvisar outra URL. E note que o próprio artigo da Anthropic
carrega hoje um aviso de que parte do que ele descreve mudou desde dezembro de 2024: o que não mudou, e é
o que interessa aqui, é a distinção workflow/agente e o catálogo de padrões.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `tool-use`**

- **Anthropic, *How tool use works*** — Claude Platform Docs · ~1 min de leitura (a seção)
  https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works#the-agentic-loop-client-tools
  A seção escreve o loop como cinco passos em torno do `stop_reason`, que é exatamente o que o aluno precisa ver para entender que o modelo pede e o servidor executa.

Solte no parágrafo em que você disser que o modelo nunca executa nada. A mesma página tem a divisão
entre ferramenta do cliente e ferramenta do servidor, que é a confusão mais comum aqui.

**marco `workflow-versus-agente`**

- **Anthropic, *How the agent loop works*** — Claude Code Docs, Agent SDK · ~1 min de leitura (a seção)
  https://code.claude.com/docs/en/agent-sdk/agent-loop#the-loop-at-a-glance
  Um loop de agente real, em produto que roda, descrito em cinco passos e um diagrama: serve de contraste concreto com o fluxo fixo.

Use quando o aluno já entendeu o loop de tool use e você for mostrar que agente é o mesmo loop
com o modelo decidindo quando parar. Não abra o resto da página na aula, ela é longa e é referência de API.

**marco `padroes`**

- **Erik S. e Barry Zhang, *Building effective agents*** — Anthropic Engineering, dez/2024 · ~10 min de leitura (a seção)
  https://www.anthropic.com/engineering/building-effective-agents#building-blocks-workflows-and-agents
  É a fonte dos cinco padrões que a aula usa, cada um com o diagrama e uma linha de quando aplicar; a ementa da aula é o índice desta seção.

Este é o link nomeado no mapa de conteúdo. A âncora cai direto no catálogo de padrões e pula a
introdução, que o aluno vai ver de qualquer jeito se aceitar a sugerida.

**marco `mcp-e-sdk`**

- **Model Context Protocol, *Architecture overview*** — modelcontextprotocol.io · ~2 min de leitura (a seção)
  https://modelcontextprotocol.io/docs/learn/architecture#primitives
  Define as três primitivas do servidor — tools, resources, prompts — que é o que separa MCP de "mais um jeito de chamar API".

Se o aluno perguntar do Agent SDK aqui, volte ao link do marco anterior: é a mesma documentação.

## Sugerida

- **Barry Zhang, *How We Build Effective Agents*** — AI Engineer, abr/2025 · 15 min
  https://www.youtube.com/watch?v=D7_ipDqhtwk&hl=en&persist_hl=1
  Um dos autores do artigo defende, em quinze minutos, que agente é caro e que workflow resolve quase tudo: é a tese do último marco dita por quem escreveu a fonte.

Ofereça no fechamento, depois do marco `quando-workflow-basta`, e não no meio: são quinze minutos e a
palestra só faz sentido depois que os cinco padrões já estão na mesa. É a única referência que cobre
esse marco, então se o aluno recusar, feche o assunto na sua própria explicação.
