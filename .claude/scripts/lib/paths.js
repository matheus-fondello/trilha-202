'use strict';
// Caminhos do harness. Tudo é resolvido a partir da posição deste arquivo,
// então funciona independente do diretório de onde o Node foi chamado.
const os = require('os');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..', '..', '..');
const TRILHA = path.join(RAIZ, 'trilha');
const SKILLS = path.join(RAIZ, '.claude', 'skills');
const PRATICAS = path.join(RAIZ, 'praticas');

module.exports = {
  RAIZ,
  TRILHA,
  SKILLS,
  PRATICAS,
  ESTADO: path.join(TRILHA, 'estado.json'),
  FILA: path.join(TRILHA, 'fila.jsonl'),
  CONFIG: path.join(TRILHA, 'config.json'),
  MAPA: path.join(TRILHA, 'mapa.json'),
  ALUNO: path.join(TRILHA, 'aluno.md'),
  TMP: path.join(TRILHA, 'tmp'),
  // O acesso à 202 mora fora do repositório, na pasta pessoal: o repositório é
  // público, e um token commitado é um token vazado. A variável troca o lugar
  // (os testes usam, para não tocar no acesso de quem roda).
  CREDENCIAIS: process.env.TRILHA_202_CREDENCIAIS || path.join(os.homedir(), '.trilha-202', 'credenciais.json'),
};
