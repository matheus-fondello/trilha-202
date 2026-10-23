'use strict';
// Monta o texto que o hook de início injeta no contexto e que `status` imprime.
// É a memória entre sessões: curto, factual, com a instrução de qual skill carregar.
const mapa = require('./mapa');
const notas = require('./notas');
const acesso = require('./acesso');
const quiz = require('./quiz');
const { relativo } = require('./util');
const { avaliacaoRodando } = require('./estado');

// O Codex não tem a ferramenta de skill do Claude Code (branch codex): para ele a skill é um arquivo que se lê e se
// segue. Todo texto do modo Codex que manda carregar skill passa por aqui; o do Claude fica como era, letra a letra.
// No Windows, com o encoding dito: o `Get-Content` do PowerShell 5.1 lê UTF-8 sem BOM como ANSI e troca os acentos da
// skill (T8, passo 5), mesmo que o tutor esqueça o AGENTS.md.
const lerSkill = (nome) => `leia \`.claude/skills/${nome}/SKILL.md\`${process.platform === 'win32' ? ' com `Get-Content -Encoding UTF8`' : ''} e siga`;

// A fluência dos módulos de negócio e de produto, e da 1.2, da 1.3 e da 1.4, se julga pelo conjunto (22/10): substitui, só nestas aulas, o "passou
// é toda parte cumprida" da `tutor`. O texto mora em lib/fluencia-conjunto.js, igual ao que o avaliador ouve.
const FLUENCIA_PELO_CONJUNTO = require('./fluencia-conjunto').linhaTutor();

// Sala sem acesso à 202 não tem aula. O resumo inteiro vira o pedido do token,
// e nada da aula aparece: o tutor não tem o que começar antes do `conectar`.
function portaFechada(e, a, linhas, codex) {
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
    // O acesso guardado pode ser de outra pessoa (máquina dividida, quem testa com conta nova): o tutor diz de quem
    // é antes de usar, e a resposta do aluno decide entre reaproveitar e trocar.
    const c = acesso.credenciais();
    linhas.push(c.email
      ? `Acesso à 202: esta máquina já tem guardado o acesso de ${c.email}${c.turma ? ` (${c.turma})` : ''}, mas esta sala ainda não foi conectada. Apresente-se em duas linhas, diga de quem é o acesso guardado e pergunte o primeiro nome dele e se esse e-mail é o dele.`
      : 'Acesso à 202: esta máquina já tem um acesso da 202 guardado de antes, sem registro de quem é, e esta sala ainda não foi conectada. Apresente-se em duas linhas e pergunte o primeiro nome dele e se ele já usou a trilha nesta máquina, com o acesso dele.');
    linhas.push('Se for dele, conecte com o token que já está aqui:');
    linhas.push('  node .claude/scripts/trilha.js conectar nome="<primeiro nome>"');
    linhas.push(`Se não for (outra pessoa, ou ele quer entrar com uma conta nova), peça o token que a 202 mandou para a conta nova e conecte com ele; o novo substitui o guardado nesta máquina:`);
    linhas.push(`  node .claude/scripts/trilha.js conectar nome="<primeiro nome>" token=<token>${comServidor}`);
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
  linhas.push(codex
    ? `Antes de responder ao aluno, ${lerSkill('tutor')}, e só ela. Quando o \`conectar\` passar, ele imprime o estado da trilha com a skill da aula a ler: siga dali, neste mesmo chat.`
    : 'Antes de responder ao aluno, invoque só a skill `tutor`. Quando o `conectar` passar, ele imprime o estado da trilha com a skill da aula a carregar: siga dali, neste mesmo chat.');
  return linhas.join('\n');
}

