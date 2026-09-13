'use strict';
// Memória do aluno: `trilha/aluno.md`. É um retrato, não um caderno — uma nota
// por assunto, chave livre, escrever na mesma chave substitui. Teto de 7: cheio,
// para anotar algo novo o tutor precisa matar uma nota velha, e é essa escassez
// que força a reavaliação. O aluno pode ler o arquivo; ele NUNCA sobe para a 202,
// então nada aqui é enfileirado. Juízo sobre o aluno vive na avaliação, que sobe.
const fs = require('fs');
const path = require('path');
const { ALUNO } = require('./paths');

const TETO = 7;
const MIN_TEXTO = 40;
const MAX_TEXTO = 400;

const CABECALHO = `# O que seu professor anotou sobre você

Esta é a memória do tutor entre as aulas. Ela fica no seu computador e **não é
enviada para a 202** — serve para ele lembrar do que você construiu e ajustar
como ensina. Cabem no máximo ${TETO} anotações: para escrever uma nova, ele apaga
uma antiga. Você pode ler tudo; se algo aqui estiver errado ou já não valer,
diga na próxima aula e ele corrige.
`;

function dataBr(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// Cada nota é um bloco "## chave", uma linha de origem em itálico e o texto.
function ler() {
  let bruto;
  try { bruto = fs.readFileSync(ALUNO, 'utf8'); } catch { return []; }
  const notas = [];
  const blocos = bruto.split(/^## /m).slice(1);
  for (const bloco of blocos) {
    // \r?\n: o aluno pode abrir o arquivo num editor do Windows, que grava CRLF.
    const linhas = bloco.split(/\r?\n/);
    const chave = (linhas.shift() || '').trim();
    if (!chave) continue;
    let origem = '';
    if (linhas[0] && /^\*.*\*$/.test(linhas[0].trim())) origem = linhas.shift().trim().replace(/^\*|\*$/g, '');
    notas.push({ chave, origem, texto: linhas.join('\n').trim() });
  }
  return notas;
}

function gravar(notas) {
  const corpo = notas.map((n) => `## ${n.chave}\n*${n.origem}*\n\n${n.texto}\n`).join('\n');
  fs.mkdirSync(path.dirname(ALUNO), { recursive: true });
  const tmp = ALUNO + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, CABECALHO + '\n' + corpo, 'utf8');
  fs.renameSync(tmp, ALUNO);
}

function definir(chave, texto, aula, quando) {
  if (!/^[a-z][a-z0-9-]{2,31}$/.test(chave)) {
    throw new Error('a chave é um slug minúsculo com hífens, de 3 a 32 caracteres. Ex.: motivo-do-git, esquece-o-que-viu.');
  }
  const t = String(texto || '').trim().replace(/\s+/g, ' ');
  if (t.length < MIN_TEXTO) throw new Error(`a nota tem ${t.length} caracteres; precisa de pelo menos ${MIN_TEXTO}. Escreva a observação E o que você vai fazer por causa dela.`);
  if (t.length > MAX_TEXTO) throw new Error(`a nota tem ${t.length} caracteres; o máximo é ${MAX_TEXTO}. Se não cabe em duas frases, provavelmente são duas notas — ou nenhuma.`);

  const notas = ler();
  const i = notas.findIndex((n) => n.chave === chave);
  const nova = { chave, origem: `${aula} · ${dataBr(quando)}`, texto: t };
  if (i >= 0) {
    notas[i] = nova;
    gravar(notas);
    return { acao: 'substituiu', total: notas.length };
  }
  if (notas.length >= TETO) {
    const lista = notas.map((n) => `  ${n.chave} (${n.origem}) — ${n.texto.slice(0, 70)}…`).join('\n');
    throw new Error(
      `a memória já tem as ${TETO} notas que cabem. Para anotar "${chave}", apague antes a que menos vale hoje:\n${lista}\n` +
      '  node .claude/scripts/trilha.js nota <chave> --apagar'
    );
  }
  notas.push(nova);
  gravar(notas);
  return { acao: 'anotou', total: notas.length };
}

function apagar(chave) {
  const notas = ler();
  const i = notas.findIndex((n) => n.chave === chave);
  if (i < 0) throw new Error(`não existe nota "${chave}". Existem: ${notas.map((n) => n.chave).join(', ') || 'nenhuma'}.`);
  notas.splice(i, 1);
  gravar(notas);
  return { total: notas.length };
}

// Bloco que o hook de início injeta no contexto do tutor.
function paraContexto() {
  const notas = ler();
  if (!notas.length) return null;
  return [
    `Memória do aluno (trilha/aluno.md, ${notas.length} de ${TETO} notas; fica na máquina dele, não sobe para a 202):`,
    ...notas.map((n) => `  - ${n.chave} [${n.origem}]: ${n.texto}`),
  ].join('\n');
}

module.exports = { ler, definir, apagar, paraContexto, TETO };
