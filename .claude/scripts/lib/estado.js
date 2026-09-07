'use strict';
const { ESTADO } = require('./paths');
const { lerJson, gravarJson, agora, minutosEntre } = require('./util');
const mapa = require('./mapa');
const fila = require('./fila');

// Sem sinal de vida por mais que isso, a sessão morreu junto com o terminal.
const MINUTOS_VIVA = 30;

function padrao() {
  return {
    versao: 1,
    criado_em: agora(),
    aluno: { email: null, nome: null, id: null },
    aula_atual: mapa.todas()[0].id,
    aulas: {},          // por id: { status, iniciada_em, concluida_em, milestones: {id: ts}, fluencia, avaliada_em, sessoes }
    sessao_atual: null, // { id, inicio, ultima_atividade, aula, turnos, fonte, contada }
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

// Uma sessão só conta quando o aluno fala. O app desktop dispara SessionStart ao
// montar a janela, e janela aberta e abandonada não é aula: contava sessão, abria
// a aula e enfileirava sozinha. O início só cria o registro; contar, abrir a aula
// e enfileirar acontece no primeiro turno, e é dali que a aula começa a valer.
function contarSessao(e) {
  const s = e.sessao_atual;
  // Só quem nasceu com o campo espera ser contado aqui. Sessão de antes desta
  // regra vem sem `contada` e já foi contada no início: não se conta de novo.
  if (!s || s.contada !== false) return false;
  s.contada = true;
  s.inicio = agora();
  const reg = registroAula(e, s.aula);
  reg.sessoes = (reg.sessoes || 0) + 1;
  const a = mapa.aula(s.aula);
  if (reg.status === 'nao_iniciada' && mapa.escrita(a)) {
    reg.status = 'em_andamento';
    reg.iniciada_em = agora();
    fila.enfileirar('aula.inicio', { aula: a.id }, e);
  }
  fila.enfileirar('sessao.inicio', { fonte: s.fonte || 'startup', aula: s.aula }, e);
  return true;
}

// Quando a sessão acabou de verdade. Silêncio longo é terminal esquecido aberto,
// não aula: passado o limite, ela fecha na última atividade. Sem isso uma P0 de
// duas horas fecha com 710 minutos.
function fimEfetivo(s) {
  const ultima = s.ultima_atividade || s.inicio;
  return minutosEntre(ultima, agora()) > MINUTOS_VIVA ? ultima : agora();
}

// Fecha a sessão aberta. Sessão que nunca teve turno some sem deixar rastro: ela
// não chegou a ser contada, e um sessao.fim sem sessao.inicio é ruído no servidor.
function fecharSessao(e, fimIso, motivo) {
  const s = e.sessao_atual;
  if (!s) return null;
  if (s.contada === false) { e.sessao_atual = null; return null; }
  const registro = {
    id: s.id,
    inicio: s.inicio,
    fim: fimIso,
    minutos: Math.max(0, minutosEntre(s.inicio, fimIso)),
    aula: s.aula,
    turnos: s.turnos || 0,
    fechada_por: motivo,
  };
  e.sessoes.push(registro);
  fila.enfileirar('sessao.fim', registro, e);
  e.sessao_atual = null;
  return registro;
}

module.exports = { carregar, salvar, registroAula, padrao, contarSessao, fecharSessao, fimEfetivo, MINUTOS_VIVA };
