import { useParams, Link } from 'react-router-dom'
import threadsData from '../data/threads.json'
import Window from '../components/Window'
import Post from '../components/Post'

export default function ThreadPage() {
  const { id } = useParams()
  const thread = threadsData.find((t) => t.id === parseInt(id))

  if (!thread) {
    return (
      <Window title="Erro - Microsoft Internet Explorer">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ fontSize: '48px' }}>:(</p>
          <h2 style={{ fontFamily: 'var(--font-comic)', color: 'var(--kid-red)' }}>
            404 - Thread não encontrada!!
          </h2>
          <p style={{ margin: '12px 0' }}>
            Essa thread não existe ou foi deletada pelo admin (eu) pq sim.
          </p>
          <Link to="/" className="win-button" style={{ display: 'inline-block', textDecoration: 'none', color: 'inherit' }}>
            Voltar pro Catálogo
          </Link>
        </div>
      </Window>
    )
  }

  const formatIntro = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('>')) {
        return <p key={i} className="greentext">{line}</p>
      }
      if (line === '') return <br key={i} />
      return <p key={i}>{line}</p>
    })
  }

  return (
    <>
      {/* Navigation */}
      <div className="nav-bar">
        [<Link to="/">Catálogo</Link>]
        [<a href="#top">Topo</a>]
        [<a href="#bottom">Fundo</a>]
      </div>

      {/* Thread title */}
      <div className="board-header">
        <div className="board-title" style={{ fontSize: '20px' }}>
          /zb/ - {thread.title}
        </div>
      </div>

      <div id="top"></div>

      {/* OP Post */}
      <Window title={`${thread.title} - Microsoft Internet Explorer`}>
        <Post
          postNumber={thread.postNumber}
          subject={thread.title}
          author={thread.author}
          tripcode={thread.tripcode}
          date={thread.date}
          imageAlt={thread.thumbnailAlt}
          isOP={true}
        >
          {formatIntro(thread.intro)}
          <p style={{ marginTop: '12px' }}>
            <span className="fire-text">BORA PRA LISTA:</span>
          </p>
        </Post>

        {/* Each top 10 item as a reply */}
        <div className="reply-container">
          {thread.items.map((item) => (
            <div key={item.rank} className="reply">
              <div className="post__header">
                <input type="checkbox" className="post__checkbox" readOnly />
                <span className="post__name">Anonymous</span>
                <span className="post__date">{item.date}</span>
                <a href="#" className="post__number" onClick={(e) => e.preventDefault()}>
                  No.{item.postNumber}
                </a>
                <span className="quote-link" style={{ marginLeft: '4px' }}>
                  &gt;&gt;{thread.postNumber}
                </span>
              </div>
              <div className="post__body">
                <div className="post__text">
                  <div style={{ marginBottom: '6px' }}>
                    <span className="rank-badge">#{item.rank}</span>
                    <span className="rank-title">{item.title}</span>
                  </div>
                  <p>{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Thread stats */}
        <div style={{ padding: '8px', fontSize: '11px', color: '#707070', borderTop: '1px solid #b7c5d9', marginTop: '8px' }}>
          {thread.replyCount} respostas e {thread.imageCount} imagens omitidas.
          <a href="#" onClick={(e) => e.preventDefault()} style={{ marginLeft: '4px' }}>
            Clique aqui para ver tudo (mentira, tá tudo aí já)
          </a>
        </div>
      </Window>

      <div id="bottom"></div>

      {/* Bottom navigation */}
      <div className="nav-bar">
        [<Link to="/">Voltar pro Catálogo</Link>]
        [<a href="#top">Voltar pro Topo</a>]
      </div>

      {/* Under construction */}
      <div className="under-construction">
        🚧🚧🚧 SEÇÃO DE COMENTÁRIOS EM CONSTRUÇÃO 🚧🚧🚧
        <br />
        (na verdade não vai ter comentários nunca hahaha)
      </div>
    </>
  )
}
