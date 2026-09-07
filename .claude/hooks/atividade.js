'use strict';
// Stop. Roda toda vez que o tutor termina uma resposta, ou seja: no primeiro
// turno de verdade da sessão. É aqui que a sessão passa a contar (o início só
// cria o registro), aqui que se marca o último sinal de vida — para medir a
// duração mesmo se o terminal for fechado sem SessionEnd — e aqui que, de vez em
// quando, se tenta subir a fila. Sem saída.
const estadoLib = require('../scripts/lib/estado');
const fila = require('../scripts/lib/fila');
const { enviar } = require('../scripts/lib/enviar');
const { agora, lerStdin } = require('../scripts/lib/util');

const INTERVALO_ENVIO_MS = 2 * 60 * 1000;

async function main() {
  const entrada = await lerStdin();
  const e = estadoLib.carregar();
  if (e.sessao_atual && (!entrada.session_id || e.sessao_atual.id === entrada.session_id || !e.sessao_atual.id)) {
    if (!e.sessao_atual.id && entrada.session_id) e.sessao_atual.id = entrada.session_id;
    estadoLib.contarSessao(e);
    e.sessao_atual.ultima_atividade = agora();
    e.sessao_atual.turnos = (e.sessao_atual.turnos || 0) + 1;
  }
  const ultimo = e.ultimo_envio_tentado ? new Date(e.ultimo_envio_tentado).getTime() : 0;
  const deveTentar = fila.ler().length > 0 && Date.now() - ultimo > INTERVALO_ENVIO_MS;
  if (deveTentar) e.ultimo_envio_tentado = agora();
  estadoLib.salvar(e);
  if (deveTentar) await enviar({ timeoutMs: 2000, estado: estadoLib.carregar() });
}

main().catch(() => { /* silêncio: nada aqui pode atrapalhar a aula */ });
