import {
  Briefcase,
  CheckCircle,
  ChevronDown,
  FileText,
  Heart,
  LogOut,
  Menu,
  Shield,
  Sparkles,
  User as UserIcon,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, isAuthenticated, isAdmin, logout, quickLoginDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => handleNav(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <span className="text-lg">🍡</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 font-heading">
                ResuMochi
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-50 to-violet-50 text-pink-700 border border-pink-200/80 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-pink-500 fill-pink-500" />
                  AI
                </span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Cute AI Resumes &amp; Dream Jobs</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {!isAuthenticated ? (
              <>
                <button
                  id="nav-home"
                  onClick={() => handleNav('landing')}
                  className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all ${
                    currentPage === 'landing'
                      ? 'text-white bg-gradient-to-r from-violet-600 to-pink-500 shadow-xs'
                      : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/60'
                  }`}
                >
                  Home
                </button>
                <button
                  id="nav-jobs-public"
                  onClick={() => handleNav('jobs')}
                  className={`px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all ${
                    currentPage === 'jobs'
                      ? 'text-white bg-gradient-to-r from-violet-600 to-pink-500 shadow-xs'
                      : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/60'
                  }`}
                >
                  Explore Jobs
                </button>
              </>
            ) : (
              <>
                <button
                  id="nav-dashboard"
                  onClick={() => handleNav('dashboard')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all ${
                    currentPage === 'dashboard'
                      ? 'text-white bg-gradient-to-r from-violet-600 to-pink-500 shadow-xs'
                      : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/60'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  id="nav-resume-builder"
                  onClick={() => handleNav('resume-builder')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all ${
                    currentPage === 'resume-builder'
                      ? 'text-white bg-gradient-to-r from-violet-600 to-pink-500 shadow-xs'
                      : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/60'
                  }`}
                >
                  Resume Builder
                </button>
                <button
                  id="nav-ai-resume"
                  onClick={() => handleNav('ai-resume')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all flex items-center gap-1 ${
                    currentPage === 'ai-resume'
                      ? 'text-white bg-gradient-to-r from-violet-600 to-pink-500 shadow-xs'
                      : 'text-pink-700 bg-pink-50/70 hover:bg-pink-100/70 border border-pink-200/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Polish
                </button>
                <button
                  id="nav-jobs"
                  onClick={() => handleNav('jobs')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all ${
                    currentPage === 'jobs'
                      ? 'text-white bg-gradient-to-r from-violet-600 to-pink-500 shadow-xs'
                      : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/60'
                  }`}
                >
                  Jobs
                </button>
                <button
                  id="nav-recommended"
                  onClick={() => handleNav('recommendations')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all ${
                    currentPage === 'recommendations'
                      ? 'text-white bg-gradient-to-r from-violet-600 to-pink-500 shadow-xs'
                      : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/60'
                  }`}
                >
                  Recommended
                </button>
                <button
                  id="nav-applications"
                  onClick={() => handleNav('applications')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all ${
                    currentPage === 'applications'
                      ? 'text-white bg-gradient-to-r from-violet-600 to-pink-500 shadow-xs'
                      : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/60'
                  }`}
                >
                  Applications
                </button>
                {isAdmin && (
                  <button
                    id="nav-admin-dash"
                    onClick={() => handleNav('admin-dashboard')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                      currentPage.startsWith('admin')
                        ? 'text-amber-800 bg-amber-100 border border-amber-300 font-bold'
                        : 'text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* One-click demo buttons with cute icons */}
                <div className="hidden lg:flex items-center gap-1.5 mr-1 border-r border-slate-200 pr-3">
                  <button
                    id="quick-demo-user"
                    onClick={() => quickLoginDemo('user')}
                    className="px-2.5 py-1 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-full border border-pink-200/70 transition-all flex items-center gap-1 active:scale-95"
                    title="Sign in with Varshini (Demo Student)"
                  >
                    <span>🌸</span>
                    Student Demo
                  </button>
                  <button
                    id="quick-demo-admin"
                    onClick={() => quickLoginDemo('admin')}
                    className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-full border border-amber-200 transition-all flex items-center gap-1 active:scale-95"
                    title="Sign in as Mochi Recruiter"
                  >
                    <span>👑</span>
                    Recruiter Demo
                  </button>
                </div>

                <button
                  id="btn-nav-login"
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-pink-600 hover:bg-pink-50/50 rounded-full transition-colors"
                >
                  Login
                </button>
                <button
                  id="btn-nav-register"
                  onClick={() => handleNav('register')}
                  className="px-4 py-1.5 text-sm font-bold text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 hover:opacity-95 shadow-sm shadow-pink-500/20 rounded-full transition-all active:scale-95 flex items-center gap-1"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  Get Started
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  id="user-profile-menu-button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-pink-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user?.name}</p>
                    <p className="text-[10px] font-medium text-pink-600 capitalize flex items-center gap-0.5">
                      {isAdmin ? '👑 Admin' : '✨ Student'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-pink-100 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-pink-100 text-pink-700'}`}>
                        {isAdmin ? '👑 Administrator' : '🌸 Candidate'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-pink-50/60 hover:text-pink-600 flex items-center gap-2 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      My Profile
                    </button>
                    <button
                      onClick={() => handleNav('resume-builder')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-pink-50/60 hover:text-pink-600 flex items-center gap-2 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Resume Builder
                    </button>
                    <button
                      onClick={() => handleNav('applications')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-pink-50/60 hover:text-pink-600 flex items-center gap-2 transition-colors"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      My Applications
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleNav('admin-dashboard')}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-amber-800 hover:bg-amber-50 flex items-center gap-2 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-600" />
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => handleNav('settings')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-pink-50/60 hover:text-pink-600 flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                      System &amp; Settings
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        onNavigate('landing');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-pink-50 md:hidden transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-pink-100 bg-white px-4 pt-3 pb-6 space-y-2">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('landing')}
                className="block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-pink-50"
              >
                Home
              </button>
              <button
                onClick={() => handleNav('jobs')}
                className="block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-pink-50"
              >
                Explore Jobs
              </button>
              <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
                <button
                  onClick={() => quickLoginDemo('user')}
                  className="w-full py-2.5 text-center text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors"
                >
                  🌸 Login as Demo Student
                </button>
                <button
                  onClick={() => quickLoginDemo('admin')}
                  className="w-full py-2.5 text-center text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
                >
                  👑 Login as Demo Admin
                </button>
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="w-full py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-violet-600 rounded-xl shadow-xs"
                >
                  Create Account ✨
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                className="block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-pink-50"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNav('profile')}
                className="block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-pink-50"
              >
                My Profile
              </button>
              <button
                onClick={() => handleNav('resume-builder')}
                className="block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-pink-50"
              >
                Resume Builder
              </button>
              <button
                onClick={() => handleNav('ai-resume')}
                className="block w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-pink-700 bg-pink-50"
              >
                ✨ AI Resume Polish
              </button>
              <button
                onClick={() => handleNav('jobs')}
                className="block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-pink-50"
              >
                Job Listings
              </button>
              <button
                onClick={() => handleNav('recommendations')}
                className="block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-pink-50"
              >
                Recommended Jobs
              </button>
              <button
                onClick={() => handleNav('applications')}
                className="block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-pink-50"
              >
                Application Tracker
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleNav('admin-dashboard')}
                  className="block w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-amber-800 bg-amber-50"
                >
                  👑 Admin Management
                </button>
              )}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    handleNav('landing');
                  }}
                  className="block w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50"
                >
                  Sign Out ({user?.name})
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
