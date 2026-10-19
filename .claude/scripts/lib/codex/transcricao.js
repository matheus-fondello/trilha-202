'use strict';
// A conversa do Codex em texto, para o avaliador (branch codex). É o mesmo texto que o conversor do Claude produz
// (lib/transcricao.js): uma linha por fala, `ALUNO...:`, `TUTOR:`, os comandos do harness com a resposta curta, as
// mesmas marcas e as mesmas limpezas. O avaliador, a conferência das evidências e o corte por tamanho não sabem de
// que agente veio a conversa.
//
// A fala vem de uma fonte só, o `event_msg/item_completed` (T0.13). O `response_item` traz as mesmas falas, mas o de
// papel `user` carrega também o AGENTS.md e, desde o 0.162, um <environment_context> a cada `resume`: lido como fala,
// isso viraria evidência "literal do que o aluno disse". O raciocínio, o papel `developer` (as instruções e o aviso de
// turno abortado) e o resto do encanamento (`world_state`, `turn_context`, `token_*`, `compacted`...) nunca entram,
// porque só o `item_completed` e o erro do fim do turno são lidos.
//
// O formato não é contrato: linha que não se entende é pulada, e nada aqui lança.
const comum = require('../transcricao');
const rollout = require('./rollout');
const paths = require('../paths');
const fs = require('fs');
const path = require('path');

const objeto = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : null);
const texto = (x) => (typeof x === 'string' ? x : '');

