import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { COUPONS, FREE_SHIPPING_FROM, SHIPPING_FEE, STORE_WHATSAPP } from '../data/products'

const SettingsContext = createContext(null)

// القيم الافتراضية من data/products.js، وأي تعديل من لوحة التحكم بيتحفظ في localStorage
const defaults = {
  shippingFee: SHIPPING_FEE,
  freeShippingFrom: FREE_SHIPPING_FROM,
  whatsapp: STORE_WHATSAPP,
  coupons: COUPONS,
}

export function SettingsProvider({ children }) {
  const [stored, setStored] = useLocalStorage('lumen-settings', null)
  const settings = useMemo(() => ({ ...defaults, ...(stored || {}) }), [stored])

  const update = useCallback((patch) => setStored((prev) => ({ ...(prev || {}), ...patch })), [setStored])

  const addCoupon = useCallback(
    (code, percent, label) =>
      setStored((prev) => {
        const current = { ...defaults, ...(prev || {}) }
        return { ...(prev || {}), coupons: { ...current.coupons, [code]: { percent, label } } }
      }),
    [setStored]
  )

  const removeCoupon = useCallback(
    (code) =>
      setStored((prev) => {
        const current = { ...defaults, ...(prev || {}) }
        const { [code]: _removed, ...rest } = current.coupons
        return { ...(prev || {}), coupons: rest }
      }),
    [setStored]
  )

  const reset = useCallback(() => setStored(null), [setStored])

  const value = useMemo(
    () => ({ settings, update, addCoupon, removeCoupon, reset }),
    [settings, update, addCoupon, removeCoupon, reset]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => useContext(SettingsContext)
