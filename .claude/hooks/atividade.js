'use strict';
// Stop, e StopFailure com `--interrompido`. O agente terminou de responder (ou
// parou no meio): esse instante fecha o turno e vira `turno.fim` no disco.
//
// Aqui também se marca o último sinal de vida, se conta a sessão quando o hook
// de envio não existe nesta versão do Claude Code, e de vez em quando se tenta
// subir a fila. Sem saída.
const estadoLib = require('../scripts/lib/estado');
const fila = require('../scripts/lib/fila');
const turnos = require('../scripts/lib/turnos');
const { enviar } = require('../scripts/lib/enviar');
const { agora, lerStdin } = require('../scripts/lib/util');

const INTERVALO_ENVIO_MS = 2 * 60 * 1000;
const interrompido = process.argv.includes('--interrompido');

async function main() {
  const entrada = await lerStdin();
  const e = estadoLib.carregar();
  if (e.sessao_atual && (!entrada.session_id || e.sessao_atual.id === entrada.session_id || !e.sessao_atual.id)) {
    if (!e.sessao_atual.id && entrada.session_id) e.sessao_atual.id = entrada.session_id;
    if (entrada.transcript_path) e.sessao_atual.transcricao = entrada.transcript_path;
    estadoLib.contarSessao(e);
    e.sessao_atual.ultima_atividade = agora();
    // Sem turno aberto, o hook de envio não rodou (versão sem UserPromptSubmit):
    // o turno é contado e fechado no mesmo instante, medindo zero de trabalho,
    // que é honesto — ninguém observou o começo — e não perde a contagem.
    turnos.fecharOuRegistrar(e, { interrompido });
  }
  const ultimo = e.ultimo_envio_tentado ? new Date(e.ultimo_envio_tentado).getTime() : 0;
  const deveTentar = fila.ler().length > 0 && Date.now() - ultimo > INTERVALO_ENVIO_MS;
  if (deveTentar) e.ultimo_envio_tentado = agora();
  estadoLib.salvar(e);
  if (deveTentar) await enviar({ timeoutMs: 2000, estado: estadoLib.carregar() });
}

main().catch(() => { /* silêncio: nada aqui pode atrapalhar a aula */ });
