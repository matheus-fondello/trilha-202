'use strict';
// PreToolUse. A sala é somente leitura e o tutor só conversa: o harness
// (skills, scripts, hooks, CLAUDE.md, mapa, referências) não se edita a
// partir de um chat, nem pelo tutor, nem por quem está testando, nem a pedido
// do aluno; e o tutor não escreve arquivo em lugar nenhum, oficina incluída.
// A única escrita permitida é em trilha/tmp (a avaliação, antes de virar
// evento) e o que o CLI faz por conta própria (estado, fila, memória).
//
// Fecha os caminhos: as ferramentas de arquivo (Edit, Write, MultiEdit,
// NotebookEdit), o Bash que cita um arquivo do harness (sed -i, tee, mv, rm,
// node -e, redirecionamento), a leitura de código e da fila, os comandos de
// teste, o git que reescreve a árvore, e o painel fora do material curado.
// Bloqueio é exit 2 com o motivo no stderr, que volta para o tutor.
//
// Se o próprio hook quebrar, ele libera: a regra da casa é que nada trava a
// aula, e o settings.json ainda segura as ferramentas de arquivo por baixo.
const path = require('path');
const paths = require('../scripts/lib/paths');
const { lerStdin, lerJson } = require('../scripts/lib/util');

const RAIZ = paths.RAIZ;
const TMP = paths.TMP;

