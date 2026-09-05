'use strict';
// Stop. Roda toda vez que o tutor termina uma resposta. Só marca o último
// sinal de vida da sessão (para medir duração mesmo se o terminal for fechado
// sem SessionEnd) e, de vez em quando, tenta subir a fila. Sem saída.
const estadoLib = require('../scripts/lib/estado');
const fila = require('../scripts/lib/fila');
const { enviar } = require('../scripts/lib/enviar');
const { agora, lerStdin } = require('../scripts/lib/util');

const INTERVALO_ENVIO_MS = 2 * 60 * 1000;

async function main() {
  const entrada = await lerStdin();
  const e = estadoLib.carregar();
  if (e.sessao_atual && (!entrada.session_id || e.sessao_atual.id === entrada.session_id || !e.sessao_atual.id)) {
    e.sessao_atual.ultima_atividade = agora();
    e.sessao_atual.turnos = (e.sessao_atual.turnos || 0) + 1;
    if (!e.sessao_atual.id && entrada.session_id) e.sessao_atual.id = entrada.session_id;
  }
  const ultimo = e.ultimo_envio_tentado ? new Date(e.ultimo_envio_tentado).getTime() : 0;
  const deveTentar = fila.ler().length > 0 && Date.now() - ultimo > INTERVALO_ENVIO_MS;
  if (deveTentar) e.ultimo_envio_tentado = agora();
  estadoLib.salvar(e);
  if (deveTentar) await enviar({ timeoutMs: 2000, estado: estadoLib.carregar() });
}

main().catch(() => { /* silêncio: nada aqui pode atrapalhar a aula */ });
