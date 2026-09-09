'use strict';
// Monta o texto que o hook de início injeta no contexto e que `status` imprime.
// É a memória entre sessões: curto, factual, com a instrução de qual skill carregar.
const mapa = require('./mapa');
const notas = require('./notas');
const { relativo } = require('./util');

function resumo(e, { fonte = 'startup' } = {}) {
  const a = mapa.aula(e.aula_atual);
  const reg = e.aulas[a.id] || { status: 'nao_iniciada', milestones: {}, fluencia: null, sessoes: 0 };
  // Prática com correção tem duas fases, e a segunda é de outro papel: entregue e
  // ainda não corrigida, este chat é a correção, com outra skill. A separação é a
  // 1.3 aplicada ao próprio harness: quem corrige não é quem acompanhou o trabalho.
  const entrega = (e.praticas || {})[a.id] || {};
  const emCorrecao = a.tipo === 'pratica' && a.correcao && Boolean(entrega.pasta && entrega.url) && !entrega.corrigida_em;
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
      if (!a.correcao) {
        linhas.push('Prática: sem fluência e sem avaliação. Fecha com o artefato registrado (pasta, e URL se houver).');
      } else if (emCorrecao) {
        linhas.push('Fase: CORREÇÃO. A entrega já está registrada:');
        linhas.push(`  pasta ${entrega.pasta}`);
        linhas.push(`  no ar em ${entrega.url}`);
        linhas.push(`  repositório ${entrega.repo || 'não registrado'}`);
        linhas.push('Este chat não é a prática: você não conduziu o trabalho, não vai reabri-lo e não vai ajudar a melhorar a página agora. Você corrige o que foi entregue e devolve o feedback.');
      } else {
        linhas.push('Prática: sem fluência e sem avaliação de fim de aula. Fecha em duas fases — a entrega (pasta, URL no ar e repositório público) e, num chat separado, a correção.');
      }
    } else {
      if (a.fluencia) {
        linhas.push(`Fluência: ${reg.fluencia ? (reg.fluencia.passou ? `passou em ${reg.fluencia.tentativas} tentativa(s)` : `ainda não passou (${reg.fluencia.tentativas} tentativa(s))`) : 'não feita'}.`);
      } else {
        linhas.push('Fluência: esta aula não tem.');
      }
      if (a.avaliacao === false) {
        linhas.push('Avaliação de fim de aula: esta aula não tem, e também não leva feedback ao aluno. Ela é combinado, não matéria.');
      } else {
        linhas.push(`Avaliação de fim de aula: ${reg.avaliada_em ? 'registrada' : 'não registrada'}.`);
      }
    }
  }

  if (e.oficina) linhas.push(`Oficina (pasta de prática do aluno): ${e.oficina}`);
  else linhas.push('Oficina: pasta ainda não registrada.');

  const p0 = e.praticas.P0;
  if (p0 && p0.pasta) linhas.push(`P0: ${p0.pasta}${p0.url ? ' — no ar em ' + p0.url : ' (ainda não está no ar)'}`);
  else if (p0) linhas.push('P0: registro incompleto, sem a pasta. Pergunte onde a página mora e rode `pratica P0 pasta=<caminho>`; as fluências do módulo precisam dela.');

  for (const [idP, p] of Object.entries(e.praticas || {})) {
    if (idP === 'P0' || idP === a.id || !p.pasta) continue;
    linhas.push(`${idP}: ${p.pasta}${p.url ? ' — no ar em ' + p.url : ''}${p.repo ? ' — ' + p.repo : ''}${p.corrigida_em ? '' : ' (ainda não corrigida)'}`);
  }

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
    linhas.push('Antes de responder ao aluno, invoque a skill `tutor` e depois a skill `' + (emCorrecao ? 'corrigir' : (a.skill || 'tutor')) + '`' + (mapa.escrita(a) ? '' : ' se ela existir') + '. Não carregue skills de outras aulas.');
    if (reg.status === 'em_andamento' && Object.keys(reg.milestones).length) {
      linhas.push('Retomada: cumprimente em uma linha, diga onde parou e continue do primeiro milestone pendente. Não repita o que já foi fechado.');
    }
    if (emCorrecao) {
      linhas.push('A skill da prática não se carrega nesta fase.');
    }
  }
  return linhas.join('\n');
}

module.exports = { resumo };
