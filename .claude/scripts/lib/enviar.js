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

// `token` e `url` explícitos são do `conectar`, que confere um token antes de
// guardá-lo: nesse caso a resposta é dele para interpretar, e o estado não muda aqui.
async function enviar({ timeoutMs = 3000, estado = null, token = null, url = null } = {}) {
  const config = lerJson(CONFIG, {});
  const destino = url || acesso.servidor();
  const chave = token || acesso.token();
  const eventos = fila.ler();
  if (!eventos.length) return { ok: true, enviados: 0, motivo: 'fila vazia' };
  if (!destino) return { ok: false, enviados: 0, pendentes: eventos.length, motivo: 'servidor não configurado' };
  // Parar antes da rede é deliberado: sem token o servidor responderia 401, e
  // "sem token de acesso" diz o que fazer; "servidor respondeu 401" não diz.
  if (!chave) return { ok: false, enviados: 0, pendentes: eventos.length, motivo: 'sem token de acesso' };

  const e = estado || estadoLib.carregar();
  // Token já recusado não volta a bater na porta a cada turno: só um `conectar`
  // com token novo reabre.
  if (!token && e.acesso && e.acesso.recusado_em) return { ok: false, enviados: 0, pendentes: eventos.length, motivo: 'token recusado pela 202' };

  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), timeoutMs);
  try {
    const resp = await fetch(destino + '/eventos', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${chave}` },
      body: JSON.stringify({
        aluno: { email: e.aluno.email, id: e.aluno.id },
        harness: config.harness || {},
        enviado_em: agora(),
        eventos,
      }),
      signal: controle.signal,
    });
    if (!resp.ok) {
      if (resp.status === 401 && !token && e.acesso) {
        e.acesso.recusado_em = agora();
        estadoLib.salvar(e);
      } else if (!token) {
        marcarFalha(e);
      }
      return { ok: false, status: resp.status, enviados: 0, pendentes: eventos.length, motivo: `servidor respondeu ${resp.status}` };
    }
    let corpo = {};
    try { corpo = await resp.json(); } catch { /* corpo vazio é aceito */ }
    fila.remover(eventos.map((x) => x.id));
    let mudou = false;
    if (corpo.aluno_id && corpo.aluno_id !== e.aluno.id) {
      e.aluno.id = corpo.aluno_id;
      mudou = true;
    }
    if (!token && e.acesso && !e.acesso.verificado_em) {
      e.acesso.verificado_em = agora();
      mudou = true;
    }
    if (e.envio_falhou_em) {
      delete e.envio_falhou_em;
      mudou = true;
    }
    if (mudou) estadoLib.salvar(e);
    return { ok: true, status: resp.status, enviados: eventos.length, aluno_id: corpo.aluno_id || null, motivo: 'enviado' };
  } catch (err) {
    if (!token) marcarFalha(e);
    const motivo = err.name === 'AbortError' ? `timeout de ${timeoutMs}ms` : (err.cause && err.cause.code) || err.message;
    return { ok: false, enviados: 0, pendentes: eventos.length, motivo };
  } finally {
    clearTimeout(timer);
  }
}

// Servidor fora do ar ou lento: anota, e o envio automático do CLI espera antes
// de tentar de novo, para o aluno não pagar um timeout a cada milestone.
const ESPERA_APOS_FALHA_MS = 2 * 60 * 1000;

function marcarFalha(e) {
  try { e.envio_falhou_em = agora(); estadoLib.salvar(e); } catch { /* segue */ }
}

// O envio que não depende de hook. Todo comando do CLI que registra progresso
// chama isto ao terminar: é o tutor rodando o comando que sobe a fila, na hora,
// em qualquer máquina. Os hooks continuam tentando também, mas numa sala onde
// eles não rodam (configuração da máquina, versão, sistema) o progresso sobe
// igual. Nunca lança e nunca imprime nada: o comando já disse o que tinha a dizer.
async function enviarAgora({ timeoutMs = 2000 } = {}) {
  try {
    const e = estadoLib.carregar();
    if (!acesso.conectado(e)) return null;
    const desdeFalha = e.envio_falhou_em ? Date.now() - new Date(e.envio_falhou_em).getTime() : Infinity;
    if (desdeFalha < ESPERA_APOS_FALHA_MS) return null;
    return await enviar({ timeoutMs, estado: e });
  } catch {
    return null;
  }
}

module.exports = { enviar, enviarAgora, ESPERA_APOS_FALHA_MS };
