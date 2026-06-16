import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'

export default function VoteButtons({ targetType, targetId, initialScore = 0, initialUserVote = 0 }) {
  const { user } = useAuth()
  const [score, setScore] = useState(initialScore)
  const [userVote, setUserVote] = useState(initialUserVote)
  const [tooltip, setTooltip] = useState(false)

  const handleVote = useCallback(async (value) => {
    if (!user) {
      setTooltip(true)
      setTimeout(() => setTooltip(false), 2000)
      return
    }

    // Toggle off if clicking same button
    const newValue = userVote === value ? 0 : value
    const scoreDelta = newValue - userVote

    // Optimistic update
    setScore((prev) => prev + scoreDelta)
    setUserVote(newValue)

    try {
      await api.post(`/${targetType}s/${targetId}/vote`, { value: newValue })
    } catch {
      // Revert on error
      setScore((prev) => prev - scoreDelta)
      setUserVote(userVote)
    }
  }, [user, userVote, targetType, targetId])

  const scoreClass = score > 0
    ? 'vote-buttons__score vote-buttons__score--positive'
    : score < 0
      ? 'vote-buttons__score vote-buttons__score--negative'
      : 'vote-buttons__score'

  return (
    <span className="vote-buttons">
      <button
        className={`vote-buttons__btn ${userVote === 1 ? 'vote-buttons__btn--active-up' : ''}`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleVote(1) }}
        type="button"
        title="Upvote"
      >
        👍
      </button>
      <span className={scoreClass}>{score}</span>
      <button
        className={`vote-buttons__btn ${userVote === -1 ? 'vote-buttons__btn--active-down' : ''}`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleVote(-1) }}
        type="button"
        title="Downvote"
      >
        👎
      </button>
      {tooltip && <span className="vote-buttons__tooltip">Faça login para votar!</span>}
    </span>
  )
}
