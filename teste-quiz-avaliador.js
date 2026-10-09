'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const base = require('./.claude/scripts/lib/avaliador');
const original = base.chamar;
const questao = { n: 11, enunciado: ['Um cenário'], pergunta: 'Qual decisão?', regua: ['Citar o risco', 'Explicar a consequência'], casos_calibragem: [{ nota: 5, resposta: 'SEGREDO_DE_CALIBRAGEM', motivo: 'nota esperada' }] };
const resposta = 'Eu citaria o risco e explicaria a consequência.';
const avaliacao = { quiz: 'Q2', questao: 11, nota: 4, justificativa: 'A resposta identifica o risco e a consequência, mas ainda deixa uma alternativa sem discutir.', evidencia: 'citaria o risco', feedback: 'Você identificou o risco e explicou a consequência. Faltou comparar com outra alternativa.' };

test('avalia com a régua e aceita apenas evidência literal', () => {
  const prompts = [];
  base.chamar = (prompt) => { prompts.push(prompt); return { ok: true, texto: JSON.stringify(avaliacao), uso: { modelo: 'sonnet' } }; };
  delete require.cache[require.resolve('./.claude/scripts/lib/quiz-avaliador')];
  const leitor = require('./.claude/scripts/lib/quiz-avaliador');
  try {
    const resultado = leitor.avaliar('Q2', questao, resposta);
    assert.equal(resultado.avaliacao.nota, 4);
    assert.match(resultado.rubrica_sha, /^[0-9a-f]{64}$/);
    assert.equal(resultado.escala_versao, '2');
    assert.notEqual(leitor.rubricaSha({ ...questao, regua: ['Outra regua'] }), resultado.rubrica_sha);
    assert.match(prompts[0], /Explicar a consequência/);
    assert.match(prompts[0], /nota maxima e 3/);
    assert.doesNotMatch(prompts[0], /SEGREDO_DE_CALIBRAGEM|nota esperada/);
    assert.deepEqual(leitor.validar({ ...avaliacao, evidencia: 'inventado' }, 'Q2', questao, resposta), ['evidencia deve ser trecho literal da resposta, de ate 250 caracteres']);
  } finally { base.chamar = original; }
});

test('todos os quizzes têm exemplos cegos de respostas parciais e completas', () => {
  const { casos, comparar } = require('./.claude/scripts/calibrar-quizzes');
  const lista = casos(['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']);
  assert.equal(lista.length, 24);
  for (const id of ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']) {
    for (const n of [lista.filter((c) => c.id === id && c.esperada === 3).length, lista.filter((c) => c.id === id && c.esperada === 5).length]) assert.equal(n, 2);
  }
  assert.deepEqual(comparar([
    { id: 'Q1', questao: 11, esperada: 3, obtidas: [3, 3] },
    { id: 'Q1', questao: 12, esperada: 5, obtidas: [3, 5] },
    { id: 'Q2', questao: 11, esperada: 3, obtidas: [3], incompleta: true },
  ]).map((x) => x.estado), ['ok', 'diverge', 'incompleto']);
});

test('recusa resposta fora do contrato após duas tentativas', () => {
  let chamadas = 0;
  base.chamar = () => { chamadas++; return { ok: true, texto: JSON.stringify({ ...avaliacao, nota: 6 }), uso: null }; };
  delete require.cache[require.resolve('./.claude/scripts/lib/quiz-avaliador')];
  const leitor = require('./.claude/scripts/lib/quiz-avaliador');
  try {
    assert.equal(leitor.avaliar('Q2', questao, resposta).ok, false);
    assert.equal(chamadas, 2);
  } finally { base.chamar = original; }
});
