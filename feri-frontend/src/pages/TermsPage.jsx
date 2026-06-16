export default function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', body: 'By creating an account on FERI, you agree to these Terms.' },
    { title: '2. The FERI Platform', body: 'FERI is a C2C marketplace for second-hand clothes and novels in Nepal.' },
    { title: '3. User Accounts', body: 'You must be at least 16 years old. You are responsible for all activity under your account.' },
    { title: '4. Seller Obligations', body: 'All sellers must sign the Commitment Pledge: genuine photos, honest descriptions, disclosing defects, shipping on time, respectful communication.' },
    { title: '5. Prohibited Items', body: 'No stolen goods, counterfeits, items prohibited by Nepali law, or fraudulently described items.' },
    { title: '6. Fees', body: 'FERI charges 20% commission on each successful sale. Payments via eSewa in NPR.' },
    { title: '7. Buyer Protections', body: 'Raise a dispute within 48 hours of delivery if item differs from description. FERI will review and may facilitate refunds.' },
    { title: '8. Liability', body: 'FERI maximum liability is limited to the transaction value in question.' },
    { title: '9. Governing Law', body: 'These Terms are governed by the laws of Nepal, courts of Kathmandu.' },
    { title: '10. Contact', body: 'Questions? Email legal@feri.com.np' }
  ]
  return (
    <div className="min-h-screen pt-16">
      <div className="py-16 bg-ink text-parchment text-center">
        <h1 className="font-display text-display-md font-semibold">Terms and Conditions</h1>
        <p className="text-parchment/50 mt-2 text-sm">Last updated: June 2025</p>
      </div>
      <div className="container-page max-w-3xl mx-auto py-16 space-y-10">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="font-display text-xl font-semibold text-ink mb-3">{s.title}</h2>
            <p className="text-muted leading-relaxed text-sm">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
