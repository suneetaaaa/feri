import { create } from 'zustand'
import api from '../utils/api'

// ─── Auth Store ───────────────────────────────────────────────────────────────
export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('feri_user') || 'null'),
  token: localStorage.getItem('feri_token') || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('feri_token', data.token)
    localStorage.setItem('feri_user', JSON.stringify(data.user))
    set({ user: data.user, token: data.token, loading: false })
    return data.user
  },

  register: async (payload) => {
    set({ loading: true })
    const { data } = await api.post('/auth/register', payload)
    localStorage.setItem('feri_token', data.token)
    localStorage.setItem('feri_user', JSON.stringify(data.user))
    set({ user: data.user, token: data.token, loading: false })
    return data.user
  },

  logout: () => {
    localStorage.removeItem('feri_token')
    localStorage.removeItem('feri_user')
    set({ user: null, token: null })
  },

  refreshUser: async () => {
    try {
      const { data } = await api.get('/auth/me')
      localStorage.setItem('feri_user', JSON.stringify(data.user))
      set({ user: data.user })
    } catch {}
  },

  isSeller: () => get().user?.role === 'SELLER',
  isAdmin: () => get().user?.role === 'ADMIN',
  isLoggedIn: () => !!get().token,
}))

// ─── Cart Store ───────────────────────────────────────────────────────────────
export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    try {
      const { data } = await api.get('/cart')
      set({ items: data.items })
    } catch {}
  },

  addToCart: async (productId) => {
    await api.post('/cart', { productId })
    get().fetchCart()
  },

  removeFromCart: async (productId) => {
    await api.delete(`/cart/${productId}`)
    set(s => ({ items: s.items.filter(i => i.productId !== productId) }))
  },

  clearCart: () => set({ items: [] }),

  total: () => get().items.reduce((sum, i) => sum + (i.product?.sellingPrice || 0), 0),
  count: () => get().items.length,
}))

// ─── Wishlist Store ───────────────────────────────────────────────────────────
export const useWishlistStore = create((set, get) => ({
  items: [],

  fetchWishlist: async () => {
    try {
      const { data } = await api.get('/wishlist')
      set({ items: data.items })
    } catch {}
  },

  toggle: async (productId) => {
    const exists = get().items.find(i => i.productId === productId)
    if (exists) {
      await api.delete(`/wishlist/${productId}`)
      set(s => ({ items: s.items.filter(i => i.productId !== productId) }))
    } else {
      await api.post('/wishlist', { productId })
      get().fetchWishlist()
    }
  },

  isWishlisted: (productId) => get().items.some(i => i.productId === productId),
}))
