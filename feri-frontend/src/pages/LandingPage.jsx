import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Recycle, ShieldCheck, Star, TrendingUp } from 'lucide-react'
import api from '../utils/api'
import { ProductCard, StarRating, TrustBadge } from '../components/ui'
import { formatNPRLatin } from '../utils/helpers'

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden bg-parchment">
    {/* Background grid texture */}
    <div className="absolute inset-0 opacity-[0.03]"
      style={{ backgroundImage: 'radial-gradient(circle, #1A1A1A 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

    {/* Decorative ink blot */}
    <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-l from-ink/5 to-transparent" />
      <div className="absolute top-20 right-12 w-72 h-72 rounded-full border border-ink/8" />
      <div className="absolute top-28 right-20 w-56 h-56 rounded-full border border-ink/5" />
      <div className="w-full h-full flex items-center justify-center pr-10">
        {/* Floating product cards */}
        <div className="relative w-80 h-96">
          <div className="absolute top-0 left-0 w-48 h-60 bg-white rounded-2xl shadow-card-hover overflow-hidden rotate-[-3deg]">
            <img src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 w-44 h-56 bg-white rounded-2xl shadow-card-hover overflow-hidden rotate-[4deg]">
            <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>

    <div className="container-page relative z-10 pt-24">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="section-label">Nepal's Trusted Pre-Loved Marketplace</span>
        </div>

        <h1 className="font-display font-semibold text-ink mb-4" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 1.06, letterSpacing: '-0.02em' }}>
          Giving Things<br />
          <span className="italic text-gold">a Second Life.</span>
        </h1>

        <p className="font-display italic text-2xl text-ink/50 mb-6">
          "Chalcha? Hoina, Majjale Chalcha."
        </p>

        <p className="text-muted text-base leading-relaxed mb-10 max-w-lg">
          Buy and sell pre-loved clothes and novels with full transparency. Every seller takes a public commitment pledge — so you always know what you're getting.
        </p>

        <div className="flex flex-wrap gap-3 mb-14">
          <Link to="/products" className="btn-primary flex items-center gap-2.5 text-base py-3.5 px-7">
            Start Browsing <ArrowRight size={17} />
          </Link>
          <Link to="/sell/onboard" className="btn-secondary flex items-center gap-2.5 text-base py-3.5 px-7">
            Sell on FERI
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center gap-6">
          {[
            { icon: '✓', text: 'Seller Commitment Pledge' },
            { icon: '◈', text: 'Verified Listings' },
            { icon: '⬡', text: 'eSewa Payments' },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-gold text-sm">{t.icon}</span>
              <span className="text-sm text-muted">{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
      <div className="w-px h-10 bg-ink" />
      <span className="text-[10px] tracking-widest uppercase font-medium">Scroll</span>
    </div>
  </section>
)

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatsBar = () => (
  <section className="bg-ink text-parchment py-12">
    <div className="container-page">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-parchment/10">
        {[
          { number: '2,400+', label: 'Items Listed' },
          { number: '680+',   label: 'Happy Buyers' },
          { number: '₹18L+',  label: 'Saved by Buyers' },
          { number: '4.8★',   label: 'Average Rating' },
        ].map((s, i) => (
          <div key={i} className={`${i > 0 ? 'pl-8' : ''} text-center md:text-left`}>
            <p className="font-display text-display-sm font-semibold text-parchment">{s.number}</p>
            <p className="text-parchment/50 text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── Featured Products ────────────────────────────────────────────────────────
const FeaturedProducts = ({ products }) => (
  <section className="py-20">
    <div className="container-page">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="section-label mb-3">Handpicked</p>
          <h2 className="font-display text-display-md font-semibold text-ink">Featured Picks</h2>
        </div>
        <Link to="/products?featured=true" className="btn-ghost flex items-center gap-1.5 text-sm hidden sm:flex">
          View all <ArrowRight size={15} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      <div className="text-center mt-10 sm:hidden">
        <Link to="/products" className="btn-secondary text-sm">Browse all items</Link>
      </div>
    </div>
  </section>
)

// ─── Category Split ───────────────────────────────────────────────────────────
const CategorySplit = () => (
  <section className="py-4">
    <div className="container-page">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            slug: 'clothes',
            label: 'Fashion',
            title: 'Pre-Loved\nClothes',
            subtitle: 'Quality fashion at a fraction of the price. From everyday wear to special occasion pieces.',
            img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900',
            accent: 'bg-amber-50'
          },
          {
            slug: 'novels',
            label: 'Books',
            title: 'Second-Hand\nNovels',
            subtitle: 'Stories deserve more than one reader. Find your next favourite book.',
            img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900',
            accent: 'bg-blue-50'
          }
        ].map(cat => (
          <Link key={cat.slug} to={`/products?category=${cat.slug}`}
            className="group relative h-72 md:h-96 rounded-2xl overflow-hidden cursor-pointer">
            <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="section-label text-parchment/60 mb-2">{cat.label}</p>
              <h3 className="font-display text-display-sm font-semibold text-parchment whitespace-pre-line leading-tight mb-2">{cat.title}</h3>
              <p className="text-parchment/60 text-sm leading-relaxed max-w-xs hidden md:block">{cat.subtitle}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-parchment text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Browse <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
)

// ─── Trust Explainer ──────────────────────────────────────────────────────────
const TrustSection = () => (
  <section className="py-20 bg-white">
    <div className="container-page">
      <div className="text-center mb-14">
        <p className="section-label mb-3">What makes us different</p>
        <h2 className="font-display text-display-md font-semibold text-ink">Built on Trust</h2>
        <p className="text-muted mt-2 max-w-lg mx-auto text-base">
          Every seller on FERI takes a public commitment pledge before listing. No anonymous sellers. No hidden defects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <ShieldCheck size={22} className="text-gold" />,
            title: 'Commitment Pledge',
            body: 'Every seller publicly pledges to upload genuine photos, disclose all defects, and ship on time. This commitment lives on their profile permanently.'
          },
          {
            icon: <Star size={22} className="text-gold" />,
            title: 'Verified Reviews',
            body: 'Only confirmed buyers can leave reviews. Our rating system reflects real transactions — not empty promises.'
          },
          {
            icon: <Recycle size={22} className="text-gold" />,
            title: 'Circular Commerce',
            body: 'Every purchase keeps clothes and books out of landfills. FERI sellers have collectively diverted tonnes of textile waste.'
          }
        ].map((item, i) => (
          <div key={i} className="p-8 rounded-2xl bg-parchment border border-border/60">
            <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-5">
              {item.icon}
            </div>
            <h3 className="font-semibold text-ink mb-3">{item.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── Top Sellers ──────────────────────────────────────────────────────────────
const TopSellers = ({ sellers }) => {
  if (!sellers.length) return null
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-3">Community</p>
            <h2 className="font-display text-display-md font-semibold text-ink">Top Sellers</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {sellers.slice(0, 6).map(s => (
            <Link key={s.id} to={`/sellers/${s.id}`} className="card p-6 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-ink/5 rounded-full flex items-center justify-center text-xl font-display font-semibold border border-border">
                  {s.shopName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-ink truncate">{s.shopName}</p>
                  <p className="text-xs text-muted">{s.location}</p>
                  <TrustBadge badge={s.trustBadge} />
                </div>
              </div>
              <StarRating rating={s.averageRating} count={s.trustScore?.totalReviews} />
              <p className="text-xs text-muted mt-3 leading-relaxed line-clamp-2">{s.bio}</p>
              {s.commitment?.isActive && (
                <div className="flex items-center gap-1.5 mt-4 text-xs text-gold font-medium">
                  <ShieldCheck size={12} /> Commitment Signed
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Sustainability ───────────────────────────────────────────────────────────
const SustainabilitySection = () => (
  <section className="py-20 bg-noir text-parchment overflow-hidden relative">
    <div className="absolute top-0 right-0 w-72 h-72 rounded-full border border-parchment/5 translate-x-1/3 -translate-y-1/3" />
    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full border border-parchment/5 -translate-x-1/3 translate-y-1/3" />
    <div className="container-page relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <p className="section-label text-parchment/40 mb-4">Our Mission</p>
        <h2 className="font-display text-display-lg font-semibold text-parchment mb-6">
          Fashion's second chapter<br />
          <span className="italic text-gold/80">starts here.</span>
        </h2>
        <p className="text-parchment/60 text-base leading-relaxed mb-12 max-w-2xl mx-auto">
          The fashion industry is one of the world's largest polluters. In Nepal, thousands of tonnes of clothing end up discarded every year. FERI exists to change that — one second-hand sale at a time.
        </p>
        <div className="grid grid-cols-3 gap-8 border-t border-parchment/10 pt-10">
          {[
            { number: '4.2T', label: 'CO₂ saved (kg eq.)' },
            { number: '18K+', label: 'Items rehomed' },
            { number: '₹42L', label: 'Buyer savings' },
          ].map((s, i) => (
            <div key={i}>
              <p className="font-display text-display-sm font-semibold text-parchment">{s.number}</p>
              <p className="text-parchment/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

// ─── Testimonials ─────────────────────────────────────────────────────────────
const Testimonials = () => (
  <section className="py-20 bg-white">
    <div className="container-page">
      <div className="text-center mb-12">
        <p className="section-label mb-3">Reviews</p>
        <h2 className="font-display text-display-md font-semibold text-ink">What buyers say</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Sita Rai', location: 'Kathmandu', rating: 5, text: 'Bought a Zara dress for a third of the price. Photos were exactly what I received — even better in person. The seller\'s commitment pledge gave me real confidence.', item: 'Zara Floral Dress' },
          { name: 'Binod Karki', location: 'Pokhara', rating: 5, text: 'Got Sapiens and The Alchemist for under NPR 800 total. Condition was exactly as described. Fast shipping too — arrived in 3 days.', item: 'Sapiens + The Alchemist' },
          { name: 'Anita Magar', location: 'Lalitpur', rating: 5, text: 'As a seller, FERI\'s commitment system actually helped me — buyers trust me more and I get fewer unnecessary questions. Sold 12 items in 2 weeks!', item: 'Seller review' },
        ].map((t, i) => (
          <div key={i} className="p-7 rounded-2xl bg-parchment border border-border/60">
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map(s => (
                <span key={s} className="text-gold text-sm">{s <= t.rating ? '★' : '☆'}</span>
              ))}
            </div>
            <p className="text-sm text-ink/80 leading-relaxed mb-5 italic">"{t.text}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-ink">{t.name}</p>
                <p className="text-xs text-muted">{t.location}</p>
              </div>
              <span className="text-xs text-muted bg-white border border-border rounded-full px-2.5 py-1">{t.item}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── CTA Banner ───────────────────────────────────────────────────────────────
const CTABanner = () => (
  <section className="py-20">
    <div className="container-page">
      <div className="bg-ink rounded-3xl px-8 md:px-16 py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
        <p className="section-label text-parchment/40 mb-4">Ready?</p>
        <h2 className="font-display text-display-md font-semibold text-parchment mb-4">
          Start giving things<br />
          <span className="italic text-gold/80">a second life.</span>
        </h2>
        <p className="text-parchment/50 text-base mb-10 max-w-lg mx-auto">
          Join thousands of buyers and sellers across Nepal who are choosing circular commerce.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/register" className="btn-gold text-base py-3.5 px-8">Join FERI — it's free</Link>
          <Link to="/products" className="border border-parchment/20 text-parchment font-body font-medium px-8 py-3.5 rounded-xl transition-all duration-200 hover:bg-parchment/10 text-base">
            Browse first
          </Link>
        </div>
      </div>
    </div>
  </section>
)

// ─── Main LandingPage ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [topSellers, setTopSellers] = useState([])

  useEffect(() => {
    api.get('/products?featured=true&limit=10&status=APPROVED').then(r => setFeaturedProducts(r.data.products)).catch(() => {})
    api.get('/sellers?limit=6').then(r => setTopSellers(r.data.sellers)).catch(() => {})
  }, [])

  return (
    <div>
      <Hero />
      <StatsBar />
      {featuredProducts.length > 0 && <FeaturedProducts products={featuredProducts} />}
      <CategorySplit />
      <TrustSection />
      {topSellers.length > 0 && <TopSellers sellers={topSellers} />}
      <SustainabilitySection />
      <Testimonials />
      <CTABanner />
    </div>
  )
}