// Avaliação de aula que o limite de uso adiou (trilha.js, adiar): roda no começo
// do chat seguinte, quando a cota voltou. A aula da vez fica de fora enquanto não
// fecha, porque o fechamento dela já roda o `avaliar`.
// Desde 11/10 também a que falhou por outro motivo é tentada de novo, até a terceira (trilha.js, MAX_FALHAS), e a que falhou uma vez por falta de
// login no `claude` da máquina; a que já falhou duas por login fica com o bloco de login (avaliacoesSemLogin).
// A lista das aulas com avaliação por rodar: o resumo a pede ao tutor no começo do chat, e no Codex o fim do turno
// confere que ela foi tentada (lib/codex/cobranca.js).
function avaliacoesPendentes(e, codex) {
  const falhas = require('./falhas');
  let lida;
  const versao = () => (lida === undefined ? (lida = falhas.versao()) : lida);
  return Object.entries(e.aulas || {})
    .filter(([id, r]) => !r.avaliada_em && (r.status === 'concluida' || id !== e.aula_atual)
      // Um processo à parte da versão anterior ainda vivo não é pendência: rodar de novo daria duas avaliações.
      && !avaliacaoRodando(r)
      // A que já falhou duas vezes por login fica com o bloco de login (semLogin); a que falhou três vezes, acabou.
      && !(r.avaliacao_login && r.avaliacao_login.vezes >= 2)
      // (Menos a que desistiu por não achar o Claude Code, ou pelo EOF/EPIPE do cmd.exe, que volta a tentar sempre, e a que
      // não achou a transcrição, que volta uma vez a cada versão nova da sala. A regra mora em lib/falhas.js.)
      && !falhas.definitiva(r, versao)
      // No Claude, a que espera o Claude Code ser instalado fica com o bloco dela (semClaude), antes de tudo.
      && !(!codex && esperaClaude(r))
      // `avaliacao_pendente` é a aula que fechou e cuja avaliação não rodou ou foi interrompida (o aluno parou o
      // comando, fechou o chat): o `concluir` marca, e só a nota registrada desmarca.
      && (r.avaliacao_pendente || r.avaliacao_em_andamento || r.avaliacao_adiada || r.avaliacao_login || r.avaliacao_falhou))
    .map(([id]) => id);
}
// A que estourou o tempo (19/10) roda de novo com prazo longo: nesta máquina a leitura é lenta, e o mesmo teto
// estouraria de novo. Em segundo plano, para o aluno não esperar minutos pela primeira resposta; o terminal do
// tutor corta em dois minutos o comando que roda na frente.
function avaliacaoLenta(e, id) {
  const r = (e.aulas || {})[id] || {};
  return /passou de \d+ segundos|não terminou a tempo/.test([(r.avaliacao_adiada || {}).motivo, (r.avaliacao_falhou || {}).motivo].filter(Boolean).join(' '));
}
const comandoAvaliar = (e, id) => `\`node .claude/scripts/trilha.js avaliar ${id}${avaliacaoLenta(e, id) ? ' --longo' : ''}\``;

