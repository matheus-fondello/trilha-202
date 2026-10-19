'use strict';
// A sessão e os turnos do Codex, tirados da conversa que ele grava no disco (branch codex).
//
// No Claude, quem mede o tempo são os hooks: o envio e o fim de cada turno viram evento na hora. No Codex o hook nem
// sempre roda (pasta não confiada, aplicativo do Windows, `hooks.json` mudado), então a fonte é a conversa: todo
// comando da sala chama `sincronizar`, que lê o que o chat fez desde a última vez e enfileira os mesmos eventos que os
// hooks do Claude enfileirariam, com o horário de cada linha. O hook, quando roda, só chama a mesma sincronização mais
// cedo.
//
// O que já foi importado fica num registro próprio, `e.codex`, e não na sessão: o código do Claude recria a sessão à
// mão (`fecharSessao`, `retomarSessao`) com uma lista fixa de chaves, e um controle guardado nela se perderia, o que
// reimportaria os turnos e dobraria o tempo.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const paths = require('../paths');
const estadoLib = require('../estado');
const fila = require('../fila');
const turnosLib = require('../turnos');
const rollout = require('./rollout');
const { agora } = require('../util');

const TRAVA = path.join(paths.TRILHA, 'codex.lock');
const ESPERA_TRAVA_MS = 2000;
const PASSO_TRAVA_MS = 50;
// Uma sincronização leva milissegundos. Trava mais velha que isto é de um processo que morreu segurando.
const TRAVA_VELHA_MS = 15000;
// Turno sem fim com a conversa parada há mais que isto: o aplicativo foi fechado no meio da resposta.
const ORFAO_MS = 30 * 60 * 1000;
const VIVA_MS = estadoLib.MINUTOS_VIVA * 60 * 1000;
// A versão do Codex da fixture mais nova (testes/fixtures/codex/app-0162.jsonl). Uma conversa de versão maior pode
// ter mudado de formato: a 202 fica sabendo uma vez, e a aula segue.
const VERSAO_CONHECIDA = [0, 162, 0];

// --- ids ---
//
// Determinísticos, para o mesmo turno importado duas vezes ser o mesmo evento: com hook e comando no mesmo turno, ou
// numa importação que morreu antes de gravar o estado, a fila local reconhece o id e não enfileira de novo. São os dois
// únicos geradores; a recuperação usa os mesmos.
function uuid(partes) {
  const b = crypto.createHash('sha1').update('codex:' + partes.join(':')).digest().subarray(0, 16);
  b[6] = (b[6] & 0x0f) | 0x50; // versão 5
  b[8] = (b[8] & 0x3f) | 0x80; // variante RFC 4122
  const x = b.toString('hex');
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}
const idTurno = (chat, turnId, tipo) => uuid([chat, turnId, tipo]);
const idInicio = (sessao, aula) => uuid([sessao, aula]);

