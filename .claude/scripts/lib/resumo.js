'use strict';
// Monta o texto que o hook de início injeta no contexto e que `status` imprime.
// É a memória entre sessões: curto, factual, com a instrução de qual skill carregar.
const mapa = require('./mapa');
const notas = require('./notas');
const { relativo } = require('./util');

function resumo(e, { fonte = 'startup' } = {}) {
  const a = mapa.aula(e.aula_atual);
  const reg = e.aulas[a.id] || { status: 'nao_iniciada', milestones: {}, fluencia: null, sessoes: 0 };
  const linhas = [];

  linhas.push('# Estado da trilha (gerado pelo harness, não editado pelo aluno)');
  linhas.push('');

  if (!e.aluno.email) {
    linhas.push('Aluno: ainda não identificado. Esta é a primeira sessão. Antes de qualquer conteúdo, apresente-se em duas linhas, peça o e-mail e o primeiro nome (se o e-mail da conta do Claude aparece no seu contexto, proponha-o e peça confirmação em vez de perguntar do zero), e registre com:');
    linhas.push('  node .claude/scripts/trilha.js identificar <email> <nome>');
  } else {
    linhas.push(`Aluno: ${e.aluno.nome || e.aluno.email} (${e.aluno.email})`);
  }

  const rotulo = a.tipo === 'pratica' ? 'Prática atual' : 'Aula atual';
  linhas.push(`${rotulo}: ${a.id} ${a.titulo} [${reg.status.replace('_', ' ')}]`);

  if (!mapa.escrita(a)) {
    linhas.push(`Esta ${a.tipo === 'pratica' ? 'prática' : 'aula'} ainda não foi escrita neste protótipo do harness. Diga isso ao aluno com franqueza e ofereça tirar dúvidas do que já foi visto. Não invente ementa.`);
  } else {
    const fechados = a.milestones.filter((m) => reg.milestones[m.id]);
    const pendentes = a.milestones.filter((m) => !reg.milestones[m.id]);
    linhas.push(`Milestones: ${fechados.length} de ${a.milestones.length} fechados.`);
    if (fechados.length) linhas.push('  Fechados: ' + fechados.map((m) => `${m.id} (${m.titulo})`).join('; '));
    if (pendentes.length) linhas.push('  Pendentes: ' + pendentes.map((m) => `${m.id} (${m.titulo})`).join('; '));
    if (a.tipo === 'pratica') {
      linhas.push('Prática: sem fluência e sem avaliação. Fecha com o artefato registrado (pasta, e URL se houver).');
    } else {
      if (a.fluencia) {
        linhas.push(`Fluência: ${reg.fluencia ? (reg.fluencia.passou ? `passou em ${reg.fluencia.tentativas} tentativa(s)` : `ainda não passou (${reg.fluencia.tentativas} tentativa(s))`) : 'não feita'}.`);
      } else {
        linhas.push('Fluência: esta aula não tem.');
      }
      linhas.push(`Avaliação de fim de aula: ${reg.avaliada_em ? 'registrada' : 'não registrada'}.`);
    }
  }

  if (e.oficina) linhas.push(`Oficina (pasta de prática do aluno): ${e.oficina}`);
  else linhas.push('Oficina: pasta ainda não registrada.');

  const p0 = e.praticas.P0;
  if (p0 && p0.pasta) linhas.push(`P0: ${p0.pasta}${p0.url ? ' — no ar em ' + p0.url : ' (ainda não está no ar)'}`);
  else if (p0) linhas.push('P0: registro incompleto, sem a pasta. Pergunte onde a página mora e rode `pratica P0 pasta=<caminho>`; as fluências do módulo precisam dela.');

  const ultima = e.sessoes.length ? e.sessoes[e.sessoes.length - 1] : null;
  if (ultima) {
    linhas.push(`Última sessão: ${relativo(ultima.fim)}, ${ultima.minutos} min, na aula ${ultima.aula}. Sessões nesta aula: ${reg.sessoes || 0}.`);
  } else {
    linhas.push('Primeira sessão do aluno no harness.');
  }

  const concluidas = Object.entries(e.aulas).filter(([, r]) => r.status === 'concluida').map(([id]) => id);
  if (concluidas.length) linhas.push(`Aulas concluídas: ${concluidas.join(', ')}.`);

  // A memória do aluno entra inteira: são no máximo sete linhas e é o que
  // permite retomar o fio pessoal entre aulas separadas por dias.
  const memoria = notas.paraContexto();
  if (memoria) { linhas.push(''); linhas.push(memoria); }

  linhas.push('');
  if (fonte === 'compact') {
    linhas.push('Contexto foi compactado no meio da sessão. Continue a aula de onde estava, sem reapresentação. Os milestones acima são a verdade sobre o que já foi fechado.');
  } else {
    linhas.push('Antes de responder ao aluno, invoque a skill `tutor` e depois a skill `' + (a.skill || 'tutor') + '`' + (mapa.escrita(a) ? '' : ' se ela existir') + '. Não carregue skills de outras aulas.');
    if (reg.status === 'em_andamento' && Object.keys(reg.milestones).length) {
      linhas.push('Retomada: cumprimente em uma linha, diga onde parou e continue do primeiro milestone pendente. Não repita o que já foi fechado.');
    }
  }
  return linhas.join('\n');
}

module.exports = { resumo };
