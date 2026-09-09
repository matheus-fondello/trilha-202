# Trilha da 202

Repositório da trilha de builders AI-native da 202 Lab. Você clona, abre no Claude Code e o Claude é o professor: conduz aula a aula, corrige práticas e registra o seu progresso.

## Instalar

O manual completo, para Windows, Mac e Linux, está no site da 202. O mínimo:

1. Instale o [Node.js](https://nodejs.org) (versão 20 ou mais nova) e o [Claude Code](https://code.claude.com).
2. Clone este repositório e entre na pasta.
3. Rode `claude`. A primeira aula começa sozinha.

Para atualizar o conteúdo ao longo da trilha: `git pull` dentro da pasta. Seu progresso fica em `trilha/estado.json`, fora do controle de versão.

## Como funciona

- **Sala e oficina.** Esta pasta é a sala: aqui você tem aula. Você pratica numa pasta irmã, a oficina, aberta em outra janela do Claude Code. Não há nada para preparar: o Claude monta a oficina com você quando chegar a primeira prática.
- **Uma aula por chat.** Cada aula é uma conversa de cerca de uma hora e, na maioria, termina com um teste de fluência. Ao fechar, abra um chat novo para a próxima.
- **Progresso registrado.** O Claude registra cada conceito fechado por script. Você pode fechar o terminal a qualquer hora e retomar depois do ponto onde parou.
- **Material de apoio.** Cada aula cita fontes e sugere um material que vale de verdade. Tudo junto está em [REFERENCIAS.md](REFERENCIAS.md); no meio de uma conversa, peça `/referencias`. É opcional: a aula se sustenta sozinha.
- **Prática vale nota.** Ao fim de cada módulo você entrega um trabalho de verdade, feito na oficina. Quem corrige é um chat novo, que não acompanhou o trabalho: você registra a entrega, fecha o chat e abre outro para receber a correção. A régua de cada prática abre depois da entrega, com `criterios`.
- **A 202 acompanha.** Sobem metadados e avaliações estruturadas, nunca a conversa inteira. Você recebe o feedback; a nota fica com a 202.

## Estado do protótipo

Em construção. Escritos: o módulo 0 e o módulo 1 (onze aulas, fora a 1.11 de aprofundamento), a prática livre P0, a P1 com correção, e do módulo 2 e do módulo 3 as aulas 2.1 a 2.6, 3.1, 3.2 e as de aprofundamento 2.14 e 3.9. Faltam os quizzes e o resto do 2 e do 3; a aula que ainda não existe aparece na sequência dizendo isso, em vez de ser pulada em silêncio.

Servidor ainda não existe: os eventos ficam na fila local (`trilha/fila.jsonl`) e sobem quando ele existir. Ver `TESTE.md` para o protocolo de validação.
