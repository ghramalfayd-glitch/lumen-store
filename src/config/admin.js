// أي حساب بالإيميل ده بيبقى أدمن ويشوف لوحة التحكم، وباقي الحسابات عملاء عاديين.
// ممكن تضيفي أكتر من إيميل في القائمة.
export const ADMIN_EMAILS = ['ghramalfayd@gmail.com']

export const isAdminEmail = (email = '') => ADMIN_EMAILS.includes(email.trim().toLowerCase())
