#!/usr/bin/env node
'use strict';
// CLI do harness. O tutor chama estes comandos durante a aula. Tudo que é
// "fato" sobre o progresso do aluno passa por aqui, nunca por "o Claude achou".
//
//   node .claude/scripts/trilha.js status
//   node .claude/scripts/trilha.js conectar nome="<nome>" token=<token> [servidor=<url>]   (o token também entra solto, só o valor)
//   node .claude/scripts/trilha.js identificar <email> [nome]
//   node .claude/scripts/trilha.js oficina <caminho>
//   node .claude/scripts/trilha.js milestone <aula> <id-do-milestone>
//   node .claude/scripts/trilha.js fluencia <aula> passou|nao-passou <tentativas>
//   node .claude/scripts/trilha.js avaliar <aula>
//   node .claude/scripts/trilha.js concluir <aula>
//   node .claude/scripts/trilha.js pratica <id> pasta=<caminho> [url=...] [repo=...]
//   node .claude/scripts/trilha.js criterios <pratica>
//   node .claude/scripts/trilha.js corrigir <pratica> <arquivo.json>
//   node .claude/scripts/trilha.js quiz <Q> | quiz <Q> responder <n> <letra>          (aberta: responder <n> arquivo=<txt> | texto="...")
//   node .claude/scripts/trilha.js nota <chave> "<texto>" | nota <chave> --apagar | nota --listar
//   node .claude/scripts/trilha.js registrar <tipo> [chave=valor ...]
//   node .claude/scripts/trilha.js enviar
//   node .claude/scripts/trilha.js dev reset [--forcar] | dev ir <aula> | dev fila | dev avaliacoes | dev referencias | dev fechar-tudo <aula> | dev desconectar

const fs = require('fs');
const path = require('path');
const paths = require('./lib/paths');
const estadoLib = require('./lib/estado');
const mapa = require('./lib/mapa');
const fila = require('./lib/fila');
const { enviar, enviarAgora } = require('./lib/enviar');
const { resumo } = require('./lib/resumo');
const referencias = require('./lib/referencias');
const notas = require('./lib/notas');
const transcricao = require('./lib/transcricao');
const avaliador = require('./lib/avaliador');
const acesso = require('./lib/acesso');
const quizLib = require('./lib/quiz');
const { agora, minutosEntre, relativo } = require('./lib/util');

const [, , comando, ...args] = process.argv;

const { MINUTOS_VIVA } = estadoLib;

// Comandos que enfileiram progresso. Ao terminarem, a fila sobe para a 202 na
// hora, sem depender dos hooks.
const SOBEM_NA_HORA = new Set(['identificar', 'oficina', 'milestone', 'fluencia', 'avaliar', 'concluir', 'pratica', 'criterios', 'corrigir', 'quiz', 'registrar']);

function falhar(msg) {
  console.error('ERRO: ' + msg);
  process.exit(1);
}

