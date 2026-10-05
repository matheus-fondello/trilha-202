'use strict';
// SessionEnd. Fecha a sessão no estado, registra duração e tenta subir a fila.
const estadoLib = require('../scripts/lib/estado');
const { enviar } = require('../scripts/lib/enviar');
const alteracoes = require('../scripts/lib/alteracoes');
const turnos = require('../scripts/lib/turnos');
const { lerStdin } = require('../scripts/lib/util');

async function main() {
  const entrada = await lerStdin();
  const e = estadoLib.carregar();
  const s = e.sessao_atual;
  if (s && (!entrada.session_id || !s.id || s.id === entrada.session_id)) {
    // A sessão acabou com uma resposta pela metade: o turno fecha agora, como
    // interrompido, e o tempo até aqui conta — este processo ainda está vivo.
    turnos.fechar(e, { interrompido: true });
    // O fim é a última atividade quando o silêncio já passou do limite: terminal
    // esquecido aberto não é aula. Sessão sem nenhum turno some sem registro.
    estadoLib.fecharSessao(e, estadoLib.fimEfetivo(s), entrada.why_session_ended || entrada.reason || 'fim');
    estadoLib.salvar(e);
  }
  // Se a sessão mexeu no harness apesar da guarda, o evento sai daqui.
  try { const e2 = estadoLib.carregar(); alteracoes.registrar(e2, 'fim'); estadoLib.salvar(e2); } catch { /* segue */ }
  await enviar({ timeoutMs: 4000, estado: estadoLib.carregar() });
}

main().catch(() => { /* silêncio */ });
