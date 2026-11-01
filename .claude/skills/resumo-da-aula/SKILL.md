---
name: resumo-da-aula
description: Como escrever o resumo de fim de aula, que o aluno lê no chat e depois trabalha na aba Anotações do app. Carregue no fechamento de toda aula (não de prática nem de quiz), depois da fluência.
user-invocable: false
---

# Resumo da aula

O aluno anota. Depois da fluência ele esquece um conceito, confunde um com outro, e volta a perguntar ou a rolar a conversa atrás do trecho. O resumo é a página que ele guarda: aparece aqui no chat e vai para a aba **Anotações** do app, onde ele marca com marca-texto, edita, acrescenta as notas dele e revisa em cartões. Escreva para quem vai reler daqui a uma semana sem a conversa na frente.

**Quando:** no fechamento de toda aula, depois da fluência registrada (sem fluência, depois do último marco), na mesma resposta da despedida e antes dela. Prática e quiz não têm resumo.

**O formato é fixo**, porque o app o separa em partes. Em inglês, o cabeçalho é `## Lesson summary <id> · <título>` e as seções seguem o mesmo molde.

```
## Resumo da aula 1.4 · Onde o LLM erra

> **A ideia:** uma frase, a tese da aula dita para este aluno.

### O que foi explicado
- **Tópico, na ordem em que a aula andou.** O que você explicou dele, em duas a quatro frases, com o exemplo que usou nesta conversa.

### Conceitos
- **Termo.** O que é, em uma ou duas frases sem jargão. *No seu caso:* onde isso apareceu nesta aula, se apareceu.

### Onde você tropeçou
- **O que ele pensou ou fez, numa frase.** Você escreveu: "trecho curto, literal". **O certo:** a forma certa. **Como corrigir:** uma ação concreta para a próxima vez.

### Para revisar
- **Tópico.** Por que voltar nele. [Título da referência](url)
```

Regras de cada parte:

- **A ideia:** uma frase só. Não é o goal da aula copiado; é o que ficou de pé na conversa com ele.
- **O que foi explicado:** de três a seis tópicos, na ordem da aula (os marcos dão o mapa). É o conteúdo, para quem precisa relembrar a matéria sem reler a conversa: em cada um, o que você explicou, em duas a quatro frases, com o porquê e o exemplo desta sessão quando houver (a oficina dele, a tarefa, uma pergunta que ele fez). Não é a lista do que aconteceu ("fizemos o exercício"), é o que ele precisa saber.
- **Conceitos:** de três a cinco, os termos que a aula de fato usou, como num glossário: o termo em negrito e o que ele é, em uma ou duas frases, nas palavras que você usou com ele. Não repita aqui o parágrafo do tópico. *No seu caso* só com um exemplo concreto desta sessão: a tarefa, a oficina, uma frase dele. Sem exemplo, sem a etiqueta.
- **Onde você tropeçou:** de zero a três, só o que aconteceu nesta sessão: uma resposta errada, uma confusão entre dois conceitos, uma parte da fluência que faltou, um hábito que apareceu. Cite a frase dele quando houver uma, curta e literal, entre aspas. "O certo" corrige o conceito; "Como corrigir" é o que ele faz na próxima vez, não um conselho genérico. Previsão errada antes da explicação não é tropeço: a pergunta de previsão existe para errar. Sem tropeço que valha, escreva um item só: "Nenhum tropeço que valha registrar nesta aula." Não invente erro para a seção não ficar vazia, e não suavize um erro real.
- **Para revisar:** de um a três, ligados aos tropeços ou ao que ficou raso. Link só das referências da aula (o `referencias.md`), com a URL copiada exata; sem referência que sirva, sem link. O comando tira link que não está nas referências.

O que não entra: nota, avaliação, juízo sobre a pessoa ("você foi muito bem", "faltou esforço"), a próxima aula (essa vai na despedida, depois do resumo), e nome de terceiro que ele contou (entrevistados, clientes). Tamanho: de 300 a 550 palavras, a maior parte em "O que foi explicado".

Depois de escrever o resumo e a despedida, rode `resumir <aula>` no começo da chamada do fechamento, antes da `nota`, do `concluir` e do `avaliar`: o comando acha o resumo no que você acabou de escrever. Se ele disser que não achou, siga o que ele mandar, sem mostrar o resumo de novo ao aluno.

**No Codex:** o mesmo resumo, o mesmo comando; ele lê a sua mensagem na conversa do Codex.
