'use strict';
// Monta o texto que o hook de início injeta no contexto e que `status` imprime.
// É a memória entre sessões: curto, factual, com a instrução de qual skill carregar.
const mapa = require('./mapa');
const notas = require('./notas');
const acesso = require('./acesso');
const quiz = require('./quiz');
const { relativo } = require('./util');

// Sala sem acesso à 202 não tem aula. O resumo inteiro vira o pedido do token,
// e nada da aula aparece: o tutor não tem o que começar antes do `conectar`.
function portaFechada(e, a, linhas) {
  const recusado = Boolean(e.acesso && e.acesso.recusado_em);
  const guardado = !recusado && Boolean(acesso.token());
  // Com o endereço do CRM no config.json (o caso normal), o aluno só cola o
  // token. As duas linhas só se pedem numa sala sem endereço nenhum.
  const temServidor = Boolean(acesso.servidor());
  const comServidor = temServidor ? '' : ' servidor=<url>';
  linhas.push(`${rotuloDe(a)}: ${a.id} ${a.titulo}`);
  linhas.push('');
  if (recusado) {
    linhas.push(`Acesso à 202: RECUSADO. A 202 recusou o token desta máquina ${relativo(e.acesso.recusado_em)}: o acesso foi revogado, trocado por outro, ou a turma foi encerrada. A sala fica fechada até ele conectar um token novo. O progresso está guardado e continua de onde parou.`);
    linhas.push('Diga isso em duas linhas, sem jargão, e peça o token novo que a 202 mandou. Se ele não recebeu, é com a 202, pelo canal por onde entrou na trilha. Registre com:');
    linhas.push(`  node .claude/scripts/trilha.js conectar nome="${e.aluno.nome || '<primeiro nome>'}" token=<token>${comServidor}`);
  } else if (guardado) {
    linhas.push('Acesso à 202: esta máquina já tem um token da 202 guardado, mas esta sala ainda não foi conectada. Apresente-se em duas linhas, peça só o primeiro nome e conecte com o token que já está aqui:');
    linhas.push('  node .claude/scripts/trilha.js conectar nome="<primeiro nome>"');
  } else {
    linhas.push(e.sessoes.length
      ? 'Acesso à 202: não conectado. A trilha passou a exigir o acesso da 202; o progresso dele está guardado e continua de onde parou assim que conectar.'
      : 'Acesso à 202: não conectado. Esta é a primeira sessão.');
    if (temServidor) {
      linhas.push('Antes de qualquer conteúdo, apresente-se em duas linhas e peça duas coisas: o primeiro nome e o token de acesso que a 202 mandou a ele. Ele cola só o valor, do jeito que veio; se vier com `TRILHA_202_TOKEN=` na frente, também serve, e você passa só o valor. Registre com:');
    } else {
      linhas.push('Antes de qualquer conteúdo, apresente-se em duas linhas e peça duas coisas: o primeiro nome e o acesso que a 202 mandou a ele, que são duas linhas, `TRILHA_202_SERVIDOR=...` e `TRILHA_202_TOKEN=...`. Ele pode colar as duas do jeito que vieram. Registre com:');
    }
    linhas.push(`  node .claude/scripts/trilha.js conectar nome="<primeiro nome>" token=<token>${comServidor}`);
  }
  linhas.push('');
  linhas.push('Enquanto a conexão não passar, não há aula: não carregue skill de aula, não ensine, não abra referência; o CLI recusa registrar qualquer coisa antes disso. Se ele não tem o token, diga que é a 202 quem emite, pelo canal por onde ele entrou na trilha, e pare aí. Se pedir para pular, a resposta é a mesma, em uma linha. Se o `conectar` recusar, diga o que o comando disse, com as suas palavras.');
  linhas.push('O token é dele e não volta ao chat: não repita, não mostre onde fica guardado, não escreva em arquivo. Quem guarda é o `conectar`, fora deste repositório.');
  linhas.push('');
  linhas.push('Antes de responder ao aluno, invoque só a skill `tutor`. Quando o `conectar` passar, ele imprime o estado da trilha com a skill da aula a carregar: siga dali, neste mesmo chat.');
  return linhas.join('\n');
}

