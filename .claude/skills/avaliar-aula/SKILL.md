---
name: avaliar-aula
description: Avaliação estruturada de fim de aula. Invocar só no fechamento, depois do resumo ao aluno e antes de concluir a aula. Gera JSON por critério e registra pelo script. Nada disso aparece no chat.
user-invocable: false
---

# Avaliar a aula

Você acabou de conduzir a aula. Agora avalia o aluno com base no que aconteceu neste chat. A avaliação vai para a 202; o aluno não a vê. Não mostre nota, critério ou JSON no chat. Não anuncie que está avaliando, só registre.

## Critérios, cada um de 1 a 5

- **compreensao**: entendeu os conceitos a ponto de usá-los em situação nova? 5 = transferiu sem ajuda; 3 = entendeu com conserto; 1 = repetiu sem entender.
- **profundidade_perguntas**: as perguntas dele revelam pensamento? 5 = perguntas que anteciparam o próximo degrau ou expuseram limite real; 3 = perguntas pertinentes mas reativas; 1 = nenhuma pergunta ou só operacionais.
- **esforco**: fez as tarefas com empenho? 5 = tentou, errou, refez, trouxe evidência sem ser cobrado; 3 = fez o pedido; 1 = respondeu mínimo, pediu resposta pronta.
- **autonomia**: quanto precisou de você para andar? 5 = tomou iniciativa e decidiu sozinho o que verificar; 3 = precisou de direção a cada passo mas executou; 1 = travou sem empurrão.

Seja honesto e calibrado. Nota 5 é rara. Nota 3 é a régua de quem fez a aula direito. A distribuição entre 100 alunos precisa ter variância, senão a avaliação não serve.

## O que escrever

Um arquivo JSON em `trilha/tmp/avaliacao-<aula>.json` com exatamente esta forma:

```json
{
  "aula": "1.3",
  "criterios": { "compreensao": 3, "profundidade_perguntas": 2, "esforco": 4, "autonomia": 3 },
  "justificativa": "3 a 5 linhas. O que ele demonstrou, onde foi raso, o que sustenta cada nota fora da média.",
  "evidencias": ["até 3 trechos curtos, literais, do que o aluno disse ou fez. Máximo 300 caracteres cada."],
  "fluencia": { "passou": true, "tentativas": 1, "evidencia": "o que ele produziu na fluência e por que conta como transferência, em até 400 caracteres" },
  "suspeita": null,
  "resumo_qualitativo": "Uma ou duas linhas para acumular no perfil do aluno ao longo da trilha."
}
```

- `fluencia` é `null` em aula sem teste de fluência.
- `suspeita` é quase sempre `null`. Só preencha com `{ "descricao": "...", "evidencia": "..." }` quando houver sinal concreto de que o trabalho não foi do aluno: resposta colada de outro modelo, mudança abrupta de nível, evidência da oficina que não bate com o que ele descreve. Cite o trecho. Você sinaliza, nunca decide; um humano da 202 confirma. Falso positivo é pior que falso negativo.
- Trechos de evidência são curtos porque nunca sobe transcrição. Escolha os que sustentam as notas.

## Como registrar

1. Escreva o arquivo com a ferramenta Write em `trilha/tmp/avaliacao-<aula>.json`.
2. Rode `node .claude/scripts/trilha.js avaliar <aula> trilha/tmp/avaliacao-<aula>.json`.
3. O script valida a forma, codifica, enfileira e apaga o arquivo. Se reclamar, corrija o que ele apontou e rode de novo.
4. Volte ao fechamento da aula: `concluir <aula>` e despedida.
