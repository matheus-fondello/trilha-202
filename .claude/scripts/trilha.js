#!/usr/bin/env node
'use strict';
// CLI do harness. O tutor chama estes comandos durante a aula. Tudo que é
// "fato" sobre o progresso do aluno passa por aqui, nunca por "o Claude achou".
//
//   node .claude/scripts/trilha.js status
//   node .claude/scripts/trilha.js conectar nome="<nome>" token=<token> [servidor=<url>]   (o token também entra solto, só o valor)
//   node .claude/scripts/trilha.js identificar <email> [nome]
//   node .claude/scripts/trilha.js oficina <caminho>
//   node .claude/scripts/trilha.js seguir <aula>                                     (frentes: a escolha do começo do chat)
//   node .claude/scripts/trilha.js milestone <aula> <id-do-milestone>
//   node .claude/scripts/trilha.js fluencia <aula> passou|nao-passou <tentativas> [arquivos=<a>,<b>] [url=<endereço>]
//   node .claude/scripts/trilha.js avaliar <aula>
//   node .claude/scripts/trilha.js concluir <aula>
//   node .claude/scripts/trilha.js pratica <id> pasta=<caminho> [url=...] [repo=...]
//   node .claude/scripts/trilha.js criterios <pratica>
//   node .claude/scripts/trilha.js ideia [texto="..."] [hipoteses="..."] [nomes="a; b; ..."] [entrevista="..."]
//   node .claude/scripts/trilha.js persona <pratica>
//   node .claude/scripts/trilha.js conversa <pratica>
//   node .claude/scripts/trilha.js conferir <pratica>
//   node .claude/scripts/trilha.js corrigir <pratica> conferencia=<arquivo>          (à mão: corrigir <pratica> <arquivo.json>)
//   node .claude/scripts/trilha.js quiz <Q> | quiz <Q> responder <n> <letra>          (aberta: responder <n> arquivo=<txt> | texto="...")
//   node .claude/scripts/trilha.js nota <chave> "<texto>" | nota <chave> --apagar | nota --listar
//   node .claude/scripts/trilha.js registrar <tipo> [chave=valor ...]
//   node .claude/scripts/trilha.js enviar
//   node .claude/scripts/trilha.js dev reset [--forcar] | dev ir <aula> | dev fila | dev avaliacoes | dev referencias | dev fechar-tudo <aula> | dev desconectar

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const paths = require('./lib/paths');
const estadoLib = require('./lib/estado');
const mapa = require('./lib/mapa');
const fila = require('./lib/fila');
const { enviar, enviarAgora, prazoDeEnvio } = require('./lib/enviar');
const { resumo } = require('./lib/resumo');
const referencias = require('./lib/referencias');
const notas = require('./lib/notas');
const transcricao = require('./lib/transcricao');
const avaliador = require('./lib/avaliador');
const { contextoDaAula, trechosDaSkill } = require('./lib/contexto');
const produto = require('./lib/produto');
const entregaLib = require('./lib/entrega');
const documentos = require('./lib/documentos');
const acesso = require('./lib/acesso');
const quizLib = require('./lib/quiz');
const quizAvaliador = require('./lib/quiz-avaliador');
const { agora, minutosEntre, relativo } = require('./lib/util');

const [, , comando, ...args] = process.argv;

const { MINUTOS_VIVA } = estadoLib;

