---
name: aula-6-1
description: Aula 6.1, O fluxo pagou → tem acesso. Sala e oficina: o fluxo desenhado, a P6 com conta de usuário e um Checkout de assinatura na sandbox da Stripe. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula 6.1: O fluxo pagou → tem acesso

**Goal:** o aluno desenha antes de construir o caminho do dinheiro no produto dele, com o estado do usuário em cada passo, abre a P6 com conta de usuário e sai com um Checkout hospedado de assinatura, no preço da 5.1, na sandbox da Stripe, sabendo por que não um formulário próprio, onde mora cada chave e o que a tela diz enquanto o pagamento não chegou.

Contexto para discorrer, do seu jeito: o fluxo não é "pagou, entrou"; é uma máquina de estados. Landing, cadastro, checkout, confirmação, acesso, renovação, cancelamento, e cada estado do usuário (sem assinatura, aguardando, ativo, renovação falhou, cancelado) tem o que ele vê. O agente constrói o caminho feliz; o resto, só se estiver escrito. A conta nasce antes do pagamento, com a autenticação do stack da trilha, Supabase Auth (2.3); na 3.6 era conta de funcionário, aqui é cadastro aberto. O cliente da Stripe não é o usuário dele: o servidor cria esse cliente antes da sessão, guarda o id no perfil e passa `customer` (ou `client_reference_id` com o id do usuário). A sandbox é a conta sem dinheiro, criada no painel; a geral, que a Stripe recomenda, não a anônima da linha de comando, que expira em sete dias. No Checkout hospedado o servidor cria a sessão e o navegador vai à página da Stripe: o cartão não passa por ele, o que reduz o PCI; um formulário próprio pode exigir mais de 300 controles. Cancelar e trocar cartão: o portal do cliente. A chave publicável pode ir ao navegador; as de servidor vão para o `.env` (2.6), e a Stripe recomenda a restrita no lugar da secreta. O Pix Automático é a recorrência do Pix: autorizado uma vez no app do banco, com valor máximo, e o banco avisa antes de cobrar. Pix em assinatura na Stripe exige Pix Automático, que a conta brasileira não tem: a assinatura é no cartão. O assíncrono que ela tem é o boleto, pago depois e confirmado em até um dia útil (testado na 6.2); nesse meio a tela diz o que falta e quanto leva.

Sala e oficina. A 2.3, a 2.6, a 3.3 a 3.6 e a 5.1 já foram dadas: referencie. Fica para depois: quem avisa o servidor que o dinheiro entrou e os quatro testes (6.2); README e demo (6.3).

## Antes de começar

Confira no estado a pasta do plano (P5) e a da P3. **O brief da P6 entra hoje** (`praticas/p6/brief.md`), lido antes de construir. O repositório nasce na oficina, público: pasta nova com `git init` (2.4, 2.5), ou a cópia com histórico da 2.7. Por padrão a P6 parte do motor da P3; reaproveitar ou recomeçar é o que o plano diz, sem ponto nem desconto; se não diz, ele decide e escreve lá. A feature entra hoje como está: na cópia da P3 (receita da 2.7) o motor vem junto; recomeçando, uma rota mínima da feature, só para logado, que a 6.2 vai trancar. Trocar o domínio é trabalho da P6. Se o plano não cobra por assinatura, vale o brief: o plano mensal mais próximo. Você não escolhe feature, stack nem preço. Registre `node .claude/scripts/trilha.js pratica P6 pasta=<caminho> repo=<url do GitHub>`, sem URL: ela abre a correção. A régua não está neste chat. Se a Stripe travar, a aula segue pelo desenho.

## Marcos

`node .claude/scripts/trilha.js milestone 6.1 <id>`:

- `o-fluxo-inteiro`: os sete passos e os estados, em texto, antes do código. *Previsão, antes:* um viveiro de mudas em Natal assina em março um catálogo com pedido online, a R$ 79, e em abril o cartão da dona vence; o que acontece com o acesso, e quem fica sabendo? Caça quem desenha uma linha reta e esquece a renovação.
- `conta-de-usuario`: cadastro, login e perfil na P6, com o lugar da assinatura. *Conceito:* a dona se cadastrou com o e-mail pessoal e pagou com o do viveiro; um mês depois a Stripe avisa que o pagamento falhou. Como o sistema sabe de quem é a conta, e o que quebra se procurar pelo e-mail? Caça quem não liga os dois.
- `sandbox-e-preco`: sandbox geral, preço mensal em BRL, chaves de servidor no `.env` e qual tipo ele usou.
- `checkout-hospedado`: a sessão nasce no servidor para quem está logado, o 4242 completa, e ele diz o que deixou de passar pelo servidor.
- `aguardando-pagamento`: Pix e Pix Automático hoje, e a tela de espera desenhada em texto. *Aplicação:* a cliente quer pagar todo mês por Pix, como paga a mensalidade da escola; o que a página de planos oferece e diz a ela? Caça quem esconde o que falta, ou mostra opção que não existe.

## Fluência

Na oficina, colado: logado, um clique leva à Stripe com o preço dele, o 4242 completa e volta, e o cliente da assinatura no painel é o que está no perfil (ou o `client_reference_id` da sessão é o id do usuário). Depois, em texto, aqui: o desenho do marco refeito contra o que existe, cada passo com quem age (navegador, servidor, Stripe), o estado e se já está construído. O passo em que o servidor sabe que o dinheiro entrou pode ficar como pergunta; se liberar na volta do navegador, deixe como está e não comente: é a 6.2. Passa se as evidências existirem, se cada passo tiver quem age e o estado, e se espera e falha de renovação tiverem caminho. Registre `fluencia 6.1 passou|nao-passou <tentativas>`.

Fechamento da `tutor`. Próxima aula: 6.2, Webhook e estado. Gancho: hoje o cliente pagou e voltou; na próxima, quem avisa o servidor que o dinheiro entrou.
