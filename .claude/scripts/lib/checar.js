'use strict';
// A conferência da prática pelo `checar` (branch codex, T5b). No sandbox do Codex, o que o tutor roda na conferência
// falha por razões que não são do aluno: o `curl` esbarra no schannel no `elevated` e no EACCES do localhost no `mxc`, o
// `git -C` dá "Permission denied" no `mxc` e "dubious ownership" no `elevated`, e o `npm test` numa pasta fora do espaço
// de trabalho não roda (T0, codex/MODOS-SANDBOX.md). O tutor registrava a falha como fato, e o corretor dava nota 1 a
// um site que está no ar. Aqui o harness mede:
//   - `url`: o `fetch` do Node na URL registrada, que não passa pelo schannel;
//   - `testes`: o `npm test` (ou outro script do package.json) com `cwd` na pasta registrada, nunca com `git -C`;
//   - `git`: o histórico e o status, com `cwd` na pasta e `safe.directory`;
//   - `http`: um pedido à URL registrada ou ao localhost, a mesma cerca da guarda do Claude.
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
const MOSTRAR = 20000;
const MAX_CHECAGENS = 30;
const TIMEOUT_REDE_MS = 15000;
// Uma suíte de testes de projeto pequeno roda em segundos; três minutos dão folga a uma máquina lenta sem prender o
// chat num teste que ficou esperando.
const TIMEOUT_TESTES_MS = 180000;
const METODOS = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

const USO = 'checar <pratica> url | testes [script=<nome>] | git | http <METODO> <url> [arquivo=trilha/tmp/<corpo>] [tipo=<content-type>]';

// O erro que vem do sandbox, e não do que o aluno entregou. A lista é a que o `corrigir` usa para recusar uma
// conferência (codex/MODOS-SANDBOX.md). O `curl: (6)` é como o próprio curl escreve o código de saída 6.
const ERROS_DE_SANDBOX = [
  /\bEPERM\b/, /operation not permitted/i, /Could not resolve host/i, /\bENOTFOUND\b/, /\bECONNREFUSED\b/, /\bEACCES\b/,
  /\bexit(?:ed)?(?:\s+with)?(?:\s+code)?[\s:=]*(?:6|7|35)\b/i, /\bcurl: \((?:6|7|35)\)/i,
  /\bSEC_E_\w*/, /schannel/i, /dubious ownership/i, /Permission denied/i, /cannot change to/i,
];
function erroDeSandbox(texto) {
  for (const re of ERROS_DE_SANDBOX) {
    const m = String(texto || '').match(re);
    if (m) return m[0];
  }
  return null;
}

