---
name: aula-2-6
description: Aula 2.6, Segredos e ambientes. Sala e oficina, com chave em variável de ambiente e preview por PR na Vercel. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.6: Segredos e ambientes

**Goal:** o aluno não commita mais uma chave, sabe o que fazer quando uma vaza — rotacionar, não apagar —, entende que o mesmo código roda em ambientes diferentes com configuração diferente, e usa o preview por PR como o lugar de conferir antes de produção.

Contexto para discorrer, do seu jeito: a lista do que nunca entra num commit é curta e não tem exceção: chave de API, senha, token, arquivo `.env` e dado de cliente. O `.gitignore` é o que impede o acidente, e vale conferir o dele agora, porque a maior parte dos vazamentos de iniciante é um `.env` que entrou no primeiro commit e ninguém olhou mais. Duas armadilhas específicas do jeito que ele trabalha: chave colada no prompt vira histórico de conversa em algum lugar, e chave em código que o navegador baixa está publicada, mesmo que ele não a mostre na tela — é a fronteira da 2.2 outra vez, e frameworks marcam isso no nome da variável — no Next, `NEXT_PUBLIC_` — justamente porque a decisão é de quem escreve. Se vazou, o instinto errado é apagar o arquivo e commitar por cima; o git guarda o histórico, e quem tem o repositório tem a chave. O certo é rotacionar: gerar outra, trocar onde usa, invalidar a antiga. Limpar o histórico é opcional e vem depois; a chave velha é que precisa morrer. Daí para ambiente é um passo: o mesmo código precisa rodar na máquina dele, num endereço de teste e em produção, apontando para bancos e chaves diferentes — e o que muda entre eles não é código, é configuração lida do ambiente. É por isso que variável de ambiente existe e por que ela é o jeito certo de guardar segredo em produção. O preview ele já separou de produção na 1.10; o que muda agora é que ele deixa de ser um endereço avulso e passa a ser o endereço daquele PR, com o código daquela branch, para alguém abrir e olhar antes de virar o site de verdade. É o `link para mandar para o cliente` sem risco, e é evidência de verificação como qualquer outra.

Sala e oficina. Fica para depois: segurança de entrada e dado pessoal, que são o assunto da 2.13.

## Antes de começar

Confira no estado a pasta, a URL e o repositório da P1, e pergunte a ele se o repositório está ligado à Vercel por Git: sem isso não existe preview por PR, e conectar é a primeira coisa da aula — a 1.10 permitiu publicar de outros jeitos. A chave a guardar é a do Supabase que a P1 ganhou na 2.3; se não houver, qualquer API gratuita com cadastro resolve.

## Marcos

`node .claude/scripts/trilha.js milestone 2.6 <id>`:

- `o-que-nunca-commitar`: ele conferiu o `.gitignore` da P1 e sabe a lista.
- `se-vazou`: ele sabe a ordem certa. *Aplicação:* ele descobre agora que a chave está num commit de duas semanas atrás, num repositório público; qual é a primeira coisa que faz, e o que pode ficar para depois? Caça quem começa limpando o histórico e deixa a chave velha viva.
- `ambientes`: ele sabe dizer o que muda entre a máquina dele, o preview e a produção, e o que não muda. *Conceito:* ele configurou a chave numa variável com prefixo público na Vercel; ela saiu do código, então está protegida? Caça quem acha que variável de ambiente é secreta por natureza.
- `preview-por-pr`: ele abriu o endereço de preview de um PR da P1 e viu a mudança lá antes de produção.

## Fluência

Na oficina, sobre a P1: configurar uma chave como variável de ambiente na máquina e na Vercel, usá-la numa rota, e provar que ela não está no repositório — a busca no histórico é a evidência. Depois, abrir um PR com essa mudança e ver a coisa funcionando no endereço de preview dele, não em produção. Passa se ele produzir a evidência sem você pedir a forma dela. Registre com `fluencia 2.6 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.7, Projeto que não é seu. Gancho: tudo que ele construiu até aqui nasceu da mão dele; a primeira tarefa de qualquer emprego é mexer no que já existe.
