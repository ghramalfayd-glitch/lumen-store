import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useLocalStorage('lumen-orders', [])

  const addOrder = useCallback((order) => setOrders((prev) => [order, ...prev]), [setOrders])

  const updateOrder = useCallback(
    (id, patch) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o))),
    [setOrders]
  )

  const deleteOrder = useCallback((id) => setOrders((prev) => prev.filter((o) => o.id !== id)), [setOrders])

  const value = useMemo(
    () => ({ orders, addOrder, updateOrder, deleteOrder }),
    [orders, addOrder, updateOrder, deleteOrder]
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export const useOrders = () => useContext(OrdersContext)
