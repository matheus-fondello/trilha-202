# Referências, aula 1.2

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Documentação é material vivo e não traz data: se o que ela diz não bate com a versão
do aluno, o que vale é a máquina dele. Trocar `/en/` por `/pt/` na URL dá a versão em
português — mas não faça isso nesta aula: a tradução de `how-claude-code-works` está
atrasada justamente na parte de modos de permissão.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `agente`**

- **Erik S. e Barry Zhang, *Building effective agents*** — Anthropic, engenharia, dez/2024 · 15 min de leitura
  https://www.anthropic.com/engineering/building-effective-agents
  A definição de agente sem marketing: o modelo dirige o próprio processo e ganha informação do ambiente a cada passo. É por isso que ele roda o teste.

**marco `terminal`**

- **Anthropic, *Terminal guide for new users*** — documentação do Claude Code · 10 min de leitura
  https://code.claude.com/docs/en/terminal-guide
  A página oficial para quem nunca usou terminal, com o que fazer quando o comando `claude` não é reconhecido.

- **Anthropic, *Advanced setup*, seção "Set up on Windows"** — documentação do Claude Code · 4 min de leitura
  https://code.claude.com/docs/en/setup#set-up-on-windows
  A tabela de Windows nativo contra WSL, e o aviso de que no WSL o `claude` roda de dentro do WSL, não do PowerShell.

- **Django Girls, *Introdução à linha de comando*** — tutorial.djangogirls.org, em português · 15 min de leitura
  https://tutorial.djangogirls.org/pt/intro_to_command_line/
  O único material em português escrito para quem nunca abriu um terminal: os quatro comandos, nos três sistemas, com exercício no fim.

A segunda só interessa se ele estiver no Windows: é lá que o aluno brasileiro trava, e vale
interromper a aula por três minutos para resolver em vez de seguir com ele perdido. A terceira
é a rede de segurança do bloco: se ele travar de verdade, mande o link em texto e diga que os
exercícios do fim resolvem sozinhos. Não ofereça no painel — a sugerida desta aula é o vídeo,
e o bloco de terminal é curto de propósito.

**marco `disco-como-memoria`**

- **Anthropic, *How Claude remembers your project*** — documentação do Claude Code · consulta, 20 min se lida inteira
  https://code.claude.com/docs/en/memory
  Os escopos de CLAUDE.md em ordem de carregamento, o `/init`, e o alvo de menos de 200 linhas por arquivo.

**marco `superficies`**

- **Anthropic, *Explore the .claude directory*** — documentação do Claude Code · explorador interativo, 5 min
  https://code.claude.com/docs/en/claude-directory
  A árvore `.claude/` clicável, com uma linha dizendo quando cada arquivo carrega. Bom para ele abrir ao lado enquanto olha a daqui.

O explorador da `.claude/` casa com a hora de mostrar que ele está dentro do exemplo.
A dissecação a sério fica para a 1.8; aqui é só um olhar de reconhecimento.

**marco `superficies`**

- **Anthropic, *How Claude Code works*** — documentação do Claude Code · 13 min de leitura
  https://code.claude.com/docs/en/how-claude-code-works
  A versão escrita e completa do vídeo abaixo: o loop em três fases, a lista literal do que o agente acessa, e a frase que fecha o assunto — o Claude Code é o harness agêntico em volta do Claude.

## Sugerida

- **Claude, *How Claude Code Works*** — canal oficial no YouTube, mai/2026 · 2 min 51 s
  https://www.youtube.com/watch?v=6bs5b4FltCU&hl=en&persist_hl=1
  A ementa desta aula em menos de três minutos — loop, janela de contexto, ferramentas e modos —, com o objetivo declarado de que o Claude Code pare de parecer caixa mágica.

Três minutos pausam a aula sem custo. Ofereça cedo, depois do marco `agente`: o vídeo
faz o trabalho visual que a sua explicação não faz, e o resto da aula rende mais.
