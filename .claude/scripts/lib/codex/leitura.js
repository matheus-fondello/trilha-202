'use strict';
// A leitura que o sandbox do Codex bloqueou (branch codex, T6). Vários pontos do código comum engolem o erro de
// leitura em silêncio (a credencial, a conversa, o produto da oficina, o documento e a pasta da prática): no Claude é o
// certo, porque o arquivo que não abre é arquivo que não existe mais. No sandbox do Codex não é: no `elevated`, abrir
// uma conversa movida de outra pasta já deu EPERM (T0.8), e engolir isso viraria material faltando para o avaliador,
// nota sobre o que o aluno fez sem o que ele fez. Aqui o erro vira pendência de sandbox.
//
// O código do erro é testado antes do agente: no Claude, um ENOENT nunca carrega nada além disto.
const BLOQUEIO = new Set(['EPERM', 'EACCES']);

function bloqueada(err) {
  if (!err || !BLOQUEIO.has(err.code)) return false;
  return require('../agente').atual() === 'codex';
}

// O motivo, em português claro, do que não abriu.
const motivo = (oque) => `o sandbox do Codex não deixou este comando ler ${oque}`;

module.exports = { bloqueada, motivo };
