import { ADMIN_EMAILS } from './admin'

// إعدادات EmailJS — خدي القيم دي من لوحة تحكم https://dashboard.emailjs.com
// مهم: القيم دي لازم تتكتب هنا في الكود (مش من لوحة التحكم) لأن الرسالة بتتبعت من متصفح العميل
// وقت ما يأكد الطلب. شوفي README لخطوات الإعداد بالتفصيل.
export const EMAILJS = {
  publicKey: 'YOUR_PUBLIC_KEY',
  serviceId: 'YOUR_SERVICE_ID',
  customerTemplateId: 'YOUR_CUSTOMER_TEMPLATE_ID', // القالب اللي بيوصل للعميل
  adminTemplateId: 'YOUR_ADMIN_TEMPLATE_ID', // القالب اللي بيوصل للأدمن
}

// الإيميل اللي هيستقبل إشعارات الطلبات الجديدة (أول إيميل في قائمة الأدمن)
export const ADMIN_EMAIL = ADMIN_EMAILS[0]
