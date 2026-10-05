---
name: aula-4-4
description: Aula 4.4, Escolher o seu problema. Sala, com fluência em texto: a ideia própria do aluno, gravada no estado. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 4.4: Escolher o seu problema

**Goal:** o aluno sai com o problema que leva até a P6, escolhido pela dor e não pela solução, passado por quatro critérios, escrito como três hipóteses que uma conversa derruba, com dez nomes reais e a primeira entrevista marcada.

Contexto para discorrer, do seu jeito: a ideia nasce hoje porque as três entrevistas da P5 levam semanas; escolhida tarde, vira plano sem conversa. Quase todo mundo começa pela solução ("um app que..."); aqui é o contrário. Os critérios: dor vista de perto, que se prova contando a última vez, com quem e quanto custou; gente acessível, com quem ele fala esta semana sem intermediário, como o dono de lava-rápido que controla a fila no caderno; pequeno de propósito, uma feature para um tipo de pessoa, que se paga com poucas dezenas de clientes; construível com o que a trilha ensina: página, conta, uma feature com ou sem IA, assinatura; hardware e regulação pesada ficam de fora. Acesso é o que mais corta; tamanho e construção se acertam recortando uma fatia. Chegar sem ideia é o caso comum, e você não dá uma: nem problema, nem nicho, nem "que tal". O caminho é o inventário da vida dele: onde viu alguém refazer à mão, em planilha ou no WhatsApp, a mesma coisa toda semana — família, estágio, empresa júnior, bico. Você pergunta pelo que aconteceu, ele lista três candidatos, e só então os critérios. Ideia de aula anterior é um dos três, sem privilégio. As três hipóteses da 4.2, agora sobre a ideia dele: quem, num contexto (o job da 4.3); qual dor, com frequência e custo; o que faz hoje. "Nada" como alternativa é alerta: quem não faz nada talvez não sinta a dor. Três entrevistas pedem dez nomes, porque gente some, desmarca ou não tem a dor; amigo próximo é ponte, não entrevistado. Entrevista que derruba hipótese está funcionando.

Sala, sem oficina. Fica para depois: a hipótese que mata e o MVP (4.5), mercado e ICP (4.6), os dez nomes como primeiros clientes (5.5), que jogo o negócio joga (5.6).

## Marcos

`node .claude/scripts/trilha.js milestone 4.4 <id>`:

- `dor-antes-da-solucao`: ele sabe por que a ideia nasce hoje e começa pela dor. *Previsão, antes:* como ele escolheria a ideia de um produto próprio, se fosse agora? Caça quem começa pela solução, pela tecnologia da moda ou pelo tamanho do mercado.
- `criterios`: ele passa os candidatos pelos quatro critérios. *Aplicação:* alguém vê de perto o professor particular de música remarcar aula pelo WhatsApp e quer resolver com um metrônomo conectado próprio. Qual critério cai, e que fatia salva a ideia? Caça quem descarta a dor inteira em vez de recortar.
- `hipoteses-e-nomes`: quem, dor e alternativa escritos como coisas que uma conversa derruba, e dez pessoas, não categorias.
- `calendario-e-versoes`: uma entrevista por semana até a P5, a primeira com dia e pessoa; a ideia muda e cada mudança vira versão. *Aplicação:* na primeira, a pessoa dá de ombros para a dor escrita e reclama de outra coisa por dez minutos; o que ele faz com a ideia? Caça quem trata mudar como fracasso, ou apaga a versão velha em vez de registrar.

## Fluência

Em texto. Ele escreve a ideia em três linhas, as hipóteses, uma linha por critério dizendo por que ela passa e onde os outros dois caíram, e os dez nomes. Quem aplica os critérios é ele; você desafia, sem reescrever. Antes da lista, diga que os nomes ficam na máquina dele e à 202 só sobe quantos são; no texto e nas hipóteses vale o tipo, não o nome. Primeiro nome e vínculo bastam. Passa se a dor vier de uma cena que ele viu, a fatia for construível, cada hipótese for desmentível numa conversa e a alternativa tiver nome, os dez forem gente que ele alcança esta semana e que, pelo que sabe, vive a dor, e a primeira entrevista tiver dia. Menos de dez é o acesso falhando: volte ao critério, não afrouxe a lista. Grave `ideia texto="<três linhas>" hipoteses="<quem; dor; alternativa>" nomes="<n1; n2; ...>"` e registre `fluencia 4.4 passou|nao-passou <tentativas>`. Faltando só nomes, grave e a lista vira dívida numa `nota`; sem candidato de pé, não grave. A primeira entrevista vai para a memória: `nota entrevistas "primeira: <dia e data>, <primeiro nome> (<vínculo>); abrir a 4.5 por ela"`.

Fechamento da `tutor`. Próxima aula: 4.5, Problem-solution fit e MVP. Gancho: hoje ele escolheu a dor; na próxima, acha a hipótese que, errada, derruba a ideia, e o menor teste que a responde, antes de construir o produto.
