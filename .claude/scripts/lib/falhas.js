'use strict';
// Quando a avaliação de uma aula desiste de vez. O `avaliar` (trilha.js, desistir) registra a falha, e o resumo
// (lib/resumo.js, avaliacoesPendentes) decide o que o chat seguinte roda sozinho; os dois perguntam aqui, para não
// divergirem.
//
// Três falhas em chats diferentes (11/10) são desistência: o chat seguinte para de tentar, e uma avaliação que não tem
// como dar certo não gasta a cota do aluno em todo chat. Duas exceções:
// - a falha que vinha de defeito da procura do Claude Code (não achado; o EOF/EPIPE do cmd.exe) volta a tentar sempre;
// - a que não achou a transcrição volta a tentar uma vez a cada versão nova da sala (22/10). Quem não achava era, às
//   vezes, a própria sala (a busca por horário do Codex não olhava as conversas arquivadas), e consertar a sala não
//   fazia a avaliação voltar sozinha. A falha guarda o commit em que aconteceu; numa versão nova, a aula volta à lista
//   uma vez, e se falhar de novo, a falha passa a ser desta versão.
const git = require('./git');

const MAX_FALHAS = 3;
const VOLTA_A_TENTAR = /não encontrei o (Claude Code|comando `claude`)|cmd\.exe (EOF|EPIPE)/;
const NA_VERSAO_NOVA = /não encontrei a transcrição/;

function versao() {
  try { return git.commit() || git.commitPorArquivo() || null; } catch { return null; }
}

// `atual` pode vir como função, para o commit só ser lido quando há uma falha a julgar. A falha gravada antes desta
// regra não tem o campo `commit` e volta uma vez; a gravada sem saber o commit (`commit: null`) não volta, senão
// voltaria em todo chat.
function definitiva(reg, atual = versao) {
  const f = reg && reg.avaliacao_falhou;
  if (!f || (f.vezes || 1) < MAX_FALHAS) return false;
  if (VOLTA_A_TENTAR.test(f.motivo || '')) return false;
  if (NA_VERSAO_NOVA.test(f.motivo || '')) {
    const agora = typeof atual === 'function' ? atual() : atual;
    const deOutraVersao = !('commit' in f) || (f.commit !== null && f.commit !== agora);
    if (agora && deOutraVersao) return false;
  }
  return true;
}

// A nova tentativa de uma falha que já era definitiva, e que falhou de novo pelo mesmo motivo: não é falha nova. O
// `avaliar` só atualiza a versão, sem outro evento nem outra contagem; a 202 já sabe dela.
function reincidente(antes, motivo) {
  return Boolean(antes && (antes.vezes || 0) >= MAX_FALHAS && antes.motivo === motivo);
}

module.exports = { MAX_FALHAS, VOLTA_A_TENTAR, definitiva, reincidente, versao };
