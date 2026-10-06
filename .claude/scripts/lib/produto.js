'use strict';
// O que o aluno produziu na oficina, para o avaliador ler (05/10, achado 01 do
// raio-X da avaliação).
//
// A aula acontece em duas janelas: a sala, onde o tutor explica, e a oficina,
// onde o aluno constrói com o Claude Code. A transcrição é só da sala, então o
// avaliador via o produto apenas quando o aluno colava um pedaço dele, ou nos
// primeiros 200 caracteres de um arquivo que o tutor abriu. Um CLAUDE.md podado
// com cuidado e um feito às pressas chegavam com o mesmo texto.
//
// Duas fontes, nesta ordem:
//   1. os arquivos que o tutor nomeou ao registrar a fluência
//      (`fluencia <aula> passou 1 arquivos=CLAUDE.md,index.html`): é o produto
//      que a fluência pediu, dito por quem viu a aula;
//   2. sem isso, os arquivos de texto das pastas de trabalho do aluno (a oficina
//      e as pastas de prática registradas) modificados desde o início da aula.
//
// Tudo com teto, e nada disso sai da máquina: vai só para o `claude -p` local,
// que é o mesmo modelo que o agente da oficina já usou para ler esses arquivos.
// Para a 202 sobe só a contagem (quantos arquivos, quantos caracteres, de onde).
const fs = require('fs');
const path = require('path');
const paths = require('./paths');

const POR_ARQUIVO = 20000;
const TOTAL = 60000;
const MAX_ARQUIVOS = 12;
// Quantas entradas a busca percorre antes de desistir. Uma oficina registrada na
// pasta pessoal do aluno não pode fazer o `avaliar` varrer o disco inteiro.
const MAX_VISITAS = 4000;

const PASTAS_IGNORADAS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'out', '.vercel', '.cache', 'coverage', '__pycache__', '.venv', 'venv', 'trilha']);
const TEXTO = new Set(['.md', '.txt', '.html', '.htm', '.css', '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.py', '.sql', '.yml', '.yaml', '.toml', '.svg', '.csv', '.sh', '.ps1']);
const SEM_EXTENSAO = new Set(['Dockerfile', 'Makefile', 'README', 'LICENSE']);

// Segredo nunca entra, mesmo que o tutor nomeie: um `.env` não diz nada sobre
// o que o aluno aprendeu, e o lugar dele não é um prompt.
function segredo(nome) {
  const n = nome.toLowerCase();
  return n.startsWith('.env') || /\.(pem|key|p12|pfx)$/.test(n) || n === 'credenciais.json' || n.includes('secret');
}

function legivel(arquivo) {
  const nome = path.basename(arquivo);
  if (segredo(nome)) return false;
  if (/\.lock$|-lock\.json$|\.min\.(js|css)$/.test(nome)) return false;
  return TEXTO.has(path.extname(nome).toLowerCase()) || SEM_EXTENSAO.has(nome);
}

// A pasta de trabalho de verdade, e nunca a sala nem algo que a contenha: a
// sala tem o harness, e uma pasta acima dela traria a sala junto.
// `filho` está em `pai` (ou é ele). No Windows, dois drives diferentes dão um
// relativo absoluto, que não é "dentro".
function dentro(pai, filho) {
  const rel = path.relative(pai, filho);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

function pastaValida(p) {
  if (!p || !fs.existsSync(p)) return false;
  return !dentro(p, paths.RAIZ) && !dentro(paths.RAIZ, p);
}

function pastasDeTrabalho(e) {
  const todas = [e.oficina, ...Object.values(e.praticas || {}).map((p) => p && p.pasta)].filter(Boolean);
  return [...new Set(todas.map((p) => path.resolve(p)))].filter(pastaValida);
}

function modificadosEntre(pasta, desde, ate) {
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
        // Pasta oculta fica de fora, menos a `.claude`: a fluência da 1.8 é
        // justamente criar uma skill e uma regra ali.
        if (!PASTAS_IGNORADAS.has(ent.name) && (!ent.name.startsWith('.') || ent.name === '.claude')) fila.push(p);
      } else if (ent.isFile() && legivel(p)) {
        try {
          const t = fs.statSync(p).mtimeMs;
          if (t >= desde && t <= ate) achados.push({ p, t });
        } catch { /* sumiu no meio */ }
      }
    }
  }
  // Os mais recentes primeiro: com teto, o que fica de fora é o que mudou antes.
  return achados.sort((a, b) => b.t - a.t).map((x) => x.p);
}

