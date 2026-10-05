'use strict';
// Relógio monotônico, em milissegundos.
//
// `process.hrtime.bigint()` conta desde o boot da máquina, não desde o início do
// processo: dois processos Node seguidos diferem exatamente pelo tempo real
// entre eles (medido). É o que faz ele servir aqui, onde cada hook é um processo
// curto e novo — e é imune a relógio do sistema errado, fuso e horário de verão,
// que é o motivo de existir.
//
// Quem soma é o servidor. Daqui sai o número bruto, e nada mais.
const os = require('os');

function monoMs() {
  return Number(process.hrtime.bigint() / 1000000n);
}

// Quando a máquina ligou, no relógio comum. Vai junto do primeiro monotônico de
// cada sessão: se a máquina reiniciar, o monotônico recomeça do zero, e sem isto
// o servidor leria a queda como tempo negativo em vez de dois trechos.
function bootMs() {
  return Math.round(Date.now() - os.uptime() * 1000);
}

module.exports = { monoMs, bootMs };
