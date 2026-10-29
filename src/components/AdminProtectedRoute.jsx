import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07111E] flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest text-gray-400">Verifying Session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}

