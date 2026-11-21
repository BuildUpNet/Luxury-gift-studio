import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import CategoryCollectionPage from './pages/CategoryCollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import TestimonialsPage from './pages/TestimonialsPage';
import OccasionPage from './pages/OccasionPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { ProductProvider } from './context/ProductContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

export default function App() {
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
        <ErrorBoundary>
          <Router>
            <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#15241B' }}>
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

              <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/category" element={<CategoryCollectionPage />} />
                <Route path="/category/:slug" element={<CategoryCollectionPage />} />

                <Route path="/occasion" element={<OccasionPage />} />
                <Route path="/occasion/:slug" element={<OccasionPage />} />

                <Route path="/product/:slug" element={<ProductDetailPage />} />

                <Route path="/contact" element={<ContactPage />} />

                <Route path="/testimonials" element={<TestimonialsPage />} />

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
                <Route
                  path="/admin/:tab"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />

                <Route path="*" element={<HomePage />} />
              </Routes>
            </div>
          </Router>
        </ErrorBoundary>
      </ProductProvider>
    </AdminAuthProvider>
  );
}
