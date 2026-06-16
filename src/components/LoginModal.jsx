import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ mode = 'login', onClose }) {
  const { login, register } = useAuth()
  const [activeTab, setActiveTab] = useState(mode)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Preenche tudo aí, campeão(a)!')
      return
    }

    setSubmitting(true)
    try {
      if (activeTab === 'login') {
        await login(username.trim(), password)
      } else {
        await register(username.trim(), password)
      }
      onClose()
    } catch (err) {
      setError(err.message || err.error || 'Deu ruim! Tenta de novo aí.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    setError('')
  }

  return (
    <div className="login-modal__overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        {/* Win95 titlebar */}
        <div className="win-titlebar">
          <span className="win-titlebar__text">
            {activeTab === 'login' ? '🔐 Login - ZeroBerto' : '📝 Novo Cadastro - ZeroBerto'}
          </span>
          <div className="win-titlebar__buttons">
            <button className="win-titlebar__btn" type="button" onClick={onClose}>×</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="login-modal__tabs">
          <button
            className={`login-modal__tab ${activeTab === 'login' ? 'login-modal__tab--active' : ''}`}
            onClick={() => handleTabSwitch('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={`login-modal__tab ${activeTab === 'register' ? 'login-modal__tab--active' : ''}`}
            onClick={() => handleTabSwitch('register')}
            type="button"
          >
            Novo Cadastro
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="login-modal__body">
            {error && <div className="login-modal__error">⚠️ {error}</div>}

            <div className="login-modal__field">
              <label htmlFor="zb-username">Usuário:</label>
              <input
                id="zb-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                disabled={submitting}
              />
            </div>

            <div className="login-modal__field">
              <label htmlFor="zb-password">Senha (não usa "123456" pfvr):</label>
              <input
                id="zb-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="login-modal__actions">
            <button type="submit" className="win-button" disabled={submitting}>
              {submitting
                ? 'Carregando...'
                : activeTab === 'login'
                  ? 'Entrar'
                  : 'Cadastrar'}
            </button>
            <button type="button" className="win-button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
