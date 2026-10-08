'use strict';
const { ESTADO } = require('./paths');
const { lerJson, gravarJson, agora, minutosEntre } = require('./util');
const mapa = require('./mapa');
const { existsSync } = require('fs');
const fila = require('./fila');
const acesso = require('./acesso');
const { monoMs, bootMs } = require('./relogio');

// Sem sinal de vida por mais que isso, a sessão morreu junto com o terminal.
const MINUTOS_VIVA = 30;

function padrao() {
  return {
    versao: 1,
    criado_em: agora(),
    aluno: { email: null, nome: null, id: null },
    aula_atual: mapa.todas()[0].id,
    aulas: {},          // por id: { status, iniciada_em, concluida_em, milestones: {id: ts}, fluencia, avaliada_em, sessoes }
    sessao_atual: null, // { id, inicio, ultima_atividade, aula, turnos, fonte, contada, transcricao, turno_aberto, ultimo_turno_fim, trabalho_ms }
    sessoes: [],        // histórico: { id, inicio, fim, minutos, aula, turnos, fechada_por, transcricao }
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
  // Com a escolha de frente pendente, a sessão conta mas nenhuma aula abre: a
  // aula é a que ele escolher, e é o `seguir` que a abre. Senão subia um
  // `aula.inicio` da frente que ele não escolheu.
  if (!escolhaPendente(e)) {
    const reg = registroAula(e, s.aula);
    reg.sessoes = (reg.sessoes || 0) + 1;
    abrirAula(e, s.aula);
  }
  // mono_ms e boot_ms ancoram o relógio monotônico dos turnos: o servidor liga a
  // contagem monotônica ao horário real desta sessão, e vê pelo boot se a máquina
  // reiniciou entre dois trechos (o monotônico recomeça do zero).
  fila.enfileirar('sessao.inicio', { fonte: s.fonte || 'startup', aula: s.aula, ...(escolhaPendente(e) ? { escolha: s.escolha.opcoes } : {}), mono_ms: monoMs(), boot_ms: bootMs() }, e);
  return true;
}

// Frentes paralelas (08/10): depois do M1 o aluno pode ter duas unidades
// abertas, uma por frente, e todo chat novo começa com ele escolhendo por qual
// seguir. A sessão nasce com as opções; até o `seguir`, a aula dela é a padrão
// (a última em que ele trabalhou) só como etiqueta, e nada abre.
function oferecerEscolha(e) {
  const s = e.sessao_atual;
  if (!s) return false;
  const abertas = mapa.abertas(e);
  // Prática entregue e ainda sem correção não entra na escolha: o chat seguinte
  // à entrega é a correção, como sempre foi, e a pergunta volta no chat depois.
  const emCorrecao = abertas.find((a) => a.tipo === 'pratica' && a.correcao
    && mapa.prontaParaCorrigir(a, (e.praticas || {})[a.id], (e.aulas || {})[a.id])
    && !((e.praticas || {})[a.id] || {}).corrigida_em);
  if (emCorrecao) { e.aula_atual = emCorrecao.id; s.aula = emCorrecao.id; return false; }
  const opcoes = abertas.map((a) => a.id);
  if (opcoes.length < 2) return false;
  // A padrão é uma das opções: com o estado antigo, aula_atual podia apontar
  // para outra, e a etiqueta da sessão ficaria numa aula que não está na mesa.
  if (!opcoes.includes(e.aula_atual)) e.aula_atual = opcoes[0];
  s.aula = e.aula_atual;
  s.escolha = { opcoes, feita: null };
  return true;
}

function escolhaPendente(e) {
  const s = e.sessao_atual;
  return Boolean(s && s.escolha && !s.escolha.feita);
}

// O aluno escolheu. Devolve o erro em texto, ou null. A aula escolhida passa a
// ser a da sessão e a atual; se a sessão já conta, ela abre agora, com o
// `aula.inicio` na hora certa, e a sessão conta para ela.
function escolher(e, idAula) {
  const s = e.sessao_atual;
  if (!escolhaPendente(e)) return 'a escolha de frente é no começo do chat, e neste chat não há escolha pendente (ou ela já foi feita). Para trocar de frente, o aluno abre um chat novo.';
  if (!s.escolha.opcoes.includes(idAula)) return `a ${idAula} não está entre as que ele pode fazer agora: ${s.escolha.opcoes.join(' ou ')}.`;
  const padrao = s.aula;
  s.escolha.feita = idAula;
  s.escolha.em = agora();
  s.aula = idAula;
  e.aula_atual = idAula;
  if (s.contada) {
    const reg = registroAula(e, idAula);
    reg.sessoes = (reg.sessoes || 0) + 1;
    abrirAula(e, idAula);
  }
  fila.enfileirar('frente.escolha', { aula: idAula, opcoes: s.escolha.opcoes, padrao }, e);
  return null;
}

// A aula começa a valer aqui, com o `aula.inicio` na fila. Sala fechada não abre
// aula: a conversa em que o aluno ainda está colando o token não é o começo da
// aula, e o `aula.inicio` sairia com a hora errada. Chamado no primeiro turno da
// sessão e, se a sessão já contava quando a sala abriu, pelo `conectar` — senão
// a aula dada no mesmo chat do token abria pelo primeiro milestone, sem evento.
function abrirAula(e, idAula) {
  const reg = registroAula(e, idAula);
  const a = mapa.aula(idAula);
  if (reg.status !== 'nao_iniciada' || !mapa.escrita(a) || !acesso.conectado(e)) return false;
  reg.status = 'em_andamento';
  reg.iniciada_em = agora();
  fila.enfileirar('aula.inicio', { aula: a.id }, e);
  return true;
}

// A unidade atual concluída, com outra aberta, é material que chegou depois
// (o `concluir` da última unidade não tinha para onde avançar, e a atualização
// trouxe o módulo novo) ou uma frente que fechou com a outra ainda aberta. Sem
// isto o resumo voltava a apresentar a unidade fechada como a da vez, e nenhum
// comando do tutor saía dela. Avança pelas frentes (mapa.seguinte). Devolve se mudou.
function avancarSeConcluida(e) {
  const reg = (e.aulas || {})[e.aula_atual];
  if (!reg || reg.status !== 'concluida') return false;
  let prox;
  try { prox = mapa.seguinte(e, e.aula_atual); } catch { prox = null; }
  if (!prox) return false;
  e.aula_atual = prox.id;
  return true;
}

// Quando a sessão acabou de verdade. Silêncio longo é terminal esquecido aberto,
// não aula: passado o limite, ela fecha na última atividade. Sem isso uma P0 de
// duas horas fecha com 710 minutos.
function fimEfetivo(s) {
  const ultima = s.ultima_atividade || s.inicio;
  return minutosEntre(ultima, agora()) > MINUTOS_VIVA ? ultima : agora();
}

function localizarTranscricao(s) {
  return s.transcricao && existsSync(s.transcricao) ? s.transcricao : null;
}

// Fecha a sessão aberta. Sessão que nunca teve turno some sem deixar rastro: ela
// não chegou a ser contada, e um sessao.fim sem sessao.inicio é ruído no servidor.
function fecharSessao(e, fimIso, motivo) {
  const s = e.sessao_atual;
  if (!s) return null;
  if (s.contada === false) { e.sessao_atual = null; return null; }
  // Com turnos medidos, o fim é o último turno e os minutos são a soma do
  // trabalho, sem a espera entre um turno e outro: é o que impede uma sessão de
  // doze horas com vinte turnos de virar 733 minutos de aula, e uma sessão
  // recuperada de fechar com o fim igual ao início. Os dois vêm do estado, que
  // sobrevive ao envio da fila. Sem turnos medidos (harness antigo), vale o
  // relógio, como antes.
  // O sinal mais novo dos dois: numa sessão recuperada, o último que se observou
  // pode ser o envio que ficou sem resposta, e não o fim do turno anterior.
  const sinais = [s.ultimo_turno_fim, s.ultima_atividade].filter(Boolean).sort();
  const fim = s.turnos ? (sinais[sinais.length - 1] || fimIso) : fimIso;
  const registro = {
    id: s.id,
    inicio: s.inicio,
    fim,
    minutos: s.trabalho_ms ? Math.round(s.trabalho_ms / 60000) : Math.max(0, minutosEntre(s.inicio, fim)),
    aula: s.aula,
    turnos: s.turnos || 0,
    fechada_por: motivo,
    // O bruto, em milissegundos, para o servidor não depender do arredondamento.
    trabalho_ms: s.trabalho_ms || 0,
  };
  // O caminho da transcrição fica na máquina e não sobe: ele carrega o nome de
  // usuário do aluno, e a 202 não tem o que fazer com ele. Quem precisa dele é o
  // avaliador, quando a aula acontece em mais de um chat.
  e.sessoes.push({ ...registro, transcricao: localizarTranscricao(s) });
  fila.enfileirar('sessao.fim', registro, e);
  e.sessao_atual = null;
  return registro;
}

module.exports = { carregar, salvar, registroAula, padrao, contarSessao, abrirAula, oferecerEscolha, escolhaPendente, escolher, fecharSessao, fimEfetivo, avancarSeConcluida, MINUTOS_VIVA };
