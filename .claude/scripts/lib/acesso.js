'use strict';
// O acesso do aluno à 202: o token que diz de quem é o que acontece nesta sala e
// o endereço do CRM que recebe os eventos. A 202 emite os dois juntos, em duas
// linhas (TRILHA_202_SERVIDOR=... e TRILHA_202_TOKEN=...), e o `conectar` guarda
// em CREDENCIAIS, fora do repositório.
//
// Sem acesso não há aula: o resumo manda o tutor pedir o token antes de qualquer
// conteúdo, e o CLI não registra progresso. Isto é sinal, não controle — quem
// desmonta o harness desmonta a trava junto —, mas o que chega ao CRM só chega
// com um token que a 202 emitiu, e essa fronteira é do servidor.
const fs = require('fs');
const { CREDENCIAIS, CONFIG } = require('./paths');
const { lerJson, gravarJson, agora } = require('./util');

// O token da 202 é base64url. A conferência de formato não substitui a do
// servidor: ela só pega o que foi colado torto (espaço, aspas, a linha inteira).
const FORMATO_TOKEN = /^[A-Za-z0-9_-]{20,200}$/;

function credenciais() {
  try { return lerJson(CREDENCIAIS, {}) || {}; } catch { return {}; }
}

// Variável de ambiente primeiro, arquivo depois: quem prefere não ter arquivo
// na pasta pessoal ainda consegue.
function token() {
  return String(process.env.TRILHA_202_TOKEN || credenciais().token || '').trim();
}

// A URL que a 202 mandou junto com o token vale mais que a do config.json: é a
// que emitiu aquele token. A variável ganha das duas, para testar contra o mock.
function servidor() {
  let doConfig = null;
  try { doConfig = (lerJson(CONFIG, {}).servidor || {}).url; } catch { /* sem config */ }
  const url = String(process.env.TRILHA_202_SERVIDOR || credenciais().servidor || doConfig || '').trim();
  return url ? url.replace(/\/+$/, '') : null;
}

function tokenValido(t) {
  return FORMATO_TOKEN.test(String(t || ''));
}

// https sempre; http só na própria máquina, que é onde o mock roda.
function servidorValido(url) {
  return /^https:\/\/[^\s/]+/.test(url) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(url);
}

// Junto com o token, de quem ele é (e-mail e turma, como o CRM respondeu): numa sala nova nesta máquina, o tutor
// diz de quem é o acesso guardado antes de usá-lo. Token novo sem essa resposta apaga o par antigo, que seria de
// outra pessoa.
function guardar({ token: t, servidor: url, email, turma }) {
  const atual = credenciais();
  const mesmoToken = !t || t === atual.token;
  gravarJson(CREDENCIAIS, {
    token: t || atual.token,
    servidor: url || atual.servidor || null,
    email: email || (mesmoToken ? atual.email || null : null),
    turma: turma || (mesmoToken ? atual.turma || null : null),
    guardado_em: agora(),
  });
  // Legível só pelo dono, onde o sistema entende permissão (no Windows, não faz nada).
  try { fs.chmodSync(CREDENCIAIS, 0o600); } catch { /* segue */ }
}

function apagar() {
  try { fs.unlinkSync(CREDENCIAIS); } catch { /* já não existia */ }
}

// A sala está aberta quando foi conectada, o token ainda está na máquina e a 202
// não o recusou depois. Recusa é 401: token revogado, trocado ou turma cancelada.
// Servidor fora do ar não fecha nada, porque o CRM responde 503 e não 401.
function conectado(e) {
  const a = e && e.acesso;
  return Boolean(a && a.conectado_em && !a.recusado_em && token());
}

// De quem é um token: o CRM responde a leitura do aluno com o e-mail e a turma. Só para dizer ao tutor; qualquer
// falha (rede, servidor antigo, teste sem rede) devolve null e nada trava.
async function quemE(t, url, timeoutMs = 4000) {
  if (!t || !url) return null;
  if (process.env.TRILHA_202_REDE === 'local' && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(url)) return null;
  try {
    const r = await fetch(`${url}/aluno`, { headers: { authorization: `Bearer ${t}` }, signal: AbortSignal.timeout(timeoutMs) });
    if (!r.ok) return null;
    const j = await r.json();
    const email = j && j.aluno && j.aluno.email;
    return email ? { email: String(email), turma: (j.turma && j.turma.nome) || null } : null;
  } catch {
    return null;
  }
}

module.exports = { credenciais, token, servidor, tokenValido, servidorValido, guardar, apagar, conectado, quemE };
