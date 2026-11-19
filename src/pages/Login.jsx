import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { isAdminEmail } from '../config/admin'

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPass, setShowPass] = useState(false)

  if (user) return <Navigate to={from || (user.role === 'admin' ? '/admin' : '/')} replace />

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const switchMode = (m) => {
    setMode(m)
    setErrors({})
    setServerError('')
  }

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (mode === 'signup' && form.name.trim().length < 3) err.name = 'اكتبي اسمك بالكامل'
    if (!emailRx.test(form.email.trim())) err.email = 'إيميل غير صحيح'
    if (mode === 'signup' && !/^01[0125][0-9]{8}$/.test(form.phone.trim())) err.phone = 'رقم موبايل مصري غير صحيح'
    if (form.password.length < 6) err.password = 'كلمة السر 6 حروف على الأقل'
    if (mode === 'signup' && form.confirm !== form.password) err.confirm = 'كلمتا السر غير متطابقتين'
    setErrors(err)
    if (Object.keys(err).length) return

    const res = mode === 'login' ? login(form.email, form.password) : register(form)
    if (!res.ok) {
      // أول مرة بإيميل الأدمن: لازم تعمل حساب علشان تختاري كلمة السر
      const firstTimeAdmin = mode === 'login' && isAdminEmail(form.email)
      setServerError(
        firstTimeAdmin
          ? `${res.error}. لو دي أول مرة، اضغطي «حساب جديد» وسجّلي بنفس الإيميل وهيتفعّل لحسابك صلاحية الأدمن.`
          : res.error
      )
      return
    }
    navigate(from || (res.user.role === 'admin' ? '/admin' : '/'), { replace: true })
  }

  const field = (k, label, props = {}) => (
    <label className="field">
      <span>{label}</span>
      <input className={`input ${errors[k] ? 'bad' : ''}`} value={form[k]} onChange={set(k)} {...props} />
      {errors[k] && <em>{errors[k]}</em>}
    </label>
  )

  return (
    <section className="auth-wrap container">
      <motion.div className="auth glass" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="logo auth-logo">LUM<span>E</span>N</div>
        <h1 className="auth-title">{mode === 'login' ? 'أهلًا بعودتك 👋' : 'أنشئي حسابك'}</h1>
        <p className="muted center">
          {from === '/checkout' ? 'سجّلي دخولك علشان تكمّلي الطلب.' : 'سجّلي دخولك أو أنشئي حساب جديد في ثواني.'}
        </p>

        <div className="tabs">
          <button className={mode === 'login' ? 'on' : ''} onClick={() => switchMode('login')} type="button">تسجيل دخول</button>
          <button className={mode === 'signup' ? 'on' : ''} onClick={() => switchMode('signup')} type="button">حساب جديد</button>
        </div>

        <form className="auth-form" onSubmit={submit} noValidate>
          <AnimatePresence initial={false}>
            {mode === 'signup' && (
              <motion.div
                key="signup-top"
                className="auth-extra"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {field('name', 'الاسم بالكامل')}
              </motion.div>
            )}
          </AnimatePresence>

          {field('email', 'البريد الإلكتروني', { type: 'email', dir: 'ltr', placeholder: 'name@email.com' })}
          {mode === 'signup' && isAdminEmail(form.email) && (
            <div className="admin-hint">👑 ده إيميل الأدمن، حسابك هيدخل على لوحة التحكم تلقائيًا.</div>
          )}

          <AnimatePresence initial={false}>
            {mode === 'signup' && (
              <motion.div
                key="signup-phone"
                className="auth-extra"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {field('phone', 'رقم الموبايل', { inputMode: 'numeric', dir: 'ltr', placeholder: '01xxxxxxxxx' })}
              </motion.div>
            )}
          </AnimatePresence>

          <label className="field">
            <span>كلمة السر</span>
            <div className="pass-row">
              <input
                className={`input ${errors.password ? 'bad' : ''}`}
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                dir="ltr"
              />
              <button type="button" className="link-btn" onClick={() => setShowPass((s) => !s)}>
                {showPass ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
            {errors.password && <em>{errors.password}</em>}
          </label>

          <AnimatePresence initial={false}>
            {mode === 'signup' && (
              <motion.div
                key="signup-confirm"
                className="auth-extra"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {field('confirm', 'تأكيد كلمة السر', { type: showPass ? 'text' : 'password', dir: 'ltr' })}
              </motion.div>
            )}
          </AnimatePresence>

          {serverError && <div className="alert">{serverError}</div>}

          <button className="btn btn-block" type="submit">
            {mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
          </button>
        </form>

        <p className="muted small center">
          {mode === 'login' ? 'ملكيش حساب؟ ' : 'عندك حساب؟ '}
          <button className="link-btn" type="button" onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'أنشئي حساب جديد' : 'سجّلي دخول'}
          </button>
        </p>
      </motion.div>
    </section>
  )
}
