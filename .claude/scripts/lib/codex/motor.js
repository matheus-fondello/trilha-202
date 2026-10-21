'use strict';
// O motor do Codex para o avaliador (branch codex, T6): o `codex exec` no lugar do `claude -p`, para o aluno que só
// tem o Codex. Devolve o mesmo contrato do `chamar` do Claude (lib/avaliador.js), com `motor: 'codex'` e
// `uso.motor = 'codex'`, e quem chama não precisa saber qual dos dois respondeu.
//
// A chamada (T0.12): `codex exec --ephemeral --ignore-user-config --skip-git-repo-check -s read-only -m <modelo>
// --output-schema <esquema> -o <arquivo> --json -`, a partir de uma pasta vazia e com o prompt pelo stdin, que fecha.
//   - `--ignore-user-config`: sem ele o `codex exec` carrega o config e os hooks da sala (e todo shell do avaliador é
//     recusado, que é o que se quer de quem só lê);
//   - `--ephemeral`: a conversa do avaliador não vai para ~/.codex/sessions, onde a sala procura as conversas da aula;
//   - `-m` explícito, da lista do config da sala: o config.toml do aluno pode apontar para um modelo fora do plano dele;
//   - o esforço fixo em `medium`, como o `--effort medium` do `claude -p`: sem isso o tempo e a nota variariam com a
//     configuração de cada máquina.
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const paths = require('../paths');

const ESQUEMAS = path.join(paths.RAIZ, '.claude', 'avaliador', 'esquemas');
const ESFORCO = 'model_reasoning_effort="medium"';
const MODELOS_PADRAO = ['gpt-6-luna'];
// O avaliador só lê o prompt e responde: sem ferramenta nenhuma, como o `claude -p --disallowed-tools`. O read-only do
// sandbox não basta: ele deixa o modelo ler o disco inteiro, e uma instrução plantada no produto da oficina poderia
// fazê-lo ler ~/.ssh ou um .env e pôr o conteúdo na justificativa, que sobe ao CRM. Sem o shell (nem o exec unificado e
// o modo de código, que o rodariam por outro caminho), sem imagem, web, aplicativos, plugins, navegador e subagentes.
// Medido em 20/10 com o Codex 0.157 e o gpt-6-luna: pedido para ler um arquivo do disco, o modelo tentou, a chamada
// voltou recusada e nenhuma ferramenta rodou. O apply_patch não tem chave que o desligue (vem do modelo), mas só
// escreve, e o read-only não deixa. Por `-c features.<nome>` e não `--disable`: um nome que uma versão do Codex não
// conhece é aviso no `-c` e erro no `--disable`.
const SEM_FERRAMENTAS = ['web_search="disabled"', ...['shell_tool', 'unified_exec', 'code_mode_host', 'view_image', 'apps', 'plugins', 'multi_agent',
  'browser_use', 'browser_use_external', 'computer_use', 'image_generation', 'tool_suggest', 'skill_search', 'goals'].map((f) => `features.${f}=false`)];

