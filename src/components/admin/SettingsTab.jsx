import { useState } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { useProducts } from '../../context/ProductsContext'
import { emailStatus, sendTestEmail } from '../../services/email'
import { ADMIN_EMAIL } from '../../config/emailjs'
import { buildCatalogFile, downloadTextFile } from '../../utils/catalogExport'
import { formatPrice } from '../../data/products'

const CHECKS = [
  { key: 'publicKey', label: 'Public Key' },
  { key: 'serviceId', label: 'Service ID' },
  { key: 'customerTemplate', label: 'قالب رسالة العميل' },
  { key: 'adminTemplate', label: 'قالب رسالة الأدمن' },
]

function EmailSection() {
  const status = emailStatus()
  const [busy, setBusy] = useState('')
  const [result, setResult] = useState(null)

  const test = async (kind) => {
    setBusy(kind)
    setResult(null)
    const res = await sendTestEmail(kind)
    setResult({ kind, ...res })
    setBusy('')
  }

  return (
    <div className="glass panel">
      <h3>📧 ربط الإيميل (EmailJS)</h3>
      <p className="muted small">
        المفاتيح بتتكتب في الملف <code>src/config/emailjs.js</code> (مش من هنا) لأن رسالة الطلب بتتبعت من متصفح العميل
        وقت التأكيد. بعد ما تكتبيها، اضغطي على الاختبار ورسالة تجريبية هتوصل على <b dir="ltr">{ADMIN_EMAIL}</b>.
      </p>

      <div className="check-list">
        {CHECKS.map((c) => (
          <span key={c.key} className={`check ${status[c.key] ? 'ok' : ''}`}>
            {status[c.key] ? '✅' : '⬜'} {c.label}
          </span>
        ))}
      </div>

      <div className="hero-cta">
        <button className="btn btn-small" disabled={Boolean(busy)} onClick={() => test('admin')}>
          {busy === 'admin' ? 'جاري الإرسال…' : 'اختبار رسالة الأدمن'}
        </button>
        <button className="btn btn-small btn-ghost" disabled={Boolean(busy)} onClick={() => test('customer')}>
          {busy === 'customer' ? 'جاري الإرسال…' : 'اختبار رسالة العميل'}
        </button>
      </div>

      {result && (
        <div className={result.ok ? 'mail-note ok' : 'alert'}>
          {result.ok
            ? `✅ اتبعتت رسالة ${result.kind === 'admin' ? 'الأدمن' : 'العميل'} التجريبية، شوفي الإنبوكس (وفولدر السبام).`
            : `❌ فشل الإرسال: ${result.error}`}
        </div>
      )}
    </div>
  )
}

function ShippingSection() {
  const { settings, update } = useSettings()
  const [fee, setFee] = useState(String(settings.shippingFee))
  const [free, setFree] = useState(String(settings.freeShippingFrom))
  const [wa, setWa] = useState(settings.whatsapp)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const save = (e) => {
    e.preventDefault()
    const shippingFee = Number(fee)
    const freeShippingFrom = Number(free)
    const whatsapp = wa.replace(/\D/g, '')
    if (!(shippingFee >= 0) || !(freeShippingFrom >= 0)) return setError('اكتبي أرقام صحيحة للشحن')
    if (whatsapp && !/^20\d{10}$/.test(whatsapp)) return setError('رقم واتساب بصيغة دولية مثل 201001234567')
    setError('')
    update({ shippingFee, freeShippingFrom, whatsapp })
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <form className="glass panel" onSubmit={save} noValidate>
      <h3>🚚 الشحن والتواصل</h3>
      <div className="two-cols">
        <label className="field">
          <span>مصاريف الشحن (ج.م)</span>
          <input className="input" type="number" min="0" value={fee} onChange={(e) => setFee(e.target.value)} dir="ltr" />
        </label>
        <label className="field">
          <span>شحن مجاني من (ج.م)</span>
          <input className="input" type="number" min="0" value={free} onChange={(e) => setFree(e.target.value)} dir="ltr" />
        </label>
      </div>
      <label className="field">
        <span>رقم واتساب المتجر (اختياري)</span>
        <input className="input" value={wa} onChange={(e) => setWa(e.target.value)} placeholder="201001234567" dir="ltr" inputMode="numeric" />
      </label>
      {error && <em className="err">{error}</em>}
      <button className="btn btn-small" type="submit">{saved ? '✓ تم الحفظ' : 'حفظ'}</button>
    </form>
  )
}

