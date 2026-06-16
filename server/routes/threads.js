import { Router } from 'express'
import pool from '../db.js'
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// GET / — list all threads (without items)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, post_number AS "postNumber", title, author, tripcode, date,
              thumbnail_alt AS "thumbnailAlt", intro,
              reply_count AS "replyCount", image_count AS "imageCount", score,
              created_by AS "createdBy", created_at AS "createdAt"
       FROM threads
       ORDER BY created_at DESC`
    )
    res.json(rows)
  } catch (err) {
    console.error('Erro ao listar threads:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// GET /:id — get thread by id WITH items (rank DESC, 10→1)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const threadResult = await pool.query(
      `SELECT id, post_number AS "postNumber", title, author, tripcode, date,
              thumbnail_alt AS "thumbnailAlt", intro,
              reply_count AS "replyCount", image_count AS "imageCount", score,
              created_by AS "createdBy", created_at AS "createdAt"
       FROM threads
       WHERE id = $1`,
      [id]
    )

    if (threadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Thread não encontrada' })
    }

    const thread = threadResult.rows[0]

    const itemsResult = await pool.query(
      `SELECT id, thread_id AS "threadId", rank, title, text, post_number AS "postNumber", date
       FROM thread_items
       WHERE thread_id = $1
       ORDER BY rank DESC`,
      [id]
    )

    thread.items = itemsResult.rows
    res.json(thread)
  } catch (err) {
    console.error('Erro ao buscar thread:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// POST / — create thread (admin only)
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  const client = await pool.connect()
  try {
    const { title, intro, tripcode, thumbnailAlt, items } = req.body

    if (!title || !intro || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'title, intro e items são obrigatórios' })
    }

    await client.query('BEGIN')

    // Generate post number
    const maxResult = await client.query(`SELECT COALESCE(MAX(post_number), 0) AS max_pn FROM threads`)
    const postNumber = maxResult.rows[0].max_pn + 1

    // Generate date in the required format: MM/DD/YYYY(Day)HH:MM:SS
    const now = new Date()
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const yyyy = now.getFullYear()
    const day = days[now.getDay()]
    const hh = String(now.getHours()).padStart(2, '0')
    const min = String(now.getMinutes()).padStart(2, '0')
    const ss = String(now.getSeconds()).padStart(2, '0')
    const dateStr = `${mm}/${dd}/${yyyy}(${day})${hh}:${min}:${ss}`

    const threadResult = await client.query(
      `INSERT INTO threads (post_number, title, author, tripcode, date, thumbnail_alt, intro, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [postNumber, title, 'Anonymous', tripcode || null, dateStr, thumbnailAlt || null, intro, req.user.id]
    )

    const thread = threadResult.rows[0]
    let itemPostNumber = postNumber

    const insertedItems = []
    for (const item of items) {
      itemPostNumber++
      const itemResult = await client.query(
        `INSERT INTO thread_items (thread_id, rank, title, text, post_number, date)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [thread.id, item.rank, item.title, item.text, itemPostNumber, dateStr]
      )
      insertedItems.push(itemResult.rows[0])
    }

    await client.query('COMMIT')

    thread.items = insertedItems
    res.status(201).json(thread)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Erro ao criar thread:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  } finally {
    client.release()
  }
})

// POST /:id/vote — vote on a thread (toggle)
router.post('/:id/vote', authenticate, async (req, res) => {
  try {
    const threadId = req.params.id
    const userId = req.user.id
    const { value } = req.body

    if (value !== 1 && value !== -1) {
      return res.status(400).json({ error: 'Valor do voto deve ser 1 ou -1' })
    }

    // Check if vote already exists
    const existing = await pool.query(
      `SELECT id, value FROM votes
       WHERE user_id = $1 AND target_type = $2 AND target_id = $3`,
      [userId, 'thread', threadId]
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
        [userId, 'thread', threadId, value]
      )
      userVote = value
    }

    // Update thread score
    await pool.query(
      `UPDATE threads
       SET score = COALESCE((SELECT SUM(value) FROM votes WHERE target_type = 'thread' AND target_id = $1), 0)
       WHERE id = $1`,
      [threadId]
    )

    const scoreResult = await pool.query(
      `SELECT score FROM threads WHERE id = $1`,
      [threadId]
    )

    res.json({ score: scoreResult.rows[0].score, userVote })
  } catch (err) {
    console.error('Erro ao votar na thread:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// GET /:id/vote — get user's vote for a thread
router.get('/:id/vote', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ userVote: null })
    }

    const { rows } = await pool.query(
      `SELECT value FROM votes
       WHERE user_id = $1 AND target_type = $2 AND target_id = $3`,
      [req.user.id, 'thread', req.params.id]
    )

    res.json({ userVote: rows.length > 0 ? rows[0].value : null })
  } catch (err) {
    console.error('Erro ao buscar voto:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router
