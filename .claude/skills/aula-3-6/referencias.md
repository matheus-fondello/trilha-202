# Referências, aula 3.6

Formato dos itens: bullet de três linhas, título, link, por que vale. É esse formato
que o `REFERENCIAS.md` da raiz lê. A prosa fora dos bullets é instrução para você,
o tutor, e não chega ao aluno.

Quatro cuidados que valem para a aula inteira. Quase tudo aqui é em inglês; a única página em português é a da Anthropic, que mora em `platform.claude.com` e tem as âncoras em inglês — use a URL exata daqui, porque âncora traduzida não dá erro, só abre a página no topo. O aluno não usa a API da Anthropic: a P3 roda no plano gratuito do Gemini, ou do Groq, e os textos da Anthropic e da Microsoft entram aqui pelo conceito, que vale em qualquer provedor; nada deles vira instrução de código para o sistema dele. A página da LLM01, da OWASP, não tem âncora de seção: o link abre no topo, e é você quem diz o que ele procura; as da LLM02 e da LLM06 abrem já na seção certa. E o texto do Willison sobre a tríade foi oferecido na 1.11, como régua do que conectar ao Claude Code; se ele abriu, aqui volta como desenho do sistema dele. Pergunte antes de tratar como conhecido.

## Citadas

Link solto no parágrafo em que o assunto aparece. Sem convite, sem cerimônia, sem parar a aula.

**marco `injecao`**

- **Anthropic, *Mitigar jailbreaks e injeções de prompt* — seção "Injeção indireta de prompt"** — Claude Platform Docs, em português, sem data · ~5 min de leitura (a seção)
  https://platform.claude.com/docs/pt-BR/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks#indirect-prompt-injection
  A distinção da aula na voz de quem faz o modelo: na direta o adversário é o usuário, na indireta é o conteúdo de terceiros que o modelo lê em nome dele — e a seção manda limitar o acesso para que uma injeção bem-sucedida cause o mínimo de dano, e fecha mandando atacar o próprio sistema com conteúdo plantado antes de pôr no ar, que é a prova de hoje.

- **OWASP, *LLM01:2025 Prompt Injection*** — genai.owasp.org, edição 2025 · ~8 min de leitura
  https://genai.owasp.org/llmrisk/llm01-prompt-injection/
  O primeiro item da lista, com a frase que fecha a questão do filtro: dado o funcionamento probabilístico dos modelos, não está claro que exista prevenção infalível.

- **Simon Willison, *The lethal trifecta for AI agents* — seção "Guardrails won't protect you"** — simonwillison.net, jun/2025 · ~1 min de leitura (a seção)
  https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/#guardrails
  O argumento do 95% em quatro linhas: produto de guardrail promete pegar quase todos os ataques, e em segurança de aplicação web isso é nota de reprovação.

- **Anthropic, *Mitigating the risk of prompt injections in browser use* — seção "Claude's progress on browser use robustness"** — Anthropic Research, nov/2025 · ~6 min de leitura, em inglês
  https://www.anthropic.com/research/prompt-injection-defenses#claudes-progress-on-browser-use-robustness
  A própria Anthropic, ao anunciar 1% de ataques bem-sucedidos, escreve que isso ainda é risco relevante e que nenhum agente é imune.

A página da Anthropic é documentação da API do Claude, e o aluno está no Gemini: cite a seção pelo modelo de ameaça e pelas defesas de desenho, não pelos campos e formatos dela (`tool_result`, `output_config`, o modelo de triagem que ela nomeia), que são do Claude e não existem com esse nome no sistema dele. Ela tem também uma mina que você precisa desarmar antes que o aluno a pise: metade dela ensina a pôr um modelo pequeno fazendo triagem de injeção, e quem lê sai achando que achou o filtro. Diga com todas as letras que triagem baixa a frequência e não muda a pergunta da aula; o argumento está na própria página, que no mesmo bloco manda limitar o acesso para o caso de a injeção passar. E triagem é mais uma chamada por mensagem, que no gratuito gasta o limite por minuto e por dia que a 3.4 mediu. Separe o que é da 3.9 do que vale hoje: entregar conteúdo de fora como resultado de ferramenta é para quem usa ferramentas, fora do escopo da P3; mas dizer o que o conteúdo é e de onde veio, declarar no *system* que ele é dado não confiável e encapsular a mensagem em JSON valem para a P3 já, em qualquer provedor, e são o que a aula manda fazer. A primeira linha diz que o Claude é "inerentemente resiliente": resiliente não é imune, e o post de pesquisa, com o 1%, é a resposta. Use o 1% e o 95% juntos: o número melhorou, a conta de quem ataca e tenta de novo não mudou.

