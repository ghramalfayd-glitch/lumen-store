import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useWish } from '../context/WishContext'
import { useProducts } from '../context/ProductsContext'

const HIDDEN_ON = ['/compare', '/admin', '/checkout', '/login']

export default function CompareBar() {
  const { compare, toggleCompare, clearCompare } = useWish()
  const { products } = useProducts()
  const { pathname } = useLocation()

  const items = compare.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  const show = items.length > 0 && !HIDDEN_ON.includes(pathname)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="compare-bar glass"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        >
          <div className="cb-items">
            {items.map((p) => (
              <button key={p.id} className="cb-chip" onClick={() => toggleCompare(p.id)} title="إزالة من المقارنة">
                <i style={{ background: p.colors[0].hex }} />
                {p.name} ✕
              </button>
            ))}
          </div>
          <div className="cb-actions">
            <button className="link-btn" onClick={clearCompare}>مسح</button>
            {items.length >= 2 ? (
              <Link to="/compare" className="btn btn-small">قارني الآن ({items.length})</Link>
            ) : (
              <span className="muted small">اختاري منتج تاني</span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
