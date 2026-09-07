'use strict';
// O mapa é a ementa em forma de dados: ordem das aulas, milestones de cada
// uma e se exige fluência. O CLI valida tudo contra ele. A skill da aula
// usa os mesmos ids de milestone. Se os dois divergem, o script vence.
const fs = require('fs');
const path = require('path');
const { MAPA, SKILLS } = require('./paths');
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

// Aula de aprofundamento ("tronco": false) fica fora da sequência padrão: é
// oferecida a quem está adiantado e nunca é pré-requisito de nada, então quem
// termina a aula anterior segue para a próxima de tronco, não para ela.
function proxima(idAula) {
  const lista = todas();
  const i = lista.findIndex((x) => x.id === idAula);
  if (i < 0) return null;
  return lista.slice(i + 1).find((x) => x.tronco !== false) || null;
}

function skillExiste(a) {
  return !!a.skill && fs.existsSync(path.join(SKILLS, a.skill, 'SKILL.md'));
}

// Uma aula "escrita" tem skill no disco e ementa (milestones) no mapa.
function escrita(a) {
  return skillExiste(a) && Array.isArray(a.milestones) && a.milestones.length > 0;
}

module.exports = { carregar, todas, aula, proxima, skillExiste, escrita };
