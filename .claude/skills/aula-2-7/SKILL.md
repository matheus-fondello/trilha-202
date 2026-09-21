---
name: aula-2-7
description: Aula 2.7, Projeto que não é seu. Sala e oficina, com uma issue resolvida e um PR aberto na cópia do aluno. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.7: Projeto que não é seu

**Goal:** o aluno põe para rodar uma base que não escreveu, entende o suficiente sem ler o código, encaixa uma mudança pequena na convenção do projeto, prova o que fez e descreve isso para quem não o viu trabalhar.

Contexto para discorrer, do seu jeito: tudo na trilha até aqui nasceu da mão dele. No mercado é o contrário: a primeira tarefa de qualquer emprego é mexer no que já existe. O projeto é o **verificador de certificados da 202**, o código que confere se um certificado da trilha é verdadeiro, inclusive o dele: Express e EJS, sem banco; o app, as rotas e os ajudantes em `src/`, os templates em `src/views/`, os certificados em `dados/certificados.json`, os testes em `test/` e CI a cada PR. O CONTRIBUTING é a régua: branch por mudança; commit em português, imperativo, até 60 caracteres; teste para toda mudança de comportamento; ajudante de `src/` reaproveitado, nunca duplicado na rota ou na view; o JSON dos dados fora da mão; e o dígito verificador de `src/codigo.js` intocado — mexer nele invalida todo certificado emitido.

O tropeço de partida é matéria: `npm start` roda com `--env-file=.env`, o arquivo não vem no repositório, e a primeira tentativa morre com erro do Node. A resposta está no README, numa seção "Configuração" perto do fim, fora do passo a passo de rodar: **deixe acontecer** e não resgate antes de ele voltar ao README.

Seis issues abertas: minúsculas não são encontradas; a página de "não encontrado" assusta; data em formato de computador; carga horária não aparece; mostrar os módulos concluídos; revogado aparece como válido. Sorteie uma ou deixe ele escolher; a mesma serve a vários, porque cada PR fica numa cópia. **Você não tem o gabarito:** conhece a forma, não a resposta. Cada issue tem uma última frase que importa, e é nela que a pressa falha; o CONTRIBUTING diz onde a coisa mora e o que não se toca; o caminho errado típico é reescrever ou duplicar em vez de encaixar. Julgue comportamento — mapa antes de mexer, diff pequeno, teste novo, testes velhos verdes, evidência sem você pedir —, não o diff perfeito.

## Antes de começar

Ele **não faz fork e não abre PR na 202**: clona, sobe para um repositório vazio da conta dele (receita da 2.5, histórico preservado) e abre o PR de branch para `main` na própria cópia. Não há comando para registrar isso, e não invente um: ele cola a URL do PR aqui. A issue abre no painel pelo link do `referencias.md`.

## Marcos

`node .claude/scripts/trilha.js milestone 2.7 <id>`:

- `clonar-e-rodar`: a cópia está no GitHub e o projeto sobe na máquina dele. *Previsão, antes:* o repositório tem README, testes e CI verde; o que ele aposta que vai dar errado na primeira vez? Caça quem acha que README bom significa `npm install` e pronto.
- `entender-sem-ler`: ele tem o mapa do projeto, vindo do agente e do `/init`, e diz o que faz o quê, onde mora a parte da issue dele e o que o CONTRIBUTING proíbe. Ler o código nunca foi a regra da trilha; verificar é.
- `mudar-pequeno`: a mudança encaixou no que já existia e ele diz o que decidiu não tocar. *Aplicação:* o agente resolve a issue em nove arquivos, com uma função nova que repete um ajudante de `src/`, e a página funciona. Ele aceita? Caça quem confunde "funcionou" com "pronto para revisão".
- `provar`: testes antigos verdes, um teste novo no arquivo certo, a mudança vista na tela e o revisor adversarial da 1.3 sobre o diff. *Conceito:* `npm test` verde prova que o pedido da issue foi atendido? Caça quem toma suíte verde por prova do pedido: ela só protege o que já era testado.
- `pr-como-conversa`: o PR diz o que mudou, por que mudou e como ele verificou, para quem não viu nada disso.

## Fluência

Na oficina: a issue resolvida numa branch da cópia dele, testes antigos verdes, um teste novo, evidência na tela, e o PR aberto dizendo o que mudou, por quê e como verificou. O CI verde é evidência a mais, não a única. Passa se evidência e descrição vierem sem você ditar a forma. Registre com `fluencia 2.7 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.8, O problema bem definido. Gancho: hoje ele mexeu no que existia, com pedido pequeno e uma base que dizia onde cada coisa mora; na próxima começa a P2 do zero, virando um pedido em spec.
