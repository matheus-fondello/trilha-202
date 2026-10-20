'use strict';
// A conferência da prática pelo `checar` (branch codex, T5b). No sandbox do Codex, o que o tutor roda na conferência
// falha por razões que não são do aluno: o `curl` esbarra no schannel no `elevated` e no EACCES do localhost no `mxc`, o
// `git -C` dá "Permission denied" no `mxc` e "dubious ownership" no `elevated`, e o `npm test` numa pasta fora do espaço
// de trabalho não roda (T0, codex/MODOS-SANDBOX.md). O tutor registrava a falha como fato, e o corretor dava nota 1 a
// um site que está no ar. Aqui o harness mede:
//   - `url`: o `fetch` do Node na URL registrada, que não passa pelo schannel;
//   - `testes`: o `npm test` (ou outro script do package.json) com `cwd` na pasta registrada, nunca com `git -C`;
//   - `git`: o histórico, o status, o que está versionado, o remoto e o `ls-remote` do repositório registrado, com `cwd`
//     na pasta e `safe.directory`;
//   - `credenciais`: a busca de chave e credencial das réguas, com os padrões delas, só nomes e contagens;
//   - `http`: um pedido à URL registrada ou ao localhost, a mesma cerca da guarda do Claude, com os cabeçalhos do `-H`.
// O resultado fica no estado (`praticas[P].checagens`) e vai ao corretor como fato medido; o `corrigir` lê esse registro,
// não o que o tutor transcreveu.
//
// O `checar testes` roda o código do aluno e o das dependências dele, então nunca é pré-aprovado: quando o lançador
// existir, ele fica fora da regra e pede aprovação, como a permissão do Claude Code pede no Claude.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const paths = require('./paths');
const { semToken } = require('./transcricao');
const { semTokenJson } = require('./codex/transcricao');

const POR_CHECK = 2000;
// O git leva o `ls-files` (até 200 nomes, como a régua pede) e o resto: o teto é maior.
const POR_CHECK_GIT = 8000;
const MOSTRAR = 20000;
const MAX_CHECAGENS = 30;
const TIMEOUT_REDE_MS = 15000;
// Uma suíte de testes de projeto pequeno roda em segundos; três minutos dão folga a uma máquina lenta sem prender o
// chat num teste que ficou esperando.
const TIMEOUT_TESTES_MS = 180000;
const METODOS = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

const USO = 'checar <pratica> url | testes [script=<nome>] | git | credenciais | http <METODO> <url> [arquivo=trilha/tmp/<corpo>] [tipo=<content-type>] [cabecalho=Nome:valor ...]';

// O erro que vem do sandbox, e não do que o aluno entregou. A lista é a que o `corrigir` usa para recusar uma
// conferência (codex/MODOS-SANDBOX.md). O `curl: (6)` é como o próprio curl escreve o código de saída 6. O nome de cada
// padrão é o que sobe para a 202 na recusa, nunca o texto que casou.
const ERROS_DE_SANDBOX = [
  ['EPERM', /\bEPERM\b/], ['operation not permitted', /operation not permitted/i], ['Could not resolve host', /Could not resolve host/i],
  ['ENOTFOUND', /\bENOTFOUND\b/], ['ECONNREFUSED', /\bECONNREFUSED\b/], ['EACCES', /\bEACCES\b/],
  ['exit', /\bexit(?:ed)?(?:\s+with)?(?:\s+code)?[\s:=]*(6|7|35)\b/i], ['exit', /\bcurl: \((6|7|35)\)/i],
  ['SEC_E_', /\bSEC_E_\w*/], ['schannel', /schannel/i], ['dubious ownership', /dubious ownership/i],
  ['Permission denied', /Permission denied/i], ['cannot change to', /cannot change to/i],
];
function erroDeSandbox(texto) {
  for (const [nome, re] of ERROS_DE_SANDBOX) {
    const m = String(texto || '').match(re);
    if (m) return nome === 'exit' ? `exit ${m[1]}` : nome;
  }
  return null;
}