function CouponsSection() {
  const { settings, addCoupon, removeCoupon } = useSettings()
  const [code, setCode] = useState('')
  const [percent, setPercent] = useState('10')
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')

  const add = (e) => {
    e.preventDefault()
    const key = code.trim().toUpperCase()
    const p = Number(percent)
    if (!/^[A-Z0-9]{3,20}$/.test(key)) return setError('الكود حروف إنجليزي وأرقام فقط (3 إلى 20)')
    if (!(p >= 1 && p <= 90)) return setError('نسبة الخصم من 1 إلى 90')
    setError('')
    addCoupon(key, p, label.trim() || `خصم ${p}%`)
    setCode('')
    setLabel('')
  }

  const entries = Object.entries(settings.coupons)

  return (
    <div className="glass panel">
      <h3>🏷️ كوبونات الخصم</h3>
      {entries.length === 0 && <p className="muted small">مفيش كوبونات.</p>}
      {entries.map(([k, v]) => (
        <div key={k} className="mini-order">
          <span><b dir="ltr">{k}</b> <span className="muted small">{v.label}</span></span>
          <b>{v.percent}%</b>
          <button className="link-btn danger" onClick={() => removeCoupon(k)}>حذف</button>
        </div>
      ))}

      <form className="coupon-add" onSubmit={add} noValidate>
        <input className="input" placeholder="الكود" value={code} onChange={(e) => setCode(e.target.value)} dir="ltr" />
        <input className="input" type="number" min="1" max="90" value={percent} onChange={(e) => setPercent(e.target.value)} dir="ltr" aria-label="نسبة الخصم" />
        <input className="input" placeholder="وصف (اختياري)" value={label} onChange={(e) => setLabel(e.target.value)} />
        <button className="btn btn-small" type="submit">+ إضافة</button>
      </form>
      {error && <em className="err">{error}</em>}
    </div>
  )
}

function PublishSection() {
  const { products } = useProducts()
  const { settings, reset } = useSettings()
  const [copied, setCopied] = useState(false)

  const text = () => buildCatalogFile({ products, settings })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text())
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.alert('المتصفح منع النسخ، استخدمي زر التحميل بدلًا منه.')
    }
  }

  const restore = () => {
    if (window.confirm('هترجعي الشحن والكوبونات والواتساب للقيم الأصلية. متأكدة؟')) reset()
  }

  return (
    <div className="glass panel">
      <h3>🚀 نشر التعديلات للعملاء</h3>
      <p className="muted small">
        تعديلاتك على المنتجات والكوبونات والشحن محفوظة في <b>متصفحك أنتِ</b> فقط، يعني العملاء على أجهزتهم مش هيشوفوها.
        علشان توصلهم: نزّلي الملف ده واستبدلي بيه <code>src/data/products.js</code> وارفعي المشروع من جديد
        ({products.length} منتجات · {Object.keys(settings.coupons).length} كوبونات · شحن {formatPrice(settings.shippingFee)}).
      </p>
      <div className="hero-cta">
        <button className="btn btn-small" onClick={() => downloadTextFile('products.js', text())}>⬇ تحميل products.js</button>
        <button className="btn btn-small btn-ghost" onClick={copy}>{copied ? '✓ تم النسخ' : 'نسخ المحتوى'}</button>
        <button className="btn btn-small btn-ghost" onClick={restore}>استرجاع إعدادات الشحن والكوبونات</button>
      </div>
    </div>
  )
}

export default function SettingsTab() {
  return (
    <div className="settings-grid">
      <EmailSection />
      <PublishSection />
      <ShippingSection />
      <CouponsSection />
    </div>
  )
}
