import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, ShieldCheck } from 'lucide-react'
import api from '../utils/api'
import { ProductCard, TrustBadge, StarRating, CommitmentBox, LoadingSpinner } from '../components/ui'
import { timeAgo } from '../utils/helpers'

export default function SellerProfilePage() {
  const { id } = useParams()
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/sellers/${id}`)
      .then(r => setSeller(r.data.seller))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>
  if (!seller) return <div className="pt-32 text-center text-muted">Seller not found</div>

  const { commitment, trustScore, products, user } = seller

  return (
    <div className="min-h-screen pt-16">
      {/* Cover */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-ink to-noir relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #F8F6F1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {seller.coverImageUrl && (
          <img src={seller.coverImageUrl} alt="" className="w-full h-full object-cover opacity-30" />
        )}
      </div>

      <div className="container-page">
        {/* Profile Header */}
        <div className="relative -mt-12 mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="w-24 h-24 bg-parchment border-4 border-white rounded-2xl flex items-center justify-center text-3xl font-display font-semibold shadow-card flex-shrink-0">
              {seller.avatarUrl
                ? <img src={seller.avatarUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                : seller.shopName?.[0]
              }
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="font-display text-display-sm font-semibold text-ink">{seller.shopName}</h1>
                <TrustBadge badge={seller.trustBadge} size="lg" />
                {seller.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-gold font-medium">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted flex-wrap">
                {seller.location && (
                  <span className="flex items-center gap-1"><MapPin size={11} /> {seller.location}</span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={11} /> Selling since {timeAgo(user?.createdAt)}
                </span>
                <span>{seller._count?.products} listings</span>
                <span>{seller.totalSales} sold</span>
              </div>
              {trustScore && (
                <div className="mt-2">
                  <StarRating rating={seller.averageRating} count={trustScore.totalReviews} />
                </div>
              )}
            </div>
          </div>
          {seller.bio && (
            <p className="mt-4 text-sm text-muted leading-relaxed max-w-2xl">{seller.bio}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Trust + Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Commitment Wall */}
            <div>
              <h2 className="font-display text-xl font-semibold text-ink mb-4">Commitment Wall</h2>
              <CommitmentBox commitment={commitment} sellerName={seller.shopName} />
              {!commitment?.isActive && (
                <div className="border border-border rounded-2xl p-4 text-center">
                  <p className="text-sm text-muted">This seller has not signed the commitment pledge.</p>
                </div>
              )}
            </div>

            {/* Trust Score Breakdown */}
            {trustScore && (
              <div className="card p-5">
                <h3 className="font-semibold text-sm text-ink mb-4">Trust Score</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Item Accuracy', value: trustScore.accuracyScore },
                    { label: 'Shipping Speed', value: trustScore.shippingScore },
                    { label: 'Communication', value: trustScore.communicationScore },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted">{s.label}</span>
                        <span className="text-xs font-semibold text-ink">{Number(s.value).toFixed(1)}</span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full transition-all duration-500"
                          style={{ width: `${(s.value / 5) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted mt-4 text-center">Based on {trustScore.totalReviews} verified reviews</p>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Items Sold', value: seller.totalSales },
                { label: 'Avg Rating', value: `${Number(seller.averageRating).toFixed(1)}★` },
              ].map(s => (
                <div key={s.label} className="card p-4 text-center">
                  <p className="font-display text-xl font-semibold text-ink">{s.value}</p>
                  <p className="text-xs text-muted mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Products */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-ink">
                Listings <span className="text-muted font-normal text-base">({products.length})</span>
              </h2>
            </div>
            {products.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-3xl mb-3">📦</p>
                <p className="text-muted">No active listings yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