// O que um check grava não leva o token da 202 nem segredo do aluno: a saída de um teste ou de um pedido pode ecoar o
// `.env` (uma chave da API, a senha do banco numa URL), e o que fica aqui vai ao corretor e pode voltar como evidência.
function semSegredo(t) {
  return semTokenJson(semToken(String(t)))
    // A variável de ambiente que termina num nome de segredo, na forma do `.env`. Só maiúsculas e terminada nele: a
    // contagem de tokens que o log da P3 imprime (`input_tokens: 25322`) é o que o corretor precisa ler.
    .replace(/\b([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PASSWD|SENHA|API_?KEY|PRIVATE_KEY|ACCESS_KEY|SECRET_KEY)\s*=\s*)("[^"\n]*"|'[^'\n]*'|\S+)/g, '$1[omitido]')
    .replace(/\b([a-z][a-z0-9+.-]*:\/\/)[^\s:@/]+:[^\s@/]+@/gi, '$1[omitido]@')
    .replace(/\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{8,}|\bwhsec_[A-Za-z0-9]{8,}|\bsk-[A-Za-z0-9_-]{16,}|\bAIza[0-9A-Za-z_-]{20,}|\bgsk_[A-Za-z0-9]{16,}/g, '[chave omitida]');
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
    mostrar: r.texto.length > MOSTRAR ? `${r.texto.slice(0, MOSTRAR)}\n[...cortado: ${r.texto.length} caracteres no total...]` : r.texto,
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

function git(p) {
  const pasta = p.pasta;
  const comando = 'git log + git status';
  const fato = (codigo, saida) => ({ registro: { check: 'git', comando, pasta, codigo, saida: primeiras(saida) }, mostrar: '' });
  // Sem `.git` na própria pasta, o git subiria até um repositório acima dela e mostraria o histórico de outra coisa.
  try { fs.statSync(path.join(pasta, '.git')); } catch (err) {
    if (err.code === 'EPERM' || err.code === 'EACCES') return pendencia(`o sandbox do Codex não deixou este comando ler a pasta da prática (${err.code})`);
    return fato(null, 'a pasta não é um repositório git (não há .git nela)');
  }
  const opcoes = { cwd: pasta, encoding: 'utf8', timeout: 10000, windowsHide: true };
  const base = ['-c', 'safe.directory=*'];
  const log = spawnSync('git', [...base, 'log', '--date=iso-strict', '--pretty=format:%h %ad %s', '-n', '30'], opcoes);
  const st = spawnSync('git', [...base, 'status', '--short', '--branch'], opcoes);
  for (const r of [log, st]) {
    if (r.error && doSandbox(`${r.error.code || ''} ${r.error.message || ''}`)) return pendencia(`${MOTIVO_PROCESSO} (${r.error.code})`);
    if (/Permission denied|cannot change to|dubious ownership|operation not permitted/i.test(String(r.stderr || ''))) {
      return pendencia(`o sandbox do Codex não deixou o git ler a pasta da prática (${String(r.stderr).trim().split('\n')[0]})`);
    }
  }
  if (log.error && log.error.code === 'ENOENT') return fato(null, 'o git não está instalado nesta máquina');
  const parte = (r) => (r.status === 0 ? (r.stdout || '').trim() || '(vazio)' : `(saiu com ${r.status}: ${String(r.stderr || '').trim()})`);
  return fato(log.status, `git log (até 30 commits, do mais novo):\n${parte(log)}\n\ngit status:\n${parte(st)}`);
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
  let tipo = kv.tipo;
  if (corpo !== undefined && !tipo) { try { JSON.parse(corpo); tipo = 'application/json'; } catch { tipo = 'text/plain'; } }
  // Sem seguir redirecionamento: ele levaria o pedido para fora da cerca.
  const r = await pedir(alvo, { method: m, redirect: 'manual', ...(corpo !== undefined ? { body: corpo, headers: { 'content-type': tipo } } : {}) });
  if (r.erro && doSandbox(r.erro)) return pendencia(`${MOTIVO_REDE} (${r.erro})`);
  const comando = `${m} ${alvo}${kv.arquivo ? ` (corpo: ${path.basename(kv.arquivo)})` : ''}`;
  if (r.erro) return { registro: { check: 'http', comando, url: alvo, codigo: null, saida: primeiras(`não respondeu: ${r.erro}`) }, mostrar: '' };
  const cabeca = `HTTP ${r.status}${r.local ? ` · redireciona para ${r.local}` : ''} · ${Buffer.byteLength(r.texto || '', 'utf8')} bytes`;
  return {
    registro: { check: 'http', comando, url: alvo, codigo: r.status, saida: primeiras(`${cabeca}\n${r.texto || ''}`) },
    mostrar: (r.texto || '').length > MOSTRAR ? `${r.texto.slice(0, MOSTRAR)}\n[...cortado...]` : (r.texto || ''),
  };
}

// Roda um check. Devolve { recusa } (o pedido não vale), { pendente } (o sandbox não deixou: nada é gravado) ou
// { registro, mostrar } (o fato, para gravar, e o que o tutor lê além dele).
async function rodar(p, sub, resto) {
  const kv = {};
  const soltos = [];
  for (const x of resto) { const i = x.indexOf('='); if (i > 0 && /^(script|arquivo|tipo)$/.test(x.slice(0, i))) kv[x.slice(0, i)] = x.slice(i + 1); else soltos.push(x); }
  // As sondas da T6 antes de qualquer check. Sem internet, o que não depende dela (os testes, o git, o localhost) roda.
  const s = require('./codex/sondas').verificar();
  const precisaRede = (sub === 'url' && p.url && !local(p.url)) || (sub === 'http' && soltos[1] && !local(soltos[1]));
  if (!s.ok && !s.semRede) return pendencia(s.motivo);
  if (!s.ok && s.semRede && precisaRede) return { pendente: { causa: 'sem-rede', motivo: s.motivo } };
  if (sub === 'url') return url(p);
  if (sub === 'testes') return testes(p, kv);
  if (sub === 'git') return git(p);
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
// página se abre pelo `checar url`, e o repositório o harness confere sozinho na correção (lib/entrega.js), porque o
// `checar http` só vai à entrega registrada e ao localhost, e o GitHub não é nenhum dos dois.
function semPainel(check, id) {
  if (!/painel/i.test(check)) return check;
  if (/reposit[óo]rio registrado/i.test(check)) return 'O repositório registrado: o harness confere sozinho se ele responde sem login, e isso vai ao corretor. Aqui, só anote o endereço dele.';
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

module.exports = { rodar, gravar, vigentes, secao, semPainel, erroDeSandbox, semSegredo, permitida, ERROS_DE_SANDBOX, USO, POR_CHECK };