function pendencias(e, linhas, codex) {
  const adiadas = avaliacoesPendentes(e, codex);
  const lentas = adiadas.filter((id) => avaliacaoLenta(e, id));
  // No Codex (branch codex, T0.9) o shell não corta o comando longo: depois de uns 10 a 30 s ele devolve um
  // `session_id` com o comando ainda rodando, e o agente pode seguir a conversa. Esperar por ele custa uma volta do
  // modelo a cada 30 s, na cota do aluno: por isso o texto manda deixar rodando.
  const tempo = lentas.length && codex
    ? `Nesta máquina a avaliação é lenta e pode levar alguns minutos: rode ${lentas.length > 1 ? 'esses comandos' : 'o comando'} sem esperar o resultado e siga a aula. Se o shell devolver um \`session_id\` com o comando ainda rodando, deixe rodando e não volte a esperar por ele.`
    : lentas.length
    ? `Nesta máquina a avaliação é lenta e pode levar alguns minutos: rode ${lentas.length > 1 ? 'esses comandos' : 'o comando'} em segundo plano (run_in_background), sem esperar o resultado, e siga a aula; se a sua ferramenta de terminal não tiver essa opção, rode com o tempo máximo dela (timeout de 600000 ms), senão ela o corta em dois minutos.`
    : 'O comando leva uns vinte segundos.';
  if (adiadas.length) linhas.push(`Pendência do harness: a avaliação ${adiadas.length > 1 ? 'das aulas' : 'da aula'} ${adiadas.join(', ')} não terminou no fim da aula (o chat fechou antes, limite de uso, API fora do ar ou outro erro). No seu primeiro turno, escreva primeiro o que o aluno vai ler e, por último, rode ${adiadas.map((id) => comandoAvaliar(e, id)).join(' e ')}. ${tempo} Não comente com o aluno; se o comando pedir alguma coisa, faça o que ele disser, e siga a aula.`);
  const quizzes = Object.entries(e.aulas || {})
    .filter(([, r]) => Object.values((r.quiz || {}).respostas || {}).some((x) => x && typeof x.texto_pendente === 'string'))
    .map(([id]) => id);
  if (quizzes.length) linhas.push(`Pendência do harness: a IA ainda não concluiu a avaliação de resposta aberta em ${quizzes.join(', ')}. Antes da matéria, rode ${quizzes.map((id) => `\`node .claude/scripts/trilha.js quiz ${id}\``).join(' e ')}; o comando tenta de novo sem alterar a resposta do aluno. Não anuncie nota.`);
}

// O passo a passo do login do Claude que avalia. Com `executavel`, o aluno não tem `claude` no terminal (só o
// aplicativo de desktop): o comando é o caminho completo do Claude Code do aplicativo, que o avaliador achou, e não há
// login antigo para sair dele.
function passosLogin(executavel, motor = 'claude') {
  if (motor === 'codex') return passosLoginCodex(executavel);
  if (ehDoAplicativo(executavel)) return passosInstalar();
  if (!executavel) return '(1) abrir um terminal, pode ser o do próprio aplicativo; (2) digitar `claude` e Enter; (3) lá dentro, digitar `/logout` e Enter, depois `/login` e Enter, e entrar no navegador com a mesma conta do Claude que ele usa no aplicativo; (4) digitar `/exit`; (5) para conferir, rodar `claude -p "oi"`, que tem de responder sem erro.';
  const chamada = process.platform === 'win32' ? `& "${executavel}"` : `"${executavel}"`;
  const onde = process.platform === 'win32' ? 'abrir o PowerShell do Windows (menu Iniciar, digitar PowerShell)' : 'abrir um terminal, pode ser o do próprio aplicativo';
  return `(1) ${onde}; (2) colar esta linha inteira, com as aspas, e dar Enter: \`${chamada}\` (entregue a linha num bloco de código, para ele copiar sem erro; é o Claude Code que veio com o aplicativo dele); (3) se aparecerem perguntas de primeira vez (tema, confiar na pasta), aceitar o padrão com Enter; lá dentro, digitar \`/login\` e Enter, e entrar no navegador com a mesma conta do Claude que ele usa no aplicativo; (4) digitar \`/exit\`; (5) para conferir, colar \`${chamada} -p "oi"\`, que tem de responder sem erro. É uma vez só: o login fica guardado nesta máquina.`;
}

// O Claude Code que veio dentro do aplicativo de desktop (lib/avaliador.js, doAplicativo) muda de pasta quando o
// aplicativo se atualiza, e some (20/10: quatro alunos avaliaram com ele, fizeram o login por ele, e dias depois voltaram
// a "não encontrei o Claude Code"). O login vale para qualquer Claude da máquina; o executável, não. Por isso, para quem
// só tem esse, o passo a passo é instalar o Claude Code da linha de comando, uma vez, em ~/.local/bin, que o aplicativo
// não mexe e onde o avaliador procura. O `claude` pode não entrar no PATH do terminal aberto (18/10): o caminho completo
// é o que funciona sempre.
const DO_APLICATIVO = /[\\/]Claude[\\/]claude-code[\\/]/i;
const ehDoAplicativo = (executavel) => Boolean(executavel) && DO_APLICATIVO.test(executavel);
function passosInstalar() {
  const final = '(4) se aparecerem perguntas de primeira vez (tema, confiar na pasta), aceitar o padrão com Enter; mandar `oi`, e se ele pedir login, digitar `/login` e Enter e entrar no navegador com a mesma conta do Claude que ele usa no aplicativo; (5) quando o `oi` tiver resposta, digitar `/exit`. É uma vez só: fica instalado, com o login guardado nesta máquina, e a atualização do aplicativo não mexe nele.';
  if (process.platform === 'win32') return `(1) abrir o PowerShell do Windows (menu Iniciar, digitar PowerShell); (2) colar esta linha e dar Enter: \`irm https://claude.ai/install.ps1 | iex\` (entregue cada linha num bloco de código, para ele copiar sem erro), e esperar terminar; se aparecer um aviso de que \`claude\` não está no PATH, ou se depois \`claude\` não for reconhecido, não importa; (3) colar esta linha inteira, com as aspas, e dar Enter: \`& "$env:USERPROFILE\\.local\\bin\\claude.exe"\`; ${final}`;
  return `(1) abrir um terminal, pode ser o do próprio aplicativo; (2) colar esta linha e dar Enter: \`curl -fsSL https://claude.ai/install.sh | bash\` (entregue cada linha num bloco de código, para ele copiar sem erro), e esperar terminar; se aparecer um aviso de que \`claude\` não está no PATH, não importa; (3) colar \`~/.local/bin/claude\` e dar Enter; ${final}`;
}

