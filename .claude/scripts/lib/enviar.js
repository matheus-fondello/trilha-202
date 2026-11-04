'use strict';
// Cliente do servidor da 202 (o CRM). Envia a fila inteira num POST, com o token
// do aluno no cabeçalho. Se não há URL, não há token, rede fora ou servidor com
// erro: devolve o motivo e a fila fica como está. Nunca lança. Nunca segura o
// hook por mais que o timeout.
//
// A única resposta que muda o estado é o 401: a 202 dizendo que este token não
// vale mais. A sala fecha até chegar um novo. O CRM responde 503, e não 401,
// quando o problema é dele, então uma queda do servidor nunca tranca o aluno.
const { CONFIG } = require('./paths');
const { lerJson, agora } = require('./util');
const fila = require('./fila');
const estadoLib = require('./estado');
const acesso = require('./acesso');

// A fila sai em páginas, e não inteira. Mandada inteira, uma fila acumulada
// (dias sem conexão, sem token, com o servidor fora) passava do tamanho que o
// servidor aceita, era recusada inteira, ficava no disco e era mandada inteira
// de novo no envio seguinte - para sempre, e nada daquele aluno chegava mais.
// Em páginas, cada envio leva o começo da fila e o `remover` tira só o que o
// servidor confirmou; o resto sai no envio seguinte, que durante a aula
// acontece a cada comando do CLI e a cada dois minutos.
const PAGINA_EVENTOS = 500;
const PAGINA_BYTES = 1000000;

function pagina(eventos) {
  const saem = [];
  let bytes = 0;
  for (const ev of eventos) {
    const tamanho = Buffer.byteLength(JSON.stringify(ev), 'utf8');
    if (saem.length && (saem.length >= PAGINA_EVENTOS || bytes + tamanho > PAGINA_BYTES)) break;
    saem.push(ev);
    bytes += tamanho;
  }
  return saem;
}

// Erros de quem não chegou a falar com servidor nenhum. Servem para saber que o
// endereço é que está errado, e não o que foi mandado.
const SEM_CONEXAO = new Set(['ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN', 'ECONNRESET', 'EHOSTUNREACH', 'ETIMEDOUT']);

function semConexao(err) {
  const code = (err && (err.code || (err.cause && err.cause.code))) || '';
  return SEM_CONEXAO.has(code);
}

// O endereço que o repositório traz de fábrica: o CRM da 202.
function servidorPadrao(config) {
  const url = String((config.servidor || {}).url || '').trim();
  return url ? url.replace(/\/+$/, '') : null;
}

// No modo Codex (branch codex) a fila é lida sob a trava da sincronização (lib/codex/sessao.js): uma sincronização
// enfileira os turnos e só depois grava o estado que os marca como importados. Lido no meio, um turno subiria e sairia
// da fila antes de o estado o marcar; se aquele processo morresse ali, a sincronização seguinte não o acharia nem no
// estado nem na fila, e o mandaria de novo. Fora da trava, tudo o que está na fila já foi marcado. O teste das
// variáveis vem antes do require, como na integridade da fila: o hook do Claude não carrega nada a mais.
function lerFila() {
  if (process.env.TRILHA_202_AGENTE || process.env.CODEX_THREAD_ID) {
    try {
      if (require('./agente').atual() === 'codex') return require('./codex/sessao').comTrava(() => fila.ler());
    } catch { /* segue o de hoje */ }
  }
  return fila.ler();
}

