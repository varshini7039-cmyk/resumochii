import { ArrowRight, KeyRound, Lock, Mail, Sparkles, UserCheck } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, quickLoginDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      onNavigate('dashboard');
    }
  };

  const handleFillDemo = (type: 'student' | 'admin') => {
    if (type === 'student') {
      setEmail('user@resumochi.ai');
      setPassword('User@123');
    } else {
      setEmail('admin@resumochi.ai');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-pink-50/50 via-purple-50/20 to-white">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-pink-500/10 border border-pink-100 p-8">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-violet-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-pink-500/20">
            <span className="text-2xl">🍡</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 font-heading">
            Welcome to ResuMochi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sign in to access your cute AI resume &amp; dream job radar
          </p>
        </div>

        {/* Demo Fast-Fill Buttons */}
        <div className="mb-6 p-3.5 bg-pink-50/50 rounded-2xl border border-pink-100/80">
          <p className="text-xs font-bold text-pink-800 mb-2 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-pink-600" />
            Quick 1-Click Demo Logins:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="fill-demo-student"
              onClick={() => handleFillDemo('student')}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-pink-200/80 text-slate-700 hover:bg-pink-100/60 hover:text-pink-700 transition-all text-left shadow-2xs active:scale-95"
            >
              <span className="block font-bold text-slate-900 flex items-center gap-1">
                <span>🌸</span> Student
              </span>
              <span className="text-[10px] text-pink-600 truncate block">user@resumochi.ai</span>
            </button>
            <button
              type="button"
              id="fill-demo-admin"
              onClick={() => handleFillDemo('admin')}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-amber-200 text-amber-900 hover:bg-amber-100/60 transition-all text-left shadow-2xs active:scale-95"
            >
              <span className="block font-bold text-amber-900 flex items-center gap-1">
                <span>👑</span> Recruiter
              </span>
              <span className="text-[10px] text-amber-700 truncate block">admin@resumochi.ai</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@resumochi.ai"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 hover:opacity-95 rounded-2xl shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In ✨</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="font-bold text-pink-600 hover:text-pink-700 hover:underline"
            >
              Create free account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
