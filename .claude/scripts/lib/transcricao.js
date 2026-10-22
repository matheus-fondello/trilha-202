'use strict';
// A transcrição da sessão, em texto, para o avaliador ler.
//
// Quem avalia a aula não é quem a conduziu (ver lib/avaliador.js): o segundo
// Claude não tem memória nenhuma da conversa, então a conversa precisa chegar
// inteira até ele. O Claude Code já a grava num .jsonl por sessão; o que falta
// é virar texto legível.
//
// O que entra: o que o aluno escreveu, o que o tutor respondeu e os comandos do
// harness com a resposta curta deles (é onde se vê milestone e fluência).
// O que fica de fora: o raciocínio do tutor (não é evidência sobre o aluno e
// dobra o tamanho), os system-reminder e o resto do encanamento.
const fs = require('fs');
const os = require('os');
const path = require('path');
const paths = require('./paths');
const conversas = require('./conversas');

// ~60 mil tokens. A transcrição vai inteira no prompt do avaliador, e é ela que
// determina o custo da avaliação; aula de uma hora cabe com folga.
const LIMITE = 240000;

// O Claude Code guarda as transcrições em ~/.claude/projects/<caminho achatado>,
// e achata trocando todo caractere que não é letra ASCII ou dígito por hífen: no
// Windows `C:\Users\x` vira `C--Users-x`, e "Área" vira "-rea".
function pastaDoProjeto(raiz = paths.RAIZ) {
  return path.join(os.homedir(), '.claude', 'projects', raiz.replace(/[^A-Za-z0-9]/g, '-'));
}

// Na ordem: o caminho que o hook recebeu do Claude Code (é o exato), o arquivo
// com o id da sessão, e por último o mais recente da pasta. Os dois últimos são
// rede de segurança para sessão que começou antes desta versão do harness.
function localizar(s) {
  if (!s) return null;
  if (s.transcricao && fs.existsSync(s.transcricao)) return s.transcricao;
  const dir = pastaDoProjeto();
  if (s.id) {
    const p = path.join(dir, `${s.id}.jsonl`);
    if (fs.existsSync(p)) return p;
  }
  // O original sumiu (fechar o chat pelo X do aplicativo o apaga): a cópia que a sala guardou (lib/conversas.js).
  return s.id ? conversas.achar(s.id) : null;
}

function maisRecente() {
  try {
    const r = fs.readdirSync(pastaDoProjeto())
      .filter((f) => f.endsWith('.jsonl'))
      .map((f) => path.join(pastaDoProjeto(), f))
      .map((f) => ({ f, t: fs.statSync(f).mtimeMs }))
      .sort((a, b) => b.t - a.t)[0];
    return r ? r.f : null;
  } catch {
    return null;
  }
}

// Os instantes em que a aula deixou rastro, e de quando a quando uma conversa existiu (lib/horario.js).
const { marcasDaAula, janelaDoArquivo } = require('./horario');

