'use strict';
// Fila de eventos em JSONL. Um evento por linha. Nunca falha por causa da
// rede: enfileirar é só escrever no disco. Enviar é outra história (enviar.js).
const fs = require('fs');
const path = require('path');
const { FILA, CONFIG } = require('./paths');
const { agora, id, lerJson } = require('./util');
const git = require('./git');

function versaoHarness() {
  try { return lerJson(CONFIG).harness.versao; } catch { return 'desconhecida'; }
}

// Commit do harness e se ele está íntegro. O servidor compara com o repositório
// oficial: evento vindo de commit desconhecido ou de harness sujo é auto-relato
// de um harness modificado, e é assim que se lê.
function integridade() {
  try {
    const alterados = git.alterados();
    return { commit: git.commit(), sujo: alterados.length > 0 };
  } catch {
    return { commit: null, sujo: null };
  }
}

function enfileirar(tipo, dados, estado) {
  const ev = {
    id: id(),
    ts: agora(),
    tipo,
    aula: (dados && dados.aula) || (estado && estado.aula_atual) || null,
    sessao: estado && estado.sessao_atual ? estado.sessao_atual.id : null,
    aluno: estado ? { email: estado.aluno.email, id: estado.aluno.id } : null,
    harness: versaoHarness(),
    ...integridade(),
    dados: dados || {},
  };
  fs.mkdirSync(path.dirname(FILA), { recursive: true });
  fs.appendFileSync(FILA, JSON.stringify(ev) + '\n', 'utf8');
  return ev;
}

function ler() {
  let texto;
  try { texto = fs.readFileSync(FILA, 'utf8'); } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
  const eventos = [];
  for (const linha of texto.split('\n')) {
    if (!linha.trim()) continue;
    try { eventos.push(JSON.parse(linha)); } catch { /* linha corrompida: ignora */ }
  }
  return eventos;
}

// Reescreve a fila sem os enviados. Lê o arquivo de novo logo antes de trocar,
// porque o envio leva segundos e outro processo (um hook, o CLI numa segunda
// janela) pode ter enfileirado no meio: sem isso o rename apagava esse evento.
// A janela que sobra, entre a última leitura e o rename, é de microssegundos.
function remover(ids) {
  const saem = new Set(ids);
  const restantes = ler().filter((e) => !saem.has(e.id));
  const tmp = FILA + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, restantes.map((e) => JSON.stringify(e)).join('\n') + (restantes.length ? '\n' : ''), 'utf8');
  const chegaram = ler().filter((e) => !saem.has(e.id) && !restantes.some((r) => r.id === e.id));
  if (chegaram.length) fs.appendFileSync(tmp, chegaram.map((e) => JSON.stringify(e)).join('\n') + '\n', 'utf8');
  fs.renameSync(tmp, FILA);
}

module.exports = { enfileirar, ler, remover };