// O token da 202 também aparece na forma do arquivo de credenciais ("token": "..."), quando o tutor do Codex o abre
// para conferir o acesso. O `semToken` comum não muda, para o texto das conversas do Claude ficar idêntico.
function semTokenJson(t) {
  return String(t).replace(/("token"\s*:\s*")(?:\\.|[^"\\])*(")/g, '$1[token omitido]$2');
}

// O que o aplicativo do Codex põe na mensagem do aluno sem ele ter escrito: o contexto do ambiente, o estado do
// navegador do aplicativo, e o "## My request:" que separa esse estado do pedido.
function limparFala(t) {
  return comum.limpar(String(t)
    .replace(/<environment_context>[\s\S]*?<\/environment_context>/g, '')
    .replace(/<in-app-browser-context\b[^>]*>[\s\S]*?<\/in-app-browser-context>/g, '')
    .replace(/^[ \t]*## My request:[ \t]*$/gm, ''));
}

// Os comandos do harness como o Codex os grava: o `command` é a lista que o shell recebeu, e o que o tutor escreveu é
// o último elemento (`powershell.exe -NoProfile -Command <cmd>`, `zsh -lc <cmd>`). As aspas antes do subcomando são de
// quem escreve o caminho entre aspas no PowerShell.
const AVALIAR = /(?:trilha\.js|sala\.cjs)["']?\s+avaliar\b/;
const CONCLUIR = /(?:trilha\.js|sala\.cjs)["']?\s+concluir\s+\S/;
function comandoDe(item) {
  if (Array.isArray(item.command)) {
    const ultimo = item.command[item.command.length - 1];
    return typeof ultimo === 'string' ? ultimo : '';
  }
  return texto(item.command);
}

// O limite de uso do tutor do Codex: o turno fecha com `error` (visto nas conversas de 09 e 10/2026, com
// `codex_error_info: "usage_limit_exceeded"` e "You've hit your usage limit..."). Como a mensagem de erro da API no
// conversor do Claude, vira uma marca: não é fala do tutor nem falta do aluno.
const LIMITE = /hit your usage limit|usage_limit_exceeded/i;
function marcaDeErro(erro) {
  const e = objeto(erro);
  const limite = LIMITE.test(texto(e && e.codex_error_info)) || LIMITE.test(texto(e ? e.message : erro));
  return `  [o Codex parou aqui${limite ? ', no limite de uso da conta' : ', por erro da API'}; não é fala do tutor nem falta do aluno]`;
}

function dentro(ordinal, trecho) {
  const de = Number.isInteger(trecho.de_ordinal) ? trecho.de_ordinal : -Infinity;
  const ate = Number.isInteger(trecho.ate_ordinal) ? trecho.ate_ordinal : Infinity;
  return ordinal >= de && ordinal <= ate;
}

function falasDoItem(item, itens, tirar) {
  const tipo = item.type;
  if (tipo === 'UserMessage') {
    for (const c of Array.isArray(item.content) ? item.content : []) {
      const parte = objeto(c);
      if (!parte) continue;
      // A imagem não chega ao avaliador, mas o fato de ela existir chega, como no Claude (achado 06).
      if (/image/i.test(texto(parte.type))) {
        itens.push({ quem: 'ALUNO', linha: 'ALUNO: [anexou uma imagem, que não chega a esta transcrição]' });
        continue;
      }
      const t = tirar(semTokenJson(comum.semToken(limparFala(texto(parte.text)))));
      if (!t) continue;
      for (const s of comum.segmentos(t)) itens.push({ quem: 'ALUNO', linha: `${comum.rotulo(s.tipo, s.nome)}: ${comum.continuacoes(s.texto)}` });
    }
  } else if (tipo === 'AgentMessage') {
    // O comentário entre ferramentas e a resposta final: no Claude, os dois são texto do assistente.
    for (const c of Array.isArray(item.content) ? item.content : []) {
      const parte = objeto(c);
      const t = parte ? tirar(semTokenJson(comum.semToken(comum.limpar(texto(parte.text))))) : '';
      if (t) itens.push({ quem: 'TUTOR', linha: `TUTOR: ${comum.continuacoes(t)}` });
    }
  } else if (tipo === 'CommandExecution') {
    const cmd = comandoDe(item);
    itens.push({
      quem: 'cmd', avaliar: AVALIAR.test(cmd), concluir: CONCLUIR.test(cmd),
      linha: `  [tutor rodou: ${comum.umaLinha(tirar(semTokenJson(comum.semVeredito(comum.semToken(comum.semNota(cmd))))), 200)}]`,
    });
    const saida = typeof item.aggregated_output === 'string' ? item.aggregated_output : texto(item.stdout) + texto(item.stderr);
    const t = tirar(comum.semVeredito(semTokenJson(comum.semToken(comum.limpar(saida)))));
    if (t) itens.push({ quem: 'resp', linha: `  [resposta: ${comum.umaLinha(t, 200)}]` });
  } else if (tipo === 'FileChange') {
    // O `apply_patch`: o que importa é que arquivo mudou, não o diff.
    const ch = item.changes;
    const arquivos = Array.isArray(ch) ? ch.map((x) => texto(objeto(x) && x.path)).filter(Boolean) : Object.keys(objeto(ch) || {});
    itens.push({ quem: 'cmd', linha: `  [tutor rodou: ${comum.umaLinha(['apply_patch', ...arquivos].join(' '), 200)}]` });
  } else if (tipo === 'ImageView') {
    itens.push({ quem: 'cmd', linha: `  [tutor rodou: ${comum.umaLinha(`view_image ${texto(item.path)}`.trim(), 200)}]` });
  } else if (tipo === 'McpToolCall') {
    // Como o Claude nomeia a ferramenta de um servidor MCP.
    itens.push({ quem: 'cmd', linha: `  [tutor rodou: ${comum.umaLinha(['mcp', texto(item.server), texto(item.tool)].filter(Boolean).join('__'), 200)}]` });
  }
  // Reasoning fica de fora: é raciocínio do tutor, não evidência sobre o aluno. Os outros itens são encanamento.
}

// Uma linha por fala, com o contrato do conversor do Claude. `trecho` (`{ de_ordinal, ate_ordinal }`) lê só as linhas
// nesse intervalo: na recuperação, um chat que fez duas aulas é lido em dois pedaços. `ultimo` diz se este é o último
// arquivo da aula (ver o fechamento, abaixo).
function converter(bruto, tirar = (t) => t, { trecho, ultimo = false } = {}) {
  const itens = [];
  try {
    let ordinal = -1;
    let primeira = true;
    let doSubagente = null;
    for (const bruta of String(bruto == null ? '' : bruto).split('\n')) {
      if (!bruta.trim()) continue;
      const eraPrimeira = primeira;
      primeira = false;
      let o;
      try { o = JSON.parse(eraPrimeira ? bruta.replace(/^\uFEFF/, '') : bruta); } catch { continue; }
      if (!objeto(o)) continue;
      // O ordinal como o leitor da conversa o conta (codex/rollout.js), para o trecho da recuperação bater.
      ordinal = Number.isInteger(o.ordinal) ? o.ordinal : ordinal + 1;
      const p = objeto(o.payload);
      if (!p) continue;
      if (o.type === 'session_meta') {
        // O de um subagente diz onde começa a parte dele; antes vem o histórico copiado do pai. Os seguintes (o do pai,
        // num subagente) não dizem nada.
        if (eraPrimeira && Number.isInteger(p.subagent_history_start_ordinal)) doSubagente = p.subagent_history_start_ordinal;
        continue;
      }
      if (doSubagente !== null && ordinal < doSubagente) continue;
      if (objeto(trecho) && !dentro(ordinal, trecho)) continue;
      if (o.type !== 'event_msg') continue;
      if (p.type === 'item_completed') {
        const item = objeto(p.item);
        if (item) falasDoItem(item, itens, tirar);
      } else if ((p.type === 'task_complete' || p.type === 'turn_aborted') && p.error) {
        itens.push({ quem: 'aviso', linha: marcaDeErro(p.error) });
      }
    }
  } catch { /* o que já foi lido vale */ }

  // O fechamento do tutor fica de fora, como no Claude: é o veredito de quem deu a aula. A âncora é o último `avaliar`
  // e, sem ele, o último `concluir`. No Codex o item do comando só é gravado quando o comando termina: o `avaliar`
  // que lê o próprio chat ainda não está lá, e o `concluir` da mesma linha também não. Sem âncora, no último arquivo
  // da aula (o do chat que está fechando), sai o texto do tutor depois da última fala do aluno; os do meio passam
  // inteiros, como no conversor do Claude.
  let fim = -1;
  for (let i = itens.length - 1; i >= 0; i--) if (itens[i].avaliar) { fim = i; break; }
  if (fim < 0) for (let i = itens.length - 1; i >= 0; i--) if (itens[i].concluir) { fim = i; break; }
  let inicio = fim;
  while (inicio > 0 && itens[inicio - 1].quem !== 'ALUNO') inicio--;
  if (fim < 0 && ultimo) {
    let a = -1;
    for (let i = itens.length - 1; i >= 0; i--) if (itens[i].quem === 'ALUNO') { a = i; break; }
    if (a >= 0) { fim = a; inicio = a + 1; }
  }

  const linhas = [];
  let omitiu = false;
  itens.forEach((it, i) => {
    if (fim >= 0 && i >= inicio && it.quem === 'TUTOR') {
      if (!omitiu) linhas.push('TUTOR: [feedback de fechamento e despedida do tutor omitidos]');
      omitiu = true;
      return;
    }
    linhas.push(it.linha);
  });
  return linhas.join('\n');
}

// A primeira linha de uma conversa do Codex é o `session_meta`. É por ela que o `ler` escolhe o conversor.
function eDoCodex(bruto) {
  try {
    const s = String(bruto);
    const nl = s.indexOf('\n');
    const o = JSON.parse((nl === -1 ? s : s.slice(0, nl)).replace(/^\uFEFF/, ''));
    return Boolean(objeto(o) && o.type === 'session_meta');
  } catch { return false; }
}

// --- achar a conversa da aula pelo horário ---
//
// As conversas do Codex que o `porHorario` considera, com `e.codex` no estado: as do registro e as de
// `<CODEX_HOME>/sessions` abertas na sala. A janela é a do arquivo (o primeiro `timestamp` até a última escrita).
// De cada conversa da pasta só a primeira linha é lida para filtrar, e só depois de a hora da última escrita dizer
// que ela pode cobrir a aula: um aluno pode ter centenas de conversas, de outros projetos. Conversa de subagente
// nunca é o chat da aula.
function conversasDaPasta(dir, profundidade, out) {
  let entradas;
  try { entradas = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const x of entradas) {
    const p = path.join(dir, x.name);
    if (x.isFile() && x.name.endsWith('.jsonl')) out.push(p);
    else if (x.isDirectory() && profundidade > 0) conversasDaPasta(p, profundidade - 1, out);
  }
}
function doHorario(e, cobre, janelaDoArquivo, jaAchados) {
  const achados = [];
  const visto = new Set(jaAchados);
  const considerar = (arquivo, naSala) => {
    try {
      if (typeof arquivo !== 'string' || visto.has(arquivo)) return;
      visto.add(arquivo);
      const st = fs.statSync(arquivo);
      // A última escrita antes da primeira marca: a conversa não cobre a aula, e nem a primeira linha é lida.
      if (!st.isFile() || !cobre({ inicio: -Infinity, fim: st.mtimeMs })) return;
      const m = rollout.meta(arquivo);
      if (!m || m.subagente) return;
      if (naSala && !rollout.mesmaPasta(m.cwd, paths.RAIZ)) return;
      const j = janelaDoArquivo(arquivo);
      if (cobre(j)) achados.push([arquivo, j.inicio]);
    } catch { /* conversa ilegível não é a da aula */ }
  };
  const cx = objeto(e.codex) || {};
  for (const c of Object.values(objeto(cx.chats) || {})) considerar(objeto(c) && c.arquivo, false);
  const lista = [];
  try { conversasDaPasta(path.join(paths.codexHome(), 'sessions'), 3, lista); } catch { /* sem pasta */ }
  for (const f of lista) considerar(f, true);
  return achados;
}

// No modo Codex, a aula sem rastro nenhum no estado: só a conversa do próprio chat, e nunca a de um subagente.
function doProprioChat(idChat) {
  try {
    const f = rollout.achar(idChat);
    if (!f) return [];
    const m = rollout.meta(f);
    return m && m.subagente ? [] : [f];
  } catch { return []; }
}

module.exports = { converter, eDoCodex, doHorario, doProprioChat, semTokenJson };
