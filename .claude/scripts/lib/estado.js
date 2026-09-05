'use strict';
const { ESTADO } = require('./paths');
const { lerJson, gravarJson, agora } = require('./util');
const mapa = require('./mapa');

function padrao() {
  return {
    versao: 1,
    criado_em: agora(),
    aluno: { email: null, nome: null, id: null },
    aula_atual: mapa.todas()[0].id,
    aulas: {},          // por id: { status, iniciada_em, concluida_em, milestones: {id: ts}, fluencia, avaliada_em, sessoes }
    sessao_atual: null, // { id, inicio, ultima_atividade, aula, turnos }
    sessoes: [],        // histórico: { id, inicio, fim, minutos, aula, turnos, fechada_por }
    oficina: null,      // caminho da pasta irmã onde o aluno pratica
    praticas: {},       // por id: { url, registrada_em }
  };
}

function carregar() {
  const e = lerJson(ESTADO, null);
  if (!e) {
    const novo = padrao();
    gravarJson(ESTADO, novo);
    return novo;
  }
  return e;
}

function salvar(e) {
  gravarJson(ESTADO, e);
}

// Garante o registro da aula no estado.
function registroAula(e, idAula) {
  if (!e.aulas[idAula]) {
    e.aulas[idAula] = {
      status: 'nao_iniciada',
      iniciada_em: null,
      concluida_em: null,
      milestones: {},
      fluencia: null,
      avaliada_em: null,
      sessoes: 0,
    };
  }
  return e.aulas[idAula];
}

module.exports = { carregar, salvar, registroAula, padrao };
