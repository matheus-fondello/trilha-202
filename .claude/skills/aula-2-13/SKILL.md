---
name: aula-2-13
description: Aula 2.13, Segurança e dados. Sala e oficina, com a revisão de segurança da P2 por subagente e a lista de dados pessoais no README. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.13: Segurança e dados

**Goal:** o aluno trata toda entrada como hostil, põe segredo e autorização onde o usuário não alcança, roda uma revisão de segurança separada da de funcionalidade com a OWASP como lista, e decide o que o sistema guarda de cada pessoa com finalidade e mínimo, em vez de guardar tudo. Sai com a P2 revisada e o README dizendo que dado pessoal ela trata e o que faz com cada um.

Contexto para discorrer, do seu jeito: a 2.2 mostrou que o que está no navegador é do usuário; hoje o usuário é hostil. Injeção é texto que vira comando: o valor da conta colado dentro de uma consulta ao banco, um nome que vira comando de shell, e um texto que o modelo lê como instrução, que a P3 vai cobrar. A defesa é uma só, e é no servidor: validar o que entra e nunca montar comando com texto de fora. Autorização é o caso concreto do brief: o Carlos não vê o lead da Renata, nem trocando o número no endereço, e a porta mais comum é essa, o ID que se adivinha. A regra mora no servidor ou no banco, com a regra por linha que a 2.3 apresentou; escondida na tela, não existe. Na lista dos dez riscos da OWASP de 2025, controle de acesso quebrado é o primeiro e injeção o quinto; a lista irmã para sistemas com LLM abre com injeção de prompt. A lista é o checklist de uma revisão **separada** da de funcionalidade, por outro subagente, com a lista e o diff: quem procura bug não procura brecha. Dado pessoal é o que identifica alguém ou torna identificável: nome, WhatsApp, CPF, endereço; sensível é saúde, biometria, origem, religião. A foto da conta não é sensível, mas carrega CPF, endereço e um ano de consumo, e o simulador não precisa disso para calcular. A LGPD pede finalidade e necessidade: guardar o que serve para o que foi dito, e só; "guardar tudo, nunca se sabe" é exatamente o contrário, e é o que o cliente disse. A tarifa da ANEEL é pública; o CPF de alguém num bot do Telegram é vazado, e usar é crime mesmo estando ali. O simulador decide sozinho que uma conta de R$ 200 não compensa, e a lei dá ao titular o direito de pedir revisão por uma pessoa: a resposta honesta que o brief pede é também esse caminho. Em desenvolvimento, dado de exemplo inventado, e nunca dado real em log, teste ou prompt: a foto da conta colada no chat da oficina vira dado pessoal em histórico.

Sala e oficina. A 2.2, a 2.3 e a 2.6 já foram dadas: referencie.

## Antes de começar

Confira no estado a pasta e o repositório da P2. A P2 é corrigida e a régua não está neste chat. Você não faz a revisão de segurança, não lê o código dele e não diz o que guardar da foto da conta: pergunte para que cada dado serve, quem vê e por quanto tempo, e trabalhe com a resposta. O resultado do subagente e a lista do README vêm colados da oficina.

## Marcos

`node .claude/scripts/trilha.js milestone 2.13 <id>`:

- `entrada-hostil`: ele sabe o que é injeção nas três formas e onde a validação mora. *Previsão, antes:* o campo do valor da conta recebe dez mil caracteres, ou um pedaço de comando de banco; o que acontece? Caça quem acha que o formulário protege.
- `quem-ve-o-que`: ele sabe onde a autorização mora e por que ID adivinhável é porta. *Aplicação:* o Carlos troca o número no endereço de um lead e cai no da Renata; o que aparece, e quem devia impedir? Caça quem confia na tela.
- `revisao-de-seguranca`: ele rodou a revisão com a lista, por subagente separado, e decidiu o que corrigir.
- `dado-pessoal`: ele decidiu o que guardar de cada pessoa, com finalidade, e sabe a diferença entre fonte pública e vazada. *Conceito:* o cliente pediu para guardar tudo o que der; o que a lei diz sobre guardar sem saber para quê? Caça quem acha que guardar é grátis.
- `em-desenvolvimento`: os testes e os logs dele não têm dado real, e a foto da conta não passou pelo chat.

## Fluência

Na oficina, sobre a P2: uma revisão de segurança por subagente, com a lista da OWASP como checklist e o diff como objeto, separada da revisão da 2.12; corrigir o que afeta acesso, entrada ou segredo e recusar o resto com motivo; e o README com cada dado pessoal que o sistema guarda, para quê, quem vê e por quanto tempo. Passa se a revisão vier de contexto separado com a lista, se as correções forem as que mudam quem alcança o quê, e se a lista de dados mostrar decisão (algo que ele escolheu não guardar, ou guardar por um motivo), não só inventário. Registre com `fluencia 2.13 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima unidade: 2.14, Harness engineering, a última antes da P2; abre em chat novo. Gancho: o sistema já tem spec, testes, revisão e a lista de dados; antes dos quatro dias de fechamento, ele vai desenhar o ambiente em que esses dias acontecem, e é disso que a 2.14 trata.
