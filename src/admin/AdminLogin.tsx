import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: { email: string; role: string; token: string }) => void;
  onBackToSite: () => void;
}

export function AdminLogin({ onLoginSuccess, onBackToSite }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] flex items-center justify-center p-6 relative">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1a1a1d] via-[#0b0b0c] to-[#070708] opacity-80 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-[#141416] border border-[#26262b] p-8 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-[#1a1a1d] border border-[#26262b] text-[#c5a880] mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#f7f6f2] font-normal">
            BESSAM.DECO CMS
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#a39e93]">
            Studio Atelier Administration
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 text-xs text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-[#d6d4ce] flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Studio Account</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b0b0c] border border-[#26262b] px-3.5 py-3 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
              placeholder="write ure email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-[#d6d4ce] flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Security Key</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b0b0c] border border-[#26262b] px-3.5 py-3 pr-10 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c827a] hover:text-[#c5a880] transition-colors p-1 cursor-pointer focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#8c827a]" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Access Atelier Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Back to Public Website */}
        <div className="pt-4 border-t border-[#26262b] text-center text-xs">
          <button
            type="button"
            onClick={onBackToSite}
            className="text-[#a39e93] hover:text-[#c5a880] transition-colors flex items-center justify-center space-x-1.5 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
}
