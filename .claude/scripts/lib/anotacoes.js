'use strict';
// O resumo de fim de aula (01/11), que vira a página da aula na aba Anotações do app.
//
// Os alunos pediram: muitos anotam tudo, e depois da fluência esquecem um conceito, confundem uma coisa com outra e
// voltam a perguntar ou a rolar a conversa atrás do trecho. O tutor fecha cada aula com um resumo curto, no próprio
// chat: a ideia central, o que foi explicado (os tópicos da aula, na ordem), os conceitos, onde o aluno tropeçou e como
// corrigir, e o que revisar (skill `resumo-da-aula`). "O que foi explicado" entrou depois (01/11, pedido do Pedro ao ver
// a primeira versão: faltava o resumo do conteúdo); resumo sem essa seção continua valendo.
//
// Quem escreve é o tutor, que deu a aula e sabe onde o aluno confundiu. Quem guarda é este módulo: o comando
// `resumir <aula>` acha o resumo no que o tutor acabou de escrever (a conversa já está gravada quando o comando roda:
// o Claude Code grava cada bloco num append, o texto antes da chamada de ferramenta que o segue), separa as partes,
// grava em trilha/anotacoes/<aula>.json e manda à 202 como `aula.resumo`. O app lê de lá e o aluno trabalha em cima:
// marca-texto, edição, páginas suas, cartões de revisão.
//
// Não é juízo: nota nenhuma passa por aqui, e quem avalia a aula não lê o resumo (semResumo, nos dois conversores),
// porque os tropeços que o tutor escreveu são a leitura dele e virariam nota.
const fs = require('fs');
const path = require('path');
const paths = require('./paths');

const VERSAO = 1;
const PASTA = path.join(paths.TRILHA, 'anotacoes');

// O cabeçalho que a skill manda escrever: "## Resumo da aula 1.4 · Onde o LLM erra". É estreito de propósito: um
// "resumo do que vimos" ou um "Resumo da aula anterior" no meio da aula não é o resumo, e não pode sumir da leitura
// do avaliador. Depois de "Resumo da aula" vem o número da aula ou um separador; e o bloco só vale com uma seção.
const CABECALHO = /^[ \t]*#{1,3}[ \t]+(?:Resumo da aula|Lesson summary)(?=[ \t]+[BPQ]?\d|[ \t]*[·:—–-])(.*)$/gim;

// Tetos do que sobe: o resumo é curto, e um texto que passa disso é engano de formato, não conteúdo.
const TETO = { ideia: 500, termo: 120, texto: 900, explicacao: 1400, titulo: 240, fala: 400, topico: 160, topicos: 8, conceitos: 8, tropecos: 5, revisar: 5 };

function cortar(t, max) {
  const s = String(t || '').replace(/\s+/g, ' ').trim();
  return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s;
}

