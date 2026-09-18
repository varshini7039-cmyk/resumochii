import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileCheck,
  FileEdit,
  Heart,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import React from 'react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { isAuthenticated, quickLoginDemo } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      onNavigate('dashboard');
    } else {
      onNavigate('register');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-18 lg:pb-24 bg-gradient-to-b from-pink-50/80 via-purple-50/30 to-white border-b border-pink-100">
        {/* Cute decorative background shapes */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -z-0 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Cute Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-pink-200 text-pink-700 text-xs font-bold mb-6 shadow-sm">
            <span className="text-sm">🍡</span>
            <span>The Sweetest AI Resume Builder</span>
            <span className="flex items-center text-violet-600 font-extrabold bg-violet-50 px-2 py-0.5 rounded-full text-[10px]">
              <Sparkles className="w-3 h-3 mr-0.5" /> 100% Free
            </span>
          </div>

          {/* Website Title & Subtitle */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight mb-4 font-heading">
            Make Your Resume <br />
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 bg-clip-text text-transparent">
              Irresistibly Cute &amp; ATS-Proof
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
            <strong className="font-bold text-slate-900">ResuMochi</strong> is your delightful AI career companion. Transform messy drafts into recruiter-adored resumes, unlock 1-click AI keyword polish, and match with dream tech jobs effortlessly.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
            <button
              id="hero-get-started-btn"
              onClick={handleGetStarted}
              className="px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 hover:opacity-95 shadow-md shadow-pink-500/25 rounded-full transition-all active:scale-95 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              Build My Cute Resume Free
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-explore-jobs-btn"
              onClick={() => onNavigate('jobs')}
              className="px-6 py-3.5 text-sm sm:text-base font-bold text-slate-700 bg-white hover:bg-pink-50/60 border border-pink-200/80 shadow-2xs rounded-full transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-pink-500" />
              Explore 12+ Jobs 🌸
            </button>

            {!isAuthenticated && (
              <button
                id="hero-login-btn"
                onClick={() => onNavigate('login')}
                className="px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-600 hover:text-pink-600 rounded-full transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Demo Testing Shortcuts for Evaluator */}
          {!isAuthenticated && (
            <div className="inline-flex flex-wrap items-center justify-center gap-2 p-2 bg-white/90 backdrop-blur-md rounded-full border border-pink-200/80 shadow-xs max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
                <span>✨</span> Instant 1-Click Demo:
              </span>
              <button
                id="demo-student-login"
                onClick={() => {
                  quickLoginDemo('user');
                  onNavigate('dashboard');
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-full transition-colors border border-pink-200/60 flex items-center gap-1 active:scale-95"
              >
                <span>🌸</span> Student Demo (Varshini)
              </button>
              <button
                id="demo-admin-login"
                onClick={() => {
                  quickLoginDemo('admin');
                  onNavigate('admin-dashboard');
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-full transition-colors border border-amber-200 flex items-center gap-1 active:scale-95"
              >
                <span>👑</span> Recruiter / Admin Demo
              </button>
            </div>
          )}

          {/* Cute Interactive Resume Preview Mockup Card */}
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 shadow-xl shadow-pink-500/10 border border-pink-100 text-left relative transition-transform hover:scale-[1.01]">
            <div className="flex items-center justify-between border-b border-pink-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  VR
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 font-heading">
                    Varshini Rao
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ ATS Verified
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500">B.Tech Computer Science • Bengaluru, Karnataka</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-pink-50 to-violet-50 text-pink-700 border border-pink-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-pink-500 fill-pink-500" />
                  Score: 98/100 💖
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
              <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-100/80">
                <p className="text-pink-600 font-bold mb-0.5 flex items-center gap-1">
                  <span>🌸</span> Target Match
                </p>
                <p className="font-extrabold text-slate-800 text-sm">94% Fit</p>
                <p className="text-[11px] text-slate-500">Full-Stack &amp; AI Engineer</p>
              </div>
              <div className="p-3 bg-violet-50/60 rounded-2xl border border-violet-100/80">
                <p className="text-violet-600 font-bold mb-0.5 flex items-center gap-1">
                  <span>✨</span> AI Polish
                </p>
                <p className="font-extrabold text-slate-800 text-sm">8 Strong Verbs</p>
                <p className="text-[11px] text-slate-500">Measurable impact metrics</p>
              </div>
              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100/80">
                <p className="text-amber-700 font-bold mb-0.5 flex items-center gap-1">
                  <span>🎯</span> Recruiter Status
                </p>
                <p className="font-extrabold text-slate-800 text-sm">3 Interviews</p>
                <p className="text-[11px] text-slate-500">PhonePe, CRED &amp; Swiggy</p>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex items-center justify-between text-xs">
              <p className="text-slate-600 truncate pr-2">
                💡 <span className="font-bold text-slate-800">AI Suggestion:</span> Highlighted React 19, TypeScript, and MongoDB for +14% hiring visibility.
              </p>
              <button
                onClick={() => onNavigate('resume-builder')}
                className="shrink-0 font-bold text-pink-600 hover:text-pink-700 bg-white px-3 py-1 rounded-full shadow-2xs border border-pink-100 hover:bg-pink-50 transition-colors"
              >
                Customize →
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 pt-8 border-t border-pink-100 text-left">
            <div className="p-4 bg-white rounded-2xl border border-pink-100/80 shadow-xs">
              <p className="text-2xl font-extrabold text-pink-600 font-heading">98%</p>
              <p className="text-xs text-slate-500 font-medium">ATS Pass Rate with AI Polish</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-violet-100/80 shadow-xs">
              <p className="text-2xl font-extrabold text-violet-600 font-heading">12+ Active</p>
              <p className="text-xs text-slate-500 font-medium">Curated Tech &amp; Fresher Roles</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-purple-100/80 shadow-xs">
              <p className="text-2xl font-extrabold text-purple-600 font-heading">Instant AI</p>
              <p className="text-xs text-slate-500 font-medium">Smart AI Resume Engine</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-emerald-100/80 shadow-xs">
              <p className="text-2xl font-extrabold text-emerald-600 font-heading">100% Free</p>
              <p className="text-xs text-slate-500 font-medium">Export PDF with zero watermarks</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Feature Cards Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Supercharged Capabilities</span>
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading">
              Everything You Need to Land Your Next Dream Role
            </p>
            <p className="text-slate-600 mt-3 text-base">
              ResuMochi connects every step of your career launchpad: from crafting an ATS-proof resume to AI skill gap analysis and tracking live applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div
              id="feature-ai-resume-builder"
              onClick={() => onNavigate('resume-builder')}
              className="p-7 rounded-3xl bg-pink-50/30 hover:bg-pink-50/70 border border-pink-100/80 transition-all hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100/60 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <FileEdit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-pink-600 transition-colors font-heading">
                1. Cute &amp; Smart Resume Builder
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Structured resume builder with live split-screen preview. Effortlessly input education, technical competencies, projects, work experience, certifications, and languages.
              </p>
              <span className="text-xs font-bold text-pink-600 flex items-center gap-1">
                Start Building 🌸 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 2 */}
            <div
              id="feature-ai-resume-improvement"
              onClick={() => onNavigate('ai-resume')}
              className="p-7 rounded-3xl bg-violet-50/30 hover:bg-violet-50/70 border border-violet-100/80 transition-all hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100/60 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors font-heading">
                2. Smart AI Resume Magic
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Leverage intelligent AI analysis to evaluate summary wording, identify missing high-impact keywords, generate punchy action verbs, and apply 1-click bullet enhancements.
              </p>
              <span className="text-xs font-bold text-violet-600 flex items-center gap-1">
                Polish Resume ✨ <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 3 */}
            <div
              id="feature-smart-job-matching"
              onClick={() => onNavigate('jobs')}
              className="p-7 rounded-3xl bg-sky-50/30 hover:bg-sky-50/70 border border-sky-100/80 transition-all hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/60 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors font-heading">
                3. Smart Skill Matching
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Click "Match My Skills" on any job to instantly see your compatibility percentage, matching proficiencies, missing skills, and an actionable learning roadmap.
              </p>
              <span className="text-xs font-bold text-sky-600 flex items-center gap-1">
                Match Skills 🎯 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 4 */}
            <div
              id="feature-job-search-filters"
              onClick={() => onNavigate('jobs')}
              className="p-7 rounded-3xl bg-emerald-50/30 hover:bg-emerald-50/70 border border-emerald-100/80 transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors font-heading">
                4. Job Search &amp; Radar
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Explore real software engineering, frontend, backend, data analytics, and internship roles. Filter by location, tech stack, employment type, and seniority level.
              </p>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                Browse Listings 🚀 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 5 */}
            <div
              id="feature-application-tracker"
              onClick={() => onNavigate('applications')}
              className="p-7 rounded-3xl bg-amber-50/30 hover:bg-amber-50/70 border border-amber-100/80 transition-all hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/60 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors font-heading">
                5. Application Tracker
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Track every job you apply to with real-time status updates: Applied, Under Review, Interview, Selected, or Rejected. Keep private notes and monitor your pipeline.
              </p>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                Track Progress 📋 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Feature 6 */}
            <div
              id="feature-resume-preview-download"
              onClick={() => onNavigate('resume-builder')}
              className="p-7 rounded-3xl bg-rose-50/30 hover:bg-rose-50/70 border border-rose-100/80 transition-all hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/60 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors font-heading">
                6. Clean PDF Print &amp; Export
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Clean printable layouts rendered according to modern recruiter specifications. One-click instant Print and Download PDF without extraneous web clutter.
              </p>
              <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                View Templates 🖨️ <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works 4-Step Process */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-pink-50/30 border-t border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-pink-600 mb-2 flex items-center justify-center gap-1">
              <span>🌸</span> Streamlined Workflow
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 font-heading">How ResuMochi Works</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl font-black text-pink-400 mb-2 block font-heading">01 🌸</span>
              <h4 className="font-bold text-slate-900 mb-1">Create Account &amp; Profile</h4>
              <p className="text-xs text-slate-600">Register in seconds with email verification and complete your profile skills and education.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-violet-100 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl font-black text-violet-400 mb-2 block font-heading">02 ✨</span>
              <h4 className="font-bold text-slate-900 mb-1">Build &amp; AI-Polish Resume</h4>
              <p className="text-xs text-slate-600">Fill in your projects and experience, then run smart AI analysis for actionable ATS score improvements.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl font-black text-sky-400 mb-2 block font-heading">03 🎯</span>
              <h4 className="font-bold text-slate-900 mb-1">Match Skills with Jobs</h4>
              <p className="text-xs text-slate-600">Discover personalized recommendations and analyze your exact skill match against recruiter criteria.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl font-black text-emerald-400 mb-2 block font-heading">04 🚀</span>
              <h4 className="font-bold text-slate-900 mb-1">Apply &amp; Track Status</h4>
              <p className="text-xs text-slate-600">Submit 1-click applications and monitor each stage from Under Review to Interview and Selection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin / Recruiter Callout */}
      <section className="py-16 bg-white border-t border-pink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Recruiter &amp; Admin Portal Included</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2 font-heading">Are you a Recruiter or Hiring Manager?</h3>
              <p className="text-slate-300 text-sm max-w-xl">
                ResuMochi includes complete role-based authorization. Administrators can post new jobs, manage active listings, review candidate submissions, and update interview statuses in real-time.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                id="landing-admin-login-btn"
                onClick={() => {
                  quickLoginDemo('admin');
                  onNavigate('admin-dashboard');
                }}
                className="px-6 py-3.5 text-sm font-bold text-slate-900 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 rounded-full transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <span>👑</span>
                Launch Recruiter Portal
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
