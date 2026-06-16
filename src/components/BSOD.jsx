import { useEffect } from 'react'

export default function BSOD({ show, onDismiss }) {
  useEffect(() => {
    if (!show) return

    const handleKey = () => onDismiss()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [show, onDismiss])

  if (!show) return null

  return (
    <div className="bsod" onClick={onDismiss}>
      <div className="bsod__content">
        <div className="bsod__title">Windows</div>

        <div className="bsod__text">
          Um erro fatal ocorreu ao tentar fechar esta janela. O botão X não deveria
          ter sido clicado. O navegador foi comprometido.
        </div>

        <div className="bsod__text">
          NAVEGADOR_DESTRUIDO_EXCEPTION em 0x0000DEAD:0xBEEF1234
        </div>

        <div className="bsod__text">
          *  Referência de memória inválida: o usuário tentou sair do site.<br />
          *  Endereço de erro: 0x00C0FFEE<br />
          *  Código: TOP10_BLOG_CRASH (0x00000069)<br />
          *  Módulo: ZEROBERTO.DLL
        </div>

        <div className="bsod__text">
          Se esta é a primeira vez que você vê esta tela de erro,
          reinicie o computador. Se esta tela aparecer novamente,
          considere não clicar no X da próxima vez.
        </div>

        <div className="bsod__text">
          Informações técnicas:<br />
          *** STOP: 0x0000004F (0xDEADBEEF, 0xC0FFEE42, 0xBADCAFE0, 0x1337BEEF)
        </div>

        <div className="bsod__continue">
          Aperte qualquer tecla para continuar...
        </div>
      </div>
    </div>
  )
}
