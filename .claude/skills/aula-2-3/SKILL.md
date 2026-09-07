---
name: aula-2-3
description: Aula 2.3, Banco, dados e a stack. Sala e oficina, com modelagem em texto e tabelas criadas no Supabase. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.3: Banco, dados e a stack

**Goal:** o aluno descreve um domínio em texto antes de pedir código, entende o suficiente de banco para conversar com o agente e conferir o que ele fez, sabe por que mudar o schema depois dói, entende que autenticação não se inventa, e sabe por que a trilha usa Next, Supabase e Vercel — e quando fugir dessa escolha.

Contexto para discorrer, do seu jeito: a decisão mais cara de um sistema pequeno é como o dado está organizado, e ela é tomada antes da primeira linha de código. Comece por JSON, que é só um jeito de escrever objeto e lista, e mostre que descrever "um agendamento tem um cliente, um horário e um serviço" já é modelagem. Banco relacional é isso arrumado: tabela é o tipo de coisa, linha é uma coisa, coluna é um atributo, chave primária é o crachá único de cada linha, chave estrangeira é como uma linha aponta para outra. Relação é a pergunta "quantos de cada lado" — um cliente tem muitos agendamentos, um agendamento tem um cliente — e errar isso é o que faz o sistema empacar depois. Consulta é fazer a pergunta ao banco em vez de trazer tudo e filtrar na mão. Schema é a forma declarada: quais tabelas, quais colunas, de que tipo. Mudar schema com dado dentro é caro porque não é só editar uma linha de código, é decidir o que acontece com o que já existe, e é por isso que se versiona a mudança em vez de mexer no banco na unha. Auth é o lugar onde o aluno mais precisa ouvir "não invente": identidade é provar quem é, autorização é decidir o que essa pessoa pode ver, e a segunda é a que vaza dado quando alguém improvisa. Use a do stack. E a stack: a 1.10 já disse por que Next e Vercel, e o que entra hoje é a terceira peça, o banco, com o que ela resolve de graça — auth pronta e regra por linha. Não é a melhor de todas, é a que tem o menor número de peças novas por aula; ele foge dela quando o problema pede outra coisa, e aí já vai saber comparar.

Sala e oficina. Fica para outras aulas: segredo e ambiente, testes, e segurança de dado a sério.

## Antes de começar

Confira no estado a pasta e o repositório da P1; se faltar algo, resolva antes, como a `tutor` manda. A oficina continua sendo a P1: o que ela precisa guardar é o contato de quem pede simulação, que é a ação que a página inteira existe para provocar. Criar conta no Supabase depende de login e rede; trate como marco, não como requisito: se travar hoje, registre onde parou, siga a aula pela modelagem em texto e retome depois. A aula não empaca por causa de cadastro.

## Marcos

`node .claude/scripts/trilha.js milestone 2.3 <id>`:

- `entidades-em-texto`: ele descreveu em texto o que a P1 precisa guardar, com as coisas e o que liga uma na outra, antes de pedir qualquer código.
- `banco`: ele lê uma tabela e sabe dizer o que é linha, coluna, chave e relação.
- `schema-e-tipos`: ele sabe o que é schema e por que mudar depois é caro. *Conceito:* o banco já tem trezentos agendamentos e ele quer separar o telefone em outra tabela; por que isso não é só editar uma linha de código? Caça quem trata schema como texto e não como a forma do dado que já existe.
- `auth`: ele separa identidade de autorização. *Aplicação:* ele vai pedir ao agente o login do sistema; o que precisa estar escrito no pedido para um cliente não ver o dado do vizinho? Caça quem acha que estar logado já responde quem vê o quê.
- `a-stack`: ele sabe o que cada peça da stack resolve e diz uma situação em que fugiria dela.

## Fluência

Na oficina, sobre a P1: descrever em texto o que a página precisa guardar — o lead que pede simulação e o que ele conta sobre a própria conta de luz —, pedir ao agente que crie as tabelas no Supabase e conferir com dados de exemplo: inserir três leads, um deles com duas simulações, e fazer uma consulta que devolva o esperado. Passa se a descrição em texto vier antes do código, se houver uma relação de verdade entre duas entidades, e se a verificação for dele, não uma afirmação do agente. Registre com `fluencia 2.3 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.4, Git como rede de segurança. Gancho: agora que existe banco e estrutura para quebrar, ele precisa de um jeito de voltar.
