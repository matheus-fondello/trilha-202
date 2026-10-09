---
name: aula-b1
description: Aula bônus, GitHub e Vercel. Só conversa, sem oficina, sem fluência, antes da P0. Carregue apenas quando o estado indicar esta aula.
user-invocable: false
---

# Aula bônus: GitHub e Vercel

**Goal:** o aluno sai sabendo o que é um repositório, o que é um commit e um push, o que a Vercel faz com o repositório dele, e por que um push vira site no ar sozinho. É o mapa da segunda metade da P0: lá ele constrói a página e, no fim, publica — repositório no GitHub e site na Vercel. Aqui ele só entende o caminho; quem anda nele é a P0.

**Tarefa observável:** não. Esta aula é só conversa; esforço e autonomia ficam sem nota na avaliação.

Contexto para discorrer, do seu jeito: hoje a página que ele vai fazer só existiria na máquina dele, e ninguém mais consegue abrir um arquivo do computador de outra pessoa. Publicar tem duas peças, e cada uma faz uma coisa. O git transforma a pasta num **repositório**: uma pasta com memória, em que cada **commit** é uma foto do projeto com uma mensagem dizendo o que mudou. O **GitHub** guarda uma cópia desse repositório na internet, e o **push** é mandar as fotos novas da máquina para lá. A **Vercel** olha para esse repositório no GitHub e serve a página num endereço público; ligadas as duas, cada push na linha principal vira uma versão nova no ar, sem ele fazer mais nada. O site no ar não é a pasta dele: é a última foto que chegou ao GitHub. Repositório **público** quer dizer que qualquer pessoa lê tudo o que está lá dentro, e é por isso que senha e chave nunca entram nele. E quem digita os comandos não é ele: na P0, ele pede ao agente da oficina, em português, e confere o resultado. Nada de comando nesta aula, nem para mostrar.

Só conversa, aqui na sala. Sem oficina e sem fluência. As contas se criam na P0, não hoje: se ele quiser adiantar, pode, mas não vale marco e a aula não espera. Fica para outras aulas: o terminal (1.2), preview e produção (1.10), desfazer e o modelo mental do git (2.4), branch, pull request e pull (2.5), variáveis de ambiente (2.6).

## Marcos

`node .claude/scripts/trilha.js milestone B1 <id>`:

- `repositorio`: ele sabe o que é repositório, commit e push, e o que o GitHub guarda. *Previsão, antes:* se o computador dele quebrar amanhã, o que sobra da página que ele vai fazer hoje à tarde? Caça quem acha que o trabalho vive no Claude Code, ou que salvar o arquivo já guarda em algum lugar.
- `deploy`: ele sabe o que a Vercel faz com o repositório e por que o push publica sozinho. *Aplicação:* ele mudou o título da página na máquina, viu a mudança abrindo o arquivo, e mandou o link do site para um amigo. O amigo vê o título novo? Caça quem acha que o site no ar é a pasta dele.
- `o-caminho-da-p0`: ele sabe o que vai fazer no fim da P0, na ordem: conta no GitHub, conta na Vercel entrando com o GitHub (é isso que liga as duas), o agente da oficina criando o repositório público e mandando o código, e a Vercel importando esse repositório. E sabe que o público vale para tudo que estiver na pasta.

Fechamento da `tutor`, com `"fluencia": null`. Despedida: próximo passo é a P0, em chat novo aqui na sala. Gancho: hoje ele viu o caminho no mapa; na P0, ele faz a página e manda o link para quem quiser.
