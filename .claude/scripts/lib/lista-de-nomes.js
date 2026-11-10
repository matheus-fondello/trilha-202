'use strict';
// A lista de nomes da 4.4 (09/11). Pedia dez, e a fluência só passava com os dez: a aula ficava aberta até o aluno
// trazer o resto, e quem não tinha dez ficava preso no M4. Agora pede cinco, e menos não segura nada. A fluência se
// julga sem a contagem; a falta pesa no domínio da 4.4 por esta conta, e não pelo juízo do avaliador, que não segue
// conta (é o caso da iniciativa, em lib/avaliador.js); e o resumo das aulas seguintes do M4 e do M5 volta a pedir o
// resto (lib/resumo.js).
const AULA = '4.4';
const MINIMO = 5;
// O teto da justificativa na validação (trilha.js, validarAvaliacao). A frase do desconto sempre cabe: o texto do
// avaliador é cortado antes dela, se for preciso.
const TETO_JUSTIFICATIVA = 1500;

const contar = (e) => ((e && e.ideia && e.ideia.nomes) || []).length;

// Pontos a menos no domínio: nenhum com cinco ou mais, um com três ou quatro, dois com dois ou menos.
function pontos(n) {
  if (n >= MINIMO) return 0;
  return n >= 3 ? 1 : 2;
}

// A contagem vale a do fechamento da 4.4, gravada no registro da aula pelo `concluir`. A avaliação roda depois dele,
// às vezes num chat da 4.5 (pendente por login, tempo, limite), e esse chat abre pedindo os nomes que faltam: lida
// ali, a lista que ele acabou de completar apagaria o desconto, e uma reavaliação depois de o tutor regravar a lista
// leria outra. Só com a ideia gravada.
function congelar(e, reg, idAula) {
  if (idAula !== AULA || !reg || !e || !e.ideia || !e.ideia.texto) return;
  reg.lista_nomes = contar(e);
}

// Só na avaliação da 4.4 e só com a ideia gravada: sem ideia, a fluência não aconteceu, e a régua já pesa isso no
// domínio. Troca a avaliação (o domínio, o número dele na justificativa e uma frase dizendo o porquê) e devolve o
// registro do desconto, que sobe ao lado das notas; sem desconto, null. O domínio nunca fica abaixo de 1. Os
// critérios viram um objeto novo: o mesmo objeto é a nota da leitura em `estabilidade`, que sobe como foi lida.
function descontar(av, e, idAula, reg) {
  if (idAula !== AULA || !av || !av.criterios || !Number.isInteger(av.criterios.dominio)) return null;
  const congelada = reg && Number.isInteger(reg.lista_nomes);
  if (!congelada && (!e || !e.ideia || !e.ideia.texto)) return null;
  const n = congelada ? reg.lista_nomes : contar(e);
  const p = pontos(n);
  if (!p) return null;
  const lido = av.criterios.dominio;
  const final = Math.max(1, lido - p);
  const tirados = lido - final;
  av.criterios = { ...av.criterios, dominio: final };
  if (tirados && typeof av.justificativa === 'string') {
    // Só o número que o avaliador deu ao domínio; outro número ao lado de "domínio" (o que faltou para um 5) fica.
    const frase = ` Domínio ${final}, com ${tirados === 1 ? 'um ponto' : 'dois pontos'} a menos: a lista de nomes da 4.4 ficou com ${n} de ${MINIMO}.`;
    let texto = av.justificativa.replace(new RegExp(`(dom[ií]nio\\s*(?:=|:)?\\s*)${lido}\\b`, 'gi'), `$1${final}`);
    const cabe = TETO_JUSTIFICATIVA - frase.length;
    if (texto.length > cabe) texto = `${texto.slice(0, cabe - 1).trimEnd()}…`;
    av.justificativa = texto + frase;
  }
  return { nomes: n, minimo: MINIMO, dominio_lido: lido, dominio: final };
}

module.exports = { AULA, MINIMO, contar, pontos, congelar, descontar };
