'use strict';
// O que o harness sabe de si mesmo via git: em que commit está e se os
// arquivos do harness batem com ele. Vai em todo evento, para o servidor
// conferir contra o repositório oficial: é a única detecção de harness
// modificado que sobrevive a um aluno que desmonta a guarda local. Tudo
// aqui falha em silêncio (sem git, sem repositório, git lento) e devolve
// nulo: nada disso pode atrasar ou travar a aula.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { RAIZ } = require('./paths');

// O que faz parte do harness. Estado, fila, memória e tmp estão no .gitignore
// e não entram.
const CAMINHOS = ['.claude', 'CLAUDE.md', 'REFERENCIAS.md', 'README.md', '.gitignore', 'trilha/mapa.json', 'trilha/config.json'];

function git(args) {
  return execFileSync('git', args, { cwd: RAIZ, encoding: 'utf8', timeout: 2000, stdio: ['ignore', 'pipe', 'ignore'] });
}

let cacheCommit;
function commit() {
  if (cacheCommit !== undefined) return cacheCommit;
  try { cacheCommit = git(['rev-parse', 'HEAD']).trim() || null; } catch { cacheCommit = null; }
  return cacheCommit;
}

// O commit lido do .git pelo Node, sem processo filho (branch codex): no sandbox
// do Codex o git pode não rodar, e sem commit o servidor não tem contra o que
// conferir o harness. Não resolve tudo o que o git resolve (ref simbólica
// encadeada, reftable): aí devolve null, como o git ausente. Nunca lança.
const SHA = /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/;
function commitPorArquivo() {
  try {
    let gitdir = path.join(RAIZ, '.git');
    // Worktree e submódulo: o .git é um arquivo que aponta para a pasta de
    // verdade. O HEAD está nela; os ramos, no `commondir` dela quando existe (o
    // worktree), senão nela mesma (o submódulo).
    if (fs.statSync(gitdir).isFile()) {
      const m = /^gitdir:\s*(.+?)\s*$/m.exec(fs.readFileSync(gitdir, 'utf8'));
      if (!m) return null;
      gitdir = path.resolve(RAIZ, m[1]);
    }
    let comum = gitdir;
    try { comum = path.resolve(gitdir, fs.readFileSync(path.join(gitdir, 'commondir'), 'utf8').trim()); } catch { /* sem commondir */ }
    const head = fs.readFileSync(path.join(gitdir, 'HEAD'), 'utf8').trim();
    if (SHA.test(head)) return head;
    const ref = (/^ref:\s*(\S+)$/.exec(head) || [])[1];
    // Só ref de dentro de refs/: um HEAD adulterado não faz ler arquivo fora do .git.
    if (!ref || !ref.startsWith('refs/') || ref.includes('\\') || ref.split('/').some((p) => !p || p === '.' || p === '..')) return null;
    // O ramo solto vale mais que o packed-refs: quando o ramo anda, o git grava
    // o solto e deixa a linha velha no packed-refs.
    for (const dir of new Set([gitdir, comum])) {
      try {
        const v = fs.readFileSync(path.join(dir, ...ref.split('/')), 'utf8').trim();
        if (SHA.test(v)) return v;
      } catch { /* não está solto aqui */ }
    }
    for (const dir of new Set([comum, gitdir])) {
      let texto;
      try { texto = fs.readFileSync(path.join(dir, 'packed-refs'), 'utf8'); } catch { continue; }
      for (const linha of texto.split('\n')) {
        const [sha, nome] = linha.trim().split(' ');
        if (nome === ref && SHA.test(sha)) return sha;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Arquivos do harness diferentes do commit, ordenados. Vazio = harness íntegro.
// Sem git, o padrão é `[]`, como sempre foi. `{ desconhecido: true }` devolve
// `null`, "não sei": só o modo Codex pede, porque lá o git pode não rodar no
// sandbox e o `[]` diria "íntegro" a todo evento. O cache guarda a lista ou o
// fato de ter falhado, nunca a resposta: uma chamada sem a opção não pode deixar
// o seu `[]` para a que pede o "não sei".
let cacheAlterados;
function alterados(opts) {
  if (cacheAlterados === undefined) {
    try {
      const saida = git(['status', '--porcelain', '--untracked-files=all', '--', ...CAMINHOS]);
      cacheAlterados = saida.split('\n').filter(Boolean).map((l) => l.slice(3).trim()).sort();
    } catch {
      cacheAlterados = null;
    }
  }
  if (cacheAlterados === null) return opts && opts.desconhecido ? null : [];
  return cacheAlterados;
}

module.exports = { commit, commitPorArquivo, alterados, CAMINHOS };
