#!/usr/bin/env node
'use strict';
// CLI do harness. O tutor chama estes comandos durante a aula. Tudo que é
// "fato" sobre o progresso do aluno passa por aqui, nunca por "o Claude achou".
//
//   node .claude/scripts/trilha.js status
//   node .claude/scripts/trilha.js identificar <email> [nome]
//   node .claude/scripts/trilha.js oficina <caminho>
//   node .claude/scripts/trilha.js milestone <aula> <id-do-milestone>
//   node .claude/scripts/trilha.js fluencia <aula> passou|nao-passou <tentativas>
//   node .claude/scripts/trilha.js avaliar <aula> <arquivo.json>
//   node .claude/scripts/trilha.js concluir <aula>
//   node .claude/scripts/trilha.js pratica <id> [url=...] [pasta=...]
//   node .claude/scripts/trilha.js registrar <tipo> [chave=valor ...]
//   node .claude/scripts/trilha.js enviar
//   node .claude/scripts/trilha.js dev reset | dev ir <aula> | dev fila | dev avaliacoes | dev fechar-tudo <aula>

const fs = require('fs');
const path = require('path');
const paths = require('./lib/paths');
const estadoLib = require('./lib/estado');
const mapa = require('./lib/mapa');
const fila = require('./lib/fila');
const { enviar } = require('./lib/enviar');
const { resumo } = require('./lib/resumo');
const { agora } = require('./lib/util');

const [, , comando, ...args] = process.argv;

function falhar(msg) {
  console.error('ERRO: ' + msg);
  process.exit(1);
}

function parChaveValor(lista) {
  const obj = {};
  for (const item of lista) {
    const i = item.indexOf('=');
    if (i > 0) obj[item.slice(0, i)] = item.slice(i + 1);
  }
  return obj;
}

