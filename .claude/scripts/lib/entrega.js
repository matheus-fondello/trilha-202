'use strict';
// O que o corretor de prática lê (05/10, achado 13 do raio-X da avaliação).
//
// A correção saiu do chat pela mesma razão que a avaliação de aula saiu em
// 11/09: o tutor escrevia o JSON com as notas em trilha/tmp, e a chamada de
// escrita aparecia na tela do aluno. Agora quem dá a nota é um `claude -p` sem
// ferramenta nenhuma (lib/avaliador.js), e este módulo junta o que ele precisa
// ler, na ordem que a régua de cada prática pede:
//
//   - os arquivos da entrega, na pasta registrada, com a spec, o CLAUDE.md, o
//     README, o design e os testes na frente do resto;
//   - o histórico de commits, pela pasta local (a régua pergunta se o trabalho
//     aparece pronto num commit só);
//   - o HTML da página no ar, e se o repositório responde publicamente.
//
// O que só um navegador faz - usar o simulador, ver a página a 390px - não está
// aqui: é a conferência que o tutor escreve antes, como fato e sem nota.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { legivel } = require('./produto');

const POR_ARQUIVO = 15000;
const TOTAL = 120000;
const MAX_ARQUIVOS = 30;
const MAX_VISITAS = 5000;
const PAGINA = 60000;
const TIMEOUT_REDE_MS = 15000;

const IGNORAR = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'out', '.vercel', '.cache', 'coverage', '__pycache__', '.venv', 'venv']);

// O que a régua manda ler primeiro. A ordem decide o que entra quando o teto
// aperta: um repositório grande perde código periférico, nunca a spec.
// `spec` não casa arquivo de teste (`calc.spec.ts`): um teste passava na frente
// do README, e com o teto o README ficava de fora e a régua lia ausência.
const PRIORIDADE = [
  /^(?!.*\.spec\.[cm]?[jt]sx?$).*spec/i, /^claude\.md$/i, /^readme/i, /design|estilo|style-guide/i,
  /verifica|evidenc|checklist|screenshot/i, /test|spec\.(js|ts)$/i,
  /^index\.html?$/i,
];

function prioridade(rel) {
  const nome = path.basename(rel);
  const i = PRIORIDADE.findIndex((re) => re.test(nome) || re.test(rel));
  return i < 0 ? PRIORIDADE.length : i;
}

function listar(pasta) {
  const achados = [];
  let visitas = 0;
  const fila = [pasta];
  while (fila.length && visitas < MAX_VISITAS) {
    const dir = fila.shift();
    let entradas;
    try { entradas = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const ent of entradas) {
      if (++visitas > MAX_VISITAS) break;
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (!IGNORAR.has(ent.name) && (!ent.name.startsWith('.') || ent.name === '.claude')) fila.push(p);
      } else if (ent.isFile() && legivel(p)) achados.push(path.relative(pasta, p).replace(/\\/g, '/'));
    }
  }
  return achados.sort((a, b) => prioridade(a) - prioridade(b) || a.split('/').length - b.split('/').length || a.localeCompare(b));
}

function arquivos(pasta) {
  const blocos = [];
  const omitidos = [];
  let total = 0;
  const lista = listar(pasta);
  for (const rel of lista) {
    if (blocos.length >= MAX_ARQUIVOS) { omitidos.push(rel); continue; }
    let bruto;
    try { bruto = fs.readFileSync(path.join(pasta, rel)); } catch { continue; }
    if (bruto.includes(0)) continue;
    let texto = bruto.toString('utf8');
    if (texto.length > POR_ARQUIVO) texto = texto.slice(0, POR_ARQUIVO) + `\n[...cortado: ${texto.length} caracteres no total...]`;
    // Um arquivo que não cabe é pulado e nomeado, e não encerra a coleta: os
    // menores que vêm depois ainda entram.
    if (total + texto.length > TOTAL) { omitidos.push(rel); continue; }
    blocos.push({ rel, texto });
    total += texto.length;
  }
  return { blocos, omitidos, total, listados: lista.length };
}

