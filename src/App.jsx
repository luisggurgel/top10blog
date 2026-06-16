import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import ThreadPage from './pages/ThreadPage'
import { useState, useRef } from 'react'
import Clippy from './components/Clippy'
import BSOD from './components/BSOD'
import IEPopup from './components/IEPopup'
import { AuthProvider } from './context/AuthContext'
import AuthBar from './components/AuthBar'

export default function App() {
  // Fake visitor counter that increments on each visit
  const [visitorCount] = useState(() => {
    const saved = localStorage.getItem('zb-visitor-count')
    const current = saved ? parseInt(saved, 10) : 13847
    const next = current + 1
    localStorage.setItem('zb-visitor-count', next.toString())
    return next
  })

  const [showBSOD, setShowBSOD] = useState(false)
  const [showPopup, setShowPopup] = useState(() => {
    return !sessionStorage.getItem('zb-popup-dismissed')
  })
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const addressRef = useRef(null)

  const handleBrowserClose = () => setShowBSOD(true)
  const handleBSODDismiss = () => setShowBSOD(false)
  const handlePopupClose = () => {
    setShowPopup(false)
    sessionStorage.setItem('zb-popup-dismissed', 'true')
  }

  const handleMinimize = () => {
    setMinimized(!minimized)
  }

  const handleMaximize = () => {
    setMaximized(!maximized)
  }

  const handleGoClick = () => {
    const url = addressRef.current?.value || ''
    if (url.includes('zeroberto') || url.includes('cjb.net')) {
      alert('🌐 Você já está no melhor site da internet!\n\nPor que você iria querer sair daqui?? 😤')
    } else {
      alert('❌ ERRO DE NAVEGAÇÃO\n\nO Internet Explorer 6.0 não conseguiu acessar esta página.\n\nDica: tente usar um computador melhor (de preferência um Pentium III)')
    }
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className={`page-wrapper ${maximized ? 'page-wrapper--maximized' : ''}`}>
          {/* Browser Chrome — fake IE toolbar */}
          <div className="browser-chrome">
            <div className="win-window" style={{ marginBottom: 0 }}>
              <div className="win-titlebar">
                <span className="win-titlebar__text">
                  ZeroBerto Top 10 Blog - Microsoft Internet Explorer
                </span>
                <div className="win-titlebar__buttons">
                  <button className="win-titlebar__btn" type="button" aria-label="Minimizar" onClick={handleMinimize}>_</button>
                  <button className="win-titlebar__btn" type="button" aria-label="Maximizar" onClick={handleMaximize}>□</button>
                  <button className="win-titlebar__btn" type="button" aria-label="Fechar" onClick={handleBrowserClose}>×</button>
                </div>
              </div>
            </div>

            {!minimized && (
              <>
                <div className="toolbar">
                  <span className="toolbar__item toolbar__item--underline">Arquivo</span>
                  <span className="toolbar__item toolbar__item--underline">Editar</span>
                  <span className="toolbar__item toolbar__item--underline">Exibir</span>
                  <span className="toolbar__item toolbar__item--underline">Favoritos</span>
                  <span className="toolbar__item toolbar__item--underline">Ferramentas</span>
                  <span className="toolbar__item toolbar__item--underline">Ajuda</span>
                </div>

                <AuthBar />

                <div className="address-bar">
                  <span className="address-bar__label">Endereço</span>
                  <input
                    ref={addressRef}
                    type="text"
                    className="address-bar__input"
                    defaultValue="http://www.zeroberto-top10.cjb.net/index.htm"
                  />
                  <button
                    className="win-button"
                    style={{ minWidth: '50px', padding: '2px 8px' }}
                    onClick={handleGoClick}
                  >
                    Ir
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Main content */}
          {!minimized && (
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
          )}

          {/* Minimized message */}
          {minimized && (
            <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'var(--font-system)', fontSize: '12px', color: '#888' }}>
              💾 Janela minimizada. Clique em _ para restaurar.
            </div>
          )}

          {/* Status bar (IE style) */}
          <div className="status-bar">
            <span className="status-bar__section">{minimized ? '📦 Minimizado' : '✅ Concluído'}</span>
            <span className="status-bar__section">
              🌐 Internet | Zona protegida (mentira)
            </span>
          </div>
        </div>

        {/* Easter Eggs */}
        <Clippy />
        <BSOD show={showBSOD} onDismiss={handleBSODDismiss} />
        <IEPopup show={showPopup} onClose={handlePopupClose} />
      </BrowserRouter>
    </AuthProvider>
  )
}
