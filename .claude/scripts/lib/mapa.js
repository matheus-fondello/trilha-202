'use strict';
// O mapa é a ementa em forma de dados: ordem das aulas, milestones de cada
// uma e se exige fluência. O CLI valida tudo contra ele. A skill da aula
// usa os mesmos ids de milestone. Se os dois divergem, o script vence.
const fs = require('fs');
const path = require('path');
const { MAPA, SKILLS, QUIZ } = require('./paths');
const { lerJson } = require('./util');

let cache = null;

function carregar() {
  if (!cache) cache = lerJson(MAPA);
  return cache;
}

function todas() {
  return carregar().aulas;
}

function aula(idAula) {
  const a = todas().find((x) => x.id === idAula);
  if (!a) throw new Error(`Aula "${idAula}" não existe no mapa (trilha/mapa.json).`);
  return a;
}

// A sequência é a ordem do mapa: toda unidade é de tronco (a categoria
// "aprofundamento" saiu em 19/09).
function proxima(idAula) {
  const lista = todas();
  const i = lista.findIndex((x) => x.id === idAula);
  if (i < 0) return null;
  return lista[i + 1] || null;
}

function skillExiste(a) {
  return !!a.skill && fs.existsSync(path.join(SKILLS, a.skill, 'SKILL.md'));
}

// Uma aula "escrita" tem skill no disco e ementa (milestones) no mapa. Para o
// quiz a ementa é o banco codificado em quiz/<id>/banco: sem ele não há quiz.
function escrita(a) {
  if (a.tipo === 'quiz') return skillExiste(a) && fs.existsSync(path.join(QUIZ, String(a.id).toLowerCase(), 'banco'));
  return skillExiste(a) && Array.isArray(a.milestones) && a.milestones.length > 0;
}

module.exports = { carregar, todas, aula, proxima, skillExiste, escrita };
