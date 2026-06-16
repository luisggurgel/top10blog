import { useState, useEffect, useCallback } from 'react'

const MESSAGES = [
  'Parece que você está tentando navegar na internet! Posso ajudar?',
  'Dica: aperte Alt+F4 para acelerar o site!',
  'Você sabia que esse site foi feito no FrontPage 2002?',
  'Quer que eu organize seus favoritos? ...é zueira, não sei fazer isso.',
  'Ei! Já assinou o livro de visitas?',
  'Tá gostando do site? Então coloca no Orkut!',
  'DICA QUENTE: Ctrl+W fecha a aba. Mas não faz isso não 😢',
  'Parece que você está lendo uma lista. Quer que eu leia pra você? ...não sei ler.',
]

function getRandomMessage(currentMessage) {
  let msg
  do {
    msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
  } while (msg === currentMessage && MESSAGES.length > 1)
  return msg
}

export default function Clippy() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')

  const showClippy = useCallback(() => {
    setMessage(prev => getRandomMessage(prev))
    setVisible(true)
  }, [])

  const dismiss = useCallback(() => {
    setVisible(false)
  }, [])

  useEffect(() => {
    let timer = null

    const resetTimer = () => {
      if (timer) clearTimeout(timer)
      const delay = visible ? (20000 + Math.random() * 10000) : 20000
      timer = setTimeout(showClippy, delay)
    }

    const handleMouseMove = () => {
      if (!visible) {
        resetTimer()
      }
    }

    resetTimer()
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [visible, showClippy])

  if (!visible) return null

  return (
    <div className="clippy">
      <div className="clippy__bubble">
        <button className="clippy__close" onClick={dismiss} aria-label="Fechar Clippy">×</button>
        <p>{message}</p>
        <button className="clippy__btn" onClick={dismiss}>OK</button>
      </div>
      <div className="clippy__character">
        <div className="clippy__brow clippy__brow--left" />
        <div className="clippy__brow clippy__brow--right" />
        <div className="clippy__eyes">
          <div className="clippy__eye" />
          <div className="clippy__eye" />
        </div>
        <div className="clippy__mouth" />
      </div>
    </div>
  )
}
