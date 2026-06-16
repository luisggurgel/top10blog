import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Window from '../components/Window'
import Post from '../components/Post'
import Reply from '../components/Reply'
import VoteButtons from '../components/VoteButtons'
import CommentSection from '../components/CommentSection'
import { api } from '../api'

export default function ThreadPage() {
  const { id } = useParams()
  const [thread, setThread] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    setError(false)

    api.get(`/threads/${id}`)
      .then((data) => {
        const t = data.thread ?? data
        setThread(t)
        document.title = `${t.title} - ZeroBerto Top 10 Blog`
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))

    return () => {
      document.title = 'ZeroBerto Top 10 Blog - As listas mais aleatórias da internet!!'
    }
  }, [id])

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-state__spinner" />
        <div>Carregando thread... (a internet discada é lenta, paciência)</div>
      </div>
    )
  }

  if (error || !thread) {
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
        <VoteButtons
          targetType="thread"
          targetId={thread.id}
          initialScore={thread.score ?? 0}
          initialUserVote={thread.userVote ?? 0}
        />
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
            <Reply key={item.rank} item={item} opPostNumber={thread.postNumber} />
          ))}
        </div>

        {/* Thread stats */}
        <div style={{ padding: '8px', fontSize: '11px', color: '#707070', borderTop: '1px solid #b7c5d9', marginTop: '8px' }}>
          {thread.replyCount ?? 0} respostas e {thread.imageCount ?? 0} imagens omitidas.
          <a href="#comments" onClick={(e) => { e.preventDefault(); document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ marginLeft: '4px' }}>
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

      {/* Comment Section (replaces the old "EM CONSTRUÇÃO" banner) */}
      <CommentSection threadId={id} />
    </>
  )
}
