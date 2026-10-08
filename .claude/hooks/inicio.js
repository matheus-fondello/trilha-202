'use strict';
// SessionStart. Roda quando o aluno abre o Claude Code na sala (startup),
// retoma uma sessão (resume), limpa o chat (clear) ou o contexto compacta.
// Atualiza a sala (lib/atualizar.js), injeta o estado no contexto do tutor e
// tenta subir a fila. Nunca falha:
// qualquer erro vira uma linha de aviso e a aula segue.
const fs = require('fs');
const path = require('path');
const { lerStdin } = require('../scripts/lib/util');
const { atualizar } = require('../scripts/lib/atualizar');

async function main() {
  const entrada = await lerStdin();
  const fonte = entrada.how_session_started || entrada.source || 'startup';

  // A sala se atualiza sozinha em todo chat novo (startup e clear). Retomar ou
  // compactar é meio de aula, e trocar skill e mapa debaixo de uma aula andando
  // deixa o tutor com metade das instruções em cada versão. O resto do harness
  // só é carregado depois daqui, para este mesmo hook já rodar o código novo.
  const atualizacao = fonte === 'startup' || fonte === 'clear' ? atualizar() : { atualizada: false, motivo: 'meio-de-aula' };
  if (atualizacao.atualizada) {
    const lib = path.resolve(__dirname, '..', 'scripts', 'lib') + path.sep;
    for (const k of Object.keys(require.cache)) if (k.startsWith(lib)) delete require.cache[k];
  }
  const paths = require('../scripts/lib/paths');
  const estadoLib = require('../scripts/lib/estado');
  const fila = require('../scripts/lib/fila');
  const { enviar } = require('../scripts/lib/enviar');
  const { resumo } = require('../scripts/lib/resumo');
  const alteracoes = require('../scripts/lib/alteracoes');
  const acesso = require('../scripts/lib/acesso');
  const turnos = require('../scripts/lib/turnos');
  const { agora } = require('../scripts/lib/util');

  const e = estadoLib.carregar();

  if (fonte !== 'compact') {
    // Sessão anterior que não fechou (terminal morto, máquina desligada): fecha pelo último sinal de vida.
    if (e.sessao_atual && e.sessao_atual.id !== entrada.session_id) {
      // Turno que ficou aberto: o agente morreu no meio da resposta. Fecha pelo
      // instante do envio, não pelo relógio de agora — a sessão é reconstruída
      // dos turnos que ficaram gravados, e não do momento em que se percebeu.
      turnos.fechar(e, { interrompido: true, tarde: true });
      estadoLib.fecharSessao(e, e.sessao_atual.ultima_atividade || e.sessao_atual.inicio, 'recuperada');
    }
    // Material novo depois da última unidade: a da vez passa a ser a primeira
    // aberta, antes de a sessão nascer etiquetada com ela.
    estadoLib.avancarSeConcluida(e);
    if (!e.sessao_atual || e.sessao_atual.id !== entrada.session_id) {
      // Só o registro. Contar a sessão, abrir a aula e enfileirar é trabalho do
      // primeiro turno (lib/estado.js, contarSessao): abrir a janela não é aula.
      // transcricao: o caminho do .jsonl desta sessão, que só o Claude Code sabe.
      // É o que o avaliador de fim de aula lê — ele não esteve na conversa.
      e.sessao_atual = { id: entrada.session_id || null, inicio: agora(), ultima_atividade: agora(), aula: e.aula_atual, turnos: 0, fonte, contada: false, transcricao: entrada.transcript_path || null, turno_aberto: null, ultimo_turno_fim: null, trabalho_ms: 0 };
    }
    estadoLib.salvar(e);
    // O rascunho da avaliação vive em trilha/tmp só até o `avaliar` consumir. Se
    // ficou para trás (validação falhou, terminal fechou), não pode ser lido por
    // uma sessão seguinte: some no início de todo chat.
    try { fs.rmSync(paths.TMP, { recursive: true, force: true }); } catch { /* segue */ }
  }

  // Sobe com o commit de antes e o de depois; o `commit` de todo evento seguinte
  // já sai com o novo, e é por ele que a 202 vê quem está atrás.
  if (atualizacao.atualizada) {
    try { fila.enfileirar('harness.atualizado', { de: atualizacao.de, para: atualizacao.para, commits: atualizacao.commits }, e); } catch { /* segue */ }
  }

  // Rede de segurança da guarda: harness diferente do commit vira evento (uma
  // vez por mudança) e uma linha para o tutor. Não reverte nada.
  let sujo = [];
  try { sujo = alteracoes.registrar(e, 'inicio'); estadoLib.salvar(e); } catch { /* sem git: segue */ }

  // O envio vem antes do resumo: um 401 aqui fecha a sala, e o resumo precisa
  // já dizer isso ao tutor nesta sessão, não na próxima.
  const envio = await enviar({ timeoutMs: 2500, estado: e });
  const texto = resumo(e, { fonte });
  const aviso = envio.ok || !acesso.conectado(e) ? '' :`\n(Fila local: ${envio.pendentes} evento(s) aguardando envio; ${envio.motivo}. Isso não afeta a aula, não comente com o aluno.)`;
  const avisoHarness = sujo.length ? `\n(Harness com alteração local fora do commit: ${sujo.join(', ')}. Isso já foi registrado. Não edite nada do harness a partir daqui e não comente com o aluno.)` : '';

  // O CLAUDE.md e o settings.json da sala podem ter sido lidos antes do pull;
  // skills, mapa e comandos já são os novos.
  const avisoAtualizacao = atualizacao.atualizada ? `
(A sala acabou de se atualizar com material novo da 202. Skills, mapa e comandos já estão na versão nova; o CLAUDE.md e as regras da sala valem a partir do próximo chat. Não comente com o aluno, salvo se ele perguntar.)` : '';

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: texto + aviso + avisoHarness + avisoAtualizacao },
  }));
}

main().catch((err) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: `Harness: o hook de início falhou (${err.message}). Siga a aula normalmente e, se puder, rode \`node .claude/scripts/trilha.js status\` para ver o estado.` },
  }));
});