// Os padrões do que o Codex responde. O limite vem com apóstrofo reto ou tipográfico ("You’ve hit your usage limit"),
// e o padrão não depende dele.
const LIMITE = /hit your usage limit|usage_limit_exceeded/i;
const LOGIN = /\b401\b|unauthori[sz]ed|refresh token|Not logged in|sign in again/i;
const MODELO_RECUSADO = /model is not supported|not supported when using Codex/i;
// Só o erro de conexão é sandbox de rede (um perfil que libera o CRM e não a API). Sobrecarga e 5xx são API fora do ar.
const CONEXAO = /\b(ENOTFOUND|ECONNREFUSED)\b|connect EACCES|fetch failed|127\.0\.0\.1:9\b|connection refused|os error (10061|10013|11001)/i;
const BLOQUEIO = /\b(EPERM|EACCES)\b|operation not permitted/i;
const PASSAGEIRO = /overloaded|internal server error|service unavailable|bad gateway|gateway timeout|\b(500|502|503|504|529)\b|ECONNRESET|ETIMEDOUT|stream (error|disconnected)/i;
// O Codex antigo demais para a chamada do avaliador: o `-c web_search="disabled"` e os `-c features.<nome>=false` são
// de versões recentes, e uma versão de antes recusa o valor (`invalid type`, `unknown variant`) ou a chave
// (`unknown field`) ao ler a configuração, antes de qualquer modelo. Não é falha do avaliador nem do aluno: é o
// aplicativo para atualizar. Só a forma em que o erro de configuração escreve a chave, entre aspas ou crases
// (`web_search`, `features.code_mode_host`), perto da recusa: um "features" solto numa mensagem que cita a fala do
// agente não é a configuração (revisão de 20/10).
const CONFIG_ANTIGA = /[`"'](?:web_search|features\.[a-z_]+)[`"'][\s\S]{0,120}?(?:invalid type|unknown variant|unknown field)|(?:invalid type|unknown variant|unknown field)[\s\S]{0,120}?[`"'](?:web_search|features\.[a-z_]+)[`"']/i;
const NAO_ACHOU = /n.{1,3}o .{1,3} reconhecido como um comando|is not recognized as an internal or external command|command not found|No such file or directory/i;
// O aviso de "PATH aliases" do `login status` pode trazer um "No such file or directory" do próprio Codex: com a palavra
// login na saída, quem respondeu foi o Codex, e ele existe.
const naoAchou = (t) => NAO_ACHOU.test(t) && !/logged in|login/i.test(t);

// Onde o Codex pode estar, na ordem. Os de fora do PATH são procurados só quando os de antes faltam (é um gerador):
// o último, no Windows, consulta o registro.
function* candidatos() {
  if (process.platform === 'win32') { yield { bin: 'codex.exe', shell: false }; yield { bin: 'codex.cmd', shell: true }; }
  else yield { bin: 'codex', shell: false };
  // A suíte de testes desliga a procura fora do PATH: senão ela acharia o Codex de verdade da máquina de quem testa.
  if (process.env.TRILHA_202_CODEX_SO_PATH === '1') return;
  const existe = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
  const listar = (d) => { try { return fs.readdirSync(d, { withFileTypes: true }); } catch { return []; } };
  const casa = os.homedir();
  if (process.platform === 'win32') {
    // O do npm.
    if (process.env.APPDATA) { const p = path.join(process.env.APPDATA, 'npm', 'codex.cmd'); if (existe(p)) yield { bin: p, shell: true }; }
    // O instalador próprio, numa pasta com nome de hash por versão: o mais novo primeiro.
    if (process.env.LOCALAPPDATA) {
      const base = path.join(process.env.LOCALAPPDATA, 'OpenAI', 'Codex', 'bin');
      const achados = listar(base).filter((d) => d.isDirectory()).map((d) => path.join(base, d.name, 'codex.exe')).filter(existe)
        .map((p) => ({ p, t: fs.statSync(p).mtimeMs })).sort((a, b) => b.t - a.t);
      for (const { p } of achados) yield { bin: p, shell: false };
    }
    // O do aplicativo do ChatGPT (o pacote OpenAI.Codex), fora do PATH. A pasta WindowsApps não se lista sem ser
    // administrador (EPERM, medido em 19/10); o nome completo do pacote sai do registro do usuário, e o arquivo, com o
    // nome em mãos, abre. Da versão mais nova para a mais velha.
    for (const p of doAplicativoWindows()) if (existe(p)) yield { bin: p, shell: false };
  } else {
    // No Mac e no Linux, os lugares em que os instaladores o deixam. O aplicativo do Mac não foi medido (T0).
    for (const p of [path.join(casa, '.local', 'bin', 'codex'), '/opt/homebrew/bin/codex', '/usr/local/bin/codex', path.join(casa, '.npm-global', 'bin', 'codex'),
      '/Applications/ChatGPT.app/Contents/Resources/codex', '/Applications/Codex.app/Contents/Resources/codex']) {
      if (existe(p)) yield { bin: p, shell: false };
    }
  }
}