**marco `triade-letal`**

- **Simon Willison, *The lethal trifecta for AI agents: private data, untrusted content, and external communication*** — simonwillison.net, jun/2025 · ~7 min de leitura
  https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
  A referência da ementa: as três pernas nomeadas, a lista de caminhos para fora (uma chamada de API, carregar uma imagem, até um link para o usuário clicar), e a observação de que os fornecedores consertaram quase todos os casos fechando a saída.

- **Simon Willison, *Superhuman AI exfiltrates emails*** — simonwillison.net, jan/2026 · ~2 min de leitura
  https://simonwillison.net/2026/Jan/12/superhuman-ai-exfiltrates-emails/
  A tríade inteira num caso real de cliente de e-mail: o usuário pede o resumo da caixa, um e-mail plantado faz o assistente mandar dados financeiros, jurídicos e médicos para um formulário do atacante por uma imagem que a tela carrega; a causa foi a regra que deixava a tela carregar a imagem, e a empresa publicou um conserto.

O caso do Superhuman é o que torna concreta a frase da aula de que a saída é menos óbvia do que parece: ninguém "enviou" nada, a tela renderizou uma imagem. É também, na leitura da tríade que o Willison faz, a resposta para a pergunta do marco: a causa estava na saída, não no modelo, e fechar aquela saída tira o caminho mesmo com o e-mail ainda enganando o modelo. O post não descreve o conserto: não diga o que a empresa mudou. O post é curto e cita a pesquisa original; não mande o aluno atrás da pesquisa.

**marco `isolamento`**

- **OWASP, *LLM02:2025 Sensitive Information Disclosure* — seção "Example Attack Scenarios"** — genai.owasp.org, edição 2025 · ~6 min de leitura
  https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/#user-content-example-attack-scenarios
  O primeiro cenário é o do marco, em uma linha: um usuário recebe na resposta o dado pessoal de outro usuário. A página também trata do dado que entra no treino e reaparece na saída.

- **Google, *Gemini API Additional Terms of Service* — seção "Unpaid Services", parte "How Google Uses Your Data"** — ai.google.dev, atualizada em abr/2026 · ~2 min de leitura (a seção)
  https://ai.google.dev/gemini-api/terms#data-use-unpaid
  O provedor também é quem lê o contexto: no plano gratuito, que é o da P3, o Google usa o que entra e o que sai para desenvolver os produtos dele, revisores humanos podem ler, e os próprios termos mandam não enviar informação sensível, confidencial ou pessoal.

- **Groq, *Your Data in GroqCloud*** — console.groq.com, sem data · ~3 min de leitura
  https://console.groq.com/docs/your-data
  O contraste, para quem foi pelo Groq: por padrão ele não guarda o dado das chamadas, salvo log temporário de erro e abuso por até 30 dias.

Os termos do Gemini são a tríade fora do sistema dele: o dado privado sai por um caminho que nenhum corte no código fecha, porque o caminho é o próprio provedor. Com o material da Prado, que é fictício, rodar no gratuito é aceitável; com livro de cliente real, a Denise não poderia, e o plano pago serve para isso, não só para volume (é a pergunta "quando passar do gratuito" da 3.4, por outro lado). Não transforme em pânico nem em regra para a P3: é decisão que vai para o README como o que muda antes de cliente de verdade. Termos e retenção mudam; antes de citar, confira as duas páginas. O link do Groq abre no topo; o que vale está no primeiro bloco.

Na LLM02, cite o cenário, não a lista de mitigações: ela fala de privacidade diferencial e aprendizado federado, que não são desta aula e assustam quem está construindo um lançador. A ponte que vale é com a 2.13: lá o banco não deixava o Carlos ver o lead da Renata; aqui a mesma regra vale na fila, para o Tiago e a Aline, e o que precisa ficar de fora também é o contexto da chamada. A prova é um teste automatizado no repositório dele, que a correção roda de novo; usuário e senha de teste não vão para o README nem para o chat.

