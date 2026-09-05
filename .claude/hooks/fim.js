'use strict';
// SessionEnd. Fecha a sessão no estado, registra duração e tenta subir a fila.
const estadoLib = require('../scripts/lib/estado');
const fila = require('../scripts/lib/fila');
const { enviar } = require('../scripts/lib/enviar');
const { agora, lerStdin, minutosEntre } = require('../scripts/lib/util');

async function main() {
  const entrada = await lerStdin();
  const e = estadoLib.carregar();
  const s = e.sessao_atual;
  if (s && (!entrada.session_id || !s.id || s.id === entrada.session_id)) {
    const fim = agora();
    const registro = { id: s.id, inicio: s.inicio, fim, minutos: Math.max(0, minutosEntre(s.inicio, fim)), aula: s.aula, turnos: s.turnos || 0, fechada_por: entrada.why_session_ended || entrada.reason || 'fim' };
    e.sessoes.push(registro);
    e.sessao_atual = null;
    estadoLib.salvar(e);
    fila.enfileirar('sessao.fim', registro, e);
  }
  await enviar({ timeoutMs: 4000, estado: estadoLib.carregar() });
}

main().catch(() => { /* silêncio */ });
