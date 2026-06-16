import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import VoteButtons from './VoteButtons'
import { censorText } from '../utils/wordFilter'

export default function Comment({ comment, threadId, onCommentAdded }) {
  const { user, isAdmin } = useAuth()
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Censor the displayed comment text
  const displayText = useMemo(() => censorText(comment.text).filtered, [comment.text])

  // Censor preview for reply
  const replyCensored = useMemo(() => censorText(replyText), [replyText])

  // Can delete: admin can delete any, user can delete their own
  const canDelete = user && (isAdmin || user.id === comment.userId)

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setDeleting(true)
    try {
      await api.del(`/comments/${comment.id}`)
      onCommentAdded?.() // refresh comments list
    } catch (err) {
      alert(err?.error || 'Erro ao deletar comentário')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setSubmitting(true)
    try {
      await api.post(`/threads/${threadId}/comments`, {
        text: replyText.trim(),
        parentId: comment.id,
      })
      setReplyText('')
      setShowReply(false)
      onCommentAdded?.()
    } catch {
      // silently fail for now
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="comment">
      <div className="comment__header">
        <span className="comment__author">{comment.username}</span>
        <span className="comment__date">{formatDate(comment.createdAt ?? comment.created_at)}</span>
        {canDelete && (
          <span className="comment__delete-area">
            {confirmDelete ? (
              <>
                <span className="comment__delete-confirm-text">Apagar?</span>
                <button
                  className="comment__delete-btn comment__delete-btn--yes"
                  onClick={handleDelete}
                  disabled={deleting}
                  type="button"
                >
                  {deleting ? '...' : 'Sim'}
                </button>
                <button
                  className="comment__delete-btn comment__delete-btn--no"
                  onClick={() => setConfirmDelete(false)}
                  type="button"
                >
                  Não
                </button>
              </>
            ) : (
              <button
                className="comment__delete-btn"
                onClick={handleDelete}
                title={isAdmin && user.id !== comment.userId ? 'Deletar (admin)' : 'Deletar meu comentário'}
                type="button"
              >
                🗑️
              </button>
            )}
          </span>
        )}
      </div>

      <div className="comment__text">{displayText}</div>

      <div className="comment__actions">
        <VoteButtons
          targetType="comment"
          targetId={comment.id}
          initialScore={comment.score ?? 0}
          initialUserVote={comment.userVote ?? 0}
        />
        {user && (
          <button
            className="comment__reply-btn"
            onClick={() => setShowReply(!showReply)}
            type="button"
          >
            {showReply ? 'Cancelar' : 'Responder'}
          </button>
        )}
      </div>

      {/* Inline reply form */}
      {showReply && (
        <form className="comment__reply-form" onSubmit={handleReply}>
          <textarea
            className={`comment-section__textarea ${replyCensored.hasForbidden ? 'comment-section__textarea--warn' : ''}`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value.slice(0, 500))}
            placeholder="Escreve tua resposta aí, champs..."
            rows={3}
            disabled={submitting}
          />
          {replyCensored.hasForbidden && (
            <>
              <div className="comment-section__profanity-warn">
                ⚠️ Palavras proibidas! Serão censuradas com *.
              </div>
              <div className="comment-section__preview">
                <span className="comment-section__preview-label">Preview:</span>
                <span className="comment-section__preview-text">{replyCensored.filtered}</span>
              </div>
            </>
          )}
          <div className="comment-section__footer">
            <span className={`comment-section__counter ${replyText.length > 450 ? 'comment-section__counter--warn' : ''}`}>
              {replyText.length}/500
            </span>
            <button type="submit" className="win-button" disabled={submitting || !replyText.trim()}>
              {submitting ? 'Enviando...' : 'Responder'}
            </button>
          </div>
        </form>
      )}

      {/* Recursive children */}
      {comment.children?.length > 0 && (
        <div className="comment__children">
          {comment.children.map((child) => (
            <Comment
              key={child.id}
              comment={child}
              threadId={threadId}
              onCommentAdded={onCommentAdded}
            />
          ))}
        </div>
      )}
    </div>
  )
}