// O do Codex (branch codex): quem avalia é o `codex` da linha de comando. Quem só tem o aplicativo não tem `codex` no
// PATH, e o comando é o caminho do `codex.exe` que o avaliador achou, com aspas, como o do Claude usa o do aplicativo.
// Se o `codex.exe` do pacote herda o login do aplicativo não foi medido (T0.8): por isso o primeiro passo é conferir a
// conta no aplicativo, e o `login` fica para quando isso não basta.
function passosLoginCodex(executavel) {
  const chamada = executavel ? (process.platform === 'win32' ? `& "${executavel}"` : `"${executavel}"`) : 'codex';
  const onde = process.platform === 'win32' ? 'no PowerShell do Windows (menu Iniciar, digitar PowerShell)' : 'num terminal';
  return `(1) abrir o aplicativo do ChatGPT e conferir que está conectado na conta dele; (2) se continuar, ${onde}, colar esta linha inteira${executavel ? ', com as aspas,' : ''} e dar Enter: \`${chamada} login\` (entregue a linha num bloco de código, para ele copiar sem erro), e entrar no navegador com a mesma conta do ChatGPT; (3) para conferir, colar \`${chamada} login status\`, que tem de responder que está conectado. É uma vez só: o login fica guardado nesta máquina.`;
}

