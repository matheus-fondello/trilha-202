# Referências, aula 2.6

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Duas armadilhas nesta aula. A primeira: o Twelve-Factor argumenta *contra* agrupar variáveis em ambientes nomeados, e a Vercel faz exatamente isso com dev/preview/produção — se o aluno notar a contradição, é sinal bom, e a resposta é que o princípio (config fora do código) se sustenta nas duas leituras. A segunda: a documentação da Vercel muda de layout e de nome de plano com frequência; se a âncora não abrir mais, mande o aluno pelo menu de Deployments e não invente URL. O link do GitHub aponta para a versão em português, que é boa, mas a tradução usa "alterar o segredo" onde o inglês diz "rotate" — a palavra que o aluno precisa levar é **rotacionar**.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `o-que-nunca-commitar`**

- **Vercel, *How to use environment variables in Next.js*** — documentação do Next.js · 6 min de leitura
  https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
  Explica que o prefixo `NEXT_PUBLIC_` faz o valor ser gravado dentro do JavaScript entregue ao navegador: é a prova, na documentação oficial, de que existe uma diferença dura entre variável do servidor e variável pública.

A mesma página abre com o aviso de que o template do `create-next-app` já põe todo `.env` no `.gitignore` e que quase nunca se quer commitar esses arquivos. Use o link quando o aluno perguntar "e como o site sabe a chave então", não antes. É a mesma página que a 2.2 ofereceu no painel; se ele já abriu lá, cite e siga.

**marco `se-vazou`**

- **GitHub, *Remover dados confidenciais de um repositório*** — GitHub Docs, em português · 10 min de leitura
  https://docs.github.com/pt/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository#about-removing-sensitive-data-from-a-repository
  A própria documentação do GitHub diz que o primeiro passo é revogar ou trocar o segredo, e que reescrever o histórico pode nem ser necessário depois disso — é a ordem invertida do que o aluno imagina.

Esse é o link que fecha o marco. A seção seguinte, sobre os efeitos colaterais de reescrever o histórico (todo mundo que clonou precisa re-clonar), serve se o aluno insistir em "mas dá pra apagar".

**marco `ambientes`**

- **Adam Wiggins, *III. Configurações*, The Twelve-Factor App** — 12factor.net, 2011, revisto em 2017 · 3 min de leitura
  https://12factor.net/pt_br/config
  Traz o teste que resolve a dúvida de uma vez: se o repositório pudesse virar público agora mesmo, sem vazar nenhuma credencial, a configuração está no lugar certo.

Tradução para o português do Brasil, boa. Curta o bastante para o aluno abrir e ler no meio da conversa sem perder o fio.

**marco `preview-por-pr`**

- **Vercel, *Environments* — seção Preview Environment** — documentação da Vercel · 2 min de leitura
  https://vercel.com/docs/deployments/environments#preview-environment-pre-production
  Lista exatamente o que dispara um preview (commit fora da branch de produção, pull request, `vercel` sem `--prod`) e a diferença entre a URL da branch e a URL do commit.

## Sugerida

- **Joe Leon, *Anyone can Access Deleted and Private Repository Data on GitHub*** — Truffle Security, julho/2024 · 9 min de leitura
  https://trufflesecurity.com/blog/anyone-can-access-deleted-and-private-repo-data-github
  Demonstra que commit de fork apagado, de repositório apagado e de repositório que virou privado continua acessível pelo hash, e conclui que rotacionar a chave é a única remediação real.

Ofereça no painel logo depois do marco `se-vazou`, quando o aluno já ouviu "rotacionar, não apagar" e ainda está achando exagero. São nove minutos e o argumento é visual, então pausa a aula sem custo. Se ele não quiser parar, guarde para o fechamento.
