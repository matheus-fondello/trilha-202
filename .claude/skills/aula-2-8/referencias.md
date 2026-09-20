# Referências, aula 2.8

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Tudo aqui é em inglês; avise antes de mandar o link. O texto do Spolsky é de 2000, de antes de
agente existir, e o argumento transfere inteiro: o programador que ele descreve, apegado ao código
que já escreveu, hoje é o agente, e a decisão tomada antes continua sendo a mais barata. A
documentação do Claude Code traz um prompt de entrevista pronto, e é a única razão de existir um
prompt pronto nesta aula: ele lê lá e escreve o dele; você não cola prompt no chat. A página muda
de âncora com frequência; se a seção não abrir, mande a raiz e diga o nome dela.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `a-forma-da-spec`**

- **Joel Spolsky, *Painless Functional Specifications – Part 2: What's a Spec?*** — Joel on Software, out/2000 · ~8 min de leitura
  https://www.joelonsoftware.com/2000/10/03/painless-functional-specifications-part-2-whats-a-spec/
  Lista o que uma spec carrega e tem a seção "Nongoals": a lista do que não vai existir, escrita, porque todo mundo tem a funcionalidade favorita e fazer todas custa infinito.

A página não tem âncora por seção; mande a raiz e diga que o que interessa é "Nongoals", no meio da
lista. A spec dele é maior que a nossa (cenários, detalhes, questões abertas); as cinco partes da
aula são o mínimo que cabe numa página, e "Open Issues" é o que aqui vira premissa. Não ofereça o
resto da série.

**marco `o-claude-te-entrevista`**

- **Anthropic, *Best practices*, seção "Let Claude interview you"** — documentação do Claude Code · 2 min de leitura (a seção)
  https://code.claude.com/docs/en/best-practices#let-claude-interview-you
  Traz o prompt de entrevista em quatro linhas, manda escrever o SPEC.md no fim, e diz na frase seguinte que a execução começa em sessão nova, com o que a spec mais útil tem: o que fica de fora e uma verificação ponta a ponta.

É o link que fecha o marco, e serve de novo no marco `sessao-nova`, sem repetir a cerimônia: a
mesma seção diz que a sessão nova tem contexto limpo e a spec escrita para consultar. O prompt de
lá cita a ferramenta de perguntas do aplicativo; se o Claude da oficina perguntar em texto corrido
em vez de usar a ferramenta, não importa, o método é o mesmo. Ele lê o prompt e escreve o dele com
o problema dele; um prompt copiado sem a linha do que ele quer construir é o que produz entrevista
genérica.

- **Harper Reed, *My LLM codegen workflow atm*** — harper.blog, fev/2025 · ~13 min de leitura
  https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/
  É a origem do padrão: "uma pergunta de cada vez", cada uma construída sobre a resposta anterior, a spec compilada no fim e salva como `spec.md` no repositório, e o plano feito em outra conversa.

Só a primeira seção, "Idea honing", é desta aula; o resto (plano, TDD, ferramentas) é matéria da
2.9 e da 2.10, e você diz isso ao soltar o link. A variante de uma pergunta por vez é boa para quem
se perde com uma leva de perguntas de uma vez; mencione como opção, não como regra.

## Sugeridas

**marco `o-claude-te-entrevista`**

- **Radek Sienkiewicz (VelvetShark), *Stop prompting Claude Code — let it interview you (the "spec" workflow)*** — YouTube, jan/2026 · 9 min 7 s no total, trecho de 4 min 44 s, de 0:00 a 4:44
  https://www.youtube.com/watch?v=ob9WWuYlS5Q&hl=en&persist_hl=1
  O prompt de entrevista rodando de verdade: uma frase vira spec depois de trinta e duas perguntas. É o que ele acabou de fazer, visto de fora, com número para calibrar expectativa.

Corte em 4:44, "implementing the spec"; o que vem depois é reflexão de outro momento. Ofereça
depois da entrevista dele, não antes, senão ele copia o prompt do vídeo em vez de escrever o
dele. Inglês, sem legenda.

**fechamento**

- **Sean Grove, *The New Code*** — YouTube, canal AI Engineer, jul/2025 · 21 min 35 s
  https://www.youtube.com/watch?v=8rABwKRsec4&hl=en&persist_hl=1
  Argumenta que o código é uma projeção com perda da spec, que hoje se joga fora o prompt e se guarda o código gerado (o contrário de guardar a fonte), e mostra o Model Spec da OpenAI como spec versionada, com teste por cláusula.

Vinte minutos: ofereça no fechamento, não no meio. Em inglês, sem legenda em português; avise. O
miolo (Model Spec, o caso da sicofância do GPT-4o, alinhamento deliberativo) é sobre comportamento
de modelo e vai além da aula; o que ele traz de volta é a pergunta "qual artefato você guarda", que
é o gancho para a 2.9 tratar a spec como contrato que se atualiza. Se ele disse que viu, viu.
