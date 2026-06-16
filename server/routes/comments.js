import { Router } from 'express'
import pool from '../db.js'
import { authenticate } from '../middleware/auth.js'
import { censorText } from '../utils/wordFilter.js'

const router = Router()

// GET /threads/:threadId/comments — list comments for a thread
router.get('/threads/:threadId/comments', async (req, res) => {
  try {
    const { threadId } = req.params

    const { rows } = await pool.query(
      `SELECT c.id, c.thread_id AS "threadId", c.parent_id AS "parentId",
              c.user_id AS "userId", u.username, c.text, c.score,
              c.created_at AS "createdAt"
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.thread_id = $1
       ORDER BY c.created_at ASC`,
      [threadId]
    )

    res.json(rows)
  } catch (err) {
    console.error('Erro ao listar comentários:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// POST /threads/:threadId/comments — create a comment
router.post('/threads/:threadId/comments', authenticate, async (req, res) => {
  try {
    const { threadId } = req.params
    const { text, parentId } = req.body
    const userId = req.user.id

    if (!text || text.length === 0 || text.length > 500) {
      return res.status(400).json({ error: 'Texto deve ter entre 1 e 500 caracteres' })
    }

    // Verify thread exists
    const threadCheck = await pool.query(
      `SELECT id FROM threads WHERE id = $1`,
      [threadId]
    )
    if (threadCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Thread não encontrada' })
    }

    // Verify parent comment if provided
    if (parentId) {
      const parentCheck = await pool.query(
        `SELECT id FROM comments WHERE id = $1 AND thread_id = $2`,
        [parentId, threadId]
      )
      if (parentCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Comentário pai não encontrado nesta thread' })
      }
    }

    // Apply profanity filter
    const { filtered: cleanText, hasForbidden } = censorText(text.trim())

    const { rows } = await pool.query(
      `INSERT INTO comments (thread_id, parent_id, user_id, text)
       VALUES ($1, $2, $3, $4)
       RETURNING id, thread_id AS "threadId", parent_id AS "parentId",
                 user_id AS "userId", text, score, created_at AS "createdAt"`,
      [threadId, parentId || null, userId, cleanText]
    )

    const comment = rows[0]
    comment.username = req.user.username
    if (hasForbidden) comment.censored = true

    res.status(201).json(comment)
  } catch (err) {
    console.error('Erro ao criar comentário:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// POST /comments/:id/vote — vote on a comment (toggle)
router.post('/comments/:id/vote', authenticate, async (req, res) => {
  try {
    const commentId = req.params.id
    const userId = req.user.id
    const { value } = req.body

    if (value !== 1 && value !== -1) {
      return res.status(400).json({ error: 'Valor do voto deve ser 1 ou -1' })
    }

    // Check if vote already exists
    const existing = await pool.query(
      `SELECT id, value FROM votes
       WHERE user_id = $1 AND target_type = $2 AND target_id = $3`,
      [userId, 'comment', commentId]
    )

    let userVote = null

    if (existing.rows.length > 0 && existing.rows[0].value === value) {
      // Same vote: toggle off (delete)
      await pool.query(
        `DELETE FROM votes WHERE id = $1`,
        [existing.rows[0].id]
      )
      userVote = null
    } else {
      // Upsert vote
      await pool.query(
        `INSERT INTO votes (user_id, target_type, target_id, value)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, target_type, target_id)
         DO UPDATE SET value = $4`,
        [userId, 'comment', commentId, value]
      )
      userVote = value
    }

    // Update comment score
    await pool.query(
      `UPDATE comments
       SET score = COALESCE((SELECT SUM(value) FROM votes WHERE target_type = 'comment' AND target_id = $1), 0)
       WHERE id = $1`,
      [commentId]
    )

    const scoreResult = await pool.query(
      `SELECT score FROM comments WHERE id = $1`,
      [commentId]
    )

    res.json({ score: scoreResult.rows[0].score, userVote })
  } catch (err) {
    console.error('Erro ao votar no comentário:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})
// DELETE /comments/:id — delete a comment
// Admin can delete any comment, users can only delete their own
router.delete('/comments/:id', authenticate, async (req, res) => {
  try {
    const commentId = req.params.id
    const userId = req.user.id
    const userRole = req.user.role

    // Fetch the comment to check ownership
    const { rows } = await pool.query(
      `SELECT id, user_id FROM comments WHERE id = $1`,
      [commentId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Comentário não encontrado' })
    }

    const comment = rows[0]

    // Check permission: admin can delete any, user only their own
    if (userRole !== 'admin' && comment.user_id !== userId) {
      return res.status(403).json({ error: 'Você só pode apagar seus próprios comentários' })
    }

    // Delete votes associated with this comment and its children
    await pool.query(
      `DELETE FROM votes WHERE target_type = 'comment' AND target_id IN (
        SELECT id FROM comments WHERE id = $1 OR parent_id = $1
      )`,
      [commentId]
    )

    // Delete comment (children are cascaded via ON DELETE CASCADE)
    await pool.query(
      `DELETE FROM comments WHERE id = $1`,
      [commentId]
    )

    res.json({ deleted: true })
  } catch (err) {
    console.error('Erro ao deletar comentário:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router