// Sem acesso à 202 nada se registra: é o que faz "sem token não há aula" valer
// mesmo quando a conversa escorrega. Ficam de fora o que não é progresso:
// status, conectar, identificar, registrar, enviar e dev.
function exigirAcesso() {
  if (acesso.conectado(estadoLib.carregar())) return;
  falhar('esta sala não está conectada à 202, e nada se registra antes disso. Peça ao aluno o primeiro nome e o token que a 202 mandou, e rode: conectar nome="<nome>" token=<token>');
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

  // A porta da trilha. O token confere na hora, contra o CRM: 401 recusa e não
  // guarda nada; 200 conecta; servidor fora do ar conecta mesmo assim, porque
  // rede nunca trava a aula, e o envio seguinte confere. O token nunca é impresso,
  // nunca vai para o estado nem para a fila: só para CREDENCIAIS, fora do repositório.
  async conectar(args) {
    const kv = parChaveValor(args);
    const e = estadoLib.carregar();
    const uso = 'Uso: conectar nome="<primeiro nome>" token=<token> [servidor=<url>]';
    const nome = String(kv.nome || '').trim() || e.aluno.nome;
    // O token entra do jeito que o aluno colar: só o valor, que é o normal;
    // token=<valor>; ou a linha inteira TRILHA_202_TOKEN=<valor>. Aspas e espaço
    // em volta saem. Token da 202 é base64url e não tem `=`, então o argumento
    // solto que tem forma de token é ele.
    const limpar = (v) => String(v || '').trim().replace(/^["']+|["']+$/g, '').trim();
    const soltos = args.filter((a) => !a.includes('=')).map(limpar).filter(Boolean);
    const novoToken = limpar(kv.token || kv.TRILHA_202_TOKEN) || soltos.find(acesso.tokenValido) || soltos[0] || '';
    const novoServidor = limpar(kv.servidor || kv.TRILHA_202_SERVIDOR).replace(/\/+$/, '');
    if (!nome) falhar(`falta o primeiro nome do aluno. ${uso}`);
    const chave = novoToken || acesso.token();
    if (!chave) falhar(`falta o token. Ele vem na linha TRILHA_202_TOKEN=... que a 202 mandou ao aluno. ${uso}`);
    if (!acesso.tokenValido(chave)) falhar('isso não tem forma de token da 202. Passe só o que vem depois de TRILHA_202_TOKEN=, inteiro, sem espaço e sem aspas. Se foi isso que ele colou, o token veio cortado: peça que copie de novo.');
    if (novoServidor && !acesso.servidorValido(novoServidor)) falhar('servidor precisa ser a URL que veio em TRILHA_202_SERVIDOR=..., começando com https://.');
    const destino = novoServidor || acesso.servidor();
    if (!destino) falhar(`falta o endereço da 202. Ele vem na outra linha que a 202 mandou, TRILHA_202_SERVIDOR=...: passe como servidor=<url>. ${uso}`);

    e.aluno.nome = nome;
    estadoLib.salvar(e);
    // O evento sobe junto com o que já estava na fila, e é esse envio que confere o
    // token: o CRM responde 401 a um token que não emitiu antes de ler o corpo.
    const ev = fila.enfileirar('acesso.conexao', { nome }, e);
    const r = await enviar({ timeoutMs: 5000, estado: e, token: chave, url: destino });
    if (r.status === 401) {
      fila.remover([ev.id]);
      falhar('a 202 recusou este token: ele não existe, foi revogado ou a turma foi encerrada. Confira com o aluno se ele colou a linha inteira; se colou, o acesso novo é com a 202. A sala continua fechada.');
    }
    if (novoToken || novoServidor) acesso.guardar({ token: novoToken, servidor: novoServidor });
    const e2 = estadoLib.carregar();
    e2.acesso = { conectado_em: agora(), verificado_em: r.ok ? agora() : null };
    // Se o aluno já falou nesta sessão (a que pediu o token), a aula abre agora,
    // aqui mesmo, com o `aula.inicio` na hora certa.
    if (e2.sessao_atual && e2.sessao_atual.contada === true) estadoLib.abrirAula(e2, e2.sessao_atual.aula);
    estadoLib.salvar(e2);
    console.log(r.ok
      ? `Conectado à 202 como ${nome}. Token conferido pelo servidor.`
      : `Conectado como ${nome}, mas a 202 não respondeu agora (${r.motivo}). A sala abre mesmo assim: o token é conferido no próximo envio, e se a 202 recusar, a sessão seguinte pede outro. Não comente a falha com o aluno.`);
    console.log('\n' + resumo(e2));
  },

  oficina([caminho]) {
    exigirAcesso();
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
    exigirAcesso();
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
    exigirAcesso();
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

  // A nota não se forma no chat do aluno. Este comando não recebe JSON nenhum: ele
  // lê a transcrição da sessão e chama um segundo Claude, que não deu a aula, para
  // avaliá-la (lib/avaliador.js). O tutor dispara e recebe "registrada" — ele não
  // tem a nota, então não tem como deixá-la escapar no raciocínio ou numa
  // ferramenta. Demora de meio minuto a um minuto, e é o último passo da aula.
  avaliar([idAula]) {
    exigirAcesso();
    if (!idAula) falhar('Uso: avaliar <aula>');
    const aulaAv = mapa.aula(idAula);
    // A unidade que não ensina matéria não é avaliada, e a porta fecha aqui também:
    // avaliação de conversa de combinado é ruído para a 202.
    if (aulaAv.tipo === 'quiz') falhar(`o ${idAula} não tem avaliação de fim de aula: o que sobe é a resposta de cada pergunta. Feche com a memória do aluno e \`concluir ${idAula}\`.`);
    if (aulaAv.avaliacao === false) falhar(`a aula ${idAula} não tem avaliação: ela é combinado, não matéria. Feche com o que ficou de pé e a próxima aula.`);
    const e = estadoLib.carregar();
    const reg = estadoLib.registroAula(e, idAula);

    const t = transcricao.ler(e, idAula);
    if (!t.ok) return desistir(e, reg, idAula, t.motivo);

    const r = avaliador.avaliar({
      contexto: contextoDaAula(e, aulaAv, reg),
      transcricao: t.texto,
      validar: (av) => validarAvaliacao(av, idAula),
    });
    if (!r.ok) return desistir(e, reg, idAula, r.motivo, r.uso);

    // O payload vai codificado. Não é segredo, é atrito: o aluno vê feedback, não nota.
    const b64 = Buffer.from(JSON.stringify(r.avaliacao), 'utf8').toString('base64');
    // Reavaliar depois do concluir é legítimo (o aluno volta a discutir depois do
    // fechamento). Vale a última; o servidor precisa saber que esta substitui.
    const revisao = reg.avaliada_em ? { revisao: true, substitui_de: reg.avaliada_em } : {};
    fila.enfileirar('avaliacao', { aula: idAula, codificado: 'base64', payload: b64, avaliador: r.uso, ...revisao }, e);
    reg.avaliada_em = agora();
    delete reg.avaliacao_falhou;
    estadoLib.salvar(e);
    console.log(`Avaliação da aula ${idAula} registrada e enfileirada.`);
  },

  concluir([idAula]) {
    exigirAcesso();
    if (!idAula) falhar('Uso: concluir <aula>');
    const a = mapa.aula(idAula);
    const e = estadoLib.carregar();
    const reg = estadoLib.registroAula(e, idAula);
    if (reg.status === 'concluida') falhar(`aula ${idAula} já concluída em ${reg.concluida_em}.`);
    const problemas = [];
    const avisos = [];
    if (a.tipo === 'quiz') {
      // O quiz não tem milestones: fecha com todas as perguntas respondidas.
      let banco = null;
      try { banco = quizLib.carregar(idAula); } catch { /* sem banco */ }
      if (!banco) problemas.push('banco do quiz não encontrado nesta cópia do harness');
      else if (!quizLib.completo(banco, reg)) problemas.push(`perguntas respondidas: ${quizLib.respondidas(reg)} de ${banco.questoes.length}. O quiz fecha com todas (\`quiz ${idAula}\` imprime a da vez).`);
    } else if (!Array.isArray(a.milestones) || !a.milestones.length) problemas.push('aula sem ementa no mapa');
    else {
      const pend = a.milestones.filter((x) => !reg.milestones[x.id]);
      if (pend.length) problemas.push(`milestones pendentes: ${pend.map((x) => x.id).join(', ')}`);
    }
    if (a.fluencia && !reg.fluencia) problemas.push('fluência não registrada');
    if (a.fluencia && reg.fluencia && !reg.fluencia.passou) problemas.push('fluência registrada como não passou; a aula só fecha com transferência');
    if (a.tipo === 'pratica') {
      // Prática não tem avaliação: ela fecha com o artefato registrado, que é o que
      // as fluências das aulas seguintes vão usar.
      const p = e.praticas[idAula] || {};
      if (!p.pasta) problemas.push(`prática sem pasta registrada (pratica ${idAula} pasta=<caminho>)`);
      if (a.correcao) {
        if (!p.url) problemas.push(`prática sem URL da página no ar (pratica ${idAula} url=...)`);
        if (!p.repo) problemas.push(`prática sem repositório público (pratica ${idAula} repo=...)`);
        if (!p.corrigida_em) problemas.push('correção não registrada (skill corrigir, em chat separado do da prática)');
      }
    } else if (a.avaliacao !== false && !reg.avaliada_em) {
      // "avaliacao": false é para a unidade que não ensina matéria (a 0.1, que é
      // combinado): não há o que avaliar, e uma avaliação de nada é ruído para a 202.
      // Avaliação que o `avaliar` tentou e não conseguiu não segura a aula: o aluno
      // fez o trabalho dele, a falha é do harness, e ela já virou evento para a 202.
      if (reg.avaliacao_falhou) avisos.push(`esta aula fecha sem avaliação (${reg.avaliacao_falhou.motivo}); a 202 já foi avisada`);
      else problemas.push(`avaliação de fim de aula não registrada (rode \`avaliar ${idAula}\`)`);
    }
    if (problemas.length) falhar(`não dá para concluir a aula ${idAula}:\n  - ${problemas.join('\n  - ')}`);

    reg.status = 'concluida';
    reg.concluida_em = agora();
    // Quem fecha um aprofundamento volta para o tronco de onde saiu, que é a
    // primeira aula de tronco ainda não concluída; `proxima` daria a seguinte no mapa.
    const prox = a.tronco === false
      ? mapa.todas().find((x) => x.tronco !== false && (e.aulas[x.id] || {}).status !== 'concluida') || null
      : mapa.proxima(idAula);
    if (e.aula_atual === idAula && prox) e.aula_atual = prox.id;
    estadoLib.salvar(e);
    fila.enfileirar('aula.conclusao', { aula: idAula, proxima: prox ? prox.id : null, minutos_em_aula: minutosNaAula(e, idAula) }, e);
    console.log(`${a.tipo === 'pratica' ? 'Prática' : a.tipo === 'quiz' ? 'Quiz' : 'Aula'} ${idAula} concluída.` + (prox ? ` Próxima: ${prox.id} ${prox.titulo}. Ela abre em um chat novo.` : ' Era a última do mapa.')
      + (avisos.length ? `\n(${avisos.join('; ')}. Não comente com o aluno.)` : ''));
  },

  pratica([idPratica, ...resto]) {
    exigirAcesso();
    if (!idPratica) falhar('Uso: pratica <id> pasta=<caminho> [url=...] [repo=...]');
    const a = mapa.aula(idPratica);
    if (a.tipo !== 'pratica') falhar(`${idPratica} não é prática.`);
    const kv = parChaveValor(resto);
    // Prática corrigida entrega três coisas: onde ela mora na máquina, onde ela
    // está no ar e o repositório público. Sem as duas URLs o corretor não tem o
    // que abrir, e a 202 não tem como conferir nada depois.
    if (kv.repo && !/^https:\/\/github\.com\/[^/\s]+\/[^/\s]+/.test(kv.repo)) falhar('repo precisa ser a URL do repositório no GitHub (https://github.com/usuario/projeto).');
    // Chamar sem argumento gravava um registro vazio e ninguém percebia. A pasta é
    // o dado que oito fluências do módulo dependem: sem ela, não há registro.
    const anterior = (estadoLib.carregar().praticas || {})[idPratica] || {};
    if (!kv.pasta && !anterior.pasta) falhar(`informe onde a prática mora: pratica ${idPratica} pasta=<caminho> [url=...]`);
    if (kv.pasta) {
      const abs = path.resolve(kv.pasta);
      if (!fs.existsSync(abs)) falhar(`pasta não existe: ${abs}`);
      kv.pasta = abs;
    }
    if (kv.url && !/^https?:\/\//.test(kv.url)) falhar('url precisa começar com http:// ou https://. Se a página ainda não está no ar, registre só a pasta.');
    const e = estadoLib.carregar();
    e.praticas[idPratica] = { ...(e.praticas[idPratica] || {}), ...kv, registrada_em: agora() };
    estadoLib.salvar(e);
    fila.enfileirar('pratica.registro', { aula: idPratica, ...kv }, e);
    console.log(`Prática ${idPratica} registrada: ${JSON.stringify(kv)}`);
  },

  criterios([idPratica]) {
    exigirAcesso();
    if (!idPratica) falhar('Uso: criterios <pratica>');
    const a = mapa.aula(idPratica);
    if (a.tipo !== 'pratica' || !a.correcao) falhar(`${idPratica} não é uma prática com correção.`);
    const e = estadoLib.carregar();
    const p = e.praticas[idPratica] || {};
    // O portão dos critérios é a entrega, não um segredo. Antes de entregar, a
    // régua fechada é o que faz a prática valer alguma coisa; depois de entregar,
    // saber por que a nota saiu assim é o próprio aprendizado. Quem abrir isto
    // fora de hora deixa registro, e é assim que a 202 lê.
    if (!p.pasta || !p.url) falhar(`os critérios da ${idPratica} abrem depois da entrega registrada. Rode primeiro: pratica ${idPratica} pasta=<caminho> url=<url> repo=<url>`);
    const arquivo = path.join(paths.PRATICAS, idPratica.toLowerCase(), 'criterios');
    let texto;
    try { texto = Buffer.from(fs.readFileSync(arquivo, 'utf8'), 'base64').toString('utf8'); } catch (err) {
      falhar(`não consegui ler os critérios da ${idPratica} (${err.message}). Corrija pelo brief e pelo que as aulas do módulo ensinaram, e diga isso na justificativa.`);
    }
    fila.enfileirar('criterios.abertos', { aula: idPratica }, e);
    console.log(texto);
  },

  corrigir([idPratica, arquivo]) {
    exigirAcesso();
    if (!idPratica || !arquivo) falhar('Uso: corrigir <pratica> <arquivo.json>');
    const a = mapa.aula(idPratica);
    if (a.tipo !== 'pratica' || !a.correcao) falhar(`${idPratica} não é uma prática com correção.`);
    const e = estadoLib.carregar();
    const p = e.praticas[idPratica];
    if (!p || !p.pasta) falhar(`não há entrega registrada da ${idPratica}. Corrigir o que não foi entregue não faz sentido.`);
    let c;
    try { c = JSON.parse(fs.readFileSync(arquivo, 'utf8')); } catch (err) { falhar(`não consegui ler ${arquivo}: ${err.message}`); }
    const erros = validarCorrecao(c, idPratica);
    if (erros.length) falhar('correção inválida:\n  - ' + erros.join('\n  - '));
    const b64 = Buffer.from(JSON.stringify(c), 'utf8').toString('base64');
    // Mesma regra da avaliação de aula: recorrigir é legítimo e vale a última.
    const revisao = p.corrigida_em ? { revisao: true, substitui_de: p.corrigida_em } : {};
    fila.enfileirar('pratica.correcao', { aula: idPratica, codificado: 'base64', payload: b64, ...revisao }, e);
    p.corrigida_em = agora();
    estadoLib.salvar(e);
    try { fs.unlinkSync(arquivo); } catch { /* já foi */ }
    console.log(`Correção da ${idPratica} registrada e enfileirada. Arquivo temporário removido. Agora dê o feedback ao aluno, com as suas palavras, e feche com \`concluir ${idPratica}\`.`);
  },

  // O quiz de módulo. `quiz Q1` imprime a pergunta da vez, sem gabarito.
  // `quiz Q1 responder <n> <letra>` grava a resposta e só então imprime a
  // correção, já com a pergunta seguinte. Para as abertas, `responder <n>
  // arquivo=<txt>` (o texto do aluno, em trilha/tmp) ou `texto="..."` grava o
  // que ele escreveu e devolve a régua ao tutor. Ordem fixa, uma de cada vez,
  // sem refazer: o que sobe é sempre a primeira resposta.
  quiz([idQuiz, sub, ...resto]) {
    exigirAcesso();
    const uso = 'Uso: quiz <Q> | quiz <Q> responder <n> <letra | arquivo=<txt> | texto="...">';
    if (!idQuiz) falhar(uso);
    const a = mapa.aula(idQuiz);
    if (a.tipo !== 'quiz') falhar(`${idQuiz} não é quiz.`);
    if (!quizLib.bancoExiste(idQuiz)) falhar(`o banco do ${idQuiz} não existe nesta cópia do harness.`);
    let banco;
    try { banco = quizLib.carregar(idQuiz); } catch (err) { falhar(`não consegui ler o banco do ${idQuiz}: ${err.message}`); }
    const e = estadoLib.carregar();
    const reg = estadoLib.registroAula(e, idQuiz);
    const q = quizLib.registro(reg);
    if (reg.status === 'concluida') falhar(`o ${idQuiz} já foi concluído.`);

    if (!sub || sub === 'proxima') {
      if (reg.status === 'nao_iniciada') { reg.status = 'em_andamento'; reg.iniciada_em = agora(); }
      const primeira = !q.iniciado_em;
      if (primeira) q.iniciado_em = agora();
      estadoLib.salvar(e);
      if (primeira) fila.enfileirar('quiz.inicio', { aula: idQuiz, questoes: banco.questoes.length }, e);
      const prox = quizLib.proximaPendente(banco, reg);
      console.log(prox ? quizLib.formatarPergunta(banco, prox) : fimDoQuiz(banco, reg, idQuiz));
      return;
    }
    if (sub !== 'responder') falhar(uso);

    const n = parseInt(resto[0], 10);
    const prox = quizLib.proximaPendente(banco, reg);
    if (!prox) falhar(`todas as ${banco.questoes.length} perguntas do ${idQuiz} já foram respondidas. Feche com a memória do aluno e \`concluir ${idQuiz}\`.`);
    if (!Number.isInteger(n)) falhar(uso);
    if (q.respostas[String(n)]) falhar(`a pergunta ${n} já foi respondida, e não há refazer: o que vale é a primeira resposta. A pergunta da vez é a ${prox.n}.`);
    if (n !== prox.n) falhar(`a pergunta da vez é a ${prox.n}, não a ${n}. Uma de cada vez, na ordem: \`quiz ${idQuiz}\` imprime a da vez.`);
    const questao = prox;
    const kv = parChaveValor(resto.slice(1));

    if (questao.tipo === 'fechada') {
      const letra = String(resto[1] || '').trim().toLowerCase().replace(/[).]+$/, '');
      if (!quizLib.LETRAS.includes(letra)) falhar('resposta de fechada é uma letra: a, b, c ou d. Se o aluno não deu uma letra clara, pergunte de novo antes de registrar; não escolha por ele.');
      const correta = letra === questao.gabarito;
      // Grava antes de mostrar: a correção só existe para resposta registrada.
      q.respostas[String(n)] = { alternativa: letra, correta, ts: agora() };
      estadoLib.salvar(e);
      fila.enfileirar('quiz.resposta', { aula: idQuiz, questao: n, tipo: 'fechada', aulas: questao.aulas, categoria: questao.categoria, alternativa: letra, gabarito: questao.gabarito, correta }, e);
      console.log(quizLib.formatarCorrecao(questao, letra));
    } else {
      let texto = kv.texto;
      if (kv.arquivo) {
        try { texto = fs.readFileSync(path.resolve(kv.arquivo), 'utf8'); } catch (err) { falhar(`não consegui ler ${kv.arquivo}: ${err.message}`); }
      }
      texto = String(texto || '').trim();
      if (!texto) falhar('a resposta da aberta é o que o aluno escreveu, inteira e com as palavras dele: grave em trilha/tmp e passe arquivo=<txt>, ou texto="..." se for curta.');
      q.respostas[String(n)] = { texto_caracteres: texto.length, ts: agora() };
      estadoLib.salvar(e);
      fila.enfileirar('quiz.resposta', { aula: idQuiz, questao: n, tipo: 'aberta', aulas: questao.aulas, texto }, e);
      if (kv.arquivo) { try { fs.unlinkSync(path.resolve(kv.arquivo)); } catch { /* já foi */ } }
      console.log(`Resposta da pergunta ${n} registrada (${texto.length} caracteres).`);
      console.log(quizLib.formatarRegua(questao));
    }

    const seguinte = quizLib.proximaPendente(banco, reg);
    console.log('');
    if (seguinte) {
      console.log(quizLib.formatarPergunta(banco, seguinte));
    } else {
      q.completo_em = agora();
      estadoLib.salvar(e);
      const r = quizLib.resumoFinal(banco, reg);
      fila.enfileirar('quiz.completo', { aula: idQuiz, acertos: r.acertos, total_fechadas: r.total_fechadas, erradas: r.erradas, revisitar: r.revisitar }, e);
      console.log(fimDoQuiz(banco, reg, idQuiz));
    }
  },

  nota([chave, ...resto]) {
    if (chave === '--listar' || (!chave && !resto.length)) {
      const lista = notas.ler();
      if (!lista.length) return console.log('Nenhuma nota sobre o aluno ainda.');
      for (const n of lista) console.log(`${n.chave} [${n.origem}]\n  ${n.texto}\n`);
      return console.log(`${lista.length} de ${notas.TETO} notas.`);
    }
    if (!chave) falhar('Uso: nota <chave> "<texto>" | nota <chave> --apagar | nota --listar');
    exigirAcesso();
    if (resto[0] === '--apagar') {
      const { total } = notas.apagar(chave);
      return console.log(`Nota "${chave}" apagada. Restam ${total} de ${notas.TETO}.`);
    }
    const texto = resto.join(' ');
    if (!texto) falhar(`Uso: nota ${chave} "<texto>" — a observação e o que você vai fazer por causa dela.`);
    const e = estadoLib.carregar();
    // A nota se escreve no fechamento, quando `concluir` já avançou aula_atual:
    // a etiqueta é a aula desta sessão, não a próxima, que o aluno nem começou.
    const aula = (e.sessao_atual && e.sessao_atual.aula) || e.aula_atual;
    const { acao, total } = notas.definir(chave, texto, aula, agora());
    console.log(`Nota "${chave}" ${acao}. ${total} de ${notas.TETO} notas. Ela fica em trilha/aluno.md e não sobe para a 202.`);
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
    // Comando dev manipula o estado por fora da conversa: apagar a fila, saltar
    // para outra aula, fechar milestone sem ter tratado o bloco. O servidor
    // precisa saber que isso aconteceu, senão lê o estado resultante como aula
    // dada. Cada subcomando enfileira dev.<sub> ao terminar. Fica de fora só
    // `referencias`, que gera conteúdo e não toca em nada do aluno.
    let anotar = null;
    if (sub === 'reset') {
      // Zerar com aula acontecendo apaga o trabalho de alguém no meio. Só com --forcar.
      // Sessão sem sinal de vida há mais de MINUTOS_VIVA está morta, não aberta: quem
      // fecha o terminal na marra (o TESTE.md manda fazer isso) deixa uma pendurada, e
      // uma trava que dispara sempre vira --forcar por hábito, que é não ter trava.
      // Sessão sem turno nenhum é janela aberta, não aula: não segura o reset.
      const s = e.sessao_atual && e.sessao_atual.contada !== false ? e.sessao_atual : null;
      const paradaHa = s ? minutosEntre(s.ultima_atividade || s.inicio, agora()) : Infinity;
      if (s && paradaHa < MINUTOS_VIVA && !resto.includes('--forcar')) {
        falhar(`há uma aula acontecendo agora (${s.aula}, ativa ${relativo(s.ultima_atividade || s.inicio)}). Feche o chat antes, ou rode "dev reset --forcar" se tiver certeza.`);
      }
      const antes = { aluno: e.aluno.email, aula: e.aula_atual, sessoes: e.sessoes.length };
      for (const f of [paths.ESTADO, paths.FILA, paths.ALUNO]) { try { fs.unlinkSync(f); } catch { /* ok */ } }
      fs.rmSync(paths.TMP, { recursive: true, force: true });
      estadoLib.carregar();
      // Depois do apagão, senão o evento morre junto com a fila que ele denuncia.
      anotar = { estado: estadoLib.carregar(), dados: { apagou: antes } };
      console.log('Estado e fila zerados.');
    } else if (sub === 'ir') {
      const a = mapa.aula(resto[0]);
      anotar = { dados: { de: e.aula_atual, para: a.id } };
      e.aula_atual = a.id;
      estadoLib.salvar(e);
      console.log(`Aula atual: ${a.id} ${a.titulo}`);
    } else if (sub === 'fila') {
      const eventos = fila.ler();
      for (const ev of eventos) console.log(`${ev.ts}  ${ev.tipo.padEnd(20)} ${ev.aula || ''}  ${JSON.stringify(ev.dados).slice(0, 100)}`);
      anotar = { dados: { eventos: eventos.length } };
    } else if (sub === 'avaliacoes') {
      // Decodifica as avaliações ainda na fila local. Se o mock já consumiu, elas apareceram no terminal dele.
      const avs = fila.ler().filter((ev) => ev.tipo === 'avaliacao' || ev.tipo === 'pratica.correcao');
      if (!avs.length) console.log('Nenhuma avaliação nem correção na fila local.');
      for (const ev of avs) {
        const rotulo = ev.tipo === 'avaliacao' ? 'Avaliação da aula' : 'Correção da prática';
        console.log(`\n=== ${rotulo} ${ev.aula || ev.dados.aula} (${ev.ts}) ===`);
        console.log(JSON.stringify(JSON.parse(Buffer.from(ev.dados.payload, 'base64').toString('utf8')), null, 2));
      }
      anotar = { dados: { avaliacoes: avs.map((ev) => ev.aula || ev.dados.aula) } };
    } else if (sub === 'referencias') {
      // Gera o REFERENCIAS.md da raiz a partir dos referencias.md das aulas.
      // É comando de quem escreve conteúdo, não do aluno nem do tutor.
      const { arquivo, lista } = referencias.gerar();
      const total = lista.reduce((t, x) => t + x.itens.length, 0);
      console.log(`${path.relative(paths.RAIZ, arquivo)} gerado: ${total} item(ns) de ${lista.filter((x) => x.itens.length).length} aula(s).`);
      for (const x of lista) {
        if (!x.itens.length) console.log(`  aviso: ${path.relative(paths.RAIZ, x.arquivo)} não rendeu nenhum item; confira o formato do bullet de três linhas.`);
      }
    } else if (sub === 'fechar-tudo') {
      // Atalho de teste: fecha milestones e fluência de uma aula sem passar pela conversa.
      const a = mapa.aula(resto[0]);
      const reg = estadoLib.registroAula(e, a.id);
      if (reg.status === 'nao_iniciada') { reg.status = 'em_andamento'; reg.iniciada_em = agora(); }
      for (const m of a.milestones || []) reg.milestones[m.id] = reg.milestones[m.id] || agora();
      if (a.fluencia) reg.fluencia = { passou: true, tentativas: 1, registrada_em: agora() };
      if (a.tipo === 'quiz') {
        // Responde tudo com o gabarito, marcado como teste: nada disso é resposta de aluno.
        const banco = quizLib.carregar(a.id);
        const q = quizLib.registro(reg);
        for (const x of banco.questoes) q.respostas[String(x.n)] = q.respostas[String(x.n)] || (x.tipo === 'fechada' ? { alternativa: x.gabarito, correta: true, ts: agora(), teste: true } : { texto_caracteres: 0, ts: agora(), teste: true });
        q.iniciado_em = q.iniciado_em || agora();
        q.completo_em = agora();
      }
      estadoLib.salvar(e);
      anotar = { dados: { aula: a.id, milestones: (a.milestones || []).map((m) => m.id), fluencia: Boolean(a.fluencia) } };
      console.log(`Milestones e fluência da ${a.id} marcados (teste). Falta só a avaliação.`);
    } else if (sub === 'desconectar') {
      // O `dev reset` zera a sala mas deixa o token na máquina, e a sessão seguinte
      // pede só o nome. Para ver o pedido de token de novo, é este.
      acesso.apagar();
      anotar = { dados: { tinha_acesso: Boolean(e.acesso) } };
      delete e.acesso;
      estadoLib.salvar(e);
      console.log('Acesso à 202 removido desta sala e desta máquina. A próxima sessão pede nome e token.' + (process.env.TRILHA_202_TOKEN ? ' A variável TRILHA_202_TOKEN continua definida neste terminal.' : ''));
    } else {
      falhar('Uso: dev reset [--forcar] | dev ir <aula> | dev fila | dev avaliacoes | dev referencias | dev fechar-tudo <aula> | dev desconectar');
    }
    if (anotar) fila.enfileirar(`dev.${sub}`, anotar.dados, anotar.estado || e);
  },
};

// O contexto que o avaliador não tem como deduzir da transcrição: qual unidade
// é esta, o que ela se propunha a cobrir e o que ficou registrado como fato.
function contextoDaAula(e, a, reg) {
  const fechados = (a.milestones || []).map((m) => `${reg.milestones[m.id] ? 'fechado' : 'PENDENTE'} — ${m.id}: ${m.titulo}`);
  const fluencia = !a.fluencia
    ? 'Esta aula não tem teste de fluência (o campo "fluencia" da avaliação vai como null).'
    : reg.fluencia
      ? `Fluência registrada: ${reg.fluencia.passou ? 'passou' : 'não passou'} em ${reg.fluencia.tentativas} tentativa(s).`
      : 'Esta aula tem teste de fluência, mas ele não chegou a ser registrado.';
  return [
    `- Unidade: ${a.id} — ${a.titulo}`,
    a.objetivo ? `- Objetivo: ${a.objetivo}` : null,
    `- Marcos da aula:\n    ${fechados.join('\n    ')}`,
    `- ${fluencia}`,
    `- Sessões que o aluno já gastou nesta unidade: ${reg.sessoes || 1}.`,
  ].filter(Boolean).join('\n');
}

// Avaliação que não sai não trava a aula: essa é a regra da casa. Fica o registro
// do motivo, o `concluir` passa com aviso, e a 202 sabe que aquela aula não tem
// nota e por quê. O tutor lê um recado que não o convida a contornar nada.
function desistir(e, reg, idAula, motivo, uso) {
  reg.avaliacao_falhou = { em: agora(), motivo };
  estadoLib.salvar(e);
  fila.enfileirar('avaliacao.falhou', { aula: idAula, motivo, avaliador: uso || null }, e);
  console.log(`Não consegui avaliar a aula ${idAula}: ${motivo}. Isso já foi registrado e a 202 foi avisada. Feche a aula normalmente com \`concluir ${idAula}\`; não há nada que você possa fazer daqui, e não é assunto para o aluno.`);
}

function minutosNaAula(e, idAula) {
  // A conclusão acontece com a sessão ainda aberta; sem contar sessao_atual o total sai zero.
  const fechadas = e.sessoes.filter((s) => s.aula === idAula).reduce((t, s) => t + (s.minutos || 0), 0);
  const s = e.sessao_atual;
  const aberta = s && s.aula === idAula ? Math.max(0, minutosEntre(s.inicio, s.ultima_atividade || agora())) : 0;
  return fechadas + aberta;
}

function validarCorrecao(c, idPratica) {
  const erros = [];
  if (!c || typeof c !== 'object') return ['não é um objeto JSON'];
  if (c.pratica !== idPratica) erros.push(`campo "pratica" deve ser "${idPratica}"`);
  for (const k of ['entrega', 'conversao', 'fidelidade', 'execucao', 'metodo']) {
    const v = c.criterios ? c.criterios[k] : undefined;
    if (!Number.isInteger(v) || v < 1 || v > 5) erros.push(`criterios.${k} deve ser inteiro de 1 a 5`);
  }
  if (typeof c.justificativa !== 'string' || c.justificativa.length < 200 || c.justificativa.length > 2000) erros.push('"justificativa" entre 200 e 2000 caracteres: o que sustenta cada nota fora da média');
  if (!Array.isArray(c.evidencias) || c.evidencias.length < 2 || c.evidencias.length > 5) erros.push('"evidencias" deve ter de 2 a 5 trechos do que ele entregou');
  else for (const ev of c.evidencias) if (typeof ev !== 'string' || ev.length > 300) erros.push('cada evidência é um trecho curto (máximo 300 caracteres)');
  if (typeof c.feedback_aluno !== 'string' || c.feedback_aluno.length < 300 || c.feedback_aluno.length > 3000) erros.push('"feedback_aluno" entre 300 e 3000 caracteres: é o que ele recebe, sem nota');
  if (typeof c.resumo_qualitativo !== 'string' || c.resumo_qualitativo.length < 40 || c.resumo_qualitativo.length > 400) erros.push('"resumo_qualitativo" entre 40 e 400 caracteres');
  if (c.suspeita !== null && c.suspeita !== undefined) {
    if (typeof c.suspeita.descricao !== 'string' || typeof c.suspeita.evidencia !== 'string') erros.push('suspeita precisa de "descricao" e "evidencia"');
  }
  return erros;
}

// O fechamento do quiz, para o tutor: o que ficou para revisitar não é placar.
function fimDoQuiz(banco, reg, idQuiz) {
  const r = quizLib.resumoFinal(banco, reg);
  return [
    `Quiz ${idQuiz} completo: as ${banco.questoes.length} perguntas têm resposta gravada.`,
    r.texto,
    'Isso não é nota e não se anuncia como placar: o aluno já viu cada correção. Diga, com as suas palavras, o que ficou para revisitar e por quê (a aula, e quando ela volta a ser necessária), e o que as abertas mostraram. Depois grave a memória do aluno — uma nota com a chave `revisitar-m1`, dizendo o que revisitar e o que você vai fazer com isso na próxima aula em que aparecer — e feche com `concluir ' + idQuiz + '`. Sem `avaliar`: o quiz não tem.',
  ].join('\n');
}

function validarAvaliacao(av, idAula) {
  const erros = [];
  if (!av || typeof av !== 'object') return ['não é um objeto JSON'];
  if (av.aula !== idAula) erros.push(`campo "aula" deve ser "${idAula}"`);
  const criterios = ['compreensao', 'pensamento', 'esforco', 'autonomia'];
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
    console.log(fs.readFileSync(__filename, 'utf8').split(/\r?\n/).filter((l) => l.startsWith('//   node')).map((l) => l.slice(3)).join('\n'));
    process.exit(comando ? 1 : 0);
  }
  try {
    await comandos[comando](args);
    // O que acabou de ir para a fila sobe agora, sem esperar hook. `nota` fica de
    // fora porque não sobe (a memória do aluno é local), e `dev` é de quem testa.
    if (SOBEM_NA_HORA.has(comando)) await enviarAgora();
  } catch (err) {
    falhar(err.message);
  }
})();
