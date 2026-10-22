'use strict';
// Quando uma aula aconteceu e quando uma conversa existiu. A busca da transcrição por horário (lib/transcricao.js)
// e a poda das cópias das conversas (lib/conversas.js) usam as duas, e moram aqui para não divergirem.
const fs = require('fs');

// Os instantes em que a aula deixou rastro no estado: o início, os marcos, a fluência e a conclusão.
function marcasDaAula(e, idAula) {
  const r = (e.aulas || {})[idAula] || {};
  return [r.iniciada_em, ...Object.values(r.milestones || {}), r.fluencia && r.fluencia.registrada_em, r.concluida_em]
    .filter((t) => typeof t === 'string')
    .map(Date.parse)
    .filter((t) => !Number.isNaN(t));
}

// De quando a quando a conversa existiu: o primeiro `timestamp` do arquivo e a última escrita nele.
function janelaDoArquivo(arquivo) {
  try {
    const fd = fs.openSync(arquivo, 'r');
    const buf = Buffer.alloc(64 * 1024);
    const n = fs.readSync(fd, buf, 0, buf.length, 0);
    fs.closeSync(fd);
    const m = buf.toString('utf8', 0, n).match(/"timestamp"\s*:\s*"([^"]+)"/);
    const inicio = m ? Date.parse(m[1]) : NaN;
    return Number.isNaN(inicio) ? null : { inicio, fim: fs.statSync(arquivo).mtimeMs };
  } catch {
    return null;
  }
}

module.exports = { marcasDaAula, janelaDoArquivo };