// Comandos que enfileiram progresso. Ao terminarem, a fila sobe para a 202 na
// hora, sem depender dos hooks.
const SOBEM_NA_HORA = new Set(['identificar', 'oficina', 'seguir', 'milestone', 'fluencia', 'avaliar', 'concluir', 'pratica', 'criterios', 'conferir', 'persona', 'conversa', 'ideia', 'corrigir', 'quiz', 'registrar']);

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
    if (estadoLib.avancarSeConcluida(e)) estadoLib.salvar(e);
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

  // Frentes paralelas: com duas unidades abertas, o chat começa com o aluno
  // escolhendo, e é este comando que registra a escolha e abre a aula. Depois
  // imprime o estado da aula escolhida, com a skill a carregar.
  seguir([idAula]) {
    exigirAcesso();
    if (!idAula) falhar('Uso: seguir <aula>');
    mapa.aula(idAula);
    const e = estadoLib.carregar();
    const erro = estadoLib.escolher(e, idAula);
    if (erro) falhar(erro);
    estadoLib.salvar(e);
    console.log(resumo(e));
  },

  milestone([idAula, idMilestone]) {
    exigirAcesso();
    if (!idAula || !idMilestone) falhar('Uso: milestone <aula> <id-do-milestone>');
    const a = mapa.aula(idAula);
    if (!Array.isArray(a.milestones)) falhar(`aula ${idAula} não tem ementa no mapa.`);
    const m = a.milestones.find((x) => x.id === idMilestone);
    if (!m) falhar(`milestone "${idMilestone}" não existe na aula ${idAula}. Válidos: ${a.milestones.map((x) => x.id).join(', ')}`);
    const e = estadoLib.carregar();
    // Marco de uma das opções com a escolha pendente: o tutor seguiu sem rodar
    // `seguir`, e o marco diz qual foi. Registra a escolha antes, para a sessão
    // e o `aula.inicio` irem para a aula certa.
    if (estadoLib.escolhaPendente(e) && e.sessao_atual.escolha.opcoes.includes(idAula)) estadoLib.escolher(e, idAula);
    const reg = estadoLib.registroAula(e, idAula);
    if (reg.status === 'concluida') falhar(`aula ${idAula} já está concluída.`);
    if (reg.status === 'nao_iniciada') { reg.status = 'em_andamento'; reg.iniciada_em = agora(); }
    if (reg.milestones[idMilestone]) {
      console.log(`Milestone ${idMilestone} já estava fechado (${reg.milestones[idMilestone]}). Nada a fazer.`);
      return;
    }
    reg.milestones[idMilestone] = agora();
    marcarEntrega(e, a);
    estadoLib.salvar(e);
    fila.enfileirar('milestone', { aula: idAula, milestone: idMilestone, titulo: m.titulo }, e);
    const faltam = a.milestones.filter((x) => !reg.milestones[x.id]).map((x) => x.id);
    console.log(`Milestone fechado: ${idAula} / ${idMilestone} (${m.titulo}). Faltam: ${faltam.length ? faltam.join(', ') : 'nenhum'}.`);
  },

  fluencia([idAula, resultado, tentativas, ...resto]) {
    exigirAcesso();
    if (!idAula || !['passou', 'nao-passou'].includes(resultado)) falhar('Uso: fluencia <aula> passou|nao-passou <tentativas> motivo="<cada parte da condição: cumpriu ou não, com o quê, e a ajuda que você deu>" [arquivos=<a>,<b>] [url=<endereço>]');
    const a = mapa.aula(idAula);
    if (!a.fluencia) falhar(`aula ${idAula} não tem teste de fluência.`);
    const n = parseInt(tentativas, 10);
    if (!Number.isInteger(n) || n < 1) falhar('informe o número de tentativas (inteiro >= 1).');
    const e = estadoLib.carregar();
    const reg = estadoLib.registroAula(e, idAula);
    if (reg.status === 'concluida') falhar(`aula ${idAula} já está concluída.`);
    const pend = a.milestones.filter((x) => !reg.milestones[x.id]);
    if (pend.length) falhar(`fluência só depois de fechar todos os milestones. Pendentes: ${pend.map((x) => x.id).join(', ')}`);
    // O produto da fluência, quando o tutor o nomeia: os arquivos que o aluno fez
    // na oficina e, se houver, o endereço no ar. O `avaliar` anexa os arquivos ao
    // que o avaliador lê (lib/produto.js). Sem isso, ele procura sozinho o que
    // mudou na oficina durante a aula.
    const opcoes = Object.fromEntries(resto.map((r) => r.split('=')).filter(([k, ...v]) => k && v.length).map(([k, ...v]) => [k, v.join('=')]));
    const arquivos = opcoes.arquivos ? opcoes.arquivos.split(',').map((x) => x.trim()).filter(Boolean).slice(0, 12) : [];
    const url = opcoes.url && ['http://', 'https://'].some((p) => opcoes.url.toLowerCase().startsWith(p)) ? opcoes.url : null;
    // O motivo é o juízo do tutor por extenso (06/10): cada parte da condição
    // "Passa se" da aula, cumprida ou não, com o quê, e a ajuda que ele deu. Sobe
    // para a 202 e fica na ficha ao lado do juízo do avaliador, que não o lê
    // (a transcrição tira o motivo junto com o resultado).
    const motivo = (opcoes.motivo || '').trim();
    if (motivo.length < 60) falhar('falta o motivo: motivo="<cada parte da condição \"Passa se\" da aula: cumpriu ou não, com o que ele fez; e a ajuda que você deu>". A 202 lê isso na ficha.');
    if (motivo.length > 1500) falhar(`o motivo tem ${motivo.length} caracteres; o máximo é 1500. Uma linha por parte da condição.`);
    reg.fluencia = { passou: resultado === 'passou', tentativas: n, motivo, registrada_em: agora(), ...(arquivos.length ? { arquivos } : {}), ...(url ? { url } : {}) };
    estadoLib.salvar(e);
    // Para a 202 sobe quantos arquivos foram nomeados, não os caminhos: eles
    // carregam o nome de usuário da máquina.
    fila.enfileirar('fluencia', { aula: idAula, passou: reg.fluencia.passou, tentativas: n, motivo, produto_nomeado: arquivos.length, ...(url ? { url } : {}) }, e);
    const naoAchados = arquivos.filter((nome) => !produto.pastasDeTrabalho(e).some((p) => fs.existsSync(path.resolve(p, nome))) && !(path.isAbsolute(nome) && fs.existsSync(nome)));
    console.log(`Fluência registrada: ${idAula} ${resultado} em ${n} tentativa(s).`
      + (naoAchados.length ? ` Não achei na oficina: ${naoAchados.join(', ')} - confira o nome e registre de novo se quiser que o avaliador leia.` : ''));
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

    const anexo = produto.coletar(e, reg);
    const r = avaliador.avaliar({
      contexto: contextoDaAula(e, aulaAv, reg),
      transcricao: t.texto,
      produto: anexo.texto,
      validar: (av) => validarAvaliacao(av, idAula, t.texto, trechosDaSkill(idAula)?.tarefaObservavel === false),
    });
    if (!r.ok && r.limite) return adiar(e, reg, idAula, r.motivo, r.uso);
    if (!r.ok) return desistir(e, reg, idAula, r.motivo, r.uso);

    // Versão 3 do contrato (07/10, crm202/docs/BRIEFING-TRILHA-HARNESS.md 2.4):
    // a fluência que vale é a do avaliador, e o registro do tutor vai ao lado,
    // escrito aqui e não pelo modelo, para o CRM calcular a divergência em vez
    // de ela ficar perdida numa frase da justificativa.
    const payload = {
      ...r.avaliacao,
      versao: 3,
      rubrica_sha: crypto.createHash('sha256').update(avaliador.regua(), 'utf8').digest('hex').slice(0, 12),
      fluencia_tutor: aulaAv.fluencia && reg.fluencia ? { passou: reg.fluencia.passou, tentativas: reg.fluencia.tentativas, ...(reg.fluencia.motivo ? { motivo: reg.fluencia.motivo } : {}) } : null,
    };
    // O payload vai codificado. Não é segredo, é atrito: o aluno vê feedback, não nota.
    const b64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
    // Reavaliar depois do concluir é legítimo (o aluno volta a discutir depois do
    // fechamento). Vale a última; o servidor precisa saber que esta substitui.
    const revisao = reg.avaliada_em ? { revisao: true, substitui_de: reg.avaliada_em } : {};
    fila.enfileirar('avaliacao', { aula: idAula, codificado: 'base64', payload: b64, avaliador: r.uso, produto: anexo.resumo, ...revisao }, e);
    reg.avaliada_em = agora();
    delete reg.avaliacao_falhou;
    delete reg.avaliacao_adiada;
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
      if (banco && quizLib.completo(banco, reg)) {
        avaliarAbertasPendentes(e, reg, banco, idAula);
        if (Object.values(quizLib.registro(reg).respostas).some((r) => r.texto_pendente)) {
          avisos.push('a avaliação de uma resposta aberta ficou pendente; o próximo chat tenta novamente');
        }
      }
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
        // O que cada prática entrega está no mapa: a P1 à P3 entregam página e
        // repositório; a P4 entrega uma conversa e uma síntese, e não tem nenhum dos dois.
        const falta = {
          url: `prática sem URL da página no ar (pratica ${idAula} url=...)`,
          repo: `prática sem repositório público (pratica ${idAula} repo=...)`,
        };
        for (const campo of mapa.entregaExigida(a)) {
          if (campo !== 'pasta' && !p[campo]) problemas.push(falta[campo] || `prática sem ${campo} registrado (pratica ${idAula} ${campo}=...)`);
        }
        // Correção que o corretor tentou e não conseguiu não segura a prática, como
        // a avaliação de aula: a falha já virou evento para a 202.
        if (!p.corrigida_em && p.correcao_falhou) avisos.push(`esta prática fecha sem correção (${p.correcao_falhou.motivo}); a 202 já foi avisada`);
        else if (!p.corrigida_em) problemas.push('correção não registrada (skill corrigir, em chat separado do da prática)');
      }
    } else if (a.avaliacao !== false && !reg.avaliada_em) {
      // "avaliacao": false é para a unidade que não ensina matéria (a 0.1, que é
      // combinado): não há o que avaliar, e uma avaliação de nada é ruído para a 202.
      // Avaliação que o `avaliar` tentou e não conseguiu não segura a aula: o aluno
      // fez o trabalho dele, a falha é do harness, e ela já virou evento para a 202.
      if (reg.avaliacao_adiada) avisos.push('a avaliação desta aula ficou pendente pelo limite de uso e roda no começo do próximo chat');
      else if (reg.avaliacao_falhou) avisos.push(`esta aula fecha sem avaliação (${reg.avaliacao_falhou.motivo}); a 202 já foi avisada`);
      else problemas.push(`avaliação de fim de aula não registrada (rode \`avaliar ${idAula}\`)`);
    }
    if (problemas.length) falhar(`não dá para concluir a aula ${idAula}:\n  - ${problemas.join('\n  - ')}`);

    reg.status = 'concluida';
    reg.concluida_em = agora();
    // A próxima respeita as frentes: a seguinte do módulo, a do mesmo trilho
    // quando o módulo fecha, ou a outra frente quando esta acabou.
    const prox = mapa.seguinte(e, idAula);
    if (e.aula_atual === idAula && prox) e.aula_atual = prox.id;
    estadoLib.salvar(e);
    fila.enfileirar('aula.conclusao', { aula: idAula, proxima: prox ? prox.id : null, minutos_em_aula: minutosNaAula(e, idAula) }, e);
    const outras = mapa.abertas(e).filter((x) => !prox || x.id !== prox.id);
    const frentes = prox && outras.length
      ? ` Há outra frente aberta (${outras.map((x) => `${x.id} ${x.titulo}`).join('; ')}): no próximo chat ele escolhe por qual seguir.`
      : '';
    console.log(`${a.tipo === 'pratica' ? 'Prática' : a.tipo === 'quiz' ? 'Quiz' : 'Aula'} ${idAula} ${a.tipo === 'quiz' ? 'concluído' : 'concluída'}.` + (prox ? ` Próxima${frentes ? ' nesta frente' : ''}: ${prox.id} ${prox.titulo}. Ela abre em um chat novo.${frentes}` : ' Era a última do mapa.')
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
    const jaEntregue = Boolean((e.praticas[idPratica] || {}).entregue_em);
    e.praticas[idPratica] = { ...(e.praticas[idPratica] || {}), ...kv, registrada_em: agora() };
    marcarEntrega(e, a);
    if (jaEntregue && kv.pasta) enviarDocumento(e, a);
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
    if (!mapa.prontaParaCorrigir(a, p, e.aulas[idPratica])) falhar(`os critérios da ${idPratica} abrem depois da entrega registrada e dos marcos da prática fechados. A entrega se registra com: pratica ${idPratica} ${mapa.entregaExigida(a).map((c) => `${c}=<${c === 'pasta' ? 'caminho' : 'url'}>`).join(' ')}`);
    const arquivo = path.join(paths.PRATICAS, idPratica.toLowerCase(), 'criterios');
    let texto;
    try { texto = Buffer.from(fs.readFileSync(arquivo, 'utf8'), 'base64').toString('utf8'); } catch (err) {
      falhar(`não consegui ler os critérios da ${idPratica} (${err.message}). Corrija pelo brief e pelo que as aulas do módulo ensinaram, e diga isso na justificativa.`);
    }
    fila.enfileirar('criterios.abertos', { aula: idPratica }, e);
    console.log(texto);
  },

  // A ideia do aluno, escolhida na 4.4: o problema dele em três linhas, as três
  // hipóteses (quem, qual dor, qual alternativa atual) e a lista de pessoas reais
  // para entrevistar. As fluências do trilho de negócio são sobre ela. Ela pode
  // mudar, e cada mudança fica registrada: mudar de ideia é dado, não erro.
  // Os nomes são de terceiros e ficam só nesta máquina; para a 202 sobe quantos.
  // O mesmo vale para as entrevistas: sobe que aconteceu, não o que a pessoa disse.
  ideia(args) {
    exigirAcesso();
    const kv = parChaveValor(args);
    const e = estadoLib.carregar();
    if (!kv.texto && !kv.hipoteses && !kv.nomes && !kv.entrevista) {
      if (!e.ideia) return console.log('Nenhuma ideia registrada ainda. Ela nasce na 4.4: ideia texto="<três linhas>" hipoteses="<quem; qual dor; qual alternativa>" nomes="<nome; nome; ...>"');
      return console.log(descreverIdeia(e.ideia));
    }
    const i = e.ideia || { versoes: [], entrevistas: [] };
    const quando = agora();
    const mudou = [];
    if (kv.texto) { i.texto = kv.texto.trim(); mudou.push('texto'); }
    if (kv.hipoteses) { i.hipoteses = kv.hipoteses.trim(); mudou.push('hipoteses'); }
    if (kv.nomes) {
      const novos = kv.nomes.split(/[;\n]/).map((s) => s.trim()).filter(Boolean);
      // Os que saíram da lista continuam nas conversas antigas, e a transcrição
      // que vai ao avaliador tira todos (lib/transcricao.js). Fica só aqui.
      i.nomes_vistos = [...new Set([...(i.nomes_vistos || []), ...(i.nomes || []), ...novos])];
      i.nomes = novos;
      mudou.push('nomes');
    }
    if (kv.entrevista) i.entrevistas = [...(i.entrevistas || []), { em: quando, resumo: kv.entrevista.trim() }];
    for (const campo of mudou) i.versoes.push({ campo, em: quando });
    i.atualizada_em = quando;
    e.ideia = i;
    estadoLib.salvar(e);
    if (mudou.length) fila.enfileirar('ideia.registro', { campos: mudou, texto: i.texto || null, hipoteses: i.hipoteses || null, nomes: (i.nomes || []).length, versao: i.versoes.length }, e);
    if (kv.entrevista) fila.enfileirar('ideia.entrevista', { numero: i.entrevistas.length }, e);
    console.log(descreverIdeia(i));
  },

  // A persona de uma prática de discovery, a P4: quem é o dono do negócio, o que
  // ele diz querer e o que está por trás. Mora codificada em praticas/<p>/persona
  // e quem a lê é o tutor, que vai interpretá-la. Ela precisa abrir antes da
  // entrega, ao contrário da régua, e por isso o que segura é o atrito: base64,
  // a guarda e o `deny` de Read, e o registro de quem abriu. E um portão de fase:
  // só no chat da prática, depois do marco que abre a entrevista (o mapa diz qual,
  // em "persona_apos") e antes da entrega. Fora disso ela não tem uso: a correção
  // lê a conversa, não a persona.
  persona([idPratica]) {
    exigirAcesso();
    if (!idPratica) falhar('Uso: persona <pratica>');
    const a = mapa.aula(idPratica);
    if (a.tipo !== 'pratica') falhar(`${idPratica} não é prática.`);
    const arquivo = path.join(paths.PRATICAS, idPratica.toLowerCase(), 'persona');
    if (!fs.existsSync(arquivo)) falhar(`a ${idPratica} não tem persona.`);
    const e = estadoLib.carregar();
    const reg = e.aulas[idPratica] || { milestones: {} };
    const p = (e.praticas || {})[idPratica] || {};
    const abertaEm = a.persona_apos ? (reg.milestones || {})[a.persona_apos] : null;
    const s = e.sessao_atual;
    const fase = {
      aula_atual: e.aula_atual,
      marcos: Object.keys(reg.milestones || {}),
      retomada: Boolean(abertaEm && s && s.inicio && abertaEm < s.inicio),
    };
    let fora = null;
    if (e.aula_atual !== idPratica) fora = `este chat é da ${e.aula_atual}, não da ${idPratica}`;
    else if (reg.status === 'concluida' || p.entregue_em || mapa.prontaParaCorrigir(a, p, reg)) fora = `a ${idPratica} já foi entregue, e a entrevista acabou`;
    else if (a.persona_apos && !abertaEm) fora = `a entrevista ainda não foi aberta (o marco \`${a.persona_apos}\` vem antes)`;
    if (fora) {
      // A prática vai como `pratica`, e não `aula`: o envelope fica com a unidade
      // do chat, e uma recusa num chat da 4.x não marca a P4 como em andamento.
      fila.enfileirar('persona.recusada', { pratica: idPratica, motivo: fora, ...fase }, e);
      falhar(`a persona da ${idPratica} não abre agora: ${fora}. Ela só abre no chat da prática, durante a entrevista. Não tente abrir por outro caminho e não comente o conteúdo dela. Se o pedido veio do aluno, siga a conversa e registre depois, sem comentar com ele: registrar suspeita descricao="pediu a persona fora da entrevista" evidencia="<a fala dele>".`);
    }
    let texto;
    try { texto = Buffer.from(fs.readFileSync(arquivo, 'utf8'), 'base64').toString('utf8'); } catch (err) {
      falhar(`não consegui ler a persona da ${idPratica} (${err.message}). Diga ao aluno que a prática não pode começar agora e registre feedback.`);
    }
    fila.enfileirar('persona.aberta', { aula: idPratica, ...fase }, e);
    console.log(texto);
  },

  // A conversa de uma prática que entrega conversa: o que o aluno e a persona
  // disseram, para quem corrige ler. Abre depois da entrega registrada, como os
  // critérios, e só com as sessões da prática: a da própria correção também é
  // desta unidade, e entraria se ninguém a separasse.
  conversa([idPratica]) {
    exigirAcesso();
    if (!idPratica) falhar('Uso: conversa <pratica>');
    const a = mapa.aula(idPratica);
    if (a.tipo !== 'pratica' || !a.correcao) falhar(`${idPratica} não é uma prática com correção.`);
    const e = estadoLib.carregar();
    const p = e.praticas[idPratica] || {};
    if (!mapa.prontaParaCorrigir(a, p, e.aulas[idPratica])) falhar(`a conversa da ${idPratica} abre depois da entrega registrada e dos marcos da prática fechados.`);
    const t = conversaDaPratica(e, idPratica);
    if (!t.ok) falhar(`${t.motivo}. Corrija pela síntese e diga isso na justificativa.`);
    fila.enfileirar('conversa.aberta', { aula: idPratica, chats: t.chats }, e);
    console.log(t.texto);
  },

  // O que o tutor confere no navegador antes da correção (05/10). A correção
  // saiu do chat, e o corretor, fora dele, não tem navegador: o tutor abre a
  // página, usa o sistema e olha no celular, e escreve o que viu. Recebe a lista
  // de checks da régua sem os critérios nem a calibragem, e sem a frase que diz
  // quanto um check vale: conferir é fato, nota é de outro.
  conferir([idPratica]) {
    exigirAcesso();
    if (!idPratica) falhar('Uso: conferir <pratica>');
    const a = mapa.aula(idPratica);
    if (a.tipo !== 'pratica' || !a.correcao) falhar(`${idPratica} não é uma prática com correção.`);
    const e = estadoLib.carregar();
    const p = e.praticas[idPratica] || {};
    // A conferência abre quando a correção abriria: a entrega que o mapa pede
    // (a P4 e a P5 entregam só a pasta) e os marcos da prática fechados.
    if (!mapa.prontaParaCorrigir(a, p, e.aulas[idPratica])) falhar(`a conferência da ${idPratica} abre depois da entrega registrada e dos marcos da prática fechados. A entrega se registra com: pratica ${idPratica} ${mapa.entregaExigida(a).map((c) => `${c}=<${c === 'pasta' ? 'caminho' : 'url'}>`).join(' ')}`);
    const exigida = mapa.entregaExigida(a);
    const texto = reguaDaPratica(idPratica);
    const checks = texto ? checksDaRegua(texto, a.criterios || []) : [];
    fila.enfileirar('conferencia.aberta', { aula: idPratica }, e);
    const arquivo = `trilha/tmp/conferencia-${idPratica}.md`;
    console.log([
      `Conferência da ${idPratica}. Confira, sem julgar:`,
      `- pasta: ${p.pasta}`,
      ...(p.url ? [`- página: ${p.url}`] : []),
      ...(exigida.includes('repo') || p.repo ? [p.repo ? `- repositório: ${p.repo}` : '- repositório: não registrado'] : []),
      '',
      checks.length ? 'O que conferir:' : (p.url ? 'Não achei a lista de checks desta prática. Confira que a página abre e o que o HTML dela mostra.' : 'Não achei a lista de checks desta prática. Confira que a pasta tem o que o brief pede.'),
      ...checks.map((c) => `- ${c}`),
      // O que a régua julga e só a tela mostra: primeira dobra, ação, cores. Sem
      // isto o corretor, que não tem navegador, julgaria conversão e execução às
      // cegas (revisão de 05/10). Pedidos de descrição, nunca de juízo. O tutor
      // também não lê a página pelo painel (ler, screenshot e redimensionar são
      // negados): o texto sai do HTML pelo curl da URL registrada, que a guarda
      // deixa, e a largura de celular, dos prints que o aluno pôs na pasta.
      ...(p.url ? [
        `- Rode \`curl -sL ${p.url}\` e transcreva da resposta o título, o primeiro bloco de texto e cada botão e link de ação, com o texto exato e para onde leva. O painel só abre a página, para o aluno ver junto; você não a lê por ele.`,
        '- Se houver prints na pasta, descreva o que cada um mostra e se é de celular ou de computador. Sem print, diga que não há; não descreva largura que você não viu.',
        '- Anote as cores que o CSS da página declara para fundo, texto e botão e, se houver logo em SVG na pasta, as cores dela.',
      ] : []),
      '- Onde um check acima diz o que é certo ("resposta honesta", "não pode quebrar"), descreva o que aconteceu e deixe o julgamento para o corretor.',
      '',
      `Escreva em \`${arquivo}\` o que você viu, check por check, como fato: o que abriu, o que a tela mostrou, o que o sistema respondeu a cada entrada, o que quebrou. Sem nota, sem adjetivo de juízo, sem dizer se passa. Depois: \`corrigir ${idPratica} conferencia=${arquivo}\`.`,
    ].join('\n'));
  },

  corrigir([idPratica, arquivo]) {
    exigirAcesso();
    if (!idPratica) falhar('Uso: corrigir <pratica> conferencia=<arquivo>');
    const a = mapa.aula(idPratica);
    if (a.tipo !== 'pratica' || !a.correcao) falhar(`${idPratica} não é uma prática com correção.`);
    const e = estadoLib.carregar();
    const p = e.praticas[idPratica];
    if (!mapa.prontaParaCorrigir(a, p, e.aulas[idPratica])) falhar(`a entrega da ${idPratica} não está completa (registro e marcos da prática). Corrigir o que não foi entregue não faz sentido.`);
    // O caminho de 05/10 em diante: quem dá a nota não está no chat. O antigo,
    // com o JSON escrito pelo tutor em trilha/tmp, fica para quem corrige à mão
    // (alguém da 202, num teste) e não é mais o que a skill manda.
    if (!arquivo || arquivo.startsWith('conferencia=')) return corrigirFora(e, p, idPratica, arquivo ? arquivo.slice('conferencia='.length) : null);
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
    // Como no `milestone`: o quiz de uma das opções diz qual foi a escolha.
    if (estadoLib.escolhaPendente(e) && e.sessao_atual.escolha.opcoes.includes(idQuiz)) { estadoLib.escolher(e, idQuiz); estadoLib.salvar(e); }
    const reg = estadoLib.registroAula(e, idQuiz);
    const q = quizLib.registro(reg);
    if (reg.status === 'concluida' && sub === 'responder') falhar(`o ${idQuiz} já foi concluído.`);
    // Uma leitura interrompida nao perde a resposta: a proxima chamada do quiz
    // tenta novamente, inclusive depois de o quiz ter sido concluido.
    avaliarAbertasPendentes(e, reg, banco, idQuiz);
    if (reg.status === 'concluida') { console.log(`O ${idQuiz} já foi concluído.`); return; }

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
      q.respostas[String(n)] = { texto_caracteres: texto.length, texto_pendente: texto, ts: agora() };
      estadoLib.salvar(e);
      fila.enfileirar('quiz.resposta', { aula: idQuiz, questao: n, tipo: 'aberta', aulas: questao.aulas, texto }, e);
      if (kv.arquivo) { try { fs.unlinkSync(path.resolve(kv.arquivo)); } catch { /* já foi */ } }
      console.log(`Resposta da pergunta ${n} registrada (${texto.length} caracteres).`);
      avaliarAbertasPendentes(e, reg, banco, idQuiz);
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
      const avs = fila.ler().filter((ev) => ev.tipo === 'avaliacao' || ev.tipo === 'pratica.correcao' || ev.tipo === 'quiz.avaliacao');
      if (!avs.length) console.log('Nenhuma avaliação nem correção na fila local.');
      for (const ev of avs) {
        const rotulo = ev.tipo === 'avaliacao' ? 'Avaliação da aula' : ev.tipo === 'quiz.avaliacao' ? `Avaliação da resposta ${ev.dados.questao} do quiz` : 'Correção da prática';
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

// Avaliação que não sai não trava a aula: essa é a regra da casa. Fica o registro
// do motivo, o `concluir` passa com aviso, e a 202 sabe que aquela aula não tem
// nota e por quê. O tutor lê um recado que não o convida a contornar nada.
// O limite de uso da conta bateu no meio da avaliação: o avaliador usa a cota do
// aluno. Isso não é falha, e a avaliação não se perde: fica adiada, e o resumo
// do próximo chat manda rodá-la de novo, quando a cota já voltou. Três adiamentos
// seguidos viram falha, para não tentar para sempre.
const MAX_ADIAMENTOS = 3;
function adiar(e, reg, idAula, motivo, uso) {
  const vezes = ((reg.avaliacao_adiada || {}).vezes || 0) + 1;
  if (vezes > MAX_ADIAMENTOS) return desistir(e, reg, idAula, `${motivo}; adiada ${MAX_ADIAMENTOS} vezes`, uso);
  reg.avaliacao_adiada = { em: agora(), motivo, vezes };
  estadoLib.salvar(e);
  fila.enfileirar('avaliacao.adiada', { aula: idAula, motivo, vezes, avaliador: uso || null }, e);
  console.log(`O limite de uso da conta bateu antes de a avaliação da aula ${idAula} terminar. Ela não se perdeu: fica pendente e roda no começo do próximo chat, quando a cota tiver voltado. Feche a aula normalmente com \`concluir ${idAula}\`; não é assunto para o aluno.`);
}

function desistir(e, reg, idAula, motivo, uso) {
  delete reg.avaliacao_adiada;
  reg.avaliacao_falhou = { em: agora(), motivo };
  estadoLib.salvar(e);
  fila.enfileirar('avaliacao.falhou', { aula: idAula, motivo, avaliador: uso || null }, e);
  console.log(`Não consegui avaliar a aula ${idAula}: ${motivo}. Isso já foi registrado e a 202 foi avisada. Feche a aula normalmente com \`concluir ${idAula}\`; não há nada que você possa fazer daqui, e não é assunto para o aluno.`);
}

// O instante da entrega, gravado uma vez só: quando o registro e os marcos da
// prática passam a abrir a correção pela primeira vez. `registrada_em` anda a
// cada `pratica` (a pasta pode mudar depois, e vale o último registro), e é por
// isto aqui que o `conversa` corta as sessões, senão um re-registro feito no chat
// da correção puxava a própria correção para dentro da conversa que ela lê.
function marcarEntrega(e, a) {
  if (a.tipo !== 'pratica' || !a.correcao) return;
  const p = (e.praticas || {})[a.id];
  if (!p || p.entregue_em) return;
  if (mapa.prontaParaCorrigir(a, p, e.aulas[a.id])) {
    p.entregue_em = agora();
    enviarDocumento(e, a);
  }
}

// A prática que entrega só a pasta (a P4 e a P5) não tem página nem
// repositório: o que ela entregou é o documento, e ele sobe para a 202 no
// evento `pratica.documento` (lib/documentos.js: só texto, com teto, sem nomes
// de terceiros e sem o caminho da pasta). Vale o último envio.
function enviarDocumento(e, a) {
  if (mapa.entregaExigida(a).includes('url')) return;
  const p = (e.praticas || {})[a.id];
  if (!p || !p.pasta || !fs.existsSync(p.pasta)) return;
  const d = documentos.coletar(p.pasta, e);
  fila.enfileirar('pratica.documento', { aula: a.id, arquivos: d.arquivos, omitidos: d.omitidos, caracteres: d.total }, e);
}

// A conversa de uma prática, cortada na entrega: só as sessões da prática e
// anteriores ao instante em que ela abriu a correção. Sem rede de segurança: se
// as sessões não acham transcrição, o arquivo mais recente da pasta é o do chat
// de correção, e ler a conversa errada sem aviso é pior do que corrigir sem ela.
function conversaDaPratica(e, idPratica) {
  const p = (e.praticas || {})[idPratica] || {};
  const ate = p.entregue_em || p.registrada_em;
  const daPratica = (e.sessoes || []).filter((s) => s.aula === idPratica && (!ate || s.inicio <= ate));
  if (!daPratica.length) return { ok: false, motivo: `não há sessão da ${idPratica} anterior à entrega` };
  const t = transcricao.ler({ ...e, sessoes: daPratica, sessao_atual: null }, idPratica, { semFallback: true });
  if (!t.ok) return { ok: false, motivo: `não consegui ler a conversa da ${idPratica} (${t.motivo})` };
  return t;
}

// O que a prática pede além da pasta, para o corretor fora do chat: a conversa,
// na prática de entrevista (a P4, que tem persona), e o registro da ideia, na
// prática do plano (a P5). Os nomes de terceiros não vão: a conversa já chega
// com eles trocados por [nome], e da ideia vai só quantos são.
function materialDaPratica(e, a) {
  const partes = [];
  if (a.persona_apos) {
    const t = conversaDaPratica(e, a.id);
    partes.push(t.ok
      ? `### A conversa da prática, até a entrega (${t.chats} chat(s))\n\n\`\`\`\n${t.texto}\n\`\`\``
      : `### A conversa da prática\n\n(${t.motivo}: corrija pela síntese e diga isso na justificativa.)`);
  }
  // A P6 é o produto do plano da P5, e o plano revisado diz o que mudou: o
  // corretor compara com o plano que a P5 entregou.
  const p5 = (e.praticas || {}).P5;
  if (a.id === 'P6' && p5 && p5.pasta) {
    let plano = null;
    try { plano = fs.readFileSync(path.join(p5.pasta, 'plano.md'), 'utf8'); } catch { /* sem plano */ }
    partes.push(plano
      ? `### O plano que a P5 entregou (plano.md da pasta da P5)\n\n\`\`\`\n${plano.length > 40000 ? plano.slice(0, 40000) + '\n[...cortado...]' : plano}\n\`\`\``
      : '### O plano que a P5 entregou\n\n(o plano.md da pasta da P5 não está mais nesta máquina)');
  }
  // As frentes de engenharia e de negócio correm em paralelo: o plano da P5 pode
  // nascer antes da P3. A régua cobra o custo de IA e a decisão sobre o motor da
  // P3 conforme ela já exista, e é daqui que o corretor sabe.
  // Vale o que existia quando a P5 foi entregue, e não na hora da correção: o
  // chat da correção pode vir depois de ele ter feito o M3 inteiro, e o plano
  // foi escrito antes.
  if (a.id === 'P5') {
    const entregaP5 = ((e.praticas || {}).P5 || {}).entregue_em;
    const antes = (t) => Boolean(t) && (!entregaP5 || t <= entregaP5);
    const p3feita = antes(((e.aulas || {}).P3 || {}).concluida_em) || antes(((e.praticas || {}).P3 || {}).entregue_em);
    partes.push(`### A P3

${p3feita
      ? 'Quando entregou a P5, o aluno já tinha feito a P3: o custo de IA parte do que ela mediu, e a decisão de reaproveitar o motor dela se cobra.'
      : 'Quando entregou a P5, o aluno ainda não tinha feito a P3 (a frente de engenharia corre em paralelo à de negócio): o custo de IA pode sair da tabela de preços com data; se a pasta da P3 em construção já trazia o custo medido na 3.4, ele também vale como origem. A decisão sobre o motor da P3 fica para a 6.1 e não se cobra aqui.'}`);
  }
  if (a.modulo === 5 && e.ideia) {
    const i = e.ideia;
    const tirar = transcricao.tiradorDeNomes(e);
    const entrevistas = (i.entrevistas || []).map((x, n) => `${n + 1}. ${tirar(x.resumo)}`).join('\n') || '(nenhuma registrada)';
    partes.push([
      '### O registro da ideia (o comando `ideia`, sem os nomes de terceiros)',
      '',
      `Ideia: ${i.texto || '(sem texto)'}`,
      `Hipóteses: ${i.hipoteses || '(sem hipóteses)'}`,
      `Nomes na lista para entrevistar: ${(i.nomes || []).length}`,
      `Versões registradas: ${(i.versoes || []).length}`,
      `Entrevistas reais registradas: ${(i.entrevistas || []).length} de 3, com o que ele contou ao registrar:`,
      entrevistas,
    ].join('\n'));
  }
  return partes.join('\n\n');
}

function descreverIdeia(i) {
  const linhas = [];
  linhas.push(`Ideia: ${i.texto || '(ainda sem texto)'}`);
  linhas.push(`Hipóteses: ${i.hipoteses || '(ainda sem hipóteses)'}`);
  const nomes = i.nomes || [];
  linhas.push(`Nomes para entrevistar (${nomes.length}): ${nomes.length ? nomes.join('; ') : '(nenhum)'}`);
  linhas.push(`Entrevistas reais feitas: ${(i.entrevistas || []).length} de 3.`);
  linhas.push(`Versões registradas: ${(i.versoes || []).length}.`);
  return linhas.join('\n');
}

function minutosNaAula(e, idAula) {
  // A conclusão acontece com a sessão ainda aberta; sem contar sessao_atual o total sai zero.
  const fechadas = e.sessoes.filter((s) => s.aula === idAula).reduce((t, s) => t + (s.minutos || 0), 0);
  const s = e.sessao_atual;
  const aberta = s && s.aula === idAula ? Math.max(0, minutosEntre(s.inicio, s.ultima_atividade || agora())) : 0;
  return fechadas + aberta;
}

// A régua de uma prática, decodificada, ou null.
function reguaDaPratica(idPratica) {
  try {
    return Buffer.from(fs.readFileSync(path.join(paths.PRATICAS, idPratica.toLowerCase(), 'criterios'), 'utf8'), 'base64').toString('utf8');
  } catch {
    return null;
  }
}

// Os checks da régua, como o tutor os confere: cada item da seção "Checks que
// você roda antes de julgar", sem a frase que diz quanto ele vale ("Se não abre,
// `entrega` não passa de 2"). Uma frase que cita um critério ou fala em nota é
// juízo, e juízo não é do tutor.
function checksDaRegua(texto, criterios) {
  const linhas = texto.split(/\r?\n/);
  const i = linhas.findIndex((l) => /^##\s+Checks/i.test(l));
  if (i < 0) return [];
  const fim = linhas.findIndex((l, j) => j > i && /^##\s/.test(l));
  const itens = linhas.slice(i + 1, fim < 0 ? undefined : fim).filter((l) => /^\s*-\s+/.test(l)).map((l) => l.replace(/^\s*-\s+/, '').trim());
  const juizo = (frase) => /\bnota\b|não passa de|vale no máximo/i.test(frase) || criterios.some((k) => frase.includes(`\`${k}\``));
  return itens
    .map((item) => item.split(/(?<=\.)\s+/).filter((frase) => !juizo(frase)).join(' ').trim())
    .filter(Boolean);
}

// A correção fora do chat. O tutor dispara, o harness junta a entrega, um
// `claude -p` que não acompanhou a prática dá a nota, e o tutor recebe só o
// roteiro do feedback. Falha não trava a prática: é a regra do `avaliar`, pelo
// mesmo motivo - o aluno entregou, quem não entregou foi o harness.
async function corrigirFora(e, p, idPratica, arqConferencia) {
  let conferencia = null;
  if (arqConferencia) {
    try { conferencia = fs.readFileSync(path.resolve(arqConferencia), 'utf8').trim().slice(0, 40000) || null; } catch (err) {
      falhar(`não consegui ler a conferência em ${arqConferencia} (${err.message}). Escreva o que você viu no navegador nesse arquivo e rode de novo.`);
    }
  }
  const desistirCorrecao = (motivo, uso) => {
    p.correcao_falhou = { em: agora(), motivo };
    estadoLib.salvar(e);
    fila.enfileirar('pratica.correcao.falhou', { aula: idPratica, motivo, corretor: uso || null }, e);
    console.log(`Não consegui corrigir a ${idPratica}: ${motivo}. Isso já foi registrado e a 202 foi avisada. Dê ao aluno, com as suas palavras, o que você viu ao conferir a entrega - o que funciona e uma coisa para mudar primeiro, sem nota - e feche com \`concluir ${idPratica}\`. Não comente a falha com ele.`);
  };
  const reguaTexto = reguaDaPratica(idPratica);
  if (!reguaTexto) return desistirCorrecao('a régua desta prática não está nesta cópia do harness');
  let brief = null;
  try { brief = fs.readFileSync(path.join(paths.PRATICAS, idPratica.toLowerCase(), 'brief.md'), 'utf8'); } catch { /* sem brief */ }
  const material = await entregaLib.coletar(p);
  const extra = materialDaPratica(e, mapa.aula(idPratica));
  if (extra) material.texto += '\n\n' + extra;
  const conferido = material.texto + (conferencia ? '\n\n' + conferencia : '');
  const r = avaliador.corrigir({
    idPratica,
    regua: reguaTexto,
    brief,
    conferencia,
    material: material.texto,
    validar: (c) => validarCorrecao(c, idPratica, conferido),
  });
  // No limite de uso a correção não falhou: espera a cota voltar, no mesmo chat
  // (o aluno manda "continue") ou num novo, que reabre a correção sozinho.
  if (!r.ok && r.limite) {
    p.correcao_adiada = { em: agora(), motivo: r.motivo };
    estadoLib.salvar(e);
    fila.enfileirar('pratica.correcao.adiada', { aula: idPratica, motivo: r.motivo, corretor: r.uso || null }, e);
    console.log(`O limite de uso da conta bateu antes de a correção da ${idPratica} terminar. Ela não falhou nem se perdeu: não conclua a prática e não dê feedback ainda. Diga ao aluno, em duas linhas, que a leitura termina quando o limite renovar (o horário aparece na mensagem do Claude) e que é só mandar "continue" neste chat depois disso; aí rode o mesmo comando de novo, com a mesma conferência. Se ele abrir um chat novo, a correção recomeça sozinha.`);
    return;
  }
  if (!r.ok) return desistirCorrecao(r.motivo, r.uso);
  delete p.correcao_adiada;
  const b64 = Buffer.from(JSON.stringify(r.correcao), 'utf8').toString('base64');
  const revisao = p.corrigida_em ? { revisao: true, substitui_de: p.corrigida_em } : {};
  fila.enfileirar('pratica.correcao', {
    aula: idPratica, codificado: 'base64', payload: b64, corretor: r.uso,
    material: material.resumo, conferencia: Boolean(conferencia), ...revisao,
  }, e);
  p.corrigida_em = agora();
  delete p.correcao_falhou;
  estadoLib.salvar(e);
  if (arqConferencia) { try { fs.unlinkSync(path.resolve(arqConferencia)); } catch { /* já foi */ } }
  console.log([
    `Correção da ${idPratica} registrada e enfileirada. A nota não passa por aqui.`,
    '',
    'Roteiro do feedback, para você dizer com as suas palavras (não cole, não mostre como lista de critérios):',
    '',
    r.correcao.feedback_aluno,
    '',
    `Depois, feche com \`concluir ${idPratica}\`.`,
  ].join('\n'));
}

// `material` é o que o corretor leu (lib/entrega.js). Com ele, cada evidência
// tem de estar lá: a régua pede "trechos literais do que ele entregou", e o CRM
// os mostra como tais. Sem ele (o caminho manual), confere-se só a forma.
function validarCorrecao(c, idPratica, material) {
  const erros = [];
  if (!c || typeof c !== 'object') return ['não é um objeto JSON'];
  if (c.pratica !== idPratica) erros.push(`campo "pratica" deve ser "${idPratica}"`);
  // Cada prática corrigida tem as suas chaves, declaradas no mapa: a P1 julga
  // uma página (entrega, conversão...), a P2 julga um sistema (spec, testes...).
  // A régua codificada em praticas/<p>/criterios usa os mesmos nomes.
  const chaves = mapa.aula(idPratica).criterios;
  if (!Array.isArray(chaves) || !chaves.length) return [`a prática ${idPratica} não declara "criterios" no mapa; a correção não tem forma`];
  for (const k of chaves) {
    const v = c.criterios ? c.criterios[k] : undefined;
    if (!Number.isInteger(v) || v < 1 || v > 5) erros.push(`criterios.${k} deve ser inteiro de 1 a 5`);
  }
  for (const k of Object.keys(c.criterios || {})) if (!chaves.includes(k)) erros.push(`criterios.${k} não existe na ${idPratica}; as chaves são ${chaves.join(', ')}`);
  if (typeof c.justificativa !== 'string' || c.justificativa.length < 200 || c.justificativa.length > 2000) erros.push('"justificativa" entre 200 e 2000 caracteres: o que sustenta cada nota fora da média');
  if (!Array.isArray(c.evidencias) || c.evidencias.length < 2 || c.evidencias.length > 5) erros.push('"evidencias" deve ter de 2 a 5 trechos do que ele entregou');
  else for (const ev of c.evidencias) {
    if (typeof ev !== 'string' || ev.length > 300) erros.push('cada evidência é um trecho curto (máximo 300 caracteres)');
    else if (material && !transcricao.evidenciaNaTranscricao(ev, material)) {
      erros.push(`a evidência "${ev.slice(0, 80)}${ev.length > 80 ? '…' : ''}" não está no que ele entregou. Copie o trecho exatamente como aparece num arquivo ou no HTML, sem parafrasear; use "..." para pular um pedaço`);
    }
  }
  if (typeof c.feedback_aluno !== 'string' || c.feedback_aluno.length < 300 || c.feedback_aluno.length > 3000) erros.push('"feedback_aluno" entre 300 e 3000 caracteres: é o que ele recebe, sem nota');
  if (typeof c.resumo_qualitativo !== 'string' || c.resumo_qualitativo.length < 40 || c.resumo_qualitativo.length > 400) erros.push('"resumo_qualitativo" entre 40 e 400 caracteres');
  if (c.suspeita !== null && c.suspeita !== undefined) {
    if (typeof c.suspeita.descricao !== 'string' || typeof c.suspeita.evidencia !== 'string') erros.push('suspeita precisa de "descricao" e "evidencia"');
  }
  return erros;
}

function avaliarAbertasPendentes(e, reg, banco, idQuiz) {
  const respostas = quizLib.registro(reg).respostas;
  const sessao = e.sessao_atual?.id || 'sem-sessao';
  for (const questao of banco.questoes.filter((x) => x.tipo === 'aberta')) {
    const gravada = respostas[String(questao.n)];
    if (!gravada || typeof gravada.texto_pendente !== 'string') continue;
    if (gravada.avaliacao_tentada_sessao === sessao) continue;
    gravada.avaliacao_tentada_sessao = sessao;
    estadoLib.salvar(e);
    const resultado = quizAvaliador.avaliar(idQuiz, questao, gravada.texto_pendente);
    const avaliador = {
      ...(resultado.uso || {}),
      rubrica_sha: resultado.rubrica_sha,
      escala_versao: resultado.escala_versao,
    };
    if (resultado.ok) {
      const payload = Buffer.from(JSON.stringify(resultado.avaliacao), 'utf8').toString('base64');
      fila.enfileirar('quiz.avaliacao', {
        aula: idQuiz, questao: questao.n, codificado: 'base64', payload,
        avaliador,
      }, e);
      delete gravada.texto_pendente;
      delete gravada.avaliacao_tentada_sessao;
      estadoLib.salvar(e);
      console.log(`Avaliação separada da pergunta ${questao.n} registrada. A nota não passa pelo chat.`);
    } else {
      fila.enfileirar(resultado.limite ? 'quiz.avaliacao.adiada' : 'quiz.avaliacao.falhou', {
        aula: idQuiz, questao: questao.n, motivo: resultado.motivo,
        avaliador,
      }, e);
      console.log(`A avaliação separada da pergunta ${questao.n} ficou pendente (${resultado.motivo}). A resposta está salva e será tentada novamente no próximo chat.`);
    }
  }
}

// O fechamento do quiz, para o tutor: o que ficou para revisitar não é placar.
function fimDoQuiz(banco, reg, idQuiz) {
  const r = quizLib.resumoFinal(banco, reg);
  return [
    `Quiz ${idQuiz} completo: as ${banco.questoes.length} perguntas têm resposta gravada.`,
    r.texto,
    'Isso não é nota e não se anuncia como placar: o aluno já viu cada correção. Diga, com as suas palavras, o que ficou para revisitar e por quê (a aula, e quando ela volta a ser necessária), e o que as abertas mostraram. Depois grave a memória do aluno — uma nota com a chave `revisitar-m' + mapa.aula(idQuiz).modulo + '`, dizendo o que revisitar e o que você vai fazer com isso na próxima aula em que aparecer — e feche com `concluir ' + idQuiz + '`. Sem `avaliar`: o quiz não tem.',
  ].join('\n');
}

// `texto` é a transcrição que o avaliador leu. Sem ela (só em teste), a evidência
// é conferida pela forma e não pelo conteúdo.
function validarAvaliacao(av, idAula, texto, semTarefa = false) {
  const erros = [];
  if (!av || typeof av !== 'object') return ['não é um objeto JSON'];
  if (av.aula !== idAula) erros.push(`campo "aula" deve ser "${idAula}"`);
  // `dominio` é da versão 2 do contrato (05/10): o único critério que diz o que
  // o aluno aprendeu, e não como ele conversou.
  const criterios = ['compreensao', 'pensamento', 'esforco', 'autonomia', 'dominio'];
  if (!av.criterios || typeof av.criterios !== 'object') erros.push('falta "criterios"');
  else for (const c of criterios) {
    const v = av.criterios[c];
    if ((c === 'esforco' || c === 'autonomia') && semTarefa && v === null) continue;
    if (!Number.isInteger(v) || v < 1 || v > 5 || ((c === 'esforco' || c === 'autonomia') && semTarefa)) {
      erros.push(`criterios.${c} deve ser ${semTarefa && (c === 'esforco' || c === 'autonomia') ? 'null nesta aula sem tarefa' : 'inteiro de 1 a 5'}`);
    }
  }
  if (av.criterios && typeof av.criterios === 'object') {
    for (const k of Object.keys(av.criterios)) if (!criterios.includes(k)) erros.push(`criterios.${k} não existe; os critérios são ${criterios.join(', ')}`);
  }
  if (typeof av.justificativa !== 'string' || av.justificativa.length < 120) erros.push('"justificativa" precisa de 3 a 6 linhas (mínimo 120 caracteres)');
  if (av.justificativa && av.justificativa.length > 1500) erros.push('"justificativa" longa demais (máximo 1500 caracteres)');
  // A ficha mostra a nota e a justificativa lado a lado. Medido na 1.2 de 05/10:
  // "Pensamento 4: ..." na justificativa e `pensamento: 3` no JSON - a tela
  // contradizendo a si mesma. Quando a justificativa nomeia um critério com um
  // número, ele tem de ser a nota.
  if (typeof av.justificativa === 'string' && av.criterios && typeof av.criterios === 'object') {
    const nomes = { compreensao: 'compreens[aã]o', pensamento: 'pensamento', esforco: 'esfor[cç]o', autonomia: 'autonomia', dominio: 'dom[ií]nio' };
    for (const [k, padrao] of Object.entries(nomes)) {
      const m = av.justificativa.match(new RegExp(`${padrao}\\s*(?:=|:)?\\s*([1-5])\\b`, 'i'));
      if (m && Number.isInteger(av.criterios[k]) && Number(m[1]) !== av.criterios[k]) {
        erros.push(`a justificativa diz ${k} ${m[1]} e criterios.${k} é ${av.criterios[k]}; a nota e a justificativa têm de dizer o mesmo`);
      }
    }
  }
  if (!Array.isArray(av.evidencias) || av.evidencias.length < 1 || av.evidencias.length > 3) erros.push('"evidencias" deve ter de 1 a 3 trechos');
  else {
    const falas = texto ? transcricao.falasDoAluno(texto) : null;
    for (const ev of av.evidencias) {
      if (typeof ev !== 'string' || ev.length > 300) erros.push('cada evidência é um trecho curto (máximo 300 caracteres)');
      else if (falas !== null) {
        const origem = transcricao.origemDaEvidencia(ev, falas);
        const curta = `"${ev.slice(0, 80)}${ev.length > 80 ? '…' : ''}"`;
        if (!origem) {
          erros.push(`a evidência ${curta} não está em nenhuma fala do aluno. Copie o trecho exatamente como aparece numa única linha ALUNO, sem parafrasear, sem juntar falas de momentos diferentes e sem juntar falas do tutor; use "..." para pular um pedaço dentro da mesma fala`);
        } else if (['colou', 'anexou'].includes(origem.tipo) && !origem.rotulada) {
          // O CRM mostra a evidência entre aspas como as palavras do aluno. Um
          // terminal ou a saída do agente da oficina, colados por ele, não são
          // (revisão de 05/10): sobem dizendo de onde vieram. O bloco longo sem
          // marca não entra aqui (06/10): na maior parte das vezes é o aluno
          // ditando por voz, e exigir "(colou)" derrubava a avaliação inteira ou
          // punha na ficha que ele colou o que ele falou.
          erros.push(`a evidência ${curta} vem de um trecho que o aluno colou ou anexou, não de algo que ele digitou. Comece com "(colou) " ou "(anexou) ", ou prefira uma fala digitada`);
        }
      }
    }
  }
  if (typeof av.resumo_qualitativo !== 'string' || av.resumo_qualitativo.length < 40 || av.resumo_qualitativo.length > 400) erros.push('"resumo_qualitativo" entre 40 e 400 caracteres');
  // A fluência tem de bater com a aula: o CRM guarda tentativas a partir de 1, e
  // uma fluência inventada numa aula que não tem fluência vira uma pílula na ficha.
  let temFluencia = true;
  try { temFluencia = Boolean(mapa.aula(idAula).fluencia); } catch { /* aula fora do mapa: sem conferência */ }
  if (!temFluencia && av.fluencia !== null && av.fluencia !== undefined) erros.push('esta aula não tem teste de fluência: "fluencia" vai null');
  if (av.fluencia !== null && av.fluencia !== undefined) {
    if (typeof av.fluencia.passou !== 'boolean') erros.push('fluencia.passou deve ser booleano');
    if (!Number.isInteger(av.fluencia.tentativas) || av.fluencia.tentativas < 1) erros.push('fluencia.tentativas deve ser inteiro a partir de 1; se a fluência não aconteceu, "fluencia" vai null');
    if (typeof av.fluencia.evidencia !== 'string' || av.fluencia.evidencia.length > 1000) erros.push('fluencia.evidencia é texto de até 1000 caracteres');
  }
  if (av.suspeita !== null && av.suspeita !== undefined) {
    if (typeof av.suspeita.descricao !== 'string' || typeof av.suspeita.evidencia !== 'string') erros.push('suspeita precisa de "descricao" e "evidencia"');
    else if (texto && !transcricao.evidenciaNaTranscricao(av.suspeita.evidencia, transcricao.falasDoAluno(texto))) {
      erros.push('suspeita.evidencia precisa ser trecho literal de uma fala do aluno');
    }
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
    if (SOBEM_NA_HORA.has(comando)) await enviarAgora({ timeoutMs: prazoDeEnvio(comando) });
  } catch (err) {
    falhar(err.message);
  }
})();
