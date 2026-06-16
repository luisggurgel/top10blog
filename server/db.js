import pg from 'pg'
import 'dotenv/config'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import bcrypt from 'bcryptjs'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10
})

export default pool

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const threadsPath = join(__dirname, '..', 'src', 'data', 'threads.json')

export async function initDB() {
  // ── Create tables ──
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS threads (
      id SERIAL PRIMARY KEY,
      post_number INTEGER UNIQUE NOT NULL,
      title VARCHAR(300) NOT NULL,
      author VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
      tripcode VARCHAR(50),
      date VARCHAR(50) NOT NULL,
      thumbnail_alt TEXT,
      intro TEXT NOT NULL,
      reply_count INTEGER DEFAULT 0,
      image_count INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      created_by INTEGER REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS thread_items (
      id SERIAL PRIMARY KEY,
      thread_id INTEGER NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
      rank INTEGER NOT NULL,
      title VARCHAR(300) NOT NULL,
      text TEXT NOT NULL,
      post_number INTEGER NOT NULL,
      date VARCHAR(50) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      thread_id INTEGER NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
      parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id),
      text VARCHAR(500) NOT NULL,
      score INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS votes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      target_type VARCHAR(10) NOT NULL CHECK (target_type IN ('thread', 'comment')),
      target_id INTEGER NOT NULL,
      value SMALLINT NOT NULL CHECK (value IN (-1, 1)),
      UNIQUE(user_id, target_type, target_id)
    );

    CREATE INDEX IF NOT EXISTS idx_thread_items_thread ON thread_items(thread_id);
    CREATE INDEX IF NOT EXISTS idx_comments_thread ON comments(thread_id);
    CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
    CREATE INDEX IF NOT EXISTS idx_votes_target ON votes(target_type, target_id);

    CREATE TABLE IF NOT EXISTS _seed_status (
      key VARCHAR(50) PRIMARY KEY,
      value VARCHAR(50)
    );
  `)

  console.log('✅ Tabelas criadas / verificadas')

  // ── Seed data ──
  const { rows } = await pool.query(
    `SELECT key FROM _seed_status WHERE key = $1`,
    ['threads_seeded']
  )

  if (rows.length > 0) {
    console.log('ℹ️  Seed já foi executado, pulando...')
    return
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const adminResult = await client.query(
      `INSERT INTO users (username, password, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (username) DO NOTHING
       RETURNING id`,
      ['admin', hashedPassword, 'admin']
    )
    const adminId = adminResult.rows[0]?.id ?? null
    console.log('✅ Usuário admin criado')

    // Read and insert threads
    const raw = readFileSync(threadsPath, 'utf-8')
    const threads = JSON.parse(raw)

    for (const t of threads) {
      const threadResult = await client.query(
        `INSERT INTO threads
           (post_number, title, author, tripcode, date, thumbnail_alt, intro, reply_count, image_count, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          t.postNumber,
          t.title,
          t.author || 'Anonymous',
          t.tripcode || null,
          t.date,
          t.thumbnailAlt || null,
          t.intro,
          t.replyCount || 0,
          t.imageCount || 0,
          adminId
        ]
      )
      const threadId = threadResult.rows[0].id

      for (const item of t.items) {
        await client.query(
          `INSERT INTO thread_items (thread_id, rank, title, text, post_number, date)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [threadId, item.rank, item.title, item.text, item.postNumber, item.date]
        )
      }
    }

    console.log(`✅ ${threads.length} threads inseridas com seus itens`)

    // Mark seed as done
    await client.query(
      `INSERT INTO _seed_status (key, value) VALUES ($1, $2)`,
      ['threads_seeded', 'done']
    )

    await client.query('COMMIT')
    console.log('✅ Seed concluído com sucesso')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