// O que um check grava não leva o token da 202 nem segredo do aluno: a saída de um teste ou de um pedido pode ecoar o
// `.env` (uma chave da API, a senha do banco numa URL), e o que fica aqui vai ao corretor e pode voltar como evidência.
function semSegredo(t) {
  return semTokenJson(semToken(String(t)))
    // A variável de ambiente que termina num nome de segredo, na forma do `.env`. Só maiúsculas e terminada nele: a
    // contagem de tokens que o log da P3 imprime (`input_tokens: 25322`) é o que o corretor precisa ler.
    // Qualquer `*_KEY=` também (a SUPABASE_SERVICE_ROLE_KEY, a STRIPE_WEBHOOK_KEY).
    .replace(/\b([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PASSWD|SENHA|APIKEY|_KEY)\s*=\s*)("[^"\n]*"|'[^'\n]*'|\S+)/g, '$1[omitido]')
    .replace(/\b([a-z][a-z0-9+.-]*:\/\/)[^\s:@/]+:[^\s@/]+@/gi, '$1[omitido]@')
    // Um JWT solto: a chave anônima e a de serviço do Supabase têm essa forma, e uma sessão também.
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[jwt omitido]')
    .replace(/\b(?:sk|rk|rkcs)_(?:live|test)_[A-Za-z0-9]{8,}|\bwhsec_[A-Za-z0-9]{8,}|\bsk-[A-Za-z0-9_-]{16,}|\bAIza[0-9A-Za-z_-]{20,}|\bgsk_[A-Za-z0-9]{16,}/g, '[chave omitida]');
}
// O que o tutor lê além do registro (o HTML, a resposta do `http`): o mesmo filtro, com um teto maior.
function paraMostrar(t) {
  const s = semSegredo(String(t || ''));
  return s.length > MOSTRAR ? `${s.slice(0, MOSTRAR)}\n[...cortado: ${s.length} caracteres no total...]` : s;
}

// As primeiras linhas, até o teto.
function primeiras(t, max = POR_CHECK) {
  const s = semSegredo(String(t || '')).replace(/\r\n/g, '\n').trim();
  if (s.length <= max) return s;
  const corte = s.lastIndexOf('\n', max);
  return s.slice(0, corte > max / 2 ? corte : max) + `\n[...cortado: ${s.length} caracteres no total...]`;
}

// A cerca da guarda do Claude (`conferirRede`, em .claude/hooks/guarda.js): a entrega registrada e localhost, com o
// host comparado sem o `www.`. A função não se importa de lá porque a guarda roda e encerra o processo ao ser
// carregada, e mexer nela é mexer no hook do Claude. Aqui a cerca é a da prática conferida, não a de qualquer prática.
const semWww = (h) => String(h || '').toLowerCase().replace(/^www\./, '');
const hostLocal = (h) => h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1';
function permitida(url, p) {
  let u;
  try { u = new URL(url); } catch { return false; }
  if (!/^https?:$/.test(u.protocol)) return false;
  const h = semWww(u.hostname);
  if (hostLocal(h)) return true;
  try { return semWww(new URL(p.url).hostname) === h; } catch { return false; }
}
const local = (url) => { try { return hostLocal(semWww(new URL(url).hostname)); } catch { return false; } };

// O erro do próprio harness ao medir que é o sandbox: o programa que não abre, a rede recusada, o git barrado. Com as
// sondas limpas, uma conexão recusada no localhost é fato (o servidor do aluno não está de pé), e um host que não
// existe também (a URL registrada está errada); o proxy morto do sandbox (127.0.0.1:9) não.
function doSandbox(texto) {
  const t = String(texto || '');
  if (/\b(EPERM|EACCES)\b|operation not permitted|127\.0\.0\.1:9\b/i.test(t)) return true;
  return Boolean(process.env.CODEX_SANDBOX_NETWORK_DISABLED) && /\b(ENOTFOUND|EAI_AGAIN)\b/.test(t);
}

async function pedir(url, opcoes = {}) {
  if (typeof fetch !== 'function') return { erro: 'esta versão do Node não tem fetch' };
  // Os testes do harness não tocam a rede (lib/entrega.js, o mesmo desligamento).
  if (process.env.TRILHA_202_REDE === 'local' && !local(url)) return { erro: 'rede desligada neste ambiente' };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_REDE_MS);
  try {
    const r = await fetch(url, { ...opcoes, signal: ctrl.signal });
    const texto = opcoes.method === 'HEAD' ? '' : await r.text();
    return { status: r.status, final: r.url, texto, local: r.headers.get('location') };
  } catch (err) {
    if (err.name === 'AbortError') return { erro: `não respondeu em ${TIMEOUT_REDE_MS / 1000}s` };
    const c = err.cause || {};
    return { erro: [c.code, c.message || err.message].filter(Boolean).join(' ') };
  } finally {
    clearTimeout(t);
  }
}

