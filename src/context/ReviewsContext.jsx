import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const ReviewsContext = createContext(null)

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useLocalStorage('lumen-reviews', [])

  // تقييم واحد لكل عميل على كل منتج: لو قيّم قبل كده بيتحدّث
  const saveReview = useCallback(
    ({ productId, userId, userName, rating, comment }) =>
      setReviews((prev) => {
        const entry = {
          id: `r-${Date.now()}`,
          productId,
          userId,
          userName,
          rating,
          comment: comment.trim(),
          createdAt: new Date().toISOString(),
        }
        const exists = prev.find((r) => r.productId === productId && r.userId === userId)
        return exists
          ? prev.map((r) => (r === exists ? { ...entry, id: exists.id } : r))
          : [entry, ...prev]
      }),
    [setReviews]
  )

  const deleteReview = useCallback((id) => setReviews((prev) => prev.filter((r) => r.id !== id)), [setReviews])

  const forProduct = useCallback((productId) => reviews.filter((r) => r.productId === productId), [reviews])

  // التقييم المعروض: متوسط تقييمات العملاء لو فيه، وإلا التقييم الأساسي اللي الأدمن كتبه للمنتج
  const ratingOf = useCallback(
    (product) => {
      const list = reviews.filter((r) => r.productId === product.id)
      if (!list.length) return { value: Number(product.rating), count: 0 }
      return { value: list.reduce((s, r) => s + r.rating, 0) / list.length, count: list.length }
    },
    [reviews]
  )

  const value = useMemo(
    () => ({ reviews, saveReview, deleteReview, forProduct, ratingOf }),
    [reviews, saveReview, deleteReview, forProduct, ratingOf]
  )

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
}

export const useReviews = () => useContext(ReviewsContext)
