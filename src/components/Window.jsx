export default function Window({ title, children, className = '' }) {
  return (
    <div className={`win-window ${className}`}>
      <div className="win-titlebar">
        <span className="win-titlebar__text">{title}</span>
        <div className="win-titlebar__buttons">
          <button className="win-titlebar__btn" type="button">_</button>
          <button className="win-titlebar__btn" type="button">□</button>
          <button className="win-titlebar__btn" type="button">×</button>
        </div>
      </div>
      <div className="win-content">
        {children}
      </div>
    </div>
  )
}
