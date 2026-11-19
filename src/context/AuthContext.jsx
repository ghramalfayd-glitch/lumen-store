import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { isAdminEmail } from '../config/admin'

const AuthContext = createContext(null)

// هاش بسيط للتجربة فقط (مش بديل عن باك اند حقيقي)
function hashPass(email, password) {
  const str = `${email.toLowerCase()}::${password}`
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}

// الدور بيتحدد من الإيميل دايمًا: إيميل الأدمن = أدمن، أي إيميل تاني = عميل
const roleOf = (email) => (isAdminEmail(email) ? 'admin' : 'customer')

function loadUsers() {
  try {
    const list = JSON.parse(window.localStorage.getItem('lumen-users') || '[]')
    return list
      .filter((u) => u.id !== 'admin-1') // حساب الأدمن الافتراضي القديم (admin@lumen.com) اتشال
      .map((u) => ({ ...u, role: roleOf(u.email) }))
  } catch {
    return []
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers)
  const [sessionId, setSessionId] = useLocalStorage('lumen-session', null)

  useEffect(() => {
    try {
      window.localStorage.setItem('lumen-users', JSON.stringify(users))
    } catch {
      /* ignore */
    }
  }, [users])

  const user = useMemo(() => {
    const u = users.find((x) => x.id === sessionId)
    if (!u) return null
    const { pass, ...safe } = u
    return safe
  }, [users, sessionId])

  const register = useCallback(
    ({ name, email, phone, password }) => {
      const mail = email.trim().toLowerCase()
      if (users.some((u) => u.email === mail)) return { ok: false, error: 'الإيميل ده مسجل قبل كده، جربي تسجلي دخول' }
      const newUser = {
        id: `u-${Date.now()}`,
        name: name.trim(),
        email: mail,
        phone: phone.trim(),
        role: roleOf(mail), // إيميل الأدمن بيبقى أدمن تلقائيًا، وغيره عميل
        pass: hashPass(mail, password),
        createdAt: new Date().toISOString(),
      }
      setUsers((prev) => [...prev, newUser])
      setSessionId(newUser.id)
      return { ok: true, user: newUser }
    },
    [users, setUsers, setSessionId]
  )

  const login = useCallback(
    (email, password) => {
      const mail = email.trim().toLowerCase()
      const found = users.find((u) => u.email === mail && u.pass === hashPass(mail, password))
      if (!found) return { ok: false, error: 'الإيميل أو كلمة السر غير صحيحة' }
      setSessionId(found.id)
      return { ok: true, user: found }
    },
    [users, setSessionId]
  )

  const logout = useCallback(() => setSessionId(null), [setSessionId])

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === 'admin',
      customers: users.filter((u) => u.role === 'customer').map(({ pass, ...rest }) => rest),
      register,
      login,
      logout,
    }),
    [user, users, register, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
