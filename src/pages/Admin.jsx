import { Fragment, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useOrders } from '../context/OrdersContext'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import ProductForm from '../components/ProductForm'
import CustomersTab from '../components/admin/CustomersTab'
import ReviewsTab from '../components/admin/ReviewsTab'
import SettingsTab from '../components/admin/SettingsTab'
import { STATUS, fmtDate, fmtDateTime, statusLabel } from '../data/orderStatus'
import { categories, formatPrice } from '../data/products'

const TABS = [
  { id: 'overview', label: '📊 نظرة عامة' },
  { id: 'orders', label: '📦 الطلبات' },
  { id: 'products', label: '🛍️ المنتجات' },
  { id: 'customers', label: '👥 العملاء' },
  { id: 'reviews', label: '⭐ التقييمات' },
  { id: 'settings', label: '⚙️ الإعدادات' },
]

export default function Admin() {
  const { orders, updateOrder, deleteOrder } = useOrders()
  const { customers, user } = useAuth()
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProducts()
  const [editing, setEditing] = useState(null) // null | 'new' | منتج
  const [tab, setTab] = useState('overview')
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)

  const valid = useMemo(() => orders.filter((o) => o.status !== 'cancelled'), [orders])
  const revenue = valid.reduce((s, o) => s + o.total, 0)
  const pending = orders.filter((o) => o.status === 'new').length

  const week = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const sum = valid
        .filter((o) => new Date(o.createdAt).toDateString() === d.toDateString())
        .reduce((s, o) => s + o.total, 0)
      days.push({ label: d.toLocaleDateString('ar-EG', { weekday: 'short' }), sum })
    }
    return days
  }, [valid])
  const maxDay = Math.max(1, ...week.map((d) => d.sum))

  const top = useMemo(() => {
    const map = {}
    valid.forEach((o) => o.lines.forEach((l) => (map[l.name] = (map[l.name] || 0) + l.qty)))
    const list = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
    return { list, max: Math.max(1, ...list.map((x) => x[1])) }
  }, [valid])

  const filtered = orders.filter(
    (o) =>
      (filter === 'all' || o.status === filter) &&
      (o.id + o.customer.name + o.customer.phone).toLowerCase().includes(q.trim().toLowerCase())
  )

  const remove = (id) => {
    if (window.confirm('متأكدة إنك عايزة تحذفي الطلب ده نهائيًا؟')) deleteOrder(id)
  }

  const saveProduct = (p) => {
    if (products.some((x) => x.id === p.id)) updateProduct(p.id, p)
    else addProduct(p)
    setEditing(null)
  }

  const removeProduct = (p) => {
    if (products.length <= 1) {
      window.alert('لازم يفضل منتج واحد على الأقل في المتجر.')
      return
    }
    if (window.confirm(`حذف "${p.name}" من المتجر؟ (الطلبات القديمة مش هتتأثر)`)) deleteProduct(p.id)
  }

  const restoreProducts = () => {
    if (window.confirm('هترجعي المنتجات الأصلية وتمسحي أي تعديلات أو منتجات جديدة. متأكدة؟')) {
      resetProducts()
      setEditing(null)
    }
  }

  const catLabel = (id) => categories.find((c) => c.id === id)?.label || id

  const stats = [
    { label: 'إجمالي المبيعات', value: formatPrice(revenue), icon: '💰' },
    { label: 'عدد الطلبات', value: orders.length.toLocaleString('ar-EG'), icon: '📦' },
    { label: 'طلبات جديدة', value: pending.toLocaleString('ar-EG'), icon: '🔔' },
    { label: 'العملاء', value: customers.length.toLocaleString('ar-EG'), icon: '👥' },
  ]

  return (
    <section className="section container page-top">
      <div className="section-head">
        <div>
          <h1 className="page-title">لوحة التحكم</h1>
          <p className="muted">أهلًا {user.name} 👑 · مسجّلة كأدمن بإيميل <span dir="ltr">{user.email}</span></p>
        </div>
      </div>

      <div className="tabs admin-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="stat-grid">
            {stats.map((s, i) => (
              <motion.div key={s.label} className="glass stat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <span className="stat-icon">{s.icon}</span>
                <strong>{s.value}</strong>
                <span className="muted">{s.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="admin-two">
            <div className="glass panel">
              <h3>مبيعات آخر 7 أيام</h3>
              <div className="bars">
                {week.map((d) => (
                  <div key={d.label + d.sum} className="bar-col">
                    <span className="bar-val">{d.sum ? Math.round(d.sum / 100) / 10 + 'k' : ''}</span>
                    <motion.div className="bar-v" initial={{ height: 0 }} animate={{ height: `${(d.sum / maxDay) * 100}%` }} transition={{ duration: 0.7 }} />
                    <span className="muted small">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass panel">
              <h3>الأكثر مبيعًا</h3>
              {top.list.length === 0 ? (
                <p className="muted">لسه مفيش مبيعات.</p>
              ) : (
                top.list.map(([name, n]) => (
                  <div key={name} className="top-row">
                    <div className="card-row"><span>{name}</span><b>{n} قطعة</b></div>
                    <div className="bar"><motion.div className="bar-fill" initial={{ width: 0 }} animate={{ width: `${(n / top.max) * 100}%` }} /></div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass panel">
            <h3>آخر الطلبات</h3>
            {orders.length === 0 ? (
              <p className="muted">مفيش طلبات لحد دلوقتي.</p>
            ) : (
              orders.slice(0, 5).map((o) => (
                <div key={o.id} className="mini-order">
                  <span><b>{o.id}</b> · {o.customer.name}</span>
                  <span className={`status s-${o.status}`}>{statusLabel(o.status)}</span>
                  <b>{formatPrice(o.total)}</b>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {tab === 'orders' && (
        <>
          <div className="filters glass">
            <div className="chips">
              <button className={`chip ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>الكل</button>
              {STATUS.map((s) => (
                <button key={s.id} className={`chip ${filter === s.id ? 'on' : ''}`} onClick={() => setFilter(s.id)}>{s.label}</button>
              ))}
            </div>
            <input className="input" placeholder="ابحثي برقم الطلب أو الاسم…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="table-wrap glass">
            <table className="table">
              <thead>
                <tr><th>الطلب</th><th>العميل</th><th>التاريخ</th><th>الإجمالي</th><th>الحالة</th><th /></tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan="6" className="center muted">مفيش طلبات مطابقة</td></tr>
                )}
                {filtered.map((o) => (
                  <Fragment key={o.id}>
                    <tr>
                      <td><b>{o.id}</b></td>
                      <td>{o.customer.name}<br /><span className="muted small" dir="ltr">{o.customer.phone}</span></td>
                      <td className="small">{fmtDateTime(o.createdAt)}</td>
                      <td><b>{formatPrice(o.total)}</b></td>
                      <td>
                        <select className={`input status-select s-${o.status}`} value={o.status} onChange={(e) => updateOrder(o.id, { status: e.target.value })}>
                          {STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </td>
                      <td className="row-actions">
                        <button className="link-btn" onClick={() => setOpen(open === o.id ? null : o.id)}>{open === o.id ? 'إخفاء' : 'تفاصيل'}</button>
                        <button className="link-btn danger" onClick={() => remove(o.id)}>حذف</button>
                      </td>
                    </tr>
                    {open === o.id && (
                      <tr className="detail-row">
                        <td colSpan="6">
                          <div className="detail">
                            <div>
                              <h4>المنتجات</h4>
                              {o.lines.map((l) => (
                                <div key={l.id + l.color} className="sum"><span>{l.name} ({l.color}) × {l.qty}</span><span>{formatPrice(l.total)}</span></div>
                              ))}
                              {o.discount > 0 && <div className="sum good"><span>الخصم {o.coupon ? `(${o.coupon})` : ''}</span><span>− {formatPrice(o.discount)}</span></div>}
                              <div className="sum"><span>الشحن</span><span>{o.shipping ? formatPrice(o.shipping) : 'مجاني'}</span></div>
                            </div>
                            <div>
                              <h4>بيانات العميل</h4>
                              <p>📧 <span dir="ltr">{o.customer.email}</span></p>
                              <p>📍 {o.customer.city} - {o.customer.address}</p>
                              <p>🚚 الاستلام: {fmtDate(o.deliveryDate)} ({o.deliveryWindow})</p>
                              <p className="muted small">
                                إيميل العميل: {o.emails?.customer === 'sent' ? '✅ اتبعت' : o.emails?.customer === 'failed' ? '❌ فشل' : '—'} ·
                                إيميل الأدمن: {o.emails?.admin === 'sent' ? '✅ اتبعت' : o.emails?.admin === 'failed' ? '❌ فشل' : '—'}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'products' && (
        <>
          <div className="card-row prod-toolbar">
            <span className="muted">{products.length} منتجات في المتجر · علشان التعديلات توصل للعملاء شوفي تبويب «الإعدادات ← نشر التعديلات»</span>
            <div className="hero-cta">
              <button className="btn btn-small" onClick={() => setEditing('new')}>+ منتج جديد</button>
              <button className="btn btn-small btn-ghost" onClick={restoreProducts}>استرجاع الأصلية</button>
            </div>
          </div>

          {editing && (
            <ProductForm
              key={editing === 'new' ? 'new' : editing.id}
              initial={editing === 'new' ? null : editing}
              onSave={saveProduct}
              onCancel={() => setEditing(null)}
            />
          )}

          <div className="prod-list">
            {products.map((p) => (
              <div key={p.id} className="glass prod-item">
                <div className="prod-dots">
                  {p.colors.map((c) => (
                    <i key={c.name} style={{ background: c.hex, boxShadow: `0 0 12px ${c.glow}` }} title={c.name} />
                  ))}
                </div>
                <div className="prod-main">
                  <strong>{p.name}</strong>
                  <span className="muted small">{catLabel(p.category)} · {p.colors.length} ألوان · ★ {p.rating}</span>
                </div>
                <b>{formatPrice(p.price)}</b>
                <div className="row-actions">
                  <button className="link-btn" onClick={() => { setEditing(p); window.scrollTo({ top: 120, behavior: 'smooth' }) }}>تعديل</button>
                  <button className="link-btn danger" onClick={() => removeProduct(p)}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'customers' && <CustomersTab />}

      {tab === 'reviews' && <ReviewsTab />}

      {tab === 'settings' && <SettingsTab />}
    </section>
  )
}
