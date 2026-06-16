import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'zeroberto-super-secret-2003'

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || username.length < 3 || username.length > 50) {
      return res.status(400).json({ error: 'Username deve ter entre 3 e 50 caracteres' })
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const { rows } = await pool.query(
      `INSERT INTO users (username, password)
       VALUES ($1, $2)
       RETURNING id, username, role`,
      [username, hashed]
    )

    res.status(201).json(rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username já existe' })
    }
    console.error('Erro no registro:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e senha são obrigatórios' })
    }

    const { rows } = await pool.query(
      `SELECT id, username, password, role FROM users WHERE username = $1`,
      [username]
    )

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const user = rows[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    })
  } catch (err) {
    console.error('Erro no login:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// GET /me
router.get('/me', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, role FROM users WHERE id = $1`,
      [req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error('Erro ao buscar usuário:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router
