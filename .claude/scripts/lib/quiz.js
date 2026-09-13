'use strict';
// O quiz de módulo. O banco vive codificado em quiz/<id>/banco e só este
// módulo o abre: o gabarito e a explicação de uma pergunta nunca chegam ao
// chat antes da resposta dela estar gravada no estado e na fila.
//
// A ordem é fixa, uma pergunta de cada vez, e não há refazer: o que sobe é
// sempre a primeira resposta. Quem imprime a correção é o script, a partir do
// texto canônico do banco; o tutor desenvolve a partir dela, não a inventa.
const fs = require('fs');
const path = require('path');
const { QUIZ } = require('./paths');

const LETRAS = ['a', 'b', 'c', 'd'];
const LINHA = '─'.repeat(60);

function arquivoDoBanco(idQuiz) {
  return path.join(QUIZ, String(idQuiz).toLowerCase(), 'banco');
}

function bancoExiste(idQuiz) {
  return fs.existsSync(arquivoDoBanco(idQuiz));
}

function carregar(idQuiz) {
  const bruto = fs.readFileSync(arquivoDoBanco(idQuiz), 'utf8');
  const banco = JSON.parse(Buffer.from(bruto.trim(), 'base64').toString('utf8'));
  if (!Array.isArray(banco.questoes) || !banco.questoes.length) throw new Error('banco vazio');
  return banco;
}

// O registro do quiz dentro do registro da aula: respostas por número.
function registro(reg) {
  if (!reg.quiz) reg.quiz = { iniciado_em: null, respostas: {}, completo_em: null };
  return reg.quiz;
}

function respondidas(reg) {
  return Object.keys(registro(reg).respostas).length;
}

function proximaPendente(banco, reg) {
  const r = registro(reg).respostas;
  return banco.questoes.find((q) => !r[String(q.n)]) || null;
}

function completo(banco, reg) {
  return respondidas(reg) >= banco.questoes.length;
}

function paragrafos(lista) {
  return lista.join('\n\n');
}

// A pergunta como o aluno a lê: sem etiqueta de aula, tipo ou gabarito.
function formatarPergunta(banco, q) {
  const total = banco.questoes.length;
  const linhas = [LINHA, `Pergunta ${q.n} de ${total}${q.tipo === 'aberta' ? ' (aberta)' : ''}`, LINHA, ''];
  linhas.push(paragrafos(q.enunciado));
  linhas.push('');
  linhas.push(q.pergunta);
  linhas.push('');
  if (q.tipo === 'fechada') {
    for (const l of LETRAS) { linhas.push(`  ${l}) ${q.alternativas[l]}`); linhas.push(''); }
    linhas.push('Responda com a letra.');
  } else {
    linhas.push('Responda por escrito, com o tamanho que quiser.');
  }
  linhas.push(LINHA);
  return linhas.join('\n');
}

// A correção de uma fechada: abre pela certa, o segundo parágrafo é sobre a
// alternativa que ELE marcou, e as demais vêm depois. No acerto, uma linha.
function formatarCorrecao(q, letra) {
  const acertou = letra === q.gabarito;
  const linhas = [LINHA, `Você respondeu: ${letra}        ${acertou ? 'Certo.' : `Resposta certa: ${q.gabarito}`}`, LINHA, ''];
  if (acertou) {
    linhas.push(q.acerto);
  } else {
    linhas.push(q.certa);
    linhas.push('');
    linhas.push(sobre(q, letra));
    const demais = LETRAS.filter((l) => l !== q.gabarito && l !== letra);
    for (const l of demais) { linhas.push(''); linhas.push(sobre(q, l)); }
  }
  linhas.push(LINHA);
  return linhas.join('\n');
}

// "Sobre a c: paga por..." — o parágrafo do banco começa nomeando a alternativa
// ("A c paga por..."), e com o rótulo na frente isso ficaria dito duas vezes.
function sobre(q, l) {
  return `Sobre a ${l}: ${q.sobre[l].replace(new RegExp(`^A ${l} `), '')}`;
}

// A régua de uma aberta, para o tutor ler depois da resposta gravada.
function formatarRegua(q) {
  return [LINHA, `Régua da pergunta ${q.n} (para a sua leitura; não cole, converse)`, LINHA, '', paragrafos(q.regua), LINHA].join('\n');
}

// O fechamento: o que ficou para revisitar, por aula, sem virar nota.
function resumoFinal(banco, reg) {
  const r = registro(reg).respostas;
  const fechadas = banco.questoes.filter((q) => q.tipo === 'fechada');
  const erradas = fechadas.filter((q) => r[String(q.n)] && !r[String(q.n)].correta);
  const porAula = {};
  for (const q of erradas) {
    const primaria = q.aulas[0];
    (porAula[primaria] = porAula[primaria] || []).push(q.n);
  }
  const revisitar = Object.keys(porAula).sort();
  return {
    acertos: fechadas.length - erradas.length,
    total_fechadas: fechadas.length,
    erradas: erradas.map((q) => q.n),
    revisitar,
    texto: revisitar.length
      ? 'Para revisitar: ' + revisitar.map((a) => `${a} (pergunta${porAula[a].length > 1 ? 's' : ''} ${porAula[a].join(', ')})`).join('; ') + '.'
      : 'Nenhuma fechada errada.',
  };
}

module.exports = { LETRAS, arquivoDoBanco, bancoExiste, carregar, registro, respondidas, proximaPendente, completo, formatarPergunta, formatarCorrecao, formatarRegua, resumoFinal };