function historico(pasta) {
  if (!fs.existsSync(path.join(pasta, '.git'))) return null;
  const r = spawnSync('git', ['-C', pasta, 'log', '--date=iso-strict', '--pretty=format:%h %ad %s', '-n', '80'], { encoding: 'utf8', timeout: 10000 });
  if (r.status !== 0) return null;
  return r.stdout.trim() || null;
}

async function buscar(url, limite) {
  if (typeof fetch !== 'function') return { ok: false, motivo: 'esta versão do Node não tem fetch' };
  // Os testes do harness rodam sem tocar a rede: com TRILHA_202_REDE=local só a
  // própria máquina responde, como o servidor da 202 que o copia.js aponta para
  // uma porta fechada.
  if (process.env.TRILHA_202_REDE === 'local') {
    let host = '';
    try { host = new URL(url).hostname; } catch { /* endereço torto */ }
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(host)) return { ok: false, motivo: 'rede desligada neste ambiente' };
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_REDE_MS);
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: 'follow' });
    const texto = limite ? (await r.text()).slice(0, limite) : '';
    return { ok: r.ok, status: r.status, texto };
  } catch (err) {
    return { ok: false, motivo: err.name === 'AbortError' ? `não respondeu em ${TIMEOUT_REDE_MS / 1000}s` : err.message };
  } finally {
    clearTimeout(t);
  }
}

// O material inteiro, como texto para o prompt, e o resumo que sobe para a 202
// (contagens, sem conteúdo e sem caminho).
async function coletar(p) {
  const partes = [];
  const resumo = { arquivos: 0, caracteres: 0, historico: false, pagina: null, repositorio: null };

  if (p.pasta && fs.existsSync(p.pasta)) {
    const a = arquivos(p.pasta);
    resumo.arquivos = a.blocos.length;
    resumo.caracteres = a.total;
    partes.push(`### Arquivos da entrega (${a.blocos.length} de ${a.listados} arquivos de texto lidos)\n\n`
      + (a.blocos.map((b) => `#### ${b.rel}\n\n\`\`\`\n${b.texto}\n\`\`\``).join('\n\n') || '(nenhum arquivo de texto na pasta)')
      + (a.omitidos.length
        ? `\n\n#### Também na entrega, sem o conteúdo\n\n${a.omitidos.map((r) => `- ${r} (conteúdo omitido pelo teto)`).join('\n')}`
        : ''));
    const h = historico(p.pasta);
    resumo.historico = Boolean(h);
    partes.push(`### Histórico de commits da pasta, do mais novo ao mais antigo\n\n${h ? '```\n' + h + '\n```' : '(a pasta não é um repositório git, ou o git não respondeu)'}`);
  } else {
    partes.push('### Arquivos da entrega\n\n(a pasta registrada não existe mais nesta máquina)');
  }

  if (p.url) {
    const r = await buscar(p.url, PAGINA);
    resumo.pagina = r.ok ? r.status : (r.status || 'falhou');
    partes.push(r.ok
      ? `### HTML da página no ar (${p.url}), como o servidor devolveu\n\n\`\`\`html\n${r.texto}\n\`\`\``
      : `### Página no ar (${p.url})\n\n(daqui ela não abriu: ${r.status ? 'HTTP ' + r.status : r.motivo}. A conferência do tutor diz o que ele viu no navegador.)`);
  }
  if (p.repo) {
    const r = await buscar(p.repo, 0);
    resumo.repositorio = r.ok ? 'publico' : (r.status || 'falhou');
    partes.push(`### Repositório (${p.repo})\n\n${r.ok ? 'Respondeu publicamente.' : `Não respondeu publicamente daqui (${r.status ? 'HTTP ' + r.status : r.motivo}): ou é privado, ou o endereço está errado, ou a rede falhou.`}`);
  }

  return { texto: partes.join('\n\n'), resumo };
}

module.exports = { coletar, listar, arquivos, historico, POR_ARQUIVO, TOTAL, MAX_ARQUIVOS };
