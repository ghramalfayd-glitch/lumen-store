import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useOrders } from '../context/OrdersContext'
import { useAuth } from '../context/AuthContext'
import { STATUS, fmtDate, fmtDateTime, statusStep } from '../data/orderStatus'
import { useSettings } from '../context/SettingsContext'
import { formatPrice } from '../data/products'

function EmailNote({ state, email }) {
  if (state === 'pending') return <p className="mail-note">⏳ جاري إرسال تأكيد الطلب إلى بريدك…</p>
  if (state === 'sent') return <p className="mail-note ok">📧 أرسلنا لكِ رسالة بتفاصيل الطلب وموعد الاستلام على <b>{email}</b></p>
  if (state === 'failed') return <p className="mail-note bad">⚠️ تعذّر إرسال رسالة التأكيد على بريدك، لكن طلبك اتسجل بنجاح.</p>
  return null
}

export default function OrderSuccess() {
  const { id } = useParams()
  const { orders } = useOrders()
  const { user, isAdmin } = useAuth()
  const { settings } = useSettings()
  const STORE_WHATSAPP = settings.whatsapp
  const order = orders.find((o) => o.id === id)

  if (!order || (order.userId !== user.id && !isAdmin)) {
    return (
      <section className="section container page-top center">
        <h2>الطلب غير موجود</h2>
        <Link to="/shop" className="btn">رجوع للمتجر</Link>
      </section>
    )
  }

  const step = statusStep(order.status)
  const cancelled = order.status === 'cancelled'
  const steps = STATUS.filter((s) => s.id !== 'cancelled')

  const waText =
    `طلب جديد من LUMEN #${order.id}\n` +
    order.lines.map((l) => `• ${l.name} (${l.color}) × ${l.qty}`).join('\n') +
    `\nالإجمالي: ${formatPrice(order.total)}\nالاسم: ${order.customer.name}\nالعنوان: ${order.customer.city} - ${order.customer.address}\nالهاتف: ${order.customer.phone}`
  const wa = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(waText)}`

  return (
    <section className="section container page-top">
      <div className="glass done">
        <motion.div className="done-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          ✓
        </motion.div>
        <h1 className="page-title">تم تسجيل طلبك بنجاح 🎉</h1>
        <p className="done-name">شكرًا يا <span className="grad">{order.customer.name}</span></p>
        <p className="muted">رقم الطلب <b>{order.id}</b> · {fmtDateTime(order.createdAt)}</p>

        <div className="eta">
          <span>🚚 موعد الاستلام المتوقع</span>
          <strong>{fmtDate(order.deliveryDate)}</strong>
          <small>{order.deliveryWindow}</small>
        </div>

        <EmailNote state={order.emails?.customer} email={order.customer.email} />

        {cancelled ? (
          <div className="alert">تم إلغاء هذا الطلب.</div>
        ) : (
          <div className="track">
            {steps.map((s, i) => (
              <div key={s.id} className={`track-step ${i <= step ? 'on' : ''}`}>
                <div className="track-dot">{s.icon}</div>
                <span>{s.label}</span>
              </div>
            ))}
            <div className="track-line">
              <motion.div className="track-fill" animate={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
            </div>
          </div>
        )}

        <div className="receipt">
          {order.lines.map((l) => (
            <div key={l.id + l.color} className="sum">
              <span>{l.name} <span className="muted">({l.color}) × {l.qty}</span></span>
              <span>{formatPrice(l.total)}</span>
            </div>
          ))}
          <hr />
          {order.discount > 0 && <div className="sum good"><span>الخصم</span><span>− {formatPrice(order.discount)}</span></div>}
          <div className="sum"><span>الشحن</span><span>{order.shipping === 0 ? 'مجاني' : formatPrice(order.shipping)}</span></div>
          <div className="sum total"><span>الإجمالي</span><span>{formatPrice(order.total)}</span></div>
          <p className="muted small receipt-addr">📍 {order.customer.city} - {order.customer.address} · 📞 {order.customer.phone}</p>
        </div>

        <div className="hero-cta center-row">
          {STORE_WHATSAPP && (
            <a className="btn" href={wa} target="_blank" rel="noreferrer">أرسلي الطلب على واتساب 💬</a>
          )}
          <Link to={isAdmin ? '/admin' : '/orders'} className="btn btn-ghost">{isAdmin ? 'لوحة التحكم' : 'كل طلباتي'}</Link>
          <Link to="/shop" className="btn btn-ghost">متابعة التسوق</Link>
        </div>
      </div>
    </section>
  )
}
