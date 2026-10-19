'use strict';
// Qual agente roda este processo: o Claude Code, o Codex, ou nenhum (um terminal comum). Todo ramo do modo Codex
// decide por `atual() === 'codex'`, e nunca pela presença de uma variável: um Claude aberto de um terminal do Codex
// herda CODEX_THREAD_ID e as marcas de sandbox, e tem de seguir sendo Claude.
//
// O caminho do Claude não paga nada por isto: sem CODEX_THREAD_ID, a resposta sai só do ambiente, sem tocar o disco
// e sem carregar o leitor da conversa. Este módulo é carregado pelos hooks, que o Claude Code espera terminar.
const fs = require('fs');
const { CONFIG } = require('./paths');

// O que vale sem o Codex: é o que a sala faz hoje, pelo id que o Claude Code põe no ambiente de todo comando.
const deHoje = (env) => (env.CLAUDE_CODE_SESSION_ID ? 'claude' : null);

// A 202 desliga o modo Codex pelo config da sala (sobe para todos com a atualização automática); um aluno, pela
// variável. Config sem a chave `codex` é config de antes do branch: ligado.
function desligado(env) {
  if (env.TRILHA_202_CODEX === '0') return true;
  let cfg = {};
  try { cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8')) || {}; } catch (e) { if (e.code !== 'ENOENT') throw e; }
  return (cfg.codex || {}).ativo === false;
}

function decidir(env) {
  // Os hooks do Codex não recebem CODEX_THREAD_ID, só o `session_id` no payload: o adaptador de cada hook define
  // esta variável no próprio processo, antes de carregar qualquer lib.
  if (env.TRILHA_202_AGENTE === 'codex') return desligado(env) ? deHoje(env) : 'codex';
  if (!env.CODEX_THREAD_ID) return deHoje(env);
  if (desligado(env)) return deHoje(env);
  // Só aqui o leitor da conversa é carregado.
  const rollout = require('./codex/rollout');
  const arquivo = rollout.achar(env.CODEX_THREAD_ID);
  if (!arquivo) return deHoje(env);
  if (!env.CLAUDE_CODE_SESSION_ID) return 'codex';
  // Os dois ids: um herdou o do outro. O Codex aberto de um terminal do Claude está no meio de um turno (é ele que
  // roda o comando); o Claude aberto de um terminal do Codex herdou o id de um chat parado.
  return rollout.emAndamento(arquivo) ? 'codex' : 'claude';
}

// O resultado fica na memória do processo: com CODEX_THREAD_ID herdado num Claude, cada evento varreria sessions/**
// de novo, contra o teto de 300 ms dos hooks. A chave é o ambiente que decide, para um processo que o troque (os
// testes) não ler a resposta velha.
let guardado = null;
function atual() {
  const env = process.env;
  const chave = [env.TRILHA_202_AGENTE, env.CODEX_THREAD_ID, env.CLAUDE_CODE_SESSION_ID, env.TRILHA_202_CODEX, env.CODEX_HOME].join('\u0000');
  if (guardado && guardado.chave === chave) return guardado.valor;
  let valor;
  // Qualquer erro, de disco ou de formato, devolve o que a sala faz hoje.
  try { valor = decidir(env); } catch { valor = deHoje(env); }
  guardado = { chave, valor };
  return valor;
}

// O id do chat que chamou o comando. No hook do Codex ele vem no payload (`session_id`), não no ambiente: aqui é null.
function idDoChat() {
  const a = atual();
  if (a === 'codex') return process.env.CODEX_THREAD_ID || null;
  if (a === 'claude') return process.env.CLAUDE_CODE_SESSION_ID || null;
  return null;
}

module.exports = { atual, idDoChat };
