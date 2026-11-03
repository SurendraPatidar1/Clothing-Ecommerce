import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';

const Home = lazy(() => import('@/pages/Home'));
const Shop = lazy(() => import('@/pages/Shop'));
const ProductDetails = lazy(() => import('@/pages/ProductDetails'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const OrderHistory = lazy(() => import('@/pages/OrderHistory'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AdminCategories = lazy(() => import('@/pages/admin/Categories'));
const AdminOrders = lazy(() => import('@/pages/admin/Orders'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return user.role === 'ROLE_ADMIN' ? children : <Navigate to="/" replace />;
}

const Loader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-accent" />
  </div>
);

const wrap = (el) => <PageTransition>{el}</PageTransition>;

export default function AppRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname.startsWith('/admin') ? '/admin' : location.pathname}>
          <Route path="/" element={wrap(<Home />)} />
          <Route path="/shop" element={wrap(<Shop />)} />
          <Route path="/product/:id" element={wrap(<ProductDetails />)} />
          <Route path="/cart" element={wrap(<Cart />)} />
          <Route path="/checkout" element={<ProtectedRoute>{wrap(<Checkout />)}</ProtectedRoute>} />
          <Route path="/login" element={wrap(<Login />)} />
          <Route path="/signup" element={wrap(<Signup />)} />
          <Route path="/orders" element={<ProtectedRoute>{wrap(<OrderHistory />)}</ProtectedRoute>} />
          <Route path="/contact" element={wrap(<Contact />)} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          <Route path="*" element={wrap(<NotFound />)} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
