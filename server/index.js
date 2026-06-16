import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDB } from './db.js'
import authRoutes from './routes/auth.js'
import threadRoutes from './routes/threads.js'
import commentRoutes from './routes/comments.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/threads', threadRoutes)
app.use('/api', commentRoutes) // mounts /threads/:threadId/comments and /comments/:id/vote

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Serve frontend em produção
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))

  // SPA fallback: qualquer rota não-API retorna index.html
  // Em Express 5, o app.use sem path é a forma mais segura de fazer catch-all
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// Init DB and start
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 ZeroBerto API rodando na porta ${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ Falha ao inicializar banco:', err)
    process.exit(1)
  })
