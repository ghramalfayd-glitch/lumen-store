import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import CompareBar from './components/CompareBar'
import Favorites from './pages/Favorites'
import Compare from './pages/Compare'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import OrderSuccess from './pages/OrderSuccess'
import MyOrders from './pages/MyOrders'
import Admin from './pages/Admin'

function Page({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <>
      <div className="aurora" aria-hidden="true">
        <i /><i /><i />
      </div>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/shop" element={<Page><Shop /></Page>} />
          <Route path="/product/:id" element={<Page><ProductPage /></Page>} />
          <Route path="/favorites" element={<Page><Favorites /></Page>} />
          <Route path="/compare" element={<Page><Compare /></Page>} />
          <Route path="/login" element={<Page><Login /></Page>} />
          <Route path="/checkout" element={<Page><RequireAuth><Checkout /></RequireAuth></Page>} />
          <Route path="/order/:id" element={<Page><RequireAuth><OrderSuccess /></RequireAuth></Page>} />
          <Route path="/orders" element={<Page><RequireAuth><MyOrders /></RequireAuth></Page>} />
          <Route path="/admin" element={<Page><RequireAuth admin><Admin /></RequireAuth></Page>} />
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Page><Shop /></Page>} />
        </Routes>
      </AnimatePresence>
      <CartDrawer />
      <CompareBar />
      <footer className="footer">
        <div className="container">
          <div className="logo">LUM<span>E</span>N</div>
          <p className="muted">متجر تجريبي بدون باك اند — كل البيانات محفوظة في المتصفح.</p>
        </div>
      </footer>
    </>
  )
}
