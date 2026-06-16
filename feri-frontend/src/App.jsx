import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore, useCartStore, useWishlistStore } from './store'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import SellerProfilePage from './pages/SellerProfilePage'
import CartPage from './pages/buyer/CartPage'
import CheckoutPage from './pages/buyer/CheckoutPage'
import OrderSuccessPage from './pages/buyer/OrderSuccessPage'
import OrderHistoryPage from './pages/buyer/OrderHistoryPage'
import OrderDetailPage from './pages/buyer/OrderDetailPage'
import WishlistPage from './pages/buyer/WishlistPage'
import SellerOnboardPage from './pages/seller/SellerOnboardPage'
import SellerDashboardPage from './pages/seller/SellerDashboardPage'
import AddProductPage from './pages/seller/AddProductPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, user } = useAuthStore()
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { isLoggedIn } = useAuthStore()
  const { fetchCart } = useCartStore()
  const { fetchWishlist } = useWishlistStore()

  useEffect(() => {
    if (isLoggedIn()) {
      fetchCart()
      fetchWishlist()
    }
  }, [])

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/sellers/:id" element={<SellerProfilePage />} />

          {/* Buyer */}
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/payment/success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

          {/* Seller */}
          <Route path="/sell/onboard" element={<ProtectedRoute><SellerOnboardPage /></ProtectedRoute>} />
          <Route path="/seller/dashboard" element={<ProtectedRoute role="SELLER"><SellerDashboardPage /></ProtectedRoute>} />
          <Route path="/seller/products/new" element={<ProtectedRoute role="SELLER"><AddProductPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboardPage /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
