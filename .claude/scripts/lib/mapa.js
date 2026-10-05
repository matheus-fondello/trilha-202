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

// O que uma prática corrigida precisa ter registrado. O padrão é o da P1 à P3:
// a pasta, a página no ar e o repositório público. A prática que entrega outra
// coisa — a P4 entrega uma conversa e uma síntese — declara a sua lista no mapa,
// em "entrega", e as regras abaixo passam a valer para ela.
const ENTREGA_PADRAO = ['pasta', 'url', 'repo'];

function entregaExigida(a) {
  return Array.isArray(a.entrega) && a.entrega.length ? a.entrega : ENTREGA_PADRAO;
}

// Quando a correção pode abrir: a entrega registrada e os marcos da prática
// todos fechados. Sem lista declarada a entrega continua sendo pasta e URL, como
// sempre foi: o repositório é cobrado no `concluir`, não aqui. Os marcos contam
// porque registrar a entrega não é o fim da prática: na P4 a pasta pode entrar
// antes da entrevista acabar, e um chat que morre entre o `pratica` e o último
// marco volta para a skill da prática, que fecha o marco, e não cai na correção.
function prontaParaCorrigir(a, p, reg) {
  const campos = Array.isArray(a.entrega) && a.entrega.length ? a.entrega : ['pasta', 'url'];
  if (!campos.every((c) => Boolean((p || {})[c]))) return false;
  const feitos = (reg && reg.milestones) || {};
  return (a.milestones || []).every((m) => Boolean(feitos[m.id]));
}

module.exports = { carregar, todas, aula, proxima, skillExiste, escrita, entregaExigida, prontaParaCorrigir };
