export default function IEPopup({ show, onClose }) {
  if (!show) return null

  return (
    <div className="ie-popup__overlay">
      <div className="ie-popup__dialog">
        <div className="win-titlebar">
          <span className="win-titlebar__text">Microsoft Internet Explorer</span>
          <div className="win-titlebar__buttons">
            <button className="win-titlebar__btn" type="button" aria-label="Fechar" onClick={onClose}>×</button>
          </div>
        </div>
        <div className="ie-popup__body">
          <span className="ie-popup__icon">ⓘ</span>
          <p className="ie-popup__text">
            Gostou do ZeroBerto Top 10 Blog? Deseja definir como sua página inicial?
          </p>
        </div>
        <div className="ie-popup__buttons">
          <button className="win-button" type="button" onClick={onClose}>Sim</button>
          <button className="win-button" type="button" onClick={onClose}>Não (mas vou perguntar de novo)</button>
        </div>
      </div>
    </div>
  )
}
