import { Link } from 'react-router-dom'
import { Heart, Star, ShieldCheck, Award, Gem } from 'lucide-react'
import { useWishlistStore, useAuthStore } from '../../store'
import { conditionLabel, conditionColor, savings, trustBadgeConfig, formatNPRLatin } from '../../utils/helpers'
import toast from 'react-hot-toast'

// ─── ProductCard ──────────────────────────────────────────────────────────────
export const ProductCard = ({ product }) => {
  const { toggle, isWishlisted } = useWishlistStore()
  const { isLoggedIn } = useAuthStore()
  const wished = isWishlisted(product.id)
  const pct = savings(product.originalPrice, product.sellingPrice)

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!isLoggedIn()) { toast.error('Sign in to save to wishlist'); return }
    await toggle(product.id)
    toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <Link to={`/products/${product.id}`} className="product-card group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Condition badge overlay */}
        <span className={`absolute top-3 left-3 condition-badge text-[10px] font-semibold ${conditionColor[product.condition]}`}>
          {conditionLabel[product.condition]}
        </span>
        {/* Savings badge */}
        {pct >= 20 && (
          <span className="absolute top-3 right-10 bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{pct}%
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110"
        >
          <Heart size={14} fill={wished ? '#B8860B' : 'none'} stroke={wished ? '#B8860B' : '#1A1A1A'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Seller */}
        {product.sellerProfile && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 bg-ink/10 rounded-full flex items-center justify-center text-[9px] font-bold text-ink">
              {product.sellerProfile.shopName?.[0]}
            </div>
            <span className="text-[11px] text-muted">{product.sellerProfile.shopName}</span>
            {product.sellerProfile.trustBadge && (
              <span className={`trust-badge text-[9px] py-0 px-1.5 ${trustBadgeConfig[product.sellerProfile.trustBadge]?.color}`}>
                {trustBadgeConfig[product.sellerProfile.trustBadge]?.icon}
              </span>
            )}
          </div>
        )}
        <h3 className="font-medium text-sm text-ink leading-snug mb-3 line-clamp-2">{product.title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold text-ink">{formatNPRLatin(product.sellingPrice)}</span>
          <span className="text-xs text-muted line-through">{formatNPRLatin(product.originalPrice)}</span>
        </div>
        <p className="text-[11px] text-gold font-medium mt-0.5">Save {formatNPRLatin(product.originalPrice - product.sellingPrice)}</p>
      </div>
    </Link>
  )
}

// ─── TrustBadge ───────────────────────────────────────────────────────────────
export const TrustBadge = ({ badge, size = 'sm' }) => {
  if (!badge) return null
  const cfg = trustBadgeConfig[badge]
  const Icon = badge === 'ELITE_SELLER' ? Gem : badge === 'TOP_SELLER' ? Award : ShieldCheck
  return (
    <span className={`trust-badge ${cfg.color} ${size === 'lg' ? 'text-sm px-3 py-1.5' : 'text-xs'}`}>
      <Icon size={size === 'lg' ? 14 : 11} />
      {cfg.label}
    </span>
  )
}

// ─── StarRating ───────────────────────────────────────────────────────────────
export const StarRating = ({ rating, count, size = 14 }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? '#B8860B' : 'none'} stroke={i <= Math.round(rating) ? '#B8860B' : '#D4C9B8'} />
      ))}
    </div>
    <span className="font-medium text-sm text-ink">{Number(rating).toFixed(1)}</span>
    {count !== undefined && <span className="text-xs text-muted">({count})</span>}
  </div>
)

// ─── CommitmentBox ────────────────────────────────────────────────────────────
export const CommitmentBox = ({ commitment, sellerName }) => {
  if (!commitment?.agreedToTerms) return null
  return (
    <div className="border border-gold/30 bg-gold/5 rounded-2xl p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 bg-gold/15 rounded-full flex items-center justify-center">
          <ShieldCheck size={16} className="text-gold" />
        </div>
        <div>
          <p className="font-semibold text-sm text-ink">Seller's Commitment</p>
          <p className="text-xs text-muted">Signed by {sellerName}</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {[
          'Uploads genuine, unfiltered photos',
          'Describes every item honestly — including flaws',
          'Discloses all defects before purchase',
          'Ships within the agreed timeframe',
          'Communicates respectfully with buyers',
        ].map((pledge, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-gold text-xs mt-0.5 flex-shrink-0">✓</span>
            <p className="text-xs text-ink/80 leading-relaxed">{pledge}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted mt-3 pt-3 border-t border-gold/20">
        This seller has agreed to FERI's Seller Commitment. Violations are reviewed by our trust team.
      </p>
    </div>
  )
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
export const SectionHeader = ({ label, title, subtitle, align = 'left' }) => (
  <div className={`mb-10 ${align === 'center' ? 'text-center' : ''}`}>
    {label && <p className="section-label mb-3">{label}</p>}
    <h2 className="font-display text-display-md font-semibold text-ink">{title}</h2>
    {subtitle && <p className="text-muted text-base mt-2 max-w-xl">{subtitle}</p>}
  </div>
)

// ─── EmptyState ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon = '📦', title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <span className="text-5xl mb-4">{icon}</span>
    <h3 className="font-display text-display-sm font-semibold text-ink mb-2">{title}</h3>
    {subtitle && <p className="text-muted text-sm mb-6 max-w-sm">{subtitle}</p>}
    {action}
  </div>
)

// ─── LoadingSpinner ───────────────────────────────────────────────────────────
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
    <p className="text-sm text-muted">{message}</p>
  </div>
)

// ─── PageHeader ───────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, children }) => (
  <div className="pt-24 pb-10 border-b border-border">
    <div className="container-page flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 className="font-display text-display-md font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-muted mt-1 text-sm">{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
)
