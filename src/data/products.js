// كل بيانات المتجر ثابتة هنا (بدون باك اند)
export const STORE_WHATSAPP = '' // اكتبي رقمك بصيغة دولية بدون + مثال: 201001234567
export const FREE_SHIPPING_FROM = 5000
export const SHIPPING_FEE = 60

export const COUPONS = {
  LUMEN10: { label: 'خصم 10%', percent: 10 },
  WELCOME15: { label: 'خصم 15% للعملاء الجدد', percent: 15 },
}

export const categories = [
  { id: 'all', label: 'الكل' },
  { id: 'audio', label: 'صوتيات' },
  { id: 'wearable', label: 'ساعات' },
  { id: 'home', label: 'المنزل' },
  { id: 'fashion', label: 'أزياء' },
]

export const products = [
  {
    id: 'aura-x1',
    name: 'AURA X1',
    type: 'headphones',
    category: 'audio',
    price: 4200,
    rating: 4.9,
    tagline: 'سماعة بتسمع قلبك قبل ما تسمع الموسيقى',
    desc: 'سماعة لاسلكية بعزل ضوضاء ذكي وبطارية تكمل 60 ساعة. إضاءة محيطية على الأذنين بتتغير مع إيقاع الموسيقى.',
    features: ['عزل ضوضاء ذكي', 'بطارية 60 ساعة', 'إضاءة محيطية', 'صوت مكاني'],
    colors: [
      { name: 'أسود فحمي', hex: '#1c1c26', glow: '#7c5cff' },
      { name: 'أبيض لؤلؤي', hex: '#e9e7f5', glow: '#22d3ee' },
      { name: 'أحمر ناري', hex: '#c01c3a', glow: '#ff7a59' },
      { name: 'أخضر غابة', hex: '#1f5b4a', glow: '#34f5a1' },
    ],
  },
  {
    id: 'chrono-s',
    name: 'CHRONO S',
    type: 'watch',
    category: 'wearable',
    price: 3600,
    rating: 4.7,
    tagline: 'الوقت بقى أحلى لما يبقى ذكي',
    desc: 'ساعة ذكية بشاشة AMOLED ومتابعة صحية متكاملة ومقاومة للماء حتى 50 متر. تصميم نحيف يليق مع أي ستايل.',
    features: ['شاشة AMOLED', 'مقاومة للماء', 'متابعة النوم والقلب', 'GPS مدمج'],
    colors: [
      { name: 'جرافيت', hex: '#3a3a46', glow: '#22d3ee' },
      { name: 'ذهبي', hex: '#c9a24a', glow: '#ffd36b' },
      { name: 'أزرق ليلي', hex: '#1d3a8a', glow: '#60a5fa' },
    ],
  },
  {
    id: 'halo-lamp',
    name: 'HALO LAMP',
    type: 'lamp',
    category: 'home',
    price: 1450,
    rating: 4.8,
    tagline: 'إضاءة بتغيّر مزاج الأوضة كلها',
    desc: 'أباجورة مكتب بـ 16 مليون لون وتحكم باللمس. وضع تركيز ووضع نوم ووضع سهرة بضغطة واحدة.',
    features: ['16 مليون لون', 'تحكم باللمس', 'وضع التركيز', 'شحن لاسلكي بالقاعدة'],
    colors: [
      { name: 'أبيض ثلجي', hex: '#f1efe9', glow: '#ffd9a0' },
      { name: 'نحاسي', hex: '#b4693a', glow: '#ffb27a' },
      { name: 'أسود مطفي', hex: '#202026', glow: '#c084fc' },
    ],
  },
  {
    id: 'orb-speaker',
    name: 'ORB SPEAKER',
    type: 'speaker',
    category: 'audio',
    price: 2800,
    rating: 4.6,
    tagline: 'صوت 360 درجة في كورة واحدة',
    desc: 'سماعة بلوتوث كروية بصوت محيطي وحلقة ضوئية بتتفاعل مع الإيقاع. بطارية 24 ساعة ومقاومة للرش.',
    features: ['صوت 360°', 'حلقة ضوئية', 'بطارية 24 ساعة', 'مقاومة للرش'],
    colors: [
      { name: 'فضي', hex: '#b9bcc9', glow: '#7c5cff' },
      { name: 'بنفسجي', hex: '#5b3bd1', glow: '#f472b6' },
      { name: 'تركواز', hex: '#0e9aa7', glow: '#a7f3d0' },
    ],
  },
  {
    id: 'nova-vase',
    name: 'NOVA VASE',
    type: 'vase',
    category: 'home',
    price: 890,
    rating: 4.5,
    tagline: 'قطعة ديكور بتخلي البيت متحف صغير',
    desc: 'مزهرية سيراميك بتشطيب لامع ومنحنى انسيابي. قطعة فنية تتحط في أي ركن وتبقى محور الأوضة.',
    features: ['سيراميك فاخر', 'تشطيب لامع', 'صناعة يدوية', 'مقاومة للخدش'],
    colors: [
      { name: 'تراكوتا', hex: '#c4623a', glow: '#ffb27a' },
      { name: 'عاجي', hex: '#ece6d6', glow: '#fde68a' },
      { name: 'أخضر زيتي', hex: '#5a6b2f', glow: '#bef264' },
      { name: 'أزرق كوبالت', hex: '#1e40af', glow: '#93c5fd' },
    ],
  },
  {
    id: 'voyage-bag',
    name: 'VOYAGE BAG',
    type: 'bag',
    category: 'fashion',
    price: 2300,
    rating: 4.7,
    tagline: 'شنطة بتلبس معاكِ من الصبح للسهرة',
    desc: 'حقيبة يد بخامة مقاومة للماء وبطانة ناعمة وجيوب داخلية منظمة. خياطة مضيئة وقفل معدني بتصميم عصري.',
    features: ['خامة مقاومة للماء', 'جيوب داخلية منظمة', 'قفل معدني', 'حزام كتف قابل للفك'],
    colors: [
      { name: 'أسود', hex: '#1b1b22', glow: '#f472b6' },
      { name: 'كراميل', hex: '#a8672f', glow: '#ffd36b' },
      { name: 'وردي هادي', hex: '#d98aa6', glow: '#fbcfe8' },
      { name: 'أخضر زيتي', hex: '#4a5a2a', glow: '#bef264' },
    ],
  },
]

// أشكال المجسمات المتاحة عند إضافة منتج جديد
export const modelTypes = [
  { id: 'headphones', label: 'سماعة رأس' },
  { id: 'watch', label: 'ساعة ذكية' },
  { id: 'lamp', label: 'أباجورة' },
  { id: 'speaker', label: 'سماعة كروية' },
  { id: 'vase', label: 'مزهرية' },
  { id: 'bag', label: 'حقيبة' },
]

export const formatPrice = (n) => `${Math.round(n).toLocaleString('ar-EG')} ج.م`
