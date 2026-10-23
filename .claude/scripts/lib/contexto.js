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
const mapa = require('./mapa');

// A fluência dos módulos 4 a 6, e da 1.2, da 1.3 e da 1.4, se julga pelo conjunto (22/10): a régua manda "passou é toda parte cumprida", e ali isso
// reprovava uma resposta inteira por dois itens de dez. Só estas aulas, e só com a fluência registrada, recebem o bloco;
// nas outras o contexto é o de antes, letra a letra. O texto mora em lib/fluencia-conjunto.js, igual ao do tutor.
const FLUENCIA_PELO_CONJUNTO = `#### Esta fluência se julga pelo conjunto

${require('./fluencia-conjunto').regra('avaliador')}`;

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
  const tarefaObservavel = (md.match(/^\*\*Tarefa observável:\*\*\s*(sim|não)\b/im) || [])[1] || null;
  // O fechamento e o gancho da próxima aula são condução, não critério. Ficam no
  // fim da seção da fluência, ou da dos marcos quando a aula não tem fluência.
  const semFechamento = (t) => (t ? t.split(/\n\s*\nFechamento da `tutor`/)[0].trim() : null);
  const marcos = semFechamento(secao(md, 'Marcos'));
  let fluencia = semFechamento(secao(md, 'Fluência'));
  if (fluencia) fluencia = fluencia.replace(/\s*Registre com `[^`]*`\.?/g, '').trim();
  if (!goal && !marcos && !fluencia) return null;
  return {
    goal,
    tarefaObservavel: tarefaObservavel ? tarefaObservavel.toLowerCase() === 'sim' : null,
    // A linha que ensina o tutor a fechar um marco não diz nada ao avaliador.
    marcos: marcos ? marcos.replace(/^`node [^`]*`:\s*$/m, '').trim() : null,
    fluencia,
  };
}

// Em que agente o aluno fez a unidade (21/10): o das sessões dela, no histórico e
// a aberta. A do Codex leva `agente` enquanto está aberta, e o chat dela fica em
// `e.codex.chats`; o histórico não guarda o agente. 'ambos' é a aula que trocou
// de agente no meio. Sem sessão nenhuma, o agente deste processo. A aberta que
// ainda não teve turno (o chat que o aluno só abriu) não conta: sem fala nenhuma,
// ela faria da aula 'ambos' sem ter havido aula no outro agente.
function agenteDaUnidade(e, idUnidade) {
  const chats = (e && e.codex && e.codex.chats) || {};
  const aberta = e && e.sessao_atual && e.sessao_atual.contada !== false ? [e.sessao_atual] : [];
  const sessoes = [...((e && e.sessoes) || []), ...aberta]
    .filter((s) => s && (s.aula === idUnidade || (s.aulas || []).includes(idUnidade)));
  const doCodex = (s) => s.agente === 'codex' || Boolean(s.id && Object.prototype.hasOwnProperty.call(chats, s.id));
  const vistos = new Set(sessoes.map((s) => (doCodex(s) ? 'codex' : 'claude')));
  if (vistos.size > 1) return 'ambos';
  if (vistos.size === 1) return [...vistos][0];
  return require('./agente').atual() === 'codex' ? 'codex' : 'claude';
}

