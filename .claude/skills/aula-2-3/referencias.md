# Referências, aula 2.3

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Três das quatro citadas são documentação viva, sem data: a do Supabase muda de âncora e de texto
sem aviso, e o cheat sheet da OWASP é reescrito de tempos em tempos. Se um link cair no meio da aula,
diga o nome da seção e siga; não pare a conversa para caçar substituto. A página da MDN é a única
em português; o resto é inglês, e vale avisar isso antes de mandar o link, porque a maioria do
material sério de banco e de auth não existe traduzido — faz parte do ofício.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `entidades-em-texto`**

- **MDN Web Docs, *JSON*** — glossário, em português · leitura ~2 min
  https://developer.mozilla.org/pt-BR/docs/Glossary/JSON
  Duas frases dão o vocabulário exato (objeto, array, aninhamento) e dizem o que JSON *não* representa.

O valor aqui é o segundo parágrafo, o das limitações: JSON não tem data, não tem função, não tem
tipo próprio. É a deixa para você dizer que descrever o domínio em texto é escolher o que cabe
no formato, e que o que não cabe vira convenção que alguém tem que lembrar.

**marco `banco`**

- **Supabase, *Tables and Data*** — documentação, seção "Primary keys" · leitura ~1 min
  https://supabase.com/docs/guides/database/tables#primary-keys
  Define chave primária em quatro linhas, e duas seções abaixo mostra de onde vem a palavra "relacional".

Mande a âncora da chave primária, não a página inteira: o começo é uma tabela gigante de tipos do
Postgres e assusta à toa. Quem passar da seção de carga de dados cai em "Joining tables with foreign keys", que
é exatamente o marco seguinte da sua explicação — deixe acontecer, não anuncie.

**marco `schema-e-tipos`**

- **Supabase, *Database Migrations*** — documentação, seção "Schema migrations" · leitura ~3 min
  https://supabase.com/docs/guides/deployment/database-migrations#schema-migrations
  Mostra uma mudança de schema virando arquivo datado e versionado, que é a resposta concreta a "por que dói mudar depois".

É um passo a passo de terminal, e o aluno não vai rodar nada. Ele não está lendo código: está vendo
que cada alteração de tabela vira um arquivo com carimbo de hora, que entra no repositório e é aplicado
na ordem. Diga isso antes de soltar o link, senão o formato de tutorial convida a executar.

**marco `auth`**

- **OWASP Cheat Sheet Series, *Authentication Cheat Sheet*** — documentação, seção "Authentication General Guidelines" · leitura ~15 min
  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-general-guidelines
  O tamanho da lista é o argumento: ID, senha, recuperação, hash, TLS, reautenticação, mensagem de erro, ataque automatizado.

Não é para ler inteiro e você deve dizer isso. Use como prova de superfície: peça que ele role a
seção e conte quantos subtítulos existem antes de a lista acabar. "Auth não se inventa" para de ser
opinião sua quando ele vê o inventário do que teria que acertar sozinho, e cada item ali já foi
motivo de vazamento em alguma empresa.

## Sugeridas

**marco `banco`**

- **Fireship, *SQL Explained in 100 Seconds*** — YouTube, abr/2021 · 2 min 23 s
  https://www.youtube.com/watch?v=zsjvFFKOm3c&hl=en&persist_hl=1
  Em dois minutos mostra tabela, linha, coluna e uma consulta rodando, que é o que ele precisa reconhecer para conferir o agente.

Ofereça no painel logo depois que o marco abrir, antes de entrar em schema. São dois minutos:
pausa a aula sem custo e ele volta sabendo como uma consulta se parece. O vídeo é em inglês,
rápido e com legenda automática ruim — avise, e ofereça repetir o trecho em vez de traduzir.

- **CockroachDB, *What is a Foreign Key Constraint? Understanding Primary & Foreign Keys*** — YouTube, canal oficial, jul/2021 · 3 min 52 s
  https://www.youtube.com/watch?v=5kiMg7GXAsY&hl=en&persist_hl=1
  As duas tabelas lado a lado, a de muitos apontando para a de um: relação um-para-muitos e chave estrangeira no mesmo vídeo, que é a seta que o Fireship não desenha.

Ofereça depois do Fireship, quando a relação entrar na conversa; os capítulos vão até 3:27, o
resto é encerramento. Se ele recusar qualquer um dos dois, não insista; nada mais na aula
depende de ter visto.
