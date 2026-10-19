'use strict';
// A conversa que o Codex grava no disco (branch codex): `<CODEX_HOME>/sessions/AAAA/MM/DD/rollout-<data>-<id>.jsonl`,
// uma linha JSON por acontecimento, com `timestamp`, `ordinal`, `type` e `payload`. No modo Codex ela é a fonte do
// tempo e da avaliação, com hook ou sem hook.
//
// O formato não é contrato: o próprio Codex chama estes arquivos de legado. Então nada aqui lança. Linha que não se
// entende é pulada, arquivo que não abre vira uma conversa vazia, e quem decide o que fazer com isso (pendência,
// alarme de formato) é quem chama.
const fs = require('fs');
const path = require('path');
const { codexHome } = require('../paths');

const DOIS_MINUTOS = 2 * 60 * 1000;
// O fim da conversa basta para saber se o último turno fechou; só se o último `task_started` estiver mais longe que
// isto (uma saída de comando enorme depois dele) a conversa é lida inteira.
const CAUDA = 512 * 1024;
// A primeira linha traz as instruções de sistema (~20 KB nas conversas de 10/2026). Mais que isto não é session_meta.
const MAX_PRIMEIRA = 1024 * 1024;

const texto = (x) => (typeof x === 'string' && x ? x : null);
const objeto = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : null);
// Os horários vêm do `timestamp` da linha, com milissegundos. O `started_at`/`completed_at` do payload estão em
// segundos e não servem: num turno de poucos segundos o erro é do tamanho do turno.
function quando(ts) {
  const ms = typeof ts === 'string' ? Date.parse(ts) : NaN;
  return Number.isFinite(ms) ? ms : null;
}
const vazia = () => ({ meta: null, metas: [], cwds: [], turnos: [], itens: [] });

// A conversa de um subagente (T4). O Codex abre uma para cada subagente e copia nela o histórico do pai, inclusive o
// `task_started` do turno que criou o subagente, sem o fim, que fica só no arquivo do pai. O `session_meta` dela diz
// isso (`thread_source: "subagent"`, `source.subagent`) e onde a parte dela começa (`subagent_history_start_ordinal`).
// Ela nunca é o chat do aluno.
function subagenteDe(p) {
  if (p.thread_source !== 'subagent' && !(objeto(p.source) && p.source.subagent)) return null;
  return { inicio: Number.isInteger(p.subagent_history_start_ordinal) ? p.subagent_history_start_ordinal : null };
}

function metaDe(p) {
  const sub = subagenteDe(p);
  return { id: texto(p.id), cwd: texto(p.cwd), originator: texto(p.originator), cli_version: texto(p.cli_version), forked_from_id: texto(p.forked_from_id), ...(sub ? { subagente: sub } : {}) };
}

