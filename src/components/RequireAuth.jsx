import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// admin=true: الصفحة للأدمن فقط. العميل العادي بيتحوّل للرئيسية
export default function RequireAuth({ children, admin = false }) {
  const { user, isAdmin } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (admin && !isAdmin) return <Navigate to="/" replace />
  return children
}