// `token` e `url` explícitos são do `conectar`, que confere um token antes de
// guardá-lo: nesse caso a resposta é dele para interpretar, e o estado não muda aqui.
// `origem` diz quem tentou (o hook, o comando): vai para o registro das falhas, e
// é ele que diz à 202, quando a fila destrava, por qual caminho o envio não saía.
// `limiteEm` é a hora (em ms) em que quem chamou precisa ter terminado, como o teto
// de um hook: o prazo da rede encolhe para caber, contado depois de ler a fila, que
// no Codex pode esperar a trava.
async function enviar({ timeoutMs = 3000, estado = null, token = null, url = null, origem = null, limiteEm = null } = {}) {
  const config = lerJson(CONFIG, {});
  const destino = url || acesso.servidor();
  const chave = token || acesso.token();
  const todos = lerFila();
  // `null` só vem do modo Codex (lerFila, que já decidiu por `agente.atual()`): no Claude a fila é sempre uma lista.
  // É a exceção registrada à regra de todo ramo novo começar pelo teste do agente.
  if (!todos) return { ok: false, enviados: 0, pendentes: fila.ler().length, motivo: 'sala ocupada; a fila sobe no próximo envio' };
  if (!todos.length) {
    esquecerFalhas(estado);
    return { ok: true, enviados: 0, motivo: 'fila vazia' };
  }
  const eventos = pagina(todos);
  if (!destino) return { ok: false, enviados: 0, pendentes: todos.length, motivo: 'servidor não configurado' };
  // Parar antes da rede é deliberado: sem token o servidor responderia 401, e
  // "sem token de acesso" diz o que fazer; "servidor respondeu 401" não diz.
  if (!chave) return { ok: false, enviados: 0, pendentes: todos.length, motivo: 'sem token de acesso' };

  const e = estado || estadoLib.carregar();
  // Token já recusado não volta a bater na porta a cada turno: só um `conectar`
  // com token novo reabre.
  if (!token && e.acesso && e.acesso.recusado_em) return { ok: false, enviados: 0, pendentes: todos.length, motivo: 'token recusado pela 202' };

  const corpo = JSON.stringify({
    aluno: { email: e.aluno.email, id: e.aluno.id },
    harness: config.harness || {},
    enviado_em: agora(),
    eventos,
  });

  const prazo = limiteEm ? Math.max(500, Math.min(timeoutMs, limiteEm - Date.now())) : timeoutMs;
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), prazo);

  // O endereço guardado pode estar errado - um token emitido por um CRM local
  // grava `http://localhost:...` no `credenciais.json` do aluno, e a partir dali
  // tudo vai para uma máquina que não existe, sem ninguém ficar sabendo. Se não
  // houver ninguém atendendo no endereço guardado, tenta o de fábrica uma vez; e
  // se ele responder, corrige o arquivo, para o aluno não ter de fazer nada.
  const padrao = servidorPadrao(config);
  const post = (url) =>
    fetch(url + '/eventos', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${chave}` },
      body: corpo,
      signal: controle.signal,
    });

  try {
    let usado = destino;
    let resp;
    try {
      resp = await post(destino);
    } catch (err) {
      if (!semConexao(err) || !padrao || padrao === destino || err.name === 'AbortError') throw err;
      resp = await post(padrao);
      usado = padrao;
      if (!token) {
        try { acesso.guardar({ servidor: padrao }); } catch { /* o envio vale mesmo sem guardar */ }
      }
    }
    if (!resp.ok) {
      // Um evento sozinho grande demais para o servidor recebe 413 em todo envio
      // e trava a fila para sempre. Ele sai, e fica no lugar o registro de que
      // existiu, para a 202 saber que um evento foi cortado.
      if (resp.status === 413 && eventos.length === 1) {
        const torto = eventos[0];
        fila.remover([torto.id]);
        fila.enfileirar('evento.cortado', { tipo: torto.tipo, aula: torto.aula, caracteres: JSON.stringify(torto).length }, e);
        return { ok: false, status: 413, enviados: 0, pendentes: todos.length, motivo: 'um evento grande demais foi trocado pelo registro de que existiu' };
      }
      if (resp.status === 401 && !token && e.acesso) {
        anotar(e, (x) => { if (x.acesso) x.acesso.recusado_em = agora(); });
      } else if (!token) {
        marcarFalha(e, `servidor respondeu ${resp.status}`, origem);
      }
      return { ok: false, status: resp.status, enviados: 0, pendentes: todos.length, motivo: `servidor respondeu ${resp.status}` };
    }
    let resposta = {};
    try { resposta = await resp.json(); } catch { /* corpo vazio é aceito */ }
    fila.remover(eventos.map((x) => x.id));
    const novoId = resposta.aluno_id && resposta.aluno_id !== e.aluno.id ? resposta.aluno_id : null;
    const conferiu = !token && e.acesso && !e.acesso.verificado_em;
    // O registro das falhas sai do estado no disco, e não da cópia lida antes da rede: com dois envios juntos (o fim
    // do turno e o fim da sessão, ao fechar o aplicativo), só quem ainda o encontra o leva. O evento entra na fila
    // antes de o registro sair do estado, com um id tirado do "desde", para um processo morto no meio não o perder e
    // dois processos juntos não o mandarem duas vezes.
    const quando = agora();
    let noDisco = null;
    try { noDisco = estadoLib.carregar().envio_falhas || null; } catch { /* sem estado: nada a registrar */ }
    if (noDisco) avisarAtraso(noDisco, quando);
    if (novoId || conferiu || e.envio_falhou_em || e.envio_falhas || noDisco) {
      anotar(e, (x) => {
        if (novoId) x.aluno.id = novoId;
        if (conferiu && x.acesso && !x.acesso.verificado_em) x.acesso.verificado_em = quando;
        delete x.envio_falhou_em;
        delete x.envio_falhas;
      });
    }
    const restam = todos.length - eventos.length;
    return {
      ok: true,
      status: resp.status,
      enviados: eventos.length,
      pendentes: restam,
      servidor: usado,
      aluno_id: resposta.aluno_id || null,
      motivo: restam ? `enviado; ${restam} evento(s) saem no próximo envio` : 'enviado',
    };
  } catch (err) {
    // O código antes da mensagem: a mensagem de um erro de disco traz o caminho, com o nome de usuário, e o motivo
    // sobe para a 202 no registro do atraso.
    const motivo = err.name === 'AbortError' ? `timeout de ${prazo}ms`
      : err.code || (err.cause && err.cause.code) || String(err.message || 'erro').replace(/[A-Za-z]:[\\/][^\s'"]*|\/(?:Users|home)\/[^\s'"]*/g, '<caminho>');
    if (!token) marcarFalha(e, motivo, origem);
    return { ok: false, enviados: 0, pendentes: todos.length, motivo };
  } finally {
    clearTimeout(timer);
  }
}

// Servidor fora do ar ou lento: anota, e o envio automático do CLI espera antes
// de tentar de novo, para o aluno não pagar um timeout a cada milestone.
const ESPERA_APOS_FALHA_MS = 2 * 60 * 1000;

// Cada falha fica registrada no estado do aluno, até o próximo envio que der certo: desde quando a fila não sai,
// quantas tentativas e por quê, contadas por quem tentou e pelo motivo. Até 03/11 só ficava a hora da última falha,
// e um aluno com a fila parada por dias (um aluno no Codex, de 29/10 a 04/11) não deixava pista nenhuma: nem na 202,
// que não recebia nada, nem na máquina dele. Quem tentou de dentro do sandbox do Codex leva a marca, porque lá a rede
// está desligada de propósito e essa falha é esperada; a que importa é a dos hooks e dos comandos aprovados.
// A marca de sandbox só vale no Codex (um Claude aberto de um terminal do Codex herda a variável), e nem lá é certa:
// o modo `elevated` do Windows não marca nada (lib/codex/sondas.js). Por isso o registro guarda o agente, e a 202 lê
// as falhas dos comandos do Codex sabendo que podem ser do sandbox. O prazo some da chave do timeout, porque nos hooks
// do Codex ele muda a cada vez e gastaria o teto de linhas.
const MAX_MOTIVOS = 12;
function chaveDaFalha(motivo, origem, sandbox) {
  const m = String(motivo || 'sem motivo').replace(/^timeout de \d+ms$/, 'timeout');
  return `${origem || 'sem origem'}${sandbox ? ' (sandbox)' : ''}: ${m.slice(0, 80)}`;
}

function marcarFalha(e, motivo, origem) {
  const quando = agora();
  let doCodex = false;
  try { doCodex = require('./agente').atual() === 'codex'; } catch { /* sem agente: é o Claude */ }
  const chave = chaveDaFalha(motivo, origem, doCodex && Boolean(process.env.CODEX_SANDBOX_NETWORK_DISABLED));
  anotar(e, (x) => {
    x.envio_falhou_em = quando;
    const f = x.envio_falhas && typeof x.envio_falhas === 'object' ? x.envio_falhas : { desde: quando, tentativas: 0, motivos: {} };
    f.tentativas = (f.tentativas || 0) + 1;
    f.motivos = f.motivos && typeof f.motivos === 'object' ? f.motivos : {};
    const k = f.motivos[chave] != null || Object.keys(f.motivos).length < MAX_MOTIVOS ? chave : 'outros';
    f.motivos[k] = (f.motivos[k] || 0) + 1;
    f.ultimo = { em: quando, motivo: String(motivo || 'sem motivo').slice(0, 120), origem: origem || null };
    if (doCodex) f.agente = 'codex';
    x.envio_falhas = f;
  });
}

// A fila vazia não tem nada parado: um registro que sobrou (o envio que esvaziou a fila não conseguiu gravar o
// estado) sai calado, para não somar com a próxima falha e fazer parecer que a fila está parada desde muito antes.
function esquecerFalhas(estado) {
  try {
    const e = estado || estadoLib.carregar();
    if (e.envio_falhas) anotar(e, (x) => { delete x.envio_falhas; });
  } catch { /* segue */ }
}

// O id do registro do atraso, tirado do "desde": o mesmo episódio é sempre o mesmo evento (o CRM guarda um por id).
function idDoAtraso(desde) {
  // Carregado aqui, e não no topo: o hook de turno carrega este arquivo a cada turno e quase nunca chega aqui.
  const b = require('crypto').createHash('sha1').update('envio.atrasado:' + String(desde)).digest().subarray(0, 16);
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const x = b.toString('hex');
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}

// A fila destravou depois de os envios seguirem falhando por meia hora ou mais: a 202 recebe o registro, com os
// motivos. Conta o tempo da primeira à última falha, e não até o envio que deu certo: uma falha antes de uma ida à
// oficina ou do fim de semana não é fila travada (no Codex, todo comando dentro do sandbox falha, e isso é o
// normal). Abaixo da meia hora é o CRM frio ou um tropeço da rede, que o envio seguinte resolve. O evento entra na
// fila e sobe no próximo envio. O agente vai como nos outros eventos, só no Codex: o de quem falhou, gravado no
// registro, ou o de quem destravou.
const ATRASO_QUE_SOBE_MS = 30 * 60 * 1000;
function avisarAtraso(falhas, ate) {
  try {
    const desde = Date.parse(falhas.desde);
    const ms = Date.parse(falhas.ultimo && falhas.ultimo.em) - desde;
    if (!Number.isFinite(ms) || ms < ATRASO_QUE_SOBE_MS) return;
    const id = idDoAtraso(falhas.desde);
    if (fila.ler().some((x) => x.id === id)) return;
    let doCodex = falhas.agente === 'codex';
    if (!doCodex) { try { doCodex = require('./agente').atual() === 'codex'; } catch { /* sem agente: é o Claude */ } }
    fila.enfileirar('envio.atrasado', {
      desde: falhas.desde,
      ate,
      minutos: Math.round(ms / 60000),
      tentativas: falhas.tentativas || 0,
      motivos: falhas.motivos || {},
      ultimo: falhas.ultimo || null,
      ...(doCodex ? { agente: 'codex' } : {}),
    }, estadoLib.carregar(), { id });
  } catch { /* o envio já deu certo; o registro do atraso não pode atrapalhar */ }
}

// O que o envio anota no estado. O `e` que chegou aqui foi lido antes da rede, segundos atrás, e nesse tempo outro
// processo pode ter gravado: um hook de turno, um comando do tutor, a avaliação que roda fora do chat. Gravar o `e`
// inteiro apagava o que eles escreveram (a nota recém-registrada voltava a "em andamento", um marco sumia). Então a
// mudança vai para a cópia de quem chamou e para o estado relido agora, e é este que se grava.
function anotar(e, muda) {
  try { muda(e); } catch { /* segue */ }
  try { const atual = estadoLib.carregar(); muda(atual); estadoLib.salvar(atual); } catch { /* segue */ }
}

// O envio que não depende de hook. Todo comando do CLI que registra progresso
// chama isto ao terminar: é o tutor rodando o comando que sobe a fila, na hora,
// em qualquer máquina. Os hooks continuam tentando também, mas numa sala onde
// eles não rodam (configuração da máquina, versão, sistema) o progresso sobe
// igual. Nunca lança e nunca imprime nada: o comando já disse o que tinha a dizer.
// Quanto o envio depois de um comando espera pela resposta. Dois segundos na
// aula, porque o tutor está esperando o comando terminar. Mas medido em 05/10:
// o CRM frio leva 1,8 s só para responder 401, e um envio de verdade, que grava
// e projeta, passa disso. A 1.1 reavaliada às 14:57 estourou os 2 s, e a 1.2 às
// 14:58 caiu na espera de dois minutos depois da falha - as duas notas ficaram
// no disco até um `enviar` à mão. `avaliar` e `corrigir` já levam um ou dois
// minutos, e são os eventos que mais importam: oito segundos a mais ali não
// pesam em ninguém.
const PRAZO_PADRAO_MS = 2000;
const PRAZO_POR_COMANDO_MS = { avaliar: 8000, corrigir: 8000 };

function prazoDeEnvio(comando) {
  return PRAZO_POR_COMANDO_MS[comando] || PRAZO_PADRAO_MS;
}

async function enviarAgora({ timeoutMs = PRAZO_PADRAO_MS, origem = null } = {}) {
  try {
    const e = estadoLib.carregar();
    if (!acesso.conectado(e)) return null;
    const desdeFalha = e.envio_falhou_em ? Date.now() - new Date(e.envio_falhou_em).getTime() : Infinity;
    if (desdeFalha < ESPERA_APOS_FALHA_MS) return null;
    return await enviar({ timeoutMs, estado: e, origem });
  } catch {
    return null;
  }
}

// O envio que insiste, para a nota de uma avaliação (trilha.js, `avaliar`). O `enviarAgora` desistia fácil demais
// dela: uma tentativa, e nenhuma se outro envio tinha falhado nos dois minutos anteriores (o CRM frio estoura os dois
// segundos do envio de um marco). Com o aluno fechando o aplicativo logo depois da aula, a nota ficava no disco até
// o chat seguinte. Quem chama diz as esperas entre as tentativas; se nenhuma passar, a fila continua no disco e
// sobe no próximo hook, como sempre.
const ESPERAS_MS = process.env.TRILHA_202_ENVIO_ESPERAS_MS
  ? process.env.TRILHA_202_ENVIO_ESPERAS_MS.split(',').map(Number).filter((n) => n >= 0)
  : null;

async function enviarInsistindo({ timeoutMs = 20000, esperas = [0, 5000, 20000], origem = null } = {}) {
  for (const espera of ESPERAS_MS || esperas) {
    try {
      if (espera) await new Promise((ok) => setTimeout(ok, espera));
      if (!fila.ler().length) return true;
      const e = estadoLib.carregar();
      if (!acesso.conectado(e)) return false;
      const r = await enviar({ timeoutMs, estado: e, origem });
      if (r.ok && !r.pendentes) return true;
      // Token recusado não se resolve insistindo; e com página ainda por sair, a próxima volta não precisa esperar.
      if (r.status === 401 || /recusado|sem token|não configurado/.test(r.motivo || '')) return false;
    } catch { /* tenta de novo */ }
  }
  return false;
}

module.exports = { enviar, enviarAgora, enviarInsistindo, prazoDeEnvio, ESPERA_APOS_FALHA_MS };