const versao = (nome) => ((nome.match(/_(\d+(?:\.\d+)*)_/) || [])[1] || '0').split('.').map(Number);
const maisNova = (a, b) => { const x = versao(a), y = versao(b); for (let i = 0; i < Math.max(x.length, y.length); i++) { if ((x[i] || 0) !== (y[i] || 0)) return (y[i] || 0) - (x[i] || 0); } return 0; };
function doAplicativoWindows() {
  const base = path.join(process.env.ProgramW6432 || process.env.ProgramFiles || 'C:\\Program Files', 'WindowsApps');
  let nomes = [];
  try { nomes = fs.readdirSync(base).filter((n) => /^OpenAI\.Codex_/i.test(n)); } catch { /* sem permissão de listar: o registro */ }
  if (!nomes.length) {
    const reg = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'reg.exe');
    const chave = 'HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppModel\\Repository\\Packages';
    const r = spawnSync(reg, ['query', chave, '/f', 'OpenAI.Codex_', '/k'], { encoding: 'utf8', timeout: 3000, windowsHide: true });
    nomes = String(r.stdout || '').split(/\r?\n/).map((l) => (l.match(/\\(OpenAI\.Codex_[^\\\s]+)\s*$/i) || [])[1]).filter(Boolean);
  }
  return [...new Set(nomes)].sort(maisNova).map((n) => path.join(base, n, 'app', 'resources', 'codex.exe'));
}

// Com shell (o .cmd), o argumento com espaço precisa de aspas.
function rodar({ bin, shell }, args, opcoes) {
  const exe = shell && /\s/.test(bin) ? `"${bin}"` : bin;
  const a = shell ? args.map((x) => (/\s/.test(x) && !/^".*"$/.test(x) ? `"${x}"` : x)) : args;
  return spawnSync(exe, a, { encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024, ...opcoes, shell });
}

// O primeiro Codex que existe, pelo `codex login status`. Ele escreve só no stderr, às vezes depois de um aviso de
// "PATH aliases": a decisão é pelo código de saída (1 é sem login), não pela primeira linha. O 0 não garante que o
// login vale; a chamada de verdade diz.
// O achado fica guardado no processo, como as sondas: as tentativas do avaliador não repetem o `codex login status`
// nem a consulta ao registro. `undefined` é "ainda não procurou".
let achadoGuardado;
function achar() {
  if (achadoGuardado === undefined) achadoGuardado = procurar();
  return achadoGuardado;
}
// O executável que não abre com as sondas limpas (o codex.exe de WindowsApps, que só roda de dentro do pacote do
// aplicativo) não é o sandbox: aprovar o comando fora dele não muda nada, e o pedido se repetiria a cada chat. Ele fica
// de fora como se não existisse, e a procura segue para o candidato seguinte; o último que não abriu vai no motivo.
const pulados = new Set();
let bloqueado = null;
const naoAbre = (r) => Boolean(r.error && BLOQUEIO.test(`${r.error.code || ''} ${r.error.message || ''}`));
function pular(c) {
  pulados.add(c.bin);
  bloqueado = c.bin;
  achadoGuardado = undefined;
}
function procurar() {
  for (const c of candidatos()) {
    if (pulados.has(c.bin)) continue;
    const r = rodar(c, ['login', 'status'], { timeout: 15000, cwd: os.tmpdir() });
    if (r.error && r.error.code === 'ENOENT') continue;
    if (naoAbre(r) && require('./sondas').verificar().ok) { pular(c); continue; }
    if (c.shell && !r.error && r.status !== 0 && !String(r.stdout || '').trim() && naoAchou(String(r.stderr || ''))) continue;
    if (c.shell && r.error && /^(EOF|EPIPE)$/.test(r.error.code || '') && naoAchou(String(r.stderr || ''))) continue;
    return { c, status: r };
  }
  return null;
}

function modelos() {
  try {
    const cfg = JSON.parse(fs.readFileSync(paths.CONFIG, 'utf8')) || {};
    const lista = ((cfg.codex || {}).modelos || []).filter((m) => typeof m === 'string' && m.trim());
    return lista.length ? lista : MODELOS_PADRAO;
  } catch { return MODELOS_PADRAO; }
}

