// OrderSuccessPage.jsx
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Package } from 'lucide-react'
import api from '../../utils/api'
import { formatNPRLatin, orderStatusSteps } from '../../utils/helpers'

export function OrderSuccessPage() {
  const [params] = useSearchParams()
  const [order, setOrder] = useState(null)
  const orderId = params.get('orderId')

  useEffect(() => {
    if (orderId) api.get(`/orders/${orderId}`).then(r => setOrder(r.data.order)).catch(() => {})
  }, [orderId])

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="container-page max-w-lg mx-auto text-center">
        <div className="card p-10">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h1 className="font-display text-display-sm font-semibold text-ink mb-2">Order Confirmed!</h1>
          <p className="text-muted mb-6">
            Your payment was successful. Your order is being prepared.
          </p>

          {order && (
            <div className="bg-parchment rounded-2xl p-5 mb-8 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted font-medium">Order ID</span>
                <span className="text-xs font-mono font-semibold text-ink">{order.trackingCode}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted font-medium">Total Paid</span>
                <span className="font-display font-semibold text-ink">{formatNPRLatin(order.totalAmount)}</span>
              </div>
              {/* Mini tracking */}
              <div className="flex items-center justify-between">
                {orderStatusSteps.map((s, i) => (
                  <div key={s.key} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors
                      ${order.status === s.key || i === 0 ? 'bg-ink text-parchment' : 'bg-border text-muted'}`}>
                      {s.icon}
                    </div>
                    <span className="text-[9px] text-muted text-center hidden sm:block">{s.label}</span>
                    {i < orderStatusSteps.length - 1 && (
                      <div className="absolute" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/orders/${orderId}`} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5">
              <Package size={16} /> Track Order
            </Link>
            <Link to="/products" className="btn-secondary flex-1 py-3.5">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// OrderHistoryPage.jsx
export function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data.orders)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="pt-32 text-center"><div className="w-6 h-6 border-2 border-t-ink rounded-full animate-spin mx-auto" /></div>

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-page max-w-3xl mx-auto">
        <h1 className="font-display text-display-sm font-semibold text-ink mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-4xl mb-4">📦</p>
            <p className="font-display text-xl font-semibold mb-2">No orders yet</p>
            <p className="text-muted text-sm mb-6">Your order history will appear here.</p>
            <Link to="/products" className="btn-primary inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order.id} to={`/orders/${order.id}`} className="card p-5 block hover:shadow-card-hover transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-mono text-xs font-semibold text-ink">{order.trackingCode}</span>
                    <p className="text-xs text-muted mt-0.5">{new Date(order.placedAt).toLocaleDateString('en-NP', { dateStyle: 'medium' })}</p>
                  </div>
                  <OrderStatusChip status={order.status} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {order.items?.slice(0, 3).map(item => (
                    <div key={item.id} className="w-12 h-12 rounded-lg overflow-hidden bg-cream">
                      <img src={item.product?.imageUrls?.[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="w-12 h-12 rounded-lg bg-parchment border border-border flex items-center justify-center text-xs text-muted">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                  <span className="font-display font-semibold text-ink">{formatNPRLatin(order.totalAmount)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// OrderDetailPage.jsx — full tracking view
export function OrderDetailPage() {
  const { id } = require('react-router-dom').useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.order)).catch(() => {})
  }, [id])

  if (!order) return <div className="pt-32 text-center"><div className="w-6 h-6 border-2 border-t-ink rounded-full animate-spin mx-auto" /></div>

  const currentStepIdx = orderStatusSteps.findIndex(s => s.key === order.status)

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-page max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-display-sm font-semibold text-ink">Order Details</h1>
            <p className="font-mono text-sm text-muted mt-0.5">{order.trackingCode}</p>
          </div>
          <OrderStatusChip status={order.status} large />
        </div>

        {/* Tracking Timeline */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-sm text-ink mb-6">Delivery Tracking</h2>
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-border">
              <div className="h-full bg-ink transition-all duration-700"
                style={{ width: `${currentStepIdx >= 0 ? (currentStepIdx / (orderStatusSteps.length - 1)) * 100 : 0}%` }} />
            </div>
            <div className="flex items-start justify-between relative z-10">
              {orderStatusSteps.map((s, i) => {
                const done = i <= currentStepIdx
                const active = i === currentStepIdx
                return (
                  <div key={s.key} className="flex flex-col items-center gap-2 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all
                      ${done ? 'bg-ink border-ink' : 'bg-white border-border'}`}>
                      {done ? <span className="text-parchment text-sm">✓</span> : <span>{s.icon}</span>}
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] font-medium ${active ? 'text-ink' : done ? 'text-muted' : 'text-border'}`}>
                        {s.label}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-sm text-ink mb-4">Items in this order</h2>
          <div className="space-y-4">
            {order.items?.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <Link to={`/products/${item.productId}`} className="w-16 h-16 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                  <img src={item.product?.imageUrls?.[0]} alt="" className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.productId}`} className="font-medium text-sm text-ink hover:text-gold transition-colors line-clamp-1">
                    {item.product?.title}
                  </Link>
                  <p className="text-xs text-muted mt-0.5">Sold by {item.sellerProfile?.shopName}</p>
                  {item.sellerProfile?.commitment && (
                    <p className="text-xs text-gold font-medium mt-1">✓ Commitment Pledge</p>
                  )}
                </div>
                <span className="font-display font-semibold flex-shrink-0">{formatNPRLatin(item.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6">
          <h2 className="font-semibold text-sm text-ink mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatNPRLatin(order.totalAmount)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="text-emerald-600">Free</span></div>
            <div className="flex justify-between"><span className="text-muted">Payment</span><span className="text-emerald-600">eSewa — Paid</span></div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span>Total</span><span className="font-display">{formatNPRLatin(order.totalAmount)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border text-xs text-muted">
            <p>Shipping to: {order.shippingAddress}, {order.shippingCity}</p>
            {order.esewaRefId && <p className="mt-1">eSewa Ref: {order.esewaRefId}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

const OrderStatusChip = ({ status, large }) => {
  const config = {
    PLACED:           { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Order Placed' },
    PACKED:           { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Packed' },
    SHIPPED:          { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Shipped' },
    OUT_FOR_DELIVERY: { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Out for Delivery' },
    DELIVERED:        { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Delivered' },
    CANCELLED:        { color: 'bg-red-50 text-red-700 border-red-200', label: 'Cancelled' },
  }
  const c = config[status] || { color: 'bg-gray-100 text-gray-600 border-gray-200', label: status }
  return (
    <span className={`inline-flex items-center border rounded-full font-medium ${large ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs'} ${c.color}`}>
      {c.label}
    </span>
  )
}

export default OrderHistoryPage
