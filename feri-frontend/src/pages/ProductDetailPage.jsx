import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, Share2, AlertTriangle, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import api from '../utils/api'
import { useCartStore, useWishlistStore, useAuthStore } from '../store'
import { CommitmentBox, StarRating, TrustBadge, LoadingSpinner } from '../components/ui'
import { conditionLabel, conditionColor, savings, formatNPRLatin, timeAgo } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [addingCart, setAddingCart] = useState(false)
  const { addToCart } = useCartStore()
  const { toggle, isWishlisted } = useWishlistStore()
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data.product))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>
  if (!product) return null

  const { sellerProfile, category, reviews } = product
  const pct = savings(product.originalPrice, product.sellingPrice)
  const allImages = product.imageUrls || []

  const handleAddToCart = async () => {
    if (!isLoggedIn()) { toast.error('Sign in to add to cart'); return }
    setAddingCart(true)
    try {
      await addToCart(product.id)
      toast.success('Added to cart')
    } catch { toast.error('Could not add to cart') }
    finally { setAddingCart(false) }
  }

  const handleWishlist = async () => {
    if (!isLoggedIn()) { toast.error('Sign in to save items'); return }
    await toggle(product.id)
    toast.success(isWishlisted(product.id) ? 'Removed from wishlist' : 'Saved to wishlist')
  }

  const wished = isWishlisted(product.id)

  return (
    <div className="min-h-screen pt-16">
      {/* Breadcrumb */}
      <div className="container-page py-4">
        <nav className="flex items-center gap-2 text-xs text-muted">
          <Link to="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-ink">Browse</Link>
          <span>/</span>
          <Link to={`/products?category=${category?.slug}`} className="hover:text-ink">{category?.name}</Link>
          <span>/</span>
          <span className="text-ink truncate max-w-48">{product.title}</span>
        </nav>
      </div>

      <div className="container-page pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* ── Left: Media ── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square bg-cream rounded-2xl overflow-hidden">
              {showVideo && product.videoUrl ? (
                <video src={product.videoUrl} controls autoPlay className="w-full h-full object-cover" />
              ) : (
                <img
                  src={allImages[imgIdx] || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Nav arrows */}
              {allImages.length > 1 && !showVideo && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              <span className={`absolute top-4 left-4 condition-badge ${conditionColor[product.condition]}`}>
                {conditionLabel[product.condition]}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((url, i) => (
                <button key={i} onClick={() => { setImgIdx(i); setShowVideo(false) }}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${imgIdx === i && !showVideo ? 'border-ink' : 'border-transparent'}`}>
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {product.videoUrl && (
                <button onClick={() => setShowVideo(true)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 bg-ink/5 flex items-center justify-center transition-colors ${showVideo ? 'border-ink' : 'border-transparent hover:border-border'}`}>
                  <Play size={18} className="text-ink" />
                </button>
              )}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="space-y-6">
            {/* Category + title */}
            <div>
              <Link to={`/products?category=${category?.slug}`}
                className="section-label hover:text-ink transition-colors">{category?.name}</Link>
              <h1 className="font-display text-display-sm font-semibold text-ink mt-2 leading-tight">{product.title}</h1>
              {product.brand && (
                <p className="text-sm text-muted mt-1">by <span className="text-ink font-medium">{product.brand}</span>
                  {product.size && <span> · Size {product.size}</span>}
                  {product.color && <span> · {product.color}</span>}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-display text-3xl font-semibold text-ink">{formatNPRLatin(product.sellingPrice)}</span>
              <span className="text-muted line-through">{formatNPRLatin(product.originalPrice)}</span>
              {pct >= 5 && (
                <span className="bg-gold/10 text-gold text-xs font-semibold px-2.5 py-1 rounded-full">
                  {pct}% off · Save {formatNPRLatin(product.originalPrice - product.sellingPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted leading-relaxed">{product.description}</p>

            {/* Defect Disclosure */}
            <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-0.5">Defect Disclosure</p>
                <p className="text-xs text-amber-700 leading-relaxed">{product.defectDisclosure}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={addingCart || product.status === 'SOLD'}
                className="btn-primary flex-1 flex items-center justify-center gap-2.5 py-3.5"
              >
                <ShoppingBag size={18} />
                {product.status === 'SOLD' ? 'Sold' : addingCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button onClick={handleWishlist}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${wished ? 'border-gold bg-gold/5' : 'border-border hover:border-ink'}`}>
                <Heart size={18} fill={wished ? '#B8860B' : 'none'} stroke={wished ? '#B8860B' : '#1A1A1A'} />
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
                className="w-12 h-12 rounded-xl border-2 border-border hover:border-ink flex items-center justify-center transition-colors">
                <Share2 size={18} />
              </button>
            </div>

            {/* Seller Trust Box */}
            {sellerProfile && (
              <div className="card p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Link to={`/sellers/${sellerProfile.id}`}
                    className="w-12 h-12 bg-ink/5 rounded-full flex items-center justify-center text-lg font-display font-semibold border border-border hover:border-ink transition-colors">
                    {sellerProfile.shopName?.[0]}
                  </Link>
                  <div className="flex-1">
                    <Link to={`/sellers/${sellerProfile.id}`} className="font-semibold text-sm text-ink hover:text-gold transition-colors">
                      {sellerProfile.shopName}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <TrustBadge badge={sellerProfile.trustBadge} />
                      {sellerProfile.averageRating > 0 && (
                        <StarRating rating={sellerProfile.averageRating} count={sellerProfile.trustScore?.totalReviews} size={12} />
                      )}
                    </div>
                  </div>
                </div>
                <CommitmentBox commitment={sellerProfile.commitment} sellerName={sellerProfile.shopName} />
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews?.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="font-display text-display-sm font-semibold text-ink mb-8">Reviews ({product._count?.reviews})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reviews.map(r => (
                <div key={r.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-ink/5 rounded-full flex items-center justify-center text-sm font-semibold">
                        {r.author?.name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{r.author?.name}</p>
                        <p className="text-xs text-muted">{timeAgo(r.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`text-xs ${s <= r.rating ? 'text-gold' : 'text-border'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  {r.title && <p className="font-medium text-sm mb-1">{r.title}</p>}
                  <p className="text-sm text-muted leading-relaxed">{r.body}</p>
                  {r.isVerified && <p className="text-[10px] text-gold font-medium mt-3">✓ Verified purchase</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
