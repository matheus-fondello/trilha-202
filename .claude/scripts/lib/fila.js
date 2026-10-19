'use strict';
// Fila de eventos em JSONL. Um evento por linha. Nunca falha por causa da
// rede: enfileirar é só escrever no disco. Enviar é outra história (enviar.js).
const fs = require('fs');
const path = require('path');
const { FILA, CONFIG } = require('./paths');
const { agora, id, lerJson } = require('./util');
const git = require('./git');
const seq = require('./seq');

function versaoHarness() {
  try { return lerJson(CONFIG).harness.versao; } catch { return 'desconhecida'; }
}

// Commit do harness e se ele está íntegro. O servidor compara com o repositório
// oficial: evento vindo de commit desconhecido ou de harness sujo é auto-relato
// de um harness modificado, e é assim que se lê.
function integridade() {
  // Modo Codex (branch codex). O teste das variáveis vem antes do require: sem
  // elas o agente não pode ser o Codex, e o hook do Claude, que tem teto de
  // 300 ms, não carrega nem o agente.js.
  if (process.env.TRILHA_202_AGENTE || process.env.CODEX_THREAD_ID) {
    try {
      if (require('./agente').atual() === 'codex') return integridadeCodex();
    } catch { /* segue o de hoje */ }
  }
  try {
    const alterados = git.alterados();
    return { commit: git.commit(), sujo: alterados.length > 0 };
  } catch {
    return { commit: null, sujo: null };
  }
}

// No sandbox do Codex o git pode não rodar. O commit sai então do .git, lido
// pelo Node; e o `sujo` sai null, "não sei", e não false: false diria "íntegro"
// a todo evento do sandbox, e no CRM um `sujo: true` com `commit: null` abre um
// alarme que nunca se resolve. Sem git, a 202 sabe que não sabe.
function integridadeCodex() {
  const alterados = git.alterados({ desconhecido: true });
  return { commit: git.commit() || git.commitPorArquivo(), sujo: alterados === null ? null : alterados.length > 0 };
}

// Um evento grande demais trava a fila: o CRM o guarda em quarentena acima disso,
// e acima de uns 9 MB o proxy recusa com 413 em todo envio, porque a página
// sempre leva ao menos um evento. Fica o esqueleto do que ele era.
const MAX_DADOS = 150000;

// `opts` (branch codex) é de quem importa da conversa do Codex o que já
// aconteceu: o id determinístico (o mesmo turno importado duas vezes é o mesmo
// evento), o horário do turno e a sessão do chat dele. Sem `opts`, o evento é o
// de sempre, com as chaves na mesma ordem.
function enfileirar(tipo, dados, estado, opts) {
  const o = opts && typeof opts === 'object' ? opts : {};
  const bruto = JSON.stringify(dados || {});
  if (bruto.length > MAX_DADOS) {
    dados = { aula: dados && dados.aula, cortado: true, caracteres: bruto.length, chaves: Object.keys(dados || {}).slice(0, 50) };
  }
  const ev = {
    id: o.id || id(),
    // Contínuo entre sessões: buraco na sequência é evento que não chegou, e o
    // servidor marca a sessão como incompleta em vez de somar errado calado.
    seq: seq.proximo(),
    ts: o.ts || agora(),
    tipo,
    aula: (dados && dados.aula) || (estado && estado.aula_atual) || null,
    sessao: 'sessao' in o ? o.sessao : (estado && estado.sessao_atual ? estado.sessao_atual.id : null),
    aluno: estado ? { email: estado.aluno.email, id: estado.aluno.id } : null,
    harness: versaoHarness(),
    ...integridade(),
    dados: dados || {},
  };
  fs.mkdirSync(path.dirname(FILA), { recursive: true });
  fs.appendFileSync(FILA, JSON.stringify(ev) + '\n', 'utf8');
  return ev;
}

function ler() {
  let texto;
  try { texto = fs.readFileSync(FILA, 'utf8'); } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
  const eventos = [];
  for (const linha of texto.split('\n')) {
    if (!linha.trim()) continue;
    try { eventos.push(JSON.parse(linha)); } catch { /* linha corrompida: ignora */ }
  }
  return eventos;
}

// Se um evento com este id ainda está na fila local (branch codex): quem
// importa da conversa do Codex pula o que já enfileirou, em vez de deixar para
// o dedupe do CRM, que gastaria um `seq` e deixaria buraco.
function temId(idEvento) {
  if (!idEvento) return false;
  return ler().some((e) => e.id === idEvento);
}

// Reescreve a fila sem os enviados. Lê o arquivo de novo logo antes de trocar,
// porque o envio leva segundos e outro processo (um hook, o CLI numa segunda
// janela) pode ter enfileirado no meio: sem isso o rename apagava esse evento.
// A janela que sobra, entre a última leitura e o rename, é de microssegundos.
function remover(ids) {
  const saem = new Set(ids);
  const restantes = ler().filter((e) => !saem.has(e.id));
  const tmp = FILA + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, restantes.map((e) => JSON.stringify(e)).join('\n') + (restantes.length ? '\n' : ''), 'utf8');
  const chegaram = ler().filter((e) => !saem.has(e.id) && !restantes.some((r) => r.id === e.id));
  if (chegaram.length) fs.appendFileSync(tmp, chegaram.map((e) => JSON.stringify(e)).join('\n') + '\n', 'utf8');
  fs.renameSync(tmp, FILA);
}

module.exports = { enfileirar, ler, temId, remover };
