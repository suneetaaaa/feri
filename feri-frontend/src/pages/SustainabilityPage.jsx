import { Link } from 'react-router-dom'
import { Recycle, Leaf, TrendingDown, Heart } from 'lucide-react'

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen pt-16">
      <section className="py-24 bg-noir text-parchment text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="section-label text-parchment/40 mb-4">Our Commitment</p>
          <h1 className="font-display text-display-lg font-semibold text-parchment mb-6">Fashion's second chapter<br /><span className="italic text-gold/80">starts in Nepal.</span></h1>
          <p className="text-parchment/60 text-lg leading-relaxed">Every purchase on FERI is a vote for a more sustainable Nepal.</p>
        </div>
      </section>
      <section className="py-20">
        <div className="container-page max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">The Problem</p>
            <h2 className="font-display text-display-md font-semibold text-ink">Fast fashion is costing us everything.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { number: '92M', label: 'tonnes of textile waste produced globally every year', icon: '🏭' },
              { number: '20%', label: 'of global water pollution comes from textile dyeing', icon: '💧' },
              { number: '3,000L', label: 'of water needed to produce one cotton t-shirt', icon: '👕' },
            ].map((s, i) => (
              <div key={i} className="card p-7 text-center">
                <span className="text-4xl">{s.icon}</span>
                <p className="font-display text-3xl font-semibold text-ink mt-4 mb-2">{s.number}</p>
                <p className="text-sm text-muted leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container-page max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">FERI Impact</p>
            <h2 className="font-display text-display-md font-semibold text-ink">What we are doing about it.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: <Recycle size={22} className="text-gold" />, title: 'Circular Commerce', body: 'Every item sold on FERI is one less item in a landfill. We are building the circular economy infrastructure Nepal has been missing.' },
              { icon: <Leaf size={22} className="text-gold" />, title: 'Extended Product Life', body: 'Extending the life of a garment by just 9 months reduces its carbon, water, and waste footprint by 20-30%.' },
              { icon: <TrendingDown size={22} className="text-gold" />, title: 'Reduced Fast Fashion', body: 'Every pre-loved purchase is a purchase not made from a fast fashion brand. We are collectively reducing demand for new production.' },
              { icon: <Heart size={22} className="text-gold" />, title: 'Community Education', body: 'We actively promote sustainable consumption habits in Nepal through our platform, our sellers, and our growing community.' }
            ].map((item, i) => (
              <div key={i} className="p-7 rounded-2xl bg-parchment border border-border/60">
                <div className="w-11 h-11 bg-gold/10 rounded-xl flex items-center justify-center mb-4">{item.icon}</div>
                <h3 className="font-semibold text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-noir text-parchment">
        <div className="container-page max-w-3xl mx-auto text-center">
          <h2 className="font-display text-display-md font-semibold text-parchment mb-6">Every purchase counts.</h2>
          <p className="text-parchment/60 leading-relaxed mb-10">Start by choosing second-hand over new for just one purchase. That is how movements begin.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products" className="btn-gold px-8 py-3.5">Shop Second-Hand</Link>
            <Link to="/sell/onboard" className="border border-parchment/20 text-parchment px-8 py-3.5 rounded-xl hover:bg-parchment/10 transition-colors font-medium">Sell Your Items</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
