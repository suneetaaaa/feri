// LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../store'
import toast from 'react-hot-toast'

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(user.role === 'ADMIN' ? '/admin' : user.role === 'SELLER' ? '/seller/dashboard' : from)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return <AuthLayout title="Welcome back" subtitle="Sign in to your FERI account">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
        <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
          placeholder="you@example.com" className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
        <div className="relative">
          <input type={showPw ? 'text' : 'password'} required value={form.password}
            onChange={e => setForm(f => ({...f, password: e.target.value}))}
            placeholder="••••••••" className="input-field pr-11" />
          <button type="button" onClick={() => setShowPw(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
    <div className="mt-6 text-center">
      <p className="text-sm text-muted">
        Don't have an account?{' '}
        <Link to="/register" className="text-ink font-semibold hover:text-gold transition-colors">Join FERI</Link>
      </p>
    </div>
    {/* Demo credentials */}
    <div className="mt-6 p-4 bg-parchment rounded-xl border border-border">
      <p className="text-xs font-semibold text-muted mb-2">Demo Accounts</p>
      {[
        { label: 'Buyer', email: 'buyer@example.com' },
        { label: 'Seller', email: 'priya@example.com' },
        { label: 'Admin', email: 'admin@feri.com.np' },
      ].map(d => (
        <button key={d.email} onClick={() => setForm({ email: d.email, password: d.label === 'Admin' ? 'Admin@1234' : 'Test@1234' })}
          className="text-xs text-gold hover:underline mr-4">{d.label}</button>
      ))}
    </div>
  </AuthLayout>
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'BUYER', phone: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const user = await register(form)
      toast.success(`Welcome to FERI, ${user.name.split(' ')[0]}!`)
      navigate(form.role === 'SELLER' ? '/sell/onboard' : '/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return <AuthLayout title="Join FERI" subtitle="Create your account and start shopping or selling">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Full Name</label>
        <input type="text" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
          placeholder="Priya Shrestha" className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
        <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
          placeholder="you@example.com" className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Phone (optional)</label>
        <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
          placeholder="98XXXXXXXX" className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
        <input type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
          placeholder="Minimum 8 characters" className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-2">I want to...</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { role: 'BUYER', icon: '🛍️', title: 'Buy', subtitle: 'Shop pre-loved items' },
            { role: 'SELLER', icon: '🏪', title: 'Sell', subtitle: 'List my items' },
          ].map(opt => (
            <button key={opt.role} type="button" onClick={() => setForm(f => ({...f, role: opt.role}))}
              className={`p-4 rounded-xl border-2 text-left transition-all ${form.role === opt.role ? 'border-ink bg-ink/3' : 'border-border hover:border-ink/30'}`}>
              <span className="text-xl">{opt.icon}</span>
              <p className="font-semibold text-sm mt-1.5">{opt.title}</p>
              <p className="text-xs text-muted">{opt.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
    <div className="mt-6 text-center">
      <p className="text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-ink font-semibold hover:text-gold transition-colors">Sign in</Link>
      </p>
    </div>
  </AuthLayout>
}

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen flex">
    {/* Left panel */}
    <div className="hidden lg:flex lg:w-5/12 bg-ink relative overflow-hidden flex-col justify-between p-12">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full border-2 border-parchment/60 flex items-center justify-center">
          <span className="font-display text-xl font-semibold text-parchment leading-none" style={{ marginTop: '-1px' }}>F</span>
        </div>
        <span className="font-display text-xl tracking-[0.18em] text-parchment font-medium">FERI</span>
      </div>
      <div>
        <p className="font-display italic text-3xl text-parchment/80 mb-4">"Chalcha? Hoina,<br />Majjale Chalcha."</p>
        <p className="text-parchment/40 text-sm leading-relaxed">Nepal's trusted second-hand marketplace. Every item here has a story. Now it's yours to continue.</p>
      </div>
      <div className="space-y-3">
        {['Genuine seller commitments', 'Honest defect disclosures', 'eSewa payments'].map((t, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="text-gold text-xs">✓</span>
            <span className="text-parchment/60 text-sm">{t}</span>
          </div>
        ))}
      </div>
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-parchment/5" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full border border-parchment/5" />
    </div>

    {/* Right panel */}
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center">
            <span className="font-display text-lg font-semibold leading-none" style={{ marginTop: '-1px' }}>F</span>
          </div>
          <span className="font-display text-lg tracking-[0.18em] font-medium">FERI</span>
        </div>
        <h1 className="font-display text-display-sm font-semibold text-ink mb-1.5">{title}</h1>
        <p className="text-muted text-sm mb-8">{subtitle}</p>
        {children}
      </div>
    </div>
  </div>
)

export default LoginPage
