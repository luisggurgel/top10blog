import { Link } from 'react-router-dom'
import threadsData from '../data/threads.json'
import Window from '../components/Window'

export default function CatalogPage() {
  return (
    <>
      {/* Marquee banner */}
      <div className="marquee-container">
        <span className="marquee-text">
          🔥🔥🔥 BEM VINDO AO MELHOR SITE DA INTERNET!!! 🔥🔥🔥 ATUALIZADO EM 2003!!! 🔥🔥🔥 SITE FEITO POR MIM MESMO NO FRONTPAGE!!! 🔥🔥🔥 ADICIONA NOS FAVORITOS!!! 🔥🔥🔥 MELHOR VISUALIZADO EM 800x600!!! 🔥🔥🔥 NAO ROUBE MEU HTML!!! 🔥🔥🔥
        </span>
      </div>

      {/* Under construction banner */}
      <div style={{ textAlign: 'center', padding: '4px' }}>
        <span className="gif-placeholder">🚧 [GIF: under_construction.gif] 🚧</span>
        <span className="gif-placeholder">🔨 [GIF: trabalhador_martelo.gif] 🔨</span>
        <span className="gif-placeholder">🚧 [GIF: under_construction.gif] 🚧</span>
      </div>

      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">
          ★ ZeroBerto Top 10 Blog ★
        </h1>
        <p className="page-subtitle">
          As listas mais ALEATORIAS e INÚTEIS da internet brasileira
        </p>
        <p className="page-subtitle page-subtitle-blink">
          ~ desde 2003 ~
        </p>
      </div>

      <hr className="retro-hr" />

      {/* Board header (4chan style) */}
      <div className="board-header">
        <div className="board-title">/zb/ - ZeroBerto Random</div>
        <div className="board-subtitle">
          "Ninguém pediu essas listas mas aqui estão" - Regras do board: não tem regras lol
        </div>
      </div>

      {/* Navigation */}
      <div className="nav-bar">
        [<a href="#">Home</a>]
        [<a href="#">Regras (não tem)</a>]
        [<Link to="/">Catálogo</Link>]
        [<a href="#">FAQ (mentira)</a>]
        [<a href="#">Contato (não respondo)</a>]
      </div>

      {/* Catalog grid inside a Win95 window */}
      <Window title="/zb/ - Catálogo - Microsoft Internet Explorer">
        <div style={{ fontSize: '11px', color: '#707070', marginBottom: '8px' }}>
          Mostrando {threadsData.length} threads. Clique em uma thread para ler o Top 10 completo.
        </div>
        <div className="catalog-grid">
          {threadsData.map((thread) => (
            <Link
              key={thread.id}
              to={`/thread/${thread.id}`}
              className="catalog-item"
            >
              <div className="catalog-thumb">
                {thread.thumbnailAlt}
              </div>
              <div className="catalog-title">{thread.title}</div>
              <div className="catalog-excerpt">
                {thread.intro.substring(0, 100)}...
              </div>
              <div className="catalog-stats">
                R: {thread.replyCount} / I: {thread.imageCount}
              </div>
            </Link>
          ))}
        </div>
      </Window>

      <hr className="retro-hr" />

      {/* Retro footer elements */}
      <div style={{ textAlign: 'center', padding: '8px' }}>
        <span className="gif-placeholder">🔥 [GIF: chamas_esquerda.gif] 🔥</span>
        <span className="fire-text" style={{ fontSize: '18px', padding: '0 8px' }}>
          SITE MAIS LEGAL DA INTERNET
        </span>
        <span className="gif-placeholder">🔥 [GIF: chamas_direita.gif] 🔥</span>
      </div>

      {/* Webring */}
      <div className="webring">
        <div className="webring__title">🌐 WebRing - Sites Legais de Amigos 🌐</div>
        <div>
          [<a href="#">&lt;&lt; Anterior</a>]
          {' '}
          [<a href="#">Lista</a>]
          {' '}
          [<a href="#">Aleatório</a>]
          {' '}
          [<a href="#">Próximo &gt;&gt;</a>]
        </div>
      </div>

      {/* Guestbook link */}
      <div className="footer-links">
        <a href="#">📖 Assine meu Livro de Visitas!</a> |
        <a href="#">📧 Me manda um email!</a> |
        <a href="#">Meu perfil no Orkut</a> |
        <a href="#">🎨 Fan arts</a>
      </div>

      <div className="best-viewed">
        Melhor visualizado em <span className="ie-badge">IE 6.0</span> com resolução 800x600
      </div>

      <div className="footer-disclaimer">
        © 2003 ZeroBerto. Todos os direitos reservados (mentira, pode copiar)
        <br />
        Site feito no Microsoft FrontPage 2002. Não julgue.
      </div>
    </>
  )
}
