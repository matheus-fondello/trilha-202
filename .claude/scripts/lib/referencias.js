'use strict';
// Bibliografia da trilha. A fonte é sempre o referencias.md da aula; o
// REFERENCIAS.md da raiz é gerado a partir deles e nunca editado à mão.
//
// Um item é um bullet de três linhas:
//
//   - **Autor, título** — veículo, data · duração
//     https://exemplo.com
//     Uma linha dizendo por que vale.
//
// A prosa que ensina o tutor a oferecer o material nunca tem essa forma,
// então fica na aula e não vaza para a bibliografia do aluno.
const fs = require('fs');
const path = require('path');
const { SKILLS, RAIZ } = require('./paths');
const mapa = require('./mapa');

const ARQUIVO = path.join(RAIZ, 'REFERENCIAS.md');

function classeDoCabecalho(titulo) {
  const t = titulo.toLowerCase();
  if (t.startsWith('citad')) return 'citada';
  if (t.startsWith('sugerid')) return 'sugerida';
  return null;
}

function extrair(texto) {
  // \r?\n: no Windows o git entrega o arquivo com CRLF, e o \r no fim da linha
  // fazia nenhum bullet casar. A lista curada saía vazia, e a guarda bloqueava
  // no painel todo link de aula.
  const linhas = texto.split(/\r?\n/);
  const itens = [];
  let classe = null;
  for (let i = 0; i < linhas.length; i++) {
    const cab = /^##\s+(.+)$/.exec(linhas[i]);
    if (cab) { classe = classeDoCabecalho(cab[1]); continue; }
    const bullet = /^-\s+(\S.*)$/.exec(linhas[i]);
    if (!bullet || !classe) continue;
    const url = /^\s+(https?:\/\/\S+)\s*$/.exec(linhas[i + 1] || '');
    if (!url) continue;
    const porque = /^\s+(\S.*)$/.exec(linhas[i + 2] || '');
    itens.push({ classe, titulo: bullet[1].trim(), url: url[1], porque: porque ? porque[1].trim() : '' });
    i += porque ? 2 : 1;
  }
  return itens;
}

// Todas as aulas do mapa que têm referencias.md, na ordem da trilha.
function porAula() {
  const saida = [];
  for (const a of mapa.todas()) {
    if (!a.skill) continue;
    const arq = path.join(SKILLS, a.skill, 'referencias.md');
    if (!fs.existsSync(arq)) continue;
    saida.push({ aula: a, itens: extrair(fs.readFileSync(arq, 'utf8')), arquivo: arq });
  }
  return saida;
}

function bloco(itens) {
  return itens.map((it) => `- ${it.titulo}\n  ${it.url}\n  ${it.porque}`.trimEnd()).join('\n\n');
}

function markdown(lista) {
  const linhas = [
    '# Referências da trilha',
    '',
    'Tudo aqui é opcional. A aula se sustenta sozinha: isto é para quem quer ir além, na hora ou depois. Você também pode pedir ao Claude, na sala: `/referencias`.',
    '',
    'As **sugeridas** são o que o tutor oferece abrir ao lado durante a aula, cada uma no seu momento; se você for ver só uma coisa de uma aula, é uma delas. As **citadas** são a fonte do que foi dito na aula.',
    '',
    '> Arquivo gerado por `node .claude/scripts/trilha.js dev referencias`. Para mudar algo, edite o `referencias.md` da aula e gere de novo.',
  ];
  let modulo = null;
  for (const { aula, itens } of lista) {
    if (!itens.length) continue;
    if (aula.modulo !== modulo) { modulo = aula.modulo; linhas.push('', `## Módulo ${modulo}`); }
    linhas.push('', `### ${aula.id} ${aula.titulo}`);
    for (const classe of ['sugerida', 'citada']) {
      const doTipo = itens.filter((it) => it.classe === classe);
      if (!doTipo.length) continue;
      linhas.push('', classe === 'sugerida' ? '**Sugerida**' : '**Citadas na aula**', '', bloco(doTipo));
    }
  }
  return linhas.join('\n') + '\n';
}

function gerar() {
  const lista = porAula();
  fs.writeFileSync(ARQUIVO, markdown(lista), 'utf8');
  return { arquivo: ARQUIVO, lista };
}

module.exports = { ARQUIVO, extrair, porAula, markdown, gerar };
