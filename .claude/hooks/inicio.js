'use strict';
// SessionStart. Roda quando o aluno abre o Claude Code na sala (startup),
// retoma uma sessão (resume), limpa o chat (clear) ou o contexto compacta.
// Injeta o estado no contexto do tutor e tenta subir a fila. Nunca falha:
// qualquer erro vira uma linha de aviso e a aula segue.
const fs = require('fs');
const paths = require('../scripts/lib/paths');
const estadoLib = require('../scripts/lib/estado');
const mapa = require('../scripts/lib/mapa');
const fila = require('../scripts/lib/fila');
const { enviar } = require('../scripts/lib/enviar');
const { resumo } = require('../scripts/lib/resumo');
const alteracoes = require('../scripts/lib/alteracoes');
const { agora, lerStdin, minutosEntre } = require('../scripts/lib/util');

async function main() {
  const entrada = await lerStdin();
  const fonte = entrada.how_session_started || entrada.source || 'startup';
  const e = estadoLib.carregar();

  if (fonte !== 'compact') {
    // Sessão anterior que não fechou (terminal morto, máquina desligada): fecha pelo último sinal de vida.
    if (e.sessao_atual && e.sessao_atual.id !== entrada.session_id) {
      fecharSessao(e, e.sessao_atual.ultima_atividade || e.sessao_atual.inicio, 'recuperada');
    }
    if (!e.sessao_atual || e.sessao_atual.id !== entrada.session_id) {
      e.sessao_atual = { id: entrada.session_id || null, inicio: agora(), ultima_atividade: agora(), aula: e.aula_atual, turnos: 0 };
      const a = mapa.aula(e.aula_atual);
      const reg = estadoLib.registroAula(e, a.id);
      reg.sessoes = (reg.sessoes || 0) + 1;
      if (reg.status === 'nao_iniciada' && mapa.escrita(a)) {
        reg.status = 'em_andamento';
        reg.iniciada_em = agora();
        fila.enfileirar('aula.inicio', { aula: a.id }, e);
      }
      fila.enfileirar('sessao.inicio', { fonte, aula: e.aula_atual }, e);
    }
    estadoLib.salvar(e);
    // O rascunho da avaliação vive em trilha/tmp só até o `avaliar` consumir. Se
    // ficou para trás (validação falhou, terminal fechou), não pode ser lido por
    // uma sessão seguinte: some no início de todo chat.
    try { fs.rmSync(paths.TMP, { recursive: true, force: true }); } catch { /* segue */ }
  }

  // Rede de segurança da guarda: harness diferente do commit vira evento (uma
  // vez por mudança) e uma linha para o tutor. Não reverte nada.
  let sujo = [];
  try { sujo = alteracoes.registrar(e, 'inicio'); estadoLib.salvar(e); } catch { /* sem git: segue */ }

  const texto = resumo(e, { fonte });
  const envio = await enviar({ timeoutMs: 2500, estado: e });
  const aviso = envio.ok ? '' : `\n(Fila local: ${envio.pendentes} evento(s) aguardando envio; ${envio.motivo}. Isso não afeta a aula, não comente com o aluno.)`;
  const avisoHarness = sujo.length ? `\n(Harness com alteração local fora do commit: ${sujo.join(', ')}. Isso já foi registrado. Não edite nada do harness a partir daqui e não comente com o aluno.)` : '';

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: texto + aviso + avisoHarness },
  }));
}

function fecharSessao(e, fimIso, motivo) {
  const s = e.sessao_atual;
  const registro = { id: s.id, inicio: s.inicio, fim: fimIso, minutos: Math.max(0, minutosEntre(s.inicio, fimIso)), aula: s.aula, turnos: s.turnos || 0, fechada_por: motivo };
  e.sessoes.push(registro);
  e.sessao_atual = null;
  fila.enfileirar('sessao.fim', registro, e);
}

main().catch((err) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: `Harness: o hook de início falhou (${err.message}). Siga a aula normalmente e, se puder, rode \`node .claude/scripts/trilha.js status\` para ver o estado.` },
  }));
});
