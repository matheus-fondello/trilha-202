'use strict';
// Rede de segurança da guarda: detecta alteração local no harness (fora do
// commit) e a registra uma vez, quando o conjunto muda. Não reverte nada, de
// propósito: em desenvolvimento o repositório fica sujo o tempo todo, e um
// checkout automático apagaria trabalho. Só avisa o tutor e sobe um evento.
const fila = require('./fila');
const git = require('./git');

const listar = git.alterados;

// Compara com o que já foi registrado no estado e enfileira só a diferença.
// Devolve a lista atual (vazia = harness igual ao commit).
function registrar(e, origem) {
  // No modo Codex (branch codex) o git pode não rodar no sandbox, e a lista vazia de hoje diria "o harness voltou ao
  // commit": o registro seria zerado, e a mesma alteração subiria de novo no primeiro chat com git. Sem saber, o
  // registro fica como estava, e o tutor não ouve falar de uma lista que não foi conferida agora. As variáveis vêm
  // antes do require, como em fila.js: o hook do Claude não carrega o agente.js.
  if ((process.env.TRILHA_202_AGENTE || process.env.CODEX_THREAD_ID) && require('./agente').atual() === 'codex' && listar({ desconhecido: true }) === null) return [];
  const atual = listar();
  const anterior = Array.isArray(e.harness_alteracoes) ? e.harness_alteracoes : [];
  if (atual.join('\n') !== anterior.join('\n')) {
    e.harness_alteracoes = atual;
    // A lista vai com teto: uma pasta de dependências dentro de .claude/ dá
    // milhares de arquivos, e o evento grande vira quarentena no CRM e some do
    // painel como alarme.
    if (atual.length) fila.enfileirar('harness.alterado', { arquivos: atual.slice(0, 200), total: atual.length, origem }, e);
  }
  return atual;
}

module.exports = { listar, registrar, CAMINHOS: git.CAMINHOS };
