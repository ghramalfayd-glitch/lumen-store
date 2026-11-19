import emailjs from '@emailjs/browser'
import { ADMIN_EMAIL, EMAILJS } from '../config/emailjs'
import { formatPrice } from '../data/products'
import { fmtDate, fmtDateTime } from '../data/orderStatus'

const filled = (v) => Boolean(v) && !String(v).startsWith('YOUR_')

// حالة كل مفتاح (بتظهر في تبويب الإعدادات في لوحة التحكم)
export const emailStatus = () => ({
  publicKey: filled(EMAILJS.publicKey),
  serviceId: filled(EMAILJS.serviceId),
  customerTemplate: filled(EMAILJS.customerTemplateId),
  adminTemplate: filled(EMAILJS.adminTemplateId),
})

const baseReady = () => filled(EMAILJS.publicKey) && filled(EMAILJS.serviceId)

function buildParams(order) {
  const textLines = order.lines
    .map((l) => `• ${l.name} (${l.color}) × ${l.qty} — ${formatPrice(l.total)}`)
    .join('\n')
  const htmlLines = order.lines
    .map((l) => `• ${l.name} (${l.color}) × ${l.qty} — <b>${formatPrice(l.total)}</b>`)
    .join('<br>')

  return {
    order_id: order.id,
    order_date: fmtDateTime(order.createdAt),
    order_details_text: textLines,
    order_details_html: htmlLines,
    subtotal: formatPrice(order.subtotal),
    discount: order.discount ? `- ${formatPrice(order.discount)}` : 'لا يوجد',
    shipping: order.shipping ? formatPrice(order.shipping) : 'مجاني',
    total: formatPrice(order.total),
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    customer_address: `${order.customer.city} - ${order.customer.address}`,
    delivery_date: fmtDate(order.deliveryDate),
    delivery_window: order.deliveryWindow,
  }
}

const sendRaw = (templateId, params) =>
  emailjs.send(EMAILJS.serviceId, templateId, params, { publicKey: EMAILJS.publicKey })

async function send(templateId, params) {
  if (!baseReady() || !filled(templateId)) return 'skipped'
  try {
    await sendRaw(templateId, params)
    return 'sent'
  } catch (err) {
    console.error('EmailJS error:', err)
    return 'failed'
  }
}

// بيبعت رسالتين: واحدة للعميل وواحدة للأدمن، ويرجّع حالة كل واحدة (sent / failed / skipped)
export async function sendOrderEmails(order) {
  if (!baseReady()) {
    console.warn('EmailJS غير مفعّل: عدّلي src/config/emailjs.js')
    return { customer: 'skipped', admin: 'skipped' }
  }
  const base = buildParams(order)
  const [customer, admin] = await Promise.all([
    send(EMAILJS.customerTemplateId, { ...base, to_email: order.customer.email, to_name: order.customer.name }),
    send(EMAILJS.adminTemplateId, { ...base, to_email: ADMIN_EMAIL, to_name: 'مدير المتجر' }),
  ])
  return { customer, admin }
}

// اختبار الربط: بيبعت رسالة تجريبية لإيميل الأدمن بطلب وهمي، ويرجّع سبب الفشل لو حصل
export async function sendTestEmail(kind) {
  const templateId = kind === 'admin' ? EMAILJS.adminTemplateId : EMAILJS.customerTemplateId
  if (!baseReady()) return { ok: false, error: 'لسه مفيش Public Key و Service ID في src/config/emailjs.js' }
  if (!filled(templateId)) return { ok: false, error: 'لسه مفيش Template ID للقالب ده في src/config/emailjs.js' }

  const now = new Date()
  const eta = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const fake = {
    id: 'LM-TEST01',
    createdAt: now.toISOString(),
    deliveryDate: eta.toISOString(),
    deliveryWindow: 'من 10 صباحًا حتى 6 مساءً',
    lines: [{ name: 'AURA X1', color: 'أسود فحمي', qty: 1, total: 4200 }],
    subtotal: 4200,
    discount: 0,
    shipping: 0,
    total: 4200,
    customer: {
      name: 'عميل تجريبي',
      email: ADMIN_EMAIL,
      phone: '01000000000',
      city: 'القاهرة',
      address: 'عنوان تجريبي',
    },
  }

  try {
    await sendRaw(templateId, { ...buildParams(fake), to_email: ADMIN_EMAIL, to_name: kind === 'admin' ? 'مدير المتجر' : 'عميل تجريبي' })
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err?.text || err?.message || 'خطأ غير معروف' }
  }
}
