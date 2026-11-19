import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Scene3D from '../components/Scene3D'
import ProductCard from '../components/ProductCard'
import Reviews from '../components/Reviews'
import { useCart } from '../context/CartContext'
import { useWish } from '../context/WishContext'
import { useReviews } from '../context/ReviewsContext'
import { useProducts } from '../context/ProductsContext'
import { formatPrice } from '../data/products'

export default function ProductPage() {
  const { id } = useParams()
  const { products, getProduct } = useProducts()
  const product = getProduct(id)
  const { add } = useCart()
  const { isFav, toggleFav, inCompare, toggleCompare } = useWish()
  const { ratingOf } = useReviews()
  const [colorIdx, setColorIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <section className="section container page-top center">
        <h2>المنتج مش موجود</h2>
        <Link to="/shop" className="btn">رجوع للمتجر</Link>
      </section>
    )
  }

  const color = product.colors[colorIdx] || product.colors[0]
  const rate = ratingOf(product)
  const related = products.filter((p) => p.id !== product.id).slice(0, 3)

  const handleAdd = () => {
    add(product.id, color.name, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <>
      <section className="section container page-top product" style={{ '--glow': color.glow }}>
        <div className="product-stage">
          <div className="stage-glow" />
          <Scene3D
            key={product.id}
            type={product.type}
            color={color.hex}
            glow={color.glow}
            interactive
            camera={[0, 0.4, 5.6]}
            scale={1.15}
          />
          <div className="stage-note">🖱️ اسحبي للتدوير · عجلة الماوس للتكبير</div>
        </div>

        <div className="product-info">
          <Link to="/shop" className="link-btn">← رجوع للمتجر</Link>
          <h1 className="product-title">{product.name}</h1>
          <p className="lead">{product.tagline}</p>
          <div className="card-row">
            <strong className="price big">{formatPrice(product.price)}</strong>
            <span className="rating">★ {rate.value.toFixed(1)}{rate.count > 0 && <span className="muted small"> ({rate.count} تقييم)</span>}</span>
          </div>
          <p className="muted">{product.desc}</p>

          <div className="opt">
            <h4>اللون: <span className="grad">{color.name}</span></h4>
            <div className="swatches lg">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  className={`swatch ${i === colorIdx ? 'on' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => setColorIdx(i)}
                  aria-label={c.name}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <ul className="feat-list">
            {product.features.map((f) => (
              <li key={f}>✦ {f}</li>
            ))}
          </ul>

          <div className="mini-actions">
            <button className={`chip ${isFav(product.id) ? 'on' : ''}`} onClick={() => toggleFav(product.id)}>
              {isFav(product.id) ? '❤ في المفضلة' : '♡ أضف للمفضلة'}
            </button>
            <button className={`chip ${inCompare(product.id) ? 'on' : ''}`} onClick={() => toggleCompare(product.id)}>
              {inCompare(product.id) ? '⚖ في المقارنة' : '⚖ أضف للمقارنة'}
            </button>
          </div>

          <div className="buy">
            <div className="qty lg">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))}>+</button>
            </div>
            <button className="btn btn-grow" onClick={handleAdd}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={added ? 'a' : 'b'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {added ? '✓ تمت الإضافة' : `أضف للسلة · ${formatPrice(product.price * qty)}`}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </section>

      <Reviews key={product.id} product={product} />

      <section className="section container">
        <div className="section-head"><h2>ممكن يعجبك كمان</h2></div>
        <div className="grid">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </>
  )
}
