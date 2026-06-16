import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Package, ShoppingBag, Star, TrendingUp, Eye, Edit, Archive, ShieldCheck } from 'lucide-react'
import api from '../../utils/api'
import { useAuthStore } from '../../store'
import { TrustBadge, StarRating, LoadingSpinner } from '../../components/ui'
import { formatNPRLatin, conditionLabel, conditionColor, orderStatusSteps } from '../../utils/helpers'
import toast from 'react-hot-toast'

const StatCard = ({ icon, label, value, sub }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      {sub && <span className="text-xs text-muted bg-parchment px-2 py-0.5 rounded-full">{sub}</span>}
    </div>
    <p className="font-display text-2xl font-semibold text-ink">{value}</p>
    <p className="text-xs text-muted mt-0.5">{label}</p>
  </div>
)

export default function SellerDashboardPage() {
  const { user } = useAuthStore()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('listings')

  useEffect(() => {
    api.get('/sellers/me/dashboard')
      .then(r => setData(r.data))
      .catch(() => toast.error('Could not load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>
  if (!data) return null

  const { products, orders, profile, revenue } = data
  const approved = products.filter(p => p.status === 'APPROVED').length
  const pending = products.filter(p => p.status === 'PENDING').length
  const sold = products.filter(p => p.status === 'SOLD').length

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-page">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="section-label mb-1">Seller Dashboard</p>
            <h1 className="font-display text-display-md font-semibold text-ink">{profile?.shopName}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <TrustBadge badge={profile?.trustBadge} size="lg" />
              {profile?.averageRating > 0 && (
                <StarRating rating={profile.averageRating} count={profile.trustScore?.totalReviews} />
              )}
              {profile?.commitment?.isActive && (
                <span className="flex items-center gap-1 text-xs text-gold font-medium">
                  <ShieldCheck size={12} /> Pledge Active
                </span>
              )}
            </div>
          </div>
          <Link to="/seller/products/new" className="btn-primary flex items-center gap-2">
            <Plus size={16} /> List New Item
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon="📦" label="Total Listings" value={products.length} />
          <StatCard icon="✅" label="Live Listings" value={approved} sub={`${pending} pending`} />
          <StatCard icon="🛍️" label="Items Sold" value={sold} />
          <StatCard icon="💰" label="Total Revenue" value={formatNPRLatin(revenue)} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 mb-6 w-fit">
          {[
            { key: 'listings', label: 'My Listings', icon: Package },
            { key: 'orders', label: 'Orders', icon: ShoppingBag },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === t.key ? 'bg-ink text-parchment' : 'text-muted hover:text-ink'}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            {products.length === 0 ? (
              <div className="card p-16 text-center">
                <p className="text-4xl mb-4">📸</p>
                <p className="font-display text-xl font-semibold mb-2">No listings yet</p>
                <p className="text-muted text-sm mb-6">List your first item and start selling on FERI.</p>
                <Link to="/seller/products/new" className="btn-primary inline-flex items-center gap-2">
                  <Plus size={16} /> List Your First Item
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map(p => (
                  <div key={p.id} className="card p-5 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                      <img src={p.imageUrls?.[0] || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-ink truncate">{p.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`condition-badge text-[10px] ${conditionColor[p.condition]}`}>{conditionLabel[p.condition]}</span>
                        <StatusBadge status={p.status} />
                        <span className="text-xs text-muted">{p._count.reviews} reviews</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display font-semibold text-ink">{formatNPRLatin(p.sellingPrice)}</p>
                      <p className="text-xs text-muted line-through">{formatNPRLatin(p.originalPrice)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link to={`/products/${p.id}`}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-parchment transition-colors">
                        <Eye size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="card p-16 text-center">
                <p className="text-4xl mb-4">📬</p>
                <p className="font-display text-xl font-semibold mb-2">No orders yet</p>
                <p className="text-muted text-sm">Orders will appear here once buyers purchase your listings.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(item => (
                  <div key={item.id} className="card p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                      <img src={item.product?.imageUrls?.[0] || ''} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product?.title}</p>
                      <p className="text-xs text-muted mt-0.5">by {item.order?.buyer?.name}</p>
                      <p className="text-xs text-muted">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display font-semibold">{formatNPRLatin(item.price)}</p>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const StatusBadge = ({ status }) => {
  const config = {
    PENDING:          'bg-amber-50 text-amber-700 border-amber-200',
    APPROVED:         'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED:         'bg-red-50 text-red-700 border-red-200',
    SOLD:             'bg-blue-50 text-blue-700 border-blue-200',
    PLACED:           'bg-amber-50 text-amber-700 border-amber-200',
    PACKED:           'bg-blue-50 text-blue-700 border-blue-200',
    SHIPPED:          'bg-purple-50 text-purple-700 border-purple-200',
    OUT_FOR_DELIVERY: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    DELIVERED:        'bg-emerald-50 text-emerald-700 border-emerald-200',
    ARCHIVED:         'bg-gray-100 text-gray-500 border-gray-200',
  }
  const label = status?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${config[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {label}
    </span>
  )
}
