# Trilha da 202

Repositório da trilha de builders AI-native da 202 Lab. Você clona, abre no Claude Code e o Claude é o professor: conduz aula a aula, corrige práticas e registra o seu progresso.

## Instalar

O manual completo, para Windows, Mac e Linux, está no site da 202. O mínimo:

1. Instale o [Node.js](https://nodejs.org) (versão 20 ou mais nova) e o [Claude Code](https://code.claude.com).
2. Clone este repositório e entre na pasta.
3. Rode `claude`. A primeira aula começa sozinha.

Para atualizar o conteúdo ao longo da trilha: `git pull` dentro da pasta. Seu progresso fica em `trilha/estado.json`, fora do controle de versão.

## Como funciona

- **Sala e oficina.** Esta pasta é a sala: aqui você tem aula. Você pratica numa pasta irmã, a oficina, aberta em outra janela do Claude Code.
- **Uma aula por chat.** Cada aula é uma conversa de cerca de uma hora e, na maioria, termina com um teste de fluência. Ao fechar, abra um chat novo para a próxima.
- **Progresso registrado.** O Claude registra cada conceito fechado por script. Você pode fechar o terminal a qualquer hora e retomar depois do ponto onde parou.
- **A 202 acompanha.** Sobem metadados e avaliações estruturadas, nunca a conversa inteira. Você recebe o feedback; a nota fica com a 202.

## Estado do protótipo

Esqueleto em construção. Aulas escritas: 1.1 e 1.3. Servidor ainda não existe; os eventos ficam na fila local (`trilha/fila.jsonl`). Ver `TESTE.md` para o protocolo de validação.
