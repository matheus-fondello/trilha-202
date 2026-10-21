'use strict';
// O fim do turno no Codex (branch codex, 21/10). O hook Stop do Codex roda dentro do turno e pode pedir que ele
// continue (`decision: block`, medido no 0.163): é a única ocasião em que a sala fala com o tutor depois de ele
// escrever. O teste com o Codex de verdade (21/10, gpt-6-luna) achou o tutor dizendo ao aluno que a aula fechou sem
// registrar os marcos nem rodar o `concluir`, e deixando para trás a avaliação pendente. No Claude isso não acontece,
// e o Claude não passa por aqui.
//
// Cada cobrança é uma volta a mais do modelo, na cota do aluno: só quando o registro desmente o que o turno fez, e
// cada uma uma vez por chat e aula. A leitura da mensagem é conservadora (perder um fechamento falso custa um chat
// seguinte que retoma a aula; cobrar à toa custa a cota e uma mensagem a mais), e o texto diz o que fazer se ela
// errou: não escrever nada.
const mapa = require('../mapa');
const resumo = require('../resumo');

// Um fechamento de verdade cita a seguinte e diz que esta acabou ou que a seguinte é num chat novo. Ficam de fora o
// fim de bloco ("fechamos o terminal; posso seguir?"), o chat novo da oficina (1.2, 2.8), e a 0.1 explicando que
// cada aula começa num chat novo, que termina pedindo passagem.
const CHAT_NOVO = /\b(chat novo|novo chat)\b/i;
const NA_OFICINA = /\b(chat novo|novo chat)\b[^.!?]{0,40}\boficina\b|\boficina\b[^.!?]{0,40}\b(chat novo|novo chat)\b/i;
const ENCERRA = /\b(fechamos|encerramos|terminamos|conclu[ií]mos|finalizamos)\s+((a|esta|nossa|essa)\s+)?(aula|os combinados)\b|\baula(\s+\S+){0,3}\s+(est[aá]|foi|ficou)\s+(fechada|conclu[ií]da|encerrada|terminada)\b/i;
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

// O último parágrafo da mensagem termina pedindo resposta: o tutor está no meio da conversa.
function terminaPerguntando(mensagem) {
  const partes = String(mensagem || '').trim().split(/\n\s*\n/);
  return /\?\s*\**\s*$/.test(partes[partes.length - 1] || '');
}

function daComoEncerrada(e, idAula, mensagem) {
  const m = String(mensagem || '');
  if (!m || terminaPerguntando(m)) return false;
  if (!(PROXIMA.test(m) || citaSeguinte(e, idAula, m))) return false;
  return ENCERRA.test(m) || (CHAT_NOVO.test(m) && !NA_OFICINA.test(m));
}

// Onde fica a marca do que já foi cobrado: no registro do chat (`e.codex.chats`), que dura enquanto o chat existe. A
// sessão fecha e volta no mesmo chat (o `exec resume`, ou o aplicativo depois de meia hora parado) e perderia a marca.
function registroDoChat(e, s) {
  const chats = e.codex && e.codex.chats;
  return (chats && s && s.id && chats[s.id]) || s;
}
const marcado = (reg, chave, id) => Array.isArray(reg[chave]) && reg[chave].includes(id);
const marcar = (reg, chave, ids) => () => { reg[chave] = [...(Array.isArray(reg[chave]) ? reg[chave] : []), ...ids]; };

