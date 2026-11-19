export const STATUS = [
  { id: 'new', label: 'جديد', icon: '✅' },
  { id: 'preparing', label: 'قيد التجهيز', icon: '📦' },
  { id: 'shipping', label: 'في الطريق', icon: '🚚' },
  { id: 'delivered', label: 'تم التسليم', icon: '🏠' },
  { id: 'cancelled', label: 'ملغي', icon: '✕' },
]

export const statusLabel = (id) => STATUS.find((s) => s.id === id)?.label || id
export const statusStep = (id) => STATUS.findIndex((s) => s.id === id)

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
