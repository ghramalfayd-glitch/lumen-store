import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import { useWish } from '../context/WishContext'

export default function Favorites() {
  const { products } = useProducts()
  const { favs } = useWish()
  const list = products.filter((p) => favs.includes(p.id))

  return (
    <section className="section container page-top">
      <div className="section-head">
        <h1 className="page-title">مفضلتي ❤</h1>
        <span className="muted">{list.length} منتجات</span>
      </div>

      {list.length === 0 ? (
        <div className="center empty-orders">
          <div className="empty-emoji">🤍</div>
          <p className="muted">لسه ضفتيش أي منتج للمفضلة. اضغطي على ♡ في أي منتج.</p>
          <Link to="/shop" className="btn">تصفحي المتجر</Link>
        </div>
      ) : (
        <div className="grid">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
