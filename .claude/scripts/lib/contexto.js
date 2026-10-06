'use strict';
// O bloco "A aula que você está avaliando", que vai no prompt do avaliador.
//
// O avaliador não deu a aula e não tem ferramenta nenhuma: o que ele sabe sobre
// ela é o que este bloco disser. Sem o goal, sem as perguntas que a aula faz e
// sem o critério escrito da fluência, ele julgaria "compreensão" sem saber de
// quê (Raio-X de 05/10, achado 02). Esse texto já existe, escrito à mão, na
// skill da aula; o mapa não tem e não precisa ter um campo "objetivo" que o
// repita. A skill é a fonte, e uma fonte só.
//
// Entram três partes da skill: o goal, os marcos com a pergunta de cada um e o
// que ela caça, e a fluência com o critério de passar. Fica de fora o resto, que
// é instrução de condução para o tutor ("Antes de começar", o "Contexto para
// discorrer", o fechamento e o gancho da próxima aula).
const fs = require('fs');
const path = require('path');
const paths = require('./paths');

function arquivoDaSkill(idAula) {
  return path.join(paths.SKILLS, `aula-${String(idAula).replace(/\./g, '-')}`, 'SKILL.md');
}

// O texto de uma seção `## <titulo>` até a próxima `## `.
function secao(md, titulo) {
  const linhas = md.split(/\r?\n/);
  const i = linhas.findIndex((l) => l.trim() === `## ${titulo}`);
  if (i < 0) return null;
  const fim = linhas.findIndex((l, j) => j > i && /^## /.test(l));
  return linhas.slice(i + 1, fim < 0 ? undefined : fim).join('\n').trim();
}

function trechosDaSkill(idAula) {
  let md;
  try { md = fs.readFileSync(arquivoDaSkill(idAula), 'utf8'); } catch { return null; }
  const goal = (md.match(/^\*\*Goal:\*\*\s*(.+)$/m) || [])[1] || null;
  // O fechamento e o gancho da próxima aula são condução, não critério. Ficam no
  // fim da seção da fluência, ou da dos marcos quando a aula não tem fluência.
  const semFechamento = (t) => (t ? t.split(/\n\s*\nFechamento da `tutor`/)[0].trim() : null);
  const marcos = semFechamento(secao(md, 'Marcos'));
  let fluencia = semFechamento(secao(md, 'Fluência'));
  if (fluencia) fluencia = fluencia.replace(/\s*Registre com `[^`]*`\.?/g, '').trim();
  if (!goal && !marcos && !fluencia) return null;
  return {
    goal,
    // A linha que ensina o tutor a fechar um marco não diz nada ao avaliador.
    marcos: marcos ? marcos.replace(/^`node [^`]*`:\s*$/m, '').trim() : null,
    fluencia,
  };
}

// O contexto que o avaliador não tem como deduzir da transcrição: qual unidade
// é esta, o que ela se propunha a ensinar e o que ficou registrado como fato.
function contextoDaAula(e, a, reg) {
  const fechados = (a.milestones || []).map((m) => `${reg.milestones[m.id] ? 'fechado' : 'PENDENTE'} — ${m.id}: ${m.titulo}`);
  const fluencia = !a.fluencia
    ? 'Esta aula não tem teste de fluência (o campo "fluencia" da avaliação vai como null).'
    : reg.fluencia
      ? `Fluência registrada pelo tutor: ${reg.fluencia.passou ? 'passou' : 'não passou'} em ${reg.fluencia.tentativas} tentativa(s).`
      : 'Esta aula tem teste de fluência, mas ele não chegou a ser registrado.';
  const skill = trechosDaSkill(a.id);
  const blocos = [
    [
      `- Unidade: ${a.id} — ${a.titulo}`,
      `- Marcos registrados:\n    ${fechados.join('\n    ')}`,
      `- ${fluencia}`,
      `- Sessões que o aluno já gastou nesta unidade: ${reg.sessoes || 1}.`,
    ].join('\n'),
  ];
  if (!skill) {
    blocos.push('O plano escrito desta aula não foi encontrado nesta cópia do harness. Julgue pela transcrição e diga na justificativa que o plano da aula faltou.');
  } else {
    blocos.push('### O que a aula se propunha a ensinar\n\nTrechos do plano da aula, escrito para o tutor. É a régua do que "entender" quer dizer aqui.');
    if (skill.goal) blocos.push(`**Goal:** ${skill.goal}`);
    if (skill.marcos) blocos.push(`#### Marcos, com a pergunta de cada um e a confusão que ela caça\n\n${skill.marcos}`);
    if (skill.fluencia && a.fluencia) blocos.push(`#### Fluência: a tarefa e o critério de passar\n\n${skill.fluencia}`);
  }
  return blocos.join('\n\n');
}

module.exports = { contextoDaAula, trechosDaSkill, arquivoDaSkill };
