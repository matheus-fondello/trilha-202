'use strict';
// UserPromptSubmit. O aluno enviou a mensagem: esse instante vira `turno.envio`
// no disco antes de qualquer outra coisa, com o relógio monotônico junto. Um
// processo morto depois disto não perde o turno — é o que impede a sessão de
// fechar com fim igual ao início quando o agente é encerrado sem aviso.
//
// É aqui também que a sessão passa a contar: a janela aberta e abandonada não é
// aula, o primeiro envio é. Sem saída, sem bloquear nada.
const estadoLib = require('../scripts/lib/estado');
const turnos = require('../scripts/lib/turnos');
const { lerStdin } = require('../scripts/lib/util');

async function main() {
  const entrada = await lerStdin();
  const e = estadoLib.carregar();
  const s = e.sessao_atual;
  if (!s) return;
  if (entrada.session_id && s.id && s.id !== entrada.session_id) return;
  if (!s.id && entrada.session_id) s.id = entrada.session_id;
  if (entrada.transcript_path) s.transcricao = entrada.transcript_path;
  estadoLib.contarSessao(e);
  turnos.abrir(e);
  estadoLib.salvar(e);
}

main().catch(() => { /* silêncio: nada aqui pode atrapalhar a aula */ });
