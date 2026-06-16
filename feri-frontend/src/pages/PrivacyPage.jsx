export default function PrivacyPage() {
  const sections = [
    { title: '1. Information We Collect', body: 'When you register on FERI, we collect your name, email address, and phone number. When you make a purchase, we collect your shipping address. When you list a product, we collect product details, photos, and videos you upload.' },
    { title: '2. How We Use Your Information', body: 'We use your information to operate the FERI marketplace — processing orders, facilitating payments, enabling buyer-seller communication, and sending order notifications. We do not sell your personal information to third parties.' },
    { title: '3. Information Shared with Other Users', body: 'When you make a purchase, your name and delivery address are shared with the seller for shipping purposes. Your seller profile is publicly visible when you list products. Your email address is never shared with other users.' },
    { title: '4. Payment Information', body: 'FERI processes payments through eSewa. We do not store your eSewa credentials or payment card details. All transactions are encrypted and handled by eSewa.' },
    { title: '5. Photos and Media', body: 'Product photos and videos are stored on Cloudinary. By uploading media, you grant us a non-exclusive license to display it on our platform. You retain full ownership of your content.' },
    { title: '6. Cookies', body: 'FERI uses cookies and local storage to keep you logged in and remember your preferences. We do not use advertising cookies.' },
    { title: '7. Data Security', body: 'We protect your data using HTTPS encryption, hashed passwords, and secure database access controls.' },
    { title: '8. Your Rights', body: 'You have the right to access, correct, or delete your personal information. To request account deletion, contact privacy@feri.com.np.' },
    { title: '9. Contact', body: 'For privacy questions, contact privacy@feri.com.np or write to FERI Marketplace, Kathmandu, Nepal.' }
  ]
  return (
    <div className="min-h-screen pt-16">
      <div className="py-16 bg-ink text-parchment text-center">
        <h1 className="font-display text-display-md font-semibold">Privacy Policy</h1>
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
