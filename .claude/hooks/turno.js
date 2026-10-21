'use strict';
// UserPromptSubmit. O aluno enviou a mensagem: esse instante vira `turno.envio`
// no disco antes de qualquer outra coisa, com o relógio monotônico junto. Um
// processo morto depois disto não perde o turno — é o que impede a sessão de
// fechar com fim igual ao início quando o agente é encerrado sem aviso.
//
// É aqui também que a sessão passa a contar: a janela aberta e abandonada não é
// aula, o primeiro envio é. Não bloqueia nada, e a única saída é o aviso ao
// tutor de um chat retomado cuja aula já fechou (21/10): num chat retomado o
// aplicativo não roda o início, e este é o único hook que fala com ele.
const estadoLib = require('../scripts/lib/estado');
const turnos = require('../scripts/lib/turnos');
const { lerStdin } = require('../scripts/lib/util');

async function main() {
  const entrada = await lerStdin();
  const e = estadoLib.carregar();
  estadoLib.retomarSessao(e, entrada);
  const s = e.sessao_atual;
  if (!s) return;
  if (entrada.session_id && s.id && s.id !== entrada.session_id) return;
  if (!s.id && entrada.session_id) s.id = entrada.session_id;
  if (entrada.transcript_path) s.transcricao = entrada.transcript_path;
  estadoLib.contarSessao(e);
  turnos.abrir(e);
  // Uma vez por chat: o resumo só é carregado quando há o que avisar, porque
  // este hook está na frente de toda mensagem.
  const fechada = estadoLib.aulaFechadaDoChat(e);
  const aviso = fechada ? require('../scripts/lib/resumo').avisoAulaFechada(e, fechada) : null;
  if (fechada) s.aviso_fechada = fechada;
  estadoLib.salvar(e);
  if (aviso) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: aviso } }));
}

main().catch(() => { /* silêncio: nada aqui pode atrapalhar a aula */ });
