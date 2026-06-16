import { useState } from 'react'
import { api } from '../api'

const EMPTY_ITEM = { rank: 0, title: '', text: '' }

function makeItems() {
  return Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    title: '',
    text: '',
  }))
}

export default function ThreadForm({ onCreated, onClose }) {
  const [title, setTitle] = useState('')
  const [intro, setIntro] = useState('')
  const [tripcode, setTripcode] = useState('')
  const [thumbnailAlt, setThumbnailAlt] = useState('')
  const [items, setItems] = useState(makeItems)
  const [expandedItem, setExpandedItem] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const validate = () => {
    if (!title.trim()) return 'Cadê o título, chefe?'
    if (!intro.trim()) return 'Bota uma intro aí, pelo menos!'
    for (let i = 0; i < 10; i++) {
      if (!items[i].title.trim() || !items[i].text.trim()) {
        return `Item #${i + 1} tá vazio! Preenche tudo, preguiçoso(a)!`
      }
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const body = {
        title: title.trim(),
        intro: intro.trim(),
        tripcode: tripcode.trim() || undefined,
        thumbnailAlt: thumbnailAlt.trim() || '📋',
        items: items.map((item) => ({
          rank: item.rank,
          title: item.title.trim(),
          text: item.text.trim(),
        })),
      }
      await api.post('/threads', body)
      onCreated?.()
      onClose?.()
    } catch (err) {
      setError(err.message || err.error || 'Deu ruim ao criar a thread!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="thread-form__overlay" onClick={onClose}>
      <div className="thread-form" onClick={(e) => e.stopPropagation()}>
        {/* Titlebar */}
        <div className="win-titlebar">
          <span className="win-titlebar__text">✏️ Criar Nova Thread - ZeroBerto Admin</span>
          <div className="win-titlebar__buttons">
            <button className="win-titlebar__btn" type="button" onClick={onClose}>×</button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="thread-form__body">
            <div className="thread-form__field">
              <label htmlFor="tf-title">Título da Thread:</label>
              <input
                id="tf-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Top 10 coisas que ninguém pediu..."
                disabled={submitting}
              />
            </div>

            <div className="thread-form__field">
              <label htmlFor="tf-intro">Introdução / Texto do OP:</label>
              <textarea
                id="tf-intro"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="Escreve a intro da thread aqui (use >greentext se quiser)"
                rows={4}
                disabled={submitting}
              />
            </div>

            <div className="thread-form__field">
              <label htmlFor="tf-trip">Tripcode (opcional):</label>
              <input
                id="tf-trip"
                type="text"
                value={tripcode}
                onChange={(e) => setTripcode(e.target.value)}
                placeholder="!!AbCdEf123"
                disabled={submitting}
              />
            </div>

            <div className="thread-form__field">
              <label htmlFor="tf-thumb">Emoji/Texto do Thumbnail:</label>
              <input
                id="tf-thumb"
                type="text"
                value={thumbnailAlt}
                onChange={(e) => setThumbnailAlt(e.target.value)}
                placeholder="📋 ou [IMG: nome.jpg]"
                disabled={submitting}
              />
            </div>

            {/* Items */}
            <div className="thread-form__items-title">📝 Itens do Top 10:</div>
            {items.map((item, index) => (
              <div key={item.rank} className="thread-form__item">
                <div
                  className="thread-form__item-header"
                  onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                >
                  <span>{expandedItem === index ? '▼' : '►'}</span>
                  <strong>#{item.rank}</strong>
                  <span>{item.title || '(sem título)'}</span>
                </div>

                {expandedItem === index && (
                  <div className="thread-form__item-body">
                    <div className="thread-form__field">
                      <label>Título do item #{item.rank}:</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                        placeholder={`Nome do item #${item.rank}`}
                        disabled={submitting}
                      />
                    </div>
                    <div className="thread-form__field">
                      <label>Texto/Descrição:</label>
                      <textarea
                        value={item.text}
                        onChange={(e) => updateItem(index, 'text', e.target.value)}
                        placeholder="Descreve o item aqui..."
                        rows={3}
                        disabled={submitting}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && <div className="thread-form__error">⚠️ {error}</div>}

          <div className="thread-form__actions">
            <button type="submit" className="win-button" disabled={submitting}>
              {submitting ? 'Criando...' : '📤 Criar Thread'}
            </button>
            <button type="button" className="win-button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
