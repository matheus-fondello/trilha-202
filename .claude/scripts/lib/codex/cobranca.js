'use strict';
// O fim do turno no Codex (branch codex, 21/10). O hook Stop do Codex roda dentro do turno e pode pedir que ele
// continue (`decision: block`, medido no 0.163): é a única ocasião em que a sala fala com o tutor depois de ele
// escrever. O teste com o Codex de verdade (21/10, gpt-6-luna) achou o tutor dizendo ao aluno que a aula fechou sem
// registrar os marcos nem rodar o `concluir`, e deixando para trás a avaliação pendente que o resumo mandou rodar.
// No Claude isso não acontece, e o Claude não passa por aqui.
//
// Cada cobrança é uma volta a mais do modelo, na cota do aluno: só quando o registro desmente o que o turno fez, e a
// da avaliação uma vez por chat. O texto diz o que fazer nos dois casos (fechou de verdade, ou não fechou), porque a
// leitura da mensagem é por padrão de texto e pode errar.
const mapa = require('../mapa');
const resumo = require('../resumo');

// "Chat novo" sozinho não basta: a 0.1 ensina que cada aula começa num chat novo. Vale o pedido ("abra um chat novo")
// ou o chat novo junto da seguinte.
const CHAT_NOVO = /\b(chat novo|novo chat)\b/i;
const ABRA_CHAT = /\babra\b[^.]{0,30}\b(chat novo|novo chat)\b/i;
const ENCERRA = /\b(fechamos|encerramos|terminamos|conclu[ií]mos|finalizamos)\b|\b(est[aá]|foi|ficou)\s+(fechada|conclu[ií]da|encerrada|terminada)\b/i;
// "A próxima é…" não basta: no meio da aula é "a próxima parte é". A seguinte citada pelo número ou título vale.
const PROXIMA = /\bpr[oó]xima\s+(aula|unidade)\b/i;

const normal = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const citaId = (texto, id) => new RegExp(`(^|[^\\w.])${escapar(normal(id))}(?![\\w]|\\.\\d)`).test(texto);
// O título pelo nome curto: o que vem antes dos dois pontos ("Aula bônus"), ou o começo dele.
const nomeCurto = (titulo) => { const t = normal(titulo); return t.includes(':') ? t.split(':')[0].trim() : t.slice(0, 24); };

// A mensagem cita a unidade que vem depois desta: pelo número ("1.1", sem casar "1.11") ou pelo nome.
function citaSeguinte(e, idAula, mensagem) {
  const candidatas = new Map();
  const p = mapa.proxima(idAula);
  if (p) candidatas.set(p.id, p);
  try { for (const x of mapa.abertas(e)) if (x.id !== idAula) candidatas.set(x.id, x); } catch { /* sem frentes */ }
  const texto = normal(mensagem);
  return [...candidatas.values()].some((x) => citaId(texto, x.id) || (x.titulo && nomeCurto(x.titulo).length >= 6 && texto.includes(nomeCurto(x.titulo))));
}

// A mensagem dá a aula como encerrada: diz que esta aula fechou, manda abrir um chat novo, ou diz que fechou e aponta
// a seguinte.
function daComoEncerrada(e, idAula, mensagem) {
  const m = String(mensagem || '');
  if (!m) return false;
  if (new RegExp(`\\baula\\s+${escapar(idAula)}\\s+(est[aá]|foi|ficou)\\s+(fechada|conclu[ií]da|encerrada|terminada)\\b`, 'i').test(m)) return true;
  if (ABRA_CHAT.test(m)) return true;
  const seguinte = PROXIMA.test(m) || citaSeguinte(e, idAula, m);
  return seguinte && (CHAT_NOVO.test(m) || ENCERRA.test(m));
}

// A cobrança do fechamento: a aula do chat continua aberta no registro e o tutor acabou de dizer que ela fechou.
function fechamento(e, s, mensagem) {
  const idAula = s && s.aula;
  if (!idAula) return null;
  let a;
  try { a = mapa.aula(idAula); } catch { return null; }
  if (!a || a.tipo !== 'aula' || !Array.isArray(a.milestones)) return null;
  const reg = (e.aulas || {})[idAula] || {};
  if (reg.status === 'concluida') return null;
  if (!daComoEncerrada(e, idAula, mensagem)) return null;
  const marcos = a.milestones.filter((m) => !(reg.milestones || {})[m.id]).map((m) => m.id);
  const semFluencia = Boolean(a.fluencia) && !reg.fluencia;
  const faltam = [
    ...(marcos.length ? [`${marcos.length > 1 ? 'os marcos' : 'o marco'} ${marcos.join(', ')}`] : []),
    ...(semFluencia ? ['o resultado da fluência'] : []),
    `o \`concluir ${idAula}\``,
  ];
  const passos = [
    ...marcos.map((m) => `\`node .claude/scripts/trilha.js milestone ${idAula} ${m}\``),
    ...(semFluencia ? ['o `fluencia`, como a skill da aula diz'] : []),
    'a `nota`, se houver',
    `\`node .claude/scripts/trilha.js concluir ${idAula}\``,
    ...(a.avaliacao === false ? [] : [`por último, \`node .claude/scripts/trilha.js avaliar ${idAula}\``]),
  ];
  return `(Sala: a sua resposta dá a aula ${idAula} como encerrada, mas no registro ela continua aberta: ${faltam.length > 1 ? 'faltam' : 'falta'} ${faltam.slice(0, -1).join(', ')}${faltam.length > 1 ? ' e ' : ''}${faltam[faltam.length - 1]}. Se você já deu ao aluno o que falta, registre agora, numa chamada só e nesta ordem: ${passos.join('; ')}. Só depois diga a ele, em uma frase, que a aula fechou. Se a aula ainda não terminou, diga a ele em uma frase o que ainda falta e siga dali. Não comente este aviso.)`;
}

// Houve tentativa da avaliação desta aula desde o começo do turno: nota, pendência, falha ou login.
function tentou(reg, desde) {
  const t = Date.parse(desde);
  if (Number.isNaN(t)) return true;
  return [reg.avaliada_em, (reg.avaliacao_adiada || {}).em, (reg.avaliacao_falhou || {}).em, (reg.avaliacao_login || {}).em, (reg.avaliacao_em_andamento || {}).em]
    .some((x) => x && Date.parse(x) >= t);
}

// A cobrança da avaliação pendente: a do chat anterior, que o resumo mandou rodar, ou a da aula que este turno
// concluiu sem o `avaliar`; o turno acabou sem nenhuma tentativa. Uma vez por chat e aula (`s.cobrou_avaliacao`): o
// aluno que negou a aprovação não é cobrado a cada turno.
function avaliacao(e, s) {
  if (!s || !s.envio_em) return null;
  const ja = Array.isArray(s.cobrou_avaliacao) ? s.cobrou_avaliacao : [];
  const ids = resumo.avaliacoesPendentes(e, true).filter((id) => !ja.includes(id) && !tentou((e.aulas || {})[id] || {}, s.envio_em));
  if (!ids.length) return null;
  return {
    ids,
    texto: `(Sala: a avaliação ${ids.length > 1 ? 'das aulas' : 'da aula'} ${ids.join(', ')} continua pendente, e este turno não a tentou. Rode agora ${ids.map((id) => resumo.comandoAvaliar(e, id)).join(' e ')}, antes de terminar o turno; se ele pedir para rodar fora do sandbox, peça a aprovação ao aluno. Não comente a avaliação com o aluno.)`,
  };
}

module.exports = { fechamento, avaliacao, daComoEncerrada };
