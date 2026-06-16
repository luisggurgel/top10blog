import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Window from '../components/Window'
import VoteButtons from '../components/VoteButtons'
import ThreadForm from '../components/ThreadForm'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'

// Retro modal component for popup messages
function RetroModal({ title, children, onClose }) {
  return (
    <div className="login-modal__overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="win-titlebar">
          <span className="win-titlebar__text">{title}</span>
          <div className="win-titlebar__buttons">
            <button className="win-titlebar__btn" type="button" onClick={onClose}>×</button>
          </div>
        </div>
        <div style={{ padding: '16px', fontFamily: 'var(--font-system)', fontSize: '12px', lineHeight: '1.6' }}>
          {children}
          <div style={{ textAlign: 'right', marginTop: '12px' }}>
            <button className="win-button" onClick={onClose} style={{ minWidth: '75px' }}>OK</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeModal, setActiveModal] = useState(null) // 'regras' | 'faq' | 'contato' | 'guestbook' | 'email' | 'orkut' | 'fanarts'

  const fetchThreads = () => {
    setLoading(true)
    api.get('/threads')
      .then((data) => setThreads(Array.isArray(data) ? data : data.threads ?? []))
      .catch(() => setThreads([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchThreads()
  }, [])

  const handleCreated = () => {
    fetchThreads()
    setShowForm(false)
  }

  // WebRing navigation — navigates to random threads
  const handleWebringPrev = (e) => {
    e.preventDefault()
    if (threads.length > 0) {
      const randomThread = threads[Math.floor(Math.random() * threads.length)]
      navigate(`/thread/${randomThread.id}`)
    }
  }

  const handleWebringNext = (e) => {
    e.preventDefault()
    if (threads.length > 0) {
      const randomThread = threads[Math.floor(Math.random() * threads.length)]
      navigate(`/thread/${randomThread.id}`)
    }
  }

  const handleWebringRandom = (e) => {
    e.preventDefault()
    if (threads.length > 0) {
      const randomThread = threads[Math.floor(Math.random() * threads.length)]
      navigate(`/thread/${randomThread.id}`)
    }
  }

  const handleWebringList = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Modals */}
      {activeModal === 'regras' && (
        <RetroModal title="📜 Regras do Board - Bloco de Notas" onClose={() => setActiveModal(null)}>
          <p style={{ fontFamily: 'var(--font-comic)', fontSize: '14px', color: 'var(--4ch-subject)' }}>
            📋 REGRAS OFICIAIS DO /zb/:
          </p>
          <ol style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li>Não tem regras lol</li>
            <li>Mentira, tem uma: <b>seja legal</b> (ou não, tanto faz)</li>
            <li>Não poste spoilers de Dragon Ball (sim isso ainda importa)</li>
            <li>Se seu top 10 for ruim, a culpa é sua</li>
            <li>O admin sempre tem razão (eu sou o admin)</li>
            <li>Posts em Comic Sans ganham prioridade</li>
            <li>É proibido dizer que Orkut era melhor que Facebook (mentira, pode sim)</li>
            <li>Regra secreta: se você leu até aqui, manda um "zueira" nos comentários</li>
          </ol>
          <p style={{ marginTop: '8px', color: '#999', fontStyle: 'italic' }}>
            Última atualização: 15/03/2003 às 02:47 (horário de Brasília)
          </p>
        </RetroModal>
      )}

      {activeModal === 'faq' && (
        <RetroModal title="❓ FAQ - Perguntas Frequentes" onClose={() => setActiveModal(null)}>
          <p style={{ fontFamily: 'var(--font-comic)', fontSize: '14px', color: 'var(--4ch-subject)' }}>
            🤔 PERGUNTAS QUE NINGUÉM FEZ:
          </p>
          <div style={{ marginTop: '8px' }}>
            <p><b>P: Quem é o ZeroBerto?</b></p>
            <p>R: Sou eu. Prazer. Não sei por que me chamam assim.</p>
            <br />
            <p><b>P: Por que fazer listas de top 10?</b></p>
            <p>R: Porque top 5 é pouco e top 20 dá preguiça.</p>
            <br />
            <p><b>P: O site funciona no Netscape?</b></p>
            <p>R: Provavelmente não. Use IE 6.0 como pessoa civilizada.</p>
            <br />
            <p><b>P: Posso mandar minha própria lista?</b></p>
            <p>R: Pode, mas eu não vou publicar. (brincadeira, manda sim)</p>
            <br />
            <p><b>P: O contador de visitantes é real?</b></p>
            <p>R: 100% real não é fake confia 👍</p>
          </div>
        </RetroModal>
      )}

      {activeModal === 'contato' && (
        <RetroModal title="📧 Contato - Microsoft Outlook Express" onClose={() => setActiveModal(null)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px' }}>📨</span>
            <div>
              <p style={{ fontFamily: 'var(--font-comic)', fontSize: '14px', color: 'var(--4ch-subject)' }}>
                ENTRE EM CONTATO (eu não vou responder)
              </p>
            </div>
          </div>
          <p>📧 Email: zeroberto2003@bol.com.br (cheio de spam)</p>
          <p>💬 MSN: zeroberto_ownador@hotmail.com</p>
          <p>🔵 ICQ#: 48291037 (nem sei se ainda existe)</p>
          <p>📞 Orkut: /ZeroBertoOficial (perfil deletado lol)</p>
          <p style={{ marginTop: '10px', color: 'var(--kid-red)', fontWeight: 'bold' }}>
            ⚠️ AVISO: Não aceito correntes. Não, eu não vou morrer em 7 dias se não repassar.
          </p>
        </RetroModal>
      )}

      {activeModal === 'guestbook' && (
        <RetroModal title="📖 Livro de Visitas - Microsoft Internet Explorer" onClose={() => setActiveModal(null)}>
          <p style={{ fontFamily: 'var(--font-comic)', fontSize: '14px', color: 'var(--4ch-subject)', marginBottom: '10px' }}>
            📖 LIVRO DE VISITAS DO ZEROBERTO
          </p>
          <div style={{ background: 'var(--4ch-bg)', border: '1px solid var(--4ch-border)', padding: '8px', marginBottom: '6px' }}>
            <p><b>xXx_DarkMaster_xXx</b> - 12/01/2003</p>
            <p style={{ color: '#707070' }}>site massa mano!! adiciona no msn!! xD</p>
          </div>
          <div style={{ background: 'var(--4ch-bg)', border: '1px solid var(--4ch-border)', padding: '8px', marginBottom: '6px' }}>
            <p><b>~*PrInCeSiNhA*~</b> - 15/02/2003</p>
            <p style={{ color: '#707070' }}>oi vim pelo orkut!! site mto lgl!! bjos ;*</p>
          </div>
          <div style={{ background: 'var(--4ch-bg)', border: '1px solid var(--4ch-border)', padding: '8px', marginBottom: '6px' }}>
            <p><b>Admin</b> - 16/02/2003</p>
            <p style={{ color: '#707070' }}>obrigado!! voltem sempre!! (por favor alguem visita meu site)</p>
          </div>
          <div style={{ background: 'var(--4ch-bg)', border: '1px solid var(--4ch-border)', padding: '8px', marginBottom: '6px' }}>
            <p><b>COMPRE VIAGRA BARATO</b> - 20/03/2003</p>
            <p style={{ color: '#707070' }}>www.viagra-barato-nao-e-virus.geocities.com</p>
          </div>
          <p style={{ marginTop: '8px', fontSize: '10px', color: '#999' }}>
            Use a seção de comentários nas threads para deixar sua mensagem! 💬
          </p>
        </RetroModal>
      )}

      {activeModal === 'email' && (
        <RetroModal title="📧 Novo Email - Outlook Express" onClose={() => setActiveModal(null)}>
          <div style={{ background: '#fff', border: '2px inset var(--win-silver)', padding: '8px', marginBottom: '8px' }}>
            <p><b>Para:</b> zeroberto2003@bol.com.br</p>
            <p><b>De:</b> voce@internautas.com.br</p>
            <p><b>Assunto:</b> Seu site é muito legal!!!</p>
          </div>
          <div style={{ background: '#fff', border: '2px inset var(--win-silver)', padding: '8px', minHeight: '80px' }}>
            <p style={{ color: '#999' }}>Oi ZeroBerto!</p>
            <p style={{ color: '#999' }}>Adorei seu site! Continue fazendo listas!</p>
            <p style={{ color: '#999' }}>Beijos e abraços do seu fã #1</p>
          </div>
          <p style={{ marginTop: '8px', color: 'var(--kid-red)', fontSize: '11px' }}>
            ❌ Erro: O servidor de email BOL não está mais respondendo (desde 2015).
            <br />Use os comentários nas threads para enviar sua mensagem! 💬
          </p>
        </RetroModal>
      )}

      {activeModal === 'orkut' && (
        <RetroModal title="🔵 Orkut - Perfil de ZeroBerto" onClose={() => setActiveModal(null)}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '48px' }}>😎</span>
            <p style={{ fontFamily: 'var(--font-comic)', fontSize: '16px', color: 'var(--4ch-subject)', marginTop: '4px' }}>
              ZeroBerto Oficial
            </p>
            <p style={{ fontSize: '10px', color: '#999' }}>Último login: 30/09/2014</p>
          </div>
          <div style={{ background: 'var(--4ch-bg)', border: '1px solid var(--4ch-border)', padding: '8px' }}>
            <p><b>Comunidades:</b></p>
            <p style={{ color: '#707070' }}>• Eu odeio acordar cedo (4.218.392 membros)</p>
            <p style={{ color: '#707070' }}>• Top 10 de Tudo (3 membros)</p>
            <p style={{ color: '#707070' }}>• Quem naum tem orkut é antisocial (deletada)</p>
            <p style={{ color: '#707070' }}>• Eu finjo que trabalho (1.847.293 membros)</p>
          </div>
          <p style={{ marginTop: '10px', textAlign: 'center', color: 'var(--kid-red)', fontWeight: 'bold' }}>
            ⚠️ O Orkut foi descontinuado em 30/09/2014.<br />
            RIP em paz, querido. 🕊️
          </p>
        </RetroModal>
      )}

      {activeModal === 'fanarts' && (
        <RetroModal title="🎨 Fan Arts - Galeria de Imagens" onClose={() => setActiveModal(null)}>
          <p style={{ fontFamily: 'var(--font-comic)', fontSize: '14px', color: 'var(--4ch-subject)', marginBottom: '10px' }}>
            🖼️ GALERIA DE FAN ARTS
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ background: 'var(--4ch-bg)', border: '1px solid var(--4ch-border)', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '40px' }}>🎨</span>
              <p style={{ fontSize: '10px', marginTop: '4px' }}>zeroberto_dragon.bmp</p>
              <p style={{ fontSize: '9px', color: '#999' }}>por xXDarkArtistXx</p>
            </div>
            <div style={{ background: 'var(--4ch-bg)', border: '1px solid var(--4ch-border)', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '40px' }}>🖌️</span>
              <p style={{ fontSize: '10px', marginTop: '4px' }}>logo_animado.gif</p>
              <p style={{ fontSize: '9px', color: '#999' }}>por ~PrincesaDaLua~</p>
            </div>
            <div style={{ background: 'var(--4ch-bg)', border: '1px solid var(--4ch-border)', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '40px' }}>✏️</span>
              <p style={{ fontSize: '10px', marginTop: '4px' }}>zeroberto_anime.jpg</p>
              <p style={{ fontSize: '9px', color: '#999' }}>por NarutoFan2003</p>
            </div>
            <div style={{ background: 'var(--4ch-bg)', border: '1px solid var(--4ch-border)', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '40px' }}>🖍️</span>
              <p style={{ fontSize: '10px', marginTop: '4px' }}>banner_novo.png</p>
              <p style={{ fontSize: '9px', color: '#999' }}>por Admin (eu)</p>
            </div>
          </div>
          <p style={{ marginTop: '10px', fontSize: '10px', color: '#999', textAlign: 'center' }}>
            Mande sua fan art nos comentários de qualquer thread! 🎨
          </p>
        </RetroModal>
      )}

      {/* Marquee banner */}
      <div className="marquee-container">
        <span className="marquee-text">
          🔥🔥🔥 BEM VINDO AO MELHOR SITE DA INTERNET!!! 🔥🔥🔥 ATUALIZADO EM 2003!!! 🔥🔥🔥 SITE FEITO POR MIM MESMO NO FRONTPAGE!!! 🔥🔥🔥 ADICIONA NOS FAVORITOS!!! 🔥🔥🔥 MELHOR VISUALIZADO EM 800x600!!! 🔥🔥🔥 NAO ROUBE MEU HTML!!! 🔥🔥🔥
        </span>
      </div>

      {/* Under construction banner */}
      <div style={{ textAlign: 'center', padding: '4px' }}>
        <span className="gif-placeholder gif-placeholder--construction">🚧 [GIF: under_construction.gif] 🚧</span>
        <span className="gif-placeholder gif-placeholder--construction">🔨 [GIF: trabalhador_martelo.gif] 🔨</span>
        <span className="gif-placeholder gif-placeholder--construction">🚧 [GIF: under_construction.gif] 🚧</span>
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
        [<Link to="/">Home</Link>]
        [<a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('regras') }}>Regras (não tem)</a>]
        [<Link to="/">Catálogo</Link>]
        [<a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('faq') }}>FAQ (mentira)</a>]
        [<a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('contato') }}>Contato (não respondo)</a>]
      </div>

      {/* Admin: create thread button */}
      {isAdmin && (
        <div style={{ textAlign: 'center', padding: '8px' }}>
          <button
            className="win-button"
            onClick={() => setShowForm(true)}
            style={{ fontSize: '13px' }}
          >
            ✏️ Criar Nova Thread
          </button>
        </div>
      )}

      {/* Thread Form Modal */}
      {showForm && (
        <ThreadForm onCreated={handleCreated} onClose={() => setShowForm(false)} />
      )}

      {/* Catalog grid inside a Win95 window */}
      <Window title="/zb/ - Catálogo - Microsoft Internet Explorer">
        {loading ? (
          <div className="loading-state">
            <div className="loading-state__spinner" />
            <div>Carregando threads... (a internet discada é lenta, paciência)</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '11px', color: '#707070', marginBottom: '8px' }}>
              Mostrando {threads.length} threads. Clique em uma thread para ler o Top 10 completo.
            </div>
            <div className="catalog-grid">
              {threads.map((thread) => (
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
                    R: {thread.replyCount ?? 0} / I: {thread.imageCount ?? 0}
                  </div>
                  <VoteButtons
                    targetType="thread"
                    targetId={thread.id}
                    initialScore={thread.score ?? 0}
                    initialUserVote={thread.userVote ?? 0}
                  />
                </Link>
              ))}
            </div>
          </>
        )}
      </Window>

      <hr className="retro-hr" />

      {/* Retro footer elements */}
      <div style={{ textAlign: 'center', padding: '8px' }}>
        <span className="gif-placeholder gif-placeholder--fire">🔥 [GIF: chamas_esquerda.gif] 🔥</span>
        <span className="fire-text" style={{ fontSize: '18px', padding: '0 8px' }}>
          SITE MAIS LEGAL DA INTERNET
        </span>
        <span className="gif-placeholder gif-placeholder--fire">🔥 [GIF: chamas_direita.gif] 🔥</span>
      </div>

      {/* Webring */}
      <div className="webring">
        <div className="webring__title">🌐 WebRing - Sites Legais de Amigos 🌐</div>
        <div>
          [<a href="#" onClick={handleWebringPrev}>&lt;&lt; Anterior</a>]
          {' '}
          [<a href="#" onClick={handleWebringList}>Lista</a>]
          {' '}
          [<a href="#" onClick={handleWebringRandom}>Aleatório</a>]
          {' '}
          [<a href="#" onClick={handleWebringNext}>Próximo &gt;&gt;</a>]
        </div>
      </div>

      {/* Guestbook link */}
      <div className="footer-links">
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('guestbook') }}>📖 Assine meu Livro de Visitas!</a> |
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('email') }}>📧 Me manda um email!</a> |
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('orkut') }}>Meu perfil no Orkut</a> |
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('fanarts') }}>🎨 Fan arts</a>
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
