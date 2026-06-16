import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'

export default function AuthBar() {
  const { user, logout, isAdmin, loading } = useAuth()
  const [modalMode, setModalMode] = useState(null) // 'login' | 'register' | null

  if (loading) return null

  return (
    <>
      <div className="auth-bar">
        {user ? (
          <>
            <span className="auth-bar__user">
              👤 {user.username}
              {isAdmin && <span className="auth-bar__role">[admin]</span>}
            </span>
            <button
              className="win-button"
              style={{ minWidth: 'auto', padding: '1px 8px', fontSize: '11px' }}
              onClick={logout}
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <button
              className="win-button"
              style={{ minWidth: 'auto', padding: '1px 8px', fontSize: '11px' }}
              onClick={() => setModalMode('login')}
            >
              Entrar
            </button>
            <button
              className="win-button"
              style={{ minWidth: 'auto', padding: '1px 8px', fontSize: '11px' }}
              onClick={() => setModalMode('register')}
            >
              Registrar
            </button>
          </>
        )}
      </div>

      {modalMode && (
        <LoginModal mode={modalMode} onClose={() => setModalMode(null)} />
      )}
    </>
  )
}
