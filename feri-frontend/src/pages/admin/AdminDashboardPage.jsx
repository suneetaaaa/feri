import { useState, useEffect } from 'react'
import { Users, Package, ShieldAlert, TrendingUp, Check, X, Ban } from 'lucide-react'
import api from '../../utils/api'
import { LoadingSpinner } from '../../components/ui'
import { formatNPRLatin, timeAgo } from '../../utils/helpers'
import toast from 'react-hot-toast'

const TABS = [
  { key: 'overview', label: 'Overview', icon: TrendingUp },
  { key: 'products', label: 'Pending Products', icon: Package },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'disputes', label: 'Disputes', icon: ShieldAlert },
]

export default function AdminDashboardPage() {
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [pendingProducts, setPendingProducts] = useState([])
  const [users, setUsers] = useState([])
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, p, u, d] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/products/pending'),
          api.get('/admin/users'),
          api.get('/admin/disputes'),
        ])
        setStats(s.data)
        setPendingProducts(p.data.products)
        setUsers(u.data.users)
        setDisputes(d.data.disputes)
      } catch { toast.error('Could not load admin data') }
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  const approveProduct = async (id) => {
    await api.patch(`/admin/products/${id}/approve`)
    setPendingProducts(prev => prev.filter(p => p.id !== id))
    toast.success('Product approved')
  }

  const rejectProduct = async (id) => {
    await api.patch(`/admin/products/${id}/reject`, { reason: 'Does not meet FERI guidelines' })
    setPendingProducts(prev => prev.filter(p => p.id !== id))
    toast.success('Product rejected')
  }

  const banUser = async (id) => {
    if (!confirm('Ban this user?')) return
    await api.patch(`/admin/users/${id}/ban`, { reason: 'Policy violation' })
    setUsers(prev => prev.map(u => u.id === id ? {...u, isBanned: true} : u))
    toast.success('User banned')
  }

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>

  const productStats = stats?.products || []
  const approvedCount = productStats.find(p => p.status === 'APPROVED')?._count || 0
  const pendingCount = productStats.find(p => p.status === 'PENDING')?._count || 0

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-page">
        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-1">Platform Management</p>
          <h1 className="font-display text-display-md font-semibold text-ink">Admin Panel</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 mb-8 w-fit overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? 'bg-ink text-parchment' : 'text-muted hover:text-ink'}`}>
              <t.icon size={14} /> {t.label}
              {t.key === 'products' && pendingProducts.length > 0 && (
                <span className="bg-gold text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingProducts.length}
                </span>
              )}
              {t.key === 'disputes' && disputes.filter(d => d.status === 'OPEN').length > 0 && (
                <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {disputes.filter(d => d.status === 'OPEN').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { icon: '👥', label: 'Total Users', value: stats?.users?.toLocaleString() || 0 },
                { icon: '✅', label: 'Live Products', value: approvedCount },
                { icon: '⏳', label: 'Pending Review', value: pendingCount },
                { icon: '⚠️', label: 'Open Disputes', value: stats?.disputes || 0 },
              ].map(s => (
                <div key={s.label} className="card p-6">
                  <span className="text-2xl">{s.icon}</span>
                  <p className="font-display text-2xl font-semibold text-ink mt-3">{s.value}</p>
                  <p className="text-xs text-muted mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="card p-6">
              <h2 className="font-semibold text-ink mb-2">Platform Status</h2>
              <p className="text-sm text-muted">All systems operational. {pendingProducts.length} product{pendingProducts.length !== 1 ? 's' : ''} awaiting moderation.</p>
              {pendingProducts.length > 0 && (
                <button onClick={() => setTab('products')} className="btn-gold mt-4 text-sm py-2 px-4">
                  Review {pendingProducts.length} pending product{pendingProducts.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pending Products */}
        {tab === 'products' && (
          <div>
            {pendingProducts.length === 0 ? (
              <div className="card p-16 text-center">
                <p className="text-4xl mb-4">✅</p>
                <p className="font-display text-xl font-semibold">All caught up!</p>
                <p className="text-muted text-sm mt-2">No products pending review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProducts.map(p => (
                  <div key={p.id} className="card p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                        <img src={p.imageUrls?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink">{p.title}</p>
                        <p className="text-xs text-muted mt-0.5">by {p.sellerProfile?.shopName} · {p.category?.name}</p>
                        <p className="text-xs text-muted mt-1 line-clamp-2">{p.description}</p>
                        <div className="mt-2 p-2 bg-amber-50 rounded-lg">
                          <p className="text-xs font-medium text-amber-800">Defect disclosure:</p>
                          <p className="text-xs text-amber-700">{p.defectDisclosure}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button onClick={() => approveProduct(p.id)}
                          className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors">
                          <Check size={13} /> Approve
                        </button>
                        <button onClick={() => rejectProduct(p.id)}
                          className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl hover:bg-red-600 transition-colors">
                          <X size={13} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className={`card p-5 flex items-center gap-4 ${u.isBanned ? 'opacity-60' : ''}`}>
                <div className="w-10 h-10 bg-ink/5 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {u.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-ink">{u.name}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${u.role === 'SELLER' ? 'bg-blue-50 text-blue-700 border-blue-200' : u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {u.role}
                    </span>
                    {u.isBanned && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Banned</span>}
                    {u.sellerProfile?.shopName && (
                      <span className="text-xs text-muted">{u.sellerProfile.shopName}</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted flex-shrink-0">{timeAgo(u.createdAt)}</div>
                {!u.isBanned && u.role !== 'ADMIN' && (
                  <button onClick={() => banUser(u.id)}
                    className="flex items-center gap-1.5 text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0">
                    <Ban size={12} /> Ban
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Disputes */}
        {tab === 'disputes' && (
          <div>
            {disputes.length === 0 ? (
              <div className="card p-16 text-center">
                <p className="text-4xl mb-4">⚖️</p>
                <p className="font-display text-xl font-semibold">No disputes</p>
                <p className="text-muted text-sm mt-2">All good on the platform.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {disputes.map(d => (
                  <div key={d.id} className="card p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-medium text-sm">Dispute by {d.buyer?.name}</p>
                        <p className="text-xs text-muted">{d.buyer?.email} · {timeAgo(d.createdAt)}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${d.status === 'OPEN' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                        {d.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted bg-parchment rounded-lg p-3">{d.reason}</p>
                    {d.status === 'OPEN' && (
                      <button onClick={async () => {
                        await api.patch(`/admin/disputes/${d.id}/resolve`, { resolution: 'Resolved by FERI admin.' })
                        setDisputes(prev => prev.map(x => x.id === d.id ? {...x, status: 'RESOLVED'} : x))
                        toast.success('Dispute resolved')
                      }} className="mt-3 text-xs btn-primary py-2 px-4">
                        Mark Resolved
                      </button>
                    )}
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
