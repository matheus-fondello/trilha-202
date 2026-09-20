# Referências, aula 1.5

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `instrucao-clara`**

- **Andrej Karpathy, *Software Is Changing (Again)*** — YouTube, canal Y Combinator, jun/2025 · 39 min no total, trecho de 5 min
  https://www.youtube.com/watch?v=LCEmiRjPEtQ&hl=en&persist_hl=1&t=280s
  O capítulo "Programming in English", de 4:40 a 6:10: a tese de que o modelo é um computador novo e o prompt é a linguagem em que se programa.

O link abre no capítulo. São cinco minutos, não trinta e nove — diga isso, senão ele
não clica. A palestra inteira é ótima e fica para quem pedir.

**marco `contexto-e-moldura`**

- **Prithvi Rajasekaran, Ethan Dixon, Carly Ryan e Jeremy Hadfield, *Effective context engineering for AI agents*** — Anthropic, engenharia, set/2025 · 15 min de leitura
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  É a fonte da regra desta aula: procurar o menor conjunto de informação de alto sinal, não a maior pilha de contexto.

Cuidado com uma frase feita: o CLAUDE.md **não** é o prompt de sistema. A documentação
diz que ele entra como mensagem do usuário, depois do prompt de sistema. Chame de
instrução permanente que entra em toda sessão — o aluno já viu o arquivo por dentro na 1.2,
e é lá que está o link, não aqui.

**marco `exemplos-e-forma`**

- **Anthropic, *Best practices*, seção "Provide specific context in your prompts"** — documentação do Claude Code · 3 min de leitura
  https://code.claude.com/docs/en/best-practices#provide-specific-context-in-your-prompts
  Uma tabela de antes e depois com quatro pedidos ruins virando bons — já no vocabulário de quem fala com um agente, não com uma caixa de chat.

Esta é a ponte que o material geral de prompt não dá. Quase tudo que existe sobre prompt
foi escrito para chat; a aula é sobre falar com um agente que lê arquivo e roda comando.

- **Anthropic, *Prompting best practices*, seção "Use examples effectively"** — documentação da plataforma Claude · 2 min a seção
  https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#use-examples-effectively
  Nomeia few-shot com todas as letras e dá a regra que a aula ensina: exemplo tem que ser relevante e diverso, senão o modelo copia um padrão que ninguém quis.

**marco `iteracao`**

- **Anthropic, *Best practices for prompt engineering for 2026*** — blog da Claude, nov/2025 · 12 min de leitura
  https://claude.com/blog/best-practices-for-prompt-engineering
  Tem uma seção inteira de erros comuns, que é o espelho dos antipadrões desta aula.

## Sugeridas

**marco `contexto-e-moldura`**

- **Claude, *The CLAUDE.md file*** — canal oficial no YouTube, série Claude Code 101, mai/2026 · 3 min 1 s
  https://www.youtube.com/watch?v=O0FGCxkHM-U&hl=en&persist_hl=1
  O que entra no arquivo e como os escopos carregam, mostrado na tela: o primeiro tratamento visual do arquivo que ele só viu em texto na 1.2.

Três minutos pausam a aula sem custo; ofereça quando o marco abrir. O vídeo não diz que o
CLAUDE.md entra como mensagem de usuário e não como prompt de sistema; essa nuance continua sua.

**fechamento**

- **DAIR.AI, *Dicas gerais para projetar prompts*** — Prompt Engineering Guide, em português · 8 min de leitura
  https://www.promptingguide.ai/pt/introduction/tips
  Em português e na ordem certa: comece simples, seja específico, evite imprecisão, e a seção "Fazer ou não fazer?", que é o antipadrão desta aula com exemplo.

Oito minutos e em português, mas escrito para prompt de chat, e o que ele opera é um agente.
Ofereça no fechamento, com a ressalva numa frase; a tabela do `best-practices` acima é a ponte.
