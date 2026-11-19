import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { sendOrderEmails } from '../services/email'
import { formatPrice } from '../data/products'

const DELIVERY_DAYS = 3
const DELIVERY_WINDOW = 'من 10 صباحًا حتى 6 مساءً'

export default function Checkout() {
  const { lines, subtotal, discount, shipping, total, coupon, clear } = useCart()
  const { user } = useAuth()
  const { addOrder, updateOrder } = useOrders()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', city: '', address: '' })
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (form.name.trim().length < 3) err.name = 'اكتبي الاسم كامل'
    if (!/^01[0125][0-9]{8}$/.test(form.phone.trim())) err.phone = 'رقم موبايل مصري غير صحيح'
    if (!form.city.trim()) err.city = 'اكتبي المدينة'
    if (form.address.trim().length < 6) err.address = 'اكتبي العنوان بالتفصيل'
    setErrors(err)
    if (Object.keys(err).length) return

    const now = new Date()
    const eta = new Date(now.getTime() + DELIVERY_DAYS * 24 * 60 * 60 * 1000)

    const order = {
      id: `LM-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user.id,
      customer: {
        name: form.name.trim(),
        email: user.email,
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
      },
      lines: lines.map((l) => ({
        id: l.id,
        name: l.product.name,
        color: l.color,
        qty: l.qty,
        price: l.product.price,
        total: l.total,
      })),
      subtotal,
      discount,
      shipping,
      total,
      coupon,
      status: 'new',
      createdAt: now.toISOString(),
      deliveryDate: eta.toISOString(),
      deliveryWindow: DELIVERY_WINDOW,
      emails: { customer: 'pending', admin: 'pending' },
    }

    addOrder(order)
    clear()
    navigate(`/order/${order.id}`, { replace: true })

    // الإيميلات بتتبعت في الخلفية وحالتها بتظهر في صفحة النجاح
    sendOrderEmails(order).then((emails) => updateOrder(order.id, { emails }))
  }

  if (lines.length === 0) {
    return (
      <section className="section container page-top center">
        <h2>السلة فاضية</h2>
        <Link to="/shop" className="btn">ابدئي التسوق</Link>
      </section>
    )
  }

  const field = (k, label, props = {}) => (
    <label className="field">
      <span>{label}</span>
      <input className={`input ${errors[k] ? 'bad' : ''}`} value={form[k]} onChange={set(k)} {...props} />
      {errors[k] && <em>{errors[k]}</em>}
    </label>
  )

  return (
    <section className="section container page-top">
      <h1 className="page-title">إتمام الطلب</h1>
      <div className="checkout">
        <form className="glass form" onSubmit={submit} noValidate>
          <h3>بيانات التوصيل</h3>
          {field('name', 'الاسم بالكامل')}
          {field('phone', 'رقم الموبايل', { inputMode: 'numeric', placeholder: '01xxxxxxxxx', dir: 'ltr' })}
          {field('city', 'المدينة')}
          {field('address', 'العنوان بالتفصيل')}
          <p className="muted small">
            هيوصلك تأكيد الطلب على <b>{user.email}</b> · الدفع عند الاستلام · التوصيل خلال {DELIVERY_DAYS} أيام.
          </p>
          <button className="btn btn-block" type="submit">تأكيد الطلب · {formatPrice(total)}</button>
        </form>

        <aside className="glass summary">
          <h3>ملخص الطلب</h3>
          {lines.map((l) => (
            <div key={l.id + l.color} className="sum">
              <span>{l.product.name} <span className="muted">({l.color}) × {l.qty}</span></span>
              <span>{formatPrice(l.total)}</span>
            </div>
          ))}
          <hr />
          <div className="sum"><span>المجموع</span><span>{formatPrice(subtotal)}</span></div>
          {discount > 0 && <div className="sum good"><span>الخصم</span><span>− {formatPrice(discount)}</span></div>}
          <div className="sum"><span>الشحن</span><span>{shipping === 0 ? 'مجاني' : formatPrice(shipping)}</span></div>
          <div className="sum total"><span>الإجمالي</span><span>{formatPrice(total)}</span></div>
        </aside>
      </div>
    </section>
  )
}