// O texto que vinha depois de um rótulo ("**A ideia:** o modelo...", "**O certo:** ele roda...") começa em minúscula;
// sozinho no caderno, começa em maiúscula. "iFood" e "eBay" ficam como estão (a segunda letra já é maiúscula).
function maiuscula(t) {
  const s = String(t || '');
  return /^\p{Ll}(?!\p{Lu})/u.test(s) ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Sem acento e em minúscula, para classificar o título de seção do jeito que o tutor o escrever.
function chave(t) {
  return String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function secaoDe(titulo) {
  const t = chave(titulo);
  // Antes de "conceitos": "O que foi explicado" não pode cair em outra seção.
  if (/explicad|o que (?:vimos|a aula|aprendemos|estudamos)|topicos? (?:da aula|principais)|^topicos?$|pontos principais|what (?:we|was) (?:covered|explained)|key points|main topics/.test(t)) return 'topicos';
  if (/conceito|concept/.test(t)) return 'conceitos';
  if (/trope|errou|erros?\b|confus|atencao|escorreg|stumbl|mistake|tripped/.test(t)) return 'tropecos';
  if (/revis|aprofund|estudar|para ler|review|revisit|go deeper/.test(t)) return 'revisar';
  if (/ideia|big idea|main idea|key idea/.test(t)) return 'ideia';
  return null;
}

const BULLET = /^[ \t]*(?:[-*+]|\d+[.)])[ \t]+(.*)$/;
const TITULO_HASH = /^[ \t]*#{2,5}[ \t]+(.+?)[ \t#]*$/;
// O título de seção escrito só em negrito, numa linha ("**Conceitos**"), vale se for o nome de uma seção.
const TITULO_NEGRITO = /^[ \t]*\*\*([^*\n]{3,40}?)\*\*[ \t]*:?[ \t]*$/;
function tituloDe(l) {
  const h = TITULO_HASH.exec(l);
  if (h) return h[1];
  const n = TITULO_NEGRITO.exec(l);
  return n && secaoDe(n[1]) ? n[1] : null;
}
const CITACAO = /^[ \t]*>[ \t]?(.*)$/;
const REGUA = /^[ \t]*(?:-{3,}|\*{3,}|_{3,})[ \t]*$/;

// Uma linha solta que, mesmo sem marcador e sem recuo, ainda é parte do item de cima: um rótulo ("**O certo:** ...",
// "Você escreveu: ...") ou um link sozinho na linha.
function linhaDeItem(l) {
  const t = l.trim();
  if (/^\[[^\]]+\]\(https?:\/\//.test(t) || /^<?https?:\/\//.test(t)) return true;
  const m = /^(?:\*\*|\*|_)?([^*_:\n]{2,30}?)(?:\*\*|\*|_)?\s*:/.exec(t);
  return Boolean(m && rotuloDe(m[1]));
}

// O resumo dentro de um texto do tutor: do último cabeçalho "Resumo da aula" até o fim das seções. O que vem depois
// (a despedida, a próxima aula) não é resumo: uma linha solta, sem marcador e sem recuo, depois de uma linha em branco
// e dos itens da última seção encerra o bloco, e um título que não é seção também. Uma régua (---) entre seções não
// encerra; depois da última, encerra. Sem nenhuma seção reconhecida, não é resumo.
// O texto chega com \n (o CRLF vira \n antes): as posições devolvidas valem sobre o texto normalizado.
function normalizar(texto) {
  return String(texto || '').replace(/\r\n?/g, '\n');
}
function localizar(texto) {
  const s = normalizar(texto);
  let m;
  let ultimo = null;
  CABECALHO.lastIndex = 0;
  while ((m = CABECALHO.exec(s))) ultimo = { index: m.index, linha: m[0], resto: m[1] };
  if (!ultimo) return null;
  const inicio = ultimo.index;
  const depois = s.slice(inicio + ultimo.linha.length);
  const linhas = depois.split('\n');
  const secaoAdiante = (i) => linhas.slice(i + 1).some((x) => { const t = tituloDe(x); return t !== null && secaoDe(t); });
  // linhas[0] é o que sobrou da linha do cabeçalho (vazio).
  let fimRel = depois.length;
  let secao = null;
  let temItem = false;
  let algumaSecao = false;
  let branco = false;
  let pos = linhas[0].length + 1;
  for (let i = 1; i < linhas.length; pos += linhas[i].length + 1, i++) {
    const l = linhas[i];
    if (!l.trim()) { branco = true; continue; }
    const antesBranco = branco;
    branco = false;
    if (REGUA.test(l)) { if (algumaSecao && !secaoAdiante(i)) { fimRel = pos; break; } continue; }
    const tit = tituloDe(l);
    if (tit !== null) {
      const qual = secaoDe(tit);
      if (!qual) { if (algumaSecao) { fimRel = pos; break; } continue; }
      secao = qual; temItem = false; algumaSecao = true;
      continue;
    }
    if (BULLET.test(l)) { temItem = true; continue; }
    if (CITACAO.test(l)) continue;
    if (!secao) continue; // antes de qualquer seção: a abertura do resumo (a ideia)
    if (/^[ \t]{2,}\S/.test(l) || linhaDeItem(l)) { temItem = true; continue; } // continuação recuada, rótulo ou link
    // Linha solta: numa seção ainda sem item é o conteúdo dela ("Nenhum tropeço nesta aula."); colada no item de cima
    // é continuação dele. Depois de uma linha em branco e dos itens, só segue se outra seção vem depois.
    if (!temItem) { temItem = true; continue; }
    if (!antesBranco || secaoAdiante(i)) continue;
    fimRel = pos;
    break;
  }
  if (!algumaSecao) return null;
  const fim = inicio + ultimo.linha.length + Math.min(fimRel, depois.length);
  return { inicio, fim, bloco: s.slice(inicio, fim).trim(), cabecalho: ultimo.resto };
}

// Os rótulos dentro de um item, em negrito ou itálico ou sem nada: "*No seu caso:*", "**O certo:**", "Como corrigir:".
// O rótulo é o texto inteiro, e não um pedaço dele: "**Por que o modelo chuta.**" é o tópico de um item, não o
// rótulo "Por quê" (achado na aula de teste de 01/11).
const ROTULOS = [
  ['no_seu_caso', /^(?:no seu caso|na sua oficina|no seu projeto|in your case|in your project|in your workshop)$/],
  ['fala', /^(?:voce (?:disse|escreveu|falou|respondeu|pensou|achou)|sua frase|sua resposta|you (?:said|wrote|answered|thought)|your words)$/],
  ['certo', /^(?:o certo|o correto|na verdade|o que vale|the right (?:way|answer)|correct|actually)$/],
  ['corrigir', /^(?:como corrigir|para nao repetir|para corrigir|da proxima vez|como evitar|how to fix|next time|to avoid)$/],
  ['porque', /^(?:por que|porque|why)$/],
];
function rotuloDe(t) {
  const k = chave(t).replace(/[\s:.!?]+$/, '').trim();
  for (const [nome, re] of ROTULOS) if (re.test(k)) return nome;
  return null;
}

// Separa o negrito de abertura ("**Termo.** explicação") do resto, e o resto em campos rotulados.
function partes(texto) {
  let t = String(texto || '').trim();
  let lead = null;
  const neg = /^\*\*(.+?)\*\*\s*[:.—–-]?\s*/.exec(t);
  if (neg && !rotuloDe(neg[1].replace(/[:.]\s*$/, ''))) {
    lead = neg[1].replace(/[\s:.—–-]+$/, '').trim();
    t = t.slice(neg[0].length);
  }
  // Rótulos marcados: **Rótulo:**, *Rótulo:*, _Rótulo:_ e **Rótulo**: ; depois o rótulo nu no começo de frase.
  const marcas = [];
  const re = /(\*\*|\*|_)([^*_\n]{2,40}?)\s*:\s*\1|(\*\*|\*|_)([^*_\n]{2,40}?)\3\s*:|(?:^|(?<=[.!?]\s))([A-ZÀ-Ú][^:.\n]{1,28}):(?=\s)/g;
  let m;
  while ((m = re.exec(t))) {
    const nome = rotuloDe(m[2] || m[4] || m[5]);
    if (nome) marcas.push({ nome, de: m.index, ate: m.index + m[0].length });
  }
  const campos = {};
  const corpo = marcas.length ? t.slice(0, marcas[0].de) : t;
  marcas.forEach((mk, i) => {
    const fim = i + 1 < marcas.length ? marcas[i + 1].de : t.length;
    const v = t.slice(mk.ate, fim).replace(/^[\s:—–-]+/, '').replace(/[\s—–→-]+$/, '').trim();
    if (v && !campos[mk.nome]) campos[mk.nome] = v;
  });
  return { lead, corpo: corpo.replace(/[\s—–→-]+$/, '').trim(), campos };
}

// A fala citada, sem as aspas e sem o ponto que fica fora delas: "ele disse isso". → ele disse isso
function semAspas(t) {
  const s = String(t || '').trim();
  const inteira = /^["“]([^"”]+)["”][.!?…]?$/.exec(s);
  if (inteira) return inteira[1].trim();
  return s.replace(/^["“'‘]+/, '').replace(/["”'’]+([.!?…]?)$/, '$1').trim();
}

const LINK = /\[([^\]\n]{1,200})\]\((https?:\/\/[^)\s]+)\)/g;
// Em qualquer campo, link que não está nas referências curadas sai (fica o texto dele); URL solta também.
function filtrarLinks(t, urlOk, avisos) {
  if (t == null) return t;
  return String(t)
    .replace(LINK, (inteiro, titulo, url) => { if (urlOk(url)) return inteiro; avisos.push(`link fora das referências curadas saiu do resumo: ${url}`); return titulo; })
    .replace(/(^|[^(\w])<?(https?:\/\/[^\s)>\]]+)>?/g, (inteiro, antes, bruta) => {
      // A pontuação colada no fim ("veja https://x.com/b.") é da frase, não da URL.
      const pont = (/[.,;:!?]+$/.exec(bruta) || [''])[0];
      const url = pont ? bruta.slice(0, -pont.length) : bruta;
      if (urlOk(url)) return inteiro;
      avisos.push(`link fora das referências curadas saiu do resumo: ${url}`);
      return (pont ? antes.replace(/\s+$/, '') : antes) + pont;
    })
    .replace(/\s{2,}/g, ' ').trim();
}
function tirarLinks(t) {
  const links = [];
  const sem = String(t || '').replace(LINK, (_, titulo, url) => { links.push({ titulo: titulo.trim(), url }); return ''; })
    // A URL solta também é link.
    .replace(/<?(https?:\/\/[^\s)>]+)>?/g, (_, url) => { links.push({ titulo: '', url }); return ''; })
    .replace(/\(\s*\)/g, '').replace(/\s+([.,;])/g, '$1').replace(/\s{2,}/g, ' ').trim();
  return { sem, links };
}