// O esquema do chamador. O da correção tem os critérios da prática, que só se sabem na hora.
// O da aula (21/10): `esforco` e `autonomia` aceitam `null` só na aula sem tarefa observável, como a validação. Com o
// `null` aberto em toda aula, o Codex o mandou nas três tentativas de uma 1.4 ("só conversa na sala", e a fluência é a
// tarefa), a validação recusou as três, e a avaliação ficou pendente sem ter como sair.
function esquemaDe(nome, criterios, { semTarefa = false } = {}) {
  const e = JSON.parse(fs.readFileSync(path.join(ESQUEMAS, `${nome}.json`), 'utf8'));
  if (nome === 'correcao' && Array.isArray(criterios)) {
    e.properties.criterios.properties = Object.fromEntries(criterios.map((k) => [k, { type: 'integer' }]));
    e.properties.criterios.required = [...criterios];
  }
  if (nome === 'aula' && !semTarefa) {
    for (const k of ['esforco', 'autonomia']) e.properties.criterios.properties[k] = { type: 'integer' };
  }
  return e;
}

// As mensagens dos eventos de erro do `--json` (`error`, `turn.failed`), e nada mais do stdout.
function errosDoJson(stdout) {
  const msgs = [];
  for (const l of String(stdout || '').replace(/^﻿/, '').split(/\r?\n/)) {
    const t = l.trim();
    if (!t.startsWith('{')) continue;
    try {
      const j = JSON.parse(t);
      if (!j || typeof j !== 'object') continue;
      if (j.type === 'error' && j.message) msgs.push(String(j.message));
      if (j.type === 'turn.failed') msgs.push(String((j.error && j.error.message) || j.message || 'turn.failed'));
    } catch { /* linha que não é JSON fica de fora */ }
  }
  return msgs.join('\n');
}

// O uso, da última linha `turn.completed` do `--json`.
function usoDe(stdout, modelo, ms) {
  let u = {};
  for (const l of String(stdout || '').replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const t = l.trim();
    if (!t.startsWith('{')) continue;
    try { const j = JSON.parse(t); if (j && j.type === 'turn.completed' && j.usage) u = j.usage; } catch { /* segue */ }
  }
  return {
    modelo, motor: 'codex',
    entrada: u.input_tokens || 0, cache_leitura: u.cached_input_tokens || 0, cache_escrita: u.cache_write_input_tokens || 0,
    saida: u.output_tokens || 0, custo_usd: null, ms,
  };
}

// O stderr do Codex sobe no motivo, e pode trazer o token do aluno (um comando do tutor ecoado no erro). Sai antes do
// corte, para um token partido ao meio não escapar da troca.
function curto(t) {
  const { semToken } = require('../transcricao');
  const { semTokenJson } = require('./transcricao');
  const acesso = require('../acesso');
  let s = semTokenJson(semToken(String(t || '').replace(/^\uFEFF/, '')));
  const tk = acesso.token();
  if (tk && acesso.tokenValido(tk)) s = s.split(tk).join('[token omitido]');
  return s.trim().slice(-200);
}

