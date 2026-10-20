'use strict';
// Antes de qualquer lib: o processo do hook do Codex não recebe CODEX_THREAD_ID (T0.17), só o `session_id` no
// payload, e é esta variável que diz ao agente.js que o modo é o do Codex.
process.env.TRILHA_202_AGENTE = 'codex';
// SessionStart do Codex (branch codex). Faz o que o `inicio.js` do Claude faz e o que o `status` do modo Codex faz
// quando não há hook: atualiza a sala, sincroniza a conversa, registra o harness alterado, tenta subir a fila e
// injeta o resumo. No Codex o hook é só um acelerador (pasta não confiada, hooks.json mudado, aplicativo do Windows):
// o tutor roda o `status` no primeiro turno do mesmo jeito (AGENTS.md), e tudo aqui é idempotente com ele.
//
// Responde só em JSON e sai com 0: no Windows o hook roda dentro do PowerShell 5.1, que troca o 2 por 1.
const fs = require('fs');
const path = require('path');

function responder(texto) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: texto } }));
}

async function main() {
  // Dentro do main: uma lib quebrada vira a linha de aviso do catch, e não um hook que sai com erro.
  const { lerStdin } = require('../../scripts/lib/util');
  const { atualizar } = require('../../scripts/lib/atualizar');
  const entrada = await lerStdin();
  // A chave de desligar (T13): com `codex.ativo: false` no config da sala, ou TRILHA_202_CODEX=0, o hook confiado não
  // faz nada, como se não existisse. Sem isto o aluno seguiria sincronizando e recebendo o resumo do Codex. Depois de
  // ler a entrada, para o Codex não escrever num cano já fechado.
  if (require('../../scripts/lib/agente').atual() !== 'codex') return;
  const id = entrada.session_id || null;
  const fonte = entrada.source || 'startup';

  // Como no Claude: chat novo (startup e clear) traz tudo; retomar só o que é inteiro de código (lib/atualizar.js,
  // soCodigo, 50fe9b0). O fork também é meio de aula: ele nasce com a conversa de antes e as instruções dela.
  // Compactar não atualiza. Só depois disto o resto do harness é carregado, para este hook já rodar o código novo.
  const atualizacao = fonte === 'startup' || fonte === 'clear' ? atualizar()
    : fonte === 'resume' || fonte === 'fork' ? atualizar({ soCodigo: true })
    : { atualizada: false, motivo: 'meio-de-aula' };
  if (atualizacao.atualizada) {
    const lib = path.resolve(__dirname, '..', '..', 'scripts', 'lib') + path.sep;
    for (const k of Object.keys(require.cache)) if (k.startsWith(lib)) delete require.cache[k];
  }
  const paths = require('../../scripts/lib/paths');
  const estadoLib = require('../../scripts/lib/estado');
  const fila = require('../../scripts/lib/fila');
  const { enviar } = require('../../scripts/lib/enviar');
  const { resumo } = require('../../scripts/lib/resumo');
  const alteracoes = require('../../scripts/lib/alteracoes');
  const acesso = require('../../scripts/lib/acesso');
  const sessao = require('../../scripts/lib/codex/sessao');

  // A sessão nasce (ou volta) pela conversa, com a origem do hook: a escolha de frente só se oferece ao chat novo.
  // Sem conversa no disco ainda, nada nasce aqui: o primeiro comando ou o hook do turno fazem isso.
  let sinc = null;
  try { sinc = sessao.sincronizar(id, { fonte }); } catch (err) { sessao.avisarErro(err); }

  // Depois da sessão, como no `inicio.js`: o evento sai com o chat deste hook, e com o commit novo.
  if (atualizacao.atualizada) {
    try { fila.enfileirar('harness.atualizado', { de: atualizacao.de, para: atualizacao.para, commits: atualizacao.commits, ...(atualizacao.soCodigo ? { ao_retomar: true } : {}) }, estadoLib.carregar()); } catch { /* segue */ }
  }

  // O rascunho que ficou de outro chat não é lido por este. Só no chat novo, como no `status`: ao retomar, a
  // conferência de uma prática pode estar sendo escrita em trilha/tmp.
  if (fonte === 'startup' || fonte === 'clear') {
    try { fs.rmSync(paths.TMP, { recursive: true, force: true }); } catch { /* segue */ }
  }

  // Relido, sob a trava: a sincronização gravou o estado, e um comando do mesmo turno pode estar gravando. Uma vez por
  // mudança, como no `inicio.js`.
  let sujo = [];
  sessao.comTrava(() => {
    try { const e = estadoLib.carregar(); sujo = alteracoes.registrar(e, 'inicio'); estadoLib.salvar(e); } catch { /* sem git: segue */ }
  });

  // O envio antes do resumo: um 401 aqui fecha a sala, e o resumo já diz isso ao tutor neste chat.
  const envio = await enviar({ timeoutMs: 2500 });
  const e = estadoLib.carregar();
  if (estadoLib.avancarSeConcluida(e)) estadoLib.salvar(e);
  // A aula que começou no Claude e segue aqui: a sessão do Claude que esta sincronização fechou, ou a última do
  // histórico, que o aplicativo do Claude já fechou quando o aluno saiu do chat (D2, 20/10).
  const continuacaoDe = sessao.continuacaoDe(sinc);
  const texto = resumo(e, { fonte: fonte === 'compact' ? 'compact' : fonte === 'startup' || fonte === 'clear' ? 'startup' : 'resume', agente: 'codex', ...(continuacaoDe ? { continuacaoDe } : {}) });
  const aviso = envio.ok || !acesso.conectado(e) ? '' : `\n(Fila local: ${envio.pendentes} evento(s) aguardando envio; ${envio.motivo}. Isso não afeta a aula, não comente com o aluno.)`;
  const avisoHarness = sujo.length ? `\n(Harness com alteração local fora do commit: ${sujo.join(', ')}. Isso já foi registrado. Não edite nada do harness a partir daqui e não comente com o aluno.)` : '';
  // O AGENTS.md e a configuração da sala foram lidos pelo Codex antes deste hook; skills, mapa e comandos já são os novos.
  const avisoAtualizacao = !atualizacao.atualizada ? ''
    : atualizacao.soCodigo ? '\n(Os comandos da sala acabaram de receber correções da 202. A aula não muda. Não comente com o aluno, salvo se ele perguntar.)'
    : '\n(A sala acabou de se atualizar com material novo da 202. Skills, mapa e comandos já estão na versão nova; o AGENTS.md e a configuração da sala valem a partir do próximo chat. Não comente com o aluno, salvo se ele perguntar.)';

  // A marca deste início, para o `status` do primeiro turno (AGENTS.md) não refazer nada disto: o `atualizar` dele roda
  // no sandbox e daria `sem-rede`, e o tutor pediria ao aluno uma aprovação à toa. Uma chave própria, e não o
  // `ultimo_status` da conversa, que é do comando. Com as pendências que este resumo já levou, para o `status` dizer só
  // as novas. As de mais de um dia saem. `sincronizou` diz se este resumo já saiu com a sessão deste chat: o Codex pode
  // rodar o SessionStart antes de gravar a conversa no disco, e aí a escolha de frente e a continuação nascem só no
  // `status`, que imprime o resumo inteiro. `escolha`, se a pergunta da frente já foi neste texto.
  if (id) {
    sessao.comTrava(() => {
      const e2 = estadoLib.carregar();
      const cx = e2.codex || (e2.codex = { chats: {} });
      const marcas = cx.inicio_hook && typeof cx.inicio_hook === 'object' ? cx.inicio_hook : {};
      for (const [k, m] of Object.entries(marcas)) if (!(Date.now() - Date.parse((m || {}).ts) < 86400000)) delete marcas[k];
      marcas[id] = {
        ts: new Date().toISOString(), fonte,
        sincronizou: Boolean(sinc && !sinc.ocupada),
        escolha: estadoLib.escolhaPendente(e),
        atualizacao: atualizacao.atualizada ? 'atualizada' : atualizacao.motivo || null,
        pendencias: texto.split('\n').filter((l) => l.startsWith('Pendência do harness')),
      };
      cx.inicio_hook = marcas;
      estadoLib.salvar(e2);
    });
  }
  responder(texto + aviso + avisoHarness + avisoAtualizacao);
}

main().catch((err) => {
  responder(`Harness: o hook de início falhou (${err && err.message}). Siga a aula normalmente e rode \`node .claude/scripts/trilha.js status\` para ver o estado.`);
}).finally(() => { process.exitCode = 0; });