// Aulas cuja avaliação falhou duas vezes porque o `claude` da máquina está sem login (trilha.js, pedirLogin). Vem
// antes de tudo, até da escolha de frente: o aluno refaz o login, o tutor reavalia, e só depois a aula do dia.
function semLogin(e, linhas) {
  const ids = Object.entries(e.aulas || {})
    .filter(([, r]) => !r.avaliada_em && r.avaliacao_login && r.avaliacao_login.vezes >= 2)
    .map(([id]) => id);
  if (!ids.length) return;
  // O motor gravado pelo `pedirLogin` (branch codex): sem login no Codex, o pedido e o passo a passo são os do Codex.
  const peloCodex = ids.map((id) => e.aulas[id].avaliacao_login || {}).find((l) => l.motor === 'codex');
  if (peloCodex) {
    linhas.push(`Antes de tudo, inclusive da escolha de aula: a avaliação ${ids.length > 1 ? 'das aulas' : 'da aula'} ${ids.join(', ')} falhou porque o Codex da linha de comando desta máquina, que é quem avalia as aulas, está sem login válido. Só ele resolve. No seu primeiro turno, cumprimente e diga isso em duas linhas, sem jargão e sem culpa, e passe o passo a passo: ${passosLogin(peloCodex.executavel, 'codex')} Acompanhe pelo que ele contar da tela. Quando ele disser que funcionou, rode ${ids.map((id) => `\`node .claude/scripts/trilha.js avaliar ${id}\``).join(' e ')} e só então siga com o que vem abaixo. Se ele não puder agora, siga normalmente: o próximo chat volta a pedir.`);
    linhas.push('');
    return;
  }
  const executavel = ids.map((id) => (e.aulas[id].avaliacao_login || {}).executavel).find(Boolean);
  const porque = ehDoAplicativo(executavel)
    ? 'esta máquina só tem o Claude Code que veio dentro do aplicativo, que é quem avalia as aulas, e ele está sem login; esse muda de lugar quando o aplicativo se atualiza, e o certo é instalar o Claude Code da linha de comando, uma vez só (a conversa aqui funciona porque o aplicativo tem login próprio)'
    : 'o Claude da linha de comando desta máquina, que é quem avalia as aulas, está sem login válido (a conversa aqui funciona porque o aplicativo tem login próprio)';
  linhas.push(`Antes de tudo, inclusive da escolha de aula: a avaliação ${ids.length > 1 ? 'das aulas' : 'da aula'} ${ids.join(', ')} falhou porque ${porque}. Só ele resolve. No seu primeiro turno, cumprimente e diga isso em duas linhas, sem jargão e sem culpa, e passe o passo a passo: ${passosLogin(executavel)} Acompanhe pelo que ele contar da tela. Quando ele disser que funcionou, rode ${ids.map((id) => `\`node .claude/scripts/trilha.js avaliar ${id}\``).join(' e ')} e só então siga com o que vem abaixo. Se ele não puder agora, siga normalmente: o próximo chat volta a pedir.`);
  linhas.push('');
}

// Aulas cuja avaliação espera porque o avaliador não achou o Claude Code (trilha.js, semClaude). Como o login, só o
// aluno resolve, e vem antes de tudo (20/10): na linha de pendência comum o tutor abria a aula primeiro e só depois
// recebia a instalação. Primeiro o `avaliar`, porque ele pode já ter instalado entre um chat e outro.
const esperaClaude = (r) => !r.avaliada_em && Boolean(r.avaliacao_adiada) && /não encontrei o (Claude Code|comando `claude`)/.test(r.avaliacao_adiada.motivo || '');
function semClaude(e, linhas, codex) {
  if (codex) return;
  // A aula da vez ainda aberta fica para o fechamento dela, como na linha de pendência comum.
  const ids = Object.entries(e.aulas || {}).filter(([id, r]) => esperaClaude(r) && (r.status === 'concluida' || id !== e.aula_atual)).map(([id]) => id);
  if (!ids.length) return;
  linhas.push(`Antes de tudo, inclusive da escolha de aula: a avaliação ${ids.length > 1 ? 'das aulas' : 'da aula'} ${ids.join(', ')} espera porque esta máquina não tinha o Claude Code da linha de comando, que é quem avalia as aulas. No seu primeiro turno, cumprimente em uma linha e rode ${ids.map((id) => `\`node .claude/scripts/trilha.js avaliar ${id}\``).join(' e ')}. Se registrar, siga sem comentar. Se disser de novo que não encontrou o Claude Code, faça o que ele disser antes de abrir a aula: é a instalação, uma vez só, com o aluno.`);
  linhas.push('');
}

// Duas frentes abertas e o chat ainda sem escolha: o resumo inteiro vira a
// pergunta, e nada de aula aparece. O `seguir` imprime o resumo da escolhida.
function escolhaDeFrente(e, linhas, codex) {
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
  pendencias(e, linhas, codex);
  const memoria = notas.paraContexto();
  if (memoria) { linhas.push(''); linhas.push(memoria); }
  linhas.push('');
  linhas.push(codex
    ? `Antes de responder ao aluno, ${lerSkill('tutor')}, e só ela. Não leia skill de aula antes do \`seguir\`.`
    : 'Antes de responder ao aluno, invoque só a skill `tutor`. Não carregue skill de aula antes do `seguir`.');
  return linhas.join('\n');
}

function rotuloDe(a) {
  return a.tipo === 'pratica' ? 'Prática atual' : a.tipo === 'quiz' ? 'Quiz atual' : 'Aula atual';
}

