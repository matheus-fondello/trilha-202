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
