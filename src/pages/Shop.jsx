import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'
import { categories } from '../data/products'

export default function Shop() {
  const { products } = useProducts()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('default')

  const list = useMemo(() => {
    let out = products.filter(
      (p) => (cat === 'all' || p.category === cat) && (p.name + p.tagline).toLowerCase().includes(q.trim().toLowerCase())
    )
    if (sort === 'asc') out = [...out].sort((a, b) => a.price - b.price)
    if (sort === 'desc') out = [...out].sort((a, b) => b.price - a.price)
    if (sort === 'rating') out = [...out].sort((a, b) => b.rating - a.rating)
    return out
  }, [products, cat, q, sort])

  return (
    <section className="section container page-top">
      <div className="section-head">
        <h1 className="page-title">المتجر</h1>
        <span className="muted">{list.length} منتجات</span>
      </div>

      <div className="filters glass">
        <div className="chips">
          {categories.map((c) => (
            <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="filters-end">
          <input className="input" placeholder="ابحثي عن منتج…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">الترتيب</option>
            <option value="asc">السعر: الأقل أولًا</option>
            <option value="desc">السعر: الأعلى أولًا</option>
            <option value="rating">الأعلى تقييمًا</option>
          </select>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="muted center">مفيش نتائج مطابقة 🙈</p>
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
