export const formatNPR = (amount) =>
  `रू ${Number(amount).toLocaleString('ne-NP')}`

export const formatNPRLatin = (amount) =>
  `NPR ${Number(amount).toLocaleString('en-IN')}`

export const savings = (original, selling) =>
  Math.round(((original - selling) / original) * 100)

export const conditionLabel = {
  LIKE_NEW: 'Like New',
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
}

export const conditionColor = {
  LIKE_NEW:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  EXCELLENT: 'bg-blue-50 text-blue-700 border border-blue-200',
  GOOD:      'bg-amber-50 text-amber-700 border border-amber-200',
  FAIR:      'bg-gray-100 text-gray-600 border border-gray-200',
}

export const trustBadgeConfig = {
  TRUSTED_SELLER: { label: 'Trusted Seller', color: 'bg-blue-50 text-blue-700',  icon: '✓' },
  TOP_SELLER:     { label: 'Top Seller',     color: 'bg-gold/10 text-gold-muted', icon: '★' },
  ELITE_SELLER:   { label: 'Elite Seller',   color: 'bg-ink text-parchment',      icon: '◈' },
}

export const orderStatusSteps = [
  { key: 'PLACED',           label: 'Order Placed',      icon: '📦' },
  { key: 'PACKED',           label: 'Packed',            icon: '🎁' },
  { key: 'SHIPPED',          label: 'Shipped',           icon: '🚚' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery',  icon: '🛵' },
  { key: 'DELIVERED',        label: 'Delivered',         icon: '✅' },
]

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d < 30) return `${d} days ago`
  if (d < 365) return `${Math.floor(d/30)} months ago`
  return `${Math.floor(d/365)} years ago`
}
