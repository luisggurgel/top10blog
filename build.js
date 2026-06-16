#!/usr/bin/env node
/**
 * ZeroBerto Top 10 Blog — Static Site Generator
 * 
 * Este script lê o arquivo threads.json e gera HTML estático puro.
 * Não precisa de React, não precisa de JavaScript no navegador.
 * Um site estático de verdade, como Deus e o ano 2003 mandaram.
 * 
 * Uso: node build.js
 * Saída: pasta dist-static/ com os arquivos HTML e CSS prontos pra deploy
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Carregar dados ──
let threads
try {
  threads = JSON.parse(readFileSync(join(__dirname, 'src/data/threads.json'), 'utf-8'))
} catch (err) {
  console.error('❌ Erro ao ler threads.json:', err.message)
  process.exit(1)
}
const css = readFileSync(join(__dirname, 'src/index.css'), 'utf-8')

// ── Criar diretório de saída ──
const outDir = join(__dirname, 'dist-static')
mkdirSync(outDir, { recursive: true })
mkdirSync(join(outDir, 'thread'), { recursive: true })

// ── Helper: escapar HTML ──
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Helper: formatar texto com greentext ──
function formatText(text) {
  return text.split('\n').map(line => {
    if (line.startsWith('>')) {
      return `<span class="greentext">${escapeHtml(line)}</span>`
    }
    if (line === '') return '<br>'
    return escapeHtml(line)
  }).join('<br>')
}

// ── Template: header HTML ──
function htmlHead(title, cssPath = 'style.css') {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ZeroBerto Top 10 Blog - As listas mais aleatórias e inúteis da internet brasileira.">
  <title>${escapeHtml(title)} - ZeroBerto Top 10 Blog</title>
  <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${cssPath}">
</head>
<body>`
}

// ── Template: browser chrome (fake IE) ──
function browserChrome() {
  return `
  <div class="page-wrapper">
    <div class="browser-chrome">
      <div class="win-window" style="margin-bottom:0">
        <div class="win-titlebar">
          <span class="win-titlebar__text">ZeroBerto Top 10 Blog - Microsoft Internet Explorer</span>
          <div class="win-titlebar__buttons">
            <button class="win-titlebar__btn">_</button>
            <button class="win-titlebar__btn">□</button>
            <button class="win-titlebar__btn">×</button>
          </div>
        </div>
      </div>
      <div class="toolbar">
        <span class="toolbar__item toolbar__item--underline">Arquivo</span>
        <span class="toolbar__item toolbar__item--underline">Editar</span>
        <span class="toolbar__item toolbar__item--underline">Exibir</span>
        <span class="toolbar__item toolbar__item--underline">Favoritos</span>
        <span class="toolbar__item toolbar__item--underline">Ferramentas</span>
        <span class="toolbar__item toolbar__item--underline">Ajuda</span>
      </div>
      <div class="address-bar">
        <span class="address-bar__label">Endereço</span>
        <input type="text" class="address-bar__input" value="http://www.zeroberto-top10.cjb.net/index.htm" readonly>
        <button class="win-button" style="min-width:50px;padding:2px 8px">Ir</button>
      </div>
    </div>
    <div class="main-content">`
}

// ── Template: footer ──
function pageFooter(visitorCount = '00013848') {
  return `
      <!-- Visitor Counter -->
      <div class="visitor-counter">
        <div>👀 Você é o visitante número:</div>
        <div class="visitor-counter__digits">
          ${visitorCount.split('').map(d => `<span class="visitor-counter__digit">${d}</span>`).join('')}
        </div>
        <div style="margin-top:4px;font-size:10px;color:#aaa">(contador 100% real não é fake confia)</div>
      </div>
    </div>
    <!-- Status Bar -->
    <div class="status-bar">
      <span class="status-bar__section">✅ Concluído</span>
      <span class="status-bar__section">🌐 Internet | Zona protegida (mentira)</span>
    </div>
  </div>
</body>
</html>`
}

// ── Gerar index.html (Catálogo) ──
function buildCatalog() {
  let html = htmlHead('Catálogo')
  html += browserChrome()

  // Marquee
  html += `
      <div class="marquee-container">
        <marquee scrollamount="4">
          🔥🔥🔥 BEM VINDO AO MELHOR SITE DA INTERNET!!! 🔥🔥🔥 ATUALIZADO EM 2003!!! 🔥🔥🔥 SITE FEITO POR MIM MESMO NO FRONTPAGE!!! 🔥🔥🔥 ADICIONA NOS FAVORITOS!!! 🔥🔥🔥
        </marquee>
      </div>`

  // Under construction
  html += `
      <div style="text-align:center;padding:4px">
        <span class="gif-placeholder">🚧 [GIF: under_construction.gif] 🚧</span>
        <span class="gif-placeholder">🔨 [GIF: trabalhador_martelo.gif] 🔨</span>
        <span class="gif-placeholder">🚧 [GIF: under_construction.gif] 🚧</span>
      </div>`

  // Header
  html += `
      <div class="page-header">
        <h1 class="page-title">★ ZeroBerto Top 10 Blog ★</h1>
        <p class="page-subtitle">As listas mais ALEATORIAS e INÚTEIS da internet brasileira</p>
        <p class="page-subtitle page-subtitle-blink">~ desde 2003 ~</p>
      </div>
      <hr class="retro-hr">`

  // Board header
  html += `
      <div class="board-header">
        <div class="board-title">/zb/ - ZeroBerto Random</div>
        <div class="board-subtitle">"Ninguém pediu essas listas mas aqui estão" - Regras do board: não tem regras lol</div>
      </div>`

  // Nav
  html += `
      <div class="nav-bar">
        [<a href="index.html">Home</a>]
        [<a href="#">Regras (não tem)</a>]
        [<a href="index.html">Catálogo</a>]
        [<a href="#">FAQ (mentira)</a>]
        [<a href="#">Contato (não respondo)</a>]
      </div>`

  // Catalog grid
  html += `
      <div class="win-window">
        <div class="win-titlebar">
          <span class="win-titlebar__text">/zb/ - Catálogo - Microsoft Internet Explorer</span>
          <div class="win-titlebar__buttons">
            <button class="win-titlebar__btn">_</button>
            <button class="win-titlebar__btn">□</button>
            <button class="win-titlebar__btn">×</button>
          </div>
        </div>
        <div class="win-content">
          <div style="font-size:11px;color:#707070;margin-bottom:8px">
            Mostrando ${threads.length} threads. Clique em uma thread para ler o Top 10 completo.
          </div>
          <div class="catalog-grid">`

  for (const thread of threads) {
    html += `
            <a href="thread/${thread.id}.html" class="catalog-item">
              <div class="catalog-thumb">${escapeHtml(thread.thumbnailAlt)}</div>
              <div class="catalog-title">${escapeHtml(thread.title)}</div>
              <div class="catalog-excerpt">${escapeHtml(thread.intro.substring(0, 100))}...</div>
              <div class="catalog-stats">R: ${thread.replyCount} / I: ${thread.imageCount}</div>
            </a>`
  }

  html += `
          </div>
        </div>
      </div>
      <hr class="retro-hr">`

  // Retro footer elements
  html += `
      <div style="text-align:center;padding:8px">
        <span class="gif-placeholder">🔥 [GIF: chamas_esquerda.gif] 🔥</span>
        <span class="fire-text" style="font-size:18px;padding:0 8px">SITE MAIS LEGAL DA INTERNET</span>
        <span class="gif-placeholder">🔥 [GIF: chamas_direita.gif] 🔥</span>
      </div>
      <div class="webring">
        <div class="webring__title">🌐 WebRing - Sites Legais de Amigos 🌐</div>
        <div>[<a href="#">&lt;&lt; Anterior</a>] [<a href="#">Lista</a>] [<a href="#">Aleatório</a>] [<a href="#">Próximo &gt;&gt;</a>]</div>
      </div>
      <div class="footer-links">
        <a href="#">📖 Assine meu Livro de Visitas!</a> |
        <a href="#">📧 Me manda um email!</a> |
        <a href="#">Meu perfil no Orkut</a> |
        <a href="#">🎨 Fan arts</a>
      </div>
      <div class="best-viewed">Melhor visualizado em <span class="ie-badge">IE 6.0</span> com resolução 800x600</div>
      <div class="footer-disclaimer">© 2003 ZeroBerto. Todos os direitos reservados (mentira, pode copiar)<br>Site feito no Microsoft FrontPage 2002. Não julgue.</div>`

  html += pageFooter()

  writeFileSync(join(outDir, 'index.html'), html)
  console.log('✅ index.html gerado')
}

// ── Gerar thread pages ──
function buildThread(thread) {
  let html = htmlHead(thread.title, '../style.css')
  html += browserChrome()

  // Nav
  html += `
      <div class="nav-bar">
        [<a href="../index.html">Catálogo</a>]
        [<a href="#top">Topo</a>]
        [<a href="#bottom">Fundo</a>]
      </div>`

  // Board header
  html += `
      <div class="board-header">
        <div class="board-title" style="font-size:20px">/zb/ - ${escapeHtml(thread.title)}</div>
      </div>
      <a id="top"></a>`

  // Window with OP post
  html += `
      <div class="win-window">
        <div class="win-titlebar">
          <span class="win-titlebar__text">${escapeHtml(thread.title)} - Microsoft Internet Explorer</span>
          <div class="win-titlebar__buttons">
            <button class="win-titlebar__btn">_</button>
            <button class="win-titlebar__btn">□</button>
            <button class="win-titlebar__btn">×</button>
          </div>
        </div>
        <div class="win-content">
          <!-- OP Post -->
          <div class="post post--op">
            <div class="post__header">
              <input type="checkbox" class="post__checkbox" readonly>
              <span class="post__subject">${escapeHtml(thread.title)}</span>
              <span class="post__name">${escapeHtml(thread.author)}</span>
              <span class="post__tripcode">${escapeHtml(thread.tripcode)}</span>
              <span class="post__date">${escapeHtml(thread.date)}</span>
              <span class="post__number">No.${thread.postNumber}</span>
            </div>
            <div class="post__body">
              <div class="post__image-container">
                <div class="post__image">${escapeHtml(thread.thumbnailAlt)}</div>
                <div class="post__image-info">(42KB, 320x240, foto_ruim.jpg)</div>
              </div>
              <div class="post__text">
                ${formatText(thread.intro)}
                <p style="margin-top:12px"><span class="fire-text">BORA PRA LISTA:</span></p>
              </div>
            </div>
          </div>`

  // Reply items
  html += `
          <div class="reply-container">`

  for (const item of thread.items) {
    html += `
            <div class="reply">
              <div class="post__header">
                <input type="checkbox" class="post__checkbox" readonly>
                <span class="post__name">Anonymous</span>
                <span class="post__date">${escapeHtml(item.date)}</span>
                <span class="post__number">No.${item.postNumber}</span>
                <span class="quote-link" style="margin-left:4px">&gt;&gt;${thread.postNumber}</span>
              </div>
              <div class="post__body">
                <div class="post__text">
                  <div style="margin-bottom:6px">
                    <span class="rank-badge">#${item.rank}</span>
                    <span class="rank-title">${escapeHtml(item.title)}</span>
                  </div>
                  <p>${escapeHtml(item.text)}</p>
                </div>
              </div>
            </div>`
  }

  html += `
          </div>
          <div style="padding:8px;font-size:11px;color:#707070;border-top:1px solid #b7c5d9;margin-top:8px">
            ${thread.replyCount} respostas e ${thread.imageCount} imagens omitidas.
            <a href="#">Clique aqui para ver tudo (mentira, tá tudo aí já)</a>
          </div>
        </div>
      </div>
      <a id="bottom"></a>`

  // Bottom nav
  html += `
      <div class="nav-bar">
        [<a href="../index.html">Voltar pro Catálogo</a>]
        [<a href="#top">Voltar pro Topo</a>]
      </div>
      <div class="under-construction">
        🚧🚧🚧 SEÇÃO DE COMENTÁRIOS EM CONSTRUÇÃO 🚧🚧🚧
        <br>(na verdade não vai ter comentários nunca hahaha)
      </div>`

  html += pageFooter()

  writeFileSync(join(outDir, 'thread', `${thread.id}.html`), html)
  console.log(`✅ thread/${thread.id}.html gerado — "${thread.title}"`)
}

// ── Copiar CSS ──
function buildCSS() {
  writeFileSync(join(outDir, 'style.css'), css)
  // No longer copying to thread/ subdirectory
  console.log('✅ style.css copiado')
}

// ── Executar build ──
console.log('')
console.log('🔨 ZeroBerto Top 10 Blog — Static Site Generator')
console.log('================================================')
console.log('')

buildCSS()
buildCatalog()

for (const thread of threads) {
  buildThread(thread)
}

console.log('')
console.log(`🎉 Build completo! ${threads.length + 1} páginas geradas em dist-static/`)
console.log('')
console.log('Para visualizar:')
console.log('  npx -y serve dist-static')
console.log('')
console.log('Para adicionar novo conteúdo:')
console.log('  1. Edite src/data/threads.json')
console.log('  2. Execute: node build.js')
console.log('')
