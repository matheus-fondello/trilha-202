---
name: aula-6-3
description: Aula 6.3, Mostrar o trabalho. Sala e oficina, com o README da P2 ou da P3 reescrito para quem não abre código e um minuto de demo gravado. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 6.3: Mostrar o trabalho

**Goal:** o aluno sabe contar o que construiu para quem não viu o trabalho: escreve o README em camadas, com o topo para quem não abre código, monta uma demo de três minutos que prova em vez de passear, junta P1, P2 e P3 num portfólio com URL viva e uma linha cada, e conta o processo como evidência de verificação.

Contexto para discorrer, do seu jeito: os READMEs da P2 e da P3 foram escritos para um corretor que tinha o brief, e falam a língua do brief. Na 2.7 ele foi o leitor sem brief, e o tropeço típico ali é o `.env`. Quem chega agora: um recrutador, alguém da 202, um fundador, que dão meio minuto ao topo e não abrem código; e um engenheiro, que desce até o como rodar. É a página da 1.9 com outro visitante: a primeira tela diz o problema, de quem, o que o sistema faz e onde vê-lo funcionando; depois a prova; depois decisões e o que ficou de fora, que é o que mostra juízo; embaixo, as receitas, que ficam. "Next.js com Supabase e IA" não diz nada; "uma dedetizadora de Maringá levava um dia para responder orçamento no WhatsApp; aqui o cliente descreve a praga e o imóvel e recebe a faixa de preço na hora, e o técnico confere antes de confirmar" diz. O cliente é fictício, da trilha, e o README diz isso: vender não é inflar, e a mentira cai na primeira pergunta. A demo tem quatro partes: o problema, contra o jeito de hoje; o fluxo, usado de verdade; a prova; uma decisão difícil com a alternativa descartada. Sem tour de código. Fluxo feliz mostra que existe um caminho; prova é o que devia ser recusado sendo recusado, o teste rodando, o número medido. Vídeo é publicação (2.6): nada de chave, terminal com segredo nem dado real na tela. URL viva é a que funciona, não a que abre: banco gratuito pausa sem uso, chave vence, cota acaba. Contar o processo é o que o entrevistador quer: o que você pediu, o que o agente entregou errado com cara de certo, que evidência pegou, o que mudou depois. Agente errar é esperado; raro é quem pega.

Sala e oficina. A 1.9, a 2.6, a 2.7, a 2.8 e a 6.2 já foram dadas: referencie. Fica para depois: o README e o vídeo da P6, que junta tudo, com a receita que nasce dos `curl` da 6.2.

## Antes de começar

Confira no estado pasta, URL e repositório de P1, P2 e P3, e que a P2 e a P3 foram corrigidas; se uma não foi, ele usa a outra. Diga a ele: reescrever o README é portfólio, não recorreção; nada é corrigido de novo, e se uma URL mudar ele registra a nova com `pratica <P> url=<nova>`, o que não reabre a correção. Você não escreve README nem roteiro, nem escolhe a história. E diga com franqueza que **você não assiste vídeo**: confere o roteiro e o README, e o vídeo quem assiste é ele, ou um colega.

## Marcos

`node .claude/scripts/trilha.js milestone 6.3 <id>`:

- `quem-le`: ele sabe quem abre o README e o que cada leitor procura, e aponta no da prática escolhida o que só faz sentido para quem leu o brief. *Previsão, antes:* quem abre esse README daqui a seis meses, e o que faz no primeiro meio minuto? Caça quem escreve para quem já sabe o que o projeto é.
- `contar-o-processo`: ele escolheu, da própria prática, uma vez em que o agente errou e ele pegou, com a evidência que pegou. *Aplicação:* o entrevistador pergunta "se você não lê o código, como sabe que funciona?"; o que ele responde, com esse projeto? Caça quem responde com a confiança no agente ou com "testei" sem dizer o quê.
- `demo-que-prova`: ele sabe as quatro partes e escolheu, da prática dele, a prova que não é fluxo feliz. *Conceito:* a demo mostra três orçamentos certos seguidos; o que isso prova ao dono da dedetizadora, e o que ele ainda não sabe sobre o sistema? Caça quem toma fluxo feliz por prova.
- `portfolio`: P1, P2 e P3 com repositório público, URL viva e uma linha cada, e o lugar da P6 reservado. Cada URL e cada repositório ele abre numa janela anônima do navegador dele, usa o caminho principal (na P3, roda o `curl` do README como está) e conta o que voltou; a URL você pode abrir no painel. A que não funcionar, ele põe de pé de novo ou tira do portfólio.

## Fluência

Na oficina: o README da prática escolhida reescrito e no repositório, e um minuto de demo gravado (problema, fluxo e uma prova), num link que abre sem login, posto no README. Depois, como o `SPEC.md` na 2.8, uma sessão nova numa pasta vazia com só uma cópia do README diz o que é, para quem, como se sabe que funciona e como rodar; ele cola a resposta. Leia o README na pasta registrada; o roteiro dos três minutos ele cola aqui. Passa se a primeira tela responder problema, de quem, o que faz e onde ver, sem jargão do brief; se houver uma história de verificação com a evidência nomeada; se as receitas seguirem lá, sem credencial; se a sessão nova acertar as quatro; se o link do vídeo estiver no README e o roteiro marcar o minuto gravado; e se o roteiro tiver uma prova que não é fluxo feliz e nenhum código na tela. Registre com `fluencia 6.3 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima unidade: P6, MVP one-feature no ar. Gancho: hoje ele contou um projeto corrigido; na P6 o README e o vídeo de três minutos são entrega, e o produto é dele.
