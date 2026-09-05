'use strict';
// Cliente do servidor da 202. Envia a fila inteira num POST. Se não há URL
// configurada, rede fora ou servidor com erro: devolve o motivo e a fila fica
// como está. Nunca lança. Nunca segura o hook por mais que o timeout.
const { CONFIG } = require('./paths');
const { lerJson, agora } = require('./util');
const fila = require('./fila');
const estadoLib = require('./estado');

async function enviar({ timeoutMs = 3000, estado = null } = {}) {
  const config = lerJson(CONFIG, {});
  const url = process.env.TRILHA_202_SERVIDOR || (config.servidor && config.servidor.url);
  const eventos = fila.ler();
  if (!eventos.length) return { ok: true, enviados: 0, motivo: 'fila vazia' };
  if (!url) return { ok: false, enviados: 0, pendentes: eventos.length, motivo: 'servidor não configurado' };

  const e = estado || estadoLib.carregar();
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), timeoutMs);
  try {
    const resp = await fetch(url.replace(/\/$/, '') + '/eventos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        aluno: { email: e.aluno.email, id: e.aluno.id },
        harness: config.harness || {},
        enviado_em: agora(),
        eventos,
      }),
      signal: controle.signal,
    });
    if (!resp.ok) return { ok: false, enviados: 0, pendentes: eventos.length, motivo: `servidor respondeu ${resp.status}` };
    let corpo = {};
    try { corpo = await resp.json(); } catch { /* corpo vazio é aceito */ }
    fila.remover(eventos.map((x) => x.id));
    if (corpo.aluno_id && corpo.aluno_id !== e.aluno.id) {
      e.aluno.id = corpo.aluno_id;
      estadoLib.salvar(e);
    }
    return { ok: true, enviados: eventos.length, motivo: 'enviado' };
  } catch (err) {
    const motivo = err.name === 'AbortError' ? `timeout de ${timeoutMs}ms` : (err.cause && err.cause.code) || err.message;
    return { ok: false, enviados: 0, pendentes: eventos.length, motivo };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { enviar };
