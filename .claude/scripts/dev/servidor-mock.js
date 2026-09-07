'use strict';
// Servidor de mentira para testar a fila. Recebe POST /eventos, imprime os
// eventos e devolve um aluno_id. Uso:
//   node .claude/scripts/dev/servidor-mock.js            (porta 4202)
//   TRILHA_202_SERVIDOR=http://localhost:4202 claude     (ou config.json)
//
// Uma regra do servidor de verdade já vale aqui: para cada aluno e aula, a
// avaliação que conta é a última que chegou, com ou sem a marca de revisão. O
// tutor pode reavaliar depois do `concluir` (o aluno volta a discutir e dá sinal
// novo), e nem toda segunda avaliação vem marcada — o critério é a ordem, não a
// marca. GET /avaliacoes devolve as que valem.
const http = require('http');
const porta = process.env.PORTA || 4202;
const recebidos = [];
const avaliacoes = new Map(); // "aluno|aula" -> { ts, aula, aluno, revisao, avaliacao }

function decodificar(ev) {
  return JSON.parse(Buffer.from(ev.dados.payload, 'base64').toString('utf8'));
}

function registrarAvaliacao(ev, conteudo) {
  const aluno = (ev.aluno && ev.aluno.email) || '?';
  const aula = ev.aula || ev.dados.aula;
  const chave = `${aluno}|${aula}`;
  const anterior = avaliacoes.get(chave);
  if (anterior && anterior.ts >= ev.ts) return `  (chegou fora de ordem; vale a de ${anterior.ts})`;
  avaliacoes.set(chave, { ts: ev.ts, aula, aluno, revisao: Boolean(ev.dados.revisao), avaliacao: conteudo });
  return anterior ? `  (substitui a avaliação de ${anterior.ts})` : '';
}

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/eventos') {
    let corpo = '';
    req.on('data', (c) => { corpo += c; });
    req.on('end', () => {
      try {
        const lote = JSON.parse(corpo);
        for (const ev of lote.eventos) {
          recebidos.push(ev);
          const avaliacao = ev.tipo === 'avaliacao';
          const dados = avaliacao ? decodificar(ev) : ev.dados;
          const nota = avaliacao ? registrarAvaliacao(ev, dados) : '';
          console.log(`${ev.ts}  ${(ev.aluno && ev.aluno.email) || '?'}  ${ev.tipo.padEnd(20)} ${ev.aula || ''}  ${JSON.stringify(dados).slice(0, 160)}${nota}`);
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
  } else if (req.method === 'GET' && req.url === '/avaliacoes') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify([...avaliacoes.values()], null, 2));
  } else {
    res.writeHead(404); res.end();
  }
}).listen(porta, () => console.log(`servidor mock em http://localhost:${porta}  (POST /eventos, GET /eventos, GET /avaliacoes)`));
