import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, User, Menu, X, ChevronDown, LayoutDashboard, LogOut, Shield } from 'lucide-react'
import { useAuthStore, useCartStore, useWishlistStore } from '../../store'

const FeriLogo = ({ className = '' }) => (
  <Link to="/" className={`flex items-center gap-2.5 flex-shrink-0 ${className}`}>
    <div className="w-9 h-9 rounded-full border-2 border-ink flex items-center justify-center">
      <span className="font-display text-xl font-semibold leading-none" style={{ marginTop: '-1px' }}>F</span>
    </div>
    <span className="font-display text-xl tracking-[0.18em] font-medium">FERI</span>
  </Link>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isLoggedIn, isSeller, isAdmin } = useAuthStore()
  const { count } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const cartCount = count()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/'); setUserMenuOpen(false) }

  const isHome = location.pathname === '/'
  const navBg = scrolled || !isHome
    ? 'bg-parchment/95 backdrop-blur-md border-b border-border shadow-sm'
    : 'bg-transparent'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          <FeriLogo />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/products" className="btn-ghost text-sm">Browse</Link>
            <Link to="/products?category=clothes" className="btn-ghost text-sm">Clothes</Link>
            <Link to="/products?category=novels" className="btn-ghost text-sm">Novels</Link>
            {!isSeller() && !isAdmin() && isLoggedIn() && (
              <Link to="/sell/onboard" className="btn-ghost text-sm text-gold font-semibold">Sell on FERI</Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {isLoggedIn() ? (
              <>
                <Link to="/wishlist" className="relative btn-ghost p-2">
                  <Heart size={18} />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative btn-ghost p-2">
                  <ShoppingBag size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ink text-parchment text-[9px] rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative ml-1">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-1.5 btn-ghost px-3 py-2 text-sm"
                  >
                    <div className="w-7 h-7 bg-ink text-parchment rounded-full flex items-center justify-center text-xs font-semibold">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <ChevronDown size={14} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-modal border border-border/60 py-2 z-20 animate-fade-in">
                        <div className="px-4 py-2.5 border-b border-border/60 mb-1">
                          <p className="font-medium text-sm text-ink truncate">{user?.name}</p>
                          <p className="text-xs text-muted truncate">{user?.email}</p>
                        </div>
                        {isSeller() && (
                          <Link to="/seller/dashboard" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-parchment transition-colors">
                            <LayoutDashboard size={15} /> Seller Dashboard
                          </Link>
                        )}
                        {isAdmin() && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-parchment transition-colors">
                            <Shield size={15} /> Admin Panel
                          </Link>
                        )}
                        <Link to="/orders" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-parchment transition-colors">
                          <ShoppingBag size={15} /> My Orders
                        </Link>
                        <div className="border-t border-border/60 mt-1 pt-1">
                          <button onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Join FERI</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileOpen(v => !v)} className="md:hidden btn-ghost p-2 ml-1">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-parchment border-t border-border animate-fade-in">
          <div className="container-page py-4 flex flex-col gap-1">
            <Link to="/products" className="py-2.5 px-3 rounded-lg hover:bg-white font-medium text-sm transition-colors">Browse All</Link>
            <Link to="/products?category=clothes" className="py-2.5 px-3 rounded-lg hover:bg-white text-sm transition-colors">Clothes</Link>
            <Link to="/products?category=novels" className="py-2.5 px-3 rounded-lg hover:bg-white text-sm transition-colors">Novels</Link>
            {!isLoggedIn() && (
              <>
                <div className="border-t border-border my-2" />
                <Link to="/login" className="py-2.5 px-3 rounded-lg hover:bg-white text-sm transition-colors">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm text-center mt-1">Join FERI</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
