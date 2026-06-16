import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../../store'
import { CommitmentBox, EmptyState, PageHeader } from '../../components/ui'
import { formatNPRLatin, savings } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeFromCart, total } = useCartStore()
  const navigate = useNavigate()

  const handleRemove = async (productId) => {
    await removeFromCart(productId)
    toast.success('Item removed')
  }

  if (items.length === 0) return (
    <div className="min-h-screen pt-24">
      <EmptyState
        icon="🛍️"
        title="Your cart is empty"
        subtitle="Browse our collection and find something you love."
        action={<Link to="/products" className="btn-primary">Browse Products</Link>}
      />
    </div>
  )

  const cartTotal = total()
  const originalTotal = items.reduce((sum, i) => sum + (i.product?.originalPrice || 0), 0)
  const totalSavings = originalTotal - cartTotal

  return (
    <div className="min-h-screen">
      <PageHeader title="Your Cart" subtitle={`${items.length} item${items.length !== 1 ? 's' : ''}`} />

      <div className="container-page py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const p = item.product
              if (!p) return null
              const pct = savings(p.originalPrice, p.sellingPrice)
              return (
                <div key={item.id} className="card p-5 flex gap-4">
                  <Link to={`/products/${p.id}`} className="w-24 h-24 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    <img src={p.imageUrls?.[0]} alt={p.title} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${p.id}`} className="font-medium text-sm text-ink hover:text-gold transition-colors line-clamp-2">
                      {p.title}
                    </Link>
                    <p className="text-xs text-muted mt-0.5">{p.sellerProfile?.shopName}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-display font-semibold text-ink">{formatNPRLatin(p.sellingPrice)}</span>
                      <span className="text-xs text-muted line-through">{formatNPRLatin(p.originalPrice)}</span>
                      {pct >= 5 && <span className="text-xs text-gold font-medium">-{pct}%</span>}
                    </div>
                    {p.sellerProfile?.trustBadge && (
                      <div className="mt-2">
                        <CommitmentBox
                          commitment={{ agreedToTerms: true }}
                          sellerName={p.sellerProfile.shopName}
                        />
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleRemove(p.id)} className="text-muted hover:text-red-500 transition-colors p-1 h-fit">
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-semibold text-ink mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal ({items.length} items)</span>
                  <span>{formatNPRLatin(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-gold font-medium">
                    <span>You save</span>
                    <span>{formatNPRLatin(totalSavings)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-border pt-4 mb-5">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="font-display text-lg">{formatNPRLatin(cartTotal)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <Link to="/products" className="btn-ghost w-full text-center text-sm mt-2 block">
                Continue Shopping
              </Link>
              {/* eSewa badge */}
              <div className="flex items-center justify-center gap-2 mt-5 text-xs text-muted">
                <div className="w-6 h-6 bg-[#60BB46] rounded flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">e</span>
                </div>
                Secured by eSewa Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
