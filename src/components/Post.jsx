export default function Post({
  postNumber,
  subject,
  author = 'Anonymous',
  tripcode,
  date,
  imageAlt,
  isOP = false,
  children,
}) {
  return (
    <div className={`post ${isOP ? 'post--op' : ''}`}>
      <div className="post__header">
        <input type="checkbox" className="post__checkbox" readOnly />
        {subject && <span className="post__subject">{subject}</span>}
        <span className="post__name">{author}</span>
        {tripcode && <span className="post__tripcode">{tripcode}</span>}
        <span className="post__date">{date}</span>
        <a href="#" className="post__number" onClick={(e) => e.preventDefault()}>
          No.{postNumber}
        </a>
      </div>
      <div className="post__body">
        {imageAlt && (
          <div className="post__image-container">
            <div className="post__image">{imageAlt}</div>
            <div className="post__image-info">
              (42KB, 320x240, foto_ruim.jpg)
            </div>
          </div>
        )}
        <div className="post__text">
          {children}
        </div>
      </div>
    </div>
  )
}
