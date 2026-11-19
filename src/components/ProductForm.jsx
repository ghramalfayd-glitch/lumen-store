import { useState } from 'react'
import Scene3D from './Scene3D'
import { categories, modelTypes } from '../data/products'

const emptyColor = () => ({ name: '', hex: '#7c5cff', glow: '#22d3ee' })

const makeId = (name) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'product'
  return `${slug}-${Date.now().toString(36).slice(-4)}`
}

export default function ProductForm({ initial, onSave, onCancel }) {
  const editing = Boolean(initial)
  const [f, setF] = useState(() =>
    initial
      ? {
          name: initial.name,
          type: initial.type,
          category: initial.category,
          price: String(initial.price),
          rating: String(initial.rating),
          tagline: initial.tagline,
          desc: initial.desc,
          featuresText: initial.features.join('\n'),
          colors: initial.colors.map((c) => ({ ...c })),
        }
      : {
          name: '',
          type: 'headphones',
          category: 'audio',
          price: '',
          rating: '4.5',
          tagline: '',
          desc: '',
          featuresText: '',
          colors: [{ name: 'أسود', hex: '#1c1c26', glow: '#7c5cff' }],
        }
  )
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(0)

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const setColor = (i, k, v) =>
    setF((x) => ({ ...x, colors: x.colors.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)) }))
  const addColor = () => {
    setF((x) => ({ ...x, colors: [...x.colors, emptyColor()] }))
    setPreview(f.colors.length)
  }
  const removeColor = (i) => {
    setF((x) => ({ ...x, colors: x.colors.filter((_, idx) => idx !== i) }))
    setPreview(0)
  }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    const price = Number(f.price)
    const rating = Number(f.rating)
    const features = f.featuresText.split('\n').map((s) => s.trim()).filter(Boolean)
    if (f.name.trim().length < 2) err.name = 'اكتبي اسم المنتج'
    if (!(price > 0)) err.price = 'السعر لازم يكون أكبر من صفر'
    if (!(rating >= 0 && rating <= 5)) err.rating = 'التقييم من 0 إلى 5'
    if (f.tagline.trim().length < 3) err.tagline = 'اكتبي جملة قصيرة تعريفية'
    if (f.desc.trim().length < 10) err.desc = 'اكتبي وصف من 10 حروف على الأقل'
    if (features.length === 0) err.features = 'أضيفي ميزة واحدة على الأقل'
    if (f.colors.some((c) => !c.name.trim())) err.colors = 'اكتبي اسم لكل لون'
    setErrors(err)
    if (Object.keys(err).length) return

    onSave({
      id: initial?.id || makeId(f.name),
      name: f.name.trim(),
      type: f.type,
      category: f.category,
      price,
      rating,
      tagline: f.tagline.trim(),
      desc: f.desc.trim(),
      features,
      colors: f.colors.map((c) => ({ ...c, name: c.name.trim() })),
    })
  }

  const current = f.colors[preview] || f.colors[0]

  return (
    <form className="glass pform" onSubmit={submit} noValidate>
      <div className="section-head">
        <h3>{editing ? `تعديل: ${initial.name}` : 'منتج جديد'}</h3>
        <button type="button" className="icon-btn" onClick={onCancel} aria-label="إغلاق">✕</button>
      </div>

      <div className="pform-grid">
        <div className="pform-fields">
          <label className="field">
            <span>اسم المنتج</span>
            <input className={`input ${errors.name ? 'bad' : ''}`} value={f.name} onChange={set('name')} />
            {errors.name && <em>{errors.name}</em>}
          </label>

          <div className="two-cols">
            <label className="field">
              <span>شكل المجسم 3D</span>
              <select className="input" value={f.type} onChange={set('type')}>
                {modelTypes.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span>القسم</span>
              <select className="input" value={f.category} onChange={set('category')}>
                {categories.filter((c) => c.id !== 'all').map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </label>
          </div>

          <div className="two-cols">
            <label className="field">
              <span>السعر (ج.م)</span>
              <input className={`input ${errors.price ? 'bad' : ''}`} type="number" min="1" value={f.price} onChange={set('price')} dir="ltr" />
              {errors.price && <em>{errors.price}</em>}
            </label>
            <label className="field">
              <span>التقييم (0-5)</span>
              <input className={`input ${errors.rating ? 'bad' : ''}`} type="number" min="0" max="5" step="0.1" value={f.rating} onChange={set('rating')} dir="ltr" />
              {errors.rating && <em>{errors.rating}</em>}
            </label>
          </div>

          <label className="field">
            <span>جملة تعريفية قصيرة</span>
            <input className={`input ${errors.tagline ? 'bad' : ''}`} value={f.tagline} onChange={set('tagline')} />
            {errors.tagline && <em>{errors.tagline}</em>}
          </label>

          <label className="field">
            <span>الوصف</span>
            <textarea className={`input ${errors.desc ? 'bad' : ''}`} rows="3" value={f.desc} onChange={set('desc')} />
            {errors.desc && <em>{errors.desc}</em>}
          </label>

          <label className="field">
            <span>المميزات (ميزة في كل سطر)</span>
            <textarea className={`input ${errors.features ? 'bad' : ''}`} rows="4" value={f.featuresText} onChange={set('featuresText')} />
            {errors.features && <em>{errors.features}</em>}
          </label>
        </div>

        <div className="pform-side">
          <div className="preview-box">
            <Scene3D
              key={f.type}
              type={f.type}
              color={current.hex}
              glow={current.glow}
              interactive
              camera={[0, 0.3, 6]}
              scale={1}
            />
            <span className="stage-note">معاينة حيّة — اسحبي للتدوير</span>
          </div>

          <div className="color-editor">
            <div className="card-row">
              <strong>الألوان</strong>
              {f.colors.length < 6 && (
                <button type="button" className="link-btn" onClick={addColor}>+ لون جديد</button>
              )}
            </div>
            {f.colors.map((c, i) => (
              <div key={i} className={`color-row ${i === preview ? 'on' : ''}`}>
                <button type="button" className="swatch" style={{ background: c.hex }} onClick={() => setPreview(i)} aria-label="معاينة اللون" />
                <input className="input" placeholder="اسم اللون" value={c.name} onChange={(e) => setColor(i, 'name', e.target.value)} />
                <label className="picker" title="لون المنتج">
                  <input type="color" value={c.hex} onChange={(e) => setColor(i, 'hex', e.target.value)} />
                </label>
                <label className="picker" title="لون التوهج">
                  <input type="color" value={c.glow} onChange={(e) => setColor(i, 'glow', e.target.value)} />
                </label>
                {f.colors.length > 1 && (
                  <button type="button" className="link-btn danger" onClick={() => removeColor(i)}>حذف</button>
                )}
              </div>
            ))}
            <p className="muted small">الدايرة الأولى للون المنتج والتانية للتوهج المضيء.</p>
            {errors.colors && <em className="err">{errors.colors}</em>}
          </div>
        </div>
      </div>

      <div className="hero-cta">
        <button className="btn" type="submit">{editing ? 'حفظ التعديلات' : 'إضافة المنتج'}</button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>إلغاء</button>
      </div>
    </form>
  )
}
