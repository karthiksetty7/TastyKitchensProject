import {Routes, Route} from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'

import LoginForm from './pages/LoginForm'
import Home from './pages/Home'
import Cart from './pages/Cart'
import RestaurantDetails from './pages/RestaurantDetails'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import FavoritePage from './pages/FavoritePage'
import OrderHistory from './pages/OrderHistory'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import AddressStep from './pages/Checkout/AddressStep'
import PaymentStep from './pages/Checkout/PaymentStep'
import ReviewStep from './pages/Checkout/ReviewStep'
import SuccessStep from './pages/Checkout/SuccessStep'

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginForm />} />

    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />
    <Route
      path="/orders"
      element={
        <ProtectedRoute>
          <OrderHistory />
        </ProtectedRoute>
      }
    />
    {/* Added Analytics Route */}
    <Route
      path="/analytics"
      element={
        <ProtectedRoute>
          <AnalyticsDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/favorites"
      element={
        <ProtectedRoute>
          <FavoritePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cart"
      element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      }
    />
    <Route
      path="/restaurant/:id"
      element={
        <ProtectedRoute>
          <RestaurantDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />

    {/* Checkout Routes */}
    <Route
      path="/checkout/address"
      element={
        <ProtectedRoute>
          <AddressStep />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkout/payment"
      element={
        <ProtectedRoute>
          <PaymentStep />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkout/review"
      element={
        <ProtectedRoute>
          <ReviewStep />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkout/success"
      element={
        <ProtectedRoute>
          <SuccessStep />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default App
