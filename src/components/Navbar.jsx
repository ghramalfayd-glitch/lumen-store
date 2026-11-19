import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWish } from '../context/WishContext'

export default function Navbar() {
  const { count, setOpen } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const { favs } = useWish()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const handleLogout = () => {
    logout()
    setMenu(false)
    navigate('/')
  }

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="logo">
          LUM<span>E</span>N
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>الرئيسية</NavLink>
          <NavLink to="/shop">المتجر</NavLink>
          {user && !isAdmin && <NavLink to="/orders">طلباتي</NavLink>}
          {isAdmin && <NavLink to="/admin">لوحة التحكم</NavLink>}
        </nav>

        <div className="nav-end">
          {user ? (
            <div className="user-menu" ref={menuRef}>
              <button className="user-chip" onClick={() => setMenu((m) => !m)}>
                <span className="avatar">{user.name.trim().charAt(0)}</span>
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    className="dropdown glass"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="dropdown-head">
                      <strong>{user.name}</strong>
                      <span className="muted small">{user.email}</span>
                      {isAdmin && <span className="role-tag">أدمن</span>}
                    </div>
                    {isAdmin ? (
                      <Link to="/admin" onClick={() => setMenu(false)}>📊 لوحة التحكم</Link>
                    ) : (
                      <Link to="/orders" onClick={() => setMenu(false)}>📦 طلباتي</Link>
                    )}
                    <button onClick={handleLogout}>↩ تسجيل الخروج</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn btn-small btn-ghost">دخول</Link>
          )}

          <Link to="/favorites" className="cart-btn" aria-label="المفضلة">
            <span className="heart-ico">♡</span>
            {favs.length > 0 && (
              <motion.span key={favs.length} className="badge" initial={{ scale: 0.4 }} animate={{ scale: 1 }}>
                {favs.length}
              </motion.span>
            )}
          </Link>

          <button className="cart-btn" onClick={() => setOpen(true)} aria-label="السلة">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6 5 3H2" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
            </svg>
            {count > 0 && (
              <motion.span key={count} className="badge" initial={{ scale: 0.4 }} animate={{ scale: 1 }}>
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
