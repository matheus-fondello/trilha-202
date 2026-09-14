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

// Aula de aprofundamento ("tronco": false) fica fora da sequência padrão: é
// oferecida a quem está adiantado e nunca é pré-requisito de nada, então quem
// termina a aula anterior segue para a próxima de tronco, não para ela.
function proxima(idAula) {
  const lista = todas();
  const i = lista.findIndex((x) => x.id === idAula);
  if (i < 0) return null;
  return lista.slice(i + 1).find((x) => x.tronco !== false) || null;
}

// O aprofundamento abre quando a aula de tronco imediatamente anterior no mapa
// está concluída: é a definição de "adiantado" que o mapa de conteúdo usa. A 1.11
// vem depois da 1.10, a 2.14 e a 2.15 depois da 2.13, a 3.8 e a 3.9 depois da 3.7.
function portaoDe(idAula) {
  const lista = todas();
  const i = lista.findIndex((x) => x.id === idAula);
  if (i < 0) return null;
  for (let j = i - 1; j >= 0; j--) if (lista[j].tronco !== false) return lista[j];
  return null;
}

// Para onde o aluno volta ao concluir um aprofundamento: a primeira aula de
// tronco ainda não concluída depois do portão. Procurar no mapa inteiro devolvia
// a 0.1 a quem tivesse qualquer buraco atrás, e o `de` do estado não sobrevive
// a um chat novo.
function retornoDe(idAula, e) {
  const lista = todas();
  const portao = portaoDe(idAula);
  const inicio = portao ? lista.findIndex((x) => x.id === portao.id) + 1 : 0;
  return lista.slice(inicio).find((x) => x.tronco !== false && ((e.aulas || {})[x.id] || {}).status !== 'concluida') || null;
}

function aprofundamentosDisponiveis(e) {
  return todas().filter((a) => {
    if (a.tronco !== false || !escrita(a)) return false;
    if (((e.aulas || {})[a.id] || {}).status === 'concluida') return false;
    const portao = portaoDe(a.id);
    return !portao || ((e.aulas || {})[portao.id] || {}).status === 'concluida';
  });
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

module.exports = { carregar, todas, aula, proxima, portaoDe, retornoDe, aprofundamentosDisponiveis, skillExiste, escrita };