function chamar(prompt, timeoutMs, { esquema = 'aula', criterios, semTarefa = false } = {}) {
  const achado = achar();
  if (!achado) {
    if (bloqueado) return { ok: false, ausente: true, motor: 'codex', bloqueado, motivo: `não encontrei o Codex da linha de comando nesta máquina (o de ${bloqueado} não abre fora do aplicativo)` };
    return { ok: false, ausente: true, motor: 'codex', motivo: 'não encontrei o Codex da linha de comando nesta máquina' };
  }
  const { c } = achado;
  const executavel = path.isAbsolute(c.bin) ? c.bin : null;
  const st = achado.status;
  const saidaLogin = `${st.stderr || ''} ${st.stdout || ''}`;
  if (st.error && BLOQUEIO.test(`${st.error.code || ''} ${st.error.message || ''}`)) return { ok: false, sandbox: 'processo', motor: 'codex', executavel, motivo: `o sandbox do Codex não deixou abrir o Codex que avalia (${st.error.code})` };
  if (!st.error && st.status === 1) return { ok: false, login: true, motor: 'codex', executavel, motivo: `o Codex desta máquina está sem login (${curto(saidaLogin) || 'codex login status'})` };

  let pasta;
  try { pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'trilha-202-avaliador-')); } catch (err) {
    return { ok: false, ...(BLOQUEIO.test(err.code || '') ? { sandbox: 'pessoal' } : {}), motor: 'codex', motivo: `não consegui preparar a pasta do avaliador (${err.code || err.message})` };
  }
  const arqEsquema = path.join(pasta, 'esquema.json');
  const arqSaida = path.join(pasta, 'saida.json');
  const vazia = path.join(pasta, 'vazia');
  try {
    fs.mkdirSync(vazia);
    fs.writeFileSync(arqEsquema, JSON.stringify(esquemaDe(esquema, criterios, { semTarefa })));
    const prazo = Date.now() + timeoutMs;
    let ultimo = null;
    for (const modelo of modelos()) {
      const resta = prazo - Date.now();
      if (resta < 1000) break;
      try { fs.unlinkSync(arqSaida); } catch { /* ainda não existe */ }
      const inicio = Date.now();
      const r = rodar(c, ['exec', '--ephemeral', '--ignore-user-config', '--skip-git-repo-check', '-s', 'read-only', '-m', modelo,
        '-c', ESFORCO, ...SEM_FERRAMENTAS.flatMap((x) => ['-c', x]), '--output-schema', arqEsquema, '-o', arqSaida, '--json', '-'], { input: prompt, timeout: resta, cwd: vazia });
      const ms = Date.now() - inicio;
      // O estouro tem o mesmo texto do Claude: é por ele que o resumo reconhece a avaliação lenta e põe o `--longo`.
      if ((r.error && r.error.code === 'ETIMEDOUT') || r.signal) return { ok: false, limite: true, motor: 'codex', motivo: `o avaliador passou de ${Math.round(timeoutMs / 1000)} segundos e foi interrompido (API lenta ou fora do ar)` };
      if (r.error) {
        // O `login status` abriu e o `exec` não: o mesmo executável que não abre fora do pacote. Vale o seguinte, com o
        // que resta do prazo (o `finally` apaga esta pasta depois que ele responder).
        if (naoAbre(r) && require('./sondas').verificar().ok) {
          pular(c);
          return chamar(prompt, Math.max(0, prazo - Date.now()), { esquema, criterios });
        }
        if (BLOQUEIO.test(`${r.error.code || ''} ${r.error.message || ''}`)) return { ok: false, sandbox: 'processo', motor: 'codex', executavel, motivo: `o sandbox do Codex não deixou abrir o Codex que avalia (${r.error.code})` };
        return { ok: false, motor: 'codex', motivo: `o avaliador não rodou (${r.error.message})` };
      }
      let texto = null;
      try { texto = fs.readFileSync(arqSaida, 'utf8').replace(/^\uFEFF/, ''); } catch { /* sem saída */ }
      if (r.status === 0 && texto && texto.trim()) return { ok: true, motor: 'codex', texto, uso: usoDe(r.stdout, modelo, ms) };
      // A classificação lê só o stderr e os eventos de erro do `--json`. O resto do stdout traz a fala do aluno (que pode
      // citar um "EACCES" ou um "fetch failed") e os números de tokens (um "output_tokens":401 não é login).
      const tudo = `${errosDoJson(r.stdout)}\n${r.stderr || ''}`;
      if (CONFIG_ANTIGA.test(tudo)) return { ok: false, motor: 'codex', executavel, motivo: `o Codex instalado é antigo para o avaliador; atualize o aplicativo do ChatGPT (${curto(tudo).slice(-120)})` };
      if (MODELO_RECUSADO.test(tudo)) { ultimo = `o modelo ${modelo} não é aceito por esta conta`; continue; }
      if (LIMITE.test(tudo)) return { ok: false, limite: true, motor: 'codex', motivo: `limite de uso da conta (${curto(tudo).slice(-120)})` };
      if (CONEXAO.test(tudo)) return { ok: false, sandbox: 'rede', motor: 'codex', motivo: `o sandbox do Codex não deixou o avaliador falar com a internet (${curto(tudo).slice(-120)})` };
      if (LOGIN.test(tudo)) return { ok: false, login: true, motor: 'codex', executavel, motivo: `o Codex desta máquina está sem login válido (${curto(tudo).slice(-120)})` };
      if (BLOQUEIO.test(tudo)) return { ok: false, sandbox: 'processo', motor: 'codex', executavel, motivo: `o sandbox do Codex não deixou o avaliador rodar (${curto(tudo).slice(-120)})` };
      if (PASSAGEIRO.test(tudo)) return { ok: false, limite: true, motor: 'codex', motivo: `a API do Codex não respondeu agora (${curto(tudo).slice(-120)})` };
      return { ok: false, motor: 'codex', motivo: `o avaliador falhou: ${curto(tudo) || 'sem saída'}` };
    }
    return { ok: false, motor: 'codex', motivo: ultimo || 'o avaliador do Codex não teve tempo de rodar' };
  } finally {
    try { fs.rmSync(pasta, { recursive: true, force: true }); } catch { /* fica no temporário */ }
  }
}

