import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '../../store'
import { ProductCard, PageHeader, EmptyState } from '../../components/ui'

export default function WishlistPage() {
  const { items } = useWishlistStore()

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Saved Items"
        subtitle={`${items.length} item${items.length !== 1 ? 's' : ''} in your wishlist`}
      />
      <div className="container-page py-10">
        {items.length === 0 ? (
          <EmptyState
            icon={<Heart size={48} className="text-border" />}
            title="Your wishlist is empty"
            subtitle="Save items you love by tapping the heart icon on any listing."
            action={<Link to="/products" className="btn-primary">Discover Items</Link>}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {items.map(item => item.product && (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
