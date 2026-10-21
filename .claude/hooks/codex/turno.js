'use strict';
// Antes de qualquer lib: o processo do hook do Codex não recebe CODEX_THREAD_ID (T0.17).
process.env.TRILHA_202_AGENTE = 'codex';
// UserPromptSubmit e Stop do Codex (branch codex). No Claude o envio e o fim de cada turno viram evento pelos hooks
// `turno.js` e `atividade.js`; no Codex quem os tira é a sincronização com a conversa (lib/codex/sessao.js), que todo
// comando da sala também roda. Aqui ela só roda mais cedo: o mesmo turno visto pelo hook e pelo comando é o mesmo
// evento, pelo id determinístico, e a trava não deixa os dois importarem juntos.
//
// A fila sobe de vez em quando, como no `atividade.js`: só no Stop, porque o UserPromptSubmit segura a mensagem do
// aluno até o hook sair. Sai sempre com 0. As saídas são duas (21/10): no envio, o aviso ao chat retomado cuja aula já
// fechou; no Stop, a cobrança de lib/codex/cobranca.js, que faz o Codex continuar o turno.
//
// O Stop não fecha o turno em andamento, e não adianta esperar por isso: o Codex roda o Stop dentro do turno (ele pode
// pedir que o turno continue) e só grava o `task_complete` depois que o hook sai (codex-rs, session/turn.rs e
// tasks/mod.rs). Esperar aqui só atrasaria cada turno até o teto (A5 do Davi, 20/10). O fim entra na sincronização
// seguinte, com o horário do `task_complete`.
const INTERVALO_ENVIO_MS = 2 * 60 * 1000;

async function main() {
  const { lerStdin, agora } = require('../../scripts/lib/util');
  const entrada = await lerStdin();
  // A chave de desligar (T13): com `codex.ativo: false` no config da sala, ou TRILHA_202_CODEX=0, o hook confiado não
  // faz nada, como se não existisse. Sem isto o aluno seguiria sincronizando e recebendo o resumo do Codex. Depois de
  // ler a entrada, para o Codex não escrever num cano já fechado.
  if (require('../../scripts/lib/agente').atual() !== 'codex') return;
  if (!entrada.session_id) return;
  const sessao = require('../../scripts/lib/codex/sessao');
  try { sessao.sincronizar(entrada.session_id); } catch (err) { sessao.avisarErro(err); }
  const estadoLib = require('../../scripts/lib/estado');
  if (entrada.hook_event_name === 'UserPromptSubmit') {
    // O chat antigo retomado depois de a aula dele fechar (21/10), como no `turno.js` do Claude: o tutor daqui só vê
    // a conversa velha. Uma vez por chat, marcado sob a trava.
    // O começo do turno fica marcado para o Stop saber o que este turno tentou (lib/codex/cobranca.js).
    const aviso = sessao.comTrava(() => {
      const e = estadoLib.carregar();
      const s = e.sessao_atual;
      if (!s || s.id !== entrada.session_id) return null;
      s.envio_em = agora();
      const fechada = estadoLib.aulaFechadaDoChat(e);
      if (fechada) s.aviso_fechada = fechada;
      estadoLib.salvar(e);
      return fechada ? require('../../scripts/lib/resumo').avisoAulaFechada(e, fechada) : null;
    });
    if (aviso) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: aviso } }));
    return;
  }

  // A cobrança do fim do turno (21/10): o registro desmente o que o tutor acabou de fazer, e o Codex continua o turno
  // com o motivo. Só na primeira parada do turno (`stop_hook_active`), para não prender o tutor num laço.
  if (!entrada.stop_hook_active) {
    const cobranca = require('../../scripts/lib/codex/cobranca');
    const motivo = sessao.comTrava(() => {
      const e = estadoLib.carregar();
      const s = e.sessao_atual;
      if (!s || s.id !== entrada.session_id) return null;
      const cobrar = cobranca.fechamento(e, s, entrada.last_assistant_message) || cobranca.avaliacao(e, s);
      if (!cobrar) return null;
      cobrar.marcar();
      estadoLib.salvar(e);
      return cobrar.texto;
    });
    if (motivo) process.stdout.write(JSON.stringify({ decision: 'block', reason: motivo }));
  }

  const fila = require('../../scripts/lib/fila');
  // A marca do último envio é gravada sob a trava: um estado gravado fora dela apagaria o que um comando do mesmo
  // turno acabou de importar.
  const deveTentar = sessao.comTrava(() => {
    const e = estadoLib.carregar();
    const ultimo = e.ultimo_envio_tentado ? new Date(e.ultimo_envio_tentado).getTime() : 0;
    if (!(fila.ler().length > 0 && Date.now() - ultimo > INTERVALO_ENVIO_MS)) return false;
    e.ultimo_envio_tentado = agora();
    estadoLib.salvar(e);
    return true;
  });
  if (deveTentar) await require('../../scripts/lib/enviar').enviar({ timeoutMs: 2000, estado: estadoLib.carregar() });
}

main().catch(() => { /* silêncio: nada aqui pode atrapalhar a aula */ }).finally(() => { process.exitCode = 0; });
