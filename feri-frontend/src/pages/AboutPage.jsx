import { Link } from 'react-router-dom'
import { ShieldCheck, Recycle, Heart, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      <section className="bg-ink text-parchment py-24 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="section-label text-parchment/40 mb-4">Our Story</p>
          <h1 className="font-display text-display-lg font-semibold text-parchment mb-6">We believe things deserve<br /><span className="italic text-gold/80">a second life.</span></h1>
          <p className="text-parchment/60 text-lg leading-relaxed">FERI — from the Nepali word meaning "again" — is Nepal's first trust-based marketplace for second-hand clothes and novels.</p>
        </div>
      </section>
      <section className="py-20">
        <div className="container-page max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-3">Why We Exist</p>
              <h2 className="font-display text-display-md font-semibold text-ink mb-6">Second-hand should not mean second-best.</h2>
              <p className="text-muted leading-relaxed mb-4">In Nepal, thousands of quality clothes and books go to waste every year — not because they are worn out, but because people have no safe, trusted place to sell them.</p>
              <p className="text-muted leading-relaxed mb-4">At the same time, students, young professionals, and budget-conscious families are paying full price for things they could get for a fraction of the cost.</p>
              <p className="text-muted leading-relaxed">FERI bridges that gap — with transparency, trust, and a commitment to sustainability at its core.</p>
            </div>
            <div className="bg-parchment rounded-2xl p-8 border border-border">
              <p className="font-display italic text-2xl text-ink/70 leading-relaxed mb-6">"Chalcha? Hoina, Majjale Chalcha."</p>
              <p className="text-sm text-muted">Our tagline captures everything we believe — that pre-loved things do not just work, they work beautifully. Every item on FERI has a story. Now it is yours to continue.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container-page max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">What We Stand For</p>
            <h2 className="font-display text-display-md font-semibold text-ink">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: <ShieldCheck size={22} className="text-gold" />, title: 'Trust First', body: 'Every seller on FERI signs a public Commitment Pledge. No anonymous listings. No hidden defects. Full accountability on every transaction.' },
              { icon: <Recycle size={22} className="text-gold" />, title: 'Sustainability', body: 'Fashion is one of the world\'s biggest polluters. Every purchase on FERI keeps clothes and books out of landfills and gives them a meaningful second life.' },
              { icon: <Heart size={22} className="text-gold" />, title: 'Community', body: 'FERI is built for Nepal — with eSewa payments, and a deep understanding of how people here buy and sell.' },
              { icon: <Users size={22} className="text-gold" />, title: 'Affordability', body: 'We believe quality should not be a luxury. FERI makes it possible for everyone to access great items at fair prices.' }
            ].map((v, i) => (
              <div key={i} className="p-7 rounded-2xl bg-parchment border border-border/60">
                <div className="w-11 h-11 bg-gold/10 rounded-xl flex items-center justify-center mb-4">{v.icon}</div>
                <h3 className="font-semibold text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-parchment border-t border-border">
        <div className="container-page text-center">
          <h2 className="font-display text-display-sm font-semibold text-ink mb-4">Ready to join Nepal's circular economy?</h2>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link to="/products" className="btn-primary px-8 py-3.5">Browse Products</Link>
            <Link to="/sell/onboard" className="btn-secondary px-8 py-3.5">Start Selling</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
