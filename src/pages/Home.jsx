import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import Scene3D from '../components/Scene3D'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'

const marquee = ['ثلاثي الأبعاد', 'تخصيص لحظي', 'شحن سريع', 'ضمان سنتين', 'تصميم مستقبلي']

const features = [
  { icon: '🌀', title: 'شوفيه من كل زاوية', text: 'كل منتج مجسم 3D حقيقي، لفّيه وكبّريه كأنه في إيدك.' },
  { icon: '🎨', title: 'غيّري اللون لحظيًا', text: 'اختاري اللون وشوفي التغيير مباشرة على المنتج قبل ما تشتري.' },
  { icon: '⚡', title: 'تجربة سريعة جدًا', text: 'بدون تحميلات تقيلة، كل حاجة بتشتغل بسلاسة على أي جهاز.' },
]

export default function Home() {
  const { products } = useProducts()
  const heroProduct = products[0]
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 120])
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.2])
  const color = heroProduct.colors[0]

  return (
    <>
      <section className="hero container">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="pill">✦ مجموعة 2026 وصلت</span>
          <h1>
            المستقبل
            <br />
            <span className="grad">بين إيديكِ</span>
          </h1>
          <p className="lead">
            أجهزة وإكسسوارات بتصميم مختلف. لفّي المنتج بالماوس، غيّري لونه، وشوفي الفرق قبل ما تقرري.
          </p>
          <div className="hero-cta">
            <Link to="/shop" className="btn">تسوقي الآن</Link>
            <Link to={`/product/${heroProduct.id}`} className="btn btn-ghost">شوفي AURA X1 ←</Link>
          </div>
          <div className="stats">
            <div><strong>+5</strong><span>مجسمات 3D</span></div>
            <div><strong>4.8★</strong><span>تقييم العملاء</span></div>
            <div><strong>24س</strong><span>توصيل سريع</span></div>
          </div>
        </motion.div>

        <motion.div className="hero-stage" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <Scene3D
            type={heroProduct.type}
            color={color.hex}
            glow={color.glow}
            follow
            camera={[0, 0.3, 5.2]}
            scale={1.15}
          />
        </motion.div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marquee, ...marquee, ...marquee, ...marquee].map((t, i) => (
            <span key={i}>{t} <b>✦</b></span>
          ))}
        </div>
      </div>

      <section className="section container">
        <div className="section-head">
          <h2>منتجات مميزة</h2>
          <Link to="/shop" className="link-btn">شوفي الكل ←</Link>
        </div>
        <div className="grid">
          {products.slice(0, 3).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="features">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature glass"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p className="muted">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section container">
        <motion.div
          className="cta glass"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>جاهزة تختاري قطعتك؟</h2>
          <p className="muted">استخدمي كود <b>LUMEN10</b> واحصلي على خصم 10% على أول طلب.</p>
          <Link to="/shop" className="btn">ابدئي التسوق</Link>
        </motion.div>
      </section>
    </>
  )
}
