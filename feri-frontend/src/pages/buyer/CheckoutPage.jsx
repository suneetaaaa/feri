import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Smartphone } from 'lucide-react'
import api from '../../utils/api'
import { useCartStore } from '../../store'
import { formatNPRLatin } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ESEWA_GREEN = '#60BB46'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const navigate = useNavigate()
  const [address, setAddress] = useState({ street: '', city: '', phone: '' })
  const [step, setStep] = useState('details') // details | payment | processing
  const [orderId, setOrderId] = useState(null)
  const [loading, setLoading] = useState(false)

  const cartTotal = total()

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!address.street || !address.city) { toast.error('Shipping address required'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({ productId: i.productId })),
        shippingAddress: address.street,
        shippingCity: address.city,
        paymentMethod: 'esewa'
      })
      setOrderId(data.order.id)
      setStep('payment')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not place order')
    } finally {
      setLoading(false)
    }
  }

  const handleEsewaSimulate = async () => {
    setStep('processing')
    setLoading(true)
    try {
      // Simulate eSewa processing delay
      await new Promise(r => setTimeout(r, 2500))
      await api.post('/payment/simulate', { orderId })
      clearCart()
      navigate(`/payment/success?orderId=${orderId}`)
    } catch (err) {
      toast.error('Payment simulation failed')
      setStep('payment')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) { navigate('/cart'); return null }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-parchment">
      <div className="container-page max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-display-md font-semibold text-ink">Checkout</h1>
          <p className="text-muted text-sm mt-1">{items.length} item{items.length !== 1 ? 's' : ''} · {formatNPRLatin(cartTotal)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left */}
          <div className="md:col-span-2">
            {/* Step: Shipping */}
            {step === 'details' && (
              <form onSubmit={handlePlaceOrder} className="card p-7 space-y-5">
                <h2 className="font-semibold text-ink">Delivery Address</h2>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Street Address</label>
                  <input required value={address.street} onChange={e => setAddress(a => ({...a, street: e.target.value}))}
                    placeholder="Eg. Baneshwor, Ward 10" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">City</label>
                    <input required value={address.city} onChange={e => setAddress(a => ({...a, city: e.target.value}))}
                      placeholder="Kathmandu" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone</label>
                    <input value={address.phone} onChange={e => setAddress(a => ({...a, phone: e.target.value}))}
                      placeholder="98XXXXXXXX" className="input-field" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                  {loading ? 'Placing order...' : 'Continue to Payment →'}
                </button>
              </form>
            )}

            {/* Step: eSewa Payment */}
            {step === 'payment' && (
              <div className="card p-7 space-y-6">
                <h2 className="font-semibold text-ink">Pay with eSewa</h2>

                {/* eSewa branded box */}
                <div className="border-2 rounded-2xl overflow-hidden" style={{ borderColor: ESEWA_GREEN }}>
                  <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: `${ESEWA_GREEN}15` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: ESEWA_GREEN }}>
                      e
                    </div>
                    <div>
                      <p className="font-semibold text-ink">eSewa Digital Wallet</p>
                      <p className="text-xs text-muted">Nepal's leading digital payment service</p>
                    </div>
                  </div>
                  <div className="px-6 py-5 bg-white">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-sm text-muted">Amount to Pay</span>
                      <span className="font-display text-2xl font-semibold text-ink">{formatNPRLatin(cartTotal)}</span>
                    </div>
                    <div className="bg-parchment rounded-xl p-4 mb-5 flex items-center gap-3">
                      <Smartphone size={18} className="text-muted" />
                      <div>
                        <p className="text-xs font-medium text-ink">Demo Mode — Instant Approval</p>
                        <p className="text-xs text-muted">Click below to simulate a successful eSewa payment.</p>
                      </div>
                    </div>
                    <button onClick={handleEsewaSimulate} disabled={loading}
                      className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ backgroundColor: ESEWA_GREEN }}>
                      Pay {formatNPRLatin(cartTotal)} via eSewa
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-center text-xs text-muted">
                  <ShieldCheck size={13} /> Secured and encrypted payment
                </div>
              </div>
            )}

            {/* Step: Processing */}
            {step === 'processing' && (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: `${ESEWA_GREEN}20` }}>
                  <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: ESEWA_GREEN }} />
                </div>
                <h2 className="font-display text-xl font-semibold text-ink mb-2">Processing payment...</h2>
                <p className="text-sm text-muted">Confirming with eSewa. Please don't close this window.</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="card p-5 sticky top-24">
              <h3 className="font-semibold text-sm text-ink mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map(item => {
                  const p = item.product
                  return p ? (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                        <img src={p.imageUrls?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-ink flex-1 line-clamp-2">{p.title}</p>
                      <p className="text-xs font-semibold flex-shrink-0">{formatNPRLatin(p.sellingPrice)}</p>
                    </div>
                  ) : null
                })}
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold text-sm">
                  <span>Total</span>
                  <span className="font-display">{formatNPRLatin(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
