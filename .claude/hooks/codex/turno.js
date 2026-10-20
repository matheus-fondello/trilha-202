'use strict';
// Antes de qualquer lib: o processo do hook do Codex não recebe CODEX_THREAD_ID (T0.17).
process.env.TRILHA_202_AGENTE = 'codex';
// UserPromptSubmit e Stop do Codex (branch codex). No Claude o envio e o fim de cada turno viram evento pelos hooks
// `turno.js` e `atividade.js`; no Codex quem os tira é a sincronização com a conversa (lib/codex/sessao.js), que todo
// comando da sala também roda. Aqui ela só roda mais cedo: o mesmo turno visto pelo hook e pelo comando é o mesmo
// evento, pelo id determinístico, e a trava não deixa os dois importarem juntos.
//
// A fila sobe de vez em quando, como no `atividade.js`: só no Stop, porque o UserPromptSubmit segura a mensagem do
// aluno até o hook sair. Sem saída, e sempre com 0.
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
  if (entrada.hook_event_name === 'UserPromptSubmit') return;

  const estadoLib = require('../../scripts/lib/estado');
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
