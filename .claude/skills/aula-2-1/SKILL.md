---
name: aula-2-1
description: Aula 2.1, O que significa shippar. Sala e oficina, com fluência sobre a P1 já entregue. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 2.1: O que significa shippar

**Goal:** o aluno para de confundir "está no ar" com "está em uso", conhece o ciclo de vida inteiro de um software, sabe apontar onde a IA acelerou de verdade e onde ela não mudou nada, e leva a primeira dose do problema dos 80%. Abre o módulo de engenharia dando nome ao que vem: as próximas aulas são a distância entre a página que ele entregou e um produto que alguém usa.

Contexto para discorrer, do seu jeito: ele acabou de entregar a P1, e ela está no ar. No ar é o começo, não o fim — ninguém achou, ninguém confiou, ninguém usou no celular ruim de uma pessoa de verdade, e ninguém está de plantão quando quebrar às onze da noite. Shippar é o software existindo na vida de alguém que não é você, e isso puxa um ciclo inteiro: alguém decide o que construir, alguém desenha, alguém implementa, alguém verifica, alguém põe no ar, alguém mantém. A IA comprimiu com força uma dessas fatias, a implementação, e quase não tocou nas outras — decidir o que construir continua sendo conversa com gente, verificar continua sendo evidência, e manter continua sendo alguém acordando quando o cliente reclama. É por isso que a trilha gasta mais aula em spec e verificação do que em escrever código: a parte cara mudou de lugar. Daí sai o efeito que ele vai sentir no módulo inteiro: a demo sai numa tarde e o produto leva semanas. Os primeiros 80% são o que o agente entrega rápido; os 20% que faltam são erro, borda, dado ruim, gente usando de um jeito que ninguém previu, e é onde mora quase todo o trabalho de verdade. Não trate isso como pessimismo, trate como planejamento: quem sabe que o 20% existe reserva tempo para ele e entrega; quem não sabe promete sexta e entrega no mês seguinte.

Sala e oficina. A oficina do módulo inteiro é o repositório da P1. Fica para outras aulas: como escrever a spec, como testar, como revisar, como manter.

## Antes de começar

Confira no estado se a P1 está registrada com pasta, URL e repositório. É a oficina de todas as aulas até a 2.6; se faltar algo, resolva antes, como a `tutor` manda.

## Marcos

`node .claude/scripts/trilha.js milestone 2.1 <id>`:

- `no-ar-nao-e-shippado`: ele consegue nomear, na própria página, o que separa "existe na internet" de "está em uso". *Previsão, antes:* o que ele acha que falta para a página dele virar produto? Caça quem acha que a diferença é quantidade de funcionalidade, quando é operação.
- `o-ciclo`: ele sabe as seis etapas e reconhece que fez todas na P1, mesmo sem nome.
- `onde-a-ia-acelera`: ele separa a fatia que encolheu da que não encolheu. *Aplicação:* ele prometeu uma mudança na P1 para sexta e a implementação sai numa tarde; onde vai o resto da semana? Caça quem faz cronograma pela única fatia que a IA encolheu.
- `os-oitenta-por-cento`: ele reconhece o efeito no próprio trabalho da P1 e sabe que o módulo é sobre os 20%.

## Fluência

Na oficina, sobre a P1: listar o que falta entre a página no ar e a página shippada, e executar um item dessa lista. Passa se a lista separar operação de funcionalidade — não vale "adicionar mais uma seção" — e se o item feito vier com evidência, como a 1.3 ensinou. Registre com `fluencia 2.1 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 2.2, Cliente, servidor e API. Gancho: para o primeiro item sério dessa lista, a página dele vai precisar de algo que ela ainda não tem — um servidor.