const comandos = {
  status() {
    const e = estadoLib.carregar();
    console.log(resumo(e));
    const pend = fila.ler().length;
    console.log(`\nFila: ${pend} evento(s) pendente(s) de envio.`);
  },

  identificar([email, ...nome]) {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) falhar('e-mail inválido. Uso: identificar <email> [nome]');
    const e = estadoLib.carregar();
    e.aluno.email = email.toLowerCase();
    if (nome.length) e.aluno.nome = nome.join(' ');
    estadoLib.salvar(e);
    fila.enfileirar('aluno.identificacao', { email: e.aluno.email, nome: e.aluno.nome }, e);
    console.log(`Aluno identificado: ${e.aluno.nome || ''} <${e.aluno.email}>.`);
  },

  oficina([caminho]) {
    if (!caminho) falhar('Uso: oficina <caminho da pasta>');
    const abs = path.resolve(caminho);
    if (!fs.existsSync(abs)) falhar(`pasta não existe: ${abs}`);
    const e = estadoLib.carregar();
    e.oficina = abs;
    estadoLib.salvar(e);
    fila.enfileirar('oficina.registro', { pasta: abs }, e);
    console.log(`Oficina registrada: ${abs}`);
  },

  milestone([idAula, idMilestone]) {
    if (!idAula || !idMilestone) falhar('Uso: milestone <aula> <id-do-milestone>');
    const a = mapa.aula(idAula);
    if (!Array.isArray(a.milestones)) falhar(`aula ${idAula} não tem ementa no mapa.`);
    const m = a.milestones.find((x) => x.id === idMilestone);
    if (!m) falhar(`milestone "${idMilestone}" não existe na aula ${idAula}. Válidos: ${a.milestones.map((x) => x.id).join(', ')}`);
    const e = estadoLib.carregar();
    const reg = estadoLib.registroAula(e, idAula);
    if (reg.status === 'concluida') falhar(`aula ${idAula} já está concluída.`);
    if (reg.status === 'nao_iniciada') { reg.status = 'em_andamento'; reg.iniciada_em = agora(); }
    if (reg.milestones[idMilestone]) {
      console.log(`Milestone ${idMilestone} já estava fechado (${reg.milestones[idMilestone]}). Nada a fazer.`);
      return;
    }
    reg.milestones[idMilestone] = agora();
    estadoLib.salvar(e);
    fila.enfileirar('milestone', { aula: idAula, milestone: idMilestone, titulo: m.titulo }, e);
    const faltam = a.milestones.filter((x) => !reg.milestones[x.id]).map((x) => x.id);
    console.log(`Milestone fechado: ${idAula} / ${idMilestone} (${m.titulo}). Faltam: ${faltam.length ? faltam.join(', ') : 'nenhum'}.`);
  },

  fluencia([idAula, resultado, tentativas]) {
    if (!idAula || !['passou', 'nao-passou'].includes(resultado)) falhar('Uso: fluencia <aula> passou|nao-passou <tentativas>');
    const a = mapa.aula(idAula);
    if (!a.fluencia) falhar(`aula ${idAula} não tem teste de fluência.`);
    const n = parseInt(tentativas, 10);
    if (!Number.isInteger(n) || n < 1) falhar('informe o número de tentativas (inteiro >= 1).');
    const e = estadoLib.carregar();
    const reg = estadoLib.registroAula(e, idAula);
    if (reg.status === 'concluida') falhar(`aula ${idAula} já está concluída.`);
    const pend = a.milestones.filter((x) => !reg.milestones[x.id]);
    if (pend.length) falhar(`fluência só depois de fechar todos os milestones. Pendentes: ${pend.map((x) => x.id).join(', ')}`);
    reg.fluencia = { passou: resultado === 'passou', tentativas: n, registrada_em: agora() };
    estadoLib.salvar(e);
    fila.enfileirar('fluencia', { aula: idAula, passou: reg.fluencia.passou, tentativas: n }, e);
    console.log(`Fluência registrada: ${idAula} ${resultado} em ${n} tentativa(s).`);
  },

  avaliar([idAula, arquivo]) {
    if (!idAula || !arquivo) falhar('Uso: avaliar <aula> <arquivo.json>');
    mapa.aula(idAula);
    let av;
    try { av = JSON.parse(fs.readFileSync(arquivo, 'utf8')); } catch (err) { falhar(`não consegui ler ${arquivo}: ${err.message}`); }
    const erros = validarAvaliacao(av, idAula);
    if (erros.length) falhar('avaliação inválida:\n  - ' + erros.join('\n  - '));
    const e = estadoLib.carregar();
    const reg = estadoLib.registroAula(e, idAula);
    // O payload vai codificado. Não é segredo, é atrito: o aluno vê feedback, não nota.
    const b64 = Buffer.from(JSON.stringify(av), 'utf8').toString('base64');
    fila.enfileirar('avaliacao', { aula: idAula, codificado: 'base64', payload: b64 }, e);
    reg.avaliada_em = agora();
    estadoLib.salvar(e);
    try { fs.unlinkSync(arquivo); } catch { /* já foi */ }
    console.log(`Avaliação da aula ${idAula} registrada e enfileirada. Arquivo temporário removido.`);
  },

  concluir([idAula]) {
    if (!idAula) falhar('Uso: concluir <aula>');
    const a = mapa.aula(idAula);
    const e = estadoLib.carregar();
    const reg = estadoLib.registroAula(e, idAula);
    if (reg.status === 'concluida') falhar(`aula ${idAula} já concluída em ${reg.concluida_em}.`);
    const problemas = [];
    if (!Array.isArray(a.milestones) || !a.milestones.length) problemas.push('aula sem ementa no mapa');
    else {
      const pend = a.milestones.filter((x) => !reg.milestones[x.id]);
      if (pend.length) problemas.push(`milestones pendentes: ${pend.map((x) => x.id).join(', ')}`);
    }
    if (a.fluencia && !reg.fluencia) problemas.push('fluência não registrada');
    if (a.fluencia && reg.fluencia && !reg.fluencia.passou) problemas.push('fluência registrada como não passou; a aula só fecha com transferência');
    if (!reg.avaliada_em) problemas.push('avaliação de fim de aula não registrada (skill avaliar-aula)');
    if (problemas.length) falhar(`não dá para concluir a aula ${idAula}:\n  - ${problemas.join('\n  - ')}`);

    reg.status = 'concluida';
    reg.concluida_em = agora();
    const prox = mapa.proxima(idAula);
    if (e.aula_atual === idAula && prox) e.aula_atual = prox.id;
    estadoLib.salvar(e);
    fila.enfileirar('aula.conclusao', { aula: idAula, proxima: prox ? prox.id : null, minutos_em_aula: minutosNaAula(e, idAula) }, e);
    console.log(`Aula ${idAula} concluída.` + (prox ? ` Próxima: ${prox.id} ${prox.titulo}. Ela abre em um chat novo.` : ' Era a última do mapa.'));
  },

  pratica([idPratica, ...resto]) {
    if (!idPratica) falhar('Uso: pratica <id> [url=...] [pasta=...]');
    const a = mapa.aula(idPratica);
    if (a.tipo !== 'pratica') falhar(`${idPratica} não é prática.`);
    const kv = parChaveValor(resto);
    const e = estadoLib.carregar();
    e.praticas[idPratica] = { ...(e.praticas[idPratica] || {}), ...kv, registrada_em: agora() };
    estadoLib.salvar(e);
    fila.enfileirar('pratica.registro', { aula: idPratica, ...kv }, e);
    console.log(`Prática ${idPratica} registrada: ${JSON.stringify(kv)}`);
  },

  registrar([tipo, ...resto]) {
    if (!tipo) falhar('Uso: registrar <tipo> [chave=valor ...]');
    if (!/^[a-z][a-z0-9_.-]*$/.test(tipo)) falhar('tipo deve ser minúsculo, ex.: suspeita, duvida, nota');
    const e = estadoLib.carregar();
    fila.enfileirar(tipo, parChaveValor(resto), e);
    console.log(`Evento "${tipo}" enfileirado.`);
  },

  async enviar() {
    const r = await enviar({ timeoutMs: 5000 });
    console.log(r.ok ? `Enviado: ${r.enviados} evento(s). ${r.motivo}.` : `Não enviado (${r.motivo}). Pendentes: ${r.pendentes}.`);
  },

  dev([sub, ...resto]) {
    const e = estadoLib.carregar();
    if (sub === 'reset') {
      for (const f of [paths.ESTADO, paths.FILA]) { try { fs.unlinkSync(f); } catch { /* ok */ } }
      fs.rmSync(paths.TMP, { recursive: true, force: true });
      estadoLib.carregar();
      console.log('Estado e fila zerados.');
    } else if (sub === 'ir') {
      const a = mapa.aula(resto[0]);
      e.aula_atual = a.id;
      estadoLib.salvar(e);
      console.log(`Aula atual: ${a.id} ${a.titulo}`);
    } else if (sub === 'fila') {
      for (const ev of fila.ler()) console.log(`${ev.ts}  ${ev.tipo.padEnd(20)} ${ev.aula || ''}  ${JSON.stringify(ev.dados).slice(0, 100)}`);
    } else if (sub === 'avaliacoes') {
      // Decodifica as avaliações ainda na fila local. Se o mock já consumiu, elas apareceram no terminal dele.
      const avs = fila.ler().filter((ev) => ev.tipo === 'avaliacao');
      if (!avs.length) console.log('Nenhuma avaliação na fila local.');
      for (const ev of avs) {
        console.log(`\n=== Avaliação da aula ${ev.aula || ev.dados.aula} (${ev.ts}) ===`);
        console.log(JSON.stringify(JSON.parse(Buffer.from(ev.dados.payload, 'base64').toString('utf8')), null, 2));
      }
    } else if (sub === 'fechar-tudo') {
      // Atalho de teste: fecha milestones e fluência de uma aula sem passar pela conversa.
      const a = mapa.aula(resto[0]);
      const reg = estadoLib.registroAula(e, a.id);
      if (reg.status === 'nao_iniciada') { reg.status = 'em_andamento'; reg.iniciada_em = agora(); }
      for (const m of a.milestones || []) reg.milestones[m.id] = reg.milestones[m.id] || agora();
      if (a.fluencia) reg.fluencia = { passou: true, tentativas: 1, registrada_em: agora() };
      estadoLib.salvar(e);
      console.log(`Milestones e fluência da ${a.id} marcados (teste). Falta só a avaliação.`);
    } else {
      falhar('Uso: dev reset | dev ir <aula> | dev fila | dev avaliacoes | dev fechar-tudo <aula>');
    }
  },
};

