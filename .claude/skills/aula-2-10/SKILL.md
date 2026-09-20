---
name: aula-2-10
description: Aula 2.10, Testes e TDD com agentes. Sala e oficina, com a segunda fatia da P2 nascendo de um teste que falha. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.10: Testes e TDD com agentes

**Goal:** o aluno para de aceitar "parece certo" como evidência, sabe onde um teste vale o custo e onde não vale, roda o loop vermelho, verde, refatorar com o agente executando e ele julgando, nunca deixa o agente mexer no teste para passar, e sai com o check rodando sozinho a cada mudança.

Contexto para discorrer, do seu jeito: a 1.4 explicou que o modelo produz o plausível, e código plausível é o que compila, parece certo e está errado num caso que ninguém olhou. "Implementei e testei" na resposta do agente quase nunca significa que algo rodou. Teste é o check da 1.3 escrito de uma vez e rodado para sempre. Três tipos, e o custo sobe com a distância: unitário confere uma função em milissegundos; integração confere duas peças juntas, a rota com o banco; ponta a ponta confere o que o usuário faz pela tela, e é lento e frágil. Muitos embaixo, poucos em cima. O que testar é onde dói: dinheiro na frente do cliente, quem pode ver o quê, o dado que não pode se perder; e as bordas, valor zero, vazio, absurdo, fora da lista. Não se testa o framework. O loop de Kent Beck tem cinco passos: lista de cenários, um deles vira um teste executável, o código muda até esse teste passar sem quebrar os anteriores, refatora se valer, repete. Com agente, o loop fica mais forte, porque o teste vermelho é a condição de parada da 1.3 e o agente roda até passar sem ninguém cutucar. O que muda para o aluno é a ordem: teste antes, saída vermelha lida antes de pedir código, e código só o que o teste pede. A regra que a aula mais defende: o agente **não mexe no teste** para passar. Teste que "passa" porque o valor esperado mudou, foi pulado ou apagado é o gênio trapaceando, na frase do Beck, e o agente faz isso se ninguém disser que não pode. Três antipadrões: o teste que passa sempre porque não afirma nada, o dublê que substitui tudo, e cobertura como vaidade. Por fim, o check roda sem ninguém lembrar: um hook que roda os testes a cada edição, e uma integração contínua mínima que roda a suíte no pull request da 2.6.

Sala e oficina. A 1.3, a 1.4 e a 1.8 já foram dadas: referencie. Fica para depois: bug com tudo verde (2.11), revisão contra a spec (2.12), dado pessoal (2.13).

## Antes de começar

Confira no estado a pasta e o repositório da P2, e se a fluência da 2.9 passou: a primeira fatia existe e a ordem das fatias está no SPEC.md; a segunda é a de hoje. A P2 é corrigida e a régua não está neste chat. Você não escreve teste e não escolhe o que testar por ele: pergunte onde dói no sistema dele e trabalhe com a resposta. O brief diz onde o cliente sabe que está fraco; quem lê acha. A evidência vem colada da oficina: saída vermelha, saída verde, o hook disparando.

## Marcos

`node .claude/scripts/trilha.js milestone 2.10 <id>`:

- `plausivel-por-construcao`: ele sabe por que "parece certo" não é evidência e o que cada tipo de teste custa. *Previsão, antes:* o agente responde "implementei e testei a conta do simulador"; o que ele acha que aconteceu na máquina? Caça quem imagina que algo rodou.
- `onde-doi`: ele nomeou, no sistema dele, o que dói e as bordas que valem teste, e o que não vale. *Aplicação:* o agente propõe quarenta testes de tela e nenhum da conta; aceita? Caça quem mede teste por quantidade.
- `o-loop`: ele rodou vermelho, verde, refatorar com o teste antes do código.
- `nao-conserta-o-teste`: ele sabe reconhecer o teste que "passou" porque mudou. *Conceito:* o teste ficou vermelho, o agente ajustou o valor esperado e ficou verde; o que aconteceu com o sistema? Caça quem acha que verde é sucesso.
- `check-automatico`: os testes rodam sozinhos a cada mudança na oficina.

## Fluência

Na oficina, sobre a P2: a segunda fatia da ordem dele, em TDD. Lista de cenários, um teste que falha antes de existir código, a saída vermelha colada aqui, a implementação mínima, a verde, e um hook que roda os testes a cada edição, provado com a saída dele depois de uma mudança qualquer. Passa se o vermelho vier antes do código, se a implementação for só o que o teste pediu, se o teste que passou for o mesmo que falhou, e se o hook disparar sem ninguém chamar. Registre com `fluencia 2.10 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.11, Debugging sem ler código. Gancho: hoje o teste nasceu antes do código; na próxima alguma coisa quebra com tudo verde, e ele vai da evidência até a causa.
