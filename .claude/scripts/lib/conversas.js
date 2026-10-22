'use strict';
// Uma cópia da conversa de cada chat, dentro da sala (22/10).
//
// O avaliador lê a conversa do .jsonl que o Claude Code grava em ~/.claude/projects. Fechar o chat pelo X do
// aplicativo de desktop apaga esse arquivo (o aplicativo deixa no lugar um `<id>.desktop-released.json`), e a
// avaliação que tinha ficado pendente perdia a aula: um aluno teve a 1.2 e a 1.3 sem nota assim. Agora o fim de cada
// turno e o fim da sessão copiam a conversa para trilha/conversas, fora do git, e a busca da transcrição usa a cópia
// só quando o original sumiu. A cópia sai quando não serve mais.
//
// A cópia cresce por acréscimo, como o original: a cada vez só entram as linhas inteiras novas, sem o token da 202
// (a credencial não fica numa segunda cópia dentro da pasta da sala). O `<id>.pos` guarda até onde o original foi
// copiado, o tamanho da cópia naquele ponto e uma impressão do começo do original: uma escrita interrompida no meio é
// desfeita na seguinte, e um original reescrito recomeça a cópia. Uma trava por chat impede o fim do turno e o fim da
// sessão de acrescentarem o mesmo pedaço ao mesmo tempo. O tutor não lê esta pasta (deny no settings.json e a guarda).
//
// Só o Claude Code: o Codex guarda a conversa dele em outro lugar, e o aplicativo não a apaga ao fechar.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const paths = require('./paths');
const { marcasDaAula, janelaDoArquivo } = require('./horario');

const DIR = path.join(paths.TRILHA, 'conversas');
const PRAZO_MS = 60 * 24 * 60 * 60 * 1000;
const FOLGA_MS = 2 * 60 * 1000;
const TRAVA_VELHA_MS = 30 * 1000;
const CABECA = 4096;
const idValido = (id) => typeof id === 'string' && /^[0-9A-Za-z_-]{1,64}$/.test(id);
const destino = (id) => path.join(DIR, `${id}.jsonl`);
const posDe = (id) => path.join(DIR, `${id}.pos`);
const travaDe = (id) => path.join(DIR, `${id}.lock`);

