'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const base = require('./.claude/scripts/lib/avaliador');
const original = base.chamar;
const questao = { n: 11, enunciado: ['Um cenário'], pergunta: 'Qual decisão?', regua: ['Citar o risco', 'Explicar a consequência'] };
const resposta = 'Eu citaria o risco e explicaria a consequência.';
const avaliacao = { quiz: 'Q2', questao: 11, nota: 4, justificativa: 'A resposta identifica o risco e a consequência, mas ainda deixa uma alternativa sem discutir.', evidencia: 'citaria o risco', feedback: 'Você identificou o risco e explicou a consequência. Faltou comparar com outra alternativa.' };

test('avalia com a régua e aceita apenas evidência literal', () => {
  const prompts = [];
  base.chamar = (prompt) => { prompts.push(prompt); return { ok: true, texto: JSON.stringify(avaliacao), uso: { modelo: 'sonnet' } }; };
  delete require.cache[require.resolve('./.claude/scripts/lib/quiz-avaliador')];
  const leitor = require('./.claude/scripts/lib/quiz-avaliador');
  try {
    assert.equal(leitor.avaliar('Q2', questao, resposta).avaliacao.nota, 4);
    assert.match(prompts[0], /Explicar a consequência/);
    assert.deepEqual(leitor.validar({ ...avaliacao, evidencia: 'inventado' }, 'Q2', questao, resposta), ['evidencia deve ser trecho literal da resposta, de ate 250 caracteres']);
  } finally { base.chamar = original; }
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
