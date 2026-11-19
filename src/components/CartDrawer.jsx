import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { formatPrice } from '../data/products'

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, discount, shipping, total, coupon, setQty, remove, applyCoupon, removeCoupon } =
    useCart()
  const { settings } = useSettings()
  const FREE_SHIPPING_FROM = settings.freeShippingFrom
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')

  const progress = Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)

  const submitCoupon = (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setMsg(applyCoupon(code) ? 'تم تطبيق الكوبون 🎉' : 'الكوبون غير صحيح')
    setCode('')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <div className="drawer-head">
              <h3>سلة المشتريات</h3>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="إغلاق">✕</button>
            </div>

            {lines.length === 0 ? (
              <div className="empty">
                <div className="empty-emoji">🛒</div>
                <p>السلة فاضية… لسه في مجسمات مستنياكِ!</p>
                <Link to="/shop" className="btn" onClick={() => setOpen(false)}>تصفحي المتجر</Link>
              </div>
            ) : (
              <>
                <div className="ship-bar">
                  <p className="muted">
                    {subtotal >= FREE_SHIPPING_FROM
                      ? 'مبروك! الشحن عليكِ مجاني 🚚'
                      : `باقي ${formatPrice(FREE_SHIPPING_FROM - subtotal)} على الشحن المجاني`}
                  </p>
                  <div className="bar"><motion.div className="bar-fill" animate={{ width: `${progress}%` }} /></div>
                </div>

                <div className="drawer-list">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.div
                        key={l.id + l.color}
                        layout
                        className="line"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0 }}
                      >
                        <div className="line-dot" style={{ background: l.colorObj.hex, boxShadow: `0 0 18px ${l.colorObj.glow}` }} />
                        <div className="line-info">
                          <strong>{l.product.name}</strong>
                          <span className="muted">{l.color}</span>
                          <div className="qty">
                            <button onClick={() => setQty(l.id, l.color, l.qty - 1)}>−</button>
                            <span>{l.qty}</span>
                            <button onClick={() => setQty(l.id, l.color, l.qty + 1)}>+</button>
                          </div>
                        </div>
                        <div className="line-end">
                          <strong>{formatPrice(l.total)}</strong>
                          <button className="link-btn" onClick={() => remove(l.id, l.color)}>حذف</button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="drawer-foot">
                  {coupon ? (
                    <div className="coupon-on">
                      <span>🏷️ {coupon} — {settings.coupons[coupon]?.label || 'كوبون خصم'}</span>
                      <button className="link-btn" onClick={removeCoupon}>إزالة</button>
                    </div>
                  ) : (
                    <form className="coupon" onSubmit={submitCoupon}>
                      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="كود الخصم (جربي LUMEN10)" />
                      <button className="btn btn-small" type="submit">تطبيق</button>
                    </form>
                  )}
                  {msg && <p className="muted small">{msg}</p>}

                  <div className="sum"><span>المجموع</span><span>{formatPrice(subtotal)}</span></div>
                  {discount > 0 && <div className="sum good"><span>الخصم</span><span>− {formatPrice(discount)}</span></div>}
                  <div className="sum"><span>الشحن</span><span>{shipping === 0 ? 'مجاني' : formatPrice(shipping)}</span></div>
                  <div className="sum total"><span>الإجمالي</span><span>{formatPrice(total)}</span></div>

                  <Link to="/checkout" className="btn btn-block" onClick={() => setOpen(false)}>إتمام الطلب</Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
