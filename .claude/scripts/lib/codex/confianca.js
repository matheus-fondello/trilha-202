'use strict';
// Se o Codex desta máquina confia na pasta da sala e nos hooks dela (branch codex). Só leitura: o `config.toml` do
// Codex é do aluno, e quem confia é ele, pela tela do Codex.
//
// Sem a pasta confiada, o Codex ignora a `.codex/` inteira, em silêncio (T0.11): nem os hooks nem a configuração da
// sala valem. Cada hook ainda precisa de confiança própria, pelo hash da declaração dele no `hooks.json`, guardado em
// `[hooks.state.'<caminho do hooks.json>:<evento>:<grupo>:<hook>'] trusted_hash`. Um `hooks.json` que mudou desliga o
// hook até ele ser confiado de novo. Nada da sala depende disso: sem hook, os comandos fazem o mesmo trabalho.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const paths = require('../paths');

// O rótulo de cada evento na chave e no hash (codex-rs, hooks/src/lib.rs, hook_event_key_label).
const ROTULO = {
  PreToolUse: 'pre_tool_use', PermissionRequest: 'permission_request', PostToolUse: 'post_tool_use', PreCompact: 'pre_compact',
  PostCompact: 'post_compact', SessionStart: 'session_start', SessionEnd: 'session_end', UserPromptSubmit: 'user_prompt_submit',
  SubagentStart: 'subagent_start', SubagentStop: 'subagent_stop', Stop: 'stop',
};
// Os eventos que guardam o matcher no hash, e os que aceitam o limite do contexto (discovery.rs e events/common.rs).
const COM_MATCHER = new Set(['PreToolUse', 'PermissionRequest', 'PostToolUse', 'SessionStart', 'SessionEnd', 'SubagentStart', 'SubagentStop', 'PreCompact', 'PostCompact']);
const COM_CONTEXTO = new Set(['PreToolUse', 'PostToolUse', 'SessionStart', 'UserPromptSubmit', 'SubagentStart']);
const LIMITE_PADRAO = 2500;

const ordenar = (v) => (Array.isArray(v) ? v.map(ordenar)
  : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, ordenar(v[k])])) : v);

// O hash que o Codex confere (discovery.rs, hook_hash e fingerprint.rs, version_for_toml): a declaração normalizada
// de um hook, em JSON compacto e com as chaves em ordem, por SHA-256. Normalizar é: o comando da plataforma, sem o
// `commandWindows`; o tempo com o padrão (600 s; 1 s no fim, até 3); e o limite do contexto só quando difere do padrão.
function hashDoHook(evento, grupo, h) {
  const comando = process.platform === 'win32' && h.commandWindows ? h.commandWindows : h.command;
  const fimDeSessao = evento === 'SessionEnd';
  const tempo = fimDeSessao ? Math.min(Math.max(h.timeout == null ? 1 : h.timeout, 1), 3) : Math.max(h.timeout == null ? 600 : h.timeout, 1);
  const limite = COM_CONTEXTO.has(evento) && h.additionalContextLimit != null && h.additionalContextLimit !== LIMITE_PADRAO ? h.additionalContextLimit : null;
  const normal = { type: 'command', command: comando, timeout: tempo, async: Boolean(h.async), ...(h.statusMessage != null ? { statusMessage: h.statusMessage } : {}), ...(limite != null ? { additionalContextLimit: limite } : {}) };
  const ident = { event_name: ROTULO[evento], ...(COM_MATCHER.has(evento) && grupo.matcher != null ? { matcher: grupo.matcher } : {}), hooks: [normal] };
  return 'sha256:' + crypto.createHash('sha256').update(JSON.stringify(ordenar(ident))).digest('hex');
}

