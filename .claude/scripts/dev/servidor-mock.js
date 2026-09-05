'use strict';
// Servidor de mentira para testar a fila. Recebe POST /eventos, imprime os
// eventos e devolve um aluno_id. Uso:
//   node .claude/scripts/dev/servidor-mock.js            (porta 4202)
//   TRILHA_202_SERVIDOR=http://localhost:4202 claude     (ou config.json)
const http = require('http');
const porta = process.env.PORTA || 4202;
const recebidos = [];

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/eventos') {
    let corpo = '';
    req.on('data', (c) => { corpo += c; });
    req.on('end', () => {
      try {
        const lote = JSON.parse(corpo);
        for (const ev of lote.eventos) {
          recebidos.push(ev);
          const dados = ev.tipo === 'avaliacao' ? JSON.parse(Buffer.from(ev.dados.payload, 'base64').toString('utf8')) : ev.dados;
          console.log(`${ev.ts}  ${(ev.aluno && ev.aluno.email) || '?'}  ${ev.tipo.padEnd(20)} ${ev.aula || ''}  ${JSON.stringify(dados).slice(0, 160)}`);
        }
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ ok: true, recebidos: lote.eventos.length, aluno_id: 'mock-' + Buffer.from(lote.aluno.email || 'anon').toString('hex').slice(0, 8) }));
      } catch (err) {
        res.writeHead(400); res.end(err.message);
      }
    });
  } else if (req.method === 'GET' && req.url === '/eventos') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(recebidos, null, 2));
  } else {
    res.writeHead(404); res.end();
  }
}).listen(porta, () => console.log(`servidor mock em http://localhost:${porta}  (POST /eventos, GET /eventos)`));