// A linha de continuação só vale para o chat do outro agente que fechou há menos de 12 horas (20/10): passado
// disso, o aluno volta noutro dia, e o tutor de agora apresenta a aula como em qualquer retomada. `fim` é o último
// sinal daquela sessão (ISO). Quem chama confere aqui antes de passar o `continuacaoDe`.
const CONTINUACAO_MS = 12 * 3600000;
function continuacaoRecente(fim) {
  const t = Date.parse(fim);
  return Number.isFinite(t) && Date.now() - t < CONTINUACAO_MS;
}

// O chat retomado de uma aula que já fechou, em outro chat ou no outro agente (21/10). Na retomada o aplicativo só
// roda o hook de envio, e o tutor desse chat vê a conversa antiga com a aula aberta: sem esta linha ele seguia nela,
// e disse ao aluno que a aula não tinha terminado. Null quando não há o que avisar. O texto não nomeia o outro agente:
// o tutor repassa a frase ao aluno, e o aluno de cada agente só ouve falar do seu.
function avisoAulaFechada(e, idAula) {
  const reg = idAula && e.aulas ? e.aulas[idAula] : null;
  if (!reg || reg.status !== 'concluida' || idAula === e.aula_atual) return null;
  let titulo = '';
  try { titulo = mapa.aula(idAula).titulo ? ` (${mapa.aula(idAula).titulo})` : ''; } catch { /* sem título */ }
  const quando = reg.concluida_em ? ` em ${new Date(reg.concluida_em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}` : '';
  return `(Sala: a aula ${idAula}${titulo} deste chat já foi concluída${quando}, em outro chat; a conversa acima é de antes disso. Diga ao aluno, em uma frase, que ela está fechada e que a próxima começa num chat novo na pasta da sala. Aqui não retome a matéria dela nem registre nada nela; dúvida sobre ela, pode responder.)`;
}