function minutosNaAula(e, idAula) {
  return e.sessoes.filter((s) => s.aula === idAula).reduce((t, s) => t + (s.minutos || 0), 0);
}

function validarAvaliacao(av, idAula) {
  const erros = [];
  if (!av || typeof av !== 'object') return ['não é um objeto JSON'];
  if (av.aula !== idAula) erros.push(`campo "aula" deve ser "${idAula}"`);
  const criterios = ['compreensao', 'profundidade_perguntas', 'esforco', 'autonomia'];
  if (!av.criterios || typeof av.criterios !== 'object') erros.push('falta "criterios"');
  else for (const c of criterios) {
    const v = av.criterios[c];
    if (!Number.isInteger(v) || v < 1 || v > 5) erros.push(`criterios.${c} deve ser inteiro de 1 a 5`);
  }
  if (typeof av.justificativa !== 'string' || av.justificativa.length < 120) erros.push('"justificativa" precisa de 3 a 5 linhas (mínimo 120 caracteres)');
  if (av.justificativa && av.justificativa.length > 1200) erros.push('"justificativa" longa demais (máximo 1200 caracteres)');
  if (!Array.isArray(av.evidencias) || av.evidencias.length < 1 || av.evidencias.length > 3) erros.push('"evidencias" deve ter de 1 a 3 trechos');
  else for (const ev of av.evidencias) if (typeof ev !== 'string' || ev.length > 300) erros.push('cada evidência é um trecho curto (máximo 300 caracteres)');
  if (typeof av.resumo_qualitativo !== 'string' || av.resumo_qualitativo.length < 40 || av.resumo_qualitativo.length > 400) erros.push('"resumo_qualitativo" entre 40 e 400 caracteres');
  if (av.fluencia !== null && av.fluencia !== undefined) {
    if (typeof av.fluencia.passou !== 'boolean') erros.push('fluencia.passou deve ser booleano');
    if (!Number.isInteger(av.fluencia.tentativas)) erros.push('fluencia.tentativas deve ser inteiro');
    if (typeof av.fluencia.evidencia !== 'string' || av.fluencia.evidencia.length > 400) erros.push('fluencia.evidencia é texto de até 400 caracteres');
  }
  if (av.suspeita !== null && av.suspeita !== undefined) {
    if (typeof av.suspeita.descricao !== 'string' || typeof av.suspeita.evidencia !== 'string') erros.push('suspeita precisa de "descricao" e "evidencia"');
  }
  return erros;
}

(async () => {
  if (!comando || !comandos[comando]) {
    console.log(fs.readFileSync(__filename, 'utf8').split('\n').filter((l) => l.startsWith('//   node')).map((l) => l.slice(3)).join('\n'));
    process.exit(comando ? 1 : 0);
  }
  try {
    await comandos[comando](args);
  } catch (err) {
    falhar(err.message);
  }
})();
