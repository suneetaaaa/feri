import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import api from '../utils/api'
import { ProductCard, LoadingSpinner, EmptyState, PageHeader } from '../components/ui'

const CONDITIONS = ['LIKE_NEW','EXCELLENT','GOOD','FAIR']
const CONDITION_LABELS = { LIKE_NEW:'Like New', EXCELLENT:'Excellent', GOOD:'Good', FAIR:'Fair' }
const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'sellingPrice:asc', label: 'Price: Low to High' },
  { value: 'sellingPrice:desc', label: 'Price: High to Low' },
  { value: 'viewCount:desc', label: 'Most Viewed' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const condition = searchParams.get('condition') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sort = searchParams.get('sort') || 'createdAt:desc'
  const page = parseInt(searchParams.get('page') || '1')
  const featured = searchParams.get('featured') || ''

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const [sortField, sortOrder] = sort.split(':')
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    if (condition) params.set('condition', condition)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (featured) params.set('featured', featured)
    params.set('sort', sortField)
    params.set('order', sortOrder)
    params.set('page', page)
    params.set('limit', '20')

    api.get(`/products?${params.toString()}`)
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages) })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [searchParams])

  const activeFilters = [category, condition, minPrice, maxPrice].filter(Boolean).length

  return (
    <div className="min-h-screen">
      <PageHeader
        title={category === 'clothes' ? 'Clothes' : category === 'novels' ? 'Novels' : featured ? 'Featured Picks' : 'Browse All'}
        subtitle={`${total.toLocaleString()} item${total !== 1 ? 's' : ''} available`}
      />

      <div className="container-page py-8">
        {/* Search + Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search clothes, books, brands..."
              defaultValue={q}
              onKeyDown={e => e.key === 'Enter' && setParam('q', e.target.value)}
              onChange={e => !e.target.value && setParam('q', '')}
              className="input-field pl-11"
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-colors ${showFilters || activeFilters ? 'bg-ink text-parchment border-ink' : 'bg-white border-border text-ink hover:border-ink'}`}
          >
            <SlidersHorizontal size={15} />
            Filters {activeFilters > 0 && `(${activeFilters})`}
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={e => setParam('sort', e.target.value)}
              className="input-field appearance-none pr-8 text-sm"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-border rounded-2xl p-6 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <p className="section-label mb-3">Category</p>
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => setParam('category', '')}
                    className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${!category ? 'bg-ink text-parchment' : 'hover:bg-parchment text-ink'}`}>
                    All
                  </button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setParam('category', c.slug)}
                      className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${category === c.slug ? 'bg-ink text-parchment' : 'hover:bg-parchment text-ink'}`}>
                      {c.name} <span className="text-muted ml-1">({c._count.products})</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Condition */}
              <div>
                <p className="section-label mb-3">Condition</p>
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => setParam('condition', '')}
                    className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${!condition ? 'bg-ink text-parchment' : 'hover:bg-parchment text-ink'}`}>
                    Any
                  </button>
                  {CONDITIONS.map(c => (
                    <button key={c} onClick={() => setParam('condition', c)}
                      className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${condition === c ? 'bg-ink text-parchment' : 'hover:bg-parchment text-ink'}`}>
                      {CONDITION_LABELS[c]}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <p className="section-label mb-3">Price (NPR)</p>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={minPrice}
                    onChange={e => setParam('minPrice', e.target.value)}
                    className="input-field text-sm" />
                  <input type="number" placeholder="Max" value={maxPrice}
                    onChange={e => setParam('maxPrice', e.target.value)}
                    className="input-field text-sm" />
                </div>
              </div>
              {/* Clear */}
              <div className="flex items-end">
                {activeFilters > 0 && (
                  <button onClick={() => setSearchParams({})}
                    className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700">
                    <X size={14} /> Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {category && <FilterChip label={`Category: ${category}`} onRemove={() => setParam('category', '')} />}
            {condition && <FilterChip label={`Condition: ${CONDITION_LABELS[condition]}`} onRemove={() => setParam('condition', '')} />}
            {(minPrice || maxPrice) && <FilterChip label={`Price: ${minPrice||'0'}–${maxPrice||'∞'} NPR`} onRemove={() => { setParam('minPrice',''); setParam('maxPrice','') }} />}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner message="Finding products..." />
        ) : products.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No products found"
            subtitle="Try adjusting your filters or search term"
            action={<button onClick={() => setSearchParams({})} className="btn-primary">Clear filters</button>}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setParam('page', p)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${page === p ? 'bg-ink text-parchment' : 'hover:bg-white border border-border text-ink'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const FilterChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-ink text-parchment text-xs px-3 py-1.5 rounded-full">
    {label}
    <button onClick={onRemove}><X size={11} /></button>
  </span>
)
