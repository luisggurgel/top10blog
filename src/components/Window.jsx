import { useState } from 'react'

export default function Window({ title, children, className = '', onClose }) {
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)

  return (
    <div className={`win-window ${className} ${maximized ? 'win-window--maximized' : ''}`}>
      <div className="win-titlebar">
        <span className="win-titlebar__text">{title}</span>
        <div className="win-titlebar__buttons">
          <button
            className="win-titlebar__btn"
            type="button"
            aria-label="Minimizar"
            onClick={() => setMinimized(!minimized)}
          >_</button>
          <button
            className="win-titlebar__btn"
            type="button"
            aria-label="Maximizar"
            onClick={() => setMaximized(!maximized)}
          >□</button>
          <button className="win-titlebar__btn" type="button" aria-label="Fechar" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="win-content" style={minimized ? { display: 'none' } : {}}>
        {children}
      </div>
    </div>
  )
}
