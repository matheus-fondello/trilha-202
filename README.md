# Trilha da 202

Repositório da trilha de builders AI-native da 202 Lab. Você clona, abre no Claude Code e o Claude é o professor: conduz aula a aula, corrige práticas e registra o seu progresso.

## Instalar

O manual completo, para Windows, Mac e Linux, está no site da 202 — é ele que mostra cada passo com imagem, e é por ele que você deve ir se for a sua primeira vez. O mínimo:

1. Instale o [Node.js](https://nodejs.org) (versão 20 ou mais nova) e o **aplicativo do [Claude Code](https://code.claude.com)**. A trilha assume o aplicativo de desktop; pelo terminal também funciona, e aí o comando é `claude` dentro da pasta.
2. Traga este repositório para a sua máquina. O manual mostra como, no seu sistema.
3. Abra essa pasta no Claude Code. A primeira coisa que o professor pede é o seu nome e o token de acesso que a 202 te mandou — é só colar o valor na conversa. Sem ele a trilha não começa. Daí em diante você não precisa saber nada além de escrever em português.

O token é pessoal, como uma senha. Ele fica guardado em `~/.trilha-202/credenciais.json`, na sua pasta pessoal e **fora deste repositório**, que é público. Se ele vazar, peça outro à 202.

Seu progresso fica em `trilha/estado.json`, fora do controle de versão. O conteúdo recebe aula nova de tempos em tempos; atualizar é uma linha só, e o professor te mostra quando for a hora.

## Como funciona

- **Sala e oficina.** Esta pasta é a sala: aqui você tem aula. Você pratica numa pasta irmã, a oficina, aberta em outra janela do Claude Code. Não há nada para preparar: o Claude monta a oficina com você quando chegar a primeira prática.
- **Uma aula por chat.** Cada aula é uma conversa de cerca de uma hora e, na maioria, termina com um teste de fluência. Ao fechar, abra um chat novo para a próxima.
- **Progresso registrado.** O Claude registra cada conceito fechado por script. Você pode fechar o terminal a qualquer hora e retomar depois do ponto onde parou.
- **Material de apoio.** Cada aula cita fontes e sugere um material que vale de verdade. Tudo junto está em [REFERENCIAS.md](REFERENCIAS.md); no meio de uma conversa, peça `/referencias`. É opcional: a aula se sustenta sozinha.
- **Prática vale nota.** Ao fim de cada módulo você entrega um trabalho de verdade, feito na oficina. Quem corrige é um chat novo, que não acompanhou o trabalho: você registra a entrega, fecha o chat e abre outro para receber a correção. A régua de cada prática abre depois da entrega, com `criterios`.
- **A 202 acompanha.** Sobem metadados e avaliações estruturadas, nunca a conversa inteira. Você recebe o feedback; a nota fica com a 202.

## Estado do protótipo

Em construção. Escritos: o módulo 0 e o módulo 1 (doze aulas), a prática livre P0, a P1 com correção, o quiz do módulo 1, e do módulo 2 e do módulo 3 as aulas 2.1 a 2.6, 3.1, 3.2, 2.14 e 3.9. Faltam o resto do 2 e do 3 e os quizzes deles; a aula que ainda não existe aparece na sequência dizendo isso, em vez de ser pulada em silêncio.

Os eventos ficam na fila local (`trilha/fila.jsonl`) e sobem para o CRM da 202 com o seu token; sem rede, esperam e sobem de uma vez quando ela volta. Ver `TESTE.md` para o protocolo de validação.
