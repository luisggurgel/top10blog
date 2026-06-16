import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Revalidate on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('zb-token')
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/auth/me')
      .then((data) => setUser(data.user ?? data))
      .catch(() => {
        localStorage.removeItem('zb-token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await api.post('/auth/login', { username, password })
    localStorage.setItem('zb-token', data.token)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (username, password) => {
    await api.post('/auth/register', { username, password })
    // Auto-login after register
    return login(username, password)
  }, [login])

  const logout = useCallback(() => {
    localStorage.removeItem('zb-token')
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
