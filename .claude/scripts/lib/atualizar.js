'use strict';
// Atualização automática da sala. Roda no início de todo chat novo (hook de
// início), antes de qualquer outro módulo do harness ser carregado, para que o
// resto do hook já rode o código e leia o mapa que acabaram de chegar.
//
// Só avança quando é seguro, e nunca destrói nada: na `main`, sem arquivo
// versionado alterado, e por fast-forward. Harness mexido continua sendo
// assunto do `harness.alterado`, não de um script que apague a mudança. Sem
// rede, sem git ou com git lento, desiste em silêncio: atualizar nunca trava
// a aula.
//
// Desliga com TRILHA_202_ATUALIZAR=0 ou com o arquivo `trilha/sem-atualizar`
// (fora do controle de versão): é para quem desenvolve o harness numa cópia
// que não pode andar sozinha, e para os testes.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { RAIZ, TRILHA } = require('./paths');

const RAMO = 'main';
const DESLIGA = path.join(TRILHA, 'sem-atualizar');

function git(args, timeout = 3000) {
  return execFileSync('git', args, {
    cwd: RAIZ,
    encoding: 'utf8',
    timeout,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'ignore'],
    // O repositório é público: o fetch não pede credencial, e se um dia pedir,
    // falha na hora em vez de abrir janela de senha na frente do aluno.
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' },
  }).trim();
}

// Devolve { atualizada: true, de, para, commits } ou { atualizada: false, motivo }.
function atualizar() {
  if (process.env.TRILHA_202_ATUALIZAR === '0' || fs.existsSync(DESLIGA)) return { atualizada: false, motivo: 'desligada' };
  let de;
  try { de = git(['rev-parse', 'HEAD']); } catch { return { atualizada: false, motivo: 'sem-git' }; }
  try {
    if (git(['symbolic-ref', '--short', 'HEAD']) !== RAMO) return { atualizada: false, motivo: 'fora-da-main' };
  } catch { return { atualizada: false, motivo: 'fora-da-main' }; }
  try {
    if (git(['status', '--porcelain', '--untracked-files=no'])) return { atualizada: false, motivo: 'alterada' };
  } catch { return { atualizada: false, motivo: 'sem-git' }; }

  try { git(['fetch', '--quiet', '--no-tags', 'origin', RAMO], 6000); } catch { return { atualizada: false, motivo: 'sem-rede' }; }

  try {
    const para = git(['rev-parse', 'FETCH_HEAD']);
    if (para === de) return { atualizada: false, motivo: 'em-dia' };
    // Cópia local à frente ou divergente (quem desenvolve, com commit sem push):
    // não é atualização, e o fast-forward recusaria de qualquer jeito.
    try { git(['merge-base', '--is-ancestor', 'HEAD', 'FETCH_HEAD']); } catch { return { atualizada: false, motivo: 'divergente' }; }
    const commits = Number(git(['rev-list', '--count', 'HEAD..FETCH_HEAD'])) || null;
    git(['merge', '--ff-only', '--quiet', 'FETCH_HEAD'], 8000);
    return { atualizada: true, de, para, commits };
  } catch {
    return { atualizada: false, motivo: 'falhou' };
  }
}

module.exports = { atualizar, DESLIGA };