// O plano traz a forma do Codex em trechos *no Codex:* (21/10), entre parênteses
// no meio da frase ou até o fim da linha. Para quem fez no Claude Code eles saem:
// lidos pelo avaliador, deixavam passar o aluno do Claude com a forma do Codex
// (o revisor só instruído a não escrever na 1.11, o plano corrigido por pedido em
// vez de editado na 1.6, um AGENTS.md que o Claude Code não lê na 1.2).
function semCodex(texto) {
  if (!texto) return texto;
  const s = String(texto);
  const abre = /[ \t]?\(\*[Nn]o Codex:\*/g;
  let saida = '';
  let desde = 0;
  let m;
  while ((m = abre.exec(s))) {
    let nivel = 0;
    let fim = -1;
    for (let i = s.indexOf('(', m.index); i < s.length && s[i] !== '\n'; i++) {
      if (s[i] === '(') nivel++;
      else if (s[i] === ')' && --nivel === 0) { fim = i; break; }
    }
    if (fim < 0) continue;
    saida += s.slice(desde, m.index);
    desde = fim + 1;
    abre.lastIndex = desde;
  }
  return (saida + s.slice(desde))
    .replace(/[ \t]*\*[Nn]o Codex:\*[^\n]*/g, '')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// O que o avaliador ouve sobre o agente. No Claude Code, nada: os trechos do
// Codex saíram do plano.
const SOBRE_O_AGENTE = {
  codex: '- Agente: o aluno fez esta aula no Codex. Onde o plano traz um trecho *no Codex:*, é ele que vale, no lugar do que o plano diz do Claude Code naquele ponto, e a forma só do Claude Code não vale (um `CLAUDE.md`, que o Codex não lê, no lugar do `AGENTS.md`). No resto, o plano foi escrito com os nomes do Claude Code, e o equivalente do Codex vale igual (`/new` no lugar de `/clear`, `/status` no lugar de `/context`).',
  ambos: '- Agente: o aluno fez esta aula em parte no Claude Code e em parte no Codex, e a transcrição diz no começo de cada chat em qual dos dois ele foi. Onde o plano traz um trecho *no Codex:*, ele vale só para o que foi feito nos chats do Codex; nos do Claude Code vale a forma do Claude Code, e a do Codex não a substitui. A fluência vale pela forma do agente do chat em que ela foi feita.',
};

// O contexto que o avaliador não tem como deduzir da transcrição: qual unidade
// é esta, o que ela se propunha a ensinar e o que ficou registrado como fato.
function contextoDaAula(e, a, reg) {
  const fechados = (a.milestones || []).map((m) => `${reg.milestones[m.id] ? 'fechado' : 'PENDENTE'} — ${m.id}: ${m.titulo}`);
  const fluencia = !a.fluencia
    ? 'Esta aula não tem teste de fluência (o campo "fluencia" da avaliação vai como null).'
    : reg.fluencia
      // O resultado do tutor fica de fora de propósito (revisão de 05/10): é o
      // juízo de quem deu a aula, e a fluência é julgada por quem lê, contra o
      // critério escrito. A comparação entre os dois é feita no CRM.
      ? 'A fluência foi registrada pelo tutor. O resultado dele não vem aqui de propósito: o juízo é seu, contra o critério escrito no plano da aula.'
      : 'Esta aula tem teste de fluência, mas ele não chegou a ser registrado.';
  const agente = agenteDaUnidade(e, a.id);
  const bruto = trechosDaSkill(a.id);
  const skill = bruto && agente === 'claude'
    ? { ...bruto, goal: semCodex(bruto.goal), marcos: semCodex(bruto.marcos), fluencia: semCodex(bruto.fluencia) }
    : bruto;
  const blocos = [
    [
      `- Unidade: ${a.id} — ${a.titulo}`,
      `- Marcos registrados:\n    ${fechados.join('\n    ')}`,
      `- ${fluencia}`,
      `- Sessões que o aluno já gastou nesta unidade: ${reg.sessoes || 1} (é contexto, não critério: aula longa ou dividida em chats não abaixa nota).`,
      ...(SOBRE_O_AGENTE[agente] ? [SOBRE_O_AGENTE[agente]] : []),
    ].join('\n'),
  ];
  if (!skill) {
    blocos.push('O plano escrito desta aula não foi encontrado nesta cópia do harness. Julgue pela transcrição e diga na justificativa que o plano da aula faltou.');
  } else {
    blocos.push('### O que a aula se propunha a ensinar\n\nTrechos do plano da aula, escrito para o tutor. É a régua do que "entender" quer dizer aqui.');
    if (skill.goal) blocos.push(`**Goal:** ${skill.goal}`);
    if (skill.tarefaObservavel !== null) blocos.push(`Tarefa observável: ${skill.tarefaObservavel ? 'sim' : 'não'}.`);
    if (skill.marcos) blocos.push(`#### Marcos, com a pergunta de cada um e a confusão que ela caça\n\n${skill.marcos}`);
    if (skill.fluencia && a.fluencia) blocos.push(`#### Fluência: a tarefa e o critério de passar\n\n${skill.fluencia}`);
    if (skill.fluencia && reg.fluencia && mapa.fluenciaPeloConjunto(a.id)) blocos.push(FLUENCIA_PELO_CONJUNTO);
  }
  return blocos.join('\n\n');
}

module.exports = { contextoDaAula, trechosDaSkill, arquivoDaSkill, agenteDaUnidade, semCodex };
