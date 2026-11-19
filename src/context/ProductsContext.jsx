import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { products as seed } from '../data/products'

const ProductsContext = createContext(null)

// المنتجات الافتراضية في data/products.js، وأي تعديل من لوحة الأدمن بيتحفظ في localStorage
export function ProductsProvider({ children }) {
  const [stored, setStored] = useLocalStorage('lumen-products', null)
  const products = stored || seed

  const addProduct = useCallback((p) => setStored((prev) => [...(prev || seed), p]), [setStored])

  const updateProduct = useCallback(
    (id, patch) => setStored((prev) => (prev || seed).map((p) => (p.id === id ? { ...p, ...patch } : p))),
    [setStored]
  )

  const deleteProduct = useCallback(
    (id) => setStored((prev) => (prev || seed).filter((p) => p.id !== id)),
    [setStored]
  )

  const resetProducts = useCallback(() => setStored(null), [setStored])

  const getProduct = useCallback((id) => products.find((p) => p.id === id), [products])

  const value = useMemo(
    () => ({ products, getProduct, addProduct, updateProduct, deleteProduct, resetProducts }),
    [products, getProduct, addProduct, updateProduct, deleteProduct, resetProducts]
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export const useProducts = () => useContext(ProductsContext)