// O que o Claude omite quando não se aplica, por chamador. O esquema estrito obriga o Codex a mandar toda chave, com
// `null` no que não se aplica; aqui sai o `null` que o Claude não manda, e fica o que ele manda `null`. Hoje as três
// formas (régua da aula, correção e aberta do quiz) pedem toda chave, inclusive as `null` (`fluencia`, `suspeita`,
// `destaque`, o `esforco` e a `autonomia` de aula sem tarefa), então a lista está vazia; ela existe para a forma do
// Codex seguir a do Claude quando uma régua passar a deixar uma chave de fora.
const OMITIDAS = { aula: [], correcao: [], aberta: [] };
function formaDoClaude(json, chamador) {
  if (!json || typeof json !== 'object') return json;
  for (const caminho of OMITIDAS[chamador] || []) {
    const partes = caminho.split('.');
    let alvo = json;
    for (const p of partes.slice(0, -1)) alvo = alvo && typeof alvo === 'object' ? alvo[p] : null;
    const ultima = partes[partes.length - 1];
    if (alvo && typeof alvo === 'object' && alvo[ultima] === null) delete alvo[ultima];
  }
  return json;
}

// A resposta do Codex com o token da 202 do aluno é recusada. O avaliador lê a transcrição, e um token colado pelo
// aluno pode voltar como evidência e subir ao CRM; no Claude a transcrição já sai sem ele, mas o Codex é outro motor.
// Só com um token válido em mãos: sem token, não há o que procurar.
function vazaToken(json) {
  const acesso = require('../acesso');
  const t = acesso.token();
  if (!t || !acesso.tokenValido(t)) return [];
  const achou = [];
  const visitar = (v) => {
    if (typeof v === 'string') { if (v.includes(t)) achou.push(true); }
    else if (Array.isArray(v)) v.forEach(visitar);
    else if (v && typeof v === 'object') Object.values(v).forEach(visitar);
  };
  visitar(json);
  return achou.length ? ['a resposta traz o token de acesso do aluno; tire-o de todo campo'] : [];
}
// O token sai de todo campo antes da validação: as mensagens dela citam trechos da resposta, e o motivo de uma
// avaliação recusada sobe para a 202. A recusa (`vazaToken`) continua sendo a causa.
function tirarToken(json) {
  const acesso = require('../acesso');
  const t = acesso.token();
  if (!t || !acesso.tokenValido(t) || !json || typeof json !== 'object') return json;
  const trocar = (v) => {
    if (typeof v === 'string') return v.split(t).join('[token]');
    if (Array.isArray(v)) return v.map(trocar);
    if (v && typeof v === 'object') { for (const k of Object.keys(v)) v[k] = trocar(v[k]); return v; }
    return v;
  };
  return trocar(json);
}

module.exports = { chamar, candidatos, formaDoClaude, vazaToken, tirarToken, esquemaDe, ESQUEMAS, OMITIDAS };