// O id de cada parte vem do texto dela, para sobreviver a um resumo reescrito na mesma ordem ou não: o app guarda a
// edição e o destaque do aluno por id. FNV-1a de 32 bits, e não o módulo crypto: este arquivo é carregado por todo
// comando da sala (via transcricao.js), e carregar o crypto na partida derruba o Node no Windows com a pasta pessoal
// travada (0xC0000409, visto no testa-codex-acesso.js).
function id(prefixo, ...textos) {
  let h = 0x811c9dc5;
  for (const c of textos.map(chave).join('|')) {
    h ^= c.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return prefixo + '-' + h.toString(16).padStart(8, '0');
}

// Os itens de cada seção, já com as linhas de continuação juntas. Continuam o item de cima: a linha recuada, o subitem
// recuado ("  - **O certo:** ..."), a linha de rótulo ou de link, e a linha solta colada nele (sem linha em branco).
function itensPorSecao(bloco) {
  const linhas = normalizar(bloco).split('\n').slice(1);
  const out = { ideia: [], topicos: [], conceitos: [], tropecos: [], revisar: [], soltos: [] };
  let secao = null;
  let ultimo = null;
  let branco = false;
  const novo = (texto) => { ultimo = { texto }; out[secao || 'soltos'].push(ultimo); };
  for (const l of linhas) {
    if (!l.trim()) { branco = true; continue; }
    const antesBranco = branco;
    branco = false;
    if (REGUA.test(l)) continue;
    const tit = tituloDe(l);
    if (tit !== null) { secao = secaoDe(tit); ultimo = null; continue; }
    const cit = CITACAO.exec(l);
    if (cit && !secao) { out.ideia.push({ texto: cit[1] }); continue; }
    const b = BULLET.exec(l);
    const recuada = /^[ \t]{2,}\S/.test(l);
    if (b && !(recuada && ultimo)) { novo(b[1]); continue; }
    const conteudo = b ? b[1] : l.trim();
    if (ultimo && (recuada || linhaDeItem(l) || !antesBranco)) { ultimo.texto += ' ' + conteudo; continue; }
    if (!secao) { out.soltos.push({ texto: conteudo }); continue; }
    novo(conteudo);
  }
  const textos = (lista) => lista.map((x) => x.texto.trim()).filter(Boolean);
  return { ideia: textos(out.ideia), topicos: textos(out.topicos), conceitos: textos(out.conceitos), tropecos: textos(out.tropecos), revisar: textos(out.revisar), soltos: textos(out.soltos) };
}

// "Nenhum tropeço que valha registrar nesta aula." — e não "**Nenhum critério de pronto.**", que é um tropeço.
const NADA = /^(?:\*\*)?(?:nenhum(?:a)?\s+(?:trope|erro|confus|ponto)|nada\s+(?:a|que|para)\s+registrar|sem\s+trope|no\s+(?:stumbl|mistake)|none\b|nothing\s+to)/i;
const ehNada = (t) => NADA.test(String(t).trim()) && !/certo|corrig|right|fix/i.test(chave(t));

// O resumo em partes. `urlOk(url)` diz se um link pode ficar (só os das referências curadas: o tutor não inventa link
// para o caderno do aluno). Devolve `{ resumo, avisos }`, ou `{ erro }` quando não há resumo que valha.
function analisar(texto, { urlOk = () => true } = {}) {
  const achado = localizar(texto);
  if (!achado) return { erro: 'não achei o cabeçalho "## Resumo da aula <id>" (em inglês, "## Lesson summary <id>")' };
  const it = itensPorSecao(achado.bloco);
  const avisos = [];
  const f = (t) => filtrarLinks(t, urlOk, avisos);

  let ideia = it.ideia.join(' ')
    .replace(/^\*\*(?:a |the |big |main |key )?(?:ideia|idea)(?: central)?[:.]?\*\*\s*[:.—–-]?\s*/i, '')
    .replace(/^(?:a |the |big |main |key )?(?:ideia|idea)(?: central)?\s*:\s*/i, '').trim();
  // Sem a citação, a primeira linha solta antes das seções é a ideia (a seção "### A ideia" já caiu em `it.ideia`).
  if (!ideia && it.soltos.length) ideia = it.soltos.join(' ');
  ideia = f(ideia);

  // O que foi explicado: "**Título.** o parágrafo". Sem negrito, o que vem antes de um travessão ou dois-pontos; sem
  // nada disso, a primeira frase.
  const topicos = [];
  // O parágrafo fica inteiro, com o que tiver de rótulo ("*No seu caso:* ..."): é texto corrido, não campos.
  for (const bruto of it.topicos) {
    const t = bruto.trim();
    const neg = /^\*\*(.+?)\*\*\s*[:.—–-]?\s*/.exec(t);
    let titulo = neg ? neg[1].replace(/[\s:.—–-]+$/, '').trim() : '';
    let explic = neg ? t.slice(neg[0].length).trim() : t;
    if (!titulo) {
      const div = /^(.{2,100}?)\s*(?:—|–|:| - )\s*(.+)$/.exec(t);
      const frase = /^(.{8,140}?[.!?])(\s|$)/.exec(t);
      if (div) { titulo = div[1].replace(/\*+/g, '').trim(); explic = div[2]; } else if (frase) { titulo = frase[1].replace(/[.!?]$/, ''); explic = t.slice(frase[0].length).trim(); } else { titulo = t; explic = ''; }
    }
    if (!titulo) continue;
    if (!explic) avisos.push(`tópico sem explicação: "${cortar(titulo, 60)}"`);
    topicos.push({
      id: id('e', titulo),
      titulo: cortar(f(titulo), TETO.topico),
      texto: explic ? maiuscula(cortar(f(explic), TETO.explicacao)) : null,
    });
  }

  const conceitos = [];
  for (const bruto of it.conceitos) {
    const p = partes(bruto);
    let termo = p.lead;
    let explic = p.corpo;
    if (!termo) {
      const div = /^(.{2,80}?)\s*(?:—|–|:| - )\s*(.+)$/.exec(p.corpo);
      if (div) { termo = div[1].replace(/\*+/g, '').trim(); explic = div[2]; }
    }
    if (!termo || !explic) { if (bruto.trim()) avisos.push(`conceito sem termo e explicação separados: "${cortar(bruto, 60)}"`); if (!termo) continue; }
    conceitos.push({
      id: id('c', termo),
      termo: cortar(termo, TETO.termo),
      texto: maiuscula(cortar(f(explic), TETO.texto)),
      no_seu_caso: p.campos.no_seu_caso ? maiuscula(cortar(f(p.campos.no_seu_caso), TETO.texto)) : null,
    });
  }

  const tropecos = [];
  {
    for (const bruto of it.tropecos) {
      if (ehNada(bruto)) continue;
      const p = partes(bruto);
      let titulo = p.lead || '';
      let resto = p.corpo;
      if (!titulo) {
        const frase = /^(.{8,240}?[.!?])(\s|$)/.exec(resto);
        titulo = frase ? frase[1] : resto;
        resto = frase ? resto.slice(frase[0].length).trim() : '';
      }
      if (!titulo) continue;
      if (!p.campos.certo && !p.campos.corrigir) avisos.push(`tropeço sem "O certo" nem "Como corrigir": "${cortar(titulo, 60)}"`);
      tropecos.push({
        id: id('t', titulo),
        titulo: cortar(f(titulo), TETO.titulo),
        fala: p.campos.fala ? cortar(semAspas(f(p.campos.fala)), TETO.fala) : null,
        texto: resto ? maiuscula(cortar(f(resto), TETO.texto)) : null,
        certo: p.campos.certo ? maiuscula(cortar(f(p.campos.certo), TETO.texto)) : null,
        corrigir: p.campos.corrigir ? maiuscula(cortar(f(p.campos.corrigir), TETO.texto)) : null,
      });
    }
  }

  const revisar = [];
  for (const bruto of it.revisar) {
    const { sem: semLink, links } = tirarLinks(bruto);
    const sem = semLink.replace(/^[\s—–:.-]+/, '');
    const p = partes(sem);
    let topico = p.lead;
    let explic = [p.corpo, p.campos.porque].filter(Boolean).join(' ');
    // O item que começa pelo link ("[Vídeo](url) — por quê"): o título do link é o tópico, fique o link ou não.
    if (!topico && /^\s*\[/.test(bruto) && links.length && links[0].titulo) {
      topico = links[0].titulo;
      explic = [p.corpo, p.campos.porque].filter(Boolean).join(' ');
    } else if (!topico) {
      const div = /^(.{2,100}?)\s*(?:—|–|:| - )\s*(.+)$/.exec(p.corpo);
      if (div) { topico = div[1].replace(/\*+/g, '').trim(); explic = div[2]; } else { topico = p.corpo; explic = ''; }
    }
    if (!topico && !links.length) continue;
    const bom = links.find((l) => urlOk(l.url));
    for (const l of links) if (!urlOk(l.url)) avisos.push(`link fora das referências curadas saiu do resumo: ${l.url}`);
    revisar.push({
      id: id('r', topico || (bom && bom.url) || ''),
      topico: cortar(topico || (bom && bom.titulo) || 'Referência', TETO.topico),
      texto: explic ? maiuscula(cortar(explic, TETO.texto)) : null,
      link: bom ? { titulo: cortar(bom.titulo || topico || bom.url, TETO.topico), url: bom.url } : null,
    });
  }

  // Ids repetidos (dois conceitos com o mesmo termo) ganham sufixo: o app guarda edição e destaque por id.
  const vistos = new Set();
  for (const lista of [topicos, conceitos, tropecos, revisar]) for (const x of lista) {
    let n = 2;
    const base = x.id;
    while (vistos.has(x.id)) x.id = `${base}-${n++}`;
    vistos.add(x.id);
  }

  if (topicos.length > TETO.topicos) avisos.push(`${topicos.length} tópicos explicados: ficaram os ${TETO.topicos} primeiros`);
  if (conceitos.length > TETO.conceitos) avisos.push(`${conceitos.length} conceitos: ficaram os ${TETO.conceitos} primeiros`);
  if (tropecos.length > TETO.tropecos) avisos.push(`${tropecos.length} tropeços: ficaram os ${TETO.tropecos} primeiros`);
  if (revisar.length > TETO.revisar) avisos.push(`${revisar.length} itens para revisar: ficaram os ${TETO.revisar} primeiros`);

  if (!ideia && !conceitos.length && !topicos.length) return { erro: 'o resumo não tem a ideia central, o que foi explicado nem conceitos que eu consiga separar' };
  if (!ideia) avisos.push('sem a ideia central (a linha "> ..." logo depois do cabeçalho)');
  if (!topicos.length) avisos.push('sem "O que foi explicado"');
  if (!conceitos.length) avisos.push('sem conceitos');

  return {
    resumo: {
      ideia: ideia ? maiuscula(cortar(ideia, TETO.ideia)) : null,
      topicos: topicos.slice(0, TETO.topicos),
      conceitos: conceitos.slice(0, TETO.conceitos),
      tropecos: tropecos.slice(0, TETO.tropecos),
      revisar: revisar.slice(0, TETO.revisar),
    },
    avisos,
    markdown: achado.bloco,
    cabecalho: achado.cabecalho,
  };
}

// O texto sem o resumo, para quem avalia: os tropeços que o tutor escreveu são a leitura dele sobre o aluno.
function semResumo(texto) {
  // Sem resumo, o texto volta como veio, sem nem a troca do CRLF: a leitura do avaliador não muda em nada.
  if (!/Resumo da aula|Lesson summary/i.test(String(texto))) return String(texto);
  const s = normalizar(texto);
  const achado = localizar(s);
  if (!achado) return String(texto);
  const antes = s.slice(0, achado.inicio).trimEnd();
  const depois = s.slice(achado.fim).trimStart();
  return [antes, '[resumo da aula para o aluno omitido]', depois].filter(Boolean).join('\n\n');
}

// A resposta do comando `resumir` ("Resumo da aula 1.4 registrado: 3 conceitos, 2 tropeços...") diz quantos tropeços
// o tutor achou, e os avisos citam o título de um: quem avalia a aula não lê isso. Sem a resposta, o texto volta igual.
function semSaidaDoResumir(texto) {
  const s = String(texto);
  if (!/Resumo da aula \S+ (?:registrado|não registrado)|Ajustes no que foi guardado/.test(s)) return s;
  return s
    .replace(/Resumo da aula \S+ (?:registrado|não registrado)[^\n]*/g, '[saída do resumo da aula omitida]')
    .replace(/\(Ajustes no que foi guardado:[^\n]*\)/g, '');
}

// Todos os textos do tutor de uma conversa do Claude, na ordem (o .jsonl da sessão).
function textosDoClaude(bruto) {
  const out = [];
  for (const linha of String(bruto || '').split('\n')) {
    if (!linha.trim()) continue;
    let ev;
    try { ev = JSON.parse(linha); } catch { continue; }
    if (!ev || ev.isMeta || ev.isSidechain || ev.isApiErrorMessage || ev.type !== 'assistant' || !ev.message) continue;
    const c = ev.message.content;
    for (const b of Array.isArray(c) ? c : typeof c === 'string' ? [{ type: 'text', text: c }] : []) {
      if (b && b.type === 'text' && typeof b.text === 'string') out.push(b.text);
    }
  }
  return out;
}

// E de uma conversa do Codex: as mensagens do agente (event_msg/item_completed, AgentMessage).
function textosDoCodex(bruto) {
  const out = [];
  for (const linha of String(bruto || '').replace(/^﻿/, '').split('\n')) {
    if (!linha.trim()) continue;
    let o;
    try { o = JSON.parse(linha); } catch { continue; }
    const p = o && o.payload;
    if (!o || o.type !== 'event_msg' || !p || p.type !== 'item_completed' || !p.item || p.item.type !== 'AgentMessage') continue;
    for (const c of Array.isArray(p.item.content) ? p.item.content : []) if (c && typeof c.text === 'string') out.push(c.text);
  }
  return out;
}

// O último texto do tutor com o resumo desta aula. Um cabeçalho com o número de outra aula não serve.
function ultimoResumo(textos, idAula) {
  const alvo = String(idAula);
  for (let i = textos.length - 1; i >= 0; i--) {
    const achado = localizar(textos[i]);
    if (!achado) continue;
    const n = /(\b[BPQ]?\d+(?:\.\d+)?\b)/i.exec(achado.cabecalho || '');
    if (n && n[1].toUpperCase() !== alvo.toUpperCase()) continue;
    return textos[i];
  }
  return null;
}

// As URLs das referências curadas (os referencias.md das aulas): é o que pode ficar como link num resumo.
function urlsCuradas() {
  const lista = new Set();
  try {
    for (const nome of fs.readdirSync(paths.SKILLS)) {
      const arq = path.join(paths.SKILLS, nome, 'referencias.md');
      if (!fs.existsSync(arq)) continue;
      for (const m of fs.readFileSync(arq, 'utf8').matchAll(/https?:\/\/[^\s)>\]]+/g)) lista.add(m[0].replace(/[.,;:]+$/, ''));
    }
  } catch { /* sem skills legíveis, nenhum link fica */ }
  return lista;
}
function urlCurada(lista) {
  return (url) => {
    const u = String(url || '').replace(/[.,;:]+$/, '');
    if (lista.has(u)) return true;
    for (const c of lista) if (u.startsWith(c) && /^[/#]/.test(u.slice(c.length))) return true;
    return false;
  };
}

function arquivo(idAula) {
  return path.join(PASTA, `${String(idAula).replace(/[^\w.-]/g, '_')}.json`);
}
function gravar(idAula, registro) {
  fs.mkdirSync(PASTA, { recursive: true });
  const destino = arquivo(idAula);
  const tmp = `${destino}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(registro, null, 2) + '\n');
  fs.renameSync(tmp, destino);
  return destino;
}
function ler(idAula) {
  try { return JSON.parse(fs.readFileSync(arquivo(idAula), 'utf8')); } catch { return null; }
}

// Aplica uma limpeza (nomes de terceiros, token) a todo texto do resumo, antes de guardar e de subir.
function limparTudo(resumo, f) {
  const g = (v) => (typeof v === 'string' ? f(v) : v);
  return {
    ideia: g(resumo.ideia),
    topicos: (resumo.topicos || []).map((x) => ({ ...x, titulo: g(x.titulo), texto: g(x.texto) })),
    conceitos: resumo.conceitos.map((c) => ({ ...c, termo: g(c.termo), texto: g(c.texto), no_seu_caso: g(c.no_seu_caso) })),
    tropecos: resumo.tropecos.map((t) => ({ ...t, titulo: g(t.titulo), fala: g(t.fala), texto: g(t.texto), certo: g(t.certo), corrigir: g(t.corrigir) })),
    revisar: resumo.revisar.map((r) => ({ ...r, topico: g(r.topico), texto: g(r.texto), link: r.link ? { ...r.link, titulo: g(r.link.titulo) } : null })),
  };
}

module.exports = { VERSAO, PASTA, TETO, analisar, localizar, semResumo, semSaidaDoResumir, textosDoClaude, textosDoCodex, ultimoResumo, urlsCuradas, urlCurada, arquivo, gravar, ler, limparTudo, partes };
