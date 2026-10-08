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
  return null;
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

// Uma aula longa pode acontecer em dois chats, e o avaliador precisa da aula
// inteira: cada sessão tem a sua transcrição, e elas entram na ordem em que
// aconteceram. A sessão aberta é a última — é ela que está acontecendo agora.
function arquivosDaAula(e, idAula, { semFallback = false } = {}) {
  const anteriores = (e.sessoes || []).filter((s) => s.aula === idAula).map(localizar);
  const atual = e.sessao_atual && e.sessao_atual.aula === idAula ? localizar(e.sessao_atual) : null;
  const lista = [...anteriores, atual].filter(Boolean);
  const unicos = [...new Set(lista)];
  // Nenhuma sessão etiquetada: harness antigo ou estado mexido à mão. Melhor a
  // sessão mais recente desta pasta do que avaliação nenhuma. Quem lê a conversa
  // de outro chat (o `conversa` da correção) pede sem isso: o mais recente seria
  // o próprio chat dele.
  if (!unicos.length && semFallback) return [];
  if (!unicos.length) {
    const ultimo = localizar(e.sessao_atual) || maisRecente();
    return ultimo ? [ultimo] : [];
  }
  return unicos;
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
      } else if (b.type === 'tool_use') {
        itens.push({ quem: 'cmd', avaliar: AVALIAR.test(comandoDe(b)), linha: `  [tutor rodou: ${resumoDeFerramenta(b, tirar)}]` });
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
  const { limite = LIMITE, semFallback = false } = typeof opcoes === 'number' ? { limite: opcoes } : opcoes;
  const arquivos = arquivosDaAula(e, idAula, { semFallback });
  if (!arquivos.length) return { ok: false, motivo: 'não encontrei a transcrição desta sessão' };
  const tirar = tiradorDeNomes(e);
  const partes = [];
  for (const arquivo of arquivos) {
    let bruto;
    try { bruto = fs.readFileSync(arquivo, 'utf8'); } catch { continue; }
    const convertido = converter(bruto, tirar);
    if (convertido.trim()) partes.push(convertido);
  }
  if (!partes.length) return { ok: false, motivo: 'não consegui ler a transcrição desta sessão' };
  const separador = '\n\n[--- chat seguinte, mesma aula ---]\n\n';
  const texto = cortar(partes.join(separador), limite);
  // Aula de verdade não cabe em duas linhas. Transcrição curta demais é sessão
  // trocada ou arquivo pela metade, e avaliar isso daria nota baixa por engano.
  if (texto.length < 500) return { ok: false, motivo: 'a transcrição desta sessão está vazia ou curta demais para sustentar uma avaliação' };
  return { ok: true, arquivos, texto, caracteres: texto.length, chats: partes.length };
}

// O que o aluno disse, digitou, colou ou anexou, tirado do texto que o avaliador
// leu. Uma fala começa numa linha `ALUNO...:` e vai até a próxima fala de
// qualquer um; o texto de uma fala pode ter várias linhas.
const INICIO_DE_FALA = /^(ALUNO(?: \([^)]*\))?:|TUTOR:| {2}\[tutor rodou:| {2}\[resposta:|\[--- chat seguinte|\[\.\.\.trecho do meio)/;

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
      const tipo = !r ? (m[2].startsWith('[anexou uma imagem') ? 'imagem' : 'digitou')
        : r === 'colou' ? 'colou' : r.startsWith('anexou') ? 'anexou' : 'longo';
      atual = { tipo, linhas: [m[2]] };
    } else if (atual) atual.linhas.push(linha.startsWith(CONTINUACAO) ? linha.slice(CONTINUACAO.length) : linha);
  }
  fechar();
  return falas;
}

// Aspas, travessões, reticências e espaços variam entre o que o aluno escreveu e
// o que o modelo devolve sem que ninguém tenha parafraseado nada. Isso não conta.
function normalizar(texto) {
  return String(texto)
    .normalize('NFC')
    .toLowerCase()
    .replace(/[“”«»„]/g, '"')
    .replace(/[‘’`´]/g, "'")
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

module.exports = { ler, localizar, arquivosDaAula, converter, cortar, pastaDoProjeto, tiradorDeNomes, falasDoAluno, evidenciaNaTranscricao, origemDaEvidencia, normalizar, CONTINUACAO, LIMITE };
