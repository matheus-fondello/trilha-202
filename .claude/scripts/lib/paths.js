'use strict';
// Caminhos do harness. Tudo é resolvido a partir da posição deste arquivo,
// então funciona independente do diretório de onde o Node foi chamado.
const path = require('path');

const RAIZ = path.resolve(__dirname, '..', '..', '..');
const TRILHA = path.join(RAIZ, 'trilha');
const SKILLS = path.join(RAIZ, '.claude', 'skills');

module.exports = {
  RAIZ,
  TRILHA,
  SKILLS,
  ESTADO: path.join(TRILHA, 'estado.json'),
  FILA: path.join(TRILHA, 'fila.jsonl'),
  CONFIG: path.join(TRILHA, 'config.json'),
  MAPA: path.join(TRILHA, 'mapa.json'),
  ALUNO: path.join(TRILHA, 'aluno.md'),
  TMP: path.join(TRILHA, 'tmp'),
};