// O comando `status` da sala, como o Codex o grava no item do comando (o `command` é a lista que o shell recebeu).
const STATUS = /(?:trilha\.js|sala\.cjs)["']?\s+status\b/;
function eStatus(item) {
  if (!objeto(item) || item.type !== 'CommandExecution') return false;
  const cmd = Array.isArray(item.command) ? item.command.join(' ') : item.command;
  return typeof cmd === 'string' && STATUS.test(cmd);
}

// Procura `*-<id>.jsonl` das pastas de data mais novas para as mais velhas (os nomes AAAA, MM e DD ordenam como
// texto), e depois nas arquivadas.
//
// O id casa inteiro. Ele tem hífens, então "termina com -<id>.jsonl" aceitaria um pedaço do fim de outro id: vale só
// um id com a forma de UUID (o que o Codex usa), ou um nome em que antes do id venha a hora (`...T16-17-34-<id>`).
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function procurar(dir, id, profundidade) {
  let entradas;
  try { entradas = fs.readdirSync(dir, { withFileTypes: true }); } catch { return null; }
  const sufixo = `-${id}.jsonl`;
  const inteiro = UUID.test(id);
  const achado = entradas.find((e) => e.isFile() && e.name.endsWith(sufixo) && (inteiro || /T\d\d-\d\d-\d\d$/.test(e.name.slice(0, -sufixo.length))));
  if (achado) return path.join(dir, achado.name);
  if (profundidade <= 0) return null;
  const pastas = entradas.filter((e) => e.isDirectory()).map((e) => e.name).sort().reverse();
  for (const p of pastas) {
    const r = procurar(path.join(dir, p), id, profundidade - 1);
    if (r) return r;
  }
  return null;
}
function achar(id) {
  try {
    if (!texto(id) || /[\\/]|\.\./.test(id)) return null;
    const home = codexHome();
    return procurar(path.join(home, 'sessions'), id, 3) || procurar(path.join(home, 'archived_sessions'), id, 3);
  } catch { return null; }
}

// Só a primeira linha, sem ler o arquivo inteiro: quem filtra as conversas da sala lê dezenas delas.
function primeiraLinha(arquivo) {
  const fd = fs.openSync(arquivo, 'r');
  try {
    const partes = [];
    const buf = Buffer.alloc(64 * 1024);
    let pos = 0;
    while (pos < MAX_PRIMEIRA) {
      const n = fs.readSync(fd, buf, 0, buf.length, pos);
      if (!n) break;
      const nl = buf.subarray(0, n).indexOf(10);
      if (nl !== -1) { partes.push(Buffer.from(buf.subarray(0, nl))); break; }
      partes.push(Buffer.from(buf.subarray(0, n)));
      pos += n;
    }
    return Buffer.concat(partes).toString('utf8');
  } finally { fs.closeSync(fd); }
}
function meta(arquivo) {
  try {
    const o = JSON.parse(primeiraLinha(arquivo).replace(/^\uFEFF/, ''));
    const p = objeto(o) && o.type === 'session_meta' ? objeto(o.payload) : null;
    return p ? metaDe(p) : null;
  } catch { return null; }
}

// A conversa inteira, em turnos e itens.
// - O turno nasce no `task_started` e fecha no `task_complete` ou no `turn_aborted` (interrompido). O `n` é a posição
//   dele entre os `task_started` do arquivo: o `resume` acrescenta no mesmo arquivo e continua a contagem; o fork é
//   outro arquivo, sem o histórico, e começa do 1.
// - Um item pertence a um turno pelo `turn_id` que traz, nunca pela posição: o turno abortado ainda grava a saída do
//   comando que estava rodando depois do `turn_aborted`.
// - `itens` guarda as falas e as ferramentas para o conversor: o `item_completed` (a fonte estável, T0.13) e o
//   `response_item` (a reserva, que também carrega o AGENTS.md e o <environment_context> como fala do usuário).
// - Na conversa de um subagente, os turnos copiados do pai (antes de `subagent_history_start_ordinal`) não contam.
//
// `opts` é da sincronização (codex/sessao.js), que roda a cada comando e não pode reler do começo uma conversa de
// dias: `{ pos, desdeOrdinal, n }` são o byte em que a leitura anterior parou, o último ordinal lido e quantos
// `task_started` já passaram. Com eles a leitura vem também com `fins` (o fim de um turno que começou antes do
// trecho), `compactados` e `status` (os ordinais das linhas `compacted` e dos comandos `status` do tutor), e com
// `pos`, `ordinal`, `n` e `tamanho` para a leitura seguinte. Só entra linha inteira: a que o Codex ainda está
// escrevendo fica para a próxima.
function ler(arquivo, opts) {
  if (opts === undefined) return lerTudo(arquivo);
  return lerDesde(arquivo, opts && typeof opts === 'object' ? opts : {});
}

function lerTudo(arquivo) {
  const r = vazia();
  let conteudo;
  try { conteudo = fs.readFileSync(arquivo, 'utf8'); } catch { return r; }
  percorrer(conteudo, r, { ordinal: -1, n: 0, desde: -Infinity, comeco: true, estendido: false });
  return r;
}

function lerDesde(arquivo, { pos = 0, desdeOrdinal = -1, n = 0 } = {}) {
  const desde = Number.isInteger(desdeOrdinal) ? desdeOrdinal : -1;
  const r = { ...vazia(), fins: [], compactados: [], status: [], pos: 0, ordinal: desde, n: 0, tamanho: 0 };
  let fd;
  try { fd = fs.openSync(arquivo, 'r'); } catch { return r; }
  try {
    const tamanho = fs.fstatSync(fd).size;
    r.tamanho = tamanho;
    const trecho = (de) => {
      const buf = Buffer.alloc(tamanho - de);
      const lidos = buf.length ? fs.readSync(fd, buf, 0, buf.length, de) : 0;
      return buf.subarray(0, lidos);
    };
    let de = Number.isInteger(pos) && pos > 0 && pos <= tamanho ? pos : 0;
    let buf = trecho(de);
    // O byte guardado tem de cair no começo de uma linha depois da última lida. Se não cai (o arquivo foi trocado ou
    // reescrito), a conversa é lida do começo, e o que já foi importado se reconhece pelo ordinal.
    if (de) {
      const nl = buf.indexOf(10);
      let ok = buf.length === 0 || buf[0] === 0x7b;
      if (ok && nl !== -1) {
        try { const o = JSON.parse(buf.subarray(0, nl).toString('utf8')); ok = !Number.isInteger(o.ordinal) || o.ordinal > desde; } catch { ok = false; }
      }
      if (!ok) { de = 0; buf = trecho(0); }
    }
    const ultimo = buf.lastIndexOf(10);
    r.pos = de + ultimo + 1;
    if (ultimo === -1) { r.n = de ? n : 0; r.ordinal = de ? desde : -1; return r; }
    const fimDe = percorrer(buf.subarray(0, ultimo + 1).toString('utf8'), r, de
      ? { ordinal: desde, n: Number.isInteger(n) && n > 0 ? n : 0, desde, comeco: false, estendido: true }
      : { ordinal: -1, n: 0, desde, comeco: true, estendido: true });
    r.ordinal = fimDe.ordinal;
    r.n = fimDe.n;
  } catch { /* o que já foi lido vale */ } finally { try { fs.closeSync(fd); } catch { /* segue */ } }
  return r;
}

// O laço das duas leituras. `c.desde`: o que tem ordinal até ele já foi lido antes, e só conta para o `n`.
function percorrer(conteudo, r, c) {
  const turnos = new Map();
  const cwds = new Set(r.cwds);
  const cwd = (x) => { if (texto(x)) cwds.add(x); };
  let ordinal = c.ordinal;
  let n = c.n;
  let primeira = c.comeco;
  let doSubagente = null;
  try {
    for (const bruta of conteudo.split('\n')) {
      if (!bruta.trim()) continue;
      const eraPrimeira = primeira;
      primeira = false;
      let o;
      try { o = JSON.parse(eraPrimeira ? bruta.replace(/^\uFEFF/, '') : bruta); } catch { continue; }
      if (!objeto(o)) continue;
      ordinal = Number.isInteger(o.ordinal) ? o.ordinal : ordinal + 1;
      const p = objeto(o.payload);
      if (!p) continue;
      const ts = quando(o.timestamp);
      const novo = ordinal > c.desde;

      if (o.type === 'session_meta') {
        const m = metaDe(p);
        r.metas.push({ ordinal, ...m });
        if (eraPrimeira) { r.meta = m; cwd(m.cwd); if (m.subagente) doSubagente = m.subagente.inicio; }
      } else if (o.type === 'turn_context') {
        cwd(p.cwd);
      } else if (o.type === 'compacted') {
        if (c.estendido && novo) r.compactados.push(ordinal);
      } else if (o.type === 'event_msg') {
        const turnId = texto(p.turn_id);
        if (p.type === 'task_started' && turnId && !turnos.has(turnId)) {
          if (doSubagente !== null && ordinal < doSubagente) continue;
          n += 1;
          const t = { turn_id: turnId, n, inicio: ts, fim: null, interrompido: false, ordinal_inicio: ordinal, ordinal_fim: null };
          turnos.set(turnId, { t, novo });
          if (novo) r.turnos.push(t);
        } else if (p.type === 'task_complete' || p.type === 'turn_aborted') {
          const visto = turnId ? turnos.get(turnId) : null;
          if (visto && visto.novo) {
            const t = visto.t;
            if (t.ordinal_fim === null) {
              t.fim = ts;
              t.interrompido = p.type === 'turn_aborted';
              t.ordinal_fim = ordinal;
            }
          } else if (c.estendido && novo && turnId && !(visto && visto.fim)) {
            // O turno começou num trecho já lido: o fim vai para quem o importou.
            if (visto) visto.fim = true;
            r.fins.push({ turn_id: turnId, fim: ts, interrompido: p.type === 'turn_aborted', ordinal_fim: ordinal });
          }
        } else if (p.type === 'item_completed' && objeto(p.item)) {
          if (!novo) continue;
          r.itens.push({ ordinal, turn_id: turnId, tipo: texto(p.item.type), fonte: 'item_completed', ts, payload: p });
          if (c.estendido && eStatus(p.item)) r.status.push(ordinal);
        }
      } else if (o.type === 'response_item') {
        if (!novo) continue;
        const passa = objeto(p.internal_chat_message_metadata_passthrough) || {};
        r.itens.push({ ordinal, turn_id: texto(p.turn_id) || texto(passa.turn_id), tipo: texto(p.type), ...(texto(p.role) ? { papel: p.role } : {}), fonte: 'response_item', ts, payload: p });
      }
    }
  } catch { /* o que já foi lido vale */ }
  r.cwds = [...cwds];
  return { ordinal, n };
}

// O último `task_started` da cauda do arquivo ainda está aberto? `undefined` quando a cauda não tem nenhum.
function abertoNaCauda(arquivo, tamanho) {
  const n = Math.min(tamanho, CAUDA);
  const fd = fs.openSync(arquivo, 'r');
  let cauda;
  try {
    const buf = Buffer.alloc(n);
    const lidos = fs.readSync(fd, buf, 0, n, tamanho - n);
    cauda = buf.subarray(0, lidos).toString('utf8');
  } finally { fs.closeSync(fd); }
  const linhas = cauda.split('\n');
  if (n < tamanho) linhas.shift(); // a primeira começa no meio
  let ultimo;
  let aberto;
  for (const l of linhas) {
    if (!l.includes('"event_msg"')) continue;
    let o;
    try { o = JSON.parse(l); } catch { continue; }
    const p = objeto(o) && objeto(o.payload);
    if (!p || !texto(p.turn_id)) continue;
    if (p.type === 'task_started') { ultimo = p.turn_id; aberto = true; }
    else if ((p.type === 'task_complete' || p.type === 'turn_aborted') && p.turn_id === ultimo) aberto = false;
  }
  return ultimo === undefined ? undefined : aberto;
}

// Um turno no meio: o último sem fim, e o arquivo mexido há menos de 2 minutos. Um chat do Codex parado com o turno
// sem fim (o aplicativo morto no meio) não está em andamento.
function emAndamento(arquivo) {
  try {
    const st = fs.statSync(arquivo);
    if (!st.isFile() || Date.now() - st.mtimeMs >= DOIS_MINUTOS) return false;
    const naCauda = abertoNaCauda(arquivo, st.size);
    if (naCauda !== undefined) return naCauda;
    const t = ler(arquivo).turnos;
    return t.length > 0 && t[t.length - 1].fim === null;
  } catch { return false; }
}

// A pasta da conversa contra a pasta da sala. O Codex escreve o `cwd` de vários jeitos (`C:\...`, `file:///C:/...`
// com %XX, `\\?\C:\...`), e a sala pode estar no OneDrive, com acento (NFC ou NFD) e caixa diferente.
function normalizar(p) {
  let s = String(p).replace(/^\\\\\?\\UNC\\/i, '\\\\').replace(/^\\\\\?\\/, '').replace(/^file:\/\//i, '');
  s = s.replace(/(%[0-9A-Fa-f]{2})+/g, (m) => { try { return decodeURIComponent(m); } catch { return m; } });
  s = s.replace(/\\/g, '/').replace(/^\/([A-Za-z]:)/, '$1').normalize('NFC');
  try { s = fs.realpathSync.native(s).replace(/\\/g, '/').normalize('NFC'); } catch { /* pasta que não existe nesta máquina */ }
  s = s.replace(/\/+$/, '');
  return process.platform === 'win32' || process.platform === 'darwin' ? s.toLowerCase() : s;
}
// Verdadeiro se `a` é `b` ou está dentro de `b`. `trilha-2020` não está dentro de `trilha-202`.
function mesmaPasta(a, b) {
  try {
    if (!texto(a) || !texto(b)) return false;
    const x = normalizar(a);
    const y = normalizar(b);
    return x === y || x.startsWith(y + '/');
  } catch { return false; }
}

module.exports = { achar, meta, ler, emAndamento, mesmaPasta };
