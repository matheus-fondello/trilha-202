---
name: language
description: Troca o idioma em que o tutor fala com o aluno, português ou inglês. Só quando o aluno digita /language.
argument-hint: "[pt|en]"
disable-model-invocation: true
---

# /language

O aluno pediu para trocar o idioma da aula. O que ele escreveu depois do comando: `$ARGUMENTS`.

1. Se dá para saber o idioma (pt, português, portuguese; en, inglês, english), rode `node .claude/scripts/trilha.js idioma pt` ou `node .claude/scripts/trilha.js idioma en`.
2. Se veio vazio ou não dá para saber, pergunte numa linha só, em inglês e em português: "Would you like to continue in English or Portuguese? / Você quer seguir em português ou em inglês?". Com a resposta, rode o comando.
3. Confirme em uma linha, já no idioma novo, e siga o que o comando imprimiu.

Trocar de idioma não é sair da aula nem abrir outra: não registre marco, não conclua nada, não carregue outra skill.
