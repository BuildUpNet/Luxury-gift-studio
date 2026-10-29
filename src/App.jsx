import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DiwaliHampersPage from './pages/collections/diwali-hampers';
import HomeDecorPage from './pages/collections/tgs-home';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ProductModal from './components/ProductModal';
import { ProductProvider } from './context/ProductContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

export default function App() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  return (
    <AdminAuthProvider>
      <ProductProvider>
        <Router>
          <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
            {/* Global Toast */}
            {toastMessage && (
              <div
                style={{
                  position: 'fixed',
                  bottom: '24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#020919',
                  color: '#ffffff',
                  padding: '10px 22px',
                  borderRadius: '4px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  zIndex: 200,
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                {toastMessage}
              </div>
            )}

            {/* Application Routes */}
            <Routes>
              {/* 1. Dedicated Home Page Route */}
              <Route
                path="/"
                element={
                  <HomePage
                    onQuickView={(product) => setQuickViewProduct(product)}
                  />
                }
              />

              {/* 2. Dedicated Diwali Gift Hampers Collection Page */}
              <Route
                path="/collections/diwali-hampers"
                element={
                  <DiwaliHampersPage
                    onQuickView={(product) => setQuickViewProduct(product)}
                  />
                }
              />

              {/* 3. Dedicated Home Decor Collection Page */}
              <Route
                path="/collections/tgs-home"
                element={
                  <HomeDecorPage
                    onQuickView={(product) => setQuickViewProduct(product)}
                  />
                }
              />

              {/* 4. Admin Authentication & Dashboard Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route
                path="*"
                element={
                  <HomePage
                    onQuickView={(product) => setQuickViewProduct(product)}
                  />
                }
              />
            </Routes>

            {/* Shared Modals */}
            {quickViewProduct && (
              <ProductModal
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
              />
            )}
          </div>
        </Router>
      </ProductProvider>
    </AdminAuthProvider>
  );
}
