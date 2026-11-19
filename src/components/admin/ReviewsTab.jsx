import { useReviews } from '../../context/ReviewsContext'
import { useProducts } from '../../context/ProductsContext'
import { fmtDateTime } from '../../data/orderStatus'

export default function ReviewsTab() {
  const { reviews, deleteReview } = useReviews()
  const { getProduct } = useProducts()

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  const remove = (r) => {
    if (window.confirm(`حذف تقييم ${r.userName}؟`)) deleteReview(r.id)
  }

  return (
    <>
      <div className="filters glass">
        <span className="muted">
          {reviews.length.toLocaleString('ar-EG')} تقييم{reviews.length > 0 && ` · المتوسط العام ★ ${avg.toFixed(1)}`}
        </span>
      </div>

      {reviews.length === 0 ? (
        <p className="muted center">لسه مفيش تقييمات من العملاء.</p>
      ) : (
        <div className="prod-list">
          {reviews.map((r) => (
            <div key={r.id} className="glass rv-item">
              <div className="card-row">
                <div className="rv-who">
                  <span className="avatar">{r.userName.trim().charAt(0)}</span>
                  <div>
                    <strong>{r.userName}</strong>
                    <span className="muted small">على {getProduct(r.productId)?.name || 'منتج محذوف'}</span>
                  </div>
                </div>
                <span className="rating">{'★'.repeat(r.rating)}<span className="muted">{'★'.repeat(5 - r.rating)}</span></span>
              </div>
              <p>{r.comment}</p>
              <div className="card-row">
                <span className="muted small">{fmtDateTime(r.createdAt)}</span>
                <button className="link-btn danger" onClick={() => remove(r)}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