const pendencia = (motivo) => ({ pendente: { causa: 'sandbox', motivo } });
const MOTIVO_REDE = 'o sandbox do Codex não deixou este comando falar com a rede';
const MOTIVO_PROCESSO = 'o sandbox do Codex não deixou este comando abrir o programa do check';

async function url(p) {
  if (!p.url) return { recusa: 'esta prática não registrou URL: não há página para checar. Confira a pasta com `testes` e `git`.' };
  const r = await pedir(p.url, { redirect: 'follow' });
  if (r.erro && doSandbox(r.erro)) return pendencia(`${MOTIVO_REDE} (${r.erro})`);
  const comando = `GET ${p.url}`;
  if (r.erro) return { registro: { check: 'url', comando, url: p.url, codigo: null, saida: primeiras(`a página não respondeu: ${r.erro}`) }, mostrar: '' };
  const titulo = ((r.texto.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '').replace(/\s+/g, ' ').trim();
  const bytes = Buffer.byteLength(r.texto, 'utf8');
  const resumo = `HTTP ${r.status} · título: ${titulo ? `"${titulo}"` : '(sem <title>)'} · ${bytes} bytes${r.final && r.final !== p.url ? ` · endereço final: ${r.final}` : ''}`;
  return {
    registro: { check: 'url', comando, url: p.url, codigo: r.status, saida: primeiras(`${resumo}\n${r.texto}`) },
    mostrar: paraMostrar(r.texto),
  };
}

function lerPacote(pasta) {
  try { return JSON.parse(fs.readFileSync(path.join(pasta, 'package.json'), 'utf8')) || {}; } catch (err) {
    if (err.code === 'EPERM' || err.code === 'EACCES') return { bloqueado: err.code };
    return err.code === 'ENOENT' ? null : { torto: err.message };
  }
}

// O npm é um `.cmd` no Windows, e o Node só o abre por um shell. O nome do script vem do package.json (conferido
// antes), nunca de texto livre, então o shell não recebe nada que o aluno ou uma página tenham escrito.
function npm(argsNpm, pasta) {
  const env = { ...process.env, CI: '1' };
  delete env.TRILHA_202_TOKEN;
  const opcoes = { cwd: pasta, encoding: 'utf8', timeout: TIMEOUT_TESTES_MS, windowsHide: true, env, maxBuffer: 16 * 1024 * 1024 };
  return process.platform === 'win32'
    ? spawnSync(`npm ${argsNpm.join(' ')}`, { ...opcoes, shell: true })
    : spawnSync('npm', argsNpm, opcoes);
}

function testes(p, kv) {
  const pasta = p.pasta;
  const pacote = lerPacote(pasta);
  if (pacote && pacote.bloqueado) return pendencia(`o sandbox do Codex não deixou este comando ler a pasta da prática (${pacote.bloqueado})`);
  const scripts = (pacote && pacote.scripts) || {};
  const nome = kv.script || 'test';
  if (kv.script && (!/^[\w:.-]+$/.test(nome) || !Object.prototype.hasOwnProperty.call(scripts, nome))) {
    return { recusa: `o package.json da prática não tem o script \`${nome}\`. Os que existem: ${Object.keys(scripts).join(', ') || '(nenhum)'}.` };
  }
  const comando = nome === 'test' ? 'npm test' : `npm run ${nome}`;
  const fato = (saida) => ({ registro: { check: 'testes', comando, pasta, codigo: null, saida: primeiras(saida) }, mostrar: '' });
  if (!pacote) return fato('a pasta não tem package.json: não há script de teste para rodar');
  if (pacote.torto) return fato(`o package.json da pasta não é JSON válido (${pacote.torto})`);
  if (!Object.prototype.hasOwnProperty.call(scripts, 'test') && nome === 'test') return fato(`o package.json não tem o script \`test\`. Os que existem: ${Object.keys(scripts).join(', ') || '(nenhum)'}`);
  const r = npm(nome === 'test' ? ['test'] : ['run', nome], pasta);
  if (r.error && doSandbox(`${r.error.code || ''} ${r.error.message || ''}`)) return pendencia(`${MOTIVO_PROCESSO} (${r.error.code})`);
  const saida = `${r.stdout || ''}${r.stderr ? `\n${r.stderr}` : ''}`;
  if (r.error && r.error.code === 'ETIMEDOUT') return fato(`não terminou em ${TIMEOUT_TESTES_MS / 1000}s\n${saida}`);
  if (r.error) return fato(`não rodou: ${r.error.message}`);
  return { registro: { check: 'testes', comando, pasta, codigo: r.status, saida: primeiras(saida || '(sem saída)') }, mostrar: '' };
}

// O git do `checar`: com `cwd` na pasta, nunca `-C` (o "Permission denied" do `mxc`); `safe.directory` (o "dubious
// ownership" do `elevated`); e sem fsmonitor, que um repositório do aluno pode configurar para rodar um programa a cada
// comando do git.
const GIT_BASE = ['-c', 'safe.directory=*', '-c', 'core.fsmonitor=false'];
function rodarGit(args, pasta, extra = {}) {
  return spawnSync('git', [...GIT_BASE, ...args], { cwd: pasta, encoding: 'utf8', timeout: 10000, windowsHide: true, maxBuffer: 64 * 1024 * 1024, ...extra });
}
// A chamada ao git que o sandbox barrou: o programa que não abre, ou o git que não lê a pasta.
function gitNoSandbox(r) {
  if (r.error && doSandbox(`${r.error.code || ''} ${r.error.message || ''}`)) return `${MOTIVO_PROCESSO} (${r.error.code})`;
  if (/Permission denied|cannot change to|dubious ownership|operation not permitted/i.test(String(r.stderr || ''))) {
    return `o sandbox do Codex não deixou o git ler a pasta da prática (${String(r.stderr).trim().split('\n')[0]})`;
  }
  return null;
}
// Sem `.git` na própria pasta, o git subiria até um repositório acima dela e mostraria o histórico de outra coisa.
function temGit(pasta) {
  try { fs.statSync(path.join(pasta, '.git')); return true; } catch (err) {
    if (err.code === 'EPERM' || err.code === 'EACCES') return { pendente: err.code };
    return false;
  }
}
const parteGit = (r) => (r.status === 0 ? (r.stdout || '').trim() || '(vazio)' : `(saiu com ${r.status}: ${String(r.stderr || '').trim()})`);
const MAX_LS_FILES = 200;

// O que as réguas da P1 e da P2 mandam rodar no git: o histórico, o status, o que está versionado, o remoto e se o
// repositório registrado responde sem a credencial do aluno.
function git(p, { semRede = false } = {}) {
  const pasta = p.pasta;
  const comando = 'git log + status + ls-files + remoto';
  const fato = (codigo, saida) => ({ registro: { check: 'git', comando, pasta, codigo, saida: primeiras(saida, POR_CHECK_GIT) }, mostrar: '' });
  const g = temGit(pasta);
  if (g && g.pendente) return pendencia(`o sandbox do Codex não deixou este comando ler a pasta da prática (${g.pendente})`);
  if (!g) return fato(null, 'a pasta não é um repositório git (não há .git nela)');
  const log = rodarGit(['log', '--date=iso-strict', '--pretty=format:%h %ad %s', '-n', '30'], pasta);
  const st = rodarGit(['status', '--short', '--branch'], pasta);
  const ls = rodarGit(['ls-files'], pasta);
  const origem = rodarGit(['ls-remote', '--get-url', 'origin'], pasta);
  for (const r of [log, st, ls, origem]) { const m = gitNoSandbox(r); if (m) return pendencia(m); }
  if (log.error && log.error.code === 'ENOENT') return fato(null, 'o git não está instalado nesta máquina');
  const arquivos = ls.status === 0 ? (ls.stdout || '').split('\n').filter(Boolean) : null;
  const versionados = arquivos
    ? `${arquivos.length} arquivo(s)${arquivos.length > MAX_LS_FILES ? `, os ${MAX_LS_FILES} primeiros` : ''}:\n${arquivos.slice(0, MAX_LS_FILES).join('\n') || '(nenhum)'}`
    : parteGit(ls);
  const publico = remotoPublico(p, pasta, semRede);
  if (publico.pendente) return pendencia(publico.pendente);
  return fato(log.status, [
    `git log (até 30 commits, do mais novo):\n${parteGit(log)}`,
    `git status:\n${parteGit(st)}`,
    `git ls-remote --get-url origin:\n${parteGit(origem)}`,
    `o repositório registrado sem a credencial do aluno (git ls-remote ${p.repo || '(não registrado)'}):\n${publico.texto}`,
    `git ls-files: ${versionados}`,
  ].join('\n\n'));
}

// O `ls-remote` do repositório registrado, sem prompt e sem o ajudante de credencial: se ele só responde com a senha
// do aluno, não é público. O endereço é o que o `pratica` aceitou (um https do GitHub), e vai como argumento, sem shell.
function remotoPublico(p, pasta, semRede) {
  if (!p.repo) return { texto: '(a prática não registrou repositório)' };
  if (semRede) return { texto: '(não rodou: esta máquina está sem internet agora)' };
  if (process.env.TRILHA_202_REDE === 'local' && !local(p.repo)) return { texto: '(não rodou: rede desligada neste ambiente)' };
  const env = { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' };
  delete env.TRILHA_202_TOKEN;
  const r = rodarGit(['-c', 'credential.helper=', 'ls-remote', p.repo], pasta, { env, timeout: 20000 });
  const m = gitNoSandbox(r);
  if (m) return { pendente: m };
  // O `elevated` barra o https do git pelo schannel, e o sandbox sem rede não resolve o GitHub.
  const err = String(r.stderr || '');
  if (/schannel|SEC_E_/i.test(err) || (process.env.CODEX_SANDBOX_NETWORK_DISABLED && /Could not resolve host/i.test(err))) {
    return { pendente: `${MOTIVO_REDE} (${err.trim().split('\n')[0]})` };
  }
  if (r.error) return { texto: `(não rodou: ${r.error.code === 'ETIMEDOUT' ? 'não respondeu em 20s' : r.error.message})` };
  if (r.status === 0) {
    const refs = (r.stdout || '').split('\n').filter(Boolean);
    return { texto: `devolveu ${refs.length} referência(s) sem pedir senha:\n${refs.slice(0, 5).join('\n')}` };
  }
  return { texto: `recusou ou pediu senha (saiu com ${r.status}): ${err.trim().split('\n').slice(0, 3).join(' | ')}` };
}

// A busca de credencial que as réguas da P2, da P3 e da P6 mandam fazer, com os padrões delas, fixos aqui: o tutor não
// escreve padrão nenhum. Devolve só nomes de arquivo, commits e contagens, nunca o conteúdo: o material do corretor
// nunca traz o `.env`, e sem esta medida um `.env` versionado passava e a nota de segurança saía alta e errada.
const PADROES_CREDENCIAL = {
  P2: /postgres(?:ql)?:\/\/[^:@/ ]+:[^@/ ]+@|service_role|sk_live_|sk-ant-|AIza[0-9A-Za-z_-]{30,}/,
  P3: /AIza[0-9A-Za-z_-]{30,}|gsk_[0-9A-Za-z]{20,}|sk-ant-/,
  P6: /(?:sk|rk|rkcs)_(?:test|live)_[0-9A-Za-z]{20,}|whsec_[0-9A-Za-z]{20,}|AIza[0-9A-Za-z_-]{30,}|gsk_[0-9A-Za-z]{20,}|sk-ant-/,
};
const PADRAO_GERAL = new RegExp(Object.values(PADROES_CREDENCIAL).map((re) => `(?:${re.source})`).join('|'));
const ENV = /(^|\/)\.env/i;
const NAO_VARRER = new Set(['node_modules', '.next', '.git']);
const MAX_ARQUIVO_VARRIDO = 2 * 1024 * 1024;

function varrer(pasta, re) {
  const achados = [];
  const fila = [pasta];
  let visitas = 0;
  while (fila.length && visitas < 20000) {
    const dir = fila.shift();
    let entradas;
    try { entradas = fs.readdirSync(dir, { withFileTypes: true }); } catch (err) {
      if (err.code === 'EPERM' || err.code === 'EACCES') return { pendente: err.code };
      continue;
    }
    for (const ent of entradas) {
      visitas += 1;
      const arq = path.join(dir, ent.name);
      if (ent.isDirectory()) { if (!NAO_VARRER.has(ent.name)) fila.push(arq); continue; }
      if (!ent.isFile()) continue;
      let bruto;
      try {
        if (fs.statSync(arq).size > MAX_ARQUIVO_VARRIDO) continue;
        bruto = fs.readFileSync(arq);
      } catch (err) {
        if (err.code === 'EPERM' || err.code === 'EACCES') return { pendente: err.code };
        continue;
      }
      if (bruto.includes(0)) continue;
      if (re.test(bruto.toString('utf8'))) achados.push(path.relative(pasta, arq).replace(/\\/g, '/'));
    }
  }
  return { achados: achados.sort() };
}

function credenciais(idPratica, p) {
  const pasta = p.pasta;
  const re = PADROES_CREDENCIAL[idPratica] || PADRAO_GERAL;
  const comando = 'busca de credencial (padrões da régua)';
  const fato = (codigo, saida) => ({ registro: { check: 'credenciais', comando, pasta, codigo, saida: primeiras(saida) }, mostrar: '' });
  const linhas = [];
  const v = varrer(pasta, re);
  if (v.pendente) return pendencia(`o sandbox do Codex não deixou este comando ler a pasta da prática (${v.pendente})`);
  linhas.push(`arquivos da pasta com chave ou credencial (fora de node_modules, .next e .git): ${v.achados.length}${v.achados.length ? `\n${v.achados.join('\n')}` : ''}`);
  let exemplo = null;
  try { exemplo = fs.readFileSync(path.join(pasta, '.env.example'), 'utf8'); } catch { /* sem .env.example */ }
  linhas.push(exemplo === null ? '.env.example: não existe' : `.env.example: ${exemplo.split(/\r?\n/).filter((l) => /=.+/.test(l)).length} linha(s) com valor depois do =`);
  const g = temGit(pasta);
  if (g && g.pendente) return pendencia(`o sandbox do Codex não deixou este comando ler a pasta da prática (${g.pendente})`);
  if (!g) {
    linhas.push('a pasta não é um repositório git: não há o que está versionado nem histórico para procurar');
    return fato(null, linhas.join('\n\n'));
  }
  const ls = rodarGit(['ls-files'], pasta);
  const hist = rodarGit(['log', '-p', '--all', '--no-color', '--no-ext-diff', '--no-textconv'], pasta, { timeout: 30000 });
  for (const r of [ls, hist]) { const m = gitNoSandbox(r); if (m) return pendencia(m); }
  if (ls.error && ls.error.code === 'ENOENT') { linhas.push('o git não está instalado nesta máquina'); return fato(null, linhas.join('\n\n')); }
  const versionados = ls.status === 0 ? (ls.stdout || '').split('\n').filter(Boolean) : [];
  const envs = versionados.filter((f) => ENV.test(f));
  linhas.push(`arquivos .env versionados (git ls-files): ${envs.length}${envs.length ? `\n${envs.join('\n')}` : ''}`);
  const comChave = versionados.filter((f) => v.achados.includes(f));
  linhas.push(`arquivos versionados com chave ou credencial: ${comChave.length}${comChave.length ? `\n${comChave.join('\n')}` : ''}`);
  // No histórico, como o `grep -c` das réguas: quantas linhas casam, e em que commits, sem as linhas.
  let n = 0;
  const commits = new Set();
  let atual = null;
  for (const l of String(hist.stdout || '').split('\n')) {
    const c = l.match(/^commit ([0-9a-f]{7,40})/);
    if (c) { atual = c[1].slice(0, 7); continue; }
    if (re.test(l)) { n += 1; if (atual) commits.add(atual); }
  }
  linhas.push(hist.status === 0
    ? `linhas do histórico inteiro (git log -p --all) com chave ou credencial: ${n}${commits.size ? `, em ${commits.size} commit(s): ${[...commits].join(' ')}` : ''}`
    : `histórico: ${parteGit(hist)}`);
  return fato(hist.status, linhas.join('\n\n'));
}

// O cabeçalho que carrega credencial, com o valor trocado.
const CABECALHO_SENSIVEL = /^\s*(authorization|cookie|stripe-signature)\s*:/i;
function mascarar(c) {
  const s = String(c);
  return CABECALHO_SENSIVEL.test(s) ? `${s.slice(0, s.indexOf(':')).trim()}: [mascarado]` : semSegredo(s);
}

async function http(p, [metodo, alvo], kv) {
  const m = String(metodo || '').toUpperCase();
  if (!METODOS.includes(m) || !alvo) return { recusa: `uso: ${USO}` };
  if (!permitida(alvo, p)) {
    return { recusa: `\`${alvo}\` não é a entrega registrada desta prática nem localhost. O \`checar http\` só chama ${p.url ? `o endereço registrado (${p.url}) e` : ''} localhost; a sala não busca página por conta própria.` };
  }
  let corpo;
  if (kv.arquivo) {
    const arq = path.resolve(kv.arquivo);
    const real = (x) => { try { return fs.realpathSync(x); } catch { return path.resolve(x); } };
    const dentro = path.relative(real(paths.TMP), real(arq));
    if (!dentro || dentro.startsWith('..') || path.isAbsolute(dentro)) return { recusa: `o corpo do pedido vai num arquivo em trilha/tmp, e \`${kv.arquivo}\` não está lá.` };
    try { corpo = fs.readFileSync(arq, 'utf8'); } catch (err) { return { recusa: `não consegui ler ${kv.arquivo} (${err.message}).` }; }
  }
  if (corpo !== undefined && (m === 'GET' || m === 'HEAD')) return { recusa: `um pedido ${m} não leva corpo; tire o arquivo= ou use outro método.` };
  // Os cabeçalhos do `curl -H` do README (o `Stripe-Signature` do webhook da P6): sem eles o pedido medido não é o da
  // receita. Os que carregam credencial saem mascarados de tudo o que fica gravado ou aparece.
  const headers = {};
  for (const c of kv.cabecalhos || []) {
    const i = c.indexOf(':');
    const nome = i > 0 ? c.slice(0, i).trim() : '';
    if (!/^[A-Za-z0-9-]+$/.test(nome)) return { recusa: `cabeçalho torto: \`${mascarar(c)}\`. A forma é cabecalho=Nome:valor.` };
    headers[nome.toLowerCase()] = c.slice(i + 1).trim();
  }
  let tipo = kv.tipo || headers['content-type'];
  if (corpo !== undefined && !tipo) { try { JSON.parse(corpo); tipo = 'application/json'; } catch { tipo = 'text/plain'; } }
  if (tipo) headers['content-type'] = tipo;
  // Sem seguir redirecionamento: ele levaria o pedido para fora da cerca.
  const r = await pedir(alvo, { method: m, redirect: 'manual', ...(Object.keys(headers).length ? { headers } : {}), ...(corpo !== undefined ? { body: corpo } : {}) });
  if (r.erro && doSandbox(r.erro)) return pendencia(`${MOTIVO_REDE} (${r.erro})`);
  const nomes = (kv.cabecalhos || []).map(mascarar);
  const comando = `${m} ${alvo}${kv.arquivo ? ` (corpo: ${path.basename(kv.arquivo)})` : ''}${nomes.length ? ` (cabeçalhos: ${nomes.join('; ')})` : ''}`;
  if (r.erro) return { registro: { check: 'http', comando, url: alvo, codigo: null, saida: primeiras(`não respondeu: ${r.erro}`) }, mostrar: '' };
  const cabeca = `HTTP ${r.status}${r.local ? ` · redireciona para ${r.local}` : ''} · ${Buffer.byteLength(r.texto || '', 'utf8')} bytes`;
  return {
    registro: { check: 'http', comando, url: alvo, codigo: r.status, saida: primeiras(`${cabeca}\n${r.texto || ''}`) },
    mostrar: paraMostrar(r.texto),
  };
}

// Roda um check. Devolve { recusa } (o pedido não vale), { pendente } (o sandbox não deixou: nada é gravado) ou
// { registro, mostrar } (o fato, para gravar, e o que o tutor lê além dele).
async function rodar(idPratica, p, sub, resto) {
  const kv = { cabecalhos: [] };
  const soltos = [];
  for (const x of resto) {
    const i = x.indexOf('=');
    const chave = i > 0 ? x.slice(0, i) : '';
    if (chave === 'cabecalho') kv.cabecalhos.push(x.slice(i + 1));
    else if (/^(script|arquivo|tipo)$/.test(chave)) kv[chave] = x.slice(i + 1);
    else soltos.push(x);
  }
  // As sondas da T6 antes de qualquer check. Sem internet, o que não depende dela (os testes, o git, o localhost) roda.
  const s = require('./codex/sondas').verificar();
  const precisaRede = (sub === 'url' && p.url && !local(p.url)) || (sub === 'http' && soltos[1] && !local(soltos[1]));
  if (!s.ok && !s.semRede) return pendencia(s.motivo);
  if (!s.ok && s.semRede && precisaRede) return { pendente: { causa: 'sem-rede', motivo: s.motivo } };
  if (sub === 'url') return url(p);
  if (sub === 'testes') return testes(p, kv);
  if (sub === 'git') return git(p, { semRede: !s.ok && s.semRede });
  if (sub === 'credenciais') return credenciais(idPratica, p);
  if (sub === 'http') return http(p, soltos, kv);
  return { recusa: `uso: ${USO}` };
}

// Grava o fato. O mesmo check rodado de novo substitui o anterior: vale a última medida.
function gravar(p, registro, em) {
  const lista = (p.checagens || []).filter((c) => !(c.check === registro.check && c.comando === registro.comando));
  lista.push({ ...registro, em });
  p.checagens = lista.slice(-MAX_CHECAGENS);
}

// As checagens que ainda dizem respeito à entrega registrada: a URL ou a pasta trocadas depois de uma medida fazem dela
// a medida de outra coisa.
function vigentes(p) {
  return (p.checagens || []).filter((c) => {
    if (c.check === 'url') return c.url === p.url;
    if (c.check === 'http') return permitida(c.url, p);
    return c.pasta === p.pasta;
  });
}

// Os checks da régua foram escritos para o Claude, que tem o painel ao lado da conversa. No Codex não há painel: a
// página se abre pelo `checar url`, e o repositório pelo `ls-remote` do `checar git` (o `checar http` só vai à entrega
// registrada e ao localhost, e o GitHub não é nenhum dos dois); a correção também confere se ele abre (lib/entrega.js).
function semPainel(check, id) {
  if (!/painel/i.test(check)) return check;
  if (/reposit[óo]rio registrado/i.test(check)) return `O repositório registrado: \`checar ${id} git\` diz se ele responde sem a credencial do aluno, e o harness também confere na correção se ele abre publicamente. Anote o endereço dele e o que o \`checar\` mediu.`;
  const pelo = `com \`checar ${id} url\``;
  return check
    .replace(/\s*no painel ao lado, para o aluno ver junto,/gi, ` ${pelo},`)
    .replace(/\bno painel\s+(a página registrada|a URL registrada)/gi, `$1 ${pelo}`)
    .replace(/(a URL registrada|a página registrada)\s+no painel(\s+ao lado)?/gi, `$1 ${pelo}`)
    .replace(/\bno painel(\s+ao lado)?/gi, pelo);
}

// A seção que o corretor lê, ao lado da conferência do tutor.
function secao(p) {
  const lista = vigentes(p);
  const corpo = lista.length
    ? lista.map((c) => `#### checar ${c.check}: ${c.comando} (em ${c.em}, ${c.codigo === null || c.codigo === undefined ? 'sem código de saída' : `código ${c.codigo}`})\n\n\`\`\`\n${c.saida}\n\`\`\``).join('\n\n')
    : '(o tutor não rodou nenhum `checar`: os testes, o histórico e os pedidos ao sistema no ar ficam no que o harness juntou acima e na conferência do tutor)';
  return `### Checagens medidas pelo harness (o comando \`checar\`)\n\nCada bloco abaixo é o que o harness mediu, fora do sandbox do Codex, na pasta ou na URL registrada da entrega, com o código de saída (nos pedidos à rede, o status HTTP) e as primeiras linhas da saída: é fato medido, não o que o tutor transcreveu. Onde a conferência do tutor e uma checagem divergirem, vale a checagem.\n\n${corpo}`;
}

module.exports = { mascarar, rodar, gravar, vigentes, secao, semPainel, erroDeSandbox, semSegredo, permitida, ERROS_DE_SANDBOX, USO, POR_CHECK };