// Um caminho que o tutor nomeou: relativo à oficina, a uma pasta de prática, ou
// absoluto. Devolve o primeiro que existe.
function resolverNomeado(nome, pastas) {
  if (path.isAbsolute(nome)) return fs.existsSync(nome) ? nome : null;
  for (const base of pastas) {
    const p = path.resolve(base, nome);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function ler(arquivo) {
  let bruto;
  try { bruto = fs.readFileSync(arquivo); } catch { return null; }
  if (bruto.includes(0)) return null; // binário com extensão de texto
  const texto = bruto.toString('utf8');
  return texto.length > POR_ARQUIVO
    ? texto.slice(0, POR_ARQUIVO) + `\n[...arquivo cortado: ${texto.length} caracteres no total...]`
    : texto;
}

// O que o `avaliar` anexa ao prompt. `texto` é null quando não há nada para
// anexar, e `resumo` é o que sobe para a 202 (sem conteúdo e sem caminho, que
// carrega o nome de usuário).
function coletar(e, reg) {
  const pastas = pastasDeTrabalho(e);
  const nomeados = (reg.fluencia && Array.isArray(reg.fluencia.arquivos)) ? reg.fluencia.arquivos : [];
  let fonte = null;
  let lista = [];
  if (nomeados.length) {
    fonte = 'nomeados pelo tutor';
    lista = nomeados.map((n) => resolverNomeado(n, pastas)).filter(Boolean);
  }
  if (!lista.length) {
    // A janela é a da aula: do início até a conclusão, com cinco minutos de
    // folga para o arquivo salvo enquanto o tutor fechava. Sem o fim, uma
    // reavaliação da 1.1 feita à tarde leria o CLAUDE.md que só nasceu na 1.2.
    const desde = reg.iniciada_em ? Date.parse(reg.iniciada_em) : NaN;
    const ate = reg.concluida_em ? Date.parse(reg.concluida_em) + 5 * 60 * 1000 : Infinity;
    if (Number.isFinite(desde)) {
      fonte = 'modificados durante a aula';
      lista = pastas.flatMap((p) => modificadosEntre(p, desde, ate));
    }
  }
  lista = [...new Set(lista)].filter(legivel).slice(0, MAX_ARQUIVOS);

  const blocos = [];
  let total = 0;
  for (const arquivo of lista) {
    const conteudo = ler(arquivo);
    if (conteudo === null) continue;
    const restante = TOTAL - total;
    if (restante <= 200) break;
    const corpo = conteudo.length > restante ? conteudo.slice(0, restante) + '\n[...cortado pelo teto do anexo...]' : conteudo;
    const base = pastas.find((p) => dentro(p, arquivo));
    const nome = base ? path.relative(base, arquivo).replace(/\\/g, '/') : path.basename(arquivo);
    blocos.push(`### ${nome}\n\n\`\`\`\n${corpo}\n\`\`\``);
    total += corpo.length;
  }

  const url = reg.fluencia && reg.fluencia.url ? reg.fluencia.url : null;
  if (!blocos.length && !url) return { texto: null, resumo: { arquivos: 0, caracteres: 0, fonte: null } };
  const partes = [];
  if (url) partes.push(`O tutor registrou este endereço como o produto da fluência: ${url} (você não abre links; ele está aqui para você saber que existe).`);
  if (blocos.length) partes.push(`Arquivos ${fonte}:\n\n${blocos.join('\n\n')}`);
  return {
    texto: partes.join('\n\n'),
    resumo: { arquivos: blocos.length, caracteres: total, fonte: blocos.length ? fonte : null, url: Boolean(url) },
  };
}

module.exports = { coletar, pastasDeTrabalho, modificadosEntre, legivel, POR_ARQUIVO, TOTAL, MAX_ARQUIVOS };