// --- trava ---
//
// O hook e o comando do mesmo turno, ou dois comandos seguidos, rodam juntos e leem a mesma conversa. Sem a trava os
// dois importariam o mesmo turno, e o estado gravado por último apagaria o do outro. Síncrona, porque é chamada de
// comandos síncronos; desiste em 2 s e devolve null sem rodar.
function dormir(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function comTrava(fn) {
  const marca = `${process.pid}:${crypto.randomUUID()}`;
  const limite = Date.now() + ESPERA_TRAVA_MS;
  let minha = false;
  while (!minha) {
    try {
      fs.mkdirSync(paths.TRILHA, { recursive: true });
      const fd = fs.openSync(TRAVA, 'wx');
      try { fs.writeSync(fd, marca); } finally { fs.closeSync(fd); }
      minha = true;
      break;
    } catch (err) {
      // EPERM e EBUSY: no Windows (e no OneDrive) um arquivo que outro processo está apagando ou sincronizando.
      if (!['EEXIST', 'EPERM', 'EBUSY', 'EACCES'].includes(err.code)) return null;
    }
    if (Date.now() >= limite) {
      // Uma trava que não sai nunca (o OneDrive segura o arquivo, um EPERM que não passa) faria todo chat responder
      // "ocupada" para sempre. Passado um minuto sem conseguir removê-la, ela é ignorada: a sincronização roda sem
      // trava, e a 202 fica sabendo uma vez (`travaIgnorada`, lido pela sincronização).
      if (presa()) { travaIgnorada = true; return fn(); }
      return null;
    }
    if (!quebrarVelha()) dormir(PASSO_TRAVA_MS);
  }
  try {
    return fn();
  } finally {
    // Só solta a própria: se esta passou do prazo e outro processo a quebrou, a trava de agora é dele.
    try { if (fs.readFileSync(TRAVA, 'utf8') === marca) fs.unlinkSync(TRAVA); } catch { /* já não existe */ }
  }
}
const TRAVA_PRESA_MS = 60000;
let travaIgnorada = false;
function presa() {
  try { return Date.now() - fs.statSync(TRAVA).mtimeMs > TRAVA_PRESA_MS; } catch { return false; }
}
// A trava de um processo que morreu. Renomeada antes de apagada: dois processos que a acham velha ao mesmo tempo
// tentam o rename, e só um consegue; o outro volta a esperar. EPERM ou EBUSY no rename é trava ocupada.
function quebrarVelha() {
  try {
    if (Date.now() - fs.statSync(TRAVA).mtimeMs <= TRAVA_VELHA_MS) return false;
    const velha = `${TRAVA}.${process.pid}`;
    fs.renameSync(TRAVA, velha);
    try { fs.unlinkSync(velha); } catch { /* fica para trás, e não atrapalha */ }
    return true;
  } catch (err) {
    return err && err.code === 'ENOENT';
  }
}

// --- leitura ---

const iso = (ms) => new Date(ms).toISOString();
const maisTarde = (a, b) => (!a ? b : !b ? a : a > b ? a : b);
function versaoMaior(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(String(v || ''));
  if (!m) return false;
  for (let i = 0; i < 3; i++) {
    const d = Number(m[i + 1]) - VERSAO_CONHECIDA[i];
    if (d) return d > 0;
  }
  return false;
}
function ultimaConclusao(e) {
  let max = null;
  for (const r of Object.values(e.aulas || {})) {
    const t = r && r.concluida_em ? Date.parse(r.concluida_em) : NaN;
    if (Number.isFinite(t) && (max === null || t > max)) max = t;
  }
  return max;
}
function lerDoChat(c) {
  return rollout.ler(c.arquivo, c.pos ? { pos: c.pos, desdeOrdinal: c.ordinal, n: c.n } : {});
}
function parado(arquivo) {
  try { return Date.now() - fs.statSync(arquivo).mtimeMs > ORFAO_MS; } catch { return true; }
}

// --- importação ---
//
// Os turnos de um chat que ainda não foram importados, na ordem da conversa. `ctx` é o da chamada: o estado, a fila
// já vista (para pular o id que um processo morto deixou lá) e o que esta chamada fez.
function importar(ctx, idChat, c, conv) {
  const { e } = ctx;
  const viva = Boolean(e.sessao_atual && e.sessao_atual.id === idChat);
  const s = viva ? e.sessao_atual : null;
  const anteriores = new Set(c.anteriores || []);
  if (c.boot_ms == null && conv.turnos.length && conv.turnos[0].inicio != null) c.boot_ms = conv.turnos[0].inicio;
  const boot = c.boot_ms;
  const mono = (ms) => Math.max(0, ms - (boot == null ? ms : boot));

  // Fins e inícios na ordem dos ordinais: o fim de um turno vem antes do começo do seguinte.
  const passos = [];
  for (const t of conv.turnos) {
    passos.push({ ordinal: t.ordinal_inicio, envio: t });
    if (t.ordinal_fim !== null) passos.push({ ordinal: t.ordinal_fim, fim: { turn_id: t.turn_id, fim: t.fim, interrompido: t.interrompido } });
  }
  for (const f of conv.fins || []) passos.push({ ordinal: f.ordinal_fim, fim: f });
  passos.sort((a, b) => a.ordinal - b.ordinal);

  const fechar = (turnId, r, fimMs, interrompido, orfao) => {
    const envioMs = Date.parse(r.envio);
    r.fim = orfao ? agora() : iso(fimMs);
    if (interrompido) r.interrompido = true;
    if (orfao) r.orfao = true;
    // O órfão fecha como o fechamento tardio do Claude: o fim é o envio (trabalho zero, o que de fato se sabe), e o
    // `ts` é quando se percebeu.
    const monoFim = orfao ? mono(envioMs) : mono(fimMs);
    enfileirar('turno.fim', { sessao: idChat, n: r.n, aula: r.aula, mono_ms: monoFim, interrompido: Boolean(interrompido) }, idTurno(idChat, turnId, 'turno.fim'), orfao ? r.fim : iso(fimMs), idChat);
    if (orfao) return;
    c.ultimo_fim = Math.max(c.ultimo_fim || 0, fimMs);
    if (s) {
      // Conta todo turno com fim observado, inclusive o abortado: é o que o `fim.js` faz com o interrompido que viu.
      s.trabalho_ms = (s.trabalho_ms || 0) + Math.max(0, fimMs - envioMs);
      s.ultimo_turno_fim = maisTarde(s.ultimo_turno_fim, r.fim);
      s.ultima_atividade = maisTarde(s.ultima_atividade, r.fim);
    }
  };
  function enfileirar(tipo, dados, id, ts, sessao) {
    if (ctx.ids.has(id)) return;
    ctx.ids.add(id);
    fila.enfileirar(tipo, dados, e, { id, ts, sessao });
    ctx.importados += 1;
  }

  for (const p of passos) {
    if (p.fim) {
      const r = c.turnos[p.fim.turn_id];
      if (!r || r.fim || anteriores.has(p.fim.turn_id)) {
        // O fim de um turno anterior ao corte só diz quando o chat parou pela última vez.
        if (anteriores.has(p.fim.turn_id) && p.fim.fim != null) c.ultimo_fim = Math.max(c.ultimo_fim || 0, p.fim.fim);
        continue;
      }
      fechar(p.fim.turn_id, r, p.fim.fim != null ? p.fim.fim : Date.parse(r.envio), p.fim.interrompido, false);
      continue;
    }
    const t = p.envio;
    if (c.turnos[t.turn_id] || anteriores.has(t.turn_id)) continue;
    const inicio = t.inicio != null ? t.inicio : Date.now();
    // Um turno anterior ainda aberto aqui morreu sem resposta (o aplicativo caiu e o aluno seguiu): fecha como
    // interrompido antes, como o `turnos.abrir` do Claude.
    for (const [id, r] of Object.entries(c.turnos)) if (!r.fim) fechar(id, r, null, true, true);

    const volta = Boolean(c.ultimo_fim) && inicio - c.ultimo_fim > VIVA_MS;
    let aula;
    let retomada;
    if (s) {
      if (s.contada === false) {
        // A sessão conta no primeiro envio, e não no fim do turno: assim o `sessao.inicio` sai antes de qualquer
        // evento do comando que está rodando agora.
        const idIni = idInicio(idChat, s.aula);
        const tsIni = iso(inicio);
        estadoLib.contarSessao(e, {
          ts: tsIni, mono_ms: mono(inicio), boot_ms: boot, id: idIni,
          naFila: { sessao: ctx.ids.has(idIni), aula: ctx.eventos.some((x) => x.tipo === 'aula.inicio' && x.aula === s.aula && x.ts === tsIni) },
        });
        ctx.ids.add(idIni);
      }
      // A aula do turno pela regra do `turnos.abrir`: depois do `concluir`, o "obrigado" no mesmo chat ainda é da
      // que fechou; fora disso, a atual.
      const daSessao = s.aula && ((e.aulas || {})[s.aula] || {}).status === 'concluida';
      aula = daSessao ? s.aula : e.aula_atual;
      // O `n` é o da conversa, e `n == n_base + turnos` vale para a sessão viva: o `ultimoNumero` e o `n_base` que o
      // `fecharSessao` guarda continuam coerentes, inclusive quando outro chat importou turnos deste.
      s.turnos = (s.turnos || 0) + 1;
      s.n_base = Math.max(0, t.n - s.turnos);
      retomada = Boolean(s.retomada_pendente) || (s.n_base > 0 && s.turnos === 1) || volta;
      delete s.retomada_pendente;
      s.ultima_atividade = maisTarde(s.ultima_atividade, iso(inicio));
    } else {
      aula = c.aula || e.aula_atual;
      retomada = volta;
    }
    // A volta ao chat que pediu a sincronização (não a de outro chat importado junto) pede o `status` ao tutor.
    if (ctx.primeiraVolta === null && idChat === ctx.idChat) ctx.primeiraVolta = retomada;
    // Marcado antes de enfileirar: o que está no registro não se importa de novo.
    const r = { n: t.n, aula, envio: iso(inicio), fim: null, ...(retomada ? { retomada: true } : {}) };
    c.turnos[t.turn_id] = r;
    enfileirar('turno.envio', { sessao: idChat, n: t.n, aula, mono_ms: mono(inicio), ...(retomada ? { retomada: true } : {}) }, idTurno(idChat, t.turn_id, 'turno.envio'), iso(inicio), idChat);
  }

  // O último turno sem fim, com a conversa parada há mais de 30 minutos: o aplicativo foi fechado no meio. Nunca o do
  // chat que pediu a sincronização: é dele o comando que está rodando, e uma ferramenta longa pode deixar a conversa
  // sem escrita por um tempo.
  if (idChat !== ctx.idChat && Object.values(c.turnos).some((r) => !r.fim) && parado(c.arquivo)) {
    for (const [id, r] of Object.entries(c.turnos)) if (!r.fim) fechar(id, r, null, true, true);
  }

  c.pos = conv.pos;
  c.ordinal = conv.ordinal;
  c.n = conv.n;
  c.tamanho = conv.tamanho;
  for (const o of conv.compactados || []) c.ultimo_compactado = Math.max(c.ultimo_compactado == null ? -1 : c.ultimo_compactado, o);
  for (const o of conv.status || []) c.ultimo_status = Math.max(c.ultimo_status == null ? -1 : c.ultimo_status, o);
  c.aberto = viva || Object.values(c.turnos).some((r) => !r.fim);
}

// --- a sincronização ---
//
// Sob a trava: carrega o estado, muda e grava uma vez, no fim. Quem chama e já tinha um estado na mão relê depois.
// Devolve null sem mexer em nada quando não há conversa (ou ela é de um subagente, que não é o chat do aluno);
// `{ ocupada: true }` quando a trava não veio; e senão `{ nova, importados, fechou, pedirStatus? }`.
function sincronizar(idChat, { fonte } = {}) {
  if (!idChat) return null;
  const arquivo = rollout.achar(idChat);
  if (!arquivo) return null;
  const meta = rollout.meta(arquivo);
  if (meta && meta.subagente) return null;
  const r = comTrava(() => sobTrava(idChat, arquivo, meta, fonte));
  return r === null ? { ocupada: true } : r;
}

function sobTrava(idChat, arquivo, meta, fonte) {
  const e = estadoLib.carregar();
  const cx = e.codex || (e.codex = { chats: {} });
  if (!cx.chats) cx.chats = {};
  const eventos = fila.ler();
  const ctx = { e, eventos, ids: new Set(eventos.map((x) => x.id)), importados: 0, primeiraVolta: null, idChat };
  const feitos = new Set();

  // Outro chat é a sessão atual. Se é do Codex, os turnos que faltavam dele entram antes, para o `sessao.fim` sair
  // com o trabalho inteiro; depois ele fecha pelo caminho de hoje.
  let fechou = null;
  const s0 = e.sessao_atual;
  if (s0 && s0.id !== idChat) {
    const c0 = s0.agente === 'codex' && s0.id ? cx.chats[s0.id] : null;
    if (c0) { importar(ctx, s0.id, c0, lerDoChat(c0)); feitos.add(s0.id); }
    fechou = { agente: s0.agente || 'claude', aula: s0.aula || null };
    turnosLib.fechar(e, { interrompido: true, tarde: true });
    estadoLib.fecharSessao(e, s0.ultima_atividade || s0.inicio, 'outra-sessao');
    if (c0) c0.aberto = Object.values(c0.turnos).some((r) => !r.fim);
  }

  // A conversa deste chat, do ponto em que parou (do começo, na primeira vez).
  const novoNoRegistro = !cx.chats[idChat];
  const c = cx.chats[idChat] || { arquivo, boot_ms: null, aula: null, aberto: true, turnos: {} };
  c.arquivo = arquivo;
  const conv = lerDoChat(c);
  if (c.boot_ms == null && conv.turnos.length && conv.turnos[0].inicio != null) c.boot_ms = conv.turnos[0].inicio;

  // O corte da primeira vista: os turnos de um chat que aparece pela primeira vez e começaram antes da última
  // conclusão são de aulas que já fecharam. Ficam sem evento; quem os importa, com a aula certa, é a recuperação.
  // Sem isto um chat antigo retomado jogaria as aulas passadas na aula de agora.
  if (novoNoRegistro) {
    const corte = ultimaConclusao(e);
    const antes = corte === null ? [] : conv.turnos.filter((t) => t.inicio != null && t.inicio < corte);
    if (antes.length) c.anteriores = antes.map((t) => t.turn_id);
  }

  let nova = false;
  if (!e.sessao_atual) {
    if ((e.sessoes || []).some((x) => x.id === idChat)) {
      // O chat já foi sessão: volta a ser, com o registro dele. A aula restaurada fica: quem leva o chat à aula da vez
      // é o `emendar` do primeiro marco ou quiz, como no Claude.
      estadoLib.retomarSessao(e, { session_id: idChat, transcript_path: arquivo });
      e.sessao_atual.agente = 'codex';
    } else {
      // Nasce como no `inicio.js` do Claude. A escolha de frente só se oferece a uma conversa nova, nunca a um
      // `resume`: com hook, pela origem; sem hook, um chat que não tem nada importado e no máximo um turno.
      estadoLib.avancarSeConcluida(e);
      const conversaNova = fonte ? fonte === 'startup' || fonte === 'clear'
        : novoNoRegistro && !(c.anteriores || []).length && conv.n <= 1;
      const primeiro = conv.turnos.find((t) => !(c.anteriores || []).includes(t.turn_id));
      e.sessao_atual = {
        id: idChat, inicio: agora(), ultima_atividade: agora(), aula: e.aula_atual, turnos: 0,
        n_base: primeiro ? primeiro.n - 1 : conv.n, fonte: fonte || 'startup', contada: false, transcricao: arquivo,
        turno_aberto: null, ultimo_turno_fim: null, trabalho_ms: 0, agente: 'codex',
      };
      if (conversaNova) estadoLib.oferecerEscolha(e);
      nova = true;
    }
  }
  if (!e.sessao_atual.transcricao) e.sessao_atual.transcricao = arquivo;

  cx.chats[idChat] = c;
  importar(ctx, idChat, c, conv);
  feitos.add(idChat);
  c.aula = e.sessao_atual.aula;
  c.aberto = true;

  // Os outros chats com turno por fechar: o último turno de um chat que o Claude fechou (o caminho do Claude não
  // importa nada) entra aqui, com a sessão e a aula dele, sem mexer no histórico desse chat. Um chat já fechado que
  // voltou a crescer (o aluno conversou nele sem rodar comando) também.
  for (const [x, cx2] of Object.entries(cx.chats)) {
    if (feitos.has(x) || cx2.recuperado) continue;
    let cresceu = false;
    if (!cx2.aberto) { try { cresceu = fs.statSync(cx2.arquivo).size > (cx2.tamanho || cx2.pos || 0); } catch { cresceu = false; } }
    if (!cx2.aberto && !cresceu) continue;
    importar(ctx, x, cx2, lerDoChat(cx2));
  }

  // O alarme de formato, uma vez por versão: a conversa mudou e a sala não entende mais, ou é de uma versão do Codex
  // mais nova do que as que a sala conhece.
  const versao = meta && meta.cli_version;
  // `sem-pasta`: a conversa não diz em que pasta foi aberta (o chat não foi recusado por isso, ver `pasta`).
  const motivo = conv.tamanho > 0 && conv.n === 0 && !fonte ? 'sem-turnos'
    : novoNoRegistro && conv.tamanho > 0 && !conv.cwds.length ? 'sem-pasta'
      : versaoMaior(versao) ? 'versao-nova' : null;
  // `formato_avisado` guarda as versões que já avisaram: um aluno com dois chats de versões diferentes não avisa a
  // cada troca de chat.
  const avisadas = Array.isArray(cx.formato_avisado) ? cx.formato_avisado : [];
  if (motivo && !avisadas.includes(versao || '?')) {
    cx.formato_avisado = [...avisadas, versao || '?'];
    fila.enfileirar('harness.codex_formato', { cli_version: versao || null, motivo }, e);
  }
  if (travaIgnorada) avisoUnico(e, 'trava', { cli_version: versao || null, motivo: 'trava' });

  // Volta ao chat e compactação, sem hook: no Claude o SessionStart de `resume` e de `compact` injeta o estado de novo
  // (pendências, a retomada no fechamento). Aqui o comando que sincronizou manda o tutor rodar `status`.
  const compactou = c.ultimo_compactado != null && c.ultimo_compactado > (c.ultimo_status == null ? -1 : c.ultimo_status);
  const pedirStatus = Boolean(ctx.primeiraVolta) || compactou;

  estadoLib.salvar(e);
  return { nova, importados: ctx.importados, fechou, ...(pedirStatus ? { pedirStatus: true } : {}) };
}

// Avisos à 202 que não são de versão (a trava presa, um erro da sincronização): uma vez cada, guardados em
// `e.codex.avisos`.
function avisoUnico(e, chave, dados) {
  const cx = e.codex || (e.codex = { chats: {} });
  const avisos = Array.isArray(cx.avisos) ? cx.avisos : [];
  if (avisos.includes(chave)) return false;
  cx.avisos = [...avisos, chave];
  fila.enfileirar('harness.codex_formato', dados, e);
  return true;
}

// Uma exceção dentro da sincronização não trava a aula, mas não pode sumir calada: a 202 recebe a mensagem curta,
// uma vez por mensagem.
function avisarErro(err) {
  try {
    const mensagem = String((err && err.message) || err).split('\n')[0].slice(0, 160);
    const e = estadoLib.carregar();
    if (avisoUnico(e, `erro:${mensagem}`, { cli_version: null, motivo: 'erro', mensagem })) estadoLib.salvar(e);
  } catch { /* nem o aviso saiu: segue */ }
}

// Onde a conversa foi aberta: 'sala', 'fora', ou null quando ela não diz pasta nenhuma (a primeira linha ilegível, o
// campo com outro nome numa versão nova). Desconhecido não é fora: recusar ali mandaria embora o aluno que está na
// pasta certa. Ele sincroniza, e o alarme de formato avisa a 202.
function pasta(arquivo) {
  const meta = rollout.meta(arquivo);
  const naSala = (p) => rollout.mesmaPasta(p, paths.RAIZ);
  if (meta && naSala(meta.cwd)) return 'sala';
  const cwds = rollout.ler(arquivo).cwds;
  if (cwds.some(naSala)) return 'sala';
  return cwds.length || (meta && meta.cwd) ? 'fora' : null;
}

module.exports = { idTurno, idInicio, comTrava, sincronizar, pasta, avisarErro, TRAVA };
