import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

export const MAX_COMPARE = 3

const WishContext = createContext(null)

export function WishProvider({ children }) {
  const [favs, setFavs] = useLocalStorage('lumen-favs', [])
  const [compare, setCompare] = useLocalStorage('lumen-compare', [])

  const toggleFav = useCallback(
    (id) => setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
    [setFavs]
  )

  // لو اتختار أكتر من 3، بيتشال أقدم واحد تلقائيًا
  const toggleCompare = useCallback(
    (id) => setCompare((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id].slice(-MAX_COMPARE))),
    [setCompare]
  )

  const clearCompare = useCallback(() => setCompare([]), [setCompare])

  const value = useMemo(
    () => ({
      favs,
      compare,
      isFav: (id) => favs.includes(id),
      inCompare: (id) => compare.includes(id),
      toggleFav,
      toggleCompare,
      clearCompare,
    }),
    [favs, compare, toggleFav, toggleCompare, clearCompare]
  )

  return <WishContext.Provider value={value}>{children}</WishContext.Provider>
}

export const useWish = () => useContext(WishContext)
