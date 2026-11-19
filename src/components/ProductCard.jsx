import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Scene3D from './Scene3D'
import { useCart } from '../context/CartContext'
import { useWish } from '../context/WishContext'
import { useReviews } from '../context/ReviewsContext'
import { formatPrice } from '../data/products'

export default function ProductCard({ product, index = 0 }) {
  const [hover, setHover] = useState(false)
  const [colorIdx, setColorIdx] = useState(0)
  const { add } = useCart()
  const { isFav, toggleFav, inCompare, toggleCompare } = useWish()
  const { ratingOf } = useReviews()
  const rate = ratingOf(product)
  const color = product.colors[colorIdx]

  return (
    <motion.article
      className="card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ '--glow': color.glow }}
    >
      <div className="card-actions">
        <button
          className={`round-btn ${isFav(product.id) ? 'on fav' : ''}`}
          onClick={() => toggleFav(product.id)}
          aria-label="المفضلة"
          title="أضف للمفضلة"
        >
          {isFav(product.id) ? '❤' : '♡'}
        </button>
        <button
          className={`round-btn ${inCompare(product.id) ? 'on' : ''}`}
          onClick={() => toggleCompare(product.id)}
          aria-label="مقارنة"
          title="أضف للمقارنة"
        >
          ⚖
        </button>
      </div>

      <Link to={`/product/${product.id}`} className="card-stage">
        <Scene3D
          type={product.type}
          color={color.hex}
          glow={color.glow}
          active={hover}
          float={false}
          camera={[0, 0.2, 5.6]}
          scale={0.9}
        />
        <span className="card-hint">{hover ? 'اسحبي وشوفي التفاصيل' : 'مرّري الماوس'}</span>
      </Link>

      <div className="card-body">
        <div className="card-row">
          <h3>{product.name}</h3>
          <span className="rating">★ {rate.value.toFixed(1)}{rate.count > 0 && <span className="muted small"> ({rate.count})</span>}</span>
        </div>
        <p className="muted">{product.tagline}</p>

        <div className="swatches">
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

        <div className="card-row">
          <strong className="price">{formatPrice(product.price)}</strong>
          <button className="btn btn-small" onClick={() => add(product.id, color.name)}>
            أضف للسلة +
          </button>
        </div>
      </div>
    </motion.article>
  )
}
