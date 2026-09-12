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

// O Claude Code guarda as transcrições em ~/.claude/projects/<caminho achatado>.
function pastaDoProjeto(raiz = paths.RAIZ) {
  return path.join(os.homedir(), '.claude', 'projects', raiz.replace(/[/\\.]/g, '-'));
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
function arquivosDaAula(e, idAula) {
  const anteriores = (e.sessoes || []).filter((s) => s.aula === idAula).map(localizar);
  const atual = e.sessao_atual && e.sessao_atual.aula === idAula ? localizar(e.sessao_atual) : null;
  const lista = [...anteriores, atual].filter(Boolean);
  const unicos = [...new Set(lista)];
  // Nenhuma sessão etiquetada: harness antigo ou estado mexido à mão. Melhor a
  // sessão mais recente desta pasta do que avaliação nenhuma.
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

function umaLinha(texto, max) {
  const t = String(texto).replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max) + '…' : t;
}

function resumoDeFerramenta(bloco) {
  const nome = bloco.name || 'ferramenta';
  const entrada = bloco.input || {};
  if (nome === 'Bash' && entrada.command) return umaLinha(entrada.command, 200);
  if (entrada.file_path) return `${nome} ${entrada.file_path}`;
  return nome;
}

function blocos(conteudo) {
  if (typeof conteudo === 'string') return [{ type: 'text', text: conteudo }];
  return Array.isArray(conteudo) ? conteudo : [];
}

// Uma linha por fala. O avaliador precisa saber quem disse o quê e em que ordem;
// não precisa de timestamp, uuid nem do resto do envelope.
function converter(bruto) {
  const linhas = [];
  for (const linha of bruto.split('\n')) {
    if (!linha.trim()) continue;
    let ev;
    try { ev = JSON.parse(linha); } catch { continue; }
    if (ev.isMeta || ev.isSidechain) continue;
    const msg = ev.message;
    if (!msg || (ev.type !== 'user' && ev.type !== 'assistant')) continue;
    for (const b of blocos(msg.content)) {
      if (b.type === 'text') {
        const texto = limpar(b.text);
        if (texto) linhas.push(`${ev.type === 'user' ? 'ALUNO' : 'TUTOR'}: ${texto}`);
      } else if (b.type === 'tool_use') {
        linhas.push(`  [tutor rodou: ${resumoDeFerramenta(b)}]`);
      } else if (b.type === 'tool_result') {
        const c = typeof b.content === 'string' ? b.content : blocos(b.content).map((x) => x.text || '').join(' ');
        const texto = limpar(c);
        if (texto) linhas.push(`  [resposta: ${umaLinha(texto, 200)}]`);
      }
      // thinking fica de fora: é raciocínio do tutor, não evidência sobre o aluno.
    }
  }
  return linhas.join('\n');
}

// Transcrição longa demais perde o meio, não o fim: o fechamento da aula é onde
// estão a fluência e as últimas respostas, que é o que mais sustenta nota.
function cortar(texto, limite = LIMITE) {
  if (texto.length <= limite) return texto;
  const metade = Math.floor(limite / 2);
  return texto.slice(0, metade) + '\n\n[...trecho do meio da aula omitido por tamanho...]\n\n' + texto.slice(-metade);
}

function ler(e, idAula, limite = LIMITE) {
  const arquivos = arquivosDaAula(e, idAula);
  if (!arquivos.length) return { ok: false, motivo: 'não encontrei a transcrição desta sessão' };
  const partes = [];
  for (const arquivo of arquivos) {
    let bruto;
    try { bruto = fs.readFileSync(arquivo, 'utf8'); } catch { continue; }
    const convertido = converter(bruto);
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

module.exports = { ler, localizar, arquivosDaAula, converter, cortar, pastaDoProjeto, LIMITE };
