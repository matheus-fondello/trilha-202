'use strict';
// O turno: o aluno manda a mensagem, o agente trabalha, o agente termina de
// responder. Os dois instantes viram evento no disco na hora em que acontecem,
// com o relógio monotônico junto.
//
// O harness não soma minutos e não decide o que é pausa: ele grava o fato bruto.
// Quem junta é o servidor, que guarda o original e pode mudar a regra depois sem
// reprocessar nada na máquina do aluno.
//
// O estado carrega o acumulado (turnos, trabalho, último fim) porque a fila pode
// já ter subido e sido apagada quando a sessão for recuperada: o que sobrevive
// ao envio é o estado, e é dele que o `sessao.fim` se reconstrói.
const fila = require('./fila');
const { monoMs } = require('./relogio');
const { agora } = require('./util');

// O aluno enviou. Um turno anterior ainda aberto aqui é um turno que morreu sem
// resposta (o aluno interrompeu, o processo caiu): fecha como interrompido antes.
function abrir(e) {
  const s = e.sessao_atual;
  if (!s) return null;
  if (s.turno_aberto) fechar(e, { interrompido: true, tarde: true });
  const n = (s.turnos || 0) + 1;
  const mono = monoMs();
  s.turnos = n;
  // O horário é o do evento, e o estado herda dele: o fato é o que foi para o
  // disco, e o servidor compara `sessao.fim` com o `ts` do último turno.
  // Depois do `concluir` a unidade atual já é a seguinte, mas o "obrigado" do
  // aluno no mesmo chat ainda é da que fechou: contava tempo para a próxima e a
  // marcava em andamento. Fora disso vale a atual, que é como a troca de unidade
  // no meio de uma sessão continua contando para a unidade nova.
  const daSessao = s.aula && ((e.aulas || {})[s.aula] || {}).status === 'concluida';
  const aula = daSessao ? s.aula : e.aula_atual;
  const ev = fila.enfileirar('turno.envio', { sessao: s.id, n, aula, mono_ms: mono }, e);
  s.turno_aberto = { n, mono_ms: mono, ts: ev.ts, aula };
  s.ultima_atividade = ev.ts;
  return n;
}

// O agente terminou. A aula é a do turno, e não a atual: se o `concluir` rodou
// no meio, o trabalho foi da aula que o turno abriu.
//
// `tarde` é o turno que ninguém viu acabar: o processo morreu e a sessão só é
// fechada horas depois, na recuperação. Aí o fim é o instante do envio, e não o
// relógio de agora — o que não se observou não vira tempo de aula, e a sessão
// recuperada para de herdar as horas em que a máquina esteve desligada.
function fechar(e, { interrompido = false, tarde = false } = {}) {
  const s = e.sessao_atual;
  if (!s || !s.turno_aberto) return null;
  const t = s.turno_aberto;
  // No fechamento tardio o monotônico é o do envio: zero de trabalho observado,
  // que é o que de fato se sabe. O `ts` do envelope aí é quando se percebeu, e o
  // `interrompido` diz ao servidor para usar o envio como fim.
  const mono = tarde ? t.mono_ms : monoMs();
  s.turno_aberto = null;
  const ev = fila.enfileirar('turno.fim', { sessao: s.id, n: t.n, aula: t.aula, mono_ms: mono, interrompido }, e);
  if (!tarde) {
    s.ultima_atividade = ev.ts;
    s.ultimo_turno_fim = ev.ts;
    // Monotônico que andou para trás é máquina reiniciada no meio: não se soma.
    if (mono >= t.mono_ms) s.trabalho_ms = (s.trabalho_ms || 0) + (mono - t.mono_ms);
  }
  return t.n;
}

// Para a versão do Claude Code que não dispara o hook de envio: o turno existiu,
// então ele é contado e fechado no mesmo instante. Mede zero de trabalho, que é
// honesto — ninguém observou o começo —, e não perde a contagem.
function fecharOuRegistrar(e, opcoes) {
  const s = e.sessao_atual;
  if (s && !s.turno_aberto) abrir(e);
  return fechar(e, opcoes);
}

module.exports = { abrir, fechar, fecharOuRegistrar };