// A aula sem nenhum chat etiquetado com ela (19/10): o aluno a fez no chat de outra, antes do `emendar`, ou em
// pasta que o estado não conhece. O "mais recente da pasta" avaliava a conversa errada (um aluno teve a 1.1 lida em
// cima de outro chat e a nota saiu inválida). Valem as conversas da sala que existiam quando a aula deixou rastro.
// Devolve null quando a aula não tem rastro nenhum no estado, e aí não há com o que comparar.
const FOLGA_MS = 2 * 60 * 1000;
function porHorario(e, idAula) {
  const marcas = marcasDaAula(e, idAula);
  if (!marcas.length) return null;
  // A folga é só depois do fim: as marcas nascem dentro do chat, e antes do início ela puxaria o chat seguinte,
  // aberto logo depois do `concluir`.
  const cobre = (j) => j && marcas.some((t) => t >= j.inicio && t <= j.fim + FOLGA_MS);
  // A janela que o estado guarda de cada chat (início e fim, ou a última atividade do aberto) e, para as conversas da
  // pasta que o estado não conhece, a do próprio arquivo.
  const janelaDoRegistro = (s) => {
    const inicio = Date.parse(s.inicio);
    const fim = Date.parse(s.fim || s.ultima_atividade || '') || Date.now();
    return Number.isNaN(inicio) ? null : { inicio, fim };
  };
  const achados = new Map();
  for (const s of [...(e.sessoes || []), e.sessao_atual].filter(Boolean)) {
    const f = localizar(s);
    const j = janelaDoRegistro(s);
    if (f && cobre(j) && !achados.has(f)) achados.set(f, j.inicio);
  }
  let daPasta = [];
  try { daPasta = fs.readdirSync(pastaDoProjeto()).filter((f) => f.endsWith('.jsonl')).map((f) => path.join(pastaDoProjeto(), f)); } catch { /* sem pasta */ }
  // As cópias da sala (lib/conversas.js) entram só pelo chat cujo original sumiu: a mesma conversa não entra duas vezes.
  const ids = new Set([...achados.keys(), ...daPasta].map((f) => path.basename(f, '.jsonl')));
  for (const f of [...daPasta, ...conversas.todas().filter((c) => !ids.has(path.basename(c, '.jsonl')))]) {
    if (achados.has(f)) continue;
    const j = janelaDoArquivo(f);
    if (cobre(j)) achados.set(f, j.inicio);
  }
  // Com o Codex no estado (branch codex), as conversas dele também são fontes: as do registro e as da pasta do Codex
  // abertas na sala, cada uma lida depois com o seu conversor. Um aluno só do Claude não tem `e.codex`.
  if (e.codex) for (const [f, inicio] of require('./codex/transcricao').doHorario(e, cobre, janelaDoArquivo, achados.keys())) achados.set(f, inicio);
  return [...achados].sort((a, b) => a[1] - b[1]).map(([f]) => f);
}

// O pedaço da conversa que é desta aula, quando o registro do Codex o guarda (branch codex): na recuperação, um chat
// que fez duas aulas vira duas sessões, `<chat>#<aula>`, sobre o mesmo arquivo.
function trechoDe(e, s, idAula) {
  const chats = e.codex && e.codex.chats;
  if (!chats || !s || typeof s.id !== 'string') return null;
  const c = chats[s.id.split('#')[0]];
  const t = c && c.trechos && c.trechos[idAula];
  return t && typeof t === 'object' ? t : null;
}

