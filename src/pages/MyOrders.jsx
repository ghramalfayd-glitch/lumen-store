import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useOrders } from '../context/OrdersContext'
import { useAuth } from '../context/AuthContext'
import { fmtDate, fmtDateTime, statusLabel } from '../data/orderStatus'
import { formatPrice } from '../data/products'

export default function MyOrders() {
  const { orders } = useOrders()
  const { user } = useAuth()
  const mine = orders.filter((o) => o.userId === user.id)

  return (
    <section className="section container page-top">
      <h1 className="page-title">طلباتي</h1>

      {mine.length === 0 ? (
        <div className="center empty-orders">
          <div className="empty-emoji">📦</div>
          <p className="muted">لسه معملتيش أي طلب.</p>
          <Link to="/shop" className="btn">ابدئي التسوق</Link>
        </div>
      ) : (
        <div className="orders-list">
          {mine.map((o, i) => (
            <motion.div
              key={o.id}
              className="glass order-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="card-row">
                <strong>{o.id}</strong>
                <span className={`status s-${o.status}`}>{statusLabel(o.status)}</span>
              </div>
              <p className="muted small">{fmtDateTime(o.createdAt)}</p>
              <p>{o.lines.map((l) => `${l.name} × ${l.qty}`).join(' · ')}</p>
              <div className="card-row">
                <span className="muted small">الاستلام: {fmtDate(o.deliveryDate)}</span>
                <strong>{formatPrice(o.total)}</strong>
              </div>
              <Link to={`/order/${o.id}`} className="link-btn">عرض التفاصيل ←</Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
