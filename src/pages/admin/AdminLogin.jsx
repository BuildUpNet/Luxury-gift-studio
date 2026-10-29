import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const CURRENT_YEAR = new Date().getFullYear();

export default function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect straight to admin dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please provide your username or email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(identifier, password);
      if (result.success) {
        const destination = location.state?.from?.pathname || '/admin';
        navigate(destination, { replace: true });
      } else {
        setError(result.error || 'Invalid credentials. Please verify your login details.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07111E] flex flex-col justify-between items-center px-4 py-8 sm:py-12 select-none">
      {/* Top Bar Link */}
      <div className="w-full max-w-md flex justify-between items-center text-xs text-gray-400">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition no-underline group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
          <span>Return to Store</span>
        </Link>
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Protected Area</span>
        </span>
      </div>

      {/* Main Centered Minimalist Card */}
      <div className="w-full max-w-md my-auto">
        <div className="bg-[#0B1424] border border-white/10 rounded-2xl p-7 sm:p-9 shadow-2xl backdrop-blur-md">
          {/* Brand Header */}
          <div className="text-center mb-7">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-white m-0">
              THE GIFT STUDIO
            </h1>
            <div className="mt-2.5">
              <span className="inline-block text-[10px] tracking-[0.25em] font-semibold text-amber-400 uppercase bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                ADMIN PORTAL
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              Enter your credentials to access the studio management console.
            </p>
          </div>

          {/* Inline Subtle Error State */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-identifier"
                className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5"
              >
                Username or Email
              </label>
              <input
                id="admin-identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter username or email"
                className="w-full bg-[#07111E] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/80 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full bg-[#07111E] border border-white/10 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/80 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1 bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Dark Navy Styled Primary Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#07111E] hover:bg-[#0c182b] text-white border border-white/20 hover:border-amber-400/40 text-sm font-semibold tracking-wide py-3 rounded-lg transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Subtle Copyright */}
      <div className="text-center text-[11px] text-gray-500 py-2">
        <span>© {CURRENT_YEAR} The Gift Studio. Secure Management Portal.</span>
      </div>
    </div>
  );
}
