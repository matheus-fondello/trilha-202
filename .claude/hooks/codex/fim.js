'use strict';
// Antes de qualquer lib: o processo do hook do Codex não recebe CODEX_THREAD_ID (T0.17).
process.env.TRILHA_202_AGENTE = 'codex';
// SessionEnd do Codex (branch codex). O aplicativo encerra a sessão quando o aluno sai do chat, e o Codex dá a este
// hook no máximo 3 s. Os últimos turnos entram pela sincronização, e a sessão fecha pelo último sinal de vida, como no
// `fim.js` do Claude. A volta a este chat sai com `retomada` no primeiro turno: o `fechada_por` daqui não é o de quem
// só cedeu a vez a outra sessão, e o `retomarSessao` marca a retomada.
//
// Sem rede: a fila sobe no próximo comando ou hook, e o fim não arrisca o prazo esperando o servidor. Sem saída, e
// sempre com 0.
async function main() {
  const { lerStdin } = require('../../scripts/lib/util');
  const entrada = await lerStdin();
  const id = entrada.session_id;
  if (!id) return;
  const estadoLib = require('../../scripts/lib/estado');
  const sessao = require('../../scripts/lib/codex/sessao');
  // A leitura da conversa toma a trava e a solta; o fechamento toma de novo e relê o estado. Entre as duas, um comando
  // que sincronize só acrescenta turnos: o fechamento os vê.
  try { sessao.sincronizar(id); } catch (err) { sessao.avisarErro(err); }
  const alteracoes = require('../../scripts/lib/alteracoes');
  sessao.comTrava(() => {
    const e = estadoLib.carregar();
    const s = e.sessao_atual;
    if (s && s.id === id) {
      estadoLib.fecharSessao(e, estadoLib.fimEfetivo(s), 'codex-fim');
      // O turno que ficou sem fim (o aluno saiu no meio da resposta) segue para a próxima sincronização, como órfão.
      const c = ((e.codex || {}).chats || {})[id];
      if (c) c.aberto = Object.values(c.turnos || {}).some((r) => !r.fim);
    }
    // Se a sessão mexeu no harness apesar da guarda, o evento sai daqui, como no `fim.js`.
    try { alteracoes.registrar(e, 'fim'); } catch { /* sem git: segue */ }
    estadoLib.salvar(e);
  });
}

main().catch(() => { /* silêncio */ }).finally(() => { process.exitCode = 0; });
