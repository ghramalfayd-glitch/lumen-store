import { categories, modelTypes } from '../data/products'

// بيولّد محتوى ملف src/data/products.js كامل بالمنتجات والإعدادات الحالية.
// ده الطريقة الوحيدة اللي تعديلات الأدمن توصل بيها لكل العملاء من غير باك اند:
// الأدمن بينزّل الملف ويستبدل بيه الملف القديم ويرفع المشروع من جديد.
export function buildCatalogFile({ products, settings }) {
  const j = (v) => JSON.stringify(v, null, 2)
  return `// ملف مُولَّد من لوحة التحكم — استبدلي به الملف src/data/products.js
export const STORE_WHATSAPP = ${JSON.stringify(settings.whatsapp || '')}
export const FREE_SHIPPING_FROM = ${Number(settings.freeShippingFrom) || 0}
export const SHIPPING_FEE = ${Number(settings.shippingFee) || 0}

export const COUPONS = ${j(settings.coupons)}

export const categories = ${j(categories)}

export const products = ${j(products)}

// أشكال المجسمات المتاحة عند إضافة منتج جديد
export const modelTypes = ${j(modelTypes)}

export const formatPrice = (n) => \`\${Math.round(n).toLocaleString('ar-EG')} ج.م\`
`
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/javascript;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
