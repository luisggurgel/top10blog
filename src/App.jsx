import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import ThreadPage from './pages/ThreadPage'
import threadsData from './data/threads.json'
import { useState, useEffect } from 'react'

export default function App() {
  // Fake visitor counter that increments on each visit
  const [visitorCount, setVisitorCount] = useState(() => {
    const saved = localStorage.getItem('zb-visitor-count')
    return saved ? parseInt(saved) : 13847
  })

  useEffect(() => {
    const newCount = visitorCount + 1
    setVisitorCount(newCount)
    localStorage.setItem('zb-visitor-count', newCount.toString())
  }, [])

  return (
    <BrowserRouter>
      <div className="page-wrapper">
        {/* Browser Chrome — fake IE toolbar */}
        <div className="browser-chrome">
          <div className="win-window" style={{ marginBottom: 0 }}>
            <div className="win-titlebar">
              <span className="win-titlebar__text">
                ZeroBerto Top 10 Blog - Microsoft Internet Explorer
              </span>
              <div className="win-titlebar__buttons">
                <button className="win-titlebar__btn" type="button">_</button>
                <button className="win-titlebar__btn" type="button">□</button>
                <button className="win-titlebar__btn" type="button">×</button>
              </div>
            </div>
          </div>

          <div className="toolbar">
            <span className="toolbar__item toolbar__item--underline">Arquivo</span>
            <span className="toolbar__item toolbar__item--underline">Editar</span>
            <span className="toolbar__item toolbar__item--underline">Exibir</span>
            <span className="toolbar__item toolbar__item--underline">Favoritos</span>
            <span className="toolbar__item toolbar__item--underline">Ferramentas</span>
            <span className="toolbar__item toolbar__item--underline">Ajuda</span>
          </div>

          <div className="address-bar">
            <span className="address-bar__label">Endereço</span>
            <input
              type="text"
              className="address-bar__input"
              value="http://www.zeroberto-top10.cjb.net/index.htm"
              readOnly
            />
            <button className="win-button" style={{ minWidth: '50px', padding: '2px 8px' }}>
              Ir
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/thread/:id" element={<ThreadPage />} />
          </Routes>

          {/* Visitor counter */}
          <div className="visitor-counter">
            <div>👀 Você é o visitante número:</div>
            <div className="visitor-counter__digits">
              {String(visitorCount).padStart(8, '0').split('').map((digit, i) => (
                <span key={i} className="visitor-counter__digit">{digit}</span>
              ))}
            </div>
            <div style={{ marginTop: '4px', fontSize: '10px', color: '#aaa' }}>
              (contador 100% real não é fake confia)
            </div>
          </div>
        </div>

        {/* Status bar (IE style) */}
        <div className="status-bar">
          <span className="status-bar__section">✅ Concluído</span>
          <span className="status-bar__section">
            🌐 Internet | Zona protegida (mentira)
          </span>
        </div>
      </div>
    </BrowserRouter>
  )
}
