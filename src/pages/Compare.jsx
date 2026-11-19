import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Scene3D from '../components/Scene3D'
import { useProducts } from '../context/ProductsContext'
import { useWish } from '../context/WishContext'
import { useCart } from '../context/CartContext'
import { useReviews } from '../context/ReviewsContext'
import { categories, formatPrice } from '../data/products'

export default function Compare() {
  const { products } = useProducts()
  const { compare, toggleCompare, clearCompare } = useWish()
  const { add } = useCart()
  const { ratingOf } = useReviews()

  const items = compare.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  const catLabel = (id) => categories.find((c) => c.id === id)?.label || id

  const multi = items.length > 1
  const minPrice = Math.min(...items.map((p) => p.price))
  const maxRating = Math.max(...items.map((p) => ratingOf(p).value))

  return (
    <section className="section container page-top">
      <div className="section-head">
        <h1 className="page-title">مقارنة المنتجات</h1>
        {items.length > 0 && <button className="link-btn" onClick={clearCompare}>مسح الكل</button>}
      </div>

      {items.length === 0 ? (
        <div className="center empty-orders">
          <div className="empty-emoji">⚖️</div>
          <p className="muted">اختاري من 2 إلى 3 منتجات للمقارنة بالضغط على ⚖ في أي منتج.</p>
          <Link to="/shop" className="btn">تصفحي المتجر</Link>
        </div>
      ) : (
        <>
          {!multi && <p className="muted">أضيفي منتج تاني على الأقل علشان تبدأ المقارنة.</p>}
          <div className="cmp-grid" style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, minmax(0, 1fr))` }}>
            {items.map((p, i) => {
              const c = p.colors[0]
              return (
                <motion.div
                  key={p.id}
                  className="glass cmp-col"
                  style={{ '--glow': c.glow }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <button className="icon-btn cmp-remove" onClick={() => toggleCompare(p.id)} aria-label="إزالة">✕</button>

                  <div className="cmp-stage">
                    <Scene3D type={p.type} color={c.hex} glow={c.glow} float={false} camera={[0, 0.3, 6]} scale={0.95} />
                  </div>

                  <h3 className="cmp-name">{p.name}</h3>
                  <p className="muted small">{p.tagline}</p>

                  <div className="cmp-row">
                    <span className="muted">السعر</span>
                    <span>
                      <b>{formatPrice(p.price)}</b>
                      {multi && p.price === minPrice && <em className="best">الأرخص</em>}
                    </span>
                  </div>
                  <div className="cmp-row">
                    <span className="muted">التقييم</span>
                    <span>
                      <b className="rating">★ {ratingOf(p).value.toFixed(1)}</b>
                      {multi && ratingOf(p).value === maxRating && <em className="best">الأعلى تقييمًا</em>}
                    </span>
                  </div>
                  <div className="cmp-row">
                    <span className="muted">القسم</span>
                    <b>{catLabel(p.category)}</b>
                  </div>
                  <div className="cmp-row">
                    <span className="muted">الألوان</span>
                    <span className="prod-dots">
                      {p.colors.map((col) => (
                        <i key={col.name} style={{ background: col.hex }} title={col.name} />
                      ))}
                    </span>
                  </div>

                  <ul className="cmp-feats">
                    {p.features.map((f) => (
                      <li key={f}>✓ {f}</li>
                    ))}
                  </ul>

                  <button className="btn btn-block" onClick={() => add(p.id, c.name)}>أضف للسلة</button>
                  <Link to={`/product/${p.id}`} className="btn btn-block btn-ghost">شوفي التفاصيل</Link>
                </motion.div>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}
