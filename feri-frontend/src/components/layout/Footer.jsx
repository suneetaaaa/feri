import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-noir text-parchment/80 pt-16 pb-8 mt-20">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full border-2 border-parchment/60 flex items-center justify-center">
                <span className="font-display text-xl font-semibold text-parchment leading-none" style={{ marginTop: '-1px' }}>F</span>
              </div>
              <span className="font-display text-xl tracking-[0.18em] text-parchment font-medium">FERI</span>
            </div>
            <p className="font-display text-base italic text-parchment/60 leading-relaxed">
              "Chalcha? Hoina, Majjale Chalcha."
            </p>
            <p className="text-xs text-parchment/40 mt-3 leading-relaxed">
              Nepal's trusted second-hand marketplace. Giving clothes and books a second life.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="section-label text-parchment/40 mb-4">Explore</p>
            <div className="flex flex-col gap-2.5">
              <Link to="/products" className="text-sm hover:text-parchment transition-colors">Browse All</Link>
              <Link to="/products?category=clothes" className="text-sm hover:text-parchment transition-colors">Clothes</Link>
              <Link to="/products?category=novels" className="text-sm hover:text-parchment transition-colors">Novels</Link>
              <Link to="/products?featured=true" className="text-sm hover:text-parchment transition-colors">Featured Picks</Link>
            </div>
          </div>

          {/* Sell */}
          <div>
            <p className="section-label text-parchment/40 mb-4">Sellers</p>
            <div className="flex flex-col gap-2.5">
              <Link to="/sell/onboard" className="text-sm hover:text-parchment transition-colors">Start Selling</Link>
              <Link to="/seller/dashboard" className="text-sm hover:text-parchment transition-colors">Seller Dashboard</Link>
              <a href="#" className="text-sm hover:text-parchment transition-colors">Seller Guidelines</a>
              <a href="#" className="text-sm hover:text-parchment transition-colors">Trust & Safety</a>
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="section-label text-parchment/40 mb-4">Company</p>
            <div className="flex flex-col gap-2.5">
              <a href="#" className="text-sm hover:text-parchment transition-colors">About FERI</a>
              <a href="#" className="text-sm hover:text-parchment transition-colors">Sustainability</a>
              <a href="#" className="text-sm hover:text-parchment transition-colors">Contact</a>
              <a href="#" className="text-sm hover:text-parchment transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>

        <div className="border-t border-parchment/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-parchment/30">
            © 2025 FERI Marketplace. Made with care in Nepal.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-parchment/30">Payments secured by</span>
            <span className="text-xs font-semibold text-[#60BB46]">eSewa</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
