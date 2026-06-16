import { useState } from 'react'

export default function Reply({ item, opPostNumber }) {
  const [checked, setChecked] = useState(false)
  const [copied, setCopied] = useState(false)

  const handlePostNumberClick = (e) => {
    e.preventDefault()
    const text = `>>${item.postNumber}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleQuoteLinkClick = () => {
    // Scroll to the OP post
    const opElement = document.getElementById('top')
    if (opElement) {
      opElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className={`reply ${checked ? 'post--selected' : ''}`}>
      <div className="post__header">
        <input
          type="checkbox"
          className="post__checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          aria-label="Selecionar post"
        />
        <span className="post__name">Anonymous</span>
        <span className="post__date">{item.date}</span>
        <a
          href={`#post-${item.postNumber}`}
          className="post__number"
          onClick={handlePostNumberClick}
          title={copied ? '✅ Copiado!' : 'Clique para copiar >>número'}
        >
          No.{item.postNumber}
          {copied && <span className="post__copied-badge">Copiado!</span>}
        </a>
        <a
          href="#top"
          className="quote-link"
          style={{ marginLeft: '4px' }}
          onClick={(e) => { e.preventDefault(); handleQuoteLinkClick() }}
          title="Ir para o post original"
        >
          &gt;&gt;{opPostNumber}
        </a>
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
  )
}
