import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ShieldCheck, Store, FileText } from 'lucide-react'
import api from '../../utils/api'
import { useAuthStore } from '../../store'
import toast from 'react-hot-toast'

const STEPS = [
  { number: 1, title: 'Shop Details', icon: Store },
  { number: 2, title: 'Commitment Pledge', icon: FileText },
  { number: 3, title: 'You\'re Live!', icon: Check },
]

const PLEDGE_CLAUSES = [
  { id: 'photos', text: 'I will upload genuine, unfiltered photos that accurately represent each item.' },
  { id: 'honest', text: 'I will describe every product honestly — including flaws, wear, and imperfections.' },
  { id: 'defects', text: 'I will disclose all known defects before a buyer commits to purchase.' },
  { id: 'ship', text: 'I will ship within the agreed timeframe after payment confirmation.' },
  { id: 'respect', text: 'I will communicate respectfully and promptly with every buyer.' },
  { id: 'accurate', text: 'I will never misrepresent item condition, size, brand, or origin.' },
  { id: 'honour', text: 'I will honour every sale and not cancel without valid reason.' },
]

export default function SellerOnboardPage() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState({ shopName: '', bio: '', location: '' })
  const [checkedClauses, setCheckedClauses] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { refreshUser } = useAuthStore()
  const navigate = useNavigate()

  const allChecked = PLEDGE_CLAUSES.every(c => checkedClauses[c.id])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!profile.shopName.trim()) { toast.error('Shop name required'); return }
    setSubmitting(true)
    try {
      await api.post('/sellers/onboard', profile)
      await refreshUser()
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create profile')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCommitment = async () => {
    if (!allChecked) { toast.error('Please accept all pledge clauses'); return }
    setSubmitting(true)
    try {
      await api.post('/sellers/commitment', { agreedToTerms: true })
      await refreshUser()
      setStep(3)
    } catch (err) {
      toast.error('Failed to save commitment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-page max-w-2xl mx-auto">
        {/* Steps indicator */}
        <div className="flex items-center justify-center mb-12">
          {STEPS.map((s, i) => (
            <div key={s.number} className="flex items-center">
              <div className={`flex flex-col items-center gap-1 ${step === s.number ? 'opacity-100' : step > s.number ? 'opacity-70' : 'opacity-30'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step > s.number ? 'bg-ink border-ink text-parchment' : step === s.number ? 'border-ink text-ink' : 'border-border text-muted'}`}>
                  {step > s.number ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <span className="text-xs text-center font-medium hidden sm:block">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 md:w-24 h-px mx-3 transition-colors ${step > s.number ? 'bg-ink' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Shop Details */}
        {step === 1 && (
          <div className="card p-8 animate-fade-up">
            <div className="mb-8">
              <h1 className="font-display text-display-sm font-semibold text-ink">Set up your shop</h1>
              <p className="text-muted text-sm mt-1">Tell buyers a bit about who you are and what you sell.</p>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Shop Name <span className="text-red-500">*</span></label>
                <input required value={profile.shopName} onChange={e => setProfile(f => ({...f, shopName: e.target.value}))}
                  placeholder="e.g. Priya's Closet" className="input-field" />
                <p className="text-xs text-muted mt-1">This appears publicly on your profile and all listings.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Short Bio</label>
                <textarea rows={3} value={profile.bio} onChange={e => setProfile(f => ({...f, bio: e.target.value}))}
                  placeholder="Tell buyers about your style, what you sell, and why you love FERI..."
                  className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Location</label>
                <input value={profile.location} onChange={e => setProfile(f => ({...f, location: e.target.value}))}
                  placeholder="e.g. Patan, Lalitpur" className="input-field" />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
                {submitting ? 'Creating shop...' : 'Continue to Commitment Pledge →'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2 — Commitment Pledge */}
        {step === 2 && (
          <div className="card p-8 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                <ShieldCheck size={22} className="text-gold" />
              </div>
              <div>
                <h1 className="font-display text-display-sm font-semibold text-ink">The Seller Pledge</h1>
                <p className="text-muted text-sm">This commitment appears publicly on your profile and every listing.</p>
              </div>
            </div>

            <div className="bg-gold/5 border border-gold/20 rounded-xl p-5 mb-6">
              <p className="text-sm text-ink/70 leading-relaxed italic">
                FERI is built on trust. Buyers come here because they believe in the Seller Pledge system. By checking each clause below, you are making a public, binding commitment to your buyers.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {PLEDGE_CLAUSES.map(clause => (
                <label key={clause.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${checkedClauses[clause.id] ? 'border-gold/40 bg-gold/5' : 'border-border hover:border-border'}`}>
                  <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 mt-0.5 transition-all ${checkedClauses[clause.id] ? 'bg-gold border-gold' : 'border-border'}`}>
                    {checkedClauses[clause.id] && <Check size={11} className="text-white" />}
                  </div>
                  <input type="checkbox" className="sr-only" checked={!!checkedClauses[clause.id]}
                    onChange={e => setCheckedClauses(c => ({...c, [clause.id]: e.target.checked}))} />
                  <span className="text-sm text-ink/80 leading-relaxed">{clause.text}</span>
                </label>
              ))}
            </div>

            <div className={`p-4 rounded-xl mb-6 transition-all ${allChecked ? 'bg-gold/10 border border-gold/30' : 'bg-parchment border border-border'}`}>
              <p className="text-sm text-center font-medium text-ink/70">
                {allChecked
                  ? '✓ All clauses accepted. Your commitment will be displayed publicly.'
                  : `${Object.values(checkedClauses).filter(Boolean).length} of ${PLEDGE_CLAUSES.length} clauses accepted`
                }
              </p>
            </div>

            <button onClick={handleCommitment} disabled={!allChecked || submitting} className="btn-gold w-full py-3.5">
              {submitting ? 'Signing pledge...' : 'Sign Pledge & Start Selling'}
            </button>
          </div>
        )}

        {/* Step 3 — Success */}
        {step === 3 && (
          <div className="card p-10 text-center animate-fade-up">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={36} className="text-gold" />
            </div>
            <h1 className="font-display text-display-sm font-semibold text-ink mb-3">You're all set!</h1>
            <p className="text-muted mb-2 text-base">Your shop is live on FERI.</p>
            <p className="text-sm text-muted mb-8 max-w-sm mx-auto leading-relaxed">
              Your Commitment Pledge is now public. Buyers can see it on your profile and every listing.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/seller/products/new')} className="btn-gold px-8 py-3.5">
                List Your First Item
              </button>
              <button onClick={() => navigate('/seller/dashboard')} className="btn-secondary px-8 py-3.5">
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