// O token sai pelo valor exato do acesso desta sala, onde quer que apareça (colado solto, entre aspas, no `conectar`),
// e pelos dois prefixos, como rede de segurança para um token que não é o guardado. A marca não tem espaço: a
// transcrição (lib/transcricao.js, semToken) passa de novo por cima, e o token com prefixo sai no mesmo texto que do
// original. O token colado solto a transcrição do original não tira; a da cópia sai sem ele.
// A linha é JSON, então a aspa chega escapada (`\"`) e o valor para na aspa ou na barra.
const MARCA = '[token-omitido]';
function semToken(texto, guardado) {
  let t = texto;
  if (typeof guardado === 'string' && guardado.length >= 16) t = t.split(guardado).join(MARCA);
  return t
    .replace(/(TRILHA_202_TOKEN\s*=\s*(?:\\")?)[^\s"\\]+/g, `$1${MARCA}`)
    .replace(/(\btoken=(?:\\")?)[^\s"\\]+/g, `$1${MARCA}`);
}
function tokenGuardado() {
  try { return require('./acesso').token(); } catch { return ''; }
}

function lerPos(id) {
  try {
    const [o, c, cabeca] = fs.readFileSync(posDe(id), 'utf8').trim().split(/\s+/);
    const origem = Number(o);
    const copia = Number(c);
    return Number.isInteger(origem) && Number.isInteger(copia) ? { origem, copia, cabeca: cabeca || '' } : null;
  } catch { return null; }
}

// A impressão dos primeiros bytes já copiados do original (até 4 KB): o mesmo arquivo crescendo a mantém; reescrito,
// ela muda.
function cabecaDe(origem, ate) {
  const n = Math.min(CABECA, ate);
  if (n <= 0) return '';
  const buf = Buffer.alloc(n);
  const fd = fs.openSync(origem, 'r');
  let lidos = 0;
  try { lidos = fs.readSync(fd, buf, 0, n, 0); } finally { fs.closeSync(fd); }
  return crypto.createHash('sha1').update(buf.subarray(0, lidos)).digest('hex').slice(0, 16);
}

// A trava do chat: quem não a pega desiste desta vez (o outro hook está copiando o mesmo arquivo). Trava esquecida
// por um processo que morreu sai depois de 30 s.
function travar(id) {
  const p = travaDe(id);
  try { fs.writeFileSync(p, String(process.pid), { flag: 'wx' }); return true; } catch { /* já existe */ }
  try {
    if (Date.now() - fs.statSync(p).mtimeMs > TRAVA_VELHA_MS) {
      fs.rmSync(p, { force: true });
      fs.writeFileSync(p, String(process.pid), { flag: 'wx' });
      return true;
    }
  } catch { /* segue */ }
  return false;
}

// Nada aqui pode atrapalhar a aula: qualquer erro é silêncio, e a cópia segue na vez seguinte.
function guardar(id, origem) {
  if (!idValido(id) || typeof origem !== 'string' || !origem.endsWith('.jsonl')) return false;
  try {
    const st = fs.statSync(origem);
    if (!st.isFile()) return false;
    fs.mkdirSync(DIR, { recursive: true });
  } catch { return false; }
  if (!travar(id)) return false;
  try {
    const st = fs.statSync(origem);
    const dest = destino(id);
    const zero = { origem: 0, copia: 0, cabeca: '' };
    let pos = lerPos(id) || zero;
    let tamCopia = 0;
    try { tamCopia = fs.statSync(dest).size; } catch { pos = zero; }
    // O original foi reescrito (encolheu, ou o começo mudou): a cópia recomeça. Uma escrita que parou no meio é desfeita.
    if (st.size < pos.origem || tamCopia < pos.copia || (pos.origem > 0 && pos.cabeca !== cabecaDe(origem, pos.origem))) pos = zero;
    if (tamCopia !== pos.copia) {
      if (pos.copia === 0) fs.rmSync(dest, { force: true });
      else fs.truncateSync(dest, pos.copia);
    }
    if (st.size > pos.origem) {
      const n = st.size - pos.origem;
      const buf = Buffer.alloc(n);
      const fd = fs.openSync(origem, 'r');
      try { fs.readSync(fd, buf, 0, n, pos.origem); } finally { fs.closeSync(fd); }
      // Só linhas inteiras: a última pode estar sendo escrita agora.
      const fim = buf.lastIndexOf(0x0a);
      if (fim >= 0) {
        const texto = Buffer.from(semToken(buf.subarray(0, fim + 1).toString('utf8'), tokenGuardado()), 'utf8');
        fs.appendFileSync(dest, texto);
        const origemNova = pos.origem + fim + 1;
        pos = { origem: origemNova, copia: pos.copia + texto.length, cabeca: cabecaDe(origem, origemNova) };
        fs.writeFileSync(posDe(id), `${pos.origem} ${pos.copia} ${pos.cabeca}\n`);
      }
    }
    // A data da última escrita é a do original: a busca por horário (lib/horario.js) a lê como o fim da conversa.
    if (fs.existsSync(dest)) fs.utimesSync(dest, st.atimeMs / 1000, st.mtimeMs / 1000);
    return true;
  } catch {
    return false;
  } finally {
    try { fs.rmSync(travaDe(id), { force: true }); } catch { /* segue */ }
  }
}

function achar(id) {
  const base = typeof id === 'string' ? id.split('#')[0] : null;
  if (!idValido(base)) return null;
  const p = destino(base);
  try { return fs.statSync(p).isFile() ? p : null; } catch { return null; }
}

function todas() {
  try { return fs.readdirSync(DIR).filter((f) => f.endsWith('.jsonl')).map((f) => path.join(DIR, f)); } catch { return []; }
}

// O que a unidade ainda quer da conversa. `precisa`: não fechou, a avaliação dela está por rodar (pendente, adiada,
// em andamento, à espera do login) ou a prática entregue espera a correção. `guardar`: a avaliação ou a correção
// desistiu, e alguém ainda pode pedi-la de novo; fica até o prazo. `resolvida`: avaliada, corrigida, ou sem avaliação.
function situacao(e, idUnidade) {
  const r = (e.aulas || {})[idUnidade];
  if (!r || r.status !== 'concluida') return 'precisa';
  const p = (e.praticas || {})[idUnidade];
  if (p && p.entregue_em && !p.corrigida_em) return p.correcao_falhou ? 'guardar' : 'precisa';
  if (r.avaliada_em) return 'resolvida';
  if (r.avaliacao_pendente || r.avaliacao_adiada || r.avaliacao_em_andamento || r.avaliacao_login) return 'precisa';
  if (r.avaliacao_falhou) return 'guardar';
  return 'resolvida';
}

// No início de cada chat. Uma cópia sai quando todas as unidades do chat estão resolvidas, ou quando passou do prazo e
// nenhuma delas ainda precisa dela. Nos dois casos fica a que cobre o horário de uma unidade que precisa da conversa:
// a aula feita no chat de outra, sem etiqueta, só é achada pela busca por horário. O chat aberto nunca perde a dele.
// O `.pos` e a trava sem cópia saem junto.
function podar(e, agoraMs = Date.now()) {
  const sessoes = [...(e.sessoes || []), e.sessao_atual].filter(Boolean);
  const base = (s) => (typeof s.id === 'string' ? s.id.split('#')[0] : null);
  const aberta = e.sessao_atual ? base(e.sessao_atual) : null;
  const marcasQuePrecisam = Object.keys(e.aulas || {}).filter((u) => situacao(e, u) === 'precisa').flatMap((u) => marcasDaAula(e, u));
  for (const f of todas()) {
    try {
      const id = path.basename(f, '.jsonl');
      if (id === aberta) continue;
      const unidades = [...new Set(sessoes.filter((s) => base(s) === id).flatMap((s) => [s.aula, ...(s.aulas || [])]).filter(Boolean))];
      const sits = unidades.map((u) => situacao(e, u));
      const resolvida = unidades.length > 0 && sits.every((x) => x === 'resolvida');
      const velha = agoraMs - fs.statSync(f).mtimeMs > PRAZO_MS && !sits.includes('precisa');
      if (!resolvida && !velha) continue;
      const j = janelaDoArquivo(f);
      if (j && marcasQuePrecisam.some((t) => t >= j.inicio && t <= j.fim + FOLGA_MS)) continue;
      fs.rmSync(f, { force: true });
      fs.rmSync(posDe(id), { force: true });
    } catch { /* segue */ }
  }
  try {
    for (const x of fs.readdirSync(DIR)) {
      const id = x.replace(/\.(pos|lock)$/, '');
      if (id === x || id === aberta) continue;
      const orfa = x.endsWith('.pos') && !fs.existsSync(destino(id));
      const travaVelha = x.endsWith('.lock') && agoraMs - fs.statSync(path.join(DIR, x)).mtimeMs > TRAVA_VELHA_MS;
      if (orfa || travaVelha) fs.rmSync(path.join(DIR, x), { force: true });
    }
  } catch { /* segue */ }
}

module.exports = { DIR, guardar, achar, todas, podar, semToken, MARCA };