// --- o config.toml, só o que interessa aqui ---
//
// Tabelas (`[a.'b'.c]`) e pares `chave = valor` simples. O Codex grava os caminhos em aspas simples, que no TOML são
// literais; as duplas têm escape.
function partesDoCabecalho(s) {
  const partes = [];
  let i = 0;
  while (i < s.length) {
    while (s[i] === ' ' || s[i] === '\t') i++;
    if (s[i] === "'") { const j = s.indexOf("'", i + 1); partes.push(s.slice(i + 1, j)); i = j + 1; }
    else if (s[i] === '"') {
      let j = i + 1; let v = '';
      while (j < s.length && s[j] !== '"') { if (s[j] === '\\') { v += s[j + 1] === 'n' ? '\n' : s[j + 1]; j += 2; } else v += s[j++]; }
      partes.push(v); i = j + 1;
    } else { const m = /^[A-Za-z0-9_-]+/.exec(s.slice(i)); if (!m) break; partes.push(m[0]); i += m[0].length; }
    while (s[i] === ' ' || s[i] === '\t') i++;
    if (s[i] === '.') i++;
    else break;
  }
  return partes;
}
function valor(v) {
  const t = v.trim();
  if (t[0] === "'") return t.slice(1, t.indexOf("'", 1));
  if (t[0] === '"') { const m = /^"((?:[^"\\]|\\.)*)"/.exec(t); return m ? m[1].replace(/\\(.)/g, '$1') : t; }
  if (/^(true|false)\b/.test(t)) return t.startsWith('true');
  return t.replace(/\s*#.*$/, '');
}
function lerToml(texto) {
  const tabelas = [];
  let atual = null;
  for (const bruta of String(texto).split(/\r?\n/)) {
    const linha = bruta.trim();
    if (!linha || linha[0] === '#') continue;
    const cab = /^\[([^\[\]].*)\]\s*(#.*)?$/.exec(linha);
    if (cab) { atual = { caminho: partesDoCabecalho(cab[1]), valores: {} }; tabelas.push(atual); continue; }
    const par = /^([A-Za-z0-9_-]+)\s*=\s*(.+)$/.exec(linha);
    if (par && atual) atual.valores[par[1]] = valor(par[2]);
  }
  return tabelas;
}

// O mesmo caminho, com a caixa e as barras de cada sistema (o Codex grava a pasta em minúsculas no Windows).
const normal = (p) => {
  let s = String(p || '').replace(/\\/g, '/').replace(/^\/\/\?\//, '').replace(/\/+$/, '');
  if (process.platform === 'win32' || /^[a-z]:\//i.test(s)) s = s.toLowerCase();
  return s;
};
function variantes(p) {
  const v = new Set([normal(p)]);
  try { v.add(normal(fs.realpathSync.native(p))); } catch { /* fica a de cima */ }
  return v;
}

// { pasta: 'confiada' | 'nao-confiavel' | 'sem-decisao', config: bool, hooks: [{ evento, estado }] }, com o estado de
// cada hook 'revisado', 'mudou', 'sem-revisao' ou 'desligado'.
function verificar({ home = paths.codexHome(), raiz = paths.RAIZ } = {}) {
  let texto = null;
  try { texto = fs.readFileSync(path.join(home, 'config.toml'), 'utf8'); } catch { /* sem config: nada confiado */ }
  const tabelas = texto === null ? [] : lerToml(texto);
  const daSala = variantes(raiz);
  const projeto = tabelas.find((t) => t.caminho.length === 2 && t.caminho[0] === 'projects' && daSala.has(normal(t.caminho[1])));
  const nivel = projeto ? projeto.valores.trust_level : null;
  const pasta = nivel === 'trusted' ? 'confiada' : nivel === 'untrusted' ? 'nao-confiavel' : 'sem-decisao';

  const arqHooks = path.join(raiz, '.codex', 'hooks.json');
  let declarados = {};
  try { declarados = JSON.parse(fs.readFileSync(arqHooks, 'utf8')).hooks || {}; } catch { declarados = {}; }
  const doHooks = variantes(arqHooks);
  const estados = {};
  for (const t of tabelas) {
    if (t.caminho.length !== 3 || t.caminho[0] !== 'hooks' || t.caminho[1] !== 'state') continue;
    const m = /^(.*):([a-z_]+):(\d+):(\d+)$/.exec(t.caminho[2]);
    if (m && doHooks.has(normal(m[1]))) estados[`${m[2]}:${m[3]}:${m[4]}`] = t.valores;
  }
  const hooks = [];
  for (const [evento, grupos] of Object.entries(declarados)) {
    (grupos || []).forEach((grupo, g) => (grupo.hooks || []).forEach((h, i) => {
      const st = estados[`${ROTULO[evento]}:${g}:${i}`] || {};
      const estado = st.enabled === false ? 'desligado'
        : !st.trusted_hash ? 'sem-revisao'
          : st.trusted_hash === hashDoHook(evento, grupo, h) ? 'revisado' : 'mudou';
      hooks.push({ evento, estado });
    }));
  }
  return { pasta, config: texto !== null, hooks };
}

module.exports = { verificar, hashDoHook, lerToml };