// A cobrança do fechamento: a aula do chat continua aberta no registro e o tutor acabou de dizer que ela fechou.
function fechamento(e, s, mensagem) {
  const idAula = s && s.aula;
  if (!idAula) return null;
  let a;
  try { a = mapa.aula(idAula); } catch { return null; }
  if (!a || a.tipo !== 'aula' || !Array.isArray(a.milestones)) return null;
  const reg = (e.aulas || {})[idAula] || {};
  if (reg.status === 'concluida') return null;
  const chat = registroDoChat(e, s);
  if (marcado(chat, 'cobrou_fechamento', idAula)) return null;
  if (!daComoEncerrada(e, idAula, mensagem)) return null;
  const engano = 'Se a aula ainda não terminou, este aviso foi engano: não escreva mais nada ao aluno. Não comente este aviso.';
  // A fluência que não passou na primeira espera a escolha do aluno (21/10): fechar antes dela é o que o `concluir`
  // recusa, e a `tutor` manda perguntar.
  const f = reg.fluencia;
  if (a.fluencia && f && !f.passou && (f.tentativas || 0) < 2 && !f.seguiu_em) {
    return { texto: `(Sala: a sua resposta dá a aula ${idAula} como encerrada, mas a fluência não passou na primeira e ele ainda não escolheu: pergunte agora se ele quer tentar de novo ou seguir, sem recomendar, e só feche depois da resposta. ${engano})`, marcar: marcar(chat, 'cobrou_fechamento', [idAula]) };
  }
  const marcos = a.milestones.filter((m) => !(reg.milestones || {})[m.id]).map((m) => m.id);
  const semFluencia = Boolean(a.fluencia) && !f;
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
  return {
    texto: `(Sala: a sua resposta dá a aula ${idAula} como encerrada, mas no registro ela continua aberta: ${faltam.length > 1 ? 'faltam' : 'falta'} ${faltam.slice(0, -1).join(', ')}${faltam.length > 1 ? ' e ' : ''}${faltam[faltam.length - 1]}. Se você já deu ao aluno o que falta, registre agora, numa chamada só e nesta ordem: ${passos.join('; ')}; não registre marco que não deu. Só depois diga a ele, em uma frase, que a aula fechou. ${engano})`,
    marcar: marcar(chat, 'cobrou_fechamento', [idAula]),
  };
}

// Houve tentativa da avaliação desta aula desde o começo do chat: nota, pendência, falha, login, ou uma rodando. Pelo
// chat e não pelo turno: o aluno que negou a aprovação num turno não é perguntado de novo no seguinte, e a tentativa
// repetida no mesmo chat adiantaria a desistência (MAX_ADIAMENTOS, MAX_FALHAS), que é do chat seguinte.
function tentou(reg, desde) {
  const t = Date.parse(desde);
  if (Number.isNaN(t)) return true;
  return [reg.avaliada_em, (reg.avaliacao_adiada || {}).em, (reg.avaliacao_falhou || {}).em, (reg.avaliacao_login || {}).em, (reg.avaliacao_em_andamento || {}).em]
    .some((x) => x && Date.parse(x) >= t);
}

// A cobrança da avaliação pendente: a do chat anterior, que o resumo mandou rodar, ou a da aula que este chat concluiu
// sem o `avaliar`; o chat não tentou nenhuma vez. Uma vez por chat e aula.
function avaliacao(e, s) {
  if (!s || !s.envio_em) return null;
  const desde = s.inicio || s.envio_em;
  const chat = registroDoChat(e, s);
  const ids = resumo.avaliacoesPendentes(e, true).filter((id) => !marcado(chat, 'cobrou_avaliacao', id) && !tentou((e.aulas || {})[id] || {}, desde));
  if (!ids.length) return null;
  return {
    ids,
    marcar: marcar(chat, 'cobrou_avaliacao', ids),
    texto: `(Sala: a avaliação ${ids.length > 1 ? 'das aulas' : 'da aula'} ${ids.join(', ')} continua pendente, e este chat não a tentou. Rode agora ${ids.map((id) => resumo.comandoAvaliar(e, id)).join(' e ')}, antes de terminar o turno; se ele pedir para rodar fora do sandbox, peça a aprovação ao aluno. Não comente a avaliação com o aluno: se não houver aprovação a pedir, não escreva mais nada a ele, nem para dizer que não há o que escrever.)`,
  };
}

module.exports = { fechamento, avaliacao, daComoEncerrada };
