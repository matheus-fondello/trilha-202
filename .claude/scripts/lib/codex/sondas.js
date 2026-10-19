'use strict';
// As sondas do sandbox (branch codex, T6): antes de chamar um avaliador, o comando confere se o sandbox do Codex
// deixa fazer o que o avaliador precisa. Sem isto, o sandbox fechado chegaria disfarçado: o `claude -p` e o `codex`
// gravam o login na pasta pessoal, e o sandbox não deixa gravar em `~` em modo nenhum, então o resultado seria "os dois
// sem login", e o tutor mandaria o aluno fazer login à toa. Ou o `fetch failed` de um Claude que nasceu sem rede, que o
// avaliador lê como API fora do ar e conta para a desistência.
//
// Três sondas, nesta ordem, em menos de 3 s ao todo (T0, codex/MODOS-SANDBOX.md):
//   1. processo: abrir um programa (o próprio Node). O `unelevated` não deixa;
//   2. pasta pessoal: criar e apagar um arquivo na pasta da trilha em `~`;
//   3. rede: um pedido curto ao endereço do CRM.
//
// Uma rodada por comando: o resultado fica guardado no processo, e as tentativas do avaliador não repetem as sondas.
// As variáveis que o Codex põe no ambiente do sandbox entram só como dica no motivo, menos o ENOTFOUND: com
// CODEX_SANDBOX_NETWORK_DISABLED ele é o sandbox, sem ela é a máquina sem internet. Cada modo marca de um jeito, e o
// `elevated` não marca nada, então a decisão é pelo que a sonda viu.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const paths = require('../paths');

const MOTIVOS = {
  processo: 'o sandbox do Codex não deixa este comando abrir outro programa, e quem avalia é um programa à parte',
  pessoal: 'o sandbox do Codex não deixa este comando gravar na pasta pessoal, onde o avaliador guarda o login',
  rede: 'o sandbox do Codex não deixa este comando falar com a internet',
};
const SEM_REDE = 'esta máquina está sem internet agora';

// As marcas do sandbox no ambiente, para o motivo.
function dica() {
  const marcas = ['CODEX_SANDBOX', 'CODEX_SANDBOX_NETWORK_DISABLED'].filter((k) => process.env[k]).map((k) => `${k}=${process.env[k]}`);
  return marcas.length ? ` (o Codex marcou: ${marcas.join(', ')})` : '';
}
const sandbox = (tipo, detalhe) => ({ ok: false, sandbox: tipo, motivo: `${MOTIVOS[tipo]}${detalhe ? ` (${detalhe})` : ''}${dica()}` });
const BLOQUEIO = /\b(EPERM|EACCES|EROFS)\b|operation not permitted/i;

function processo() {
  const r = spawnSync(process.execPath, ['-v'], { timeout: 1000, windowsHide: true, encoding: 'utf8' });
  if (r.error && BLOQUEIO.test(`${r.error.code || ''} ${r.error.message || ''}`)) return sandbox('processo', r.error.code);
  if (!r.error && r.status !== 0 && BLOQUEIO.test(String(r.stderr || ''))) return sandbox('processo', 'operation not permitted');
  return null;
}

// A pasta da trilha na pasta pessoal: a das credenciais (os testes a trocam pela variável).
function pessoal() {
  const pasta = path.dirname(paths.CREDENCIAIS);
  const arq = path.join(pasta, `.sonda-${process.pid}`);
  try {
    fs.mkdirSync(pasta, { recursive: true });
    fs.writeFileSync(arq, '');
    fs.unlinkSync(arq);
  } catch (err) {
    if (['EPERM', 'EACCES', 'EROFS'].includes(err.code)) return sandbox('pessoal', err.code);
    // Outro erro (disco cheio, nome reservado) não é sandbox: o avaliador que siga e diga o que for.
  }
  return null;
}

// O `fetch` roda num Node filho, porque o avaliador é síncrono. O filho imprime o que viu numa linha de JSON.
const SONDA_REDE = `
const ctrl = new AbortController();
const t = setTimeout(() => ctrl.abort(), 1500);
const fim = (o) => { clearTimeout(t); process.stdout.write(JSON.stringify(o)); };
fetch(process.argv[1], { method: 'HEAD', signal: ctrl.signal, redirect: 'manual' })
  .then((r) => fim({ ok: true, status: r.status }))
  .catch((e) => { const c = e && e.cause; fim({ ok: false, nome: e && e.name, codigo: (c && c.code) || (e && e.code) || null, texto: String((c && c.message) || (e && e.message) || '') }); });
`;
function rede() {
  const url = require('../acesso').servidor();
  // Sem endereço do CRM não há o que sondar: o avaliador diz o que for.
  if (!url || typeof fetch !== 'function') return null;
  const r = spawnSync(process.execPath, ['-e', SONDA_REDE, url], { timeout: 1900, windowsHide: true, encoding: 'utf8' });
  if (r.error) {
    if (BLOQUEIO.test(`${r.error.code || ''} ${r.error.message || ''}`)) return sandbox('processo', r.error.code);
    // O filho não respondeu no tempo: a rede pendurou.
    return { ok: false, semRede: true, motivo: `${SEM_REDE} (o servidor da 202 não respondeu)${dica()}` };
  }
  let v = null;
  try { v = JSON.parse(String(r.stdout || '').trim()); } catch { /* sem resposta legível */ }
  if (!v) return null;
  if (v.ok) return null;
  const tudo = `${v.codigo || ''} ${v.texto || ''}`;
  if (v.nome === 'AbortError' || /\bETIMEDOUT\b|timed? ?out/i.test(tudo)) return { ok: false, semRede: true, motivo: `${SEM_REDE} (o servidor da 202 não respondeu)${dica()}` };
  // A recusa do proxy falso do sandbox (127.0.0.1:9) chega como ECONNREFUSED; o firewall do `elevated`, como EACCES.
  if (/\b(EACCES|ECONNREFUSED)\b|127\.0\.0\.1:9\b/.test(tudo)) return sandbox('rede', v.codigo || 'conexão recusada');
  if (/\b(ENOTFOUND|EAI_AGAIN)\b/.test(tudo)) {
    return process.env.CODEX_SANDBOX_NETWORK_DISABLED ? sandbox('rede', v.codigo) : { ok: false, semRede: true, motivo: `${SEM_REDE} (${v.codigo})${dica()}` };
  }
  return null;
}

let guardado = null;
function verificar() {
  if (guardado) return guardado;
  // Os testes forçam o resultado, sem tocar o sistema nem a rede.
  const forcado = process.env.TRILHA_202_SONDAS;
  if (forcado) {
    if (forcado === 'ok') guardado = { ok: true };
    else if (forcado === 'sem-rede') guardado = { ok: false, semRede: true, motivo: `${SEM_REDE}${dica()}` };
    else if (MOTIVOS[forcado]) guardado = sandbox(forcado);
    else guardado = { ok: true };
    return guardado;
  }
  guardado = processo() || pessoal() || rede() || { ok: true };
  return guardado;
}

module.exports = { verificar, MOTIVOS, SEM_REDE };
