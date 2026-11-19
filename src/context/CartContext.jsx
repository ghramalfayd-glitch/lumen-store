import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useProducts } from './ProductsContext'
import { useSettings } from './SettingsContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('lumen-cart', [])
  const [coupon, setCoupon] = useLocalStorage('lumen-coupon', null)
  const [open, setOpen] = useState(false)
  const { getProduct } = useProducts()
  const { settings } = useSettings()

  const add = useCallback(
    (id, color, qty = 1) => {
      setItems((prev) => {
        const found = prev.find((i) => i.id === id && i.color === color)
        if (found) {
          return prev.map((i) => (i === found ? { ...i, qty: Math.min(i.qty + qty, 10) } : i))
        }
        return [...prev, { id, color, qty }]
      })
      setOpen(true)
    },
    [setItems]
  )

  const setQty = useCallback(
    (id, color, qty) => {
      setItems((prev) =>
        prev
          .map((i) => (i.id === id && i.color === color ? { ...i, qty: Math.max(0, Math.min(qty, 10)) } : i))
          .filter((i) => i.qty > 0)
      )
    },
    [setItems]
  )

  const remove = useCallback(
    (id, color) => setItems((prev) => prev.filter((i) => !(i.id === id && i.color === color))),
    [setItems]
  )

  const clear = useCallback(() => {
    setItems([])
    setCoupon(null)
  }, [setItems, setCoupon])

  const applyCoupon = useCallback(
    (code) => {
      const key = code.trim().toUpperCase()
      if (settings.coupons[key]) {
        setCoupon(key)
        return true
      }
      return false
    },
    [setCoupon, settings.coupons]
  )

  const value = useMemo(() => {
    const lines = items
      .map((i) => {
        const product = getProduct(i.id)
        if (!product) return null
        const color = product.colors.find((c) => c.name === i.color) || product.colors[0]
        return { ...i, product, colorObj: color, total: product.price * i.qty }
      })
      .filter(Boolean)

    const count = lines.reduce((s, l) => s + l.qty, 0)
    const subtotal = lines.reduce((s, l) => s + l.total, 0)
    const percent = coupon && settings.coupons[coupon] ? settings.coupons[coupon].percent : 0
    const discount = Math.round((subtotal * percent) / 100)
    const shipping = subtotal === 0 || subtotal - discount >= settings.freeShippingFrom ? 0 : settings.shippingFee
    const total = subtotal - discount + shipping

    return {
      lines, count, subtotal, discount, shipping, total, coupon, open,
      setOpen, add, setQty, remove, clear, applyCoupon, removeCoupon: () => setCoupon(null),
    }
  }, [items, coupon, open, add, setQty, remove, clear, applyCoupon, setCoupon, getProduct, settings])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
