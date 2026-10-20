'use strict';
// Antes de qualquer lib: o processo do hook do Codex não recebe CODEX_THREAD_ID (T0.17).
process.env.TRILHA_202_AGENTE = 'codex';
// PreToolUse do Codex (branch codex). A regra é a da guarda do Claude (`.claude/hooks/guarda.js`), que roda aqui sem
// mudar uma linha: este adaptador só traduz o que o Codex manda para a entrada que ela entende, e a resposta dela para
// o que o Codex entende.
//
// - O shell chega em `tool_input.command` como o agente o escreveu; às vezes embrulhado num `powershell -Command`, ou
//   como lista de argumentos. A guarda confere o comando de dentro.
// - O `apply_patch` chega como o texto do patch: cada arquivo que ele cria, muda, apaga ou para onde move vira uma
//   escrita, conferida como o Write do Claude.
// - O `view_image` lê um arquivo do disco para o contexto: vira uma leitura pelo shell, para o sigilo valer também por
//   ele (a persona, a régua, o banco do quiz). A busca na web e os conectores não têm caminho nem URL claros no
//   payload: ficam com o AGENTS.md e com o `web_search` desligado no config.toml.
//
// Bloquear é responder em JSON: o hook roda dentro do PowerShell 5.1, que troca o exit 2 por 1, e o 1 não bloqueia.
// Sai sempre com 0, e se ele mesmo quebrar, deixa passar, como a guarda do Claude.
const path = require('path');
const { spawnSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..', '..', '..');
const GUARDA = path.join(__dirname, '..', 'guarda.js');
const SHELL = process.platform === 'win32' ? 'PowerShell' : 'Bash';

function lerEntrada() {
  try { return JSON.parse(require('fs').readFileSync(0, 'utf8') || '{}'); } catch { return null; }
}

// Tira as aspas de fora de um argumento de shell: as simples dobram a aspa de dentro, as duplas a escapam.
function semAspas(s) {
  const t = s.trim();
  if (t.length >= 2 && t[0] === "'" && t[t.length - 1] === "'") return t.slice(1, -1).replace(/''/g, "'");
  if (t.length >= 2 && t[0] === '"' && t[t.length - 1] === '"') return t.slice(1, -1).replace(/\\"/g, '"').replace(/`"/g, '"');
  return t;
}

// O comando de dentro de `powershell [opções] -Command <cmd>` (e de `bash -lc <cmd>`, a forma do Mac e do Linux). As
// opções antes do -Command podem ter valor (`-ExecutionPolicy Bypass`), por isso o corte é no -Command, e não numa
// lista de opções conhecidas. O PowerShell aceita qualquer começo do nome (`-c`, `-Co`, `-Comm`); o `cmd /c "<cmd>"`
// é a outra forma do Windows. Sem desembrulhar, o CLI legítimo chegava à guarda como um comando que cita `.claude/`.
const EMBRULHO = /^\s*(?:&\s*)?(["']?)(?:[^\s"']*[\\/])?(?:powershell|pwsh)(?:\.exe)?\1\s+(?:[\s\S]*?\s)?-c(?:o(?:m(?:m(?:a(?:n(?:d)?)?)?)?)?)?\s+([\s\S]+)$/i;
const EMBRULHO_CMD = /^\s*(["']?)(?:[^\s"']*[\\/])?cmd(?:\.exe)?\1\s+(?:\/[a-z]\s+)*?\/c\s+([\s\S]+)$/i;
const EMBRULHO_SH = /^\s*(["']?)(?:[^\s"']*[\\/])?(?:bash|sh|zsh)\1\s+-l?c\s+([\s\S]+)$/;
function desembrulhar(bruto) {
  let cmd = Array.isArray(bruto) ? bruto[bruto.length - 1] : bruto;
  cmd = typeof cmd === 'string' ? cmd : '';
  for (let i = 0; i < 3; i++) {
    const m = EMBRULHO.exec(cmd) || EMBRULHO_CMD.exec(cmd) || EMBRULHO_SH.exec(cmd);
    if (!m) break;
    cmd = semAspas(m[2]);
  }
  return cmd;
}

// Os arquivos de um patch do `apply_patch`: o que ele cria, muda ou apaga, e o destino de um `Move to`.
function arquivosDoPatch(texto) {
  const lista = [];
  for (const linha of String(texto || '').split(/\r?\n/)) {
    const m = /^\*\*\* (?:(?:Add|Update|Delete) File|Move to):\s*(.+?)\s*$/.exec(linha);
    if (m) lista.push(m[1]);
  }
  return lista;
}

function entradas(payload) {
  const ti = payload.tool_input || {};
  const cwd = payload.cwd || RAIZ;
  const tool = payload.tool_name || '';
  if (tool === 'apply_patch') {
    const texto = typeof ti === 'string' ? ti : ti.command || ti.input || ti.patch || '';
    return arquivosDoPatch(texto).map((file_path) => ({ tool_name: 'Write', tool_input: { file_path }, cwd }));
  }
  if (tool === 'view_image') {
    if (!ti.path) return [];
    return [{ tool_name: SHELL, tool_input: { command: `cat "${String(ti.path)}"` }, cwd }];
  }
  if (tool === 'Bash' || tool === 'PowerShell' || tool === 'exec_command' || tool === 'shell') {
    const command = desembrulhar(ti.command !== undefined ? ti.command : ti.cmd);
    return command.trim() ? [{ tool_name: SHELL, tool_input: { command }, cwd }] : [];
  }
  return [];
}

function main() {
  const payload = lerEntrada();
  if (!payload) return;
  for (const entrada of entradas(payload)) {
    const r = spawnSync(process.execPath, [GUARDA], { input: JSON.stringify(entrada), cwd: RAIZ, encoding: 'utf8', timeout: 4000, windowsHide: true, env: process.env });
    if (r.status === 2) {
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: String(r.stderr || '').trim() || 'Guarda da sala: bloqueado.' } }));
      return;
    }
  }
}

try { main(); } catch { /* a guarda quebrou: deixa passar */ }
process.exitCode = 0;
