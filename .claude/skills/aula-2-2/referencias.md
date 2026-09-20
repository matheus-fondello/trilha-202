# Referências, aula 2.2

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

A MDN tem "Como a Web funciona" em português, mas é uma tradução de uma versão antiga e mais curta: ela para nos pacotes e **não tem** as seções de HTTP, de códigos de status nem de partes da URL, que são justamente o miolo desta aula. Por isso a primeira citada vai em inglês; a tradução do lado do servidor, essa sim, está completa e vai em português. A documentação do Next.js reorganiza URL de App Router com frequência: se uma âncora cair, use a raiz da página em vez de caçar a seção nova no meio da aula.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `requisicao-e-resposta`**

- **MDN Web Docs, *How the web works — HTTP basics*** — documentação · ~4 min de leitura
  https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works#http_basics
  Mostra uma requisição HTTP crua de duas linhas (`GET /en-US/ HTTP/2` e o `Host:`), o `200` da resposta, e logo abaixo destrincha uma URL em protocolo, domínio e caminho.

Essa seção é o fim do artigo, não o começo. Quem subir um pouco pega DNS e pacotes; quem descer pega os outros códigos de status e as partes da URL. Solte o link quando o aluno perguntar "mas o que exatamente viaja no cabo" — a resposta é texto, e ver o texto vale mais do que a metáfora do carteiro.

**marco `front-e-back`**

- **MDN Web Docs, *Introdução ao lado servidor — programação do lado do servidor e do lado cliente são iguais?*** — documentação · ~3 min de leitura
  https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Extensions/Server-side/First_steps/Introduction#a_programação_do_lado_do_servidor_e_do_lado_cliente_são_iguais
  Separa as duas responsabilidades sem virar aula de linguagem: o cliente cuida de como a página parece e se comporta, o servidor decide qual conteúdo sai.

**marco `api-e-contrato`**

- **ViaCEP, *Webservice CEP e IBGE gratuito*** — documentação · ~4 min de leitura
  https://viacep.com.br/
  Contrato inteiro numa página só: o formato do endpoint, o JSON que volta, o `400` para CEP malformado e o `"erro": "true"` — string, não booleano — para CEP válido que não existe.

Aqui a referência serve de exemplo vivo, não de leitura. É uma API pública brasileira, sem chave, que responde no navegador: `https://viacep.com.br/ws/01001000/json/` devolve a Praça da Sé. Use esse endereço como o "endpoint" concreto quando explicar contrato — o aluno abre no navegador dele e o JSON aparece. Os dois casos de erro são o gancho pronto para o assunto de limite e falha no fim da aula, e o segundo é o mais interessante: CEP que não existe volta com status 200 e um campo de erro no corpo. Falha de negócio não é falha de transporte, e quem não lê o contrato trata as duas igual.

**marco `a-pagina-ganha-servidor`**

- **Next.js, *Route Handlers — Convention*** — documentação oficial · ~1 min de leitura (a seção)
  https://nextjs.org/docs/app/getting-started/route-handlers#convention
  Diz em quatro linhas o que é uma rota de servidor no Next.js: um arquivo `route.ts` dentro de `app/`, uma função exportada por método HTTP, e a regra de que `route.js` e `page.js` não convivem no mesmo caminho.

A parte útil da página termina em "Supported HTTP Methods". O que vem depois (cache, Cache Components, prerender) não é assunto desta aula e desorienta se o aluno rolar até lá; se ele descer, diga que aquilo é problema de outra aula.

## Sugeridas

**marco `requisicao-e-resposta`**

- **Fireship, *Computer Networking in 100 Seconds*** — YouTube, ago/2020 · 2 min 17 s
  https://www.youtube.com/watch?v=keeqnciDVOo&hl=en&persist_hl=1
  O caminho do clique à resposta em animação: o pacote saindo do navegador, atravessando a rede e voltando. A MDN citada mostra o texto da requisição; este mostra o caminho que o texto percorre.

Ofereça antes da MDN. Vídeo de 2020, e o par requisição e resposta não mudou.

**marco `front-e-back`**

- **Next.js, *How to use environment variables in Next.js — Bundling Environment Variables for the Browser*** — documentação oficial · ~2 min de leitura
  https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
  É onde a fronteira entre front e back vira uma regra que se pode conferir: sem o prefixo `NEXT_PUBLIC_` a variável fica só no servidor, com o prefixo ela é colada dentro do JavaScript que desce para o navegador.

Ofereça no fim do marco, quando o "por que isso decide onde vive um segredo" já foi dito e ainda está abstrato. São três minutos e o aluno volta com a regra na mão, o que deixa o marco `a-pagina-ganha-servidor` mais fácil: ele já sabe por que a chave não pode morar no HTML. Não ofereça no fechamento — ali já não muda o trabalho dele.

**marco `api-e-contrato`**

- **Yudi Ganeko, *O que é API (em 2 minutos)*** — YouTube, em português, set/2025 · 2 min 34 s
  https://www.youtube.com/watch?v=Q-lyQ7BdDXE&hl=en&persist_hl=1
  API como contrato dito em português, com exemplo fora de código: o conceito em voz, antes ou depois da ViaCEP, que é a demonstração viva.
