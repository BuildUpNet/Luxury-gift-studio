import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, ArrowLeft, ShieldCheck } from '../../components/FaIcons';
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

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      setError('Please provide your username or email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(cleanIdentifier, cleanPassword);
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
    <div className="min-h-screen w-full flex flex-col justify-between items-center px-4 py-8 sm:py-12 select-none" style={{ backgroundColor: '#15241B' }}>
      <div className="w-full max-w-md flex justify-between items-center text-xs text-stone-400">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-stone-400 hover:text-[#D4AF37] transition no-underline group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
          <span>Return to Store</span>
        </Link>
        <span className="flex items-center gap-1 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Protected Area</span>
        </span>
      </div>

      <div className="w-full max-w-md my-auto">
        <div className="border border-[#2D4737] rounded-2xl p-7 sm:p-9 shadow-2xl backdrop-blur-md" style={{ backgroundColor: '#182C20' }}>
          <div className="text-center mb-7">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-white m-0">
              THE GIFT STUDIO
            </h1>
            <div className="mt-2.5">
              <span className="inline-block text-[10px] tracking-[0.25em] font-semibold text-[#D4AF37] uppercase bg-[#223B2D] border border-[#2D4737] px-3 py-1 rounded-full shadow-2xs">
                ADMIN PORTAL
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-3 leading-relaxed">
              Enter your credentials to access the studio management console.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-identifier"
                className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-1.5"
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
                className="w-full bg-[#15241B] border border-[#2D4737] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-medium text-stone-300 uppercase tracking-wider"
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
                  className="w-full bg-[#15241B] border border-[#2D4737] rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1 bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4AF37] hover:bg-[#bfa035] text-stone-900 font-bold text-sm tracking-wide py-3 rounded-lg transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99] border-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-stone-900" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="text-center text-[11px] text-stone-500 py-2">
        <span>© {CURRENT_YEAR} The Gift Studio. Secure Management Portal.</span>
      </div>
    </div>
  );
}
