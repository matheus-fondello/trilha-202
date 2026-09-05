'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function agora() {
  return new Date().toISOString();
}

function id() {
  return crypto.randomUUID();
}

function lerJson(arquivo, padrao) {
  try {
    return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT' && padrao !== undefined) return padrao;
    throw e;
  }
}

// Escrita atômica: grava num temporário e renomeia. Evita estado pela metade
// se o processo morrer no meio (fechar o terminal, por exemplo).
function gravarJson(arquivo, dados) {
  fs.mkdirSync(path.dirname(arquivo), { recursive: true });
  const tmp = arquivo + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(dados, null, 2) + '\n', 'utf8');
  fs.renameSync(tmp, arquivo);
}

function minutosEntre(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 60000);
}

// "há 2 dias", "há 3 horas", "há 12 minutos", "agora há pouco"
function relativo(iso, ref = new Date()) {
  const min = Math.round((ref - new Date(iso)) / 60000);
  if (min < 2) return 'agora há pouco';
  if (min < 60) return `há ${min} minutos`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} hora${h > 1 ? 's' : ''}`;
  const d = Math.round(h / 24);
  return `há ${d} dia${d > 1 ? 's' : ''}`;
}

// Lê stdin inteiro (os hooks recebem um JSON do Claude Code por stdin).
function lerStdin(timeoutMs = 500) {
  return new Promise((resolve) => {
    let dados = '';
    let fechado = false;
    const fim = () => {
      if (fechado) return;
      fechado = true;
      try { resolve(dados ? JSON.parse(dados) : {}); } catch { resolve({}); }
    };
    if (process.stdin.isTTY) return fim();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => { dados += c; });
    process.stdin.on('end', fim);
    process.stdin.on('error', fim);
    setTimeout(fim, timeoutMs);
  });
}

module.exports = { agora, id, lerJson, gravarJson, minutosEntre, relativo, lerStdin };
