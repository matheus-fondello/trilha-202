---
name: aula-2-9
description: Aula 2.9, Critérios de aceitação e decomposição. Sala e oficina, sobre o SPEC.md da P2 e a primeira fatia dele. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.9: Critérios de aceitação e decomposição

**Goal:** o aluno sai com a spec da P2 conferível por máquina e por corretor: critério com exemplo e resultado esperado antes de construir, restrições nomeadas, fatias da tela ao dado ordenadas por risco, e a spec como contrato com o agente — no repositório, verificada ponta a ponta, atualizada quando muda.

Contexto para discorrer, do seu jeito: a 2.8 deixou uma página que diz o que o sistema é. Hoje ela ganha o que a 1.3 cobrava de cada pedido: "pronto" definido antes. Critério verificável tem exemplo e resultado esperado. "O simulador deve ser preciso" não é critério; "dado uma conta de R$ 600 em Sorocaba, o sistema sugere entre X e Y kWp" é, mesmo sem ele saber X e Y ainda: o critério aponta o que descobrir. Restrição é critério que corta o espaço em vez de pedir função: técnica, de dado, de tempo, legal (a foto da conta carrega CPF; o que guardar é decisão dele, e a 2.13 cobra), de custo. Restrição fora do papel vira decisão do agente. Cortar por camada — banco todo, depois rotas, depois telas — chega ao quarto dia sem nada inteiro. Fatia vertical atravessa: uma entrada, uma conta, uma tela, um dado guardado; fina, mas inteira. A ordem é por risco: primeiro o que pode derrubar o projeto, e o brief diz onde o cliente sabe que está fraco — quem lê acha, quem decide é ele. A spec vira contrato quando é arquivo no repositório e não conversa: o agente lê, o revisor da 2.12 e a correção conferem contra ela. Termina com a verificação ponta a ponta, o que alguém faz do começo ao fim para provar que funciona. Decisão que muda no meio muda a spec antes do código; senão ela vira ficção, e revisor confere contra ficção. E a spec em português é o código de verdade: o sistema sai dela. A língua prende bem comportamento, exemplo e o que fica fora; escapa na ambiguidade que o humano resolve sem notar e o agente resolve do jeito dele. Critério com exemplo fecha essa brecha.

Sala e oficina. Fica para depois: teste (2.10), revisão contra a spec (2.12), dado pessoal (2.13).

## Antes de começar

Confira no estado a pasta e o repositório da P2 que a 2.8 registrou; se faltar, `pratica P2 pasta=<caminho> repo=<url>`. Leia o SPEC.md dele: é o objeto da aula. A P2 é prática corrigida e a regra da P1 vale: método e forma são seus; critério, fatia, ordem e modelagem são dele; o que falta você não aponta, e a régua você não conhece. Perguntar o que ele acha é melhor que responder.

## Marcos

`node .claude/scripts/trilha.js milestone 2.9 <id>`:

- `criterio-verificavel`: ele reescreveu ao menos um critério da própria spec com exemplo e resultado esperado. *Conceito:* "o simulador não pode prometer retorno menor que a planilha" — isso já é verificável? O que falta? Caça quem confunde frase clara com critério conferível.
- `restricoes`: ele listou as restrições da P2 nas cinco famílias e sabe qual delas o agente decidiria sozinho se faltasse.
- `fatias-verticais`: ele cortou a spec em fatias que atravessam da tela ao dado e ordenou por risco, com a razão de cada posição. *Previsão, antes:* por onde ele começaria a construir amanhã, e por quê? Caça quem começa pelo mais fácil, pelo mais visível ou pela camada inteira.
- `spec-como-contrato`: o SPEC.md está commitado com critérios, restrições, ordem de fatias e a verificação ponta a ponta no fim. *Aplicação:* no segundo dia o dado público chega num formato que muda a modelagem; o que mexe primeiro, spec ou código? Caça quem trata a spec como documento de abertura.
- `linguagem-natural`: ele sabe o que a spec em português prende e onde escapa.

## Fluência

Na oficina, sobre a P2: cinco critérios verificáveis no SPEC.md, a ordem das fatias com a razão de cada uma, e a primeira fatia da ordem dele implementada, com a evidência do critério passando, como na 1.3. Passa se os cinco tiverem exemplo e resultado esperado sem você reescrever nenhum, se a fatia atravessar da tela ao dado, e se a evidência for do critério e não afirmação do agente. Registre com `fluencia 2.9 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.10, Testes e TDD com agentes. Gancho: hoje o critério ficou em português e quem conferiu foi ele; na próxima ele vira teste, e a segunda fatia nasce dele.
