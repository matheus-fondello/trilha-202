# Referências, aula 2.13

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

As listas da OWASP são em inglês; a lei e a reportagem são em português. O texto da LGPD no
Planalto é longo e sem formatação; mande o link com o artigo e diga o que procurar.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `quem-ve-o-que`**

- **Supabase, *Row Level Security*, seção "Understand Row Level Security"** — documentação do Supabase · 3 min de leitura (a seção)
  https://supabase.com/docs/guides/database/postgres/row-level-security#understand-row-level-security
  A regra por linha como o banco a escreve: uma política que só devolve as linhas em que o dono é quem está logado, e a explicação de que ela funciona como um filtro que a consulta não consegue tirar.

A 2.3 apresentou a regra por linha como conceito; aqui é o exemplo, e é o que resolve o Carlos e a
Renata sem depender da tela. Ele pede ao Claude da oficina que escreva a política; você não a dita.

**marco `revisao-de-seguranca`**

- **OWASP, *OWASP Top 10:2025*** — owasp.org, edição 2025 · ~5 min a página inicial
  https://top10.owasp.org/2025
  Os dez riscos mais comuns em aplicações web, com controle de acesso quebrado em primeiro (A01) e injeção em quinto (A05): é a lista que o subagente de segurança recebe como checklist.

- **OWASP, *2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps*** — genai.owasp.org, edição 2025 · ~5 min a página inicial
  https://genai.owasp.org/llm-top-10/
  A lista irmã para sistemas com modelo de linguagem, com injeção de prompt em primeiro (LLM01) e vazamento de informação sensível em segundo: entra aqui como aviso e volta na P3.

As duas páginas iniciais bastam; cada risco tem página própria, que o aluno abre se o subagente
apontar aquele item. Não é para ler os dez de uma vez.

**marco `dado-pessoal`**

- **Brasil, *Lei nº 13.709/2018 (LGPD)*, art. 5º, 6º e 20** — Planalto, ago/2018, texto consolidado · 5 min os três artigos
  https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm#art5
  As definições de dado pessoal e sensível (art. 5º, I e II), os princípios de finalidade e necessidade (art. 6º, I e III) e o direito à revisão de decisão automatizada (art. 20), que são os três pontos que a aula usa.

- **Jeniffer Mendonça, *CPF, endereço e renda: ONG revela comércio de dados pessoais no Telegram*** — Núcleo Jornalismo, mar/2026 · ~4 min de leitura
  https://nucleo.jor.br/curtas/2026-03-12-cpf-endereco-e-renda-ong-revela-comercio-de-dados-pessoais-no-telegram/
  O levantamento da Derechos Digitales com dez grupos brasileiros do Telegram vendendo CPF, endereço e renda por bot, com dado que só pode ter saído de base vazada: é o exemplo de fonte vazada contra fonte pública.

A reportagem não usa a expressão "consulta completa", que é como o mercado chama esse tipo de bot;
se o aluno conhecer o nome, é isso. O ponto não é o crime de quem vende, é que dado "disponível"
não é dado público, e que a foto da conta dele guardada sem motivo é matéria-prima desse mercado.

## Sugerida

Nenhuma nesta aula: a matéria é lista e lei, e o subagente é quem lê a lista inteira.
