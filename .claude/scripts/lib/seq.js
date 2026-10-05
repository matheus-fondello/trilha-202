'use strict';
// Contador contínuo dos eventos deste aluno, guardado em disco e preso ao
// envelope de todo evento. Serve para uma coisa só: um buraco na sequência diz
// ao servidor que faltou evento no caminho, e aí ele marca a sessão como
// incompleta em vez de somar errado em silêncio.
//
// Falha em silêncio devolvendo nulo: um contador que não pôde ser gravado não
// pode impedir o evento de existir.
const fs = require('fs');
const path = require('path');
const { SEQ } = require('./paths');

function proximo() {
  try {
    const atual = parseInt(fs.readFileSync(SEQ, 'utf8'), 10);
    const n = (Number.isFinite(atual) ? atual : 0) + 1;
    fs.mkdirSync(path.dirname(SEQ), { recursive: true });
    const tmp = SEQ + '.' + process.pid + '.tmp';
    fs.writeFileSync(tmp, String(n), 'utf8');
    fs.renameSync(tmp, SEQ);
    return n;
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        fs.mkdirSync(path.dirname(SEQ), { recursive: true });
        fs.writeFileSync(SEQ, '1', 'utf8');
        return 1;
      } catch { return null; }
    }
    return null;
  }
}

module.exports = { proximo };
