import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'zeroberto-super-secret-2003'

export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const token = header.slice(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = { id: decoded.id, username: decoded.username, role: decoded.role }
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    req.user = null
    return next()
  }

  const token = header.slice(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = { id: decoded.id, username: decoded.username, role: decoded.role }
  } catch {
    req.user = null
  }
  next()
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permissão insuficiente' })
    }
    next()
  }
}