// `agente` e `continuacaoDe` são do modo Codex (branch codex). Com o padrão, o texto é o de hoje, letra a letra.
// `continuacaoDe` é a sessão de outro agente que veio antes deste chat ({ agente, aula }, de lib/codex/sessao.js e
// do hooks/inicio.js): a aula que começou num agente e segue no outro ganha a linha com os marcos já feitos.
function resumo(e, { fonte = 'startup', agente = 'claude', continuacaoDe = null } = {}) {
  const codex = agente === 'codex';
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

  if (!acesso.conectado(e)) return portaFechada(e, a, linhas, codex);

  const conferido = e.acesso.verificado_em ? '' : ' (token ainda não conferido pelo servidor; confere sozinho no próximo envio, não comente)';
  linhas.push(`Aluno: ${e.aluno.nome || 'sem nome'}${e.aluno.email ? ` (${e.aluno.email})` : ''}. Conectado à 202${conferido}.`);
  semLogin(e, linhas);
  semClaude(e, linhas, codex);
  if (e.sessao_atual && e.sessao_atual.escolha && !e.sessao_atual.escolha.feita) return escolhaDeFrente(e, linhas, codex);

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
    // A troca de agente no meio da aula (o limite do Claude acabou na 1.7): o tutor de agora não viu o chat de antes.
    if (continuacaoDe && continuacaoDe.aula === a.id && continuacaoDe.agente !== agente && reg.status !== 'concluida' && !emCorrecao) {
      const onde = continuacaoDe.agente === 'codex' ? 'no Codex' : 'no Claude Code';
      linhas.push(`Continuação: ${a.tipo === 'pratica' ? 'esta prática' : 'esta aula'} começou ${onde}, num chat que fechou antes deste; marcos feitos: ${fechados.length ? fechados.map((m) => m.id).join(', ') : 'nenhum ainda'}. Siga do primeiro pendente, sem refazer o que já foi fechado e sem apresentar a aula de novo.`);
    }
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
        linhas.push(`Fluência: ${reg.fluencia ? (reg.fluencia.passou ? `passou em ${reg.fluencia.tentativas} tentativa(s)` : (reg.fluencia.tentativas >= 2 ? `não passou em ${reg.fluencia.tentativas} tentativas; não refaça: feche a aula com o que falta (marcos, nota, concluir e, por último, avaliar)` : reg.fluencia.seguiu_em ? 'não passou em 1 tentativa e ele escolheu seguir; não refaça: feche a aula com o que falta (marcos, nota, concluir e, por último, avaliar)' : `não passou em 1 tentativa, o que faltou já foi explicado, e ele ainda não escolheu: pergunte se quer tentar de novo ou seguir (\`fluencia ${a.id} seguir\`)`)) : 'não feita'}.`);
        if (mapa.fluenciaPeloConjunto(a.id) && (!reg.fluencia || (!reg.fluencia.passou && reg.fluencia.tentativas < 2 && !reg.fluencia.seguiu_em))) linhas.push(FLUENCIA_PELO_CONJUNTO);
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
  if (p0 && p0.pasta) linhas.push(`P0: ${p0.pasta}${p0.url ? ' — no ar em ' + p0.url : ' (ainda não está no ar)'}${p0.repo ? ' — ' + p0.repo : ' (sem repositório no GitHub)'}`);
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

  // A P3 chama um modelo pela API, e o provedor é escolha do aluno (09/10; de
  // 05/10 até ali era só gratuito): Gemini ou Groq no gratuito, Claude Haiku pela
  // API paga da Anthropic, ou outro. A regra mora aqui, no estado, porque vale da
  // 3.3 à P3 e o tutor não pode empurrar provedor nem afirmar preço de cabeça.
  // No M6 a mesma regra vale para a feature da P6, que parte do motor da P3 por
  // padrão; e o Stripe, que entra na 6.1, roda sem ninguém pagar nada.
  if (['6.1', '6.2', 'P6'].includes(a.id) && !emCorrecao) {
    linhas.push('Stripe da P6: conta brasileira, sandbox geral criada no painel na 6.1, nunca ativada. Ninguém paga nada nem ativa conta: não sugira informar documento, conta bancária ou cartão, nem criar conta de outro país. A assinatura é em cartão de teste; o Pix Automático não existe para conta brasileira na Stripe, e o pagamento pendente se testa com boleto. Forma de pagamento, nome de tela e sandbox mudam: não afirme de cabeça; as páginas estão nas referências da 6.1.');
  }
  if ((a.modulo === 3 && !['3.1', '3.2', 'Q3'].includes(a.id) || a.modulo === 6 && a.id !== 'Q6') && !emCorrecao) {
    linhas.push((a.modulo === 6 ? 'API da feature (se a P6 usa IA, como na P3): a chave' : 'API da P3: a chave') + ' é do provedor que ele escolheu na 3.3: o Gemini ou o Groq no plano gratuito, o Claude Haiku pela API paga da Anthropic (créditos comprados antes; o plano Pro do Claude não inclui a API, o Max e o Team trazem um crédito mensal), ou outro. A escolha é dele: não empurre provedor nem plano. No pago, ele compra pouco crédito e deixa a recarga automática desligada. Seja qual for, cada chamada vai para o log com os tokens, e o custo por mensagem em reais sai desse log e da tabela de preço pago do modelo, com a data; no gratuito é quanto custaria, no pago tem de bater com o gasto do painel do provedor. Quando o sistema bater no limite do provedor (erro de limite de requisições ou de tokens), isso é matéria, não defeito da conta: espere a janela ou diminua as chamadas (trocar de modelo só fora de uma rodada de eval, que compara no mesmo modelo), e o sistema dele precisa tratar esse erro sem quebrar a tela. Preço e limites mudam: não afirme número de cabeça; estão no painel do provedor dele, que ele abre no navegador, e as páginas de preço e de limites estão nas referências da 3.4.');
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

  pendencias(e, linhas, codex);

  // A memória do aluno entra inteira: são no máximo sete linhas e é o que
  // permite retomar o fio pessoal entre aulas separadas por dias.
  const memoria = notas.paraContexto();
  if (memoria) { linhas.push(''); linhas.push(memoria); }

  linhas.push('');
  const skillDaVez = emCorrecao ? 'corrigir' : (a.skill || 'tutor');
  if (fonte === 'compact') {
    linhas.push('Contexto foi compactado no meio da sessão. Continue a aula de onde estava, sem reapresentação. Os milestones acima são a verdade sobre o que já foi fechado.');
    // No Codex a skill é a saída de um comando de leitura, e o resumo da conversa compactada pode não guardá-la: sem
    // ela o tutor seguiria a aula sem as regras dela.
    if (codex && !fimDoMapa) linhas.push(`Se as instruções das skills não estão mais com você, ${lerSkill('tutor')}, e depois ${lerSkill(skillDaVez)}${mapa.escrita(a) ? '' : ', se ele existir'}.`);
  } else {
    if (fimDoMapa) linhas.push(codex ? `Antes de responder ao aluno, ${lerSkill('tutor')}, e só ela. Não leia skill de aula.` : 'Antes de responder ao aluno, invoque só a skill `tutor`. Não carregue skill de aula.');
    // Na volta a um chat (21/10), a leitura costuma já estar na conversa: ler de novo a cada volta gasta o limite do
    // plano do aluno, que no gratuito é pequeno.
    else if (codex) linhas.push(`Antes de responder ao aluno, ${lerSkill('tutor')}, e depois ${lerSkill(skillDaVez)}${mapa.escrita(a) ? '' : ', se ele existir'}. Não leia skills de outras aulas.${fonte === 'resume' ? ' Se esta conversa já tem as duas lidas, não leia de novo: siga por elas.' : ''}`);
    else linhas.push('Antes de responder ao aluno, invoque a skill `tutor` e depois a skill `' + (emCorrecao ? 'corrigir' : (a.skill || 'tutor')) + '`' + (mapa.escrita(a) ? '' : ' se ela existir') + '. Não carregue skills de outras aulas.');
    if (a.tipo === 'quiz' && reg.status === 'em_andamento' && quiz.respondidas(reg)) {
      linhas.push('Retomada: cumprimente em uma linha e imprima a pergunta da vez. Não repita as já respondidas nem a correção delas.');
    } else if (reg.status === 'em_andamento' && a.tipo === 'aula' && Array.isArray(a.milestones) && a.milestones.every((m) => reg.milestones[m.id]) && (!a.fluencia || (reg.fluencia && (reg.fluencia.passou || reg.fluencia.tentativas >= 2 || reg.fluencia.seguiu_em)))) {
      // Tudo registrado e a aula aberta: o chat anterior parou no fechamento (o
      // limite de uso bateu, a janela fechou). Não se refaz a aula: só se fecha.
      // A fluência que não passou e já fecha a aula (duas tentativas, ou a escolha de seguir, 21/10) também conta.
      linhas.push('Retomada no fechamento: os marcos' + (a.fluencia ? ' e a fluência' : '') + ' já estão registrados, e o chat anterior parou antes de fechar a aula. Cumprimente em uma linha, diga que falta só fechar a aula e feche como a `tutor` manda, sem reabrir a matéria' + (a.avaliacao === false ? '' : reg.avaliada_em ? ' (a avaliação já está registrada: não rode o `avaliar` de novo)' : ': o `avaliar` lê também o chat anterior') + '.');
    } else if (reg.status === 'em_andamento' && a.tipo === 'aula' && a.fluencia && reg.fluencia && !reg.fluencia.passou && Array.isArray(a.milestones) && a.milestones.every((m) => reg.milestones[m.id])) {
      // A primeira fluência não passou e o chat parou antes da escolha (21/10): não há marco pendente para continuar.
      linhas.push('Retomada na fluência: os marcos e a primeira tentativa já estão registrados. Cumprimente em uma linha e siga a linha da fluência acima, sem reabrir a matéria.');
    } else if (reg.status === 'em_andamento' && Object.keys(reg.milestones).length) {
      linhas.push('Retomada: cumprimente em uma linha, diga onde parou e continue do primeiro milestone pendente. Não repita o que já foi fechado.');
    }
    if (emCorrecao) {
      linhas.push(codex ? 'A skill da prática não se lê nesta fase.' : 'A skill da prática não se carrega nesta fase.');
    }
  }
  return linhas.join('\n');
}

module.exports = { resumo, passosLogin, passosInstalar, ehDoAplicativo, continuacaoRecente, avisoAulaFechada, avaliacoesPendentes, comandoAvaliar };