// Avaliação de aula que o limite de uso adiou (trilha.js, adiar): roda no começo
// do chat seguinte, quando a cota voltou. A aula da vez fica de fora enquanto não
// fecha, porque o fechamento dela já roda o `avaliar`.
function pendencias(e, linhas) {
  const adiadas = Object.entries(e.aulas || {})
    .filter(([id, r]) => r.avaliacao_adiada && !r.avaliada_em && (r.status === 'concluida' || id !== e.aula_atual))
    .map(([id]) => id);
  if (!adiadas.length) return;
  linhas.push(`Pendência do harness: a avaliação ${adiadas.length > 1 ? 'das aulas' : 'da aula'} ${adiadas.join(', ')} não terminou porque o limite de uso da conta bateu. No seu primeiro turno, antes da matéria, rode ${adiadas.map((id) => `\`node .claude/scripts/trilha.js avaliar ${id}\``).join(' e ')}; leva cerca de um minuto cada. Ao aluno, no máximo uma linha dizendo que está fechando o registro de uma aula anterior. Se o comando disser que o limite bateu de novo, siga a aula normalmente.`);
}

// Duas frentes abertas e o chat ainda sem escolha: o resumo inteiro vira a
// pergunta, e nada de aula aparece. O `seguir` imprime o resumo da escolhida.
function escolhaDeFrente(e, linhas) {
  const s = e.sessao_atual;
  linhas.push('Frentes paralelas: depois do M1 a trilha corre em duas frentes ao mesmo tempo, engenharia (M2, depois M3) e negócio (M4, depois M5), e o M6 abre quando as duas fecharem. Neste chat ele escolhe por qual seguir agora:');
  for (const id of s.escolha.opcoes) {
    const a = mapa.aula(id);
    const m = mapa.modulo(a.modulo) || {};
    const reg = e.aulas[id] || { status: 'nao_iniciada', milestones: {} };
    let onde = 'não iniciada';
    if (reg.status === 'em_andamento') {
      onde = a.tipo === 'quiz'
        ? `em andamento, ${quiz.respondidas(reg)} pergunta(s) respondida(s)`
        : `em andamento, ${(a.milestones || []).filter((x) => (reg.milestones || {})[x.id]).length} de ${(a.milestones || []).length} marcos fechados`;
    }
    linhas.push(`  - ${a.id} ${a.titulo} (módulo ${a.modulo}, ${m.titulo || ''}${m.frente ? `; frente de ${m.frente}` : ''}): ${onde}`);
  }
  linhas.push('Antes de qualquer conteúdo, cumprimente em uma linha e pergunte qual ele quer fazer agora, com as opções acima em palavras simples: número, título e onde ele parou em cada uma. Não recomende nem empurre uma delas: a ordem é dele, nenhuma pula a outra, e as duas fecham antes do M6. Se a primeira mensagem dele já disse qual, não pergunte de novo. Com a resposta, rode:');
  linhas.push('  node .claude/scripts/trilha.js seguir <aula>');
  linhas.push('O comando imprime o estado da aula escolhida e a skill a carregar: siga dali, neste mesmo chat.');
  pendencias(e, linhas);
  const memoria = notas.paraContexto();
  if (memoria) { linhas.push(''); linhas.push(memoria); }
  linhas.push('');
  linhas.push('Antes de responder ao aluno, invoque só a skill `tutor`. Não carregue skill de aula antes do `seguir`.');
  return linhas.join('\n');
}

function rotuloDe(a) {
  return a.tipo === 'pratica' ? 'Prática atual' : a.tipo === 'quiz' ? 'Quiz atual' : 'Aula atual';
}

function resumo(e, { fonte = 'startup' } = {}) {
  const a = mapa.aula(e.aula_atual);
  const reg = e.aulas[a.id] || { status: 'nao_iniciada', milestones: {}, fluencia: null, sessoes: 0 };
  // Prática com correção tem duas fases, e a segunda é de outro papel: entregue e
  // ainda não corrigida, este chat é a correção, com outra skill. A separação é a
  // 1.3 aplicada ao próprio harness: quem corrige não é quem acompanhou o trabalho.
  const entrega = (e.praticas || {})[a.id] || {};
  const emCorrecao = a.tipo === 'pratica' && a.correcao && mapa.prontaParaCorrigir(a, entrega, reg) && !entrega.corrigida_em;
  const linhas = [];

  linhas.push('# Estado da trilha (gerado pelo harness, não editado pelo aluno)');
  linhas.push('');

  if (!acesso.conectado(e)) return portaFechada(e, a, linhas);

  const conferido = e.acesso.verificado_em ? '' : ' (token ainda não conferido pelo servidor; confere sozinho no próximo envio, não comente)';
  linhas.push(`Aluno: ${e.aluno.nome || 'sem nome'}${e.aluno.email ? ` (${e.aluno.email})` : ''}. Conectado à 202${conferido}.`);
  if (e.sessao_atual && e.sessao_atual.escolha && !e.sessao_atual.escolha.feita) return escolhaDeFrente(e, linhas);

  linhas.push(`${rotuloDe(a)}: ${a.id} ${a.titulo} [${reg.status.replace('_', ' ')}]`);

  // Depois da última unidade escrita não há o que carregar: o material novo
  // chega pela atualização, e o chat não reabre a unidade que já fechou. Quando a
  // última é do M6, não há material novo a esperar: a trilha acabou.
  const fimDoMapa = reg.status === 'concluida' && !mapa.abertas(e).length;
  if (fimDoMapa && a.modulo === 6) {
    linhas.push('Fim da trilha: o aluno concluiu a última unidade, e não há aula neste chat nem material novo a esperar. Diga isso em poucas linhas, sem cerimônia e sem prometer nada da 202 que não esteja escrito aqui, e ofereça tirar dúvidas do que já foi visto ou revisitar qualquer aula, que continuam no disco. Não registre nada.');
  } else if (fimDoMapa) {
    linhas.push('Fim do material escrito: esta era a última unidade do mapa, e está concluída. Não há aula neste chat. Diga ao aluno, em poucas linhas, que o próximo módulo chega com a atualização do material, que a sala faz sozinha a cada chat novo, sem prometer data, e ofereça tirar dúvidas do que já foi visto.');
  } else if (!mapa.escrita(a)) {
    linhas.push(`Esta ${a.tipo === 'pratica' ? 'prática' : a.tipo === 'quiz' ? 'unidade' : 'aula'} ainda não foi escrita neste protótipo do harness. Diga isso ao aluno com franqueza e ofereça tirar dúvidas do que já foi visto. Não invente ementa.`);
  } else if (a.tipo === 'quiz') {
    // O quiz não tem milestones: a ementa é o banco, e o progresso é quantas
    // perguntas já têm resposta gravada.
    let banco = null;
    try { banco = quiz.carregar(a.id); } catch { /* escrita() já conferiu que existe */ }
    const total = banco ? banco.questoes.length : '?';
    const feitas = quiz.respondidas(reg);
    const prox = banco ? quiz.proximaPendente(banco, reg) : null;
    linhas.push(`Perguntas respondidas: ${feitas} de ${total}.` + (prox ? ` A da vez é a ${prox.n}: \`quiz ${a.id}\` imprime.` : ' Todas respondidas: falta a memória do aluno e o `concluir`.'));
    linhas.push(`Quiz: sem milestones, sem fluência e sem avaliação de fim de aula. Uma pergunta de cada vez, na ordem, sem refazer; o gabarito só sai do script depois da resposta gravada. Fecha com todas respondidas e \`concluir ${a.id}\`.`);
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
        const exigida = mapa.entregaExigida(a);
        if (exigida.includes('url') || entrega.url) linhas.push(`  no ar em ${entrega.url || 'não registrado'}`);
        if (exigida.includes('repo') || entrega.repo) linhas.push(`  repositório ${entrega.repo || 'não registrado'}`);
        linhas.push('Este chat não é a prática: você não conduziu o trabalho, não vai reabri-lo e não vai ajudar a melhorar o que ele fez agora. Você corrige o que foi entregue e devolve o feedback.');
      } else {
        const exigida = mapa.entregaExigida(a);
        const partes = exigida.map((c) => (c === 'pasta' ? 'pasta' : c === 'url' ? 'URL no ar' : c === 'repo' ? 'repositório público' : c)).join(', ');
        linhas.push(`Prática: sem fluência e sem avaliação de fim de aula. Fecha em duas fases — a entrega (${partes}) e, num chat separado, a correção.`);
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

  // Aula com fluência precisa da oficina, e no M1 também da P0. A instrução de
  // resolver isso só aparece quando falta, em vez de morar na `tutor` para sempre.
  if (e.oficina) linhas.push(`Oficina (pasta de prática do aluno): ${e.oficina}`);
  else if (a.fluencia) linhas.push('Oficina: pasta ainda não registrada, e esta aula precisa dela. Antes de começar, pergunte onde fica e rode `oficina <caminho>`.');
  else linhas.push('Oficina: pasta ainda não registrada.');

  const p0 = e.praticas.P0;
  if (p0 && p0.pasta) linhas.push(`P0: ${p0.pasta}${p0.url ? ' — no ar em ' + p0.url : ' (ainda não está no ar)'}`);
  else if (p0) linhas.push('P0: registro incompleto, sem a pasta. Pergunte onde a página mora e rode `pratica P0 pasta=<caminho>`; as fluências do módulo precisam dela.');
  else if (a.fluencia && a.modulo === 1) linhas.push('P0: não registrada, e as fluências deste módulo precisam de uma página real. Antes de começar, peça ao aluno uma página HTML de um arquivo só na oficina e registre com `pratica P0 pasta=<caminho> url=<url>`, a URL se existir.');

  for (const [idP, p] of Object.entries(e.praticas || {})) {
    if (idP === 'P0' || idP === a.id || !p.pasta) continue;
    linhas.push(`${idP}: ${p.pasta}${p.url ? ' — no ar em ' + p.url : ''}${p.repo ? ' — ' + p.repo : ''}${p.corrigida_em ? '' : p.entregue_em ? ' (ainda não corrigida)' : ' (em construção)'}`);
  }
  // O plano da P5 nasce no começo da 5.1 e as fluências do M5 guardam texto nele.
  // Sem a pasta, a aula do M5 a cria antes do primeiro marco.
  if (a.modulo === 5 && a.tipo === 'aula' && !((e.praticas || {}).P5 || {}).pasta) {
    linhas.push('Plano da P5: pasta não registrada. Antes do primeiro marco, ele lê `praticas/p5/brief.md` e cria na oficina `plano-p5/plano.md` com as seções do brief, e você registra com `pratica P5 pasta=<caminho>` (isso não abre correção).');
  }
  // A prática que cresceu nas aulas (P3, P5, P6) já chega com pasta registrada, e
  // o chat dela precisa saber onde: registrar de novo é só para quando mudou.
  if (a.tipo === 'pratica' && !emCorrecao && entrega.pasta) {
    linhas.push(`Registro desta prática até agora: ${entrega.pasta}${entrega.url ? ' — no ar em ' + entrega.url : ''}${entrega.repo ? ' — ' + entrega.repo : ''}.`);
  }

  // A P3 chama um modelo pela API, e a trilha usa só plano gratuito (decisão de
  // 05/10): ninguém paga nada. A regra mora aqui, no estado, porque vale da 3.3
  // à P3 e o tutor não pode improvisar um cartão ou um plano pago.
  // No M6 a mesma regra vale para a feature da P6, que parte do motor da P3 por
  // padrão; e o Stripe, que entra na 6.1, também roda sem ninguém pagar nada.
  if (['6.1', '6.2', 'P6'].includes(a.id) && !emCorrecao) {
    linhas.push('Stripe da P6: conta brasileira, sandbox geral criada no painel na 6.1, nunca ativada. Ninguém paga nada nem ativa conta: não sugira informar documento, conta bancária ou cartão, nem criar conta de outro país. A assinatura é em cartão de teste; o Pix Automático não existe para conta brasileira na Stripe, e o pagamento pendente se testa com boleto. Forma de pagamento, nome de tela e sandbox mudam: não afirme de cabeça; as páginas estão nas referências da 6.1.');
  }
  if ((a.modulo === 3 && !['3.1', '3.2', 'Q3'].includes(a.id) || a.modulo === 6 && a.id !== 'Q6') && !emCorrecao) {
    linhas.push((a.modulo === 6 ? 'API da feature (se a P6 usa IA, como na P3): a chave' : 'API da P3: a chave') + ' é do plano gratuito do Gemini (Google AI Studio), criada na 3.3; o Groq é a alternativa. Ninguém paga nada: não sugira cartão, plano pago nem crédito. Quando o sistema bater no limite do gratuito (erro de limite de requisições ou de tokens), isso é matéria, não defeito da conta: espere a janela ou diminua as chamadas (trocar de modelo só fora de uma rodada de eval, que compara no mesmo modelo), e o sistema dele precisa tratar esse erro sem quebrar a tela. Os limites mudam: não afirme número de cabeça; o número do projeto dele está no AI Studio dele (aistudio.google.com/rate-limit, que ele abre no navegador), e a página de limites está nas referências da 3.4.');
  }

  // A ideia do aluno nasce na 4.4 e é o objeto das fluências do trilho de negócio.
  // Do M4 ao M5 também correm as três entrevistas reais da P5, e é na abertura de
  // cada sessão de aula ou de quiz que o tutor pergunta por elas. Na prática não:
  // a conversa da prática é o que a correção lê (e, na P4, é a entrevista
  // simulada), e o chat da correção não pede nada ao aluno.
  if (e.ideia && e.ideia.texto) {
    linhas.push(`Ideia do aluno (da 4.4; as fluências do negócio são sobre ela): ${e.ideia.texto.replace(/\s+/g, ' ')}`);
    if (e.ideia.hipoteses) linhas.push(`  Hipóteses: ${e.ideia.hipoteses.replace(/\s+/g, ' ')}`);
    if (a.modulo === 4 || a.modulo === 5) {
      const feitas = (e.ideia.entrevistas || []).length;
      const nomes = (e.ideia.nomes || []).length;
      // A P5 é o plano que as entrevistas alimentam: ela só começa com as três, e
      // é o chat dela que confere. Na P4 e em qualquer correção, não se pergunta.
      if (a.id === 'P5' && !emCorrecao) linhas.push(`  Entrevistas reais para a P5: ${feitas} de 3 feitas.${feitas < 3 ? ' A P5 só começa com as três: registre a que ele trouxer (`ideia entrevista="<o que aprendeu, sem o nome da pessoa>"`); se com ela ainda não chegar a três, este chat espera, sem escrever plano.' : ''}`);
      else if (a.tipo === 'pratica') linhas.push(`  Entrevistas reais para a P5: ${feitas} de 3 feitas. Neste chat não se pergunta por elas.`);
      else linhas.push(`  Entrevistas reais para a P5: ${feitas} de 3 feitas, ${nomes} nome(s) na lista (\`ideia\` mostra quem).${feitas < 3 ? ' Na abertura desta sessão, pergunte como vai a próxima, em uma linha, sem cobrar; quando ele contar uma, registre com `ideia entrevista="<o que aprendeu, sem o nome da pessoa>"`.' : ''}`);
    }
  } else if (a.modulo === 4 && a.id !== '4.1' && a.id !== '4.2' && a.id !== '4.3') {
    linhas.push('Ideia do aluno: ainda não registrada. Ela nasce na 4.4, com `ideia texto="..." hipoteses="..." nomes="..."`.');
  }

  const ultima = e.sessoes.length ? e.sessoes[e.sessoes.length - 1] : null;
  if (ultima) {
    linhas.push(`Última sessão: ${relativo(ultima.fim)}, ${ultima.minutos} min, na aula ${ultima.aula}. Sessões nesta aula: ${reg.sessoes || 0}.`);
  } else {
    linhas.push('Primeira sessão do aluno no harness.');
  }

  const concluidas = Object.entries(e.aulas).filter(([, r]) => r.status === 'concluida').map(([id]) => id);
  if (concluidas.length) linhas.push(`Aulas concluídas: ${concluidas.join(', ')}.`);

  pendencias(e, linhas);

  // A memória do aluno entra inteira: são no máximo sete linhas e é o que
  // permite retomar o fio pessoal entre aulas separadas por dias.
  const memoria = notas.paraContexto();
  if (memoria) { linhas.push(''); linhas.push(memoria); }

  linhas.push('');
  if (fonte === 'compact') {
    linhas.push('Contexto foi compactado no meio da sessão. Continue a aula de onde estava, sem reapresentação. Os milestones acima são a verdade sobre o que já foi fechado.');
  } else {
    if (fimDoMapa) linhas.push('Antes de responder ao aluno, invoque só a skill `tutor`. Não carregue skill de aula.');
    else linhas.push('Antes de responder ao aluno, invoque a skill `tutor` e depois a skill `' + (emCorrecao ? 'corrigir' : (a.skill || 'tutor')) + '`' + (mapa.escrita(a) ? '' : ' se ela existir') + '. Não carregue skills de outras aulas.');
    if (a.tipo === 'quiz' && reg.status === 'em_andamento' && quiz.respondidas(reg)) {
      linhas.push('Retomada: cumprimente em uma linha e imprima a pergunta da vez. Não repita as já respondidas nem a correção delas.');
    } else if (reg.status === 'em_andamento' && a.tipo === 'aula' && Array.isArray(a.milestones) && a.milestones.every((m) => reg.milestones[m.id]) && (!a.fluencia || (reg.fluencia && reg.fluencia.passou))) {
      // Tudo registrado e a aula aberta: o chat anterior parou no fechamento (o
      // limite de uso bateu, a janela fechou). Não se refaz a aula: só se fecha.
      linhas.push('Retomada no fechamento: os marcos' + (a.fluencia ? ' e a fluência' : '') + ' já estão registrados, e o chat anterior parou antes de fechar a aula. Cumprimente em uma linha, diga que falta só fechar a aula e feche como a `tutor` manda, sem reabrir a matéria' + (a.avaliacao === false || reg.avaliada_em ? '' : ': o `avaliar` lê também o chat anterior') + '.');
    } else if (reg.status === 'em_andamento' && Object.keys(reg.milestones).length) {
      linhas.push('Retomada: cumprimente em uma linha, diga onde parou e continue do primeiro milestone pendente. Não repita o que já foi fechado.');
    }
    if (emCorrecao) {
      linhas.push('A skill da prática não se carrega nesta fase.');
    }
  }
  return linhas.join('\n');
}

module.exports = { resumo };
