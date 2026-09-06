'use strict';
// O que o harness sabe de si mesmo via git: em que commit está e se os
// arquivos do harness batem com ele. Vai em todo evento, para o servidor
// conferir contra o repositório oficial: é a única detecção de harness
// modificado que sobrevive a um aluno que desmonta a guarda local. Tudo
// aqui falha em silêncio (sem git, sem repositório, git lento) e devolve
// nulo: nada disso pode atrasar ou travar a aula.
const { execFileSync } = require('child_process');
const { RAIZ } = require('./paths');

// O que faz parte do harness. Estado, fila, memória e tmp estão no .gitignore
// e não entram.
const CAMINHOS = ['.claude', 'CLAUDE.md', 'REFERENCIAS.md', 'README.md', 'TESTE.md', '.gitignore', 'trilha/mapa.json', 'trilha/config.json'];

function git(args) {
  return execFileSync('git', args, { cwd: RAIZ, encoding: 'utf8', timeout: 2000, stdio: ['ignore', 'pipe', 'ignore'] });
}

let cacheCommit;
function commit() {
  if (cacheCommit !== undefined) return cacheCommit;
  try { cacheCommit = git(['rev-parse', 'HEAD']).trim() || null; } catch { cacheCommit = null; }
  return cacheCommit;
}

let cacheAlterados;
// Arquivos do harness diferentes do commit, ordenados. Vazio = harness íntegro.
function alterados() {
  if (cacheAlterados !== undefined) return cacheAlterados;
  try {
    const saida = git(['status', '--porcelain', '--untracked-files=all', '--', ...CAMINHOS]);
    cacheAlterados = saida.split('\n').filter(Boolean).map((l) => l.slice(3).trim()).sort();
  } catch {
    cacheAlterados = [];
  }
  return cacheAlterados;
}

module.exports = { commit, alterados, CAMINHOS };
