import { useState } from 'react'
import { Mail, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1500))
    setSending(false)
    setSent(true)
    toast.success('Message sent! We will get back to you within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen pt-16">
      <section className="py-20 bg-ink text-parchment text-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="section-label text-parchment/40 mb-3">Get in Touch</p>
          <h1 className="font-display text-display-md font-semibold">Contact Us</h1>
          <p className="text-parchment/50 mt-3">We would love to hear from you.</p>
        </div>
      </section>
      <div className="container-page max-w-5xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-6">
            <div>
              <p className="section-label mb-4">Contact Information</p>
              <div className="space-y-5">
                {[
                  { icon: <Mail size={18} className="text-gold" />, label: 'Email', value: 'hello@feri.com.np', sub: 'We reply within 24 hours' },
                  { icon: <MapPin size={18} className="text-gold" />, label: 'Location', value: 'Kathmandu, Nepal', sub: 'Serving all of Nepal' },
                  { icon: <Clock size={18} className="text-gold" />, label: 'Support Hours', value: 'Sun - Fri, 9am - 6pm', sub: 'Nepal Standard Time' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-xs text-muted font-medium">{item.label}</p>
                      <p className="font-medium text-sm text-ink">{item.value}</p>
                      <p className="text-xs text-muted">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-parchment rounded-2xl p-5 border border-border">
              <p className="font-semibold text-sm text-ink mb-2">For Sellers</p>
              <p className="text-xs text-muted leading-relaxed">Need help with your listings or account? Email seller@feri.com.np</p>
            </div>
            <div className="bg-parchment rounded-2xl p-5 border border-border">
              <p className="font-semibold text-sm text-ink mb-2">Report an Issue</p>
              <p className="text-xs text-muted leading-relaxed">Found a problem? Email trust@feri.com.np — we respond within 12 hours.</p>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="card p-8">
              <h2 className="font-display text-xl font-semibold text-ink mb-6">Send us a message</h2>
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">✓</span></div>
                  <p className="font-display text-xl font-semibold text-ink mb-2">Message Sent!</p>
                  <p className="text-muted text-sm">We will get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-ghost mt-4 text-sm">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Your Name</label>
                      <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Priya Shrestha" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email Address</label>
                      <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@example.com" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subject</label>
                    <select value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} required className="input-field">
                      <option value="">Select a topic</option>
                      <option>General Enquiry</option>
                      <option>Seller Support</option>
                      <option>Buyer Support</option>
                      <option>Report a Problem</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="Tell us how we can help..." className="input-field resize-none" />
                  </div>
                  <button type="submit" disabled={sending} className="btn-primary w-full py-3.5">{sending ? 'Sending...' : 'Send Message'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