**marco `humano-no-loop`**

- **OWASP, *LLM06:2025 Excessive Agency* — seção "Prevention and Mitigation Strategies"** — genai.owasp.org, edição 2025 · ~7 min de leitura
  https://genai.owasp.org/llmrisk/llm062025-excessive-agency/#user-content-prevention-and-mitigation-strategies
  Duas mitigações que são o marco: pôr uma pessoa para aprovar ação de alto impacto antes de ela acontecer, e fazer a autorização no sistema de baixo em vez de deixar o modelo decidir se uma ação é permitida.

- **Simon Willison, *Design Patterns for Securing LLM Agents against Prompt Injections* — seção "The scope of the problem"** — simonwillison.net, jun/2025 · ~3 min de leitura (a seção)
  https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/#scope-of-the-problem
  O princípio comum de um artigo de pesquisadores da IBM, da Invariant Labs, da ETH Zurich, do Google e da Microsoft: depois que o modelo leu conteúdo não confiável, ele precisa estar preso de forma que seja impossível esse conteúdo disparar uma ação com consequência.

- **Anthropic, *Beyond permission prompts: making Claude Code more secure and autonomous* — seção "Keeping users secure on Claude Code"** — Anthropic Engineering, out/2025 · ~2 min de leitura (a seção)
  https://www.anthropic.com/engineering/claude-code-sandboxing#keeping-users-secure-on-claude-code
  O nome do carimbo: clicar "aprovar" o tempo todo leva à fadiga de aprovação, em que a pessoa deixa de prestar atenção no que aprova — e isso deixa o sistema menos seguro, não mais.

A seção do Willison emenda com a seguinte, "The Plan-Then-Execute Pattern", que tem o exemplo mais útil para a P3: o conteúdo lido pode estragar o corpo de um e-mail, mas não o destinatário, porque o destinatário foi fixado antes de o modelo ler qualquer coisa. Conte o exemplo; não mande ler os seis padrões, que são para agente e ficam fora do módulo. O texto da Anthropic é sobre o Claude Code que o aluno usa todo dia, e é por isso que funciona: ele já sentiu a fadiga de aprovação na oficina. Pare na primeira seção; o resto é sobre o sandbox do produto.

**marco `prova-hostil`**

- **OWASP, *2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps*** — genai.owasp.org, edição 2025 · ~5 min a página inicial
  https://genai.owasp.org/llm-top-10/
  A lista que a 2.13 apresentou como aviso e que aqui vira checklist: injeção, vazamento de informação sensível e agência excessiva são os três de hoje; os outros sete ficam para quem quiser, depois.

A lista não é para ler inteira, e não é ela que escreve a entrada hostil: quem escreve é você, e quem decide se o corte segurou é a evidência colada.

## Sugeridas

**marco `injecao`**

- **Microsoft Developer, *Episode 4: Indirect Prompt Injection Explained*, série AI Red Teaming 101** — YouTube, canal oficial, jul/2025 · 6 min 28 s no total, trecho de 3 min 25 s, de 0:00 a 3:25
  https://www.youtube.com/watch?v=s_Ztu6c-IGQ&hl=en&persist_hl=1
  Gary Lopez, do time de red team da Microsoft, mostra o prompt do sistema, a mensagem do usuário e o dado de fora colados numa coisa só antes de chegar ao modelo, e um e-mail plantado que manda procurar outros e-mails e mandar o conteúdo para fora: o modelo não vê a diferença.

Ofereça depois que o aluno responder a pergunta de previsão do marco, nunca antes: o vídeo dá a resposta. Corte em 3:25: dali em diante é a demonstração de um laboratório da Microsoft. O e-mail do exemplo já traz as três pernas, então ele serve de gancho para o marco seguinte sem você precisar adiantar o nome. O episódio anterior da mesma série, sobre injeção direta, foi deixado de fora de propósito: ele situa num lugar errado o caso do chatbot da concessionária que vendeu um carro por um dólar.

Não há material longo para o fechamento. A palestra do Willison de 2023 que explica injeção tem doze minutos e o mesmo argumento que o texto da tríade dá em sete; o aluno já tem o texto.
