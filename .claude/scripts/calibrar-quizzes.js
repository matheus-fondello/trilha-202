'use strict';
// Leitura cega: a nota esperada fica neste processo; o avaliador recebe apenas
// enunciado, pergunta, regua e resposta, como receberia no quiz real.
const crypto = require('crypto');
const quiz = require('./lib/quiz');
const leitor = require('./lib/quiz-avaliador');

function casos(ids) {
  const lista = [];
  for (const id of ids) {
    const banco = quiz.carregar(id);
    for (const questao of banco.questoes.filter((q) => q.tipo === 'aberta')) {
      const ancoras = questao.casos_calibragem || [];
      if (ancoras.length !== 2 || ancoras[0].nota !== 3 || ancoras[1].nota !== 5 ||
          ancoras.some((a) => !a.resposta || !a.motivo)) {
        throw new Error(`${id}/${questao.n}: faltam exemplos de 3 e 5 com motivo`);
      }
      for (const ancora of ancoras) {
        lista.push({ id, questao, esperada: ancora.nota, resposta: ancora.resposta, motivo: ancora.motivo });
      }
    }
  }
  // Ordem estavel, mas embaralhada em relacao ao banco; nao agrupa por nota.
  return lista.sort((a, b) => {
    const chave = (c) => crypto.createHash('sha256').update(`${c.id}:${c.questao.n}:${c.esperada}`).digest('hex');
    return chave(a).localeCompare(chave(b));
  });
}

function comparar(leituras) {
  return leituras.map((l) => ({
    questao: `${l.id}/${l.questao}`,
    esperada: l.esperada,
    obtidas: l.obtidas,
    estado: l.incompleta ? 'incompleto'
      : l.obtidas.some((n) => typeof n !== 'number') ? 'falha'
      : l.obtidas.every((n) => n === l.esperada) ? 'ok' : 'diverge',
    motivo: l.motivo,
  }));
}

function executar(args) {
  const ids = args.filter((a) => /^Q[1-6]$/i.test(a)).map((a) => a.toUpperCase());
  const limite = Number((args.find((a) => a.startsWith('--limite=')) || '').split('=')[1] || 0);
  const repeticoes = Number((args.find((a) => a.startsWith('--repeticoes=')) || '').split('=')[1] || 2);
  if (!Number.isInteger(limite) || limite < 0 || !Number.isInteger(repeticoes) || repeticoes < 1 || repeticoes > 5) {
    throw new Error('use --limite=N (N >= 0) e --repeticoes=N (1 a 5)');
  }
  const selecionados = casos(ids.length ? ids : ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']).slice(0, limite || undefined);
  const leituras = [];
  let interrupcao = null;
  for (const c of selecionados) {
    const obtidas = [];
    for (let i = 0; i < repeticoes; i++) {
      const resultado = leitor.avaliar(c.id, c.questao, c.resposta);
      if (resultado.limite) { interrupcao = resultado.motivo; break; }
      obtidas.push(resultado.ok ? resultado.avaliacao.nota : `falhou: ${resultado.motivo}`);
    }
    if (obtidas.length) leituras.push({ id: c.id, questao: c.questao.n, esperada: c.esperada, obtidas, motivo: c.motivo, incompleta: obtidas.length < repeticoes });
    process.stderr.write(`Lidos ${leituras.length}/${selecionados.length}\r`);
    if (interrupcao) break;
  }
  const relatorio = comparar(leituras);
  process.stderr.write('\n');
  for (const linha of relatorio) {
    console.log(`${linha.estado.toUpperCase()} ${linha.questao}: esperada ${linha.esperada}, obtidas ${linha.obtidas.join(', ')}`);
    if (linha.estado === 'diverge') console.log(`  Ancora: ${linha.motivo}`);
  }
  console.log(`${relatorio.filter((x) => x.estado === 'ok').length}/${selecionados.length} casos consistentes`);
  if (interrupcao) { console.error(`Calibragem interrompida: ${interrupcao}`); process.exitCode = 2; }
  else if (relatorio.some((x) => x.estado !== 'ok')) process.exitCode = 1;
}

if (require.main === module) executar(process.argv.slice(2));
module.exports = { casos, comparar };