// Uma aula longa pode acontecer em dois chats, e o avaliador precisa da aula
// inteira: cada sessão tem a sua transcrição, e elas entram na ordem em que
// aconteceram. A sessão aberta é a última — é ela que está acontecendo agora.
// Cada fonte é `{ arquivo, trecho }`; o trecho só existe no Codex.
function fontesDaAula(e, idAula, { semFallback = false } = {}) {
  // `aulas`: o chat em que o aluno emendou a aula seguinte é das duas (estado.emendar).
  const atende = (s) => s.aula === idAula || (s.aulas || []).includes(idAula);
  const daSessao = (s) => ({ arquivo: localizar(s), trecho: trechoDe(e, s, idAula) });
  // As fechadas na ordem em que cada chat começou (21/10): quem volta a um chat antigo da aula tira a sessão dele do
  // histórico, e ela volta no fim quando fecha de novo. Registro antigo sem o início fica na ordem do histórico. A
  // aberta continua por último: é nela que a aula está fechando, e o corte do fechamento e o da transcrição longa
  // contam com isso.
  const fechadas = (e.sessoes || []).filter(atende);
  const comInicio = fechadas.every((s) => s.inicio && !Number.isNaN(Date.parse(s.inicio)));
  const ordenadas = comInicio ? fechadas.map((s, i) => [s, i]).sort((a, b) => (Date.parse(a[0].inicio) - Date.parse(b[0].inicio)) || (a[1] - b[1])).map(([s]) => s) : fechadas;
  const atual = e.sessao_atual && atende(e.sessao_atual) ? e.sessao_atual : null;
  const lista = [...ordenadas, atual].filter(Boolean).map(daSessao).filter((f) => f && f.arquivo);
  const vistos = new Set();
  const unicos = lista.filter((f) => {
    const chave = f.arquivo + '\u0000' + JSON.stringify(f.trecho);
    if (vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
  const soArquivos = (l) => l.map((arquivo) => ({ arquivo, trecho: null }));
  // Nenhuma sessão etiquetada: harness antigo ou estado mexido à mão. Melhor a
  // sessão mais recente desta pasta do que avaliação nenhuma. Quem lê a conversa
  // de outro chat (o `conversa` da correção) pede sem isso: o mais recente seria
  // o próprio chat dele.
  if (!unicos.length && semFallback) return [];
  if (!unicos.length) {
    // A aula deixou rastro: a conversa é a que existia naquela hora, e nenhuma é melhor que a errada.
    const doHorario = porHorario(e, idAula);
    if (doHorario) return soArquivos(doHorario);
    // No modo Codex, só a conversa do próprio chat: a mais recente de ~/.claude/projects seria a de outra aula.
    const agente = require('./agente');
    if (agente.atual() === 'codex') return soArquivos(require('./codex/transcricao').doProprioChat(agente.idDoChat()));
    const ultimo = localizar(e.sessao_atual) || maisRecente();
    return ultimo ? [{ arquivo: ultimo, trecho: null }] : [];
  }
  return unicos;
}

function arquivosDaAula(e, idAula, opcoes = {}) {
  return [...new Set(fontesDaAula(e, idAula, opcoes).map((f) => f.arquivo))];
}

function limpar(texto) {
  // system-reminder e afins são encanamento do Claude Code, não fala de ninguém.
  return String(texto)
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
    .replace(/<command-[a-z-]+>[\s\S]*?<\/command-[a-z-]+>/g, '')
    .replace(/<local-command-stdout>[\s\S]*?<\/local-command-stdout>/g, '')
    .trim();
}

// O token da 202 é colado no chat na 0.1 e passa pelo `conectar`. Ele não diz
// nada sobre o aluno, e o que o avaliador lê pode voltar como evidência e subir
// ao CRM: sai antes.
function semToken(texto) {
  return String(texto)
    .replace(/(TRILHA_202_TOKEN\s*=\s*)\S+/g, '$1[token omitido]')
    .replace(/(\btoken=)\S+/g, '$1[token omitido]');
}

// Quem lê precisa saber de onde veio cada trecho de uma fala do aluno: o que ele
// digitou, o que ele colou e o que ele anexou. Sem isso, o terminal colado e a
// saída do agente na oficina chegavam como "ALUNO:", iguais ao que ele escreveu,
// e uma evidência "literal do que o aluno disse" podia ser texto do agente
// (Raio-X de 05/10, achado 05). Medido na 1.2: 91% do que vinha rotulado como
// ALUNO era terminal, CLAUDE.md ou saída do agente.
//
// O Claude Code marca as duas coisas que dá para saber com certeza: o bloco
// colado (`<pasted_content>`) e o anexo do terminal do app (`<!-- attach: ... -->`
// seguido de linhas com `>`). Um bloco longo sem marca pode ser as duas coisas, e
// é dito assim, sem afirmar mais do que se sabe.
const LONGO = 700;
const COLADO = /<pasted_content[^>]*>([\s\S]*?)<\/pasted_content[^>]*>/g;
const ANEXO = /<!--\s*attach:\s*([^|>]*?)\s*(?:\|[^>]*)?-->/;

function rotulo(tipo, nome) {
  if (tipo === 'colou') return 'ALUNO (colou)';
  if (tipo === 'anexou') return `ALUNO (anexou ${String(nome || 'arquivo').toLowerCase()})`;
  if (tipo === 'longo') return 'ALUNO (texto longo, talvez colado)';
  return 'ALUNO';
}

// O que sobra depois de tirar os blocos colados: o que ele digitou, e um anexo
// de terminal se houver um (as linhas `>` logo depois da marca).
function trechosDigitados(texto, out) {
  let resto = texto;
  for (;;) {
    const m = resto.match(ANEXO);
    if (!m) break;
    const antes = resto.slice(0, m.index).trim();
    if (antes) out.push({ tipo: 'digitou', texto: antes });
    const linhas = resto.slice(m.index + m[0].length).replace(/^\r?\n/, '').split(/\r?\n/);
    let n = 0;
    while (n < linhas.length && /^>/.test(linhas[n])) n++;
    const anexo = linhas.slice(0, n).map((l) => l.replace(/^> ?/, '')).join('\n').trim();
    if (anexo) out.push({ tipo: 'anexou', nome: m[1] || 'arquivo', texto: anexo });
    resto = linhas.slice(n).join('\n');
  }
  resto = resto.trim();
  if (resto) out.push({ tipo: resto.length > LONGO ? 'longo' : 'digitou', texto: resto });
}

function segmentos(texto) {
  const out = [];
  let ultimo = 0;
  for (const m of texto.matchAll(COLADO)) {
    trechosDigitados(texto.slice(ultimo, m.index), out);
    const colado = m[1].trim();
    if (colado) out.push({ tipo: 'colou', texto: colado });
    ultimo = m.index + m[0].length;
  }
  trechosDigitados(texto.slice(ultimo), out);
  return out;
}

function umaLinha(texto, max) {
  const t = String(texto).replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max) + '…' : t;
}

// Os nomes da lista de entrevistas (a da 4.4) são de terceiros e ficam só nesta
// máquina. A transcrição vai ao avaliador, e as evidências dele sobem literais:
// os nomes saem antes, trocados por [nome], na fala do aluno, no comando `ideia`
// e na saída dele. Sai o item inteiro, o nome sem o parêntese ("Ana Souza
// (prima)") e cada parte com três letras ou mais, que é como ele vai aparecer na
// conversa: "falei com a Ana".
const PARTICULAS = new Set(['de', 'da', 'do', 'das', 'dos', 'di', 'del', 'van', 'von']);
function tiradorDeNomes(e) {
  const i = (e && e.ideia) || {};
  const termos = new Set();
  for (const bruto of [...(i.nomes || []), ...(i.nomes_vistos || [])]) {
    const nome = String(bruto).trim();
    if (!nome) continue;
    termos.add(nome);
    const sem = nome.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    if (sem) termos.add(sem);
    for (const parte of sem.split(/\s+/)) if (parte.length >= 3 && !PARTICULAS.has(parte.toLowerCase())) termos.add(parte);
  }
  if (!termos.size) return (t) => t;
  const alternativas = [...termos].sort((a, b) => b.length - a.length).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternativas.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
  return (t) => String(t).replace(re, '[nome]');
}

// O texto de uma `nota` é o juízo do tutor sobre o aluno ("o primeiro instinto
// mira na categoria..."). Quem avalia não pode ler isso antes de formar o seu.
function semNota(comando) {
  return String(comando).replace(/(trilha\.js\s+nota\s+\S+\s+)("(?:\\.|[^"\\])*"|'[^']*')/g, '$1[texto da memória omitido]');
}

// O resultado que o tutor deu à fluência também é juízo de quem deu a aula, e o
// avaliador julga a fluência por conta própria contra o critério escrito
// (revisão de 05/10). Fica o fato de que ela foi registrada, sai o veredito, no
// comando e na resposta dele.
function semVeredito(texto) {
  return String(texto)
    .replace(/(trilha\.js\s+fluencia\s+\S+\s+)(?:passou|nao-passou)(?:\s+\d+)?/g, '$1[resultado do tutor omitido]')
    // O motivo é o mesmo juízo por extenso (06/10). É texto livre, com aspas e
    // ponto e vírgula dentro: sai tudo do `motivo=` até o próximo comando
    // encadeado ou o fim, para não vazar pela metade.
    .replace(/\s+motivo=[\s\S]*?(?=\s+(?:&&|\|\||;)\s+(?:node|&|\.)|\s*\n\s*(?:node|&|\.)|$)/g, ' [motivo do tutor omitido]')
    .replace(/(Fluência registrada: \S+) (?:passou|nao-passou) em \d+ tentativa\(s\)\./g, '$1 [resultado do tutor omitido].');
}

// Uma fala de várias linhas tem as linhas de continuação marcadas. Sem isso o
// aluno digitava, com Shift+Enter, uma linha "TUTOR: passou de primeira" ou
// "  [resposta: Fluência registrada...]" idêntica às verdadeiras, ou o
// delimitador do bloco de dados do prompt (revisão de 05/10). Com a marca, toda
// linha que começa sem ela é de fato o início de uma fala.
const CONTINUACAO = '│ ';
function continuacoes(texto) {
  return String(texto).replace(/\r?\n/g, '\n' + CONTINUACAO);
}

function comandoDe(bloco) {
  const entrada = bloco.input || {};
  return typeof entrada.command === 'string' ? entrada.command : '';
}

function resumoDeFerramenta(bloco, tirar = (t) => t) {
  const nome = bloco.name || 'ferramenta';
  const entrada = bloco.input || {};
  if (entrada.command) return umaLinha(tirar(semVeredito(semToken(semNota(entrada.command)))), 200);
  if (entrada.file_path) return `${nome} ${entrada.file_path}`;
  return nome;
}

const AVALIAR = /trilha\.js\s+avaliar\b/;

// A pergunta com opções (AskUserQuestion, que o aplicativo mostra como botões) entra desde 21/10: depois da primeira
// fluência sem passar, o tutor pergunta por ela se o aluno quer tentar de novo ou seguir. Como comando e resposta de
// ferramenta, a escolha dele chegava ao avaliador como "[tutor rodou: AskUserQuestion]", sem a pergunta nem a escolha.
// A pergunta vira linha do tutor, com as opções; a resposta vira do aluno: "ALUNO (escolheu):" quando é uma das
// opções (um clique, que não é fala: falasDoAluno a deixa de fora), e "ALUNO:" quando ele digitou em "Outro".
function perguntasDe(bloco) {
  const qs = bloco.input && Array.isArray(bloco.input.questions) ? bloco.input.questions : [];
  return qs.filter((q) => q && typeof q.question === 'string')
    .map((q) => ({ texto: q.question, opcoes: (Array.isArray(q.options) ? q.options : []).map((o) => String((o && o.label) || '')).filter(Boolean) }));
}

// A resposta de cada pergunta: do registro estruturado do Claude Code (`toolUseResult.answers`, pergunta → resposta)
// ou, sem ele, do texto do resultado ('... "<pergunta>"="<resposta>", ...'). Pergunta recusada ou sem resposta: nada,
// e o resultado segue o caminho de qualquer ferramenta.
function respostasDe(ev, bloco, perguntas) {
  const estruturadas = ev.toolUseResult && ev.toolUseResult.answers && typeof ev.toolUseResult.answers === 'object' ? ev.toolUseResult.answers : null;
  const c = typeof bloco.content === 'string' ? bloco.content : blocos(bloco.content).map((x) => x.text || '').join(' ');
  const out = [];
  for (const q of perguntas) {
    let r = estruturadas && typeof estruturadas[q.texto] === 'string' ? estruturadas[q.texto] : null;
    if (r === null) {
      const marca = `"${q.texto}"="`;
      const i = c.indexOf(marca);
      const m = i < 0 ? null : c.slice(i + marca.length).match(/^([\s\S]*?)"(?=, "|\.\s|\.?$)/);
      if (m) r = m[1];
    }
    if (r === null || !r.trim()) continue;
    // Com várias marcadas, o Claude Code junta as opções com vírgula.
    const escolheu = q.opcoes.includes(r) || r.split(', ').every((x) => q.opcoes.includes(x));
    out.push({ texto: r.trim(), escolheu });
  }
  return out;
}

function blocos(conteudo) {
  if (typeof conteudo === 'string') return [{ type: 'text', text: conteudo }];
  return Array.isArray(conteudo) ? conteudo : [];
}

// Uma linha por fala. O avaliador precisa saber quem disse o quê e em que ordem;
// não precisa de timestamp, uuid nem do resto do envelope.
//
// O fechamento do tutor fica de fora. A `tutor` manda escrever o feedback e a
// despedida e só então rodar `avaliar`; esse feedback é o veredito de quem deu a
// aula ("passou, você cortou pelo critério certo"), e lido antes ele vira a nota.
// Medido na 1.2 de 05/10: sem ele, o elogio do tutor deixou de virar um 5 em
// pensamento. Sai o texto do tutor entre a última fala do aluno e o último
// `avaliar`, e tudo o que ele disse depois; as perguntas e explicações ficam,
// porque são o contexto das respostas.
function converter(bruto, tirar = (t) => t) {
  const itens = [];
  // As perguntas com opções, pelo id da chamada, para achar a resposta de cada uma.
  const perguntas = new Map();
  for (const linha of bruto.split('\n')) {
    if (!linha.trim()) continue;
    let ev;
    try { ev = JSON.parse(linha); } catch { continue; }
    if (ev.isMeta || ev.isSidechain) continue;
    // A mensagem de erro da API ("You've hit your session limit · resets ...")
    // vem como fala do assistente. Não é do tutor nem do aluno: vira uma marca, e
    // o "continue" que o aluno manda depois do limite fica com contexto.
    if (ev.isApiErrorMessage) {
      itens.push({ quem: 'aviso', linha: `  [o Claude Code parou aqui${ev.error === 'rate_limit' ? ', no limite de uso da conta' : ', por erro da API'}; não é fala do tutor nem falta do aluno]` });
      continue;
    }
    const msg = ev.message;
    if (!msg || (ev.type !== 'user' && ev.type !== 'assistant')) continue;
    for (const b of blocos(msg.content)) {
      if (b.type === 'text') {
        const texto = tirar(semToken(limpar(b.text)));
        if (!texto) continue;
        if (ev.type === 'user') {
          for (const s of segmentos(texto)) itens.push({ quem: 'ALUNO', linha: `${rotulo(s.tipo, s.nome)}: ${continuacoes(s.texto)}` });
        } else itens.push({ quem: 'TUTOR', linha: `TUTOR: ${continuacoes(texto)}` });
      } else if (b.type === 'image' && ev.type === 'user') {
        // A imagem não chega ao avaliador, mas o fato de ela existir chega: na 1.3
        // o screenshot é a evidência pedida, e sumir com ele sem marca pesava
        // contra o aluno em esforço (achado 06).
        itens.push({ quem: 'ALUNO', linha: 'ALUNO: [anexou uma imagem, que não chega a esta transcrição]' });
      } else if (b.type === 'tool_use' && b.name === 'AskUserQuestion' && perguntasDe(b).length) {
        if (b.id) perguntas.set(b.id, perguntasDe(b));
        // Fora do fechamento que o corte omite: a pergunta é neutra, e é o contexto da escolha.
        for (const q of perguntasDe(b)) {
          itens.push({ quem: 'pergunta', linha: `TUTOR: [perguntou com opções: ${q.opcoes.map((o) => umaLinha(tirar(o), 80)).join(' | ')}] ${continuacoes(tirar(semToken(q.texto)))}` });
        }
      } else if (b.type === 'tool_use') {
        itens.push({ quem: 'cmd', avaliar: AVALIAR.test(comandoDe(b)), linha: `  [tutor rodou: ${resumoDeFerramenta(b, tirar)}]` });
      } else if (b.type === 'tool_result' && perguntas.has(b.tool_use_id) && respostasDe(ev, b, perguntas.get(b.tool_use_id)).length) {
        // A escolha conta como uma fala do aluno para o corte do fechamento, como a resposta digitada contaria: o que o
        // tutor disse antes dela (o que faltou na fluência) fica, e só o que vem depois é fechamento.
        for (const r of respostasDe(ev, b, perguntas.get(b.tool_use_id))) {
          const texto = tirar(semToken(r.texto));
          itens.push({ quem: 'ALUNO', linha: `${r.escolheu ? 'ALUNO (escolheu)' : rotulo(texto.length > LONGO ? 'longo' : 'digitou')}: ${continuacoes(texto)}` });
        }
      } else if (b.type === 'tool_result') {
        const c = typeof b.content === 'string' ? b.content : blocos(b.content).map((x) => x.text || '').join(' ');
        const texto = tirar(semVeredito(semToken(limpar(c))));
        if (texto) itens.push({ quem: 'resp', linha: `  [resposta: ${umaLinha(texto, 200)}]` });
      }
      // thinking fica de fora: é raciocínio do tutor, não evidência sobre o aluno.
    }
  }

  let fim = -1;
  for (let i = itens.length - 1; i >= 0; i--) if (itens[i].avaliar) { fim = i; break; }
  let inicio = fim;
  while (inicio > 0 && itens[inicio - 1].quem !== 'ALUNO') inicio--;

  const linhas = [];
  let omitiu = false;
  itens.forEach((it, i) => {
    if (fim >= 0 && i >= inicio && it.quem === 'TUTOR') {
      if (!omitiu) linhas.push('TUTOR: [feedback de fechamento e despedida do tutor omitidos]');
      omitiu = true;
      return;
    }
    linhas.push(it.linha);
  });
  return linhas.join('\n');
}

// Transcrição longa demais perde o meio, não o fim: o fechamento da aula é onde
// estão a fluência e as últimas respostas, que é o que mais sustenta nota.
function cortar(texto, limite = LIMITE) {
  if (texto.length <= limite) return texto;
  const metade = Math.floor(limite / 2);
  return texto.slice(0, metade) + '\n\n[...trecho do meio da aula omitido por tamanho...]\n\n' + texto.slice(-metade);
}

function ler(e, idAula, opcoes = {}) {
  // `fechamento`: quem lê é o `avaliar`, no chat que está fechando a aula (ver o conversor do Codex).
  const { limite = LIMITE, semFallback = false, fechamento = false } = typeof opcoes === 'number' ? { limite: opcoes } : opcoes;
  const fontes = fontesDaAula(e, idAula, { semFallback });
  const arquivos = [...new Set(fontes.map((f) => f.arquivo))];
  if (!arquivos.length) return { ok: false, motivo: 'não encontrei a transcrição desta sessão' };
  const tirar = tiradorDeNomes(e);
  const partes = [];
  // A conversa que o sandbox do Codex não deixou abrir (branch codex): é pendência, e não "não consegui ler", que cai
  // na desistência; nem uma transcrição sem um dos chats da aula.
  let bloqueada = false;
  fontes.forEach(({ arquivo, trecho }, i) => {
    let bruto;
    try { bruto = fs.readFileSync(arquivo, 'utf8'); } catch (err) { if (require('./codex/leitura').bloqueada(err)) bloqueada = true; return; }
    // A conversa do Codex começa pelo `session_meta` e tem o conversor dela (branch codex); a aula feita nos dois
    // agentes junta as duas formas, cada uma lida com o seu. O teste barato vem antes, para o Claude não carregar nada.
    const nl = bruto.indexOf('\n');
    const codex = (nl === -1 ? bruto : bruto.slice(0, nl)).includes('"session_meta"') ? require('./codex/transcricao') : null;
    const doCodex = Boolean(codex && codex.eDoCodex(bruto));
    const convertido = doCodex
      ? codex.converter(bruto, tirar, { trecho, aula: idAula, ultimo: fechamento && i === fontes.length - 1 })
      : converter(bruto, tirar);
    if (convertido.trim()) partes.push({ texto: convertido, codex: doCodex });
  });
  if (bloqueada) return { ok: false, sandbox: 'leitura', motivo: require('./codex/leitura').motivo('a conversa desta aula') };
  if (!partes.length) return { ok: false, motivo: 'não consegui ler a transcrição desta sessão' };
  // A aula que passou pelos dois agentes (21/10): cada chat diz em qual foi, porque o plano dela vale com a forma do
  // agente de cada parte, e sem a marca o avaliador aceitava as duas em toda parte. Num agente só, o texto de sempre.
  const misto = new Set(partes.map((p) => p.codex)).size > 1
    || (e.codex && require('./contexto').agenteDaUnidade(e, idAula) === 'ambos');
  const agente = (p) => (p.codex ? 'Codex' : 'Claude Code');
  const texto = cortar(misto
    ? partes.map((p, i) => `[--- ${i ? 'chat seguinte, mesma aula' : 'primeiro chat da aula'}, no ${agente(p)} ---]\n\n${p.texto}`).join('\n\n')
    : partes.map((p) => p.texto).join('\n\n[--- chat seguinte, mesma aula ---]\n\n'), limite);
  // Aula de verdade não cabe em duas linhas. Transcrição curta demais é sessão
  // trocada ou arquivo pela metade, e avaliar isso daria nota baixa por engano.
  if (texto.length < 500) return { ok: false, motivo: 'a transcrição desta sessão está vazia ou curta demais para sustentar uma avaliação' };
  return { ok: true, arquivos, texto, caracteres: texto.length, chats: partes.length };
}

// O que o aluno disse, digitou, colou ou anexou, tirado do texto que o avaliador
// leu. Uma fala começa numa linha `ALUNO...:` e vai até a próxima fala de
// qualquer um; o texto de uma fala pode ter várias linhas.
const INICIO_DE_FALA = /^(ALUNO(?: \([^)]*\))?:|TUTOR:| {2}\[tutor rodou:| {2}\[resposta:|\[--- (?:chat seguinte|primeiro chat)|\[\.\.\.trecho do meio)/;

// Cada fala com a origem: `digitou` (ALUNO:), `colou`, `anexou`, `longo`
// (texto longo, talvez colado) ou `imagem`. A marca de continuação sai.
function falasDoAluno(texto) {
  const falas = [];
  let atual = null;
  const fechar = () => { if (atual) falas.push({ tipo: atual.tipo, texto: atual.linhas.join('\n') }); };
  for (const linha of String(texto).split('\n')) {
    if (INICIO_DE_FALA.test(linha)) {
      fechar();
      const m = linha.match(/^ALUNO(?: \(([^)]*)\))?: ?(.*)$/);
      if (!m) { atual = null; continue; }
      const r = m[1] || '';
      // A escolha numa pergunta com opções é um clique, não fala: não serve de evidência nem de trecho de resposta.
      if (r === 'escolheu') { atual = null; continue; }
      const tipo = !r ?(m[2].startsWith('[anexou uma imagem') ? 'imagem' : 'digitou')
        : r === 'colou' ? 'colou' : r.startsWith('anexou') ? 'anexou' : 'longo';
      atual = { tipo, linhas: [m[2]] };
    } else if (atual) atual.linhas.push(linha.startsWith(CONTINUACAO) ? linha.slice(CONTINUACAO.length) : linha);
  }
  fechar();
  return falas;
}

// Aspas, travessões, reticências e espaços variam entre o que o aluno escreveu e
// o que o modelo devolve sem que ninguém tenha parafraseado nada. Isso não conta.
// Nem as marcas de Markdown: "**Quem abre o WhatsApp ... sem rastro.** A SPEC",
// citado sem os asteriscos, derrubava a correção da P1 do Davi (07/10). As marcas
// saem dos dois lados, então não abrem espaço para trecho inventado.
function normalizar(texto) {
  return String(texto)
    .normalize('NFC')
    .toLowerCase()
    .replace(/[*_`]+/g, '')
    .replace(/[“”«»„]/g, '"')
    .replace(/[‘’´]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

// A evidência é "trecho literal do que o aluno disse ou fez", e o CRM a mostra
// entre aspas como as palavras dele - inclusive na razão de um destaque. Medir
// só o tamanho deixava passar paráfrase e invenção (achado 07). Aqui cada pedaço
// da evidência precisa estar numa fala do aluno; "..." marca um corte, e cada
// lado do corte é conferido sozinho. Pedaço curto demais para dizer alguma coisa
// (uma palavra solta entre dois cortes) não é conferido.
//
// Os pedaços têm de estar na MESMA fala (revisão de 05/10): "A ... B" costurado
// de dois momentos diferentes é uma frase que o aluno nunca disse.
const ROTULO_DE_ORIGEM = /^\((colou|anexou[^)]*|texto longo[^)]*)\)\s*/;

function pedacosDe(evidencia) {
  let ev = normalizar(evidencia).replace(/^aluno(?: \([^)]*\))?:\s*/, '').trim();
  const rotulo = ev.match(ROTULO_DE_ORIGEM);
  if (rotulo) ev = ev.slice(rotulo[0].length).trim();
  ev = ev.replace(/^"(.*)"$/, '$1').trim();
  const pedacos = ev.split(/\s*(?:\[\.\.\.\]|\(\.\.\.\)|\.\.\.)\s*/).map((p) => p.trim().replace(/^"|"$/g, '').trim()).filter(Boolean);
  const conferir = pedacos.filter((p) => p.length >= 8);
  return { pedacos: conferir.length ? conferir : pedacos, rotulada: Boolean(rotulo) };
}

function contemTodos(alvo, pedacos) {
  return pedacos.length > 0 && pedacos.every((p) => alvo.includes(p));
}

// De onde a evidência veio: `{ tipo, rotulada }`, ou null se não está em fala
// nenhuma. Prefere a fala digitada quando o trecho aparece nas duas.
function origemDaEvidencia(evidencia, falas) {
  const { pedacos, rotulada } = pedacosDe(evidencia);
  const achadas = falas.filter((f) => contemTodos(normalizar(f.texto), pedacos));
  if (!achadas.length) return null;
  const digitada = achadas.find((f) => f.tipo === 'digitou');
  return { tipo: (digitada || achadas[0]).tipo, rotulada };
}

// `falas` é a lista de falasDoAluno ou, para o material de uma correção de
// prática, um texto só.
function evidenciaNaTranscricao(evidencia, falas) {
  if (typeof falas === 'string') return contemTodos(normalizar(falas), pedacosDe(evidencia).pedacos);
  return origemDaEvidencia(evidencia, falas) !== null;
}

module.exports = { ler, localizar, arquivosDaAula, converter, cortar, pastaDoProjeto, tiradorDeNomes, falasDoAluno, evidenciaNaTranscricao, origemDaEvidencia, normalizar, CONTINUACAO, LIMITE, segmentos, rotulo, continuacoes, limpar, semToken, semNota, semVeredito, umaLinha };
