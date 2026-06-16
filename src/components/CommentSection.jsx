import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import Comment from './Comment'
import { censorText } from '../utils/wordFilter'

function buildTree(comments) {
  const map = {}
  const roots = []

  comments.forEach((c) => {
    map[c.id] = { ...c, children: [] }
  })

  comments.forEach((c) => {
    if (c.parentId && map[c.parentId]) {
      map[c.parentId].children.push(map[c.id])
    } else {
      roots.push(map[c.id])
    }
  })

  return roots
}

export default function CommentSection({ threadId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Censor preview in real-time
  const censored = useMemo(() => censorText(text), [text])

  const fetchComments = useCallback(async () => {
    try {
      const data = await api.get(`/threads/${threadId}/comments`)
      setComments(Array.isArray(data) ? data : data.comments ?? [])
    } catch {
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [threadId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setSubmitting(true)
    try {
      await api.post(`/threads/${threadId}/comments`, { text: text.trim() })
      setText('')
      fetchComments()
    } catch {
      // fail silently
    } finally {
      setSubmitting(false)
    }
  }

  const tree = buildTree(comments)

  return (
    <div id="comments" className="comment-section">
      <div className="comment-section__title">💬 Seção de Comentários</div>

      {/* New comment form */}
      {user ? (
        <form className="comment-section__form" onSubmit={handleSubmit}>
          <textarea
            className={`comment-section__textarea ${censored.hasForbidden ? 'comment-section__textarea--warn' : ''}`}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 500))}
            placeholder="Manda teu comentário aí, jovem... (tenta não falar besteira demais)"
            rows={3}
            disabled={submitting}
          />
          {censored.hasForbidden && (
            <>
              <div className="comment-section__profanity-warn">
                ⚠️ Palavras proibidas detectadas! Serão censuradas automaticamente.
              </div>
              <div className="comment-section__preview">
                <span className="comment-section__preview-label">Preview censurado:</span>
                <span className="comment-section__preview-text">{censored.filtered}</span>
              </div>
            </>
          )}
          <div className="comment-section__footer">
            <span className={`comment-section__counter ${text.length > 450 ? 'comment-section__counter--warn' : ''}`}>
              {text.length}/500
            </span>
            <button type="submit" className="win-button" disabled={submitting || !text.trim()}>
              {submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-section__login-msg">
          🔒 Faça login para comentar! (sim, precisa de conta, mimimi)
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-state__spinner" />
          <div>Carregando comentários...</div>
        </div>
      ) : tree.length === 0 ? (
        <div className="comment-section__login-msg">
          Nenhum comentário ainda. Seja o primeiro a falar besteira! 🎉
        </div>
      ) : (
        tree.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            threadId={threadId}
            onCommentAdded={fetchComments}
          />
        ))
      )}
    </div>
  )
}
