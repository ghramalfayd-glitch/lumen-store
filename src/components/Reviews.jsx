import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useReviews } from '../context/ReviewsContext'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { fmtDate } from '../data/orderStatus'

function Stars({ value, onChange, size = '1.4rem' }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <span className="stars" style={{ fontSize: size }} dir="ltr">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={n <= shown ? 'on' : ''}
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} نجوم`}
        >
          ★
        </button>
      ))}
    </span>
  )
}

export default function Reviews({ product }) {
  const { forProduct, saveReview, deleteReview } = useReviews()
  const { user, isAdmin } = useAuth()
  const { orders } = useOrders()

  const list = forProduct(product.id)
  const mine = user ? list.find((r) => r.userId === user.id) : null
  const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: list.filter((r) => r.rating === n).length }))

  // علامة "اشترى المنتج" لو في طلب غير ملغي فيه المنتج ده
  const bought = (userId) =>
    orders.some((o) => o.userId === userId && o.status !== 'cancelled' && o.lines.some((l) => l.id === product.id))

  const [rating, setRating] = useState(mine?.rating || 0)
  const [comment, setComment] = useState(mine?.comment || '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!rating) return setError('اختاري عدد النجوم')
    if (comment.trim().length < 5) return setError('اكتبي تعليق من 5 حروف على الأقل')
    setError('')
    saveReview({ productId: product.id, userId: user.id, userName: user.name, rating, comment })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const remove = (r) => {
    if (window.confirm('حذف التقييم ده؟')) {
      deleteReview(r.id)
      if (r.userId === user?.id) {
        setRating(0)
        setComment('')
      }
    }
  }

  return (
    <section className="section container">
      <div className="section-head">
        <h2>التقييمات والتعليقات</h2>
      </div>

      <div className="reviews">
        <div className="glass rv-summary">
          <div className="rv-avg">{list.length ? avg.toFixed(1) : '—'}</div>
          <Stars value={Math.round(avg)} size="1.3rem" />
          <p className="muted small">{list.length ? `من ${list.length.toLocaleString('ar-EG')} تقييم` : 'لسه مفيش تقييمات'}</p>
          <div className="rv-dist">
            {dist.map(({ n, c }) => (
              <div key={n} className="rv-bar-row">
                <span className="small">{n}★</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: list.length ? `${(c / list.length) * 100}%` : 0 }} />
                </div>
                <span className="muted small">{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rv-main">
          {user ? (
            <form className="glass rv-form" onSubmit={submit} noValidate>
              <h3>{mine ? 'تعديل تقييمك' : 'اكتبي تقييمك'}</h3>
              <Stars value={rating} onChange={setRating} size="2rem" />
              <textarea
                className="input"
                rows="3"
                placeholder="شاركينا رأيك في المنتج…"
                value={comment}
                maxLength={400}
                onChange={(e) => setComment(e.target.value)}
              />
              {error && <em className="err">{error}</em>}
              <button className="btn btn-small" type="submit">
                {saved ? '✓ تم الحفظ' : mine ? 'تحديث التقييم' : 'نشر التقييم'}
              </button>
            </form>
          ) : (
            <div className="glass rv-form center">
              <p className="muted">سجّلي دخولك علشان تقدري تقيّمي المنتج.</p>
              <Link to="/login" state={{ from: `/product/${product.id}` }} className="btn btn-small">تسجيل الدخول</Link>
            </div>
          )}

          <div className="rv-list">
            <AnimatePresence initial={false}>
              {list.map((r) => (
                <motion.div
                  key={r.id}
                  layout
                  className="glass rv-item"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                >
                  <div className="card-row">
                    <div className="rv-who">
                      <span className="avatar">{r.userName.trim().charAt(0)}</span>
                      <div>
                        <strong>{r.userName}</strong>
                        {bought(r.userId) && <span className="verified">✓ اشترت المنتج</span>}
                      </div>
                    </div>
                    <Stars value={r.rating} size="1rem" />
                  </div>
                  <p>{r.comment}</p>
                  <div className="card-row">
                    <span className="muted small">{fmtDate(r.createdAt)}</span>
                    {(isAdmin || r.userId === user?.id) && (
                      <button className="link-btn danger" onClick={() => remove(r)}>حذف</button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
