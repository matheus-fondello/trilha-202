---
name: sugestao
description: Manda à equipe da 202 o feedback do aluno sobre a trilha (o que ele precisa agora, o que sugere, o que tem em mente), com as palavras dele. Só quando o aluno digita /sugestao.
argument-hint: "[o que você quer dizer à 202]"
disable-model-invocation: true
---

# /sugestao

O aluno quer mandar à equipe da 202 um feedback sobre a trilha. O que ele escreveu depois do comando: `$ARGUMENTS`.

1. Se veio texto, ele é a sugestão: grave-o em `trilha/tmp/sugestao.md` exatamente como ele escreveu, sem mudar uma palavra (não resuma, não corrija, não traduza, não complete), e rode `node .claude/scripts/trilha.js sugestao arquivo=trilha/tmp/sugestao.md`. Não pergunte nada antes.
2. Se veio vazio, faça uma pergunta só, aberta, na língua da aula: qual é o feedback dele sobre a trilha — o que ele precisa agora (uma ferramenta, um material, uma ajuda), o que sugere mudar, o que tem em mente. Com a resposta, grave e rode como no passo 1. Se ele desistir, não registre nada.
3. Siga o que o comando imprimir: agradeça em uma frase, sem prometer prazo nem resposta, e volte à aula do ponto em que parou.

Mandar uma sugestão não é sair da aula: não registre marco, não conclua nada, não carregue outra skill.
