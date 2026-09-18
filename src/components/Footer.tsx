import { ArrowUpRight, Github, Heart, Mail, Sparkles } from 'lucide-react';
import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-pink-100 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center text-white shadow-sm">
                <span className="text-base">🍡</span>
              </div>
              <span className="text-lg font-extrabold text-slate-900 font-heading">ResuMochi</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Cute AI-powered resume builder and smart job matching platform tailored for ambitious students, fresh graduates, and career dreamers.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <a
                href="https://github.com/resumochi/resumochi-platform"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-colors"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@resumochi.ai"
                className="p-2 rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-colors"
                title="Contact Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Features Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1">
              <span>🌸</span> Platform Features
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button onClick={() => onNavigate('resume-builder')} className="hover:text-pink-600 transition-colors">
                  AI Resume Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-resume')} className="hover:text-pink-600 transition-colors">
                  AI Resume Optimizer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('jobs')} className="hover:text-pink-600 transition-colors">
                  Smart Job Search &amp; Filters
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recommendations')} className="hover:text-pink-600 transition-colors">
                  AI Job Recommendations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('applications')} className="hover:text-pink-600 transition-colors">
                  Application Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1">
              <span>✨</span> Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button onClick={() => onNavigate('settings')} className="hover:text-pink-600 transition-colors flex items-center gap-1">
                  System Architecture &amp; APIs
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-pink-600 transition-colors">
                  Candidate Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-pink-600 transition-colors">
                  My Profile &amp; Skills
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-pink-600 transition-colors">
                  Privacy Policy &amp; Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Technology Stack Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1">
              <span>🍡</span> Tech &amp; AI
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-100">React 19</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">Smart AI Engine</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">Node.js</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">MongoDB</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Express.js</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">Tailwind CSS</span>
            </div>
            <p className="text-xs text-slate-500">
              Crafted with love for students, freshers, and university demonstrations.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-pink-100/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ResuMochi. All rights reserved. Open source academic project.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
            <span>and Smart AI magic for ambitious dreamers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
