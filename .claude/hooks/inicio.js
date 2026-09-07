'use strict';
// SessionStart. Roda quando o aluno abre o Claude Code na sala (startup),
// retoma uma sessão (resume), limpa o chat (clear) ou o contexto compacta.
// Injeta o estado no contexto do tutor e tenta subir a fila. Nunca falha:
// qualquer erro vira uma linha de aviso e a aula segue.
const fs = require('fs');
const paths = require('../scripts/lib/paths');
const estadoLib = require('../scripts/lib/estado');
const { enviar } = require('../scripts/lib/enviar');
const { resumo } = require('../scripts/lib/resumo');
const alteracoes = require('../scripts/lib/alteracoes');
const { agora, lerStdin } = require('../scripts/lib/util');

async function main() {
  const entrada = await lerStdin();
  const fonte = entrada.how_session_started || entrada.source || 'startup';
  const e = estadoLib.carregar();

  if (fonte !== 'compact') {
    // Sessão anterior que não fechou (terminal morto, máquina desligada): fecha pelo último sinal de vida.
    if (e.sessao_atual && e.sessao_atual.id !== entrada.session_id) {
      estadoLib.fecharSessao(e, e.sessao_atual.ultima_atividade || e.sessao_atual.inicio, 'recuperada');
    }
    if (!e.sessao_atual || e.sessao_atual.id !== entrada.session_id) {
      // Só o registro. Contar a sessão, abrir a aula e enfileirar é trabalho do
      // primeiro turno (lib/estado.js, contarSessao): abrir a janela não é aula.
      e.sessao_atual = { id: entrada.session_id || null, inicio: agora(), ultima_atividade: agora(), aula: e.aula_atual, turnos: 0, fonte, contada: false };
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

main().catch((err) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: `Harness: o hook de início falhou (${err.message}). Siga a aula normalmente e, se puder, rode \`node .claude/scripts/trilha.js status\` para ver o estado.` },
  }));
});
