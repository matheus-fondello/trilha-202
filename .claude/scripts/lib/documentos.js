'use strict';
// O documento de uma prática que entrega só a pasta (06/10): a síntese da P4, o
// plano da P5. Ele não tem página no ar nem repositório, e a 202 precisa ler o
// que o aluno entregou, então ele sobe no evento `pratica.documento`, no momento
// da entrega e de novo se a pasta mudar depois dela (vale o último).
//
// Só texto (.md, .csv, .txt), da raiz da pasta registrada e de um nível abaixo,
// com teto: nada de .env, imagem, binário nem dependência. Os nomes da lista de
// entrevistas do aluno saem trocados por [nome], como no que vai ao avaliador:
// nome de terceiro não sobe para a 202. O caminho da pasta também não sobe, só
// o nome de cada arquivo dentro dela.
const fs = require('fs');
const path = require('path');
const transcricao = require('./transcricao');

const EXTENSOES = new Set(['.md', '.csv', '.txt']);
const IGNORAR = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.vercel', '.claude']);
const POR_ARQUIVO = 60000;
// Abaixo do teto de 150 mil do `fila.enfileirar`, com folga para o envelope.
const TOTAL = 120000;
const MAX_ARQUIVOS = 20;

// O que se lê primeiro: o documento que a prática pede, depois o resto.
function ordem(rel) {
  const nome = path.basename(rel).toLowerCase();
  if (nome === 'plano.md') return 0;
  if (/s[ií]ntese/.test(nome)) return 1;
  if (nome.endsWith('.md')) return 2;
  if (nome.endsWith('.csv')) return 3;
  return 4;
}

function listar(pasta) {
  const achados = [];
  const visitar = (dir, nivel) => {
    let entradas;
    try { entradas = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const ent of entradas) {
      if (ent.name.startsWith('.')) continue;
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (nivel < 1 && !IGNORAR.has(ent.name)) visitar(p, nivel + 1);
      } else if (ent.isFile() && EXTENSOES.has(path.extname(ent.name).toLowerCase())) {
        achados.push(path.relative(pasta, p).replace(/\\/g, '/'));
      }
    }
  };
  visitar(pasta, 0);
  return achados.sort((a, b) => ordem(a) - ordem(b) || a.localeCompare(b));
}

// `e` é o estado do aluno: é dele que sai a lista de nomes a tirar.
function coletar(pasta, e) {
  const tirar = transcricao.tiradorDeNomes(e);
  const arquivos = [];
  const omitidos = [];
  let total = 0;
  for (const rel of listar(pasta)) {
    if (arquivos.length >= MAX_ARQUIVOS) { omitidos.push(rel); continue; }
    let texto;
    try { texto = fs.readFileSync(path.join(pasta, rel), 'utf8'); } catch { continue; }
    if (texto.includes('\u0000')) continue;
    const caracteres = texto.length;
    texto = tirar(texto);
    if (texto.length > POR_ARQUIVO) texto = texto.slice(0, POR_ARQUIVO) + `\n[...cortado: ${caracteres} caracteres no total...]`;
    if (total + texto.length > TOTAL) { omitidos.push(rel); continue; }
    arquivos.push({ nome: rel, caracteres, texto });
    total += texto.length;
  }
  return { arquivos, omitidos, total };
}

module.exports = { coletar, listar, EXTENSOES, POR_ARQUIVO, TOTAL, MAX_ARQUIVOS };
