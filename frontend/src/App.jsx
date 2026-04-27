import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { fetchCart, clearCartState } from './redux/slices/cartSlice';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components & Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ScrollToTop from './components/ScrollToTop';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';

// Reusable Loader Component (Replaces inline CSS loading text)
const Loader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user && user.isAdmin ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  const location = useLocation();
  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    } else {
      dispatch(clearCartState());
    }
  }, [user, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <ScrollToTop />
      <main className="grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected User Routes */}
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />

            {/* 404 Catch-All Page */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
                <h1 className="text-6xl font-extrabold text-slate-800">404</h1>
                <p className="text-xl text-slate-600 font-medium">Oops! The page you're looking for doesn't exist.</p>
              </div>
            } />
            
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster richColors position="top-center" />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;