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

// A unidade seguinte na ordem do arquivo, sem olhar o estado. Quem decide para
// onde o aluno vai é `seguinte`, que respeita as frentes.
function proxima(idAula) {
  const lista = todas();
  const i = lista.findIndex((x) => x.id === idAula);
  if (i < 0) return null;
  return lista[i + 1] || null;
}

// Os módulos e de quem cada um depende. Sem o campo no mapa, cada módulo
// depende do anterior: é a trilha em fila única, como era até 08/10.
function modulos() {
  const declarados = carregar().modulos;
  const ids = [...new Set(todas().map((a) => a.modulo))];
  return ids.map((id) => {
    const d = (declarados || []).find((m) => m.id === id) || {};
    return { id, titulo: d.titulo || null, frente: d.frente || null, depois_de: Array.isArray(d.depois_de) ? d.depois_de : (id > 0 ? [id - 1] : []) };
  });
}

function modulo(id) {
  return modulos().find((m) => m.id === id) || null;
}

const concluida = (e, idAula) => ((e.aulas || {})[idAula] || {}).status === 'concluida';
const doModulo = (id) => todas().filter((a) => a.modulo === id);

// Progresso num módulo: alguma unidade começada ou concluída, ou a aula da vez
// dentro dele.
function temProgresso(e, id) {
  return doModulo(id).some((a) => a.id === e.aula_atual || ['em_andamento', 'concluida'].includes(((e.aulas || {})[a.id] || {}).status));
}

// Um módulo está feito quando a última unidade dele fechou, ou quando o aluno já
// anda num módulo que depende dele. As unidades de um módulo são em sequência,
// então a última fechada diz que ele foi percorrido; e quem está no M3 passou
// pelo M2. A segunda regra é o que mantém de pé o estado de quem pulou aulas
// (`dev ir`, testes, cobaias): sem ela, um salto direto para a 3.4 deixava o
// M0 aberto e mandava o aluno de volta à 0.1.
function moduloConcluido(e, id, visto = new Set()) {
  if (visto.has(id)) return false;
  visto.add(id);
  const unidades = doModulo(id);
  if (unidades.length && concluida(e, unidades[unidades.length - 1].id)) return true;
  return modulos().filter((m) => m.depois_de.includes(id)).some((m) => temProgresso(e, m.id) || moduloConcluido(e, m.id, visto));
}

// A unidade da vez num módulo: a aula atual, se está nele e não fechou; senão a
// primeira não concluída depois da última concluída.
function fronteira(e, id) {
  const unidades = doModulo(id);
  const atual = unidades.find((a) => a.id === e.aula_atual);
  if (atual && !concluida(e, atual.id)) return atual;
  let ultima = -1;
  unidades.forEach((a, i) => { if (concluida(e, a.id)) ultima = i; });
  return unidades.slice(ultima + 1).find((a) => !concluida(e, a.id)) || null;
}

// Onde o aluno pode estar agora: a unidade da vez de cada módulo aberto (os de
// que ele depende feitos, ele mesmo não). Depois do M1 são até duas, uma por
// frente; antes e no M6, uma só. Na ordem do mapa.
function abertas(e) {
  const r = [];
  for (const m of modulos()) {
    if (moduloConcluido(e, m.id) || !m.depois_de.every((d) => moduloConcluido(e, d))) continue;
    const a = fronteira(e, m.id);
    if (a) r.push(a);
  }
  return r;
}

// A unidade que vem depois de uma que acabou de fechar: a seguinte do mesmo
// módulo; com o módulo feito, a de um módulo que depende dele (do M1 para o M2,
// do M2 para o M3), preferindo a mesma frente; sem ela, a outra frente que
// estiver aberta. Nulo quando não há mais nada.
function seguinte(e, idAula) {
  const atual = aula(idAula);
  const lista = abertas(e);
  const mesmoModulo = lista.find((x) => x.modulo === atual.modulo);
  if (mesmoModulo) return mesmoModulo;
  const frente = (modulo(atual.modulo) || {}).frente;
  const daFrente = (x) => frente && (modulo(x.modulo) || {}).frente === frente;
  const sucessoras = lista.filter((x) => (modulo(x.modulo) || {}).depois_de.includes(atual.modulo));
  return sucessoras.find(daFrente) || sucessoras[0] || lista.find(daFrente) || lista[0] || null;
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

module.exports = { carregar, todas, aula, proxima, modulos, modulo, moduloConcluido, abertas, seguinte, skillExiste, escrita, entregaExigida, prontaParaCorrigir };