// Nomes que identificam o harness dentro de um comando de shell. Se um deles
// aparece, o comando só passa se for o CLI da trilha ou uma leitura pura.
const NOMES_PROTEGIDOS = /(^|[\s"'`=:/\\(])(\.claude[/\\]|CLAUDE\.md|REFERENCIAS\.md|README\.md|TESTE\.md|\.gitignore|mapa\.json|config\.json|estado\.json|fila\.jsonl|aluno\.md)\b/;
// O que não se lê do chat por caminho nenhum, nem com cat: a fila guarda a
// avaliação; scripts e hooks são o código do harness, e o tutor não é
// engenheiro dele; a régua do avaliador é de quem avalia, e quem avalia não é
// ele — com os critérios no contexto, ele voltaria a formar a nota de cabeça.
const SIGILO = /fila\.jsonl\b|\.claude[/\\](scripts|hooks|avaliador)[/\\]|praticas[/\\][^/\\]+[/\\]criterios\b/;
const CLI = /^node\s+(\.\/)?\.claude[/\\]scripts[/\\]trilha\.js\b/;
// Comandos de teste (dev reset, dev ir, dev fechar-tudo, dev fila, dev
// avaliacoes) e o servidor mock são do terminal de quem testa, não do tutor.
const DEV = /^node\s+(\.\/)?\.claude[/\\]scripts[/\\](trilha\.js\s+dev\b|dev[/\\])/;
const LEITURA = new Set(['cat', 'head', 'tail', 'less', 'more', 'grep', 'rg', 'ls', 'wc', 'find', 'diff', 'stat', 'file', 'type', 'dir']);
const GIT_ESCREVE = /^git\s+(-C\s+\S+\s+)?(checkout|switch|reset|restore|clean|stash|add|rm|mv|commit|push|pull|fetch|merge|rebase|cherry-pick|revert|apply|am|branch\s+(-[dDm]|--delete|--move)|tag|init|remote|config)\b/;
const REMOVE = /(^|\s)(rm\s+-[a-zA-Z]*[rR]|rmdir\b|rm\s+-[a-zA-Z]*f)/;

function comoRegistrar() {
  return 'Se isso é feedback sobre a trilha (de quem está testando ou do aluno), registre em vez de editar: `node .claude/scripts/trilha.js registrar feedback texto="..."`. Se é o aluno pedindo mudança no material, explique em uma linha que ele não muda daqui e siga a aula.';
}

function bloquear(motivo, rodape = comoRegistrar()) {
  process.stderr.write(`Guarda da sala: ${motivo}\n${rodape}\n`);
  process.exit(2);
}

function dentro(base, alvo) {
  const rel = path.relative(base, alvo);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

// Ferramentas de arquivo: só trilha/tmp, e nada fora da sala. O tutor não
// escreve código, nem na oficina; quem escreve lá é o outro Claude, do aluno.
function conferirArquivo(entrada) {
  const ti = entrada.tool_input || {};
  const bruto = ti.file_path || ti.notebook_path || ti.path;
  if (!bruto) return;
  const abs = path.resolve(entrada.cwd || RAIZ, bruto);
  if (dentro(TMP, abs)) return;
  if (dentro(RAIZ, abs)) {
    bloquear(`\`${path.relative(RAIZ, abs) || '.'}\` faz parte do harness e não se edita a partir de um chat. Aqui só se escreve em trilha/tmp; estado, fila e memória são do CLI.`);
  }
  bloquear(`\`${abs}\` está fora da sala, e você não escreve arquivo em lugar nenhum: nem na oficina, nem em outra pasta. Quem constrói é o aluno, com o outro Claude, na janela dele.`, 'Diga o que ele precisa fazer na oficina, em uma linha, e a aula segue.');
}

function segmentos(comando) {
  return comando
    .split(/&&|\|\||;|\||\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function conferirBash(entrada) {
  const comando = String((entrada.tool_input || {}).command || '');
  if (!comando.trim()) return;
  for (const seg of segmentos(comando)) {
    if (DEV.test(seg)) {
      bloquear(`\`${seg}\` é comando de teste do harness e não existe para o tutor. Quem testa roda no próprio terminal. Não rode, não sugira, não cole para o aluno rodar. Leia .claude/guarda.md.`);
    }
    if (CLI.test(seg)) continue; // o CLI da trilha é o jeito certo de escrever
    if (SIGILO.test(seg)) {
      bloquear(`\`${seg}\` lê o que não é seu: a fila guarda a avaliação, scripts e hooks são o código do harness, a régua da avaliação é de quem avalia (e quem avalia não é você), e a régua de uma prática só abre pelo comando \`criterios <prática>\` do CLI, depois da entrega registrada. Nota, critério e o que sobe para a 202 não aparecem no chat, para ninguém; e você não é engenheiro do harness. Leia .claude/guarda.md.`);
    }
    if (GIT_ESCREVE.test(seg)) {
      bloquear(`\`${seg}\` reescreve o repositório da sala. Aqui o git é só leitura (status, log, diff). Atualizar o material com \`git pull\` é o aluno que faz, no terminal dele, fora do chat.`);
    }
    if (REMOVE.test(seg)) {
      bloquear(`\`${seg}\` apaga arquivos. Nada na sala precisa disso.`);
    }
    if (NOMES_PROTEGIDOS.test(seg)) {
      const primeiro = seg.split(/\s+/)[0];
      const redireciona = /(^|[^<])>|\btee\b/.test(seg);
      if (LEITURA.has(primeiro) && !redireciona) continue;
      bloquear(`\`${seg}\` mexe em um arquivo do harness. O harness não se edita a partir de um chat, por nenhum caminho: nem sed, nem tee, nem node -e, nem redirecionamento.`);
    }
  }
}

// Painel: só abre o que está curado nos referencias.md das aulas, a entrega
// registrada do aluno (URL da prática, arquivo da oficina) e localhost. Página
// aberta entra no contexto, e página desconhecida é o jeito mais fácil de
// alguém dar instrução ao tutor por fora. Link fora disso vai em texto: o
// aluno abre no navegador dele e a aula segue.
function semWww(host) {
  return String(host || '').toLowerCase().replace(/^www\./, '');
}

function urlsCuradas() {
  const urls = [];
  try {
    const referencias = require('../scripts/lib/referencias');
    for (const { itens } of referencias.porAula()) {
      for (const it of itens) { try { urls.push(new URL(it.url)); } catch { /* url torta */ } }
    }
  } catch { /* sem mapa ou sem referencias: só a entrega do aluno passa */ }
  return urls;
}

// Curar por host abriria o YouTube, o GitHub e o X inteiros, porque uma aula cita
// um link de cada um: qualquer vídeo, qualquer repositório, qualquer post. A
// comparação é por URL. O caminho abre o item e o que está abaixo dele; quando o
// link curado tem query (é o caso do YouTube, onde o vídeo mora no `v`), ela
// também precisa bater, senão o path sozinho liberaria o site todo.
function combina(pedida, curada) {
  if (semWww(pedida.hostname) !== semWww(curada.hostname)) return false;
  const p = pedida.pathname.replace(/\/+$/, '');
  const c = curada.pathname.replace(/\/+$/, '');
  if (p !== c && !p.startsWith(c + '/')) return false;
  for (const [k, v] of curada.searchParams) {
    if (k === 'hl' || k === 'persist_hl') continue; // idioma, não identidade
    if (pedida.searchParams.get(k) !== v) return false;
  }
  return true;
}

function conferirPainel(entrada) {
  const ti = entrada.tool_input || {};
  if (ti.name && !ti.url) {
    bloquear('o painel não sobe servidor a partir da sala. Se a entrega do aluno precisa de servidor, ele sobe na oficina e você abre a URL local.', 'Peça a URL ao aluno e a aula segue.');
  }
  const bruto = String(ti.url || '').trim();
  if (!bruto || bruto === 'back' || bruto === 'forward') return;

  let url;
  try { url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(bruto) ? bruto : `https://${bruto}`); } catch {
    bloquear(`\`${bruto}\` não é uma URL que o painel entenda.`, 'Mande o link em texto e a aula segue.');
  }

  const estado = lerJson(paths.ESTADO, {});
  const praticas = Object.values(estado.praticas || {});

  if (url.protocol === 'file:') {
    const alvo = path.resolve(decodeURIComponent(url.pathname));
    const pastas = [estado.oficina, ...praticas.map((p) => p.pasta)].filter(Boolean);
    if (pastas.some((p) => dentro(path.resolve(p), alvo))) return;
    bloquear(`\`${bruto}\` está fora da oficina e das práticas registradas. No painel só abre o trabalho do aluno.`, 'Se é a entrega dele, registre a pasta antes (`oficina <caminho>` ou `pratica <id> pasta=<caminho>`) e abra de novo.');
  }

  const host = semWww(url.hostname);
  if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]') return;
  const daPratica = praticas.some((p) => { try { return semWww(new URL(p.url).hostname) === host; } catch { return false; } });
  if (daPratica) return;
  // O repositório da entrega abre por prefixo, não por host: quem corrige precisa
  // ver o repositório daquele aluno, e liberar o host inteiro seria abrir o GitHub
  // todo — página arbitrária, que é o vetor de injeção que a sala não aceita.
  const alvo = url.href.replace(/\/+$/, '');
  const doRepo = praticas.some((p) => {
    if (!p.repo) return false;
    const base = String(p.repo).replace(/\/+$/, '');
    return alvo === base || alvo.startsWith(base + '/');
  });
  if (doRepo) return;
  if (urlsCuradas().some((c) => combina(url, c))) return;

  bloquear(`\`${bruto}\` não está no material curado da trilha nem é a entrega registrada do aluno. O painel só abre os links que estão nos referencias.md das aulas, a entrega dele e localhost.`, 'Se o aluno quer ver esse link, mande em texto; ele abre no navegador dele. Se é a entrega dele no ar, registre a URL antes (`pratica <id> pasta=<caminho> url=<url>`) e abra de novo.');
}

async function main() {
  const entrada = await lerStdin();
  const tool = entrada.tool_name || '';
  if (tool === 'Bash') return conferirBash(entrada);
  if (/^(Edit|Write|MultiEdit|NotebookEdit)$/.test(tool)) return conferirArquivo(entrada);
  if (/^mcp__Claude_Browser__(navigate|preview_start)$/.test(tool)) return conferirPainel(entrada);
}

main().catch(() => process.exit(0));
